# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT FIRESTORE PERFORMANCE HANDBOOK: INDEXING, QUERY OPTIMIZATION, & PERFORMANCE ENGINEERING (v1.0.0)

---

## 1. PERFORMANCE PHILOSOPHY & SYSTEM ARCHITECTURE

This handbook establishes the authoritative **Enterprise Indexing, Query Optimization, and Performance Engineering Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI). Formulated under the **"National Digital Sovereignty and Infrastructure Directive"**, this specification is engineered to support millions of citizens, corporate representatives, and foreign investors, executing high-volume concurrent transactions under diverse networking conditions across all 18 Federal States of Sudan.

Our database design is optimized for **Read-Heavy Workloads** (90% reads, 10% writes) and leverages a **hybrid flat/shallow collection topology**. By structuring collections logically and implementing strict querying standards, we ensure fast performance, cost efficiency, and full compatibility with **Google Firebase Studio** and Cloud Firestore (Enterprise Edition).

```
          [ SHALLOW TOPOLOGY & DENORMALIZED HIGH-PERFORMANCE FLOW ]
          
      /companies (Top-Level Collection) 
         ├── core_fields (ID, tax_number, legal_form)
         └── denormalized_fields (name_ar, name_en, owner_name) ──► Instant Point Reads (No Joins)
                 │
                 ├──► /shareholders (Subcollection, bounded <=10 entries)
                 └──► /documents (Subcollection, tracks secure upload hashes)
```

---

## 2. ENTERPRISE QUERY ARCHITECTURE

To guarantee fast response times (under 150ms nationwide) and prevent expensive query patterns, every database inquiry must align with a pre-approved, optimized query strategy.

```
┌──────────────────────────────────────────────────────────┐
│               Standard Query Execution Policy            │
├──────────────────────────────────────────────────────────┤
│ 1. Points reads by ID are prioritized over collection scans│
│ 2. Filters must use equality bounds before inequality ones│
│ 3. Every composite query must match a defined index     │
│ 4. Sorting is strictly paired with cursor-based limit    │
│ 5. Aggregations utilize pre-aggregated reporting cubes    │
└──────────────────────────────────────────────────────────┘
```

### 2.1 Core Domain Query Profiles

#### 2.1.1 Commercial Registry & Company Lookups
*   **Purpose:** Verifying active business registry data, corporate status, and tax identification numbers.
*   **Expected Volume:** Very High (500,000+ daily searches).
*   **Read Pattern:** Point reads by `company_id` for individual files; Composite collection queries for public directory listings.
*   **Sort Strategy:** Sorted alphabetically by company name (`name_ar` or `name_en` depending on locale) or descending by `registration_date`.
*   **Filter Strategy:** Equality filter on `status` and `legal_form`; prefix search on corporate name.
*   **Pagination Strategy:** Cursor-based pagination using the company document snapshot. Offsets are strictly prohibited.
*   **Performance Considerations:** Public directory queries use local caches to reduce read counts and operational costs.

#### 2.1.2 Operating Licenses
*   **Purpose:** Checking operating permit statuses and upcoming renewals.
*   **Expected Volume:** High (100,000+ daily queries).
*   **Read Pattern:** Point reads via associated `company_id` or unique license reference key.
*   **Sort Strategy:** Sorted ascending by `expiration_date` to prioritize overdue renewals.
*   **Filter Strategy:** Equality filter on `status` (Enum: `active`, `expired`, `suspended`) and `license_type`.
*   **Pagination Strategy:** Infinite scroll with a standard page size limit of 15 records.

#### 2.1.3 Field Inspections & Safety Audits
*   **Purpose:** Accessing caseworker schedules and field safety logs.
*   **Expected Volume:** Moderate (15,000+ daily writes/reads by inspectors).
*   **Read Pattern:** Collection queries filtered by `inspector_uid` and `status` to load inspector assignments.
*   **Sort Strategy:** Sorted ascending by scheduled audit window (`scheduled_at`).
*   **Filter Strategy:** Equality filter on `inspector_uid` and `status` (Enum: `scheduled`, `in_progress`).
*   **Pagination Strategy:** Cursor-based paging aligned with scheduled dates.

#### 2.1.4 Monetary Payments & Reconciliations
*   **Purpose:** Tracking registration fee submissions and bank clearings.
*   **Expected Volume:** High (80,000+ daily transactions).
*   **Read Pattern:** Points reads by `invoice_id` for checkouts; Composite queries for administrative financial audits.
*   **Sort Strategy:** Sorted descending by payment date (`created_at`).
*   **Filter Strategy:** Equality filter on `payer_uid` and `status` (Enum: `unpaid`, `paid`, `failed`).
*   **Pagination Strategy:** Traditional 25-record page chunks with dynamic cursor bounds.

