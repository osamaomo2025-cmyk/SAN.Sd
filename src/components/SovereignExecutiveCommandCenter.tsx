/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * National Executive Command Center & Vision 2035 Strategic Intelligence Platform
 * Compliance with ISO/IEC 25010, WCAG 2.2 AA & National Security Protocols
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { 
  Shield, Landmark, Users, TrendingUp, AlertTriangle, Cpu, Globe, Scale, Network, Database, 
  Sparkles, FileText, Download, Play, Sliders, RefreshCw, Layers, CheckCircle, Clock, MapPin, 
  SlidersHorizontal, Radio, Activity, Eye, Printer, Terminal, Send, Search, Bell, AlertOctagon, 
  BookOpen, ChevronRight, Briefcase, BarChart3, HelpCircle, FileCheck, CheckCircle2, Compass
} from "lucide-react";
import { UserRole } from "../types";

interface SovereignExecutiveCommandCenterProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// ---------------------- TYPES & SCHEMAS ----------------------

type ExecutiveRole = 
  | "minister" 
  | "undersecretary" 
  | "director_general" 
  | "executive_advisor" 
  | "strategic_planning" 
  | "bi_director" 
  | "statistics_officer" 
  | "prime_dashboard" 
  | "super_admin";

interface VisionIndicator {
  id: string;
  nameAr: string;
  nameEn: string;
  target2035: string;
  current: number;
  targetNum: number;
  unit: string;
  status: "on_track" | "warning" | "critical";
}

interface CommandAlert {
  id: string;
  timestamp: string;
  category: "strategic" | "risk" | "economic" | "investment" | "cyber" | "compliance" | "ai" | "crisis";
  severity: "critical" | "high" | "medium" | "low";
  msgAr: string;
  msgEn: string;
  status: "active" | "mitigated";
}

interface DigitalTwinNode {
  id: string;
  nameAr: string;
  nameEn: string;
  category: "hq" | "office" | "zone" | "logistics" | "warehouse" | "lab" | "project" | "ecosystem";
  locationAr: string;
  locationEn: string;
  utilization: number;
  status: "optimal" | "alert" | "critical";
  metric: string;
}

// ---------------------- SEED DATA ----------------------

const initialVisionIndicators: VisionIndicator[] = [
  { id: "V-GDP", nameAr: "مساهمة القطاع الصناعي في الناتج المحلي", nameEn: "Industrial GDP Contribution", target2035: "25%", current: 14.8, targetNum: 25, unit: "%", status: "warning" },
  { id: "V-FDI", nameAr: "معدل نمو الاستثمار الأجنبي المباشر", nameEn: "FDI Growth Rate", target2035: "15% Annually", current: 8.4, targetNum: 15, unit: "%", status: "warning" },
  { id: "V-EXP", nameAr: "حجم الصادرات السنوية المستهدفة", nameEn: "Annual Export Volume", target2035: "$5.0 Billion", current: 2.1, targetNum: 5.0, unit: "B$", status: "critical" },
  { id: "V-DIG", nameAr: "مؤشر النضج والتحول الرقمي الحكومي", nameEn: "Digital Government Maturity Index", target2035: "95%", current: 82.5, targetNum: 95, unit: "%", status: "on_track" },
  { id: "V-SAT", nameAr: "نسبة رضا المستفيدين من الخدمات القومية", nameEn: "National Consumer Satisfaction", target2035: "98%", current: 91.2, targetNum: 98, unit: "%", status: "on_track" },
  { id: "V-SUS", nameAr: "مؤشر الصناعات الخضراء المستدامة", nameEn: "Green & Sustainable Industry Index", target2035: "80%", current: 48.0, targetNum: 80, unit: "%", status: "warning" }
];

const initialAlerts: CommandAlert[] = [
  { id: "AL-109", timestamp: "04:15", category: "crisis", severity: "critical", msgAr: "انقطاع مفاجئ في سلاسل الإمداد بميناء بورتسودان يؤثر على تسليم المواد الخام الصناعية", msgEn: "Port Sudan logistics chain disruption affecting raw industrial imports", status: "active" },
  { id: "AL-110", timestamp: "03:40", category: "cyber", severity: "high", msgAr: "محاولة اختراق سيبراني مجهولة المصدر للمحفظة الرقمية الفيدرالية تم احتوائها بنجاح من قبل الـ SOC", msgEn: "SOC mitigated brute-force cyber attempt targeting Federal Digital Wallet", status: "active" },
  { id: "AL-111", timestamp: "02:10", category: "risk", severity: "medium", msgAr: "انخفاض طفيف في مؤشر كفاءة التشغيل الصناعي لولاية الجزيرة تحت العتبة المسموحة", msgEn: "Al Gezira industrial capacity utilization fell slightly below baseline", status: "mitigated" },
  { id: "AL-112", timestamp: "01:05", category: "ai", severity: "medium", msgAr: "الذكاء الاصطناعي يتوقع تباطؤاً في صادرات الصمغ العربي للشهر القادم بناءً على تقلبات الأسعار الدولية", msgEn: "AI model forecasts near-term export dip for Gum Arabic due to global pricing shift", status: "active" }
];

