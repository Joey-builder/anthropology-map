# 上线部署指南

本站是纯静态站点（HTML + CSS + JS + 一张分享图），没有后端、没有构建步骤，
任何静态托管都能直接跑。下面按"最省事 → 最灵活"排列。

---

## 方案 A：GitHub Pages（免费，推荐，一条命令）

仓库已初始化，站点在 `main` 分支根目录。

```bash
# 1) 建仓库并推送（如果还没建）
gh repo create <你的账号>/anthropology-map --public --source=. --remote=origin --push

# 2) 打开 Pages（分支部署）
gh api -X POST repos/<你的账号>/anthropology-map/pages \
  -f "source[branch]=main" -f "source[path]=/"

# 3) 等 1 分钟后访问
open https://<你的账号>.github.io/anthropology-map/
```

以后更新内容：

```bash
git add -A && git commit -m "update data" && git push
```

## 方案 B：Netlify / Cloudflare Pages（可拖拽上传，带表单和预览）

1. 打开 https://app.netlify.com/drop
2. 把整个 `anthropology-platform` 文件夹拖进去 → 立刻得到 `xxx.netlify.app` 域名
3. 在 Site settings → Domain management 里绑定自己的域名

Cloudflare Pages 同理：Workers & Pages → Create → Pages → Upload assets。

## 方案 C：Vercel

```bash
npm i -g vercel   # 或 pnpm add -g vercel
cd anthropology-platform
vercel            # 一路回车，Framework 选 Other
vercel --prod
```

---

## 绑定自己的域名（三个平台步骤几乎一样）

1. **买域名**（约 8–15 美元/年）：
   - Cloudflare Registrar（按成本价、自带 DNS，推荐）
   - Namecheap / Porkbun（首年便宜、常有优惠）
   - 国内备案需求选阿里云/腾讯云（需 ICP 备案）
2. **在托管平台添加域名**：填 `anthropology.example.com` 之类的子域，
   平台会给一条 CNAME 记录（GitHub Pages 若用根域名则给 4 条 A 记录）。
3. **到域名商的 DNS 页面加记录**：

   | 类型  | 名称  | 值                                   |
   |-------|-------|--------------------------------------|
   | CNAME | `www` | `<你的站点>.netlify.app` / `pages.dev` 等 |
   | A     | `@`   | `185.199.108.153`（GitHub Pages，共 4 条：.108/.109/.110/.111） |

4. 等 5–30 分钟生效；开启平台的 "Enforce HTTPS"。
5. **改两处文件**让分享卡片正确显示：
   - `index.html` 里的 `og:image` / `twitter:image` 改成绝对地址，
     如 `https://anthropology.example.com/assets/og.png`
   - 若用 GitHub Pages 的**自定义域名**，在根目录加一个 `CNAME` 文件，内容为域名本身。

## 域名起名参考（未查询可用性）

- `anthropologymap.org` / `.com`
- `anthro-atlas.com`
- `fieldandtheory.org`
- `history-of-anthropology.org`
- 中文向：`renleixue.map` 不推荐（.map 后缀在国内解析不稳）

选好域名后告诉我，我可以直接帮你：加 `CNAME`、改 OG 绝对路径、
配置 302/301 跳转（裸域 → www）并验证 https 是否正常。

---

## 站内需要随域名更新的位置（共 2 处）

| 文件 | 位置 | 说明 |
|------|------|------|
| `index.html` | `<meta property="og:image">` 与 `<meta name="twitter:image">` | 换成绝对 URL |
| 根目录 | `CNAME`（GitHub Pages 自定义域名时需要） | 只写域名，如 `anthropology.example.com` |
