# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### MASTER BLUEPRINT: ENTERPRISE ANALYTICS, BUSINESS INTELLIGENCE & DECISION SUPPORT FRAMEWORK (v1.0.0)

---

## 1. EXECUTIVE SUMMARY & BI ARCHITECTURE

This document establishes the official **Enterprise Analytics, Business Intelligence, and Executive Decision Support Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI) platform. Formulated under the national "Sudan 2035 Digital Sovereignty Directive," this framework is engineered to transition the Ministry from manual, retrospective reporting into a **real-time, data-driven, and predictive decision-making organization**.

To prevent analytical silos, all transactional, inspection, financial, and external data are integrated into a unified Data Intelligence Lakehouse, isolating analytical processing from core transaction engines.

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│ Operational Datastores │ ───► │  Data Lakehouse ETL    │ ───► │   Analytics & BI       │
│ (Firestore/SQL Core)   │      │  (Airflow / dbt Sync)  │      │   Presentation Layer   │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
                                                                            │
                                                                   ┌────────┴────────┐
                                                                   ▼                 ▼
                                                            ┌─────────────┐   ┌─────────────┐
                                                            │ Executive   │   │ Sovereign AI│
                                                            │ Dashboards  │   │  Analytics  │
                                                            └─────────────┘   └─────────────┘
```

### Analytics Principles:
1.  **Single Source of Truth:** All executive dashboards, operational reports, and AI insights must draw from verified, consolidated data models in the Data Lakehouse.
2.  **Explainable AI (XAI):** AI-generated forecasts and summaries must clearly list their source data points and confidence levels. AI metrics remain advisory; final regulatory decisions are made by human officials.
3.  **Role-Based Data Security:** Row-Level Security (RLS) and Attribute-Based Access Control (ABAC) are strictly enforced to protect sensitive corporate, citizen, and financial records.
4.  **Bilingual Localized Delivery:** All reports, dashboards, and automated summaries must be generated in both Arabic (DIN Next Arabic) and English (DIN Next).
5.  **Performance and Performance Autonomy:** Analytical queries must never degrade the performance of transactional service systems.

---

## 2. GOVERNMENT KPI DICTIONARY

The platform establishes clear Key Performance Indicators (KPIs) to measure and monitor organizational performance across key divisions.

```
                   +----------------------------------------------+
                   |           MCI Performance Metrics            |
                   +----------------------+-----------------------+
                                          |
       +-------------------+--------------+--------------+------------------+
       |                   |                             |                  |
+------v------+     +------v------+               +------v------+    +------v------+
| Commercial  |     | Industrial  |               | Investment  |    |  Consumer   |
| Registries  |     |  Licensing  |               |  Promotions |    | Protection  |
+-------------+     +-------------+               +-------------+    +-------------+
```

### 2.1 Commercial Registration Metrics
*   **KPI-CR-01: New Entity Growth Rate**
    *   *Definition:* Monthly percentage growth in newly incorporated companies, partnerships, and sole proprietorships.
    *   *Formula:* `((New Registrations [Current Month] - New Registrations [Prev Month]) / New Registrations [Prev Month]) * 100`
    *   *Target:* > 5% MoM growth.
*   **KPI-CR-02: Average Registration SLA Compliance**
    *   *Definition:* Percentage of company registrations approved or rejected within the 24-hour target SLA.
    *   *Target:* > 95% compliance rate.
*   **KPI-CR-03: Business Attrition Ratio**
    *   *Definition:* Ratio of cancelled or suspended registrations to active corporate entities over a 12-month period.

### 2.2 Industrial Licensing Metrics
*   **KPI-IL-01: Factory Production Growth Index**
    *   *Definition:* Tracking the total output capacity of active factories, categorized by sector (e.g., Agriculture, Textiles, Chemicals).
*   **KPI-IL-02: Ecological Compliance Rate**
    *   *Definition:* Percentage of active industrial plants that passed their semi-annual environmental site audits without violations.
    *   *Target:* > 90% compliance.

### 2.3 Investment Promotion Metrics
*   **KPI-IS-01: Foreign Direct Investment (FDI) Volume**
    *   *Definition:* Sum of registered foreign capital deposits in USD.
*   **KPI-IS-02: Industrial Zone Utilization Rate**
    *   *Definition:* Percentage of allocated industrial land lots currently under active plant construction or operation.
    *   *Target:* > 75% utilization of allocated plots within 18 months of land grant.

### 2.4 Consumer Protection & Enforcement Metrics
*   **KPI-CP-01: Complaint Resolution SLA**
    *   *Definition:* Average hours elapsed from consumer complaint filing (`PR-CP-001`) to resolution or inspector dispatch.
    *   *Target:* < 48 Hours for standard complaints; < 12 Hours for critical alerts (e.g., expired food safety).
*   **KPI-CP-02: Merchant Violation Recidivism Rate**
    *   *Definition:* Percentage of merchants with more than one registered citation within a 6-month period.

### 2.5 Technology & Service Delivery Metrics
*   **KPI-TD-01: Digital Service Adoption Rate**
    *   *Definition:* Percentage of total applications submitted online vs. processed via manual office entries.
    *   *Target:* > 98% of all applications processed digitally.
*   **KPI-TD-02: Abandonment Rate**
    *   *Definition:* Percentage of started registration forms that are abandoned by the applicant before submission.

---

## 3. EXECUTIVE DASHBOARD SPECIFICATIONS

The platform features tailored dashboard views, ensuring that officers and executives see relevant data matching their administrative scope.

```
       [ Executive User Group ] ──► [ Dashboard Gateway Router ]
                                              │
       ┌──────────────────────────────────────┼──────────────────────────────────────┐
       ▼                                      ▼                                      ▼
