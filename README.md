# Clinkdeck — AI Builder Showcase

Where AI builders showcase their talent. Every build comes with an animated visual that shows what it does in ten seconds — no videos to record, no decks to read.

## Stack

- Next.js 16 (App Router, Server Actions, `useActionState`)
- TypeScript + Tailwind v4
- Prisma 7 with the `@prisma/adapter-pg` driver adapter on Postgres
- Zod for input validation
- Magic-link auth (Resend for delivery, native crypto for tokens)

## Routes

| Route | What it is |
|-------|-----------|
| `/` | Home — single grid + featured maker sidebar |
| `/l/[slug]` | Listing detail — animated archetype, build story, contact CTA |
| `/l/[slug]/edit` | Owner-only edit. Slug stays stable. |
| `/l/[slug]/opengraph-image` | Per-listing OG image (1200×630) |
| `/c/[handle]` | Creator profile |
| `/new` | Create-a-build wizard: pick archetype, fill labels, publish |
| `/inquiries` | Inbox — received and sent |
| `/inquiries/[id]` | Threaded conversation |
| `/settings` | Edit your profile |
| `/signin` · `/signin/sent` · `/auth/verify` | Magic-link sign-in flow |
| `/onboarding` | First-time setup (handle + name + bio) |

## Visual archetypes

Each listing renders one of five animated archetypes. The maker picks the best fit and labels the parts; we render the animation:

- **Triage** — items flow into buckets
- **Pipeline** — input moves through a chain of steps
- **Score & Route** — items get a score, route to tiers
- **Voice loop** — back-and-forth between user and agent
- **Generative** — prompt → cloud → artifact

Pure CSS keyframes. No videos to host, no Mux integration.

## Local development

The bundled `docker-compose.yml` brings up a Postgres that matches the
default `DATABASE_URL` in `.env.example`.

```bash
docker compose up -d           # start Postgres
npm install
cp .env.example .env           # then edit if you want
npx prisma migrate dev         # creates the tables on first run
npm run seed                   # 5 demo listings, 3 makers, 2 buyers
npm run dev
```

Open http://localhost:3000. Sign in as any seeded user (e.g. `maya@example.com`) — without `RESEND_API_KEY`, the magic link prints to the dev console. Copy it into your browser to land in the app.

## Production deploy

Recommended stack: Vercel + Neon (or Supabase / Railway) Postgres + Resend.

1. **Provision a Postgres.** Get the `DATABASE_URL` from your provider. Run migrations against it:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma migrate deploy
   ```

2. **Set environment variables** on Vercel:

   | Variable | Required | Notes |
   |----------|---------|-------|
   | `DATABASE_URL` | yes | Postgres connection string from your provider |
   | `APP_URL` | yes | `https://your-domain.com` (no trailing slash). The server logs an error in production if missing. |
   | `RESEND_API_KEY` | yes | Without it, sign-in links go to server logs |
   | `RESEND_FROM` | recommended | `Clinkdeck <noreply@your-domain.com>` once you've verified the domain in Resend |

3. **Sessions** auto-flag `secure: true` when `NODE_ENV=production`. Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are configured in `next.config.ts`.

## Security posture

| Concern | Mitigation |
|---|---|
| Anyone-becoming-anyone | No more demo switcher — only real magic-link sessions |
| Magic-link token leak from DB | Tokens stored as SHA-256 hashes |
| Token replay | Single-use guard via atomic `updateMany ... where usedAt: null` |
| 15-minute window | Tokens expire and are pruned on access |
| Account enumeration | Sign-up and sign-in are the same form; no "user exists" leak |
| Email-bomb / brute force | Per-email and per-IP rate limit (5 / 15 min) |
| Inquiry spam | Per-buyer rate limit (10 / hr) |
| Session theft over HTTP | `httpOnly`, `sameSite=lax`, `secure` in production |
| Stale sessions | 30-day TTL with sliding refresh; deleted on access if expired |
| Reserved-handle squatting | Reserved set blocked at onboarding and in profile edit |
| Email header injection | CRLF stripped from user-controlled fields used in email bodies |
| Owner-only mutations | `requireOwner` runs on every listing update / delete |
| Cross-user inquiry access | Buyer/creator equality check on every thread read and reply |
| Input length caps | All free-text fields capped via Zod (e.g. inquiry goal max 5000) |

## Open items deliberately deferred

These would matter once you're past the first ~20 makers, not before:

- Search and tag pages
- Per-creator analytics
- Saved searches + weekly digest
- Real-time notifications
- NDA / scoping doc upload
- Featured-placement payments and verified-maker subscription (v2 monetization)
