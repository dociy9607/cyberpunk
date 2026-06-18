# Proposal: Add Personal Knowledge Base

## Intent

Record the product direction for a personal knowledge base on dehviz.lol. The feature should turn articles, forum posts, Zhihu content, copied text, and other references into searchable, verifiable, action-oriented knowledge assets.

## Scope

- Add a future `knowledge-base` capability to OpenSpec.
- Capture requirements for article collection, AI summarization, correction, verification, tagging, search, review, and conversion into tasks or OpenSpec proposals.
- Preserve the distinction between original source content, AI-generated interpretation, and the user's personal judgment.
- Do not implement UI, database tables, API routes, scraping, or AI calls in this change.

## Approach

Create the source-of-truth spec at `openspec/specs/knowledge-base/spec.md` and archive this change immediately because the user asked only to record and archive the requirements.

## Risks

- Future implementation must handle copyright boundaries carefully when storing copied article text.
- Some platforms may block scraping or require manual paste/upload flows.
- Fact-checking quality depends on source access, citation availability, and model behavior.
- Knowledge-base data will likely need persistent database tables and access control before implementation.

