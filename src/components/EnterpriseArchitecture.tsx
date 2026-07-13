/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Cpu, Globe, Landmark, ShieldAlert, Network, Database, Lock, 
  Workflow, Binary, Server, ChevronRight, ChevronLeft, Terminal, Check, 
  Copy, Plus, Play, RefreshCw, Search, FileText, Eye, Activity, Sparkles, 
  Settings, AlertCircle, ArrowLeftRight, UserCheck, Download, LayoutGrid, 
  FileSpreadsheet, Layers, FileCode, Trash2
} from "lucide-react";
import { ApplicationStatus } from "../types";

interface EnterpriseArchitectureProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function EnterpriseArchitecture({ currentLanguage, role }: EnterpriseArchitectureProps) {
  const [activeTab, setActiveTab] = useState<string>("ea-overview");
  
  // Tab list definitions
  const tabs = [
    { id: "ea-overview", labelAr: "الهيكل المعماري الشامل", labelEn: "Enterprise Overview", icon: Layers },
    { id: "business-arch", labelAr: "الهيكل التشغيلي والمهام", labelEn: "Business Architecture", icon: Building2 },
    { id: "app-arch", labelAr: "بنية التطبيقات والأنظمة", labelEn: "Application & Modules", icon: LayoutGrid },
    { id: "data-arch", labelAr: "معمارية وقوام البيانات", labelEn: "Data Architecture", icon: Database },
    { id: "firebase-arch", labelAr: "سحابة وقواعد Firebase", labelEn: "Firebase Design", icon: Server },
    { id: "workflow-engine", labelAr: "محاكي الإجراءات الحكومي", labelEn: "Workflow Sandbox", icon: Workflow },
    { id: "integration-hub", labelAr: "خريطة التكامل الحكومي", labelEn: "Integration Map", icon: Network },
    { id: "ai-services", labelAr: "محرك الذكاء الاصطناعي 2035", labelEn: "Sovereign AI Suite", icon: Sparkles },
    { id: "security-audit", labelAr: "الأمن وسجل التدقيق السيادي", labelEn: "Security & Audit", icon: Lock },
    { id: "export-specs", labelAr: "تصدير الملفات البرمجية", labelEn: "Export Specs", icon: FileCode }
  ];

  // SECTION 1: Business Architecture Data
  const businessDomains = [
    {
      id: "Domain 01",
      nameAr: "التجارة الداخلية وحماية المستهلك",
      nameEn: "Internal Trade & Consumer Protection",
      descriptionAr: "تنظيم الأسواق المحلية، مراقبة أسعار السلع الاستراتيجية، تلقي بلاغات الاحتكار والغش التجاري وتفتيش المتاجر.",
      descriptionEn: "Regulating domestic markets, monitoring strategic commodity prices, handling anti-monopoly/fraud reporting, and inspecting local stores.",
      subcomponentsAr: ["مراقبة الأسواق والتموين", "إدارة الشكاوى والمخالفات", "التفتيش والضبط القضائي", "مكافحة الاحتكار والغش"],
      subcomponentsEn: ["Market Supply Monitoring", "Violation & Complaint Desk", "Judicial Inspection Squad", "Anti-Monopoly Command"]
    },
    {
      id: "Domain 02",
      nameAr: "التجارة الخارجية والصادرات الموحدة",
      nameEn: "Foreign Trade & Export Administration",
      descriptionAr: "تنظيم رخص الاستيراد والتصدير للمنتجات السودانية، رقابة المعاملات التجارية بميناء بورتسودان، وإصدار شهادات منشأ رقمية.",
      descriptionEn: "Managing import/export licensing, overseeing Port Sudan maritime trade clearance, and issuing official digital Certificates of Origin.",
      subcomponentsAr: ["تراخيص الاستيراد والتصدير", "إصدار شهادات المنشأ الذكية", "إحصاءات التجارة والميزان التجاري", "سجل المستوردين والمصدرين الموحد"],
      subcomponentsEn: ["Trade Licenses Manager", "Smart Certificate of Origin", "Balance of Trade Analytics", "Unified Traders Directory"]
    },
    {
      id: "Domain 03",
      nameAr: "التنمية الصناعية والخطوط الإنتاجية",
      nameEn: "Industrial Licensing & Production Monitoring",
      descriptionAr: "تسجيل وترخيص المصانع والمنشآت الصناعية الكبرى، وجدولة التفتيش البيئي والفني، ورصد الطاقة الاستيعابية لخطوط الإنتاج.",
      descriptionEn: "Registering and licensing industrial complexes, scheduling environmental and safety audits, and logging production capacities.",
      subcomponentsAr: ["ترخيص المنشآت الصناعية", "متابعة خطوط الإنتاج والقدرات", "جدولة التفتيش الفني والبيئي", "مؤشرات القطاع الصناعي الكلي"],
      subcomponentsEn: ["Industrial Plant Licensing", "Production Line Telemetry", "Technical Audits Scheduling", "Macro Industrial Indices"]
    },
    {
      id: "Domain 04",
      nameAr: "الاستثمار الصناعي والمدن الحرة",
      nameEn: "Industrial Investment & Free Zones",
      descriptionAr: "جذب الاستثمارات الأجنبية والمحلية، طرح الفرص الاستثمارية العقارية، وتخصيص الأراضي بالمناطق الصناعية الحرة.",
      descriptionEn: "Attracting global/local capital, showcasing high-yield projects, and leasing digital plots in sovereign industrial free zones.",
      subcomponentsAr: ["خريطة الفرص الاستثمارية", "حجز الأراضي اللوجستية وعقودها", "حوافز الاستثمار والإعفاءات الضريبية", "نافذة المستثمر الموحدة"],
      subcomponentsEn: ["Investment Opportunity Map", "Industrial Land Leasing", "Tax Holiday & Incentive Desk", "Unified Investor Portal"]
    },
    {
      id: "Domain 05",
      nameAr: "نظام السجل التجاري والأسماء التجارية",
      nameEn: "National Commercial Registry System",
      descriptionAr: "المستند السيادي الأهم لتسجيل وتوثيق الشركات، المؤسسات، الوكالات التجارية، والأسماء المقترحة برمز QR محمي.",
      descriptionEn: "The central sovereign module managing legal registration, commercial naming approvals, corporate structures, and QR verification.",
      subcomponentsAr: ["حجز وفحص الأسماء التجارية", "تأسيس وتسجيل الشركات والمؤسسات", "تعديل الأنصبة وبنية الشركاء", "بوابة التحقق السريع من السجلات"],
      subcomponentsEn: ["Trade Name Clearance", "Corporate Registration Engine", "Partners Share Registry", "Sovereign Quick-Verify Desk"]
    }
  ];

  // Business Org Structure Node Details Hover State
  const [selectedOrgNode, setSelectedOrgNode] = useState<string | null>(null);

  // SECTION 2: Application Architecture Layers
  const appLayers = [
    {
      titleAr: "بوابة الجمهور والمواطنين (Layer 1: Public Portal)",
      titleEn: "Citizen & Guest Gateway (Layer 1: Public Portal)",
      bg: "bg-emerald-50 border-emerald-100",
      icon: UserCheck,
      detailsAr: "واجهة الاستعلام المباشر، رصد أسعار السلع، تتبع القوانين وتقديم بلاغات الغش التجاري الفورية بدون تسجيل مسبق.",
      detailsEn: "Public inquiry hub, retail commodity price tracking, official business laws directory, and instant consumer complaint filing."
    },
    {
      titleAr: "بوابة المستثمرين والأعمال (Layer 2: Business Portal)",
      titleEn: "Business & Investor Suite (Layer 2: Business Portal)",
      bg: "bg-indigo-50 border-indigo-100",
      icon: Landmark,
      detailsAr: "تسجيل الشركات، تأسيس المصانع، تقديم المعاملات الاستيرادية والتصديرية، وتأجير الأراضي الصناعية وسداد الرسوم الرقمية.",
      detailsEn: "Corporate registry applications, factory setups, import/export custom permits, and industrial land leasing with e-payment integration."
    },
    {
      titleAr: "بوابة الموظف الرقمي واللجان المشتركة (Layer 3: Employee Portal)",
      titleEn: "Ministry Staff & Reviewer Console (Layer 3: Employee Portal)",
      bg: "bg-amber-50 border-amber-100",
      icon: Activity,
      detailsAr: "مراجعة المستندات والتحقق من الهوية، اتخاذ القرارات بالقبول أو طلب التعديل، وجدولة المفتشين الميدانيين عبر خرائط الـ GPS.",
      detailsEn: "Document verification, review flows, conditional return loops, and routing field inspectors via map-based task assignments."
    },
    {
      titleAr: "بوابة القيادة وصناع القرار (Layer 4: Management Portal)",
      titleEn: "Sovereign Executive Cockpit (Layer 4: Management Portal)",
      bg: "bg-rose-50 border-rose-100",
      icon: ShieldAlert,
      detailsAr: "لوحات تحليلية لحظية للوزير والوكلاء ومؤشرات الأداء الوطنية للأمن الغذائي والتجارة الخارجية وحجم الاستثمارات الفعالة.",
      detailsEn: "Real-time visual reports for His Excellency Minister, monitoring national food security indices, trade balance, and total venture capital."
    },
    {
      titleAr: "تطبيقات الهواتف المحمولة الذكية (Layer 5: Mobile Apps Suite)",
      titleEn: "Decentralized Mobile Applications (Layer 5: Mobile Apps Suite)",
      bg: "bg-teal-50 border-teal-100",
      icon: Cpu,
      detailsAr: "تطبيق المواطن (بلاغات الغش والأسعار)، تطبيق المستثمر (المحفظة الاستثمارية)، تطبيق المفتش الحكومي (رصد المخالفات بالصور والموقع الجغرافي).",
      detailsEn: "Citizen App (Complaint logging & verify QR), Investor wallet (Lands & licenses), and Inspector Mobile App (GPS tracking & camera uploads)."
    }
  ];

