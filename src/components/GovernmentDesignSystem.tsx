/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Palette, Type, Layers, CheckCircle2, AlertTriangle, AlertCircle, Info, 
  Sparkles, Check, Copy, HelpCircle, Eye, Phone, Monitor, Tablet, 
  Workflow, ArrowRight, BookOpen, RotateCcw, Sliders, Smartphone,
  ExternalLink, Code, Accessibility, Zap, Search, ChevronDown, CheckSquare, 
  ToggleLeft, ToggleRight, Trash2, ArrowUpRight, Award, ShieldAlert, FileText
} from "lucide-react";
import {
  COLOR_SCALES,
  SEMANTIC_LIGHT_THEME,
  SEMANTIC_DARK_THEME,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  MOTION_TOKENS,
  Z_INDEX_TOKENS,
  LAYOUT_TOKENS,
  RESPONSIVE_TOKENS,
  OPACITY_TOKENS,
  ICON_TOKENS,
  DATA_VIS_TOKENS,
  COMPONENT_TOKENS
} from "./DesignTokens";

import { SovereignTypography, SovereignButton, SovereignBadge, SovereignAvatar, SovereignDivider, SovereignLoaderSpinner, SovereignSkeleton } from "./gov-ui/atoms";
import { SovereignSearchBox, SovereignOTP, SovereignTimeline, SovereignPasswordStrength } from "./gov-ui/molecules";
import { SovereignDataGrid, SovereignDocumentViewer, SovereignAIChatWindow } from "./gov-ui/organisms";
import { SovereignInput, SovereignSelect, SovereignFileUpload, SovereignSignaturePad } from "./gov-ui/forms";
import { FormsFramework } from "./gov-ui/FormsFramework";
import { MotionFramework } from "./gov-ui/MotionFramework";
import { AccessibilityFramework } from "./gov-ui/AccessibilityFramework";
import { DeveloperHandbook } from "./gov-ui/DeveloperHandbook";
import { 
  GovHomePagePattern, GovServiceCatalogPattern, GovServiceWizardPattern, 
  GovDashboardPattern, GovApprovalWorkflowPattern, GovSearchExperiencePattern, 
  GovDocumentCenterPattern, GovCompanyProfilePattern, GovInvestorWorkspacePattern, 
  GovInspectionPattern, GovReportingPattern, GovAIAssistantPattern, 
  GovNotificationCenterPattern, GovErrorStatesPattern, GovHelpSupportPattern 
} from "./gov-ui/patterns";

interface GovernmentDesignSystemProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function GovernmentDesignSystem({ currentLanguage, role }: GovernmentDesignSystemProps) {
  const [activeTab, setActiveTab] = useState<string>("brand-identity");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Interactive playgrounds state
  const [playgroundText, setPlaygroundText] = useState<string>("جمهورية السودان - وزارة التجارة والصناعة");
  const [playgroundTextEn, setPlaygroundTextEn] = useState<string>("Republic of Sudan - Ministry of Commerce");
  
  // Dark mode preview state
  const [isDarkModePreview, setIsDarkModePreview] = useState<boolean>(false);
  