┌──────────────┐                       ┌──────────────┐                       ┌──────────────┐
│   Minister   │                       │  Dept Director│                       │  Enforcement │
│  Dashboard   │                       │  Dashboard   │                       │  Dashboard   │
│Strategic KPIs│                       │SLA Trackers  │                       │Incident Maps │
└──────────────┘                       └──────────────┘                       └──────────────┘
```

### 3.1 Minister Dashboard (Strategic View)
*   **Purpose:** High-level strategic oversight of national trade, revenue, and economic growth indicators.
*   **Key Visualization Widgets:**
    *   *FDI Flow Trend:* Line chart showing quarterly foreign direct investment inflow in USD vs. domestic capital.
    *   *National Revenue Map:* Geographic map of Sudan showing revenues collected from commercial and industrial fees by state.
    *   *Macro Trade Balance Index:* Dual-axis chart displaying import vs. export license volumes and values.
*   **AI Summary Card:** Integrated AI-generated narrative summarizing the week's key performance alerts (e.g., *"Export licensing is up 12% following streamlined gold trade regulations, while SLA response times in River Nile state have dropped by 3 hours."*).

### 3.2 Department Director Dashboard (Operational View)
*   **Purpose:** Active monitoring of casework queues, SLA compliance, and caseworker performance.
*   **Key Visualization Widgets:**
    *   *Casework Queue Funnel:* Sankey diagram showing applications progressing through Draft -> Under Review -> Pending Payment -> Approved.
    *   *Caseworker Workload Balance:* Grouped horizontal bar chart showing assigned, pending, and completed tasks per casework officer.
    *   *SLA Near-Breach Alerts:* Red-orange alert panel showing cases exceeding 80% of their SLA target.

### 3.3 Enforcement & Inspection Dashboard (Field View)
*   **Purpose:** Monitoring of active merchant complaints, inspector assignments, and safety citations.
*   **Key Visualization Widgets:**
    *   *Live Violation Heatmap:* Interactive map displaying geographic clusters of price-gouging or safety violations.
    *   *Inspector Dispatch Schedule:* Time-series Gantt chart tracking field inspectors on active audits.
    *   *Citation Payment Status:* Pie chart showing paid vs. unpaid citation fines.

---

## 4. DATA VISUALIZATION STANDARDS

All reporting dashboards must use consistent, high-contrast, and intuitive visualization components to support quick data analysis.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Data Visualization Guidelines                     │
├───────────────────┬────────────────────────────────────────────────────┤
│ Line Charts       │ Used exclusively for temporal trends. No more than │
│                   │ 4 active data lines on a single chart.             │
├───────────────────┼────────────────────────────────────────────────────┤
│ Bar Charts        │ Used for comparative values. Horizontal orientation│
│                   │ for listings with long labels or names.            │
├───────────────────┼────────────────────────────────────────────────────┤
│ Sankey Diagrams   │ Enforced for workflow funnel tracking.             │
├───────────────────┼────────────────────────────────────────────────────┤
│ Geographic Maps   │ Used for regional metrics. High-contrast colors to │
│                   │ highlight hotspots.                                │
└───────────────────┴────────────────────────────────────────────────────┘
```