  // Core Platform Modules (SECTION 3)
  const coreModules = [
    { name: "Identity Module", ar: "وحدة الهوية الرقمية الموحدة", en: "Unified Digital ID" },
    { name: "User Management", ar: "إدارة الصلاحيات والأدوار", en: "Role-Based Access (RBAC)" },
    { name: "Commercial Registry", ar: "محرك السجل التجاري الرقمي", en: "Commercial Registry Engine" },
    { name: "Industrial Licensing", ar: "منصة الرخص والمنشآت الصناعية", en: "Industrial Licensing Suite" },
    { name: "Investment", ar: "بوابة إدارة الفرص الاستثمارية والمدن", en: "Investment Lands Portal" },
    { name: "Import Export", ar: "طبقة الاستيراد والتصدير وجمرك بورتسودان", en: "Customs Import-Export Hub" },
    { name: "Consumer Protection", ar: "نظام حماية المستهلك ومكافحة الاحتكار", en: "Consumer Shield Command" },
    { name: "Inspection", ar: "مفتشية الرصد والتحقق والميداني", en: "GPS Field Inspection Hub" },
    { name: "Workflow Engine", ar: "محرك الإجراءات والمعاملات السيادي", en: "Sovereign Workflow Engine" },
    { name: "Document Management", ar: "منظومة المستندات والوثائق المؤرشفة", en: "Cryptographic Document Safe" },
    { name: "Notification Center", ar: "مركز الإشعارات المركزي (SMS/إيميل)", en: "Multi-Channel Notification Hub" },
    { name: "Reporting Engine", ar: "محرك التقارير والذكاء التحليلي الكلي", en: "Analytical Dashboard Engine" },
    { name: "AI Engine", ar: "محرك الذكاء الاصطناعي والمستندات OCR", en: "Sovereign AI Document Engine" },
    { name: "Integration Hub", ar: "منصة التكامل الحكومي والربط الخارجي", en: "Government API Integration Hub" }
  ];

  // SECTION 4: Data Architecture
  const masterData = [
    { labelAr: "الولايات والمدن السودانية", labelEn: "States & Cities Hierarchy", descAr: "18 ولاية بترميز جغرافي موحد", descEn: "18 States with ISO geographical encoding" },
    { labelAr: "دليل الأنشطة التجارية ISIC4", labelEn: "ISIC4 Standard Trade Activities", descAr: "التصنيف الدولي الموحد للأنشطة", descEn: "International standard industrial classification" },
    { labelAr: "أنواع الشركات القانونية", labelEn: "Corporate Legal Entities", descAr: "محدودة، تضامنية، فرع أجنبي، مساهمة عامة", descEn: "LLC, Partnership, Foreign Branch, Public Shareholder" },
    { labelAr: "دليل القطاعات الصناعية والمواد الخام", labelEn: "Industrial Sectors & Raw Materials", descAr: "دليل الأغذية، الأدوية، النسيج، الهندسية", descEn: "Classifications for agri-food, pharma, steel, textile" }
  ];

  const transactionData = [
    { labelAr: "معاملات السجل والشركات", labelEn: "Commercial Registration Records", descAr: "طلب الاسم، التأسيس، تعديل الشركاء والملخص", descEn: "Name reservation, registration request, share revisions" },
    { labelAr: "طلبات حجز أراضي المدن الحرة", labelEn: "Industrial Lease Agreements", descAr: "مساحات الأراضي بالامتار، عقود الإيجار الرقمية", descEn: "Coordinates of leased parcels, digital leases" },
    { labelAr: "شهادات المنشأ ورخص الموانئ", labelEn: "Custom Permits & Certificates of Origin", descAr: "الشحنات المصدرة، قيم الفواتير، ترميز HS Code", descEn: "Shipped volume, invoice value, custom tariff codes" },
    { labelAr: "بلاغات المستهلكين ومحاضر الضبط", labelEn: "Consumer Violations & Field Enforcements", descAr: "مخالفات التسعير، شهادات المصادرة، تقارير الضبطية", descEn: "Price-gouging claims, food confiscations, judicial logs" }
  ];

  const analyticalData = [
    { labelAr: "مؤشرات التجارة الخارجية (الصادرات/الواردات)", labelEn: "Macro Trade Balance & Volume metrics", descAr: "حساب حجم التصدير السنوي مقابل واردات الاستهلاك", descEn: "Sum of annual exports vs import margins for national strategy" },
    { labelAr: "مؤشرات نمو رؤوس الأموال الاستثمارية", labelEn: "Venture Capital Inflow and Expansion", descAr: "إجمالي قيمة رؤوس الأموال المسجلة شهرياً", descEn: "Sovereign aggregated corporate registered capital flow" },
    { labelAr: "مؤشرات كفاءة المصانع وخطوط الإنتاج", labelEn: "Industrial Capacity Utilization Charts", descAr: "معدلات خطوط الإنتاج والامتثال للتفتيش البيئي", descEn: "Active production metrics and general inspection compliance" }
  ];

