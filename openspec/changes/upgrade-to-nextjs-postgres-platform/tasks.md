# Tasks

## 1. Decision and Setup

- [x] 1.1 Confirm Supabase as the first Postgres provider.
- [x] 1.2 Create or log in to Supabase account with user confirmation.
- [x] 1.3 Create Supabase project on free plan unless user explicitly approves paid plan.
- [x] 1.4 Record required environment variables for Vercel.

## 2. Project Migration

- [x] 2.1 Create Next.js + TypeScript project structure.
- [x] 2.2 Move current static UI into reusable pages and components.
- [x] 2.3 Preserve current domain, favicon, visual identity, and main feature entry points.
- [x] 2.4 Keep current site working until Preview deployment is verified.

## 3. Database and Auth

- [x] 3.1 Create Supabase schema migrations.
- [x] 3.2 Add tables for profiles, projects, tools, health records, news items, integrations, call logs, and audit logs.
- [x] 3.3 Implement Supabase Auth or a compatible transition plan from current cookie login.
- [x] 3.4 Migrate account management to database-backed roles.

## 4. Feature Migration

- [x] 4.1 Migrate health log from localStorage to Postgres.
- [x] 4.2 Preserve import/export for health records.
- [x] 4.3 Add project and resume content management.
- [x] 4.4 Keep commerce news page and prepare it for scheduled/cached news updates.
- [x] 4.5 Add AI/OEM product integration placeholder module.

## 5. Operations

- [x] 5.1 Configure Vercel environment variables.
- [x] 5.2 Deploy production and verify after protected configuration check.
- [x] 5.3 Add Vercel-compatible API error logging.
- [x] 5.4 Document runbook for future changes.

## 6. Verification

- [x] 6.1 Run local build checks.
- [x] 6.2 Verify live login and admin access.
- [x] 6.3 Verify cloud health records through live API read after write.
- [x] 6.4 Verify database rows are created in Supabase.
- [x] 6.5 Verify rollback path exists through Vercel deployment history and runbook.
