# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL DIGITAL BUSINESS CONTINUITY & RESILIENCE HANDBOOK (v1.0.0)
#### Enterprise Business Continuity, Disaster Recovery, Operational Resilience, Backup Governance, and Crisis Management

---

## 1. ENTERPRISE BUSINESS CONTINUITY ARCHITECTURE (EBCA)

This handbook defines the authoritative **Enterprise Business Continuity Architecture (EBCA)**, **Disaster Recovery (DR) Framework**, **Business Impact Analysis (BIA) Catalog**, and **National Digital Continuity Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. This framework is optimized for the **Google Cloud Platform (GCP)** and **Google Firebase Studio** ecosystem, establishing a highly available, sovereign, and resilient architecture to protect public records, commercial transactions, and industrial datasets during nationwide or regional disruptions.

### 1.1 Architectural Resilience Pillars
To ensure zero single points of failure (SPOF) for critical public services, the Ministry operates on four fundamental architectural pillars:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Sovereign Architectural Resilience Pillars                      │
├──────────────────────┬─────────────────────────────────────────────────────────────────┤
│ Pillar               │ Operational Strategy & Technology Implementation                │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ Geo-Redundancy       │ Multi-region deployment across isolated Google Cloud regions,   │
│                      │ with continuous, secure data replication.                       │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ Serverless Scaling   │ Automated scaling using Firebase Functions and Cloud Run,       │
│                      │ absorbing traffic surges and maintaining responsiveness.         │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ Immutable Ledgering  │ Write-Once-Read-Many (WORM) storage configurations for          │
│                      │ corporate records, preventing unauthorized modification.         │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ Graceful Degradation │ Dynamic feature-flag decoupling that isolates failing modules   │
│                      │ while keeping the primary authentication and registry intact.  │
└──────────────────────┴─────────────────────────────────────────────────────────────────┘
```

### 1.2 Unified National Operating Topology
The Ministry's business continuity model coordinates operations across three distinct service tiers:
*   **The Sovereign Core:** Non-negotiable, always-on transactional registers (e.g., Company Names, Corporate Registrations, Digital Identity verification).
*   **The Operational Core:** Vital, time-sensitive administrative workflows (e.g., Licensing, Inspections, Strategic Investment clearances).
*   **The Auxiliary Tier:** Support systems and secondary portals (e.g., Complaints Management, AI-driven assistant tools, public analytical dashboards).

---

## 2. NATIONAL DISASTER RECOVERY FRAMEWORK (NDRF)

The **National Disaster Recovery Framework (NDRF)** provides systematic operational procedures for coordinating technical recovery actions across Google Cloud and Firebase infrastructure during major system outages.

```
                  [ DISASTER RECOVERY PIPELINE ]
                                │
                      [ Severity Triage ]
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 [ Cloud Outage ]     [ DB Corruption ]       [ Cyber Attack ]
        │                       │                       │
 [ Global Failover ]  [ Point-In-Time Restore] [ Forensic Isolation ]
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
                    [ Post-Recovery Audit ]
