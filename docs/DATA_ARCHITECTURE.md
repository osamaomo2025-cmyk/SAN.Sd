# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL ENTERPRISE DATA ARCHITECTURE & FIRESTORE MODEL (v1.0.0)

---

## 1. DATA ARCHITECTURE PHILOSOPHY & EXECUTIVE OVERVIEW

This specification outlines the authoritative **Enterprise Data Architecture** and **Cloud Firestore Schema Model** for the Sudan Digital Ministry of Commerce & Industry. Developed in alignment with the national **"Sovereign Digital Infrastructure Strategy"**, this model is optimized for high performance, infinite scalability, cost efficiency, and instant compatibility with **Google Firebase Studio** and Cloud Firestore (Enterprise Edition).

Our architectural layout moves away from traditional relational constraints while maintaining strict logical referential integrity, avoiding the "deep-nesting" anti-patterns that create write limitations and query bottlenecks in Firestore. It uses a **hybrid flat/shallow collection hierarchy** designed for millisecond-grade reads, robust localized indexing, and secure role-based queries.

```
       [ SHALLOW RELATIONAL TOPOLOGY ]
       
    users (Top-Level) ───────────────┐ (1:1 Auth & PII Split)
      └─ private_profiles (Nested)   │
                                     ▼
                                 companies (Top-Level) 
                                     │
            ┌────────────────────────┴────────────────────────┐
            ▼                                                 ▼
      shareholders (Subcollection)                      documents (Subcollection)
      - Max 10 per doc; bounded.                        - Linked via cryptographic hashes.
```

---

## 2. FIRESTORE COLLECTION & DOCUMENT CATALOG

### 2.1 Collection Naming & Path Standards
*   **Case Sensitivity:** All collection names, subcollections, document paths, and field keys must be defined in strict `snake_case`.
*   **Pluralization:** Top-level collection names and subcollection names must always be plural (e.g., `companies`, `users`, `notifications`).
*   **Immutable Document IDs:** Document IDs must never be auto-incremented integers or contain raw personal data. They must either use:
    *   **Firebase Auth UID:** For user-aligned documents (e.g., `/users/{uid}`).
    *   **High-Entropy UUIDv4 / Push IDs:** For transaction and workflow documents (e.g., `/applications/{uuid}`).
    *   **Deterministic Business Keys:** For unique national identifiers (e.g., `/commercial_names/{sanitized_arabic_name}`).

### 2.2 System Partitioning & Scaling Limits
1.  **Bounded Lists (Subcollections vs. Arrays):** Unbounded lists (such as invoices, transaction logs, or chat messages) must **never** be stored as arrays inside a parent document due to the Firestore 1MB document size limit. They must be stored in subcollections. Arrays are strictly reserved for bounded arrays with a maximum size of 20 elements (e.g., `tags`, `categories_ids`, or `multi_step_workflow_checkpoints`).
2.  **Sharding Constraints (The 10,000 QPS Rule):** Any document that experiences a write frequency higher than 1 write per second (e.g., global transaction counters, visitor counters) must employ a distributed counter architecture with **5 shards** stored under `[collection_name]_shards` to prevent hot-spotting.

---

## 3. GOVERNMENT DATA DOMAIN MODEL (EXHAUSTIVE)

---

### 3.1 IDENTITY DOMAIN (`domain_identity`)

Contains identity profiles for citizens, foreign investors, ministry employees, and corporate entities.

```
+---------------------------------------------------------------------------------+
|                             IDENTITY DOMAIN LAYOUT                              |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  /users/{uid} [Top-Level]                                                       |
|    ├── (Public profile: displayName, email_hash, role)                          |
|    │                                                                            |
|    └── /private_profiles/pii [Nested Document]                                  |
|          └── (Restricted PII: national_id, phone_number, passport_number)       |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

#### 3.1.1 Entity: User Profile (`users`)
*   **Arabic Name:** ملف تعريف المستخدم
*   **English Name:** User Profile
*   **Business Purpose:** The central registration and authentication record for every individual accessing the Ministry’s portal.
*   **Collection Name:** `users`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:**
    *   `private_profiles` (Path: `/users/{uid}/private_profiles/pii`) - Isolated collection to restrict access to Personally Identifiable Information (PII) to the owner and authorized administrative systems.
*   **Primary Fields:**
    *   `uid`: `string` (Matches Firebase Authentication UID)
    *   `display_name_ar`: `string` (Arabic display name)
    *   `display_name_en`: `string` (English display name)
    *   `email`: `string` (Registered email address)
    *   `role`: `string` (Enum: `citizen`, `investor`, `employee`, `inspector`, `auditor`, `admin`)
    *   `status`: `string` (Enum: `pending_verification`, `active`, `suspended`)
    *   `created_at`: `timestamp` (Server-generated)
    *   `updated_at`: `timestamp` (Server-generated)
*   **Optional Fields:**
    *   `avatar_url`: `string` (Link to Cloud Storage bucket)
    *   `preferred_language`: `string` (Default: `ar`, Enum: `ar`, `en`)
*   **Relationships:**
    *   `users` ──(1:1)── `/users/{uid}/private_profiles/pii` (Strict split)
    *   `users` ──(1:N)── `companies` (via `shareholders` reference)
*   **Lifecycle:** Created during Firebase Auth registration; suspended by Ministry administrators; deleted only upon official sovereign security request (retained for 15 years post-deactivation).
*   **Owner:** Director of Information Technology & Cybersecurity
*   **Retention Policy:** 15 Years active, then archived to Cold Vault.
*   **Security Classification:** `CONFIDENTIAL` (Core collection) / `RESTRICTED_PII` (Subcollection)
*   **Index Requirements:**
    *   Single-field: `role` (Ascending), `status` (Ascending)
    *   Composite: `role` (Ascending) + `status` (Ascending) + `created_at` (Descending)
*   **Searchability:** Searchable by `display_name_ar`, `display_name_en`, and `email`.
*   **AI Metadata:**
    *   `ai_profile_summary`: `string` (Dynamic vector pointer for automated services)
    *   `ai_sentiment_score`: `number` (Average sentiment rating of support interactions)
*   **Audit Requirements:** Full immutable write logs on status transition or role modifications.

---

### 3.2 COMMERCIAL REGISTRY DOMAIN (`domain_commercial_registry`)

The central digital sovereign ledger containing all company incorporations, trade name registrations, and industrial capacities.

```
+---------------------------------------------------------------------------------+
|                       COMMERCIAL REGISTRY DOMAIN LAYOUT                         |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  /companies/{company_id} [Top-Level]                                            |
|    ├── /shareholders [Subcollection] (Linked to users/{uid})                    |
|    ├── /directors [Subcollection] (Authorized signatories)                      |
|    ├── /certificates [Subcollection] (Tax, Commercial Registry Certificates)    |
|    └── /amendments [Subcollection] (Historical corporate updates)               |
|                                                                                 |
|  /commercial_names/{normalized_name} [Top-Level]                                |
|    └── (Sovereign namespace lock preventing duplicate trade names)              |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

