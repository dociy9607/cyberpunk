# dehviz.lol Auth Setup

The site now uses Vercel Serverless API routes for login, session validation, logout, and admin account management.

## Default admin

- Username: `admin`
- Password: `QDS-Admin-2026!`

Change this in Vercel Project Settings by adding:

- `ADMIN_PASSWORD`: a new strong initial admin password
- `AUTH_JWT_SECRET`: a long random secret used to sign 30-day session cookies

## Persistent account storage

Account management is persistent only when Vercel KV / Upstash Redis REST variables are configured.

Preferred Vercel KV variable names:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Also supported Upstash variable names:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Without those variables, the API falls back to server memory. Login works, but newly created accounts can disappear after Vercel cold starts or redeploys.

Recommended Vercel setup:

1. Open the Vercel project connected to `dociy9607/cyberpunk`.
2. Go to Storage, create/connect a KV or Upstash Redis store.
3. Add the REST URL and token variables above to Production.
4. Add `AUTH_JWT_SECRET` and a new `ADMIN_PASSWORD`.
5. Redeploy the project.
6. Visit `/api/health`; `persistentAccountStore` should become `true`.

## API routes

- `POST /api/login`
- `GET /api/session`
- `POST /api/logout`
- `GET /api/accounts`
- `POST /api/accounts`
- `DELETE /api/accounts`

All account-management routes require an admin session cookie.
