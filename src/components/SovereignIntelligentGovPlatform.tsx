import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, Database, Search, FileText, BarChart3, Award, Cpu, Eye, Scale, ShieldAlert,
  SearchCode, FileSearch, Sparkles, CheckCircle, AlertTriangle, Play, RefreshCw, Send,
  Upload, Layers, Activity, Users, LayoutDashboard, Compass, Radio, Server, Fingerprint,
  TrendingUp, BookOpen, AlertCircle, FileCheck, Check, Info, FileSpreadsheet, Lock, HelpCircle
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";

interface Props {
  currentLanguage: "ar" | "en";
  role: string;
}

// Preset Knowledge Base Items
const PRESET_REGULATIONS = [
  {
    id: "reg-1",
    titleAr: "قانون السجل التجاري لجمهورية السودان (تعديل 2026)",
    titleEn: "Sudan Commercial Registry Act (2026 Amendment)",
    categoryAr: "السجلات والشركات",
    categoryEn: "Registries & Companies",
    statusAr: "مفهرس ونشط",
    statusEn: "Indexed & Active",
    chunks: 142,
    lastUpdated: "2026-07-10"
  },
  {
    id: "reg-2",
    titleAr: "قانون تشجيع الاستثمار القومي ولائحته التنفيذية لعام 2021",
    titleEn: "National Investment Promotion Act & Regulations 2021",
    categoryAr: "الاستثمار والمدن",
    categoryEn: "Investment & Cities",
    statusAr: "مفهرس ونشط",
    statusEn: "Indexed & Active",
    chunks: 256,
    lastUpdated: "2026-06-18"
  },
  {
    id: "reg-3",
    titleAr: "قانون الرقابة وحماية المستهلك الوطني لعام 2026",
    titleEn: "National Consumer Protection & Regulation Act 2026",
    categoryAr: "الرقابة والمستهلك",
    categoryEn: "Consumer Protection",
    statusAr: "مفهرس ونشط",
    statusEn: "Indexed & Active",
    chunks: 198,
    lastUpdated: "2026-07-15"
  },
  {
    id: "reg-4",
    titleAr: "قواعد حوكمة الشركات والامتثال السيادي للشركات المساهمة العامة",
    titleEn: "Corporate Governance Rules & Sovereign Compliance for JSCs",
    categoryAr: "الحوكمة والتدقيق",
    categoryEn: "Governance & Audit",
    statusAr: "مفهرس ونشط",
    statusEn: "Indexed & Active",
    chunks: 115,
    lastUpdated: "2026-07-12"
  }
];

// Preset Data Catalog for Data Governance
const DATA_CATALOG = [
  {
    id: "cat-1",
    nameAr: "بيانات الشركات والمؤسسات بالسجل التجاري",
    nameEn: "Commercial Registry Company Master Dataset",
    ownerAr: "إدارة السجل التجاري الفيدرالي",
    ownerEn: "Federal Commercial Registry Dept",
    qualityScore: 99.4,
    syncStatusAr: "متزامن (فوري)",
    syncStatusEn: "Synced (Real-time)",
    recordsCount: 412952,
    lineageAr: "السجل التجاري ➔ بوابة الربط البيني ➔ مصلحة الضرائب والجمارك",
    lineageEn: "Trade Registry ➔ Interoperability Gateway ➔ Tax & Customs"
  },
  {
    id: "cat-2",
    nameAr: "قاعدة بيانات التراخيص الصناعية والبيئية",
    nameEn: "Industrial & Environmental Licensing Database",
    ownerAr: "إدارة التراخيص الصناعية والإنتاج",
    ownerEn: "Industrial Licensing & Production Dept",
    qualityScore: 97.8,
    syncStatusAr: "متزامن (يومي)",
    syncStatusEn: "Synced (Daily)",
    recordsCount: 18451,
    lineageAr: "وزارة الصناعة ➔ التراخيص الوطنية ➔ المواصفات والمقاييس",
    lineageEn: "Ministry of Industry ➔ National Licenses ➔ SSMO Standards"
  },
  {
    id: "cat-3",
    nameAr: "سجل المستثمرين الأجانب والمشاريع الاستثمارية الكبرى",
    nameEn: "Foreign Investors & Major Projects Registry",
    ownerAr: "المفوضية القومية للاستثمار",
    ownerEn: "National Investment Commission",
    qualityScore: 98.9,
    syncStatusAr: "متزامن (فوري)",
    syncStatusEn: "Synced (Real-time)",
    recordsCount: 7512,
    lineageAr: "وزارة الاستثمار ➔ المدن الصناعية ➔ بنك السودان المركزي",
    lineageEn: "Ministry of Investment ➔ Industrial Cities ➔ Central Bank"
  }
];

// Data Sync Conflict Preset
const PRESET_CONFLICTS = [
  {
    id: "conf-1",
    companyId: "SD-2026-90412",
    companyNameAr: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    sourceField: "العنوان الفيدرالي",
    registryValue: "الخرطوم بحري - المنطقة الصناعية",
    taxAuthorityValue: "أم درمان - حي الروضة",
    severity: "medium",
    status: "pending"
  }
];

// Mock database searchable entities for Enterprise Search
const SEARCHABLE_ENTITIES = [
  { type: "company", id: "c-1", nameAr: "شركة النيل للمنتجات الغذائية المحدودة", nameEn: "Nile Food Products Co. Ltd", number: "SD-2026-94829", stateAr: "الخرطوم", activityAr: "صناعات تحويلية غذائية" },
  { type: "company", id: "c-2", nameAr: "المؤسسة الوطنية لتطوير الصمغ العربي", nameEn: "National Gum Arabic Development Corp", number: "SD-2026-10293", stateAr: "البحر الأحمر", activityAr: "تصدير المحاصيل الصناعية" },
  { type: "factory", id: "f-1", nameAr: "مصنع الخرطوم لتدوير النسيج الحديث", nameEn: "Khartoum Modern Textile Recycling Factory", number: "FAC-SD-8820", stateAr: "الخرطوم", activityAr: "تدوير الغزل والنسيج" },
  { type: "license", id: "l-1", nameAr: "رخصة تصدير صمغ عربي خام", nameEn: "Raw Gum Arabic Export License", number: "LIC-EXP-9023", stateAr: "البحر الأحمر", activityAr: "تصدير الصمغ العربي" },
  { type: "complaint", id: "comp-1", nameAr: "مخالفة تسعير الدقيق الوطني - سوبرماركت البركة", nameEn: "National Flour Price Gouging - Al-Baraka", number: "COMP-2026-102", stateAr: "الخرطوم", activityAr: "رقابة الأسواق" }
];

