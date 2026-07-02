# Proposal: Add AI Product Column

## Intent

Record the requirements for a new dehviz.lol product column powered by a daily AI product intelligence workflow. The column should turn daily AI product research into a persistent website section with historical reports, source links, quality controls, deduplication, and highlight tracking.

## Scope

- Add a `product-column` OpenSpec capability.
- Record the daily report structure from the archived prompt.
- Record quality requirements for source verification, credibility scoring, deduplication, and public links.
- Record the future website behavior for Markdown daily reports and highlight calendar.
- Record the daily automation requirement at 09:00 Beijing time.
- Do not implement the product column UI, storage, API routes, scraper, report content, or highlight persistence in this change.

## Approach

Sync the accepted requirements into `openspec/specs/product-column/spec.md` as the source of truth, then archive this planning change because the user asked whether the requirements were recorded rather than asking for implementation.

## Risks

- Some source platforms may block scraping or require login; implementation must fall back to accessible sources only.
- Cross-source verification can be slow and may produce fewer than the requested number of items.
- Highlight state needs persistent storage and user identity decisions before implementation.
- The current project may need routing and content rendering changes before `/product-daily` can be exposed cleanly.

