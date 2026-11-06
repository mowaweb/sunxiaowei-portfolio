import { importFilms, partBytes } from './import-list.js';
import { mediaKey, verifiedKey } from './media-keys.js';
import { importPage, importScript } from './import-page.js';

const route = '/__verified_import';
const bySlug = new Map(importFilms.map(film => [film.slug, film]));
const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};
const pageCsp = "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'";
const json = (value, status = 200) => Response.json(value, { status, headers: privateHeaders });
const error = (message, status) => json({ error: message }, status);
const hex = bytes => [...new Uint8Array(bytes)].map(v => v.toString(16).padStart(2,'0')).join('');
const expectedLength = (film, index) => Math.min(partBytes, film.size - partBytes * index);

function sameOriginBrowser(request, url) {
  const origin = request.headers.get('Origin');
  const site = request.headers.get('Sec-Fetch-Site');
  return origin === url.origin && (!site || site === 'same-origin');
}
async function readExact(request, required) {
  if (!request.body) return null;
  const size = request.headers.get('Content-Length');
  if (size !== null && size !== String(required)) return null;
  const reader = request.body.getReader(), result = new Uint8Array(required);
  let offset = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (offset + value.byteLength > required) { await reader.cancel(); return null; }
      result.set(value, offset); offset += value.byteLength;
    }
    return offset === required ? result : null;
  } finally { reader.releaseLock(); }
}
async function verified(bucket, film) {
  const item = await bucket.get(verifiedKey(film));
  if (!item) return false;
  const proof = await item.json();
  return proof?.size === film.size && proof?.sha256 === film.sha256;
}
async function status(bucket, film) {
  if (await verified(bucket,film)) return json({ verified:true,size:film.size,sha256:film.sha256,available:[] });
  const available=[];
  for(let i=0;i<film.parts.length;i++) {
    const obj=await bucket.head(mediaKey(film,i));
    if (obj?.size===expectedLength(film,i) && obj.customMetadata?.sha256===film.parts[i]) available.push(i);
  }
  return json({ verified:false, available });
}
async function putPart(request, bucket, film, index) {
  if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/octet-stream') return error('仅接受指定 MP4 的原始片段',415);
  const bytes=await readExact(request,expectedLength(film,index));
  if (!bytes) return error('片段大小与清单不符',400);
  const digest=hex(await crypto.subtle.digest('SHA-256',bytes));
  if(digest!==film.parts[index])return error('片段指纹与原片不符',422);
  const key = mediaKey(film,index), existing=await bucket.head(key);
  // An exactly matching retry has the same observable result, including after a lost response.
  if(existing?.size!==bytes.byteLength || existing.customMetadata?.sha256!==digest) {
    await bucket.put(key,bytes,{sha256:digest,customMetadata:{sha256:digest}});
  }
  return json({ part:index,size:bytes.byteLength,sha256:digest });
}
async function checkComplete(bucket,film) {
  if (await verified(bucket,film)) return json({ verified:true,size:film.size,sha256:film.sha256 });
  const hasher = new crypto.DigestStream('SHA-256');
  const writer = hasher.getWriter();
  let size=0;
  try {
    for(let index=0;index<film.parts.length;index++) {
      const part=await bucket.get(mediaKey(film,index));
      if(!part || part.size!==expectedLength(film,index)) {await writer.close(); return error('缺少完整片段 '+(index+1),409);}
      const bytes=await part.arrayBuffer();
      if(bytes.byteLength!==part.size || hex(await crypto.subtle.digest('SHA-256',bytes))!==film.parts[index]) {
        // Clear the single corrupt object so a retry can restore it. Keys come only from the fixed manifest.
        await bucket.delete(mediaKey(film,index));
        await writer.close();
        return error('存储回读校验失败，请重试片段 '+(index+1),409);
      }
      await writer.write(new Uint8Array(bytes));
      size+=bytes.byteLength;
    }
    await writer.close();
  } finally { writer.releaseLock(); }
  const sha256=hex(await hasher.digest);
  if(size!==film.size || sha256!==film.sha256)return error('整片回读校验失败',409);
  // Serve this edition only when the bytes read back from R2 match the full original.
  const proof={size,sha256};
  await bucket.put(verifiedKey(film),JSON.stringify(proof),{httpMetadata:{contentType:'application/json'}});
  return json({verified:true,...proof});
}
export async function handleMediaImport(request,env) {
  const url=new URL(request.url);
  if (url.pathname!==route && !url.pathname.startsWith(route+'/'))return null;
  if (!request.headers.get('oai-authenticated-user-id'))return error('请使用已有作品集访问权限登录',403);
  if (!env?.BUCKET) return error('作品存储尚未连接',503);
  const mutation=request.method==='PUT' || request.method==='POST';
  if(mutation && !sameOriginBrowser(request,url))return error('仅接受本站页面的写入',403);
  const path=url.pathname.slice(route.length);
  if(request.method==='GET' && (path==='' || path==='/'))return new Response(importPage,{headers:{...privateHeaders,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':pageCsp}});
  if(request.method==='GET' && path==='/app.js')return new Response(importScript,{headers:{...privateHeaders,'Content-Type':'text/javascript; charset=utf-8'}});
  if(request.method==='GET' && path==='/list')return json({partBytes,films:importFilms});
  const match=/^\/([a-z0-9-]+)(?:\/(verify|0|[1-9][0-9]?))?$/.exec(path);
  const film=match && bySlug.get(match[1]);
  if(!film)return error('没有这个导入目标',404);
  const action=match[2];
  if (!action && request.method==='GET')return status(env.BUCKET,film);
  if (action==='verify' && request.method==='POST')return checkComplete(env.BUCKET,film);
  if (request.method==='PUT' && action!==undefined && action!=='verify') {
    const part=Number(action);
    if(part>=film.parts.length)return error('未知片段',404);
    return putPart(request,env.BUCKET,film,part);
  }
  return error('操作不支持',405);
}
