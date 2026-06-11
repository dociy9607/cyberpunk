# dehviz.lol Auth Setup

The site now uses Vercel Serverless API routes for login, session validation, logout, and admin account management.

## Default admin

- Username: `admin`
- Password: `QDS-Admin-2026!`

Change this in Vercel Project Settings by adding:

- `ADMIN_PASSWORD`: a new strong initial admin password
- `AUTH_JWT_SECRET`: a long random secret used to sign 30-day session cookies

## Persistent account storage

Account management is persistent only when Vercel KV / Upstash Redis REST variables are configured:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Without those variables, the API falls back to server memory. Login works, but newly created accounts can disappear after Vercel cold starts or redeploys.

## API routes

- `POST /api/login`
- `GET /api/session`
- `POST /api/logout`
- `GET /api/accounts`
- `POST /api/accounts`
- `DELETE /api/accounts`

All account-management routes require an admin session cookie.
