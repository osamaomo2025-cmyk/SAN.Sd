/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  BarChart3, Database, Map, TrendingUp, AlertTriangle, FileSpreadsheet, 
  Sparkles, Cpu, BookOpen, Users, CheckSquare, Globe, RefreshCw, Sliders, 
  Download, Search, Building, Clock, ArrowUpRight, ArrowDownRight, Scale, 
  ShieldAlert, Layers, Play, CheckCircle2, AlertCircle, FileText, Printer,
  Eye, HelpCircle, HardDrive, Zap, Info
} from "lucide-react";
import { 
  UserRole, CommercialRegistration, FactoryRegistration, 
  ImportExportLicense, CertificateOfOrigin, LandApplication, 
  ConsumerComplaint 
} from "../types";

interface SovereignBIPlatformProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
  companies: CommercialRegistration[];
  factories: FactoryRegistration[];
  licenses: ImportExportLicense[];
  certificates: CertificateOfOrigin[];
  applications: LandApplication[];
  complaints: ConsumerComplaint[];
}

// Mock historical data sets for high-fidelity trends
const historicalYears = ["2021", "2022", "2023", "2024", "2025", "2026"];
const growthTrends = [
  { year: "2021", registrations: 450, investment: 12.4, revenue: 145, satisfaction: 88, industrialUnits: 12 },
  { year: "2022", registrations: 590, investment: 18.2, revenue: 198, satisfaction: 90, industrialUnits: 18 },
  { year: "2023", registrations: 820, investment: 24.5, revenue: 280, satisfaction: 91, industrialUnits: 25 },
  { year: "2024", registrations: 1100, investment: 31.0, revenue: 410, satisfaction: 93, industrialUnits: 34 },
  { year: "2025", registrations: 1450, investment: 45.8, revenue: 620, satisfaction: 95, industrialUnits: 46 },
  { year: "2026", registrations: 1880, investment: 68.2, revenue: 890, satisfaction: 98, industrialUnits: 62 }
];

const sectorData = [
  { name: "الصناعات الغذائية", nameEn: "Agro-Food", value: 45, growth: "18.2%" },
  { name: "التعدين والذهب", nameEn: "Mining & Gold", value: 30, growth: "24.5%" },
  { name: "الصمغ العربي والزراعة", nameEn: "Gum Arabic & Agric", value: 40, growth: "15.1%" },
  { name: "الصناعات الكيميائية", nameEn: "Chemical Industries", value: 25, growth: "11.2%" },
  { name: "المنسوجات والملابس", nameEn: "Textiles", value: 15, growth: "8.4%" }
];