#### 3.2.1 Entity: Company (`companies`)
*   **Arabic Name:** ملف الشركة التجاري
*   **English Name:** Corporate File
*   **Business Purpose:** Holds the official registration, trade activity, and operating status of a business.
*   **Collection Name:** `companies`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:**
    *   `shareholders` (Path: `/companies/{company_id}/shareholders/{shareholder_id}`)
    *   `directors` (Path: `/companies/{company_id}/directors/{director_id}`)
    *   `certificates` (Path: `/companies/{company_id}/certificates/{cert_id}`)
    *   `amendments` (Path: `/companies/{company_id}/amendments/{amendment_id}`)
*   **Primary Fields:**
    *   `company_id`: `string` (UUIDv4)
    *   `tax_identification_number`: `string` (Unique 9-digit corporate tax ID)
    *   `commercial_registry_number`: `string` (Unique official CR code)
    *   `legal_form`: `string` (Enum: `llc`, `plc`, `sole_proprietorship`, `partnership`)
    *   `capital_sdg`: `number` (Declared capitalization in SDG)
    *   `business_activities`: `array` (List of active ISIC-4 activity codes)
    *   `registration_date`: `timestamp`
    *   `status`: `string` (Enum: `pending_approval`, `active`, `renew_overdue`, `suspended`, `cancelled`)
    *   `created_at`: `timestamp`
    *   `updated_at`: `timestamp`
*   **Optional Fields:**
    *   `website`: `string`
    *   `headquarters_address_id`: `string` (Points to `addresses` collection)
*   **Relationships:**
    *   `companies` ──(1:N)── `shareholders`
    *   `companies` ──(1:N)── `directors`
    *   `companies` ──(1:N)── `licenses` (via reference key `company_id`)
*   **Lifecycle:** Transitions from `pending_approval` ──► `active` upon registry payment; moves to `renew_overdue` if annual renewal lapses; moves to `suspended` or `cancelled` via administrative order.
*   **Owner:** Registrar General of Companies
*   **Retention Policy:** Infinite (Sovereign Corporate Ledger)
*   **Security Classification:** `PUBLIC_RECORD` (Basic fields) / `RESTRICTED` (Tax & Financial fields)
*   **Index Requirements:**
    *   Single-field: `commercial_registry_number` (Unique), `tax_identification_number` (Unique)
    *   Composite: `status` (Ascending) + `registration_date` (Descending)
*   **Searchability:** High. Full bilingual indexes on corporate name and registration code.
*   **AI Metadata:**
    *   `ai_risk_assessment_index`: `number` (Predictive score of financial filing compliance)
    *   `isic_cluster_vector`: `array` (ML embedding for economic clustering)
*   **Audit Requirements:** Strict logging of all shareholder equity adjustments and capital modifications.

---

#### 3.2.2 Entity: Commercial Name (`commercial_names`)
*   **Arabic Name:** الاسم التجاري
*   **English Name:** Commercial Name
*   **Business Purpose:** A unique namespace reservation registry that locks and protects corporate names in Arabic and English, preventing duplication.
*   **Collection Name:** `commercial_names`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `name_id`: `string` (Sovereign Hash of the normalized Arabic name, e.g., `النيل_للمقاولات`)
    *   `name_ar`: `string` (Exact registered Arabic corporate name)
    *   `name_en`: `string` (Exact registered English corporate name)
    *   `company_id`: `string` (Linked corporate file ID once approved)
    *   `status`: `string` (Enum: `reserved`, `registered`, `released`, `disputed`)
    *   `reserved_by_uid`: `string` (Link to user profile ID)
    *   `expiration_date`: `timestamp` (Name reservation expires after 90 days if registration is not finalized)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `commercial_names` ──(1:1)── `companies`
    *   `commercial_names` ──(1:1)── `users` (via `reserved_by_uid`)
*   **Lifecycle:** `reserved` (90-day lock) ──► `registered` (tied to approved corporate file) ──► `released` (freed to public space if unpaid or cancelled).
*   **Owner:** Registrar General of Companies
*   **Retention Policy:** Infinite for active registrations; 2 years historical retention post-release.
*   **Security Classification:** `PUBLIC_RECORD`
*   **Index Requirements:**
    *   Single-field: `name_ar` (Unique), `name_en` (Unique)
