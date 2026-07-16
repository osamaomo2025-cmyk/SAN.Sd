# REPUBLIC OF SUDAN
## FEDERAL MINISTRY OF COMMERCE & INDUSTRY
### NATIONAL SOVEREIGN ASSET & LOGISTICS FRAMEWORK (S-EAMF)
---
**Document Identifier:** SD-MCI-EAM-2026-F1  
**Regulatory Alignment:** ISO 55001:2014 / Sudan Government Sovereign Decree No. 44 (2026)  
**Target Horizon:** Vision Sudan 2035 Strategic Initiative  
**Classification:** Sovereign Enterprise Architectural Blueprint (RESTRICTED)

---

## 1. SOVEREIGN ENTERPRISE ASSET MANAGEMENT ARCHITECTURE
The Sovereign Enterprise Asset Management Architecture (S-EAMA) governs the registration, tracking, auditing, and optimization of all physical and capital assets owned or managed by the Digital Ministry of Commerce & Industry. This architecture enforces absolute data transparency and ensures alignment with **ISO 55001 Asset Management Systems**.

### 1.1 Federal Asset Taxonomy
Assets are organized under a centralized hierarchy to enable localized tracking, automated depreciation, and national-level aggregation:

```
[National Sovereign Asset Registry]
   |
   +-- [Real Estate & Infrastructure]
   |      |-- Land Parcels (Industrial Zones, Free Zones)
   |      +-- Administrative Buildings & Service Complexes
   |
   +-- [Heavy Machinery & Alternative Power]
   |      |-- Heavy Industrial Equipment
   |      +-- Solar Inverter Arrays & Microgrids
   |
   +-- [Federal IT & Network Infrastructure]
   |      |-- Datacenters & Sovereign Cloud Nodes
   |      +-- Computers, Servers & Communication Terminals
   |
   +-- [Fleet Vehicles & Transport Units]
          |-- Cargo Trucks & Trade Corridor Transports
          +-- Field Inspector Vehicles
```

### 1.2 Unified National Asset Registry (UNAR) Schema
All assets are assigned a unique, immutable **National Asset Identifier (NAI)** with the following format:
`SD-GOV-MCI-<CLASS>-<STATE>-<SERIAL>`

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **National ID (NAI)** | String | Unique regulatory tracking code | `SD-GOV-MCI-PWR-KRT-10022` |
| **Name (Ar/En)** | String | Dual-language legal name | عاكس طاقة شمسية هجين سوبا / Hybrid Inverter |
| **Asset Class** | Enum | Category grouping for depreciation | `alternative_energy` |
| **Economic Value** | Numeric | Capital cost in Sudanese Pounds (SDG) | `18,500,000` |
| **Depreciation Type** | String | Amortization mechanism | Straight Line (10 Years, 10% Residual) |
| **Warranty Status** | String | Manufacturer contract details | Active (Coverage until 2030) |
| **Health Index (AHI)** | Float | Calculated structural status (0 - 100) | `94.5%` |

### 1.3 ISO 55001 Alignment Matrix
The platform's software logic maps directly to key clauses of the ISO 55001 standard:

| ISO 55001 Clause | Regulatory Requirement | Platform Implementation |
| :--- | :--- | :--- |
| **Clause 4.1: Context** | Understand organization context & stakeholders | Integrated dashboard reflecting multi-departmental asset owners. |
| **Clause 5.1: Leadership** | Top management commitment & asset policy | Electronic authorization of capital adjustments and disposals. |
| **Clause 6.1: Planning** | Risks & opportunities identification | AI Asset Advisor predicting failures before threshold breaches. |
| **Clause 7.5: Information** | Mandatory documentation & data standards | Immutable audit trails, SHA256 ledger block generation. |
| **Clause 8.1: Operation** | Operational planning & control implementation | Automated PM work orders and inventory-to-repair assignments. |
| **Clause 9.1: Evaluation** | Performance & health metrics tracking | Real-time Asset Health Index (AHI) recalibration. |

---

## 2. NATIONAL FACILITIES MANAGEMENT FRAMEWORK
The National Facilities Management Framework (NFMF) specifies space utilization and safety governance across the Ministry’s buildings, complexes, and testing laboratories.

```
+-------------------------------------------------------------+
|               FEDERAL FACILITY COMMAND SHELL                |
+-------------------------------------------------------------+
| [Telemetry Feed]                                            |
|   - Water Draw:  4,200 L/hr (Optimized)                     |
|   - Energy Draw: 120.4 KWh (Solar Hybrid Primary)           |
|   - Occupancy:   180/300 Staff (60% density)                |
|                                                             |
| [Safety & Compliance]                                       |
|   - Fire Suppression: Passed (Certified 2026)               |
|   - Structural HVAC:  Passed (Ambient Temp 22°C)            |
+-------------------------------------------------------------+
```

