import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    items: [
      {
        source: "Amazon / Marketplace",
        title: "亚马逊政策观察",
        summary: "保留为每日跨境资讯入口。正式迁移后可接入定时抓取、人工精选和后台审核。",
        tag: "亚马逊",
      },
      {
        source: "DTC / Independent Site",
        title: "独立站运营雷达",
        summary: "关注 Shopify、支付、物流、广告投放和站外引流变化，后续写入 Postgres 缓存表。",
        tag: "独立站",
      },
      {
        source: "Platform Ops",
        title: "卖家风控提醒",
        summary: "建议后续把资讯采集和风险提示拆成独立任务，避免每次打开页面都实时请求外部源。",
        tag: "政策",
      },
    ],
  });
}
