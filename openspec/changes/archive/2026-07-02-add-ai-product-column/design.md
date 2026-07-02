# Design: AI Product Column

## Overview

The product column should be a durable daily intelligence section for AI products and productizable open-source projects. The daily automation should research, verify, deduplicate, write a Markdown report, update the site, run checks, and push to GitHub.

## Proposed Information Architecture

- `/product-daily`: product column home and latest report.
- `/product-daily/YYYY-MM-DD`: one daily report.
- Future: `/product-daily/highlights`: highlight calendar and highlighted entries.

## Data Concepts

- `ProductDailyReport`: one dated report with metadata, sections, source status, and Markdown body.
- `GitHubProjectEntry`: GitHub project item with star count, growth trend, and productization reason.
- `AIProductEntry`: verified product or feature item with credibility score and source links.
- `AIEventEntry`: future Greater Bay Area AI event item.
- `HighlightedEntry`: user-marked product/project entry for later review.
- `ReportedItem`: deduplication record stored in `data/daily_ai_reported.json`.

## Report Sections

1. GitHub 专区: up to 5 projects from the last 7 days.
2. 值得关注的产品/功能: up to 15 verified AI product or feature updates.
3. 粤港澳大湾区 AI 活动: around 5 future events.
4. 今日最值得借鉴的产品: one selected AI product with PM/founder analysis.

## Quality Rules

- Prefer official sources and credible media.
- Product/function entries require at least two independent sources.
- X/Twitter may assist verification but must not be the sole source.
- Any uncertain data must be left as “暂未查到”.
- Login-gated sources must not be used as primary source links.
- It is acceptable to publish fewer entries when quality requirements cannot be met.

## Implementation Notes

- Store the original prompt at `prompts/archive/2026-07-02-ai-product-column-daily-prompt.txt`.
- The automation prompt may adapt the date token to the runtime date while preserving the source prompt intent.
- If the project has no product column yet, the first implementation should create the minimal content rendering path before daily reports become useful.
- Highlight state should not be stored only in static Markdown if user toggling is expected; it likely needs database or authenticated API support.

## Testing

- Verify a report can be generated with fewer than requested entries when sources are insufficient.
- Verify deduplication reads and updates `data/daily_ai_reported.json`.
- Verify Markdown report contains a generated table of contents.
- Verify typecheck and build pass after report updates.
- Verify the public site exposes the latest report and historical reports.

