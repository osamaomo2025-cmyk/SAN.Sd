# جمهورية السودان | Republic of Sudan
## وزارة التجارة والصناعة | Ministry of Commerce & Industry
### NATIONAL GOVERNMENT INTELLIGENCE & DECISION SUPPORT HANDBOOK (v1.0.0)
#### Enterprise Business Intelligence, Executive Analytics, KPI Framework, and Sovereign AI Decision Support

---

## 1. ENTERPRISE BUSINESS INTELLIGENCE ARCHITECTURE

This handbook defines the authoritative **Enterprise Business Intelligence Architecture (EBIA)** and **Executive Decision Support Framework** for the Sudan Digital Ministry of Commerce & Industry (MCI). Designed under the national digital modernization mandate, this architecture transforms operational transactional data into high-value strategic insights, allowing the Ministry to move from reactive administration to proactive, data-driven governance.

The system is architected to utilize **Google Cloud Firestore** as the immediate operational reporting source, with a design that supports future, low-impact data warehousing syncs to **Google BigQuery** and real-time visualization in **Looker Studio** for advanced, high-scale analytical workloads.

```
       [ Core Operational Database: Cloud Firestore ]
                             │
                             ▼ (Change Data Capture / Scheduled Pipeline)
         +───────────────────────────────────────+
         │   Cloud Pub/Sub Message Dispatcher    │
         +───────────────────┬───────────────────+
                             │
                             ▼
         +───────────────────────────────────────+
         │      Google Cloud BigQuery Sync       │ (Analytics Lakehouse Layer)
         +───────────────────┬───────────────────+
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
+───────────────────────+         +───────────────────────+
│   Looker Studio BI    │         │  Sovereign Gemini AI  │ (Decision Support
│  (Executive Visuals)  │         │  (Predictive Engine)  │  & Narrative Summaries)
+───────────────────────+         +───────────────────────+
```

### 1.1 Architectural Foundations
*   **Operational Decoupling:** Live transactional systems remain independent of analytical processing. Queries are executed against read-optimized reporting collections or synced data lakes to protect transactional throughput and prevent system latency.
*   **BigQuery & Looker Studio Integration Path:** The architecture supports seamless pipelines from Firestore collections using Cloud Functions to load change logs into BigQuery tables, enabling Looker Studio to render high-performance multi-year trend charts.
*   **Sovereign Multilingual Delivery:** All dashboards, exports, and automated reports utilize the **DIN Next Arabic** font for Arabic (RTL) views and the **DIN Next** font for English (LTR) views, ensuring elegant, legible, government-grade typography.

---

## 2. EXECUTIVE DASHBOARD FRAMEWORK

The platform establishes distinct, role-based dashboard templates configured to provide relevant, high-contrast, and action-oriented dashboards matching each executive's level of authority.

