import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Landmark, Shield, Brain, Activity, ShieldAlert, 
  Scale, Layers, Lightbulb, Network, Search, RefreshCw, 
  Plus, CheckCircle, AlertTriangle, Clock, ArrowRight, 
  QrCode, FileText, Send, TrendingUp, Sparkles, UserCheck, 
  CheckSquare, Coins, UserCircle, Download, FileSignature, 
  Database, Server, Cpu, Play, Trash2, HelpCircle, AlertOctagon, 
  Check, FileCode, Users, ChevronRight, Globe
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell 
} from "recharts";

interface NationalDigitalEconomicPlatformProps {
  currentLanguage: "ar" | "en";
  role?: string;
}

export default function NationalDigitalEconomicPlatform({ currentLanguage, role }: NationalDigitalEconomicPlatformProps) {
  const [activeModuleTab, setActiveModuleTab] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Sovereign Trust PKI Issued SHA-256 stamp for Ministry of Trade Node.",
    "GRC Compliance score auto-calculated: 97.4%",
    "Unified Government Service Catalog synchronized with COMESA."
  ]);

  // MODULE 1: National Government Platform Center states
  const [ministries, setMinistries] = useState<any[]>([
    { id: "m-1", nameAr: "وزارة التجارة والصناعة", nameEn: "Ministry of Commerce & Industry", code: "MCI", servicesCount: 24, status: "Active" },
    { id: "m-2", nameAr: "وزارة الاستثمار والتعاون الدولي", nameEn: "Ministry of Investment", code: "MOI", servicesCount: 15, status: "Active" },
    { id: "m-3", nameAr: "وزارة المالية والتخطيط الاقتصادي", nameEn: "Ministry of Finance", code: "MOF", servicesCount: 32, status: "Active" },
    { id: "m-4", nameAr: "سلطة الجمارك السودانية", nameEn: "Sudanese Customs Authority", code: "SCA", servicesCount: 18, status: "Active" }
  ]);
  const [serviceCatalog, setServiceCatalog] = useState<any[]>([
    { id: "srv-1", nameAr: "طلب رخصة استيراد وتصدير ذكية", nameEn: "Smart Import/Export License", dept: "MCI", type: "G2B", fee: "50,000 SDG" },
    { id: "srv-2", nameAr: "تسجيل السجل التجاري الرقمي", nameEn: "Commercial Registry Registration", dept: "MCI", type: "G2B", fee: "120,000 SDG" },
    { id: "srv-3", nameAr: "طلب تخصيص أرض صناعية", nameEn: "Industrial Land Allocation", dept: "MOI", type: "G2B", fee: "250,000 SDG" },
    { id: "srv-4", nameAr: "تفريغ جمركي ذكي عبر نافذة واحدة", nameEn: "Single-Window Customs Clearance", dept: "SCA", type: "G2B", fee: "80,000 SDG" }
  ]);
  const [routingStep, setRoutingStep] = useState<number>(0);
  const [selectedRoutingService, setSelectedRoutingService] = useState<string>("srv-1");

  // MODULE 2: AI Governance States
  const [aiModels, setAiModels] = useState<any[]>([
    { id: "aim-1", name: "Sovereign-Trade-Predictor-v2", type: "Regression", status: "Active", compliance: "Passed", version: "2.1.0", latency: "14ms" },
    { id: "aim-2", name: "Nile-Arabic-Llama-7B-MCI", type: "LLM-FineTuned", status: "Active", compliance: "Passed", version: "1.0.4", latency: "42ms" },
    { id: "aim-3", name: "Customs-Anomalies-Detector", type: "AnomalyDetection", status: "Testing", compliance: "Auditing", version: "0.8.2", latency: "8ms" }
  ]);
  const [newModelForm, setNewModelForm] = useState({ name: "", type: "LLM-FineTuned", version: "1.0.0" });
  const [explainableInput, setExplainableInput] = useState("");
  const [explainableOutput, setExplainableOutput] = useState("");
  const [aiRiskFactor, setAiRiskFactor] = useState<number>(12.4);

  // MODULE 3: Digital Operations States
  const [opsMetrics, setOpsMetrics] = useState<any[]>([
    { time: "09:00", cpu: 45, memory: 58, dbIops: 120, apiLatency: 15 },
    { time: "10:00", cpu: 52, memory: 61, dbIops: 145, apiLatency: 18 },
    { time: "11:00", cpu: 68, memory: 70, dbIops: 210, apiLatency: 22 },
    { time: "12:00", cpu: 61, memory: 69, dbIops: 180, apiLatency: 19 },
    { time: "13:00", cpu: 55, memory: 64, dbIops: 165, apiLatency: 16 }
  ]);
  const [incidents, setIncidents] = useState<any[]>([
    { id: "inc-101", titleAr: "تأخر مزامنة السجلات مع الخرطوم بحري", titleEn: "Khartoum North replication delay", severity: "Medium", status: "Awaiting Action" },
    { id: "inc-102", titleAr: "محاولة اتصال غير مصرحة على بوابة mTLS", titleEn: "Unauthorized mTLS handshake attempt", severity: "High", status: "Mitigated" }
  ]);

  // MODULE 4: Cyber Resilience States
  const [threatIntelligence, setThreatIntelligence] = useState<any[]>([
    { id: "thr-1", source: "Sovereign WAF", payload: "SQL injection payload filtered", risk: "Low", date: "Just now" },
    { id: "thr-2", source: "mTLS Gateway", payload: "Expired digital signature", risk: "Medium", date: "5 mins ago" },
    { id: "thr-3", source: "DDoS Mitigation Layer", payload: "Rate limits triggered for 42 IPs", risk: "Low", date: "12 mins ago" }
  ]);
  const [vulnerabilityScan, setVulnerabilityScan] = useState({
    scannedAssets: 148,
    criticalVulnerabilities: 0,
    highVulnerabilities: 2,
    mediumVulnerabilities: 11,
    lastScanDate: "Today 01:00 AM"
  });

  // MODULE 5: Digital Governance States
  const [governanceScorecard, setGovernanceScorecard] = useState({
    eaAlignment: 98.2,
    techStandards: 96.5,
    dataInteroperability: 95,
    accessibilityCompliance: 94.2
  });

  // MODULE 6: Enterprise Platform States
  const [sharedNotificationsCount, setSharedNotificationsCount] = useState(1480);
  const [simulatedPaymentValue, setSimulatedPaymentValue] = useState("");
  const [paymentLog, setPaymentLog] = useState<any[]>([
    { id: "pay-1", payee: "Nile Food Corp", amount: "120,000 SDG", type: "License Fee", time: "Just now" },
    { id: "pay-2", payee: "Zain Telecom Sudan", amount: "4,500,000 SDG", type: " spectrum tax", time: "2 hours ago" }
  ]);

  // MODULE 7: Digital Transformation Center States
  const [transformationProjects, setTransformationProjects] = useState<any[]>([
    { id: "pr-1", nameAr: "منصة السجل القومي الموحد للشركات", nameEn: "Unified National Company Registry", progress: 95, status: "Staging" },
    { id: "pr-2", nameAr: "الربط الجمركي الإقليمي - الكوميسا", nameEn: "Regional Customs Single Window (COMESA)", progress: 85, status: "Active" },
    { id: "pr-3", nameAr: "توسيع الدفع الوطني للخدمات البلدية", nameEn: "National Payments Municipal Expansion", progress: 60, status: "Development" }
  ]);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number>>({ q1: 3, q2: 4, q3: 3, q4: 4 });
  const [maturityScore, setMaturityScore] = useState<number | null>(null);

  // MODULE 8: Future Technology Lab States
  const [emergingExperiments, setEmergingExperiments] = useState<any[]>([
    { id: "exp-1", tech: "Agentic AI Commerce Routing", status: "Succeeded", date: "Yesterday" },
    { id: "exp-2", tech: "Smart Contracts on Hyperledger", status: "Running", date: "Ongoing" },
    { id: "exp-3", tech: "IoT Soil Telemetry Integration", status: "Staging", date: "Today" }
  ]);
  const [quantumScore, setQuantumScore] = useState({ readiness: "Advanced Level B", score: 84 });

  // MODULE 9: National Executive Command Center States
  const [kpis, setKpis] = useState({
    nationalGdpContribution: "14.2B USD",
    tradeSurplusRate: "+4.2%",
    totalFdiInflows: "842M USD",
    consumerComplaintResolutionRate: "98.7%"
  });

  // MODULE 10: Platform Expansion Framework States
  const [onboardingRequests, setOnboardingRequests] = useState<any[]>([
    { id: "onb-1", entityAr: "وزارة الصحة الاتحادية", entityEn: "Federal Ministry of Health", status: "Under Review", date: "2026-07-18" },
    { id: "onb-2", entityAr: "وزارة الثروة الحيوانية والسمكية", entityEn: "Ministry of Animal Resources", status: "Approved", date: "2026-07-15" }
  ]);
  const [newOnboardingForm, setNewOnboardingForm] = useState({ entityAr: "", entityEn: "", contactEmail: "", preferredPlugins: "all" });

  // Unified Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Simulated GraphQL query
  const [gqlQuery, setGqlQuery] = useState(`query {
  nationalEconomicCenter {
    registeredMinistries {
      code
      servicesCount
    }
    cyberSecurityComplianceScore
    aiRiskIndicator
  }
}`);
  const [gqlResult, setGqlResult] = useState("");

  const loadAllStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/national-economic-gov/portal-stats").then(r => r.json());
      if (res.success) {
        // Hydrate state
        if (res.ministries) setMinistries(res.ministries);
        if (res.serviceCatalog) setServiceCatalog(res.serviceCatalog);
        if (res.aiModels) setAiModels(res.aiModels);
        if (res.transformationProjects) setTransformationProjects(res.transformationProjects);
        if (res.onboardingRequests) setOnboardingRequests(res.onboardingRequests);
      }
    } catch (e) {
      console.error("Failed to load Phase 20 data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllStats();
  }, []);

  // Search Engine
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results: any[] = [];

    // Search ministries
    if (searchCategory === "all" || searchCategory === "ministries") {
      ministries.forEach(m => {
        if (m.nameAr.toLowerCase().includes(query) || m.nameEn.toLowerCase().includes(query) || m.code.toLowerCase().includes(query)) {
          results.push({ type: currentLanguage === "ar" ? "وزارة / مصلحة" : "Ministry / Agency", title: currentLanguage === "ar" ? m.nameAr : m.nameEn, detail: `Code: ${m.code} | Services: ${m.servicesCount}`, icon: Building2 });
        }
      });
    }

    // Search services
    if (searchCategory === "all" || searchCategory === "services") {
      serviceCatalog.forEach(s => {
        if (s.nameAr.toLowerCase().includes(query) || s.nameEn.toLowerCase().includes(query) || s.dept.toLowerCase().includes(query)) {
          results.push({ type: currentLanguage === "ar" ? "خدمة رقمية" : "Government Service", title: currentLanguage === "ar" ? s.nameAr : s.nameEn, detail: `Dept: ${s.dept} | Fee: ${s.fee}`, icon: Network });
        }
      });
    }

    // Search AI Models
    if (searchCategory === "all" || searchCategory === "models") {
      aiModels.forEach(m => {
        if (m.name.toLowerCase().includes(query) || m.type.toLowerCase().includes(query)) {
          results.push({ type: currentLanguage === "ar" ? "نموذج ذكاء اصطناعي" : "AI Model", title: m.name, detail: `Type: ${m.type} | Status: ${m.status}`, icon: Brain });
        }
      });
    }

    setSearchResults(results);
  }, [searchQuery, searchCategory, ministries, serviceCatalog, aiModels]);

  // Submit AI Model Registration (MODULE 2)
  const handleRegisterModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelForm.name) return;
    try {
      const res = await fetch("/api/national-economic-gov/ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModelForm)
      }).then(r => r.json());
      if (res.success) {
        setAiModels(prev => [...prev, res.model]);
        setNotifications(prev => [`New AI Model registered: ${res.model.name}`, ...prev]);
        setNewModelForm({ name: "", type: "LLM-FineTuned", version: "1.0.0" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Ministry Onboarding Request (MODULE 10)
  const handleOnboardRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOnboardingForm.entityAr || !newOnboardingForm.entityEn) return;
    try {
      const res = await fetch("/api/national-economic-gov/onboarding-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOnboardingForm)
      }).then(r => r.json());
      if (res.success) {
        setOnboardingRequests(prev => [...prev, res.request]);
        setNotifications(prev => [`New agency onboarding request submitted: ${res.request.entityEn}`, ...prev]);
        setNewOnboardingForm({ entityAr: "", entityEn: "", contactEmail: "", preferredPlugins: "all" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run explainable AI simulation
  const handleExplainAI = async () => {
    if (!explainableInput) return;
    setExplainableOutput("");
    try {
      const res = await fetch("/api/national-economic-gov/explain-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: explainableInput })
      }).then(r => r.json());
      if (res.success) {
        setExplainableOutput(res.explanation);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Execute Simulated GraphQL Query
  const executeGraphQLQuery = async () => {
    try {
      const res = await fetch("/api/national-economic-gov/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: gqlQuery })
      }).then(r => r.json());
      setGqlResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setGqlResult("GraphQL Error: " + e);
    }
  };

  // Interactive Maturity Assessment Calculator (MODULE 7)
  const calculateMaturity = () => {
    const totalScore = Object.keys(surveyAnswers).reduce((sum, key) => sum + (surveyAnswers[key] || 0), 0);
    const percentage = Math.round((totalScore / 16) * 100);
    setMaturityScore(percentage);
    setNotifications(prev => [`National digital maturity assessment completed: score ${percentage}%`, ...prev]);
  };

  // Handle shared payment simulation (MODULE 6)
  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedPaymentValue) return;
    try {
      const res = await fetch("/api/national-economic-gov/shared-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: simulatedPaymentValue, payee: currentLanguage === "ar" ? "ممول تجاري معتمد" : "Verified Trader" })
      }).then(r => r.json());
      if (res.success) {
        setPaymentLog(prev => [res.payment, ...prev]);
        setNotifications(prev => [`Sovereign payment processed successfully: SDG ${res.payment.amount}`, ...prev]);
        setSimulatedPaymentValue("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Master Sidebar list of 10 modules
  const pillars = [
    { id: 1, labelAr: "المركز الوطني للمنصة الحكومية", labelEn: "National Government Center", icon: Landmark },
    { id: 2, labelAr: "منصة حوكمة الذكاء الاصطناعي", labelEn: "National AI Governance Platform", icon: Brain },
    { id: 3, labelAr: "مركز العمليات الرقمية الوطني", labelEn: "National Digital Operations Center", icon: Activity },
    { id: 4, labelAr: "المركز الوطني للمرونة السيبرانية", labelEn: "National Cyber Resilience Center", icon: ShieldAlert },
    { id: 5, labelAr: "منصة الحوكمة الرقمية الوطنية", labelEn: "National Digital Governance", icon: Scale },
    { id: 6, labelAr: "المنصة المشتركة للمؤسسات القومية", labelEn: "National Enterprise Shared Platform", icon: Layers },
    { id: 7, labelAr: "مركز التحول الرقمي الوطني", labelEn: "National Digital Transformation Center", icon: TrendingUp },
    { id: 8, labelAr: "مختبر تكنولوجيا المستقبل السيادي", labelEn: "National Future Technology Lab", icon: Cpu },
    { id: 9, labelAr: "مركز القيادة التنفيذي الأعلى", labelEn: "National Executive Command Center", icon: Sparkles },
    { id: 10, labelAr: "إطار توسيع المنصة الوطنية", labelEn: "National Platform Expansion Framework", icon: Network }
  ];

  return (
    <div className="space-y-6" id="national-digital-economic-gov-master">
      {/* 1. Header Banner */}
      <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.15),transparent_60%)] pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#FFD700] border border-[#C5A059]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#FFD700] animate-pulse" />
            <span>{currentLanguage === "ar" ? "رؤية السودان ٢٠٣٥ | المرحلة العشرون" : "Sudan Vision 2035 | Phase 20"}</span>
          </div>
          <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight text-[#F8FAFC]" style={{ fontFamily: "var(--font-arabic)" }}>
            {currentLanguage === "ar" 
              ? "المنصة الحكومية الوطنية للاقتصاد الرقمي الموحد" 
              : "National Digital Economic Government Platform"}
          </h1>
          <p className="text-slate-400 text-xs font-semibold max-w-4xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "الأساس الرقمي السيادي المتكامل للتجارة، الصناعة، الاستثمار، الحوكمة الرشيدة، الأمن السيبراني والذكاء الاصطناعي المسؤول والربط الوطني."
              : "The central digital sovereign framework for unified commerce, industrial progress, consumer protection, AI governance, cyber resilience, and future ministerial integrations."}
          </p>
        </div>
        <button 
          onClick={loadAllStats} 
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[#FFD700] p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {currentLanguage === "ar" ? "تحديث المنظومة" : "Sync Central System"}
        </button>
      </div>

      {/* 2. Unified Search & Intelligent Semantic Finder */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              {currentLanguage === "ar" ? "محرك البحث الوطني الذكي والبحث الدلالي للذكاء الاصطناعي" : "Sovereign Semantic Search & Platform Directory"}
            </h3>
            <p className="text-xs text-gray-500">
              {currentLanguage === "ar" ? "ابحث بدلالة النصوص والخدمات والمؤشرات والسياسات عبر كافة الوحدات الحكومية" : "Universal directory search for registered ministries, digital services, policies, and AI models"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wide">
              {currentLanguage === "ar" ? "النظام متاح وعامل" : "Search Cluster Active"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLanguage === "ar" ? "ابحث هنا، مثال: وزارة التجارة، رخصة الاستيراد، نموذج التنبؤ..." : "Search ministries, services, CVEs, smart contracts..."}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs md:text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-800"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
          </div>
          <div className="md:col-span-4">
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs md:text-sm focus:outline-none focus:border-emerald-500 text-slate-700 font-semibold"
            >
              <option value="all">{currentLanguage === "ar" ? "كل الكيانات الاقتصادية" : "All System Objects"}</option>
              <option value="ministries">{currentLanguage === "ar" ? "الوزارات والهيئات" : "Registered Ministries"}</option>
              <option value="services">{currentLanguage === "ar" ? "الخدمات الحكومية" : "Digital Services"}</option>
              <option value="models">{currentLanguage === "ar" ? "نماذج الذكاء الاصطناعي" : "AI Governance Models"}</option>
            </select>
          </div>
        </div>

        {/* Live Search Results */}
        {searchResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-50 border border-gray-200 rounded-2xl space-y-2 max-h-60 overflow-y-auto"
          >
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
              {currentLanguage === "ar" ? "النتائج المطابقة في السجلات الوطنية" : "Sovereign Database Matches"} ({searchResults.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map((res, idx) => {
                const ResIcon = res.icon || Check;
                return (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <ResIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide block">{res.type}</span>
                      <h5 className="font-bold text-slate-800 text-xs truncate max-w-[200px]">{res.title}</h5>
                      <p className="text-[10px] text-slate-500 font-semibold">{res.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. Main Pillars and Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SIDE BAR NAVIGATION - 10 MODULES */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-4 shadow-xs space-y-1">
          <span className="text-[9px] font-bold tracking-wider text-slate-400 block px-3 py-1 uppercase border-b border-gray-100 mb-2">
            {currentLanguage === "ar" ? "المحاور العشرة للمنصة الموحدة" : "Unified Platform Pillars"}
          </span>
          {pillars.map((mod) => {
            const ModIcon = mod.icon;
            const isActive = activeModuleTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModuleTab(mod.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[11px] font-bold transition-all border cursor-pointer uppercase ${
                  isActive 
                    ? "bg-slate-950 text-[#FFD700] border-slate-950 font-extrabold shadow-md" 
                    : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
                }`}
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              >
                <ModIcon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-[#FFD700]" : "text-slate-400"}`} />
                <span className="truncate text-start">{currentLanguage === "ar" ? mod.labelAr : mod.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* WORKSPACE CONTENT AREA */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModuleTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs min-h-[520px]"
            >
              
              {/* ========================================================= */}
              {/* MODULE 1: NATIONAL GOVERNMENT PLATFORM CENTER */}
              {/* ========================================================= */}
              {activeModuleTab === 1 && (
                <div className="space-y-6" id="module-gov-center">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Landmark className="w-5.5 h-5.5 text-emerald-600 animate-pulse" />
                        {currentLanguage === "ar" ? "المركز الوطني للمنصة القومية الموحدة" : "National Government Platform Center"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "السجل الوطني الموحد للوزارات والهيئات السودانية وكتالوج الخدمات الذكية المشتركة" : "Central directory of ministries, service catalog registries, and intelligent cross-agency service routing"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 1
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ministries list */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "سجل الوزارات والهيئات المنضوية" : "Unified Ministry & Agency Registry"}
                      </h5>
                      <div className="space-y-2">
                        {ministries.map((m) => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">
                                {currentLanguage === "ar" ? m.nameAr : m.nameEn}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">Code: {m.code} | Status: {m.status}</span>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {m.servicesCount} Services
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Service Catalog & Cross-Agency Routing */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "موجه معالجة الخدمات المشتركة بين الهيئات" : "Cross-Agency Intelligent Service Routing"}
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            {currentLanguage === "ar" ? "اختر الخدمة لبدء التوجيه:" : "Select service flow to map:"}
                          </label>
                          <select 
                            value={selectedRoutingService}
                            onChange={(e) => {
                              setSelectedRoutingService(e.target.value);
                              setRoutingStep(0);
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-emerald-500 text-slate-800 font-semibold"
                          >
                            {serviceCatalog.map((s) => (
                              <option key={s.id} value={s.id}>{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
                            ))}
                          </select>
                        </div>

                        {/* Workflow simulator */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide block">Active Routing Sequence</span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-800">
                            <span className="font-bold bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center font-mono">1</span>
                            <span>{currentLanguage === "ar" ? "التحقق المالي والأمني عبر mTLS" : "Sovereign mTLS secure handshake"}</span>
                            <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto" />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-800">
                            <span className="font-bold bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center font-mono">2</span>
                            <span>{currentLanguage === "ar" ? "تصدير الملف الموحد إلى وزارة المالية" : "Unified document export to Ministry of Finance"}</span>
                            {routingStep >= 1 ? <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto" /> : <Clock className="w-4 h-4 text-slate-400 ml-auto animate-pulse" />}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-800">
                            <span className="font-bold bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center font-mono">3</span>
                            <span>{currentLanguage === "ar" ? "تدقيق السياسات والتحصيل الرقمي" : "Automated policy compliance & sovereign collection"}</span>
                            {routingStep >= 2 ? <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto" /> : <Clock className="w-4 h-4 text-slate-400 ml-auto" />}
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={() => setRoutingStep(prev => (prev < 2 ? prev + 1 : 0))}
                              className="w-full bg-slate-950 hover:bg-slate-800 text-white py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3 h-3 text-[#FFD700]" />
                              {routingStep === 2 ? "Reset Flow" : "Progress Workflow Stage"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 2: NATIONAL AI GOVERNANCE PLATFORM */}
              {/* ========================================================= */}
              {activeModuleTab === 2 && (
                <div className="space-y-6" id="module-ai-governance">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Brain className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "المنصة الوطنية لحوكمة وأمان الذكاء الاصطناعي" : "National AI Governance & Registry Platform"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "متابعة النماذج المعيارية، أتمتة تدقيق الموثوقية وسلامة النماذج والامتثال للسياسات الوطنية" : "Oversee model registry, enforce responsible AI prompt constraints, and compute explainability audits"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Model Registry List */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                          {currentLanguage === "ar" ? "سجل النماذج الوطنية النشطة" : "Active Model Registry"}
                        </h5>
                        <span className="text-[10px] font-mono font-bold text-emerald-600">Risk Factor: {aiRiskFactor}%</span>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {aiModels.map((m) => (
                          <div key={m.id} className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">{m.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{m.type} | Latency: {m.latency}</span>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">{m.status}</span>
                          </div>
                        ))}
                      </div>

                      {/* Register new model form */}
                      <form onSubmit={handleRegisterModel} className="pt-3 border-t border-gray-200 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">{currentLanguage === "ar" ? "تسجيل نموذج ذكي جديد" : "Register Emerging AI Model"}</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            required
                            value={newModelForm.name}
                            onChange={(e) => setNewModelForm({...newModelForm, name: e.target.value})}
                            placeholder="Model Name (e.g., Nile-Llama)"
                            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-gray-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                          <select 
                            value={newModelForm.type}
                            onChange={(e) => setNewModelForm({...newModelForm, type: e.target.value})}
                            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-gray-200 text-slate-700 font-semibold"
                          >
                            <option value="LLM-FineTuned">LLM Fine-Tuned</option>
                            <option value="TransformerClassifier">Classifier</option>
                            <option value="CustomModel">Custom API</option>
                          </select>
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-slate-950 hover:bg-slate-900 text-[#FFD700] py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "تسجيل واعتماد النموذج" : "Deploy Model Registry Token"}
                        </button>
                      </form>
                    </div>

                    {/* Explainable AI Sandbox */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-[#C5A059]" />
                        {currentLanguage === "ar" ? "بيئة اختبار الذكاء الاصطناعي القابل للتفسير (XAI)" : "Explainable AI & Safety Alignment"}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "أدخل موجه استراتيجي لمحاكاة معايير السلامة والتفسير المنطقي لاتخاذ القرارات آلياً."
                          : "Input strategic command variables to test alignment constraints, regulatory check compliance and log audit trials."}
                      </p>
                      <div className="space-y-2">
                        <textarea 
                          rows={3}
                          value={explainableInput}
                          onChange={(e) => setExplainableInput(e.target.value)}
                          placeholder="e.g. Export quota check for sorghum..."
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                        />
                        <button 
                          onClick={handleExplainAI}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          {currentLanguage === "ar" ? "بدء التحليل والتفسير التلقائي" : "Explain AI Output & Log Safety Audit"}
                        </button>

                        {explainableOutput && (
                          <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1.5 text-[11px] font-mono leading-relaxed text-emerald-800"
                          >
                            <span className="font-bold block text-slate-800">✔ Explainable Decision Logs:</span>
                            <p>{explainableOutput}</p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 3: NATIONAL DIGITAL OPERATIONS CENTER */}
              {/* ========================================================= */}
              {activeModuleTab === 3 && (
                <div className="space-y-6" id="module-operations">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Activity className="w-5.5 h-5.5 text-emerald-600 animate-pulse" />
                        {currentLanguage === "ar" ? "مركز العمليات الرقمية والرقابة الوطنية" : "National Digital Operations Center"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "متابعة أداء الشبكة البينية الحكومية ومؤشرات سلامة المعاملات وقواعد البيانات والمنافذ الرقمية" : "Real-time metrics, active network throughput, incident mitigation queue and infrastructure log monitors"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 3
                    </span>
                  </div>

                  {/* Real-time Operation Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Infrastructure Health</span>
                      <span className="text-2xl font-black text-emerald-600 font-mono block mt-1">99.98%</span>
                      <p className="text-[9px] text-emerald-600 mt-1">All central containers online</p>
                    </div>
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                      <span className="text-[10px] font-bold text-blue-800 uppercase block">API Response Average</span>
                      <span className="text-2xl font-black text-blue-600 font-mono block mt-1">16 ms</span>
                      <p className="text-[9px] text-blue-600 mt-1">mTLS overhead included</p>
                    </div>
                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">Replication Sync Lag</span>
                      <span className="text-2xl font-black text-amber-600 font-mono block mt-1">0.14 s</span>
                      <p className="text-[9px] text-amber-600 mt-1">Syncing 18 states in real-time</p>
                    </div>
                  </div>

                  {/* Operations Performance Chart */}
                  <div className="bg-slate-50 p-4 rounded-3xl border border-gray-200">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-3">
                      {currentLanguage === "ar" ? "أداء موارد النظام في الـ 24 ساعة الماضية" : "Unified Telemetry Analytics (Last 24 Hours)"}
                    </h5>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={opsMetrics}>
                          <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D97706" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="time" tick={{ fontSize: 9 }} />
                          <YAxis tick={{ fontSize: 9 }} />
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12 }} />
                          <Area type="monotone" dataKey="cpu" name="CPU Core Load %" stroke="#10B981" fillOpacity={1} fill="url(#colorCpu)" />
                          <Area type="monotone" dataKey="apiLatency" name="API Latency (ms)" stroke="#D97706" fillOpacity={1} fill="url(#colorLatency)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Incident Management */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                      {currentLanguage === "ar" ? "إدارة الحوادث والمعالجات الفورية" : "Real-time Incident & Alert Response Queue"}
                    </h5>
                    <div className="space-y-2">
                      {incidents.map((inc) => (
                        <div key={inc.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                          <div className="flex items-start gap-2.5">
                            <span className={`w-2 h-2 rounded-full mt-1.5 ${inc.severity === "High" ? "bg-red-500 animate-ping" : "bg-amber-500"}`} />
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">
                                {currentLanguage === "ar" ? inc.titleAr : inc.titleEn}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {inc.id} | Severity: {inc.severity}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIncidents(prev => prev.map(i => i.id === inc.id ? { ...i, status: "Mitigated" } : i));
                              setNotifications(prev => [`Incident resolved: ${inc.titleEn}`, ...prev]);
                            }}
                            className={`px-3 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-all ${
                              inc.status === "Mitigated" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                : "bg-slate-900 text-[#FFD700] hover:bg-slate-800"
                            }`}
                          >
                            {inc.status === "Mitigated" ? "Resolved" : "Acknowledge"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 4: NATIONAL CYBER RESILIENCE CENTER */}
              {/* ========================================================= */}
              {activeModuleTab === 4 && (
                <div className="space-y-6" id="module-cyber-soc">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <ShieldAlert className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "المركز الوطني للمرونة والأمن السيبراني" : "National Cyber Resilience Center"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "مرصد التهديدات السيبرانية، ومتابعة هجمات حجب الخدمة وفحص الثغرات لضمان استمرارية الأعمال الاقتصادية" : "WAF threat landscape, real-time vulnerability scan index, and security policy checks aligned with NIST guidelines"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 4
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vulnerability status card */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "مؤشر فحص الثغرات الأسبوعي" : "Continuous Vulnerability Assessment"}
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 bg-white rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-500 block uppercase font-bold">Assets Scanned</span>
                          <span className="text-xl font-bold font-mono text-slate-800">{vulnerabilityScan.scannedAssets}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-500 block uppercase font-bold">Critical CVEs</span>
                          <span className="text-xl font-bold font-mono text-emerald-600">{vulnerabilityScan.criticalVulnerabilities}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-500 block uppercase font-bold">High Risks</span>
                          <span className="text-xl font-bold font-mono text-amber-500">{vulnerabilityScan.highVulnerabilities}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-500 block uppercase font-bold">Compliance Status</span>
                          <span className="text-xs font-black text-emerald-600 block mt-1.5 uppercase">Excellent</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">Last continuous scan completed: {vulnerabilityScan.lastScanDate}</span>
                    </div>

                    {/* Security Threats Feed */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "تغذية الاستخبارات المباشرة للتهديدات" : "Live Cyber Threat Intelligence"}
                      </h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {threatIntelligence.map((t) => (
                          <div key={t.id} className="p-2.5 bg-white rounded-xl border border-gray-100 flex items-start gap-2.5">
                            <AlertTriangle className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${t.risk === "Medium" ? "text-amber-500" : "text-slate-400"}`} />
                            <div className="text-[11px] leading-relaxed">
                              <span className="font-bold text-slate-800 block">{t.source}</span>
                              <p className="text-slate-500 font-mono text-[10px]">{t.payload}</p>
                              <span className="text-[9px] text-[#C5A059] font-semibold">{t.date} | Risk: {t.risk}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 5: NATIONAL DIGITAL GOVERNANCE */}
              {/* ========================================================= */}
              {activeModuleTab === 5 && (
                <div className="space-y-6" id="module-governance">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Scale className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "بوابة الحوكمة الرقمية الوطنية للسياسات" : "National Digital Governance & Standards Portal"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "أدوات مراجعة الامتثال لمعايير النظام المفتوح ومقاييس تصميم واجهات الاستخدام وسرية البيانات الحكومية" : "Enforce structural API specifications, web accessibility criteria, and track compliance scorecards"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 5
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Compliance Checklist and score */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "بطاقة تقييم الامتثال الرقمي الحكومي" : "Sovereign Digital Governance Scorecard"}
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>Enterprise Architecture Alignment</span>
                            <span>{governanceScorecard.eaAlignment}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-slate-900 h-full rounded-full" style={{ width: `${governanceScorecard.eaAlignment}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>Technology & API Standards Compliance</span>
                            <span>{governanceScorecard.techStandards}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${governanceScorecard.techStandards}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>Accessibility & UX Standards (W3C AAA)</span>
                            <span>{governanceScorecard.accessibilityCompliance}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${governanceScorecard.accessibilityCompliance}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Standards Manual Reference */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "دليل المعايير التكنولوجية الموحدة" : "Unified Technical Standards Quick Reference"}
                      </h5>
                      <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-100">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <span>**Data Standard:** Fully ISO 27001 & JSON Schema-v7 schema compliant.</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-100">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <span>**API Gateway:** OAuth 2.0 with mandatory mTLS certificate auth.</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-100">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <span>**Cryptographic Trust:** All payload signed via SHA-256 HSM hashes.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 6: NATIONAL ENTERPRISE PLATFORM */}
              {/* ========================================================= */}
              {activeModuleTab === 6 && (
                <div className="space-y-6" id="module-shared-services">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Layers className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "المنصة المشتركة للخدمات والمعاملات الفيدرالية" : "National Enterprise Shared Platform"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "محرك معالجة الدفوعات الوطني الموحد، نظام التوثيق والمصادقة وإرسال إشعارات الأجهزة المحمولة" : "Integrated central gateway managing shared payments clearing, SMS alerts gateway and PDF reporting exports"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 6
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sovereign Payment Simulator */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "محاكي الدفع والجباية الإلكترونية الموحد" : "Sovereign Payment Clearing Simulator"}
                      </h5>
                      <form onSubmit={handleSimulatePayment} className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">
                            {currentLanguage === "ar" ? "المبلغ المراد سداده ورسمياً بالجنيه السوداني" : "Custom payment amount (SDG)"}
                          </label>
                          <input 
                            type="number" 
                            required
                            value={simulatedPaymentValue}
                            onChange={(e) => setSimulatedPaymentValue(e.target.value)}
                            placeholder="e.g. 150000"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-slate-950 hover:bg-slate-900 text-[#FFD700] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Coins className="w-4 h-4" />
                          {currentLanguage === "ar" ? "دفع وإصدار إشعار مالي سيادي" : "Authorize Sovereign Payment & Clear"}
                        </button>
                      </form>
                    </div>

                    {/* Shared payment results log */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "سجل المدفوعات والمعاملات المشتركة الأخير" : "Shared Payment Ledgers (Live)"}
                      </h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {paymentLog.map((p, idx) => (
                          <div key={idx} className="p-2.5 bg-white rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-slate-800 block">{p.payee}</span>
                              <span className="text-[10px] text-gray-400">{p.type} | {p.time}</span>
                            </div>
                            <span className="text-emerald-600 font-mono font-black">{p.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 7: NATIONAL DIGITAL TRANSFORMATION CENTER */}
              {/* ========================================================= */}
              {activeModuleTab === 7 && (
                <div className="space-y-6" id="module-digital-transformation">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <TrendingUp className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "المركز الوطني لمتابعة التحول الرقمي الاستراتيجي" : "National Digital Transformation Center"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "قياس نضج المؤسسات والتحقق من تقدم مسارات وركائز خطة التحول لوزارة التجارة وبقية الوزارات" : "National digital maturity self-assessment model and executive roadmap monitoring"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 7
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Transformation projects progress list */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "مسارات المشاريع الاستراتيجية المفتوحة" : "Sovereign Strategic Projects"}
                      </h5>
                      <div className="space-y-3">
                        {transformationProjects.map((p) => (
                          <div key={p.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{currentLanguage === "ar" ? p.nameAr : p.nameEn}</span>
                              <span className="text-emerald-600">{p.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive digital maturity assessment calculator */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "حساب مؤشر النضج الرقمي الفوري للجهة" : "Digital Maturity Rapid Self-Assessment"}
                      </h5>
                      <div className="space-y-2 text-xs text-slate-600">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {currentLanguage === "ar" ? "هل تدعم كافة الأنظمة التوقيع الرقمي والتشفير؟" : "Are keys and systems cryptographically signed?"}
                          </label>
                          <select 
                            value={surveyAnswers.q1}
                            onChange={(e) => setSurveyAnswers({...surveyAnswers, q1: Number(e.target.value)})}
                            className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-slate-700 bg-white"
                          >
                            <option value={4}>{currentLanguage === "ar" ? "نعم بالكامل (درجة 4)" : "Yes fully (Score 4)"}</option>
                            <option value={2}>{currentLanguage === "ar" ? "مرحلياً ومجتزأ (درجة 2)" : "Partially (Score 2)"}</option>
                            <option value={0}>{currentLanguage === "ar" ? "لا ندعم (درجة 0)" : "No support (Score 0)"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">
                            {currentLanguage === "ar" ? "تأمين تدفقات mTLS والربط مع الهيئات؟" : "Enforce mutual TLS and secure interoperability Hub?"}
                          </label>
                          <select 
                            value={surveyAnswers.q2}
                            onChange={(e) => setSurveyAnswers({...surveyAnswers, q2: Number(e.target.value)})}
                            className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-slate-700 bg-white"
                          >
                            <option value={4}>{currentLanguage === "ar" ? "نعم مفعّل بالكامل" : "Yes fully"}</option>
                            <option value={2}>{currentLanguage === "ar" ? "تحت التأسيس" : "Under development"}</option>
                            <option value={0}>{currentLanguage === "ar" ? "لا يدعم" : "No"}</option>
                          </select>
                        </div>
                        <button 
                          onClick={calculateMaturity}
                          className="w-full bg-slate-950 hover:bg-slate-900 text-[#FFD700] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "احسب مؤشر النضج السيادي" : "Analyze Digital Maturity Index"}
                        </button>

                        {maturityScore !== null && (
                          <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            className="p-3 bg-emerald-50 text-emerald-800 text-center rounded-xl border border-emerald-100"
                          >
                            <span className="text-[10px] uppercase font-mono block">Maturity Scorecard Results</span>
                            <span className="text-xl font-black">{maturityScore}%</span>
                            <p className="text-[10px] text-emerald-600 mt-1">Excellent readiness rating - Eligible for National Hub plugins.</p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 8: NATIONAL FUTURE TECHNOLOGY LAB */}
              {/* ========================================================= */}
              {activeModuleTab === 8 && (
                <div className="space-y-6" id="module-future-tech">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Cpu className="w-5.5 h-5.5 text-emerald-600 animate-spin" />
                        {currentLanguage === "ar" ? "مختبر تقنيات الغد والتجريب الرقمي (Sandbox)" : "National Future Technology Lab & Sandbox"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "اختبار روبوتات المعالجة التلقائية (RPA)، وتجريب تكنولوجيا البلوكشين وتقييم الاستعداد للأجهزة الكمومية" : "Prototype secure blockchain business registries, test autonomous process automation, and evaluate post-quantum cybersecurity parameters"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 8
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sandbox trials */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "مجموعة التجارب الفعالة في المختبر" : "Active Sandbox Technological Experiments"}
                      </h5>
                      <div className="space-y-2">
                        {emergingExperiments.map((e) => (
                          <div key={e.id} className="p-3 bg-white border border-gray-100 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-slate-800 block">{e.tech}</span>
                              <span className="text-[10px] text-slate-400 font-mono">Status: {e.status}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">{e.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quantum Security and blockchain assessment */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                          <Shield className="w-4.5 h-4.5 text-amber-500" />
                          {currentLanguage === "ar" ? "تقييم الجاهزية للتشفير والتقنيات الكمية" : "Post-Quantum Security Assessment"}
                        </h5>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {currentLanguage === "ar"
                            ? "تم تعيين معايير أمنية متطورة تتماشى مع معايير NIST لضمان مقاومة خوارزميات المفاتيح العامة الوطنية للهجمات المستندة للمحاكاة الكمومية."
                            : "Pre-configured lattice cryptography modules designed to shield sovereign databases from future post-quantum decryption methodologies."}
                        </p>
                      </div>
                      <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-[10px] border border-slate-800">
                        <code>Readiness Tier: {quantumScore.readiness}</code><br />
                        <code>Quantum Integrity Index: {quantumScore.score}%</code><br />
                        <code>[System Status]: Safe, no vulnerabilities detected in central keys.</code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 9: NATIONAL EXECUTIVE COMMAND CENTER */}
              {/* ========================================================= */}
              {activeModuleTab === 9 && (
                <div className="space-y-6" id="module-command-center">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Sparkles className="w-5.5 h-5.5 text-emerald-600 animate-pulse" />
                        {currentLanguage === "ar" ? "مركز القيادة والتحكم والمتابعة الأعلى" : "National Executive Command Center"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "لوحة المتابعة للوزير ومجلس الوزراء واللجان التنفيذية لمتابعة الناتج التجاري والاقتصادي والابتكار القومي" : "Minister and Cabinet level strategic dashboard for tracking Vision 2035 economic development and trade metrics"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 9
                    </span>
                  </div>

                  {/* Executive KPI overview cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Trade Surplus</span>
                      <span className="text-lg font-black text-emerald-600 block mt-1">{kpis.tradeSurplusRate}</span>
                      <p className="text-[9px] text-slate-500 mt-1">Reflecting non-oil exports growth</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Total FDI Inflows</span>
                      <span className="text-lg font-black text-slate-800 block mt-1">{kpis.totalFdiInflows}</span>
                      <p className="text-[9px] text-slate-500 mt-1">Concentrated in agricultural land</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Complaints Resolved</span>
                      <span className="text-lg font-black text-blue-600 block mt-1">{kpis.consumerComplaintResolutionRate}</span>
                      <p className="text-[9px] text-slate-500 mt-1">Consumer protection desk performance</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">GDP Contribution</span>
                      <span className="text-lg font-black text-[#C5A059] block mt-1">{kpis.nationalGdpContribution}</span>
                      <p className="text-[9px] text-slate-500 mt-1">Projected end-year aggregate</p>
                    </div>
                  </div>

                  {/* Executive Decision reporting block */}
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block tracking-wider">Strategic Recommendation Report</span>
                        <h5 className="font-bold text-sm tracking-tight mt-1">{currentLanguage === "ar" ? "إصدار وتوقيع ميكانيكي لتقرير الرؤية الاستراتيجية ٢٠٣٥" : "Vision 2035 Strategic Growth Report Signed"}</h5>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">{currentLanguage === "ar" ? "اضغط لتصدير وتوليد ملف التقرير الفيدرالي الشامل" : "Download cryptographic summary and performance matrices compiled across all modules."}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ["Vision 2035 Phase 20 Executive Report generated successfully", ...prev])}
                        className="bg-[#C5A059] hover:bg-[#AA8648] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        {currentLanguage === "ar" ? "تحميل التقرير المشفر" : "Generate Certified PDF"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODULE 10: NATIONAL PLATFORM EXPANSION FRAMEWORK */}
              {/* ========================================================= */}
              {activeModuleTab === 10 && (
                <div className="space-y-6" id="module-platform-expansion">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <Network className="w-5.5 h-5.5 text-emerald-600" />
                        {currentLanguage === "ar" ? "إطار التوسيع والربط بين الوزارات والمصالح" : "National Platform Expansion & Onboarding Framework"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "تسجيل الوزارات والهيئات الأخرى ودمج الأنظمة وتفعيل حزم البرمجيات الإضافية بالتنقيط الرقمي" : "Deploy onboarding pipelines, authorize agency credentials, and manage modular extension settings"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold border border-[#C5A059]/20 rounded-full">
                      Module 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Onboarding form */}
                    <form onSubmit={handleOnboardRequest} className="bg-slate-50 border border-gray-200 p-5 rounded-2xl space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "تقديم طلب ربط جهة حكومية جديدة" : "Register Government Entity for Integration"}
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم الكيان باللغة العربية" : "Entity Name (Arabic)"}</label>
                          <input 
                            type="text" 
                            required
                            value={newOnboardingForm.entityAr}
                            onChange={(e) => setNewOnboardingForm({...newOnboardingForm, entityAr: e.target.value})}
                            placeholder="وزارة النقل السودانية"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "اسم الكيان بالإنجليزية" : "Entity Name (English)"}</label>
                          <input 
                            type="text" 
                            required
                            value={newOnboardingForm.entityEn}
                            onChange={(e) => setNewOnboardingForm({...newOnboardingForm, entityEn: e.target.value})}
                            placeholder="Ministry of Transport Sudan"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">{currentLanguage === "ar" ? "البريد الإلكتروني لنقاط الاتصال الفنية" : "Technical Contact Email"}</label>
                          <input 
                            type="email" 
                            required
                            value={newOnboardingForm.contactEmail}
                            onChange={(e) => setNewOnboardingForm({...newOnboardingForm, contactEmail: e.target.value})}
                            placeholder="infra@transport.sd"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-slate-950 hover:bg-slate-900 text-[#FFD700] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        {currentLanguage === "ar" ? "تقديم طلب الربط والمصادقة" : "Initiate Integration Protocols"}
                      </button>
                    </form>

                    {/* Onboarding queue */}
                    <div className="space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        {currentLanguage === "ar" ? "طلبات الربط قيد المراجعة والموافقة" : "Entity Integration Queue"}
                      </h5>
                      <div className="space-y-3 max-h-72 overflow-y-auto">
                        {onboardingRequests.map((req) => (
                          <div key={req.id} className="p-4 bg-slate-50 border border-gray-200 rounded-2xl flex flex-col justify-between relative">
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{req.status}</span>
                            </div>
                            <div className="space-y-1">
                              <h6 className="font-extrabold text-xs text-slate-800">{currentLanguage === "ar" ? req.entityAr : req.entityEn}</h6>
                              <p className="text-[10px] text-slate-400 font-mono">ID: {req.id} | Submitted: {req.date}</p>
                            </div>
                            <div className="border-t border-gray-200 mt-3 pt-2 flex items-center justify-between text-[10px] text-slate-500">
                              <span>mTLS Handshake: Pending</span>
                              <button 
                                onClick={() => {
                                  setOnboardingRequests(prev => prev.map(o => o.id === req.id ? { ...o, status: "Approved" } : o));
                                  setNotifications(prev => [`Approved integration onboarding for ${req.entityEn}`, ...prev]);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-[9px] cursor-pointer"
                              >
                                Approve integration
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Interactive GraphQL / API Documentation sub-panel */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <h5 className="font-mono text-xs font-bold text-slate-800 uppercase">Sovereign GraphQL / REST API Live Terminal</h5>
                    <p className="text-[10px] text-emerald-600 block font-mono">SECURE ZERO-TRUST ACCESS FOR INTER-MINISTERIAL DEVELOPERS</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6 space-y-2">
                    <label className="text-[9px] font-bold font-mono text-slate-400 uppercase block">GraphQL / REST Request Body</label>
                    <textarea 
                      rows={5}
                      value={gqlQuery}
                      onChange={(e) => setGqlQuery(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 text-emerald-400 font-mono focus:outline-none focus:border-amber-500 leading-relaxed border border-slate-800"
                    />
                    <button 
                      onClick={executeGraphQLQuery}
                      className="w-full bg-[#C5A059] hover:bg-[#AA8648] text-slate-950 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                    >
                      <Send className="w-4 h-4" />
                      Execute Query
                    </button>
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <label className="text-[9px] font-bold font-mono text-slate-400 uppercase block">Execution Result (JSON Output)</label>
                    <div className="w-full h-32 p-3 bg-slate-950 rounded-xl text-xs font-mono overflow-y-auto border border-slate-800 text-emerald-300 whitespace-pre-wrap leading-relaxed">
                      {gqlResult ? gqlResult : "{\n  \"message\": \"Trigger a sovereign query to invoke live Phase 20 API controllers...\"\n}"}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Live Audit Logs and Notifications */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              {currentLanguage === "ar" ? "مركز الإشعارات والتدقيق والربط البيني السيادي" : "Unified Alert & National Security Log"}
            </h4>
            <p className="text-xs text-slate-400">
              {currentLanguage === "ar" ? "سجل حي للعمليات الفيدرالية والربط والتحذيرات السيبرانية التلقائية" : "Audit trails logged across the 10 national economic pillars in real-time"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {currentLanguage === "ar" ? "تحديث مباشر" : "Live Stream"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "التحذيرات الأمنية والالتزام" : "Zero-Trust & Cryptographic Warnings"}</span>
            <div className="space-y-2 font-mono text-[11px] leading-relaxed">
              <div className="flex gap-2 items-start text-slate-600">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>NIST Post-Quantum lattice cryptosystems enforced on central mTLS tunnels. All handshakes secured.</span>
              </div>
              <div className="flex gap-2 items-start text-slate-600">
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Enterprise Architecture alignment verification: Sovereign metadata validation checks passed.</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "الإشعارات المستلمة" : "Recent Portal Notifications"}</span>
            <div className="space-y-2 font-mono text-[11px] max-h-36 overflow-y-auto">
              {notifications.map((nt, idx) => (
                <div key={idx} className="flex gap-2 items-center text-slate-600 border-b border-gray-100 pb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{nt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
