# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL DIGITAL GOVERNMENT OPERATIONS HANDBOOK (v1.0.0)
#### Enterprise Operations, Digital Governance, Service Management, and National Platform Operations

---

## 1. ENTERPRISE OPERATIONS ARCHITECTURE (EOA)

This handbook defines the authoritative **Enterprise Operations Architecture (EOA)**, **Digital Operating Model**, and **Service Management Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national sovereign digitization directives, this specification establishes an operationally resilient, ITIL-aligned, and secure governance ecosystem.

The operational architecture runs serverlessly on **Google Cloud** and **Firebase**, utilizing highly available, geo-redundant database setups, isolated application sandboxes, and a centralized monitoring fabric to ensure continuous nationwide service delivery.

```
                  [ Ministry Operational Steering Committee ]
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   Digital Ops    │         │Service Management│         │  Cybersecurity   │
│   Center (DOC)   │         │   Office (SMO)   │         │   Office (CSO)   │
└────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                            │                            │
         ▼                            ▼                            ▼
 [ Platform & Infrastructure ]  [ ITIL Service Catalog ]     [ Security Operations ]
 - Cloud Performance Metrics    - Incident & SLA Tracks      - Threat Analysis (SOC)
 - API Integration Gateways     - Version Change Audits      - Identity & Access (IAM)
```

### 1.1 Organizational Units and Accountability
*   **Digital Operations Center (DOC):** Serves as the centralized command unit responsible for monitoring system health, managing integrations, and coordinating incident response.
*   **Service Management Office (SMO):** Governs service levels, coordinates platform release schedules, and manages client and business-owner support.
*   **Cybersecurity Coordination Office (CSO):** Implements security policies, monitors access logs, coordinates threat intelligence, and maintains integration security standards.
*   **AI Governance & Ethics Board:** Evaluates automated processes, audits AI-generated recommendations, and ensures that algorithmic support systems comply with ethical guidelines.

---

## 2. NATIONAL DIGITAL GOVERNANCE FRAMEWORK

MCI implements a standardized digital governance model that defines how applications, data, APIs, and public services are built, audited, and managed.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          Digital Governance Domain Matrix                              │
├───────────────────┬─────────────────────────────────┬──────────────────────────────────┤
│ Governance Domain │ Active Control Strategy         │ Responsible Governance Unit      │
├───────────────────┼─────────────────────────────────┼──────────────────────────────────┤
│ Applications      │ Managed Release & Quality Gates │ Platform Management Office (PMO) │
│ APIs              │ Gateway Authentication & Limits │ API Operations (APIOps)          │
│ Data              │ Segmented Access & Data Masking │ Data Governance Board            │
│ AI Systems        │ Advisory-Only & Human Override  │ AI Governance Office             │
│ Identities        │ Unified National SSO Validation │ Identity Operations Group        │
└───────────────────┴─────────────────────────────────┴──────────────────────────────────┤
```

### 2.1 Governance Standards and Lifecycle Controls
1.  **Application Governance:** All system updates must pass automated security scans, quality tests, and code reviews. Deployments require explicit approval from the Release Manager.
2.  **API Governance:** Public-facing and partner APIs are routed through secure API gateways, enforcing rate limits, authentication controls, and detailed access logging.
3.  **Data Governance:** Implements strict data classification policies. Personal data (PII) is masked by default, and access to sensitive financial records is restricted to authorized personnel.
4.  **AI Governance:** Restricts AI systems to advisory, analytical, and draft-generation roles. All algorithmic recommendations must be reviewed and signed off by authorized personnel.

---

## 3. GOVERNMENT SERVICE MANAGEMENT MANUAL (ITIL ALIGNED)

The platform’s operational processes are built on ITIL and COBIT frameworks, guaranteeing predictable, auditable, and repeatable service delivery.

```
 [ Incident Detected ] ──► [ Triage & Category ] ──► [ Investigate & Solve ] ──► [ Post-Mortem Log ]
                                                                                         │
   ┌─────────────────────────────────────────────────────────────────────────────────────┘
   ▼
 [ Identify Root Cause ] ──► [ Issue Change Request ] ──► [ CAB Review & Deploy ] ──► [ Close Problem ]