*   **Searchability:** Highly optimized for phonetic variations and fuzzy name queries.
*   **AI Metadata:**
    *   `phonetic_signature_ar`: `string` (Arabic double-metaphone representation to detect similar sounding trade names)
    *   `phonetic_signature_en`: `string` (English Soundex signature)
*   **Audit Requirements:** Creation, extension, and dispute logging.

---

### 3.3 INDUSTRIAL SERVICES DOMAIN (`domain_industrial_services`)

Governs manufacturing permits, factory operating metrics, machinery imports, and production quotas.

```
+---------------------------------------------------------------------------------+
|                        INDUSTRIAL SERVICES DOMAIN LAYOUT                        |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  /factories/{factory_id} [Top-Level]                                            |
|    ├── /production_lines [Subcollection] (Hourly metrics & capacity bounds)     |
|    └── /machinery_ledger [Subcollection] (Serial numbers, customs duty waivers) |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

#### 3.3.1 Entity: Factory Profile (`factories`)
*   **Arabic Name:** السجل الصناعي للمصنع
*   **English Name:** Industrial Factory Registry
*   **Business Purpose:** Details factory location, industrial classification, registered production capacities, and import duty waivers.
*   **Collection Name:** `factories`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:**
    *   `production_lines` (Path: `/factories/{factory_id}/production_lines/{line_id}`)
    *   `machinery_ledger` (Path: `/factories/{factory_id}/machinery_ledger/{machinery_id}`)
*   **Primary Fields:**
    *   `factory_id`: `string` (UUIDv4)
    *   `company_id`: `string` (Parent company file ID)
    *   `industrial_registry_number`: `string` (Unique official IR code)
    *   `sub_sector`: `string` (Enum: `food_processing`, `textiles`, `pharmaceuticals`, `cement_mining`, `chemical`)
    *   `power_source`: `string` (Enum: `national_grid`, `solar_diesel_hybrid`, `generators`)
    *   `annual_energy_allowance_kwh`: `number`
    *   `status`: `string` (Enum: `operational`, `under_construction`, `inactive`, `suspended`)
    *   `created_at`: `timestamp`
*   **Optional Fields:**
    *   `coordinates`: `geopoint` (Latitude and Longitude for mapping and inspections)
    *   `raw_materials_origin`: `string` (Percentage of local vs imported materials)
*   **Relationships:**
    *   `factories` ──(1:1)── `companies` (via `company_id` lookup)
    *   `factories` ──(1:N)── `inspections` (via `factory_id` reference key)
*   **Lifecycle:** Transitions from `under_construction` ──► `operational` upon successful inspection; subject to annual capacity audits.
*   **Owner:** Director General of Industrial Affairs
*   **Retention Policy:** 30 Years after decommissioning.
*   **Security Classification:** `RESTRICTED` (Proprietary factory capacity details)
*   **Index Requirements:**
    *   Single-field: `industrial_registry_number` (Unique)
    *   Composite: `sub_sector` (Ascending) + `status` (Ascending)
*   **Searchability:** Searchable by sector, region, and parent company.
*   **AI Metadata:**
    *   `capacity_utilization_forecast`: `number` (AI predictive capacity model output)
    *   `anomaly_warning`: `boolean` (Flagged if monthly raw material inputs mismatch typical outputs)
*   **Audit Requirements:** Comprehensive logging of all import tax-waiver requests and machinery list approvals.

---

### 3.4 INVESTMENT DOMAIN (`domain_investment`)

Manages national investment licenses, priority projects, tax exemptions, and public-private partnership joint ventures.

#### 3.4.1 Entity: Investment Application (`investments`)
*   **Arabic Name:** طلب ترخيص استثماري
*   **English Name:** Investment Application
*   **Business Purpose:** Processes high-value investments requesting national strategic status, tax holidays, and customs exemptions.
*   **Collection Name:** `investments`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `investment_id`: `string` (UUIDv4)
    *   `investor_uid`: `string` (Foreign or domestic investor's user profile ID)
    *   `project_name_ar`: `string` (Arabic project name)
    *   `project_name_en`: `string` (English project name)
    *   `investment_sector`: `string` (Enum: `agriculture`, `mining`, `manufacturing`, `infrastructure`, `energy`)
    *   `proposed_investment_usd`: `number` (Funding amount in USD)
    *   `incentives_requested`: `array` (List of tax holidays or customs waiver codes)
    *   `status`: `string` (Enum: `submitted`, `under_review`, `inter_ministerial_clearance`, `approved`, `rejected`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `investments` ──(1:1)── `users` (via `investor_uid`)
    *   `investments` ──(1:N)── `workflows` (via `investment_id` transition logs)
*   **Lifecycle:** Subject to multi-tier evaluations across Ministry departments; final approval generates a cryptographic **Strategic Investment License Certificate**.
*   **Owner:** National Commissioner for Investment
*   **Retention Policy:** Infinite (Sovereign Investment Directory)
*   **Security Classification:** `HIGHLY_CONFIDENTIAL` (Protects high-value investment capital data)
*   **Index Requirements:**
    *   Composite: `investment_sector` (Ascending) + `status` (Ascending) + `created_at` (Descending)
*   **Searchability:** Restricted to authorized administrative officials and security units.
*   **AI Metadata:**
    *   `ai_macro_economic_feasibility`: `number` (Predictive regional job generation and economic return index)
    *   `capital_repatriation_risk`: `string` (Enum: `LOW`, `MEDIUM`, `HIGH`)
*   **Audit Requirements:** Complete audit trail logging every reviewer comment, voting record, and status modification.

---

### 3.5 CONSUMER PROTECTION DOMAIN (`domain_consumer_protection`)

Coordinates commodity price limits, warehouse inventories, consumer complaints, and market surveillance operations.

#### 3.5.1 Entity: Price Declaration (`commodity_prices`)
*   **Arabic Name:** إعلان أسعار السلع الأساسية
*   **English Name:** Commodity Price Declaration
*   **Business Purpose:** Monitors regulated pricing of essential imports and locally produced commodities (such as wheat, sugar, oil, and pharmaceuticals) across diverse states in Sudan.
*   **Collection Name:** `commodity_prices`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `price_declaration_id`: `string` (UUIDv4)
    *   `commodity_code`: `string` (Enum: `wheat`, `sugar`, `cooking_oil`, `flour`, `medicine_basic`)
    *   `region`: `string` (Enum of Sudan’s 18 Federal States, e.g., `khartoum`, `red_sea`, `gezira`, `north_kordofan`)
    *   `declared_wholesale_price_sdg`: `number` (Regulated price cap)
    *   `declared_retail_price_sdg`: `number`
    *   `effective_date`: `timestamp`
    *   `status`: `string` (Enum: `active`, `superseded`, `suspended`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `commodity_prices` ──(1:N)── `complaints` (Linked to price violation reports)
*   **Lifecycle:** Declared by the Ministry's Price Control Committee; active until a newer declaration updates prices, shifting previous entries to `superseded`.
*   **Owner:** Director of Price Control & Market Surveillance
*   **Retention Policy:** 10 Years historical analytics.
*   **Security Classification:** `PUBLIC_RECORD`
*   **Index Requirements:**
    *   Composite: `commodity_code` (Ascending) + `region` (Ascending) + `effective_date` (Descending)
*   **Searchability:** Fully searchable by citizens on public portals.
*   **AI Metadata:**
    *   `ai_seasonal_inflation_projection`: `number` (Projected retail pricing fluctuation over 90 days)
    *   `arbitrage_risk_indicator`: `boolean` (True if price variance between neighboring states exceeds 15%)
*   **Audit Requirements:** Logged authorization of all tariff and price change events.

---

### 3.6 INSPECTION DOMAIN (`domain_inspection`)

Facilitates scheduled and unannounced site visits to factories, retail stores, and warehouses to enforce health, safety, and pricing compliance.

#### 3.6.1 Entity: Inspection Record (`inspections`)
*   **Arabic Name:** سجل التفتيش والرقابة
*   **English Name:** Field Inspection Record
*   **Business Purpose:** Schedules, records, and follows up on field inspections targeting regulatory compliance.
*   **Collection Name:** `inspections`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `inspection_id`: `string` (UUIDv4)
    *   `factory_id`: `string` (Linked factory profile, optional if checking a retail shop)
    *   `business_name_ar`: `string` (Target name if not a registered company)
    *   `inspector_uid`: `string` (Lead Inspector's user profile ID)
    *   `inspection_type`: `string` (Enum: `scheduled_annual`, `surprise_health_safety`, `price_gouging_investigation`)
    *   `checklist_items`: `map` (Structured key-value checkpoints, e.g., `{power_safety: "PASS", child_labor_check: "PASS", price_compliance: "FAIL"}`)
    *   `violation_detected`: `boolean`
    *   `notes_ar`: `string` (Arabic field log)
    *   `status`: `string` (Enum: `scheduled`, `in_progress`, `completed`, `pending_reinspection`, `escalated_to_legal`)
    *   `created_at`: `timestamp`
*   **Optional Fields:**
    *   `evidence_photos`: `array` (Links to secure Cloud Storage bucket containing geo-tagged photos)
    *   `fine_amount_sdg`: `number` (Assessed penalty if violation is detected)
*   **Relationships:**
    *   `inspections` ──(1:1)── `factories`
    *   `inspections` ──(1:1)── `users` (via `inspector_uid`)
*   **Lifecycle:** `scheduled` ──► `completed` upon inspector submission; flags `violation_detected: true` to generate alert pathways in the Payments and Legal domains.
*   **Owner:** Director General of Inspections & Market Enforcement
*   **Retention Policy:** 15 Years active.
*   **Security Classification:** `RESTRICTED_ADMIN`
*   **Index Requirements:**
    *   Composite: `inspector_uid` (Ascending) + `status` (Ascending) + `created_at` (Descending)
    *   Composite: `factory_id` (Ascending) + `violation_detected` (Ascending)
*   **Searchability:** Restricted to division chiefs and inspectors.
*   **AI Metadata:**
    *   `ai_predictive_risk_priority`: `number` (AI risk rating pointing to probability of compliance violations)
*   **Audit Requirements:** GPS coordinates and server-time verification when the inspection record transitions to `completed`.

---

### 3.7 COMPLAINTS DOMAIN (`domain_complaints`)

Collects citizen grievances regarding fraud, price gouging, fake goods, and complex business disputes.

#### 3.7.1 Entity: Dispute Folder (`complaints`)
*   **Arabic Name:** شكاوى ونزاعات تجارية
*   **English Name:** Trade Complaint File
*   **Business Purpose:** Tracking citizen disputes regarding corporate infractions or price hikes, and logging resolution trails.
*   **Collection Name:** `complaints`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:**
    *   `resolution_steps` (Path: `/complaints/{complaint_id}/resolution_steps/{step_id}`)
*   **Primary Fields:**
    *   `complaint_id`: `string` (UUIDv4)
    *   `reporter_uid`: `string` (Submitter user ID, optional for anonymous reporting)
    *   `reported_entity_id`: `string` (Target company ID, if known)
    *   `complaint_category`: `string` (Enum: `price_gouging`, `monopoly_practice`, `defective_goods`, `unlicensed_activity`)
    *   `description_ar`: `string` (Citizen's description of the issue)
    *   `status`: `string` (Enum: `received`, `investigating`, `action_taken`, `dismissed`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `complaints` ──(1:1)── `users` (via `reporter_uid`)
    *   `complaints` ──(1:1)── `companies` (via `reported_entity_id`)
*   **Lifecycle:** Citizen submission ──► assigned to investigative agent ──► `completed` with fine generation or `dismissed` for lack of evidence.
*   **Owner:** Director of Consumer Protection Agency
*   **Retention Policy:** 10 Years post-resolution.
*   **Security Classification:** `RESTRICTED_PII` (Reporter identity details must remain secure)
*   **Index Requirements:**
    *   Composite: `reported_entity_id` (Ascending) + `status` (Ascending)
    *   Composite: `status` (Ascending) + `created_at` (Descending)
*   **Searchability:** Reporter can query using reference codes; administration views everything.
*   **AI Metadata:**
    *   `ai_sentiment_index`: `number` (Citizen frustration rating)
    *   `intent_classification`: `string` (AI-derived intent categories)
*   **Audit Requirements:** Immutable logs tracking every review action.

---

### 3.8 LICENSING DOMAIN (`domain_licensing`)

Coordinates trade and operating permits, export authorizations, import clearances, and structural renewals.

#### 3.8.1 Entity: Business License (`licenses`)
*   **Arabic Name:** ترخيص تجاري وصناعي
*   **English Name:** Operating Business License
*   **Business Purpose:** The official legal permit issued to companies allowing operation of specific industrial or commercial tasks.
*   **Collection Name:** `licenses`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `license_id`: `string` (UUIDv4)
    *   `company_id`: `string` (Associated corporate file)
    *   `license_type`: `string` (Enum: `general_trade`, `industrial_operating`, `strategic_import_permit`)
    *   `issue_date`: `timestamp`
    *   `expiration_date`: `timestamp` (Usually 1 year from issue)
    *   `cryptographic_signature_hash`: `string` (Sovereign verify hash validating issuer authenticity)
    *   `status`: `string` (Enum: `active`, `expired`, `suspended`, `revoked`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `licenses` ──(1:1)── `companies`
    *   `licenses` ──(1:1)── `payments` (via reference `invoice_id`)
*   **Lifecycle:** Payment confirmation ──► issue `active` status with signature hash; auto-shifts to `expired` on date rollover.
*   **Owner:** Director General of Licensing & Registrations
*   **Retention Policy:** Infinite ledger.
*   **Security Classification:** `PUBLIC_RECORD`
*   **Index Requirements:**
    *   Single-field: `company_id` (Ascending)
    *   Composite: `license_type` (Ascending) + `status` (Ascending) + `expiration_date` (Descending)
*   **Searchability:** High. Searchable by public APIs to verify corporate status.
*   **AI Metadata:**
    *   `renewal_likelihood_score`: `number` (AI predictive probability of business renewal)
*   **Audit Requirements:** Immutable tracking of creation and revocation events.

---

### 3.9 PAYMENTS DOMAIN (`domain_payments`)

Coordinates all monetary transactions, fee collections, electronic invoice generations, and refund clearances.

#### 3.9.1 Entity: Financial Invoice (`payments`)
*   **Arabic Name:** فاتورة المعاملة المالية
*   **English Name:** Monetary Invoice
*   **Business Purpose:** Records administrative fees, trade registration fees, fines, and payment confirmations via national channels (e.g., Sudan Electronic Payment System - SEPS).
*   **Collection Name:** `payments`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `invoice_id`: `string` (Unique reference ID, e.g., `MCI-2026-981249`)
    *   `payer_uid`: `string` (User profile ID of the paying entity)
    *   `amount_sdg`: `number` (Amount in SDG)
    *   `payment_gateway_ref`: `string` (Transaction hash returned by the central clearing bank)
    *   `payment_method`: `string` (Enum: `seps`, `syberpay`, `bank_of_khartoum_p2p`, `credit_card`)
    *   `fees_breakdown`: `map` (Itemized charges, e.g., `{base_registration: 45000, postal_duty: 5000}`)
    *   `status`: `string` (Enum: `unpaid`, `processing`, `paid`, `refunded`, `failed`)
    *   `created_at`: `timestamp`
    *   `paid_at`: `timestamp` (Nullable until paid)
*   **Relationships:**
    *   `payments` ──(1:1)── `users` (via `payer_uid`)
*   **Lifecycle:** Created as `unpaid` ──► transition to `processing` during transaction ──► shifts to `paid` upon central bank confirmation. Unpaid invoices expire after 14 days.
*   **Owner:** Director of Financial Services & Revenue Reconciliation
*   **Retention Policy:** 15 Years (Sovereign Audit & Tax Records)
*   **Security Classification:** `RESTRICTED_FINANCIAL`
*   **Index Requirements:**
    *   Single-field: `payment_gateway_ref` (Unique)
    *   Composite: `payer_uid` (Ascending) + `status` (Ascending) + `created_at` (Descending)
*   **Searchability:** Accessible by payers and billing auditors.
*   **AI Metadata:**
    *   `ai_fraud_risk_score`: `number` (Risk matrix score flag)
*   **Audit Requirements:** Full dual-entry transaction audits; zero write permissions post-payment validation.

---

### 3.10 NOTIFICATIONS DOMAIN (`domain_notifications`)

Tracks standard citizen broadcasts, multi-channel SMS warnings, email updates, and targeted administration directives.

#### 3.10.1 Entity: Notification Log (`notifications`)
*   **Arabic Name:** إشعار المعاملة الرقمي
*   **English Name:** Notification Record
*   **Business Purpose:** Holds SMS, Email, and in-portal alerts sent to citizens and corporate representatives.
*   **Collection Name:** `notifications`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `notification_id`: `string` (UUIDv4)
    *   `recipient_uid`: `string` (Target user profile ID)
    *   `channel`: `string` (Enum: `portal_inbox`, `sms`, `email`, `multichannel_all`)
    *   `title_ar`: `string` (Arabic alert header)
    *   `title_en`: `string` (English alert header)
    *   `message_ar`: `string` (Arabic body text)
    *   `message_en`: `string` (English body text)
    *   `is_read`: `boolean` (Only for portal inbox channel)
    *   `delivery_status`: `string` (Enum: `queued`, `dispatched`, `delivered`, `failed`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `notifications` ──(1:1)── `users` (via `recipient_uid`)
*   **Lifecycle:** Placed in queue ──► processed by messaging workers ──► updated to `delivered` or `failed`.
*   **Owner:** Director of Digital Public Relations & Communications
*   **Retention Policy:** 3 Years (Automated disposal thereafter)
*   **Security Classification:** `CONFIDENTIAL` (Private citizen notifications)
*   **Index Requirements:**
    *   Composite: `recipient_uid` (Ascending) + `is_read` (Ascending) + `created_at` (Descending)
*   **Searchability:** Inbox retrieval functions.
*   **AI Metadata:**
    *   `optimal_dispatch_hour`: `number` (Predictive time window when recipient is most active)
*   **Audit Requirements:** Transmission time verification.

---

### 3.11 DOCUMENT MANAGEMENT DOMAIN (`domain_document_management`)

Stores digital sovereign documents, verified signature credentials, certificate indexes, and corporate filings.

#### 3.11.1 Entity: Document Reference (`documents`)
*   **Arabic Name:** مرجع المستندات الرسمي
*   **English Name:** Official Document Reference
*   **Business Purpose:** Tracks metadata and access credentials for documents stored in secure, private Cloud Storage buckets.
*   **Collection Name:** `documents`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `document_id`: `string` (UUIDv4)
    *   `associated_entity_id`: `string` (Linked Company, Factory, or Application ID)
    *   `file_name`: `string` (Clean sanitized filename)
    *   `storage_bucket_path`: `string` (Pointer to secure object path in Google Cloud Storage)
    *   `mime_type`: `string` (Enum: `application/pdf`, `image/jpeg`, `image/png`)
    *   `sha256_checksum`: `string` (Hash confirming file integrity)
    *   `uploaded_by_uid`: `string` (User profile ID of the uploader)
    *   `status`: `string` (Enum: `pending_validation`, `validated`, `corrupted`, `archived`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `documents` ──(1:1)── `users` (via `uploaded_by_uid`)
*   **Lifecycle:** Uploaded files undergo background antivirus and hash validation; archived documents remain read-only.
*   **Owner:** Sovereign Archive Commissioner
*   **Retention Policy:** 25 Years.
*   **Security Classification:** `RESTRICTED_DOCUMENTS`
*   **Index Requirements:**
    *   Single-field: `sha256_checksum` (Unique)
    *   Composite: `associated_entity_id` (Ascending) + `status` (Ascending)
*   **Searchability:** Fast retrieval by parent entities.
*   **AI Metadata:**
    *   `ai_content_ocr_ready`: `boolean` (True if text content has been processed and indexed)
    *   `document_classification`: `string` (AI-suggested category, e.g., `articles_of_association`)
*   **Audit Requirements:** Immutable read logs tracking every download attempt.

---

### 3.12 WORKFLOW DOMAIN (`domain_workflow`)

Manages multi-tier review workflows, approval chains, departmental assignments, and performance SLA triggers.

#### 3.12.1 Entity: Workflow Instance (`workflows`)
*   **Arabic Name:** تفاصيل مسار المعاملة
*   **English Name:** Workflow Progress Instance
*   **Business Purpose:** Evaluates current processing states of registration requests, licensing steps, and joint ventures against performance SLAs.
*   **Collection Name:** `workflows`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:**
    *   `transition_history` (Path: `/workflows/{workflow_id}/transition_history/{step_id}`)
*   **Primary Fields:**
    *   `workflow_id`: `string` (UUIDv4)
    *   `target_application_id`: `string` (Associated company file or license request ID)
    *   `assigned_department`: `string` (Enum: `corporate_registrar`, `licensing_division`, `price_surveillance`, `ministerial_council`)
    *   `current_step`: `string` (Enum: `reviewing_documentation`, `fee_reconciliation`, `site_inspection_pending`, `final_signature_issue`)
    *   `sla_due_date`: `timestamp` (Target milestone resolution limit)
    *   `sla_status`: `string` (Enum: `on_time`, `delayed`, `breached`)
    *   `status`: `string` (Enum: `active`, `suspended`, `completed`, `cancelled`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `workflows` ──(1:N)── `transition_history`
*   **Lifecycle:** Initialized on application submission; closed upon certificate issue or refusal; triggers alerts if delayed past SLA limits.
*   **Owner:** Director General of Digital Operations & Public Performance
*   **Retention Policy:** 10 Years post-completion.
*   **Security Classification:** `INTERNAL_ADMIN`
*   **Index Requirements:**
    *   Composite: `assigned_department` (Ascending) + `sla_status` (Ascending) + `sla_due_date` (Ascending)
*   **Searchability:** Administrative team dashboards.
*   **AI Metadata:**
    *   `ai_delay_probability`: `number` (AI-derived probability of SLA breach)
    *   `recommended_assignee_uid`: `string` (AI employee matchmaking recommendation)
*   **Audit Requirements:** Comprehensive logging of transition states and assignee changes.

---

### 3.13 AI DOMAIN (`domain_ai`)

Tracks assistant sessions, trade analysis models, and phonetic conflict checks.

#### 3.13.1 Entity: AI Assistant Session (`ai_sessions`)
*   **Arabic Name:** جلسة مستشار الذكاء الاصطناعي
*   **English Name:** Sovereign AI Session
*   **Business Purpose:** Logs advisory sessions with the Sovereign AI Advisor, preserving conversation contexts and recommended registry search pathways.
*   **Collection Name:** `ai_sessions`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:**
    *   `messages` (Path: `/ai_sessions/{session_id}/messages/{msg_id}`)
*   **Primary Fields:**
    *   `session_id`: `string` (UUIDv4)
    *   `user_uid`: `string` (User profile ID)
    *   `topic_context`: `string` (Enum: `company_registration_guidelines`, `customs_incentives_analysis`, `price_gouging_reporting`)
    *   `interaction_count`: `number` (To prevent resource over-use)
    *   `status`: `string` (Enum: `active`, `closed`, `archived`)
    *   `created_at`: `timestamp`
*   **Relationships:**
    *   `ai_sessions` ──(1:1)── `users` (via `user_uid`)
    *   `ai_sessions` ──(1:N)── `messages` (Unbounded - Subcollection mandatory)
*   **Lifecycle:** Automatically closed after 2 hours of inactivity.
*   **Owner:** Chief AI Architect
*   **Retention Policy:** 1 Year.
*   **Security Classification:** `CONFIDENTIAL`
*   **Index Requirements:**
    *   Composite: `user_uid` (Ascending) + `created_at` (Descending)
*   **Searchability:** Private to session owner and development testers.
*   **AI Metadata:**
    *   `ai_model_version`: `string` (e.g., `gemini-2.5-pro`)
    *   `intent_detection_confidence`: `number`
*   **Audit Requirements:** Prompt and response logging to prevent system exploitation.

---

### 3.14 REPORTING DOMAIN (`domain_reporting`)

Stores statistical summaries, trade balance histories, and regional price indexes.

#### 3.14.1 Entity: Metric Summary (`reporting_cubes`)
*   **Arabic Name:** ملخص المؤشرات الاقتصادية
*   **English Name:** Economic Indicator Cube
*   **Business Purpose:** Pre-aggregated statistical records generated by background schedulers to power executive dashboards. This avoids expensive aggregate queries across large transactional collections.
*   **Collection Name:** `reporting_cubes`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `cube_id`: `string` (Formatted key, e.g., `monthly_registrations_2026_07`)
    *   `reporting_period`: `string` (Format: `YYYY-MM` or `YYYY-DD`)
    *   `region`: `string` (Federal State name or `national_total`)
    *   `metrics`: `map` (Structured metrics, e.g., `{new_companies: 1450, capital_invested_sdg: 950000000, licensing_volume: 87}`)
    *   `generated_at`: `timestamp`
*   **Relationships:** None
*   **Lifecycle:** Immutable once written by background jobs.
*   **Owner:** Director General of Statistics & Economic Studies
*   **Retention Policy:** 50 Years (Sovereign Economic Data Ledger)
*   **Security Classification:** `PUBLIC_RECORD` / `INTERNAL_GOVERNMENT` (depending on metric details)
*   **Index Requirements:**
    *   Composite: `region` (Ascending) + `reporting_period` (Descending)
*   **Searchability:** Public and private dashboard visualizers.
*   **AI Metadata:**
    *   `trend_outlier_detected`: `boolean` (AI flags if month-on-month variance is abnormal)
*   **Audit Requirements:** Logs identifying the job executor and timestamp parameters.

---

### 3.15 AUDIT DOMAIN (`domain_audit`)

The central logging repository for security logs, administrative modifications, and credential reviews.

```
+---------------------------------------------------------------------------------+
|                              AUDIT DOMAIN LAYOUT                                |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  /audit_logs/{log_id} [Top-Level]                                               |
|    └── (Fully immutable security event profiles)                                |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

