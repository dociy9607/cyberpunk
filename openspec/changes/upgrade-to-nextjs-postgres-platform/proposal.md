# Proposal: 升级为正规工具集与个人品牌平台

## Intent

将 `dehviz.lol` 从当前单页 HTML 工具站，升级为稳定、正规、可扩展的个人品牌与工具平台。目标是同时承载个人项目展示、简历展示、工具集、未来 AI/OEM 产品体验和后台管理。

## Why Now

当前项目已经具备登录、后台账号、养胃记录、跨境资讯和 Vercel 部署基础，但仍存在几个限制：

- 页面和前端逻辑都集中在 `index.html`，长期维护会越来越难。
- 养胃记录仍保存在浏览器本地，无法手机电脑同步。
- 账号数据使用 Redis 可用，但未来项目、简历、工具配置、AI 调用日志更适合关系型数据库。
- 后续接入数字人、智能客服等 OEM 产品时，需要统一的集成管理、调用日志和权限控制。

## Scope

包含：

- 迁移到 `Next.js + TypeScript` 项目结构。
- 新增 Postgres 数据库，优先选择 Supabase。
- 保留现有线上域名和 GitHub/Vercel 自动部署链路。
- 将养胃记录迁移到云端数据库。
- 建立个人品牌首页、工具集、项目/简历展示、AI 产品体验入口。
- 建立正规后台：账号、项目、工具、资讯、OEM 集成配置。
- 保留 Upstash Redis 作为缓存、会话辅助或轻量 KV。

不包含：

- 立即接入真实付费 OEM API。
- 立即做多租户 SaaS 或对外售卖套餐。
- 立即上 Stripe 支付。
- 立即废弃当前站点；迁移应保持线上可回滚。

## Recommended Stack

- Framework: Next.js + TypeScript
- Hosting: Vercel
- Database: Supabase Postgres
- Auth: Supabase Auth 起步；未来企业级用户管理可升级 Clerk
- Cache/KV: Upstash Redis
- Storage: Supabase Storage
- Email: Resend
- Monitoring: Sentry + Vercel Analytics

## Cost Strategy

第一阶段允许继续使用免费档：

- Vercel: 当前账号继续使用 Hobby
- Supabase: 免费项目起步
- Upstash: 当前免费 Redis 继续保留

进入正式长期运营后建议升级：

- Vercel Pro
- Supabase Pro
- Sentry/Resend 按需启用

任何付费、授权、第三方集成都应在执行前由用户确认。

## Risks

- 迁移期间可能出现页面重构范围扩大。
- 数据迁移需要谨慎，尤其是养胃记录从 localStorage 到数据库。
- OEM API 成本、稳定性和隐私合规需要逐个产品评估。
- 如果一次性做太大，交付周期会变长；建议分阶段上线。