#### 2.1.5 Citizen Notification Logs
*   **Purpose:** Loading SMS logs and inbox messages in mobile applications.
*   **Expected Volume:** Extreme (1,000,000+ daily notifications).
*   **Read Pattern:** Collection queries filtered by `recipient_uid`.
*   **Sort Strategy:** Sorted descending by dispatch time (`created_at`).
*   **Filter Strategy:** Equality filter on `recipient_uid` and `is_read`.
*   **Pagination Strategy:** Cursor-based paging with a page limit of 10 alerts.

---

## 3. FIRESTORE INDEX STRATEGY

Firestore requires structured indexes to support complex queries. To prevent index limits (maximum of 200 composite indexes per database) and keep write latency low, our strategy minimizes unnecessary index creation.

```
       [ Query Request Evaluated ]
                    │
       Is it a single-field query?
                    │
         ┌──────────┴──────────┐
         ▼ YES                 ▼ NO
  [ Supported by Auto-  [ Requires Composite Index ]
   Single-Field Index ]        │
                               ▼
                        Is index defined?
                               │
                       ┌───────┴───────┐
                       ▼ YES           ▼ NO
                  [ Execute ]    [ Throw Error Code ]
```

### 3.1 Composite Index Blueprints

To support essential filtering and sorting across administrative dashboards and citizen search consoles, the following composite indexes must be defined:

#### Index Code: `IDX-COMP-001` (Company Directory)
*   **Collection Group:** `companies`
*   **Target Fields:** `status` (Ascending) + `legal_form` (Ascending) + `registration_date` (Descending)
*   **Justification:** Supports administrative dashboard views filtering companies by operational state and legal entity type, sorted by newest registrations.
*   **Cost & Maintenance Impact:** Moderate. Write latency increases slightly on company creation or status modifications.

#### Index Code: `IDX-COMP-002` (Inspector Schedule)
*   **Collection Group:** `inspections`
*   **Target Fields:** `inspector_uid` (Ascending) + `status` (Ascending) + `scheduled_at` (Ascending)
*   **Justification:** Required for field agents to load scheduled inspection lists in order of priority.
*   **Cost & Maintenance Impact:** Low. Updates occur only during field assignment changes.

#### Index Code: `IDX-COMP-003` (Finance Ledger)
*   **Collection Group:** `payments`
*   **Target Fields:** `payer_uid` (Ascending) + `status` (Ascending) + `created_at` (Descending)
*   **Justification:** Supports user transaction history dashboards, loading payment invoices by user and state, sorted by date.
*   **Cost & Maintenance Impact:** Moderate. Write-intensive during active business hours.

#### Index Code: `IDX-COMP-004` (Sovereign AI Logs)
*   **Collection Group:** `ai_sessions`
*   **Target Fields:** `user_uid` (Ascending) + `created_at` (Descending)
*   **Justification:** Drives conversation history retrieval for the AI Assistant, loading sessions for the active user sorted by date.
*   **Cost & Maintenance Impact:** Low.

### 3.2 Single-Field Index Overrides & Exceptions
By default, Firestore auto-generates single-field indexes for every document attribute. To prevent index bloating and save storage space, we apply **Single-Field Index Exemptions** to fields that are never queried individually:
*   Exempt fields: `avatar_url`, `website`, `coordinates`, `checklist_items` map, and `payload_snapshot` map.
*   Exempting these fields saves storage space and reduces index write times by up to **20%**.

---

## 4. QUERY & PAGINATION STANDARDS

To maintain predictable read costs and rapid page load speeds, the Ministry platform strictly enforces a **Zero Offset-Pagination Mandate**.

```
  [ UNOPTIMIZED OFFSET PATTERN (PROHIBITED) ]
  db.collection("companies").orderBy("registration_date").offset(10000).limit(20)
  --> Reads and discards 10,000 documents! (High latency + High costs)

  [ OPTIMIZED CURSOR PATTERN (ENFORCED) ]
  db.collection("companies").orderBy("registration_date").startAfter(lastVisibleDoc).limit(20)
  --> Reads exactly 20 documents starting from the cursor snapshot. (Low latency + Minimum costs)
```

### 4.1 Pagination Code Pattern (Typescript Standards)
When fetching paginated collections, components must track the **last visible document snapshot** as a reference cursor:

```typescript
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  QueryDocumentSnapshot, 
  DocumentData 
} from "firebase/firestore";
import { db } from "./firebase-config";

interface FetchParams {
  pageSize: number;
  lastDocCursor: QueryDocumentSnapshot<DocumentData> | null;
}

export async function fetchPaginatedCompanies({ pageSize, lastDocCursor }: FetchParams) {
  let companyQuery = query(
    collection(db, "companies"),
    orderBy("registration_date", "desc"),
    limit(pageSize)
  );

  if (lastDocCursor) {
    companyQuery = query(
      collection(db, "companies"),
      orderBy("registration_date", "desc"),
      startAfter(lastDocCursor),
      limit(pageSize)
    );
  }

  const querySnapshot = await getDocs(companyQuery);
  const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { items, nextCursor };
}
```

