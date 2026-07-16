/**
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Master Specification Deliverables for the National Government Payment & Revenue Management Platform
 */

export interface PaymentDoc {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  contentAr: string;
  contentEn: string;
}

export const PAYMENT_DOCS_DATA: PaymentDoc[] = [
  {
    id: "architecture",
    titleAr: "1. بنية منصة الدفع الحكومية الوطنية",
    titleEn: "1. National Government Payment Platform Architecture",
    category: "Architecture",
    contentAr: `تصف هذه الوثيقة البنية الهندسية السيادية لمنصة الدفع والجباية الإلكترونية بوزارة التجارة والصناعة بجمهورية السودان.

المكونات الرئيسية:
- بوابة دفع سيادية مركزية (Sovereign Central Gateway): واجهة موحدة للاتصال المباشر بمحور الدفع الوطني بوزارة المالية والبنك المركزي (CBS).
- نظام الجباية والإيرادات الفيدرالي (Federal Revenue Engine): حساب الرسوم ديناميكياً لجميع المعاملات (السجل التجاري، التراخيص، الاستثمار).
- جدار حماية الدفع المشفر (Payment Security Shield): حماية عمليات الدفع وقنوات الاتصال عبر تقنيات التشفير المزدوج والرموز الآمنة (Tokenization) وmTLS.
- نظام التوفيق والتسوية الآلي (Automated Reconciliation Ledger): مطابقة السجلات المالية الصادرة مع كشوفات الحسابات البنكية ومخرجات البوابة السيادية.

تدفق البيانات:
1. يقدم المستثمر أو المواطن طلباً للحصول على خدمة تجارية.
2. يقوم محرك الفوترة والرسوم باحتساب القيمة القانونية وإصدار فاتورة إلكترونية موحدة (INV).
3. تُرسل الفاتورة إلى بوابة الدفع المشفرة وتمرر للمستند الإلكتروني الوطني.
4. يختار المستخدم القناة المفضلة (بطاقات فيزا/ماستر، تحويل بنكي، محفظة الهاتف السيادية).
5. تقوم البوابة بتمرير المعاملة عبر اتصال mTLS آمن إلى شبكة المدفوعات القومية وتستقبل استجابة فورية.
6. يُحدث سجل المعاملات فورياً في قاعدة البيانات وتصدر إيصالات مالية مشفرة بختم رقمي وطني.`,
    contentEn: `This document describes the sovereign systems architecture of the Sudan Digital Payments & Revenue Platform.

Core Components:
- Sovereign Central Gateway: Unified interface for direct integration with the Ministry of Finance National Payment Hub and Central Bank of Sudan (CBS).
- Federal Revenue Engine: Dynamic fee calculation engine for commercial registrations, licensing, and investments.
- Payment Security Shield: Secure payment proxy handling mTLS connections, card tokenization, and multi-factor transaction signing.
- Automated Reconciliation Ledger: Background matching engine reconciling active invoice logs against central bank statements.

Data Flow:
1. Citizen/Investor initiates service request.
2. Revenue Engine calculates fees and compiles a unified Electronic Invoice (INV).
3. Security Shield tokenizes details and presents secure payment gateway channels.
4. User selects payment channel (Visa/Mastercard, Bank Transfer, Mobile Wallet, Instant IPN).
5. System routes payment via authenticated mTLS tunnels to the Central Bank's National Switch.
6. Transaction is committed, issuing a digitally signed, cryptographically anchored Electronic Receipt.`
  },
  {
    id: "data-model",
    titleAr: "2. نموذج البيانات المالية الفيدرالي",
    titleEn: "2. Federal Financial Data Model (MySQL Schema)",
    category: "Data Model",
    contentAr: `يتضمن هذا المخطط تمديدات قواعد بيانات MySQL السيادية لتخزين وإدارة التدفقات المالية بأعلى مستويات النزاهة والمرجعية المشتركة.

الجداول الرئيسية:
1. sdmci_invoices (الفواتير الصادرة):
   - id VARCHAR(64) PRIMARY KEY: رقم الفاتورة الموحد الفريد.
   - fee_type VARCHAR(50): فئة الخدمة (شركة، ترخيص، تسجيل، غرامة).
   - amount DECIMAL(15,2): القيمة المالية الإجمالية بالجنيه السوداني.
   - applicant_name VARCHAR(255): اسم مقدم الطلب.
   - status VARCHAR(30): الحالة (مستحقة، مدفوعة، ملغاة، قيد الاسترداد).
   - digital_signature VARCHAR(512): البصمة الرقمية للتحقق من سلامة الفاتورة.
   - qr_code_link TEXT: رابط التحقق السريع المشفر.
   - created_at TIMESTAMP: وقت الإصدار.

2. sdmci_payments (المدفوعات والعمليات):
   - id VARCHAR(64) PRIMARY KEY: رقم عملية الدفع الفريد.
   - invoice_id VARCHAR(64): معرّف الفاتورة المرتبطة (ربط خارجي).
   - amount DECIMAL(15,2): المبلغ المستلم.
   - method VARCHAR(50): وسيلة الدفع (بطاقة، محفظة، تحويل).
   - gateway_ref VARCHAR(128): المرجع الخارجي لبوابة المدفوعات القومية.
   - risk_score DECIMAL(4,3): معامل تقييم المخاطر السيبرانية والاحتيال.
   - created_at TIMESTAMP.

3. sdmci_financial_ledger (الدفتر العام المالي):
   - id VARCHAR(64) PRIMARY KEY: رقم القيد المالي الفريد.
   - type VARCHAR(10): دائن (credit) أو مدين (debit).
   - amount DECIMAL(15,2): القيمة المالية للعملية.
   - account VARCHAR(50): الحساب المالي (الخزانة العامة، حساب التشغيل، حساب الاحتياطي).
   - description TEXT: تفاصيل القيد المالي باللغتين.
   - reference_id VARCHAR(64): الرقم المرجعي المرتبط بالفاتورة أو الاسترداد.
   - created_at TIMESTAMP.`,
    contentEn: `This data schema defines the MySQL relational extensions required to capture, process, and audit fiscal and transactional activities with perfect referential integrity.

Core Schemas:
1. sdmci_invoices:
   - id VARCHAR(64) PRIMARY KEY: Globally unique Invoice ID with national prefix.
   - fee_type VARCHAR(50): Category of fee (registration, license, penalty, investment).
   - amount DECIMAL(15,2): Total invoice amount in SDG.
   - applicant_name VARCHAR(255): Full name or legal entity name of the applicant.
   - status VARCHAR(30): (pending, paid, failed, refund_requested, refunded).
   - digital_signature VARCHAR(512): Cryptographic signature verifying authenticity.
   - qr_code_link TEXT: Verification link encoded inside dynamic QR.
   - created_at TIMESTAMP.

2. sdmci_payments:
   - id VARCHAR(64) PRIMARY KEY: Internal Payment log ID.
   - invoice_id VARCHAR(64): Foreign key linking back to sdmci_invoices.
   - amount DECIMAL(15,2): Net settled amount.
   - method VARCHAR(50): (debit_card, credit_card, bank_transfer, mobile_wallet, ipn).
   - gateway_ref VARCHAR(128): External transaction reference returned by CBS National Switch.
   - risk_score DECIMAL(4,3): Real-time security risk assessment score (0.000 to 1.000).
   - created_at TIMESTAMP.

3. sdmci_financial_ledger:
   - id VARCHAR(64) PRIMARY KEY: Cryptographically chained ledger sequence ID.
   - type VARCHAR(10): (credit, debit).
   - amount DECIMAL(15,2): Net transaction value.
   - account VARCHAR(50): (general_treasury, dmci_operation, reserve_account).
   - description TEXT: Localized audit trailing text.
   - reference_id VARCHAR(64): Foreign identifier to invoices or refund records.
   - created_at TIMESTAMP.`
  },
  {
    id: "invoice-spec",
    titleAr: "3. مواصفة الفاتورة الإلكترونية الفيدرالية",
    titleEn: "3. Federal Electronic Invoice Specification",
    category: "Invoices",
    contentAr: `تحدد هذه الوثيقة البنية الفيدرالية والتقنية للفاتورة الإلكترونية الموحدة المعتمدة في النظام المالي لجمهورية السودان.

المتطلبات الإلزامية:
1. الرقم التعريفي الفريد (Unique Invoice ID): تنسيق فيدرالي معتمد يبدأ بـ INV-YYYY-XXXXXXXX لتفادي التكرار وسهولة البحث والتحقق.
2. رمز الاستجابة السريعة (QR Code): يجب أن يحتوي رمز الاستجابة السريعة على رابط مشفر وموثق بشهادة SSL يقود مباشرة إلى موقع الوزارة الرسمي للتأكد الفوري من حقيقة الفاتورة وقيمتها.
3. التوقيع الرقمي السيادي (Sovereign Digital Signature): ختم رقمي يتم توليده باستخدام خوارزمية التشفير SHA-256 مع RSA-2048 لربط تفاصيل الفاتورة (المبلغ، الخدمة، التاريخ، الرقم) وضمان عدم التلاعب بمحتواها بعد الصدور.
4. تصنيف الرسوم المعياري (Standardized Fee Code): تحديد كود البند المالي المتكامل مع نظام وزارة المالية القومي لربط الإيراد مباشرة بحسابه المخصص بالخزانة العامة للدولة.`,
    contentEn: `This specification mandates the legal and technical design of Electronic Invoices issued within the federal ministry ecosystem.

Mandatory Specs:
1. Unique Invoice ID: Standardized national format (INV-YYYY-XXXXXX) for universal tracking across all ministries.
2. Dynamic QR Code: Real-time generated QR matrix containing high-security HTTPS verification link connected directly to the Sovereign Document Trust Center.
3. Sovereign Digital Signature: A SHA-256 with RSA-2048 cryptographic hash derived from core invoice fields, sealing the invoice against unauthorized tampering.
4. Standardized Fee Codes: Unified accounting codes mapping directly to Ministry of Finance revenue lines (e.g., COM-REG-01, LIC-IND-04).`
  },
  {
    id: "gateway-framework",
    titleAr: "4. إطار تكامل بوابة الدفع الوطنية",
    titleEn: "4. National Payment Gateway Integration Framework",
    category: "Integration",
    contentAr: `يحدد هذا الإطار المتطلبات التقنية الدقيقة لربط بوابة الدفع بوزارة التجارة والصناعة مع بوابة المدفوعات الوطنية للبنك المركزي وموفري خدمات الدفع الخارجيين.

المواصفات التقنية وقنوات الاتصال:
- قنوات الربط المباشر: الاتصال عبر نفق مشفر مخصص (IPSec VPN) مع تفعيل جدران الحماية السيادية.
- التحقق المتبادل (Mutual TLS - mTLS): تطبيق بروتوكول TLS 1.3 مع شهادات رقمية ثنائية للتحقق المتبادل من هوية الخوادم المتصلة (خادم الوزارة وخادم البوابة الوطنية).
- بروتوكول تبادل البيانات: الاستعانة بـ REST APIs مشفرة تدعم صيغة JSON لجميع الطلبات والاستجابات المالية، مع وقت استجابة مستهدف أقل من 1500 مللي ثانية للتأكد من سلاسة تجربة المستخدم.
- آليات معالجة الأخطاء والتراجع (Rollback Mechanisms): تفعيل نظام المحاولات التلقائية الذكية (Exponential Backoff) وقنوات التحقق التلقائي للتراجع الآمن عن المعاملات المعلقة حماية لأموال المواطنين والمستثمرين.`,
    contentEn: `This framework outlines the strict integration protocols connecting DMCI servers with the Central Bank of Sudan (CBS) and commercial payment providers.

Technical Protocols:
- Connection Tunnels: Dedicated, secure IPSec VPN tunnels with hardware-level firewall filtering.
- Mutual Authentication (mTLS): Server-to-server TLS 1.3 tunnels utilizing X.509 certificates to verify the identity of both endpoints before initiating financial handshakes.
- Data Exchange Format: RESTful JSON APIs with localized field validation. Target API response time is capped at 1500ms.
- Fallback & Rollback: Real-time automated query-and-cancel mechanisms with exponential backoff for pending transactions to prevent double-charging.`
  },
  {
    id: "revenue-framework",
    titleAr: "5. إطار إدارة الإيرادات الفيدرالية",
    titleEn: "5. Federal Revenue Management Framework",
    category: "Revenue",
    contentAr: `يوضح هذا الإطار السياسات المالية الحاكمة لتوزيع الإيرادات المحصلة عبر البوابة وإرسالها فورياً إلى حسابات الدولة المعنية بالتنسيق مع وزارة المالية والتخطيط الاقتصادي.

قواعد التوزيع المالي (Revenue Allocation Rules):
- رسوم السجل التجاري والأسماء: تُحول بنسبة 100% مباشرة إلى حساب الخزانة العامة للدولة ببنك السودان المركزي.
- رسوم التراخيص والتفتيش: يتم توزيع الإيراد بنسبة 85% للخزانة العامة، و15% مخصصة لحساب التطوير والتشغيل التقني الخاص بوزارة التجارة والصناعة لدعم استمرارية وتحديث البنية الفيدرالية الرقمية.
- الغرامات والمخالفات: تحوّل بالكامل (100%) إلى صندوق الخزانة الفيدرالي لدعم الموازنة العامة.
- رسوم بوابة الاستثمار ومشاريع المدن: تقسم بنسبة 90% للمالية الفيدرالية و10% لدعم الصناديق التنموية بالولايات المستضيفة للمشاريع الاستثمارية.`,
    contentEn: `This framework details the fiscal allocation and automated routing of government revenues to appropriate state and ministerial accounts.

Allocation Rules:
- Registry & Reservation Fees: 100% routed directly to the Federal General Treasury at the Central Bank of Sudan.
- Licensing & Inspection Fees: 85% routed to the General Treasury; 15% allocated to the DMCI Technological Infrastructure Development Fund to ensure continuous system upgrades.
- Penalties & Non-Compliance Levies: 100% routed directly to the Sovereign Federal Stabilization Account.
- Investment & Special Economic Zone Fees: 90% routed to the Federal Treasury; 10% allocated to regional developmental accounts in the host states.`
  },
  {
    id: "workflow-guide",
    titleAr: "6. دليل تهيئة سير العمل المالي",
    titleEn: "6. Financial Workflow Configuration Guide",
    category: "Workflow",
    contentAr: `يشرح هذا الدليل الخطوات التنظيمية التي تمر بها المعاملة المالية من مرحلة احتساب الرسم وحتى أرشفة السجل المالي بشكل كامل وآمن.

المراحل الرئيسية لسير العمل:
1. احتساب الرسوم (Fee Calculation): يستدعي نظام التشغيل محرك الرسوم الفيدرالي لتحديد الرسوم المطلوبة بناءً على المدخلات المحددة للطلب.
2. إصدار الفاتورة الموحدة (Invoice Issuance): إنتاج وثيقة الفاتورة مع الرقم الموحد والتوقيع الإلكتروني وتخزينها كقيد معلق الدفع.
3. معالجة الدفع وبوابة العبور (Payment Authorization): تفعيل واجهة الدفع وتمرير بيانات المعاملة المشفرة إلى شبكة المدفوعات الوطنية للخصم الفعلي.
4. إرسال التأكيد والتسوية المباشرة (Confirmation & Settlement): استلام رد البوابة بنجاح العملية، وخلالها يتم تحديث حالة الفاتورة لـ (مدفوعة) وإصدار الإيصال المالي المشفر.
5. تحديث السجل القانوني والتدقيق (Ledger Entry & Archive): ترحيل القيمة دائنة للدفتر المالي العام، وإصدار إشعار لمكتب التراخيص أو السجل لإصدار الوثيقة النهائية للمستثمر وأرشفة المعاملة.`,
    contentEn: `This guide defines the secure step-by-step transaction lifecycle, from raw service cost ingestion to final archival within the federal databases.

Workflow Milestones:
1. Fee Calculation: Service-specific parameters trigger the Central Revenue Engine to fetch current fiscal rates.
2. Invoice Generation: Issuance of an electronic invoice with cryptographic signature, locking the pending balance.
3. Payment Gateway Routing: Encrypted handshaking with the National Switch, waiting for user PIN/OTP authorization.
4. Confirmation & Settlement: Successful completion updates invoice state, issues an Electronic Receipt, and prints the unique transaction reference.
5. Legal Execution & Archive: Automated ledger logging, service release trigger, and final compliance archiving.`
  },
  {
    id: "security-architecture",
    titleAr: "7. بنية أمن المدفوعات والامتثال",
    titleEn: "7. Payment Security & Compliance Architecture",
    category: "Security",
    contentAr: `تفصل هذه الوثيقة المعايير الأمنية المعتمدة لضمان أمن المعلومات وحماية المعاملات المالية تماشياً مع المعايير الدولية PCI DSS والسياسات السيادية لحماية البيانات.

التدابير الأمنية الفيدرالية:
- إخفاء وتشفير البطاقات (Tokenization): عدم تخزين أرقام بطاقات الدفع البنكية أو أرقام التعريف الشخصية (PIN) في قواعد بيانات الوزارة إطلاقاً، واستبدالها برموز آمنة ومؤقتة تصدرها شبكة البنوك المعتمدة.
- حماية البيانات الحساسة (Data Encryption): تشفير جميع البيانات الحالية والمنقولة باستخدام خوارزميات AES-256GCM للبيانات المخزنة وTLS 1.3 للبيانات المارة عبر الشبكة.
- كشف ومنع الاحتيال الفوري (Fraud Detection Engine): خوارزميات مدمجة تقوم بمراجعة العمليات وتحليل مخاطر المعاملة بناءً على معايير متعددة (مثل تقييم بروتوكول الإنترنت، البنك المصدر، ومعدل تكرار المعاملات) وإيقاف أي عملية تتخطى حاجز المخاطر المسموح به.`,
    contentEn: `This architecture specifies the multi-layered security controls implemented to protect federal transactions, aligning with international PCI DSS standards and Sudan's sovereign cyber policies.

Security Controls:
- Zero Storage Tokenization: Raw card details and customer PINs are strictly prohibited from entering DMCI servers. Instead, transactions rely on localized cryptographic tokens from verified gateways.
- In-Transit and At-Rest Encryption: Database tables are encrypted using hardware-backed AES-256-GCM. Active network communication runs exclusively over TLS 1.3.
- Fraud Prevention Suite: Integrated risk-scoring algorithms evaluate IP telemetry, transaction frequency, and card issuing banks to flag anomalous behavior prior to routing.`
  },
  {
    id: "dashboard-report",
    titleAr: "8. تقرير تعزيز لوحات البيانات والمؤشرات المالية",
    titleEn: "8. Financial Dashboard & KPI Optimization Report",
    category: "Analytics",
    contentAr: `يوضح هذا التقرير كيفية تصميم وبناء المؤشرات المالية المتقدمة المدمجة في لوحة المتابعة لمساعدة قيادات الوزارة ومسؤولي الخزانة على اتخاذ قرارات دقيقة ومبنية على بيانات حية.

مؤشرات الأداء الرئيسية (Core Financial KPIs):
- معدل تحصيل الإيرادات اليومي والشهري (Revenue Collection Rate): تتبع حجم التدفقات المالية وتوزيعها الفعلي حسب الإدارات والولايات.
- مؤشر دقة التسوية البنكية (Reconciliation Success Rate): حساب نسبة التطابق بين سجلات الوزارة والتقارير البنكية اليومية، بهدف تحقيق نسبة تطابق 100% يومياً وتنبيه مسؤولي الخزانة فور وجود أي فروقات.
- معدل الفشل المالي وقنوات الدفع (Transaction Failure Analytics): تحليل أسباب فشل المدفوعات (مثل قلة الرصيد، مشاكل شبكة الاتصال، أو تجاوز الوقت) لتوجيه الاستثمارات التقنية نحو القنوات الأكثر اعتمادية وموثوقية.`,
    contentEn: `This report details the implementation of central financial dashboards designed to provide ministerial leadership with continuous visibility into the fiscal health of the commerce sector.

Core Performance Indicators:
- Real-Time Revenue Collection: Live analytics showing revenue flows categorized by department, location, and economic activity.
- Reconciliation Integrity Index: Automated tracking of daily discrepancies between system logs and bank statements.
- Gateway Performance Analytics: Monitoring success/failure ratios of all payment channels to optimize system load distribution.`
  },
  {
    id: "assistant-guide",
    titleAr: "9. دليل مساعد الذكاء الاصطناعي المالي",
    titleEn: "9. AI Financial Assistant Integration Guide",
    category: "AI",
    contentAr: `يوضح هذا الدليل منهجية دمج وكيل الذكاء الاصطناعي التوليدي لخدمة العمليات المالية والرد الذكي على الاستفسارات وتحليل فئات الرسوم بدقة فائقة.

وظائف مساعد الذكاء الاصطناعي:
- احتساب الرسوم التفاعلي (Interactive Fee Estimation): يمكن للمستثمر التحدث مع المساعد لشرح نوع شركته ورأس مالها وحجم أنشطتها وسيقوم المساعد باحتساب الرسوم الإجمالية والتفصيلية المتوقعة وتوجيهه مباشرة لطلب الخدمة.
- التحليل الوقائي والتنبؤ بالفشل (Failure Prediction): فحص المدخلات الرقمية وتنبيه المستخدم في حال وجود أرقام غير متناسقة أو بطاقات منتهية الصلاحية قبل إجراء الدفع الفعلي.
- كشف الشذوذ المالي الفوري (Anomaly Checking): مساعدة المراجعين الحكوميين على مراجعة كشوفات الحسابات البنكية الطويلة ومقارنتها بسجلات الدفع والإشارة الفورية للمعاملات التي تحتوي على تفاوت في المبالغ أو التواريخ.`,
    contentEn: `This guide details the integration of generative AI agents within the digital payments module to support real-time user assistance and intelligent anomaly audits.

Capabilities:
- Dynamic Fee Calculators: Investors converse with the AI in natural language to determine company registration fees based on capital structure, localized to Vision 2035 rules.
- Preventive Diagnostic Alerts: Natural language validation to warn applicants about potential formatting or expiration issues on card payloads prior to routing.
- Anomaly Detection: Helps treasury officers analyze bank logs by highlighting ledger anomalies, mismatched timestamps, or recurring double-charge attempts.`
  },
  {
    id: "testing-plan",
    titleAr: "10. خطة الاختبار والاعتماد والشهادات",
    titleEn: "10. Financial Testing, Certification & Auditing Plan",
    category: "Testing",
    contentAr: `تصف هذه الخطة استراتيجية الفحص والتدقيق اللازمة لاعتماد واجهة المعاملات المالية وتأكيد جاهزيتها التشغيلية والأمنية قبل الإطلاق الرسمي.

أنواع الاختبارات الإلزامية:
1. اختبارات الضغط والجهد العالي (Stress & Load Testing): محاكاة تدفقات دفع تفوق 5000 معاملة متزامنة للتأكد من قدرة محرك الجباية وقنوات البوابة على العمل دون بطء أو انقطاع.
2. اختبار الاختراق والأمن السيبراني (Penetration Testing): اختبارات دورية سنوية ونصف سنوية لفحص نظام التشفير وثغرات واجهة التطبيقات (API) ومقاومة الهجمات الموجهة مثل SQL Injection وCross-Site Scripting.
3. تدقيق دقة التسوية والتقارير (Reconciliation Integrity Audits): إدخال فواتير وسجلات بنكية مشوهة عمداً لاختبار قدرة خوارزميات التوفيق على رصد وكشف الاختلافات وتوجيه التنبيهات بدقة مطلقة.`,
    contentEn: `This document establishes the testing methodologies and operational certifications required prior to the official launch of the digital revenue gateway.

Audit Protocols:
1. Volumetric Load Testing: Simulating 5,000+ concurrent payment sequences to ensure zero buffer delay within the dynamic billing and mTLS engines.
2. Penetration Audits: Bi-annual third-party ethical hacking to verify the strength of the API gateway against SQLi, XSS, and token hijacking.
3. Discrepancy Auditing: Injecting intentionally modified mock bank statements to confirm the reconciliation engine alerts treasury personnel immediately.`
  },
  {
    id: "disaster-recovery",
    titleAr: "11. خطة الطوارئ واستمرارية العمل المالي",
    titleEn: "11. Financial Disaster Recovery & Business Continuity Strategy",
    category: "Disaster Recovery",
    contentAr: `تضع هذه الاستراتيجية البروتوكولات اللازمة للتعافي من الكوارث والحفاظ على تكامل البيانات واستمرارية عمليات الدفع والجباية في أصعب الظروف التقنية واللوجستية.

السياسات والاستبقاء:
- النسخ الاحتياطي الموزع واللحظي (Real-time Database Replication): نسخ بيانات المعاملات والفوترة والledger فورياً إلى خادم احتياطي في موقع جغرافي منفصل داخل السودان لضمان عدم ضياع أي سجل مالي.
- استعادة الخدمة الفورية (RTO / RPO): تحديد وقت مستهدف لاستعادة الخدمة كاملة (RTO) أقل من 15 دقيقة، ومعامل خسارة بيانات (RPO) لا يتعدى دقيقة واحدة في حال حدوث عطل شامل بالبنية التحتية.
- المعالجة غير المتصلة والحساب الاحتياطي (Offline Contingency Mode): تفعيل ميزة تسجيل المعاملات في خادم مغلق محلي وآمن عند انقطاع الاتصال ببوابات البنك المركزي الرئيسية، لتتم مزامنتها تلقائياً عند استعادة خطوط التبادل.`,
    contentEn: `This strategy details the backup protocols and fallback procedures ensuring continuous financial operations under critical server or connection failures.

Disaster Recovery Standards:
- Real-Time Geographic Replication: Instantaneous replication of invoice, ledger, and transaction logs to a secure disaster recovery facility located in a separate state.
- Operational Targets: Maximum Recovery Time Objective (RTO) is capped at 15 minutes, with a Recovery Point Objective (RPO) of under 60 seconds.
- Offline Ingestion Mode: Isolated state-buffering designed to capture and cryptographically sign transaction attempts locally when Central Bank connections are offline, autosyncing once connectivity is restored.`
  },
  {
    id: "audit-framework",
    titleAr: "12. إطار التدقيق والرقابة المالية الفيدرالي",
    titleEn: "12. Federal Revenue Audit & Accountability Framework",
    category: "Audit",
    contentAr: `يحدد هذا الإطار آليات الرقابة ومحاسبة الإيرادات بالتنسيق مع ديوان المراجع العام القومي لجمهورية السودان لضمان أقصى درجات النزاهة المالية.

بروتوكولات الرقابة:
- سجل التدقيق غير القابل للتعديل (Immutable Write-Once Ledger): استخدام قاعدة بيانات مشفرة وسلاسل مغلقة لتسجيل حركات التغيير والولوج المالي؛ تمنع كلياً أي موظف أو مهندس نظام من تعديل أو مسح أي قيد مسجل بعد اعتماده.
- تقارير الإغلاق اليومي الآلي (Automated End-of-Day Closures): في تمام الساعة 23:59:59 من كل يوم، يقوم النظام بإغلاق مالي شامل وحساب إجمالي الإيرادات المصنفة ومقارنتها بالحوالات البنكية الصادرة للخزانة ورفع كشف الإغلاق آلياً للمراقب المالي المقيم.
- مسارات مراجعة تفصيلية لجميع الأدوار (Role-Based Audits): رصد وتتبع دقيق لجميع حركات إصدار الفواتير أو تسويتها أو معالجة طلبات الاسترداد مع تسجيل اسم ورتبة الموظف ورقم جهازه وعنوان الIP.`,
    contentEn: `This framework mandates continuous electronic auditing of DMCI payment operations in alignment with the Federal National Audit Office guidelines.

Accountability Controls:
- Write-Once Immutable Journaling: Chained cryptographic ledger entries that strictly prevent retroactive alteration of transaction values or statuses by any system user.
- End-of-Day (EOD) Automatic Closure: Systematic locking of the day's books at exactly 23:59:59 UTC, compiling revenue outputs and cross-referencing ledger deposits.
- Active IP Tracking: Full audit trails tying all user activities, from supervisor refund reviews to user invoices, to timestamped IP addresses and government credentials.`
  },
  {
    id: "operations-manual",
    titleAr: "13. دليل العمليات المالية لموظفي الوزارة",
    titleEn: "13. Ministerial Financial Operations & Treasury Manual",
    category: "Manual",
    contentAr: `يمثل هذا الدليل المرجع التشغيلي اليومي لموظفي الخزانة، المحاسبين الفيدراليين، والمراجعين الداخليين بالوزارة لإدارة النظام المالي بكفاءة عالية.

الإجراءات اليومية المعتمدة:
1. مراجعة المعاملات المعلقة والدفع اليدوي (Review Pending Transactions): فحص الفواتير التي لم تسدد تلقائياً والتحقق من حالات طلبات الحجز المعلقة للأنشطة المختلفة.
2. معالجة وتدقيق الاسترداد المالي (Refund Investigation Workflow): آلية فحص طلب الاسترداد، التأكد من عدم وجود تزوير، كتابة تقرير الفحص، وإرسال المعاملة لصاحب الصلاحية (المشرف أو الوكيل) للاعتماد المالي.
3. التصدير الدوري للتقارير (Financial Reporting): إعداد وتصدير كشوفات الإيرادات والتحليلات الأسبوعية والسنوية لعرضها على الإدارة العليا والجهات الرقابية للتأكد من نمو الاستثمارات ومطابقتها للمخططات المستهدفة.`,
    contentEn: `This operational manual serves as the primary day-to-day guide for government accountants, treasury controllers, and system administrators running the DMCI revenue portal.

Treasury Procedures:
1. Daily Ledger Review: Audit routine checking of pending invoices and updating uncaptured bank transfers.
2. Refund Authorization Workflow: Validating citizen-initiated refund requests, checking double-charging occurrences, and passing reviews to the Undersecretary.
3. Analytical Exporting: Generating standardized PDF and CSV reports for the Minister's office and Central Bank audit councils.`
  },
  {
    id: "master-report",
    titleAr: "14. التقرير الوطني الشامل لإدخال منصة المدفوعات والجباية",
    titleEn: "14. Sovereign Digital Payments & Revenue Management Master Implementation Report",
    category: "Master Implementation",
    contentAr: `يقدم هذا التقرير الوطني المتكامل خارطة الطريق ومواصفات تسليم وتشغيل منصة الدفع الإلكتروني والجباية الوطنية لوزارة التجارة والصناعة، معززاً بالرؤية الفيدرالية الشاملة لجمهورية السودان نحو آفاق التحول الرقمي الموثوق والاستقلال الاقتصادي لعام 2035.

محاور الاستراتيجية الوطنية الشاملة:
- توحيد قنوات الدفع الحكومية لتسهيل إجراءات الاستثمار التجاري والصناعي.
- تفعيل السيادة الرقمية الكاملة من خلال التوقيع المشفر، الختم الفيدرالي، والتحقق المستقل عبر رموز الـ QR.
- تأسيس شراكة بنية تحتية مستدامة مع بنك السودان المركزي لتبادل البيانات المالية دون وسيط خارجي.
- تمكين صانعي القرار من الوصول الفوري للمؤشرات الاقتصادية والإيرادات الحيوية لتوجيه المشاريع الاستثمارية الكبرى في قطاعات الصمغ العربي والتعدين والصناعات التحويلية بكفاءة عالية وأمان مطلق.`,
    contentEn: `This sovereign report consolidates the roadmap and operational blueprints for the Sudan Digital Payments & Revenue Platform, establishing a model for federal modernization and digital independence in line with Vision 2035.

Core Strategic Objectives:
- Unifying government payment channels to lower the barrier of entry for local merchants and international investors.
- Guaranteeing economic sovereignty through electronic signing, secure QR-driven verification, and mTLS connections.
- Creating an independent server-to-server connection with the Central Bank of Sudan, eliminating costly external software dependencies.
- Supplying the Ministerial Cabinet with real-time analytics to steer high-yield investments in core national assets like Gum Arabic, agriculture, and smart industrial complexes.`
  }
];