  // SECTION 5: Firebase Design (Interactive collection schema explorer)
  const [selectedCollection, setSelectedCollection] = useState<string>("companies");
  const firestoreCollections = {
    users: [
      { field: "uid", type: "String (Primary Key)", descAr: "المعرف الموحد للمستخدم من Firebase Auth", descEn: "Unique user ID from Auth module" },
      { field: "fullName", type: "String", descAr: "الاسم الكامل الثنائي أو الرباعي للمستثمر أو المواطن", descEn: "Full legal name matching national documentation" },
      { field: "email", type: "String", descAr: "البريد الإلكتروني الموثق للتواصل واستقبال المستندات", descEn: "Primary registered email address" },
      { field: "phone", type: "String", descAr: "رقم الهاتف المعتمد لإرسال كود التحقق الثنائي MFA", descEn: "Phone number with international prefix (+249)" },
      { field: "role", type: "String (Enum)", descAr: "gov_minister | gov_executive | gov_employee | business_investor | public_citizen", descEn: "User role for system RBAC security access" },
      { field: "idNumber", type: "String", descAr: "الرقم الوطني السوداني أو رقم جواز السفر للأجانب", descEn: "National identification number" },
      { field: "createdAt", type: "Timestamp", descAr: "تاريخ ووقت إنشاء الحساب في النظام الموحد", descEn: "User account initialization date" }
    ],
    companies: [
      { field: "id", type: "String (Primary Key)", descAr: "رقم معرف الشركة الداخلي الذاتي", descEn: "Unique internal generated system ID" },
      { field: "companyNameAr", type: "String", descAr: "اسم الشركة التجاري المعتمد باللغة العربية", descEn: "Approved trade name in Arabic" },
      { field: "companyNameEn", type: "String", descAr: "اسم الشركة المترجم المعتمد باللغة الإنجليزية", descEn: "Approved trade name in English" },
      { field: "registrationNumber", type: "String (Indexed)", descAr: "رقم السجل التجاري الوطني (صيغة: SD-2035-XXXXX)", descEn: "Official sovereign registry number" },
      { field: "activityType", type: "String", descAr: "طبيعة النشاط التجاري المصنف بترميز ISIC4", descEn: "Primary business sector under ISIC4 codes" },
      { field: "capital", type: "Number", descAr: "رأس المال المستثمر والمسجل قانونياً بالعملة الوطنية", descEn: "Approved registered investment capital in SDG" },
      { field: "partners", type: "Array (Strings)", descAr: "قائمة بأسماء المساهمين والشركاء المؤسسين وأنصبتهم", descEn: "Array containing verified names of founding shareholders" },
      { field: "addressState", type: "String", descAr: "الولاية التي يقع فيها المقر الرئيسي للشركة", descEn: "Geographical state location for taxing purposes" },
      { field: "addressCity", type: "String", descAr: "المدينة أو المربع السكني داخل الولاية", descEn: "City / district matching company lease" },
      { field: "status", type: "String (Enum)", descAr: "pending | under_review | approved | rejected", descEn: "Verification status of the business registration" },
      { field: "applicantId", type: "String (Foreign Key)", descAr: "معرف المستخدم الذي تقدم بطلب التسجيل", descEn: "Foreign key reference to users.uid" },
      { field: "createdAt", type: "Timestamp", descAr: "تاريخ تقديم الطلب الأولي وتدشينه", descEn: "Timestamp when application was submitted" }
    ],
    factories: [
      { field: "id", type: "String", descAr: "معرف المنشأة الصناعية", descEn: "Unique factory ID" },
      { field: "factoryName", type: "String", descAr: "الاسم التجاري للمصنع أو المجمع الصناعي", descEn: "Industrial complex official name" },
      { field: "industrialSector", type: "String", descAr: "تصنيف الصناعة (غذائية، صيدلانية، هندسية، كيميائية، غزل)", descEn: "Sector (food, chemical, textile, pharmaceutical)" },
      { field: "locationState", type: "String", descAr: "الولاية التي يضمها المصنع (مثال: الجزيرة، البحر الأحمر)", descEn: "Geographical state of operation" },
      { field: "productionCapacity", type: "String", descAr: "القدرة الإنتاجية القصوى للخطوط والماكينات سنوياً", descEn: "Aggregated annual production throughput specification" },
      { field: "energySource", type: "String", descAr: "مصدر التوليد الكهربائي والطاقة (طاقة شمسية، ديزل، شبكة)", descEn: "Core power grid or renewable solar energy generation" },
      { field: "productionLinesCount", type: "Number", descAr: "عدد الخطوط الإنتاجية النشطة والمسجلة بالمنصة", descEn: "Number of active heavy machinery assembly lines" },
      { field: "inspectionStatus", type: "String", descAr: "حالة التفتيش الفني الميداني (passed | failed | pending)", descEn: "Technical, environmental and safety inspection status" },
      { field: "lastInspectionDate", type: "String", descAr: "تاريخ آخر زيارة للجنة التفتيش الموحدة", descEn: "Date of most recent physical state inspection" }
    ],
    applications: [
      { field: "id", type: "String", descAr: "معرف المعاملة الفريد", descEn: "Unique transaction ID" },
      { field: "investorName", type: "String", descAr: "اسم المستثمر مقدم طلب تخصيص الأرض والامتيازات", descEn: "Verified name of applying corporate investor" },
      { field: "proposedProject", type: "String", descAr: "شرح للمشروع الصناعي المستهدف إقامته بالأرض", descEn: "Detailed summary of the proposed heavy industry" },
      { field: "requestedAreaSqm", type: "Number", descAr: "المساحة المترية المطلوبة لحجز الأرض بالمنطقة الحرة", descEn: "Lease area size requirement in square meters" },
      { field: "preferredIndustrialZone", type: "String", descAr: "المدينة الصناعية المفضلة (جياد، بورتسودان، الباقير)", descEn: "Chosen industrial economic free zone" },
      { field: "status", type: "String", descAr: "حالة المعاملة (pending | under_review | approved | rejected)", descEn: "Sovereign workflow evaluation status" },
      { field: "createdAt", type: "Timestamp", descAr: "تاريخ وتوقيت المعاملة الفعلي", descEn: "Precise date of registration submission" }
    ],
    auditLogs: [
      { field: "id", type: "String (Primary Key)", descAr: "معرف فريد غير قابل للتعديل لسجل الرصد والضبط", descEn: "Read-only cryptographically indexed ID" },
      { field: "actorEmail", type: "String", descAr: "البريد الإلكتروني للموظف أو النظام الذي أجرى العملية", descEn: "Email of user or cloud system triggering modification" },
      { field: "actionType", type: "String", descAr: "نوع التحديث المجرى (CREATE | UPDATE_STATUS | EXPORT_DATA)", descEn: "Standard action type performed" },
      { field: "targetModule", type: "String", descAr: "المجمع المستهدف بالتعديل (Commercial | Industrial | Custom)", descEn: "Impacted system module" },
      { field: "previousState", type: "Map/String", descAr: "بيانات الحقل القديمة قبل التعديل (لحساب التغيرات)", descEn: "JSON state snapshot prior to execution" },
      { field: "newState", type: "Map/String", descAr: "البيانات الجديدة التي تم كتابتها وحفظها", descEn: "JSON state snapshot post execution" },
      { field: "timestamp", type: "Timestamp", descAr: "توقيت الخادم الدقيق لتوثيق حدوث المعاملة", descEn: "Sovereign server network timezone verified timestamp" }
    ]
  };

  // SECTION 6: Workflow Simulator state
  const [workflowState, setWorkflowState] = useState<number>(0);
  const workflowSteps = [
    { id: 0, labelAr: "تقديم الطلب (Submit)", labelEn: "Submit Form", descAr: "يقوم المستثمر برفع بيانات الشركة والمستندات الثبوتية المطلوبة ورأس المال للتأسيس.", descEn: "Investor uploads application forms, partner list, and specifies capital amount in portal." },
    { id: 1, labelAr: "التدقيق والمطابقة (Validation)", labelEn: "Form Validation", descAr: "يقوم النظام تلقائياً بالتحقق من عدم تكرار الاسم التجاري وخلو السجل الجنائي للشركاء.", descEn: "System parses data automatically checking for naming duplicates and database blocks." },
    { id: 2, labelAr: "المراجعة الحكومية (Review)", labelEn: "Staff Review", descAr: "يقوم موظف الإدارة العامة المختص بمطابقة الأوراق وفحص عقود الإيجار والوثائق السند.", descEn: "Federal registry clerk inspects documentation, verifies legal lease contracts and capital details." },
    { id: 3, labelAr: "الاعتماد السيادي (Approval)", labelEn: "Ministerial Approval", descAr: "اعتماد القرار وإحالته لقسم التصديق النهائي لتأكيد الموافقة على رخصة السجل التجاري.", descEn: "Official government sanction, validating the commercial register or industrial lease application." },
    { id: 4, labelAr: "الرسوم والدفع (Payment)", labelEn: "E-Payment Gateway", descAr: "إصدار فاتورة إلكترونية رقمية للرسوم وإتاحة الدفع الفوري عبر بنك السودان أو بطاقات الدفع.", descEn: "Generates governmental fee bill with active gateway link for instant digital clearance." },
    { id: 5, labelAr: "إصدار السجل والختم (Certificate Gen)", labelEn: "Digital Seal & QR", descAr: "توليد الوثيقة الرسمية محكمة برمز QR آمن يضم بيانات الشهادة ومختوم بشعار الوزارة المعتمد.", descEn: "Compiles verified secure registration document, embedding official cryptographic QR validator." },
    { id: 6, labelAr: "الأرشفة والتسجيل (Archive)", labelEn: "Sovereign Archive", descAr: "حفظ المعاملة بقاعدة السجلات السيادية الدائمة وتحديث مصفوفة التدقيق والرقابة المالية.", descEn: "Commits record permanently to federal read-only archives and ledger histories." },
    { id: 7, labelAr: "الإشعار والجاهزية (Notification)", labelEn: "Investor Alert", descAr: "إرسال رسالة SMS وبريد إلكتروني تلقائي للمستثمر بصدور السجل التجاري ورابط التحميل.", descEn: "Fires instantaneous SMS / Email notify payload with high-resolution download links." }
  ];

  const handleNextWorkflowStep = () => {
    setWorkflowState(prev => (prev < 7 ? prev + 1 : 0));
  };

  const handlePrevWorkflowStep = () => {
    setWorkflowState(prev => (prev > 0 ? prev - 1 : 7));
  };

  // SECTION 7: Integration Hub REST Console Simulation
  const [selectedIntegration, setSelectedIntegration] = useState<string>("central-bank");
  const integrationsList = {
    "central-bank": {
      nameAr: "بنك السودان المركزي",
      nameEn: "Central Bank of Sudan",
      endpoint: "https://api.cbos.gov.sd/v1/payments/verify",
      method: "POST",
      headers: {
        "Authorization": "Bearer sdmci_sov_2035_token_sec",
        "Content-Type": "application/json",
        "X-Sovereign-Origin": "SDMCI-Digital-Portal"
      },
      payload: {
        transaction_id: "TX-902148293",
        amount_sdg: 150000.00,
        fee_code: "SDMCI_REG_FEE_01",
        settlement_account: "SD-GOV-901-44021"
      },
      response: {
        status: "SETTLED",
        cleared_timestamp: "2026-07-11T14:45:00Z",
        cbos_reference: "CBOS-35-901249",
        auth_code: "90412"
      }
    },
    "customs": {
      nameAr: "هيئة الجمارك السودانية وميناء بورتسودان",
      nameEn: "Sudanese Customs & Port Sudan Authority",
      endpoint: "https://api.customs.gov.sd/v2/licenses/export/sync",
      method: "PUT",
      headers: {
        "Authorization": "Bearer customs_sdmci_integration_key_sec",
        "Content-Type": "application/json"
      },
      payload: {
        license_number: "SD-EXPORT-LIC-4401",
        exporter_registration: "SD-2026-90412",
        allowed_hs_code: "09012100", // Gum Arabic / Coffee export
        max_annual_tonnage: 1500,
        expiry_date: "2027-07-11"
      },
      response: {
        sync_status: "SUCCESS",
        customs_db_index: "CUST-EXP-90241",
        port_sudan_clearance_active: true
      }
    },
    "taxes": {
      nameAr: "ديوان الضرائب الإتحادي",
      nameEn: "Federal Chamber of Taxation",
      endpoint: "https://api.taxes.gov.sd/v1/taxpayer/status",
      method: "GET",
      headers: {
        "X-Tax-Auth": "Token sdmci_chamber_taxation_2035"
      },
      payload: {
        tax_identification_number: "TIN-9041284-B",
        legal_name: "Khartoum Unified Gum Arabic Export Co."
      },
      response: {
        tin_status: "ACTIVE_CLEAR",
        tax_debts_outstanding: 0.00,
        latest_clearance_cert_id: "TAX-CLEAR-2026-00412",
        compliance_rating: "A_EXCELLENT"
      }
    },
    "ssmo": {
      nameAr: "الهيئة السودانية للمواصفات والمقاييس",
      nameEn: "Sudan Standards & Metrology Organization",
      endpoint: "https://api.ssmo.gov.sd/v1/inspections/verify",
      method: "POST",
      headers: {
        "Authorization": "Bearer ssmo_sdmci_secure_handshake"
      },
      payload: {
        sample_batch_id: "BATCH-GUM-440",
        quality_standard_class: "SUDAN-GRADE-A1",
        chemical_purity_percent: 99.4,
        passed_safety_limits: true
      },
      response: {
        ssmo_clearance: "APPROVED_FOR_EXPORT",
        authorized_officer_id: "SSMO-OFFICER-771",
        certificate_url: "https://ssmo.gov.sd/certs/GUM-440.pdf"
      }
    }
  };

