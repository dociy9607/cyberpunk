import { NextResponse } from "next/server";
import { commerceNewsBriefs, latestCommerceNewsBrief } from "@/data/commerceNews";

export async function GET() {
  const latest = latestCommerceNewsBrief();
  return NextResponse.json({
    updatedAt: latest.generatedAt,
    latest,
    briefs: commerceNewsBriefs,
    items: latest.items,
  });
}