```
                  [ Executive & Leadership User Group ]
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│    Minister     │        │ Undersecretary  │        │Regional Director│
│  Strategic View │        │ Operational View│        │ Jurisdictional  │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

### 2.1 Dashboard Templates

#### 2.1.1 Minister Dashboard (Strategic Oversight)
*   **Business Purpose:** Provides high-level visibility into national economic growth, revenue collections, trade flows, and inter-ministerial policy compliance.
*   **Executive KPI Cards:** Consolidated National Revenue (SDG/USD), Active Trade Companies, FDI Capital Volume, Overall SLA Compliance Rate.
*   **Visualizations:** Multi-axis Line Chart of Imports vs. Exports, Interactive Heatmap of Regional Corporate Growth, Bar Chart of Leading Trade Sectors.
*   **AI Insights Panel:** An integrated panel summarizing weekly economic highlights (e.g., *"Agriculture licensing rose by 14% this month, primarily driven by gum arabic exports, while industrial permit renewals are experiencing a 4% decline in the River Nile region."*).

#### 2.1.2 Undersecretary Dashboard (Operational & Process Oversight)
*   **Business Purpose:** Monitors departmental efficiency, active case bottlenecks, and civil service performance across all states.
*   **Executive KPI Cards:** Median Processing Time (SLA), Active Caseworkers, Overdue Applications, Daily Registry Collections.
*   **Visualizations:** Casework Workflow Funnel (Sankey Diagram showing Draft ➔ Under Review ➔ Approved), Caseworker Workload Balance Chart, Daily Ticket Completion Trend.
*   **Alerts Panel:** Real-time indicator highlighting departments or regional offices approaching SLA breach targets.

#### 2.1.3 Regional Director Dashboard (Jurisdictional Oversight)
*   **Business Purpose:** Provides localized oversight of regional commerce registries, inspection dispatch, and merchant compliance metrics.
*   **Executive KPI Cards:** Regional Registry Count, Regional Compliance Rate, Active Inspectors, Collected Violation Fines.
*   **Visualizations:** Regional Inspection Outcomes (Compliant vs. Violated), Active Inspector Geolocation Map, Local Licensing SLA Compliance.

---

## 3. GOVERNMENT KPI & METRICS CATALOG

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Ministry KPI Taxonomy Matrix                    │
├───────────────────┬────────────────────────────────────────────────────┤
│ Sector Code       │ Operational Metrics Monitored                      │
├───────────────────┼────────────────────────────────────────────────────┤
│ REG (Registry)    │ Company Registrations, Active Entities, Renewals   │
│ IND (Industrial)  │ Output Vol, Safety Compliance, Sector Distribution  │
│ INV (Investment)  │ FDI Inflow, Zone Utilization, Capital Targets      │
│ LIC (Licensing)   │ Issuance Rates, SLA Compliance, Revenue collection │
│ CON (Consumer)    │ Complaints Triage, Recidivism Rates, Violations   │
│ INS (Inspection)  │ Inspector Productivity, Regional Citation Volumes  │
│ CMP (Complaints)  │ Categories, Resolution Times, Satisfaction Indices │
│ PAY (Payments)    │ Revenue Streams, Daily Collections, Outstanding Fee│
│ SYS (Operations)  │ Active Sessions, API Response Times, AI Suggestion │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

### 3.1 Commercial Registry KPIs

#### 3.1.1 KPI-REG-01: Company Incorporation Volume
*   **Arabic Name:** حجم تأسيس الشركات التجارية الجديدة
*   **English Name:** Company Incorporation Volume
*   **Business Definition:** Total number of newly registered commercial corporations, partnerships, and sole proprietorships.
*   **Formula:** `Count(registered_companies) WHERE registration_date BETWEEN start_date AND end_date`
*   **Unit of Measure:** Corporate Entities
*   **Target Value:** 250 new company incorporations per month.
*   **Warning Threshold:** < 200 incorporations.
*   **Critical Threshold:** < 150 incorporations.
*   **Owner:** Director of Commercial Registry
*   **Reporting Frequency:** Monthly
*   **Data Source:** `/workflow_instances` (Filter: State = `COMPLETED`, Workflow = `WF-REG-COMPANY`).
*   **Business Interpretation:** High volumes indicate positive business environment sentiment; drops suggest bureaucratic delays or economic downturns.

#### 3.1.2 KPI-REG-02: Registry Active Standing Rate
*   **Arabic Name:** نسبة الشركات النشطة في السجل التجاري
*   **English Name:** Registry Active Standing Rate
*   **Business Definition:** Percentage of registered companies maintaining active standing by filing renewals and maintaining required licenses.
*   **Formula:** `(Count(companies WHERE standing = 'ACTIVE') / Total(registered_companies)) * 100`
*   **Unit of Measure:** Percentage (%)
*   **Target Value:** > 85%
*   **Warning Threshold:** < 80%
*   **Critical Threshold:** < 75%
*   **Owner:** Director of Commercial Registry
*   **Reporting Frequency:** Quarterly
*   **Data Source:** `/companies` collection state field.
*   **Business Interpretation:** Measures corporate sustainability and compliance with annual report filing requirements.

---

### 3.2 Industrial Services KPIs

#### 3.2.1 KPI-IND-01: Factory Output Growth Index
*   **Arabic Name:** مؤشر نمو الإنتاج الصناعي للمصانع
*   **English Name:** Factory Output Growth Index
*   **Business Definition:** Aggregate production volume trends across registered factories, classified by industrial sector.
*   **Formula:** `((Total_Output[Current_Period] - Total_Output[Base_Period]) / Total_Output[Base_Period]) * 100`
*   **Unit of Measure:** Percentage (%)
*   **Target Value:** > 4% Annual Growth.
*   **Warning Threshold:** < 2% Growth.
*   **Critical Threshold:** < 0% (Negative Growth).
*   **Owner:** Director of Industrial Services
*   **Reporting Frequency:** Semi-Annually
*   **Data Source:** `/industrial_plant_reports` capacity index.
*   **Business Interpretation:** Indicates industrial health and highlights capacity constraints in key manufacturing sectors.

#### 3.2.2 KPI-IND-02: Industrial Ecological Compliance Rate
*   **Arabic Name:** معدل الالتزام البيئي والإنشائي للمنشآت الصناعية
*   **English Name:** Industrial Ecological Compliance Rate
*   **Business Definition:** Percentage of active factories passing environmental and site-safety compliance checks during field audits.
*   **Formula:** `(Count(inspections WHERE type = 'INDUSTRIAL' AND result = 'COMPLIANT') / Total(inspections WHERE type = 'INDUSTRIAL')) * 100`
*   **Unit of Measure:** Percentage (%)
*   **Target Value:** > 92%
*   **Warning Threshold:** < 85%
*   **Critical Threshold:** < 80%
*   **Owner:** Lead Industrial Inspector
*   **Reporting Frequency:** Quarterly
*   **Data Source:** `/inspection_reports` compliance status metrics.
*   **Business Interpretation:** Measures factory alignment with national safety and environmental preservation standards.

---

### 3.3 Investment Services KPIs

#### 3.3.1 KPI-INV-01: Foreign Direct Investment (FDI) Volume
*   **Arabic Name:** حجم الاستثمار الأجنبي المباشر المستقطب
*   **English Name:** Foreign Direct Investment (FDI) Volume
*   **Business Definition:** Total value of registered foreign capital investments deposited or committed under strategic investment agreements.
*   **Formula:** `Sum(committed_capital_usd WHERE investor_type = 'FOREIGN')`
*   **Unit of Measure:** United States Dollar (USD)
*   **Target Value:** $25,000,000 USD per quarter.
*   **Warning Threshold:** < $18,000,000 USD.
*   **Critical Threshold:** < $10,000,000 USD.
*   **Owner:** Investment Commissioner
*   **Reporting Frequency:** Quarterly
*   **Data Source:** `/investment_agreements` capital registries.
*   **Business Interpretation:** Indicates Sudan’s attractiveness to international businesses and the effectiveness of investment incentives.

#### 3.3.2 KPI-INV-02: Industrial Zone Land Utilization Rate
*   **Arabic Name:** معدل استغلال الأراضي بالمناطق الصناعية الحرة
*   **English Name:** Industrial Zone Land Utilization Rate
*   **Business Definition:** Percentage of allocated industrial zone plots currently built-out and operating.
*   **Formula:** `(Total_Area_Under_Construction_or_Operation / Total_Allocated_Industrial_Land_Area) * 100`
*   **Unit of Measure:** Percentage (%)
*   **Target Value:** > 80%
*   **Warning Threshold:** < 70%
*   **Critical Threshold:** < 60%
*   **Owner:** Director of Industrial Land Zones
*   **Reporting Frequency:** Annually
*   **Data Source:** `/industrial_land_plots` allocation and GIS records.
*   **Business Interpretation:** Highlights efficiency in land concessions and identifies idle or speculative land usage.

---

### 3.4 Licensing KPIs

#### 3.4.1 KPI-LIC-01: Average License Issuance Duration
*   **Arabic Name:** متوسط زمن إصدار وتجديد رخص التشغيل التجارية
*   **English Name:** Average License Issuance Duration
*   **Business Definition:** Median duration from successful license fee payment to final permit delivery.
*   **Formula:** `Median(license_issued_timestamp - fee_payment_timestamp)`
*   **Unit of Measure:** Hours
*   **Target Value:** < 24 Hours
*   **Warning Threshold:** > 36 Hours
*   **Critical Threshold:** > 48 Hours
*   **Owner:** Director of Licensing and Permits
*   **Reporting Frequency:** Weekly
*   **Data Source:** `/workflow_instances` state timestamps.
*   **Business Interpretation:** Measures processing efficiency and identifies administrative delays in the licensing pipeline.

---

### 3.5 Consumer Protection KPIs

#### 3.5.1 KPI-CON-01: Critical Food & Product Safety Triage Time
*   **Arabic Name:** سرعة الاستجابة لبلاغات سلامة الأغذية والسلع الحرجة
*   **English Name:** Critical Food & Safety Triage Time
*   **Business Definition:** Median elapsed time from the filing of a critical consumer safety violation report to inspector dispatch.
*   **Formula:** `Median(inspector_dispatched_timestamp - complaint_filed_timestamp WHERE category = 'CRITICAL_SAFETY')`
*   **Unit of Measure:** Hours
*   **Target Value:** < 4 Hours
*   **Warning Threshold:** > 6 Hours
*   **Critical Threshold:** > 12 Hours
*   **Owner:** Director of Consumer Protection
*   **Reporting Frequency:** Daily
*   **Data Source:** `/complaints` and `/inspection_reports` linked events.
*   **Business Interpretation:** Evaluates the Ministry’s responsiveness to urgent consumer health and safety hazards.

#### 3.5.2 KPI-CON-02: Merchant Violation Recidivism Rate
*   **Arabic Name:** نسبة تكرار المخالفات لدى المنشآت التجارية المخالفة
*   **English Name:** Merchant Violation Recidivism Rate
*   **Business Definition:** Percentage of penalized merchants found to have committed a repeat price or safety violation within a 6-month period.
*   **Formula:** `(Count(merchants WHERE violation_count > 1) / Total_Penalized_Merchants) * 100`
*   **Unit of Measure:** Percentage (%)
*   **Target Value:** < 15%
*   **Warning Threshold:** > 20%
*   **Critical Threshold:** > 30%
*   **Owner:** Legal Compliance Lead
*   **Reporting Frequency:** Monthly
*   **Data Source:** `/merchant_violations` historical logs.
*   **Business Interpretation:** Indicates the effectiveness of enforcement penalties and deterrent measures.

---

### 3.6 Inspection KPIs

#### 3.6.1 KPI-INS-01: Daily Inspector Productivity Index
*   **Arabic Name:** معدل إنتاجية المفتش الميداني اليومي
*   **English Name:** Daily Inspector Productivity Index
*   **Business Definition:** Average number of complete field inspections completed per active inspector per working day.
*   **Formula:** `Total_Completed_Inspections / (Active_Inspectors * Total_Working_Days)`
*   **Unit of Measure:** Audits / Inspector-Day
*   **Target Value:** > 6.0 inspections per day.
*   **Warning Threshold:** < 4.5 inspections.
*   **Critical Threshold:** < 3.0 inspections.
*   **Owner:** Chief Inspection Coordinator
*   **Reporting Frequency:** Weekly
*   **Data Source:** `/inspection_reports` linked to `/users` (Inspector role).
*   **Business Interpretation:** Measures field team efficiency and inspectorial team capacity.

---

### 3.7 Complaints KPIs

#### 3.7.1 KPI-CMP-01: Citizens Grievance Resolution SLA Rate
*   **Arabic Name:** معدل حل شكاوى المواطنين والمستثمرين حسب مؤشر الخدمة
*   **English Name:** Citizen Grievance Resolution SLA Rate
*   **Business Definition:** Percentage of business and public complaints resolved within the standard 5-day SLA target.
*   **Formula:** `(Count(complaints WHERE status = 'RESOLVED' AND resolution_duration <= 5_Days) / Total_Resolved_Complaints) * 100`
*   **Unit of Measure:** Percentage (%)
*   **Target Value:** > 95%
*   **Warning Threshold:** < 90%
*   **Critical Threshold:** < 80%
*   **Owner:** Customer Satisfaction Lead
*   **Reporting Frequency:** Monthly
*   **Data Source:** `/complaints` resolution timestamps.
*   **Business Interpretation:** Measures user satisfaction and the efficiency of the complaints resolution workflow.

---

### 3.8 Payments KPIs

#### 3.8.1 KPI-PAY-01: Daily Consolidated Revenue Collections
*   **Arabic Name:** حجم التحصيل المالي الإجمالي اليومي لرسوم الخدمات
*   **English Name:** Daily Consolidated Revenue Collections
*   **Business Definition:** Total value of fees and fines collected through integrated payment gateways across all states.
*   **Formula:** `Sum(payment_amount WHERE status = 'SETTLED' AND payment_date = current_date)`
*   **Unit of Measure:** Sudanese Pound (SDG)
*   **Target Value:** 25,000,000 SDG daily.
*   **Warning Threshold:** < 20,000,000 SDG.
*   **Critical Threshold:** < 15,000,000 SDG.
*   **Owner:** Chief Financial Officer
*   **Reporting Frequency:** Daily
*   **Data Source:** `/transactions` gateway clearance ledger.
*   **Business Interpretation:** Monitors revenue flows and helps track overall commercial activity trends.

---

### 3.9 System Operations KPIs

#### 3.9.1 KPI-SYS-01: Portal API Endpoint Response Latency
*   **Arabic Name:** سرعة استجابة واجهة برمجة التطبيقات للبوابة الرقمية
*   **English Name:** Portal API Endpoint Response Latency
*   **Business Definition:** 95th percentile response latency for core portal API endpoints.
*   **Formula:** `Percentile_95(api_response_duration)`
*   **Unit of Measure:** Milliseconds (ms)
*   **Target Value:** < 250 ms
*   **Warning Threshold:** > 500 ms
*   **Critical Threshold:** > 1000 ms
*   **Owner:** IT System Administrator
*   **Reporting Frequency:** Daily
*   **Data Source:** `/system_metrics` API access log logs.
*   **Business Interpretation:** Indicates system performance and helps identify network bottlenecks or server capacity issues.

---

## 4. REPORTING & VISUALIZATION STANDARDS

All reporting components and analytical dashboards must comply with the official visual layout and design rules, ensuring consistent presentation and professional, government-grade visual quality.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Dashboard Layout Hierarchy                      │
├───────────────────┬────────────────────────────────────────────────────┤
│ Top Row           │ Strategic KPI Summary Cards (3-4 widgets wide).     │
├───────────────────┼────────────────────────────────────────────────────┤
│ Middle Row        │ Primary Trend (Line Chart) and Funnel (Sankey).    │
├───────────────────┼────────────────────────────────────────────────────┤
│ Bottom Row        │ Geographic Heatmap and Operational Detail Tables.  │
└───────────────────┴────────────────────────────────────────────────────┘
```

