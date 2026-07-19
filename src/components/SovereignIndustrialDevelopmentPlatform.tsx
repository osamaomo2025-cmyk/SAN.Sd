import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, Award, Users, Sliders, ClipboardList, Zap, Bell, ChevronRight, BarChart3, 
  Layers, Check, Info, Lock, Eye, AlertTriangle, AlertCircle, ShoppingBag, 
  Landmark, ArrowUpRight, Plus, Compass, TrendingUp, Filter, RefreshCw, Send, 
  CheckCircle2, QrCode, BookOpen, Briefcase, Activity, Play, Download, CheckSquare, 
  PlusCircle, ExternalLink, Flame, ShieldAlert, Globe, Scale, Recycle, Book, GraduationCap, Trophy
} from "lucide-react";
import {
  LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

interface Props {
  currentLanguage: "ar" | "en";
  role: string;
}

// Preset Industrial Clusters (Module 1)
const INDUSTRIAL_CLUSTERS_PRESETS = [
  { id: "cls-1", nameAr: "مجمع الصناعات التحويلية الغذائية بجياد", nameEn: "Giad Agro-Industrial Processing Cluster", locationAr: "ولاية الخرطوم", factoriesCount: 14, growthRate: 12.5, capacityPct: 88, complianceScore: 94 },
  { id: "cls-2", nameAr: "المدينة الصناعية المتكاملة للجلود بكسلا", nameEn: "Kassala Integrated Leather Industrial City", locationAr: "ولاية كسلا", factoriesCount: 8, growthRate: 8.2, capacityPct: 75, complianceScore: 89 },
  { id: "cls-3", nameAr: "حاضنة الصناعات النسيجية بالجزيرة", nameEn: "Gezira Textile & Spinning Hub", locationAr: "ولاية الجزيرة", factoriesCount: 11, growthRate: 15.4, capacityPct: 91, complianceScore: 92 },
  { id: "cls-4", nameAr: "مجمع معالجة الصمغ العربي المتطور بسوبا", nameEn: "Soba Advanced Gum Arabic Downstream Hub", locationAr: "الخرطوم سوبا", factoriesCount: 6, growthRate: 22.1, capacityPct: 94, complianceScore: 98 }
];

// Presets for Innovation Registry (Module 2)
const INNOVATION_CHALLENGES = [
  { id: "ch-1", titleAr: "ابتكار تقنيات تجفيف وتعبئة الصمغ الهشاب آلياً", titleEn: "Automated Hashab Gum Drying & Processing Tech", reward: "15M SDG", submissions: 24, daysLeft: 12, status: "Active" },
  { id: "ch-2", titleAr: "رفع كفاءة تدوير مخلفات عصر حبوب السمسم صناعياً", titleEn: "Industrial Recycling of Sesame Extraction Byproducts", reward: "10M SDG", submissions: 15, daysLeft: 18, status: "Active" }
];

// SME Maturity benchmarks (Module 4)
const SME_ASSESSMENT_QUESTIONS = [
  { id: "q1", textAr: "هل تمتلك المنشأة الصناعية نظاماً لإدارة السجلات الرقمية والمالية بدلاً من الورقية؟", textEn: "Does your factory use dynamic digital bookkeeping instead of paper-based logs?" },
  { id: "q2", textAr: "هل تُجرى عمليات الرقابة على جودة الإنتاج وسلاسل الإمداد بمساعدة أجهزة الاستشعار أو السحابة؟", textEn: "Are production quality checks and supply chain routes monitored via IoT or cloud systems?" },
  { id: "q3", textAr: "هل تتوفر قنوات رقمية لترويج الصادرات واستلام المدفوعات السيادية محلياً ودولياً؟", textEn: "Do you maintain functional digital B2B trade channels for export orders and payments?" }
];

// Product standards & quality guidelines (Module 5)
const NATIONAL_STANDARDS = [
  { code: "SDN-ISO-9001", nameAr: "نظام إدارة الجودة للمصانع الغذائية الوطنية", nameEn: "National Quality Management for Agro-Industrial Plants", status: "Mandatory", labCount: 8 },
  { code: "SDN-COMESA-M4", nameAr: "المواصفة الموحدة لتصدير الصمغ العربي والراتنجات", nameEn: "Unified Standard for Gum Arabic & Resin Exports", status: "Mandatory", labCount: 12 },
  { code: "SDN-ENV-14001", nameAr: "المعايير الخضراء للحد من التلوث وإدارة الفاقد الصناعي", nameEn: "Sovereign Green Industrial Waste & Carbon Limits", status: "Recommended", labCount: 5 }
];

// Sustainability indicators (Module 6)
const RECENT_GREEN_PROGRAMS = [
  { id: "grn-1", factory: "Kenana Sugar & Biofuel Complex", carbonSaved: "1,200 Tons", waterRecycled: "84%", esgScore: 92 },
  { id: "grn-2", factory: "Atbara Cement Enterprise", carbonSaved: "2,500 Tons", waterRecycled: "45%", esgScore: 78 }
];

// National Competitiveness Multi-KPI tracker (Module 9)
const COMPETITIVENESS_KPI_TREND = [
  { year: "2021", industrialGrowth: 4.5, innovationIndex: 32.1, smeDigitalPct: 15, esgCompliance: 62 },
  { year: "2022", industrialGrowth: 5.8, innovationIndex: 35.8, smeDigitalPct: 22, esgCompliance: 68 },
  { year: "2023", industrialGrowth: 6.9, innovationIndex: 41.2, smeDigitalPct: 34, esgCompliance: 74 },
  { year: "2024", industrialGrowth: 8.5, innovationIndex: 49.5, smeDigitalPct: 48, esgCompliance: 81 },
  { year: "2025", industrialGrowth: 11.2, innovationIndex: 58.0, smeDigitalPct: 64, esgCompliance: 89 },
  { year: "2026", industrialGrowth: 14.6, innovationIndex: 68.4, smeDigitalPct: 78, esgCompliance: 94 }
];

export default function SovereignIndustrialDevelopmentPlatform({ currentLanguage, role }: Props) {
  const [activeTab, setActiveTab] = useState<string>("industrial-development");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Module 1: Industrial Clusters & Factory Program State
  const [clusters, setClusters] = useState(INDUSTRIAL_CLUSTERS_PRESETS);
  const [newClusterNameAr, setNewClusterNameAr] = useState("");
  const [newClusterLocation, setNewClusterLocation] = useState("الخرطوم");

  // Module 2: Innovation Challenges & Patent Registry
  const [challenges, setChallenges] = useState(INNOVATION_CHALLENGES);
  const [patents, setPatents] = useState<any[]>([
    { id: "pat-101", titleAr: "جهاز استخلاص أوتوماتيكي متدرج الضغط للصمغ العربي", titleEn: "Automated Pressure-Graded Gum Arabic Extractor", inventor: "د. أحمد الطيب - جامعة السودان", status: "Approved & Commercialized", grantSDG: "8M SDG" },
    { id: "pat-102", titleAr: "غشاء كربوني نانوي فلتر لتنقية مياه الصرف الصناعي للمدابغ", titleEn: "Carbon Nanotube Filtration Membrane for Tannery Waste", inventor: "م. إيمان عبد الله - معهد أبحاث الصناعة", status: "Under-Review", grantSDG: "Pending" }
  ]);
  const [patentTitle, setPatentTitle] = useState("");
  const [inventorName, setInventorName] = useState("");

  // Module 3 & 4: SME Digital Maturity Assessment
  const [assessmentAnswers, setAssessmentAnswers] = useState<{ [key: string]: boolean }>({
    q1: false,
    q2: false,
    q3: false
  });
  const [calculatedMaturity, setCalculatedMaturity] = useState<number | null>(null);
  const [aiMaturityReport, setAiMaturityReport] = useState<string>("");

  // Module 5: Quality certificates and accreditation workflows
  const [certifications, setCertifications] = useState<any[]>([
    { id: "cert-901", company: "Kenana Sugar Complex", standard: "SDN-ISO-9001", status: "Certified", validity: "2028-12-15" },
    { id: "cert-902", company: "Sudanese Tannery Enterprises", standard: "SDN-ENV-14001", status: "Pending-Inspection", validity: "N/A" }
  ]);
  const [certCompany, setCertCompany] = useState("");
  const [certStandard, setCertStandard] = useState("SDN-ISO-9001");

  // Module 7: National R&D Grants Portfolio
  const [rdProjects, setRdProjects] = useState<any[]>([
    { titleAr: "تطوير طاقة الكتلة الحيوية من مفرزات قصب السكر", titleEn: "Biomass energy optimization from sugarcane bagasse", funding: "24M SDG", partner: "مجمع كنانة & جامعة الخرطوم", progress: 85 },
    { titleAr: "توطين صناعة الأسمدة العضوية المركبة للمحاصيل النقدية", titleEn: "Local production of complex organic fertilizers for cash crops", funding: "15M SDG", partner: "معهد البحوث الزراعية الفيدرالي", progress: 62 }
  ]);
  const [newRdTitle, setNewRdTitle] = useState("");
  const [newRdPartner, setNewRdPartner] = useState("");

  // Module 8: Skills Registry & Talents
  const [skills, setSkills] = useState<any[]>([
    { nameAr: "تشغيل الآلات الصناعية المؤتمتة", nameEn: "Automated Industrial Machinery Operations", skilledPersonnel: 1240, certifiedRating: "High" },
    { nameAr: "إدارة الكفاءة الطاقية في الصناعات الثقيلة", nameEn: "Industrial Energy Management Specialist", skilledPersonnel: 480, certifiedRating: "Medium" },
    { nameAr: "تطبيق بروتوكولات الفحص الصحي للمنتجات الغذائية", nameEn: "Phytosanitary & Food Safety Protocol Management", skilledPersonnel: 1890, certifiedRating: "Exceptional" }
  ]);

  // REST & GraphQL simulated testers
  const [graphqlOutput, setGraphqlOutput] = useState<any>(null);
  const [lastApiStatus, setLastApiStatus] = useState<string>("Idle");

  const handleFetchIndustrialClusters = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/industrial-development/clusters");
      const data = await response.json();
      if (data.success) {
        setSuccessMessage(currentLanguage === "ar" ? "تم سحب مجمعات الإنتاج الصناعي الفيدرالية بنجاح عبر الـ API" : "Industrial clusters retrieved successfully via Federal API");
        setGraphqlOutput(data.clusters);
        setLastApiStatus("REST: 200 OK");
      }
    } catch (e: any) {
      setErrorMessage("Error communicating with Industrial API backend server");
    } finally {
      setLoading(false);
    }
  };

  const handleRunIndustrialGraphQL = async () => {
    setLoading(true);
    const query = `
      query GetInnovationEcosystem {
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
      setSuccessMessage(currentLanguage === "ar" ? "تم التحقق من تكامل خوارزميات التنبؤ الصناعي عبر GraphQL" : "Industrial forecasting models verified via GraphQL endpoint");
      setLastApiStatus("GraphQL: 200 OK");
    } catch (e: any) {
      setErrorMessage("GraphQL industrial query failure");
    } finally {
      setLoading(false);
    }
  };

  // Module 1: Add new cluster
  const handleAddCluster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClusterNameAr) return;
    const newCls = {
      id: `cls-${Date.now()}`,
      nameAr: newClusterNameAr,
      nameEn: `New ${newClusterLocation} Development Center`,
      locationAr: newClusterLocation,
      factoriesCount: 1,
      growthRate: 10.0,
      capacityPct: 80,
      complianceScore: 85
    };
    setClusters(prev => [newCls, ...prev]);
    setNewClusterNameAr("");
    setSuccessMessage(currentLanguage === "ar" ? "تم تسجيل مجمع التطوير الصناعي في المنظومة الوطنية الموحدة" : "Industrial cluster registered successfully in the National System");
  };

  // Module 2: Apply Patent
  const handleRegisterPatent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patentTitle || !inventorName) return;
    const newPat = {
      id: `pat-${Date.now()}`,
      titleAr: patentTitle,
      titleEn: `Commercial Innovation - ${patentTitle}`,
      inventor: inventorName,
      status: "Application",
      grantSDG: "Pending Committee Review"
    };
    setPatents(prev => [newPat, ...prev]);
    setPatentTitle("");
    setInventorName("");
    setSuccessMessage(currentLanguage === "ar" ? "تم تسجيل طلب براءة الاختراع وبدء مسار التحقق الفني الفيدرالي" : "Patent filed successfully; initiating federal technical verification");
  };

  // Module 4: Calculate SME Digital Maturity Index
  const handleCalculateMaturity = () => {
    let checkedCount = 0;
    if (assessmentAnswers.q1) checkedCount++;
    if (assessmentAnswers.q2) checkedCount++;
    if (assessmentAnswers.q3) checkedCount++;

    const score = Math.round((checkedCount / 3) * 100);
    setCalculatedMaturity(score);

    if (score >= 90) {
      setAiMaturityReport(
        currentLanguage === "ar"
          ? "المنشأة تقع في فئة [رائد رقمي]. تتمتع بمرونة تشغيلية عالية ومؤهلة للحصول على حوافز التصدير المباشر وإعفاءات التعرفة الجمركية الذكية."
          : "Enterprise Category: [Digital Pioneer]. High resilience. Eligible for immediate export incentives and smart customs tariff waivers."
      );
    } else if (score >= 40) {
      setAiMaturityReport(
        currentLanguage === "ar"
          ? "المنشأة تقع في فئة [متحول رقمي ناشئ]. يُنصح بتبني أنظمة الربط اللوجستي مع منصة السجل التجاري والمدفوعات لرفع الإنتاجية."
          : "Enterprise Category: [Emerging Adopter]. Advised to integrate logistics tracking APIs to boost productivity."
      );
    } else {
      setAiMaturityReport(
        currentLanguage === "ar"
          ? "المنشأة تقع في فئة [تقليدي ورقي]. نوصي بالانخراط الفوري في برنامج وزارة التجارة والصناعة لدعم التحول الرقمي بتمويل مدعوم بنسبة 100٪."
          : "Enterprise Category: [Legacy System]. Enrolling in the Ministry's fully subsidized SME Digitalization Grant is highly recommended."
      );
    }
  };

  // Module 5: Request quality standards certificate
  const handleRequestCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCompany) return;
    const newCert = {
      id: `cert-${Date.now()}`,
      company: certCompany,
      standard: certStandard,
      status: "Under-Review",
      validity: "Pending Verification"
    };
    setCertifications(prev => [newCert, ...prev]);
    setCertCompany("");
    setSuccessMessage(currentLanguage === "ar" ? "تم تسجيل طلب شهادة المطابقة والجودة وبدء التقييم" : "Quality compliance application registered and inspection scheduled");
  };

  // Module 7: Register R&D project
  const handleAddRdProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRdTitle || !newRdPartner) return;
    const newProject = {
      titleAr: newRdTitle,
      titleEn: `Industrial R&D - ${newRdTitle}`,
      funding: "10M SDG (Subsidized)",
      partner: newRdPartner,
      progress: 10
    };
    setRdProjects(prev => [newProject, ...prev]);
    setNewRdTitle("");
    setNewRdPartner("");
    setSuccessMessage(currentLanguage === "ar" ? "تم تسجيل المشروع البحثي وتفعيل منحة الابتكار القومية" : "Joint research project registered; National Innovation Grant activated");
  };

  return (
    <div className="bg-slate-50 min-h-screen text-[#1E293B]" id="national-industrial-development-competitiveness">
      {/* Module Title Section */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-emerald-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg mb-6 border border-emerald-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(52,211,153,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              {currentLanguage === "ar" ? "التصنيع الوطني والابتكار - رؤية السودان ٢٠٣٥" : "SUDAN INDUSTRIAL TRANSFORMATION & INNOVATION PORTAL"}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
              <Cpu className="w-7 h-7 text-emerald-400 animate-pulse" />
              {currentLanguage === "ar" ? "المنصة الوطنية للتطوير الصناعي والابتكار والاستدامة" : "National Industrial Development & Innovation Platform"}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-semibold max-w-3xl leading-relaxed">
              {currentLanguage === "ar"
                ? "البوابة القومية لدعم التنافسية الصناعية وحاضنات الابتكار التكنولوجي، تدوير النفايات الدائرية، جودة المعايير، وتنمية مهارات الكوادر المهنية لجمهورية السودان."
                : "Federal gateway for industrial clusters optimization, patent commercialization challenges, circular green factories tracking, and SME digital maturity indexing."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleFetchIndustrialClusters}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              {currentLanguage === "ar" ? "تحديث مؤشرات المصانع" : "Sync Industrial Clusters"}
            </button>
            <div className="bg-slate-900/80 border border-emerald-800/80 px-3 py-2 rounded-xl text-center text-xs font-bold font-mono">
              <span className="text-emerald-400 block text-[9px] uppercase tracking-widest">Sovereign Node</span>
              ACTIVE SECURE
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

        {/* Modules navigation */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 pb-2 border-b border-slate-100">
            {currentLanguage === "ar" ? "أقسام منظومة الصناعة" : "INDUSTRIAL SECTIONS"}
          </h3>

          {[
            { id: "industrial-development", labelAr: "مجمعات التطوير الصناعي", labelEn: "Industrial Clusters", icon: Landmark, descAr: "إدارة خطوط الإنتاج والمدن الصناعية", descEn: "Factory programs & clusters" },
            { id: "innovation-ecosystem", labelAr: "الحاضنات وبراءات الاختراع", labelEn: "Innovation & Patents", icon: Award, descAr: "تحديات الابتكار والملكية الفكرية", descEn: "Challenges & patent commercial" },
            { id: "sme-transformation", labelAr: "التحول الرقمي للـ SMEs", labelEn: "SME Digitalization", icon: Sliders, descAr: "قياس النضج التكنولوجي ومؤشر التمكين", descEn: "Maturity assessments & AI advisor" },
            { id: "quality-standards", labelAr: "البنية التحتية للجودة والمواصفات", labelEn: "Quality & Standards", icon: Scale, descAr: "شهادات المطابقة والاعتماد الوطني", descEn: "ISO codes & lab compliance" },
            { id: "circular-economy", labelAr: "الاقتصاد الدائري والاستدامة", labelEn: "Green Circular Economy", icon: Recycle, descAr: "رصد الانبعاثات وتوفير الطاقة بالمصانع", descEn: "ESG scores & waste reduction" },
            { id: "rd-grants", labelAr: "البحوث والتطوير الفيدرالي (R&D)", labelEn: "Research & Development", icon: Book, descAr: "الربح الأكاديمي والمنح الصناعية المشتركة", descEn: "University hubs & tech transfer" },
            { id: "talent-skills", labelAr: "منصة الكوادر والمهارات الوطنية", labelEn: "National Talent & Skills", icon: GraduationCap, descAr: "الشهادات المهنية ومعالجة فجوات القوى", descEn: "Skills gap & career pathways" },
            { id: "competitiveness-dashboard", labelAr: "لوحة مؤشرات التنافسية الكبرى", labelEn: "National Competitiveness", icon: BarChart3, descAr: "مؤشرات التجارة والإنتاجية العامة", descEn: "Competitiveness indexes & APIs" }
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

            {/* MODULE 1: INDUSTRIAL DEVELOPMENT */}
            {activeTab === "industrial-development" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-emerald-700" />
                      {currentLanguage === "ar" ? "قائمة مجمعات وحواضن المدن الصناعية الفيدرالية" : "National Industrial Clusters & Free Zones"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "متابعة كفاءة المصانع، نسب التشغيل، ومستوى الالتزام البيئي الوطني بمختلف المحافظات." : "Monitor factory performance efficiency, workforce utilization, and localized output levels."}
                    </p>
                  </div>
                </div>

                {/* Scorecard blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "إجمالي المنشآت النشطة" : "Active Factories"}</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-1 font-mono">1,482</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +8.4% YoY
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "متوسط القدرة الإنتاجية" : "Average Capacity"}</span>
                    <span className="text-xl font-extrabold text-[#064E3B] block mt-1 font-mono">87.2%</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      Optimal Utilization
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "معدل الالتزام بالمواصفات" : "Standard Compliance"}</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-1 font-mono">91.8%</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      ISO & SDN Compliant
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "مجمعات قيد التطوير" : "Planned Clusters"}</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-1 font-mono">4 Zones</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      Vision 2035 Linked
                    </span>
                  </div>
                </div>

                {/* Grid list with custom creation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "المجمعات الصناعية المسجلة" : "Registered Industrial Clusters"}</span>
                    <div className="space-y-2.5">
                      {clusters.map(cls => (
                        <div key={cls.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-slate-900 text-sm">{currentLanguage === "ar" ? cls.nameAr : cls.nameEn}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{cls.locationAr}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/50">
                            <div>
                              <span>{currentLanguage === "ar" ? "المنشآت النشطة:" : "Factories:"}</span>
                              <span className="block font-black text-slate-800 text-xs mt-0.5">{cls.factoriesCount}</span>
                            </div>
                            <div>
                              <span>{currentLanguage === "ar" ? "معدل استغلال الطاقة:" : "Energy/Capacity:"}</span>
                              <span className="block font-black text-[#064E3B] text-xs mt-0.5">{cls.capacityPct}%</span>
                            </div>
                            <div>
                              <span>{currentLanguage === "ar" ? "مؤشر الالتزام بالجودة:" : "Quality Rating:"}</span>
                              <span className="block font-black text-slate-800 text-xs mt-0.5">{cls.complianceScore}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cluster registration Form */}
                  <form onSubmit={handleAddCluster} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "تسجيل مجمع صناعي جديد" : "Register Industrial Zone"}</h4>
                    <div className="space-y-3 text-xs font-bold">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "اسم المجمع الصناعي بالعربية:" : "Cluster Name (Arabic):"}</label>
                        <input
                          type="text"
                          required
                          value={newClusterNameAr}
                          onChange={(e) => setNewClusterNameAr(e.target.value)}
                          placeholder="مثال: مجمع كنانة للصناعات التحويلية"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "الموقع الجغرافي / الولاية:" : "Target State/Location:"}</label>
                        <select
                          value={newClusterLocation}
                          onChange={(e) => setNewClusterLocation(e.target.value)}
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none"
                        >
                          <option value="الخرطوم">الخرطوم</option>
                          <option value="الجزيرة">الجزيرة</option>
                          <option value="البحر الأحمر">البحر الأحمر</option>
                          <option value="كردفان">كردفان</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "اعتماد المجمع صناعياً" : "Submit Cluster Authorization"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 2: INNOVATION ECOSYSTEM */}
            {activeTab === "innovation-ecosystem" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "الحاضنات التكنولوجية وتسجيل براءات الاختراع والابتكار" : "Sovereign Patent Registry & Innovation Challenges"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "تسجيل براءات الاختراع الوطنية، وربط المبتكرين مع المجمعات الصناعية والممولين وتدشين حوافز الاستثمار التجاري." : "Register industrial intellectual property, issue sovereign innovation grants, and launch challenges."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: active challenges */}
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "تحديات الابتكار الصناعي القومية النشطة" : "Active National Innovation Challenges"}</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {challenges.map(ch => (
                        <div key={ch.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-[9px] bg-emerald-50 text-[#064E3B] px-2 py-0.5 rounded-full inline-block mb-1.5">{ch.status}</span>
                            <h4 className="text-xs font-black text-slate-900 leading-snug">{currentLanguage === "ar" ? ch.titleAr : ch.titleEn}</h4>
                          </div>
                          <div className="border-t border-slate-200/50 pt-2.5 flex justify-between items-center text-[10px] text-slate-500">
                            <div>
                              <span>{currentLanguage === "ar" ? "المكافأة المالية:" : "Reward Fund:"}</span>
                              <span className="block font-black text-[#064E3B]">{ch.reward}</span>
                            </div>
                            <div>
                              <span>{currentLanguage === "ar" ? "المشاركات المستلمة:" : "Submissions:"}</span>
                              <span className="block font-black text-slate-800">{ch.submissions}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Patent Registry display list */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "قائمة براءات الاختراع والملكيات المسجلة" : "Registered Intellectual Property Portfolio"}</span>
                      <div className="space-y-2">
                        {patents.map(pat => (
                          <div key={pat.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                            <div>
                              <span className="font-extrabold text-slate-900 block">{currentLanguage === "ar" ? pat.titleAr : pat.titleEn}</span>
                              <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{pat.inventor}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold block">{pat.status}</span>
                              <span className="text-[9px] text-slate-400 font-bold block mt-1">Grant: {pat.grantSDG}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Patent submission form */}
                  <form onSubmit={handleRegisterPatent} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "تسجيل براءة اختراع جديدة" : "File Sovereign Patent Claim"}</h4>
                    <div className="space-y-3 text-xs font-bold">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "عنوان الاختراع والبحث العلمي:" : "Patent/Research Title:"}</label>
                        <input
                          type="text"
                          required
                          value={patentTitle}
                          onChange={(e) => setPatentTitle(e.target.value)}
                          placeholder="مثال: فلتر تنقية ذكي للمدابغ"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "اسم المبتكر أو المؤسسة البحثية:" : "Lead Inventor / Institution:"}</label>
                        <input
                          type="text"
                          required
                          value={inventorName}
                          onChange={(e) => setInventorName(e.target.value)}
                          placeholder="مثال: د. مريم أحمد - معهد أبحاث الصناعة"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تقديم طلب براءة الاختراع" : "Register Patent Claim"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 4: SME DIGITAL TRANSFORMATION */}
            {activeTab === "sme-transformation" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "مركز التقييم والنضج الرقمي للمنشآت الصغيرة والمتوسطة" : "SME Digital Maturity Assessment & AI Advisor"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "مساعدة رواد الأعمال والمصانع الناشئة على تحديد درجات النضج الرقمي والحصول على خطط دعم وتمويل مخصصة." : "Diagnose technological integration, audit software adoption rates, and receive optimized growth templates."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Questionnaire checklist */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "قائمة استبيان النضج الرقمي" : "Technology Audit Checklist"}</h3>
                    <div className="space-y-4 text-xs font-bold text-slate-700">
                      {SME_ASSESSMENT_QUESTIONS.map(q => (
                        <label key={q.id} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assessmentAnswers[q.id]}
                            onChange={(e) => setAssessmentAnswers(prev => ({ ...prev, [q.id]: e.target.checked }))}
                            className="mt-0.5 accent-[#064E3B]"
                          />
                          <span className="leading-normal">{currentLanguage === "ar" ? q.textAr : q.textEn}</span>
                        </label>
                      ))}

                      <button
                        onClick={handleCalculateMaturity}
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "حساب درجة النضج التكنولوجي" : "Calculate Maturity Score"}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Calculated score report */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "مخرجات تقرير التمكين والحلول التكنولوجية" : "Technology Adoption Report"}</h3>

                    {calculatedMaturity !== null ? (
                      <div className="space-y-4">
                        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block uppercase">{currentLanguage === "ar" ? "مؤشر النضج الرقمي الوطني" : "Digital Maturity Index"}</span>
                            <span className="text-3xl font-mono font-extrabold text-sudan-gold block mt-1">{calculatedMaturity}%</span>
                          </div>
                          <span className="text-xs font-black bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-lg font-mono">
                            {calculatedMaturity >= 66 ? "STABLE DIGITAL" : calculatedMaturity >= 33 ? "TRANSITIONAL" : "ACTION REQUIRED"}
                          </span>
                        </div>

                        <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl border border-emerald-100 text-xs font-semibold leading-relaxed">
                          <span className="font-extrabold block mb-1 text-emerald-800">{currentLanguage === "ar" ? "التقرير الاستشاري ومقترح خارطة الطريق للـ SME:" : "Actionable Digital Transition Roadmap:"}</span>
                          {aiMaturityReport}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center text-xs font-bold text-gray-400">
                        {currentLanguage === "ar" ? "يرجى تحديد الإجابات في القائمة الجانبية لبدء التقييم وتوليد خارطة الطريق." : "Select the questionnaire options to evaluate digital transformation readiness."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: QUALITY STANDARDS */}
            {activeTab === "quality-standards" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "نظام البنية التحتية للجودة والمواصفات والمقاييس" : "National Quality Infrastructure & ISO Certifications"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "مراقبة المعايير القياسية للمنتجات، رخص المختبرات القومية، وإصدار شهادات الاعتماد والمطابقة." : "Registry of technical standards, products safety regulations, and certification status tracking."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: standards list */}
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "المواصفات واللوائح الفنية السارية" : "Sovereign Mandatory Standards"}</span>
                    <div className="space-y-2.5">
                      {NATIONAL_STANDARDS.map(std => (
                        <div key={std.code} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold flex justify-between items-center">
                          <div>
                            <span className="font-mono text-emerald-800 block">[{std.code}]</span>
                            <span className="text-slate-800 block mt-0.5">{currentLanguage === "ar" ? std.nameAr : std.nameEn}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${std.status === "Mandatory" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
                              {std.status}
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-1">Labs: {std.labCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quality certificates registry */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "السجل الوطني للشهادات الممنوحة" : "Active Issued Quality Certificates"}</span>
                      <div className="space-y-2">
                        {certifications.map(cert => (
                          <div key={cert.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                            <div>
                              <span className="font-extrabold text-slate-900 block">{cert.company}</span>
                              <span className="text-[10px] text-gray-400 font-mono">Standard: {cert.standard} | Valid until: {cert.validity}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cert.status === "Certified" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                              {cert.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: request certification */}
                  <form onSubmit={handleRequestCert} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "طلب شهادة مطابقة جودة" : "Apply for Quality Accreditation"}</h4>
                    <div className="space-y-3 text-xs font-bold">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "اسم الشركة طالبة الفحص:" : "Applicant Company Name:"}</label>
                        <input
                          type="text"
                          required
                          value={certCompany}
                          onChange={(e) => setCertCompany(e.target.value)}
                          placeholder="مثال: مصانع تعبئة سمسم كوستي"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "المواصفة القياسية المطلوبة:" : "Target Standard Standard:"}</label>
                        <select
                          value={certStandard}
                          onChange={(e) => setCertStandard(e.target.value)}
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none"
                        >
                          <option value="SDN-ISO-9001">SDN-ISO-9001</option>
                          <option value="SDN-COMESA-M4">SDN-COMESA-M4</option>
                          <option value="SDN-ENV-14001">SDN-ENV-14001</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "حجز موعد فحص ومطابقة" : "Submit Inspection Request"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 6: CIRCULAR ECONOMY */}
            {activeTab === "circular-economy" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-emerald-700 animate-spin-slow" />
                    {currentLanguage === "ar" ? "الاقتصاد الدائري والصناعات الخضراء المستدامة" : "Circular Economy & Green Manufacturing Initiative"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "تتبع مبادرات تخفيض البصمة الكربونية وإدارة المخلفات وتحسين كفاءة استهلاك المياه والطاقة الكهربائية في المصانع القومية." : "Track carbon offset records, localized waste management, and sustainable ESG indices for top enterprises."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Green reports registry */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "تقرير الالتزام البيئي للمصانع الكبرى" : "Factory Environmental ESG Ledger"}</span>
                    <div className="space-y-3">
                      {RECENT_GREEN_PROGRAMS.map(g => (
                        <div key={g.id} className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-slate-900">{g.factory}</span>
                            <span className="text-[10px] bg-emerald-50 text-[#064E3B] px-2 py-0.5 rounded-full font-bold">ESG: {g.esgScore}%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-slate-100 text-slate-500">
                            <div>
                              <span>Carbon Saved:</span>
                              <span className="block font-black text-[#064E3B]">{g.carbonSaved}</span>
                            </div>
                            <div>
                              <span>Water Recycled:</span>
                              <span className="block font-black text-slate-800">{g.waterRecycled}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Energy efficiency tips / Green advisor */}
                  <div className="bg-[#064E3B] text-white p-5 rounded-3xl flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-emerald-300 block uppercase">Sovereign Green Advisory</span>
                      <h4 className="text-sm font-black mt-1" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "توجيهات خفض الانبعاثات والتحول للطاقة البديلة" : "Federal Green Transition Directive"}
                      </h4>
                      <p className="text-xs text-emerald-100 mt-2 leading-relaxed font-semibold">
                        {currentLanguage === "ar"
                          ? "بموجب قرارات مجلس الوزراء لعام ٢٠٢٦، تُمنح المنشآت الصناعية التي تتبنى الطاقة الشمسية أو تعتمد خطط تدوير المياه بنسبة 50٪ إعفاءات جمركية إضافية تعادل 10٪ على مدخلات الإنتاج."
                          : "According to the 2026 Sovereign Decree, industrial assets transitioning to 50%+ renewable solar energy or water recycling systems enjoy an extra 10% customs relief package."}
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-300 border-t border-emerald-800/80 pt-3">
                      ACTIVE VERIFIED ECO-STATUS | SUDAN VISION 2035
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 7: R&D GRANTS PORTFOLIO */}
            {activeTab === "rd-grants" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Book className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "منصة أبحاث التطوير الصناعي المشتركة والمنح القومية" : "National R&D Grants Portfolio & Technology Transfer"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "ربط المؤسسات الأكاديمية والمراكز البحثية الفيدرالية مع المصانع القومية لتبادل التقنيات وتطوير الإنتاج." : "Accelerate joint research projects between local universities and factories backed by innovation grants."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Joint R&D Projects */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "المشاريع البحثية المشتركة القائمة" : "Active Joint R&D Projects"}</span>
                    <div className="space-y-3">
                      {rdProjects.map((p, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-slate-900">{currentLanguage === "ar" ? p.titleAr : p.titleEn}</span>
                            <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">{p.funding}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 block">Partner: {p.partner}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#064E3B] h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                            </div>
                            <span className="text-xs font-mono font-black shrink-0">{p.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Register R&D project */}
                  <form onSubmit={handleAddRdProject} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "تسجيل مشروع بحثي جديد" : "Propose Joint R&D Venture"}</h4>
                    <div className="space-y-3 text-xs font-bold">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "موضوع البحث العلمي والابتكار:" : "Research Topic Name:"}</label>
                        <input
                          type="text"
                          required
                          value={newRdTitle}
                          onChange={(e) => setNewRdTitle(e.target.value)}
                          placeholder="مثال: تطوير وقود حيوي من مخلفات القطن"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "الشريك الأكاديمي أو المركز البحثي:" : "Research Partner Institution:"}</label>
                        <input
                          type="text"
                          required
                          value={newRdPartner}
                          onChange={(e) => setNewRdPartner(e.target.value)}
                          placeholder="مثال: جامعة الجزيرة & معهد بحوث النسيج"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#064E3B] hover:bg-emerald-900 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "اعتماد تفعيل المنحة" : "Authorize Grant Funding"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 8: TALENT & SKILLS PLATFORM */}
            {activeTab === "talent-skills" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "المنصة الوطنية للكوادر الفنية والمهارات الصناعية" : "National Industrial Talent & Professional Skills Registry"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "متابعة تخصصات الكوادر المهنية الفنية، برامج التدريب المتخصصة، ومعالجة الفجوات المهارية بقطاع التصنيع." : "Identify industrial training status, skills availability trends, and professional accreditation metrics."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {skills.map((s, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] bg-[#064E3B]/10 text-[#064E3B] px-2 py-0.5 rounded-full inline-block font-black uppercase mb-1.5">{s.certifiedRating}</span>
                        <h4 className="text-xs font-black text-slate-900">{currentLanguage === "ar" ? s.nameAr : s.nameEn}</h4>
                      </div>
                      <div className="flex justify-between items-center text-[11px] border-t border-slate-200/50 pt-2 text-slate-500">
                        <span>{currentLanguage === "ar" ? "الكوادر المعتمدة المتاحة:" : "Accredited Personnel:"}</span>
                        <span className="font-black text-slate-800">{s.skilledPersonnel} {currentLanguage === "ar" ? "خبير" : "Experts"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 9: COMPETITIVENESS DASHBOARD */}
            {activeTab === "competitiveness-dashboard" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-700" />
                      {currentLanguage === "ar" ? "لوحة التنافسية الكبرى ومراقبة مستويات الإنتاجية والـ APIs" : "Unified National Competitiveness & Integration Sandbox"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "ربط المؤشرات الاستراتيجية لرؤية ٢٠٣٥، وسحب مخرجات الخوارزميات عبر واجهات REST و GraphQL الفيدرالية." : "Inspect national indices progress curves, access verified REST responses, and run GraphQL simulations."}
                    </p>
                  </div>
                </div>

                {/* Integration control panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-4">
                    <span className="text-[10px] font-black text-emerald-400 block uppercase">National Sandbox & API Console</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      {currentLanguage === "ar"
                        ? "استخدم الروابط أدناه لمحاكاة الاتصال السيادي بالنظام المركزي، ومطابقة البيانات في بيئة معزولة متكاملة."
                        : "Test programmatic integration endpoints of Phase 14 with instant feedback from the Node Express engine."}
                    </p>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={handleFetchIndustrialClusters}
                        disabled={loading}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 animate-spin-slow text-slate-950" />
                        {currentLanguage === "ar" ? "فحص الـ REST API للمجمعات" : "Test REST API Endpoint"}
                      </button>

                      <button
                        onClick={handleRunIndustrialGraphQL}
                        disabled={loading}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black p-2.5 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        {currentLanguage === "ar" ? "تشغيل استعلام الـ GraphQL" : "Run GraphQL Query"}
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span>API Status:</span>
                      <span className="text-emerald-400 font-bold">{lastApiStatus}</span>
                    </div>
                  </div>

                  {/* Sandbox Output Area */}
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "سجل استجابة الـ API المستلمة في الوقت الفعلي" : "Real-time Sandbox API Response"}</span>

                    {graphqlOutput ? (
                      <div className="bg-slate-950 text-slate-300 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-auto max-h-[180px] space-y-2">
                        <span className="text-emerald-400 font-bold text-[10px] block">RESPONSE HEADER: 200 OK SUCCESS</span>
                        <pre className="text-[10px] leading-tight">{JSON.stringify(graphqlOutput, null, 2)}</pre>
                      </div>
                    ) : (
                      <div className="bg-slate-100 p-12 rounded-2xl border border-slate-200 text-center text-xs font-mono font-bold text-gray-400">
                        {currentLanguage === "ar" ? "بانتظار تشغيل فحص الاتصال بالـ API..." : "Awaiting sandbox communication triggering..."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Trend line graph */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-4">{currentLanguage === "ar" ? "منحنى تطور التنافسية والنمو التكنولوجي القومي (2021-2026)" : "Sovereign Industrial Growth & Competitiveness Trend Curve"}</span>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={COMPETITIVENESS_KPI_TREND}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fontSize: 10, fontWeight: "bold" }} />
                        <YAxis tick={{ fontSize: 10, fontWeight: "bold" }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                        <Line type="monotone" dataKey="industrialGrowth" stroke="#064E3B" strokeWidth={3} name="Industrial Growth %" />
                        <Line type="monotone" dataKey="innovationIndex" stroke="#F59E0B" strokeWidth={3} name="IP Patent filings" />
                        <Line type="monotone" dataKey="smeDigitalPct" stroke="#3B82F6" strokeWidth={2} name="SME Digital Maturity %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom regulatory reference footer */}
          <div className="mt-5 text-[10px] text-gray-400 font-bold flex justify-between items-center bg-slate-100 p-3.5 rounded-2xl border border-slate-200">
            <span>{currentLanguage === "ar" ? "وزارة التجارة والصناعة - جمهورية السودان" : "SUDAN FEDERAL MINISTRY OF COMMERCE & INDUSTRY"}</span>
            <span>SECURE SYSTEM MODULE 14.0.0 | ACCREDITED AUDIT STATUS</span>
          </div>

        </div>
      </div>
    </div>
  );
}
