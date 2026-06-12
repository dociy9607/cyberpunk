# Design: Next.js + Postgres 平台化升级

## Overview

目标架构：

```text
用户浏览器
  -> Vercel / Next.js App
    -> Next.js 页面与 API Routes
    -> Supabase Auth
    -> Supabase Postgres
    -> Supabase Storage
    -> Upstash Redis
    -> OEM AI APIs
```

迁移采用分阶段策略，避免一次性重写导致线上不可用。

## Proposed Routes

- `/`：个人品牌首页与主入口
- `/tools`：工具集
- `/tools/health-log`：钱大少养胃记录
- `/tools/commerce-news`：跨境电商资讯
- `/projects`：个人项目展示
- `/resume`：简历与能力展示
- `/ai-products`：AI/OEM 产品体验入口
- `/admin`：后台管理
- `/login`：登录页

## Core Modules

- `app/`：Next.js 页面与布局
- `components/`：可复用 UI 组件
- `lib/auth.ts`：登录和权限工具
- `lib/db.ts`：数据库连接
- `lib/integrations/`：OEM 产品接入适配层
- `lib/news/`：跨境资讯获取与缓存
- `lib/health-log/`：养胃记录业务逻辑
- `supabase/migrations/`：数据库结构迁移

## Database Tables

建议 Postgres 表：

- `profiles`：用户资料
- `projects`：个人项目展示
- `tools`：工具配置
- `health_records`：养胃记录
- `commerce_news_items`：跨境资讯缓存
- `integrations`：OEM 产品集成配置
- `integration_call_logs`：AI/OEM 调用日志
- `admin_audit_logs`：后台操作日志

## Auth Model

第一阶段：

- 使用 Supabase Auth 管理登录。
- 保留一个管理员用户。
- 后台页面要求管理员角色。

第二阶段：

- 增加角色：`admin`、`editor`、`viewer`。
- 增加操作日志。

第三阶段：

- 如果未来面向客户开放，评估 Clerk 或 Supabase Organizations。

## Migration Strategy

1. 在新分支或新目录中初始化 Next.js + TypeScript。
2. 复刻当前页面视觉和核心功能。
3. 接入 Supabase 免费项目。
4. 建表并实现云端养胃记录。
5. 将当前账号系统迁移或替换为 Supabase Auth。
6. 部署 Preview 环境验证。
7. 切换 Production。
8. 保留当前版本作为回滚点。

## Verification

- 本地运行 `npm run lint` 和 `npm run build`。
- 验证登录、30 天会话策略或 Supabase 会话策略。
- 验证养胃记录新增、查询、日历状态、导入导出。
- 验证项目展示、简历页、工具入口。
- 验证 Vercel Production 部署。
- 验证 Supabase 数据表中有记录。

## Payment and Account Decisions

需要用户亲自确认的节点：

- 注册或登录 Supabase。
- 创建 Supabase 项目。
- 复制数据库连接环境变量到 Vercel。
- 升级 Vercel Pro。
- 升级 Supabase Pro。
- 接入任何 OEM AI 产品 API Key。
- 启用任何可能产生费用的 API 调用、订阅或支付服务。
