# Spec: 工作台首页

## Requirements

### Requirement: 登录后展示卡片式工作台

系统 SHALL 在用户登录后展示 `dehviz.lol 工作台`，并以卡片形式提供主要功能入口。

#### Scenario: 进入工作台

- GIVEN 用户已登录
- WHEN 用户打开 `https://www.dehviz.lol/`
- THEN 系统展示首页卡片
- AND 首页包含养胃记录、跨境资讯、账号后台入口

### Requirement: 导航可切换主要功能

系统 SHALL 提供首页、养胃记录、跨境资讯、账号后台之间的导航切换。

#### Scenario: 切换到养胃记录

- GIVEN 用户已登录
- WHEN 用户点击 `养胃记录`
- THEN 系统展示钱大少养胃记录界面

### Requirement: 未登录用户进入登录页

系统 SHALL 在没有有效会话时展示登录页，而不是直接展示工作台。

#### Scenario: 未登录访问

- GIVEN 浏览器没有有效登录 Cookie
- WHEN 用户打开网站
- THEN 系统展示账号密码登录表单
