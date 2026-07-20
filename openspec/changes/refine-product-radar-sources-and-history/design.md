# Design: Refine Product Radar Sources and History

## Overview

The daily workflow will separate candidate discovery from fact verification. The website will retain the current editorial layout while making the archive denser and bounded.

## Components

- `Codex automation ai-2`: discovers candidates from a fixed source pool, verifies shortlisted items, writes the daily report, and deploys it.
- `components/AppShell.tsx`: renders an archive count and a dedicated history-list class.
- `app/globals.css`: limits history-list height, adds scrolling, and reduces row height without shrinking legibility.
- `openspec/specs/product-column/spec.md`: records the accepted source and archive behavior.

## Source Tiers

1. Candidate discovery: AIbase, Product Hunt, Releasebot, GitHub Trending, Hugging Face Trending, Luma, and accessible Greater Bay Area event platforms.
2. Primary verification: official blogs, product changelogs, documentation, official repositories, API documentation, and organizer pages.
3. Independent verification: credible public media or a separate public community confirmation when the requirement permits it.

Candidate discovery pages identify leads only. They cannot replace the verification rules for formal report entries.

## UI Behavior

The history section shows the total number of reports and a vertically scrollable list with a bounded height. The selected date keeps the existing active treatment. Other sidebar sections remain below the history section instead of being pushed far down by archive growth.

## Testing

- Verify the history list has a bounded computed height and vertical scrolling when many reports exist.
- Verify selecting an older report still changes the reader content.
- Verify desktop and narrow layouts do not overlap or clip date/count labels.
- Run `npm run typecheck` and `npm run build`.
- Verify the daily automation remains active at 09:00 Beijing time with the revised prompt.