*   **Line Charts:** Used exclusively for time-series trends (e.g., MoM growth of new registrations). Lines must have distinct, high-contrast colors, with hover tooltips displaying precise coordinates.
*   **Bar Charts:** Used for comparing discrete categories (e.g., active factories by state). Use horizontal layouts for datasets with long text labels.
*   **Pie / Donut Charts:** Limited to showing simple part-to-whole relationships with 4 or fewer categories (e.g., active vs. suspended licenses).
*   **Color Palette (Sovereign Theme):**
    *   *Primary Brand Accent:* Gold `#D4AF37` / Sudan Green `#007A33`.
    *   *Neutral Grays:* Soft Slate backgrounds with charcoal text to reduce eye strain.
    *   *Alert States:* Standard Red `#D32F2F` (Breaches, critical errors), Amber `#F57C00` (Warnings, pending action), Green `#388E3C` (Success, normal operation).

---

## 5. DECISION INTELLIGENCE FRAMEWORK

The platform features built-in decision intelligence capabilities to help executives analyze trends, identify variance, and evaluate future scenarios.

```
               [ Analytical Request ]
                         │
                         ▼
┌──────────────────────────────────────────────────┐
│ 1. Time-Series Trend Analysis (Trailing Average) │
└────────────────────────┬─────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────┐
│ 2. Variance Analysis (Actual vs. Expected SLAs)  │
└────────────────────────┬─────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────┐
│ 3. Capacity Forecasting & Scenario Comparison    │
└──────────────────────────────────────────────────┘
```

### 1. Trailing Average Trend Analysis
*   The system calculates 30-day and 90-day rolling averages for service processing times to identify long-term efficiency trends, smoothing out temporary daily traffic fluctuations.

### 2. Variance Analysis
*   Automatically compares actual processing times against target SLAs across different states. If a regional office deviates from the baseline by more than 15% over a two-week period, the system flags the office for review.

### 3. Capacity Forecasting
*   Uses historical registration data to project upcoming application volumes. This helps department heads plan staffing levels ahead of seasonal spikes (e.g., during annual business renewal cycles).

### 4. Scenario Comparison
*   Allows policy makers to model the potential impact of fee or policy changes (e.g., *"If registration fees for light manufacturing are reduced by 25%, what is the projected growth in registrations required to maintain budget neutrality?"*).

---

## 6. AI-ASSISTED ANALYTICS & NATURAL LANGUAGE QUERIES

The integration of server-side Gemini models provides a secure, natural language interface for accessing platform analytics and generating insights.

```
                [ Natural Language Input ]
               "Show me registration growth"
                            │
                            ▼
           ┌──────────────────────────────────┐
           │ Gemini Translation to SQL Query  │
           └────────────────┬─────────────────┘
                            │
                            ▼
           ┌──────────────────────────────────┐
           │ Secure Lakehouse DB Execution    │
           └────────────────┬─────────────────┘
                            │
                            ▼
           ┌──────────────────────────────────┐
           │ Natural Language Summary Output  │
           └──────────────────────────────────┘
```

### AI Analytics Capabilities:
1.  **Natural Language Query (NLQ):** Allows authorized executives to request custom reports using everyday language (e.g., *"ما هي أكثر خمس ولايات مبيعاً للصادرات الزراعية في الربع الأخير"* / *"Show me the top five states for agricultural exports in the last quarter"*). The system translates the request into an optimized query, retrieves the data, and presents a summarized response.
2.  **Automated Anomaly Detection:** The system continuously monitors transactional feeds. If an unusual pattern is detected (e.g., a sudden 300% surge in price-gouging complaints in a specific locality), the AI flags the event and drafts an advisory alert for supervisors.
3.  **Explainability Standards:** All AI-generated charts or forecasts must include a "Data Sources" link, allowing users to verify the underlying records and review the calculations used.

---

## 7. MONITORING & ALERTING FRAMEWORK

The platform features a configurable alerting system to notify administrators of operational events and potential issues.

```
                     [ Sensor Log Feed ]
                              │
                              ▼
               ┌──────────────────────────────┐
               │    Alert Threshold Trigger   │
               └──────────────┬───────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
      [ Level 1 ]                         [ Level 2 ]
    Supervisor In-App                  Director SMS/Email
```

### 7.1 Alert Tier Definitions

