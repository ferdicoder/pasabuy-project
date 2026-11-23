# Table purposes

Quick reference for each table in `tables/*.sql` — what it's for and the one non-obvious
fact. Columns/relationships are documented in the [ER diagram](./mermaid.md); this file
only explains intent.

## Better Auth (written by the SDK — don't modify from app SQL)

| Table | Purpose |
|---|---|
| `user` | App account root; every app FK points here |
| `session` | Cookie sessions (7d expiry, 5min cookie cache) |
| `account` | Credentials/OAuth tokens per user — email+password login lives in `password` |
| `verification` | One-time email verification / OTP values (keyed by `identifier`, no FK to `user`) |

## Core marketplace

| Table | Purpose |
|---|---|
| `requests` | Buyer postings: item, price, weight, route (`from/to_place_code`), status `active/taken/inactive` |
| `trips` | Traveler itineraries: capacity, `reserved_kg` (kept in sync by transaction triggers), status `open/full/in_transit/completed/cancelled` |
| `matches` | Proposed/accepted pairing of one request ↔ one trip; unique `(request_id, trip_id)` and only one accepted match per request |
| `messages` | Chat inside a match (`body` XOR `image_url`, `read_at` for unread) |

## Money (DB-trigger-driven — no routes/services exist yet)

| Table | Purpose |
|---|---|
| `transactions` | Order lifecycle per match (1:1): fees, generated `total_price`, status `awaiting_purchase → purchased → in_transit → delivered → completed` (or `cancelled/disputed`) |
| `transaction_events` | Immutable audit log of every status change (from/to status, actor, note) |

## Matching engine

| Table | Purpose |
|---|---|
| `match_outbox` | Trigger-filled queue ("re-match this request/trip"); drained by `npm run worker:match` |
| `match_outbox_dead` | Dead-letter rows when `process_match_outbox()` fails (stores the `error`) |
| `match_candidates` | Scored request↔trip pairs + notify/dismiss/consume timestamps — what the buyer/traveler feeds show |
| `match_score_config` | Versioned scoring weights (`w_fit`/`w_timing`/`w_age`/`w_locality` sum to 1, halflife, `max_match_km`) |

## PSGC geography

| Table | Purpose |
|---|---|
| `regions` | Top-level PSGC regions (10-digit codes, island group) |
| `provinces` | Provinces within a region |
| `places` | Cities/municipalities with coords + trigram-search columns (`search_name`/`exact_name`) |
| `place_aliases` | Normalized nicknames ("qc", "cdo") → place, for `resolve_place()` |
| `place_proximity` | Precomputed pairwise distances ≤ 60 km (locality scoring) |
