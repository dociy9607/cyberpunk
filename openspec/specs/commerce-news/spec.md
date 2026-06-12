# Spec: 每日跨境电商资讯

## Requirements

### Requirement: 展示跨境电商资讯入口

系统 SHALL 在工作台中提供每日跨境电商资讯功能卡片。

#### Scenario: 打开资讯页

- GIVEN 用户已登录
- WHEN 用户点击跨境资讯
- THEN 系统展示跨境电商资讯视图

### Requirement: 资讯重点覆盖亚马逊和独立站

系统 SHALL 在资讯内容中优先关注亚马逊、独立站、平台政策、卖家运营相关信息。

#### Scenario: 请求资讯接口

- GIVEN 用户打开跨境资讯视图
- WHEN 前端请求 `/api/commerce-news`
- THEN 系统返回资讯条目
- AND 内容包含来源、标题、摘要、标签或时间等可读信息

### Requirement: 接口失败时可降级展示

系统 SHALL 在资讯接口失败时展示可读的备用内容或错误提示。

#### Scenario: 资讯接口异常

- GIVEN `/api/commerce-news` 请求失败
- WHEN 用户打开资讯页
- THEN 页面不崩溃
- AND 展示可理解的提示