export default function SovereignIntelligentGovPlatform({ currentLanguage, role }: Props) {
  const [activeTab, setActiveTab] = useState<string>("knowledge");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chatLog, setChatLogLog] = useState<Array<{ sender: "user" | "ai"; text: string; sources?: string[] }>>([
    {
      sender: "ai",
      text: currentLanguage === "ar"
        ? "أهلاً بك في منصة الذكاء الاصطناعي السيادي لوزارة التجارة والصناعة. أنا مستشارك الرقمي المعتمد، وجاهز لمساعدتك في الاستعلام عن القوانين، الإجراءات، حوكمة البيانات، وتحليلات التنبؤ الاقتصادي."
        : "Welcome to the Sovereign AI Platform of the Ministry of Commerce & Industry. I am your certified digital advisor, ready to assist you with regulations, processes, data governance, and economic forecasting."
    }
  ]);

  // Tab 1: Knowledge State
  const [regulations, setRegulations] = useState(PRESET_REGULATIONS);
  const [newRegTitleAr, setNewRegTitleAr] = useState("");
  const [newRegTitleEn, setNewRegTitleEn] = useState("");
  const [newRegContent, setNewRegContent] = useState("");

  // Tab 3: Digital Twin Simulation state
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationScenario, setSimulationScenario] = useState("season-peak");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [twinMetrics, setTwinMetrics] = useState({
    activeUsers: 1420,
    apiRequests: 245,
    avgResponseTime: 18,
    cpuUsage: 42,
    activeWorkflows: 89,
    systemUptime: 99.99
  });

  // Tab 4: Data Governance state
  const [conflicts, setConflicts] = useState(PRESET_CONFLICTS);
  const [resolvedConflictsCount, setResolvedConflictsCount] = useState(0);

  // Tab 5: Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFacet, setSearchFacet] = useState("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Tab 6: Document Intelligence state
  const [selectedPresetDoc, setSelectedPresetDoc] = useState("preset-cr");
  const [ocrText, setOcrText] = useState("");
  const [extractedEntities, setExtractedEntities] = useState<any>(null);
  const [fraudAudit, setFraudAudit] = useState<any>(null);
  const [ocrRunning, setOcrRunning] = useState(false);

  // Tab 7: Predictive Analytics Forecast Model
  const [forecastSector, setForecastSector] = useState("gum-arabic");
  const [forecastPeriod, setForecastPeriod] = useState("12m");

  // Tab 8: Innovation Ideas
  const [innovationIdeas, setInnovationIdeas] = useState<any[]>([
    {
      id: "idea-1",
      titleAr: "نظام التحقق الذاتي للصادرات القومية عبر البلوكشين",
      titleEn: "Blockchain-based National Export Verification System",
      authorAr: "د. هبة أمين - جامعة الخرطوم",
      authorEn: "Dr. Heba Amin - University of Khartoum",
      status: "approved",
      score: 94
    },
    {
      id: "idea-2",
      titleAr: "تتبع جودة تخزين الصمغ العربي بمستشعرات إنترنت الأشياء",
      titleEn: "IoT-based Gum Arabic Storage Quality Telemetry",
      authorAr: "م. محمد علي - تقنيات سنار",
      authorEn: "Eng. Mohamed Ali - Sennar Technologies",
      status: "reviewing",
      score: 88
    }
  ]);
  const [newIdeaTitleAr, setNewIdeaTitleAr] = useState("");
  const [newIdeaDesc, setNewIdeaDesc] = useState("");

  // Auto-updating Digital Twin live metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setTwinMetrics(prev => ({
        ...prev,
        activeUsers: Math.floor(prev.activeUsers + (Math.random() * 10 - 5)),
        apiRequests: Math.floor(prev.apiRequests + (Math.random() * 8 - 4)),
        avgResponseTime: Math.max(12, Math.floor(prev.avgResponseTime + (Math.random() * 4 - 2))),
        cpuUsage: Math.max(30, Math.min(95, Math.floor(prev.cpuUsage + (Math.random() * 6 - 3)))),
        activeWorkflows: Math.max(70, Math.floor(prev.activeWorkflows + (Math.random() * 4 - 2)))
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // AI Knowledge Search & Copilot logic
  const handleSendChat = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage("");
    setChatLogLog(prev => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/intelligent-gov/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          activeTab: activeTab,
          role: role,
          language: currentLanguage
        })
      });
      const data = await response.json();
      setChatLogLog(prev => [...prev, {
        sender: "ai",
        text: data.text,
        sources: data.sources
      }]);
    } catch (e) {
      console.error("Chat error", e);
      setChatLogLog(prev => [...prev, {
        sender: "ai",
        text: currentLanguage === "ar"
          ? "عذراً، لم أتمكن من الاتصال بخدمة الذكاء الاصطناعي السيادي في الوقت الحالي. يرجى إعادة المحاولة."
          : "Apologies, I couldn't reach the Sovereign AI Service. Please retry."
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Quick Action triggers for translation, summarization, etc.
  const handleQuickAiAction = async (actionType: "summarize" | "translate" | "report") => {
    setLoading(true);
    let prompt = "";
    if (actionType === "summarize") {
      prompt = currentLanguage === "ar"
        ? "لخص قانون السجل التجاري لعام 1925 السوداني في ثلاث نقاط رئيسية بأسلوب قانوني بليغ."
        : "Summarize the Sudan Commercial Registry Act of 1925 in three high-impact points.";
    } else if (actionType === "translate") {
      prompt = currentLanguage === "ar"
        ? "ترجم العبارة التالية بدقة قانونية: 'Sovereign Digital Identity is key to national e-governance interoperability.'"
        : "Translate to Arabic: 'Sovereign Digital Identity is key to national e-governance interoperability.'";
    } else {
      prompt = currentLanguage === "ar"
        ? "أنشئ تقرير أداء مالي وتصديري مقتضب للوزارة برسم بياني مستقبلي للمستثمرين."
        : "Generate a brief export performance and financial status memo of the Ministry for investors.";
    }

    setChatLogLog(prev => [...prev, { sender: "user", text: prompt }]);

    try {
      const response = await fetch("/api/intelligent-gov/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          activeTab: activeTab,
          role: role,
          language: currentLanguage
        })
      });
      const data = await response.json();
      setChatLogLog(prev => [...prev, {
        sender: "ai",
        text: data.text,
        sources: data.sources
      }]);
    } catch (e) {
      console.error("Quick AI Action error", e);
    } finally {
      setLoading(false);
    }
  };

  // Knowledge Indexing
  const handleIndexDocument = () => {
    if (!newRegTitleAr || !newRegContent) return;
    const newDoc = {
      id: `reg-${Date.now()}`,
      titleAr: newRegTitleAr,
      titleEn: newRegTitleEn || newRegTitleAr,
      categoryAr: "تحديثات وتشريعات جديدة",
      categoryEn: "New Regulations & Updates",
      statusAr: "جاري الفهرسة والتقطيع الفيكتوري",
      statusEn: "Indexing & Vector Partitioning",
      chunks: Math.floor(10 + Math.random() * 50),
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    setRegulations(prev => [newDoc, ...prev]);

    // Simulate RAG Indexing complete in 3 seconds
    setTimeout(() => {
      setRegulations(prev => prev.map(d => d.id === newDoc.id ? {
        ...d,
        statusAr: "مفهرس ونشط",
        statusEn: "Indexed & Active"
      } : d));
    }, 3000);

    setNewRegTitleAr("");
    setNewRegTitleEn("");
    setNewRegContent("");
  };

  // Run Digital Twin Simulator
  const handleRunSimulation = async () => {
    setSimulationRunning(true);
    setSimulationResult(null);

    try {
      const response = await fetch("/api/intelligent-gov/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: simulationScenario })
      });
      const data = await response.json();
      setSimulationResult(data.simulation);
    } catch (e) {
      console.error("Simulation error", e);
    } finally {
      setSimulationRunning(false);
    }
  };

  // Resolve Data Conflict
  const handleResolveConflict = (id: string) => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, status: "resolved" } : c));
    setResolvedConflictsCount(prev => prev + 1);
  };

  // Unified Search trigger
  const handleUnifiedSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/intelligent-gov/unified-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, facet: searchFacet })
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (e) {
      console.error("Search error", e);
    } finally {
      setLoading(false);
    }
  };

  // Run Document OCR & Classification Simulation
  const handleRunOcr = async () => {
    setOcrRunning(true);
    setOcrText("");
    setExtractedEntities(null);
    setFraudAudit(null);

    try {
      const response = await fetch("/api/intelligent-gov/document-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: selectedPresetDoc })
      });
      const data = await response.json();
      setOcrText(data.ocrText);
      setExtractedEntities(data.extractedEntities);
      setFraudAudit(data.fraudAudit);
    } catch (e) {
      console.error("OCR error", e);
    } finally {
      setOcrRunning(false);
    }
  };

  // Add Innovation Idea
  const handleAddIdea = () => {
    if (!newIdeaTitleAr || !newIdeaDesc) return;
    const idea = {
      id: `idea-${Date.now()}`,
      titleAr: newIdeaTitleAr,
      titleEn: newIdeaTitleAr,
      authorAr: currentLanguage === "ar" ? "مقترح مواطن / مستثمر" : "Citizen / Investor Proposal",
      authorEn: "Citizen / Investor",
      status: "reviewing",
      score: 75
    };
    setInnovationIdeas(prev => [idea, ...prev]);
    setNewIdeaTitleAr("");
    setNewIdeaDesc("");
  };

  // Dynamic Sector data generator for charts
  const getChartDataForSector = () => {
    if (forecastSector === "gum-arabic") {
      return [
        { name: "2021", exportVolume: 42000, valueUsd: 110 },
        { name: "2022", exportVolume: 48000, valueUsd: 125 },
        { name: "2023", exportVolume: 39000, valueUsd: 95 },
        { name: "2024", exportVolume: 51000, valueUsd: 138 },
        { name: "2025", exportVolume: 58000, valueUsd: 154 },
        { name: "2026", exportVolume: 64000, valueUsd: 178 },
        { name: "2027 (AI)", exportVolume: 72000, valueUsd: 210 },
        { name: "2028 (AI)", exportVolume: 80000, valueUsd: 245 }
      ];
    } else if (forecastSector === "agriculture") {
      return [
        { name: "2021", exportVolume: 250000, valueUsd: 380 },
        { name: "2022", exportVolume: 280000, valueUsd: 410 },
        { name: "2023", exportVolume: 210000, valueUsd: 320 },
        { name: "2024", exportVolume: 290000, valueUsd: 450 },
        { name: "2025", exportVolume: 320000, valueUsd: 490 },
        { name: "2026", exportVolume: 350000, valueUsd: 530 },
        { name: "2027 (AI)", exportVolume: 390000, valueUsd: 610 },
        { name: "2028 (AI)", exportVolume: 440000, valueUsd: 680 }
      ];
    } else {
      return [
        { name: "2021", exportVolume: 12000, valueUsd: 55 },
        { name: "2022", exportVolume: 14000, valueUsd: 64 },
        { name: "2023", exportVolume: 11000, valueUsd: 48 },
        { name: "2024", exportVolume: 15500, valueUsd: 72 },
        { name: "2025", exportVolume: 18000, valueUsd: 85 },
        { name: "2026", exportVolume: 22000, valueUsd: 104 },
        { name: "2027 (AI)", exportVolume: 26000, valueUsd: 125 },
        { name: "2028 (AI)", exportVolume: 31000, valueUsd: 152 }
      ];
    }
  };

  // Tab Menu Navigation Definitions
  const tabs = [
    { id: "knowledge", labelAr: "المكتبة المعرفية و RAG", labelEn: "Knowledge & RAG", icon: BookOpen },
    { id: "ai-assistant", labelAr: "مساعد الذكاء الاصطناعي", labelEn: "Enterprise AI Copilots", icon: Brain },
    { id: "twin", labelAr: "التوأم الرقمي للوزارة", labelEn: "Ministry Digital Twin", icon: Cpu },
    { id: "governance", labelAr: "حوكمة البيانات والربط", labelEn: "Data Governance", icon: Database },
    { id: "search", labelAr: "البحث الفيدرالي الشامل", labelEn: "Unified Search", icon: Search },
    { id: "ocr", labelAr: "ذكاء المستندات والأرشفة", labelEn: "Document Intelligence", icon: FileSearch },
    { id: "analytics", labelAr: "التحليل والتحري التنبئي", labelEn: "Predictive Analytics", icon: BarChart3 },
    { id: "innovation", labelAr: "مركز الابتكار والطلائع", labelEn: "Innovation Hub", icon: Award },
    { id: "decision", labelAr: "مركز القرار التنفيذي", labelEn: "Executive Decision", icon: LayoutDashboard },
    { id: "future", labelAr: "جاهزية المستقبل السيادي", labelEn: "Future Readiness", icon: Scale }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200" id="intelligent-gov-portal">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sudan-green text-white rounded-2xl shadow-xs">
            <Brain className="w-8 h-8 text-sudan-gold animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-sudan-gold uppercase">SUDAN VISION 2035</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#1E293B]" style={{ fontFamily: "Cairo, sans-serif" }}>
              {currentLanguage === "ar" ? "المنصة الوطنية للذكاء الاصطناعي السيادي والحوكمة" : "National Sovereign AI & Governance Platform"}
            </h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {currentLanguage === "ar"
                ? "بوابة التحول الذكي الموحد، المكتبة التشريعية، التوأم الرقمي، وأرشفة المستندات السيادية لجمهورية السودان."
                : "Unified Smart Transformation Gateway, Legislative Library, Digital Twin, and Sovereign Document Archiving."}
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-700">{currentLanguage === "ar" ? "الأنظمة السيادية متصلة" : "Sovereign Nodes Active"}</span>
          </div>
          <div className="text-gray-400">|</div>
          <div className="text-sudan-gold font-mono text-xs">RAG VER: 2.5</div>
        </div>
      </div>

      {/* Grid Layout for Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Submodule Left Sidebar Menu */}
        <div className="lg:col-span-1 flex flex-col gap-1 border-r border-slate-100 pr-0 lg:pr-4">
          <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider mb-2 px-2">
            {currentLanguage === "ar" ? "الوحدات الرقمية العشر" : "The 10 Digital Modules"}
          </h3>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${
                  isActive
                    ? "bg-sudan-green text-white shadow-xs font-black"
                    : "text-gray-600 hover:text-sudan-green hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-sudan-gold" : "text-gray-400"}`} />
                <span className="truncate">{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}

          {/* Quick RAG Indexing Indicator */}
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Activity className="w-4 h-4 text-sudan-green" />
              <span className="text-[11px] font-bold text-slate-700">{currentLanguage === "ar" ? "أداء الـ RAG والمؤشرات" : "RAG & Vector Performance"}</span>
            </div>
            <div className="space-y-1.5 font-semibold text-[10px] text-gray-500">
              <div className="flex justify-between">
                <span>{currentLanguage === "ar" ? "إجمالي المتجهات مفهرسة" : "Total Vector Chunks"}</span>
                <span className="font-mono text-slate-900">4,821,902</span>
              </div>
              <div className="flex justify-between">
                <span>{currentLanguage === "ar" ? "دقة الاسترجاع الدلالي" : "Retrieval Accuracy"}</span>
                <span className="font-mono text-emerald-600">98.6%</span>
              </div>
              <div className="flex justify-between">
                <span>{currentLanguage === "ar" ? "زمن استجابة الاستعلام" : "Retrieval Latency"}</span>
                <span className="font-mono text-slate-900">32ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab content panel */}
        <div className="lg:col-span-3 bg-slate-50/50 rounded-2xl p-4 md:p-6 border border-slate-100 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              
              {/* MODULE 1: National Knowledge Platform */}
              {activeTab === "knowledge" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "منصة المعرفة واللوائح والبحث الدلالي (RAG)" : "Sovereign Legislative Knowledge & RAG Platform"}
                    </h3>
                    <span className="text-[11px] bg-sudan-green/10 text-sudan-green font-bold px-2.5 py-1 rounded-lg">
                      {currentLanguage === "ar" ? "مؤرشف بالكامل" : "Fully Indexed"}
                    </span>
                  </div>

                  {/* Knowledge Base regulations list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regulations.map(reg => (
                      <div key={reg.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sudan-green transition-all shadow-2xs">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-sudan-gold uppercase bg-amber-50 px-2 py-0.5 rounded-sm">
                            {currentLanguage === "ar" ? reg.categoryAr : reg.categoryEn}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {reg.lastUpdated}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 mb-2">
                          {currentLanguage === "ar" ? reg.titleAr : reg.titleEn}
                        </h4>
                        <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 pt-2 border-t border-slate-50">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            {currentLanguage === "ar" ? `${reg.chunks} مقطع فيكتوري` : `${reg.chunks} Vector Chunks`}
                          </span>
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {currentLanguage === "ar" ? reg.statusAr : reg.statusEn}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Document Ingestion & RAG Indexing Form */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-sudan-green" />
                      {currentLanguage === "ar" ? "فهرسة وتوطين لوائح جديدة في قاعدة بيانات RAG السيادية" : "Ingest & Index New Legislation into Sovereign RAG Store"}
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newRegTitleAr}
                          onChange={(e) => setNewRegTitleAr(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "عنوان اللائحة/القانون (باللغة العربية)..." : "Regulation Title (Arabic)..."}
                          className="bg-slate-50 text-xs font-bold p-2.5 rounded-lg border border-slate-200 outline-none focus:bg-white focus:border-sudan-green transition-all"
                        />
                        <input
                          type="text"
                          value={newRegTitleEn}
                          onChange={(e) => setNewRegTitleEn(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "عنوان اللائحة/القانون (باللغة الإنجليزية)..." : "Regulation Title (English)..."}
                          className="bg-slate-50 text-xs font-bold p-2.5 rounded-lg border border-slate-200 outline-none focus:bg-white focus:border-sudan-green transition-all"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={newRegContent}
                        onChange={(e) => setNewRegContent(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "نص اللائحة أو الفقرة القانونية المراد معالجتها وتقطيعها فيكتورياً..." : "Full legislative content or paragraph to process & vectorize..."}
                        className="w-full bg-slate-50 text-xs font-bold p-2.5 rounded-lg border border-slate-200 outline-none focus:bg-white focus:border-sudan-green transition-all"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={handleIndexDocument}
                          disabled={!newRegTitleAr || !newRegContent}
                          className="bg-sudan-green hover:bg-sudan-green-light text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "فهرسة وتقطيع فيكتوري فوري" : "Index & Partition Vector Immediately"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 2: Enterprise AI Platform (Copilots) */}
              {activeTab === "ai-assistant" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مساعد الذكاء الاصطناعي السيادي والرواد الذكي" : "Sovereign Enterprise AI Platform & Copilots"}
                    </h3>

                    {/* Prebuilt AI Quick Action Operations */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <button
                        onClick={() => handleQuickAiAction("summarize")}
                        className="bg-white hover:bg-slate-50 text-[#1E293B] border border-slate-200 hover:border-sudan-green p-3 rounded-xl text-right transition-all flex items-start gap-2.5 cursor-pointer"
                      >
                        <FileText className="w-5 h-5 text-sudan-gold shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black">{currentLanguage === "ar" ? "تلخيص اللوائح التجارية" : "Summarize Regulations"}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{currentLanguage === "ar" ? "تخليص تشريعي دلالي للشركات" : "Semantic legal summarizing"}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuickAiAction("translate")}
                        className="bg-white hover:bg-slate-50 text-[#1E293B] border border-slate-200 hover:border-sudan-green p-3 rounded-xl text-right transition-all flex items-start gap-2.5 cursor-pointer"
                      >
                        <Compass className="w-5 h-5 text-sudan-green shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black">{currentLanguage === "ar" ? "الترجمة التشريعية الذكية" : "AI Legal Translation"}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{currentLanguage === "ar" ? "بين العربية والإنجليزية بدقة" : "Strict Arabic/English translation"}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuickAiAction("report")}
                        className="bg-white hover:bg-slate-50 text-[#1E293B] border border-slate-200 hover:border-sudan-green p-3 rounded-xl text-right transition-all flex items-start gap-2.5 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black">{currentLanguage === "ar" ? "مولد التقارير التنفيذية" : "Executive Report Generator"}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{currentLanguage === "ar" ? "صياغة مذكرات دعم القرار تلقائياً" : "Auto-generate decision memos"}</p>
                        </div>
                      </button>
                    </div>

                    {/* Chat Log Panel */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 h-[250px] overflow-y-auto space-y-3 font-semibold text-xs leading-relaxed">
                      {chatLog.map((log, index) => (
                        <div
                          key={index}
                          className={`flex gap-2.5 max-w-[85%] ${log.sender === "user" ? "mr-auto flex-row-reverse text-left" : "ml-auto"}`}
                        >
                          <div className={`p-2.5 rounded-2xl ${log.sender === "user" ? "bg-sudan-green text-white" : "bg-slate-100 text-slate-800"}`}>
                            {log.text}
                            {log.sources && log.sources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-300/40 text-[9px] font-mono text-sudan-gold flex flex-wrap gap-1">
                                <span className="text-gray-400">{currentLanguage === "ar" ? "المراجع المستندة:" : "Retrieved Sources:"}</span>
                                {log.sources.map((s, si) => <span key={si} className="bg-slate-200 px-1 rounded-sm text-slate-700">{s}</span>)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Input form */}
                  <div className="flex gap-2.5 mt-3 pt-3 border-t border-slate-100">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                      placeholder={currentLanguage === "ar" ? "اسأل المساعد الذكي عن أي إجراء أو قانون أو استشارة..." : "Ask the AI copilot anything..."}
                      className="flex-1 bg-white border border-slate-200 hover:border-sudan-green outline-none px-4 py-3 rounded-xl text-xs font-black transition-all"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={loading || !message.trim()}
                      className="bg-sudan-green hover:bg-sudan-green-light text-white p-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin text-sudan-gold" /> : <Send className="w-5 h-5 text-sudan-gold" />}
                    </button>
                  </div>
                </div>
              )}

              {/* MODULE 3: Digital Twin of the Ministry */}
              {activeTab === "twin" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "التوأم الرقمي ومحاكاة سلاسل العمليات الفيدرالية" : "Ministry Digital Twin & Workflow Simulator"}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-ping" />
                      {currentLanguage === "ar" ? "مباشر من الخادم" : "Live Ingress"}
                    </span>
                  </div>

                  {/* Operational Metrics Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "المعاملات النشطة" : "Active Txn / min"}</div>
                      <div className="text-lg font-black text-slate-800 font-mono mt-1">{twinMetrics.activeUsers}</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "طلبات بوابة الـ API" : "API Gateway Req"}</div>
                      <div className="text-lg font-black text-slate-800 font-mono mt-1">{twinMetrics.apiRequests}/s</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "زمن استجابة الشبكة" : "Network Latency"}</div>
                      <div className="text-lg font-black text-emerald-600 font-mono mt-1">{twinMetrics.avgResponseTime}ms</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "ضغط الخوادم المركزية" : "Host CPU Load"}</div>
                      <div className="text-lg font-black text-slate-800 font-mono mt-1">{twinMetrics.cpuUsage}%</div>
                    </div>
                  </div>

                  {/* Flow Simulation Control Panel */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-sudan-green" />
                      {currentLanguage === "ar" ? "مختبر محاكاة الضغط وتأثير الكوارث السيادية" : "Sovereign Stress Testing & Disaster Impact Simulator"}
                    </h4>
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">{currentLanguage === "ar" ? "اختر سيناريو المحاكاة الفيدرالية:" : "Select National Stress Scenario:"}</label>
                        <select
                          value={simulationScenario}
                          onChange={(e) => setSimulationScenario(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold outline-none"
                        >
                          <option value="season-peak">{currentLanguage === "ar" ? "موسم حصاد وتصدير الصمغ العربي (ارتفاع 500% في طلبات الرخص)" : "Gum Arabic Export Season Peak (+500% License Load)"}</option>
                          <option value="api-outage">{currentLanguage === "ar" ? "انقطاع مفاجئ في ربط بوابة الجمارك والتحقق المدني" : "Sudan Customs Gateway Sudden Outage"}</option>
                          <option value="cyber-attack">{currentLanguage === "ar" ? "هجوم حجب الخدمة الموزع DDOS على خوادم الاستعلام" : "Distributed DDOS Attack on Query Nodes"}</option>
                        </select>
                      </div>
                      <button
                        onClick={handleRunSimulation}
                        disabled={simulationRunning}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {simulationRunning ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-sudan-gold" />
                        ) : (
                          <Play className="w-4 h-4 text-sudan-gold" />
                        )}
                        {currentLanguage === "ar" ? "تشغيل محاكاة التوأم الرقمي" : "Run Digital Twin Simulation"}
                      </button>
                    </div>

                    {/* Simulation Output Area */}
                    {simulationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                      >
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                          <span className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "تقرير تأثير المحاكاة السيادي:" : "Sovereign Simulation Impact Memo:"}</span>
                          <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm font-black uppercase text-[9px]">{simulationScenario}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed">
                          <div className="space-y-1.5 font-bold">
                            <p className="text-gray-500">
                              {currentLanguage === "ar" ? "مستوى الخطر المتوقع:" : "Expected Danger Level:"}{" "}
                              <span className={simulationResult.riskLevel === "critical" ? "text-red-600" : "text-amber-600"}>{simulationResult.riskLevel.toUpperCase()}</span>
                            </p>
                            <p className="text-gray-500">
                              {currentLanguage === "ar" ? "زمن الاستجابة التقديري:" : "Estimated Latency during Spike:"}{" "}
                              <span className="text-slate-900 font-mono">{simulationResult.latencyImpactMs}ms</span>
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700">
                            <p className="font-bold text-sudan-green mb-1 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-sudan-gold" />
                              {currentLanguage === "ar" ? "توصيات تحسين الأداء التلقائية (AI):" : "AI Recommended Tuning Action:"}
                            </p>
                            <p>{currentLanguage === "ar" ? simulationResult.recommendationAr : simulationResult.recommendationEn}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* MODULE 4: National Data Governance */}
              {activeTab === "governance" && (
                <div className="space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-sudan-green" />
                    {currentLanguage === "ar" ? "منصة حوكمة البيانات الموحدة وكتالوج البيانات" : "National Data Governance & Master Data Catalog"}
                  </h3>

                  {/* Catalog Datasets */}
                  <div className="space-y-3">
                    {DATA_CATALOG.map(catalog => (
                      <div key={catalog.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs hover:border-sudan-green transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-black text-slate-800">
                            {currentLanguage === "ar" ? catalog.nameAr : catalog.nameEn}
                          </h4>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                            {currentLanguage === "ar" ? catalog.ownerAr : catalog.ownerEn}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-bold text-gray-500 pt-3 border-t border-slate-50">
                          <div>
                            <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "درجة جودة البيانات" : "Data Quality Score"}</span>
                            <span className="text-emerald-600 font-mono">{catalog.qualityScore}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "عدد السجلات الموثقة" : "Records Count"}</span>
                            <span className="text-slate-900 font-mono">{catalog.recordsCount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "تحديث التزامن" : "Sync Frequency"}</span>
                            <span className="text-slate-800">{currentLanguage === "ar" ? catalog.syncStatusAr : catalog.syncStatusEn}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "سلسلة التدفق" : "Lineage Connection"}</span>
                            <span className="text-slate-500 truncate block max-w-full" title={currentLanguage === "ar" ? catalog.lineageAr : catalog.lineageEn}>
                              {currentLanguage === "ar" ? catalog.lineageAr : catalog.lineageEn}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Conflict Resolution Section */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-sudan-green animate-bounce" />
                      {currentLanguage === "ar" ? "مراقب جودة البيانات الفوري وحل النزاعات" : "Real-Time Data Quality Conflict Resolver"}
                    </h4>
                    {conflicts.map(conf => (
                      <div key={conf.id} className="p-4 bg-rose-50/50 rounded-lg border border-rose-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="space-y-1 text-xs">
                          <p className="font-black text-slate-800 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                            {currentLanguage === "ar" ? "تضارب بيانات الكيان:" : "Data Out-of-Sync Conflict:"} {conf.companyNameAr}
                          </p>
                          <div className="font-semibold text-gray-500 space-y-0.5 pl-3 mt-1.5">
                            <p>{currentLanguage === "ar" ? "الحقل المتاثر:" : "Affected Field:"} <span className="text-slate-900 font-bold">{conf.sourceField}</span></p>
                            <p className="flex items-center gap-1">
                              <span className="text-emerald-700 bg-emerald-50 px-1 rounded-sm">
                                {currentLanguage === "ar" ? "قيمة السجل التجاري:" : "Registry Value:"} {conf.registryValue}
                              </span>
                              <span className="text-gray-400">➔</span>
                              <span className="text-rose-700 bg-rose-50 px-1 rounded-sm">
                                {currentLanguage === "ar" ? "قيمة الضرائب:" : "Tax Value:"} {conf.taxAuthorityValue}
                              </span>
                            </p>
                          </div>
                        </div>
                        {conf.status === "pending" ? (
                          <button
                            onClick={() => handleResolveConflict(conf.id)}
                            className="bg-sudan-green hover:bg-sudan-green-light text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            {currentLanguage === "ar" ? "تسوية النزاع الفوري (اعتماد السجل)" : "Enforce Registry Master Record"}
                          </button>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-[11px] font-black flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {currentLanguage === "ar" ? "تمت التسوية بنجاح" : "Conflict Resolved"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE 5: Enterprise Search */}
              {activeTab === "search" && (
                <div className="space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Search className="w-5 h-5 text-sudan-green" />
                    {currentLanguage === "ar" ? "محرك البحث الفيدرالي والذكاء الدلالي الموحد" : "Unified Federated Search & Semantic Query Hub"}
                  </h3>

                  {/* Search controls */}
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "ابحث بالرقم الوطني، الرقم الضريبي، اسم الشركة، رقم الترخيص أو باللغة الطبيعية..." : "Search by ID, Company Name, License or natural query..."}
                        className="flex-1 bg-white border border-slate-200 hover:border-sudan-green px-4 py-3 rounded-xl text-xs font-black outline-none"
                      />
                      <button
                        onClick={handleUnifiedSearch}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <SearchCode className="w-4 h-4 text-sudan-gold" />
                        {currentLanguage === "ar" ? "بحث ذكي سيادي" : "Semantic Search"}
                      </button>
                    </div>

                    {/* Facet Filters */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "all", labelAr: "الكل", labelEn: "All Entities" },
                        { id: "company", labelAr: "الشركات السجلات", labelEn: "Companies" },
                        { id: "factory", labelAr: "المصانع والتراخيص", labelEn: "Factories" },
                        { id: "license", labelAr: "التراخيص الجمركية", labelEn: "Licenses" },
                        { id: "complaint", labelAr: "الشكاوى الرقابية", labelEn: "Complaints" }
                      ].map(facet => (
                        <button
                          key={facet.id}
                          onClick={() => setSearchFacet(facet.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                            searchFacet === facet.id
                              ? "bg-sudan-green text-white border-transparent"
                              : "bg-white text-gray-500 hover:bg-slate-50 border-slate-200"
                          }`}
                        >
                          {currentLanguage === "ar" ? facet.labelAr : facet.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="space-y-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((result: any, index: number) => (
                        <div key={index} className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-sudan-green transition-all shadow-3xs flex justify-between items-center gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-sudan-gold bg-amber-50 px-2 py-0.5 rounded-sm">
                              {result.type.toUpperCase()}
                            </span>
                            <h4 className="text-xs font-black text-slate-800">
                              {currentLanguage === "ar" ? result.nameAr : result.nameEn}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-semibold">
                              {currentLanguage === "ar" ? "النشاط/الموقع:" : "Activity/State:"} {result.stateAr} | {result.activityAr}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-xs text-slate-900 font-black">{result.number}</span>
                          </div>
                        </div>
                      ))
                    ) : searchQuery ? (
                      <div className="text-center py-6 text-gray-400 font-bold text-xs">
                        {currentLanguage === "ar" ? "لا توجد نتائج بحث مطابقة. يرجى تعديل الكلمات الدلالية." : "No matching results found. Adjust terms."}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-6 border border-slate-100 text-center text-gray-400 font-semibold text-xs space-y-2">
                        <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                        <p>{currentLanguage === "ar" ? "ابدأ بإدخال كلمة البحث للوصول الفوري إلى البيانات السيادية" : "Type above to perform federated index lookup"}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODULE 6: National Document Intelligence */}
              {activeTab === "ocr" && (
                <div className="space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-sudan-green" />
                    {currentLanguage === "ar" ? "منصة ذكاء المستندات الوطني والاستخراج والـ OCR" : "Sovereign Document Intelligence & OCR Extraction"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* OCR Input Selection */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">{currentLanguage === "ar" ? "اختر المستند النموذجي للتحليل:" : "Select Template Document to Extract:"}</label>
                        <select
                          value={selectedPresetDoc}
                          onChange={(e) => setSelectedPresetDoc(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold outline-none"
                        >
                          <option value="preset-cr">{currentLanguage === "ar" ? "شهادة سجل تجاري (شركة النيل المحدودة)" : "Commercial Registry Certificate (Nile Food)"}</option>
                          <option value="preset-coo">{currentLanguage === "ar" ? "شهادة منشأ الكوميسا التصديرية" : "COMESA Certificate of Origin"}</option>
                          <option value="preset-id">{currentLanguage === "ar" ? "رخصة مصنع غزل ونسيج فيدرالي" : "Federal Textile Factory License"}</option>
                        </select>
                      </div>

                      <div className="border-2 border-dashed border-slate-200 hover:border-sudan-green p-6 rounded-xl text-center text-gray-500 font-semibold text-xs space-y-2 transition-all cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p>{currentLanguage === "ar" ? "اسحب الملفات هنا أو انقر لتحميل المستند القانوني" : "Drag & drop legal papers or browse"}</p>
                        <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "دعم صيغ PDF, PNG, JPG (مطابقة للغة العربية والإنجليزية)" : "Supports PDF, PNG, JPG (Dual Ar/En)"}</span>
                      </div>

                      <button
                        onClick={handleRunOcr}
                        disabled={ocrRunning}
                        className="w-full bg-sudan-green hover:bg-sudan-green-light text-white py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {ocrRunning ? <RefreshCw className="w-4 h-4 animate-spin text-sudan-gold" /> : <FileCheck className="w-4 h-4 text-sudan-gold" />}
                        {currentLanguage === "ar" ? "استخراج البيانات والتدقيق الأمني" : "Extract Data & Verify Integrity"}
                      </button>
                    </div>

                    {/* OCR Output Analysis */}
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-gray-400 text-[10px] uppercase font-black">{currentLanguage === "ar" ? "الاستخراج والتدقيق" : "OCR Output & Analysis"}</span>
                        <span className="text-emerald-500 text-[10px] font-bold">● ONLINE</span>
                      </div>

                      {ocrText ? (
                        <div className="space-y-4 font-mono text-[11px]">
                          <div className="bg-black/40 p-2.5 rounded-lg text-emerald-400 leading-relaxed max-h-[100px] overflow-y-auto">
                            <p className="font-sans font-bold text-[10px] text-gray-400 mb-1">{currentLanguage === "ar" ? "النص الخام المكتشف (Arabic OCR):" : "Raw Text Recovered:"}</p>
                            {ocrText}
                          </div>

                          {extractedEntities && (
                            <div className="space-y-1 font-sans font-bold text-[11px]">
                              <p className="text-gray-400 text-[10px] mb-1">{currentLanguage === "ar" ? "البيانات المستخلصة تلقائياً:" : "Extracted Entity Attributes:"}</p>
                              {Object.entries(extractedEntities).map(([key, value]: any) => (
                                <div key={key} className="flex justify-between border-b border-slate-800/60 py-1">
                                  <span className="text-gray-400">{key}:</span>
                                  <span className="text-white">{value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {fraudAudit && (
                            <div className="p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-900/40 flex justify-between items-center gap-4">
                              <span className="text-emerald-400 font-sans font-extrabold">{currentLanguage === "ar" ? "مؤشر التزوير والتحقق السيادي:" : "Sovereign Authenticity Check:"}</span>
                              <span className="text-emerald-400 font-black">{fraudAudit.status.toUpperCase()} ({fraudAudit.confidence}% PASS)</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-600 font-semibold">
                          {ocrRunning ? (
                            <div className="space-y-2">
                              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sudan-green" />
                              <p>{currentLanguage === "ar" ? "جاري معالجة المستند واستخلاص المحتوى..." : "Processing OCR extraction..."}</p>
                            </div>
                          ) : (
                            currentLanguage === "ar" ? "انتظار تفعيل المعالج..." : "Waiting for processor to execute..."
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 7: National Predictive Analytics */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "التحليل الاقتصادي والتنبؤ السيادي بمعدلات التجارة" : "Sovereign Predictive Economic Analytics & Forecaster"}
                    </h3>

                    {/* Sector switcher */}
                    <div className="flex gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-bold">
                      <button
                        onClick={() => setForecastSector("gum-arabic")}
                        className={`px-3 py-1 rounded-lg transition-all ${forecastSector === "gum-arabic" ? "bg-sudan-green text-white" : "text-gray-500"}`}
                      >
                        {currentLanguage === "ar" ? "الصمغ العربي" : "Gum Arabic"}
                      </button>
                      <button
                        onClick={() => setForecastSector("agriculture")}
                        className={`px-3 py-1 rounded-lg transition-all ${forecastSector === "agriculture" ? "bg-sudan-green text-white" : "text-gray-500"}`}
                      >
                        {currentLanguage === "ar" ? "المحاصيل الزراعية" : "Agricultural Crops"}
                      </button>
                      <button
                        onClick={() => setForecastSector("industrial")}
                        className={`px-3 py-1 rounded-lg transition-all ${forecastSector === "industrial" ? "bg-sudan-green text-white" : "text-gray-500"}`}
                      >
                        {currentLanguage === "ar" ? "الإنتاج الصناعي" : "Industrial Goods"}
                      </button>
                    </div>
                  </div>

                  {/* Chart representation */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black text-slate-800">
                        {currentLanguage === "ar" ? "نموذج نمو التصدير التنبئي (2021 - 2028)" : "Sovereign Predictive Growth Modeling (2021 - 2028)"}
                      </span>
                      <span className="text-[10px] font-bold text-sudan-gold font-mono uppercase bg-amber-50 px-2 py-0.5 rounded-sm">
                        {currentLanguage === "ar" ? "نموذج الذكاء الاصطناعي التنبئي" : "AI Trend Modeling Enabled"}
                      </span>
                    </div>

                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getChartDataForSector()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#007229" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#007229" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="valueUsd" stroke="#007229" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" name={currentLanguage === "ar" ? "القيمة التصديرية (مليون دولار)" : "Export Value (Million USD)"} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Operational Recommendations Card */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-sudan-green shrink-0 mt-0.5" />
                    <div className="text-xs font-semibold text-emerald-800 leading-relaxed">
                      <p className="font-extrabold text-[13px] text-sudan-green mb-1">
                        {currentLanguage === "ar" ? "رؤى استباقية وتوقعات اقتصادية سيادية لعام ٢٠٢٧:" : "Proactive Economic Forecasting Insights for 2027:"}
                      </p>
                      <p>
                        {currentLanguage === "ar"
                          ? "استناداً إلى نمذجة حركة الشحن والربط الفيدرالي بالتعاون مع بنك السودان ومصلحة الجمارك، تشير توقعاتنا إلى نمو مطرد في الطلب الإقليمي لمنطقة الكوميسا بنسبة تقارب ٢٤.٢٪، مما يتطلب زيادة المخصصات والمخططات الجمركية الفورية للمصدرين المؤهلين في مدينتي بورتسودان والجزيرة."
                          : "Based on supply chain simulations, a projected growth of 24.2% inside the COMESA trade zone is expected for 2027. We recommend expanding the digital tariff exemptions immediately for high-yield exporters in Port Sudan and Al-Jazirah."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 8: National Innovation Center */}
              {activeTab === "innovation" && (
                <div className="space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-sudan-green" />
                    {currentLanguage === "ar" ? "المنصة الوطنية للابتكار وبراءات الاختراع الرقمية" : "National Innovation Center & Patents Registry"}
                  </h3>

                  {/* Innovations Portfolio */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {innovationIdeas.map(idea => (
                      <div key={idea.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sudan-green transition-all shadow-3xs flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-sudan-gold bg-amber-50 px-2 py-0.5 rounded-sm">
                            {idea.status.toUpperCase()}
                          </span>
                          <h4 className="text-xs font-black text-slate-800">
                            {currentLanguage === "ar" ? idea.titleAr : idea.titleEn}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-semibold">
                            {currentLanguage === "ar" ? "بواسطة:" : "By:"} {currentLanguage === "ar" ? idea.authorAr : idea.authorEn}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-sudan-green font-mono">{idea.score}%</span>
                          <p className="text-[8px] text-gray-400 mt-0.5">{currentLanguage === "ar" ? "تقييم الجدوى" : "Feasibility"}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestion Form */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sudan-green" />
                      {currentLanguage === "ar" ? "تقديم مقترح مشروع أو ابتكار تكنولوجي سيادي" : "Submit a Sovereign Innovation Project/Patent Proposal"}
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newIdeaTitleAr}
                        onChange={(e) => setNewIdeaTitleAr(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "عنوان المقترح أو براءة الاختراع المبتكرة..." : "Innovation proposal or patent title..."}
                        className="w-full bg-slate-50 text-xs font-bold p-2.5 rounded-lg border border-slate-200 outline-none focus:bg-white focus:border-sudan-green transition-all"
                      />
                      <textarea
                        rows={3}
                        value={newIdeaDesc}
                        onChange={(e) => setNewIdeaDesc(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "شرح وافٍ عن فكرة المشروع والجدوى الاقتصادية والتقنية لتحقيق التحول الرقمي..." : "Elaborate your concept, tech stack, and economic feasibility study..."}
                        className="w-full bg-slate-50 text-xs font-bold p-2.5 rounded-lg border border-slate-200 outline-none focus:bg-white focus:border-sudan-green transition-all"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddIdea}
                          disabled={!newIdeaTitleAr || !newIdeaDesc}
                          className="bg-sudan-green hover:bg-sudan-green-light text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "إرسال إلى لجنة التحكيم الفيدرالية" : "Submit to Federal Innovation Council"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 9: Smart Decision Center */}
              {activeTab === "decision" && (
                <div className="space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-sudan-green" />
                    {currentLanguage === "ar" ? "لوحة القيادة السيادية ومركز القرار التنفيذي" : "Sovereign Executive Decision Command Center"}
                  </h3>

                  {/* Strategic KPI Progress */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                    <span className="text-xs font-black text-slate-800 block">
                      {currentLanguage === "ar" ? "أهداف التحول الاستراتيجي الرقمي (أهداف 2035)" : "Strategic Digital Transformation Targets Progress (Towards 2035)"}
                    </span>
                    <div className="space-y-3 font-semibold text-xs text-gray-500">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "ربط الجهات الفيدرالية والمؤسسات التابعة" : "Interoperable Federal Node Integration"}</span>
                          <span className="font-mono text-slate-800">88% (88 / 100 Entities)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-sudan-green h-full" style={{ width: "88%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "الامتثال للحوكمة السيادية والأرشفة الوطنية" : "GRC Sovereign Audit & Archive Digitization"}</span>
                          <span className="font-mono text-slate-800">92%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-sudan-green h-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "تأمين وحماية الهوية والمصادقة المزدوجة" : "Sovereign Identity Verification Coverage"}</span>
                          <span className="font-mono text-slate-800">75%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-sudan-green h-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cabinet Reports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-sudan-green" />
                        {currentLanguage === "ar" ? "التقارير والمذكرات الوزارية المعتمدة" : "Approved Cabinet Briefings & Memos"}
                      </h4>
                      <div className="space-y-2 font-semibold text-[11px] text-gray-600">
                        <p className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer">
                          📄 {currentLanguage === "ar" ? "مذكرة الأمن الغذائي وتسهيل إجراءات مصانع الصوامع والزيوت" : "Food Security Facilitation & Sieve Mills Licensing Briefing"}
                        </p>
                        <p className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer">
                          📄 {currentLanguage === "ar" ? "تقرير تدفق النقد والاستثمارات الكوميسية الخليجية للربع الثاني" : "Q2 GCC & COMESA Trade & Foreign Ingress Liquidity Report"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-sudan-green" />
                        {currentLanguage === "ar" ? "الرصد البيئي السيادي وتحليل الحوكمة الذكي" : "GRC Smart Policy Audit Logs"}
                      </h4>
                      <div className="space-y-1 text-[11px] font-mono text-gray-500">
                        <p>✓ [14:02:11] Policy GRC Audit passed for Nile Foods.</p>
                        <p>✓ [13:18:42] Ledger Block 148202 verified with Zero Trust signature.</p>
                        <p>✓ [11:50:29] Civil Registry master records synced with 0 failures.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 10: National Future Readiness */}
              {activeTab === "future" && (
                <div className="space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-sudan-green" />
                    {currentLanguage === "ar" ? "جاهزية المستقبل السيادي والتقنيات الفيدرالية الناشئة" : "Sovereign Future Tech Readiness & Standard Compliance"}
                  </h3>

                  {/* Future Tech Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                      <span className="text-xs font-black text-slate-800 block">
                        {currentLanguage === "ar" ? "مدى الامتثال لمعايير التقنيات الناشئة" : "Emerging Technology Standards Checklist"}
                      </span>
                      <div className="space-y-3 font-semibold text-xs text-slate-700">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                            {currentLanguage === "ar" ? "جاهزية البلوكشين (سلاسل التتبع)" : "Blockchain & Ledger Trackers"}
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">100% READY</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                            {currentLanguage === "ar" ? "مستشعرات إنترنت الأشياء والإنفاذ" : "IoT Edge Nodes & Telemetry"}
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">90% ACTIVE</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                            {currentLanguage === "ar" ? "بروتوكولات الأمان والحماية الكمية" : "Post-Quantum Cryptography Audit"}
                          </span>
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-sm">70% PROTOTYPED</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                            {currentLanguage === "ar" ? "حوكمة خوارزميات الذكاء الاصطناعي" : "Ethical AI Governance Sandbox"}
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">95% READY</span>
                        </div>
                      </div>
                    </div>

                    {/* Ledger Block inspector simulation */}
                    <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-gray-400 text-[10px]">{currentLanguage === "ar" ? "مراقب كتل البلوكشين السيادي" : "Sovereign Blockchain Block Ledger"}</span>
                        <span className="text-emerald-500 text-[10px] animate-pulse">● SYNCED</span>
                      </div>
                      <div className="space-y-2 font-mono text-[10px] text-gray-300">
                        <p className="border-b border-slate-800/60 pb-1.5">
                          <span className="text-sudan-gold font-bold">BLOCK #148202</span> - Syncing Certificate SD-ORIG-2026-10492 to COMESA customs hub. Confirmed by 4 validator nodes.
                        </p>
                        <p className="border-b border-slate-800/60 pb-1.5">
                          <span className="text-sudan-gold font-bold">BLOCK #148201</span> - Verified Digital Signature for Nile Foods Incorporation payload. Gas price: 0.00 Gwei (Sovereign Network).
                        </p>
                        <p>
                          <span className="text-sudan-gold font-bold">BLOCK #148200</span> - Registered Land Application Area: 15,000sqm under Investor Sheikh Fahad Al-Saud.
                        </p>
                      </div>
                    </div>
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
