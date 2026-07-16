import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scale, FileText, AlertTriangle, CheckCircle2, Clock, ShieldAlert, Users, 
  FilePlus, Fingerprint, Sparkles, BookOpen, TrendingUp, BarChart3, Database, 
  Search, FileCheck, PenTool, ArrowLeftRight, Download, Plus, RefreshCw, Sliders, Eye 
} from "lucide-react";

interface SovereignLegalAffairsPlatformProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function SovereignLegalAffairsPlatform({ currentLanguage, role }: SovereignLegalAffairsPlatformProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "litigation" | "contracts" | "regulations" | "opinions" | "compliance" | "ai-advisor">("dashboard");

  // Data states
  const [cases, setCases] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [opinions, setOpinions] = useState<any[]>([]);
  const [regulations, setRegulations] = useState<any[]>([]);
  const [compliance, setCompliance] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [enforcements, setEnforcements] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  // Loading & Action states
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const [signingContractId, setSigningContractId] = useState<string | null>(null);
  const [signingStep, setSigningStep] = useState<number>(0);
  const [citizenNationalId, setCitizenNationalId] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");

  // Forms states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newCaseForm, setNewCaseForm] = useState({
    titleAr: "", titleEn: "", type: "commercial", court: "", plaintiff: "", defendant: "", deadlines: ""
  });
  const [newContractForm, setNewContractForm] = useState({
    titleAr: "", titleEn: "", type: "ppp", parties: "", value: ""
  });
  const [newOpinionForm, setNewOpinionForm] = useState({
    requestTitleAr: "", requestTitleEn: "", requester: "", opinionSummaryAr: "", opinionSummaryEn: "", analyst: ""
  });
  const [newRegForm, setNewRegForm] = useState({
    titleAr: "", titleEn: "", category: "laws", status: "published", effectiveDate: "", publicConsultationStatus: "completed"
  });
  const [newHearingForm, setNewHearingForm] = useState({
    date: "", resultAr: "", resultEn: ""
  });
  const [judgmentForm, setJudgmentForm] = useState({
    judgment: "", enforcementStatus: "enforced"
  });

  // AI Advisor Playground States
  const [aiDocTitle, setAiDocTitle] = useState<string>("مشروع ملخص العقد الاستثماري لتصدير الصمغ العربي مع الكوميسا");
  const [aiDocContent, setAiDocContent] = useState<string>(
    "يلتزم الطرف الأول (جمهورية السودان - وزارة التجارة والصناعة) بتخصيص مساحة تخزينية مبردة بوزن 20 ألف طن متري في ميناء بورتسودان الجنوبي لصالح الطرف الثاني (المؤسسة الإقليمية للاستيراد والتصدير). يلتزم الطرف الثاني بدفع رسوم سنوية قدرها 500,000 دولار عبر الحساب الورقي المفتوح لدى البنك الأجنبي في لندن. يتم حل كافة الخلافات والنزاعات القانونية في محاكم لاهاي أو بموجب قوانين المملكة المتحدة الاسترشادية."
  );
  const [aiAnalysisType, setAiAnalysisType] = useState<string>("classify");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // Fetch all legal data on mount
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [casesRes, contractsRes, opinionsRes, regsRes, complianceRes, risksRes, enfRes, logsRes] = await Promise.all([
        fetch("/api/legal/cases").then(r => r.json()),
        fetch("/api/legal/contracts").then(r => r.json()),
        fetch("/api/legal/opinions").then(r => r.json()),
        fetch("/api/legal/regulations").then(r => r.json()),
        fetch("/api/legal/compliance").then(r => r.json()),
        fetch("/api/legal/risks").then(r => r.json()),
        fetch("/api/legal/enforcements").then(r => r.json()),
        fetch("/api/gov-audit-logs").then(r => r.json())
      ]);

      setCases(casesRes);
      setContracts(contractsRes);
      setOpinions(opinionsRes);
      setRegulations(regsRes);
      setCompliance(complianceRes);
      setRisks(risksRes);
      setEnforcements(enfRes);
      setAuditLogs(logsRes || []);
    } catch (err) {
      console.error("Failed to fetch legal platform data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Post methods
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/legal/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCaseForm)
      });
      if (res.ok) {
        setNewCaseForm({ titleAr: "", titleEn: "", type: "commercial", court: "", plaintiff: "", defendant: "", deadlines: "" });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/legal/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newContractForm,
          value: Number(newContractForm.value) || 0
        })
      });
      if (res.ok) {
        setNewContractForm({ titleAr: "", titleEn: "", type: "ppp", parties: "", value: "" });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/legal/opinions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newOpinionForm, status: "issued" })
      });
      if (res.ok) {
        setNewOpinionForm({ requestTitleAr: "", requestTitleEn: "", requester: "", opinionSummaryAr: "", opinionSummaryEn: "", analyst: "" });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateReg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/legal/regulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRegForm)
      });
      if (res.ok) {
        setNewRegForm({ titleAr: "", titleEn: "", category: "laws", status: "published", effectiveDate: "", publicConsultationStatus: "completed" });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddHearing = async (caseId: string) => {
    try {
      const res = await fetch(`/api/legal/cases/${caseId}/hearings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHearingForm)
      });
      if (res.ok) {
        setNewHearingForm({ date: "", resultAr: "", resultEn: "" });
        const updated = await res.json();
        setSelectedCase(updated.case);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleIssueJudgment = async (caseId: string) => {
    try {
      const res = await fetch(`/api/legal/cases/${caseId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "decided",
          judgment: judgmentForm.judgment,
          enforcementStatus: judgmentForm.enforcementStatus
        })
      });
      if (res.ok) {
        setJudgmentForm({ judgment: "", enforcementStatus: "enforced" });
        const updated = await res.json();
        setSelectedCase(updated.case);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewContract = async (contractId: string, roleName: string, reviewStatus: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/legal/contracts/${contractId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleName,
          status: reviewStatus,
          name: "د. سارة البشير"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedContract(data.contract);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerDigitalSignature = async () => {
    if (!signingContractId) return;
    setSigningStep(1); // Simulating step
    setTimeout(() => {
      setSigningStep(2); // Authenticated step
    }, 1200);
  };

  const confirmSigning = async () => {
    setSigningStep(3); // Signed completely
    try {
      const fakeSig = `sig_national_id_auth_${Math.random().toString(36).substring(2, 10).toUpperCase()}_${Date.now()}`;
      const res = await fetch(`/api/legal/contracts/${signingContractId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Minister",
          status: "approved",
          digitalSignature: fakeSig
        })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run AI Legal Advisor Prompt
  const handleAiAnalysis = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/legal/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docTitle: aiDocTitle,
          docContent: aiDocContent,
          analysisType: aiAnalysisType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.aiAnalysis);
      }
    } catch (err) {
      console.error("AI Legal Advisor request failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Helper translations
  const tAr = {
    title: "منصة الشؤون القانونية والقضايا والسياسات السيادية",
    subtitle: "حوكمة إلكترونية، عقود معززة رقمياً، وتحليلات قضائية بالذكاء الاصطناعي - رؤية السودان 2035",
    tab_dashboard: "لوحة المتابعة العامة",
    tab_litigation: "إدارة القضايا والتقاضي",
    tab_contracts: "إدارة العقود والشراكات (CLM)",
    tab_regulations: "التشريعات والأنظمة الفيدرالية",
    tab_opinions: "الفتاوى والاستشارات القانونية",
    tab_compliance: "الرقابة والمطابقة وإدارة المخاطر",
    tab_advisor: "المستشار القانوني الذكي (AI)",
    kpi_active_cases: "القضايا النشطة",
    kpi_contracts_review: "عقود قيد المراجعة",
    kpi_compliance_score: "مؤشر الامتثال الوزاري",
    kpi_active_warnings: "الإنذارات القانونية",
    kpi_total_risks: "المخاطر المرصودة",
    kpi_opinions_issued: "الاستشارات الصادرة",
    search_placeholder: "بحث في السجلات والقوانين والمستندات..."
  };

  const tEn = {
    title: "Sovereign Legal Affairs, Litigation & Regulatory Platform",
    subtitle: "Electronic governance, digital signatures, and AI legal advisors - Sudan Vision 2035",
    tab_dashboard: "Sovereign Dashboard",
    tab_litigation: "Litigation & Court Cases",
    tab_contracts: "Contract Lifecycle Hub",
    tab_regulations: "Federal Regulations & Decrees",
    tab_opinions: "Legal Opinions & Fatawa",
    tab_compliance: "Compliance & Risk Register",
    tab_advisor: "AI Legal Advisor (Gemini)",
    kpi_active_cases: "Active Cases",
    kpi_contracts_review: "Contracts in Review",
    kpi_compliance_score: "Ministerial Compliance Index",
    kpi_active_warnings: "Active warning notices",
    kpi_total_risks: "Tracked Legal Risks",
    kpi_opinions_issued: "Issued consultations",
    search_placeholder: "Search cases, regulations, contracts..."
  };

  const t = currentLanguage === "ar" ? tAr : tEn;

  // Render KPIs helper
  const renderKPIs = () => {
    const activeCasesCount = cases.filter(c => c.status !== "decided").length;
    const pendingContractsCount = contracts.filter(c => c.status !== "executed").length;
    const avgCompliance = compliance.length ? Math.round(compliance.reduce((acc, curr) => acc + curr.score, 0) / compliance.length) : 95;
    const risksCount = risks.length;
    const opinionsCount = opinions.length;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-lg text-amber-700">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{activeCasesCount}</div>
            <div className="text-xs text-gray-500">{t.kpi_active_cases}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-700">
            <PenTool className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{pendingContractsCount}</div>
            <div className="text-xs text-gray-500">{t.kpi_contracts_review}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-700">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{avgCompliance}%</div>
            <div className="text-xs text-gray-500">{t.kpi_compliance_score}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-700">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{opinionsCount}</div>
            <div className="text-xs text-gray-500">{t.kpi_opinions_issued}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-rose-100 p-3 rounded-lg text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{risksCount}</div>
            <div className="text-xs text-gray-500">{t.kpi_total_risks}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FAFBFB] p-6 rounded-2xl border border-gray-200">
      {/* Header and Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-7 w-7 text-sudan-green" />
            <h1 className="text-2xl font-bold font-sans text-gray-900 tracking-tight">{t.title}</h1>
          </div>
          <p className="text-sm text-gray-500 font-mono">{t.subtitle}</p>
        </div>
        
        {/* Sovereign Seals & Secure Badge */}
        <div className="flex items-center gap-3 mt-4 md:mt-0 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl border border-emerald-100">
          <Fingerprint className="h-5 w-5 text-emerald-600 animate-pulse" />
          <div className="text-right">
            <span className="block text-xs font-bold font-sans">
              {currentLanguage === "ar" ? "نظام موثوق مشفر بالكامل" : "Sovereign Fully Encrypted System"}
            </span>
            <span className="block text-[10px] text-emerald-600 font-mono">ID-SECURE: Vision 2035</span>
          </div>
        </div>
      </div>

      {/* Global Search and Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className={`absolute ${currentLanguage === "ar" ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-gray-400`} />
          <input 
            type="text" 
            placeholder={t.search_placeholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-slate-50 border border-gray-200 rounded-lg py-2 ${currentLanguage === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} text-sm focus:outline-none focus:ring-1 focus:ring-sudan-green text-gray-900`}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchAllData}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{currentLanguage === "ar" ? "مزامنة البيانات" : "Synchronize System"}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-3 mb-6 scrollbar-hide">
        {[
          { id: "dashboard", label: t.tab_dashboard, icon: BarChart3 },
          { id: "litigation", label: t.tab_litigation, icon: Scale },
          { id: "contracts", label: t.tab_contracts, icon: PenTool },
          { id: "regulations", label: t.tab_regulations, icon: Database },
          { id: "opinions", label: t.tab_opinions, icon: BookOpen },
          { id: "compliance", label: t.tab_compliance, icon: ShieldAlert },
          { id: "ai-advisor", label: t.tab_advisor, icon: Sparkles }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id 
                ? "bg-sudan-green text-white font-medium shadow-md" 
                : "bg-white text-gray-600 hover:bg-slate-50 border border-gray-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sudan-green mb-4"></div>
          <p className="text-xs text-gray-500 font-sans">
            {currentLanguage === "ar" ? "جاري تحميل البيانات القانونية الموثوقة..." : "Loading authenticated legal records..."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {renderKPIs()}

              {/* Dashboard Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Pending Court Hearings */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <h2 className="text-md font-sans font-bold text-gray-900">
                        {currentLanguage === "ar" ? "الجلسات والآجال القضائية القادمة" : "Upcoming Court Hearings & Deadlines"}
                      </h2>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-mono">Federal Docket</span>
                  </div>

                  <div className="space-y-4">
                    {cases.map((c, i) => (
                      <div key={c.id || i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold uppercase">{c.type}</span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {c.id}</span>
                          </div>
                          <h3 className="text-xs font-sans font-medium text-gray-900">
                            {currentLanguage === "ar" ? c.titleAr : c.titleEn}
                          </h3>
                          <p className="text-[11px] text-gray-500 font-sans mt-1">
                            📍 {c.court}
                          </p>
                        </div>
                        <div className="text-right sm:text-left">
                          <span className="block text-[11px] text-amber-700 font-sans font-medium">📅 {c.deadlines}</span>
                          <button 
                            onClick={() => { setSelectedCase(c); setActiveTab("litigation"); }}
                            className="text-[10px] text-sudan-green hover:underline mt-1 block cursor-pointer"
                          >
                            {currentLanguage === "ar" ? "عرض تفاصيل ملف القضية ➔" : "View Case File ➔"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Sovereign Integrity Check Alerts */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <ShieldAlert className="h-5 w-5 text-rose-600" />
                    <h2 className="text-md font-sans font-bold text-gray-900">
                      {currentLanguage === "ar" ? "تنبيهات الامتثال والمخالفات الفورية" : "Sovereign Compliance Flags"}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {enforcements.slice(0, 3).map((enf, i) => (
                      <div key={enf.id || i} className="p-3 rounded-lg border border-rose-100 bg-rose-50/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-rose-800 font-sans">{enf.violationType}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{enf.date}</span>
                        </div>
                        <h4 className="text-xs font-sans font-bold text-gray-900">
                          {currentLanguage === "ar" ? enf.targetNameAr : enf.targetNameEn}
                        </h4>
                        <p className="text-[10px] text-rose-700 font-sans mt-1 leading-relaxed">
                          {currentLanguage === "ar" ? enf.penaltyAr : enf.penaltyEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. System Activity Immutable Ledger */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-emerald-700" />
                  <h2 className="text-md font-sans font-bold text-gray-900">
                    {currentLanguage === "ar" ? "دفتر مراجعة الحركات والأعمال القانونية السيادي (بلوكشين جزئي)" : "Sovereign Immutable Legal Audit Logs"}
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-right">
                        <th className="p-3">{currentLanguage === "ar" ? "نوع العملية" : "Event Type"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "الوصف" : "Action"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "القائم بالعمل" : "Actor"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "التوقيع الزمني" : "Timestamp"}</th>
                        <th className="p-3 font-mono">{currentLanguage === "ar" ? "التشفير الهاش" : "SHA Hash"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.slice(0, 5).map((log, i) => (
                        <tr key={log.id || i} className="hover:bg-slate-50 text-gray-700">
                          <td className="p-3 font-bold text-emerald-800">{log.eventType}</td>
                          <td className="p-3">{currentLanguage === "ar" ? log.descriptionAr : log.descriptionEn}</td>
                          <td className="p-3">{log.actorName} ({log.actorRole})</td>
                          <td className="p-3 font-mono text-slate-400">{log.timestamp}</td>
                          <td className="p-3 font-mono text-[10px] text-slate-500 select-all">{log.systemHash}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Litigation Screen */}
          {activeTab === "litigation" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Cases List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md font-sans font-bold text-gray-900">
                      {currentLanguage === "ar" ? "سجل القضايا والتقاضي المرفوع ضد/لصالح الوزارة" : "Litigation & Dispute Register"}
                    </h2>
                    <span className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-mono">{cases.length} cases</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cases.map((c, i) => (
                      <div 
                        key={c.id || i} 
                        onClick={() => setSelectedCase(c)}
                        className={`p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-start gap-4 rounded-lg my-1 ${selectedCase?.id === c.id ? "bg-emerald-50 border-r-4 border-sudan-green" : ""}`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">{c.type}</span>
                            <span className="text-[10px] text-slate-400 font-mono"># {c.id}</span>
                          </div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">
                            {currentLanguage === "ar" ? c.titleAr : c.titleEn}
                          </h3>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-sans">
                            <span>🏛️ {c.court}</span>
                            <span>⚖️ {currentLanguage === "ar" ? "المدعي:" : "Plaintiff:"} {c.plaintiff}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-sans font-medium capitalize ${
                            c.status === "decided" ? "bg-emerald-100 text-emerald-800" :
                            c.status === "active_hearing" ? "bg-amber-100 text-amber-800 animate-pulse" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {c.status}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono mt-2">{c.deadlines}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to submit a new Case */}
                {["Legal Officer", "Litigation Officer", "Director of Legal Affairs", "Super Administrator"].includes(role) && (
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-sans font-bold text-gray-900 border-b border-slate-100 pb-2 mb-4">
                      {currentLanguage === "ar" ? "قيد قضية جديدة في النظام القضائي الموحد" : "File a New Legal Case"}
                    </h3>

                    <form onSubmit={handleCreateCase} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "عنوان القضية بالعربية" : "Case Title (AR)"}</label>
                        <input 
                          type="text" 
                          required
                          value={newCaseForm.titleAr}
                          onChange={e => setNewCaseForm({...newCaseForm, titleAr: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "عنوان القضية بالإنجليزية" : "Case Title (EN)"}</label>
                        <input 
                          type="text" 
                          required
                          value={newCaseForm.titleEn}
                          onChange={e => setNewCaseForm({...newCaseForm, titleEn: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "نوع التقاضي" : "Litigation Category"}</label>
                        <select 
                          value={newCaseForm.type}
                          onChange={e => setNewCaseForm({...newCaseForm, type: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green"
                        >
                          <option value="commercial">Commercial Case (نزاع تجاري)</option>
                          <option value="administrative">Administrative Case (دعوى إدارية)</option>
                          <option value="arbitration">Arbitration (تحكيم تجاري)</option>
                          <option value="civil">Civil Case (دعوى مدنية)</option>
                          <option value="criminal">Criminal Referral (إحالة جنائية)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "المحكمة المختصة" : "Competent Court"}</label>
                        <input 
                          type="text" 
                          required
                          value={newCaseForm.court}
                          onChange={e => setNewCaseForm({...newCaseForm, court: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "المدعي" : "Plaintiff"}</label>
                        <input 
                          type="text" 
                          required
                          value={newCaseForm.plaintiff}
                          onChange={e => setNewCaseForm({...newCaseForm, plaintiff: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "المدعى عليه" : "Defendant"}</label>
                        <input 
                          type="text" 
                          required
                          value={newCaseForm.defendant}
                          onChange={e => setNewCaseForm({...newCaseForm, defendant: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "الآجال والمهل القانونية" : "Legal Deadlines"}</label>
                        <input 
                          type="text" 
                          required
                          value={newCaseForm.deadlines}
                          placeholder="e.g. 2026-08-01 (تقديم الأدلة الختامية)"
                          onChange={e => setNewCaseForm({...newCaseForm, deadlines: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green"
                        />
                      </div>
                      <div className="md:col-span-2 pt-2">
                        <button 
                          type="submit"
                          className="w-full py-2 bg-sudan-green hover:bg-emerald-800 text-white font-sans font-medium rounded-lg shadow cursor-pointer text-xs"
                        >
                          {currentLanguage === "ar" ? "تقييد وحوكمة القضية 🏛️" : "Register and Governance Case 🏛️"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Case Details Sidebar Panel */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  {selectedCase ? (
                    <div className="space-y-5">
                      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                        <h3 className="font-sans font-bold text-gray-900 text-sm">
                          {currentLanguage === "ar" ? "تفاصيل ملف القضية" : "Case File Details"}
                        </h3>
                        <button 
                          onClick={() => setSelectedCase(null)}
                          className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "إغلاق" : "Close"}
                        </button>
                      </div>

                      <div className="space-y-3 text-xs font-sans">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-mono block">TITLE</span>
                          <span className="font-bold text-slate-800 block mt-0.5">
                            {currentLanguage === "ar" ? selectedCase.titleAr : selectedCase.titleEn}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] text-gray-400 block font-sans">{currentLanguage === "ar" ? "المدعي" : "Plaintiff"}</span>
                            <span className="font-medium text-slate-800">{selectedCase.plaintiff}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block font-sans">{currentLanguage === "ar" ? "المدعى عليه" : "Defendant"}</span>
                            <span className="font-medium text-slate-800">{selectedCase.defendant}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 block font-sans">{currentLanguage === "ar" ? "أبرز المهل القانونية" : "Deadlines"}</span>
                          <span className="font-medium text-amber-700">{selectedCase.deadlines}</span>
                        </div>

                        {/* List of hearings */}
                        <div>
                          <span className="text-[10px] text-gray-400 block font-sans border-b border-slate-100 pb-1 mb-2">
                            {currentLanguage === "ar" ? "محاضر جلسات المحكمة الموثقة" : "Authenticated Court Hearing Logs"}
                          </span>
                          <div className="space-y-2">
                            {selectedCase.hearings && selectedCase.hearings.length > 0 ? (
                              selectedCase.hearings.map((h: any, i: number) => (
                                <div key={h.id || i} className="p-2 bg-emerald-50/50 rounded border border-emerald-100">
                                  <div className="flex justify-between text-[10px] text-emerald-800 font-bold mb-1">
                                    <span>الجلسة رقم {i+1}</span>
                                    <span>📅 {h.date}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-700 leading-relaxed">
                                    {currentLanguage === "ar" ? h.resultAr : h.resultEn}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400 text-[11px] italic">No hearings registered.</span>
                            )}
                          </div>
                        </div>

                        {/* List of Evidence */}
                        <div>
                          <span className="text-[10px] text-gray-400 block font-sans border-b border-slate-100 pb-1 mb-2">
                            {currentLanguage === "ar" ? "الأدلة والقرائن الرسمية المستلمة" : "Evidence Logs"}
                          </span>
                          <div className="space-y-1">
                            {selectedCase.evidence && selectedCase.evidence.length > 0 ? (
                              selectedCase.evidence.map((ev: any, i: number) => (
                                <div key={ev.id || i} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded">
                                  <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="text-[11px] text-slate-700">{currentLanguage === "ar" ? ev.nameAr : ev.nameEn}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400 text-[11px] italic">No evidence registered.</span>
                            )}
                          </div>
                        </div>

                        {/* Final Judgment Block */}
                        {selectedCase.judgment && (
                          <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-lg">
                            <span className="text-[10px] font-bold text-emerald-900 block font-sans">
                              {currentLanguage === "ar" ? "الحكم الختامي الصادر من المحكمة" : "Final Court Judgment"}
                            </span>
                            <p className="text-[11px] text-emerald-900 font-sans mt-1 leading-relaxed font-medium">
                              {selectedCase.judgment}
                            </p>
                          </div>
                        )}

                        {/* Actions for Case Management */}
                        {["Director of Legal Affairs", "Litigation Officer", "Super Administrator"].includes(role) && (
                          <div className="pt-3 border-t border-slate-100 space-y-4">
                            
                            {/* Form to add hearing */}
                            <div className="p-3 bg-slate-50 rounded border border-slate-200">
                              <span className="block text-[11px] font-bold text-slate-700 mb-2">
                                {currentLanguage === "ar" ? "إضافة محضر جلسة جديد" : "Record New Hearing Result"}
                              </span>
                              <div className="space-y-2">
                                <input 
                                  type="date"
                                  value={newHearingForm.date}
                                  onChange={e => setNewHearingForm({...newHearingForm, date: e.target.value})}
                                  className="w-full bg-white border border-gray-200 rounded p-1.5"
                                />
                                <textarea 
                                  placeholder={currentLanguage === "ar" ? "القرار أو النتيجة بالعربية" : "Result / Order in Arabic"}
                                  value={newHearingForm.resultAr}
                                  onChange={e => setNewHearingForm({...newHearingForm, resultAr: e.target.value})}
                                  className="w-full bg-white border border-gray-200 rounded p-1.5 h-12"
                                />
                                <textarea 
                                  placeholder={currentLanguage === "ar" ? "القرار بالإنجليزية" : "Result / Order in English"}
                                  value={newHearingForm.resultEn}
                                  onChange={e => setNewHearingForm({...newHearingForm, resultEn: e.target.value})}
                                  className="w-full bg-white border border-gray-200 rounded p-1.5 h-12"
                                />
                                <button 
                                  type="button"
                                  onClick={() => handleAddHearing(selectedCase.id)}
                                  className="w-full py-1.5 bg-sudan-green text-white text-xs rounded font-medium cursor-pointer"
                                >
                                  {currentLanguage === "ar" ? "تأكيد وإضافة المحضر" : "Add Hearing Log"}
                                </button>
                              </div>
                            </div>

                            {/* Final decision form */}
                            {!selectedCase.judgment && (
                              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                                <span className="block text-[11px] font-bold text-slate-700 mb-2">
                                  {currentLanguage === "ar" ? "إصدار وتوثيق الحكم الختامي" : "Issue & Record Judgment"}
                                </span>
                                <div className="space-y-2">
                                  <textarea 
                                    placeholder={currentLanguage === "ar" ? "نص منطوق الحكم النهائي بالعربية..." : "Final text of the ruling..."}
                                    value={judgmentForm.judgment}
                                    onChange={e => setJudgmentForm({...judgmentForm, judgment: e.target.value})}
                                    className="w-full bg-white border border-gray-200 rounded p-1.5 h-16"
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => handleIssueJudgment(selectedCase.id)}
                                    className="w-full py-1.5 bg-rose-700 text-white text-xs rounded font-medium cursor-pointer hover:bg-rose-800"
                                  >
                                    {currentLanguage === "ar" ? "إيداع الحكم وإغلاق ملف القضية" : "Deposit Judgment and Close File"}
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Scale className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-sans">
                        {currentLanguage === "ar" ? "اختر قضية من القائمة الجانبية لعرض تفاصيلها وأوراقها القانونية المعتمدة" : "Select a case from the register to display legal dossier."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. Contract Lifecycle Management (CLM) */}
          {activeTab === "contracts" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Contracts List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md font-sans font-bold text-gray-900">
                      {currentLanguage === "ar" ? "مستودع العقود الحكومية والشراكات الاستثمارية" : "Contract Lifecycle & MoUs Repository"}
                    </h2>
                    <span className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-mono">{contracts.length} agreements</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {contracts.map((c, i) => (
                      <div 
                        key={c.id || i} 
                        onClick={() => setSelectedContract(c)}
                        className={`p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-start gap-4 rounded-lg my-1 ${selectedContract?.id === c.id ? "bg-emerald-50 border-r-4 border-sudan-green" : ""}`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">{c.type}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                          </div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">
                            {currentLanguage === "ar" ? c.titleAr : c.titleEn}
                          </h3>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-sans">
                            <span>🤝 {c.parties}</span>
                            <span>💰 {Number(c.value).toLocaleString()} SDG</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-sans font-medium capitalize ${
                            c.status === "executed" ? "bg-emerald-100 text-emerald-800" :
                            c.status === "review_financial" ? "bg-blue-100 text-blue-800" :
                            "bg-slate-100 text-slate-800"
                          }`}>
                            {c.status}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono mt-2">Exp: {c.expiryDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Draft Contract Form */}
                {["Legal Officer", "Contract Manager", "Director of Legal Affairs", "Super Administrator"].includes(role) && (
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-sans font-bold text-gray-900 border-b border-slate-100 pb-2 mb-4">
                      {currentLanguage === "ar" ? "صياغة ورفع عقد حكومي أو اتفاقية جديدة" : "Draft and Upload Government Agreement"}
                    </h3>

                    <form onSubmit={handleCreateContract} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "اسم الاتفاقية بالعربية" : "Contract Title (AR)"}</label>
                        <input 
                          type="text" required value={newContractForm.titleAr}
                          onChange={e => setNewContractForm({...newContractForm, titleAr: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "اسم الاتفاقية بالإنجليزية" : "Contract Title (EN)"}</label>
                        <input 
                          type="text" required value={newContractForm.titleEn}
                          onChange={e => setNewContractForm({...newContractForm, titleEn: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "نوع العقد" : "Contract Type"}</label>
                        <select 
                          value={newContractForm.type}
                          onChange={e => setNewContractForm({...newContractForm, type: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                        >
                          <option value="ppp">Public-Private Partnership (عقد شراكة PPP)</option>
                          <option value="investment">Investment Agreement (اتفاقية استثمارية)</option>
                          <option value="concession">Concession Contract (عقد امتياز تجاري)</option>
                          <option value="international">International Treaty/MoU (مذكرة تفاهم دولية)</option>
                          <option value="procurement">Service Agreement (اتفاقية تقديم خدمات)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "القيمة التقديرية (SDG)" : "Contract Value (SDG)"}</label>
                        <input 
                          type="number" required value={newContractForm.value}
                          onChange={e => setNewContractForm({...newContractForm, value: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "أطراف الاتفاقية والشركاء" : "Involved Parties"}</label>
                        <input 
                          type="text" required value={newContractForm.parties}
                          onChange={e => setNewContractForm({...newContractForm, parties: e.target.value})}
                          placeholder="وزارة التجارة والطرف الشريك..."
                          className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                        />
                      </div>
                      <div className="md:col-span-2 pt-2">
                        <button 
                          type="submit"
                          className="w-full py-2 bg-sudan-green hover:bg-emerald-800 text-white font-sans font-medium rounded-lg shadow cursor-pointer text-xs"
                        >
                          {currentLanguage === "ar" ? "إيداع مسودة العقد وبدء دورة الحوكمة" : "Deposit Draft & Start Approval Workflow"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Sidebar: Workflow Progress and Sovereign Digital Signatures */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  {selectedContract ? (
                    <div className="space-y-5">
                      <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                        <h3 className="font-sans font-bold text-gray-900 text-sm">
                          {currentLanguage === "ar" ? "دورة المراجعة والاعتماد المالي والسيادي" : "Approval & Review Workflow"}
                        </h3>
                        <button onClick={() => setSelectedContract(null)} className="text-[10px] text-gray-400 cursor-pointer">Close</button>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg text-xs font-sans space-y-1">
                        <span className="text-[10px] text-gray-400 block">CURRENT TITLE</span>
                        <span className="font-bold text-slate-800 block">
                          {currentLanguage === "ar" ? selectedContract.titleAr : selectedContract.titleEn}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-2">Expiring Date: {selectedContract.expiryDate}</span>
                      </div>

                      {/* Timeline steps */}
                      <div className="space-y-4 relative pl-4 border-l border-slate-200 py-2 ml-2 text-xs font-sans">
                        {selectedContract.approvalWorkflow.map((step: any, index: number) => (
                          <div key={index} className="relative pl-6">
                            <div className={`absolute -left-[23px] top-0.5 rounded-full p-1 border bg-white ${
                              step.status === "approved" ? "border-emerald-500 text-emerald-500" : "border-slate-300 text-slate-400"
                            }`}>
                              <CheckCircle2 className="h-3 w-3" />
                            </div>
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-slate-800 block">{step.role}</span>
                                <span className="text-[10px] text-slate-500">{step.name || "Pending..."}</span>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block text-[10px] px-2 py-0.5 rounded ${
                                  step.status === "approved" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                                }`}>
                                  {step.status}
                                </span>
                                <span className="block text-[10px] text-slate-400 mt-1">{step.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Display signature if signed completely */}
                      {selectedContract.status === "executed" && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center space-y-2">
                          <Fingerprint className="h-8 w-8 text-emerald-600 mx-auto" />
                          <span className="block text-xs font-bold text-emerald-900">
                            {currentLanguage === "ar" ? "موقع رقمياً ومصادق بالهوية الفيدرالية" : "Digitally Signed & Certified"}
                          </span>
                          <span className="block font-mono text-[9px] text-slate-500 select-all break-all bg-white p-1 border rounded">
                            {selectedContract.digitalSignature}
                          </span>
                        </div>
                      )}

                      {/* Interaction based on roles */}
                      {selectedContract.status !== "executed" && (
                        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                          {/* Legal Reviewer action */}
                          {role === "Legal Officer" && selectedContract.status === "draft" && (
                            <button 
                              onClick={() => handleReviewContract(selectedContract.id, "Legal Officer", "approved")}
                              className="w-full py-2 bg-sudan-green text-white font-medium rounded text-xs cursor-pointer hover:bg-emerald-800"
                            >
                              {currentLanguage === "ar" ? "المصادقة والموافقة القانونية مسؤولة ➔" : "Approve Legal Review ➔"}
                            </button>
                          )}

                          {/* Financial Reviewer action */}
                          {role === "Financial Reviewer" && selectedContract.status === "review_financial" && (
                            <button 
                              onClick={() => handleReviewContract(selectedContract.id, "Financial Reviewer", "approved")}
                              className="w-full py-2 bg-blue-700 text-white font-medium rounded text-xs cursor-pointer hover:bg-blue-800"
                            >
                              {currentLanguage === "ar" ? "الموافقة والاعتماد المالي الفيدرالي ➔" : "Approve Financial Allocation ➔"}
                            </button>
                          )}

                          {/* Director action */}
                          {role === "Director of Legal Affairs" && selectedContract.status === "review_governance" && (
                            <button 
                              onClick={() => handleReviewContract(selectedContract.id, "Director of Legal Affairs", "approved")}
                              className="w-full py-2 bg-purple-700 text-white font-medium rounded text-xs cursor-pointer hover:bg-purple-800"
                            >
                              {currentLanguage === "ar" ? "تأييد ومراجعة مدير عام الشؤون القانونية ➔" : "Confirm Legal Directorate Approval ➔"}
                            </button>
                          )}

                          {/* Minister's Ultimate digital signing flow */}
                          {role === "Government_Minister" && selectedContract.status === "review_minister" && (
                            <div className="p-3 bg-amber-50 rounded border border-amber-200 space-y-3">
                              <span className="block text-xs font-bold text-amber-800">
                                {currentLanguage === "ar" ? "توقيع سيادي رقمي معزز بالهوية الوطنية" : "Sovereign Electronic Signature Portal"}
                              </span>

                              {signingStep === 0 ? (
                                <button 
                                  onClick={() => { setSigningContractId(selectedContract.id); triggerDigitalSignature(); }}
                                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded flex items-center justify-center gap-2 cursor-pointer text-xs"
                                >
                                  <Fingerprint className="h-4 w-4" />
                                  <span>{currentLanguage === "ar" ? "توقيع العقد بصفة الوزير الاتحادية" : "Sign as Federal Minister"}</span>
                                </button>
                              ) : signingStep === 1 ? (
                                <div className="text-center py-2">
                                  <div className="animate-spin h-5 w-5 border-b-2 border-amber-600 mx-auto mb-1"></div>
                                  <span className="text-[10px] text-slate-500">جاري الاتصال بالهوية الرقمية القومية...</span>
                                </div>
                              ) : signingStep === 2 ? (
                                <div className="space-y-2">
                                  <input 
                                    type="text" 
                                    placeholder="الرقم الوطني السوداني"
                                    value={citizenNationalId}
                                    onChange={e => setCitizenNationalId(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs text-slate-800"
                                  />
                                  <input 
                                    type="password" 
                                    placeholder="رمز المرور الأمن (PIN)"
                                    value={pinCode}
                                    onChange={e => setPinCode(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs text-slate-800"
                                  />
                                  <button 
                                    onClick={confirmSigning}
                                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs cursor-pointer font-bold"
                                  >
                                    تأكيد التوقيع الرقمي والمصادقة
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center text-emerald-800 font-sans text-xs">
                                  ✓ تمت المصادقة والتوقيع بنجاح في السجل الاتحادي
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <PenTool className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-sans">
                        {currentLanguage === "ar" ? "اختر عقداً تجارياً لمراجعة شروطه، أو توقيعه رقمياً وتتبع تقدم سير المراجعة" : "Select an agreement from the hub to check workflows or authorize digital signatures."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. Regulations & Legislation */}
          {activeTab === "regulations" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-6"
            >
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-sudan-green" />
                    <h2 className="text-md font-sans font-bold text-gray-900">
                      {currentLanguage === "ar" ? "التشريعات الفيدرالية، القرارات الوزارية، ومشاريع الأنظمة" : "Sovereign Legislation, Ministerial Orders & Circulars"}
                    </h2>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-mono font-bold">Official Federal Register</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {regulations.map((reg, index) => (
                    <div key={reg.id || index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative overflow-hidden">
                      <div className="absolute right-0 top-0 h-1.5 w-full bg-sudan-green"></div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>CATEGORY: {reg.category}</span>
                        <span>ID: {reg.id}</span>
                      </div>
                      
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">
                        {currentLanguage === "ar" ? reg.titleAr : reg.titleEn}
                      </h3>

                      <div className="space-y-1 text-[11px] text-slate-500 font-sans">
                        <p>✓ {currentLanguage === "ar" ? "تاريخ النفاذ السيادي:" : "Effective Date:"} <span className="font-bold text-emerald-800">{reg.effectiveDate}</span></p>
                        <p>✓ {currentLanguage === "ar" ? "تاريخ انتهاء المفعول:" : "Expiration Date:"} <span>{reg.expirationDate || "Permanent (دائم)"}</span></p>
                        <p>✓ {currentLanguage === "ar" ? "الاستشارة والاستطلاع الشعبي:" : "Public Consultation:"} <span className="font-bold uppercase text-amber-700">{reg.publicConsultationStatus}</span></p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${reg.status === "published" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{reg.status}</span>
                        <button className="text-[10px] hover:underline text-sudan-green font-sans font-bold cursor-pointer">
                          {currentLanguage === "ar" ? "تحميل المستند الموثق ➔" : "Download Verified Code ➔"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form to submit draft legislation */}
              {["Director of Legal Affairs", "Super Administrator"].includes(role) && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
                  <h3 className="text-sm font-sans font-bold text-gray-900 border-b border-slate-100 pb-2 mb-4">
                    {currentLanguage === "ar" ? "نشر أو طرح مسودة قرار أو لائحة تنظيمية جديدة" : "Publish or Draft New Regulation / Ministerial Order"}
                  </h3>

                  <form onSubmit={handleCreateReg} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "عنوان القرار بالعربية" : "Regulation Title (AR)"}</label>
                      <input 
                        type="text" required value={newRegForm.titleAr}
                        onChange={e => setNewRegForm({...newRegForm, titleAr: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "عنوان القرار بالإنجليزية" : "Regulation Title (EN)"}</label>
                      <input 
                        type="text" required value={newRegForm.titleEn}
                        onChange={e => setNewRegForm({...newRegForm, titleEn: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "التصنيف والنوع" : "Category"}</label>
                      <select 
                        value={newRegForm.category}
                        onChange={e => setNewRegForm({...newRegForm, category: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      >
                        <option value="laws">Federal Law / Code (قانون اتحادي)</option>
                        <option value="ministerial_decisions">Ministerial Decision (قرار وزاري سيادي)</option>
                        <option value="executive_regulations">Executive Regulations (لائحة تنفيذية فنية)</option>
                        <option value="circulars">Administrative Circular (منشور إداري عمومي)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "تاريخ النفاذ المعتمد" : "Effective Date"}</label>
                      <input 
                        type="text" required value={newRegForm.effectiveDate}
                        placeholder="e.g. 2026-07-20"
                        onChange={e => setNewRegForm({...newRegForm, effectiveDate: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "حالة القرار الفوري" : "Publication Status"}</label>
                      <select 
                        value={newRegForm.status}
                        onChange={e => setNewRegForm({...newRegForm, status: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      >
                        <option value="published">Published (نافذ ومنشور بالجريدة الرسمية)</option>
                        <option value="draft">Draft / Under Study (مسودة قيد الدراسة)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "الاستطلاع والرصد الشعبي" : "Public Consultation Status"}</label>
                      <select 
                        value={newRegForm.publicConsultationStatus}
                        onChange={e => setNewRegForm({...newRegForm, publicConsultationStatus: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      >
                        <option value="completed">Not Required / Completed (مكتمل أو غير مطلوب)</option>
                        <option value="active">Active (متاح للمستثمرين والجمهور لتقديم مرئياتهم)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <button 
                        type="submit"
                        className="w-full py-2 bg-sudan-green hover:bg-emerald-800 text-white font-sans font-medium rounded-lg shadow cursor-pointer text-xs"
                      >
                        {currentLanguage === "ar" ? "نشر وتدوين في السجل التشريعي الفيدرالي" : "Publish to Sovereign Legislation Register"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* 5. Legal Opinions Desk */}
          {activeTab === "opinions" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Opinions list */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-md font-sans font-bold text-gray-900 border-b border-slate-100 pb-2 mb-4">
                    {currentLanguage === "ar" ? "دفتر الفتاوى والآراء الاستشارية المعتمدة" : "Sovereign Legal Opinions & Advisories Register"}
                  </h2>

                  <div className="space-y-4">
                    {opinions.map((op, i) => (
                      <div key={op.id || i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>REQUESTER: {op.requester}</span>
                          <span>ID: {op.id} - {op.date}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {currentLanguage === "ar" ? op.requestTitleAr : op.requestTitleEn}
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-3 rounded border border-slate-100">
                          💡 <span className="font-bold text-emerald-800">{currentLanguage === "ar" ? "رأي المستشار القانوني:" : "Legal Opinion Result:"}</span> {currentLanguage === "ar" ? op.opinionSummaryAr : op.opinionSummaryEn}
                        </p>
                        <div className="text-right text-[10px] text-slate-500 font-sans">
                          {currentLanguage === "ar" ? "صيغ بواسطة باحث أول:" : "Drafted by Senior Counsel:"} <span className="font-bold">{op.analyst}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Request form */}
              {["Legal Officer", "Legal Researcher", "Compliance Officer", "Super Administrator", "Director of Legal Affairs"].includes(role) && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs font-sans space-y-4">
                  <h3 className="text-sm font-sans font-bold text-gray-900 border-b border-slate-100 pb-2">
                    {currentLanguage === "ar" ? "تسجيل طلب فتوى أو رأي استشاري جديد" : "Request a Formal Legal Opinion"}
                  </h3>

                  <form onSubmit={handleCreateOpinion} className="space-y-4">
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "موضوع الاستشارة بالعربية" : "Subject of Query (AR)"}</label>
                      <input 
                        type="text" required value={newOpinionForm.requestTitleAr}
                        onChange={e => setNewOpinionForm({...newOpinionForm, requestTitleAr: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "موضوع الاستشارة بالإنجليزية" : "Subject of Query (EN)"}</label>
                      <input 
                        type="text" required value={newOpinionForm.requestTitleEn}
                        onChange={e => setNewOpinionForm({...newOpinionForm, requestTitleEn: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "الجهة الطالبة للاستشارة" : "Requesting Department / Body"}</label>
                      <input 
                        type="text" required value={newOpinionForm.requester}
                        placeholder="e.g. إدارة التنمية الصناعية"
                        onChange={e => setNewOpinionForm({...newOpinionForm, requester: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "ملخص الرأي والفتوى القانونية المعتمدة" : "Opinion Verdict"}</label>
                      <textarea 
                        required value={newOpinionForm.opinionSummaryAr}
                        placeholder="يجوز قانوناً بموجب المادة..."
                        onChange={e => setNewOpinionForm({...newOpinionForm, opinionSummaryAr: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2 h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-bold">{currentLanguage === "ar" ? "المستشار القانوني الصائغ" : "Counsel / Analyst"}</label>
                      <input 
                        type="text" required value={newOpinionForm.analyst}
                        placeholder="أ. ماجدة الطيب"
                        onChange={e => setNewOpinionForm({...newOpinionForm, analyst: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2 bg-sudan-green hover:bg-emerald-800 text-white font-sans font-medium rounded-lg shadow cursor-pointer text-xs"
                    >
                      {currentLanguage === "ar" ? "إصدار وتعميم في المستودع المعرفي" : "Issue and Distribute Opinion"}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* 6. Compliance, Risk, & Enforcement */}
          {activeTab === "compliance" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-6"
            >
              {/* Compliance Registry */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-md font-sans font-bold text-gray-900 border-b border-slate-100 pb-2 mb-4">
                  {currentLanguage === "ar" ? "سجل رصد امتثال المنشآت والشركات للقوانين الاتحادية" : "Corporate Legal Compliance Monitor"}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans text-right">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <th className="p-3">{currentLanguage === "ar" ? "المنشأة المستهدفة" : "Target Entity"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "الفئة القانونية" : "Regulated Category"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "درجة المطابقة والالتزام" : "Compliance Score"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "حالة الامتثال" : "Status"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "تاريخ الفحص التلقائي" : "Last Verification"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "ملاحظات وتفاصيل فنية" : "Verification Notes"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {compliance.map((c, i) => (
                        <tr key={c.id || i} className="hover:bg-slate-50 text-gray-700">
                          <td className="p-3 font-bold">{currentLanguage === "ar" ? c.targetNameAr : c.targetNameEn}</td>
                          <td className="p-3 font-mono text-slate-500">{c.category}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${c.score >= 80 ? "text-emerald-700" : "text-rose-600"}`}>{c.score}%</span>
                              <div className="w-20 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full ${c.score >= 80 ? "bg-emerald-600" : "bg-rose-600"}`} style={{ width: `${c.score}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              c.status === "compliant" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                            }`}>{c.status}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-400">{c.lastChecked}</td>
                          <td className="p-3 text-[11px] text-slate-500">{currentLanguage === "ar" ? c.notesAr : c.notesEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Management Heatmap Register */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-sans font-bold text-gray-900 border-b border-slate-100 pb-2 mb-3">
                    {currentLanguage === "ar" ? "سجل تقييم المخاطر القانونية والنزاعات الاستباقي" : "Active Legal Risk & Exposure Registry"}
                  </h3>
                  
                  <div className="space-y-4">
                    {risks.map((r, i) => (
                      <div key={r.id || i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              r.severity === "high" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                            }`}>{r.severity} severity</span>
                            <span className="text-[10px] text-slate-400 font-mono">#{r.id}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {currentLanguage === "ar" ? r.titleAr : r.titleEn}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-sans mt-1">
                            💡 <span className="font-bold">{currentLanguage === "ar" ? "خطة الحد من المخاطر:" : "Mitigation Plan:"}</span> {currentLanguage === "ar" ? r.mitigationPlanAr : r.mitigationPlanEn}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block text-lg font-bold text-slate-800">{r.score}/100</span>
                          <span className="text-[10px] text-slate-400 font-mono uppercase">{r.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning and Enforcement log */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-sans font-bold text-gray-900 border-b border-slate-100 pb-2 mb-3">
                    {currentLanguage === "ar" ? "الإنفاذ القانوني والقرارات الرادعة الصادرة" : "Enforced Warnings & License Suspensions"}
                  </h3>

                  <div className="space-y-4">
                    {enforcements.map((enf, i) => (
                      <div key={enf.id || i} className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                        <div className="flex justify-between items-center text-[10px] text-rose-800 font-bold mb-1">
                          <span>{enf.violationType}</span>
                          <span>📅 {enf.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {currentLanguage === "ar" ? enf.targetNameAr : enf.targetNameEn}
                        </h4>
                        <p className="text-[11px] text-slate-700 leading-relaxed mt-1 font-medium">
                          {currentLanguage === "ar" ? enf.penaltyAr : enf.penaltyEn}
                        </p>
                        <div className="mt-2 pt-2 border-t border-rose-100/30 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                          <span>🔗 {enf.linkedModule}</span>
                          <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-bold uppercase">{enf.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. AI Legal Advisor Playground (With Live Gemini Analysis) */}
          {activeTab === "ai-advisor" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-6"
            >
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  <Sparkles className="h-6 w-6 text-sudan-green" />
                  <h2 className="text-md font-sans font-bold text-gray-900">
                    {currentLanguage === "ar" ? "مستشار الذكاء الاصطناعي القانوني الفيدرالي لوزارة التجارة" : "Sovereign AI Legal Intelligence Suite"}
                  </h2>
                </div>
                <p className="text-xs text-gray-500 font-sans mb-4">
                  {currentLanguage === "ar" 
                    ? "بوابة الذكاء الاصطناعي الموثقة لفحص العقود، كشف الثغرات والنزاعات الاستباقية، والتأكد من مطابقة قانون المعاملات واللوائح لجمهورية السودان لعام 2026."
                    : "Sovereign platform utilizing Gemini-3.5 to classify security levels, extract compliance requirements, recommend amendments, and check regulatory conflicts."}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-sans">
                  
                  {/* Left: Input parameters */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">{currentLanguage === "ar" ? "عنوان المستند القانوني المطلوب تحليله" : "Legal Document Title"}</label>
                      <input 
                        type="text"
                        value={aiDocTitle}
                        onChange={e => setAiDocTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">{currentLanguage === "ar" ? "نص العقد أو المستند القانوني أو البند" : "Contract or Document Content text"}</label>
                      <textarea 
                        value={aiDocContent}
                        onChange={e => setAiDocContent(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-sudan-green h-48 font-mono text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-2">{currentLanguage === "ar" ? "اختر نوع التحليل الذكي المطلوب" : "Select AI Analysis Engine Type"}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "classify", label: "Classification (التصنيف الأمني وحماية الأسرار)", color: "border-blue-200 hover:bg-blue-50" },
                          { id: "summarize", label: "Summarize (تلخيص وتوضيح البنود)", color: "border-emerald-200 hover:bg-emerald-50" },
                          { id: "risk_detect", label: "Detect Loop-holes (كشف الثغرات والمخاطر)", color: "border-rose-200 hover:bg-rose-50" },
                          { id: "recommend_clauses", label: "Recommend Clauses (توصية الصياغة القانونية)", color: "border-purple-200 hover:bg-purple-50" },
                          { id: "conflict_check", label: "Regulatory Conflicts (مطابقة تشريعات السودان)", color: "border-amber-200 hover:bg-amber-50" },
                          { id: "litigation_prediction", label: "Litigation Predict (احتمالات النزاع والقضايا)", color: "border-indigo-200 hover:bg-indigo-50" }
                        ].map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setAiAnalysisType(type.id)}
                            className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                              aiAnalysisType === type.id 
                                ? "bg-slate-900 text-white border-slate-900 font-bold" 
                                : `bg-white text-slate-700 ${type.color}`
                            }`}
                          >
                            <span className="block text-[11px] font-medium leading-relaxed">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={handleAiAnalysis}
                      className="w-full py-2.5 bg-sudan-green hover:bg-emerald-800 text-white font-sans font-bold rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      {aiLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
                          <span>{currentLanguage === "ar" ? "جاري معالجة وفحص المستند بمستشار جوميني..." : "Gemini is auditing document..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>{currentLanguage === "ar" ? "تشغيل مستشار الذكاء الاصطناعي ➔" : "Execute AI Audit Analysis ➔"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: AI Output Display */}
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[400px]">
                    <div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-4">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">🤖 Sovereign Gemini Analysis Node</span>
                        <span className="text-[10px] text-slate-400 font-mono">VISION 2035</span>
                      </div>

                      {aiResult ? (
                        <div className="space-y-4 font-sans text-xs leading-relaxed">
                          
                          {/* 1. Classification Output */}
                          {aiAnalysisType === "classify" && aiResult.classification && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-sans">Security Classification:</span>
                                <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono font-bold uppercase">{aiResult.classification}</span>
                              </div>
                              <div className="p-3 bg-slate-800 rounded border border-slate-700/50">
                                <span className="font-bold text-amber-400 block mb-1">🔍 {currentLanguage === "ar" ? "التحليل والسبب القانوني:" : "Sovereign Legal Justification:"}</span>
                                <p className="text-slate-300">{currentLanguage === "ar" ? aiResult.reasonAr : aiResult.reasonEn}</p>
                              </div>
                            </div>
                          )}

                          {/* 2. Summarization Output */}
                          {aiAnalysisType === "summarize" && (aiResult.summaryAr || aiResult.summaryEn) && (
                            <div className="space-y-2">
                              <span className="text-gray-400 font-sans font-bold">✓ {currentLanguage === "ar" ? "الملخص التنفيذي القانوني المولد:" : "AI Generated Executive Summary:"}</span>
                              <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                                {(currentLanguage === "ar" ? aiResult.summaryAr : aiResult.summaryEn || []).map((bullet: string, i: number) => (
                                  <li key={i}>{bullet}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 3. Risks and Loop holes Output */}
                          {aiAnalysisType === "risk_detect" && aiResult.risks && (
                            <div className="space-y-3">
                              <span className="text-gray-400 font-sans font-bold">⚠️ {currentLanguage === "ar" ? "مخاطر وثغرات تم رصدها في الصياغة:" : "Extracted Contractual Loop-holes:"}</span>
                              <div className="space-y-2">
                                {aiResult.risks.map((risk: any, i: number) => (
                                  <div key={i} className="p-2.5 bg-rose-950/40 border border-rose-850 rounded">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-rose-400 mb-1">
                                      <span>{currentLanguage === "ar" ? risk.titleAr : risk.titleEn}</span>
                                      <span className="uppercase">{risk.severity} risk</span>
                                    </div>
                                    <p className="text-slate-300 text-[11px]">{currentLanguage === "ar" ? risk.descAr : risk.descEn}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Recommend Protective Clauses Output */}
                          {aiAnalysisType === "recommend_clauses" && aiResult.clauses && (
                            <div className="space-y-3">
                              <span className="text-gray-400 font-sans font-bold">✍ {currentLanguage === "ar" ? "بنود حماية سيادية موصى بإدراجها فوراً:" : "Recommended Fortified protective clauses:"}</span>
                              {aiResult.clauses.map((clause: any, i: number) => (
                                <div key={i} className="p-3 bg-emerald-950/40 border border-emerald-850 rounded">
                                  <h4 className="font-bold text-emerald-400 mb-1">{currentLanguage === "ar" ? clause.titleAr : clause.titleEn}</h4>
                                  <p className="text-slate-300 italic text-[11px] leading-relaxed bg-slate-900/50 p-2 border border-slate-800 rounded select-all">
                                    {currentLanguage === "ar" ? clause.textAr : clause.textEn}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 5. Conflict Check Output */}
                          {aiAnalysisType === "conflict_check" && aiResult.conflicts && (
                            <div className="space-y-3">
                              <span className="text-gray-400 font-sans font-bold">🔀 {currentLanguage === "ar" ? "تعارضات تم رصدها مع التشريعات الفيدرالية السودانية:" : "Detected Federal Regulatory Conflicts:"}</span>
                              {aiResult.conflicts.map((conflict: any, i: number) => (
                                <div key={i} className="p-2.5 bg-amber-950/40 border border-amber-850 rounded space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold text-amber-400">
                                    <span>{currentLanguage === "ar" ? conflict.regNameAr : conflict.regNameEn}</span>
                                    <span className="uppercase">{conflict.severity} CONFLICT</span>
                                  </div>
                                  <p className="text-slate-300 text-[11px]">{currentLanguage === "ar" ? conflict.conflictAr : conflict.conflictEn}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 6. Litigation Risk Prediction Output */}
                          {aiAnalysisType === "litigation_prediction" && aiResult.probability && (
                            <div className="space-y-3 p-3 bg-indigo-950/40 border border-indigo-850 rounded">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 font-sans font-bold">{currentLanguage === "ar" ? "احتمالية نشوء نزاعات قضائية مستقبلاً:" : "Litigation/Dispute Likelihood:"}</span>
                                <span className="text-indigo-400 font-bold font-mono text-sm">{aiResult.probability}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-indigo-400 font-bold block mb-1">ANALYSIS PATHWAY</span>
                                <p className="text-slate-300 text-[11px]">{currentLanguage === "ar" ? aiResult.reasonsAr : aiResult.reasonsEn}</p>
                              </div>
                            </div>
                          )}

                          {aiResult.note && (
                            <div className="text-[10px] text-emerald-400/70 italic border-t border-slate-800 pt-2 mt-4">
                              {aiResult.note}
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="text-center py-24 text-slate-500 font-sans">
                          <Sparkles className="h-8 w-8 text-slate-700 mx-auto mb-2 animate-pulse" />
                          <p className="text-xs">
                            {currentLanguage === "ar" 
                              ? "بانتظار المدخلات وتشغيل الفحص لملء البيانات الذكية التوليدية..." 
                              : "Audit analysis logs will compile here after execution."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Print/Download Executive brief report */}
                    {aiResult && (
                      <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-mono">MD5-CHECKSUM: APPROVED</span>
                        <button 
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(aiResult, null, 2)], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `Sovereign_Legal_Report_${aiAnalysisType}.json`;
                            a.click();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-sans font-bold cursor-pointer"
                        >
                          <Download className="h-3 w-3" />
                          <span>{currentLanguage === "ar" ? "تصدير التقرير التنفيذي الموثق" : "Export Sovereign Legal Brief"}</span>
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      )}

    </div>
  );
}