### 2.1 Environmental Telemetry & Utilities Tracking
All administrative facilities are instrumented with IoT smart meters tracking critical variables:
*   **Water Management (W-IoT):** Flow sensors track consumption in liters/hour, triggering warning flags if overnight flow deviates from the background baseline (leak detection).
*   **Power Grid Status (P-IoT):** Microgrid controllers report energy consumption in Kilowatt-Hours (KWh) and dynamically balance load between the National Grid and on-site Solar Arrays.
*   **Occupancy Density:** Real-time headcount trackers calculate density relative to building safety fire-codes.

---

## 3. FEDERAL INVENTORY & WAREHOUSE MANAGEMENT
To prevent supply chain blockages of vital industrial testing tools and maintenance spares, S-EAMF establishes a dual-node hub system at Khartoum and Port Sudan.

### 3.1 Inventory Control & Safety Stock Formulas
The platform prevents stock depletion via automated **Reorder Point (ROP)** calculation:

$$\text{ROP} = (\text{Daily Usage Rate} \times \text{Lead Time}) + \text{Safety Stock}$$

$$\text{Safety Stock} = (Z \times \sigma_{LT})$$

Where:
*   $Z$ is the Service Level factor (95% standard = 1.65).
*   $\sigma_{LT}$ is the standard deviation of lead time.

### 3.2 RFID / QR Code Integration
*   **Item Coding:** Every spare part (e.g., SSDs, Solar Battery Cells) is tagged with an encrypted QR Code containing its part number, SKU, lot tracking info, and warehouse location bin.
*   **Interactive Scanner Simulation:** The platform includes an interactive QR Code scanning interface to instantly register cycle-count updates, transfers, and warehouse audits, preventing human data entry errors.

---

## 4. SOVEREIGN VEHICLE FLEET MANAGEMENT
The Ministry's transport fleet is crucial for carrying out field inspections, managing trade corridors, and distributing administrative resources.

```
       [KHARTOUM HQ]  <========= GPS CORRIDOR =========> [PORT SUDAN DEPOT]
         15.5562° N                                          19.6158° N
         32.5358° E                                          37.2164° E
             |                                                   |
             +-- [Truck SD-301] ---- [Truck SD-302] -------------+
```

### 4.1 Telemetry Dashboard Specification
*   **GPS Geo-Fencing:** Transponders stream latitude and longitude. The platform raises immediate alert badges if a vehicle leaves designated trade routes (Khartoum - Wad Madani - Port Sudan).
*   **Fuel Cards & Consumption Integration:** Tracks mileage against fuel purchases to compute fuel efficiency indexes ($KM/L$). Deviations above 15% indicate engine degradation or unauthorized usage.

---

## 5. SMART MAINTENANCE & WORK ORDER OPERATIONS
S-EAMF shifts the Ministry's operations from reactive "run-to-fail" repairs to dynamic preventive and predictive schedules.

```
  [IoT Sensor Alert] ---> [AI Degradation Check] ---> [Auto-Issue Work Order] ---> [Vendor Dispatched]
```

### 5.1 Maintenance Work Order Pipeline
1.  **Trigger Event:** An IoT sensor reports high temperature or the calendar reaches a preventative milestone.
2.  **Order Generation:** The system drafts an electronic Work Order, automatically mapping required spare parts from inventories.
3.  **Vendor / Engineer Dispatch:** Assigned contractors accept the order via secure authentication.
4.  **Verification & Closure:** Upon repair completion, the engineer inputs actual costs and notes. The platform automatically runs a verification check and restores the **Asset Health Index (AHI)** to 100%.

---

## 6. AI ASSET ADVISOR & PREDICTIVE ANALYTICS
The S-EAMF leverages the **@google/genai TypeScript SDK** to run deep analytics on asset portfolios, predicting failures and planning infrastructure improvements.

### 6.1 System Logic Flow
```
+--------------------+      +-------------------------+      +-----------------------+
|  EAM Database      | ---> |  Express AI Route       | ---> |  Gemini-2.5-Flash     |
|  (Assets, Fleet,   |      |  (Injects Sudan-Context)|      |  (Structured Output)  |
|   Warehouses)      |      +-------------------------+      +-----------------------+
+--------------------+                                                   |
                                                                         v
+--------------------+      +-------------------------+      +-----------------------+
| Interactive UI     | <--- |  Sovereign Advice Card  | <--- |  High-Fidelity        |
| Dashboard          |      |  (Failure predictions)  |      |  Simulated Fallback   |
+--------------------+      +-------------------------+      +-----------------------+
```

