import { NextResponse } from "next/server";
import { getProductDailyReports, latestProductDailyReport } from "@/lib/productDaily";

export async function GET() {
  const reports = getProductDailyReports();
  const latest = latestProductDailyReport();

  return NextResponse.json({
    updatedAt: latest?.generatedAt || null,
    latest,
    reports,
  });
}