```

### 2.1 Disaster Recovery Scenarios & Playbooks

#### Scenario A: Cloud Region Failure (Active-Passive failover)
*   **Trigger Event:** A complete loss of services in the primary Google Cloud deployment region.
*   **RTO Target:** `< 1 Minute` for critical paths; `< 5 Minutes` for secondary services.
*   **RPO Target:** `< 5 Seconds` for sovereign transactions.
*   **DR Procedures:**
    1.  **Global Load Balancing:** Google Cloud HTTPS Load Balancer detects regional health-check failures and automatically diverts public traffic to the secondary failover region.
    2.  **State Promotion:** Cloud Firestore active-passive multi-region replica is promoted to primary write status.
    3.  **Firebase Hosting Routing:** DNS records instantly shift traffic to the failover Firebase CDN distribution.
    4.  **Operational Verification:** SRE engineers execute automated end-to-end transaction validation scripts to confirm service health.

#### Scenario B: Database Corruption or Accidental Bulk Deletion
*   **Trigger Event:** A logical database corruption or accidental administrative execution deleting core tables.
*   **RTO Target:** `< 1 Hour`.
*   **RPO Target:** `< 1 Minute` (restored to the millisecond preceding the corruption).
*   **DR Procedures:**
    1.  **Read-Only Freeze:** The Incident Commander initiates a temporary read-only state across public applications via Firebase Remote Config.
    2.  **Point-In-Time Recovery (PITR):** The Database Administrator identifies the exact timestamp of the corrupting event from Cloud Logging.
    3.  **Restoration Sequence:** Firestore PITR is executed, restoring the database state to the safe millisecond preceding the corruption.
    4.  **Integrity Validation:** Automated checksum comparisons are executed between restored records and transaction receipts stored in cold archives.
    5.  **Reactivation:** Normal read-write operations are restored, and notification reports are delivered to the Executive Recovery Board.

#### Scenario C: Severe Cybersecurity Ransomware Attack
*   **Trigger Event:** Suspicious activity patterns, such as mass document modifications or unauthorized configuration changes.
*   **RTO Target:** `< 4 Hours`.
*   **RPO Target:** `< 5 Minutes` (prior to the breach).
*   **DR Procedures:**
    1.  **Isolation:** Active connections are severed, and compromised service accounts are locked.
    2.  **Key Rotation:** Security keys and credentials in Google Cloud Secret Manager are rotated immediately.
    3.  **Forensic Review:** Incident Response teams inspect system logs to locate the vulnerability and assess the compromise boundary.
    4.  **Immutability Recovery:** Systems are redeployed using verified Docker containers, and database states are restored using secure, immutable Firestore backups.
    5.  **Verification:** Security teams run rigorous security scans on the restored infrastructure before reopening public traffic.

---

## 3. BUSINESS IMPACT ANALYSIS (BIA) CATALOG

The Business Impact Analysis (BIA) defines the business criticality, recovery objectives, dependencies, and sequence of recovery for every service in the Ministry's digital portfolio.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            Sovereign Digital Service Criticality Matrix                      │
├─────────────────┬─────────────┬──────────────┬──────────────┬────────────────┬──────────────┤
│ Service ID      │ Criticality │ Target RTO   │ Target RPO   │ Dependencies   │ Recovery Seq │
├─────────────────┼─────────────┼──────────────┼──────────────┼────────────────┼──────────────┤
│ SRV-CR-CORP     │ Tier 1      │ < 1 Hour     │ < 5 Minutes  │ Identity, DB   │ 01           │
│ SRV-ID-SSO      │ Tier 1      │ < 15 Minutes │ < 1 Second   │ Cloud Auth     │ 02           │
│ SRV-LIC-OPR     │ Tier 2      │ < 4 Hours    │ < 1 Hour     │ SRV-CR-CORP    │ 03           │
│ SRV-IND-LIC     │ Tier 2      │ < 4 Hours    │ < 1 Hour     │ Storage, DB    │ 04           │
│ SRV-INV-PORT    │ Tier 2      │ < 8 Hours    │ < 4 Hours    │ SRV-CR-CORP    │ 05           │
│ SRV-CP-ALERT    │ Tier 3      │ < 12 Hours   │ < 12 Hours   │ Notifications  │ 06           │
│ SRV-CMP-RESOLV  │ Tier 3      │ < 24 Hours   │ < 24 Hours   │ Database, API  │ 07           │
│ SRV-AI-ADVISOR  │ Tier 3      │ < 24 Hours   │ < 24 Hours   │ Gemini API     │ 08           │
└─────────────────┴─────────────┴──────────────┴──────────────┴────────────────┴──────────────┘
```

### 3.1 Digital Service Recovery Profiles

#### 3.1.1 National Commercial Registry Service (`SRV-CR-CORP`)
*   **Business Criticality:** Tier 1 - Sovereign Core (Disruption halts national business registrations).
*   **Maximum Tolerable Downtime (MTD):** 2 Hours.
*   **Required Resources:** Cloud Firestore, Firebase Auth, Cloud Run container arrays, Payment Gateway API.
*   **Operational Priority:** High-priority recovery; must be restored first to unblock dependent services.
*   **Manual Fallback Option:** Read-only portal with offline registration queuing.

