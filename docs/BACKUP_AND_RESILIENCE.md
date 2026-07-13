# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT DATA RESILIENCE HANDBOOK: BACKUP, DISASTER RECOVERY, & DATA LIFECYCLE GOVERNANCE (v1.0.0)

---

## 1. DESIGN PHILOSOPHY & SOVEREIGN RESILIENCE STATEMENT

This framework establishes the authoritative **Backup, Disaster Recovery (DR), Business Continuity (BC), and Data Lifecycle Governance Manual** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national **"Sovereign Cybersecurity & Infrastructure Protection Act"**, this specification guarantees that all digital assets, trade registers, financial logs, and strategic corporate filings are protected against infrastructure failure, regional disasters, or cyber-attacks.

For Sudan, commercial registries, industrial operating data, and foreign investment catalogs represent a key cornerstone of **National Digital Sovereignty**. The platform's resilience engine is designed with zero single points of failure (SPOF) and ensures continuity of operations for citizens, regional state ministries, and global trading partners.

```
+───────────────────────────────────────────────────────────────────────────────────────────+
|                               Sovereign Resilience Engine                                 |
├───────────────────────────────┬───────────────────────────────────┬───────────────────────┤
│     High Availability (HA)    │      Disaster Recovery (DR)       │  Data Lifecycle (DLM) │
│  - Multi-region replication   │  - Cross-region failover systems  │  - Compliant archiving│
│  - Graceful degradation modes │  - PITR database restoration      │  - Cryptographic shred│
└───────────────────────────────┴───────────────────────────────────┴───────────────────────┘
```

---

## 2. RECOVERY OBJECTIVES & SERVICE PRIORITIZATION GUIDE

To balance operational costs with strategic resilience, the Ministry classifies digital services into four distinct priority levels. This structure dictates recovery sequence, data synchronization, and failover priority during a severe system outage.

```
       [ HIGH-AVAILABILITY & SERVICE FAILOVER SEQUENCE ]
       
    Level 1: Sovereign Core (RTO < 1 Hour, RPO < 5 Min)
      └─ Companies, Commercial Names, Payments, Auth
                                     │
                                     ▼
    Level 2: Operational Core (RTO < 4 Hours, RPO < 1 Hour)
      └─ Factories, Investments, Licenses, Inspections
                                     │
                                     ▼
    Level 3: Auxiliary Services (RTO < 12 Hours, RPO < 4 Hours)
      └─ Complaints, Notifications, AI Sessions, Reporting
```

### 2.1 Criticality Tier Matrix

| Tier Level | Service Name | Target RTO (Recovery Time Objective) | Target RPO (Recovery Point Objective) | Dependencies | Failover Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Sovereign Core** | Commercial Registry, Names, Payments, Identity | **< 1 Hour** | **< 5 Minutes** | Firebase Auth, Payment Gateway | Active-Active Cross-Region Routing, Multi-Region Firestore Replication. |
| **Tier 2: Operational Core** | Licenses, Factories, Investments, Inspections | **< 4 Hours** | **< 1 Hour** | Sovereign Core, Storage Buckets | DNS Traffic Redirection, Scheduled Backup Database Promoted. |
| **Tier 3: Auxiliary Services** | Complaints, Notifications, AI Sessions | **< 12 Hours** | **< 4 Hours** | Operational Core, Gemini API | Graceful Degradation (Disable non-critical UI panels). |
| **Tier 4: Analytical & Archives**| Economic Reporting, System Audits, Old Logs | **< 24 Hours** | **< 24 Hours** | Data Pipeline, BigQuery | Read-Only Analytical Replica promotion. |

---

## 3. ENTERPRISE BACKUP ARCHITECTURE

The underlying storage layer utilizes native **Google Cloud** and **Cloud Firestore** backup features to ensure secure, automated, and tamper-proof recovery options.

```
┌──────────────────────────────────────────────────────────┐
│                 MCI Unified Backup Pipeline              │
├──────────────────────────────────────────────────────────┤
│ 1. Continuous Point-in-Time Recovery (PITR) Log Stream   │
│ 2. Daily automated Firestore collection snapshots       │
│ 3. Weekly isolated offsite backups to Sovereign vaults   │
│ 4. Automatic cryptographic hash verification on write    │
│ 5. Automated restoration drill verification pipelines    │
└──────────────────────────────────────────────────────────┘
```

### 3.1 Backup Specifications & Frequencies