#### 3.15.1 Entity: Immutable System Audit (`audit_logs`)
*   **Arabic Name:** سجل المراجعة الرقابية
*   **English Name:** Sovereign Audit Event
*   **Business Purpose:** Tracks security-critical events, including credential updates, file downloads, administrative overrides, and database accesses.
*   **Collection Name:** `audit_logs`
*   **Parent Collection:** None (Top-Level)
*   **Subcollections:** None
*   **Primary Fields:**
    *   `log_id`: `string` (UUIDv4)
    *   `actor_uid`: `string` (User profile ID of the actor)
    *   `actor_role`: `string` (Role of the actor)
    *   `event_action`: `string` (Enum: `user_role_elevate`, `document_access`, `payment_override`, `complaint_dismiss`)
    *   `source_ip`: `string` (Actor IP)
    *   `payload_snapshot`: `map` (JSON-like before-and-after change log)
    *   `created_at`: `timestamp` (Server-generated, client cannot write or edit this collection)
*   **Relationships:**
    *   `audit_logs` ──(1:1)── `users` (via `actor_uid`)
*   **Lifecycle:** Write-once, read-only. Modification or deletion is prevented via security policies and system permissions.
*   **Owner:** Inspector General of Ministry Audits & Integrity
*   **Retention Policy:** Infinite (Minimum 25 Years)
*   **Security Classification:** `RESTRICTED_AUDIT`
*   **Index Requirements:**
    *   Composite: `actor_uid` (Ascending) + `created_at` (Descending)
    *   Composite: `event_action` (Ascending) + `created_at` (Descending)
