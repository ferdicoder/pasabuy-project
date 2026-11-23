# Database schema

Reference for `backend/schema/tables/*.sql` — a **pull-only snapshot** of the live Neon DB
(regenerate with `scripts/pull-schema.sh`; the live DB is the source of truth).
This diagram is maintained by hand and shows key columns only (PKs, FKs, notable fields).
What each table is for: see [TABLES.md](./TABLES.md).

## ER diagram

```mermaid
erDiagram
    %% ---- Better Auth (quoted camelCase columns in SQL) ----
    user ||--o{ session : "userId CASCADE"
    user ||--o{ account : "userId CASCADE"
    user ||--o{ requests : "buyer_id fk_user_request"
    user ||--o{ trips : "user_id fk_user_trip"
    user ||--o{ matches : "proposed_by fk_match_proposed_by"
    user ||--o{ messages : "sender_id fk_message_sender"
    user ||--o{ transactions : "buyer_id fk_txn_buyer"
    user ||--o{ transactions : "traveler_id fk_txn_traveler"
    user |o--o{ transactions : "cancelled_by fk_txn_cancelled_by"
    user |o--o{ transaction_events : "actor_id fk_event_actor"

    session {
        text id PK
        text token UK
        text userId FK
        timestamptz expiresAt
    }
    account {
        text id PK
        text userId FK
        text providerId
        text accountId "UK with issuer"
        text password
    }
    verification {
        text id PK
        text identifier
        text value
        timestamptz expiresAt
    }

    %% ---- Core marketplace ----
    requests ||--o{ matches : "fk_match_request RESTRICT"
    trips ||--o{ matches : "fk_match_trip RESTRICT"
    matches ||--o{ messages : "fk_message_match CASCADE"
    matches ||--o| transactions : "match_id UK fk_txn_match"
    transactions ||--o{ transaction_events : "fk_event_txn RESTRICT"

    requests {
        uuid request_id PK
        text buyer_id FK
        text from_place_code FK
        text to_place_code FK
        request_status status
        numeric estimated_price
        numeric weight_kg
    }
    trips {
        uuid trip_id PK
        text user_id FK
        text from_place_code FK
        text to_place_code FK
        trip_status status
        int capacity_kg
        numeric reserved_kg "maintained by txn triggers"
        date depart_date
    }
    matches {
        uuid match_id PK
        uuid request_id FK
        uuid trip_id FK
        text proposed_by FK
        match_status status
        numeric proposed_fee
    }
    messages {
        uuid message_id PK
        uuid match_id FK
        text sender_id FK
        text body
        text image_url "body XOR image_url"
        timestamptz read_at
    }
    transactions {
        uuid transaction_id PK
        uuid match_id FK "UK: 1 txn per match"
        text buyer_id FK
        text traveler_id FK
        text cancelled_by FK
        transaction_status status
        numeric total_price "GENERATED STORED"
    }
    transaction_events {
        uuid event_id PK
        uuid transaction_id FK
        transaction_status from_status
        transaction_status to_status
        text actor_id FK
    }

    %% ---- Matching engine (no FKs: outbox is polymorphic) ----
    requests ||--o{ match_candidates : "fk_candidate_request CASCADE"
    trips ||--o{ match_candidates : "fk_candidate_trip CASCADE"

    match_outbox {
        uuid outbox_id PK
        text entity_type "request or trip"
        uuid entity_id "polymorphic, no FK"
    }
    match_outbox_dead {
        uuid dead_id PK
        text entity_type
        uuid entity_id
        text error
    }
    match_candidates {
        uuid candidate_id PK
        uuid request_id FK
        uuid trip_id FK "UK pair"
        numeric score "0..1"
        jsonb score_parts
        smallint score_version
        timestamptz consumed_at
    }
    match_score_config {
        smallint version PK
        numeric w_fit
        numeric w_timing
        numeric w_age
        numeric w_locality "weights sum to 1"
        numeric max_match_km
    }

    %% ---- PSGC geography ----
    regions ||--o{ provinces : "fk_province_region"
    regions ||--o{ places : "fk_place_region"
    provinces |o--o{ places : "fk_place_province nullable"
    places ||--o{ place_aliases : "fk_alias_place CASCADE"
    places ||--o{ place_proximity : "fk_prox_place CASCADE"
    places ||--o{ place_proximity : "fk_prox_near CASCADE"
    places |o--o{ requests : "fk_requests_from_place"
    places |o--o{ requests : "fk_requests_to_place"
    places |o--o{ trips : "fk_trips_from_place"
    places |o--o{ trips : "fk_trips_to_place"

    regions {
        text psgc_code PK "10 digits"
        text name
        text island_group
        bool is_active
    }
    provinces {
        text psgc_code PK
        text name
        text region_code FK
        bool is_active
    }
    places {
        text psgc_code PK
        text name
        place_kind kind
        text region_code FK
        text province_code FK
        numeric lat
        numeric lng
        text search_name "normalized, trigram-indexed"
    }
    place_aliases {
        text alias PK
        text psgc_code FK
    }
    place_proximity {
        text place_code PK, FK
        text near_code PK, FK
        numeric distance_km
    }
```

## Notes

- **Standalone tables (no FK edges above):** `verification` (Better Auth, keyed by
  `identifier`), `match_outbox` / `match_outbox_dead` (polymorphic `entity_type` +
  `entity_id` pointing at `requests`/`trips`, filled by triggers, drained by
  `npm run worker:match`), `match_score_config` (versioned scoring weights).
- **Cardinality symbols**: `||` exactly one, `|o` zero or one, `o{` zero or more.
  `matches ||--o| transactions` means each transaction has exactly one match, while a
  match may have no transaction yet; `places |o--o{ requests` means a request may have
  no place set (nullable FK).
- Enums live in `../schema/types.sql`; non-trigger functions (`process_match_outbox`,
  `resolve_place`, `search_places`, …) in `../schema/functions.sql`.
- Naming: uuid-v7 PKs `<entity>_id`, prefixes `idx_`/`fk_`/`chk_`/`uq_`/`trg_`/`fn_`;
  `pg_attver=…` lines in the SQL are pg_dump artifacts — ignore them.