#### 3.1.1 Continuous Point-in-Time Recovery (PITR)
*   **Target Domain:** Sovereign Core (`companies`, `commercial_names`, `payments`, `users`).
*   **Retention Window:** 7 Days sliding.
*   **Purpose:** Allows administrators to restore the database state to any exact millisecond within the previous week, protecting against accidental deletions or transaction errors.
*   **Security Standard:** Encrypted with customer-managed keys (CMEK) via Google Cloud KMS.

#### 3.1.2 Scheduled Collection Snapshots
*   **Target Domain:** All Firestore collections, configurations, and prompt logs.
*   **Frequency:** Daily automated exports at 02:00 UTC+2 (Sudan Standard Time).
*   **Retention:** 365 Daily snapshots, 36 Monthly archives, 10 Annual archives.
*   **Storage Tier:** Google Cloud Storage (Multi-Regional Standard ──► Coldline ──► Archive after 90 days).

#### 3.1.3 Cryptographic Document Backups
*   **Target Domain:** Official signed PDF certificates, factory blueprints, and investor identities stored in Cloud Storage buckets.
*   **Frequency:** Continuous geo-replication.
*   **Retention:** Permanent (Sovereign trade registers do not expire).
*   **Verification Method:** SHA-256 hash checksum checked before and after replication.

---

## 4. DISASTER RECOVERY (DR) FRAMEWORK

Our disaster recovery framework defines the precise procedures required to detect, isolate, and recover from critical system failures.

```
          [ DISASTER RECOVERY ORCHESTRATION PIPELINE ]
          
      [ Event Detected ] ──► [ Automatic Diagnostic Alerts ]
                                       │
                                       ▼
                     Is Regional Cloud Infrastructure impacted?
                                       │
                       ┌───────────────┴───────────────┐
                       ▼ YES                           ▼ NO
         [ Regional Failover Mode ]       [ Point-In-Time Restoration ]
         - DNS routing to Port Sudan      - Restore collections via PITR
         - Read-only failover enabled     - Verify checksum database
```

---

### 4.1 Disaster Recovery Scenarios

#### 4.1.1 Regional Cloud Outage (Regional Failover)
*   **Detection:** Automated monitoring detects loss of Google Cloud regional services (e.g., *europe-west3* regional outage).
*   **Escalation:** Red alert sent to SRE On-Call Engineers and the Director of Digital Operations.
*   **Recovery Steps:**
    1.  The DNS gateway automatically redirects public traffic to our secondary, geographically isolated regional cluster (e.g., Port Sudan Local Data Center or adjacent regional cloud zones).
    2.  Database connections are redirected to the regional read-replica database.
    3.  A read-only "Degraded Mode" is enabled on the portal, letting users view existing licenses and registration records while write actions are queued locally.
*   **Validation:** Automated tests verify that public interfaces are online, security certificates are valid, and existing documents are accessible.

#### 4.1.2 Malicious Data Corruption (Cybersecurity Ransomware)
*   **Detection:** High-priority alerts trigger if the system detects an abnormal rate of document deletions or bulk encryption events.
*   **Escalation:** Instant alert sent to the Incident Response Team (IRT) and CISO. Active administrator credentials are locked immediately.
*   **Recovery Steps:**
    1.  Place the affected application servers in quarantine.
    2.  Analyze database logs to identify the exact timestamp of the compromise.
    3.  Restore database collections to the safe millisecond immediately preceding the event using Point-in-Time Recovery (PITR).
    4.  Verify structural database integrity and deploy updated security rules before reopening public traffic.
*   **Validation:** Security teams verify database state alignments and confirm all system audit logs are intact.

#### 4.1.3 Storage Bucket Failure
*   **Detection:** Application servers report high rates of 500-series errors when reading documents from Google Cloud Storage.
*   **Escalation:** Alert sent to Cloud Infrastructure Engineers and Storage Administrators.
*   **Recovery Steps:**
    1.  Storage APIs are dynamically redirected to the secondary, geo-replicated backup bucket.
    2.  The broken bucket's configuration and IAM permissions are verified.
    3.  A background sync job identifies and restores any missing documents from daily snapshot archives.
*   **Validation:** System checks confirm that public certificate downloads are functional and file checksums are valid.

---

## 5. BUSINESS CONTINUITY PLAN (BCP)

The Business Continuity Plan outlines the manual and automated operational procedures required to keep critical trade and industrial services functioning during severe outages.