*   **Searchability:** Limited to the Inspector General and cybersecurity forensic teams.
*   **AI Metadata:**
    *   `ai_anomaly_threat_level`: `string` (Enum: `NONE`, `LOW`, `MEDIUM`, `HIGH`)
*   **Audit Requirements:** Core component of security compliance auditing.

---

## 4. ENTITY RELATIONSHIP & REFERENCE FRAMEWORK

```
               [ SOVEREIGN DATA FLOW INTERSECTION ]

     companies (Top-Level CR) ───────┬──────► licenses (Top-Level Permissions)
                                     │         ▲
                                     │         │
                                     ▼         │
                                  payments ────┘ (Binds approval to revenue)
```

### 4.1 Denormalization Strategy (Read Performance Optimized)
To optimize data retrieval speeds and minimize the costs of join operations, this schema enforces structured denormalization:

1.  **Read Optimization Rule:** Store small, static lookup details (such as `company_name` and `commercial_registry_number`) directly in dependent documents (such as `licenses`, `applications`, or `payments`), rather than relying on dynamic lookup queries for every read.
2.  **State-Update Sync Protocol:** When a company’s primary details change (e.g., a corporate name change), a background Cloud Function updates dependent documents. This ensures updates propagate correctly while maintaining flat collection performance.

### 4.2 Relational Consistency Controls
1.  **No Direct Array Joins:** Direct arrays containing foreign keys are prohibited for collections containing more than 20 items. Relationships must use separate linking documents (such as `/companies/{id}/shareholders/{uid}`) to keep documents small and light.
2.  **Logical Cascade Checks:** When a main record is flagged as `cancelled` or `suspended` (such as a corporate registration), associated records (such as active operating licenses) are updated automatically to keep active permits aligned with company states.

