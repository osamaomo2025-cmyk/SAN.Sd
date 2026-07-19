import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp, Landmark, Compass, Briefcase, Activity, Landmark as GovIcon, MapPin,
  TrendingDown, Globe, BookOpen, AlertCircle, FileText, CheckCircle, Search, HelpCircle,
  Radio, PieChart as PieIcon, Play, RefreshCw, Send, Plus, ArrowUpRight, BarChart3,
  Layers, Check, Info, Lock, Eye, AlertTriangle, ShieldAlert, Cpu, Award, Users,
  Sliders, FileCheck, ClipboardList, Zap, Bell, ChevronRight, BarChart, Settings
} from "lucide-react";
import {
  LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

interface Props {
  currentLanguage: "ar" | "en";
  role: string;
}

// Preset Economic Indicators
const INITIAL_ECONOMIC_INDICATORS = [
  { year: "2021", gdp: 28.5, inflation: 120.4, tradeBalance: -4.2, industrialProduction: 92.5, domesticInvestment: 1.8, foreignInvestment: 0.9 },
  { year: "2022", gdp: 30.1, inflation: 85.2, tradeBalance: -3.8, industrialProduction: 94.8, domesticInvestment: 2.1, foreignInvestment: 1.1 },
  { year: "2023", gdp: 32.4, inflation: 64.1, tradeBalance: -2.9, industrialProduction: 98.1, domesticInvestment: 2.5, foreignInvestment: 1.4 },
  { year: "2024", gdp: 35.8, inflation: 42.5, tradeBalance: -1.2, industrialProduction: 104.2, domesticInvestment: 3.2, foreignInvestment: 1.9 },
  { year: "2025", gdp: 40.2, inflation: 24.8, tradeBalance: 0.8, industrialProduction: 112.9, domesticInvestment: 4.8, foreignInvestment: 2.8 },
  { year: "2026 (Est)", gdp: 45.5, inflation: 12.4, tradeBalance: 2.1, industrialProduction: 124.6, domesticInvestment: 6.5, foreignInvestment: 4.2 }
];

// Vision 2035 Strategic Initiatives (Module 2)
const STRATEGIC_INITIATIVES = [
  { id: "init-1", titleAr: "التحول اللوجستي لمنطقة البحر الأحمر الحرة", titleEn: "Red Sea Free Zone Logistics Transformation", status: "on-track", progress: 78, category: "Infrastructure" },
  { id: "init-2", titleAr: "مجمع الصناعات التحويلية الزراعية بالقضارف", titleEn: "Al Qadarif Agro-Industrial Manufacturing Cluster", status: "on-track", progress: 85, category: "Agriculture" },
  { id: "init-3", titleAr: "صندوق الائتمان السيادي لرواد الأعمال والـ SMEs", titleEn: "Sovereign Credit Fund for SMEs & Startups", status: "delayed", progress: 42, category: "Finance" },
  { id: "init-4", titleAr: "شبكة الرقابة والاستشعار الجغرافي للموانئ الجافة", titleEn: "Dry Ports Geospatial Inspection & IoT Network", status: "on-track", progress: 92, category: "Technology" }
];

// Investment Opportunities (Module 3)
const INVESTMENT_OPPORTUNITIES = [
  { id: "opp-1", titleAr: "مشروع إعادة تأهيل خطوط سكك حديد الجزيرة - سنار", titleEn: "Gezira-Sennar Railway Rehabilitation PPP", sectorAr: "البنية التحتية والنقل", sectorEn: "Infrastructure & Transport", cost: "$120M USD", potentialRoi: 14.5, risk: "medium" },
  { id: "opp-2", titleAr: "مجمع صوامع ومطاحن القمح القومية ببورتسودان", titleEn: "National Wheat Silos & Mills Port Sudan", sectorAr: "الأمن الغذائي والزراعة", sectorEn: "Food Security & Agro-processing", cost: "$45M USD", potentialRoi: 18.2, risk: "low" },
  { id: "opp-3", titleAr: "مصنع استخلاص وتكرير وتعبئة الصمغ العربي الحديث - سوبا", titleEn: "Modern Gum Arabic Processing Factory - Soba", sectorAr: "صناعات تحويلية ونوعية", sectorEn: "Downstream Manufacturing", cost: "$28M USD", potentialRoi: 22.4, risk: "low" },
  { id: "opp-4", titleAr: "توسعة محطة طاقة الرياح لتغذية مصانع التعدين بكسلا", titleEn: "Kassala Wind Power Farm Extension for Mining Sector", sectorAr: "طاقة متجددة وصناعة", sectorEn: "Renewable Energy & Mining", cost: "$65M USD", potentialRoi: 11.8, risk: "high" }
];

// Factory performance analytics (Module 4)
const FACTORY_PERFORMANCE_PRESETS = [
  { id: "fac-1", nameAr: "مجمع كنانة لصناعات السكر والوقود الحيوي", nameEn: "Kenana Sugar & Biofuel Complex", capacity: 94, efficiency: 98, rawMaterialIndex: 96, workforceUtilization: 95 },
  { id: "fac-2", nameAr: "مجموعة جياد للصناعات الهندسية والمعدنية", nameEn: "Giad Engineering & Metal Industrial Complex", capacity: 82, efficiency: 88, rawMaterialIndex: 85, workforceUtilization: 91 },
  { id: "fac-3", nameAr: "مصنع أسمنت عطبرة الفيدرالي", nameEn: "Atbara Federal Cement Factory", capacity: 88, efficiency: 92, rawMaterialIndex: 94, workforceUtilization: 89 }
];

// Policy scenarios and simulation models (Module 9)
const POLICY_SCENARIOS = [
  { id: "scen-1", titleAr: "تخفيض الرسوم الجمركية على مدخلات الإنتاج الصناعي بنسبة 50%", titleEn: "50% Customs Duty Reduction on Raw Material Imports", sector: "Industry", gdpImpact: "+1.8%", inflationImpact: "-2.4%", jobCreation: "+24,000", costSDG: "12B SDG" },
  { id: "scen-2", titleAr: "فرض ضريبة حماية جمركية 25% على المنتجات المستوردة البديلة", titleEn: "25% Protective Import Tariff on Competing Goods", sector: "Local Manufacturing", gdpImpact: "+1.2%", inflationImpact: "+3.8%", jobCreation: "+12,500", costSDG: "-4B SDG" },
  { id: "scen-3", titleAr: "إعفاء أرباح الصادرات الموجهة لدول الكوميسا لمدة 5 سنوات", titleEn: "5-Year Income Tax Holiday for COMESA-bound Exports", sector: "Trade", gdpImpact: "+2.5%", inflationImpact: "+0.8%", jobCreation: "+45,000", costSDG: "8B SDG" }
];

export default function SovereignEconomicIntelligencePlatform({ currentLanguage, role }: Props) {
  const [activeTab, setActiveTab] = useState<string>("economic-intelligence");
  const [loading, setLoading] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<string>("");

  // States for economic metrics (Module 1)
  const [indicators, setIndicators] = useState(INITIAL_ECONOMIC_INDICATORS);
  const [targetIndicator, setTargetIndicator] = useState("gdp");

  // States for strategic planning (Module 2)
  const [initiatives, setInitiatives] = useState(STRATEGIC_INITIATIVES);
  const [newInitiativeTitleAr, setNewInitiativeTitleAr] = useState("");
  const [newInitiativeTitleEn, setNewInitiativeTitleEn] = useState("");
  const [newInitiativeCategory, setNewInitiativeCategory] = useState("Industry");

  // States for ROI Simulation (Module 3)
  const [selectedOppId, setSelectedOppId] = useState<string>("opp-3");
  const [simLeverageRatio, setSimLeverageRatio] = useState<number>(30); // 30% debt, 70% equity
  const [simOperationalEfficiency, setSimOperationalEfficiency] = useState<number>(95);
  const [simResult, setSimResult] = useState<any>(null);

  // States for Factory capacity metrics (Module 4)
  const [factories, setFactories] = useState(FACTORY_PERFORMANCE_PRESETS);
  const [selectedFactoryId, setSelectedFactoryId] = useState("fac-1");
  const [updateCapacityVal, setUpdateCapacityVal] = useState("94");

  // States for Business Demographics (Module 5)
  const [demographics, setDemographics] = useState<any[]>([
    { sectorAr: "المواد الغذائية", sectorEn: "Food & Agriculture", count: 8450, growth: 12.4, riskIndex: "low" },
    { sectorAr: "التعدين والصلب", sectorEn: "Mining & Heavy Metal", count: 1250, growth: 8.9, riskIndex: "medium" },
    { sectorAr: "المنسوجات والجلود", sectorEn: "Textiles & Leather", count: 3200, growth: -2.1, riskIndex: "high" },
    { sectorAr: "تقنية المعلومات والاتصال", sectorEn: "Information Technology", count: 1890, growth: 22.8, riskIndex: "low" }
  ]);
  const [failurePredictionResult, setFailurePredictionResult] = useState<string>("");

  // Executive alerts states (Module 6)
  const [executiveAlerts, setExecutiveAlerts] = useState<any[]>([
    { id: "alt-1", messageAr: "تنبيه سيادي: رصد انخفاض مخزون السمسم بميناء بورتسودان بنسبة 14% بسبب عطل لوجستي بالسكة الحديد.", messageEn: "Sovereign Alert: Sesame seeds stock at Port Sudan port dropped 14% due to railway logistic downtime.", severity: "high", time: "16:22" },
    { id: "alt-2", messageAr: "مؤشر إيجابي: نمو حجم صادرات الصمغ العربي لأسواق الاتحاد الأوروبي يتجاوز المستهدف الربعي بنسبة 18%.", messageEn: "Positive Indicator: Gum Arabic exports to EU markets exceeded quarterly target by 18%.", severity: "low", time: "15:40" }
  ]);

  // Spatial states (Module 7)
  const [selectedState, setSelectedState] = useState<string>("Red Sea (Port Sudan)");
  const [stateInvestmentData, setStateInvestmentData] = useState<any>({
    activeProjects: 24,
    industrialZones: ["South Port Zone", "Suakin Logistics Corridor"],
    keyResourcesAr: "الصمغ العربي، الملح، الثروة السمكية، الذهب",
    keyResourcesEn: "Gum Arabic, Salt, Fish Stocks, Gold Mines"
  });

  // Forecasting scenario planning (Module 8)
  const [forecastingHorizon, setForecastingHorizon] = useState<string>("5-years");
  const [simulatedRevenueSovereign, setSimulatedRevenueSovereign] = useState<any[]>([]);

  // Policy Analysis impact tracker (Module 9)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("scen-1");
  const [customPolicyInput, setCustomPolicyInput] = useState<string>("");

  // Master KPI Indicators (Module 10)
  const [kpiScorecard, setKpiScorecard] = useState<any[]>([
    { code: "KPI-COM-01", nameAr: "متوسط زمن تخليص رخص الاستيراد والتصدير", nameEn: "Average License Clearance Duration", target: "24 Hours", actual: "18.5 Hours", status: "met" },
    { code: "KPI-IND-04", nameAr: "نسبة توطين مدخلات الإنتاج الصناعي القومية", nameEn: "National Industrial Raw Input Sourcing Ratio", target: "65%", actual: "62.4%", status: "pending" },
    { code: "KPI-INV-09", nameAr: "حجم استثمارات الشراكة بين القطاعين العام والخاص المنفذة", nameEn: "Executed Public-Private Partnership Investment Volume", target: "$250M USD", actual: "$294M USD", status: "met" },
    { code: "KPI-CON-02", nameAr: "معدل الرضا ومعالجة شكاوى المستهلكين بالمحافظات", nameEn: "Consumer Complaint Resolution & Satisfaction Rate", target: "95%", actual: "89.2%", status: "remedial" }
  ]);

  // Trigger ROI simulation update
  const handleRunRoiSimulation = () => {
    const opp = INVESTMENT_OPPORTUNITIES.find(o => o.id === selectedOppId);
    if (!opp) return;
    const baseRoi = opp.potentialRoi;
    // Simple mock math: higher leverage increases ROI up to a point but increases risk
    const leverageEffect = (simLeverageRatio / 100) * 4.5;
    const efficiencyEffect = ((simOperationalEfficiency - 90) / 10) * 2.5;
    const calculatedRoi = (baseRoi + leverageEffect + efficiencyEffect).toFixed(2);
    const adjustedRisk = simLeverageRatio > 60 ? "HIGH RISK" : opp.risk.toUpperCase();

    setSimResult({
      roi: calculatedRoi,
      riskLevel: adjustedRisk,
      breakEvenYears: (100 / parseFloat(calculatedRoi)).toFixed(1),
      netPresentValue: `$${(parseFloat(opp.cost.replace(/[^0-9.]/g, '')) * 1.34).toFixed(1)}M USD`
    });
  };

  // Trigger Custom AI Predictive Report (Enterprise AI Component)
  const handleGenerateExecutiveReport = () => {
    setLoading(true);
    setAiReport("");
    setTimeout(() => {
      setLoading(false);
      setAiReport(
        currentLanguage === "ar"
          ? `--- تقرير التنبؤ والقرار الاقتصادي والسيادي الذكي لمجلس الوزراء للعام ٢٠٢٦ ---\n\n` +
            `بناءً على النماذج التنبؤية المتقدمة لوزارة التجارة والصناعة بجمهورية السودان، يظهر مؤشر نمو الناتج المحلي الإجمالي الوطني (GDP) اتجاهات متصاعدة بقيمة مستهدفة تبلغ +8.5٪ بحلول العام القادم بدعم من الإصلاحات الهيكلية وتحسين بيئة ترويج صادرات الصمغ العربي.\n\n` +
            `الفرص الاستراتيجية الأكثر نضوجاً:\n` +
            `- مشروع صوامع ومطاحن القمح ببورتسودان (ROI المتوقع 18.2٪ مع مستويات مخاطرة منخفضة للغاية).\n` +
            `- مجمع الصناعات التحويلية الزراعية بالقضارف (تأثير مباشر على الناتج المحلي لولاية القضارف بنسبة +2.1٪).\n\n` +
            `التوصيات والسياسات الوقائية المقترحة:\n` +
            `1. تفعيل حزمة خفض الرسوم الجمركية على مدخلات الإنتاج بنسبة 50٪ لتعزيز الكفاءة التشغيلية للمصانع والحد من تضخم أسعار السلع الغذائية.\n` +
            `2. صياغة عقود الشراكة بين القطاعين العام والخاص لإصلاح شبكة النقل الحديدي الممتدة بين الجزيرة وسنار لتسريع نقل البضائع الاستراتيجية.`
          : `--- National Executive Decision Support & Economic Forecasting Report 2026 ---\n\n` +
            `Based on the predictive AI modeling suites implemented at the Ministry of Commerce & Industry, Sudan's national GDP is projected to accelerate by +8.5% towards the next fiscal year. This is driven by structural regulatory updates and aggressive trade promotion pipelines with COMESA regional partners.\n\n` +
            `High-Impact Investment Recommendations:\n` +
            `- Port Sudan National Grain Silos Project (Projected ROI of 18.2% with a low-risk profile).\n` +
            `- Al Qadarif Agro-Industrial Cluster Expansion (Directly contributes to local regional GDP by +2.1%).\n\n` +
            `Proposed Actionable Policies:\n` +
            `1. Deploy the 50% customs relief package for raw material industrial imports immediately to combat basic food inflation and boost local factories.\n` +
            `2. Standardize legal frameworks for the Gezira-Sennar railway PPP contract to streamline the supply-chain corridor.`
      );
    }, 2000);
  };

  // Add initiative (Module 2)
  const handleCreateInitiative = () => {
    if (!newInitiativeTitleAr) return;
    const item = {
      id: `init-${Date.now()}`,
      titleAr: newInitiativeTitleAr,
      titleEn: newInitiativeTitleEn || newInitiativeTitleAr,
      status: "on-track",
      progress: 0,
      category: newInitiativeCategory
    };
    setInitiatives(prev => [...prev, item]);
    setNewInitiativeTitleAr("");
    setNewInitiativeTitleEn("");
  };

  // Business failure prediction logic (Module 5)
  const handlePredictFailure = (companyAge: number, employeeCount: number, debtToAsset: number) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mock predictive calculation logic
      const calculatedRisk = (debtToAsset * 0.7) - (companyAge * 0.05);
      if (calculatedRisk > 0.5) {
        setFailurePredictionResult(
          currentLanguage === "ar"
            ? `[تحذير ذكي]: خطورة تعثر عالية (المؤشر: ${(calculatedRisk * 100).toFixed(1)}%). يُنصح بتقديم خطة إرشاد ومساندة تمويلية عاجلة.`
            : `[Risk Alert]: High probability of insolvency (${(calculatedRisk * 100).toFixed(1)}%). Recommended: Assign emergency financial advisory mentorship.`
        );
      } else {
        setFailurePredictionResult(
          currentLanguage === "ar"
            ? `[مؤشر أمان]: خطورة تعثر منخفضة للغاية (المؤشر: ${(calculatedRisk * 100).toFixed(1)}%). المؤسسة مرشحة لبرنامج الحوافز والتوسع التصديري.`
            : `[Low Risk]: Solvency status stable (${(calculatedRisk * 100).toFixed(1)}%). Eligible for export acceleration and direct grants.`
        );
      }
    }, 1200);
  };

  // Sync state data on selected GIS Map (Module 7)
  const handleMapStateSelect = (stateName: string) => {
    setSelectedState(stateName);
    if (stateName.includes("Red Sea")) {
      setStateInvestmentData({
        activeProjects: 24,
        industrialZones: ["South Port Zone", "Suakin Logistics Corridor"],
        keyResourcesAr: "الصمغ العربي، الملح، الثروة السمكية، الذهب",
        keyResourcesEn: "Gum Arabic, Salt, Fish Stocks, Gold Mines"
      });
    } else if (stateName.includes("Gezira")) {
      setStateInvestmentData({
        activeProjects: 18,
        industrialZones: ["Madani Agricultural Industrial Hub", "Bagair Cluster"],
        keyResourcesAr: "القطن، القمح، الذرة، الثروة الحيوانية",
        keyResourcesEn: "Cotton fields, Wheat, Sorghum, Livestock"
      });
    } else if (stateName.includes("Kordofan")) {
      setStateInvestmentData({
        activeProjects: 15,
        industrialZones: ["El Obeid Gum Arabic Park", "Central Kordofan Livestock Area"],
        keyResourcesAr: "الصمغ الهشاب، الفول السوداني، الكركديه، الماشية",
        keyResourcesEn: "Gum Arabic (Hashab), Groundnuts, Hibiscus, Livestock"
      });
    }
  };

  // Generate simulated future projection data (Module 8)
  useEffect(() => {
    const yearsProj = forecastingHorizon === "5-years" ? 5 : 10;
    const proj = [];
    let currentGdp = 45.5;
    let currentInf = 12.4;
    for (let i = 1; i <= yearsProj; i++) {
      const year = 2026 + i;
      currentGdp = parseFloat((currentGdp * 1.085).toFixed(2)); // +8.5% annual GDP growth target
      currentInf = parseFloat((currentInf * 0.9).toFixed(2)); // -10% annual deflation stabilization
      proj.push({
        year: year.toString(),
        projectedGdp: currentGdp,
        projectedInflation: currentInf,
        projectedSovereignRevenue: parseFloat((currentGdp * 0.15).toFixed(2)) // Federal taxation ratio estimate
      });
    }
    setSimulatedRevenueSovereign(proj);
  }, [forecastingHorizon]);

  return (
    <div className="bg-slate-50 min-h-screen text-[#1E293B]" id="national-intelligence-strategic-decision">
      {/* Module Title Section */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-[#0F172A] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg mb-6 border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,215,0,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black bg-sudan-gold/20 text-sudan-gold border border-sudan-gold/30 px-3 py-1 rounded-full uppercase tracking-wider">
              {currentLanguage === "ar" ? "رؤية السودان ٢٠٣٥ - نظام القيادة الفيدرالي" : "SUDAN VISION 2035 - FEDERAL OPERATIONS"}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
              <Landmark className="w-7 h-7 text-sudan-gold" />
              {currentLanguage === "ar" ? "المنصة الوطنية للذكاء الاقتصادي ودعم القرار الاستراتيجي" : "National Economic Intelligence & Strategic Planning"}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-semibold max-w-3xl leading-relaxed">
              {currentLanguage === "ar"
                ? "بوابة القرار الفيدرالي لنمذجة السياسات الاقتصادية والإنتاج الصناعي والتنبؤ المستقبلي ودعم متخذي القرار والوزراء لجمهورية السودان."
                : "Sovereign intelligence gateway for national economic forecasting, industrial cluster benchmarking, PPP investment mapping, and ministerial decision support."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleGenerateExecutiveReport}
              className="bg-sudan-gold hover:bg-amber-500 text-slate-900 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-slate-900 animate-pulse" />
              {currentLanguage === "ar" ? "إعداد التقرير التنبؤي الذكي" : "Generate Predictive Report"}
            </button>
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-center text-xs font-bold font-mono">
              <span className="text-emerald-400 block text-[9px] uppercase tracking-widest">Sovereign Node</span>
              ACTIVE SECURE
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1.5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 pb-2 border-b border-slate-100">
            {currentLanguage === "ar" ? "وحدات الذكاء الاقتصادي" : "INTELLIGENCE MODULES"}
          </h3>

          {[
            { id: "economic-intelligence", labelAr: "مركز الذكاء الاقتصادي", labelEn: "Economic Intelligence", icon: TrendingUp, descAr: "الناتج المحلي، التضخم ومؤشرات الاقتصاد", descEn: "GDP, inflation, trade indexes" },
            { id: "strategic-planning", labelAr: "منصة التخطيط الاستراتيجي", labelEn: "Strategic Planning", icon: Landmark, descAr: "متابعة أهداف رؤية السودان 2035", descEn: "Vision 2035 Balanced Scorecard" },
            { id: "investment-intelligence", labelAr: "ذكاء الاستثمار والمطابقة", labelEn: "Investment Intelligence", icon: Compass, descAr: "فرص الشراكة ومحاكاة العوائد", descEn: "PPP discovery & ROI simulations" },
            { id: "industrial-intelligence", labelAr: "المعلومات الصناعية والمصانع", labelEn: "Industrial Intelligence", icon: Activity, descAr: "تحليل كفاءة الإنتاج وسلاسل الإمداد", descEn: "Factory outputs & raw materials" },
            { id: "business-observatory", labelAr: "المرصد الوطني للأعمال", labelEn: "Business Observatory", icon: Briefcase, descAr: "نمو الشركات وتوقع نسب التعثر", descEn: "Demographics & insolvency tool" },
            { id: "executive-decision", labelAr: "مركز دعم القرار الفيدرالي", labelEn: "Executive Decision Support", icon: Sliders, descAr: "لوحة تحكم الوزراء ومحاكاة السيناريوهات", descEn: "Minister tools & what-if analysis" },
            { id: "geospatial-analytics", labelAr: "التحليلات الجغرافية والخرائط", labelEn: "Geospatial Analytics & GIS", icon: MapPin, descAr: "خريطة الاستثمار والمناطق الصناعية", descEn: "GIS heatmaps & industrial corridors" },
            { id: "forecasting-center", labelAr: "مركز التنبؤ والمستقبل", labelEn: "Forecasting & Future Analytics", icon: Zap, descAr: "نماذج التنبؤ بالإيرادات والنمو الاقتصادي", descEn: "Predictive models & GDP curves" },
            { id: "policy-analysis", labelAr: "تقييم السياسات والتشريعات", labelEn: "Policy Impact Center", icon: ClipboardList, descAr: "محاكاة الأثر المالي والتشريعي للقرارات", descEn: "Regulatory simulations & briefings" },
            { id: "performance-center", labelAr: "المركز الوطني لقياس الأداء", labelEn: "National Performance KPIs", icon: Award, descAr: "مؤشرات التجارة والتمكين والالتزام", descEn: "Trade, Industry & G2B satisfaction" }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setAiReport("");
                }}
                className={`w-full flex flex-col gap-0.5 px-3 py-2 text-right transition-all border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md font-black rounded-2xl"
                    : "bg-white border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-100 rounded-xl"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-sudan-gold" : "text-slate-400"}`} />
                  <span className="text-xs font-bold leading-tight">{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
                </div>
                <span className={`text-[9px] font-semibold block ${isSelected ? "text-slate-300" : "text-gray-400"}`}>
                  {currentLanguage === "ar" ? tab.descAr : tab.descEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Workspace Area */}
        <div className="lg:col-span-3 flex flex-col">
          
          {/* Executive AI generated report overlay */}
          {aiReport && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-950 text-slate-100 p-5 rounded-3xl mb-6 shadow-md border border-slate-800 text-xs font-mono space-y-3 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-extrabold text-sudan-gold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-sudan-gold animate-bounce" />
                  {currentLanguage === "ar" ? "تقرير استشاري ذكي صادر عن خادم القرار الفيدرالي:" : "Sovereign Decision AI Advisory:"}
                </span>
                <span className="text-[10px] text-emerald-400">STATUS: APPROVED & VERIFIED</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-[11px] text-slate-300">{aiReport}</p>
            </motion.div>
          )}

          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-2xs flex-1 flex flex-col justify-between">
            
            {/* MODULE 1: NATIONAL ECONOMIC INTELLIGENCE */}
            {activeTab === "economic-intelligence" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مؤشرات الاقتصاد الكلي ودرجة مرونة الأسواق" : "National Economic Indicators & Market Resilience"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "رصد متكامل للناتج المحلي الإجمالي، معدلات التضخم، الميزان التجاري، ومؤشر الثقة الوطني بجمهورية السودان." : "Track macro metrics including GDP, inflation rates, trade balances, and sovereign investment indicators."}
                    </p>
                  </div>
                  <select
                    value={targetIndicator}
                    onChange={(e) => setTargetIndicator(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-black p-2 rounded-lg outline-none"
                  >
                    <option value="gdp">{currentLanguage === "ar" ? "الناتج المحلي الإجمالي ($B)" : "Gross Domestic Product ($B)"}</option>
                    <option value="inflation">{currentLanguage === "ar" ? "معدل التضخم القومي (%)" : "National Inflation (%)"}</option>
                    <option value="tradeBalance">{currentLanguage === "ar" ? "الميزان التجاري ($B)" : "Trade Balance ($B)"}</option>
                    <option value="industrialProduction">{currentLanguage === "ar" ? "مؤشر الإنتاج الصناعي" : "Industrial Production Index"}</option>
                  </select>
                </div>

                {/* Scorecard grids for economic indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "الناتج الإجمالي الفيدرالي" : "National GDP"}</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-1 font-mono">$45.5B USD</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +13.1% YoY
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "التضخم السنوي المستقر" : "Annual Inflation"}</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-1 font-mono">12.4%</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> Stabilized
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "الميزان التجاري الفيدرالي" : "Federal Trade Balance"}</span>
                    <span className="text-xl font-extrabold text-emerald-700 block mt-1 font-mono">+$2.1B USD</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> Trade Surplus
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">{currentLanguage === "ar" ? "الإنتاج الصناعي العام" : "Industrial Index"}</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-1 font-mono">124.6</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> Active Growth
                    </span>
                  </div>
                </div>

                {/* Macro chart visualization */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={indicators}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fontWeight: "bold" }} />
                      <YAxis tick={{ fontSize: 10, fontWeight: "bold" }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                      <Line
                        type="monotone"
                        dataKey={targetIndicator}
                        stroke="#0F5132"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                        name={targetIndicator.toUpperCase()}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* MODULE 2: STRATEGIC PLANNING PLATFORM */}
            {activeTab === "strategic-planning" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "رؤية السودان ٢٠٣٥ - بطاقة الأداء المتوازن الفيدرالية" : "Sudan Vision 2035 - Strategic Performance Balanced Scorecard"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "متابعة المبادرات الاستراتيجية والمحاور القومية لوزارة التجارة والصناعة وتأثيرها على الناتج المحلي والتوطين." : "Track state initiatives, strategic target achievements, and planning roadmaps aligned with the 2035 blueprint."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left block: initiatives overview & submission */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "المبادرات الاستراتيجية الفيدرالية القائمة" : "Active Strategic Initiatives"}
                    </h3>
                    <div className="space-y-3">
                      {initiatives.map(init => (
                        <div key={init.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-sm">
                              {init.category}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm ${init.status === "on-track" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                              {init.status.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 mb-2">
                            {currentLanguage === "ar" ? init.titleAr : init.titleEn}
                          </h4>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-sudan-green h-full rounded-full transition-all" style={{ width: `${init.progress}%` }}></div>
                            </div>
                            <span className="text-xs font-mono font-black shrink-0">{init.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Strategic Initiative form */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 mb-3">{currentLanguage === "ar" ? "إضافة مبادرة استراتيجية جديدة للموازنة" : "Propose New Strategic Initiative"}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <input
                          type="text"
                          value={newInitiativeTitleAr}
                          onChange={(e) => setNewInitiativeTitleAr(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "عنوان المبادرة بالعربية..." : "Initiative Title (Arabic)..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sudan-green col-span-2"
                        />
                        <select
                          value={newInitiativeCategory}
                          onChange={(e) => setNewInitiativeCategory(e.target.value)}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none"
                        >
                          <option value="Industry">Industry</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Finance">Finance</option>
                          <option value="Infrastructure">Infrastructure</option>
                        </select>
                      </div>
                      <button
                        onClick={handleCreateInitiative}
                        disabled={!newInitiativeTitleAr}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        {currentLanguage === "ar" ? "تسجيل المبادرة وربطها بالمؤشرات" : "Create & Track Initiative"}
                      </button>
                    </div>
                  </div>

                  {/* Right block: Vision 2035 Strategic Risk register */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "سجل المخاطر الاستراتيجية والوقاية" : "Strategic Risk Register"}
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
                      <div className="border-l-4 border-red-500 pl-3">
                        <span className="text-[10px] text-red-700 font-bold block uppercase">Risk R-904 (HIGH)</span>
                        <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                          {currentLanguage === "ar" ? "عدم استقرار سلاسل توريد الوقود للمصانع" : "Fuel Supply-Chain Disruptions for Factories"}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold mt-1">
                          {currentLanguage === "ar" ? "خطة التخفيف: ربط مباشر مع محطات الطاقة الشمسية بكسلا والشراكة مع المصفاة." : "Mitigation: Transitioning critical industrial zones to solar backup networks."}
                        </p>
                      </div>

                      <div className="border-l-4 border-amber-500 pl-3">
                        <span className="text-[10px] text-amber-700 font-bold block uppercase">Risk R-112 (MEDIUM)</span>
                        <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                          {currentLanguage === "ar" ? "تقلبات أسعار الصرف الدولية للمحاصيل السيادية" : "International Currency Volatility for Crop Exports"}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold mt-1">
                          {currentLanguage === "ar" ? "خطة التخفيف: اعتماد مقايضة العملات والتبادل مع بنك السودان المركزي لامتصاص الصدمات." : "Mitigation: Hedging Gum Arabic export contracts with local central bank currency pools."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: INVESTMENT INTELLIGENCE */}
            {activeTab === "investment-intelligence" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "منصة استكشاف ومحاكاة فرص الاستثمار الوطني" : "Investment Opportunity Discovery & ROI Simulator"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "محاكاة العوائد على المشاريع القومية والشراكات بين القطاعين (PPP)، وحساب معدلات الفائدة والجدوى الذكية." : "Discover state-backed PPP ventures, model financial ratios, and calculate risk adjusted payback periods."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Opportunities Selector & Simulation Controls */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "اختر المشروع القومي للمحاكاة" : "Select PPP Project Venture"}
                    </h3>
                    <div className="space-y-2">
                      {INVESTMENT_OPPORTUNITIES.map(opp => (
                        <button
                          key={opp.id}
                          onClick={() => {
                            setSelectedOppId(opp.id);
                            setSimResult(null);
                          }}
                          className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition-all flex flex-col gap-1 ${
                            selectedOppId === opp.id
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[9px] uppercase font-mono">{opp.cost}</span>
                            <span className="text-[9px] bg-sudan-gold/20 text-sudan-gold px-1.5 py-0.5 rounded-sm">ROI: {opp.potentialRoi}%</span>
                          </div>
                          <p className="leading-snug mt-1">{currentLanguage === "ar" ? opp.titleAr : opp.titleEn}</p>
                        </button>
                      ))}
                    </div>

                    {/* Sim controls */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 text-xs font-bold">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>{currentLanguage === "ar" ? "نسبة الرفع المالي للقروض:" : "Leverage / Debt Ratio:"}</span>
                          <span className="font-mono text-sudan-green">{simLeverageRatio}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="80"
                          value={simLeverageRatio}
                          onChange={(e) => setSimLeverageRatio(parseInt(e.target.value))}
                          className="w-full accent-sudan-green"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>{currentLanguage === "ar" ? "نسبة الكفاءة التشغيلية المتوقعة:" : "Target Operational Efficiency:"}</span>
                          <span className="font-mono text-sudan-green">{simOperationalEfficiency}%</span>
                        </div>
                        <input
                          type="range"
                          min="70"
                          max="100"
                          value={simOperationalEfficiency}
                          onChange={(e) => setSimOperationalEfficiency(parseInt(e.target.value))}
                          className="w-full accent-sudan-green"
                        />
                      </div>

                      <button
                        onClick={handleRunRoiSimulation}
                        className="w-full bg-sudan-green hover:bg-sudan-green-light text-white p-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-4 h-4 text-sudan-gold" />
                        {currentLanguage === "ar" ? "تشغيل محاكاة الجدوى المالية" : "Calculate Financial ROI"}
                      </button>
                    </div>
                  </div>

                  {/* Simulation results panel */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "مخرجات تقييم الجدوى الاستثمارية" : "Project ROI Evaluation Output"}
                    </h3>

                    {simResult ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block uppercase">{currentLanguage === "ar" ? "معدل العائد الداخلي المعدل" : "Adjusted Internal Rate of Return (IRR)"}</span>
                            <span className="text-3xl font-mono font-extrabold text-sudan-gold block mt-2">{simResult.roi}%</span>
                            <p className="text-[11px] text-slate-400 font-semibold mt-3 leading-relaxed">
                              {currentLanguage === "ar"
                                ? "يتم احتساب هذا المؤشر بناءً على هيكلة الدين والإنتاج المتوازن ومدى استقرار خطوط النقل بميناء بورتسودان."
                                : "Adjusted dynamically based on debt financing levels, logistics support corridors, and local commodity indices."}
                            </p>
                          </div>
                          <span className="text-[10px] bg-slate-800 text-slate-200 font-bold px-2 py-1 rounded-md block mt-4 text-center">
                            {currentLanguage === "ar" ? `مستوى المخاطرة المعدل: ${simResult.riskLevel}` : `Adjusted Risk Profile: ${simResult.riskLevel}`}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs font-bold">
                          <div>
                            <span className="text-gray-400 block font-bold text-[10px] uppercase">{currentLanguage === "ar" ? "الربح الصافي السنوي المحاكي" : "Simulated annual net returns"}</span>
                            <span className="text-lg text-slate-900 block font-mono mt-1">{simResult.netPresentValue}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-bold text-[10px] uppercase">{currentLanguage === "ar" ? "نقطة التعادل المتوقعة" : "Estimated Break-even Period"}</span>
                            <span className="text-lg text-slate-900 block font-mono mt-1">{simResult.breakEvenYears} {currentLanguage === "ar" ? "سنوات" : "Years"}</span>
                          </div>

                          <div className="border-t border-slate-200/60 pt-3">
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded-sm block font-semibold">
                              {currentLanguage === "ar" ? "✓ مؤهل للحوافز الضريبية والامتيازات السيادية" : "✓ Qualified for state customs relief & sovereign incentives"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-12 rounded-2xl text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                        <Sliders className="w-10 h-10 text-gray-300 animate-pulse" />
                        <p className="text-xs text-gray-500 font-bold">
                          {currentLanguage === "ar"
                            ? "الرجاء تحديد المشروع وتعديل معايير الرفع المالي ثم الضغط على تشغيل المحاكاة."
                            : "Adjust the financing sliders on the left and click 'Calculate Financial ROI' to view simulations."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: INDUSTRIAL INTELLIGENCE */}
            {activeTab === "industrial-intelligence" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "المعلومات الصناعية ومؤشرات تشغيل المصانع" : "National Industrial Intelligence & Capacity Mapping"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "رصد القدرة التشغيلية الفورية للمجمعات الصناعية، كفاءة الأيدي العاملة، ومؤشر المدخلات الخام." : "Real-time performance metrics across federal sugar complexes, heavy metal clusters, and national cement factories."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {factories.map(fac => (
                    <div
                      key={fac.id}
                      onClick={() => {
                        setSelectedFactoryId(fac.id);
                        setUpdateCapacityVal(fac.capacity.toString());
                      }}
                      className={`p-4 rounded-2xl border text-xs font-semibold cursor-pointer transition-all space-y-3 ${
                        selectedFactoryId === fac.id
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      <h4 className="font-extrabold">{currentLanguage === "ar" ? fac.nameAr : fac.nameEn}</h4>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div>
                          <span className="text-gray-400 block">{currentLanguage === "ar" ? "القدرة التشغيلية:" : "Capacity:"}</span>
                          <span className="font-bold text-sudan-gold">{fac.capacity}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">{currentLanguage === "ar" ? "مؤشر الكفاءة:" : "Efficiency:"}</span>
                          <span className="font-bold text-emerald-400">{fac.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Industrial capacity updates */}
                {selectedFactoryId && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs font-bold">
                      <span className="text-gray-500 block uppercase text-[10px]">{currentLanguage === "ar" ? "تعديل القدرة الإنتاجية للمصنع" : "Adjust Operational Capacity"}</span>
                      <p className="text-slate-800 font-extrabold mt-1">
                        {factories.find(f => f.id === selectedFactoryId)?.nameAr}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={updateCapacityVal}
                        onChange={(e) => setUpdateCapacityVal(e.target.value)}
                        className="bg-white border border-slate-200 font-mono text-center font-bold text-xs p-2.5 rounded-xl w-20 outline-none focus:border-sudan-green"
                      />
                      <button
                        onClick={() => {
                          setFactories(prev => prev.map(f => f.id === selectedFactoryId ? { ...f, capacity: parseInt(updateCapacityVal || "50") } : f));
                        }}
                        className="bg-sudan-green text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all hover:bg-sudan-green-light cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تحديث المؤشرات الفيدرالية" : "Update Industrial Capacity"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODULE 5: BUSINESS OBSERVATORY */}
            {activeTab === "business-observatory" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "المرصد التجاري الوطني والتنبؤ بنسب تعثر الشركات" : "National Business Observatory & Failure Prediction Tool"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "محاكاة ذكية ونماذج تنبؤية لقياس مدى مرونة المشاريع الصغيرة والمتوسطة وتوقع نسب التعثر المالي." : "Intelligent failure predictions based on operational lifespan, workforce size, and balance-sheet leverage."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Interactive prediction input */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 text-xs font-bold">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "معايير الشركة المطلوب تقييمها" : "Business Health Metrics"}
                    </h3>

                    <div>
                      <label className="text-gray-500 block mb-1">{currentLanguage === "ar" ? "عمر الشركة في السوق (بالسنوات):" : "Years Active in Market:"}</label>
                      <input
                        type="number"
                        defaultValue="3"
                        id="obs-age"
                        className="w-full bg-white border border-slate-200 p-2 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-500 block mb-1">{currentLanguage === "ar" ? "عدد العمال والموظفين المعتمدين:" : "Registered Employees:"}</label>
                      <input
                        type="number"
                        defaultValue="12"
                        id="obs-emp"
                        className="w-full bg-white border border-slate-200 p-2 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-500 block mb-1">{currentLanguage === "ar" ? "نسبة الديون إلى إجمالي الأصول (D/A):" : "Debt-to-Asset Leverage Ratio:"}</label>
                      <select
                        id="obs-leverage"
                        className="w-full bg-white border border-slate-200 p-2 rounded-xl outline-none"
                      >
                        <option value="0.2">Low (20%)</option>
                        <option value="0.5">Medium (50%)</option>
                        <option value="0.8">High (80%)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        const age = parseInt((document.getElementById("obs-age") as HTMLInputElement)?.value || "3");
                        const emp = parseInt((document.getElementById("obs-emp") as HTMLInputElement)?.value || "12");
                        const lev = parseFloat((document.getElementById("obs-leverage") as HTMLSelectElement)?.value || "0.5");
                        handlePredictFailure(age, emp, lev);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "توقع نسبة التعثر والاستقرار" : "Calculate Insolvency Risk"}
                    </button>
                  </div>

                  {/* Right column: predictions output and demographics overview */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "مخرجات توقع الذكاء الاصطناعي" : "Insolvency Risk Assessment Outcome"}
                    </h3>

                    {failurePredictionResult ? (
                      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
                        <p className="text-xs font-mono font-bold leading-relaxed text-sudan-gold">
                          {failurePredictionResult}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-2xl text-center border-2 border-dashed border-slate-200 text-xs text-gray-500 font-bold">
                        {currentLanguage === "ar" ? "أدخل المعايير التشغيلية واضغط على تشغيل الحساب." : "Please submit business metrics to trigger calculations."}
                      </div>
                    )}

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                      <h4 className="text-xs font-extrabold text-slate-800">{currentLanguage === "ar" ? "التركيبة السكانية والديموغرافية للشركات حسب القطاع" : "Sector Growth Demographics"}</h4>
                      <div className="space-y-2">
                        {demographics.map((dem, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-bold border-b border-slate-200/50 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-slate-800">{currentLanguage === "ar" ? dem.sectorAr : dem.sectorEn}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-500 font-mono">{dem.count} Co.</span>
                              <span className={`font-mono ${dem.growth > 0 ? "text-emerald-600" : "text-red-500"}`}>{dem.growth > 0 ? `+${dem.growth}` : dem.growth}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 6: EXECUTIVE DECISION SUPPORT */}
            {activeTab === "executive-decision" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مركز دعم القرار التنفيذي للوزراء" : "Executive Decision Support Center"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "عرض تنبيهات الطوارئ، تحليلات المخزون القومي للمحاصيل والسلع والتقارير الفيدرالية المباشرة لمجلس الوزراء." : "Executive workspace with active alerts, policy options briefings, and raw material monitoring indexes."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left block: alerts center */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <Bell className="w-4 h-4 text-sudan-gold" />
                      {currentLanguage === "ar" ? "تنبيهات الطوارئ واللوجستيات التنفيذية" : "Active Executive Alerts"}
                    </h3>
                    <div className="space-y-3">
                      {executiveAlerts.map(alt => (
                        <div
                          key={alt.id}
                          className={`p-3.5 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-3 ${
                            alt.severity === "high"
                              ? "bg-red-50 border-red-200 text-red-900"
                              : "bg-emerald-50 border-emerald-200 text-emerald-900"
                          }`}
                        >
                          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                              <span>TIME: {alt.time}</span>
                              <span className="font-extrabold">{alt.severity.toUpperCase()}</span>
                            </div>
                            <p>{currentLanguage === "ar" ? alt.messageAr : alt.messageEn}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right block: scenario planner triggers */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
                    <h4 className="text-xs font-black text-slate-800">{currentLanguage === "ar" ? "نماذج دعم القرار وصنع الخيارات" : "Decision Optimization Suites"}</h4>
                    <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                      {currentLanguage === "ar"
                        ? "أدوات متطورة لمطابقة مخرجات التضخم والنمو الاقتصادي مع القرارات الجمركية المستهدفة."
                        : "Analyze expected macroeconomic trade-offs dynamically based on regional COMESA directives."}
                    </p>

                    <button
                      onClick={handleGenerateExecutiveReport}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "صياغة بدائل القرار السيادي" : "Formulate Policy Alternatives"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 7: NATIONAL GEOSPATIAL ANALYTICS */}
            {activeTab === "geospatial-analytics" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "التحليلات الجغرافية الرقمية والمناطق الصناعية (GIS)" : "National Geospatial Analytics & Industrial GIS Mapping"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "خريطة تفاعلية لولايات السودان توضح الموارد الطبيعية والمجمعات الصناعية والمشاريع الاستثمارية الكبرى." : "Interactive spatial interface charting resource allocations, investment clusters, and dry ports."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column: map representation */}
                  <div className="lg:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between min-h-[300px]">
                    <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">Sovereign GIS Interface (Simulated Vectors)</span>
                    
                    {/* SVG/Styled Map of State highlights */}
                    <div className="flex justify-center items-center h-48 gap-3 relative">
                      <button
                        onClick={() => handleMapStateSelect("Red Sea (Port Sudan)")}
                        className={`p-3 rounded-2xl border text-xs font-black transition-all ${
                          selectedState.includes("Red Sea")
                            ? "bg-sudan-green text-white scale-105"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {currentLanguage === "ar" ? "البحر الأحمر - بورتسودان" : "Red Sea (Port Sudan)"}
                      </button>

                      <button
                        onClick={() => handleMapStateSelect("Gezira (Wad Madani)")}
                        className={`p-3 rounded-2xl border text-xs font-black transition-all ${
                          selectedState.includes("Gezira")
                            ? "bg-sudan-green text-white scale-105"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {currentLanguage === "ar" ? "الجزيرة - ودمدني" : "Gezira (Wad Madani)"}
                      </button>

                      <button
                        onClick={() => handleMapStateSelect("Kordofan (El Obeid)")}
                        className={`p-3 rounded-2xl border text-xs font-black transition-all ${
                          selectedState.includes("Kordofan")
                            ? "bg-sudan-green text-white scale-105"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {currentLanguage === "ar" ? "كردفان - الأبيض" : "Kordofan (El Obeid)"}
                      </button>
                    </div>

                    <p className="text-[10px] text-center text-gray-400 font-bold">
                      {currentLanguage === "ar" ? "انقر على الولاية لعرض الموارد الاستراتيجية والمجمعات الصناعية النشطة." : "Click on any state button to load resource maps and regional PPP opportunities."}
                    </p>
                  </div>

                  {/* Right column: state investment details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 text-xs font-bold">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? `بيانات ولاية: ${selectedState}` : `Data Profile: ${selectedState}`}
                    </h3>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">{currentLanguage === "ar" ? "المشاريع الاستثمارية النشطة:" : "Active PPP Ventures:"}</span>
                      <span className="text-lg text-slate-900 block font-mono font-extrabold">{stateInvestmentData.activeProjects} Projects</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">{currentLanguage === "ar" ? "المناطق الصناعية الفيدرالية:" : "State Industrial Parks:"}</span>
                      <div className="space-y-1 mt-1">
                        {stateInvestmentData.industrialZones.map((z: string, i: number) => (
                          <span key={i} className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-sm block font-semibold">{z}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">{currentLanguage === "ar" ? "الموارد الاستراتيجية القومية:" : "Key Natural Resources:"}</span>
                      <p className="text-slate-800 font-extrabold mt-1 text-[11px] leading-relaxed">
                        {currentLanguage === "ar" ? stateInvestmentData.keyResourcesAr : stateInvestmentData.keyResourcesEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: NATIONAL FORECASTING CENTER */}
            {activeTab === "forecasting-center" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مركز التنبؤات الاقتصادية والإيرادات السيادية" : "Sovereign Revenue & Economic Forecasting Center"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "نماذج إحصائية وتنبؤية متطورة للناتج المحلي وتضخم الأسعار بناءً على خطة خمسية أو عشرية مستهدفة." : "Model five to ten years of simulated state revenue, inflation mitigation, and federal industrial margins."}
                    </p>
                  </div>
                  <select
                    value={forecastingHorizon}
                    onChange={(e) => setForecastingHorizon(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-black p-2 rounded-lg outline-none"
                  >
                    <option value="5-years">5-Years Horizon</option>
                    <option value="10-years">10-Years Horizon</option>
                  </select>
                </div>

                {/* Simulated future charts */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulatedRevenueSovereign}>
                      <defs>
                        <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F5132" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0F5132" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fontWeight: "bold" }} />
                      <YAxis tick={{ fontSize: 10, fontWeight: "bold" }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                      <Area type="monotone" dataKey="projectedGdp" stroke="#0F5132" fillOpacity={1} fill="url(#colorGdp)" name="GDP Projection ($B)" />
                      <Area type="monotone" dataKey="projectedSovereignRevenue" stroke="#F1C40F" fillOpacity={0.3} fill="#F1C40F" name="State Revenue Est ($B)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[10px] text-slate-400 font-mono text-center">
                  *PROJECTION CRITERIA: ASSUMES CONSTANT COGNITIVE ALIGNMENT & ANNUAL CROP HARVEST EXPORT PERFORMANCE
                </p>
              </div>
            )}

            {/* MODULE 9: POLICY IMPACT CENTER */}
            {activeTab === "policy-analysis" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مركز دراسة وتحليل السياسات والتشريعات التجارية" : "Policy Impact Assessment & Simulation"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "تحليل الأثر الاقتصادي المترتب على تعديل الرسوم الضريبية والجمركية وحساب أثر التشريعات على بيئة الأعمال." : "Simulate how major legislative changes impact national gdp, job creation, and federal treasury balances."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Policy select */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "حزم السياسات المتاحة للمحاكاة" : "Sovereign Policy Packages"}
                    </h3>
                    <div className="space-y-2">
                      {POLICY_SCENARIOS.map(scen => (
                        <button
                          key={scen.id}
                          onClick={() => setSelectedScenarioId(scen.id)}
                          className={`w-full text-right p-3.5 rounded-xl border text-xs font-bold transition-all flex flex-col gap-1 ${
                            selectedScenarioId === scen.id
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <span className="text-[9px] text-sudan-gold uppercase font-mono">{scen.sector}</span>
                          <p className="leading-snug mt-1">{currentLanguage === "ar" ? scen.titleAr : scen.titleEn}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Impact outputs */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "الأثر الاقتصادي والمالي المتوقع للسياسة" : "Projected Impact Scorecard"}
                    </h3>

                    {selectedScenarioId && (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase">{currentLanguage === "ar" ? "الأثر المتوقع على الناتج المحلي الإجمالي (GDP):" : "GDP Impact Projection:"}</span>
                          <span className="text-xl text-emerald-700 block mt-1 font-mono">
                            {POLICY_SCENARIOS.find(s => s.id === selectedScenarioId)?.gdpImpact}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase">{currentLanguage === "ar" ? "الأثر على التضخم الأسواق:" : "Inflation Variance Rate:"}</span>
                          <span className="text-xl text-amber-700 block mt-1 font-mono">
                            {POLICY_SCENARIOS.find(s => s.id === selectedScenarioId)?.inflationImpact}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase">{currentLanguage === "ar" ? "عدد الوظائف المتوقع خلقها بالولاية:" : "Employment Generation Index:"}</span>
                          <span className="text-xl text-slate-900 block mt-1 font-mono">
                            {POLICY_SCENARIOS.find(s => s.id === selectedScenarioId)?.jobCreation}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase">{currentLanguage === "ar" ? "التكلفة أو الوفورات المالية المقدرة:" : "Fiscal Treasury Balance Variance:"}</span>
                          <span className="text-xl text-slate-900 block mt-1 font-mono">
                            {POLICY_SCENARIOS.find(s => s.id === selectedScenarioId)?.costSDG}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 10: NATIONAL PERFORMANCE CENTER */}
            {activeTab === "performance-center" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "المركز الوطني لمراقبة الأداء وقياس الموازاة" : "Federal Performance KPI & Service Level Oversight"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "بطاقة الأداء العام لوزارة التجارة لمراقبة تسيير المعاملات والتوطين والتعاطي التجاري بجمهورية السودان." : "Comprehensive SLA tracking covering trade licenses, raw input localization ratio, and investment thresholds."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {kpiScorecard.map((kpi, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-bold">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-mono block">{kpi.code}</span>
                        <h4 className="text-slate-800 font-extrabold">
                          {currentLanguage === "ar" ? kpi.nameAr : kpi.nameEn}
                        </h4>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 font-mono">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Target</span>
                          <span>{kpi.target}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Actual</span>
                          <span className={kpi.status === "met" ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>{kpi.actual}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${kpi.status === "met" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {kpi.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
