# Supabase Setup Notes

## Completed

- Logged in to Supabase with GitHub account `dociy9607`.
- Created Supabase organization `dociy9607's Org` on the Free plan.
- Created Supabase project `dehviz-lol`.

## Project Info

- Project ID: `wxhgiwcrvfymneypdvvv`
- Project URL: `https://wxhgiwcrvfymneypdvvv.supabase.co`
- Region: `East US (North Virginia) / us-east-1`
- Plan: Free

## Sensitive Values

Do not commit these values:

- Database password
- Postgres connection string
- Supabase service role key
- JWT secret

The user should keep the database password in a private password manager or local secure note.

## Future Vercel Environment Variables

The migration will likely need:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

Only public URL and anon key are suitable for browser-side use. Service role key and database URL must stay server-side only.