| Alert Tier | Trigger Condition | Delivery Target | Default Notification Method |
| :--- | :--- | :--- | :--- |
| **Operational Warning (L1)** | Department SLA compliance falls below 90% for a 24-hour period. | Department Supervisor | Dashboard notification, daily email digest. |
| **Critical Escalation (L2)** | SLA compliance falls below 80%, or a system integration endpoint is unresponsive for > 15 minutes. | Department Director | High-priority SMS alert, Microsoft Teams/Slack integration. |
| **Emergency Breach (L3)** | Unauthorized administrative access attempt, or data export volume exceeds thresholds. | Chief Security Officer | Immediate automated phone call, secure email, PagerDuty alert. |

---

## 8. OPEN DATA GOVERNANCE GUIDE

To support public transparency and economic research, the Ministry publishes anonymized economic datasets through an official Open Data portal.

```
+────────────────+     +────────────────+     +────────────────+     +────────────────+
|  1. Extract    | ──► | 2. Anonymize   | ──► |   3. Approve   | ──► |  4. Publish    |
| (Raw Database)       | (Strip PII)    |     |  (Legal Audit) |     |  (JSON/CSV)    |
+────────────────+     +────────────────+     +────────────────+     +────────────────+
```

### 8.1 Open Data Principles
1.  **Strict Anonymization:** Personally Identifiable Information (PII)—including names, national IDs, precise physical locations, and tax numbers—must be stripped from all datasets before publication.
2.  **Machinable Formats:** Data must be published in standard, structured formats (e.g., CSV, JSON, Parquet) with comprehensive metadata descriptions.
3.  **Approved Public Datasets:**
    *   *Commercial Registry Indexes:* Monthly listings of active company counts and capitalization amounts, grouped by state and business sector.
    *   *Industrial Production Growth:* Aggregated manufacturing performance indices showing overall industrial activity trends.
    *   *Consumer Safety Reports:* Summary lists of resolved food and product safety recalls.

---

## 9. ANALYTICS SECURITY & ACCESS MODEL

To maintain data privacy and comply with security requirements, access to analytics and reporting tools is strictly governed by Role-Based and Row-Level Security policies.

```
                      [ User Query Request ]
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ Check IAM Role & Permissions                 │
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │ Apply Row-Level Filter (e.g., State = RedSea)│
         └──────────────────────┬───────────────────────┘
                                │
                                ▼
                     [ Filtered Results Only ]
```

### Security Controls:
1.  **Row-Level Security (RLS):** Data access is partitioned based on the user's administrative jurisdiction. For example, a Regional Director for the Red Sea state can only view transactional and operational metrics originating from their state's offices.
2.  **Sensitive Column Masking:** Financial transaction records and personal identification fields are masked by default in analytical views. Only authorized auditors can unmask fields, with each action recorded in the security logs.
3.  **Audit Logs for Analytical Queries:** Every custom data export, query execution, and report generation is logged, capturing the user's ID, query parameters, timestamp, and IP address.

---

## 10. ENTERPRISE ANALYTICS GOVERNANCE & REPORT LIFECYCLE

To keep reporting systems accurate and relevant, all analytical assets follow a structured governance cycle, managed through a Ministry Balanced Scorecard.

```
                         Balanced Scorecard Perspective
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
┌──────────────┐                ┌──────────────┐                ┌──────────────┐
│  Financial   │                │   Citizen    │                │   Internal   │
│ Perspective  │                │ Perspective  │                │  Processes   │
│Revenue Growth│                │SLA Compliance│                │ Casework SLAs│
└──────────────┘                └──────────────┘                └──────────────┘
```

### 1. Balanced Scorecard Integration
Strategic goals are mapped directly to operational KPIs in the Ministry Balanced Scorecard:
*   *Financial Perspective:* Tracking revenue growth, penalty collection rates, and cost per transaction.
*   *Citizen & Investor Perspective:* Measuring user satisfaction scores, service accessibility rates, and average resolution times.
*   *Internal Process Perspective:* Monitoring caseworker workloads, application first-time pass rates, and integration latency.

### 2. Report Maintenance and Review Cycle
*   **Report Ownership:** Every active report and dashboard has an assigned business owner (e.g., the Director of the Commercial Registry is the owner of all CR performance dashboards).
*   **Annual Asset Audit:** The analytics team reviews all active dashboards annually. Unused reports or those with redundant data are archived to maintain system performance and declutter administrative interfaces.
*   **Version Control for Analytical Models:** Changes to key metrics calculations or reporting schemas are managed in a staging environment and deployed with version numbers to preserve historical reporting consistency.