```

### 3.1 Core ITIL Operational Processes

#### 3.1.1 Incident Management Procedure
*   *Objective:* Restore normal service operations as quickly as possible, minimizing impact on citizens and businesses.
*   *Execution:* Incidents are classified by urgency and impact. Critical incidents (e.g., portal offline) trigger automated escalation paths, notifying SRE and security response teams immediately.

#### 3.1.2 Problem Management Process
*   *Objective:* Identify and eliminate the root causes of recurring incidents, preventing future service disruptions.
*   *Execution:* SRE teams analyze post-incident logs to identify system design flaws or infrastructure issues, drafting permanent technical solutions.

#### 3.1.3 Change Management & Release Coordination
*   *Objective:* Ensure that system updates are deployed securely and predictably, protecting live services from disruption.
*   *Execution:* All modifications to production systems are managed via formal Change Requests, reviewed by the Change Advisory Board (CAB), and deployed using zero-downtime Blue/Green routing schemes.

---

## 4. NATIONAL DIGITAL SERVICE CATALOG

This catalog registers and organizes all digital services provided by the Ministry, defining clear ownership, service level targets, and support paths.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            Sovereign Digital Service Directory                              │
├─────────────────┬─────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ Service ID      │ Sector Domain   │ Availability Target│ Business Owner   │ Escalation Code  │
├─────────────────┼─────────────────┼───────────────────┼──────────────────┼──────────────────┤
│ SRV-CR-CORP     │ Commercial Reg  │ 99.9%             │ Registrar General│ ESC-L3-REG       │
│ SRV-IND-LIC     │ Industrial Serv │ 99.5%             │ Industrial Dir   │ ESC-L3-IND       │
│ SRV-INV-PORT    │ Investment Serv │ 99.5%             │ Invest Commission│ ESC-L3-INV       │
│ SRV-LIC-OPR     │ Licensing Serv  │ 99.9%             │ Licensing Dir    │ ESC-L3-LIC       │
│ SRV-CP-ALERT    │ Consumer Prot   │ 99.0%             │ Consumer Prot Dir│ ESC-L3-CP        │
│ SRV-INS-AUDIT   │ Inspections     │ 99.0%             │ Inspection Coord │ ESC-L3-INS       │
│ SRV-CMP-RESOLV  │ Complaints      │ 99.5%             │ Satisfaction Lead│ ESC-L3-CMP       │
│ SRV-PAY-GATEWAY │ Payments        │ 99.95%            │ Chief Fin Officer│ ESC-L3-PAY       │
└─────────────────┴─────────────────┴───────────────────┴──────────────────┴──────────────────┘
```

### 4.1 Digital Service Profiles

#### 4.1.1 Corporate Incorporation Service (`SRV-CR-CORP`)
*   **Service Owner:** Registrar General of Commercial Companies.
*   **Business Purpose:** Allows citizens and foreign investors to incorporate companies online.
*   **SLA Target:** 48 Hours to final certificate delivery.
*   **Availability Target:** 99.9% uptime (24/7 access).
*   **Support Level:** Tier 1 (Service Desk), Tier 2 (Registry Officer), Tier 3 (Database Engineer).
*   **Escalation Path:** Regional Registry Supervisor ➔ Registrar General.

#### 4.1.2 Industrial plant Registration (`SRV-IND-LIC`)
*   **Service Owner:** Director of Industrial Development.
*   **Business Purpose:** Manages plant registrations, machinery validations, and safety compliance checks.
*   **SLA Target:** 5 working days (including physical site inspections).
*   **Availability Target:** 99.5% uptime.
*   **Support Level:** Tier 1 (Service Desk), Tier 2 (Compliance Inspector), Tier 3 (Industrial Systems Admin).
*   **Escalation Path:** Lead Field Inspector ➔ Industrial Director.