```
                       [ Business Continuity Loop ]
                                    │
                       Does network failure occur?
                                    │
                     ┌──────────────┴──────────────┐
                     ▼ YES                         ▼ NO
        [ Offline Standalone Mode ]     [ standard Operations ]
        - Caseworkers queue files       - Multi-region sync active
        - Regional centers log cache
```

### 5.1 Service Continuity Procedures

#### 5.1.1 Commercial Registry & Name Locks
*   **Criticality:** High (Sovereign Core).
*   **Continuity Mode:** Read-Only Mirror.
*   **Procedures:** If the primary write database is unavailable, name reservation requests are queued locally on the client's device or at local regional centers. The system prevents duplicate name issues by locking the requested name namespace in-memory until primary database replication is fully restored.

#### 5.1.2 Export License Issuance & Verification
*   **Criticality:** Strategic (Operational Core).
*   **Continuity Mode:** Offline Signature Verification.
*   **Procedures:** Exporters can present cryptographically signed, pre-downloaded PDF license certificates containing a secure QR code. Custom verification apps used by border officials can validate the certificate offline by checking the QR code signature against the Ministry's public key, even during complete network disconnections.

#### 5.1.3 Public Price Control Enforcement
*   **Criticality:** Social Stability (Auxiliary).
*   **Continuity Mode:** Static SMS Broadcasts.
*   **Procedures:** If the main interactive price monitoring portal is offline, price checkers and inspectors receive daily pre-generated PDF price limits via SMS or regional messaging channels. Citizens can report price violations through a backup, low-bandwidth SMS reporting channel.

---

## 6. DATA LIFECYCLE & RETENTION SPECIFICATION

To ensure compliance with Sudanese archives and trade legislation, all data entities must transition through structured, predictable lifecycle phases.

```
[ Data Creation ] ──► [ Active Operating Use ] ──► [ Cold Archival Storage ] ──► [ Cryptographic Shred ]
  - UTF-8 validation     - Active transactions        - Compressed read-only      - Keys destroyed
  - Audit stamp          - Fast point reads           - Storage costs optimized   - Logs archived
```

### 6.1 Lifecycle Governance Matrix

| Data Domain | Creation Validation | Active Phase (Hot) | Archival Phase (Cold) | Disposal Method | Security Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Corporate Registers (`companies`)** | UTF-8 Checks, Tax ID format, shareholder validation | **15 Years** active, in Firestore. | **Infinite Retention**, moved to cold archives. | Non-Disposible (Permanent Ledger). | `PUBLIC_RECORD` / `RESTRICTED` |
| **Financial Invoices (`payments`)** | Gateways confirmation hash, balance audits | **5 Years** in Firestore. | **10 Years** in compressed databases. | Multi-pass overwrite, key deletion. | `RESTRICTED_FINANCIAL` |
| **Notifications (`notifications`)** | Device target token, delivery checks | **30 Days** active inbox. | **3 Years** in history database. | Automated deletion. | `CONFIDENTIAL` |
| **AI Assistant Sessions (`ai_sessions`)** | Regex clean, token validation | **2 Hours** session window. | **1 Year** in audit database. | Permanent cryptographic shred. | `CONFIDENTIAL` |
| **Audit Logs (`audit_logs`)** | Non-modifiable, auto-time, SHA-256 hash | **5 Years** in active log streams. | **20 Years** in immutable storage. | Immutable (No disposal allowed). | `RESTRICTED_AUDIT` |

---

## 7. ARCHIVING & LEGAL HOLD FRAMEWORK

```
               [ Legal Hold Activation Flow ]

          [ Legal Hold Flag Set to true on Company doc ]
                                │
                                ▼
         [ Modifies Firestore Write Permission Rules ]
                                │
                                ▼
       [ Blocks document modification & deletion events ]
                                │
                                ▼
        [ Audit log registers Hold details & authorizer ]
```

### 7.1 Legal Hold Implementation
A **Legal Hold** is an administrative lock applied to companies, licenses, or financial records under active legal investigation, bankruptcy proceedings, or regulatory audits.

1.  **Strict Rule Changes:** Setting `is_legal_hold: true` on any document updates Firestore security policies, instantly blocking write or delete attempts on that record and its subcollections.
2.  **Audit Enforcement:** Placing or removing a Legal Hold is restricted to the Legal Director and requires written justification and joint multi-factor authentication approval.
3.  **Hold Overrides:** Standard data retention schedules and automated disposal pipelines are bypassed for any records under active Legal Hold until the hold flag is officially released.