### 4.2 Large Dataset Navigation Guidelines
1.  **Strict Limit Enforcements:** Every collection scan must include an explicit `limit()` constraint (maximum default limit is 50 records per read).
2.  **Stable Ordering requirement:** Pagination queries must use a secondary stable sort field (such as `__name__`, which represents the unique Document ID) to prevent record-skipping during active data writes.

---

## 5. SEARCH OPTIMIZATION FRAMEWORK

Firestore lacks native full-text or fuzzy search features. To support robust searches in both **Arabic (RTL)** and **English (LTR)**, the platform uses a hybrid search strategy.

```
                           [ Search Query Entered ]
                                      │
                         Is it a simple prefix search?
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼ YES                                     ▼ NO
     [ Prefix String Matching ]                 [ Full-Text / Fuzzy Search ]
     - e.g., name >= "النيل"                     - Forwarded to external search indices
     - name <= "النيل\uf8ff"                     - Powered by Elasticsearch / Algolia
                                                 - Returns list of verified document IDs
```

### 5.1 Bilingual Prefix Searching
Simple prefix matching (e.g., autocomplete search fields) is handled directly in Firestore using string boundary constraints:
*   *Arabic Autocomplete Query:* `db.collection("companies").orderBy("name_ar").startAt("النيل").endAt("النيل\uf8ff")`
*   *Unicode Limit Marker:* The `\uf8ff` character represents a high-value Unicode marker, forcing the query to return all documents starting with the specified prefix.

### 5.2 Full-Text & Fuzzy Search Integrations
For complex queries (such as search-as-you-type, phonetic matching, or typo-tolerant searches), the platform integrates with an external index service (such as Elasticsearch, Meilisearch, or Algolia):
1.  **Synchronized Sync pipeline:** A background Cloud Function triggers on document writes under `/companies` and `/commercial_names`, transforming content and pushing key fields to the external search engine.
2.  **Arabic Normalization Rules:** Arabic text is normalized before indexing to improve match rates (e.g., removing vowel markings (Tashkeel), consolidating variations of Alef (`أ`, `إ`, `آ` to `ا`), and normalizing Teh Marbuta (`ة` to `ه`)).
3.  **Sovereign Soundex Algorithm:** Uses phonetic hashing algorithms (such as Double Metaphone for English and custom phonetic models for Arabic) to flag and prevent similar sounding trade names from being registered.

---

## 6. DATA DENORMALIZATION GUIDE

To achieve fast point-read performance and avoid expensive multi-document joins, we selectively denormalize key attributes. This trades slight write complexity for major read performance improvements.

```
┌──────────────────────────────────────────────────────────┐
│              Denormalization Lifecycle Loop              │
├──────────────────────────────────────────────────────────┤
│ 1. User updates primary profile details in /users/{uid}   │
│ 2. Document is written, updating user master record      │
│ 3. Cloud Function catches event and queues sync job     │
│ 4. Background jobs update company and license files      │
│ 5. Audit event logs complete sync operations             │
└──────────────────────────────────────────────────────────┘
```

### 6.1 Authorized Denormalization Use Cases

#### 6.1.1 Corporate Ownership Profiles
*   **Business Justification:** Administrative lists and certificate views need to display the primary shareholder's name and nationality alongside the company file without executing secondary profile lookups.
*   **Primary Source:** `/users/{uid}` (`display_name_ar`, `nationality`)
*   **Target Collection:** `/companies/{company_id}/shareholders/{shareholder_id}`
*   **Write Complexity:** Low. Citizen profile name changes are rare.
*   **Synchronization Strategy:** Updated using a background Cloud Function triggering on `/users/{uid}` modifications.

#### 6.1.2 Business Operating Licenses
*   **Business Justification:** Verification portals must load active licenses alongside parent company registration codes and names in a single database read.
*   **Primary Source:** `/companies/{company_id}` (`name_ar`, `commercial_registry_number`)
*   **Target Collection:** `/licenses/{license_id}`
*   **Write Complexity:** Low. Corporate name modifications are administrative actions with low frequency.
*   **Synchronization Strategy:** Updated using a background transaction script upon company name changes.

#### 6.1.3 Trade Dispute Inboxes
*   **Business Justification:** Support agents need to view associated company registration details inside dispute folders.
*   **Primary Source:** `/companies/{company_id}` (`name_ar`, `status`)
*   **Target Collection:** `/complaints/{complaint_id}`
*   **Write Complexity:** Very Low.
*   **Synchronization Strategy:** Set at complaint creation; no real-time sync is required as complaints represent a historical snapshot.

