const { json, readSession } = require("./_auth");

const newsItems = [
  {
    source: "Business Insider",
    date: "2026-04-26",
    tags: ["亚马逊", "现金流", "卖家成本"],
    title: "亚马逊广告扣款方式改动推迟到 2026-08-01，卖家现金流压力仍是主线",
    summary: "卖家社区对广告费用从销售回款中优先扣除、DD+7 回款延迟、物流附加费等变化反应强烈。行动建议：重新测算广告现金流、保留 30-45 天安全库存资金。",
    url: "https://www.businessinsider.com/amazon-sellers-top-frustrations-ad-payments-challenges-eommerce-2026-4",
    impact: "高",
  },
  {
    source: "Amazon / TechRadar",
    date: "2026-04-03",
    tags: ["FBA", "费用", "北美"],
    title: "FBA 北美 3.5% fuel and logistics surcharge 生效，按履约费计算",
    summary: "美国、加拿大 FBA 以及部分远程配送服务受影响，Buy with Prime 和 MCF 从 5 月 2 日起受影响。行动建议：按 SKU 尺寸分层复盘毛利，优先处理低毛利大件。",
    url: "https://www.techradar.com/pro/your-amazon-shop-will-soon-cost-more-3-5-percent-fuel-and-logistics-related-surcharge-added-due-to-iran-war-knock-on-effects",
    impact: "高",
  },
  {
    source: "Axios",
    date: "2026-01-11",
    tags: ["独立站", "Shopify", "AI Commerce"],
    title: "Google 与 Shopify 推 Universal Commerce Protocol，AI 购物进入交易层",
    summary: "UCP 让 AI 助手在搜索、Gemini 等场景中完成商品发现、下单与售后连接。行动建议：独立站商品数据、库存、折扣和结账链路要结构化，提前适配 AI 入口。",
    url: "https://www.axios.com/2026/01/11/google-shopify-ai-shopping-standard-nrf-2026",
    impact: "中",
  },
  {
    source: "TechRadar",
    date: "2026-06-04",
    tags: ["Shopify", "独立站", "运营系统"],
    title: "Shopify 正从建站工具变成统一商业操作系统",
    summary: "独立站竞争不只在页面，而在库存、CRM、履约、支付、营销数据能否联动。行动建议：中国卖家做独立站时先补数据治理和履约链路，再谈投放放量。",
    url: "https://www.techradar.com/pro/in-the-ai-era-is-shopify-the-new-wordpress",
    impact: "中",
  },
];

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "method_not_allowed" });
  const session = readSession(req);
  if (!session) return json(res, 401, { error: "unauthenticated" });
  return json(res, 200, {
    asOf: "2026-06-11",
    focus: ["亚马逊最新新闻和政策", "FBA/物流费用", "独立站与 Shopify", "AI Commerce"],
    items: newsItems,
  });
};
