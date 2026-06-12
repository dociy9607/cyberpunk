# Delta for Operations

## ADDED Requirements

### Requirement: 付费与授权动作必须由用户确认

系统 SHALL 在任何注册、授权、接入 API Key、升级套餐或可能产生费用的动作之前获得用户明确确认。

#### Scenario: 创建 Supabase 项目

- GIVEN 需要创建 Supabase 项目
- WHEN 页面即将执行创建项目或选择付费计划
- THEN 助手必须说明动作含义
- AND 等待用户确认后再继续

### Requirement: Production 切换前必须验证 Preview

系统 SHALL 在迁移到 Next.js 和 Postgres 后先部署 Preview 环境，验证通过后再切换正式站点。

#### Scenario: 迁移 Preview 验证

- GIVEN 新版 Next.js 已部署到 Vercel Preview
- WHEN 登录、养胃记录、工具入口、项目展示验证通过
- THEN 才允许切换 Production

### Requirement: 保留回滚路径

系统 SHALL 在重大迁移期间保留当前可运行版本，以便线上异常时回滚。

#### Scenario: 新版上线异常

- GIVEN Next.js 版本上线后出现严重问题
- WHEN 用户要求恢复
- THEN 可以回滚到迁移前的稳定部署
