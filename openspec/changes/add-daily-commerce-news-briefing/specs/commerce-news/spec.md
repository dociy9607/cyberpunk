# Delta for Commerce News

## ADDED Requirements

### Requirement: Daily Brief Archive
The system SHALL preserve daily commerce-news briefings by date instead of replacing prior days.

#### Scenario: User opens commerce news
- GIVEN at least one daily brief exists
- WHEN the user opens the commerce-news view
- THEN the system displays the latest daily brief
- AND previous brief dates remain visible as historical records.

### Requirement: Verified News Cards
The system SHALL expose each news card with a title, source, original URL, publication or update time, summary, seller impact, recommended action, and verification note.

#### Scenario: API returns latest brief
- GIVEN a daily brief contains curated items
- WHEN the frontend requests `/api/commerce-news`
- THEN the response includes 10 seller-relevant items
- AND each item includes a verifiable source URL and displayed publication or update time.

### Requirement: Editorial Observation
The system SHALL include a concise daily observation and verification explanation for the latest briefing.

#### Scenario: Latest brief renders
- GIVEN the latest brief has observation and verification notes
- WHEN the page renders the latest brief
- THEN the user can read the overall market observation
- AND the user can see how the sources were judged reliable.