export default function SovereignBIPlatform({
  currentLanguage,
  role: initialRole,
  companies,
  factories,
  licenses,
  certificates,
  applications,
  complaints
}: SovereignBIPlatformProps) {
  // Allow user to switch roles locally inside the BI dashboard to view different management levels
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState<string>("dashboards");
  
  // Update state if parent prop updates
  useEffect(() => {
    setActiveRole(initialRole);
  }, [initialRole]);

  const getRoleLabel = (r: UserRole) => {
    if (r === UserRole.GOVERNMENT_MINISTER) return currentLanguage === "ar" ? "ديوان معالي الوزير" : "HE Minister Office";
    if (r === UserRole.GOVERNMENT_EXECUTIVE) return currentLanguage === "ar" ? "المتابعة التنفيذية للوكيل" : "Undersecretary Executive Follow-up";
    if (r === UserRole.GOVERNMENT_EMPLOYEE) return currentLanguage === "ar" ? "الموظف المراجع الرقمي" : "Staff Reviewer Console";
    return currentLanguage === "ar" ? "المستثمر والمواطن" : "Investor & Citizen Portal";
  };

  // ------------------ ET DATA WAREHOUSE STATES ------------------
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("2026-07-15 06:00 AM");
  const [syncLogs, setSyncLogs] = useState<string[]>([
    "Sovereign ETL Process initialized at 2026-07-15 06:00:01",
    "Extracted 120,412 Commercial Records from Transactional DB...",
    "Transformed and updated Analytical Star Schemas.",
    "Materialized aggregations generated successfully in 124ms.",
    "DW Health: Optimal (100% synchronized)."
  ]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleString());
      setSyncLogs(prev => [
        `ETL Process manually triggered at ${new Date().toLocaleString()}`,
        `Synchronized ${companies.length} company registries and ${factories.length} factories.`,
        "Regenerated aggregate analytics and indices successfully.",
        ...prev
      ]);
    }, 1500);
  };

  // ------------------ ADVANCED / CONFIGURABLE KPI ENGINE ------------------
  const [kpiWeights, setKpiWeights] = useState({
    registrationGrowth: 85,
    licenseRenewal: 70,
    processingTime: 90,
    revenueGrowth: 75,
    customerSatisfaction: 80
  });

  const calculateSovereignScore = () => {
    const score = (
      (kpiWeights.registrationGrowth * 1.2) + 
      (kpiWeights.licenseRenewal * 0.9) + 
      (100 - kpiWeights.processingTime * 0.5) + 
      (kpiWeights.revenueGrowth * 1.1) + 
      (kpiWeights.customerSatisfaction * 1.3)
    ) / 4;
    return Math.min(Math.round(score), 100);
  };

  // ------------------ PREDICTIVE FORECAST STATES ------------------
  const [forecastHorizon, setForecastHorizon] = useState<number>(12); // months
  const [externalShockFactor, setExternalShockFactor] = useState<number>(0); // sliders -20 to +20
  
  const generatePredictions = () => {
    const baseValue = 1880;
    const months = Array.from({ length: forecastHorizon }, (_, i) => i + 1);
    return months.map(m => {
      const growthRate = 0.02 + (externalShockFactor / 1000);
      const prediction = baseValue * Math.pow(1 + growthRate, m);
      const confidenceHigh = prediction * (1 + (0.01 * m));
      const confidenceLow = prediction * (1 - (0.01 * m));
      return {
        month: `Month ${m}`,
        "القيمة المتوقعة / Predicted": Math.round(prediction),
        "الحد الأعلى / High Confidence": Math.round(confidenceHigh),
        "الحد الأدنى / Low Confidence": Math.round(confidenceLow)
      };
    });
  };

  // ------------------ GEOGRAPHIC ANALYTICS STATE ------------------
  const [selectedState, setSelectedState] = useState<string>("الخرطوم");
  const sudanStatesData: Record<string, { companies: number, factories: number, investment: string, compliance: number }> = {
    "الخرطوم": { companies: 4850, factories: 182, investment: "145M USD", compliance: 96.5 },
    "البحر الأحمر": { companies: 2450, factories: 45, investment: "98M USD", compliance: 94.2 },
    "الجزيرة": { companies: 1890, factories: 62, investment: "54M USD", compliance: 92.1 },
    "كسلا": { companies: 940, factories: 12, investment: "18M USD", compliance: 89.4 },
    "شمال كردفان": { companies: 1120, factories: 22, investment: "35M USD", compliance: 91.0 },
    "نهر النيل": { companies: 1560, factories: 75, investment: "112M USD", compliance: 95.8 },
    "القضارف": { companies: 1230, factories: 14, investment: "40M USD", compliance: 90.5 }
  };

  // ------------------ DATA QUALITY STATES ------------------
  const dataQualityMetrics = {
    missingDataRate: 1.4, // %
    duplicateRecords: 14, // count
    invalidRecords: 28, // count
    syncErrors: 0,
    overallHealth: 98.4 // %
  };

  const dataQualityRecommendations = [
    { id: 1, ar: "تفعيل التحقق التلقائي لعناوين البريد والتحقق الثنائي للهوية لمنع السجلات المبتورة.", en: "Enforce email address validation and dual-factor auth to prevent truncated records." },
    { id: 2, ar: "تشغيل دالة خوارزمية Levenshtein المدمجة في قاعدة البيانات لتنظيف الأسماء التجارية المتشابهة وحذف التكرار.", en: "Execute built-in Levenshtein distance functions on commercial names database to eliminate phonetically identical duplicates." },
    { id: 3, ar: "ترقية واجهة الربط البيني (API Gateway) لإدخال التحقق المتزامن اللحظي مع السجل المدني السوداني.", en: "Upgrade API Gateway interop routes to enable synchronous real-time validation with the Sudan Civil Registry." }
  ];

  // ------------------ REPORTING STATES ------------------
  const [reportType, setReportType] = useState<string>("ministerial");
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportStatusMessage, setReportStatusMessage] = useState("");

  const triggerExport = (format: string) => {
    setIsGeneratingReport(true);
    setReportStatusMessage(currentLanguage === "ar" ? "جاري تجميع البيانات وتحليل المؤشرات السيادية..." : "Compiling sovereign indicators and auditing transaction registries...");
    
    setTimeout(() => {
      let content = "";
      let filename = `SDMCI_BI_${reportType}_Report_${new Date().toISOString().split('T')[0]}`;
      
      if (format === "csv") {
        content = "Sovereign Indicator,Metric Value,Threshold,Compliance Level\n" +
                  `Registration Growth Rate,${kpiWeights.registrationGrowth}%,>75%,Passed\n` +
                  `License Renewal Rate,${kpiWeights.licenseRenewal}%,>60%,Passed\n` +
                  `Average Service SLA,${kpiWeights.processingTime}h,<120h,Optimal\n` +
                  `System Revenue Growth,${kpiWeights.revenueGrowth}%,>10%,Optimal\n` +
                  `Citizen Satisfaction Rate,${kpiWeights.customerSatisfaction}%,>90%,Excellent\n` +
                  `Central Warehouse Health,${dataQualityMetrics.overallHealth}%,>95%,Passed\n`;
        filename += ".csv";
      } else if (format === "excel") {
        content = "XML-based or TSV Excel Compatible Dataset\n" +
                  "REPORT: SOVEREIGN CABINET EXECUTIVE AUDIT REPORT\n" +
                  `Timestamp: ${new Date().toISOString()}\n\n` +
                  "KPI,Value,Health\n" +
                  `Commercial Growth,${kpiWeights.registrationGrowth}%,Green\n` +
                  `Operational Efficiency,98.6%,Green\n`;
        filename += ".xls";
      } else {
        // PDF Simulation (Trigger standard browser window print on custom printable section)
        window.print();
        setIsGeneratingReport(false);
        return;
      }

      // Download file helper
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setReportStatusMessage(currentLanguage === "ar" ? "تم تصدير التقرير وتحميله بنجاح!" : "Report compiled and downloaded successfully!");
      setTimeout(() => setIsGeneratingReport(false), 2000);
    }, 1200);
  };

  // ------------------ AI EXECUTIVE ADVISOR CHAT STATE ------------------
  const [aiHistory, setAiHistory] = useState<Array<{ sender: "user" | "advisor", text: string }>>([
    { 
      sender: "advisor", 
      text: currentLanguage === "ar" 
        ? "أهلاً بك معالي الوزير في نظام المستشار الذكي لدعم القرار. يمكنني شرح مؤشرات الأداء الحالية، تلخيص تقارير البيانات المجمعة، التنبؤ بالمخاطر وتوصية الخطوات التصحيحية." 
        : "Welcome, Your Excellency, to the AI Decision Advisor Console. I am ready to explain KPI changes, summarize cabinet files, analyze anomalies, and forecast strategic outcomes." 
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMessage = aiInput;
    setAiHistory(prev => [...prev, { sender: "user", text: userMessage }]);
    setAiInput("");
    setIsAiThinking(true);

    // Call real backend Gemini API proxy or fallback to high-fidelity analytical response
    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `أنت المستشار التنفيذي الذكي لوزير التجارة والصناعة بجمهورية السودان. أجب باحترافية وهيبة حكومية بخصوص هذا الاستفسار: "${userMessage}". مستنداً إلى البيانات الحالية: عدد الشركات=${companies.length}، المصانع=${factories.length}، شكاوى المستهلكين=${complaints.length}، أداء الالتزام بنظام حماية المستهلك=${dataQualityMetrics.overallHealth}%، معدل رضا المستثمرين=98.4%. قدم إجابة رسمية، مركزة، مليئة بالمصطلحات الإدارية ورؤية السودان 2035.`,
          history: [],
          context: {
            kpiWeights,
            dataQualityMetrics,
            selectedState
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiHistory(prev => [...prev, { sender: "advisor", text: data.text }]);
      } else {
        throw new Error("API Failure");
      }
    } catch (err) {
      // High fidelity localized BI intelligence fallback response
      setTimeout(() => {
        let answer = "";
        const query = userMessage.toLowerCase();
        if (query.includes("أداء") || query.includes("كفاءة") || query.includes("kpi")) {
          answer = currentLanguage === "ar"
            ? "بناءً على تجميع مؤشرات الأداء اللحظية، نلاحظ نمواً متسارعاً في تسجيل الكيانات بنسبة تزيد عن 14.5% الربع الحالي. ومع ذلك، يستدعي مؤشر متوسط زمن المعالجة (SLA) اهتماماً إضافياً في ولاية كسلا لمطابقة المعايير الاتحادية."
            : "According to compiled BI indexes, registration growth stands at +14.5% this quarter. However, transaction backlog in Kassala State requires administrative intervention to match federal SLA standards.";
        } else if (query.includes("توقع") || query.includes("المستقبل") || query.includes("forecast")) {
          answer = currentLanguage === "ar"
            ? "تشير النمذجة التنبؤية للوزارة إلى زيادة تدفق الطلبات الاستثمارية الأجنبية في قطاع الصمغ العربي وتكرير المعادن بنسبة 22% حتى نهاية عام 2026، مما يتطلب توسعة البنية التحتية للحوسبة السحابية بمركز البيانات الوطني."
            : "Predictive analytics forecast a 22% surge in foreign direct investment (FDI) applications in the Gum Arabic and Mineral processing sectors through Q4 2026. Data Center scalability planning is recommended.";
        } else {
          answer = currentLanguage === "ar"
            ? "لقد قمت بتحليل طلبكم بعناية. لتعزيز كفاءة الحوكمة والمطابقة، نوصي بتوسيع المظلة الرقمية لتشمل الغرف الصناعية الإقليمية وتفعيل الربط الفوري لخطوط التمويل السيادية مع بوابة الدفع الفيدرالية."
            : "Analytical synthesis recommends extending digital licensing structures to regional industrial chambers and deploying real-time financial reconciliation routes on the Sovereign Payment Gateway.";
        }
        setAiHistory(prev => [...prev, { sender: "advisor", text: answer }]);
      }, 800);
    } finally {
      setIsAiThinking(false);
    }
  };

  // ------------------ EARLY WARNING NOTIFICATIONS ------------------
  const warningAlerts = [
    { id: 1, type: "danger", titleAr: "تراجع معدل تجديد التراخيص في ولاية الجزيرة", titleEn: "SLA Deterioration: License Renewal Down in Gezira", descAr: "معدل التجديد انخفض بنسبة 6.2% عن المنسوب الآمن، مما يشير إلى عقبات في مكاتب الفحص الإقليمية.", descEn: "Renewal rates dropped by 6.2% below safety threshold, signaling bottlenecks at local validation centers.", status: "Active", date: "2026-07-15" },
    { id: 2, type: "warning", titleAr: "محاولات وصول غير مصرح بها لوصلة التحقق البيني", titleEn: "Security Alert: Unauthorized API Gateway Handshakes", descAr: "رصد النظام 4 محاولات تبادل مفاتيح مجهولة لخدمات المطابقة مع وزارة البيئة الإقليمية.", descEn: "Detected 4 anomalous API handshakes targeting environment clearance endpoints. IP flagged.", status: "Under Review", date: "2026-07-14" },
    { id: 3, type: "info", titleAr: "مؤشرات نمو استثماري واعد في قطاع التعدين", titleEn: "Market Opportunity: Gold & Mining Surge", descAr: "ارتفاع حجم الطلبات الصناعية في ولاية نهر النيل بنسبة 24% يستدعي زيادة الحصص الحرة للأراضي.", descEn: "Industrial plot applications in River Nile state spiked by 24%. Re-zoning parameters advised.", status: "Investigating", date: "2026-07-13" }
  ];

  return (
    <div id="sovereign-bi-platform" className="space-y-6 print:bg-white print:text-black">
      
      {/* 1. Header Banner - Sovereign Visual Theme */}
      <div className="bg-[#0f172a] text-white p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#C5A059] text-[#0f172a] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
              {currentLanguage === "ar" ? "ديوان التخطيط والمتابعة السيادية" : "Sovereign Intelligence Directorate"}
            </span>
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              {currentLanguage === "ar" ? "قاعدة البيانات النشطة" : "Active DW Online"}
            </span>
          </div>
          
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[#C5A059]" />
            {currentLanguage === "ar" ? "منصة ذكاء الأعمال ودعم القرار التنفيذي" : "Sovereign BI & Executive Decision Support Platform"}
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "نظام الحوكمة التحليلية الموحد لدمج بيانات السجل التجاري، التراخيص، الاستثمار، التفتيش والمطالب المادية في مستودع موحد لدعم القيادة العليا بالسودان." 
              : "Unified analytical gateway consolidating registry, licensing, trade flow, field inspection, and sovereign financial metrics for national cabinet leadership."}
          </p>
        </div>

        {/* Dynamic BI Performance Gauge */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center lg:text-right shrink-0 min-w-[180px] relative z-10">
          <p className="text-[10px] text-[#C5A059] font-black uppercase tracking-wider">
            {currentLanguage === "ar" ? "مؤشر الالتزام الفيدرالي" : "National Compliance Index"}
          </p>
          <p className="text-4xl font-black text-emerald-400 mt-1">{calculateSovereignScore()}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${calculateSovereignScore()}%` }}></div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Quick Roles & Global Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Sovereign Level Swapper */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-extrabold pr-2 border-r border-gray-200">
            {currentLanguage === "ar" ? "منظور المستوى القيادي:" : "Leadership Tier View:"}
          </span>
          <button 
            onClick={() => setActiveRole(UserRole.GOVERNMENT_MINISTER)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeRole === UserRole.GOVERNMENT_MINISTER ? "bg-[#007229] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {currentLanguage === "ar" ? "معالي الوزير" : "HE Minister"}
          </button>
          <button 
            onClick={() => setActiveRole(UserRole.GOVERNMENT_EXECUTIVE)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeRole === UserRole.GOVERNMENT_EXECUTIVE ? "bg-[#007229] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {currentLanguage === "ar" ? "السيد الوكيل" : "Undersecretary"}
          </button>
          <button 
            onClick={() => setActiveRole(UserRole.GOVERNMENT_EMPLOYEE)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeRole === UserRole.GOVERNMENT_EMPLOYEE ? "bg-[#007229] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {currentLanguage === "ar" ? "مدير عام الإدارة" : "Director General"}
          </button>
          <button 
            onClick={() => setActiveRole(UserRole.BUSINESS_INVESTOR)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeRole === UserRole.BUSINESS_INVESTOR ? "bg-[#007229] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {currentLanguage === "ar" ? "مدير القسم المختص" : "Department Manager"}
          </button>
        </div>

        {/* Data Warehouse Synchronization Snapshot */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3.5 py-1.5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Database className="h-4 w-4 text-emerald-600" />
            <span className="font-extrabold">{currentLanguage === "ar" ? "مستودع البيانات:" : "Data Warehouse:"}</span>
            <span className="font-mono text-slate-500">{lastSyncTime}</span>
          </div>
          <button 
            onClick={handleManualSync} 
            disabled={isSyncing}
            className="text-[#C5A059] hover:text-[#b4904c] font-black flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? (currentLanguage === "ar" ? "جاري المزامنة..." : "Syncing...") : (currentLanguage === "ar" ? "مزامنة الآن" : "Sync Now")}
          </button>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 no-scrollbar">
        {[
          { id: "dashboards", labelAr: "لوحات القيادة التنفيذية", labelEn: "Executive Dashboards", icon: Users },
          { id: "data-warehouse", labelAr: "مستودع البيانات والـ ETL", labelEn: "Central Data Warehouse", icon: Database },
          { id: "analytics", labelAr: "التحليلات والمؤشرات المتقدمة", labelEn: "Advanced Analytics", icon: TrendingUp },
          { id: "predictive", labelAr: "التنبؤات الذكية والنمذجة", labelEn: "AI Predictive Analytics", icon: Cpu },
          { id: "map", labelAr: "التحليل الجغرافي للولايات", labelEn: "Geographic Map BI", icon: Map },
          { id: "quality", labelAr: "جودة البيانات والامتثال", labelEn: "Data Quality & Compliance", icon: Scale },
          { id: "reporting", labelAr: "محرك التقارير السيادية", labelEn: "Sovereign Reporting Engine", icon: FileSpreadsheet },
          { id: "early-warning", labelAr: "الإنذار المبكر والمخاطر", labelEn: "Early Warning Alerts", icon: AlertTriangle },
          { id: "mysql-tuning", labelAr: "الأداء وبنية MySQL التحليلية", labelEn: "MySQL Analytics Tuning", icon: HardDrive },
          { id: "documents", labelAr: "تقارير الماستر والتصميم السيادي", labelEn: "Master Design Manuals", icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all shrink-0 border-b-2 cursor-pointer ${
                isActive 
                  ? "border-[#007229] text-[#007229] bg-white font-extrabold" 
                  : "border-transparent text-gray-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm min-h-[500px]">
        
        {/* ================= TAB 1: EXECUTIVE DASHBOARDS (CUSTOMIZED) ================= */}
        {activeTab === "dashboards" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* MINI HEADER EXPLAINER */}
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B]">
                {currentLanguage === "ar" ? "لوحة المتابعة القيادية النشطة" : "Active Leadership Dashboard Console"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? `أنت تستعرض حالياً البيانات المهيأة لـ [${getRoleLabel(activeRole)}] للتحقق من الموثوقية والأداء.` 
                  : `Currently displaying metrics and SLA filters compiled for [${getRoleLabel(activeRole)}].`}
              </p>
            </div>

            {/* A. MINISTER DASHBOARD VIEW */}
            {activeRole === UserRole.GOVERNMENT_MINISTER && (
              <div className="space-y-6">
                {/* 4 KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex flex-col justify-between min-h-[110px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{currentLanguage === "ar" ? "نمو النشاط التجاري الوطني" : "National Registry Growth"}</p>
                    <p className="text-2xl font-black text-emerald-800 my-1">+14.5%</p>
                    <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> {currentLanguage === "ar" ? "أعلى من المستهدف بـ 2.4%" : "2.4% above benchmark"}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border border-amber-100 shadow-xs flex flex-col justify-between min-h-[110px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{currentLanguage === "ar" ? "التراخيص التجارية النشطة" : "Active Trade Licenses"}</p>
                    <p className="text-2xl font-black text-amber-800 my-1">1,824</p>
                    <p className="text-[10px] text-slate-500 font-bold">{currentLanguage === "ar" ? "استيراد وتصدير حوض النيل" : "Nilotic import-export quotas"}</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#0f172a]/5 to-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{currentLanguage === "ar" ? "حجم العوائد والرسوم السيادية" : "Sovereign Revenues"}</p>
                    <p className="text-2xl font-black text-slate-800 my-1">45.8M <span className="text-xs">SDG</span></p>
                    <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> ↑ 18% {currentLanguage === "ar" ? "نمو ربع سنوي" : "quarterly growth"}</p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between min-h-[110px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{currentLanguage === "ar" ? "النمو والالتزام الصناعي" : "Industrial Sector Coverage"}</p>
                    <p className="text-2xl font-black text-rose-800 my-1">92.4%</p>
                    <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">↑ 3.2% {currentLanguage === "ar" ? "منذ العام الماضي" : "since last year"}</p>
                  </div>
                </div>

                {/* Big Minister Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Performance Chart */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs lg:col-span-2 space-y-4">
                    <h4 className="font-extrabold text-[#1E293B] text-sm">{currentLanguage === "ar" ? "الأداء المالي ونمو الإيرادات السيادية (مليون جنيه)" : "Sovereign Financial Revenue Performance (Millions SDG)"}</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthTrends}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#007229" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#007229" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="revenue" stroke="#007229" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Industrial Growth Indicators */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
                    <h4 className="font-extrabold text-[#1E293B] text-sm pb-2 border-b border-gray-100">{currentLanguage === "ar" ? "المؤشرات الإستراتيجية للمستثمرين" : "Investor Strategic Markers"}</h4>
                    <div className="space-y-4 my-auto">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{currentLanguage === "ar" ? "سرعة إنجاز السجلات" : "Company setup time"}</span>
                        <span className="font-black text-emerald-600">12.4 {currentLanguage === "ar" ? "ساعة" : "hours"}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: "92%" }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{currentLanguage === "ar" ? "تغطية المطابقة والتفتيش" : "Inspection coverage"}</span>
                        <span className="font-black text-amber-600">89.4%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: "89%" }}></div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{currentLanguage === "ar" ? "معدل تدفق رؤوس الأموال" : "FDI Inflow Velocity"}</span>
                        <span className="font-black text-[#007229]">94.8%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#007229] h-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div className="bg-[#F4F6F5] p-3 rounded-xl border border-gray-100 text-center text-[10px] text-gray-500 leading-normal">
                      {currentLanguage === "ar" 
                        ? "ملاحظة سيادية: جميع المؤشرات متطابقة مع مصفوفة التنمية الاقتصادية المعتمدة لعام 2026." 
                        : "Sovereign Note: Indicators adhere fully to the approved National Economic Growth Matrix 2026."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* B. UNDERSECRETARY DASHBOARD VIEW */}
            {activeRole === UserRole.GOVERNMENT_EXECUTIVE && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase">{currentLanguage === "ar" ? "نسبة الالتزام باتفاقية الخدمة SLA" : "Workflow SLA Compliance"}</p>
                    <p className="text-3xl font-black text-[#1E293B] mt-2">94.8%</p>
                    <div className="mt-2 text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {currentLanguage === "ar" ? "ضمن النطاق الآمن المعياري" : "Within optimal performance limits"}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase">{currentLanguage === "ar" ? "الطلبات المعلقة في الانتظار" : "Pending Transactions Backlog"}</p>
                    <p className="text-3xl font-black text-amber-600 mt-2">{companies.filter(c => c.status === "pending").length + factories.filter(f => f.inspectionStatus === "pending").length + 12}</p>
                    <div className="mt-2 text-[10px] text-slate-400 font-bold">
                      {currentLanguage === "ar" ? "موزعة عبر 4 إدارات رئيسية" : "Distributed across 4 regional desks"}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase">{currentLanguage === "ar" ? "كفاءة الموظفين والإنتاجية" : "Ministry Staff Productivity Index"}</p>
                    <p className="text-3xl font-black text-emerald-600 mt-2">98.2%</p>
                    <div className="mt-2 text-[10px] text-emerald-600 font-bold">
                      {currentLanguage === "ar" ? "متوسط المعالجة اليومية: 22 ملف" : "Average daily file clearance: 22"}
                    </div>
                  </div>
                </div>

                {/* Workflow Efficiency & SLA trends */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <h4 className="font-extrabold text-[#1E293B] text-sm">{currentLanguage === "ar" ? "مخطط كفاءة سير العمل الأسبوعي وسرعة الإنجاز" : "Weekly Workflow Efficiency & SLA Execution Trends"}</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Week 1", completed: 145, pending: 22, SLA: 94 },
                        { name: "Week 2", completed: 180, pending: 15, SLA: 96 },
                        { name: "Week 3", completed: 130, pending: 35, SLA: 89 },
                        { name: "Week 4", completed: 210, pending: 12, SLA: 98 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" name="المعاملات المنجزة / Cleared" fill="#007229" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" name="المعاملات المتراكمة / Backlog" fill="#D21034" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* C. DIRECTORS DASHBOARD VIEW */}
            {activeRole === UserRole.GOVERNMENT_EMPLOYEE && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team Productivity Board */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-sm text-[#1E293B] pb-2 border-b border-gray-100">
                      {currentLanguage === "ar" ? "لوحة إنتاجية الأقسام والموظفين" : "Departmental Staff Productivity Board"}
                    </h4>
                    <div className="space-y-3.5">
                      {[
                        { name: "قسم السجل التجاري", count: 84, score: 98, color: "bg-emerald-500" },
                        { name: "قسم الفحص الصناعي", count: 42, score: 91, color: "bg-amber-500" },
                        { name: "قسم حماية المستهلك", count: 65, score: 95, color: "bg-blue-500" },
                        { name: "قسم التراخيص والمطابقة", count: 110, score: 88, color: "bg-rose-500" }
                      ].map(dept => (
                        <div key={dept.name} className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700">{dept.name} ({dept.count} {currentLanguage === "ar" ? "معاملة" : "files"})</span>
                            <span className="font-mono font-bold text-slate-500">{dept.score}% efficiency</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${dept.color}`} style={{ width: `${dept.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing Times Distribution */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-sm text-[#1E293B] pb-2 border-b border-gray-100">
                      {currentLanguage === "ar" ? "توزيع الفترات الزمنية للتدقيق والموافقة" : "SLA Auditing & Processing Time Distributions"}
                    </h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "أقل من ساعة / <1h", value: 35 },
                              { name: "1 - 12 ساعة / 1-12h", value: 45 },
                              { name: "12 - 48 ساعة / 12-48h", value: 15 },
                              { name: "أكثر من 48 ساعة / >48h", value: 5 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={65}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell fill="#007229" />
                            <Cell fill="#C5A059" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* D. DEPT MANAGERS DASHBOARD VIEW */}
            {activeRole === UserRole.BUSINESS_INVESTOR && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <h4 className="font-extrabold text-sm text-[#1E293B] pb-3 border-b border-gray-100">
                    {currentLanguage === "ar" ? "قائمة المهام اليومية ونسب الإنجاز الفعلي" : "Daily Operational Tasks Queue & Clearance Metrics"}
                  </h4>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-xs text-right text-slate-600">
                      <thead className="bg-[#F4F6F5] text-[10px] text-slate-500 uppercase font-black">
                        <tr>
                          <th className="p-3">{currentLanguage === "ar" ? "الخدمة / المهمة" : "Service / Task"}</th>
                          <th className="p-3">{currentLanguage === "ar" ? "الموظف المباشر" : "Assigned Staff"}</th>
                          <th className="p-3">{currentLanguage === "ar" ? "حالة المعاملة" : "Status"}</th>
                          <th className="p-3">{currentLanguage === "ar" ? "نسبة إكمال SLA" : "SLA Remaining"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="p-3 font-bold text-slate-900">{currentLanguage === "ar" ? "تدقيق سجل شركة النيل" : "Audit Nile Food Products Registry"}</td>
                          <td className="p-3">عمر يوسف الفكي</td>
                          <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[9px] font-bold">قيد الفحص</span></td>
                          <td className="p-3 font-mono font-bold text-emerald-600">45 mins left</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">{currentLanguage === "ar" ? "مطابقة شروط مصنع الخرطوم للنسيج" : "Inspect Khartoum Textile energy source"}</td>
                          <td className="p-3">صالح محمد أحمد</td>
                          <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[9px] font-bold">مكتمل وموثق</span></td>
                          <td className="p-3 font-mono text-slate-400">Completed</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">{currentLanguage === "ar" ? "شكوى مستهلك - مخبز بحري الآلي" : "Complaint investigation - Bahri Bakery"}</td>
                          <td className="p-3">خالد بن سعيد</td>
                          <td className="p-3"><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[9px] font-bold">عاجل جداً</span></td>
                          <td className="p-3 font-mono font-bold text-rose-600">SLA breached (3h overdue)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: CENTRAL DATA WAREHOUSE & ETL ================= */}
        {activeTab === "data-warehouse" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B] flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "بنية مستودع البيانات المركزي وخرائط الـ ETL" : "Central Enterprise Data Warehouse & ETL Pipelines"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "مستودع البيانات التحليلي يفصل السجلات التاريخية والتراخيص عن خادم المعاملات التشغيلي لضمان الأداء الفائق والقدرة على التدقيق." 
                  : "Central database separating analytical models from transactional engines to prevent database stress and optimize high-volume queries."}
              </p>
            </div>

            {/* Warehouse Tables Size & Health Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "جدول الحقائق: المبيعات والرسوم" : "Fact Table: Financial Sales"}</p>
                <p className="text-xl font-mono font-black text-slate-850 mt-1">124,512 Rows</p>
                <p className="text-[9px] text-[#C5A059] font-bold mt-1">Schema: star_finance_fact</p>
              </div>
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "جدول البعد: الشركات والشركاء" : "Dimension Table: Companies"}</p>
                <p className="text-xl font-mono font-black text-slate-850 mt-1">18,401 Rows</p>
                <p className="text-[9px] text-[#C5A059] font-bold mt-1">Schema: dim_companies</p>
              </div>
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "جدول البعد: التفتيش والرقابة" : "Dimension Table: Inspections"}</p>
                <p className="text-xl font-mono font-black text-slate-850 mt-1">45,102 Rows</p>
                <p className="text-[9px] text-[#C5A059] font-bold mt-1">Schema: dim_inspections</p>
              </div>
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{currentLanguage === "ar" ? "تاريخ الحفظ والاحتفاظ بالأرشيف" : "Data Retention Policy"}</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">10 Years Active</p>
                <p className="text-[9px] text-slate-400 mt-1">Older archived in Cold Storage</p>
              </div>
            </div>

            {/* Schema Visualizer & Interactive ETL Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-sm text-[#C5A059] flex items-center gap-2">
                  <Sliders className="h-4.5 w-4.5" />
                  {currentLanguage === "ar" ? "هيكل مستودع البيانات السيادي (Star Schema)" : "Sovereign Analytical Star Schema Model"}
                </h3>
                <div className="font-mono text-xs bg-slate-950 p-4 rounded-xl space-y-4 overflow-x-auto text-emerald-400">
                  <div>
                    <span className="text-slate-400">/* Fact Table */</span>
                    <p className="font-bold text-white">fact_national_operations_snapshot</p>
                    <p className="pl-4 text-[11px] text-slate-300">- date_key (FK) • company_key (FK) • license_key (FK) • region_key (FK)</p>
                    <p className="pl-4 text-[11px] text-slate-300">- registered_capital_sdg (Measure) • transaction_fees_collected (Measure)</p>
                    <p className="pl-4 text-[11px] text-slate-300">- sla_processing_time_hours (Measure) • consumer_protection_violations_count (Measure)</p>
                  </div>
                  <div>
                    <span className="text-slate-400">/* Dimension Tables */</span>
                    <p className="font-bold text-white">dim_time_axis, dim_sudan_states, dim_industrial_zones</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-3.5 rounded-xl text-[10px] text-slate-400 leading-relaxed">
                  <strong>{currentLanguage === "ar" ? "تأكيد معماري:" : "Architectural Confirmation:"}</strong> {currentLanguage === "ar" ? "تنزيل البيانات التشغيلية يتم بنظام Incremental Loading كل 60 دقيقة لمنع بطء خادم المعاملات الأصلي." : "Analytical staging is fully isolated and compiled incrementally every 60 minutes to maintain optimal performance."}
                </div>
              </div>

              {/* Live ETL Execution Log */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500 animate-pulse" />
                    {currentLanguage === "ar" ? "سجلات محاكي الـ ETL المجدول" : "Live Scheduled ETL Pipeline Logs"}
                  </h4>
                  <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "سير تدفق المزامنة التلقائية والتحقق من سلامة البيانات." : "Automation trace of data staging, cleanup, and indexing."}</p>
                </div>
                
                <div className="bg-[#1E293B] text-slate-300 p-4 rounded-xl font-mono text-[10.5px] space-y-1.5 h-48 overflow-y-auto pr-1">
                  {syncLogs.map((log, index) => (
                    <p key={index} className="leading-relaxed"><span className="text-[#C5A059]">&gt;</span> {log}</p>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "حالة التدفق: مكتمل 100%" : "Pipeline Status: Synchronized 100%"}</span>
                  <button 
                    onClick={handleManualSync}
                    className="bg-[#007229] hover:bg-emerald-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors"
                  >
                    {currentLanguage === "ar" ? "تشغيل الـ ETL يدوياً" : "Trigger Manual ETL Pipeline"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ADVANCED ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B]">
                {currentLanguage === "ar" ? "التحليلات الاقتصادية المتقدمة وتقاطع المؤشرات" : "Advanced Macroeconomic Analytics & Data Cross-Section"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "تحليل مالي وهيكلي تفصيلي لرصد نمو القطاعات والتحقق من مطابقة الحصص التجارية السنوية." 
                  : "Granular structural review of sector growth parameters, comparative trade metrics, and financial indices."}
              </p>
            </div>

            {/* Multi-Chart Analytics Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Company Registration growth trend chart */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-[#1E293B] text-sm">{currentLanguage === "ar" ? "نمو وحيوية حركة التأسيس السنوية للشركات" : "Annual Company Incorporation Velocity Trend"}</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthTrends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="registrations" stroke="#007229" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparative Sector Analysis */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-[#1E293B] text-sm">{currentLanguage === "ar" ? "تحليل الكفاءة والمساهمة حسب القطاعات الرئيسية" : "Sector Contribution & Compliance Analysis"}</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey={currentLanguage === "ar" ? "name" : "nameEn"} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="الحجم / Share %" fill="#C5A059" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: AI PREDICTIVE ANALYTICS ================= */}
        {activeTab === "predictive" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#C5A059]" />
                {currentLanguage === "ar" ? "التنبؤات الذكية والنمذجة الرياضية للتنمية" : "AI-Powered Predictive Analytics & Growth Simulation"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "توظيف تقنيات التنبؤ بالسلاسل الزمنية لتقدير حركة التأسيس، الإيرادات المستقبلية، وتوزيع الموارد على مكاتب التفتيش والمنافذ الفيدرالية." 
                  : "Leveraging time-series models to forecast incorporation volumes, resource demand spikes, and sovereign cashflow scenarios."}
              </p>
            </div>

            {/* Interactive sliders container */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{currentLanguage === "ar" ? "مدى التنبؤ بالشهور:" : "Forecast Horizon (Months):"}</span>
                  <span className="text-[#007229] font-mono">{forecastHorizon} {currentLanguage === "ar" ? "شهر" : "months"}</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="24" 
                  value={forecastHorizon} 
                  onChange={(e) => setForecastHorizon(parseInt(e.target.value))}
                  className="w-full accent-[#007229]" 
                />
                <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "مدى التوقعات الرياضية المستندة إلى السجل التاريخي" : "Mathematical forecasting range based on historical benchmarks"}</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{currentLanguage === "ar" ? "عامل التحفيز أو الصدمات الخارجية:" : "Investment Stimulus / Shock Factor:"}</span>
                  <span className={`${externalShockFactor >= 0 ? "text-emerald-600" : "text-rose-600"} font-mono`}>{externalShockFactor >= 0 ? "+" : ""}{externalShockFactor}%</span>
                </div>
                <input 
                  type="range" 
                  min="-20" 
                  max="20" 
                  value={externalShockFactor} 
                  onChange={(e) => setExternalShockFactor(parseInt(e.target.value))}
                  className="w-full accent-[#C5A059]" 
                />
                <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "تأثير السياسات المالية أو الطفرات التمويلية الكبرى" : "Simulate macro fiscal improvements, trade corridor updates, or credit shocks"}</span>
              </div>
            </div>

            {/* Predictive Chart */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-sm text-[#1E293B]">
                {currentLanguage === "ar" ? "منحنى التوقعات المستقبلية ومستويات الثقة لعدد الشركات النشطة" : "Active Registries Prediction Path & Confidence Intervals"}
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generatePredictions()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="الحد الأعلى / High Confidence" stroke="none" fill="#10b981" fillOpacity={0.1} name="الحد الأعلى للثقة / High Confidence Interval" />
                    <Area type="monotone" dataKey="الحد الأدنى / Low Confidence" stroke="none" fill="#ef4444" fillOpacity={0.07} name="الحد الأدنى للثقة / Low Confidence Interval" />
                    <Line type="monotone" dataKey="القيمة المتوقعة / Predicted" stroke="#007229" strokeWidth={3} name="القيمة المتوقعة للنمو / Baseline Prediction" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: GEOGRAPHIC ANALYTICS ================= */}
        {activeTab === "map" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B]">
                {currentLanguage === "ar" ? "الخريطة التفاعلية لتوزيع الأنشطة الصناعية والتراخيص" : "Interactive Geographical Matrix of Sudanese States"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "توزيع فدرالي جغرافي يوضح الكثافة الصناعية، ومعدلات نمو الأراضي المخصصة ومستويات الامتثال لحماية المستهلك." 
                  : "National visual framework illustrating company density, investment flow zones, and state inspection metrics."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Interactive State Details */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">{currentLanguage === "ar" ? "اختر الولاية للاستعلام:" : "Select State to Query:"}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(sudanStatesData).map(state => (
                    <button
                      key={state}
                      onClick={() => setSelectedState(state)}
                      className={`p-3 rounded-xl text-xs font-bold text-right border transition-all cursor-pointer ${
                        selectedState === state 
                          ? "bg-gradient-to-l from-[#007229]/10 to-white border-[#007229] text-[#007229] font-black" 
                          : "bg-white border-gray-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>

                {/* Selected State Metrics */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الولاية المحددة حالياً:" : "Current Queried Region:"}</p>
                    <h3 className="text-base font-black text-slate-900 mt-1">{selectedState}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "عدد السجلات:" : "Company Registries:"}</p>
                      <p className="text-sm font-black text-[#1E293B] mt-0.5">{sudanStatesData[selectedState]?.companies.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "المصانع النشطة:" : "Active Factories:"}</p>
                      <p className="text-sm font-black text-[#1E293B] mt-0.5">{sudanStatesData[selectedState]?.factories}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "التدفقات الاستثمارية:" : "FDI Inflow Assets:"}</p>
                      <p className="text-sm font-black text-[#007229] mt-0.5">{sudanStatesData[selectedState]?.investment}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold">{currentLanguage === "ar" ? "نسبة الالتزام والامتثال:" : "Local Compliance:"}</p>
                      <p className="text-sm font-black text-amber-600 mt-0.5">{sudanStatesData[selectedState]?.compliance}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle and Right Column: High-Fidelity SVG Interactive Map of Sudan */}
              <div className="lg:col-span-2 bg-[#f8fafc] rounded-3xl border border-slate-200 p-6 flex flex-col justify-between min-h-[400px]">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">{currentLanguage === "ar" ? "خارطة التوزيع الإستراتيجي والتمثيل الكثيف" : "National Geo-Spatial Strategic Density Matrix"}</h4>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">{currentLanguage === "ar" ? "تفاعلية بالكامل" : "Fully Interactive Map"}</span>
                </div>

                {/* SVG Sudan State Grid Representation */}
                <div className="relative w-full max-w-md mx-auto my-6 flex items-center justify-center">
                  <svg viewBox="0 0 400 350" className="w-full h-auto drop-shadow-sm">
                    {/* Background Grid Accent lines */}
                    <line x1="50" y1="50" x2="350" y2="300" stroke="#e2e8f0" strokeDasharray="5 5" />
                    <line x1="350" y1="50" x2="50" y2="300" stroke="#e2e8f0" strokeDasharray="5 5" />

                    {/* Khartoum (Central Red Node) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedState("الخرطوم")}>
                      <polygon points="180,150 220,150 210,180 170,170" fill={selectedState === "الخرطوم" ? "#007229" : "#10b981"} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <text x="180" y="145" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">{currentLanguage === "ar" ? "الخرطوم" : "Khartoum"}</text>
                      <circle cx="195" cy="162" r="6" fill="#fff" stroke="#D21034" strokeWidth="2" />
                    </g>

                    {/* Red Sea / Port Sudan (East Top Blue Node) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedState("البحر الأحمر")}>
                      <polygon points="260,50 340,30 330,100 280,110" fill={selectedState === "البحر الأحمر" ? "#007229" : "#3b82f6"} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <text x="310" y="45" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">{currentLanguage === "ar" ? "البحر الأحمر" : "Red Sea"}</text>
                    </g>

                    {/* River Nile (North Gold Node) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedState("نهر النيل")}>
                      <polygon points="170,60 250,50 270,120 190,110" fill={selectedState === "نهر النيل" ? "#007229" : "#C5A059"} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <text x="215" y="55" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">{currentLanguage === "ar" ? "نهر النيل" : "River Nile"}</text>
                    </g>

                    {/* Gezira (Southeast Green Node) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedState("الجزيرة")}>
                      <polygon points="210,180 250,180 240,220 190,210" fill={selectedState === "الجزيرة" ? "#007229" : "#10b981"} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <text x="235" y="175" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">{currentLanguage === "ar" ? "الجزيرة" : "Gezira"}</text>
                    </g>

                    {/* Kassala (East Crimson Node) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedState("كسلا")}>
                      <polygon points="280,110 330,100 310,170 270,160" fill={selectedState === "كسلا" ? "#007229" : "#f43f5e"} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <text x="305" y="95" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">{currentLanguage === "ar" ? "كسلا" : "Kassala"}</text>
                    </g>

                    {/* North Kordofan (West Central Slate Node) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedState("شمال كردفان")}>
                      <polygon points="90,140 160,150 150,210 100,200" fill={selectedState === "شمال كردفان" ? "#007229" : "#64748b"} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <text x="110" y="135" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">{currentLanguage === "ar" ? "شمال كردفان" : "N. Kordofan"}</text>
                    </g>

                    {/* Gadaref (Southeast Border Node) */}
                    <g className="cursor-pointer group" onClick={() => setSelectedState("القضارف")}>
                      <polygon points="250,180 300,170 280,240 230,230" fill={selectedState === "القضارف" ? "#007229" : "#8b5cf6"} stroke="#fff" strokeWidth="2" opacity="0.8" />
                      <text x="270" y="255" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">{currentLanguage === "ar" ? "القضارف" : "Al-Qadarif"}</text>
                    </g>
                  </svg>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-gray-150 text-[10px] text-gray-400 leading-normal">
                  {currentLanguage === "ar" 
                    ? "ملاحظة تشغيلية: تمثل الخارطة مخرجات نظام المعلومات الجغرافية الفيدرالي الموحد لغرف التجارة الإقليمية بجمهورية السودان." 
                    : "GIS Note: Geospatial polygons and coordinates trace directly from the Unified Sudan Commerce Regional Grid system."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: DATA QUALITY MANAGEMENT ================= */}
        {activeTab === "quality" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B] flex items-center gap-2">
                <Scale className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "إدارة جودة البيانات والتدقيق التلقائي" : "Central Data Quality & Compliance Auditing Platform"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "مراقبة مستمرة للبيانات الواردة من المنافذ والولايات لرصد المفقود، والتحقق من حظر التكرار وسلامة السجلات القانونية للشركات." 
                  : "Continuous compliance and data sanitation loops checking incoming files for truncation, metadata failure, or duplication."}
              </p>
            </div>

            {/* Quality Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#ecfdf5] border border-emerald-200 p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] text-emerald-800 font-extrabold uppercase">{currentLanguage === "ar" ? "معدل الصحة العام للمستودع" : "Overall DW Health Score"}</p>
                <p className="text-3xl font-black text-emerald-900">{dataQualityMetrics.overallHealth}%</p>
                <span className="text-[9px] text-emerald-600 font-bold">{currentLanguage === "ar" ? "رتبة: ممتاز" : "Rank: Excellent"}</span>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] text-gray-500 font-bold uppercase">{currentLanguage === "ar" ? "الحقول والبيانات المفقودة" : "Missing / Truncated Fields"}</p>
                <p className="text-3xl font-black text-[#1E293B]">{dataQualityMetrics.missingDataRate}%</p>
                <span className="text-[9px] text-slate-400">{currentLanguage === "ar" ? "أقل من المسموح (3%)" : "Well below threshold of 3%"}</span>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] text-gray-500 font-bold uppercase">{currentLanguage === "ar" ? "تكرار السجلات التجارية" : "Identified Duplicates"}</p>
                <p className="text-3xl font-black text-amber-600">{dataQualityMetrics.duplicateRecords}</p>
                <span className="text-[9px] text-amber-600 font-bold">{currentLanguage === "ar" ? "تتطلب دمجاً قانونياً" : "Requires legal consolidation"}</span>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
                <p className="text-[10px] text-gray-500 font-bold uppercase">{currentLanguage === "ar" ? "أخطاء التزامن والتبادل" : "Sync Handshake Errors"}</p>
                <p className="text-3xl font-black text-[#1E293B]">{dataQualityMetrics.syncErrors}</p>
                <span className="text-[9px] text-emerald-600 font-bold">{currentLanguage === "ar" ? "الحالة: متطابق ومستقر" : "Status: Optimal Synchronicity"}</span>
              </div>
            </div>

            {/* Recommendations & Action Logs */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="font-extrabold text-sm text-[#1E293B] flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#007229]" />
                {currentLanguage === "ar" ? "توصيات تحسين جودة البيانات لغرفة العمليات السيادية" : "Analytical Recommendations for Data Sanitation"}
              </h3>
              <div className="space-y-3.5 text-xs text-slate-600">
                {dataQualityRecommendations.map(rec => (
                  <div key={rec.id} className="bg-white p-4 rounded-xl border border-gray-150 flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#007229]/10 text-[#007229] rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {rec.id}
                    </span>
                    <p className="leading-relaxed font-bold">
                      {currentLanguage === "ar" ? rec.ar : rec.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: REPORTING ENGINE ================= */}
        {activeTab === "reporting" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B] flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "محرك تجميع وتصدير التقارير السيادية والمالية" : "Sovereign Executive Reporting & Complied Document Engine"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "توليد تلقائي للتقارير التنفيذية والمالية مع إمكانية تصديرها فورياً بصيغ مختلفة وطباعتها برمز الاستجابة السريعة (QR Code) لضمان المصداقية والامتثال الفيدرالي." 
                  : "Compile customizable cabinets audits, financial ledgers, and operational reports downloadable in Excel/CSV or printed as verifiable PDFs."}
              </p>
            </div>

            {/* Report Selection parameters */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Select Report Class */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 block">{currentLanguage === "ar" ? "تصنيف ونوع التقرير:" : "Select Report Blueprint:"}</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs outline-none font-bold"
                >
                  <option value="ministerial">{currentLanguage === "ar" ? "تقرير المتابعة والالتزام للوزير" : "HE Minister Cabinet Briefing"}</option>
                  <option value="financial">{currentLanguage === "ar" ? "التقرير المالي العام والحصيلة السيادية" : "National Trade Revenues Ledger"}</option>
                  <option value="inspections">{currentLanguage === "ar" ? "تقرير التدقيق والتحقق من التراخيص الميدانية" : "Field Inspections Audit Trail"}</option>
                  <option value="data-quality">{currentLanguage === "ar" ? "تقرير الامتثال وجودة بيانات السجل" : "Data Warehouse Sanitation Metrics"}</option>
                </select>
              </div>

              {/* Select Export Format */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 block">{currentLanguage === "ar" ? "صيغة الملف المطلوبة:" : "Export Extension:"}</label>
                <select 
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl text-xs outline-none font-bold"
                >
                  <option value="csv">CSV - Common Data Format</option>
                  <option value="excel">Excel XLS - Spreadsheets</option>
                  <option value="pdf">PDF / HTML Printable Template</option>
                </select>
              </div>

              {/* Trigger compiler button */}
              <div className="flex items-end">
                <button
                  onClick={() => triggerExport(exportFormat)}
                  disabled={isGeneratingReport}
                  className="w-full bg-[#007229] hover:bg-emerald-800 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="h-4.5 w-4.5 text-sudan-gold" />
                  {isGeneratingReport ? (currentLanguage === "ar" ? "جاري الإنتاج والتوثيق..." : "Processing...") : (currentLanguage === "ar" ? "تصدير وطباعة التقرير" : "Compile & Export Report")}
                </button>
              </div>
            </div>

            {/* Simulated Live status feedback */}
            {isGeneratingReport && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-[#007229] font-bold flex items-center gap-3 animate-pulse">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{reportStatusMessage}</span>
              </div>
            )}

            {/* Static Visual Preview of printable report frame */}
            <div id="printable-area" className="bg-white p-8 rounded-2xl border border-gray-300 shadow-xs space-y-6 max-w-4xl mx-auto font-sans relative">
              
              {/* Official Sudan Logo header */}
              <div className="flex justify-between items-start border-b-2 border-[#007229] pb-4">
                <div className="space-y-1.5 text-xs">
                  <p className="font-extrabold text-[#007229]">{currentLanguage === "ar" ? "جمهورية السودان الاتحادية" : "Republic of the Sudan"}</p>
                  <p className="text-slate-500 font-bold">{currentLanguage === "ar" ? "وزارة التجارة والصناعة" : "Ministry of Commerce & Industry"}</p>
                </div>
                
                {/* Simulated Emblem stamp */}
                <div className="w-14 h-14 bg-[#007229] text-white rounded-full flex flex-col items-center justify-center font-bold text-[9px] uppercase tracking-tighter border border-[#005220]">
                  <span>SDMCI</span>
                  <span>2035</span>
                </div>

                <div className="text-left text-xs space-y-1">
                  <p className="font-bold text-slate-700">{currentLanguage === "ar" ? "تاريخ التقرير:" : "Issued Date:"} 2026-07-15</p>
                  <p className="font-mono text-slate-400">REF: REP-BI-99412</p>
                </div>
              </div>

              {/* Title and context */}
              <div className="text-center space-y-1.5 py-2">
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  {reportType === "ministerial" && (currentLanguage === "ar" ? "تقرير أداء نمو النشاط التجاري لوزارة التجارة" : "Executive Commerce & Trade Growth Briefing")}
                  {reportType === "financial" && (currentLanguage === "ar" ? "بيان حركة الأموال وحصيلة الرسوم والمالية العامة" : "Annual Sovereign Revenue Balance Sheet")}
                  {reportType === "inspections" && (currentLanguage === "ar" ? "بيان حركة التدقيق والرقابة الميدانية ومطابقة الرخص" : "Field Audits and License Compliance Status")}
                  {reportType === "data-quality" && (currentLanguage === "ar" ? "بيان مؤشرات جودة وتناسق وتطهير البيانات الوطنية" : "National Registry Data Quality Matrix")}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {currentLanguage === "ar" 
                    ? "تقرير سيادي مجمع ومصدق من مستودع البيانات المركزي للوزارة." 
                    : "Official verified dashboard extract compiled from the central analytical data repository."}
                </p>
              </div>

              {/* Main content table mapping live metrics */}
              <table className="w-full text-xs text-right border-collapse text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-2.5 font-extrabold">{currentLanguage === "ar" ? "المؤشر القيادي الوطني" : "National Metric"}</th>
                    <th className="p-2.5 font-extrabold">{currentLanguage === "ar" ? "القيمة المحسوبة" : "Value"}</th>
                    <th className="p-2.5 font-extrabold">{currentLanguage === "ar" ? "معدل الأمان" : "Threshold"}</th>
                    <th className="p-2.5 font-extrabold">{currentLanguage === "ar" ? "نتيجة التقييم السيادي" : "Audit Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900">{currentLanguage === "ar" ? "نمو حركة التأسيس والتسجيل" : "Registry Growth rate"}</td>
                    <td className="p-2.5 font-mono">14.5%</td>
                    <td className="p-2.5 font-mono">8.0%</td>
                    <td className="p-2.5 text-emerald-600 font-bold">{currentLanguage === "ar" ? "مطابق ومعتمد" : "Passed (Green)"}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900">{currentLanguage === "ar" ? "معدل تجديد التراخيص" : "License Renewal rate"}</td>
                    <td className="p-2.5 font-mono">92.1%</td>
                    <td className="p-2.5 font-mono">85.0%</td>
                    <td className="p-2.5 text-emerald-600 font-bold">{currentLanguage === "ar" ? "مطابق ومعتمد" : "Passed (Green)"}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900">{currentLanguage === "ar" ? "سرعة إنجاز SLA للطلبات" : "Average SLA Process time"}</td>
                    <td className="p-2.5 font-mono">12.4 hours</td>
                    <td className="p-2.5 font-mono">&lt; 48 hours</td>
                    <td className="p-2.5 text-emerald-600 font-bold">{currentLanguage === "ar" ? "أداء فائق" : "Passed (Optimal)"}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900">{currentLanguage === "ar" ? "مؤشر الرضا العام للمستثمرين" : "Citizen Satisfaction Index"}</td>
                    <td className="p-2.5 font-mono">98.4%</td>
                    <td className="p-2.5 font-mono">90.0%</td>
                    <td className="p-2.5 text-emerald-600 font-bold">{currentLanguage === "ar" ? "ممتاز جداً" : "Passed (Excellent)"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Verifiable signature and stamp section */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200 text-xs">
                <div>
                  <p className="text-slate-400">{currentLanguage === "ar" ? "توقيع الموظف المراجع:" : "Verified Reviewer Stamp:"}</p>
                  <p className="font-extrabold text-[#007229] mt-1">{currentLanguage === "ar" ? "ديوان التدقيق الرقمي الموحد" : "Central Sovereignty Verification Bureau"}</p>
                </div>
                
                {/* Fake QR code for verification authenticity */}
                <div className="bg-[#f8fafc] p-2 border border-gray-200 rounded-lg flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-950 flex flex-col justify-between p-1 rounded">
                    <div className="flex justify-between"><div className="w-2 h-2 bg-white"></div><div className="w-2 h-2 bg-white"></div></div>
                    <div className="flex justify-between"><div className="w-2 h-2 bg-white"></div><div className="w-2.5 h-2.5 bg-emerald-400"></div></div>
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono">
                    <p className="font-bold text-slate-700">SCAN QR CODE</p>
                    <p>SECURE VERIFY 2035</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: ALERTS & EARLY WARNING SYSTEM ================= */}
        {activeTab === "early-warning" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B]">
                {currentLanguage === "ar" ? "نظام الإنذار المبكر ومخاطر حوكمة القرار" : "Sovereign Early Warning & Administrative Risk System"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "مستشعر إلكتروني لمراقبة الأداء ربع السنوي، يرسل تنبيهات تلقائية في حالة تدني مؤشرات معالجة المعاملات أو رصد محاولات وصول مشبوهة." 
                  : "Automated alert engine flagging workflow deterioration, security threats, regional drops, or outages immediately."}
              </p>
            </div>

            {/* List of Warnings */}
            <div className="space-y-4">
              {warningAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start justify-between gap-4 transition-all hover:scale-[1.005] ${
                    alert.type === "danger" 
                      ? "bg-rose-50/50 border-rose-200 text-rose-900" 
                      : alert.type === "warning" 
                        ? "bg-amber-50/50 border-amber-200 text-amber-900" 
                        : "bg-blue-50/50 border-blue-200 text-blue-900"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.type === "danger" 
                        ? "bg-rose-100 text-rose-700" 
                        : alert.type === "warning" 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-blue-100 text-blue-700"
                    }`}>
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? alert.titleAr : alert.titleEn}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{currentLanguage === "ar" ? alert.descAr : alert.descEn}</p>
                      <span className="text-[10px] text-gray-400 font-mono block pt-1">{alert.date}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shrink-0 ${
                    alert.type === "danger" 
                      ? "bg-rose-100 text-rose-800" 
                      : alert.type === "warning" 
                        ? "bg-amber-100 text-amber-800" 
                        : "bg-blue-100 text-blue-800"
                  }`}>
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: MYSQL PERFORMANCE & TUNING ================= */}
        {activeTab === "mysql-tuning" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B] flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "بنية وأدوات تحسين استعلامات MySQL التحليلية" : "Operational MySQL Indexing & Analytical Materialization Console"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "تطبيق فهارس مركبة واستدعاء استعلامات مجهزة مسبقاً (Optimized Queries) لمستودع البيانات لمنع إجهاد المعاملات اليومية." 
                  : "Composite indexes and materialized view specifications designed to speed up high-volume executive aggregate reports."}
              </p>
            </div>

            {/* Tuning metrics and SQL suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* MySQL Optimization list */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-xs text-slate-700">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-[#007229]" />
                  {currentLanguage === "ar" ? "قائمة تحسينات الأداء لقواعد البيانات" : "Recommended DB Tuning Measures"}
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-xl border border-gray-150">
                    <p className="font-extrabold text-slate-900">{currentLanguage === "ar" ? "1. إنشاء فهارس مركبة لأعمدة الحالات وتواريخ التأسيس" : "1. Composite indexes on Status and Created Date Columns"}</p>
                    <p className="text-gray-500 mt-1 leading-normal">{currentLanguage === "ar" ? "يقلل زمن معالجة طلبات الفلترة بنسبة 74% لتقارير المتابعة." : "Reduces query overhead by 74% during date-range executive slicing."}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-150">
                    <p className="font-extrabold text-slate-900">{currentLanguage === "ar" ? "2. بناء جداول تجميع ملخصة (Materialized Aggregate Cache)" : "2. Analytical Staging Tables & Materialized Aggregates"}</p>
                    <p className="text-gray-500 mt-1 leading-normal">{currentLanguage === "ar" ? "تجميع حجم رؤوس الأموال ومقدار الرسوم ربع السنوية يمنع مئات الآلاف من عمليات SUM() المتكررة." : "Avoids recurring multi-row SUM() computations on transactional registries."}</p>
                  </div>
                </div>
              </div>

              {/* Live SQL Code snippet box */}
              <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-[#C5A059] text-xs font-mono">-- Optimized SQL Analytical View Design</h4>
                <pre className="font-mono text-[11px] leading-relaxed text-emerald-400 bg-slate-950/80 p-3.5 rounded-xl overflow-x-auto">
{`CREATE OR REPLACE VIEW sdmci_bi_fact_summary AS
SELECT 
  c.addressState,
  COUNT(c.id) AS total_companies,
  SUM(c.capital) AS total_capital_sdg,
  COUNT(f.id) AS total_factories
FROM dim_companies c
LEFT JOIN dim_factories f ON f.locationState = c.addressState
WHERE c.status = 'approved'
GROUP BY c.addressState;

-- Indexing Optimization
CREATE INDEX idx_companies_state_status 
ON dim_companies(addressState, status);`}
                </pre>
                <div className="text-[10px] text-slate-400 text-center leading-normal">
                  {currentLanguage === "ar" ? "تنويه: الكود أعلاه مصمم خصيصاً للتنفيذ على قواعد بيانات MySQL 8.0+ الفيدرالية للوزارة." : "Optimized SQL views strictly compliant with Sudan Ministry MySQL cluster structures."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 10: MASTER REPORTS DOCUMENTS ================= */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#1E293B] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                {currentLanguage === "ar" ? "الوثائق والتقارير الفنية الكبرى لتصميم نظام ذكاء الأعمال" : "Government-Grade Master System Design Manuals & Blueprints"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentLanguage === "ar" 
                  ? "المخطط الهيكلي الإستراتيجي، دليل الحوكمة ومؤشرات الأداء السيادية لتشغيل مركز ذكاء الأعمال الوطني بوزارة التجارة." 
                  : "Comprehensive enterprise specifications, metadata framework plans, and national deployment manuals."}
              </p>
            </div>

            {/* Document Collapsible Accordions with high fidelity administrative text */}
            <div className="space-y-4 text-xs text-slate-700">
              
              {/* Doc 1 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                <h3 className="font-black text-sm text-slate-900 flex items-center justify-between pb-2 border-b border-gray-200">
                  <span>1. Enterprise Business Intelligence Architecture</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">APPROVED</span>
                </h3>
                <p className="mt-3 leading-relaxed">
                  <strong>{currentLanguage === "ar" ? "الملخص الفني لذكاء الأعمال:" : "Architectural Specification Summary:"}</strong><br/>
                  {currentLanguage === "ar" 
                    ? "تم بناء معمارية المنصة على أساس الفصل الفيدرالي التام (Complete Physical Decoupling) بين بيئة العمليات اليومية للوزارة وبين مستودع البيانات التحليلي المركزي. تتصل قواعد المعاملات التشغيلية (Registry, Companies, Licensing) بوصلات تبادل منخفضة المجهود للـ ETL، والتي تقوم بسحب سجل التغيير اللحظي وحقن جداول الأبعاد والمقاييس عبر نموذج النجمي (Star Schema). تضمن هذه البنية عدم تباطؤ قواعد البيانات السيادية بمعدلات استعلام مفرطة للقيادة العليا."
                    : "The physical architecture isolates transactional online systems (OLTP) from the Enterprise Data Warehouse (EDW) cluster. Operational change data capture (CDC) pipelines stream logs into regional staging schemas, updating Star Schema dimensions and facts. This ensures zero load impact on real-time company registration or license issuance workflows."}
                </p>
              </div>

              {/* Doc 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                <h3 className="font-black text-sm text-slate-900 flex items-center justify-between pb-2 border-b border-gray-200">
                  <span>2. Data Warehouse Schema Design Plan</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">APPROVED</span>
                </h3>
                <p className="mt-3 leading-relaxed">
                  <strong>{currentLanguage === "ar" ? "خطة تصميم جداول مستودع البيانات:" : "Consolidated Stars & Snowflake schemas:"}</strong><br/>
                  {currentLanguage === "ar" 
                    ? "تتبنى المنصة نموذج النجمي الفيدرالي الموحد (Unified Federal Star Schema) حيث تتموضع حقائق العمليات (fact_national_operations_snapshot) في المركز محاطة بخمس أبعاد رئيسية: بعد الزمن (dim_time_axis)، بعد الولايات والمناطق الصناعية (dim_sudan_states)، بعد تراخيص الامتثال (dim_licensing)، بعد الكيانات والأنشطة (dim_companies)، وبعد الشكاوى والبلاغات (dim_consumer_complaints). يساعد هذا التصميم في توليد التقارير المتقاطعة بسرعة تقل عن 200 ملي ثانية."
                    : "Employs an enterprise-grade Star Schema with a centralized transaction fact table mapped to standardized conformant dimensions (dim_time_axis, dim_sudan_states, dim_licensing, dim_companies, and dim_consumer_complaints). Rapid cross-dimensional slicing allows cabinet query outputs to compile in under 200ms."}
                </p>
              </div>

              {/* Doc 3 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                <h3 className="font-black text-sm text-slate-900 flex items-center justify-between pb-2 border-b border-gray-200">
                  <span>3. KPI Framework & Mathematical Specifications</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">APPROVED</span>
                </h3>
                <p className="mt-3 leading-relaxed">
                  <strong>{currentLanguage === "ar" ? "صيغ ومصفوفة حساب مؤشرات الأداء الكبرى:" : "Configurable KPI Calculations & Definitions:"}</strong><br/>
                  {currentLanguage === "ar" 
                    ? "تتولى المنصة معالجة وحساب المؤشرات التالية آلياً: نمو الشركات = [(عَدَد الشركات الحالية - السابقة) / السابقة] * 100. زمن الإنجاز SLA = متوسط ساعات إنهاء الطلبات عبر المعايير الفيدرالية. الالتزام وحماية المستهلك = [الشكاوى المحسومة بنجاح / إجمالي الشكاوى الواردة] * 100. هذه المؤشرات تضمن الشفافية وتدعم اتخاذ القرار بوزارة التجارة بجمهورية السودان لعام 2026."
                    : "Includes active real-time mathematical calculation algorithms: Company Registry Growth Rate = [(Current Count - Baseline Count) / Baseline] * 100. National Trade SLA compliance index is tracked as average request resolution latency. Consumer Protection Resolution Index = [Resolved Disputes / Total Active complaints] * 100."}
                </p>
              </div>

              {/* Doc 4 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                <h3 className="font-black text-sm text-slate-900 flex items-center justify-between pb-2 border-b border-gray-200">
                  <span>4. National Business Intelligence & Executive Decision Support Master Implementation Report</span>
                  <span className="text-[10px] bg-[#C5A059] text-white px-2 py-0.5 rounded font-black">MASTER CABINET FILE</span>
                </h3>
                <p className="mt-3 leading-relaxed leading-normal text-slate-600">
                  {currentLanguage === "ar" 
                    ? "يمثل هذا التقرير الوثيقة السيادية الشاملة المعتمدة لدى ديوان مجلس الوزراء ووزير التجارة والصناعة بجمهورية السودان لتفعيل التحول الرقمي وحوكمة القرار الاقتصادي الفيدرالي. يتكامل نظام ذكاء الأعمال (BI Platform) مع حزمة الخدمات الجارية بنجاح، مما يمنح صانع القرار في السودان وصولاً لحظياً مؤمناً، عالي الموثوقية ومزوداً بالتنبؤات الذكية والإنذارات المبكرة لضبط الأسواق وتطوير بيئة الاستثمار الوطنية في إطار رؤية السودان 2035."
                    : "This master report acts as the official Cabinet blueprint mapping Sudan's digital transformation path under Vision 2035. Consolidated Business Intelligence dashboards empower cabinet officers with predictive indicators, GIS visual vectors, and automated alarms to ensure compliance, foster local investment, and secure macro commerce trends."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. Floating Interactive AI Advisor Chat Console (Integrated inside BI Platform tab) */}
      <div id="ai-advisor-panel" className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sudan-gold animate-pulse" />
            <div>
              <h3 className="font-black text-sm text-white">
                {currentLanguage === "ar" ? "المستشار التنفيذي والسيادي الذكي (AI Cabinet Advisor)" : "AI Cabinet Executive Advisor Console"}
              </h3>
              <p className="text-[10px] text-slate-400">
                {currentLanguage === "ar" ? "مدعوم بنموذج ذكاء الأعمال لتحليل البيانات والمؤشرات الاقتصادية" : "Interactive analytical advisor powered by Gemini 3.5 AI Core"}
              </p>
            </div>
          </div>
        </div>

        {/* Advisor Chat stream */}
        <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
          {aiHistory.map((item, index) => (
            <div 
              key={index}
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                item.sender === "advisor" 
                  ? "bg-slate-800 text-slate-200 border border-slate-750 mr-auto" 
                  : "bg-[#007229] text-white ml-auto"
              }`}
            >
              <p className="font-bold">{item.text}</p>
            </div>
          ))}

          {isAiThinking && (
            <div className="bg-slate-800 text-slate-400 p-3.5 rounded-2xl text-xs mr-auto max-w-[40%] flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 animate-spin text-sudan-gold" />
              <span>{currentLanguage === "ar" ? "جاري صياغة التوصيات الوزارية..." : "Drafting cabinet brief..."}</span>
            </div>
          )}
        </div>

        {/* Input prompt */}
        <form onSubmit={handleAiQuery} className="flex gap-2 pt-2">
          <input 
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder={currentLanguage === "ar" ? "اسأل المستشار الذكي عن أداء قطاع أو تنبؤات الرسوم..." : "Ask the AI Advisor about sector trends, resource requirements or KPI forecast..."}
            className="flex-1 bg-slate-950 text-white border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-sudan-gold"
          />
          <button
            type="submit"
            className="bg-[#C5A059] hover:bg-[#b4904c] text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            {currentLanguage === "ar" ? "استفسار سيادي" : "Query"}
          </button>
        </form>
      </div>

    </div>
  );
}
