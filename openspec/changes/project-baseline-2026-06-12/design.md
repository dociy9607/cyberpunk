# Design: 项目基线整理

## Overview

当前项目是静态前端加 Vercel Serverless API 的轻量网站。GitHub 保存代码，Vercel 负责部署和运行后端函数，Upstash Redis 负责保存账号后台数据。

## Components

- `PROJECT_OVERVIEW.md`：给人看的项目总览和操作说明。
- `openspec/config.yaml`：项目元信息。
- `openspec/README.md`：OpenSpec 使用方式。
- `openspec/specs/workbench/spec.md`：工作台首页规格。
- `openspec/specs/auth/spec.md`：登录与账号后台规格。
- `openspec/specs/health-log/spec.md`：养胃记录规格。
- `openspec/specs/commerce-news/spec.md`：跨境资讯规格。
- `openspec/specs/operations/spec.md`：部署、数据库和开发流程规格。

## Data Flow

用户访问 `www.dehviz.lol`，Vercel 提供 `index.html` 和 `api/*` Serverless 接口。登录与账号接口通过环境变量连接 Upstash Redis。养胃记录仍保存在浏览器本地 `localStorage`。

## Testing

- 检查 Markdown 和 OpenSpec 文件存在。
- 检查 Git 状态和提交记录。
- 线上健康检查已在前一轮验证 `persistent: true`。
