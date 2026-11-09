# Cloudflare Pages 部署

这是作品集的独立 Pages 构建，保留原有 Sites 构建和页面内容。

主要源码目录：`D:\2026AI作品集\sunxiaowei-portfolio`。GitHub Desktop 也应打开这个目录。

公开网站：[sunxiaowei-portfolio.pages.dev](https://sunxiaowei-portfolio.pages.dev/)。

## 构建

需要 Node.js、pnpm，以及 `worker/film-catalog.js` 中七部原片。默认从 `local-media/` 读取，或通过环境变量指定原片目录：

```powershell
Set-Location -LiteralPath 'D:/2026AI作品集/sunxiaowei-portfolio'
$env:PORTFOLIO_FILM_DIRECTORY = 'D:/2026AI作品集/sunxiaowei-portfolio/local-media'
pnpm install --frozen-lockfile
pnpm build:pages
```

构建会逐部验证原片大小及 SHA-256，输出 `dist/pages/`。完整正片按 8 MiB 分块，短片按 1 MiB 分块，全部保持原始字节和画质。`_worker.js` 负责 `/films/*` 和 `/clips/*` 的播放、拖动进度和完整下载，其他资源直接走 Pages 静态托管。所有单个文件都验证不超过 25 MiB。

## 发布

```powershell
pnpm dlx wrangler@4.158.0 login --scopes account:read user:read pages:write
pnpm dlx wrangler@4.158.0 pages deploy dist/pages --project-name sunxiaowei-portfolio --branch main
```

使用 Direct Upload 发布。GitHub 推送不会自动更新这个 Pages 项目，更新时需重新构建并运行发布命令。无需 R2 绑定；视频请求会使用 Pages Functions 配额。访问速度受访客网络影响，需要在实际手机和微信中验证。

日常更新顺序：在本目录修改 → 构建并检查 → 在 GitHub Desktop 提交并 Push origin → 运行上面的 Pages 发布命令。不要从旧部署副本覆盖本目录的源码。

## 校验

```powershell
node --test scripts/film-worker.test.mjs scripts/clip-worker.test.mjs scripts/pages-media.test.mjs
```

发布后检查首页、静态脚本、图片、七部完整正片及四部短片。视频必须返回 `video/mp4`，Range 请求必须返回 `206`，完整下载的 SHA-256 必须与源文件一致。
