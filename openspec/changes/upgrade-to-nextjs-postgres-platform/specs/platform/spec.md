# Delta for Platform

## ADDED Requirements

### Requirement: 平台采用 Next.js 与 TypeScript

系统 SHALL 使用 Next.js 和 TypeScript 组织页面、组件、API 和业务逻辑。

#### Scenario: 新增页面

- GIVEN 需要新增项目展示页
- WHEN 开发者实现页面
- THEN 页面应作为 Next.js route 存在
- AND 代码使用 TypeScript

### Requirement: 业务数据使用 Postgres

系统 SHALL 使用 Postgres 保存长期业务数据，包括养胃记录、项目展示、工具配置和 AI/OEM 调用日志。

#### Scenario: 保存养胃记录

- GIVEN 用户新增一条养胃记录
- WHEN 用户点击保存
- THEN 记录写入 Postgres
- AND 换浏览器或设备后仍可读取

### Requirement: OEM 产品通过统一集成层接入

系统 SHALL 将数字人、智能客服等 OEM AI 产品封装为统一 integration，而不是分散写在页面代码里。

#### Scenario: 接入智能客服

- GIVEN 用户提供智能客服供应商 API 信息
- WHEN 系统新增该 integration
- THEN 后台可以配置 API Key
- AND 前台体验页通过统一接口调用
- AND 后台记录调用日志

### Requirement: 个人品牌和简历内容可扩展

系统 SHALL 支持展示个人项目、能力说明、简历内容和联系方式。

#### Scenario: 展示项目案例

- GIVEN 后台或数据库中存在项目案例
- WHEN 用户打开项目展示页
- THEN 页面展示项目名称、简介、标签、链接和成果说明