---

## 5. INDEXING & QUERY OPTIMIZATION GUIDE

### 5.1 Composite Index Blueprints
To support scalable dashboard views and complex administrative queries, we define several composite indexes:

```json
{
  "indexes": [
    {
      "collectionGroup": "companies",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "registration_date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "inspections",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "inspector_uid", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "payments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "payer_uid", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ai_sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "user_uid", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": [
    {
      "collectionGroup": "users",
      "fieldPath": "email",
      "indexes": [
        { "order": "ASCENDING", "queryScope": "COLLECTION" }
      ]
    }
  ]
}
```

### 5.2 Dynamic Query Constraints
*   **Pagination Rule:** Large data views (such as corporate lists or audit logs) must use `limit()` query limits and cursor offsets (`startAfter()`) to prevent large read operations.
*   **Search Filters:** Query terms must be processed and cleaned (e.g., removing common Arabic prefixes like `ال` or `أ` / `إ` variations) to support accurate searching.

---

## 6. METADATA & NAMING STANDARDS

### 6.1 Standard Field Types & Layout
*   **Timestamps:** All time fields must use the native Firestore `Timestamp` class. String-formatted dates are prohibited.
*   **Geographical Data:** Map locations must use Firestore's native `GeoPoint` format.
*   **Financial Precision:** Currency values are stored as integers representing the smallest currency unit (e.g., `45000` SDG for 45,000 SDG) or rounded floats with a maximum of two decimal places to prevent float rounding errors.