  // SECTION 8: AI Services Simulation State
  const [ocrDocumentType, setOcrDocumentType] = useState<string>("trade-lease");
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const simulateOcrExtraction = () => {
    setIsOcrProcessing(true);
    setOcrResult(null);
    setTimeout(() => {
      setIsOcrProcessing(false);
      if (ocrDocumentType === "trade-lease") {
        setOcrResult({
          document_type: "عقد إيجار منطقة صناعية حرة (Industrial Lease Contract)",
          extracted_metadata: {
            "اسم المستأجر (Tenant Name)": "شركة النيل الأزرق للتصنيع الغذائي ذ.م.م",
            "مربع الموقع (Plot Coordinates)": "المنطقة الحرة بورتسودان - قطاع ب - بلوك 14",
            "المساحة المتعاقد عليها (Leased Area)": "12,500 متر مربع",
            "قيمة الإيجار السنوي (Annual Lease)": "4,500,000 SDG",
            "تاريخ بدء العقد (Start Date)": "11 يوليو 2026",
            "تاريخ الانتهاء (Expiry Date)": "10 يوليو 2036"
          },
          confidence_score: "98.4%",
          ai_recommendation: "المستند يطابق شروط التوثيق بالوزارة. لا توجد أي عيوب أو تداخل في المربعات الصناعية المحجوزة مسبقاً. جاهز للاعتماد التلقائي."
        });
      } else {
        setOcrResult({
          document_type: "شهادة جودة الصادرات الزراعية (Agricultural Export Quality Cert)",
          extracted_metadata: {
            "الجهة المصدرة (Exporter)": "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
            "المنتج المستهدف (Commodity)": "صمغ عربي خام فئة الهشاب الموثقة",
            "الوزن الصافي للشحنة (Net Weight)": "120 طن متري",
            "ميناء التصدير الفعلي (Loading Port)": "ميناء بورتسودان الجنوبي - رصيف 5",
            "الترميز الجمركي الموحد (HS Code)": "0901.21.00",
            "بلد المقصد (Destination Country)": "فرنسا - ميناء مرسيليا"
          },
          confidence_score: "96.8%",
          ai_recommendation: "الشهادة متطابقة مع وثائق الفحص الصادرة من الهيئة السودانية للمواصفات والمقاييس. الشحنة مستوفية لمتطلبات التصدير بنسبة 100%."
        });
      }
    }, 1500);
  };

