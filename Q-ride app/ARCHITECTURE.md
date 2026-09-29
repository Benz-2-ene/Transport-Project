# Q-Ride architecture

Q-Ride uses a modular TypeScript web application and Supabase PostgreSQL/Auth as the initial platform. Mobile applications consume the same versioned HTTP API; they do not contain pricing, settlement, eligibility, or state-transition rules.

## Bounded modules

`Identity & RBAC`, `Dispatch`, `Pricing`, `Payments`, `Ledger & Settlement`, `RoutePass`, `Loyalty`, `Corporate`, `Notifications`, `Support`, `Configuration`, and `Reporting` communicate through domain events. Provider adapters sit behind interfaces: `PaymentProvider`, `MapsProvider`, `MessagingProvider`, and `StorageProvider`. Provider credentials are server-only and encrypted at rest.

## Ride and financial invariants

The lifecycle is `draft → quoted → requested → assigned → driver_arrived → in_progress → completed`, with cancellation permitted according to policy. Every transition is validated server-side, persisted to `qr_ride_events`, and idempotent. Only an approved, active driver can accept a ride.

Card rides are authorized before dispatch and captured only after completion. A webhook is verified and deduplicated before changing a payment state. Completion posts immutable ledger entries in one database transaction: customer capture, driver credit, and platform commission. The default 10% commission is tax-inclusive, so no second VAT charge is added unless a dated tax configuration explicitly requires it.

## Security and operations

Supabase RLS limits rows to participants; staff access is role-based. Sensitive documents live in private storage with short-lived signed URLs. Audit events, provider webhook records, privileged configuration approval, rate limiting, idempotency keys, and structured error IDs are required at the API boundary. Background workers handle payment reconciliation, notifications, subscriptions, rewards, reporting, and document expiry.

## Deployment

Deploy separate dev/staging/production environments. Run migrations through CI; inject server secrets through the deployment secret store. Use Postgres backups/PITR, a queue worker, object storage, monitoring, and an error tracker. See `.env.example` for configuration groups.
