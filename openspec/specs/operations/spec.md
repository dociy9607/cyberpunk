# Spec: 项目运维与开发流程

## Requirements

### Requirement: 代码保存在 GitHub

系统 SHALL 以 GitHub 仓库作为代码版本来源。

#### Scenario: 查看代码来源

- GIVEN 需要查看或修改代码
- WHEN 打开仓库
- THEN 使用 `https://github.com/dociy9607/cyberpunk`

### Requirement: Vercel 自动部署

系统 SHALL 由 Vercel 从 GitHub `master` 分支自动部署线上网站。

#### Scenario: 推送后部署

- GIVEN 新代码已推送到 `master`
- WHEN Vercel 检测到 GitHub 更新
- THEN Vercel 构建并部署到 `www.dehviz.lol`

### Requirement: 环境变量由 Vercel 管理

系统 SHALL 在 Vercel 项目中保存后端运行所需的环境变量和数据库连接信息。

#### Scenario: 后端读取数据库变量

- GIVEN Upstash Redis 已连接到 Vercel 项目
- WHEN Serverless Function 启动
- THEN 后端可读取 Redis REST URL 和 Token

### Requirement: 新需求优先走 OpenSpec

系统 SHALL 对涉及功能范围、数据保存、登录权限、第三方服务或部署影响的新需求先建立 OpenSpec 变更。

#### Scenario: 提出云端养胃记录需求

- GIVEN 用户提出“养胃记录手机电脑同步”
- WHEN 使用 OpenSpec 流程
- THEN 先创建 proposal、design、tasks 和 delta spec
- AND 用户确认后再实施