### 4.1 Visual Components Guidelines
*   **Line & Area Charts:** Used exclusively for time-series trends (e.g., MoM company registration growth). Trendlines must have clear, high-contrast colors, with active hover states to display precise coordinates.
*   **Sankey & Funnel Diagrams:** Enforced for tracking workflows, allowing department heads to identify bottlenecks as applications move from Draft to Approved.
*   **Geographic Heatmaps:** Displays regional metrics (such as active companies or violation clusters) on a map of Sudan, helping regional directors allocate inspectors and resources.
*   **Color Palette (Sovereign Theme):**
    *   *Primary Accents:* Sudan Green `#007A33` (Success, Compliant, Growth) / Sovereign Gold `#D4AF37` (Strategic highlights, primary borders).
    *   *Alert Indicators:* Crimson Red `#D32F2F` (Breaches, critical errors, high risk) / Amber Gold `#F57C00` (Warnings, pending action).
    *   *Neutral Grays:* Dark Charcoal text on clean slate backgrounds, ensuring high contrast and readability under different lighting conditions.
*   **Accessibility Standards:** All dashboards must comply with WCAG 2.2 AA standards, ensuring readable font sizes, clear color contrast, and compatibility with screen readers. All views must be optimized for standard paper sizing (A4) to support clean, vector-quality PDF print exports.