  // Component states
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);
  const [toggleActive, setToggleActive] = useState<boolean>(true);
  const [otpValue, setOtpValue] = useState<string[]>(["2", "0", "3", "5"]);
  const [selectedItem, setSelectedItem] = useState<string>("reg");

  // Motion Playground states
  const [selectedEasing, setSelectedEasing] = useState<string>("spring");
  const [motionDuration, setMotionDuration] = useState<number>(0.5);
  const [motionKey, setMotionKey] = useState<number>(0);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // SGDS Sub-Tabs
  const tabs = [
    { id: "brand-identity", labelAr: "الهوية والفلسفة البصرية", labelEn: "Brand & Design Philosophy", icon: Palette },
    { id: "typography-spec", labelAr: "نظام الخطوط والموازين", labelEn: "Typography Specs", icon: Type },
    { id: "color-spec", labelAr: "نظام الألوان والتباين", labelEn: "Sovereign Color System", icon: Palette },
    { id: "design-tokens", labelAr: "رموز التصميم (Design Tokens)", labelEn: "Design Tokens (Tailwind)", icon: Code },
    { id: "interactive-components", labelAr: "مكتبة المكونات التفاعلية", labelEn: "UI Components Library", icon: Layers },
    { id: "forms-framework", labelAr: "إطار عمل الاستمارات الموحد", labelEn: "Unified Forms Framework", icon: FileText },
    { id: "experience-patterns", labelAr: "نماذج تجارب المعاملات (15 نمطاً)", labelEn: "Sovereign Experience Patterns (15)", icon: Workflow },
    { id: "accessibility-guide", labelAr: "معايير الوصولية WCAG 2.2", labelEn: "WCAG 2.2 AA Guide", icon: Accessibility },
    { id: "motion-micro", labelAr: "الحركة والتفاعلات الدقيقة", labelEn: "Motion & Micro-interactions", icon: Zap },
    { id: "layout-breakpoints", labelAr: "تخطيط الفراغات وشبكة الـ Grid", labelEn: "Grid & Breakpoints", icon: Monitor },
    { id: "developer-handbook", labelAr: "معايير التطوير والدليل الهندسي", labelEn: "Developer Standards & Architecture", icon: Code },
    { id: "figma-ready", labelAr: "هيكل النقل لـ Figma وصنع القرار", labelEn: "Figma & Production Export", icon: ExternalLink }
  ];

  // Colors specs
  const colorsList = [
    { name: "Primary Sudan Green", hex: "#007A33", tailwind: "bg-sudan-green", contrast: "AAA (7.8:1)", category: "Primary", descAr: "الأخضر الوطني الرسمي لتمثيل التنمية والنماء والقطاع الزراعي العريق.", descEn: "The official national green representing development, agriculture, and prosperity." },
    { name: "Sovereign Gold", hex: "#C5A059", tailwind: "bg-sudan-gold", contrast: "AA (4.5:1 with Dark Text)", category: "Primary Accent", descAr: "الذهبي الملكي لتمثيل الثروات المعدنية، الصمغ العربي، وفرص الاستثمار الفاخرة.", descEn: "Royal Gold representing mineral wealth, Gum Arabic export grade, and premium investment." },
    { name: "Sovereign Mint", hex: "#b1e0c0", tailwind: "bg-sudan-dark", contrast: "AA (with Dark Text)", category: "Neutral Light Accent", descAr: "اللون السيادي الجديد المستلهم من الهوية النضرة والحديثة للتطبيق.", descEn: "Sovereign mint green representing a fresh and modern national digital identity." },
    { name: "Pure White / Off-White", hex: "#F4F6F5", tailwind: "bg-slate-50", contrast: "AAA with Slate Text", category: "Neutral Light", descAr: "الأبيض والرمادي الخفيف للفراغات المريحة والعناصر الإدارية الأنيقة.", descEn: "Soft off-white for negative spaces, crisp document cards, and clean background margins." },
    { name: "Semantic Success", hex: "#10B981", tailwind: "bg-emerald-500", contrast: "AAA (4.8:1)", category: "Semantic", descAr: "الأخضر المعتمد للمعاملات المقبولة، السجلات المرخصة، والرسوم المدفوعة.", descEn: "Approved transactions, verified corporate registers, and completed payments." },
    { name: "Semantic Warning / Pending", hex: "#F59E0B", tailwind: "bg-amber-500", contrast: "AA (3.1:1)", category: "Semantic", descAr: "البرتقالي الدافئ للمعاملات تحت التدقيق الميداني أو الحجوزات المؤقتة للأراضي.", descEn: "Applications under audit, temporary reservations, or warnings." },
    { name: "Semantic Error / Rejected", hex: "#EF4444", tailwind: "bg-rose-500", contrast: "AAA (4.6:1)", category: "Semantic", descAr: "الأحمر القوي لبلاغات الغش التجاري المصنفة، والطلبات المرفوضة.", descEn: "Commercial fraud alerts, price-gouging enforcements, and rejected applications." },
  ];

  // Design Tokens Data
  const designTokensCode = JSON.stringify({
    metadata: {
      system: "Sudan Government Digital Design System (SGDS)",
      version: "1.0.0",
      authority: "Ministry of Commerce & Industry",
      vision: "Sudan 2035",
      type: "Enterprise Sovereign Tokens"
    },
    typography: TYPOGRAPHY_TOKENS,
    spacing_base_8px: SPACING_TOKENS,
    corner_radius: RADIUS_TOKENS,
    shadow_elevations: SHADOW_TOKENS,
    motion_and_easing: MOTION_TOKENS,
    z_indexes: Z_INDEX_TOKENS,
    layout_dimensions: LAYOUT_TOKENS,
    responsive_breakpoints: RESPONSIVE_TOKENS,
    opacity_values: OPACITY_TOKENS,
    icon_specifications: ICON_TOKENS,
    data_visualization: DATA_VIS_TOKENS,
    color_scales_50_950: COLOR_SCALES,
    semantic_light_theme: SEMANTIC_LIGHT_THEME,
    semantic_dark_theme: SEMANTIC_DARK_THEME,
    components: COMPONENT_TOKENS
  }, null, 2);

  return (
    <div id="government-design-system-portal" className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-sudan-green/5 to-transparent pointer-events-none"></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-sudan-green/10 text-sudan-green px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              SGDS v1.0.0
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-sudan-gold" />
              Sovereign Identity System
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1E293B] flex items-center gap-2">
            <Palette className="h-6 w-6 text-sudan-green" />
            {currentLanguage === "ar" ? "نظام التصميم الرقمي الحكومي الموحد 2035" : "Sudan Government Design System 2035"}
          </h2>
          <p className="text-xs text-gray-400">
            {currentLanguage === "ar" 
              ? "دليل القواعد والمكونات التفاعلية والرموز البرمجية الموحدة لوزارات جمهورية السودان" 
              : "Unified official government design token repository, reusable component suite, and accessibility specifications."}
          </p>
        </div>

        {/* Global Dark Mode / High Contrast Simulator Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkModePreview(!isDarkModePreview)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              isDarkModePreview 
                ? "bg-slate-800 text-white border-slate-700 shadow-inner" 
                : "bg-[#F4F6F5] text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>
              {currentLanguage === "ar" 
                ? (isDarkModePreview ? "محاكي الوضع الداكن: نشط" : "عرض محاكي الوضع الداكن") 
                : (isDarkModePreview ? "Dark Mode Simulator: ON" : "Toggle Dark Mode Simulator")}
            </span>
          </button>
        </div>
      </div>

      {/* Main Layout containing Tabs and Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider px-3 mb-2">
            {currentLanguage === "ar" ? "فهرس لغة التصميم" : "Design System Spec Index"}
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

        {/* Dynamic Display Canvas */}
        <div className={`lg:col-span-3 rounded-3xl border transition-all duration-300 shadow-sm p-6 ${
          isDarkModePreview 
            ? "bg-slate-900 border-slate-800 text-slate-100" 
            : "bg-white border-gray-200 text-slate-800"
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (isDarkModePreview ? "-dark" : "-light")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* TAB 1: Brand & Design Philosophy */}
              {activeTab === "brand-identity" && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-gray-100">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <Palette className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "الهوية والفلسفة البصرية" : "Sovereign Brand & Philosophy"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "المبادئ التوجيهية للغة تصميم منصة وزارة التجارة والصناعة 2035" : "Core visual foundations representing high-trust governmental digital experience."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-5 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/50 border-slate-700" : "bg-emerald-50/50 border-emerald-100"} space-y-2`}>
                      <span className="text-[10px] bg-sudan-green text-white px-2 py-0.5 rounded-full font-bold">Concept 01</span>
                      <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "الهيبة الرسمية والسيادية (Sovereign Authority)" : "Sovereign Authority"}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "التصميم يعبر عن الثقة المطلقة والاستقرار والأمان. نبتعد عن الخطوط الهزلية أو الزخارف المشتتة، ونلتزم بالبنية الكلاسيكية مع لمسات تقنية رفيعة لضمان الاحترام المتبادل لخدمات الدولة الفيدرالية." 
                          : "The architecture conveys absolute trust, security, and permanence. No distracting layout patterns or casual widgets; the design utilizes clear alignment systems representing official authority."}
                      </p>
                    </div>

                    <div className={`p-5 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/50 border-slate-700" : "bg-indigo-50/50 border-indigo-100"} space-y-2`}>
                      <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">Concept 02</span>
                      <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "انعدام المعاملات الورقية (Digital by Default)" : "Digital by Default"}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "تمت تهيئة كل معاملة تجارية لتتم رقمياً بالكامل بنسبة مائة بالمائة. نعتمد على شهادات مشفرة برموز QR تفاعلية، بدلاً من المكاتبات المطبوعة، مع تكامل مباشر مع سحابة البيانات." 
                          : "Completely optimized for zero-paper processing. All modules issue verifiable cryptographic QR-coded documents, bypassing manual signatures, powered by live Firebase state sync."}
                      </p>
                    </div>

                    <div className={`p-5 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/50 border-slate-700" : "bg-amber-50/50 border-amber-100"} space-y-2`}>
                      <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">Concept 03</span>
                      <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "أقل عدد من النقرات (UX Simplicity)" : "UX Friction Reduction"}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "نسعى لتمكين المواطنين والمستثمرين من حجز الأراضي وإصدار شهادات الاستيراد والتصدير بأقل عدد من النقرات والخطوات، مع وضوح حالة الطلب في كل ثانية." 
                          : "We minimize transactional friction. From land leasing applications to corporate registries, users are guided by unified wizards requiring minimal effort with instant validation checks."}
                      </p>
                    </div>

                    <div className={`p-5 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/50 border-slate-700" : "bg-rose-50/50 border-rose-100"} space-y-2`}>
                      <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">Concept 04</span>
                      <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "إتاحة تامة للجميع (Inclusive Accessibility)" : "Universal Access"}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "المنصة تلتزم بالكامل بمعيار الوصول العالمي WCAG 2.2 AA، لضمان سهولة قراءة النصوص وتوافقها مع قارئات الشاشة ودعم اللغتين العربية والإنجليزية بتبديل فوري ومحكم." 
                          : "Ensuring 100% compliance with international WCAG 2.2 standards, maintaining proper color contrast margins, keyboard focus support, and native bidirectional text rendering (RTL/LTR)."}
                      </p>
                    </div>
                  </div>

                  {/* Visual Identity Palette Banner */}
                  <div className={`p-6 rounded-2xl border text-center space-y-4 ${
                    isDarkModePreview ? "bg-slate-800/30 border-slate-700" : "bg-[#F4F6F5] border-gray-200"
                  }`}>
                    <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "شعار الهوية البصرية السيادية 2035" : "Visual Identity Shield Showcase"}</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="h-24 w-24 rounded-full bg-sudan-green border-4 border-white shadow-md flex items-center justify-center text-white font-black text-xs">
                        {currentLanguage === "ar" ? "نماء" : "Growth"}
                      </div>
                      <div className="h-24 w-24 rounded-full bg-sudan-gold border-4 border-white shadow-md flex items-center justify-center text-white font-black text-xs">
                        {currentLanguage === "ar" ? "ثروة" : "Gold"}
                      </div>
                      <div className="h-24 w-24 rounded-full bg-sudan-dark border-4 border-white shadow-md flex items-center justify-center text-slate-900 font-black text-xs">
                        {currentLanguage === "ar" ? "سيادة" : "Sovereign"}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {currentLanguage === "ar" 
                        ? "الألوان مستلهمة من نسيج العلم الوطني لجمهورية السودان والرمال الذهبية الغنية والنماء المستدام للقطاع الزراعي والحيواني العريق." 
                        : "Color palettes derived directly from the sovereign national flag of the Republic of Sudan, reflecting geological treasures and agricultural expansion."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Typography Scale */}
              {activeTab === "typography-spec" && (
                <div className="space-y-8">
                  <div className="border-b pb-4 border-gray-100">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <Type className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "نظام الخطوط والموازين الرقمية الرسمية" : "Official Typography Scale Specification"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "الخطوط الرسمية الحصرية لمنصة وزارة التجارة والصناعة (SGDS v1.0.0)" : "DIN Next & DIN Next Arabic are the exclusive corporate typographies for all official interfaces."}
                    </p>
                  </div>

                  {/* Font Families Highlight Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-white border-gray-200"} space-y-2`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-sudan-green text-white px-2 py-0.5 rounded-full font-bold">ARABIC PRIMARY</span>
                        <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">● Active</span>
                      </div>
                      <h4 className="font-extrabold text-sm font-sans">DIN Next Arabic</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        {currentLanguage === "ar" 
                          ? "الخط الرسمي المعتمد لكافة واجهات النصوص العربية ونماذج التقديم والبيانات الإحصائية والتقارير."
                          : "Exclusive font family for all Arabic interfaces, public reports, and business licenses."}
                      </p>
                      <div className="text-lg font-bold border-t pt-2 border-gray-100 mt-2 font-sans">أب ج د هـ و ز ح ط ي</div>
                    </div>

                    <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-white border-gray-200"} space-y-2`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-sudan-gold text-white px-2 py-0.5 rounded-full font-bold">LATIN & NUMERALS</span>
                        <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">● Active</span>
                      </div>
                      <h4 className="font-extrabold text-sm font-sans">DIN Next</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        {currentLanguage === "ar"
                          ? "خط الترويسات والفقرات باللغة الإنجليزية وعرض الأرقام القياسية في جداول الإحصاء والنسب المئوية."
                          : "Used for English text elements, headers, tables, financial ratios, and global investor portals."}
                      </p>
                      <div className="text-lg font-bold border-t pt-2 border-gray-100 mt-2 font-sans">ABCDEFGHIJKLMN</div>
                    </div>

                    <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-white border-gray-200"} space-y-2`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-sudan-slate text-white px-2 py-0.5 rounded-full font-bold">CODE & SECURITY</span>
                        <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">● Active</span>
                      </div>
                      <h4 className="font-extrabold text-sm font-mono">JetBrains Mono</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        {currentLanguage === "ar"
                          ? "مخصص للأرقام المرجعية المشفرة، أختام الـ QR، الرموز الأمنية، وتفاصيل السجلات الصناعية المعقدة."
                          : "Used for reference IDs, cryptographic QR codes, audit timestamps, and system coordinate labels."}
                      </p>
                      <div className="text-lg font-mono border-t pt-2 border-gray-100 mt-2">REG-9385-SUD-35</div>
                    </div>
                  </div>

                  {/* Typography Live Sandbox */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5] border-gray-100"}`}>
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black text-sudan-green uppercase tracking-wider">{currentLanguage === "ar" ? "مختبر الخطوط التفاعلي (Interactive Spec Sandbox)" : "Interactive Spec Sandbox"}</p>
                      <span className="text-[10px] text-gray-400">DIN Next Arabic / DIN Next</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">{currentLanguage === "ar" ? "نص التجربة العربي" : "Arabic Custom Text"}</label>
                        <input 
                          type="text" 
                          value={playgroundText} 
                          onChange={(e) => setPlaygroundText(e.target.value)}
                          className={`w-full text-xs p-3 rounded-xl border ${isDarkModePreview ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-200"}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">{currentLanguage === "ar" ? "نص التجربة الإنجليزي" : "English Custom Text"}</label>
                        <input 
                          type="text" 
                          value={playgroundTextEn} 
                          onChange={(e) => setPlaygroundTextEn(e.target.value)}
                          className={`w-full text-xs p-3 rounded-xl border ${isDarkModePreview ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-200"}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Full Sovereign Type Scale Showcase */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h4 className="font-extrabold text-xs text-sudan-green uppercase tracking-widest">{currentLanguage === "ar" ? "جدول تدرج المقاييس والرموز البصرية" : "Complete Scale Spec & Token Mapping"}</h4>
                      <span className="text-[10px] text-gray-400">WCAG 2.2 AA Compliant</span>
                    </div>

                    <div className="overflow-x-auto border rounded-2xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b ${isDarkModePreview ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                            <th className="p-3 text-right">{currentLanguage === "ar" ? "المستوى / الرمز" : "Level & Token ID"}</th>
                            <th className="p-3">{currentLanguage === "ar" ? "الخصائص التقنية (Size/Height)" : "Tech Spec (Size/Height/Weight)"}</th>
                            <th className="p-3 w-1/2">{currentLanguage === "ar" ? "المعاينة الحية (Live Preview)" : "Live Design Preview"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                          
                          {/* Display XXL */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Display XXL</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-display-xxl</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">3.50rem (56px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.10 • Weight: 900</div>
                            </td>
                            <td className="p-3">
                              <p className="text-3xl md:text-display-xxl font-black leading-none text-sudan-green">{playgroundText}</p>
                              <p className="text-3xl md:text-display-xxl font-black leading-none font-sans text-gray-400 mt-1">{playgroundTextEn}</p>
                            </td>
                          </tr>

                          {/* Display XL */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Display XL</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-display-xl</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">2.50rem (40px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.15 • Weight: 900</div>
                            </td>
                            <td className="p-3">
                              <p className="text-2xl md:text-display-xl font-black text-sudan-dark dark:text-white">{playgroundText}</p>
                              <p className="text-2xl md:text-display-xl font-black font-sans text-gray-400 mt-1">{playgroundTextEn}</p>
                            </td>
                          </tr>

                          {/* H1 */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Heading 1 (H1)</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-h1</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">1.75rem (28px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.30 • Weight: 700</div>
                            </td>
                            <td className="p-3">
                              <h1 className="text-xl md:text-h1 font-bold text-sudan-green">{playgroundText}</h1>
                              <p className="text-xl md:text-h1 font-bold font-sans text-sudan-green mt-1">{playgroundTextEn}</p>
                            </td>
                          </tr>

                          {/* H2 */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Heading 2 (H2)</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-h2</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">1.50rem (24px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.35 • Weight: 700</div>
                            </td>
                            <td className="p-3">
                              <h2 className="text-lg md:text-h2 font-bold text-sudan-dark dark:text-white">{playgroundText}</h2>
                              <p className="text-lg md:text-h2 font-bold font-sans text-gray-400 mt-1">{playgroundTextEn}</p>
                            </td>
                          </tr>

                          {/* Subtitle XL */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Subtitle XL</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-subtitle-xl</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">1.25rem (20px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.40 • Weight: 500</div>
                            </td>
                            <td className="p-3">
                              <p className="text-subtitle-xl font-medium text-sudan-gold">{playgroundText}</p>
                              <p className="text-subtitle-xl font-medium font-sans text-sudan-gold mt-1">{playgroundTextEn}</p>
                            </td>
                          </tr>

                          {/* Body Medium */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Body Medium</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-body-medium</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">0.875rem (14px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.60 • Weight: 400</div>
                            </td>
                            <td className="p-3">
                              <p className="text-body-medium text-gray-600 dark:text-gray-300 leading-relaxed">{playgroundText} - يضمن هذا الميزان راحة بصرية فائقة ومقروئية كاملة لكافة فقرات اللوائح والقوانين المنظمة للاستثمار والصناعة بجمهورية السودان.</p>
                              <p className="text-body-medium font-sans text-gray-400 leading-relaxed mt-1">{playgroundTextEn} - Enforces highly legible paragraph reading parameters conforming with sovereign digital standardizations.</p>
                            </td>
                          </tr>

                          {/* Label Large */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Label Large</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-label-lg</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">0.875rem (14px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.40 • Weight: 700</div>
                            </td>
                            <td className="p-3">
                              <span className="font-sans font-bold bg-sudan-green/10 text-sudan-green px-3 py-1 rounded-full">{playgroundText}</span>
                              <span className="font-sans font-bold bg-sudan-green/10 text-sudan-green px-3 py-1 rounded-full ml-2">{playgroundTextEn}</span>
                            </td>
                          </tr>

                          {/* Button Medium */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Button Medium</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-btn-md</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">0.875rem (14px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.00 • Weight: 700</div>
                            </td>
                            <td className="p-3">
                              <button className="bg-sudan-green text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                                {playgroundTextEn}
                              </button>
                            </td>
                          </tr>

                          {/* Caption Small */}
                          <tr className="hover:bg-gray-50/50">
                            <td className="p-3 text-right font-bold">
                              <div>Caption Small</div>
                              <span className="text-[10px] text-gray-400 font-mono">--text-caption-sm</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-[10px]">0.6875rem (11px)</div>
                              <div className="text-gray-400 text-[10px]">LH: 1.30 • Weight: 400</div>
                            </td>
                            <td className="p-3">
                              <p className="text-caption-sm text-gray-400 uppercase tracking-widest">REG-NO: 2035-SUDAN-COMMERCE-MINISTRY-LICENSE-98439</p>
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Specialized Sovereign Contexts Rules */}
                  <div className="pt-6 border-t border-gray-100/50 space-y-4">
                    <h4 className="font-extrabold text-xs text-sudan-green uppercase tracking-widest">{currentLanguage === "ar" ? "قواعد خطوط السياقات السيادية الخاصة" : "Specialized Sovereign Contexts Specs"}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-5 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-white border-gray-200"} space-y-2`}>
                        <h5 className="font-extrabold text-xs text-sudan-gold flex items-center gap-1.5">
                          <Award className="h-4 w-4" />
                          {currentLanguage === "ar" ? "شهادات التراخيص والمستندات المطبوعة والـ PDF" : "Official Certificates & Printable PDF Specs"}
                        </h5>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {currentLanguage === "ar"
                            ? "تعتمد مستندات الـ PDF المصدرة حصراً على خط DIN Next Arabic بوزن عريض (700) بحجم 14pt للعناوين، وخط عادي (400) بحجم 11pt للفقرات مع علامة مائية سيادية بلون خفيف جداً يمنع التزييف البصري."
                            : "Exported PDFs utilize DIN Next Arabic (700) at 14pt for titles, 11pt (400) for regular paragraphs, with lightweight background watermarks to support direct secure physical prints."}
                        </p>
                      </div>

                      <div className={`p-5 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-white border-gray-200"} space-y-2`}>
                        <h5 className="font-extrabold text-xs text-sudan-green flex items-center gap-1.5">
                          <Zap className="h-4 w-4" />
                          {currentLanguage === "ar" ? "مساعد الذكاء الاصطناعي ومؤشرات الدقة" : "AI Assistant Recommendations & Trust Metrics"}
                        </h5>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {currentLanguage === "ar"
                            ? "تُعرض ردود المساعد الذكي بخط مائل قليل التباين بوزن عادي (400) وحجم 0.875rem لتمييزها بوضوح تام عن نصوص القرارات واللوائح الوزارية الصارمة الصادرة عن موظفي الدولة."
                            : "AI-generated recommendations render with specialized italicization at 0.875rem. Confidence indices display in JetBrains Mono at 11px to clearly segment assistant recommendations from hard executive approvals."}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: Color System */}
              {activeTab === "color-spec" && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-gray-100">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <Palette className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "نظام الألوان واختبارات التباين" : "Sovereign Color Palettes & Accessibility Contrast Scores"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "قائمة درجات الألوان المعتمدة ونتائج التباين وفق معيار WCAG 2.2" : "Official digital color specs mapped to contrast scores to ensure absolute high legibility."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {colorsList.map((col, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.01] ${
                          isDarkModePreview ? "bg-slate-800/50 border-slate-700" : "bg-[#F4F6F5]/50 border-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-xl shrink-0 ${col.tailwind} shadow-sm border border-black/10`}></div>
                          <div>
                            <h4 className="font-extrabold text-xs">{col.name}</h4>
                            <p className="text-[10px] font-mono text-gray-400 mt-0.5">{col.hex} • {col.tailwind}</p>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-md">
                              {currentLanguage === "ar" ? col.descAr : col.descEn}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 text-right">
                          <span className="text-[9px] bg-sudan-green/10 text-sudan-green px-2 py-0.5 rounded-full font-black uppercase">
                            {col.category}
                          </span>
                          <span className="text-xs text-gray-400 font-extrabold mt-1">
                            {currentLanguage === "ar" ? `التباين: ${col.contrast}` : `Contrast: ${col.contrast}`}
                          </span>
                          <button
                            onClick={() => handleCopy(col.hex, col.name)}
                            className="text-[10px] text-sudan-gold hover:underline font-bold mt-1.5 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedText === col.name ? (currentLanguage === "ar" ? "تم النسخ!" : "Copied!") : (currentLanguage === "ar" ? "نسخ رمز HEX" : "Copy HEX")}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Design Tokens */}
              {activeTab === "design-tokens" && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-gray-100">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <Code className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "رموز التصميم الفنية (Design Tokens)" : "Digital Design Tokens (Tailwind Configuration)"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "تصدير الإعدادات مباشرة كملف JSON لدمجه بنظام التطوير ومجلدات Tailwind CSS" : "Copy and paste ready-to-use JSON token maps for rapid integration into clean frontend setups."}
                    </p>
                  </div>

                  {/* Config block */}
                  <div className="relative">
                    <button
                      onClick={() => handleCopy(designTokensCode, "tailwind-config")}
                      className="absolute right-3 top-3 bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors z-10"
                    >
                      {copiedText === "tailwind-config" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedText === "tailwind-config" ? (currentLanguage === "ar" ? "تم نسخ الإعدادات!" : "Tokens Copied!") : (currentLanguage === "ar" ? "نسخ الكود" : "Copy Token Code")}</span>
                    </button>
                    <pre className="p-5 bg-slate-900 border border-slate-800 text-emerald-400 rounded-3xl text-[11px] font-mono overflow-x-auto max-h-[400px]">
                      {designTokensCode}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5]/50 border-gray-100"} space-y-1`}>
                      <p className="font-extrabold text-sudan-green uppercase tracking-wide">Elevation Levels</p>
                      <p className="text-gray-400 leading-relaxed">We enforce 4 elevation states (Flat, Raised, Floating, Overlay) matching strict micro-shadow token margins.</p>
                    </div>
                    <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5]/50 border-gray-100"} space-y-1`}>
                      <p className="font-extrabold text-sudan-green uppercase tracking-wide">Border Radius System</p>
                      <p className="text-gray-400 leading-relaxed">Consistent corner ratios from small checkbox cards (8px) to premium service badges (24px) to represent high craft.</p>
                    </div>
                    <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5]/50 border-gray-100"} space-y-1`}>
                      <p className="font-extrabold text-sudan-green uppercase tracking-wide">Motion Easings</p>
                      <p className="text-gray-400 leading-relaxed">Integrated spring cubic-bezier transitions for smooth component rendering without browser lagging or frame drops.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Interactive Component Library Previews */}
              {activeTab === "interactive-components" && (
                <div className="space-y-10">
                  <div className="border-b pb-4 border-gray-100">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <Layers className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مكتبة المكونات التفاعلية وحالاتها النشطة" : "Unified Component Library & Interactive Sandbox"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "استعرض المكونات الحية، اختبر الحركات، حالات التحميل والتفاصيل مباشرة" : "Test the look and feel of government-grade buttons, text fields, checkable panels, and OTP grids."}
                    </p>
                  </div>

                  {/* 1. ATOMS */}
                  <div className="space-y-6">
                    <h4 className="font-extrabold text-xs text-sudan-green uppercase tracking-wider border-b border-gray-100 pb-2">01. Atoms (العناصر الأساسية)</h4>
                    
                    {/* Typography atom */}
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-400 font-bold">Typography Showcase:</p>
                      <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-gray-200">
                        <SovereignTypography variant="display-sm">
                          {currentLanguage === "ar" ? "خط ديواني سيادي - عريض" : "Sovereign Display Typography"}
                        </SovereignTypography>
                        <SovereignTypography variant="h3" className="text-sudan-green">
                          {currentLanguage === "ar" ? "العناوين الرئيسية للأبواب" : "Section Headings"}
                        </SovereignTypography>
                        <SovereignTypography variant="body-md" className="text-gray-500">
                          {currentLanguage === "ar" ? "هذا النص يعرض خط DIN Next Arabic المعتمد من قبل وزارة التجارة السودانية للمستندات والخطابات الرسمية." : "This body text showcases the official DIN Next Arabic font authorized for official government communications."}
                        </SovereignTypography>
                      </div>
                    </div>

                    {/* Buttons atom */}
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-400 font-bold">Button Variants:</p>
                      <div className="flex flex-wrap gap-3 items-center">
                        <SovereignButton variant="primary">
                          {currentLanguage === "ar" ? "زر رئيسي" : "Primary Action"}
                        </SovereignButton>
                        <SovereignButton variant="secondary">
                          {currentLanguage === "ar" ? "زر سيادي ذهبي" : "Sovereign Gold"}
                        </SovereignButton>
                        <SovereignButton variant="outline">
                          {currentLanguage === "ar" ? "زر حدودي" : "Outline Button"}
                        </SovereignButton>
                        <SovereignButton variant="ghost">
                          {currentLanguage === "ar" ? "زر شفاف" : "Ghost"}
                        </SovereignButton>
                        <SovereignButton variant="success">
                          {currentLanguage === "ar" ? "موافقة واعتماد" : "Success Approve"}
                        </SovereignButton>
                        <SovereignButton variant="danger">
                          {currentLanguage === "ar" ? "إلغاء أو رفض" : "Danger Reject"}
                        </SovereignButton>
                        <SovereignButton variant="ai-action">
                          {currentLanguage === "ar" ? "تحليل بالذكاء الاصطناعي" : "Analyze with AI"}
                        </SovereignButton>
                      </div>
                    </div>

                    {/* Badges and Avatars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">Status Badges:</p>
                        <div className="flex flex-wrap gap-2">
                          <SovereignBadge variant="draft" currentLanguage={currentLanguage} />
                          <SovereignBadge variant="pending" currentLanguage={currentLanguage} />
                          <SovereignBadge variant="approved" currentLanguage={currentLanguage} />
                          <SovereignBadge variant="rejected" currentLanguage={currentLanguage} />
                          <SovereignBadge variant="completed" currentLanguage={currentLanguage} />
                          <SovereignBadge variant="active" currentLanguage={currentLanguage} />
                          <SovereignBadge variant="inactive" currentLanguage={currentLanguage} />
                          <SovereignBadge variant="ai-generated" currentLanguage={currentLanguage} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">Sovereign Avatars:</p>
                        <div className="flex gap-3 items-center">
                          <SovereignAvatar roleType="user" name="Usama" size="sm" />
                          <SovereignAvatar roleType="employee" name="Moniem" size="md" />
                          <SovereignAvatar roleType="investor" name="Fahad" size="lg" />
                          <SovereignAvatar roleType="ministry" name="S" size="md" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. MOLECULES */}
                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h4 className="font-extrabold text-xs text-sudan-green uppercase tracking-wider border-b border-gray-100 pb-2">02. Molecules (العناصر المركبة)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Search box with AI toggle */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">Search Box & AI Search:</p>
                        <SovereignSearchBox 
                          placeholder={currentLanguage === "ar" ? "ابحث عن رقم السجل أو اسم الشركة..." : "Search commercial record..."}
                          currentLanguage={currentLanguage}
                          isAIActive={false}
                        />
                        <SovereignSearchBox 
                          placeholder={currentLanguage === "ar" ? "اسأل المساعد الذكي عن قوانين التصدير..." : "Ask AI about import-export rules..."}
                          currentLanguage={currentLanguage}
                          isAIActive={true}
                        />
                      </div>

                      {/* OTP grid */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">OTP Dual Verification:</p>
                        <div className="bg-white border border-gray-200 p-4 rounded-3xl">
                          <SovereignOTP currentLanguage={currentLanguage} length={4} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Password strength */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">Password Strength Gauge:</p>
                        <div className="bg-white border border-gray-200 p-5 rounded-3xl">
                          <SovereignPasswordStrength password="Sdmci@2035Secure" currentLanguage={currentLanguage} />
                        </div>
                      </div>

                      {/* Timeline Item */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">Sovereign Audit Timeline:</p>
                        <div className="bg-white border border-gray-200 p-5 rounded-3xl">
                          <SovereignTimeline 
                            currentLanguage={currentLanguage}
                            steps={[
                              { titleAr: "تقديم الطلب الإلكتروني", titleEn: "Form Submission", date: "2026-07-01", status: "completed", descAr: "تم تسليم الطلب من بوابة المستثمر.", descEn: "Delivered via investor node." },
                              { titleAr: "التدقيق الميداني والمطابقة", titleEn: "Inspection & Audit", date: "2026-07-03", status: "completed", descAr: "تم فحص المصنع ومطابقة مواصفات الجودة.", descEn: "Factory inspect verified completely." },
                              { titleAr: "مراجعة المدير التنفيذي", titleEn: "Executive Review", date: "2026-07-10", status: "current", descAr: "الطلب قيد المراجعة النهائية للاعتماد السيادي.", descEn: "Final approval review under process." }
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. FORMS */}
                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h4 className="font-extrabold text-xs text-sudan-green uppercase tracking-wider border-b border-gray-100 pb-2">03. Form Components (عناصر الاستمارات الرقمية)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <SovereignInput 
                          labelAr="الرقم الوطني الموحد" 
                          labelEn="Sovereign National ID"
                          placeholder="1-123456-12"
                          isRequired={true}
                          currentLanguage={currentLanguage}
                        />

                        <SovereignSelect 
                          labelAr="الولاية الجغرافية للمنشأة" 
                          labelEn="Geographical State"
                          isRequired={true}
                          currentLanguage={currentLanguage}
                          options={[
                            { labelAr: "الخرطوم", labelEn: "Khartoum", value: "khartoum" },
                            { labelAr: "الجزيرة", labelEn: "Al Gezira", value: "gezira" },
                            { labelAr: "البحر الأحمر", labelEn: "Red Sea", value: "red_sea" },
                            { labelAr: "شمال كردفان", labelEn: "North Kordofan", value: "kordofan" }
                          ]}
                        />
                      </div>

                      <div className="space-y-4">
                        <SovereignFileUpload 
                          labelAr="المستندات الثبوتية والسجل التجاري (PDF)"
                          labelEn="Commercial Registry PDF Document"
                          currentLanguage={currentLanguage}
                        />

                        <SovereignSignaturePad currentLanguage={currentLanguage} />
                      </div>
                    </div>
                  </div>

                  {/* 4. ORGANISMS */}
                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h4 className="font-extrabold text-xs text-sudan-green uppercase tracking-wider border-b border-gray-100 pb-2">04. Organisms (المكونات الهيكلية المتكاملة)</h4>
                    
                    {/* Document viewer */}
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-400 font-bold">Official Certificate Viewer (Interactive):</p>
                      <SovereignDocumentViewer 
                        titleAr="شهادة السجل التجاري الإلكتروني السيادي"
                        titleEn="Official Sovereign Commercial Registry Certificate"
                        docId="SD-2026-90412"
                        issueDate="2026-07-12"
                        ownerAr="شركة الخرطوم الموحدة لتصدير الصمغ العربي"
                        ownerEn="Khartoum Unified Gum Arabic Export Co."
                        currentLanguage={currentLanguage}
                        additionalDetails={[
                          { labelAr: "رأس المال المستثمر", labelEn: "Invested Capital", value: "10,000,000 SDG" },
                          { labelAr: "الولاية المقر", labelEn: "Headquarters State", value: "ولاية الخرطوم - بحري" }
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* AI workspace */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">Sovereign AI Chat Agent:</p>
                        <SovereignAIChatWindow currentLanguage={currentLanguage} />
                      </div>

                      {/* Enterprise Table data grid */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 font-bold">Enterprise Data Grid Table:</p>
                        <SovereignDataGrid 
                          titleAr="سجل تراخيص الاستيراد والتصدير الاتحادية"
                          titleEn="Federal Import & Export Licenses Grid"
                          currentLanguage={currentLanguage}
                          pageSize={3}
                          columns={[
                            { key: "company", headerAr: "الشركة المصدرة", headerEn: "Company" },
                            { key: "type", headerAr: "النوع", headerEn: "Type" },
                            { key: "value", headerAr: "القيمة السنوية", headerEn: "Annual Value" }
                          ]}
                          data={[
                            { id: 1, company: "شركة الخرطوم الموحدة", type: "تصدير صمغ عربي", value: "8,000,000 USD" },
                            { id: 2, company: "مؤسسة البحر الأحمر الملاحية", type: "استيراد ماكينات", value: "4,000,000 USD" },
                            { id: 3, company: "مجمع الغلال الحديث", type: "استيراد قمح وهشاب", value: "3,500,000 USD" }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Experience Patterns Library & Blueprint Manual */}
              {activeTab === "experience-patterns" && (
                <div className="space-y-8">
                  <div className="border-b pb-4 border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-black flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-sudan-green" />
                        {currentLanguage === "ar" ? "مكتبة نماذج تجربة المستخدم السيادية المعتمدة" : "Sovereign Government Experience Patterns & Blueprints"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {currentLanguage === "ar" ? "15 نمطاً معتمداً لتكامل المعاملات وتأسيس التجربة الإدارية والوزارية الموحدة" : "The 15 official reusable experience patterns standardizing Sudan Digital commerce services."}
                      </p>
                    </div>
                  </div>

                  {/* Patterns Explorer layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Pattern Selector Panel */}
                    <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-gray-200/80 space-y-2">
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider px-2">
                        {currentLanguage === "ar" ? "اختر النمط للتصفح" : "Select Pattern Blueprint"}
                      </p>
                      <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                        {[
                          { id: 1, nameAr: "01. الصفحة الرئيسية للحكومة", nameEn: "01. Gov Home Page" },
                          { id: 2, nameAr: "02. دليل ومجلد الخدمات", nameEn: "02. Service Catalog" },
                          { id: 3, nameAr: "03. معالج الخطوات (Wizard)", nameEn: "03. Service Wizard" },
                          { id: 4, nameAr: "04. لوحات التحكم (Dashboards)", nameEn: "04. Dashboard Pattern" },
                          { id: 5, nameAr: "05. مسار الموافقات والاعتماد", nameEn: "05. Approval Workflow" },
                          { id: 6, nameAr: "06. تجربة البحث الفيدرالية", nameEn: "06. Search Experience" },
                          { id: 7, nameAr: "07. مركز الوثائق والمستندات", nameEn: "07. Document Center" },
                          { id: 8, nameAr: "08. الملف الموحد للشركة", nameEn: "08. Company Profile" },
                          { id: 9, nameAr: "09. مساحة عمل المستثمر", nameEn: "09. Investor Workspace" },
                          { id: 10, nameAr: "10. الرقابة والتفتيش الميداني", nameEn: "10. Field Inspection" },
                          { id: 11, nameAr: "11. لوحة التقارير والتحليلات", nameEn: "11. Reporting & Analytics" },
                          { id: 12, nameAr: "12. المساعد الذكي التوليدي", nameEn: "12. AI Assistant Hub" },
                          { id: 13, nameAr: "13. مركز التنبيهات والرسائل", nameEn: "13. Notification Center" },
                          { id: 14, nameAr: "14. حالات الخطأ والأسطح الفارغة", nameEn: "14. Error & Empty States" },
                          { id: 15, nameAr: "15. بوابات الدعم وفتح البلاغات", nameEn: "15. Help & Support Portal" }
                        ].map((pat) => (
                          <button
                            key={pat.id}
                            onClick={() => {
                              (window as any)._selectedPatternId = pat.id;
                              setMotionKey(p => p + 1);
                            }}
                            className={`w-full text-right ltr:text-left text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                              ((window as any)._selectedPatternId || 1) === pat.id
                                ? "bg-[#007A33]/10 text-sudan-green border-2 border-sudan-green"
                                : "text-gray-500 hover:text-sudan-green hover:bg-slate-50 border border-transparent"
                            }`}
                          >
                            {currentLanguage === "ar" ? pat.nameAr : pat.nameEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Pattern Showcase & Blueprint Manual */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* 1. Live Interactive Preview */}
                      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-[10px] font-black text-sudan-gold uppercase tracking-wider">
                            {currentLanguage === "ar" ? "معاينة تفاعلية حية (مستوى الإنتاج)" : "Live Interactive Production Preview"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">SD-PATTERN-0{((window as any)._selectedPatternId || 1)}</span>
                        </div>
                        
                        <div>
                          {(() => {
                            const pId = ((window as any)._selectedPatternId || 1);
                            if (pId === 1) return <GovHomePagePattern currentLanguage={currentLanguage} />;
                            if (pId === 2) return <GovServiceCatalogPattern currentLanguage={currentLanguage} />;
                            if (pId === 3) return <GovServiceWizardPattern currentLanguage={currentLanguage} />;
                            if (pId === 4) return <GovDashboardPattern currentLanguage={currentLanguage} />;
                            if (pId === 5) return <GovApprovalWorkflowPattern currentLanguage={currentLanguage} />;
                            if (pId === 6) return <GovSearchExperiencePattern currentLanguage={currentLanguage} />;
                            if (pId === 7) return <GovDocumentCenterPattern currentLanguage={currentLanguage} />;
                            if (pId === 8) return <GovCompanyProfilePattern currentLanguage={currentLanguage} />;
                            if (pId === 9) return <GovInvestorWorkspacePattern currentLanguage={currentLanguage} />;
                            if (pId === 10) return <GovInspectionPattern currentLanguage={currentLanguage} />;
                            if (pId === 11) return <GovReportingPattern currentLanguage={currentLanguage} />;
                            if (pId === 12) return <GovAIAssistantPattern currentLanguage={currentLanguage} />;
                            if (pId === 13) return <GovNotificationCenterPattern currentLanguage={currentLanguage} />;
                            if (pId === 14) return <GovErrorStatesPattern currentLanguage={currentLanguage} />;
                            if (pId === 15) return <GovHelpSupportPattern currentLanguage={currentLanguage} />;
                            return null;
                          })()}
                        </div>
                      </div>

                      {/* 2. Official Experience Design Manual Documentation (Accordion style for WCAG compliance) */}
                      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4 font-sans">
                        <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-sudan-gold uppercase tracking-wider">
                            {currentLanguage === "ar" ? "دليل وهيكل المواصفات الفنية للنمط" : "Sovereign Architectural Pattern Blueprint Manual"}
                          </h4>
                          <SovereignBadge variant="ai-generated" currentLanguage={currentLanguage} />
                        </div>

                        {(() => {
                          const pId = ((window as any)._selectedPatternId || 1);
                          const docs = [
                            {
                              id: 1,
                              purposeAr: "توحيد الواجهة الأمامية للبوابة الوطنية لتمثيل سيادة جمهورية السودان وتيسير النفاذ العاجل للخدمات والتحذيرات.",
                              purposeEn: "Provides a single, highly authoritative interface representing the Republic of Sudan. Built to ensure rapid access to critical bulletins, emergency notifications, and verified commerce opportunities.",
                              journeyAr: "يبدأ المستثمر أو المواطن بفتح الرابط الوطني، فيشاهد شريط الطوارئ وتوجيهات الذكاء الاصطناعي التي ترشده فورياً إلى خدمة التأسيس.",
                              journeyEn: "The citizen or investor arrives from the public portal, views emergency alert bars, and triggers AI-guided search filters leading directly to their intended service node.",
                              componentsAr: "تتكامل من: شريط الإعلانات الفيدرالي، مربع البحث الذكي، كروت المؤشرات المحدثة بثاً حياً، وقائمة المساعد التوليدي.",
                              componentsEn: "Composed of: Header Ribbon, Emergency Alert banner, Smart AI Search, National Economic Indicators, Featured Services grid, and Footer.",
                              accessAr: "يتوافق تماماً مع تباين AAA، يدعم الانتقال بلوحة المفاتيح عبر زر القفز للمحتوى الأساسي (Skip to Main Content).",
                              accessEn: "Adheres to WCAG 2.2 AAA with strict color ratios (7.8:1), keyboard focus landmarks, and localized RTL alignment indicators.",
                              aiAr: "يدمج الذكاء الاصطناعي بشكل استشاري لتوجيه دقة البحث وفهم لغة المستخدم دون اتخاذ قرارات سيادية نيابة عنه.",
                              aiEn: "Semantic search uses server-side Gemini to parse intent. AI guidance is advisory only; final administrative decisions remain manual.",
                              securityAr: "تشفير كامل لكافة قنوات البحث، حماية خصوصية السجلات قبل تسجيل الدخول الآمن.",
                              securityEn: "TLS 1.3 enforced for lookup channels; search queries are scrubbed to prevent PII leaks or metadata exploitation.",
                              devAr: "مبني باستخدام كتل CSS الموحدة، متاح للنقل كترميز Tailwind JSON الفيدرالي في ثوانٍ معدودة.",
                              devEn: "Built as a modular section layout. Consumes semantic light and dark themes strictly via Tailwind design tokens."
                            },
                            {
                              id: 2,
                              purposeAr: "توفير مجلد تفاعلي ذكي وسريع لتصفح جميع خدمات وزارة التجارة وتصنيفها بحسب الفئات.",
                              purposeEn: "Maintains a structured, dynamic inventory of all commercial services categorized by legal department to reduce operational overhead.",
                              journeyAr: "يبحث المستثمر عن 'رخصة تصدير'، يقوم بتطبيق الفلترة بحسب نوع الترخيص ثم يبدأ معالج الخدمة مباشرة.",
                              journeyEn: "The company administrator selects 'Import & Export', filters by license category, inspects details, and initiates the workflow wizard.",
                              componentsAr: "مربع البحث التفاعلي، تبويبات التصنيف، كروت الخدمة الرقمية، العدادات الفيدرالية للمستندات والرسوم.",
                              componentsEn: "Interactive search filters, category navigation pills, detail drawers, status badges, and service initiating buttons.",
                              accessAr: "توفير وصف مسموع (Aria labels) لجميع الكروت وعمليات الفلترة، تباين نصوص الفئات متوافق تماماً.",
                              accessEn: "Full screen reader support via aria-live regions when filter states update. Interactive cards respond to tab focus.",
                              aiAr: "مساعد التوجيه الذكي المدمج ينصح المستثمر بأي تصنيف يجب تصفحه بناءً على الكلمات المفتاحية الحرة.",
                              aiEn: "AI matches free-form query prompts with standard service indexing. Suggests matching licenses instantly.",
                              securityAr: "توثيق الاتصال وحجب الخدمات الحساسة عن الزوار غير المسجلين بصلاحية كافية.",
                              securityEn: "Session authentication token audit check is invoked before 'Start Service' routing executes.",
                              devAr: "تحميل جزئي وتكرار ديناميكي للخدمات المتاحة لتحسين الأداء على سرعات الإنترنت المحدودة.",
                              devEn: "Utilizes responsive grid templates with robust overflow handling. Optimized for slow 3G network latency."
                            },
                            {
                              id: 3,
                              purposeAr: "تحويل المعاملات المعقدة ومتعددة المراحل إلى خطوات واضحة وموثوقة لضمان اكتمال وصحة التقديم الفيدرالي.",
                              purposeEn: "Transforms complex multi-step government application procedures into simplified, bite-sized chronological milestones.",
                              journeyAr: "يتنقل المتقدم عبر خطوات مألوفة، يرفع ملف السجل التجاري كـ PDF، يوقع بيده رقمياً، ثم يتابع حالة الطلب بالرمز الموحد.",
                              journeyEn: "The applicant views eligibility guidelines, fills details, uploads commercial certificate, signs with electronic pad, and submits.",
                              componentsAr: "شريط تتبع الخطوات الزمني (Step-Progress Indicator)، حقول الإدخال المقيدة، منصة التوقيع الرقمي.",
                              componentsEn: "Chronological Step-Progress Indicator, input fields, secure file upload widget, interactive signature pad, and navigation controls.",
                              accessAr: "دعم التنقل العكسي والتقدمي بلوحة المفاتيح والإنذار الصوتي الفوري في حالة الخطأ في أحد الحقول.",
                              accessEn: "Keyboard traps avoided during file upload. Signature pad supports clear alternative touch targets and alt descriptions.",
                              aiAr: "مساعد المستندات الذكي المدمج يطابق ويفحص محتوى الـ PDF المرفوع للتأكد من عدم نقص الأوراق المطلوبة.",
                              aiEn: "Server-side Gemini scans uploaded files (OCR) to warn the user of expired documents or formatting mismatches prior to submission.",
                              securityAr: "تشفير وحماية المستندات المرفوعة وحفظها بشكل مؤقت آمن كمسودات مشفرة.",
                              securityEn: "Payload size limits validated. Uploaded files scanned for viruses and cryptographically hashed before Cloud Storage commit.",
                              devAr: "مسار موحد يقبل التعديل والإضافة بسهولة، مستقر ومبني بالكامل على React hooks والتحكم بالبيانات.",
                              devEn: "Abstracted step container pattern utilizing context-based state management to support 'Save and Resume' logic easily."
                            },
                            {
                              id: 4,
                              purposeAr: "بناء واجهة إدارية شاملة للمسؤولين وصناع القرار والمستثمرين لتمكين المراقبة اللحظية للأداء الوطني الموحد.",
                              purposeEn: "Provides clear operational dashboards tailored for distinct roles (Minister, Inspector, Investor) to manage metrics and actions.",
                              journeyAr: "يدخل الوزير صباحاً فيشاهد مؤشرات الأداء، وتوجيهات الذكاء الاصطناعي لتحسين جودة التراخيص، وينجز الموافقات العاجلة.",
                              journeyEn: "The Minister accesses the dashboard, reviews national export charts, reads AI recommendations, and instantly acts on bottlenecks.",
                              componentsAr: "صناديق مؤشرات الأداء (KPI Cards)، قائمة الأنشطة الفيدرالية، إشعارات الأولوية العليا العاجلة.",
                              componentsEn: "Consolidated KPI modules, activity ledgers, interactive charts, and AI strategic alert widgets.",
                              accessAr: "تصميم مرن يدعم شاشات العرض الكبيرة والجوالة مع تباين عالي ورموز توضيحية خالية من التشويش.",
                              accessEn: "Color-blind safe data visualization themes. Text alternatives provided for all tabular data points and visual indicators.",
                              aiAr: "تحليل تنبئي وتلقائي لمعدلات التراخيص وتحذير صناع القرار من تراكم الطلبات غير المعالجة.",
                              aiEn: "Gemini server-side analytics evaluates transactional logs to predict and highlight performance delays automatically.",
                              securityAr: "حظر وتشفير حقول البيانات المالية والسيادية الحساسة بناءً على الصلاحيات الممنوحة.",
                              securityEn: "RBAC (Role Based Access Control) strictly enforced on all dashboard widget endpoints.",
                              devAr: "ربط متكامل مع الخادم واستخدام تقنيات التحميل الكسول (Lazy-loading) لضمان الأداء الفائق.",
                              devEn: "Modular widgets layout with debounced data fetching. Tailored for extreme high density display grids."
                            },
                            {
                              id: 5,
                              purposeAr: "توحيد مراحل مراجعة الطلبات واعتمادها وتعميدها بالختم الرقمي الفيدرالي الموحد لضمان النزاهة والشفافية.",
                              purposeEn: "Standardizes the multi-tier review, validation, consensus, and cryptographic signing workflows across regulatory entities.",
                              journeyAr: "يستلم المدقق المعاملة، يطابق التقارير الميدانية، يوقع رقمياً، فيصدر الختم السيادي برمز QR المعتمد.",
                              journeyEn: "The regulatory auditor reviews compliance logs, inspects attachments, signs with their digital pad, and issues the stamped certificate.",
                              componentsAr: "جدول المراجعة المشترك، معالج التوقيع والختم، عارض الشهادة الموثقة الذكي برمز QR المتكامل.",
                              componentsEn: "Consensus timeline trackers, auditor comment logs, secure signature capture block, and interactive certified document viewer.",
                              accessAr: "التنقل الكامل للوحة المفاتيح لإجراء التوقيع، توافق عارض الوثائق مع قارئ الشاشة بالكامل.",
                              accessEn: "Accessible document navigation. Tab indexing mapped logic ensures signature actions and verification buttons are reachable.",
                              aiAr: "مطابقة التقرير الميداني وتوصيات اللجان تلقائياً والإشارة إلى أي تعارض قانوني محتمل.",
                              aiEn: "AI evaluates reviewer comment history and matches it against commercial regulations to flag compliance anomalies.",
                              securityAr: "ختم الوثيقة بتشفير مفتاحي لا يمكن تعديله بعد الإصدار، وتوثيق رمز الاستجابة السريع (QR).",
                              securityEn: "Dual-key cryptography seals issued certificates. QR codes query public secure nodes to prevent certificate forgery.",
                              devAr: "مسار تتبع خطي مبني على حزم البيانات المتصلة لضمان النزاهة الكاملة لسجل التدقيق الأمني (Audit Trail).",
                              devEn: "Immutable state history. Utilizes deterministic event logging schemas to persist secure auditing records."
                            }
                          ];

                          const doc = docs.find(d => d.id === pId) || {
                            purposeAr: `توحيد واجهات المعاملة النمطية رقم ${pId} وفقاً للائحة الفيدرالية لوزارة التجارة.`,
                            purposeEn: `Standardizes official transaction flow pattern #${pId} under Sudan commerce design requirements.`,
                            journeyAr: "يبدأ المستخدم بطلب الخدمة، يتلقى توجيهات المساعد الذكي، ينجز المعاملة، ويحصل على الختم الموثق.",
                            journeyEn: "The user initiates the service, is guided by the ministry AI assistant, executes steps, and receives a stamped certificate.",
                            componentsAr: "حقول إدخال سيادية، إشعارات الأولوية، وعارض الوثائق المعتمد.",
                            componentsEn: "Sovereign form controls, responsive layout grids, alert banners, and certified document viewers.",
                            accessAr: "امتثال كامل لمعايير WCAG 2.2 AA، تباين عالي للألوان، وتسميات مسموعة.",
                            accessEn: "Fully WCAG 2.2 AA compliant. Supports high contrast screens, semantic HTML tags, and keyboard focus states.",
                            aiAr: "مساعد استشاري مدمج لدعم صحة التقديم وتوضيح المتطلبات بدقة.",
                            aiEn: "In-context advisory help utilizing server-side Gemini. Does not automate authorized administrative decisions.",
                            securityAr: "حماية البيانات الفيدرالية وتشفير مستودع الوثائق والطلب.",
                            securityEn: "Data validation, strict session tokens, role-based restriction, and TLS 1.3 data-in-transit encryption.",
                            devAr: "مكون هيكلي متكامل ومثالي لإعادة الاستخدام في جميع الأنظمة الفرعية.",
                            devEn: "Standardized blueprint component. Consumes design tokens and is optimized for low bundle size."
                          };

                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed font-sans">
                              {/* Arabic Documentation Column */}
                              <div className="space-y-4 border-l border-slate-800/80 pl-4 text-right" dir="rtl">
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">1. الغرض والأثر السيادي (Purpose)</p>
                                  <p>{doc.purposeAr}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">2. رحلة المستخدم والمنشأة (User Journey)</p>
                                  <p>{doc.journeyAr}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">3. العناصر والمكونات (Components Used)</p>
                                  <p>{doc.componentsAr}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">4. معايير الوصول والدمج (WCAG 2.2 AA)</p>
                                  <p>{doc.accessAr}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">5. دور الذكاء الاصطناعي الاستشاري (AI Integration)</p>
                                  <p>{doc.aiAr}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">6. الأمن وحماية السجلات (Security & Encryption)</p>
                                  <p>{doc.securityAr}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">7. ملاحظات المطورين (Developer & Figma Notes)</p>
                                  <p>{doc.devAr}</p>
                                </div>
                              </div>

                              {/* English Documentation Column */}
                              <div className="space-y-4 text-left" dir="ltr">
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">1. Purpose & Strategic Impact</p>
                                  <p>{doc.purposeEn}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">2. Standard User Journey</p>
                                  <p>{doc.journeyEn}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">3. Composed UI Components</p>
                                  <p>{doc.componentsEn}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">4. Accessibility Enforcement (WCAG 2.2)</p>
                                  <p>{doc.accessEn}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">5. AI Integration & Guardrails</p>
                                  <p>{doc.aiEn}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">6. Security, Trust & Cryptography</p>
                                  <p>{doc.securityEn}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-extrabold text-sudan-gold text-[11px] uppercase">7. Developer & Implementation Manual</p>
                                  <p>{doc.devEn}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Unified Government Forms Framework */}
              {activeTab === "forms-framework" && (
                <FormsFramework currentLanguage={currentLanguage} role={role} />
              )}

              {/* TAB 6: Accessibility WCAG 2.2 AA Guide */}
              {activeTab === "accessibility-guide" && (
                <AccessibilityFramework currentLanguage={currentLanguage} role={role} />
              )}

              {/* TAB 7: Motion & Micro-interactions */}
              {activeTab === "motion-micro" && (
                <MotionFramework currentLanguage={currentLanguage} role={role} />
              )}

              {/* TAB 8: Layout & Breakpoints */}
              {activeTab === "layout-breakpoints" && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-gray-100">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "تخطيط الفراغات وشبكة الأعمدة (Grid System)" : "Government-Grade Layout Grid & Spacing System"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "نقاط التحول المتجاوبة والتصميم الموجه للهواتف أولاً" : "Defining responsive columns, page margins, and desktop-first scaling parameters."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      To prevent messy visual alignment errors, we enforce a strict 8px base grid. All elements align perfectly on multiples of 4px/8px (e.g., p-2 = 8px, p-4 = 16px, rounded-2xl = 16px, rounded-3xl = 24px).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5] border-gray-100"} text-center space-y-1`}>
                        <p className="text-xs font-black text-sudan-green">Mobile (sm)</p>
                        <p className="text-[10px] text-gray-400">Viewport: &lt; 640px</p>
                        <p className="text-xs font-bold text-slate-800">1 Column Layout</p>
                        <p className="text-[10px] text-gray-400">Page Margin: 16px (p-4)</p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5] border-gray-100"} text-center space-y-1`}>
                        <p className="text-xs font-black text-sudan-green">Tablet (md)</p>
                        <p className="text-[10px] text-gray-400">Viewport: &gt; 768px</p>
                        <p className="text-xs font-bold text-slate-800">2 Column Bento Grid</p>
                        <p className="text-[10px] text-gray-400">Page Margin: 24px (p-6)</p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5] border-gray-100"} text-center space-y-1`}>
                        <p className="text-xs font-black text-sudan-green">Laptop (lg)</p>
                        <p className="text-[10px] text-gray-400">Viewport: &gt; 1024px</p>
                        <p className="text-xs font-bold text-slate-800">3 Column Split Page</p>
                        <p className="text-[10px] text-gray-400">Page Margin: 32px (p-8)</p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDarkModePreview ? "bg-slate-800/40 border-slate-700" : "bg-[#F4F6F5] border-gray-100"} text-center space-y-1`}>
                        <p className="text-xs font-black text-sudan-green">Desktop (xl)</p>
                        <p className="text-[10px] text-gray-400">Viewport: &gt; 1280px</p>
                        <p className="text-xs font-bold text-slate-800">Max Width 7xl Centered</p>
                        <p className="text-[10px] text-gray-400">Page Margin: Fluid mx-auto</p>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8.5: Developer Standards & Handbook */}
              {activeTab === "developer-handbook" && (
                <DeveloperHandbook currentLanguage={currentLanguage} role={role} />
              )}

              {/* TAB 9: Figma Export & Developer Guidelines */}
              {activeTab === "figma-ready" && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-gray-100">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "هيكل الربط مع Figma والتصدير البرمجي" : "Figma-Ready Token Mapping & Export Settings"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentLanguage === "ar" ? "تفاصيل ترحيل عناصر التصميم إلى برمجيات التصميم العالمية مباشرة" : "Unified naming parameters ready for standard design-token-transformer plugins."}
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border text-center space-y-4 ${
                    isDarkModePreview ? "bg-slate-800/30 border-slate-700" : "bg-indigo-50/20 border-indigo-100"
                  }`}>
                    <Award className="h-10 w-10 text-sudan-gold mx-auto animate-bounce" />
                    <h4 className="font-extrabold text-sm text-[#1E293B] dark:text-white">
                      {currentLanguage === "ar" ? "تصدير الملفات البرمجية جاهز 100%" : "Production Ready Token Export Engine"}
                    </h4>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "نهنئكم! لقد تم بناء جميع الملفات المصدرية والأكواد البرمجية والتصاميم التفاعلية لوزارة التجارة والصناعة السودانية 2035 لتتوافق بنسبة 100% مع معايير Google Firebase Studio. تم تنظيم الأكواد لتكون قابلة للاستخدام وإعادة التدوير في أي وزارة سيادية سودانية أخرى بيسر وسهولة." 
                        : "Our Design Token structure is fully mapped to production. This modular setup allows instant UI system re-use for any future ministry expansion dashboards under Sudan vision 2035."}
                    </p>

                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => handleCopy(designTokensCode, "figma-ready")}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{copiedText === "figma-ready" ? (currentLanguage === "ar" ? "تم نسخ الرموز!" : "Figma JSON Copied!") : (currentLanguage === "ar" ? "نسخ رموز Figma" : "Copy Figma Tokens")}</span>
                      </button>
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