### 7.2 Archival Retrieval Policies
*   **Storage Methods:** Archived records are stored as read-only documents inside secure, compressed archives.
*   **Retrieval Timelines:** Standard retrieval requests from cold storage must resolve within **2 hours** for administrative queries and under **24 hours** for public historical inquiries.
*   **Access Tracking:** Every archival retrieval event is logged in the system audit trail, capturing the requester’s ID, role, IP, and justification.

---

## 8. BACKUP VALIDATION & TESTING MANUAL

A backup system is only as reliable as its restoration process. The Ministry enforces regular, automated testing to verify disaster recovery readiness.

```
┌──────────────────────────────────────────────────────────┐
│                 Weekly Automated Test Drill              │
├──────────────────────────────────────────────────────────┤
│ 1. Deploy isolated Firestore sandbox container           │
│ 2. Restore database state from a random weekly backup    │
│ 3. Run automated tests to verify schema integrity        │
│ 4. Run sample point-read and composite query checks      │
│ 5. Clean sandbox environment and log metrics to dashboard│
└──────────────────────────────────────────────────────────┘
```

### 8.1 Disaster Recovery Drill Schedule

#### 8.1.1 Weekly Automated Verification
*   **Scope:** Automated database restoration checks.
*   **Procedures:** A background process creates a secure sandbox environment, restores data from a random weekly backup snapshot, and executes verification tests to confirm document alignments and schema consistency.
*   **Target KPI:** 100% data integrity with zero data mismatch.

#### 8.1.2 Quarterly Regional Failover Drills
*   **Scope:** Testing multi-region failover and DNS routing.
*   **Procedures:** Conducted during low-traffic hours. The primary database region is simulated as unavailable, and systems verify that traffic routes cleanly to the secondary disaster recovery zone within the Target RTO.
*   **Target KPI:** Under 30 seconds for DNS propagation.

#### 8.1.3 Semi-Annual Security Audits
*   **Scope:** Verifying encryption standards and access reviews.
*   **Procedures:** Forensic cybersecurity experts audit backup encryption keys, verify key rotation procedures, and review access privileges for backup administrators.
*   **Target KPI:** 100% compliance with ISO/IEC 27001 security standards.

---

## 9. OPERATIONAL MONITORING & READINESS DASHBOARD

To provide real-time visibility into system health and recovery readiness, the Ministry uses an automated observability dashboard tracking key resilience metrics.

```
┌─────────────────────────────────────────────────────────────────────────┐
│              Sovereign Data Resilience Monitoring Hub                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [ Backup Success Rate: 100% ]       [ Replication Latency: 12ms ]      │
│  [ Active Legal Holds: 14 ]          [ Storage Consumption: 41.2 TB ]   │
│                                                                         │
│  Current Disaster Recovery Status: [ READY / ONLINE ]                   │
│  Last Sandbox Restoration Drill:   [ PASSED - 2026-07-12 02:30 ]        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Core Performance KPIs:
*   **Backup Success Rate:** Target 100% daily backup confirmation; alerts trigger if any snapshot fails.
*   **Replication Delay:** Multi-region database replication latency is monitored continuously (Target < 50ms).
*   **Active Storage Growth:** Tracks storage consumption across standard and cold-storage tiers, providing storage-capacity projections for budget planning.
*   **Disaster Recovery Drills Log:** Logs dates, times, RTO results, and participant lists for auditing and compliance tracking.

---

## 10. GOVERNANCE & COMPLIANCE FRAMEWORK

Maintaining digital resilience requires structured coordination across Ministry departments.

```
[ New System Proposed ] ──► [ Resilience Board Evaluation ] ──► [ Compliance Verification ] ──► Production Merge
```

### 10.1 Key Resilience Roles
1.  **Business Continuity Owner (Role):** Coordinates the overall BCP strategy, schedules DR exercises, and acts as the lead coordinator during system crises.
2.  **Disaster Recovery Owner (Role):** An SRE Manager who oversees backup systems, manages DNS routing configurations, and coordinates restoration processes.
3.  **Data Custodian (Role):** Responsible for managing data lifecycle rules, configuring archival schedules, and verifying legal hold status compliance.
4.  **Audit Responsibilities:** Independent compliance auditors review disaster recovery readiness reports and backup testing logs every 6 months to ensure alignment with national security standards.
