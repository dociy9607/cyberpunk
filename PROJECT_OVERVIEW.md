# dehviz.lol 项目基础信息

## 项目定位

`dehviz.lol` 是一个个人工作台网站，用卡片式首页收纳多个小工具。当前主要功能包括：

- 钱大少养胃记录
- 每日跨境电商资讯
- 登录验证与 30 天免登录
- 管理员账号后台

## 线上地址

- 主站：https://www.dehviz.lol/
- Vercel 默认域名：https://cyberpunk-opal.vercel.app/
- GitHub 仓库：https://github.com/dociy9607/cyberpunk
- Vercel 项目：Dehviz's projects / cyberpunk

## 当前技术结构

- 前端：单页 `index.html`
- 后端：Vercel Serverless Functions，位于 `api/`
- 部署：GitHub 推送到 `master` 后，由 Vercel 自动部署
- 登录会话：HTTP-only Cookie，默认 30 天
- 账号数据库：Upstash Redis，通过 Vercel Storage 集成注入环境变量

## 重要文件

- `index.html`：主页面、卡片工作台、养胃记录、跨境资讯、账号后台前端逻辑
- `api/_auth.js`：登录、账号、Cookie、Upstash Redis 存储公共逻辑
- `api/login.js`：登录接口
- `api/session.js`：读取当前登录状态
- `api/logout.js`：退出登录
- `api/accounts.js`：账号管理接口
- `api/commerce-news.js`：跨境资讯接口
- `api/health.js`：线上健康检查接口
- `AUTH_SETUP.md`：登录和数据库环境变量配置说明
- `openspec/`：当前系统规格和后续需求变更记录

## 当前后台账号

- 用户名：`admin`
- 密码：`QDS-Admin-2026!`

登录成功后，浏览器会保存 30 天免登录状态。账号管理数据已接入 Upstash Redis，刷新网页不会丢。

## 数据保存位置

账号后台数据保存在 Upstash Redis：

- 数据库名：`upstash-kv-chestnut-candle`
- Vercel 项目连接：`cyberpunk`
- 后端 key：`dehviz:auth:accounts:v1`

养胃记录目前保存在当前浏览器的 `localStorage`，也就是说：

- 同一台电脑、同一个浏览器刷新页面不会丢
- 换电脑、换浏览器、清理浏览器数据会丢
- 如果以后需要手机和电脑同步，需要把养胃记录也改成后端数据库保存

## 推荐开发流程

1. 先把新需求说清楚：要加什么、谁用、做到什么程度算完成。
2. 我用 OpenSpec 创建一个 `openspec/changes/<change-name>/` 变更文档。
3. 你确认需求范围。
4. 我实现代码、运行检查、推送 GitHub。
5. Vercel 自动部署。
6. 我验证线上功能，再把结果告诉你。

小改动可以直接做；涉及登录、数据库、页面结构、付费服务、跨设备数据同步的改动，建议先走 OpenSpec。
