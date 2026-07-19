import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, Scale, Users, ShieldAlert, TrendingUp, Calendar, BookOpen, GitMerge, BarChart3, 
  Globe, Check, Info, Lock, Eye, AlertTriangle, AlertCircle, Plus, Send, RefreshCw, 
  Search, ShieldCheck, HelpCircle, ArrowUpRight, CheckCircle2, Bookmark, Download, 
  Layers, Clock, MessageSquare, Briefcase, FileSignature, Landmark, FileSpreadsheet, ListTodo
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

interface Props {
  currentLanguage: "ar" | "en";
  role: string;
}

// Preset Laws & Regulations (Module 1 & 7)
const PRESET_LAWS = [
  { id: "law-1", code: "LAW-2026-04", titleAr: "قانون تشجيع الاستثمار الصناعي وحماية الإنتاج الوطني", titleEn: "Industrial Investment Incentive & Domestic Production Protection Act", categoryAr: "قوانين الاستثمار", statusAr: "ساري", statusEn: "Active", date: "2026-03-12" },
  { id: "law-2", code: "REG-2026-11", titleAr: "اللائحة التنفيذية لرقابة الأسواق ومكافحة الاحتكار", titleEn: "Executive Regulations for Market Surveillance & Anti-Monopoly", categoryAr: "لوائح أسواق", statusAr: "ساري", statusEn: "Active", date: "2026-05-18" },
  { id: "law-3", code: "DEC-2026-88", titleAr: "القرار الوزاري بشأن التفتيش الرقمي الموحد على المصانع", titleEn: "Ministerial Decision on Unified Digital Factory Inspections", categoryAr: "قرارات وزارية", statusAr: "ساري", statusEn: "Active", date: "2026-06-01" },
  { id: "law-4", code: "CIR-2026-09", titleAr: "المنشور الدوري لتسهيل الإجراءات الجمركية لمدخلات الإنتاج الزراعي", titleEn: "Circular on Streamlining Customs Procedures for Agro-inputs", categoryAr: "منشورات دورية", statusAr: "ساري", statusEn: "Active", date: "2026-07-10" }
];

// Preset Consultations (Module 3)
const PRESET_CONSULTATIONS = [
  { id: "con-1", titleAr: "مشروع مسودة اللائحة الوطنية المنظمة لتجارة الترانزيت البري", titleEn: "Draft National Regulations for Overland Transit Trade", targetAr: "الغرفة التجارية والمستوردين", deadline: "2026-08-15", participants: 184, status: "Open" },
  { id: "con-2", titleAr: "تعديل حزم الرسوم والضرائب التفضيلية لمشاريع الاقتصاد الأخضر", titleEn: "Amendments to Preferential Tax Bundles for Green Economy Projects", targetAr: "أصحاب المصانع ورواد الأعمال", deadline: "2026-09-01", participants: 92, status: "Open" }
];

// Preset Compliance Calendar (Module 6)
const COMPLIANCE_CALENDAR = [
  { id: "comp-1", titleAr: "تقديم الإقرار البيئي السنوي للمصانع الثقيلة", titleEn: "Annual Environmental Return Submission", deadline: "2026-08-30", penaltyAr: "غرامة مالية وإيقاف مؤقت للرخصة" },
  { id: "comp-2", titleAr: "تجديد شهادة المطابقة لمعايير المنتجات الغذائية المصنعة", titleEn: "Food Product Quality Compliance Certification Renewal", deadline: "2026-09-15", penaltyAr: "حظر التداول المحلي والتصدير" }
];

// Regulatory performance indexes trend (Module 9 & 10)
const REGULATORY_TRENDS = [
  { period: "2021", lawsDrafted: 12, complianceRate: 64, regulatoryBurdenIndex: 85, consultationParticipation: 320 },
  { period: "2022", lawsDrafted: 18, complianceRate: 71, regulatoryBurdenIndex: 78, consultationParticipation: 490 },
  { period: "2023", lawsDrafted: 24, complianceRate: 78, regulatoryBurdenIndex: 69, consultationParticipation: 780 },
  { period: "2024", lawsDrafted: 31, complianceRate: 83, regulatoryBurdenIndex: 58, consultationParticipation: 1200 },
  { period: "2025", lawsDrafted: 45, complianceRate: 89, regulatoryBurdenIndex: 45, consultationParticipation: 1850 },
  { period: "2026", lawsDrafted: 52, complianceRate: 94, regulatoryBurdenIndex: 38, consultationParticipation: 2400 }
];