---

## 5. AI DECISION SUPPORT FRAMEWORK

The platform integrates secure, server-side **Gemini models** (via the modern `@google/genai` SDK) to automate complex data analysis, draft executive reports, and identify emerging trends.

```
┌──────────────────────────────────────────────────────────┐
│              AI Predictive Processing Pipeline           │
├──────────────────────────────────────────────────────────┤
│ 1. Collect aggregated historical metrics data            │
│ 2. Run Gemini: Identify anomalies and project trends      │
│ 3. Generate plain-language executive summaries           │
│ 4. Link findings directly to historical data tables      │
│ 5. *Policy Guard*: AI summaries remain strictly advisory │
└──────────────────────────────────────────────────────────┘
```

### 5.1 Key AI Assisted Functions
1.  **Natural Language Query (NLQ) Engine:** Allows authorized executives to query system data using conversational language (e.g., *"ما هي نسبة الالتزام البيئي للمصانع في ولاية البحر الأحمر خلال الربع الأخير"* / *"Show me the environmental compliance rate for factories in Red Sea State last quarter"*). The system translates the request into an optimized query, retrieves the data, and displays the response.
2.  **Automated Anomaly Detection:** The system continuously monitors transactional logs. If an unusual pattern is detected (e.g., a sudden 200% surge in price-gouging alerts in a specific locality), the AI flags the event and drafts an advisory notification for regional directors.
3.  **Predictive Risk Forecasting:** Analyzes registration and licensing trends to project upcoming application volumes, helping department heads optimize staffing levels ahead of seasonal spikes (e.g., during annual renewal periods).
4.  **Sovereign Explainability Standard:** To ensure accuracy and accountability, all AI-generated charts, predictions, and summaries must include "Data Source" links, allowing users to verify the underlying records and review calculations.

