/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Accessibility, CheckCircle2, AlertTriangle, Volume2, Shield, 
  WifiOff, Cpu, RefreshCw, Layers, Keyboard, FileText, Settings,
  Eye, CornerDownLeft, EyeOff, BookOpen, Scale, Landmark, Sparkles,
  Users, Check, HelpCircle, ArrowRight, Download, FileSpreadsheet,
  AlertOctagon, Printer, CloudLightning, BadgeAlert, FileCheck
} from "lucide-react";

interface AccessibilityFrameworkProps {
  currentLanguage: "ar" | "en";
  role?: string;
}

// WCAG Checklist Type
interface ChecklistItem {
  id: string;
  category: "perceivable" | "operable" | "understandable" | "robust";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  codeAr: string;
  codeEn: string;
}

const WCAG_CHECKLIST: ChecklistItem[] = [
  {
    id: "contrast",
    category: "perceivable",
    titleAr: "التباين اللوني المحسن (4.5:1 للمتن، 3:1 للعنوان)",
    titleEn: "Enhanced Contrast (4.5:1 Body, 3:1 Headings)",
    descriptionAr: "ضمان نسبة تباين لا تقل عن 4.5:1 لجميع النصوص العادية لتمكين فاقدي حدة البصر من القراءة بوضوح.",
    descriptionEn: "Ensuring all text-to-background contrast ratios satisfy WCAG 2.2 AA ratios under high contrast and default modes.",
    codeAr: "المعيار 1.4.3",
    codeEn: "Success Criterion 1.4.3"
  },
  {
    id: "alt-text",
    category: "perceivable",
    titleAr: "البدائل النصية للوسائط غير النصية",
    titleEn: "Text Alternatives for Non-Text Content",
    descriptionAr: "توفير بطاقات بديلة (alt) ووصف تفصيلي للرسوم البيانية والمؤشرات لتمكين قارئات الشاشة من قراءتها.",
    descriptionEn: "Providing descriptive text tags for every graphical asset, icon button, and financial chart.",
    codeAr: "المعيار 1.1.1",
    codeEn: "Success Criterion 1.1.1"
  },
  {
    id: "keyboard-operable",
    category: "operable",
    titleAr: "التشغيل الكامل عبر لوحة المفاتيح دون فأرة",
    titleEn: "Full Keyboard Operability (Zero Mouse)",
    descriptionAr: "إتاحة تصفح المنصة وتنفيذ كافة المعاملات عبر مفاتيح Tab و Space و Enter بشكل منطقي ومتسلسل.",
    descriptionEn: "Ensuring all forms, buttons, dropdowns, and modules can be controlled strictly using standard keyboard inputs.",
    codeAr: "المعيار 2.1.1",
    codeEn: "Success Criterion 2.1.1"
  },
  {
    id: "focus-visible",
    category: "operable",
    titleAr: "مؤشر التركيز المرئي الواضح (Focus Outline)",
    titleEn: "Visible Focus State Indication",
    descriptionAr: "إبراز العنصر المحدد حالياً بإطار ذهبي متباين لا يقل سمكه عن 3 بكسل لمنع تشتت المستخدم البصري.",
    descriptionEn: "Never hide the browser outline style; style custom highly visible gold ring outlines for keyboard focus.",
    codeAr: "المعيار 2.4.7",
    codeEn: "Success Criterion 2.4.7"
  },
  {
    id: "plain-lang",
    category: "understandable",
    titleAr: "اللغة الحكومية البسيطة والواضحة (منع اللبس)",
    titleEn: "Plain Government Language (Readability)",
    descriptionAr: "استخدام صياغات خالية من التعقيد القانوني أو المصطلحات الصعبة لتبسيط الوصول لكبار السن.",
    descriptionEn: "Employing structural layout formats and vocabulary suitable for lower reading levels or foreign investors.",
    codeAr: "المعيار 3.1.5",
    codeEn: "Success Criterion 3.1.5"
  },
  {
    id: "error-prevention",
    category: "understandable",
    titleAr: "منع الأخطاء وتأكيد المعاملات السيادية",
    titleEn: "Error Prevention (Legal & Financial)",
    descriptionAr: "تمكين مراجعة وتعديل وحذف البيانات قبل الإرسال النهائي لطلبات الاستيراد أو السجل التجاري لتجنب الأخطاء الكارثية.",
    descriptionEn: "Allowing users to review, confirm, and revise entries before executing binding government transactions.",
    codeAr: "المعيار 3.3.4",
    codeEn: "Success Criterion 3.3.4"
  },
  {
    id: "robust-parsing",
    category: "robust",
    titleAr: "التوافقية التقنية وصياغة الأكواد القياسية",
    titleEn: "Standard Code Parsing & ARIA Handlers",
    descriptionAr: "تنظيم كود HTML الهيكلي بشكل سليم ليتناسب مع التقنيات المساعدة الحالية والمستقبلية وقارئات شاشات الهاتف.",
    descriptionEn: "Using pristine nesting, valid IDs, and appropriate WAI-ARIA roles to maintain solid compatibility with external assistance tools.",
    codeAr: "المعيار 4.1.1",
    codeEn: "Success Criterion 4.1.1"
  }
];