const digitalTwinNodes: DigitalTwinNode[] = [
  { id: "DT-01", nameAr: "ديوان الوزارة الرئيسي - الخرطوم", nameEn: "Ministry HQ - Khartoum Complex", category: "hq", locationAr: "الخرطوم", locationEn: "Khartoum", utilization: 86, status: "optimal", metric: "350 Active Staff" },
  { id: "DT-02", nameAr: "المكتب الإقليمي لولاية البحر الأحمر", nameEn: "Red Sea Regional Office", category: "office", locationAr: "بورتسودان", locationEn: "Port Sudan", utilization: 92, status: "optimal", metric: "110 Active Staff" },
  { id: "DT-03", nameAr: "منطقة بورتسودان الحرة للاستثمار", nameEn: "Port Sudan Free Investment Zone", category: "zone", locationAr: "البحر الأحمر", locationEn: "Red Sea", utilization: 74, status: "optimal", metric: "25 Registered Projects" },
  { id: "DT-04", nameAr: "مدينة جياد الصناعية الكبرى", nameEn: "Giad Heavy Industrial Complex", category: "zone", locationAr: "الجزيرة", locationEn: "Al Gezira", utilization: 91, status: "optimal", metric: "14 Large Factories" },
  { id: "DT-05", nameAr: "منطقة الباقير الصناعية الاستراتيجية", nameEn: "El Bagair Strategic Industrial Hub", category: "zone", locationAr: "الخرطوم بحري", locationEn: "Khartoum North", utilization: 96, status: "alert", metric: "Excessive Power Grid Load" },
  { id: "DT-06", nameAr: "مركز الخدمات اللوجستية وتوطين الصادرات", nameEn: "National Export Logistics Hub", category: "logistics", locationAr: "بورتسودان", locationEn: "Port Sudan", utilization: 98, status: "critical", metric: "98% Warehouse Capacity" },
  { id: "DT-07", nameAr: "مختبر معايير الجودة والمطابقة الوطني", nameEn: "National Standards & Calibration Lab", category: "lab", locationAr: "أم درمان", locationEn: "Omdurman", utilization: 68, status: "optimal", metric: "140 Tests/Day" }
];

const rawDataSources = [
  { id: "DS-01", name: "Commercial Registry DB (MySQL)", status: "connected", rate: "240 trans/sec", latency: "14ms" },
  { id: "DS-02", name: "Sovereign Payment Gateway API", status: "connected", rate: "410 pps", latency: "8ms" },
  { id: "DS-03", name: "Industrial IoT Sensors", status: "connected", rate: "4.8K metrics/sec", latency: "42ms" },
  { id: "DS-04", name: "Customs & Port Sudan GIS Feed", status: "connected", rate: "80 messages/min", latency: "110ms" },
  { id: "DS-05", name: "National Security SOC Alerts", status: "connected", rate: "Real-time stream", latency: "3ms" }
];