#### 4.1.3 Business Operating Licensing (`SRV-LIC-OPR`)
*   **Service Owner:** Director of Commercial Licensing and Permits.
*   **Business Purpose:** Coordinates compliance approvals and issues business operating permits.
*   **SLA Target:** 24 Hours from receipt of external clearances.
*   **Availability Target:** 99.9% uptime.
*   **Support Level:** Tier 1, Tier 2 (Permit Analyst), Tier 3 (API Platform SRE).
*   **Escalation Path:** Licensing Board Chair.

#### 4.1.4 Central Payment Gateway Service (`SRV-PAY-GATEWAY`)
*   **Service Owner:** Chief Financial Officer (CFO).
*   **Business Purpose:** Integrates local banking networks and digital wallets for payment of government fees.
*   **SLA Target:** Instant transaction authorization (< 3 seconds).
*   **Availability Target:** 99.95% uptime.
*   **Support Level:** Tier 1, Tier 2 (Financial Clerk), Tier 3 (Gateway Integration Engineer).
*   **Escalation Path:** CFO ➔ Ministry IT Director.

---

## 5. DIGITAL OPERATIONS CENTER (DOC) BLUEPRINT

The National Digital Operations Center (DOC) serves as the primary monitoring and security center, ensuring continuous visibility and operational integrity.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MCI Operational Monitoring Hub                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [ Platform Status: ONLINE ]            [ SLA Compliance: 99.2% ]       │
│  [ Active Sessions: 12,841 Users ]      [ API Gateway Success: 99.98% ] │
│                                                                         │
│  Service Queue Metrics:                                                 │
│  Company Registrations:  [ NORMAL ]     Licensing Pipeline: [ STABLE ]  │
│  Payment Integrations:   [ NORMAL ]     AI Advisory Engine: [ ACTIVE ]  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Monitoring and Command Layers
1.  **Platform Health Monitoring:** Tracks system availability, error rates, database transaction performance, and API latencies in real-time.
2.  **Workflow Monitoring Panel:** Displays active case backlogs across all 18 states, helping regional directors identify bottlenecks early.
3.  **Security Operations (SOC) Console:** Monitors login activities, firewall rules, data access events, and network traffic for suspicious patterns.
4.  **Executive Situation Dashboard:** High-contrast, scannable visual dashboard providing the Minister and Undersecretary with real-time operational indicators and alerts.

---

## 6. SERVICE LEVEL AGREEMENTS (SLA) & PERFORMANCE FRAMEWORK

To maintain service quality and accountability, the platform enforces strict Service Level Agreements (SLAs).

```
┌──────────────────────────────────────────────────────────┐
│              Operational Priority Matrix                 │
├──────────────┬──────────────────┬────────────────────────┤
│ Priority     │ Response Target  │ Resolution Target      │
├──────────────┼──────────────────┼────────────────────────┤
│ Critical (P1)│ < 15 Minutes     │ < 4 Hours              │
│ High (P2)    │ < 1 Hour         │ < 12 Hours             │
│ Medium (P3)  │ < 4 Hours        │ < 2 Business Days      │
│ Low (P4)     │ < 8 Hours        │ < 5 Business Days      │
└──────────────┴──────────────────┴────────────────────────┘
```

### 6.1 Priority Classification Guidelines
*   **P1 - Critical (SLA Breach Risk):** Total loss of a core platform service (e.g., public database offline) affecting citizens nationwide.
*   **P2 - High (SLA Warning Risk):** Degraded service performance or partial outage (e.g., delay in certificate generation or SMS delivery failures) affecting a regional office.
*   **P3 - Medium:** Non-critical operational issue (e.g., minor interface error or non-blocking portal bug) with an active workaround.
*   **P4 - Low:** General support request, documentation clarification, or template configuration update.

---

## 7. BUSINESS CONTINUITY & RISK MANAGEMENT GUIDE

The platform features comprehensive operational continuity plans, protecting critical government records and services from unforeseen disruptions.

```
[ Incident Triggered ] ──► [ Isolate Active Area ] ──► [ Route to Backup DR ] ──► [ Restore Integrity ]
```