  // SECTION 9: Audit System simulation state (interactive simulator generating logs)
  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: "AUDIT-004",
      actorEmail: "minister.office@commerce.gov.sd",
      actionType: "APPROVE_LAND_LEASE",
      targetModule: "Investment",
      desc: "معالي الوزير يعتمد حجز الأرض بمساحة 10,000 متر مربع بمجمع جياد للمستثمر الكوميسا",
      timestamp: "14:42:15"
    },
    {
      id: "AUDIT-003",
      actorEmail: "cbos.gateway@commerce.gov.sd",
      actionType: "RESOLVE_PAYMENT",
      targetModule: "Payments",
      desc: "تسوية فاتورة تأسيس شركة الخرطوم الموحدة لتصدير الصمغ بقيمة 150,000 SDG بنجاح من البنك المركزي",
      timestamp: "14:38:22"
    },
    {
      id: "AUDIT-002",
      actorEmail: "reviewer.ali@commerce.gov.sd",
      actionType: "UPDATE_STATUS",
      targetModule: "Commercial Registry",
      desc: "تحديث حالة شركة البحر الأحمر للملاحة من 'تحت المراجعة' إلى 'معتمد بالكامل'",
      timestamp: "14:15:10"
    },
    {
      id: "AUDIT-001",
      actorEmail: "consumer.shield@commerce.gov.sd",
      actionType: "CREATE_COMPLAINT_RECORD",
      targetModule: "Consumer Protection",
      desc: "رصد بلاغ غش تجاري جديد برقم شكوى #90412 ضد 'أسواق بحري الكبرى' للسلع الاستهلاكية",
      timestamp: "13:02:44"
    }
  ]);

  const [simulatedActor, setSimulatedActor] = useState<string>("reviewer.ali@commerce.gov.sd");
  const [simulatedAction, setSimulatedAction] = useState<string>("UPDATE_STATUS");
  const [simulatedModule, setSimulatedModule] = useState<string>("Commercial Registry");
  const [simulatedDesc, setSimulatedDesc] = useState<string>("");

  const triggerSimulatedAuditLog = (e: React.FormEvent) => {
    e.preventDefault();
    const desc = simulatedDesc || `تحديث سجل المعاملات بوحدة ${simulatedModule} بواسطة ${simulatedActor}`;
    const newLog = {
      id: `AUDIT-${Math.floor(100 + Math.random() * 900)}`,
      actorEmail: simulatedActor,
      actionType: simulatedAction,
      targetModule: simulatedModule,
      desc: desc,
      timestamp: new Date().toTimeString().split(" ")[0]
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setSimulatedDesc("");
  };

  // Copy helper
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Production Firestore Security Rules Content Block
  const firestoreSecurityRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Verify if user is fully authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper: Fetch user document to check security roles
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    // Helper: Check specific administrative roles
    function hasRole(role) {
      return isAuthenticated() && getUserData().role == role;
    }

    // Helper: Check if user belongs to sovereign ministry team
    function isMinistryStaff() {
      return hasRole('gov_minister') || hasRole('gov_executive') || hasRole('gov_employee');
    }

    // USERS COLLECTION RULES
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (request.auth.uid == userId || hasRole('gov_executive'));
    }

    // ROLES & PERMISSIONS RULES
    match /roles/{roleId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('gov_minister') || hasRole('gov_executive');
    }

    // COMPANIES & COMMERCIAL REGISTRATIONS (Sovereign Document Store)
    match /companies/{companyId} {
      allow read: if true; // Public verified search validation via QR
      allow create: if isAuthenticated() && (request.resource.data.applicantId == request.auth.uid || isMinistryStaff());
      allow update, delete: if isMinistryStaff() || (isAuthenticated() && resource.data.applicantId == request.auth.uid && resource.data.status == 'pending');
    }

    // FACTORIES & LINE TELEMETRY
    match /factories/{factoryId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isMinistryStaff() || (isAuthenticated() && resource.data.applicantId == request.auth.uid);
      allow delete: if hasRole('gov_minister') || hasRole('gov_executive');
    }

    // TRADING & IMPORT EXPORT LICENSES
    match /licenses/{licenseId} {
      allow read: if isAuthenticated() && (resource.data.applicantId == request.auth.uid || isMinistryStaff());
      allow create: if isAuthenticated();
      allow update: if isMinistryStaff();
      allow delete: if hasRole('gov_minister');
    }

    // LAND LEASE & INVESTMENTS APPLICATIONS
    match /applications/{appId} {
      allow read: if isAuthenticated() && (resource.data.investorId == request.auth.uid || isMinistryStaff());
      allow create: if isAuthenticated();
      allow update: if isMinistryStaff();
      allow delete: if hasRole('gov_executive') || hasRole('gov_minister');
    }

    // CONSUMER COMPLAINTS & PRICE GOUGING Desk
    match /complaints/{complaintId} {
      allow read: if isMinistryStaff() || (isAuthenticated() && resource.data.reporterPhone == getUserData().phone);
      allow create: if true; // Allows anonymous citizen reporting of commercial fraud
      allow update: if isMinistryStaff();
      allow delete: if hasRole('gov_minister');
    }

    // GOVERNMENT AUDIT LOG ENGINE (Read-Only Ledger)
    match /auditLogs/{logId} {
      allow read: if isMinistryStaff();
      allow write: if false; // Cryptographically locked, written ONLY via secure Cloud Functions
    }
  }
}`;

  return (
    <div id="enterprise-architecture-blueprint" className="space-y-6">
      {/* Platform Title Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background flags */}
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-sudan-green/5 to-transparent pointer-events-none"></div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] flex items-center gap-2">
            <Layers className="h-6 w-6 text-sudan-green animate-pulse" />
            {currentLanguage === "ar" ? "منظومة السجل المعماري ومخطط التحول الرقمي 2035" : "Ministry Enterprise Architecture Blueprint 2035"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {currentLanguage === "ar" 
              ? "مخطط هيكلي سيادي لبناء وتشغيل الخدمات التجارية والصناعية وفق المعايير السحابية الفيدرالية لجمهورية السودان" 
              : "The central government engineering blueprint detailing layers, databases, integrations, and AI controls."}
          </p>
        </div>
        
        {/* Active Indicators */}
        <div className="flex items-center gap-2 bg-[#F4F6F5] border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-sudan-green">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{currentLanguage === "ar" ? "رؤية السودان 2035 • معتمد" : "Sudan Vision 2035 • SECURE"}</span>
        </div>
      </div>

      {/* Grid containing Sub-Tabs and Viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Hand Tab Selector */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider px-3 mb-2">
            {currentLanguage === "ar" ? "أبواب المخطط المعماري" : "Blueprint Subsections"}
          </p>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                    isActive 
                      ? "bg-sudan-green text-white shadow-sm" 
                      : "text-gray-500 hover:text-sudan-green hover:bg-slate-50"
                  }`}
                >
                  <TabIcon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-sudan-gold" : "text-gray-400"}`} />
                  <span className="truncate">{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Hand Content Viewport */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm"
            >
              
              {/* TAB 1: ENTERPRISE OVERVIEW */}
              {activeTab === "ea-overview" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Layers className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "الهيكل العام والترابط المؤسسي للمنصة" : "Unified Enterprise Architecture Mapping"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "خريطة المفاهيم الشاملة التي تبين تكامل خدمات الوزارة وتناغم طبقات التشغيل" : "A unified visual mapping illustrating the multi-tier dependency chain from users to secure databases."}
                    </p>
                  </div>

                  {/* Interactive Visual Map of Layers */}
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
                      <div className="h-10 w-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold">L1</div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-xs text-emerald-800 uppercase tracking-wide">{currentLanguage === "ar" ? "طبقة واجهة الاستخدام والبوابات (User Experience Layer)" : "User Experience Layer"}</h4>
                        <p className="text-[11px] text-emerald-600 mt-0.5">{currentLanguage === "ar" ? "بوابة الجمهور • بوابة الأعمال • تطبيق الهاتف للمواطنين والمفتشين" : "Citizen Portals, Investor Portals, and Inspector Field Mobile apps"}</p>
                      </div>
                    </div>

                    <div className="flex justify-center my-1 text-sudan-gold"><Workflow className="h-5 w-5 animate-bounce" /></div>

                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
                      <div className="h-10 w-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-bold">L2</div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-xs text-indigo-800 uppercase tracking-wide">{currentLanguage === "ar" ? "طبقة معالجة العمليات وحوكمة الأعمال (Workflow Processing)" : "Workflow & Business Processing"}</h4>
                        <p className="text-[11px] text-indigo-600 mt-0.5">{currentLanguage === "ar" ? "محرك الإجراءات المكون من 8 مراحل • التحقق التلقائي • التصديق الرقمي المعتمد" : "8-Step custom workflow engine, automated validations, and government reviews"}</p>
                      </div>
                    </div>

                    <div className="flex justify-center my-1 text-sudan-gold"><Workflow className="h-5 w-5 animate-bounce" /></div>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
                      <div className="h-10 w-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold">L3</div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-xs text-amber-800 uppercase tracking-wide">{currentLanguage === "ar" ? "محرك التكامل والذكاء الاصطناعي السيادي (Integration & AI Services)" : "Government Integration & AI Platform"}</h4>
                        <p className="text-[11px] text-amber-600 mt-0.5">{currentLanguage === "ar" ? "الربط الآمن مع البنك المركزي والجمارك والضرائب • قراءة الوثائق بـ OCR • المساعد الذكي" : "REST API gateways to Central Bank/Customs, Document OCR, and Sovereign AI assistant"}</p>
                      </div>
                    </div>

                    <div className="flex justify-center my-1 text-sudan-gold"><Workflow className="h-5 w-5 animate-bounce" /></div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 hover:shadow-xs transition-shadow">
                      <div className="h-10 w-10 bg-sudan-dark text-white rounded-xl flex items-center justify-center font-bold">L4</div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">{currentLanguage === "ar" ? "قاعدة البيانات والحوسبة السحابية المغلقة (Data & Sovereign Cloud)" : "Data & Sovereign Cloud Storage"}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{currentLanguage === "ar" ? "قواعد Firestore الموزعة • شهادات الأمان Rules • سجلات الرصد المالي لتدقيق الحسابات" : "Cloud Firestore collections, Storage buckets, locked Audit ledger, and RBAC auth"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <div className="bg-[#F4F6F5] p-4 rounded-2xl border border-gray-100 text-xs leading-relaxed text-gray-500 space-y-2">
                    <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "مذكرة المعماري الرئيسي للاستراتيجية الوطنية:" : "Chief Enterprise Architect Statement:"}</p>
                    <p>
                      {currentLanguage === "ar" 
                        ? "يستهدف تصميم عام 2035 إنهاء عصر المعاملات الورقية تماماً في الوزارة. يتم تأسيس جميع البوابات بصيغة Single Page Application (SPA) مرنة وسريعة الاستجابة، مبرمجة بلغة TypeScript مع ربط مباشر ومؤمن مئة بالمئة بقنوات Google Firebase السحابية." 
                        : "The 2035 design targets complete paperless transactions within the federal ministry. All user portals are modular React applications communicating securely with Firestore via real-time synchronization pipelines under tight sovereign security rule sets."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: BUSINESS ARCHITECTURE */}
              {activeTab === "business-arch" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "البنية التشغيلية ومجالات العمل الخمسة للوزارة" : "Business Operational Domains & Org Map"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "تفصيل الهيكل التنظيمي الرقمي والقطاعات الخدمية المستقلة" : "Deconstruction of the administrative divisions and 5 core functional fields."}
                    </p>
                  </div>

                  {/* Interactive Org Chart */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "تصفح الهيكل التنظيمي الرقمي (اضغط للعرض)" : "Interactive Org Tree (Click to inspect)"}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button 
                        onClick={() => setSelectedOrgNode("minister")}
                        className={`p-4 rounded-2xl text-center border transition-all text-xs cursor-pointer ${
                          selectedOrgNode === "minister" ? "bg-sudan-green text-white border-sudan-green-light" : "bg-slate-50 border-gray-200 hover:border-sudan-green"
                        }`}
                      >
                        <p className="font-extrabold">{currentLanguage === "ar" ? "مكتب معالي الوزير" : "Office of H.E. Minister"}</p>
                        <p className={`text-[10px] mt-1 ${selectedOrgNode === "minister" ? "text-sudan-gold" : "text-gray-400"}`}>{currentLanguage === "ar" ? "الاعتماد النهائي والمتابعة السيادية" : "Final approvals & state decisions"}</p>
                      </button>

                      <button 
                        onClick={() => setSelectedOrgNode("undersec")}
                        className={`p-4 rounded-2xl text-center border transition-all text-xs cursor-pointer ${
                          selectedOrgNode === "undersec" ? "bg-sudan-green text-white border-sudan-green-light" : "bg-slate-50 border-gray-200 hover:border-sudan-green"
                        }`}
                      >
                        <p className="font-extrabold">{currentLanguage === "ar" ? "مكتب الوكيل الإتحادي" : "Office of the Undersecretary"}</p>
                        <p className={`text-[10px] mt-1 ${selectedOrgNode === "undersec" ? "text-sudan-gold" : "text-gray-400"}`}>{currentLanguage === "ar" ? "توجيه خطط العمل ومطابقة المؤشرات" : "Day-to-day coordination & metrics"}</p>
                      </button>

                      <button 
                        onClick={() => setSelectedOrgNode("states")}
                        className={`p-4 rounded-2xl text-center border transition-all text-xs cursor-pointer ${
                          selectedOrgNode === "states" ? "bg-sudan-green text-white border-sudan-green-light" : "bg-slate-50 border-gray-200 hover:border-sudan-green"
                        }`}
                      >
                        <p className="font-extrabold">{currentLanguage === "ar" ? "مكاتب ومراكز الولايات" : "State Offices & Hubs"}</p>
                        <p className={`text-[10px] mt-1 ${selectedOrgNode === "states" ? "text-sudan-gold" : "text-gray-400"}`}>{currentLanguage === "ar" ? "18 مركزاً موزعاً للخدمة الميدانية" : "18 field enforcement locations"}</p>
                      </button>
                    </div>

                    {/* Org Node Details Box */}
                    {selectedOrgNode && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-gray-600 leading-relaxed space-y-1"
                      >
                        <p className="font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-sudan-gold" />
                          {currentLanguage === "ar" ? "تفاصيل الدور الإداري الرقمي:" : "Sovereign Administrative Scope:"}
                        </p>
                        <p>
                          {selectedOrgNode === "minister" && (currentLanguage === "ar" ? "يشمل إقرار القرارات الاستثنائية، مراجعة لوحة المراقبة السيادية، التدقيق في المعاملات الكبرى كأراضي المناطق الحرة، وتغيير لوائح الاستيراد والتصدير مباشرة." : "Grants final sanctioning power for industrial land allocation, updates critical export tariffs, and inspects national compliance telemetry directly.")}
                          {selectedOrgNode === "undersec" && (currentLanguage === "ar" ? "يشمل تنسيق التدفقات التشغيلية بين الإدارات الخمسة، تسوية شكاوى المستهلكين الكبرى، وإحالة المعاملات لوزير الدولة حال استيفائها شروط اللجان الفنية." : "Coordinates daily workflow assignments among the 5 administrations, analyzes custom port clearances, and issues executive directions to state offices.")}
                          {selectedOrgNode === "states" && (currentLanguage === "ar" ? "الربط والتحميل الجغرافي للمفتشين بالمدن الصناعية (مثل مجمع جياد بالجزيرة أو بورتسودان)، وضمان مزامنة البيانات وتراخيص السجل الفردية." : "Deploys field inspectors to sites (e.g., Giad industrial city in Gezira or red sea ports) with direct smartphone synchronization for real-time compliance reporting.")}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Business Domains Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "مجالات العمل الرئيسية للمنصة (Domains)" : "Core Business Domains"}</h4>
                    
                    <div className="space-y-4">
                      {businessDomains.map((domain) => (
                        <div key={domain.id} className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-sudan-green hover:shadow-xs transition-all space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="text-[10px] bg-sudan-green/10 text-sudan-green font-black px-2.5 py-1 rounded-full">{domain.id}</span>
                            <h4 className="font-black text-[#1A1A1A] text-xs md:text-sm">{currentLanguage === "ar" ? domain.nameAr : domain.nameEn}</h4>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{currentLanguage === "ar" ? domain.descriptionAr : domain.descriptionEn}</p>
                          
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(currentLanguage === "ar" ? domain.subcomponentsAr : domain.subcomponentsEn).map((sub, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-bold">{sub}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: APPLICATION & MODULAR ARCHITECTURE */}
              {activeTab === "app-arch" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "بنية التطبيقات والوحدات الرقمية الأربعة عشر" : "Application Layers & 14 Core Modules"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "تصميم الواجهات المتاحة وتفاصيل الوحدات المستقلة للمحرك" : "An overview of the client portals and 14 distinct system functional modules."}
                    </p>
                  </div>

                  {/* Application Layers */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "بوابات الاستخدام الخمسة (User Portals)" : "The Five Core Access Portals"}</h4>
                    
                    <div className="space-y-3">
                      {appLayers.map((layer, idx) => {
                        const Icon = layer.icon;
                        return (
                          <div key={idx} className={`p-4 rounded-2xl border ${layer.bg} flex items-start gap-4`}>
                            <div className="p-2 rounded-xl bg-white text-sudan-green border border-gray-100 shrink-0">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h5 className="font-extrabold text-xs text-[#1A1A1A]">{currentLanguage === "ar" ? layer.titleAr : layer.titleEn}</h5>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{currentLanguage === "ar" ? layer.detailsAr : layer.detailsEn}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 14 Core System Modules */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "محركات ووحدات المنصة الرقمية الأربعة عشر (14 Core Modules)" : "The 14 Core Independent Platform Modules"}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {coreModules.map((mod, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl flex items-center gap-3 hover:bg-white hover:border-sudan-green hover:shadow-xs transition-all">
                          <span className="text-xs font-mono font-black text-sudan-green bg-sudan-green/5 h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="font-extrabold text-xs text-[#1A1A1A]">{mod.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{currentLanguage === "ar" ? mod.ar : mod.en}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DATA ARCHITECTURE */}
              {activeTab === "data-arch" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Database className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "هندسة وقوام البيانات الإتحادية" : "Sovereign Federal Data Architecture"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "تصنيف البيانات إلى معلومات أساسية ومعاملات تشغيلية وتحليلات اقتصادية" : "Breaking down database objects into Master, Transactional, and Analytical schemas."}
                    </p>
                  </div>

                  {/* 3 Categories of Data */}
                  <div className="space-y-6">
                    {/* Master Data */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sudan-green">
                        <FileSpreadsheet className="h-5 w-5" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "1. البيانات المرجعية الأساسية (Master Data)" : "1. Primary Master Data"}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {masterData.map((data, idx) => (
                          <div key={idx} className="p-4 bg-[#F4F6F5] border border-gray-200 rounded-xl">
                            <p className="font-extrabold text-xs text-[#1A1A1A]">{currentLanguage === "ar" ? data.labelAr : data.labelEn}</p>
                            <p className="text-xs text-gray-400 mt-1">{currentLanguage === "ar" ? data.descAr : data.descEn}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transaction Data */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Workflow className="h-5 w-5" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "2. البيانات الحركية والطلبات (Transaction Data)" : "2. Transactional & Request Data"}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {transactionData.map((data, idx) => (
                          <div key={idx} className="p-4 bg-[#F4F6F5] border border-gray-200 rounded-xl">
                            <p className="font-extrabold text-xs text-[#1A1A1A]">{currentLanguage === "ar" ? data.labelAr : data.labelEn}</p>
                            <p className="text-xs text-gray-400 mt-1">{currentLanguage === "ar" ? data.descAr : data.descEn}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analytical Data */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-amber-600">
                        <Activity className="h-5 w-5" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "3. البيانات التحليلية والمؤشرات (Analytical Data)" : "3. Analytical & Business Intelligence"}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analyticalData.map((data, idx) => (
                          <div key={idx} className="p-4 bg-[#F4F6F5] border border-gray-200 rounded-xl">
                            <p className="font-extrabold text-xs text-[#1A1A1A]">{currentLanguage === "ar" ? data.labelAr : data.labelEn}</p>
                            <p className="text-xs text-gray-400 mt-1">{currentLanguage === "ar" ? data.descAr : data.descEn}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FIREBASE ARCHITECTURE DESIGN */}
              {activeTab === "firebase-arch" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Server className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "بنية الحوسبة السحابية وقاعدة Firestore" : "Sovereign Firebase & Firestore Schema Architecture"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "استكشف تفاصيل الجداول وحقول البيانات والمفاتيح المقترحة لقاعدة البيانات السحابية" : "Interactive database collection inspector illustrating typed field maps, keys, and scopes."}
                    </p>
                  </div>

                  {/* Schema Selector */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(firestoreCollections).map((colName) => (
                        <button
                          key={colName}
                          onClick={() => setSelectedCollection(colName)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            selectedCollection === colName 
                              ? "bg-sudan-green text-white border-sudan-green-light" 
                              : "bg-[#F4F6F5] text-gray-600 border-gray-200 hover:bg-white"
                          }`}
                        >
                          collection: <span className="font-mono font-bold text-sudan-gold">{colName}</span>
                        </button>
                      ))}
                    </div>

                    {/* Collection details display */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                      <div className="bg-slate-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#1A1A1A]">Collection: /{selectedCollection}</span>
                        <span className="text-[10px] uppercase font-bold text-sudan-gold">{currentLanguage === "ar" ? "حقول مبرمجة فعلياً" : "Production Typed Rules"}</span>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                        {firestoreCollections[selectedCollection as keyof typeof firestoreCollections]?.map((f, idx) => (
                          <div key={idx} className="p-4 flex flex-col md:flex-row justify-between gap-2 text-xs hover:bg-slate-50/50 transition-all">
                            <div className="space-y-1">
                              <p className="font-mono font-extrabold text-[#1A1A1A]">{f.field}</p>
                              <p className="text-gray-400 text-[11px]">{currentLanguage === "ar" ? f.descAr : f.descEn}</p>
                            </div>
                            <div className="shrink-0">
                              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                                {f.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cloud storage and functions outline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="p-4 bg-[#F4F6F5] border border-gray-200 rounded-2xl space-y-2">
                      <h4 className="font-black text-[#1A1A1A] text-xs flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-sudan-green" />
                        {currentLanguage === "ar" ? "مستودعات Cloud Storage" : "Cloud Storage Buckets"}
                      </h4>
                      <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                        <li><strong className="text-slate-700">/documents/leases/*</strong>: {currentLanguage === "ar" ? "حفظ عقود إيجار الأراضي والخرائط الهندسية" : "Stores industrial lease deeds & PDF zoning maps."}</li>
                        <li><strong className="text-slate-700">/documents/corporate/*</strong>: {currentLanguage === "ar" ? "وثائق الهوية، التوكيلات، ومحاضر الشراكة" : "Shareholder identity docs & partnership deeds."}</li>
                        <li><strong className="text-slate-700">/certificates/cr/*</strong>: {currentLanguage === "ar" ? "شهادات السجلات التجارية المصدرة ومختومة بـ QR" : "Official issued, signed PDF commercial registers."}</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-[#F4F6F5] border border-gray-200 rounded-2xl space-y-2">
                      <h4 className="font-black text-[#1A1A1A] text-xs flex items-center gap-2">
                        <Cpu className="h-4.5 w-4.5 text-sudan-green" />
                        {currentLanguage === "ar" ? "أجهزة تريجر Cloud Functions" : "Cloud Functions Microservices"}
                      </h4>
                      <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                        <li><strong className="text-slate-700">onCompanyApproved()</strong>: {currentLanguage === "ar" ? "توليد رقم السجل التجاري الموحد تلقائياً وختم الـ QR" : "Autogenerates registration numbers & stamps PDF seal with secure dynamic QR."}</li>
                        <li><strong className="text-slate-700">verifyPortSanctions()</strong>: {currentLanguage === "ar" ? "فحص تراخيص التصدير والتحقق من عدم وجود قيود دولية" : "Performs pre-clearance checks on customs for exports."}</li>
                        <li><strong className="text-slate-700">sendSmsNotification()</strong>: {currentLanguage === "ar" ? "إشعارات فورية على الهاتف عند تغيير حالة المعاملات" : "Triggers dynamic cellular SMS when reviewer alters workflow statuses."}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: WORKFLOW ENGINE SANDBOX */}
              {activeTab === "workflow-engine" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Workflow className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "محاكي مسار الإجراءات والمعاملات الحكومي" : "Sovereign Workflow Engine & Lifecycle Simulator"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "محاكي تفاعلي لمراحل معالجة الطلبات الحكومية الثمانية لخدمات السجل والتراخيص" : "Simulate the 8 distinct lifecycle states of a federal ministry application."}
                    </p>
                  </div>

                  {/* Interactive Lifecycle Steps */}
                  <div className="space-y-6">
                    
                    {/* Visual Progress Nodes */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-4 rounded-2xl border border-gray-200">
                      {workflowSteps.map((step) => {
                        const isPast = step.id <= workflowState;
                        const isActive = step.id === workflowState;
                        return (
                          <div 
                            key={step.id}
                            className={`flex flex-col items-center gap-1.5 transition-all text-center flex-1 min-w-[70px] ${
                              isActive ? "scale-105" : ""
                            }`}
                          >
                            <span className={`h-8 w-8 rounded-full font-bold text-xs flex items-center justify-center border transition-all ${
                              isActive ? "bg-sudan-green text-white border-sudan-green-light scale-110 ring-4 ring-sudan-green/20" :
                              isPast ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold" :
                              "bg-white text-gray-400 border-gray-200"
                            }`}>
                              {step.id + 1}
                            </span>
                            <span className={`text-[9px] font-extrabold max-w-[80px] line-clamp-1 ${isActive ? "text-sudan-green font-black" : isPast ? "text-slate-600" : "text-gray-400"}`}>
                              {currentLanguage === "ar" ? step.labelAr.split(" ")[0] : step.labelEn.split(" ")[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Step Detail Explanation Card */}
                    <div className="p-5 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-mono font-black text-sudan-gold">STEP {workflowState + 1} OF 8</span>
                        <h4 className="font-extrabold text-xs md:text-sm text-[#1A1A1A]">{currentLanguage === "ar" ? workflowSteps[workflowState].labelAr : workflowSteps[workflowState].labelEn}</h4>
                      </div>
                      
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {currentLanguage === "ar" ? workflowSteps[workflowState].descAr : workflowSteps[workflowState].descEn}
                      </p>

                      <div className="bg-[#F4F6F5] p-3 rounded-xl border border-gray-100 text-[10px] text-gray-400 flex flex-col md:flex-row justify-between gap-2">
                        <div>
                          <strong className="text-slate-700">{currentLanguage === "ar" ? "أذونات الأمن المطلوبة:" : "Security Role Allowed:"}</strong>
                          <span className="font-mono text-sudan-green ml-1">
                            {workflowState === 0 ? "public_citizen | business_investor" :
                             workflowState === 1 ? "cloud_system_trigger" :
                             workflowState === 2 ? "gov_employee (Ministry Staff)" :
                             workflowState === 3 ? "gov_minister (Minister Authority)" :
                             "system_automated_process"}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-700">{currentLanguage === "ar" ? "قناة الاتصال المحدثة:" : "Next Event Trigger:"}</strong>
                          <span className="font-mono text-sudan-gold ml-1">
                            {workflowState === 1 ? "Firebase Cloud Function: validateCR()" :
                             workflowState === 4 ? "SSMO API Gateway Connection" :
                             workflowState === 5 ? "Secured PDF Seal & QR compilation" :
                             workflowState === 7 ? "SMS notification payload dispatch" :
                             "Commit payload to local Firestore State"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={handlePrevWorkflowStep}
                        className="flex items-center gap-1.5 bg-[#F4F6F5] hover:bg-slate-200 text-[#1A1A1A] border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {currentLanguage === "ar" ? "المرحلة السابقة" : "Previous Stage"}
                      </button>

                      <div className="text-xs text-gray-400 font-extrabold">
                        {currentLanguage === "ar" ? `الخطوة الحالية: ${workflowState + 1} / 8` : `Current state: ${workflowState + 1} / 8`}
                      </div>

                      <button
                        onClick={handleNextWorkflowStep}
                        className="flex items-center gap-1.5 bg-sudan-green hover:bg-sudan-green-light text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        {currentLanguage === "ar" ? "المرحلة التالية" : "Next Stage"}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: INTEGRATION MAP */}
              {activeTab === "integration-hub" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Network className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "خريطة التكامل الفيدرالي الموحد" : "Sudanese Unified Government Integration Map"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "واجهة فحص ومزامنة البيانات وتكامل الأنظمة مع الوزارات والجهات الشريكة" : "Interactive API specifications for real-time inter-agency communications."}
                    </p>
                  </div>

                  {/* Integration selection row */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.keys(integrationsList).map((key) => {
                        const integration = integrationsList[key as keyof typeof integrationsList];
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedIntegration(key)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              selectedIntegration === key 
                                ? "bg-sudan-green text-white border-sudan-green-light shadow-xs" 
                                : "bg-[#F4F6F5] text-gray-600 border-gray-200 hover:bg-white"
                            }`}
                          >
                            <Terminal className="h-4 w-4 text-sudan-gold" />
                            <span className="text-[10px] font-black line-clamp-1">{currentLanguage === "ar" ? integration.nameAr.split(" ")[0] : integration.nameEn.split(" ")[0]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* REST Console Details */}
                    {selectedIntegration && (
                      <div className="bg-sudan-dark text-[#D8DEE9] font-mono p-5 rounded-2xl space-y-4 shadow-lg text-[11px] border border-slate-700">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                          <span className="text-[10px] bg-slate-700 text-sudan-gold px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                            {integrationsList[selectedIntegration as keyof typeof integrationsList].method}
                          </span>
                          <span className="text-slate-400 text-[10px] truncate max-w-[200px] md:max-w-none">
                            {integrationsList[selectedIntegration as keyof typeof integrationsList].endpoint}
                          </span>
                        </div>

                        {/* Request Headers */}
                        <div className="space-y-1">
                          <p className="text-sudan-gold font-bold text-[10px] uppercase">// Request Headers:</p>
                          <pre className="bg-[#2A2A2A] p-2.5 rounded-lg text-[#A3BE8C] overflow-x-auto">
                            {JSON.stringify(integrationsList[selectedIntegration as keyof typeof integrationsList].headers, null, 2)}
                          </pre>
                        </div>

                        {/* Request Payload */}
                        <div className="space-y-1">
                          <p className="text-sudan-gold font-bold text-[10px] uppercase">// Payload Body (JSON):</p>
                          <pre className="bg-[#2A2A2A] p-2.5 rounded-lg text-[#88C0D0] overflow-x-auto">
                            {JSON.stringify(integrationsList[selectedIntegration as keyof typeof integrationsList].payload, null, 2)}
                          </pre>
                        </div>

                        {/* Response Output */}
                        <div className="space-y-1">
                          <p className="text-emerald-400 font-bold text-[10px] uppercase">// Response Object (200 OK):</p>
                          <pre className="bg-[#2A2A2A] p-2.5 rounded-lg text-[#EBCB8B] overflow-x-auto">
                            {JSON.stringify(integrationsList[selectedIntegration as keyof typeof integrationsList].response, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: AI SERVICES ARCHITECTURE */}
              {activeTab === "ai-services" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "بنية الخدمات والذكاء الاصطناعي السيادي 2035" : "Sovereign AI Core & Document AI Platform"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "محاكاة لتقنيات معالجة المستندات بـ OCR ومؤشرات الذكاء الاصطناعي لاستشراف الأداء" : "Simulate automated PDF/document data extraction and forecasting models."}
                    </p>
                  </div>

                  {/* Document AI OCR Simulator */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "1. محاكي القراءة الذكية للمستندات (Document AI OCR)" : "1. Interactive Document AI OCR Simulator"}</h4>
                    
                    <div className="p-4 bg-[#F4F6F5] border border-gray-200 rounded-2xl space-y-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 text-xs text-[#1A1A1A]">
                          <span className="font-bold">{currentLanguage === "ar" ? "اختر مستنداً للمحاكاة:" : "Select Document:"}</span>
                          <select
                            value={ocrDocumentType}
                            onChange={(e) => setOcrDocumentType(e.target.value)}
                            className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg outline-none font-bold"
                          >
                            <option value="trade-lease">{currentLanguage === "ar" ? "عقد إيجار أرض صناعية" : "Industrial Lease Contract"}</option>
                            <option value="export-quality">{currentLanguage === "ar" ? "شهادة جودة الشحنات (المواصفات)" : "SSMO Quality Cert"}</option>
                          </select>
                        </div>

                        <button
                          onClick={simulateOcrExtraction}
                          disabled={isOcrProcessing}
                          className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-sudan-green hover:bg-sudan-green-light disabled:bg-slate-300 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                        >
                          <RefreshCw className={`h-4.5 w-4.5 ${isOcrProcessing ? "animate-spin" : ""}`} />
                          {currentLanguage === "ar" ? "قراءة واستخلاص البيانات بـ AI" : "Run Intelligent AI OCR"}
                        </button>
                      </div>

                      {/* OCR Result Presentation */}
                      {isOcrProcessing && (
                        <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                          <div className="h-6 w-6 border-2 border-sudan-green border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p>{currentLanguage === "ar" ? "جاري المسح الضوئي وتحليل التوقيعات والأرقام بـ OCR..." : "Analyzing document fields and signatures using Sovereign Gemini Vision..."}</p>
                        </div>
                      )}

                      {ocrResult && !isOcrProcessing && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="font-extrabold text-[#1A1A1A]">{ocrResult.document_type}</span>
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold">
                              Confidence: {ocrResult.confidence_score}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {Object.entries(ocrResult.extracted_metadata).map(([key, val]: any) => (
                              <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-gray-100">
                                <span className="text-[10px] text-gray-400 font-bold block">{key}</span>
                                <span className="text-[#1A1A1A] font-extrabold mt-0.5 block">{val}</span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-indigo-700">
                            <p className="font-extrabold text-[10px] uppercase tracking-wider">{currentLanguage === "ar" ? "استوصية ومطابقة المعايير (AI Review Recommendation):" : "Sovereign AI Matching Recommendation:"}</p>
                            <p className="mt-1 leading-relaxed text-[11px] font-medium">{ocrResult.ai_recommendation}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* AI Forecasting indicators */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "2. استشراف المؤشرات الاقتصادية التنبئية لـ 2035" : "2. Predictive AI Economic Indicators"}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "تضم المنصة مصفوفة ذكاء تنبئية لمقارنة معدلات نمو الشركات الجدد المسجلة بالاستثمارات، والتنبؤ بالعجز التمويني بالقمح والمواد الأساسية لضمان الأمن الغذائي القومي لعام 2035." 
                        : "Includes predictive capability matrix tracking new corporate registrations, forecasting wheat and raw material shortfalls to protect sovereign food security ahead of demand peaks."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 9: SECURITY & AUDIT */}
              {activeTab === "security-audit" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <Lock className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "بنية الأمن السيبراني ومراقبة سجل التدقيق" : "Cybersecurity Controls & Audit Ledger"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "حماية الهويات وسجل رصد وتتبع تعديل البيانات الفعلي بواسطة النظام" : "Real-time read-only system audit tracker capturing 'Who, When, and What was modified'."}
                    </p>
                  </div>

                  {/* Security Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <p className="font-extrabold text-red-800">{currentLanguage === "ar" ? "أمن الهويات والـ MFA" : "MFA Identity Shield"}</p>
                      <p className="text-red-600/80 mt-1">{currentLanguage === "ar" ? "دخول موحد ثنائي بـ OTP ورقم الهاتف للولايات" : "Two-factor OTP authorization verifying inspector identity on locations."}</p>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <p className="font-extrabold text-emerald-800">{currentLanguage === "ar" ? "تشفير البيانات بقنوات" : "Data At-Rest Encryption"}</p>
                      <p className="text-emerald-600/80 mt-1">{currentLanguage === "ar" ? "تشفير فوري لبيانات الشركاء والملخص المالي بقاعدة Firestore" : "Real-time AES-256 field encryption for partner stakes and bank accounts."}</p>
                    </div>

                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <p className="font-extrabold text-indigo-800">{currentLanguage === "ar" ? "مصفوفة الصلاحيات RBAC" : "RBAC Privilege Matrix"}</p>
                      <p className="text-indigo-600/80 mt-1">{currentLanguage === "ar" ? "فصل مطلق للصلاحيات لمنع كتابة البيانات إلا بطلب معتمد" : "Zero-trust verification rules restricting read-write scopes to authorized users."}</p>
                    </div>
                  </div>

                  {/* Dynamic Audit Log Sandbox Form */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "محاكي إنشاء سجلات الرقابة (Audit Generator)" : "Generate Simulated Audit Log Event"}</h4>
                    
                    <form onSubmit={triggerSimulatedAuditLog} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F4F6F5] p-4 rounded-2xl border border-gray-200">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold block">{currentLanguage === "ar" ? "الموظف المنفذ:" : "Actor Email:"}</label>
                        <select
                          value={simulatedActor}
                          onChange={(e) => setSimulatedActor(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          <option value="reviewer.ali@commerce.gov.sd">ali (Reviewer)</option>
                          <option value="executive.director@commerce.gov.sd">director (Executive)</option>
                          <option value="minister.office@commerce.gov.sd">minister (H.E. Office)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold block">{currentLanguage === "ar" ? "المجمع الفني المستهدف:" : "Target Module:"}</label>
                        <select
                          value={simulatedModule}
                          onChange={(e) => setSimulatedModule(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          <option value="Commercial Registry">Commercial Registry</option>
                          <option value="Industrial Platform">Industrial Platform</option>
                          <option value="Import Export">Import Export</option>
                          <option value="Investment Lands">Investment Lands</option>
                          <option value="Consumer Protection">Consumer Protection</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold block">{currentLanguage === "ar" ? "نوع العملية المجرية:" : "Action:"}</label>
                        <select
                          value={simulatedAction}
                          onChange={(e) => setSimulatedAction(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          <option value="UPDATE_STATUS">UPDATE_STATUS</option>
                          <option value="CREATE_RECORD">CREATE_RECORD</option>
                          <option value="REJECT_APPLICATION">REJECT_APPLICATION</option>
                          <option value="EXPORT_SECURE_DATA">EXPORT_SECURE_DATA</option>
                        </select>
                      </div>

                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold block">{currentLanguage === "ar" ? "شرح وتفاصيل التغيير (اختياري):" : "Custom log details (Optional):"}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={currentLanguage === "ar" ? "مثال: تحديث السجل التجاري رقم 90412..." : "e.g., Authorized commercial license SD-2026-90412 after cbos clearance."}
                            value={simulatedDesc}
                            onChange={(e) => setSimulatedDesc(e.target.value)}
                            className="flex-1 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs"
                          />
                          <button
                            type="submit"
                            className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer shrink-0 transition-colors"
                          >
                            {currentLanguage === "ar" ? "أضف للسجل" : "Log Event"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Audit Logs List */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-extrabold text-sudan-gold uppercase tracking-wider">{currentLanguage === "ar" ? "سجل الرصد والتحكم المركزي المحدث (Central Audit Logs)" : "Central Read-Only Audit Ledger Console"}</h4>
                    
                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs flex justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[10px]">{log.id}</span>
                              <span className="text-slate-500 font-bold">{log.actorEmail}</span>
                              <span className="text-gray-300">|</span>
                              <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">{log.actionType}</span>
                            </div>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{log.desc}</p>
                          </div>
                          
                          <div className="shrink-0 text-right space-y-1">
                            <span className="bg-[#EBCB8B]/10 text-sudan-gold px-1.5 py-0.5 rounded text-[10px] font-bold block">{log.targetModule}</span>
                            <span className="text-gray-400 text-[10px] font-mono block">{log.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: EXPORT SPECS */}
              {activeTab === "export-specs" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
                      <FileCode className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "تصدير حزمة ومخططات المعمارية البرمجية" : "Developer Package & Firebase Exporter"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "احصل على كود قواعد الحماية الفعلي لـ Firestore جاهزاً للنسخ والرفع المباشر في Firebase Studio" : "Copy production-ready Firebase Security Rules & schema JSON configs instantly."}
                    </p>
                  </div>

                  {/* Security rules copy section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-700">File: firestore.rules (Sovereign 2035 rules)</span>
                      
                      <button
                        onClick={() => handleCopyToClipboard(firestoreSecurityRulesCode, "rules")}
                        className="flex items-center gap-1.5 bg-[#F4F6F5] hover:bg-slate-200 border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-300"
                      >
                        {copiedText === "rules" ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-600">{currentLanguage === "ar" ? "تم نسخ القواعد بنجاح!" : "Copied rules!"}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 text-sudan-green" />
                            <span>{currentLanguage === "ar" ? "نسخ الكود" : "Copy Rules"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <pre className="bg-sudan-dark text-[#D8DEE9] font-mono p-5 rounded-2xl text-[10px] md:text-xs overflow-x-auto max-h-[300px] leading-relaxed border border-slate-700">
                        {firestoreSecurityRulesCode}
                      </pre>
                      <div className="absolute bottom-4 right-4 bg-sudan-dark/80 px-3 py-1 rounded text-[10px] text-gray-400 font-bold border border-slate-700">
                        YAML / FireRules Standard
                      </div>
                    </div>
                  </div>

                  {/* JSON Schema copy section */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-700">File: firebase-blueprint-schema.json</span>
                      
                      <button
                        onClick={() => handleCopyToClipboard(JSON.stringify(firestoreCollections, null, 2), "schema")}
                        className="flex items-center gap-1.5 bg-[#F4F6F5] hover:bg-slate-200 border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-300"
                      >
                        {copiedText === "schema" ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-600">{currentLanguage === "ar" ? "تم نسخ المخطط!" : "Copied schema!"}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 text-sudan-green" />
                            <span>{currentLanguage === "ar" ? "نسخ المخطط" : "Copy Schema JSON"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="bg-sudan-dark text-[#D8DEE9] font-mono p-5 rounded-2xl text-[10px] md:text-xs overflow-x-auto max-h-[250px] leading-relaxed border border-slate-700">
                      {JSON.stringify(firestoreCollections, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
