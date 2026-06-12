# Tasks

## 1. Decision and Setup

- [ ] 1.1 Confirm Supabase as the first Postgres provider.
- [ ] 1.2 Create or log in to Supabase account with user confirmation.
- [ ] 1.3 Create Supabase project on free plan unless user explicitly approves paid plan.
- [ ] 1.4 Record required environment variables for Vercel.

## 2. Project Migration

- [ ] 2.1 Create Next.js + TypeScript project structure.
- [ ] 2.2 Move current static UI into reusable pages and components.
- [ ] 2.3 Preserve current domain, favicon, visual identity, and main feature entry points.
- [ ] 2.4 Keep current site working until Preview deployment is verified.

## 3. Database and Auth

- [ ] 3.1 Create Supabase schema migrations.
- [ ] 3.2 Add tables for profiles, projects, tools, health records, news items, integrations, call logs, and audit logs.
- [ ] 3.3 Implement Supabase Auth or a compatible transition plan from current cookie login.
- [ ] 3.4 Migrate account management to database-backed roles.

## 4. Feature Migration

- [ ] 4.1 Migrate health log from localStorage to Postgres.
- [ ] 4.2 Preserve import/export for health records.
- [ ] 4.3 Add project and resume content management.
- [ ] 4.4 Keep commerce news page and prepare it for scheduled/cached news updates.
- [ ] 4.5 Add AI/OEM product integration placeholder module.

## 5. Operations

- [ ] 5.1 Configure Vercel environment variables.
- [ ] 5.2 Deploy Preview and verify before Production.
- [ ] 5.3 Add monitoring and basic error logging.
- [ ] 5.4 Document runbook for future changes.

## 6. Verification

- [ ] 6.1 Run local build checks.
- [ ] 6.2 Verify live login and admin access.
- [ ] 6.3 Verify cloud health records across refresh and device/browser boundary where possible.
- [ ] 6.4 Verify database rows are created in Supabase.
- [ ] 6.5 Verify rollback path exists.