### 6.2 Data Change Audits
Every document contains a standard audit object with the following fields:
*   `created_by_uid`: `string`
*   `created_at`: `timestamp`
*   `updated_by_uid`: `string`
*   `updated_at`: `timestamp`
*   `schema_version`: `number` (For future schema modifications)

---

## 7. DATA GOVERNANCE & SOVEREIGN DATA LIFECYCLE

```
[ Active Operations ] ──► [ Cold Storage Archival ] ──► [ Secure Cryptographic Disposal ]
  - In-memory speed         - Read-only queries             - Zero-overwrite blocks
```

### 7.1 Security Classification Standards
*   **PUBLIC_RECORD:** Public corporate names and ISIC trade classifications.
*   **CONFIDENTIAL:** Portal session activity, email addresses, and active applications under review.
*   **RESTRICTED_PII:** National ID records, personal telephone lines, passport data, and private addresses.
*   **RESTRICTED_FINANCIAL:** Payment details and tax returns.
*   **RESTRICTED_AUDIT:** Immutable system audit logs.

### 7.2 Data Retention & Secure Disposal
1.  **Archiving Cycle:** Transaction records remain active for **5 years** post-completion. They are then moved to cost-effective cold storage options (e.g., Bigtable or Cloud Storage Archive) for long-term storage.
2.  **Secure Disposal Protocol:** Temporary records (such as expired SMS alerts or system notifications) are permanently deleted after their retention period using secure deletion routines.

---

## 8. MULTILINGUAL DATA & AI-READY SCHEMA STANDARDS

### 8.1 Multilingual Support
To support both Arabic and English seamlessly without duplication, all descriptive fields are structured as maps:
```json
"business_description": {
  "ar": "شركة رائدة في مجال الاستيراد والتصدير الزراعي والحيواني",
  "en": "Leading company specializing in agricultural and livestock trade"
}
```

### 8.2 AI Readiness & Machine Learning Integration
1.  **Vector Embeddings Support:** Document profiles include a dedicated `vector_embeddings` array containing float metrics. This allows semantic matching with relevant business registrations or investment opportunities.
2.  **Predictive Flagging:** Predictive metrics are stored with clear confidence intervals (e.g., `confidence: 0.94`) and updated only via background AI models, keeping core business documents secure from direct client writes.