---

## 7. HOTSPOT PREVENTION & SCALABILITY PLANNING

Because Firestore distributes data partitions based on document keys, sequential keys or high-frequency writes to a single document can create database hotspots, limiting write speeds.

```
  [ HOTSPOT PROBLEM (PROHIBITED) ]
  Sequential Keys: /audit_logs/2026-07-12_001, /audit_logs/2026-07-12_002
  --> Sequentially written keys point to the same storage partition, creating performance bottlenecks.

  [ HIGH-PERFORMANCE SOLUTION (ENFORCED) ]
  High-Entropy Keys: /audit_logs/aud_981240a_f92b, /audit_logs/aud_1b74a9f_a82c
  --> High-entropy UUIDv4 prefixes distribute data writes evenly across partitions.
```

### 7.1 Prevention Strategies
1.  **High-Entropy Document Keys:** Document keys for high-volume collections (such as `audit_logs` or `payments`) must utilize high-entropy UUIDv4 formats to distribute write workloads evenly across partitions.
2.  **Distributed Counter Sharding:** Documents tracking high-frequency global counters (such as national transaction volumes) must shard writes across **5 distributed counter shards** under `[collection_name]_shards`, aggregating shards during read operations to prevent single-document write locks (which are limited to 1 write per second).

---

## 8. CACHING & REAL-TIME DATA STRATEGY

To balance fast response times with operational costs, the platform distinguishes between static, slow-moving reference data and active transactional event streams.

```
                              [ Data Request ]
                                     │
                        Is data classified as static?
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼ YES                                   ▼ NO
     [ Local Cache Layer ]                    [ On-Demand Database Fetch ]
     - Cached for 24 hours locally            - Points reads with 30-sec TTL
     - e.g., ISIC codes, state lists          - e.g., active invoices
```

### 8.2 Data Caching Protocols
*   **Static Reference Data:** General catalogs (such as ISIC classifications, federal state codes, and licensing fees) are cached locally in browser storage (`localStorage`) for 24 hours.
*   **Offline Data Persistence:** Enabled for mobile-tier clients. This allows citizens to view their active registrations, licenses, and cached certificates offline, syncing updates once network connection is restored.
*   **Real-Time Subscriptions:** Restricted to active support chats and critical administrative casework queues. General citizen pages must use on-demand, single-read queries (`getDocs()`) instead of open real-time listeners (`onSnapshot()`) to minimize database read costs and prevent battery drain on mobile devices.

---

## 9. COST OPTIMIZATION FRAMEWORK

Firestore charges primarily based on read, write, and delete operations. This framework enforces strict development standards to minimize database costs.

```
┌──────────────────────────────────────────────────────────┐
│              Operational Cost Reduction rules            │
├──────────────────────────────────────────────────────────┤
│ 1. Public queries are served via local cache systems      │
│ 2. Unused document fields are cleaned or exempt from index│
│ 3. Transient notifications expire after 3 years          │
│ 4. Archival schedules transfer old logs to cold storage  │
└──────────────────────────────────────────────────────────┘
```

### Cost Containment Rules:
1.  **No Dynamic Multi-Document Lookups:** If a dashboard requires aggregate metrics (such as daily registrations or revenue totals), do not query entire collections. Instead, read a single, pre-aggregated document under the `reporting_cubes` collection, updated by a background job.
2.  **Document Cleanup Pipelines:** Temporary records (such as system notifications or verification logs) are scheduled for automatic deletion after their retention period (e.g., 3 years for notifications) to minimize active storage costs.
3.  **Cold Archive Offloading:** Historical corporate logs and processed payment invoices are periodically exported to cold storage options (such as Cloud Storage Archive) after 5 years, freeing up database capacity.

---

## 10. PERFORMANCE MONITORING & OBSERVABILITY

To maintain database integrity and ensure optimal user experiences, the platform uses automated monitoring to track key performance indicators (KPIs).

```
[ Automated Metrics Collection ] ──► [ Dashboard Alerting ] ──► [ Automated Scale Interventions ]
```

### 10.1 Core Database KPIs
*   **P99 Read Latency:** Target < 150ms globally; tracked via Firebase Performance Monitoring.
*   **Database Cache Hit Rate:** Target > 85% for standard reference lookups.
*   **Failed Database Authorizations:** Alarms trigger if failed auth checks exceed 0.5% of total transactions.
*   **Firestore Read-to-Write Ratio:** Target 9:1; analyzed monthly to optimize denormalization plans.
*   **Monthly Firestore Operational Cost:** Tracked inside Firebase Billing to catch inefficient queries and optimize index configurations.