### 7.1 Recovery and Risk Management Controls
1.  **Platform Failures and Cloud Outages:** The application is deployed across multiple Google Cloud regions. If a regional outage occurs, traffic is automatically redirected to healthy zones, ensuring uninterrupted access.
2.  **Database Failures (Firestore):** Databases utilize multi-region configurations with real-time replication and continuous backup captures, preventing data loss and enabling point-in-time recovery.
3.  **Cybersecurity Incidents (Breaches):** Security incidents trigger instant isolation of affected segments. Access credentials are automatically rotated, and the SOC team initiates a forensic review.
4.  **Sovereign Communication Failures:** If a core network or local SMS gateway fails, the platform automatically switches to alternate secure email channels or mobile push systems.

---

## 8. AI OPERATIONS & GOVERNANCE FRAMEWORK

MCI implements responsible AI operational controls, ensuring that server-side **Gemini models** operate securely, transparently, and as advisory-only tools.

```
┌──────────────────────────────────────────────────────────┐
│                 Sovereign AI Governance                  │
├─────────────────┬────────────────────────────────────────┤
│ Governance Area │ Operational Implementation             │
├─────────────────┼────────────────────────────────────────┤
│ Advisory        │ AI is blocked from editing states or   │
│ Controls        │ modifying data payloads directly.      │
├─────────────────┼────────────────────────────────────────┤
│ Auditability    │ Every recommendation, score, and draft  │
│ Logs            │ generated by the AI is fully logged.   │
├─────────────────┼────────────────────────────────────────┤
│ Performance     │ Evaluates accuracy and monitors models │
│ Monitoring      │ for bias or drift periodically.        │
└─────────────────┴────────────────────────────────────────┘
```

### 8.1 Key AI Operational Controls
1.  **Strict Advisory Standby:** All AI recommendations, data extractions, and draft templates are presented exclusively as suggestions within administrative panels. The AI is structurally blocked from editing states or modifying data payloads directly.
2.  **Performance and Accuracy Audits:** Systems analyze AI recommendations against finalized caseworker decisions, tracking accuracy rates and identifying potential algorithmic bias.
3.  **Human-in-the-Loop Override:** Authorized caseworkers have complete authority to override or correct any AI-generated classification, with every override action recorded in the system logs.

---

## 9. EXECUTIVE OPERATIONS DASHBOARD SPECIFICATION

This section details the design and visual layout of the executive operational dashboards, ensuring high-contrast, professional, and accessible presentations.

```
+───────────────────────────────────────────────────────────+
│                      MCI PORTAL HEADER                    │
│  (Sovereign Logo)   Undersecretary Operations Hub         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  [ Active Registrations: 14,812 ]   [ SLA: 99.4% ]        │
│  [ Active Licenses:      22,410 ]   [ Daily Revenue: 25M ]│
│                                                           │
├───────────────────────────────────────────────────────────┤
│  Regional Registry Load Status:                           │
│  - Khartoum State:   [ NORMAL - 120 cases active ]        │
│  - Red Sea State:    [ STABLE - 45 cases active ]         │
│  - Gezira State:     [ WARNING - 95 cases active ]        │
+───────────────────────────────────────────────────────────+
```

### 9.1 Technical Visual Specifications
*   **Typography:** All dashboards and reports use **DIN Next Arabic** for Arabic (RTL) views and **DIN Next** for English (LTR) views, ensuring elegant and readable presentation.
*   **High-Contrast Color Scheme:** Matches the Ministry's sovereign theme, using professional greens, golds, and high-contrast charcoal grays to ensure readability.
*   **Responsive Multi-Device Layout:** Responsive dashboards are optimized to render clearly on desktop, tablet, and mobile devices, supporting field operations.

---

## 10. NATIONAL DIGITAL GOVERNMENT OPERATIONS HANDBOOK

### 10.1 Executive Manual Summary
The National Digital Government Operations Handbook establishes a secure, sustainable, and highly efficient operational ecosystem for the Republic of Sudan Ministry of Commerce & Industry. By combining ITIL-aligned service management, robust business continuity controls, and proactive platform monitoring, the platform guarantees that every citizen and business owner has continuous access to reliable digital services.

All future development, system integrations, and policy changes must comply with the guidelines, taxonomies, and operational workflows defined in this handbook to preserve the security, integrity, and scalability of the nation's digital infrastructure.