#### 3.1.2 National Commercial Name Reservation (`SRV-CR-NAMES`)
*   **Business Criticality:** Tier 1 - Sovereign Core.
*   **Maximum Tolerable Downtime (MTD):** 4 Hours.
*   **Required Resources:** Firestore, Registry Name Indexes.
*   **Operational Priority:** High-priority recovery; essential to prevent duplicate name registrations during outages.
*   **Manual Fallback Option:** Temporary name locks managed through local regional databases.

#### 3.1.3 Business operating License Service (`SRV-LIC-OPR`)
*   **Business Criticality:** Tier 2 - Operational Core.
*   **Maximum Tolerable Downtime (MTD):** 12 Hours.
*   **Required Resources:** Sovereign Core, File Storage Buckets, Regional Verification APIs.
*   **Operational Priority:** Medium-priority recovery; depends on the restoration of the Corporate Registry.
*   **Manual Fallback Option:** 30-day grace period extensions for existing licenses.

#### 3.1.4 Industrial Plant Licensing (`SRV-IND-LIC`)
*   **Business Criticality:** Tier 2 - Operational Core.
*   **Maximum Tolerable Downtime (MTD):** 24 Hours.
*   **Required Resources:** Storage Buckets, Database, Regional Field Inspector portal.
*   **Operational Priority:** Medium-priority recovery; requires verification of industrial safety registries.
*   **Manual Fallback Option:** Physical site review approvals logged via offline inspectors.

---

## 4. BACKUP & RECOVERY GOVERNANCE FRAMEWORK

MCI enforces a rigorous backup governance model to ensure that all digital assets, transaction records, and document vaults are captured, validated, and retrievable.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Enterprise Backup Classification & Policy                       │
├─────────────┬─────────────────┬────────────────────┬─────────────────┬─────────────────┤
│ Data Tier   │ Target Domain   │ Backup Frequency   │ Retention Limit │ Encryption Type │
├─────────────┼─────────────────┼────────────────────┼─────────────────┼─────────────────┤
│ Transaction │ Registry, Pay   │ Continuous (PITR)  │ 7 Days sliding  │ KMS AES-256     │
│             │ Records         │                    │                 │                 │
├─────────────┼─────────────────┼────────────────────┼─────────────────┼─────────────────┤
│ Documents   │ Signed PDFs,    │ Geo-replicated on  │ Permanent       │ Customer CMEK   │
│             │ Blueprints      │ upload             │                 │                 │
├─────────────┼─────────────────┼────────────────────┼─────────────────┼─────────────────┤
│ System Logs │ Audit & Access  │ Continuous export  │ 20 Years        │ Immutable WORM  │
│             │ logs            │ to BigQuery        │                 │                 │
├─────────────┼─────────────────┼────────────────────┼─────────────────┼─────────────────┤
│ Metadata    │ Rule parameters │ Daily snapshot     │ 3 Years         │ Standard KMS    │
│             │ configurations  │                    │                 │                 │
└─────────────┴─────────────────┴────────────────────┴─────────────────┴─────────────────┘
```

### 4.1 Immutable Backup and Retention Standards
1.  **Immutable Storage Rules:** Backups containing active corporate registries and transaction histories are written to Google Cloud Storage buckets configured with a strict **Retention Policy (WORM)**. Once written, these archives cannot be modified or deleted by any administrative account.
2.  **Automated Integrity Validation:** Every backup archive is automatically cataloged with a SHA-256 cryptographic checksum. A weekly scheduled verification task reads random archive samples, recomputes their hash values, and flags any discrepancy immediately.
3.  **Archival Transition Rules:** Daily snapshots are stored in high-performance Multi-Regional storage for 30 days, transitioned to Nearline for 90 days, and then moved to Archive storage classes for permanent preservation.

---

## 5. CRISIS MANAGEMENT & OPERATIONAL RESILIENCE GUIDE

The Crisis Management Plan defines the organizational structures, communication paths, and decision-making authorities required to navigate major operational crises.

```
 [ Crisis Detected ] ──► [ Incident Classification ] ──► [ Activating Executive Board ]
                                                                 │
                                                                 ▼
 [ System Restoration ] ◄── [ Execute DR Playbook ] ◄── [ Coordinate Public Update ]
