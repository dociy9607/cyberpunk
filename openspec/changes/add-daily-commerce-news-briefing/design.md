# Design: Daily Commerce News Briefing

## Overview
The commerce-news section will use typed curated data rather than live scraping on page load. This keeps the public site fast, avoids source availability issues, and preserves historical daily briefs.

## Components
- `data/commerceNews.ts`: daily archive with briefing metadata and card-ready entries.
- `app/api/commerce-news/route.ts`: returns latest brief and historical briefs.
- `components/AppShell.tsx`: fetches the API, renders the latest date, card list, observations, verification notes, and previous dates.
- `openspec/changes/add-daily-commerce-news-briefing/specs/commerce-news/spec.md`: delta requirements for daily researched briefings.

## Data Flow
1. Codex researches sources and writes a new `CommerceNewsBrief` item.
2. `/api/commerce-news` imports the archive and returns `{ latest, briefs, items }`.
3. The frontend loads the API when the user opens the commerce view.
4. The newest brief appears first, while older dates remain accessible below.

## Testing
- `npm run typecheck`
- `npm run build`
- Verify `/api/commerce-news` returns 10 items for the latest brief.
- Verify the commerce view renders latest and historical records without relying on localStorage.