export const AccessibilityFramework: React.FC<AccessibilityFrameworkProps> = ({
  currentLanguage,
  role = "Government Motion & Accessibility Architect"
}) => {
  // Theme & Scaling States
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<1 | 1.25 | 1.5 | 2>(1);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);

  // Bandwidth & Hardware Simulator States
  const [simulatedBandwidth, setSimulatedBandwidth] = useState<"fast" | "rural-2g">("fast");
  const [offlineDraftSaved, setOfflineDraftSaved] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const [syncStatus, setSyncStatus] = useState<"synced" | "queued" | "idle">("idle");
  const [bandwidthLog, setBandwidthLog] = useState<string[]>([]);

  // Keyboard Tester States
  const [screenReaderLog, setScreenReaderLog] = useState<string>(
    currentLanguage === "ar" 
      ? "مرحبًا بك في لوحة اختبار قارئ الشاشة الفيدرالية. حدد أي عنصر تفاعلي بلوحة المفاتيح لقراءة وصفه البرمجي المخصص هنا."
      : "Welcome to the Federal Screen Reader Simulation Panel. Select any interactive element using Tab or click to view its descriptive vocal string."
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

  // Active Documentation Tab
  const [activeDocTab, setActiveDocTab] = useState<"design" | "dev" | "checklist" | "roadmap">("design");

  // Motor Accessibility Settings
  const [clickTargetSize, setClickTargetSize] = useState<"normal" | "accessible-xl">("normal");

  // AI Alternates State
  const [aiAnalysisType, setAiAnalysisType] = useState<"text" | "audio-sim">("text");
  const [isAudioSimulating, setIsAudioSimulating] = useState(false);

  // Simulating offline storage
  useEffect(() => {
    if (draftContent.length > 0) {
      setOfflineDraftSaved(true);
      setSyncStatus("queued");
      const logMsg = currentLanguage === "ar"
        ? `[سجل الشبكة] تم حفظ مسودة محلية للمستند في ذاكرة الجهاز المؤقتة. حجم البيانات: 0.8 كيلو بايت. حالة الإرسال: مؤجل لحين توفر اتصال أفضل.`
        : `[Network Log] Offline commercial draft saved to local indexed store. Size: 0.8 KB. Dispatch status: Queued for connection recovery.`;
      
      setBandwidthLog(prev => [logMsg, ...prev.slice(0, 4)]);
    } else {
      setOfflineDraftSaved(false);
      setSyncStatus("idle");
    }
  }, [draftContent, currentLanguage]);

  // Simulate remote connection recovery
  const triggerSync = () => {
    if (!offlineDraftSaved) return;
    setSyncStatus("synced");
    const logMsg = currentLanguage === "ar"
      ? `[سجل الشبكة] تم رصد اتصال مستقر! جاري ترحيل المسودات المخزنة محلياً لقاعدة البيانات المركزية بوزارة التجارة... تم المزامنة بنجاح!`
      : `[Network Log] Server signal restored! Syncing queued offline forms to the Ministry's secure centralized Spanner database... Synchronization Successful!`;
    setBandwidthLog(prev => [logMsg, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setDraftContent("");
      setOfflineDraftSaved(false);
      setSyncStatus("idle");
    }, 4000);
  };

  // Keyboard accessibility listeners for Focus Trapping in Modal Dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      // Escape key closes modal
      if (e.key === "Escape") {
        setIsModalOpen(false);
        modalTriggerRef.current?.focus();
        announceScreenReader(
          currentLanguage === "ar" 
            ? "تم إغلاق النافذة المنبثقة التفاعلية. تم إرجاع التركيز إلى زر فتح النافذة." 
            : "Sovereign dialog closed. Keyboard focus restored to the activation trigger."
        );
      }

      // Tab key focus trap loop
      if (e.key === "Tab") {
        const modalElement = document.getElementById("axs-focus-trap-dialog");
        if (modalElement) {
          const focusables = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
          const firstFocusable = focusables[0] as HTMLElement;
          const lastFocusable = focusables[focusables.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, currentLanguage]);

  // Screen reader announcer simulation helper
  const announceScreenReader = (text: string) => {
    setScreenReaderLog(text);
  };

  // Audio text to speech simulation
  const simulateAudioSpeech = () => {
    setIsAudioSimulating(true);
    announceScreenReader(
      currentLanguage === "ar"
        ? "[تشغيل الصوت] جاري قراءة التلخيص الرقمي: يبلغ معدل المطابقة السنوية للتراخيص الصناعية الفيدرالية في السودان لعام 2026 حوالي 94.8%، مع معالجة ما يقارب 1,540 معاملة تجارية نشطة."
        : "[Vocalizer Audio Output] Reading alternate chart narrative: The Sudan central industrial audit registers a total of 1,540 active commerce requests, reflecting a solid 94.8% compliance index."
    );
    setTimeout(() => {
      setIsAudioSimulating(false);
    }, 5000);
  };

  // Print function helper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="sovereign-accessibility-framework" 
      className={`space-y-6 ${highContrast ? "bg-black text-[#FFD700]" : "bg-white text-slate-800"}`}
      style={{ 
        fontSize: `${textScale === 1 ? "100" : textScale === 1.25 ? "120" : textScale === 1.5 ? "140" : "160"}%`,
        fontFamily: dyslexicFont ? "'Comic Sans MS', cursive, sans-serif" : "inherit"
      }}
    >
      
      {/* SOVEREIGN ACCESSIBILITY CONTROL PANEL HEADER */}
      <div className={`p-6 rounded-3xl border ${
        highContrast 
          ? "border-[#FFD700] bg-black" 
          : "bg-slate-50 border-gray-200"
      } relative overflow-hidden space-y-4`}>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-sudan-green/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                highContrast ? "bg-[#FFD700] text-black" : "bg-sudan-green/10 text-sudan-green"
              }`}>
                SGDS Accessibility Standard v2.2
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                highContrast ? "border border-[#FFD700] text-[#FFD700]" : "bg-slate-900 text-sudan-gold"
              }`}>
                WCAG 2.2 AA Verified
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">
              {currentLanguage === "ar" 
                ? "دليل ومنظومة الدمج الشامل وإتاحة الوصول" 
                : "Accessibility & Inclusive Experience Hub"}
            </h2>
            <p className="text-xs text-gray-400 max-w-4xl">
              {currentLanguage === "ar"
                ? "محاكي وتدريب برمجيات الوصول الفيدرالية لوزارة التجارة والصناعة السودانية. مواءمة معايير تباين الألوان، ميكانيكية لوحة المفاتيح الخالية من الفأرة، والعمل تحت النطاق الضعيف للشبكة بمرونة تامة."
                : "Interactive simulator and standards manual for the Ministry's digital portal, strictly aligned with WCAG 2.2 and optimization rules for low-end devices and rural connection profiles across Sudan."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handlePrint}
              aria-label="Generate tactile paper print optimized layout"
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-black cursor-pointer transition-all ${
                highContrast 
                  ? "border-[#FFD700] hover:bg-[#FFD700] hover:text-black" 
                  : "bg-white hover:bg-slate-100 border-gray-200 text-slate-700"
              }`}
            >
              <Printer className="h-4 w-4" />
              {currentLanguage === "ar" ? "نسخة مطبوعة للمطابقة" : "Tactile Print Layout"}
            </button>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS SHELF */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl border ${
          highContrast ? "border-[#FFD700] bg-[#111111]" : "bg-white border-gray-200"
        }`}>
          {/* Toggle High Contrast */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Contrast Assist</span>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                announceScreenReader(
                  highContrast 
                    ? "Normal contrast mode restored." 
                    : "High contrast mode active. Background color changed to solid black, all texts and interfaces mapped to high luminance yellow."
                );
              }}
              className={`w-full text-right ltr:text-left p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                highContrast 
                  ? "bg-[#FFD700] text-black border-[#FFD700]" 
                  : "bg-slate-50 hover:bg-slate-100 border-gray-150 text-slate-700"
              }`}
            >
              <span>{currentLanguage === "ar" ? "تباين عالي (أسود وذهبي)" : "High Contrast Mode"}</span>
              {highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>

          {/* Scale Text Size */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Scale Typography</span>
            <div className={`flex rounded-xl border p-1 ${highContrast ? "border-[#FFD700] bg-[#222]" : "bg-slate-50 border-gray-150"}`}>
              {([1, 1.25, 1.5, 2] as const).map(scale => (
                <button
                  key={scale}
                  onClick={() => {
                    setTextScale(scale);
                    announceScreenReader(
                      currentLanguage === "ar"
                        ? `تم تكبير نصوص المنصة إلى مستوى ${scale * 100} بالمائة.`
                        : `Interface typography scaled to ${scale * 100}% of the base system font.`
                    );
                  }}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    textScale === scale 
                      ? (highContrast ? "bg-[#FFD700] text-black" : "bg-slate-900 text-white")
                      : "text-gray-400 hover:text-slate-800"
                  }`}
                >
                  {scale}x
                </button>
              ))}
            </div>
          </div>

          {/* Dyslexia or Alternative Font */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Reading Aid</span>
            <button
              onClick={() => {
                setDyslexicFont(!dyslexicFont);
                announceScreenReader(
                  dyslexicFont 
                    ? "Standard DIN Next Arabic font loaded." 
                    : "Dyslexia-friendly structural font applied for improved text readability."
                );
              }}
              className={`w-full text-right ltr:text-left p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                dyslexicFont 
                  ? "bg-slate-900 text-white border-slate-900" 
                  : (highContrast ? "bg-black text-[#FFD700] border-[#FFD700]" : "bg-slate-50 hover:bg-slate-100 border-gray-150 text-slate-700")
              }`}
            >
              <span>{currentLanguage === "ar" ? "خط بسيط مريح للقراءة" : "Simple Dyslexic Font"}</span>
              <BookOpen className="h-4 w-4" />
            </button>
          </div>

          {/* Touch Target Expander */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Motor Target Shield</span>
            <button
              onClick={() => {
                const isXL = clickTargetSize === "accessible-xl";
                setClickTargetSize(isXL ? "normal" : "accessible-xl");
                announceScreenReader(
                  isXL 
                    ? "Buttons target boundaries set to standard responsive sizes (40px padding margins)." 
                    : "Motor Target expanded. All actionable buttons padded to 52px minimum height with tactile margins for senior citizens."
                );
              }}
              className={`w-full text-right ltr:text-left p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                clickTargetSize === "accessible-xl" 
                  ? "bg-sudan-green text-white border-sudan-green" 
                  : (highContrast ? "bg-black text-[#FFD700] border-[#FFD700]" : "bg-slate-50 hover:bg-slate-100 border-gray-150 text-slate-700")
              }`}
            >
              <span>{currentLanguage === "ar" ? "تكبير أزرار اللمس (كبار السن)" : "Enlarge Touch Targets"}</span>
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE COMPLIANCE TESTBED AND SIMULATORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPONENT: ACCESSIBLE FORM & SCREEN READER SIMULATOR (7 Cols) */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border flex flex-col justify-between gap-5 ${
          highContrast ? "border-[#FFD700] bg-black" : "bg-white border-gray-200"
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Simulated Assistive Workspace</span>
            <h3 className="text-sm font-black flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-sudan-green" />
              {currentLanguage === "ar" ? "1. محاكي لوحة المفاتيح وقارئات الشاشة" : "1. Focus Ring & Voice Reader Simulator"}
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" 
                ? "جرب التنقل بمفتاح Tab. يظهر كود القارئ الصوتي المدمج بالأسفل كلما حددت عنصراً تفاعلياً بشكل حي."
                : "Navigate the form using your Tab key. The screen reader feedback log simulates what screen readers vocalize."}
            </p>
          </div>

          {/* Simulated Interactive Form Frame */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            highContrast ? "border-[#FFD700] bg-[#111111]" : "bg-slate-50 border-gray-150"
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1 */}
              <div className="space-y-1.5">
                <label htmlFor="test-org-name" className="text-[10px] text-gray-400 font-extrabold uppercase flex justify-between">
                  <span>{currentLanguage === "ar" ? "الاسم التجاري المقترح" : "Proposed Trade Name"}</span>
                  <span className="text-red-500">* Required</span>
                </label>
                <input
                  id="test-org-name"
                  type="text"
                  placeholder={currentLanguage === "ar" ? "مثال: شركة النيل المحدودة" : "e.g. Nile Grains Ltd"}
                  onFocus={() => announceScreenReader(
                    currentLanguage === "ar"
                      ? "تركيز على حقل إدخال الاسم التجاري المقترح. حقل مطلوب للتعبئة. القيمة الحالية فارغة."
                      : "Focus: Proposed Trade Name input field. Mandatory entry. Current value is empty. Please enter your commercial identity name."
                  )}
                  className={`w-full text-xs p-3 rounded-xl border transition-all bg-white outline-hidden focus-visible:ring-4 focus-visible:ring-sudan-gold focus-visible:border-sudan-green ${
                    highContrast ? "border-[#FFD700] text-black font-black" : "border-gray-200 text-slate-800"
                  }`}
                  style={{ minHeight: clickTargetSize === "accessible-xl" ? "52px" : "40px" }}
                />
              </div>

              {/* Field 2 */}
              <div className="space-y-1.5">
                <label htmlFor="test-license-select" className="text-[10px] text-gray-400 font-extrabold uppercase">
                  {currentLanguage === "ar" ? "نوع الترخيص الصناعي" : "Industrial License Type"}
                </label>
                <select
                  id="test-license-select"
                  onFocus={() => announceScreenReader(
                    currentLanguage === "ar"
                      ? "تركيز على قائمة الخيارات المنسدلة لنوع الترخيص الفيدرالي. الخيار المحدد حالياً: تصنيع غذائي."
                      : "Focus: Industrial License Type dropdown menu. Interactive element. Current selection is food processing. Use arrow keys to select other categories."
                  )}
                  className={`w-full text-xs p-3 rounded-xl border transition-all bg-white outline-hidden focus-visible:ring-4 focus-visible:ring-sudan-gold focus-visible:border-sudan-green ${
                    highContrast ? "border-[#FFD700] text-black font-black" : "border-gray-200 text-slate-800"
                  }`}
                  style={{ minHeight: clickTargetSize === "accessible-xl" ? "52px" : "40px" }}
                >
                  <option value="food">{currentLanguage === "ar" ? "الصناعات الغذائية والتعبئة" : "Food Industries & Packaging"}</option>
                  <option value="textile">{currentLanguage === "ar" ? "صناعة الغزل والمنسوجات" : "Cotton & Textiles spinning"}</option>
                  <option value="chemical">{currentLanguage === "ar" ? "الكيماويات والمواد العضوية" : "Chemicals & Organic Fertilizers"}</option>
                </select>
              </div>
            </div>

            {/* Simulated accessible checkbox */}
            <div className="flex items-center gap-3">
              <input
                id="test-terms-chk"
                type="checkbox"
                onFocus={() => announceScreenReader(
                  currentLanguage === "ar"
                    ? "تركيز على مربع الاختيار: أقر بمطابقة شروط حماية البيئة الصناعية لوزارة الصحة. الحالة الحالية: غير محدد. اضغط مفتاح مسافة لتحديده."
                    : "Focus: Verification checkbox. 'I certify compliance with federal environmental safety acts.' Status: Unchecked. Press spacebar to toggle validation state."
                )}
                className={`h-5 w-5 accent-sudan-green cursor-pointer focus-visible:ring-4 focus-visible:ring-sudan-gold outline-hidden ${
                  highContrast ? "border-2 border-[#FFD700]" : "border-gray-200"
                }`}
              />
              <label htmlFor="test-terms-chk" className="text-xs text-gray-400 font-bold">
                {currentLanguage === "ar" 
                  ? "أقر بمطابقة شروط حماية البيئة الصناعية والصحة العامة السودانية لعام 2026."
                  : "I certify absolute compliance with Sudan Federal Environmental Safety Acts of 2026."}
              </label>
            </div>

            {/* Action buttons inside form */}
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <button
                ref={modalTriggerRef}
                onClick={() => {
                  setIsModalOpen(true);
                  setTimeout(() => modalCloseBtnRef.current?.focus(), 150);
                  announceScreenReader(
                    currentLanguage === "ar"
                      ? "تم فتح النافذة المنبثقة التفاعلية. التركيز منقول حالياً بالكامل لداخل النافذة لحماية تدفق لوحة المفاتيح. زر الإغلاق محدد."
                      : "Sovereign dialog modal activated. Focus trap is engaged inside this frame. Closing button is now highlighted. Press Escape to return to source."
                  );
                }}
                onFocus={() => announceScreenReader(
                  currentLanguage === "ar"
                    ? "زر: مراجعة الدليل الفيدرالي لسهولة الاستخدام. زر تفاعلي يفتح نافذة منبثقة مستقلة مع قفل للتركيز البصري."
                    : "Focus: View Federal Usability Standards button. Interactive control that launches an overlays dialog with strict focus trap."
                )}
                className={`px-4 py-2 text-xs font-black rounded-xl border cursor-pointer transition-all focus-visible:ring-4 focus-visible:ring-sudan-gold outline-hidden ${
                  highContrast 
                    ? "border-[#FFD700] hover:bg-[#FFD700] hover:text-black text-[#FFD700]" 
                    : "bg-white text-slate-700 hover:bg-slate-100 border-gray-150"
                }`}
                style={{ minHeight: clickTargetSize === "accessible-xl" ? "52px" : "40px" }}
              >
                {currentLanguage === "ar" ? "قفل التركيز (Modal Dialog)" : "Test Focus Trap (Modal)"}
              </button>

              <button
                onClick={() => {
                  announceScreenReader(
                    currentLanguage === "ar"
                      ? "تم إرسال الطلب بنجاح لقاعدة بيانات الوزارة. معرف المعاملة: SD-MCI-CR-29403."
                      : "Action executed: Commercial register request successfully transferred. Ref ID: SD-MCI-CR-29403."
                  );
                }}
                onFocus={() => announceScreenReader(
                  currentLanguage === "ar"
                    ? "زر إرسال: اعتماد السجل التجاري الموحد. اضغط Enter لإرسال الطلب بشكل سيادي آمن."
                    : "Focus: Dispatch commercial registration request. Action button. Press Enter to submit digital credentials securely."
                )}
                className={`px-6 py-2 text-xs font-black rounded-xl cursor-pointer transition-all focus-visible:ring-4 focus-visible:ring-sudan-gold outline-hidden ${
                  highContrast 
                    ? "bg-[#FFD700] text-black hover:bg-white" 
                    : "bg-sudan-green hover:bg-sudan-green-light text-white shadow-xs"
                }`}
                style={{ minHeight: clickTargetSize === "accessible-xl" ? "52px" : "40px" }}
              >
                {currentLanguage === "ar" ? "إرسال البيانات الفيدرالية" : "Submit Federal Request"}
              </button>
            </div>
          </div>

          {/* SCREEN READER VOICE OUTPUT LOGGER (LIVE SIMULATOR) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase flex items-center gap-1">
                <Volume2 className="h-4 w-4 animate-pulse text-sudan-gold" />
                {currentLanguage === "ar" ? "المخرجات اللفظية لقارئ الشاشة (ARIA Output)" : "ARIA Screen Reader Audio Vocalizer Log"}
              </span>
              <button 
                onClick={() => setScreenReaderLog(
                  currentLanguage === "ar" 
                    ? "تم مسح السجل الفيدرالي. حدد أي عنصر آخر للبدء." 
                    : "Audio log cleared. Navigate to interactive elements to vocalize tags."
                )}
                className="text-[9px] font-bold text-gray-400 hover:text-slate-800 underline"
              >
                Clear Log
              </button>
            </div>

            <div className={`p-4 rounded-xl border font-mono text-xs relative overflow-hidden ${
              highContrast 
                ? "border-[#FFD700] bg-black text-[#FFD700]" 
                : "bg-slate-900 text-gray-200 border-slate-800 shadow-inner"
            }`}>
              <div className="absolute top-2 right-2 text-[8px] bg-slate-800 text-sudan-gold px-1.5 py-0.5 rounded font-bold tracking-wider">
                SPEECH ENGINE OUTPUT
              </div>
              <p className="leading-relaxed pt-2 text-right ltr:text-left">
                {screenReaderLog}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: SUDAN LOW-BANDWIDTH & DEVICE RESILIENCE RESCUE (5 Cols) */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border flex flex-col justify-between gap-5 ${
          highContrast ? "border-[#FFD700] bg-black" : "bg-white border-gray-200"
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Sudan Infrastructure Guard</span>
            <h3 className="text-sm font-black flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-sudan-gold" />
              {currentLanguage === "ar" ? "2. معالجة انقطاع الإشارة وبطء الشبكة" : "2. Network Speed & Offline Resilience"}
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar"
                ? "كيف تتصرف المنصة بذكاء مع أصحاب الاتصال الريفي أو شبكات الجيل الثاني (2G)."
                : "Dynamic offline saving, progressive loads, and sync ledger for low-connectivity environments."}
            </p>
          </div>

          {/* Toggle Bandwidth Type */}
          <div className="flex gap-2 p-1.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <button
              onClick={() => {
                setSimulatedBandwidth("fast");
                const msg = currentLanguage === "ar" 
                  ? "تم تبديل حالة المحاكي إلى شبكة فايبر ألياف سريعة. جاري تفعيل الميزات الكاملة." 
                  : "Bandwidth changed to stable fiber optic fast connection. Full visual elements enabled.";
                setBandwidthLog(prev => [msg, ...prev.slice(0, 4)]);
              }}
              className={`flex-1 py-1.5 text-xs font-black rounded-xl cursor-pointer transition-all ${
                simulatedBandwidth === "fast" 
                  ? "bg-slate-950 text-white" 
                  : "text-gray-400 hover:text-slate-800"
              }`}
            >
              Fiber/4G Fast
            </button>
            <button
              onClick={() => {
                setSimulatedBandwidth("rural-2g");
                const msg = currentLanguage === "ar" 
                  ? "تم تبديل حالة المحاكي إلى شبكة الجيل الثاني الضعيفة (Rural 2G). تم إيقاف الصور والصوت التلقائي، وتفعيل التخزين الاحتياطي المسبق للمسودات لضمان عدم ضياع أي كلمة يكتبها المواطن." 
                  : "Sovereign Low-Bandwidth (2G) Guard active. Asset compressed, sound payloads disabled, and robust auto-draft persistence enabled.";
                setBandwidthLog(prev => [msg, ...prev.slice(0, 4)]);
              }}
              className={`flex-1 py-1.5 text-xs font-black rounded-xl cursor-pointer transition-all ${
                simulatedBandwidth === "rural-2g" 
                  ? "bg-amber-600 text-white" 
                  : "text-gray-400 hover:text-slate-800"
              }`}
            >
              Rural 2G/3G Guard
            </button>
          </div>

          {/* Simulator Visual Interface */}
          <div className={`p-4 rounded-2xl border space-y-4 ${
            highContrast ? "border-[#FFD700] bg-[#111111]" : "bg-slate-50 border-gray-150"
          }`}>
            
            {/* Visual Indicators */}
            {simulatedBandwidth === "fast" ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-sudan-green p-3 rounded-xl text-xs">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-extrabold">منظومة الاتصال السريعة والكاملة</p>
                  <p className="text-[10px] text-gray-500">تم تفعيل جميع حزم البيانات والتحديث المباشر للمؤشرات التجارية.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs">
                <CloudLightning className="h-5 w-5 shrink-0 text-amber-600 animate-pulse" />
                <div className="space-y-0.5">
                  <p className="font-extrabold text-amber-900">وضع توفير البيانات وحماية المدخلات نشط</p>
                  <p className="text-[10px] text-amber-700">تم إيقاف الملحقات غير الهامة لتوفير 84% من باقة الاتصال.</p>
                </div>
              </div>
            )}

            {/* Offline Draft Interactive Box */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="test-sync-txt" className="font-extrabold text-slate-700">
                  {currentLanguage === "ar" ? "كتابة وثيقة الاستيراد الفيدرالية (تخزين فوري):" : "Write export details (Auto-saves Offline):"}
                </label>
                {syncStatus === "queued" && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">
                    Queued Offline
                  </span>
                )}
                {syncStatus === "synced" && (
                  <span className="bg-[#007A33]/10 text-sudan-green text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                    Synced Live
                  </span>
                )}
              </div>
              
              <textarea
                id="test-sync-txt"
                rows={3}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder={currentLanguage === "ar" ? "اكتب هنا لتلاحظ التخزين المؤقت الفوري في متصفحك دون اتصال بالإنترنت..." : "Type here to see immediate local draft auto-saving without server signal..."}
                className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sudan-gold focus:border-sudan-green outline-hidden"
              />
            </div>

            {/* Sync Recovery Trigger */}
            {offlineDraftSaved && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={triggerSync}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`h-4 w-4 ${syncStatus === "synced" ? "animate-spin text-sudan-gold" : ""}`} />
                {currentLanguage === "ar" ? "رصد إشارة الشبكة ومزامنة البيانات الآن" : "Simulate Connection Recovery & Sync"}
              </motion.button>
            )}
          </div>

          {/* Infrastructure Console Logs */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-gray-400 font-black uppercase">Infrastructure Signal Monitor</span>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-[10px] font-mono text-gray-400 space-y-1 max-h-24 overflow-y-auto shadow-inner leading-relaxed">
              {bandwidthLog.length === 0 ? (
                <p className="text-gray-600">[Console Idle] No signal events triggered yet.</p>
              ) : (
                bandwidthLog.map((log, idx) => (
                  <p key={idx} className={log.includes("restored") || log.includes("مزامنة") ? "text-sudan-green" : "text-amber-500"}>
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADDITIONAL ACCESSIBILITY COMPONENT: AI ACCESSIBILITY & TEXT SUMMARY ALTERNATIVE */}
      <div className={`p-6 rounded-3xl border ${
        highContrast ? "border-[#FFD700] bg-black" : "bg-white border-gray-200"
      } space-y-4`}>
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center flex-wrap gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-[#007A33] font-black uppercase">Cognitive alt & smart helpers</span>
            <h3 className="text-sm font-black flex items-center gap-1.5">
              <Cpu className="h-5 w-5 text-sudan-gold" />
              {currentLanguage === "ar" ? "3. التلخيص الذكي للبيانات المعقدة ومخرجات الذكاء الاصطناعي" : "3. Visual alt Narratives & Smart Cognitive Summaries"}
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar"
                ? "توفير ترجمة بديلة وتفصيل نصي للمخططات المالية المعقدة والرموز الصناعية لكبار السن أو المصابين بصعوبات بصرية."
                : "Transform complex commercial charts and administrative jargon into clear human alternatives."}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setAiAnalysisType("text")}
              className={`px-3 py-1 text-xs font-bold rounded-xl cursor-pointer ${
                aiAnalysisType === "text"
                  ? "bg-slate-900 text-white"
                  : "text-gray-400 hover:text-slate-800"
              }`}
            >
              Text Alternate
            </button>
            <button
              onClick={() => setAiAnalysisType("audio-sim")}
              className={`px-3 py-1 text-xs font-bold rounded-xl cursor-pointer ${
                aiAnalysisType === "audio-sim"
                  ? "bg-slate-900 text-white"
                  : "text-gray-400 hover:text-slate-800"
              }`}
            >
              Speech Output Simulator
            </button>
          </div>
        </div>

        {/* Dynamic Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Chart Display Graphic Alternative Mock */}
          <div className="lg:col-span-5 p-4 bg-slate-950 text-white rounded-2xl border border-slate-900 space-y-3 relative overflow-hidden h-44 flex flex-col justify-between">
            <div className="absolute top-2 left-2 text-[9px] text-gray-400 font-mono">Live Industrial License Trends</div>
            <div className="flex items-end justify-between h-20 px-4 pt-4 border-b border-slate-800">
              <div className="w-8 bg-[#007A33] rounded-t-md h-[40%]" />
              <div className="w-8 bg-[#007A33] rounded-t-md h-[70%]" />
              <div className="w-8 bg-sudan-gold rounded-t-md h-[95%]" />
              <div className="w-8 bg-[#007A33]/50 rounded-t-md h-[30%]" />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3 (Peak)</span>
              <span>Q4</span>
            </div>
          </div>

          {/* AI Alternates Narrative output box */}
          <div className="lg:col-span-7 space-y-3">
            {aiAnalysisType === "text" ? (
              <div className={`p-4 rounded-2xl border space-y-2 ${
                highContrast ? "border-[#FFD700] bg-[#111]" : "bg-emerald-50/20 border-[#007A33]/10"
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#007A33]">
                  <Sparkles className="h-4 w-4 text-sudan-gold" />
                  <span>{currentLanguage === "ar" ? "الوصف النصي المساعد للرسم البياني (منشأ ذكياً):" : "AI Generated Alternative Chart Text Description:"}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {currentLanguage === "ar"
                    ? "يوضح هذا المخطط العمودي عدد التراخيص الصناعية الفيدرالية المعتمدة لعام 2026. يظهر المخطط ارتفاعاً تدريجياً ملحوظاً يبدأ من 40% في الربع الأول ليصل لأعلى نقطة تصديرية بنسبة 95% في الربع الثالث بفضل تفعيل منظومة السجل التجاري الفيدرالي الموحد، ثم انخفاض موسمي طفيف في الربع الأخير."
                    : "Graphic description: This chart visualizes Approved Industrial Licenses for 2026. Data trends demonstrate steady expansion starting at 40% in Q1, accelerating to an industrial peak of 95% in Q3 due to unified commercial registry portal launches, followed by a minor seasonal dip to 30% in Q4."}
                </p>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border text-center space-y-4 ${
                highContrast ? "border-[#FFD700] bg-[#111]" : "bg-slate-50 border-gray-150"
              }`}>
                <p className="text-xs text-gray-400">
                  {currentLanguage === "ar"
                    ? "انقر لتفعيل القراءة الصوتية الاصطناعية المساعدة للنصوص الطويلة وكبار السن."
                    : "Activate simulated acoustic screen-reading narration for senior citizens and visual-assist profiles."}
                </p>
                <button
                  onClick={simulateAudioSpeech}
                  disabled={isAudioSimulating}
                  className="px-6 py-2.5 bg-sudan-dark text-slate-900 hover:bg-sudan-dark/80 disabled:opacity-40 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Volume2 className={`h-4 w-4 ${isAudioSimulating ? "animate-bounce text-sudan-gold" : ""}`} />
                  {isAudioSimulating ? (currentLanguage === "ar" ? "جاري التحدث..." : "Narration Active...") : (currentLanguage === "ar" ? "تشغيل القارئ الصوتي" : "Play Text Narration")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CORE ENTERPRISE DOCUMENTATION HUB */}
      <div className={`p-6 rounded-3xl border ${
        highContrast ? "border-[#FFD700] bg-black" : "bg-white border-gray-200 shadow-xs"
      } space-y-6`}>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-100 pb-3 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Official Ministry Governance Manual</span>
            <h3 className="text-sm font-black flex items-center gap-2">
              <Landmark className="h-4 w-4 text-sudan-green" />
              {currentLanguage === "ar" ? "4. دليل الدمج الشامل ولوائح الالتزام المؤسسي" : "4. Ministry Inclusive Experience Regulations & Standards"}
            </h3>
          </div>

          {/* Doc sub tabs */}
          <div className={`flex gap-1.5 p-1 rounded-xl border ${highContrast ? "border-[#FFD700] bg-black" : "bg-slate-50 border-gray-100"}`}>
            {[
              { id: "design", labelAr: "التصميم الشامل", labelEn: "Inclusive Design" },
              { id: "dev", labelAr: "دليل المطورين", labelEn: "Developer Manual" },
              { id: "checklist", labelAr: "جدول WCAG", labelEn: "WCAG Checklist" },
              { id: "roadmap", labelAr: "خريطة التطوير", labelEn: "Roadmap" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDocTab(tab.id as any)}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
                  activeDocTab === tab.id
                    ? (highContrast ? "bg-[#FFD700] text-black" : "bg-[#007A33] text-white")
                    : "text-gray-400 hover:text-slate-700"
                }`}
              >
                {currentLanguage === "ar" ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Doc Content */}
        <div className="space-y-4">
          {activeDocTab === "design" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-sudan-green uppercase tracking-wider">
                  {currentLanguage === "ar" ? "قوانين التباين والألوان السيادية (Visual Design)" : "Sovereign Contrast & Visual Alignment Standards"}
                </h4>
                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4 rtl:pl-0 rtl:pr-4">
                  <li><strong>Luminance Guarantee</strong>: Never communicate vital administrative status (Approve, Reject, Warning) with color alone. Pair color shifts with textual indicators or explicit icons.</li>
                  <li><strong>Contrast Ratio</strong>: Standard text maintains a 4.5:1 ratio against light canvas off-whites. Custom system alerts (Red/Green) are reinforced with dark charcoal backgrounds to prevent visual bleed.</li>
                  <li><strong>Linguistic Balance</strong>: When using DIN Next Arabic, enforce 15% larger line-height than English default files to ensure Arabic diacritics (tashkeel) do not clip.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-sudan-gold uppercase tracking-wider">
                  {currentLanguage === "ar" ? "تصاميم كبار السن وحركات اليد المحدودة (Inclusive UX)" : "Senior-Citizen & Motor Experience UX Specifications"}
                </h4>
                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4 rtl:pl-0 rtl:pr-4">
                  <li><strong>Target Shields</strong>: Interactive touch zones satisfy a 48px square standard, expandable to 52px when Senior Mode is triggered.</li>
                  <li><strong>No Drag-Only Hurdles</strong>: Every sliding widget or checklist order re-arranging tool must offer simple side-by-side click/tap alternative button controls.</li>
                  <li><strong>Clear Cognitive Steps</strong>: Forms break multi-field structures into bite-sized steps with visible progress counters to preserve user focus.</li>
                </ul>
              </div>
            </div>
          )}

          {activeDocTab === "dev" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded-xl space-y-2 text-[11px] font-mono text-gray-300">
                  <p className="text-sudan-gold font-bold">// 1. Proper Screen Reader Landmark Nesting</p>
                  <pre className="overflow-x-auto max-h-40 leading-relaxed">
{`<main id="main-content" role="main">
  <nav aria-label="Sovereign Trade Navigation">
    <ul>...</ul>
  </nav>
  
  <section aria-labelledby="form-heading">
    <h2 id="form-heading">Industrial License</h2>
    <form>...</form>
  </section>
</main>`}
                  </pre>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl space-y-2 text-[11px] font-mono text-gray-300">
                  <p className="text-sudan-gold font-bold">// 2. ARIA Live Regions for Status Updates</p>
                  <pre className="overflow-x-auto max-h-40 leading-relaxed">
{`<div 
  aria-live="polite" 
  aria-atomic="true" 
  className="sr-only"
>
  {/* Screen readers announce this string on update */}
  {syncStatus === "synced" 
    ? "Draft data synchronized with server." 
    : "Data queued locally."}
</div>`}
                  </pre>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic">
                {currentLanguage === "ar"
                  ? "ملاحظة للمبرمجين: تجنب استخدام سمة tabindex بقيم أكبر من 0 لأنها تسبب تشتت خط سير لوحة المفاتيح الافتراضي وتفسد تجربة ذوي الهمم."
                  : "Developer Pro-tip: Avoid values of tabindex greater than 0. Rely strictly on logical visual DOM element ordering to maintain predictable screen navigation flow."}
              </p>
            </div>
          )}

          {activeDocTab === "checklist" && (
            <div className="space-y-3">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase">WCAG 2.2 AA Compliance Audit Register</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WCAG_CHECKLIST.map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl border space-y-2 ${
                    highContrast ? "border-[#FFD700] bg-black text-[#FFD700]" : "bg-slate-50 border-gray-150"
                  }`}>
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        item.category === "perceivable" ? "bg-blue-100 text-blue-800" :
                        item.category === "operable" ? "bg-emerald-100 text-emerald-800" :
                        item.category === "understandable" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {item.category}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400 font-extrabold">{currentLanguage === "ar" ? item.codeAr : item.codeEn}</span>
                    </div>
                    <p className="text-xs font-black text-slate-800">{currentLanguage === "ar" ? item.titleAr : item.titleEn}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{currentLanguage === "ar" ? item.descriptionAr : item.descriptionEn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDocTab === "roadmap" && (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-sudan-green uppercase tracking-wider">
                {currentLanguage === "ar" ? "خطة تمكين الوصول والدمج للوزارة (2026 - 2028)" : "Ministry Long-Term Digital Inclusion Roadmap (2026 - 2028)"}
              </h4>
              <div className="space-y-3 relative border-l border-gray-200 ml-4 rtl:border-l-0 rtl:border-r rtl:mr-4 rtl:ml-0 pl-4 rtl:pr-4">
                {[
                  { q: "Q3 2026", tAr: "توحيد هويات الـ ARIA وقوالب الاستمارات", tEn: "Unified ARIA Schemas & Smart Form Blueprints", dAr: "إنشاء مكتبة موحدة للترميز المساعد لجميع بوابات الاستيراد والتصدير.", dEn: "Enforcing static type testing for accessibility elements across all Ministry trade nodes." },
                  { q: "Q4 2026", tAr: "منظومة المطابقة والتوثيق بالنطق الصوتي الكامل", tEn: "Full Text-to-Speech Portal Audits & OCR Verification", dAr: "دعم القراءة الصوتية لشهادات السجل التجاري المطبوعة عبر رموز الـ QR.", dEn: "OCR certified document generation producing fully structural screen-reader compatible PDFs." },
                  { q: "Q2 2027", tAr: "منظومة الاستشارة الذكية الشاملة لسهولة الوصول", tEn: "Subnational Rural Low-Signal Testing & Offline Ledger", dAr: "اختبار البوابات ميدانياً في ولايات السودان المختلفة مع مشغلي شبكات الاتصالات المحلية.", dEn: "Field trials deploying ultra-low bandwidth configurations for remote agricultural commerce." }
                ].map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[21px] rtl:-right-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#007A33] border-2 border-white" />
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-sudan-gold">{step.q}</span>
                      <span className="text-xs font-extrabold text-slate-800">{currentLanguage === "ar" ? step.tAr : step.tEn}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{currentLanguage === "ar" ? step.dAr : step.dEn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL ACCESSIBILITY DIALOG SIMULATOR OVERLAY */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            id="axs-focus-trap-dialog-container"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          >
            <motion.div
              id="axs-focus-trap-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="axs-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`max-w-md w-full p-6 rounded-3xl border shadow-xl relative space-y-4 ${
                highContrast ? "bg-black text-[#FFD700] border-[#FFD700]" : "bg-white text-slate-800 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sudan-green" />
                  <h4 id="axs-modal-title" className="text-sm font-black">
                    {currentLanguage === "ar" ? "معيار قفل التركيز البصري الفيدرالي" : "Federal Dialog Focus Trap"}
                  </h4>
                </div>
                <span className="text-[9px] bg-slate-900 text-sudan-gold px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  WCAG SC 2.4.3
                </span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {currentLanguage === "ar"
                  ? "يرجى الضغط على مفتاح Tab للتأكد من أن مؤشر التحديد يتنقل حصرياً بين عناصر هذه النافذة فقط (الزر والروابط أدناه) دون الخروج للخلفية، كما يمكنك الضغط على Escape لإغلاقها."
                  : "Verify that navigating with the keyboard Tab key cycles focus exclusively between the interactive elements inside this dialog frame. Pressing Escape will dismiss this window instantly."}
              </p>

              {/* Form Input inside dialog */}
              <div className="space-y-1">
                <label htmlFor="modal-test-input" className="text-[10px] text-gray-400 font-bold block uppercase">Representative ID</label>
                <input
                  id="modal-test-input"
                  type="text"
                  placeholder="SDMCI-REP-94"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-sudan-gold focus:border-sudan-green outline-hidden"
                />
              </div>

              {/* Action buttons inside dialog */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  ref={modalCloseBtnRef}
                  onClick={() => {
                    setIsModalOpen(false);
                    modalTriggerRef.current?.focus();
                    announceScreenReader(
                      currentLanguage === "ar"
                        ? "تم إغلاق نافذة قفل التركيز بنجاح. تم إعادة تحديد زر الفتح الأصلي."
                        : "Focus trap dialog dismissed. Keyboard alignment successfully returned to trigger button."
                    );
                  }}
                  className={`px-4 py-2 text-xs font-black rounded-xl border cursor-pointer focus-visible:ring-4 focus-visible:ring-sudan-gold outline-hidden ${
                    highContrast 
                      ? "border-[#FFD700] text-[#FFD700]" 
                      : "bg-white text-slate-700 hover:bg-slate-100 border-gray-200"
                  }`}
                >
                  {currentLanguage === "ar" ? "إغلاق النافذة" : "Close Dialog"}
                </button>

                <button
                  onClick={() => {
                    announceScreenReader(
                      currentLanguage === "ar"
                        ? "تم تسجيل الدخول كممثل معتمد في سجلات الوزارة."
                        : "Success: Verified as legal ministry representative ID SDMCI-REP-94."
                    );
                  }}
                  className={`px-5 py-2 text-xs font-black rounded-xl cursor-pointer focus-visible:ring-4 focus-visible:ring-sudan-gold outline-hidden ${
                    highContrast
                      ? "bg-[#FFD700] text-black"
                      : "bg-[#007A33] text-white hover:bg-sudan-green-light"
                  }`}
                >
                  {currentLanguage === "ar" ? "تأكيد الهوية" : "Verify ID"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
