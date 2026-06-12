# Proposal: Add Daily Commerce News Briefing

## Intent
Build a repeatable daily update path for the "每日跨境电商资讯" section so Codex can research current seller-relevant news, preserve prior daily records, and publish concise Chinese cards to the website.

## Scope
- Add a dated daily commerce-news archive for website consumption.
- Store verified source URL, publication time, summary, seller impact, and recommended action for each item.
- Update the commerce-news API and frontend view to display the latest brief plus previous daily records.
- Seed the archive with the June 12, 2026 briefing.

## Out of Scope
- Fully automated scheduled scraping without human/Codex editorial review.
- Paid news APIs or private platform data.

## Approach
Use a typed local data archive as the first reliable source of truth. The API returns all daily briefs, with the newest brief highlighted. Future Codex runs can append a new date entry and deploy through the existing GitHub/Vercel flow.

## Risks
- News recency depends on source pages exposing reliable dates.
- Some platform policy pages update in place, so the brief must preserve the observed publication/update date text.