---

## 6. OPERATIONAL & EXECUTIVE REPORTING GUIDE

The reporting engine manages a centralized catalog of standard reports, ensuring all stakeholders have access to accurate, up-to-date data.

```
              [ Analytical Request Trigger ]
                            │
                            ▼
           +─────────────────────────────────+
           │   Central SQL / Lakehouse Query │
           +────────────────┬────────────────+
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
     [ Public Portal ]             [ Executive PDF ]
     - Anonymized Open Data        - Encrypted & Watermarked
     - JSON / CSV Downloads        - Role-based restricted
```

### 6.1 Report Classifications & Catalog

#### 6.1.1 Weekly Minister Briefing Report (`REP-EXEC-WEEKLY`)
*   **Purpose:** High-level executive summary of trade volumes, industrial permits, active compliance issues, and treasury collections.
*   **Audience:** Minister, Undersecretary.
*   **Frequency:** Weekly (Mondays, 08:00 AM).
*   **Filters:** National, Sector-specific.
*   **Export Formats:** Print-Ready PDF.
*   **Security Classification:** CONFIDENTIAL (Requires executive authentication to open; watermarked with user ID).

#### 6.1.2 Monthly Registry SLA Compliance Audit (`REP-OPER-SLA`)
*   **Purpose:** Detailed performance review of company registration and licensing processing times against SLA targets.
*   **Audience:** Registrar General, Regional Directors.
*   **Frequency:** Monthly.
*   **Filters:** State, Department, Caseworker ID.
*   **Export Formats:** Excel (XLSX), CSV.
*   **Security Classification:** INTERNAL (Available to ministry management and quality assurance teams).

