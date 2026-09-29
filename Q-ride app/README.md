# Q-Ride

**Move Smarter. Ride Better.** Built by MB-Connect Dev Team.

This independent application is the Q-Ride foundation and interactive customer/driver/operations experience. It intentionally does not alter the existing ResolveDesk product.

## Run locally

1. Copy `.env.example` to `.env.local` and fill in development-only values.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.
4. Apply `supabase/migrations/20260918090000_qride_foundation.sql` to a new Supabase project before connecting live data.

The browser experience uses a deterministic local quote for presentation. The server endpoint at `POST /api/fare-estimate` validates inputs and is the starting point for an authenticated, provider-backed quote API.

## Foundation included

- Original Q-Ride responsive customer booking, driver command, and operations views.
- Server-side fare quote with configurable category pricing boundary.
- Schema for city/category configuration, driver verification, rides, negotiations, payment attempts, immutable wallet ledger, tokens, and dated configuration.
- Participant/staff RLS policies and append-only financial/token ledger enforcement.

Before production launch, implement authenticated RPC/API services for dispatch, payment-provider webhooks, RoutePass scheduling, document storage, corporate billing, notification delivery, and the admin Configuration Centre. Those processes must use the stated transaction and idempotency boundaries.