### 6.2 Prompt Structure & Payload
The AI engine translates database status arrays into structured JSON inputs for Gemini, requesting:
1.  **Remaining Useful Life (RUL)** projections for critical servers and inverters.
2.  **Safety Stock optimization** recommendations for parts with low levels.
3.  **Actionable mitigation workflows** aligned with regional realities (dust storms, heat indexes, power outages).

---

## 7. GIS & IoT TELEMETRY PIPELINE
Real-time environmental monitoring is handled by a stream processing framework:

```
[IoT Sensor (MQTT)] ---> [Sovereign IoT Gateway] ---> [Express Telemetry Router] ---> [React Live Map UI]
```

### 7.1 Sensor Protocols
*   **Baud Rate & Frequency:** GPS transponders stream every 30 seconds over cellular networks.
*   **Protocol:** MQTT over secure WebSockets (`wss://`).
*   **Fail-Safe Redundancy:** If cellular signal is lost on trade corridors, edge devices cache telemetry locally and upload on reconnection.

---

## 8. EXECUTIVE ASSET DASHBOARD
Designed for the Minister's command center, the dashboard provides a complete, real-time picture of federal operations:

*   **Financial Aggregates:** Total valuation, depreciation rates, and insurance coverage.
*   **Operational Health:** Average AHI and critical asset counts.
*   **Infrastructure Telemetry:** Energy usage, water draw, and environmental indicators.
*   **Logistics Status:** Fleet GPS maps, stock levels, and active work orders.

---

## 9. SECURITY, GOVERNANCE & AUDIT TRAIL
Security is central to S-EAMF. Every action is audited to ensure absolute accountability.

### 9.1 Role-Based Access Control (RBAC) Matrix

| Role | View Assets | Register New Assets | Approve Work Orders | Reallocate Spares | Clear Audit Logs |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Business / Citizen** | Yes (Public) | No | No | No | No |
| **Ministry Staff** | Yes | Yes (Draft) | No | No | No |
| **Executive Admin** | Yes | Yes | Yes | Yes | No |
| **Sovereign Minister** | Yes | Yes | Yes (Override) | Yes | No (Immutable) |

### 9.2 Cryptographic Audit Ledger
Every change (registration, transfer, decommission) generates an audit ledger block:
$$\text{Block Hash} = \text{SHA256}(\text{Asset ID} + \text{Timestamp} + \text{Actor} + \text{Action} + \text{Previous Hash})$$

This ledger is immutable, preventing any tampering with national asset values or location records.

---

## 10. TESTING & VALIDATION STRATEGY
Comprehensive testing ensures system reliability under real-world conditions:

1.  **Edge-Case Telemetry Handling:** Validates that anomalous sensor inputs (e.g., negative fuel consumption or GPS coordinates outside Sudan) are flagged and filtered.
2.  **Concurrent Lifecycle Transitions:** Confirms that an asset cannot be decommissioned while an active maintenance work order is open.
3.  **AI Fallback Resilience:** Verifies that if internet access is interrupted, the platform switches to local predictive models to keep advising operations.

---

## 11. OPERATIONS MANUAL & HANDOVER PLAN
Standard operating procedures for day-to-day asset management:

### 11.1 Commissioning & Handover
1.  Receive equipment at the Khartoum or Port Sudan warehouse.
2.  Inspect against purchase specifications.
3.  Print and apply the national QR/RFID code tag.
4.  Record in the **Unified National Asset Registry** to instantly allocate initial depreciation and health tracking.

### 11.2 Decommissioning & Disposal
1.  Submit a decommission request with supporting logs.
2.  Conduct an official valuation audit.
3.  Obtain executive approval.
4.  Generate an immutable **Disposal Certificate** and record the transaction in the secure ledger.

---

## 12. MASTER IMPLEMENTATION & BUDGET PLAN
Implementation is structured in three phases to ensure smooth adoption:

```
[Phase 1: Foundation] ===> [Phase 2: IoT Integration] ===> [Phase 3: AI Intelligence]
      Months 1-3                  Months 4-6                    Months 7-12
```

### 12.1 Budget Allocation

| Phase | Description | Estimated Budget (SDG) | Target Outcome |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Central Database & Core Registry | 45,000,000 | Unified registry for all capital assets |
| **Phase 2** | IoT Instrumentation & Fleet GPS | 65,000,000 | Live sensor tracking and trade route monitoring |
| **Phase 3** | AI Predictive Models & Handover | 35,000,000 | Smart maintenance optimization |

---
**Approved for Release by:**  
*Office of the Government Legal Systems Architect & Enterprise Legal Operations Consultant*  
*Federal Ministry of Commerce & Industry, Republic of Sudan*  
*July 16, 2026*