#### 6.1.3 National Consumer Price Deviation Matrix (`REP-CP-PRICE`)
*   **Purpose:** Tracks price index variations for essential commodities, highlighting regional price spikes and retail violations.
*   **Audience:** Consumer Protection Director, Market Inspectors.
*   **Frequency:** Daily.
*   **Filters:** Locality, Product Category.
*   **Export Formats:** PDF, Interactive GIS Dataset.
*   **Security Classification:** RESTRICTED (Accessible to enforcement teams and licensed price-monitoring liaisons).

#### 6.1.4 Public Trade Activity Transparency Report (`REP-PUB-STATS`)
*   **Purpose:** Promotes economic transparency by publishing anonymized business statistics and overall industrial growth trends.
*   **Audience:** General Public, Foreign Investors, Economists, National Media.
*   **Frequency:** Quarterly.
*   **Filters:** Broad Industrial Sector, Registration Year.
*   **Export Formats:** CSV, JSON.
*   **Security Classification:** PUBLIC (Open Data; personal and corporate identifiers are permanently removed).

---

## 7. ANALYTICS SECURITY & GOVERNANCE FRAMEWORK

To protect sensitive corporate and financial records, access to analytics tools is strictly governed by security policies.

```
                      [ User Report Request ]
                                 │
                                 ▼
         ┌──────────────────────────────────────────────┐
         │ Verify Role Permissions via IAM              │
         └──────────────────────┬───────────────────────┘
                                 │
                                 ▼
         ┌──────────────────────────────────────────────┐
         │ Apply Row-Level Filters (e.g., State = Kassala)│
         └──────────────────────┬───────────────────────┘
                                 │
                                 ▼
         ┌──────────────────────────────────────────────┐
         │ Mask Restricted Columns (PII, Financials)    │
         └──────────────────────┬───────────────────────┘
                                 │
                                 ▼
                     [ Render Secure Report ]
```

