# dehviz.lol Deployment Runbook

## Current Platform

- Framework: Next.js + TypeScript
- Hosting: Vercel
- Database: Supabase Postgres
- Fallback KV: Upstash Redis
- Branch: `master`
- Production domain: `https://www.dehviz.lol/`

## Required Vercel Environment Variables

Do not commit values to GitHub.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Existing Upstash variables may remain as fallback.

## Supabase Database

Schema migration file:

- `supabase/migrations/202606120001_platform_schema.sql`

This creates:

- `admin_accounts`
- `health_records`
- `projects`
- `tools`
- `commerce_news_items`
- `integrations`
- `integration_call_logs`
- `admin_audit_logs`

## Deployment Verification

After each production deployment:

1. Visit `/api/health`.
2. Confirm `accountStore` is `supabase-postgres`.
3. Confirm `healthRecordStore` is `supabase-postgres`.
4. Log in as `admin`.
5. Create a test health record.
6. Confirm the record remains after refresh and can be fetched through `/api/health-records`.

## Rollback

If the Next.js deployment fails, use Vercel Deployments to promote the previous stable deployment:

- `13076dd Support Vercel-prefixed Upstash variables`

That version uses the pre-migration static app with Upstash-backed account storage.