export default function SovereignLegislativeGovernancePlatform({ currentLanguage, role }: Props) {
  const [activeTab, setActiveTab] = useState<string>("laws-registry");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Module 1: Laws and regulations state
  const [laws, setLaws] = useState(PRESET_LAWS);
  const [newLawTitle, setNewLawTitle] = useState("");
  const [newLawCategory, setNewLawCategory] = useState("قوانين الاستثمار");
  const [newLawCode, setNewLawCode] = useState("");

  // Module 2 & 8: Legislative Workflow Portal state
  const [drafts, setDrafts] = useState<any[]>([
    { id: "drf-201", titleAr: "مسودة حوافز دمج الذكاء الاصطناعي في المنشآت اللوجستية", titleEn: "Draft AI Incentives for Logistics Systems", author: "لجنة الابتكار الفيدرالية", stage: "Legal Review", progress: 40 },
    { id: "drf-202", titleAr: "قانون تنظيم حماية المستهلك في التجارة الإلكترونية الرقمية", titleEn: "Digital E-Commerce Consumer Protection Law", author: "إدارة رقابة الأسواق", stage: "Public Consultation", progress: 65 }
  ]);
  const [newDraftTitle, setNewDraftTitle] = useState("");
  const [newDraftAuthor, setNewDraftAuthor] = useState("");

  // Module 3: Consultations and Comments
  const [consultations, setConsultations] = useState(PRESET_CONSULTATIONS);
  const [activeConsultationId, setActiveConsultationId] = useState<string>("con-1");
  const [newCommentText, setNewCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([
    { id: "com-1", consultationId: "con-1", author: "م. محمد عثمان - غرفة الخرطوم", text: "نقترح تمديد فترة الإعفاء الجمركي المذكورة لتشمل بضائع العبور البري المتجهة لجنوب السودان.", date: "2026-07-18" },
    { id: "com-2", consultationId: "con-1", author: "د. هند عادل - مستشارة جمارك", text: "يجب تحديد آليات التتبع الإلكتروني للشاحنات عبر الأقمار الصناعية بوضوح لضمان السلامة.", date: "2026-07-19" }
  ]);

  // Module 4: Legal Intelligence / Conflict & AI analyzer
  const [aiLegalInput, setAiLegalInput] = useState("");
  const [aiLegalAnalysis, setAiLegalAnalysis] = useState<string>("");

  // Module 5: Regulatory Impact Assessment Calculator
  const [impactSectors, setImpactSectors] = useState({
    economic: 3,
    sme: 4,
    consumer: 5,
    trade: 4
  });
  const [impactResult, setImpactResult] = useState<any>(null);

  // REST & GraphQL simulated testers
  const [graphqlOutput, setGraphqlOutput] = useState<any>(null);
  const [lastApiStatus, setLastApiStatus] = useState<string>("Idle");

  // Fetch Laws via API
  const handleFetchLaws = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/legislative-governance/laws");
      const data = await response.json();
      if (data.success) {
        setSuccessMessage(currentLanguage === "ar" ? "تم سحب سجل التشريعات الفيدرالية بنجاح من الخادم الموحد" : "Federal laws registry retrieved successfully from sovereign server");
        setLaws(data.laws);
        setLastApiStatus("REST: 200 OK");
      }
    } catch (e: any) {
      setErrorMessage("Error connecting to Legislative API server");
    } finally {
      setLoading(false);
    }
  };

  // Run GraphQL query
  const handleRunGraphQL = async () => {
    setLoading(true);
    const query = `
      query GetLegislativeAnalytics {
        sudanStrategicIntelligence {
          status
          version
          systemIntegrity
          modelsActive
        }
      }
    `;
    try {
      const response = await fetch("/api/economic-intelligence/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const resData = await response.json();
      setGraphqlOutput(resData.data);
      setSuccessMessage(currentLanguage === "ar" ? "تم التحقق من تكامل خوارزميات الذكاء التشريعي بنجاح" : "Legislative intelligence models verified successfully");
      setLastApiStatus("GraphQL: 200 OK");
    } catch (e: any) {
      setErrorMessage("GraphQL legislative query failure");
    } finally {
      setLoading(false);
    }
  };

  // Module 1: Add new Law
  const handleAddLaw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLawTitle || !newLawCode) return;
    setLoading(true);
    try {
      const response = await fetch("/api/legislative-governance/laws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newLawCode,
          titleAr: newLawTitle,
          categoryAr: newLawCategory,
          titleEn: `Sovereign Policy - ${newLawTitle}`
        })
      });
      const data = await response.json();
      if (data.success) {
        setLaws(prev => [data.law, ...prev]);
        setNewLawTitle("");
        setNewLawCode("");
        setSuccessMessage(currentLanguage === "ar" ? "تم تسجيل ونشر التشريع السيادي الجديد بنجاح في السجل الوطني" : "New sovereign legislation registered and published successfully in the National Registry");
      }
    } catch (err) {
      setErrorMessage("Failed to register legislation on the sovereign server.");
    } finally {
      setLoading(false);
    }
  };

  // Module 3: Submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;
    const newComment = {
      id: `com-${Date.now()}`,
      consultationId: activeConsultationId,
      author: currentLanguage === "ar" ? "مستشار اقتصادي - معتمد" : "Verified Economic Consultant",
      text: newCommentText,
      date: new Date().toISOString().split("T")[0]
    };
    setComments(prev => [newComment, ...prev]);
    setNewCommentText("");
    setSuccessMessage(currentLanguage === "ar" ? "تم استلام مساهمتك في منصة الاستطلاع وسوف تُحال للجنة الفنية" : "Your consultation contribution received and routed to the drafting committee");
  };

  // Module 4: Run AI Legal Analysis
  const handleAnalyzeLegalDraft = () => {
    if (!aiLegalInput) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isConflict = aiLegalInput.includes("احتكار") || aiLegalInput.includes("ضريبة");
      if (isConflict) {
        setAiLegalAnalysis(
          currentLanguage === "ar"
            ? "تنبيه تعارض تشريعي: النص المقترح يتعارض جزئياً مع المادة ١٤ من قانون منع الاحتكار والاندماج لعام ٢٠٢٤. يوصى بمراجعة صياغة العقوبات وتعديلها لتتماشى مع اللوائح الجمركية الموحدة للـ COMESA."
            : "Inconsistency Detected: The draft text conflicts with Article 14 of the Anti-Monopoly Act (2024). Re-drafting recommended for alignment with unified COMESA customs treaties."
        );
      } else {
        setAiLegalAnalysis(
          currentLanguage === "ar"
            ? "التحليل التشريعي بالذكاء الاصطناعي: لا توجد تعارضات قانونية مع القوانين السارية. تم رصد تشابه بنسبة ٨٢٪ مع نصوص تنظيم الأسواق في منطقة الكوميسا الشرقية والجنوبية."
            : "AI Legislative Intelligence Report: No direct legal conflicts found. 82% regulatory similarity index with COMESA smart market regulation frameworks."
        );
      }
    }, 800);
  };

  // Module 5: Calculate Regulatory Impact
  const handleCalculateImpact = () => {
    const sum = impactSectors.economic + impactSectors.sme + impactSectors.consumer + impactSectors.trade;
    const score = Math.round((sum / 20) * 100);
    let category = "Low Regulatory Burden";
    let recommendation = "";

    if (score >= 75) {
      category = "Critical Legislative Burden";
      recommendation = currentLanguage === "ar" 
        ? "أثر تشريعي معقد ومكلف. يوصى بإجراء استثناءات خاصة وإعفاءات جمركية لتفادي تراجع نمو المشاريع الصغيرة والمتوسطة."
        : "Severe regulatory impact. Targeted exemptions and simplified compliance checklists are recommended for SMEs.";
    } else if (score >= 45) {
      category = "Moderate Dynamic Impact";
      recommendation = currentLanguage === "ar"
        ? "أثر متوازن يدعم الأسواق والمستهلكين دون إرهاق كلفة الإنتاج."
        : "Balanced framework. Standard transition period recommended.";
    } else {
      category = "Minimal Economic Impact";
      recommendation = currentLanguage === "ar"
        ? "سهولة تشغيلية عالية. يوصى بالتطبيق الفوري مع المتابعة اللاحقة."
        : "Excellent ease-of-doing-business index. Quick integration suggested.";
    }

    setImpactResult({ score, category, recommendation });
  };

  // Filtered Laws
  const filteredLaws = laws.filter(law => {
    const matchesSearch = law.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          law.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          law.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || law.categoryAr === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-[#1E293B]" id="national-legislative-governance-policy">
      {/* Platform Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-emerald-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg mb-6 border border-emerald-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(52,211,153,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              {currentLanguage === "ar" ? "الحوكمة والتشريعات التجارية والسياسات القومية" : "NATIONAL LEGISLATIVE GOVERNANCE & POLICY"}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
              <Scale className="w-7 h-7 text-emerald-400 animate-pulse" />
              {currentLanguage === "ar" ? "المنصة الوطنية للحوكمة التشريعية والسياسات التنظيمية" : "National Legislative Governance & Regulatory Policy Platform"}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-semibold max-w-3xl leading-relaxed">
              {currentLanguage === "ar"
                ? "البوابة السيادية الموحدة لجميع التشريعات التجارية، صياغة القوانين الفيدرالية، إعداد تقارير الأثر الاقتصادي، الاستشارات المجتمعية المفتوحة والذكاء القانوني بالسودان."
                : "Unified sovereign portal for draft commercial laws, legal risk impact assessment metrics, digital publishing codes, and AI-powered legislative alignment checklists."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleFetchLaws}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              {currentLanguage === "ar" ? "مزامنة القوانين الفيدرالية" : "Sync Federal Laws"}
            </button>
            <div className="bg-slate-900/80 border border-emerald-800/80 px-3 py-2 rounded-xl text-center text-xs font-bold font-mono">
              <span className="text-emerald-400 block text-[9px] uppercase tracking-widest">Legislative Node</span>
              ACTIVE VERIFIED
            </div>
          </div>
        </div>
      </div>

      {/* Message banners */}
      {(successMessage || errorMessage) && (
        <div className="mb-6 flex flex-col gap-2">
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="mr-auto font-mono hover:text-slate-950 font-black cursor-pointer">✕</button>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage("")} className="mr-auto font-mono hover:text-slate-950 font-black cursor-pointer">✕</button>
            </div>
          )}
        </div>
      )}

      {/* Sidebar layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Modules Navigation */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 pb-2 border-b border-slate-100">
            {currentLanguage === "ar" ? "أقسام منظومة الحوكمة" : "GOVERNANCE SECTIONS"}
          </h3>

          {[
            { id: "laws-registry", labelAr: "سجل التشريعات السيادية", labelEn: "Sovereign Laws Registry", icon: Landmark, descAr: "القوانين واللوائح والقرارات الوزارية", descEn: "Commercial statutes & circulars" },
            { id: "drafting-workflow", labelAr: "مسار الصياغة والتمرير", labelEn: "Legislative Workflow", icon: GitMerge, descAr: "إنشاء مسودات القوانين والموافقة", descEn: "Draft creation & approvals" },
            { id: "public-consultations", labelAr: "الاستشارات العامة المجتمعية", labelEn: "Public Consultations", icon: Users, descAr: "رأي مجتمع المال والأعمال والخبراء", descEn: "Chamber reviews & expert opinions" },
            { id: "legal-intelligence", labelAr: "الذكاء القانوني الفيدرالي (AI)", labelEn: "AI Legal Intelligence", icon: Scale, descAr: "كشف التعارضات وتحليل الانسجام", descEn: "Similarity searches & checks" },
            { id: "impact-assessment", labelAr: "تقييم الأثر التشريعي", labelEn: "Regulatory Impact Assessment", icon: FileSpreadsheet, descAr: "احتساب تكاليف الامتثال ومكاسب الإنتاج", descEn: "Economic & SME burden index" },
            { id: "compliance-framework", labelAr: "منظومة الامتثال والالتزام", labelEn: "Compliance & Obligations", icon: ShieldCheck, descAr: "أجندة الالتزامات والتنبيهات الذكية", descEn: "Obligations calendar & warnings" },
            { id: "regulatory-analytics", labelAr: "لوحة تحليلات الحوكمة الكبرى", labelEn: "Regulatory Observatory", icon: BarChart3, descAr: "مؤشرات فعالية السياسات والتطوير", descEn: "National KPIs & forecasting" }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className={`w-full flex flex-col gap-0.5 px-3 py-2 text-right transition-all border ${
                  isSelected
                    ? "bg-[#064E3B] text-white border-[#064E3B] shadow-md font-black rounded-2xl"
                    : "bg-white border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-100 rounded-xl"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="text-xs font-bold leading-tight">{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
                </div>
                <span className={`text-[9px] font-semibold block ${isSelected ? "text-slate-300" : "text-gray-400"}`}>
                  {currentLanguage === "ar" ? tab.descAr : tab.descEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-2xs flex-1 flex flex-col justify-between">

            {/* MODULE 1: LAWS REGISTRY & LIBRARY */}
            {activeTab === "laws-registry" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-emerald-700" />
                      {currentLanguage === "ar" ? "سجل التشريعات والقوانين التجارية واللوائح" : "Commercial Laws & Circulars Library"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "الأرشيف الرسمي لجميع القوانين واللوائح والمنشورات الصادرة عن وزارة التجارة والصناعة مع تتبع التعديلات والتواريخ." : "Search active laws, track amendments history, and fetch publication codes in real time."}
                    </p>
                  </div>
                </div>

                {/* Filter and Search controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative md:col-span-2">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "البحث برمز التشريع أو كلمات رئيسية..." : "Search by code or title words..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-2.5 pr-10 pl-3 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#064E3B]"
                    />
                  </div>
                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="All">{currentLanguage === "ar" ? "كل تصنيفات التشريعات" : "All Categories"}</option>
                      <option value="قوانين الاستثمار">{currentLanguage === "ar" ? "قوانين الاستثمار" : "Investment Laws"}</option>
                      <option value="لوائح أسواق">{currentLanguage === "ar" ? "لوائح أسواق" : "Market Regs"}</option>
                      <option value="قرارات وزارية">{currentLanguage === "ar" ? "قرارات وزارية" : "Ministerial Decs"}</option>
                      <option value="منشورات دورية">{currentLanguage === "ar" ? "منشورات دورية" : "Circulars"}</option>
                    </select>
                  </div>
                </div>

                {/* List & Add Form Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Laws list */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "التشريعات السارية المسجلة" : "Enacted Legislation List"}</span>
                    <div className="space-y-2.5">
                      {filteredLaws.length > 0 ? (
                        filteredLaws.map(law => (
                          <div key={law.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold space-y-2 hover:border-slate-300 transition-all">
                            <div className="flex justify-between items-center">
                              <span className="text-[#064E3B] font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">{law.code}</span>
                              <span className="text-[10px] text-gray-400 font-medium">{law.date}</span>
                            </div>
                            <h4 className="text-slate-950 font-extrabold text-sm leading-snug">{currentLanguage === "ar" ? law.titleAr : law.titleEn}</h4>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200/50">
                              <span>{law.categoryAr}</span>
                              <span className="text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Check className="w-3 h-3" /> {currentLanguage === "ar" ? law.statusAr : law.statusEn}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center text-xs font-bold text-gray-400">
                          {currentLanguage === "ar" ? "لا توجد نتائج تشابه الكلمات المدخلة." : "No laws match your search terms."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form to submit a new law */}
                  <form onSubmit={handleAddLaw} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 h-fit">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "إدراج ونشر تشريع قانوني" : "Publish New Legislation"}</h4>
                    <div className="space-y-3 text-xs font-bold">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "رمز أو مرجع القانون:" : "Sovereign Code:"}</label>
                        <input
                          type="text"
                          required
                          value={newLawCode}
                          onChange={(e) => setNewLawCode(e.target.value)}
                          placeholder="مثال: LAW-2026-99"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "عنوان التشريع بالعربية:" : "Legislation Title (Arabic):"}</label>
                        <input
                          type="text"
                          required
                          value={newLawTitle}
                          onChange={(e) => setNewLawTitle(e.target.value)}
                          placeholder="مثال: قانون التجارة الإلكترونية الوطني"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "نوع التشريع السنوي:" : "Legislation Category:"}</label>
                        <select
                          value={newLawCategory}
                          onChange={(e) => setNewLawCategory(e.target.value)}
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none"
                        >
                          <option value="قوانين الاستثمار">قوانين الاستثمار</option>
                          <option value="لوائح أسواق">لوائح أسواق</option>
                          <option value="قرارات وزارية">قرارات وزارية</option>
                          <option value="منشورات دورية">منشورات دورية</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "اعتماد ونشر التشريع" : "Enact Legislation"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 2 & 8: LEGISLATIVE WORKFLOW PORTAL */}
            {activeTab === "drafting-workflow" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <GitMerge className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "منصة الصياغة وتمرير مسودات القوانين الفيدرالية" : "Sovereign Legislative Drafting & Approvals Workflow"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "تتبع مسار مراجعة مسودات القوانين: إعداد المسودة -> المراجعة الفنية -> الاستطلاع العام -> الاعتماد الوزاري والتوقيع الرقمي." : "Track laws from inception to draft creation, technical/legal reviews, stakeholder alignment, and official sign-off."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Drafts listing */}
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "مسودات القوانين قيد التمرير والاعتماد" : "Draft Bills In-Flight"}</span>
                    <div className="space-y-3">
                      {drafts.map(drf => (
                        <div key={drf.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px]">{drf.stage}</span>
                            <span className="text-[10px] text-gray-400">Author: {drf.author}</span>
                          </div>
                          <h4 className="text-slate-950 font-black text-sm">{drf.titleAr}</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 font-black">
                              <span>{currentLanguage === "ar" ? "مستوى اكتمال المراجعات:" : "Review Progress:"}</span>
                              <span>{drf.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#064E3B] h-full" style={{ width: `${drf.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit new Draft */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "تقديم مسودة قانون مقترحة" : "Initiate Law Draft Proposal"}</h4>
                    <div className="space-y-3 text-xs font-bold">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "اسم أو موضوع القانون المقترح:" : "Draft Bill Subject:"}</label>
                        <input
                          type="text"
                          required
                          value={newDraftTitle}
                          onChange={(e) => setNewDraftTitle(e.target.value)}
                          placeholder="مثال: تنظيم الصناعات الدوائية الوطنية"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "الجهة الفنية المسؤولة عن الصياغة:" : "Drafting Committee / Unit:"}</label>
                        <input
                          type="text"
                          required
                          value={newDraftAuthor}
                          onChange={(e) => setNewDraftAuthor(e.target.value)}
                          placeholder="مثال: المجلس الطبي الفيدرالي"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!newDraftTitle) return;
                          const newBill = {
                            id: `drf-${Date.now()}`,
                            titleAr: newDraftTitle,
                            titleEn: `Draft Bill - ${newDraftTitle}`,
                            author: newDraftAuthor || "Sovereign Unit",
                            stage: "Legal Review",
                            progress: 25
                          };
                          setDrafts(prev => [newBill, ...prev]);
                          setNewDraftTitle("");
                          setNewDraftAuthor("");
                          setSuccessMessage(currentLanguage === "ar" ? "تم تسجيل المسودة المقترحة في البوابة السيادية وبدء المراجعات الفنية" : "Draft bill registered successfully; legal review initiated");
                        }}
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تسجيل المسودة وبدء المراجعة" : "Submit Draft Proposal"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: PUBLIC CONSULTATIONS */}
            {activeTab === "public-consultations" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "منصة الاستطلاع والاستشارات العامة لمجتمع المال والأعمال" : "Sovereign Public Consultations & Chamber Feedback"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "تمكين الغرف التجارية، جمعيات حماية المستهلك والخبراء الاقتصاديين من إبداء المرئيات والملاحظات على مسودات القوانين قبل إقرارها." : "Collect digital recommendations from national commerce unions, industrial syndicates, and corporate panels."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* List of active consultations */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "الحملات النشطة المفتوحة حالياً" : "Active Consultation Campaigns"}</span>
                    {consultations.map(con => (
                      <button
                        key={con.id}
                        onClick={() => setActiveConsultationId(con.id)}
                        className={`w-full text-right p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col gap-2 ${
                          activeConsultationId === con.id
                            ? "bg-emerald-50 border-emerald-300 text-slate-900 shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full">{con.status}</span>
                          <span className="text-[10px] text-gray-400">Deadline: {con.deadline}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-950 leading-snug">{con.titleAr}</h4>
                        <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2 w-full">
                          <span>{con.targetAr}</span>
                          <span>{con.participants} Comments</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Active consultation's comments & submission */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <span className="text-xs font-black text-[#064E3B] uppercase tracking-wider block mb-3">
                        {currentLanguage === "ar" ? "التعليقات والمساهمات المستلمة للمسودة النشطة" : "Active Contributions & Suggestions"}
                      </span>
                      <div className="space-y-3 max-h-[220px] overflow-y-auto mb-4 pr-1">
                        {comments.filter(c => c.consultationId === activeConsultationId).map(c => (
                          <div key={c.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="flex justify-between text-[10px] font-black text-[#064E3B]">
                              <span>{c.author}</span>
                              <span className="text-slate-400 font-normal">{c.date}</span>
                            </div>
                            <p className="text-slate-700 font-bold leading-normal">{c.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Comment submission Form */}
                      <form onSubmit={handleSubmitComment} className="space-y-3">
                        <textarea
                          required
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "أدخل مقترحك الفني، التعديل أو الملاحظة الاقتصادية هنا..." : "Input your technical draft edit recommendation..."}
                          rows={3}
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#064E3B]"
                        ></textarea>
                        <button
                          type="submit"
                          className="bg-[#064E3B] hover:bg-emerald-950 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer ml-auto"
                        >
                          <Send className="w-4 h-4 text-white" />
                          {currentLanguage === "ar" ? "إرسال المرئيات الفنية" : "Submit Comments"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: LEGAL INTELLIGENCE PLATFORM (AI) */}
            {activeTab === "legal-intelligence" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "مركز الذكاء الاصطناعي القانوني ورصد التعارض التشريعي" : "Sovereign AI Legal Intelligence & Conflict Detection"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "قم بلصق مقترح قانون أو لائحة جديدة، وسيقوم محرك الذكاء الاصطناعي السيادي برصد أي تعارضات مع الدستور والقوانين التجارية والاتفاقيات الدولية السارية." : "Input dynamic regulatory proposals and analyze them against local laws and active international trade pacts."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left input text */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "نص مسودة السياسة أو البند التشريعي المطلوب تحليله:" : "Draft Legislation Block to Analyze:"}</span>
                    <textarea
                      value={aiLegalInput}
                      onChange={(e) => setAiLegalInput(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اكتب أو الصق النص القانوني هنا (مثال: فرض ضريبة حماية استيراد إضافية بنسبة ٢٠٪ على المنتجات التي يوجد لها بديل محلي لحماية المصانع...)" : "Enter draft text to scan for conflict or duplicates..."}
                      rows={6}
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-semibold outline-none focus:bg-white focus:border-[#064E3B] leading-relaxed"
                    ></textarea>

                    <button
                      onClick={handleAnalyzeLegalDraft}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer mr-auto"
                    >
                      <Scale className="w-4 h-4 text-slate-950 animate-pulse" />
                      {currentLanguage === "ar" ? "تشغيل محرك الفحص والتدقيق القانوني" : "Run AI Regulatory Alignment Scan"}
                    </button>
                  </div>

                  {/* AI Results report */}
                  <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                    <span className="text-xs font-black text-emerald-400 block tracking-widest uppercase font-mono">AI LEGAL INTEGRITY REPORT</span>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-2">
                        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                        <span className="text-xs text-gray-400 font-bold">{currentLanguage === "ar" ? "جاري إجراء البحث والتحليل المقارن..." : "Running conflict detection rules..."}</span>
                      </div>
                    ) : aiLegalAnalysis ? (
                      <div className="space-y-4 text-xs font-semibold leading-relaxed">
                        <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="font-extrabold uppercase">{currentLanguage === "ar" ? "نتيجة الفحص التلقائي" : "Scan Output Metrics"}</span>
                        </div>
                        <p>{aiLegalAnalysis}</p>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[10px] text-gray-400 font-mono">
                          Integrity Check: Verified COMESA harmonized rules v2.1
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-slate-500 font-bold">
                        {currentLanguage === "ar" ? "أدخل نص المسودة المقترحة واضغط على تشغيل الفحص لبدء المراجعة والتدقيق." : "Draft text input required to begin automatic cross-referencing audit."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: REGULATORY IMPACT ASSESSMENT */}
            {activeTab === "impact-assessment" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "محاكي تقييم الأثر التنظيمي والتشريعي (Regulatory Impact Assessment)" : "Regulatory Impact Assessment (RIA) & Compliance Costs"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "تنبؤ واحتساب الآثار الاقتصادية للقوانين المقترحة على المشاريع الصغيرة، التنافسية، وحماية المستهلكين وكلفة الامتثال الإداري." : "Quantify expected regulatory burdens, administrative friction, and overall business impacts."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Input sliders */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 text-xs font-bold">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "مدخلات استبيان تقييم العبء" : "Assessment Severity Parameters"}</h3>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>{currentLanguage === "ar" ? "الأثر الاقتصادي العام (الأسعار والتجارة):" : "General Economic Impact:"}</span>
                          <span className="font-mono text-[#064E3B]">{impactSectors.economic} / 5</span>
                        </div>
                        <input
                          type="range" min="1" max="5"
                          value={impactSectors.economic}
                          onChange={(e) => setImpactSectors(prev => ({ ...prev, economic: parseInt(e.target.value) }))}
                          className="w-full accent-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>{currentLanguage === "ar" ? "أثر الكلفة الإدارية على الشركات الـ SMEs:" : "SME Compliance Burden:"}</span>
                          <span className="font-mono text-[#064E3B]">{impactSectors.sme} / 5</span>
                        </div>
                        <input
                          type="range" min="1" max="5"
                          value={impactSectors.sme}
                          onChange={(e) => setImpactSectors(prev => ({ ...prev, sme: parseInt(e.target.value) }))}
                          className="w-full accent-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>{currentLanguage === "ar" ? "أثر الحماية وسلامة المستهلكين:" : "Consumer Rights Safety Impact:"}</span>
                          <span className="font-mono text-[#064E3B]">{impactSectors.consumer} / 5</span>
                        </div>
                        <input
                          type="range" min="1" max="5"
                          value={impactSectors.consumer}
                          onChange={(e) => setImpactSectors(prev => ({ ...prev, consumer: parseInt(e.target.value) }))}
                          className="w-full accent-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>{currentLanguage === "ar" ? "أثر الصادرات والتجارة الإقليمية الكلية:" : "Regional Trade and Exports:"}</span>
                          <span className="font-mono text-[#064E3B]">{impactSectors.trade} / 5</span>
                        </div>
                        <input
                          type="range" min="1" max="5"
                          value={impactSectors.trade}
                          onChange={(e) => setImpactSectors(prev => ({ ...prev, trade: parseInt(e.target.value) }))}
                          className="w-full accent-[#064E3B]"
                        />
                      </div>

                      <button
                        onClick={handleCalculateImpact}
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "حساب مؤشر الأثر الاقتصادي للسياسة" : "Generate Impact Score"}
                      </button>
                    </div>
                  </div>

                  {/* Right Results summary */}
                  <div className="lg:col-span-2 space-y-4">
                    {impactResult ? (
                      <div className="space-y-4">
                        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block uppercase">{currentLanguage === "ar" ? "مؤشر العبء التنظيمي المتوقع" : "Overall Impact Score"}</span>
                            <span className="text-3xl font-mono font-extrabold text-amber-400 block mt-1">{impactResult.score}%</span>
                          </div>
                          <span className="text-xs font-black bg-slate-800 text-amber-400 px-3 py-1.5 rounded-lg font-mono">
                            {impactResult.category}
                          </span>
                        </div>

                        <div className="bg-amber-50 text-amber-950 p-4 rounded-2xl border border-amber-100 text-xs font-semibold leading-relaxed space-y-2">
                          <div className="flex items-center gap-1.5 text-amber-800 font-black">
                            <Info className="w-4 h-4 shrink-0" />
                            <span>{currentLanguage === "ar" ? "توصيات وملاحظات اللجنة التشريعية بالذكاء الاصطناعي:" : "AI Assessment Committee Notes:"}</span>
                          </div>
                          <p>{impactResult.recommendation}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center text-xs font-bold text-gray-400">
                        {currentLanguage === "ar" ? "يرجى تحديد قيم المعاملات التنظيمية والضغط على الحساب لعرض تقرير الأثر التشريعي المعتمد." : "Adjust sliders to simulate the anticipated economic and financial burden of the legislative text."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 6: COMPLIANCE FRAMEWORK */}
            {activeTab === "compliance-framework" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "أجندة الالتزامات والامتثال الوطني للمنشآت" : "National Compliance Calendar & Obligation Tracking"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "متابعة المواعيد النهائية للمطابقة وجودة المنتجات، لتفادي الغرامات والعقوبات الإدارية للمنشآت الوطنية." : "Registry of administrative tasks, compliance schedules, and regulatory deadlines."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Calendar obligations list */}
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "أجندة الالتزامات القانونية القادمة" : "Upcoming Regulatory Deadlines"}</span>
                    <div className="space-y-3">
                      {COMPLIANCE_CALENDAR.map(item => (
                        <div key={item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span className="font-mono text-emerald-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Due: {item.deadline}
                            </span>
                            <span className="bg-red-50 text-red-800 px-2 py-0.5 rounded-full font-black">Mandatory</span>
                          </div>
                          <h4 className="text-slate-950 font-black text-sm">{currentLanguage === "ar" ? item.titleAr : item.titleEn}</h4>
                          <div className="text-[10px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex gap-1 items-start">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold block">{currentLanguage === "ar" ? "عقوبة عدم الامتثال المباشر:" : "Non-Compliance Sanction:"}</span>
                              <span className="font-medium text-slate-700 mt-0.5 block">{item.penaltyAr}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance scores checklist or quick advice */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "مستوى الامتثال الكلي للمنشأة" : "Company Compliance Health"}</h4>
                    <div className="space-y-3 text-xs font-bold text-slate-700">
                      <div className="flex justify-between">
                        <span>{currentLanguage === "ar" ? "معدل الالتزام بالمواصفات:" : "Standards Alignment:"}</span>
                        <span className="text-emerald-700 font-mono">92%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: "92%" }}></div>
                      </div>

                      <div className="flex justify-between pt-2">
                        <span>{currentLanguage === "ar" ? "تجديد التراخيص البيئية:" : "Environmental Status:"}</span>
                        <span className="text-emerald-700 font-mono">100%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: "100%" }}></div>
                      </div>

                      <div className="flex justify-between pt-2">
                        <span>{currentLanguage === "ar" ? "الفحوصات العمالية:" : "Labor Conditions:"}</span>
                        <span className="text-amber-600 font-mono">45%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: "45%" }}></div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3 text-[11px] text-gray-500 font-medium leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "* الرجاء استكمال الفحوصات العمالية السنوية لتجنب تجميد رخصة الاستيراد الجمركية تلقائياً."
                          : "* Complete workforce health audits before Q3 deadline to maintain friction-free customs dispatch access."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 9 & 10: REGULATORY OBSERVATORY */}
            {activeTab === "regulatory-analytics" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "المرصد الوطني لمؤشرات السياسات والعبء التنظيمي" : "Sovereign Regulatory Analytics Dashboard"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "رصد كفاءة سن القوانين، تقليص الأوراق الإدارية، ونمو مشاركات الغرف التجارية مع التنبؤ الذكي." : "Dynamic reports detailing regulatory burden reductions and citizen alignment rates."}
                  </p>
                </div>

                {/* API Tester & Dev Sandbox inside Dashboard */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-emerald-400 block text-[10px] uppercase tracking-widest font-black">Sovereign API Console Sandbox</span>
                    <span className="text-slate-300 font-bold">Endpoint Status: {lastApiStatus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFetchLaws}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer"
                    >
                      Test REST API
                    </button>
                    <button
                      onClick={handleRunGraphQL}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer"
                    >
                      Run GraphQL
                    </button>
                  </div>
                </div>

                {/* GraphQL Output Window */}
                {graphqlOutput && (
                  <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-800 text-[10px] font-mono whitespace-pre-wrap max-h-[150px] overflow-y-auto">
                    {JSON.stringify(graphqlOutput, null, 2)}
                  </div>
                )}

                {/* Performance Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Laws Drafted and Burden reduction */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      {currentLanguage === "ar" ? "معدل خفض أعباء الامتثال الورقي ومشاركة الخبراء" : "Regulatory Burden Index Reduction Rate"}
                    </span>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REGULATORY_TRENDS}>
                          <defs>
                            <linearGradient id="colorBurden" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorParticipation" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="regulatoryBurdenIndex" stroke="#ef4444" fillOpacity={1} fill="url(#colorBurden)" name="Burden Index" />
                          <Area type="monotone" dataKey="consultationParticipation" stroke="#10b981" fillOpacity={1} fill="url(#colorParticipation)" name="Participants" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Laws drafted and compliance trend */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      {currentLanguage === "ar" ? "قوانين تم إقرارها ونسب الامتثال العام (%)" : "Statutes Enacted vs National Compliance (%)"}
                    </span>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={REGULATORY_TRENDS}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="lawsDrafted" stroke="#0f172a" name="Enacted Laws" strokeWidth={3} />
                          <Line type="monotone" dataKey="complianceRate" stroke="#10b981" name="Compliance Rate (%)" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sovereign Quality manual footer */}
          <div className="bg-[#1E293B] text-slate-300 rounded-3xl p-5 border border-slate-800 text-xs font-semibold leading-relaxed mt-6 space-y-2">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{currentLanguage === "ar" ? "دليل تشغيل المنظومة التشريعية والسياسات التنظيمية" : "Legislative Operations Manual & Security Standards"}</span>
            </div>
            <p>
              {currentLanguage === "ar"
                ? "تعتمد المنصة آليات التوقيع الرقمي المشفر والمصادقة متعددة العوامل لحماية السجلات التشريعية. يتم تدقيق القوانين بموجب المعايير الدولية والوطنية لجمهورية السودان لضمان تعزيز بيئة الاستثمار والتنافسية ومحاربة الاحتكار بموجب أهداف السودان رؤية ٢٠٣٥."
                : "Secure digital signatures, role-based access control, and zero-trust verification ensure absolute integrity of legislative drafts. All published laws are stored immutably to foster local business environments and foreign investment confidence."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
