# Proposal: Refine Product Radar Sources and History

## Intent

Reduce low-value search noise in the daily AI product report and keep the growing report archive easy to browse in the product column sidebar.

## Scope

- Add a fixed candidate-source pool for product launches, official changes, open-source trends, and Greater Bay Area events.
- Preserve official-source and independent-source verification before an item can enter the formal report.
- Constrain the historical report list to a compact scrollable region as the archive grows.
- Keep the existing report format, daily schedule, API contract, highlights, and Markdown archive.

## Approach

Update the active Codex automation prompt so it starts from a small, named source pool, then verifies shortlisted items against first-party pages and independent public sources. Update the product sidebar with a compact archive header and a bounded history list.

## Risks

- Candidate platforms can be unavailable, stale, or biased toward popularity; they must never be treated as proof by themselves.
- A scrollable history region must remain keyboard accessible and usable on narrow screens.
- Existing daily reports must not be rewritten solely because the source strategy changes.