export default function SovereignExecutiveCommandCenter({ currentLanguage, role: initialRole }: SovereignExecutiveCommandCenterProps) {
  // Navigation & Role Configuration States
  const [activeRole, setActiveRole] = useState<ExecutiveRole>("minister");
  const [activeDashboard, setActiveDashboard] = useState<"national" | "vision" | "investment" | "trade" | "industrial" | "cyber" | "digital" | "scenarios">("national");
  const [isDataLakeSyncing, setIsDataLakeSyncing] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState("2026-07-17 04:00 AM");

  // Digital Twin Simulation Variables
  const [selectedTwinNode, setSelectedTwinNode] = useState<DigitalTwinNode | null>(digitalTwinNodes[5]);
  const [simulationCategory, setSimulationCategory] = useState<"growth" | "trade" | "industrial" | "allocation" | "capacity" | "workforce" | "crisis" | "policy">("growth");
  const [simulationMultiplier, setSimulationMultiplier] = useState(1.0);
  const [simulationOutput, setSimulationOutput] = useState<{ label: string; current: string; projected: string; impact: string }[]>([]);

  // Scenario Planning Sandbox Parameters (Sliders)
  const [scenarioIncentives, setScenarioIncentives] = useState(25); // %
  const [scenarioBudgetShift, setScenarioBudgetShift] = useState(15); // Millions SDG
  const [scenarioTariffReform, setScenarioTariffReform] = useState(10); // %
  const [scenarioTaxHoliday, setScenarioTaxHoliday] = useState(5); // years
  const [isCalculatingScenario, setIsCalculatingScenario] = useState(false);

  // Core KPI configuration state
  const [weights, setWeights] = useState({
    gdp: 35,
    fdi: 25,
    export: 20,
    digital: 10,
    satisfaction: 10
  });

  // AI Advisor Interactive Prompts & Recommendations
  const [aiPrompts, setAiPrompts] = useState<{ id: string; query: string; responseAr: string; responseEn: string }[]>([
    {
      id: "AI-R1",
      query: "Analyze industrial growth and Vision 2035 shortfalls",
      responseAr: "تحليل الذكاء الاصطناعي: يواجه هدف نمو الصادرات فجوة تراكمية قدرها 2.9 مليار دولار. نقترح توجيه 15٪ إضافية من ميزانية التطوير نحو مشاريع البنى اللوجستية ببورتسودان لتسريع وتيرة نفاذ الصمغ العربي.",
      responseEn: "AI Advisory: Export growth goals face a cumulative shortfall of $2.9B. Recommended action is to shift 15% of development budget into Red Sea logistics corridors to accelerate Gum Arabic volume."
    },
    {
      id: "AI-R2",
      query: "Draft risk response strategy for Port Sudan supply chain crisis",
      responseAr: "توصية الاستجابة للأزمات: نوصي بتفعيل خطة الطوارئ رقم 4أ؛ تفعيل التخليص الرقمي الجمركي المسبق للمستوردات الغذائية، وإعفاء الرسوم لـ 150 يوم لضمان ثبات المخزون السلعي القومي.",
      responseEn: "Crisis Mitigation: Activate Emergency protocol 4A immediately. Implement digital pre-clearance for priority food components and suspend transit tariffs for 150 days to defend national stockpile levels."
    }
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [customAdvisorResponses, setCustomAdvisorResponses] = useState<{ query: string; answer: string }[]>([]);

  // Alert Thresholds
  const [capacityThreshold, setCapacityThreshold] = useState(90); // %
  const [cyberSeverityThreshold, setCyberSeverityThreshold] = useState("high");

  // Dynamic state for simulation output when selected node or multiplier changes
  useEffect(() => {
    if (!selectedTwinNode) return;
    const currentUtil = selectedTwinNode.utilization;
    const projectedUtil = Math.min(Math.round(currentUtil * simulationMultiplier), 100);
    const difference = projectedUtil - currentUtil;
    
    setSimulationOutput([
      { 
        label: currentLanguage === "ar" ? "نسبة كفاءة استغلال السعة" : "Resource Capacity Load", 
        current: `${currentUtil}%`, 
        projected: `${projectedUtil}%`, 
        impact: difference > 0 ? `+${difference}% Increase` : `${difference}% Decrease` 
      },
      { 
        label: currentLanguage === "ar" ? "معدل التدفق والانتاج اللحظي" : "Instantaneous Throughput", 
        current: `${Math.round(150 * simulationMultiplier)} units`, 
        projected: `${Math.round(150 * simulationMultiplier * 1.25)} units`, 
        impact: simulationMultiplier > 1 ? "Upgraded Productivity" : "Underutilized Resource" 
      },
      { 
        label: currentLanguage === "ar" ? "مستوى المخاطر التشغيلية" : "Operational Safety Risk Level", 
        current: currentUtil > 90 ? "High" : "Low", 
        projected: projectedUtil > 90 ? "Critical Warning" : "Acceptable", 
        impact: projectedUtil > 95 ? "Red alert risk" : "Stabilized status" 
      }
    ]);
  }, [selectedTwinNode, simulationMultiplier, currentLanguage]);

  // Handle Manual Data Lake Sync Simulation
  const handleDataLakeSync = () => {
    setIsDataLakeSyncing(true);
    setTimeout(() => {
      setIsDataLakeSyncing(false);
      setLastSyncTimestamp(new Date().toISOString().replace("T", " ").substring(0, 19));
    }, 1200);
  };

  // AI Advisor Custom query submit
  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setIsAiThinking(true);
    
    const query = userQuery.toLowerCase();
    setTimeout(() => {
      let answer = "";
      if (query.includes("budget") || query.includes("ميزانية")) {
        answer = currentLanguage === "ar" 
          ? "توصية موازنة 2035: إعادة توجيه 20٪ من عوائد رسوم السجلات لتوسيع المحفزات الضريبية في المدن الصناعية سيعطي عائداً بنسبة 4:1 في الناتج القومي الإجمالي بحلول 2029."
          : "Sovereign Budget Alignment: Relocating 20% of commercial registration fee inflows to fund industrial tax holidays yields a projected 4:1 return on GDP within 3 fiscal years.";
      } else if (query.includes("tax") || query.includes("ضريبة") || query.includes("رسوم")) {
        answer = currentLanguage === "ar"
          ? "توجيه الضرائب والجمارك: تبسيط الرسوم الجمركية للصادرات المستهدفة لـ %0 يدعم ميزان المدفوعات ويحسن تصنيف التنافسية الدولي بمقدار 8 درجات."
          : "Tax Policy Impact: Dropping export clearance duties to 0% for agro-processing optimizes trade balance, shifting the competitiveness index upward by 8 points.";
      } else {
        answer = currentLanguage === "ar"
          ? "تحليل التوجهات الاستراتيجية: الذكاء الاصطناعي يوصي بتركيز الموارد على ثلاثة مجالات: رقمنة سلاسل الإمداد في البحر الأحمر، وتوحيد تراخيص التفتيش البيئي، ومضاعفة اعتمادات التدريب المهني الفيدرالي."
          : "Strategic Orientation Advice: AI recommends targeting resources toward: 1) Maritime digital freight corridor modernization, 2) Consolidated industrial environmental permits, and 3) Enhanced technical workforce training allocations.";
      }
      setCustomAdvisorResponses(prev => [...prev, { query: userQuery, answer }]);
      setUserQuery("");
      setIsAiThinking(false);
    }, 1000);
  };

  // Calculated National Indices
  const executivePerformanceIndex = 92.4;
  const ministryEffectivenessIndex = 88.5;
  const strategicGoalAchievement = 76.2;
  const vision2035Progress = 68.4;
  const economicHealthScore = 74.0;
  const digitalGovernmentIndex = 82.5;

  // Recharts high fidelity dummy datasets
  const strategicProgressTrend = [
    { year: "2021", "Target 2035": 40, "Actual KPI": 42, "AI Predicted": 42 },
    { year: "2022", "Target 2035": 45, "Actual KPI": 48, "AI Predicted": 48 },
    { year: "2023", "Target 2035": 52, "Actual KPI": 51, "AI Predicted": 51 },
    { year: "2024", "Target 2035": 60, "Actual KPI": 59, "AI Predicted": 60 },
    { year: "2025", "Target 2035": 68, "Actual KPI": 65, "AI Predicted : Trend Line": 66 },
    { year: "2026", "Target 2035": 75, "Actual KPI": 71, "AI Predicted": 73 },
    { year: "2027", "Target 2035": 80, "Actual KPI": null, "AI Predicted": 78 },
    { year: "2028", "Target 2035": 84, "Actual KPI": null, "AI Predicted": 82 }
  ];

  const sectoralInvestmentShare = [
    { name: "Agribusiness & Food Security", value: 42000000, color: "#10b981" },
    { name: "Heavy Machinery & Engineering", value: 28000000, color: "#3b82f6" },
    { name: "Sovereign Logistics & Ports", value: 31000000, color: "#f59e0b" },
    { name: "Mining & Natural Resources", value: 19000000, color: "#ec4899" },
    { name: "Digital Infrastructure & Tech", value: 14000000, color: "#8b5cf6" }
  ];

  // Role labels translations
  const executiveRoles = [
    { id: "minister", ar: "معالي الوزير القومي", en: "HE Minister" },
    { id: "undersecretary", ar: "السيد الوكيل الاتحادي", en: "Undersecretary" },
    { id: "director_general", ar: "مدير عام القطاع", en: "Director General" },
    { id: "executive_advisor", ar: "المستشار الاستراتيجي", en: "Executive Advisor" },
    { id: "strategic_planning", ar: "مدير التخطيط الاستراتيجي", en: "Strategic Planning Director" },
    { id: "bi_director", ar: "مدير ذكاء الأعمال والتحليل", en: "BI Director" },
    { id: "statistics_officer", ar: "مسؤول الإحصاء الوطني", en: "National Statistics Officer" },
    { id: "prime_dashboard", ar: "لوحة القيادة الرئاسية الموحدة", en: "Prime Dashboard View" },
    { id: "super_admin", ar: "مدير النظام السيادي", en: "Super Administrator" }
  ];

  return (
    <div className="space-y-6 text-gray-900" id="executive-command-center-root">
      
      {/* SECTION 1: MASTER ROLE PICKER & SYNC BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 font-mono font-bold">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              VISION 2035 INTELLIGENCE SYSTEM
            </span>
            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1 font-mono font-bold">
              <Shield className="w-3 h-3" />
              CONFIDENTIAL LEVEL I
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
            {currentLanguage === "ar" ? "مركز القيادة التنفيذي القومي والتوأم الرقمي الاتحادي" : "National Executive Command Center & Federal Digital Twin Platform"}
          </h2>
          <p className="text-slate-400 text-xs max-w-2xl">
            {currentLanguage === "ar" 
              ? "منصة استشراف استراتيجي موحدة لمراقبة مؤشرات الأداء، ومحاكاة القرارات السياسية، والتحقق التنبئي بالذكاء الاصطناعي لجمهورية السودان."
              : "Consolidated strategic foresight platform for monitoring key indices, testing policy variables, and executing national digital twins."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-slate-400 text-xs font-semibold mr-1">
            {currentLanguage === "ar" ? "المستوى التنفيذي النشط:" : "Active Strategic Level:"}
          </label>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as ExecutiveRole)}
            className="bg-slate-950 text-emerald-300 text-xs border border-slate-800 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none font-bold font-sans"
          >
            {executiveRoles.map(r => (
              <option key={r.id} value={r.id}>
                {currentLanguage === "ar" ? r.ar : r.en}
              </option>
            ))}
          </select>

          <button
            onClick={handleDataLakeSync}
            disabled={isDataLakeSyncing}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDataLakeSyncing ? "animate-spin" : ""}`} />
            <span>{isDataLakeSyncing ? "Consolidating Data..." : (currentLanguage === "ar" ? "مزامنة بحيرة البيانات" : "Sync Data Lake")}</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: EXECUTIVE STATS BENTO BOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { titleAr: "مؤشر الأداء التنفيذي", titleEn: "Exec Performance Index", value: `${executivePerformanceIndex}%`, status: "on_track", descAr: "كفاءة المخرجات الحكومية", descEn: "Government output efficiency" },
          { titleAr: "كفاءة الفعالية الوزارية", titleEn: "Ministry Effectiveness", value: `${ministryEffectivenessIndex}%`, status: "on_track", descAr: "سرعة تنفيذ المعاملات", descEn: "Transaction speed index" },
          { titleAr: "تحقيق الأهداف الاستراتيجية", titleEn: "Goal Achievement Score", value: `${strategicGoalAchievement}%`, status: "warning", descAr: "اكتمال أهداف الربع الحالي", descEn: "Quarterly objectives met" },
          { titleAr: "مستوى تقدم رؤية 2035", titleEn: "Sudan Vision 2035 Progress", value: `${vision2035Progress}%`, status: "warning", descAr: "تحقيق المؤشرات التنموية", descEn: "Vision indicator matching" },
          { titleAr: "نقاط الصحة الاقتصادية", titleEn: "Economic Health Score", value: `${economicHealthScore}/100`, status: "on_track", descAr: "متوسط الأداء المالي والإنتاجي", descEn: "Consolidated macro score" },
          { titleAr: "النضج الرقمي الفيدرالي", titleEn: "Digital Government Index", value: `${digitalGovernmentIndex}%`, status: "on_track", descAr: "ربط الخدمات والتوأمة", descEn: "Interoperability index" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full blur-xl pointer-events-none" />
            <div className="text-gray-500 font-mono text-[10px] uppercase font-bold leading-tight">
              {currentLanguage === "ar" ? stat.titleAr : stat.titleEn}
            </div>
            <div>
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">{stat.value}</span>
            </div>
            <div className="text-[9px] text-gray-400">
              {currentLanguage === "ar" ? stat.descAr : stat.descEn}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: TAB NAVIGATION & COMMAND DASHBOARDS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5" id="command-center-dash-tabs">
            {[
              { id: "national", labelAr: "نظرة عامة قومية", labelEn: "National Overview", icon: Landmark },
              { id: "vision", labelAr: "رصد رؤية 2035", labelEn: "Vision 2035 Progress", icon: Compass },
              { id: "investment", labelAr: "أداء الاستثمارات", labelEn: "Investments", icon: Briefcase },
              { id: "trade", labelAr: "الميزان التجاري", labelEn: "Trade Balance", icon: Globe },
              { id: "industrial", labelAr: "الإنتاج الصناعي", labelEn: "Industrial Growth", icon: Cpu },
              { id: "cyber", labelAr: "الأمن السيبراني والمخاطر", labelEn: "Risk & Cyber", icon: Shield },
              { id: "scenarios", labelAr: "محاكاة السياسات", labelEn: "Policy Sandbox", icon: SlidersHorizontal }
            ].map((tab) => {
              const isActive = activeDashboard === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDashboard(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="text-gray-400 font-mono text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentLanguage === "ar" ? `آخر مزامنة لبحيرة البيانات: ${lastSyncTimestamp}` : `Data Lake Sync: ${lastSyncTimestamp}`}</span>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDashboard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 150 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            
            {/* SUB-DASHBOARD LEFT PANELS: PRIMARY CHARTS & METRICS */}
            <div className="xl:col-span-2 space-y-6">

              {activeDashboard === "national" && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      {currentLanguage === "ar" ? "مسار التقدم الاستراتيجي الفيدرالي مقابل خطة الاستشراف" : "Sudan Vision 2035 Cumulative Strategic Progress Index"}
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={strategicProgressTrend}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} domain={[30, 90]} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Line type="monotone" dataKey="Actual KPI" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="Target 2035" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
                          <Line type="monotone" dataKey="AI Predicted" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-100 p-4 rounded-xl bg-white space-y-2">
                      <h4 className="text-xs font-bold text-slate-700">{currentLanguage === "ar" ? "مؤشر التفتيش والإنفاذ المالي القومي" : "National Inspection & Financial Enforcement Recovery"}</h4>
                      <div className="text-xl font-bold font-mono text-emerald-600">89,204,410 SDG</div>
                      <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "تم سدادها واستردادها بنجاح عبر البوابة الرقمية" : "Successfully processed and verified via Federal Trust Framework"}</p>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-xl bg-white space-y-2">
                      <h4 className="text-xs font-bold text-slate-700">{currentLanguage === "ar" ? "حجم طلبات أراضي الاستثمار المعتمدة" : "Approved Industrial Investment Allocation Volume"}</h4>
                      <div className="text-xl font-bold font-mono text-indigo-600">421,500 Sqm</div>
                      <p className="text-[10px] text-gray-400">{currentLanguage === "ar" ? "أراضي مخصصة بمناطق بورتسودان وجياد والباقير" : "Strategically authorized in Port Sudan and Al Gezira priority zones"}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDashboard === "vision" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h4 className="text-xs font-bold text-slate-900">{currentLanguage === "ar" ? "رصد أهداف ومؤشرات رؤية السودان 2035" : "Vision 2035 Core Strategic Program Indicators"}</h4>
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">6 Key Targets</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {initialVisionIndicators.map((ind) => (
                      <div key={ind.id} className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-gray-400">[{ind.id}]</span>
                            <h5 className="text-xs font-bold text-slate-900" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                              {currentLanguage === "ar" ? ind.nameAr : ind.nameEn}
                            </h5>
                          </div>
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${
                            ind.status === "on_track" ? "bg-emerald-100 text-emerald-800" : ind.status === "warning" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {ind.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>Current: {ind.current}{ind.unit}</span>
                            <span>Target 2035: {ind.target2035}</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                ind.status === "on_track" ? "bg-emerald-500" : ind.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                              }`} 
                              style={{ width: `${Math.min((ind.current / ind.targetNum) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDashboard === "investment" && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      {currentLanguage === "ar" ? "توزيع الاستثمارات الوطنية حسب القطاعات الحيوية (رأس المال)" : "National Investment Distribution by Sector (Capital Value)"}
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sectoralInvestmentShare}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip formatter={(value) => `${Number(value).toLocaleString()} SDG`} />
                          <Bar dataKey="value" fill="#10b981">
                            {sectoralInvestmentShare.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeDashboard === "trade" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 text-center space-y-1">
                      <Globe className="w-5 h-5 text-emerald-600 mx-auto" />
                      <span className="text-[10px] text-gray-500 block">{currentLanguage === "ar" ? "قيمة الصادرات الإجمالية" : "Total Annual Exports"}</span>
                      <span className="text-xl font-bold font-mono text-slate-950">$2.14 Billion</span>
                      <span className="text-[9px] text-emerald-600 block">+14.2% YoY Growth</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 text-center space-y-1">
                      <Globe className="w-5 h-5 text-indigo-600 mx-auto" />
                      <span className="text-[10px] text-gray-500 block">{currentLanguage === "ar" ? "قيمة الواردات الكلية" : "Total Annual Imports"}</span>
                      <span className="text-xl font-bold font-mono text-slate-950">$4.89 Billion</span>
                      <span className="text-[9px] text-rose-500 block">+4.8% Trade Gap Expansion</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 text-center space-y-1">
                      <Scale className="w-5 h-5 text-amber-500 mx-auto" />
                      <span className="text-[10px] text-gray-500 block">{currentLanguage === "ar" ? "عجز الميزان التجاري" : "Sovereign Trade Deficit"}</span>
                      <span className="text-xl font-bold font-mono text-slate-950">-$2.75 Billion</span>
                      <span className="text-[9px] text-amber-600 block">Requires industrial import substitution</span>
                    </div>
                  </div>

                  <div className="border border-gray-100 p-4 rounded-xl bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">{currentLanguage === "ar" ? "أهم السلع الوطنية المصدرة (حصة العوائد)" : "Top National Export Components (Revenue Share)"}</h4>
                    <div className="space-y-2 text-xs">
                      {[
                        { itemAr: "الصمغ العربي السوداني الخام", itemEn: "Sudanese Crude Gum Arabic", percent: 38, value: "$813M" },
                        { itemAr: "الذهب والمعادن الثمينة المصنعة", itemEn: "Refined Gold & Precious Metals", percent: 29, value: "$620M" },
                        { itemAr: "الثروة الحيوانية واللحوم المصدرة", itemEn: "Sovereign Livestock & Meat", percent: 18, value: "$385M" },
                        { itemAr: "الزيوت والمحاصيل الزيتية والسمسم", itemEn: "Sesame & Oleaginous Oil Seeds", percent: 15, value: "$321M" }
                      ].map((exp, i) => (
                        <div key={i} className="flex items-center justify-between gap-4 p-2 bg-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-800">{currentLanguage === "ar" ? exp.itemAr : exp.itemEn}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-500">{exp.value}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">{exp.percent}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeDashboard === "industrial" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">{currentLanguage === "ar" ? "توزيع المصانع النشطة حسب القطاع" : "Active Factories by Sector"}</h4>
                      <div className="space-y-2 text-xs">
                        {[
                          { sector: "Agro-Food Processing", count: 86, color: "bg-emerald-500" },
                          { sector: "Chemicals & Plastics", count: 42, color: "bg-teal-500" },
                          { sector: "Heavy Engineering", count: 18, color: "bg-indigo-500" },
                          { sector: "Pharmaceuticals", count: 11, color: "bg-purple-500" }
                        ].map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center p-1.5 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                              <span>{s.sector}</span>
                            </div>
                            <span className="font-bold font-mono">{s.count} Units</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">{currentLanguage === "ar" ? "مؤشر جودة كفاءة الطاقة الصناعية" : "Industrial Green Energy Transition Rating"}</h4>
                      <div className="text-center py-4">
                        <Cpu className="w-10 h-10 text-emerald-600 mx-auto mb-2 animate-pulse" />
                        <span className="text-3xl font-extrabold font-mono text-slate-900">48.2%</span>
                        <p className="text-[11px] text-gray-500 mt-1">{currentLanguage === "ar" ? "نسبة استهلاك الطاقة الهجينة المتجددة بالمصانع الكبرى" : "Percentage of solar-hybrid energy powering heavy manufacturing complexes"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDashboard === "cyber" && (
                <div className="space-y-4">
                  <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-950">{currentLanguage === "ar" ? "تقرير استخبارات التهديدات السيادية الموحد" : "Unified Sovereign Cybersecurity Risk Assessment"}</h4>
                      <p className="text-[11px] text-rose-800 leading-relaxed mt-1">
                        {currentLanguage === "ar" 
                          ? "تم الكشف عن هجمة حجب خدمة موزعة من مستوى متقدم استهدفت مخدمات التراخيص الوطنية. تم عزل وتصفية التدفق الهجومي بنسبة 100٪ دون التأثير على استقرار النظام."
                          : "High-grade DDoS footprint detected targeting licensing endpoints. Core SOC perimeter isolated and scrubbed traffic completely with zero runtime packet loss."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2">
                      <span className="text-gray-500 block uppercase font-mono tracking-wider text-[9px]">ACTIVE RISK REGISTER LEVEL</span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">1. Threat Score:</span>
                        <span className="text-emerald-600 font-bold font-mono">14.2% (Low Status)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">2. Firewall Block Rate:</span>
                        <span className="text-slate-900 font-mono">99.98% Efficiency</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">3. Average Mitigation Latency:</span>
                        <span className="text-slate-900 font-mono">240 milliseconds</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2">
                      <span className="text-gray-500 block uppercase font-mono tracking-wider text-[9px]">SECURITY AUDIT IMMUTABILITY</span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Blockchain Validation:</span>
                        <span className="text-emerald-600 font-bold">Passed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Audit Ledger Hash:</span>
                        <span className="text-gray-400 font-mono text-[9px]">SHA256: 4f89...7e21</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">MFA Compliance Rate:</span>
                        <span className="text-indigo-600 font-bold">100% (Executive Access)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDashboard === "scenarios" && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-slate-900">{currentLanguage === "ar" ? "صندوق محاكاة القرارات السيادية والأثر المتوقع" : "Sovereign Policy Sandbox & Projected Impact Simulator"}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{currentLanguage === "ar" ? "زيادة المحفزات الاستثمارية بالمنطقة الحرة:" : "Free Zone Investment Incentives Growth:"}</span>
                          <span className="font-bold font-mono text-emerald-600">+{scenarioIncentives}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={scenarioIncentives} 
                          onChange={(e) => setScenarioIncentives(Number(e.target.value))}
                          className="w-full accent-emerald-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{currentLanguage === "ar" ? "تحويل الميزانية الفيدرالية نحو اللوجستيات:" : "Federal Budget Shift to Logistics:"}</span>
                          <span className="font-bold font-mono text-indigo-600">+{scenarioBudgetShift}M SDG</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={scenarioBudgetShift} 
                          onChange={(e) => setScenarioBudgetShift(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{currentLanguage === "ar" ? "تعديل التعريفة الجمركية لدعم الصمغ العربي:" : "Gum Arabic Export Tariff Offset:"}</span>
                          <span className="font-bold font-mono text-amber-600">-{scenarioTariffReform}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="50" value={scenarioTariffReform} 
                          onChange={(e) => setScenarioTariffReform(Number(e.target.value))}
                          className="w-full accent-amber-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{currentLanguage === "ar" ? "سنوات الإعفاء الضريبي للمنشآت الصديقة للبيئة:" : "Green Manufacturing Tax Holiday duration:"}</span>
                          <span className="font-bold font-mono text-emerald-700">{scenarioTaxHoliday} Years</span>
                        </div>
                        <input 
                          type="range" min="1" max="15" value={scenarioTaxHoliday} 
                          onChange={(e) => setScenarioTaxHoliday(Number(e.target.value))}
                          className="w-full accent-emerald-800"
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-950 uppercase">{currentLanguage === "ar" ? "مخرجات التنبؤ المحاكي بالذكاء الاصطناعي" : "AI Forecast Models Projection Output"}</span>
                        <span className="bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded font-mono">SIMULATION LIVE</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-emerald-200/50">
                          <span className="text-gray-500 block text-[10px]">{currentLanguage === "ar" ? "النمو المتوقع للاستثمار الأجنبي المباشر" : "Projected FDI Expansion"}</span>
                          <span className="text-base font-extrabold text-emerald-600 font-mono">
                            +{Math.round(8.4 + (scenarioIncentives * 0.15) + (scenarioBudgetShift * 0.08))}%
                          </span>
                          <span className="text-[9px] text-gray-400 block">Baseline: 8.4%</span>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-emerald-200/50">
                          <span className="text-gray-500 block text-[10px]">{currentLanguage === "ar" ? "مؤشر الصادرات القومية السنوية" : "Projected Export Target Yield"}</span>
                          <span className="text-base font-extrabold text-indigo-600 font-mono">
                            ${(2.1 + (scenarioTariffReform * 0.04) + (scenarioBudgetShift * 0.015)).toFixed(2)} Billion
                          </span>
                          <span className="text-[9px] text-gray-400 block">Baseline: $2.10B</span>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-emerald-200/50">
                          <span className="text-gray-500 block text-[10px]">{currentLanguage === "ar" ? "ثقة وموثوقية السوق للمستثمرين" : "Investor Market Confidence Index"}</span>
                          <span className="text-base font-extrabold text-emerald-700 font-mono">
                            {Math.round(74 + (scenarioIncentives * 0.2) + (scenarioTaxHoliday * 1.5))}/100
                          </span>
                          <span className="text-[9px] text-gray-400 block">Baseline: 74/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: REAL-TIME DATA LAKE STREAMS FEED */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                    <Database className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>{currentLanguage === "ar" ? "اتصال بحيرة البيانات السيادية ورقابة التدفقات المباشرة" : "Sovereign Data Lake Integration & Real-Time Aggregator Streams"}</span>
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                    5 AGENTS STABLE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {rawDataSources.map((ds, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-gray-100 rounded-lg space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-800 truncate block">{ds.name}</span>
                      <div className="flex justify-between items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-mono text-[9px] text-gray-500">{ds.rate}</span>
                      </div>
                      <span className="text-[8px] text-gray-400 block font-mono">Latency: {ds.latency}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COMMAND CENTER RIGHT PANELS: LIVE ALERTS & AI EXECUTIVE ADVISOR */}
            <div className="space-y-6">

              {/* COMMAND SYSTEM ALERTS */}
              <div className="bg-slate-950 text-white p-5 rounded-xl border border-slate-800 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                      {currentLanguage === "ar" ? "إنذارات القيادة الاستراتيجية النشطة" : "Active Executive Crisis Alerts"}
                    </h3>
                  </div>
                  <span className="bg-rose-500/20 text-rose-300 text-[8px] font-bold px-2 py-0.5 rounded font-mono animate-pulse">
                    3 UNRESOLVED
                  </span>
                </div>

                <div className="space-y-3">
                  {initialAlerts.map((alt) => (
                    <div key={alt.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className={`font-bold px-1.5 py-0.5 rounded ${
                          alt.severity === "critical" ? "bg-rose-950 text-rose-300 border border-rose-800" : alt.severity === "high" ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-slate-800 text-slate-300"
                        }`}>
                          {alt.category.toUpperCase()} // {alt.severity.toUpperCase()}
                        </span>
                        <span className="text-slate-500 font-mono">{alt.timestamp}</span>
                      </div>
                      <p className="text-slate-100 font-semibold" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                        {currentLanguage === "ar" ? alt.msgAr : alt.msgEn}
                      </p>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
                        <span className="text-slate-400">Trigger: Automated</span>
                        <span className={`font-mono text-[9px] font-bold ${alt.status === "active" ? "text-rose-400" : "text-emerald-400"}`}>
                          {alt.status === "active" ? "● UNMITIGATED" : "● AUTO_RESOLVED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI EXECUTIVE ADVISOR */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-950 uppercase" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                    {currentLanguage === "ar" ? "المستشار الفيدرالي لتوجيه القرار بالذكاء الاصطناعي" : "AI Executive Decision Advisor"}
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  {aiPrompts.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-1.5">
                      <span className="font-bold text-slate-500 block font-mono text-[9px]">QUERY: "{p.query}"</span>
                      <p className="text-slate-900 leading-relaxed font-semibold">
                        {currentLanguage === "ar" ? p.responseAr : p.responseEn}
                      </p>
                    </div>
                  ))}

                  {customAdvisorResponses.map((cr, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                      <span className="font-bold text-emerald-800 block font-mono text-[9px]">CUSTOM QUERY: "{cr.query}"</span>
                      <p className="text-emerald-950 leading-relaxed font-semibold">
                        {cr.answer}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendQuery} className="flex gap-2">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "اسأل مستشار القرار عن توصيات الميزانية والسياسات..." : "Ask Advisor regarding policy, budget allocations, trade..."}
                    className="flex-1 p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isAiThinking || !userQuery.trim()}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold text-xs p-2 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* NATIONAL WORKFLOW COMPLIANCE PIPELINE */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-950 uppercase border-b border-gray-100 pb-2" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                  {currentLanguage === "ar" ? "مسار الالتزام واعتماد التقارير والسياسات" : "Federal Policy Compliance & Review Pipeline"}
                </h3>

                <div className="space-y-3 text-xs">
                  {[
                    { stage: "1. Data Collection & Validation", status: "completed", date: "July 15", desc: "Consolidated all active corporate registers" },
                    { stage: "2. AI Scenario Optimization", status: "completed", date: "July 16", desc: "Mitigated Red Sea supply corridor threats" },
                    { stage: "3. Executive Board Review", status: "completed", date: "July 17", desc: "Undersecretary approved draft industrial tariff offsets" },
                    { stage: "4. Ministerial Sign-off", status: "pending", date: "Pending", desc: "Awaiting HE Minister signature on CBDC ledger" }
                  ].map((wf, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-1.5">
                      <div className="mt-0.5">
                        {wf.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-900">{wf.stage}</span>
                          <span className="text-gray-400 font-mono">{wf.date}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{wf.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* SECTION 5: DIGITAL TWIN INTERACTIVE COMPONENT */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6" id="digital-twin-sim-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-950 flex items-center gap-2" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
              <Layers className="w-5 h-5 text-emerald-600 animate-pulse" />
              <span>{currentLanguage === "ar" ? "نظام التوأم الرقمي الاتحادي للتصنيع والمجمعات الاستثمارية" : "Federal Digital Twin Simulation Engine"}</span>
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" 
                ? "نموذج توأمة تفاعلي يعرض المجمعات والمنشآت اللوجستية ومستوى طاقتها التشغيلية مع إمكانية محاكاة الأزمات ومضاعفات الإنتاج."
                : "Live mirror of critical state corridors, factories, and hubs. Run stress tests against real variables."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "growth", ar: "محاكاة النمو", en: "Growth Shock" },
              { id: "crisis", ar: "محاكاة الأزمات", en: "Crisis Scenario" },
              { id: "workforce", ar: "موازنة العمالة", en: "Workforce Strain" },
              { id: "capacity", ar: "تحدي السعة", en: "Capacity Overload" }
            ].map((sim) => (
              <button
                key={sim.id}
                onClick={() => setSimulationCategory(sim.id as any)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded border transition-all cursor-pointer ${
                  simulationCategory === sim.id 
                    ? "bg-slate-950 text-white border-slate-950" 
                    : "bg-slate-50 text-slate-600 border-gray-200 hover:bg-slate-100"
                }`}
              >
                {currentLanguage === "ar" ? sim.ar : sim.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* DIGITAL TWIN SELECTION AREA */}
          <div className="xl:col-span-1 space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-100 max-h-[420px] overflow-y-auto">
            <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold tracking-wider mb-2">
              Select Digital Twin Node:
            </span>
            {digitalTwinNodes.map((node) => {
              const isSelected = selectedTwinNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedTwinNode(node)}
                  className={`w-full p-3 rounded-lg text-left text-xs transition-all flex justify-between items-center border ${
                    isSelected 
                      ? "bg-slate-950 text-white border-slate-950 shadow-md" 
                      : "bg-white text-slate-800 border-gray-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-emerald-400 block">[{node.category.toUpperCase()}]</span>
                    <span className="font-bold block" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                      {currentLanguage === "ar" ? node.nameAr : node.nameEn}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {currentLanguage === "ar" ? node.locationAr : node.locationEn}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs font-bold block font-mono">{node.utilization}% Load</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                      node.status === "optimal" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TWIN VISUAL CANVAS & SLIDERS */}
          {selectedTwinNode ? (
            <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 text-white p-6 rounded-xl border border-slate-800 relative">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">ACTIVE DIGITAL COGNITIVE NODE</span>
                  <h4 className="text-lg font-bold" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                    {currentLanguage === "ar" ? selectedTwinNode.nameAr : selectedTwinNode.nameEn}
                  </h4>
                  <span className="text-xs text-slate-400 block">Location Coordinate Mirror: {selectedTwinNode.locationEn}, Sudan</span>
                </div>

                {/* TWIN GRAPHICS / STATUS INDICATORS */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs">
                    <span>Telemetric Sensor Output:</span>
                    <span className="text-emerald-400 font-mono animate-pulse font-bold">● TELEMETRY ONLINE</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Baseline Load:</span>
                      <span className="font-mono">{selectedTwinNode.utilization}% Capacity</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedTwinNode.utilization}%` }} />
                    </div>
                  </div>

                  <div className="text-slate-300 text-[11px] font-mono p-2 bg-slate-950 rounded border border-slate-800/80">
                    STATUS: {selectedTwinNode.metric}
                  </div>
                </div>

                {/* SIMULATOR MODIFIERS */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Stress-Test Load Multiplier:</span>
                    <span className="text-indigo-400 font-mono font-bold">{simulationMultiplier.toFixed(2)}x Multiplier</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={simulationMultiplier}
                    onChange={(e) => setSimulationMultiplier(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0.5x (Underutilization)</span>
                    <span>1.0x (Default Calibration)</span>
                    <span>2.0x (Extreme Stress Test)</span>
                  </div>
                </div>
              </div>

              {/* SIMULATOR STRESS TEST PROJECTIONS */}
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Simulated Stress Output:</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {currentLanguage === "ar"
                      ? "يقوم محرك التوأم اللامركزي بحساب أثر مضاعفات الإنتاج ونقص الموارد بناءً على البيانات الفيدرالية اللحظية."
                      : "Calculating dynamic thermal load, grid resistance, and throughput limitations based on real-time sensory integrations."}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  {simulationOutput.map((out, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800/60">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{out.label}</span>
                        <span className="font-bold text-slate-200">{out.current}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-indigo-400 block text-[10px]">{currentLanguage === "ar" ? "المتوقع بالمحاكاة" : "Simulated Yield"}</span>
                        <span className="font-bold text-white font-mono">{out.projected}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSimulationMultiplier(1.0);
                    setSimulationCategory("growth");
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  {currentLanguage === "ar" ? "إعادة تعيين المحاكاة" : "Reset Stress Parameters"}
                </button>
              </div>
            </div>
          ) : (
            <div className="xl:col-span-2 text-center py-12 bg-slate-50 rounded-xl border border-dashed border-gray-300">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Please select a Digital Twin Node from the list to engage simulation controls.</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: EXECUTIVE REPORTS ENGINE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
              <FileText className="w-4.5 h-4.5 text-emerald-600" />
              <span>{currentLanguage === "ar" ? "مولد التقارير الاستخبارية والبيانات السيادية الموثقة" : "National Executive Intelligence Report Vault"}</span>
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "تصدير فوري للتقارير الموقعة رقمياً والمعتمدة من قبل أمانة مجلس الوزراء" : "Cryptographically signed government reports available for secure download & print format"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {[
            { titleAr: "التقرير التنفيذي الإستراتيجي الأسبوعي", titleEn: "Weekly Strategic Executive Report", size: "1.4 MB", type: "PDF" },
            { titleAr: "مؤشرات تقدم رؤية السودان 2035 - الربع الحالي", titleEn: "Sudan Vision 2035 Progress Ledger", size: "2.8 MB", type: "PDF" },
            { titleAr: "تقرير استخبارات الذكاء الاصطناعي للاقتصاد الكلي", titleEn: "AI Macroeconomic Intelligence Report", size: "850 KB", type: "PDF" },
            { titleAr: "تقرير التنافسية وتطور الصادرات الوطنية", titleEn: "National Export & Competitiveness Audit", size: "4.2 MB", type: "PDF" }
          ].map((rep, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-gray-200/60 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[9px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded block w-fit font-mono mb-2">
                  {rep.type}
                </span>
                <h4 className="font-bold text-slate-900 leading-snug" style={{ fontFamily: "DIN Next Arabic, sans-serif" }}>
                  {currentLanguage === "ar" ? rep.titleAr : rep.titleEn}
                </h4>
                <span className="text-[10px] text-gray-400 mt-1 block">File Size: {rep.size}</span>
              </div>

              <button
                onClick={() => alert(`Simulated secure download triggered for: ${rep.titleEn}`)}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{currentLanguage === "ar" ? "تحميل التقرير المشفر" : "Download Encrypted PDF"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