```

### 5.1 Crisis Classification Levels
*   **Level 1: Minor Incident:** A localized system issue (e.g., single API slow-down or portal page glitch) that does not disrupt core business transactions. Managed by SRE on-duty engineers.
*   **Level 2: Major Outage:** Partial loss of services (e.g., licensing registry unavailable or document downloads failing) affecting a regional office or group of users. Triggers alert to the Disaster Recovery Coordinator.
*   **Level 3: National Crisis:** Complete platform outage (e.g., multi-region cloud failure, ransomware compromise, or primary database corruption) halting nationwide commercial activity. Triggers instant mobilization of the Executive Recovery Board.

### 5.2 Crisis Communication Protocol
1.  **Immediate Notification:** The Digital Operations Center (DOC) alerts the Business Continuity Manager within **5 minutes** of identifying a Level 3 Crisis.
2.  **Executive Mobilization:** The Executive Recovery Board is convened within **15 minutes** of crisis detection, establishing an active command channel.
3.  **Sovereign Partner Updates:** Secure, out-of-band communication channels (e.g., dedicated secure email or encrypted messaging services) are established to share updates with the Central Bank of Sudan, Customs Authority, and regional ministries.
4.  **Public Communication:** Public-facing status pages are updated every **30 minutes** in Arabic and English, providing clear status updates and expected resolution times.

---

## 6. RECOVERY TESTING & VALIDATION MANUAL

Our resilience capabilities are continually verified through scheduled, rigorous tabletop exercises and full-scale disaster simulation drills.

```
┌──────────────────────────────────────────────────────────┐
│              Sovereign Simulation Lifecycle              │
├──────────────────────────────────────────────────────────┤
│ 1. Define objectives and simulation scope                │
│ 2. Deploy isolated test sandbox environment              │
│ 3. Execute recovery drill and measure restoration speed  │
│ 4. Document findings, trace bottlenecks, adjust models  │
└──────────────────────────────────────────────────────────┘
```

### 6.1 Resilience Testing Schedule
*   **Quarterly Tabletop Exercises:** Compliance, SRE, and department managers review crisis response playbooks, walk through disaster scenarios, and update escalation procedures.
*   **Semi-Annual Failover Simulations:** SRE teams conduct simulated regional cloud outages during low-traffic windows. Systems must demonstrate automated DNS routing to the disaster recovery zone under the target RTO.
*   **Monthly Backup Restoration Drills:** Automated recovery systems extract random daily backups and restore them in isolated sandboxes, running automated data integrity validation scripts.
*   **Annual Security and Ransomware Drills:** Security teams simulate credential compromises and malware infections, testing isolation capabilities, key rotation procedures, and immutable backup restoration.

---

## 7. AI SERVICE CONTINUITY FRAMEWORK

MCI implements specific continuity standards for server-side **Gemini models** (orchestrated via the `@google/genai` SDK) to ensure operational continuity during model degradation or external service disruptions.

```
┌──────────────────────────────────────────────────────────┐
│              Sovereign AI Fallback Pipeline              │
├──────────────────────────────────────────────────────────┤
│ 1. Primary AI Model is unreachable or times out          │
│ 2. System automatically switches to a secondary model    │
│ 3. If model issues persist, enable Human Fallback Mode   │
│ 4. System presents standard templates for manual edits   │
│ 5. Normal processing resumes once API health is verified │
└──────────────────────────────────────────────────────────┘
```

### 7.1 AI Resilience Rules
1.  **Multi-Model Failover Routing:** If the primary high-capability model (e.g., *Gemini 1.5 Pro*) is unreachable or experiences performance issues, the integration layer automatically reroutes requests to a faster, high-availability model (e.g., *Gemini 1.5 Flash*).
2.  **Human Fallback Mode:** If external AI services are completely unavailable, the platform automatically switches to a fallback mode. Forms and fields that use AI-assisted processing are replaced with standard templates, letting caseworkers enter and review data manually.
3.  **Knowledge Base Recovery:** The custom vectors and data records used for context grounding are backed up in highly available regional storage buckets, allowing recovery during database outages.

---

## 8. EXECUTIVE OPERATIONAL RESILIENCE DASHBOARD SPECIFICATION

This section outlines the layout, visual design, and data standards for the Executive Resilience and Recovery Dashboards, ensuring high contrast, clarity, and ease of use.

```
+───────────────────────────────────────────────────────────+
│                    MCI RESILIENCE HUB                     │
│  (Sovereign Logo)   Executive Recovery Board Console      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  [ System Health: READY ]          [ DR Outages: 0 ]      │
│  [ Replication Latency: 14ms ]     [ Backup Success: 100% ]│
│                                                           │
├───────────────────────────────────────────────────────────┤
│  Regional Database Synchronization:                       │
│  - Cloud Firestore: [ ACTIVE - Multi-Region Synced ]      │
│  - Signed PDF Vault: [ ACTIVE - Geo-Replicated ]          │
│  - Audit Ledger:     [ ACTIVE - Immutable Storage Lock ]  │
+───────────────────────────────────────────────────────────+
```

### 8.1 Technical Design and Accessibility
*   **Typography:** Dashboards must use **DIN Next Arabic** for Arabic (RTL) views and **DIN Next** for English (LTR) views, ensuring elegant, professional, and accessible layouts.
*   **Visual Priority Alerts:** System health metrics utilize high-contrast indicators (green for optimal, amber for warnings, and red for active incidents), allowing rapid triage by on-duty commanders.
*   **Cross-Device Responsiveness:** Dashboards scale dynamically across widescreen wall monitors, desktop workstations, tablets, and mobile devices, supporting field operations.

---

## 9. RISK & RECOVERY GOVERNANCE HANDBOOK

To maintain operational readiness, resilience risks are actively monitored and managed through a structured risk register.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Operational Resilience Risk Register                 │
├──────────────────┬──────────────┬──────────────────┬────────────────────┤
│ Risk Description │ Threat Level │ Mitigation Path  │ Recovery Strategy  │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ Multi-Region     │ CRITICAL     │ Multi-region database│ DNS traffic        │
│ Cloud Outage     │              │ replication.     │ redirection.       │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ Ransomware       │ CRITICAL     │ Immutable backup │ Point-In-Time      │
│ Compromise       │              │ storage policies.│ Recovery (PITR).   │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ Network          │ HIGH         │ Offline document │ Standalone field   │
│ Disconnection    │              │ signature keys.  │ verification apps. │
├──────────────────┼──────────────┼──────────────────┼────────────────────┤
│ Integrity Loss   │ MEDIUM       │ Cryptographic SHA│ Restoring records  │
│                  │              │ checksum audits. │ from snapshot vaults.│
└──────────────────┴──────────────┴──────────────────┴────────────────────┘
```

### 9.1 Resilience Roles & Responsibilities
*   **Business Continuity Manager:** Oversees the overall BCP strategy, schedules DR exercises, and acts as the lead coordinator during operational crises.
*   **Disaster Recovery Coordinator:** An SRE manager who manages backup configurations, monitors replication latency, and coordinates technical restoration steps.
*   **AI Continuity Specialist:** Ensures AI models are configured with appropriate failover routes and validates the integrity of fallback templates.
*   **Communications Lead:** Manages internal and public communications during Level 3 Crises, keeping stakeholders and the public informed.

---

## 10. NATIONAL DIGITAL BUSINESS CONTINUITY & RESILIENCE HANDBOOK

### 10.1 Executive Manual Declaration
The National Digital Business Continuity & Resilience Handbook establishes a secure, redundant, and highly available digital infrastructure for the Republic of Sudan Ministry of Commerce & Industry. By combining automated geo-replication, Point-in-Time Recovery (PITR), strict backup validations, and clear crisis management procedures, the platform guarantees that the nation's critical trade registers and industrial services remain secure and accessible under all circumstances.

All future application development, infrastructure configurations, and regional integrations must align with the parameters, workflows, and resilience targets defined in this handbook to preserve the security, integrity, and continuity of Sudan's digital government services.
