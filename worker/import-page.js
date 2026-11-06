export const importPage = `<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>导入作品视频</title>
<style>
:root{color-scheme:dark}body{background:#101411;color:#eff4f0;font:16px/1.65 system-ui,sans-serif;margin:0}
main{max-width:44rem;margin:8vh auto;padding:1.5rem}h1{font-size:2rem;line-height:1.25}p{color:#bdc7bf}
input,button{font:inherit;padding:.5rem}button{border:0;border-radius:.35rem;background:#c8f7a8;color:#152416;cursor:pointer}
button:disabled{opacity:.5;cursor:auto}li{padding:.3rem 0}#result{color:#d4ebd8;white-space:pre-wrap}progress{width:100%}
</style>
<main><h1>导入作品视频</h1>
<p>选择已整理好的 MP4 文件。网页将逐部导入并核对完整性，中断后可以重新选择文件继续。</p>
<label for="files">选择视频</label> <input id="files" type="file" multiple accept=".mp4,video/mp4">
<button id="start" type="button" disabled>开始导入</button>
<ol id="films"></ol><progress id="progress" value="0" max="1"></progress><p id="result" aria-live="polite">正在读取清单…</p>
</main><script src="/__verified_import/app.js" defer></script></html>`;

// Runs in the browser. Keep it self-contained so the owner page needs no external scripts.
export const importScript = String.raw`(async function importClient() {
  const root = '/__verified_import';
  const picker = document.querySelector('#files');
  const submit = document.querySelector('#start');
  const result = document.querySelector('#result');
  const progress = document.querySelector('#progress');
  const rows = new Map();
  let films = [], partBytes = 0, ready = false;
  async function query(route, options) {
    const response = await fetch(root + route, { cache: 'no-store', credentials: 'same-origin', ...options });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || ('请求失败（HTTP ' + response.status + '）'));
    return body;
  }
  function setRow(film, text) { rows.get(film.slug).textContent = film.title + ' · ' + text; }
  async function sync() {
    const manifest = await query('/list');
    films = manifest.films;
    partBytes = manifest.partBytes;
    const list = document.querySelector('#films');
    let count = 0;
    for (const film of films) {
      const row = document.createElement('li'); rows.set(film.slug, row); list.append(row);
      setRow(film,'检查中');
    }
    for (const film of films) {
      const state = await query('/' + film.slug);
      setRow(film, state.verified ? '已校验' : '待导入');
      count += Number(state.verified);
    }
    result.textContent = '已校验 ' + count + ' / ' + films.length + ' 部。';
    ready = true; submit.disabled = !picker.files.length;
  }
  async function inspect(file, film) {
    for (let n = 0; n < film.parts.length; n++) {
      const bytes = await file.slice(n * partBytes, (n + 1) * partBytes).arrayBuffer();
      const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2,'0')).join('');
      if (digest !== film.parts[n]) throw new Error('所选文件和原片不一致：' + file.name);
    }
  }
  picker.addEventListener('change', () => { submit.disabled = !picker.files.length || !ready; });
  submit.addEventListener('click', async () => {
    picker.disabled = submit.disabled = true;
    try {
      const selected = [...picker.files];
      const entries = selected.map(file => {
        const film = films.find(item => item.name === file.name && item.size === file.size);
        if (!film) throw new Error('此文件不在本次作品清单中：' + file.name);
        return { file, film };
      });
      let done = 0; progress.max = entries.reduce((n,x) => n+x.film.size, 0); progress.value = 0;
      for (const { file, film } of entries) {
        const url = '/' + film.slug, state = await query(url);
        if (state.verified) { done += film.size; progress.value = done; setRow(film,'已校验'); continue; }
        setRow(film,'正在核对本地文件'); result.textContent = '正在处理「' + film.title + '」。';
        await inspect(file, film);
        for (let n=0; n<film.parts.length; n++) {
          const data = file.slice(n*partBytes,(n+1)*partBytes);
          if (!state.available.includes(n)) {
            const options = { method:'PUT', headers:{'Content-Type':'application/octet-stream'}, body:data };
            await query(url+'/'+n,options);
          }
          done += data.size; progress.value = done;
          setRow(film, '已导入 ' + (n+1) + ' / ' + film.parts.length + ' 块');
        }
        setRow(film,'正在回读核验');
        const checked = await query(url+'/verify',{method:'POST'});
        if (!checked.verified || checked.sha256!==film.sha256 || checked.size!==file.size) throw new Error('完整性校验失败：'+file.name);
        setRow(film,'已校验');
      }
      result.textContent='所选 ' + entries.length + ' 部视频均已校验。';
    } catch (error) { result.textContent = error.message + '。可重新选择文件继续。'; }
    finally { picker.disabled = false; submit.disabled = !picker.files.length; }
  });
  sync().catch(error => { result.textContent=error.message; });
})();`;
