# Design: Personal Knowledge Base

## Overview

The knowledge base should become a new dehviz.lol module for converting casual reading into durable knowledge. It should support a progressive workflow:

```text
Collect source -> Extract facts and ideas -> Verify and critique -> Add personal judgment -> Search and reuse -> Convert into action
```

The first implementation should be an MVP, not a complex crawler. Manual paste and link capture are acceptable starting points.

## Proposed Information Architecture

- `/knowledge`: main list, search, filters, and add-entry action.
- `/knowledge/:id`: detail page for one saved source.
- Future routes may include `/knowledge/tags/:tag`, `/knowledge/review`, and `/knowledge/ideas`.

## Core Data Concepts

- `KnowledgeSource`: original article, forum post, copied content, video link, or manual note.
- `KnowledgeDigest`: AI-generated summary, core points, key concepts, suspicious claims, and action suggestions.
- `KnowledgeClaim`: individual claim or viewpoint extracted from a source.
- `KnowledgeNote`: user's own notes, agreement, disagreement, and follow-up thoughts.
- `KnowledgeAction`: conversion target such as product requirement, OpenSpec proposal, task, or article draft.

## UX Direction

- Main page: left filters, center cards, right AI整理/纠错面板.
- Detail page: source metadata, AI summary, core points, verification notes, user's judgment, related entries, and conversion buttons.
- The product should feel like a personal research cockpit rather than a generic bookmark manager.

## MVP Recommendation

1. Save link or pasted text.
2. Store title, source, URL, tags, status, importance, and personal note.
3. Generate summary, core points, suspicious points, credibility label, and action suggestions.
4. Provide search and tag filtering.
5. Allow editing the user's personal note.

## Future Enhancements

- Web content extraction with fallback to manual paste.
- Cross-source fact checking.
- Backlinks between related concepts.
- Weekly or monthly review.
- Convert selected knowledge into OpenSpec changes or project tasks.

## Testing

- Verify entries can be created from URL-only and pasted-text inputs.
- Verify source metadata remains visible.
- Verify AI content and user notes are visually separated.
- Verify search covers title, source, summary, tags, claims, and notes.
- Verify low-confidence or unverified content is labeled clearly.