### 7.1 Security Controls & Policies
1.  **Row-Level Security (RLS):** Report outputs are dynamically filtered based on the user's jurisdiction. A Regional Director for Kassala State can only view metrics and registers originating from Kassala, preventing unauthorized access across states.
2.  **Sensitive Column Masking:** Financial transaction records and personal identification fields are masked by default in general reporting views. Only authorized auditors can view unmasked fields, with each action recorded in the security logs.
3.  **Audit Logs for Analytical Queries:** Every custom export, query execution, and report generation is logged, capturing the user's ID, query parameters, timestamp, and IP address.
4.  **Controlled PDF Watermarking:** Sensitive reports generated as PDFs are automatically overlaid with dynamic, semi-transparent watermarks indicating the user's ID, ip address, and the generation timestamp, preventing unauthorized sharing.

---

## 8. DATA QUALITY & KPI VALIDATION MANUAL

To ensure all dashboards display accurate and reliable information, the platform runs automatic data validation and quality checks.

```
┌──────────────────────────────────────────────────────────┐
│              Automated Data Validation Checks            │
├─────────────────┬────────────────────────────────────────┤
│ Validation Rule │ System Verification Action             │
├─────────────────┼────────────────────────────────────────┤
│ Missing Data    │ Detects and flags missing values in    │
│ Check           │ required fields during ETL processes.  │
├─────────────────┼────────────────────────────────────────┤
│ Temporal        │ Validates logical timeline order (e.g.,│
│ Integrity Check │ payment_date must be >= submission_date)│
├─────────────────┼────────────────────────────────────────┤
│ Database        │ Cross-checks transaction details with  │
│ Consistency     │ banking gateway records to ensure match.│
└─────────────────┴────────────────────────────────────────┘
```

### 8.1 Key Data Quality Controls
1.  **Automatic Anomaly Filtering:** Outliers and abnormal values (e.g., negative license fees or registration dates set in the future) are flagged during data processing, preventing them from skewing overall performance statistics.
2.  **SLA Integrity Verification:** The system cross-references timestamps across workflow states (e.g., Draft to Submitted to Approved) to confirm processing durations are calculated accurately, identifying any manual overrides.
3.  **Traceability and Lineage Audit:** Every metric displayed on executive dashboards can be traced back to its raw database collection, ensuring calculations are transparent, verifiable, and audit-compliant.

---

## 9. PERFORMANCE & MONITORING SPECIFICATION

To prevent reporting processes from impacting operational performance, the analytics platform is built with strict performance standards.

```
┌──────────────────────────────────────────────────────────┐
│              Analytics Performance Benchmarks            │
├───────────────────────┬──────────────────────────────────┤
│ Metric                │ Target Performance Limit         │
├───────────────────────┼──────────────────────────────────┤
│ Dashboard Load Time   │ < 1.5 Seconds for active views.  │
├───────────────────────┼──────────────────────────────────┤
│ Report Generation     │ < 5.0 Seconds for standard PDFs. │
├───────────────────────┼──────────────────────────────────┤
│ Data Refresh Latency  │ Max 15-minute sync delay.        │
├───────────────────────┼──────────────────────────────────┤
│ Concurrent User Cap   │ Handles up to 500 active views.  │
└───────────────────────┴──────────────────────────────────┘
```

### 9.1 Performance Standards
*   **Analytical Query Isolations:** Long-running analytical queries are directed to read-replicas, preventing resource contention and protecting the performance of operational databases.
*   **Database Partitioning and Indexing:** BigQuery tables are partitioned by Date and Department ID, ensuring queries are cost-effective, fast, and highly targeted.
*   **Dashboard Loading Targets:** Core executive dashboards must render within 1.5 seconds under standard bandwidth conditions, utilizing client-side caching for non-volatile metadata.

---

## 10. NATIONAL GOVERNMENT INTELLIGENCE HANDBOOK

### 10.1 Executive Manual Summary
The Enterprise Business Intelligence and Executive Analytics Framework establishes a secure, modern, and legally compliant data ecosystem for the Republic of Sudan Ministry of Commerce & Industry. By combining real-time KPI tracking, role-based visual dashboards, and advanced predictive analytics powered by secure Gemini models, the platform transforms raw operational data into actionable strategic insights.

All future system development, cross-ministerial integrations, and policy changes must comply with the guidelines, taxonomies, and design standards defined in this handbook to preserve the integrity and security of the nation's digital records and decision support systems.
