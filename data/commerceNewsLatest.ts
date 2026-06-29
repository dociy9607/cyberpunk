import type { CommerceNewsBrief } from "@/lib/types";

export const latestCommerceNews_2026_06_29: CommerceNewsBrief = {
  date: "2026-06-29",
  displayDate: "2026年6月29日",
  generatedAt: "2026-06-29T12:30:00+08:00",
  researchWindow:
    "优先核验 2026-06-28 至 2026-06-29 最近 24 小时资讯；因高可信且可访问的增量不足 20 条，扩展到 2026-06-26 至 2026-06-29 最近 72 小时窗口。本次共确认 12 条。",
  observation: [
    "最近 72 小时里，真正值得卖家立即处理的变化仍集中在 Shopify 的欧盟税费与运费配置、TikTok Shop 的达人协作规则，以及 Google 与搜索广告生态对投放和自然流量的同步收紧。",
    "这批更新的共同点不是单纯给流量，而是要求卖家把报价、素材、归因、站点索引和合作分销的底层数据做得更准确。数据和流程不稳，自动化广告与 AI 搜索会先放大错误。",
    "本轮没有为了凑满 20 条而纳入发布时间超出 72 小时、正文无法访问、或搜索摘要与原文日期不一致的内容，因此页面与 API 会如实返回 12 条已核验资讯。",
  ],
  verificationNotes: [
    "优先采用 Shopify Changelog、Shopify Developer Changelog、TikTok Shop Academy 等官方来源；广告与 SEO 侧补充采用 Search Engine Land、Practical Ecommerce 等带明确发布时间的权威行业媒体。",
    "对 Search Engine Land 这类页面，优先使用搜索结果中直接可见的 Published 时间与文章摘要交叉核验；仅保留可打开正文链接且能确认标题、发布时间的条目。",
    "凡是搜索摘要显示为 06/26/2026、但正文实际发布日期更早的 TikTok Shop Academy 页面，本次均剔除；因此确认数量少于目标 20 条。",
  ],
  items: [
    {
      id: "2026-06-29-shopify-eu-duty-3-euro",
      title: "Shopify支持欧盟3欧元低值进口关税代收",
      source: "Shopify Changelog",
      originalUrl: "https://changelog.shopify.com/posts/new-3-eu-import-customs-duty-arrives-july-1",
      publishedAt: "2026-06-26",
      category: "Shopify",
      tags: ["欧盟关税", "Managed Markets", "结账税费"],
      summary:
        "Shopify 于 2026-06-26 公告，已支持欧盟对 150 欧元及以下低值进口包裹按税则行征收 3 欧元关税，并在 Managed Markets 与 import tax and duty calculation 中自动计入结账费用，7 月 1 日起生效。",
      sellerImpact:
        "面向欧盟发货的独立站卖家，结账展示、毛利测算和含税报价会立即受影响。若仍按旧低值免税逻辑定价，容易出现低价冲量后利润被税费吞噬，或到岸补费引发拒收与差评。",
      recommendedAction:
        "立即复核欧盟市场的含税售价、促销毛利和多品类混装订单的税则行数，统一客服话术，明确新增加收的是 3 欧元关税而非 VAT 重复收费。",
      verification:
        "Shopify Changelog 页面标题为 Shopify now supports €3 EU import customs duty collection，页面显示日期为 June 26, 2026。",
      priority: "high",
    },
    {
      id: "2026-06-29-shopify-carrier-services-profile",
      title: "Shopify承运服务不再默认加入运费模板",
      source: "Shopify Developer Changelog",
      originalUrl: "https://shopify.dev/changelog/carrier-services-will-no-longer-be-automatically-added-to-the-default-shipping-profile",
      publishedAt: "2026-06-26",
      category: "Shopify",
      tags: ["开发者", "运费模板", "Admin API"],
      summary:
        "Shopify Developer Changelog 于 2026-06-26 说明，自 Admin API 2026-10 起，新建 carrier service 后将只完成注册，不再自动挂到 General shipping profile，商家或服务商需手动或通过 API 补齐运费配置。",
      sellerImpact:
        "依赖第三方物流插件、自研运费接口或海外仓动态报价的卖家，若升级版本后没补挂运费模板，最直接的结果就是结账页不出运费，导致买家无法下单或运费错误。",
      recommendedAction:
        "排查当前 ERP、物流中间件和私有应用是否依赖旧自动挂载逻辑，在测试店先验证 2026-10 版本下的 carrier service 创建、费率写入与 checkout 展示。",
      verification:
        "Shopify Developer Changelog 页面显示日期为 June 26, 2026，并明确写明 creating a carrier service no longer automatically adds it to the shop’s General shipping profile。",
      priority: "high",
    },
    {
      id: "2026-06-29-tiktok-creator-sample-score",
      title: "TikTok创作者样品分数前台化影响寄样合作",
      source: "TikTok Shop Academy",
      originalUrl: "https://seller-us.tiktok.com/university/essay?knowledge_id=8083637359675149",
      publishedAt: "2026-06-26",
      category: "TikTok Shop",
      tags: ["达人合作", "样品", "分数机制"],
      summary:
        "TikTok Shop Academy 在 2026-06-26 上线 Creator Sample Score 指南，按履约、活跃度、销售激活和内容质量给创作者打分，并允许卖家在样品合作审核等场景看到该分数，用来判断达人可靠性。",
      sellerImpact:
        "寄样招商将从看粉丝量、报价，转向看履约和内容稳定性。若品牌仍靠人工经验挑达人，容易把样品预算投向履约差、内容不稳定的账号，放大寄样浪费与转化波动。",
      recommendedAction:
        "把达人筛选表从粉丝与佣金扩展到样品分数、履约时效和历史内容质量，对高客单或新品寄样优先做小批量测试，再放大合作名单。",
      verification:
        "TikTok Shop Academy 页面标题为 Understand and Improve Your Creator Sample Score，正文页显示日期为 06/26/2026。",
      priority: "high",
    },
    {
      id: "2026-06-29-practicalecommerce-ai-affiliates",
      title: "联盟分销进入AI效率竞争期",
      source: "Practical Ecommerce",
      originalUrl: "https://www.practicalecommerce.com/ai-forces-affiliates-to-innovate-or-die",
      publishedAt: "2026-06-28",
      category: "Affiliate",
      tags: ["联盟营销", "AI", "流量合作"],
      summary:
        "Practical Ecommerce 于 2026-06-28 指出，AI 正在重塑联盟分销商的生产方式，能持续产出高质量购物内容、做更细颗粒度归因和个性化跟进的合作方，会比只发链接和优惠码的旧型 affiliates 更有价值。",
      sellerImpact:
        "卖家未来衡量联盟渠道，不应只看最后一跳佣金成本，还要看内容生产能力、产品数据接入深度和转化追踪能力。合作方越依赖 AI，越需要品牌提供干净、可用的数据资产。",
      recommendedAction:
        "梳理联盟分销商的素材包、产品 feed、库存和活动规则输出方式，对核心合作方提供更规范的数据接口与归因口径，淘汰只拿券码不做内容的低效合作伙伴。",
      verification:
        "Practical Ecommerce 文章标题为 AI Forces Affiliates to Innovate or Die，页面元数据 datePublished 为 2026-06-28T12:53:34+00:00。",
      priority: "medium",
    },
    {
      id: "2026-06-29-practicalecommerce-printful-pod",
      title: "Printful披露POD卖家毛利与图像质量关键点",
      source: "Practical Ecommerce",
      originalUrl: "https://www.practicalecommerce.com/printful-exec-on-profitable-print-on-demand",
      publishedAt: "2026-06-26",
      category: "DTC",
      tags: ["POD", "定价", "商品图"],
      summary:
        "Practical Ecommerce 在 2026-06-26 发布对 Printful 高管的访谈，强调 POD 卖家通常需要维持约 40% 毛利，低于 30% 风险明显上升，同时真实模特图、多角度图和优质 mockup 直接影响转化。",
      sellerImpact:
        "对做 Etsy、Shopify 或站外广告引流的 POD 卖家，这意味着竞争焦点不只是选品，而是毛利模型和素材质量。低毛利叠加低质量商品图，放量后很难覆盖广告与售后成本。",
      recommendedAction:
        "重新测算 POD SKU 的最低可投放毛利线，优先升级头部商品的主图、模特图和细节图，对低于目标毛利且转化平平的款式尽快下架或提价。",
      verification:
        "Practical Ecommerce 文章标题为 Printful Exec on Profitable Print-on-Demand，页面元数据 datePublished 为 2026-06-26T13:45:44+00:00。",
      priority: "medium",
    },
    {
      id: "2026-06-29-sel-standard-shopping-mcv",
      title: "Google标准购物广告开放最大化转化价值出价",
      source: "Search Engine Land",
      originalUrl: "https://searchengineland.com/google-brings-maximize-conversion-value-bidding-to-standard-shopping-481209",
      publishedAt: "2026-06-26 12:13 ET",
      category: "Ads",
      tags: ["Google Ads", "Shopping", "出价策略"],
      summary:
        "Search Engine Land 于 2026-06-26 报道，Google 已让 Standard Shopping 在不强制设置 Target ROAS 的情况下使用 Maximize Conversion Value。过去很多卖家为跑价值出价被迫转向 PMax，现在标准购物的策略灵活度提升。",
      sellerImpact:
        "对想保留商品级结构化控制、又希望按转化价值放量的卖家，这是重新评估 Standard Shopping 与 PMax 分工的窗口。预算不必再单纯为了价值出价被压向黑盒化更强的投放形态。",
      recommendedAction:
        "选择已有稳定转化价值数据的标准购物广告组做小范围 A/B 测试，对比 Target ROAS、Max Conversion Value 与 PMax 的获客成本、ROAS 和查询词可控性。",
      verification:
        "Search Engine Land 搜索结果页直接显示标题、摘要与 Published: June 26, 2026 at 12:13 pm。",
      priority: "high",
    },
    {
      id: "2026-06-29-sel-page-indexing-delay",
      title: "Google搜索控制台索引报告延迟影响站点排查",
      source: "Search Engine Land",
      originalUrl: "https://searchengineland.com/page-indexing-report-in-google-search-console-delayed-481210",
      publishedAt: "2026-06-26 11:45 ET",
      category: "SEO",
      tags: ["Search Console", "索引", "独立站"],
      summary:
        "Search Engine Land 在 2026-06-26 提醒，Google Search Console 的 Page indexing report 已延迟超过两周，最近更新时间停留在 6 月 11 日。这会让站点无法及时看到新页面是否被发现、抓取和编入索引。",
      sellerImpact:
        "依赖新品页、专题页和活动页快速收录的独立站卖家，近期若只看 Search Console 索引报告，很容易误判站点健康度，错过真实的抓取、模板或渲染问题。",
      recommendedAction:
        "把排查重心临时转到 URL Inspection、服务器日志、站内抓取工具和 sitemap 监控，别等索引报告恢复后才发现新品或活动页错过最佳收录窗口。",
      verification:
        "Search Engine Land 搜索结果页显示标题、摘要与 Published: June 26, 2026 at 11:45 am，并指出报告最后更新时间停在 June 11, 2026。",
      priority: "high",
    },
    {
      id: "2026-06-29-sel-google-spam-update-done",
      title: "Google六月垃圾更新完成独立站流量需复盘",
      source: "Search Engine Land",
      originalUrl: "https://searchengineland.com/google-june-2026-spam-update-done-rolling-out-481063",
      publishedAt: "2026-06-26 14:00 ET",
      category: "SEO",
      tags: ["Google", "Spam Update", "自然流量"],
      summary:
        "Search Engine Land 于 2026-06-26 报道，Google June 2026 spam update 已在 6 月 26 日下午完成滚动发布。对依赖自然搜索获客的品牌站和内容站来说，接下来几天将是观察流量、收录和词排名波动的关键窗口。",
      sellerImpact:
        "如果站内仍有低质量聚合页、过度模板化内容或灰区外链操作，这轮更新会加快风险暴露。旺季前自然流量一旦下滑，后续往往要用更贵的广告预算去补缺口。",
      recommendedAction:
        "按目录和模板复盘近两周流量、转化与收录波动，优先审查薄内容页、批量伪原创页和异常外链来源，尽快处理最可能触发 spam 信号的页面簇。",
      verification:
        "Search Engine Land 搜索结果页显示标题、摘要与 Published: June 26, 2026 at 2:00 pm，并说明该更新已完成滚动。",
      priority: "high",
    },
    {
      id: "2026-06-29-sel-bad-data-ad-delivery",
      title: "广告脏数据已开始直接拖累自动化投放",
      source: "Search Engine Land",
      originalUrl: "https://searchengineland.com/bad-data-bad-reports-poor-ad-delivery-481109",
      publishedAt: "2026-06-26 11:00 ET",
      category: "Ads",
      tags: ["数据质量", "自动化投放", "归因"],
      summary:
        "Search Engine Land 在 2026-06-26 指出，广告平台自动化程度越高，数据脏污造成的后果越不只是报表失真，而是会直接把预算优化到错误人群、错误素材和错误转化信号上。",
      sellerImpact:
        "跨境卖家常见的重复转化、漏回传、事件定义混乱和站内埋点漂移，会在自动出价与智能创意阶段被成倍放大。短期看像是广告波动，长期看其实是训练数据出了问题。",
      recommendedAction:
        "立即核对像素、CAPI、GA4 与广告平台回传的一致性，建立转化事件变更记录，把高客单品类和重点市场的归因校验纳入每周例行巡检。",
      verification:
        "Search Engine Land 搜索结果页显示标题、摘要与 Published: June 26, 2026 at 11:00 am。",
      priority: "high",
    },
    {
      id: "2026-06-29-sel-paid-brand-mentions-geo",
      title: "GEO付费品牌提及风险升温影响AI搜索可见度",
      source: "Search Engine Land",
      originalUrl: "https://searchengineland.com/paid-brand-mention-geo-481092",
      publishedAt: "2026-06-26 09:00 ET",
      category: "SEO",
      tags: ["GEO", "AI 搜索", "品牌提及"],
      summary:
        "Search Engine Land 于 2026-06-26 讨论，随着 GEO 兴起，市场上开始出现用付费品牌提及换取 AI 搜索可见度的做法。文章提醒品牌不要把 AI 搜索优化简单等同于买站外提及量。",
      sellerImpact:
        "对做独立站和内容营销的卖家，这意味着 GEO 预算若缺少规则边界，容易被带向高成本、低沉淀的伪公关投放，既难复用，也可能伤害品牌信任与长期 SEO 资产。",
      recommendedAction:
        "把 GEO 预算优先投向可验证的专家内容、产品资料页、媒体关系与真实用户口碑，而不是只追求付费提及数量；同步建立 AI 搜索曝光与转化的独立观测表。",
      verification:
        "Search Engine Land 搜索结果页显示标题、摘要与 Published: June 26, 2026 at 9:00 am。",
      priority: "medium",
    },
    {
      id: "2026-06-29-sel-linkedin-cpc-benchmarks",
      title: "LinkedIn获客成本与Google搜索差距缩窄",
      source: "Search Engine Land",
      originalUrl: "https://searchengineland.com/linkedin-ads-cpc-benchmarks-how-costs-compare-with-google-ads-481010",
      publishedAt: "2026-06-26 08:00 ET",
      category: "Ads",
      tags: ["LinkedIn Ads", "B2B", "获客成本"],
      summary:
        "Search Engine Land 于 2026-06-26 发布基准分析，按同一批账户看，LinkedIn 平均 CPC 高于 Google Ads，但若对比获取新高意向 B2B 受众的 prospecting 与 non-branded search，二者成本差距明显缩小。",
      sellerImpact:
        "对做高客单 B2B 出海、批发询盘和专业服务获客的团队，这意味着 LinkedIn 不该只因表面 CPC 高就被排除。若线索质量更高，它可能比泛搜索流量更适合作为前链路。",
      recommendedAction:
        "分开核算品牌词、非品牌词、Demand Gen 与 LinkedIn prospecting 的真实线索成本和成单周期，别再用混合 CPC 直接判断渠道优劣。",
      verification:
        "Search Engine Land 搜索结果页与相关转载摘要均显示标题与发布时间为 June 26, 2026 at 8:00 am。",
      priority: "medium",
    },
    {
      id: "2026-06-29-sel-claude-content-audits",
      title: "内容团队开始把Claude用于站内内容审计",
      source: "Search Engine Land",
      originalUrl: "https://searchengineland.com/content-audit-workflows-claude-481099",
      publishedAt: "2026-06-26",
      category: "SEO",
      tags: ["Claude", "内容审计", "独立站运营"],
      summary:
        "Search Engine Land 在 2026-06-26 发布内容审计方法，建议把 Claude 用于单篇页面诊断、批量内容盘点与可复用审计流程搭建。对 SKU 多、专题页多的独立站团队，这类半自动审计开始具备规模化价值。",
      sellerImpact:
        "如果内容团队仍完全依赖人工抽查，站内旧文、集合页和说明页的问题会长期堆积，直到影响 AI 搜索引用率和自然转化。AI 审计的意义在于提升发现问题的速度，而非替代判断。",
      recommendedAction:
        "先从高流量集合页、转化差的商品内容页和长期未更新博客试跑统一审计模板，把结构化问题、重复信息和转化缺口分层记录后再批量修。",
      verification:
        "Search Engine Land 搜索结果聚合页可确认该文章标题与日期为 Jun 26, 2026，相关分享页摘要与时间戳也与之对应。",
      priority: "medium",
    },
  ],
};
