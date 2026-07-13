/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { 
  Zap, Play, RotateCcw, Copy, Check, Info, ShieldAlert, CheckCircle2, 
  Sparkles, AlertTriangle, Eye, EyeOff, LayoutList, RefreshCw, 
  FileCheck, Layers, Award, Shield, UserCheck, ArrowRight, HelpCircle, 
  FileText, Touchpad, HelpCircle as HelpIcon, Sliders, Settings, 
  Accessibility, Terminal, CheckSquare, ListTodo, Download, ChevronRight,
  ChevronDown, Cpu, Sparkle
} from "lucide-react";
import { SovereignTypography, SovereignButton, SovereignBadge, SovereignDivider } from "./atoms";

interface MotionFrameworkProps {
  currentLanguage: "ar" | "en";
  role?: string;
}

// Cubic bezier preset values
const EASING_PRESETS = [
  {
    id: "sovereign-calm",
    nameAr: "الهدوء السيادي (تسارع سلس)",
    nameEn: "Sovereign Calm (Formal)",
    bezier: [0.16, 1, 0.3, 1], // Custom cubic-bezier
    framerTransition: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.6 },
    descriptionAr: "المنحنى الافتراضي للمعاملات الرسمية. حركات هادئة ومتزنة تعطي إحساساً بالهيبة والوقار والمصداقية.",
    descriptionEn: "Primary curve for government operations. Smooth, calm deceleration reinforcing stability and authority."
  },
  {
    id: "urgent-action",
    nameAr: "الإجراء السريع (التحذيرات)",
    nameEn: "Urgent Action (Alerts)",
    bezier: [0.25, 1, 0.5, 1],
    framerTransition: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.25 },
    descriptionAr: "منحنى سريع وخاطف لتنبيهات النظام، الحالات الطارئة ومحاولات الوصول غير المصرح بها.",
    descriptionEn: "Swift, responsive curve for system notifications, real-time validations, and unauthorized access alerts."
  },
  {
    id: "micro-spring",
    nameAr: "النابض العضوي (التفاعلات البسيطة)",
    nameEn: "Organic Spring (Tactile)",
    bezier: null, // Spring-based
    framerTransition: { type: "spring", stiffness: 380, damping: 22, mass: 0.8 },
    descriptionAr: "تجاوب طبيعي نابض للأزرار والبطاقات يعطي شعوراً مادياً ممتعاً بالضغط واللمس الجسدي.",
    descriptionEn: "Highly interactive spring response for micro-actions, simulating realistic physical button mechanics."
  },
  {
    id: "linear",
    nameAr: "الحركة الميكانيكية (الخيار الافتراضي المتساوي)",
    nameEn: "Mechanical Linear",
    bezier: [0, 0, 1, 1],
    framerTransition: { type: "tween", ease: "linear", duration: 0.4 },
    descriptionAr: "سرعة خطية مستمرة للمؤشرات الدوارة والتنقلات الميكانيكية البسيطة.",
    descriptionEn: "Constant linear speed, recommended strictly for rotational indicators and background shimmers."
  }
];

export const MotionFramework: React.FC<MotionFrameworkProps> = ({
  currentLanguage,
  role
}) => {
  const systemReducedMotion = useReducedMotion();
  
  // States
  const [activeEasingId, setActiveEasingId] = useState("sovereign-calm");
  const [duration, setDuration] = useState(0.6);
  const [triggerKey, setTriggerKey] = useState(0);
  const [reducedMotionOverride, setReducedMotionOverride] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Screen transition simulation state
  const [currentScreen, setCurrentScreen] = useState("home");
  const [transitionStyle, setTransitionStyle] = useState("sovereign-reveal");

  // Micro-interactions states
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success">("idle");
  const [inputVal, setInputVal] = useState("");
  const [inputStatus, setInputStatus] = useState<"empty" | "typing" | "error" | "success">("empty");
  const [isBentoExpanded, setIsBentoExpanded] = useState(false);
  const [activeTabId, setActiveTabId] = useState("feed");
  const [formStep, setFormStep] = useState(1);

  // Loaders states
  const [linearProgress, setLinearProgress] = useState(0);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "signing" | "success">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Dialog and Notification feedback states
  const [showNotification, setShowNotification] = useState<"success" | "error" | null>(null);

  // Gesture simulation states
  const [isSwiped, setIsSwiped] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [isLongPressUnlocked, setIsLongPressUnlocked] = useState(false);
  const longPressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // AI Dialogue animation state
  const [aiDialogueStep, setAiDialogueStep] = useState(0);
  const [isAiResponding, setIsAiResponding] = useState(false);

  // QA checklist state
  const [qaChecks, setQaChecks] = useState({
    interruptible: true,
    noLayoutShift: true,
    hardwareAccelerated: true,
    reducedMotionCompliant: true,
    interactiveUnder60fps: true,
    rtlLtrConsistent: true
  });

  const activeEasing = EASING_PRESETS.find(e => e.id === activeEasingId) || EASING_PRESETS[0];
  const isReducedMotionEnabled = systemReducedMotion || reducedMotionOverride;

  // Custom copy text helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Auto counter simulator for loader
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulatingLoad) {
      interval = setInterval(() => {
        setLinearProgress(prev => {
          if (prev >= 100) {
            setIsSimulatingLoad(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setLinearProgress(0);
    }
    return () => clearInterval(interval);
  }, [isSimulatingLoad]);

  // Upload progression simulator
  const startUploadSimulation = () => {
    setUploadState("uploading");
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("signing");
          setTimeout(() => {
            setUploadState("success");
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Long press handler
  const startLongPress = () => {
    if (isLongPressUnlocked) return;
    setLongPressProgress(0);
    longPressIntervalRef.current = setInterval(() => {
      setLongPressProgress(prev => {
        if (prev >= 100) {
          clearInterval(longPressIntervalRef.current!);
          setIsLongPressUnlocked(true);
          return 100;
        }
        return prev + 8;
      });
    }, 100);
  };

  const stopLongPress = () => {
    if (longPressIntervalRef.current) {
      clearInterval(longPressIntervalRef.current);
    }
    if (!isLongPressUnlocked) {
      setLongPressProgress(0);
    }
  };

  // AI Dialogue response stream simulator
  const runAiDialogueDemo = () => {
    setAiDialogueStep(1);
    setIsAiResponding(true);
    setTimeout(() => {
      setAiDialogueStep(2);
      setIsAiResponding(false);
    }, 2000);
  };

  // Cubic Bezier SVG path generator
  const drawBezierPath = (p: number[]) => {
    if (!p) return "M 0 200 C 50 100, 100 0, 200 0"; // Fallback curve
    // Scale curve coordinates from 0-1 to SVG canvas 0-200
    const x1 = p[0] * 200;
    const y1 = 200 - (p[1] * 200);
    const x2 = p[2] * 200;
    const y2 = 200 - (p[3] * 200);
    return `M 0 200 C ${x1} ${y1}, ${x2} ${y2}, 200 0`;
  };

  // Code generation templates
  const getFramerMotionCode = () => {
    if (activeEasing.id === "micro-spring") {
      return `// Framer Motion Spring implementation
<motion.div
  animate={{ scale: 1.05 }}
  transition={{
    type: "spring",
    stiffness: 380,
    damping: 22,
    mass: 0.8
  }}
/>`;
    }
    return `// Framer Motion Custom Cubic-Bezier
<motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    ease: [${activeEasing.bezier?.join(", ")}],
    duration: ${duration}
  }}
/>`;
  };

  const getTailwindCode = () => {
    if (activeEasing.id === "micro-spring") {
      return `/* Tailwind CSS Custom Spring Utility (requires theme extension) */
<div className="transition-all duration-300 ease-spring hover:scale-105" />`;
    }
    return `/* Tailwind Custom Transition Curve */
<div className="transition-all duration-[${duration * 1000}ms] cubic-bezier-[${activeEasing.bezier?.join(",")}]" />`;
  };

  // Base motion transition settings respecting user Reduced Motion
  const baseTransition = (customType?: "spring" | "tween") => {
    if (isReducedMotionEnabled) {
      return { type: "tween", ease: "linear", duration: 0.1 };
    }
    if (customType === "spring" || activeEasing.id === "micro-spring") {
      return { type: "spring", stiffness: 380, damping: 22, mass: 0.8 };
    }
    return {
      type: "tween",
      ease: activeEasing.bezier ? activeEasing.bezier : [0.16, 1, 0.3, 1],
      duration: duration
    };
  };

  return (
    <div id="sovereign-motion-system-playground" className="space-y-6">
      
      {/* SECTION BANNER & REDUCED MOTION CONTROLLER */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#007A33]/5 to-transparent pointer-events-none"></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#007A33]/10 text-sudan-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              SGDS MOTION FRAMEWORK
            </span>
            <span className="bg-slate-950 text-sudan-gold px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              v1.0.0 Spec
            </span>
          </div>
          <h2 className="text-xl font-black text-sudan-dark">
            {currentLanguage === "ar" ? "نظام الحركة والتفاعلات الدقيقة الفيدرالي" : "Federal Motion Design & Micro-interaction System"}
          </h2>
          <p className="text-xs text-gray-500 max-w-3xl">
            {currentLanguage === "ar" 
              ? "الدليل الرسمي والمنظومة الرقمية لتنسيق حركيات المواقع الفيدرالية السودانية لعام 2026. توجيهات الأداء المسرع، التفاعلات الدقيقة المريحة ودعم معايير سهولة الوصول الشاملة."
              : "Official system standardizing transition curves, loading feedback, gesture states, and accessibility parameters across Ministry nodes under the 2026 Sovereign Initiative."}
          </p>
        </div>

        {/* Accessibility reduced motion switch */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-gray-100 shrink-0 w-full lg:w-auto justify-between lg:justify-start">
          <div className="space-y-0.5">
            <span className="text-xs font-extrabold text-sudan-dark flex items-center gap-1.5">
              <Accessibility className="h-4 w-4 text-[#007A33]" />
              {currentLanguage === "ar" ? "تجاوب مهدئ (تقليل الحركة)" : "Reduced Motion Mode"}
            </span>
            <p className="text-[10px] text-gray-400">
              {currentLanguage === "ar" ? "تعطيل الانزلاقات والارتدادات تماماً" : "Disables spring bounce & slides"}
            </p>
          </div>
          <button 
            onClick={() => setReducedMotionOverride(!reducedMotionOverride)}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              isReducedMotionEnabled ? "bg-[#007A33]" : "bg-gray-300"
            }`}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                isReducedMotionEnabled ? "translate-x-6 ltr:translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* CORE GRID: CURVE PLOTTER & TIMING CONFIG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CURVE SELECTOR & CUSTOMIZER (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
          <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
            <Sliders className="h-4 w-4 text-[#007A33]" />
            {currentLanguage === "ar" ? "1. محاكي المنحنيات وجدول السرعات" : "1. Easing Curves & Speed Spec"}
          </h3>

          {/* Preset list */}
          <div className="space-y-2">
            {EASING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setActiveEasingId(preset.id);
                  if (preset.id === "urgent-action") setDuration(0.25);
                  else if (preset.id === "micro-spring") setDuration(0.4);
                  else setDuration(0.6);
                }}
                className={`w-full text-right ltr:text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                  activeEasingId === preset.id 
                    ? "bg-[#007A33]/5 border-[#007A33] text-sudan-dark" 
                    : "bg-slate-50 hover:bg-slate-100/50 border-transparent text-gray-500"
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${activeEasingId === preset.id ? "bg-[#007A33]" : "bg-gray-400"}`}></span>
                    <span className="text-xs font-black">{currentLanguage === "ar" ? preset.nameAr : preset.nameEn}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {currentLanguage === "ar" ? preset.descriptionAr : preset.descriptionEn}
                  </p>
                </div>
                {preset.bezier && (
                  <span className="font-mono text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-400 font-bold shrink-0 self-center">
                    Cubic
                  </span>
                )}
                {!preset.bezier && (
                  <span className="font-mono text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded text-sudan-gold font-bold shrink-0 self-center">
                    Spring
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Time slider */}
          {activeEasing.bezier && (
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>{currentLanguage === "ar" ? "فترة استمرارية الحركة (ثانية)" : "Animation Duration (Seconds)"}</span>
                <span className="font-mono bg-white px-2.5 py-0.5 rounded-lg border border-gray-200 text-sudan-green font-black">
                  {duration}s
                </span>
              </div>
              <input 
                type="range"
                min={0.1}
                max={2.0}
                step={0.05}
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full accent-[#007A33] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                <span>0.1s Fast (تنبيهات)</span>
                <span>2.0s Slow (استعراض)</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BEZIER PLOTTER CANVAS & TEST BED (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between gap-6 min-h-[420px]">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Interactive Timing Visualizer</span>
              <h4 className="text-sm font-extrabold text-sudan-dark">
                {currentLanguage === "ar" ? "المخطط الرياضي لمنحنى الحركة" : "Mathematical Curve Coordinates"}
              </h4>
            </div>
            <button 
              onClick={() => setTriggerKey(prev => prev + 1)}
              className="px-3.5 py-1.5 bg-[#007A33] hover:bg-sudan-green-light text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Play className="h-3 w-3 fill-white" />
              {currentLanguage === "ar" ? "محاكاة فورية" : "Test Motion"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1">
            
            {/* SVG Plotter */}
            <div className="relative border border-gray-100 bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center h-52 overflow-hidden shadow-inner">
              <div className="absolute top-2 left-2 text-[9px] text-gray-400 font-mono">X: Time / Y: Progression</div>
              <svg className="w-40 h-40 overflow-visible" viewBox="0 0 200 200">
                {/* Grid Lines */}
                <line x1="0" y1="0" x2="200" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="0" y1="200" x2="200" y2="200" stroke="#334155" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="200" stroke="#334155" strokeWidth="1" />
                <line x1="200" y1="0" x2="200" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                
                {/* Easing Path */}
                {activeEasing.bezier ? (
                  <path 
                    d={drawBezierPath(activeEasing.bezier)} 
                    fill="none" 
                    stroke="#D2B48C" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                ) : (
                  // Mock Spring Curve drawing
                  <path 
                    d="M 0 200 Q 40 40, 80 10 Q 120 -15, 150 15 Q 175 5, 200 0" 
                    fill="none" 
                    stroke="#D2B48C" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                )}

                {/* Animated Indicator Node along the curve */}
                <motion.circle
                  key={`${activeEasingId}-${triggerKey}`}
                  cx="0"
                  cy="200"
                  r="6"
                  fill="#007A33"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  animate={activeEasing.bezier ? {
                    cx: [0, 200],
                    cy: [200, 0],
                    transition: {
                      ease: activeEasing.bezier,
                      duration: isReducedMotionEnabled ? 0.1 : duration,
                      repeat: Infinity,
                      repeatDelay: 1
                    }
                  } : {
                    cx: [0, 80, 150, 200],
                    cy: [200, 10, 15, 0],
                    transition: {
                      type: "spring",
                      stiffness: 380,
                      damping: 22,
                      repeat: Infinity,
                      repeatDelay: 1
                    }
                  }}
                />
              </svg>
              <div className="mt-2 text-center">
                <p className="font-mono text-[10px] text-sudan-gold font-bold">
                  {activeEasing.bezier 
                    ? `cubic-bezier(${activeEasing.bezier.join(", ")})` 
                    : `spring(stiffness: 380, damping: 22)`}
                </p>
              </div>
            </div>

            {/* Simulated Animated Object */}
            <div className="border border-gray-100 bg-slate-50 rounded-2xl h-52 flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute top-2 left-2 text-[9px] text-gray-400 font-mono">Sandbox Preview</div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeEasingId}-${triggerKey}`}
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: baseTransition()
                  }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-2 max-w-[200px]"
                >
                  <div className="bg-[#007A33]/10 p-2.5 rounded-full text-[#007A33]">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-extrabold text-sudan-dark">
                    {currentLanguage === "ar" ? "ترخيص صناعي معتمد" : "Approved Industry Token"}
                  </p>
                  <p className="text-[9px] text-gray-400">
                    {currentLanguage === "ar" ? "رقم الترخيص: MCI-IL-504" : "ID: MCI-IL-504"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* DEVELOPER CODE SNIPPETS FOR COPING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            {/* Framer Motion Snippet */}
            <div className="bg-slate-900 rounded-xl p-3 relative font-mono text-[10px] text-gray-300">
              <span className="text-[8px] bg-slate-800 text-sudan-gold px-1.5 py-0.5 rounded font-bold uppercase absolute top-2 right-2">
                Framer Motion
              </span>
              <pre className="overflow-x-auto pt-4 leading-relaxed max-h-24">
                <code>{getFramerMotionCode()}</code>
              </pre>
              <button
                onClick={() => handleCopy(getFramerMotionCode(), "framer")}
                className="absolute bottom-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-white cursor-pointer"
                aria-label="Copy code"
              >
                {copiedText === "framer" ? <Check className="h-3 w-3 text-sudan-green" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>

            {/* Tailwind Snippet */}
            <div className="bg-slate-900 rounded-xl p-3 relative font-mono text-[10px] text-gray-300">
              <span className="text-[8px] bg-slate-800 text-sudan-gold px-1.5 py-0.5 rounded font-bold uppercase absolute top-2 right-2">
                Tailwind CSS
              </span>
              <pre className="overflow-x-auto pt-4 leading-relaxed max-h-24">
                <code>{getTailwindCode()}</code>
              </pre>
              <button
                onClick={() => handleCopy(getTailwindCode(), "tailwind")}
                className="absolute bottom-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-white cursor-pointer"
                aria-label="Copy code"
              >
                {copiedText === "tailwind" ? <Check className="h-3 w-3 text-sudan-green" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE & SCREEN TRANSITION STANDARDS SIMULATOR */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-3 gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5">
              <LayoutList className="h-4 w-4 text-[#007A33]" />
              {currentLanguage === "ar" ? "2. معايير انتقال الصفحات ومعاينة التدفق" : "2. Page Transition Standards & Flow Simulator"}
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "تحديد انسياب المحتوى بين نوافذ البوابة الإلكترونية لتجنب قفزات الشاشة المفاجئة." : "Ensuring fluid structural flow between distinct sub-pages to maintain user task context."}
            </p>
          </div>

          <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-gray-100">
            {["sovereign-reveal", "fade-slide", "direct-reduced"].map(style => (
              <button
                key={style}
                onClick={() => {
                  setTransitionStyle(style);
                  if (style === "direct-reduced") setReducedMotionOverride(true);
                  else setReducedMotionOverride(false);
                }}
                className={`px-3 py-1 text-[10px] font-extrabold rounded-lg cursor-pointer ${
                  transitionStyle === style 
                    ? "bg-[#007A33] text-white" 
                    : "text-gray-500 hover:text-sudan-dark"
                }`}
              >
                {style === "sovereign-reveal" ? "Sovereign Reveal" : style === "fade-slide" ? "Fade & Slide" : "Reduced (Instant)"}
              </button>
            ))}
          </div>
        </div>

        {/* Mini phone simulation layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Timeline of navigation steps */}
          <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-gray-100 self-stretch">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Simulated Journey Nodes</span>
            {[
              { id: "home", labelAr: "الرئيسية", labelEn: "Home Portal" },
              { id: "services", labelAr: "دليل الخدمات الفيدرالية", labelEn: "Service Catalog" },
              { id: "form", labelAr: "الاستمارة الذكية", labelEn: "Interactive Form" },
              { id: "review", labelAr: "مراجعة المستندات", labelEn: "Sovereign Review" },
              { id: "payment", labelAr: "بوابة السداد الرقمية", labelEn: "Strategic Payment" },
              { id: "success", labelAr: "الشهادة والمطابقة", labelEn: "Verified Certificate" }
            ].map((node, idx) => {
              const isPassed = ["home", "services", "form", "review", "payment", "success"].indexOf(currentScreen) >= idx;
              const isActive = currentScreen === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setCurrentScreen(node.id)}
                  className={`w-full text-right ltr:text-left p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isActive 
                      ? "bg-[#007A33] text-white shadow-sm" 
                      : isPassed 
                        ? "bg-emerald-50 text-sudan-green" 
                        : "bg-white text-gray-400 hover:text-gray-600 border border-gray-100"
                  }`}
                >
                  <span>{currentLanguage === "ar" ? node.labelAr : node.labelEn}</span>
                  {isPassed && !isActive && <Check className="h-3 w-3 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Core Simulator viewport screen (3 Cols wide) */}
          <div className="lg:col-span-3 border-2 border-gray-150 rounded-2xl bg-white p-6 min-h-[320px] flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[8px] font-mono text-gray-300 uppercase tracking-widest z-10">Sudan MCI Gov OS</div>
            
            {/* Transition Engine */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={
                  transitionStyle === "sovereign-reveal" && !isReducedMotionEnabled
                    ? { opacity: 0, scale: 0.96, y: 15 }
                    : transitionStyle === "fade-slide" && !isReducedMotionEnabled
                    ? { opacity: 0, x: currentLanguage === "ar" ? -50 : 50 }
                    : { opacity: 0 }
                }
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0, 
                  x: 0,
                  transition: {
                    type: "tween",
                    ease: "easeOut",
                    duration: isReducedMotionEnabled ? 0.05 : 0.4,
                    staggerChildren: 0.08
                  }
                }}
                exit={
                  transitionStyle === "sovereign-reveal" && !isReducedMotionEnabled
                    ? { opacity: 0, scale: 0.98, y: -10 }
                    : transitionStyle === "fade-slide" && !isReducedMotionEnabled
                    ? { opacity: 0, x: currentLanguage === "ar" ? 50 : -50 }
                    : { opacity: 0 }
                }
                className="flex-1 flex flex-col justify-between"
              >
                {/* Simulated Screen Content templates */}
                {currentScreen === "home" && (
                  <div className="space-y-4">
                    <motion.div className="space-y-1">
                      <span className="bg-[#007A33]/10 text-[#007A33] px-2 py-0.5 rounded text-[9px] font-bold">MCI DIGITAL HUB</span>
                      <h4 className="text-base font-black text-sudan-dark">وزارة التجارة والصناعة الفيدرالية</h4>
                      <p className="text-xs text-gray-400">بوابة الاستمارات الموحدة والتراخيص السيادية تحت رعاية الجمهورية لعام 2026.</p>
                    </motion.div>
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-extrabold">المعاملات النشطة</p>
                        <p className="text-lg font-black text-[#007A33]">1,540</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-extrabold">الاعتمادات الصادرة اليوم</p>
                        <p className="text-lg font-black text-sudan-gold">94.8%</p>
                      </div>
                    </motion.div>
                  </div>
                )}

                {currentScreen === "services" && (
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-sudan-dark">دليل الخدمات السيادية والفرص الاستثمارية</h4>
                      <p className="text-[11px] text-gray-400">اختر من بين 9 قنوات إجرائية لتبدأ تفعيل طلبك الفيدرالي فوراً.</p>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { code: "CR-01", label: "السجل التجاري الموحد والاسم الفيدرالي" },
                        { code: "IL-02", label: "التراخيص الصناعية الفيدرالية والمطابقة" },
                        { code: "IE-03", label: "رخص الاستيراد والتصدير للسلع السيادية" }
                      ].map(srv => (
                        <div key={srv.code} className="p-2.5 bg-slate-50 rounded-xl border border-gray-150 flex justify-between items-center text-xs">
                          <span className="font-extrabold text-[#007A33]">{srv.code}</span>
                          <span className="font-bold text-gray-500">{srv.label}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentScreen === "form" && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-sudan-dark">استمارة طلب السجل التجاري SD-MCI-CR-01</h4>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold block">الاسم التجاري المقترح بالعربية</label>
                        <input type="text" placeholder="شركة نهر النيل لإنتاج الغلال المحدودة" className="w-full text-xs p-2.5 rounded-xl border border-gray-200" disabled />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold block">رأس المال الاستثماري بالجنيه</label>
                        <input type="text" placeholder="10,000,000 SDG" className="w-full text-xs p-2.5 rounded-xl border border-gray-200" disabled />
                      </div>
                    </div>
                  </div>
                )}

                {currentScreen === "review" && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-sudan-dark">مراجعة ومطابقة الملفات السيادية</h4>
                    <div className="bg-[#007A33]/5 p-3 rounded-xl border border-[#007A33]/20 flex items-center gap-3">
                      <FileCheck className="h-8 w-8 text-[#007A33]" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-sudan-dark">تم استيراد عقد الشركة الأساسي بنجاح</p>
                        <p className="text-[10px] text-gray-400 font-mono">HASH: 4b9f8c12a78e90bd45c</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentScreen === "payment" && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-sudan-dark">بوابة السداد الفيدرالي الموحد</h4>
                    <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-full bg-[#007A33]/20 skew-x-12"></div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">SUDAN SECURE ELECTRONIC PAYMENT</p>
                      <div className="flex justify-between items-end">
                        <span className="font-mono text-sm tracking-wider">**** **** **** 2035</span>
                        <span className="text-lg font-black text-sudan-gold">25,000 SDG</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentScreen === "success" && (
                  <div className="text-center space-y-3 py-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#007A33]">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-sudan-dark">تم اعتماد وتوثيق السجل الفيدرالي بنجاح!</h4>
                      <p className="text-xs text-gray-400">رقم التتبع السيادي: SDMCI-CR-18940</p>
                    </div>
                    <div className="border border-dashed border-gray-200 p-2.5 rounded-xl font-mono text-[9px] text-gray-400 inline-block">
                      VERIFIED BY CENTRAL LEDGER • JULY 2026
                    </div>
                  </div>
                )}

                {/* Footer simulation action button */}
                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => {
                      const order = ["home", "services", "form", "review", "payment", "success"];
                      const currentIdx = order.indexOf(currentScreen);
                      if (currentIdx > 0) setCurrentScreen(order[currentIdx - 1]);
                    }}
                    disabled={currentScreen === "home"}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sudan-dark text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "السابق" : "Back"}
                  </button>

                  <button 
                    onClick={() => {
                      const order = ["home", "services", "form", "review", "payment", "success"];
                      const currentIdx = order.indexOf(currentScreen);
                      if (currentIdx < order.length - 1) setCurrentScreen(order[currentIdx + 1]);
                      else setCurrentScreen("home");
                    }}
                    className="px-4 py-1.5 bg-[#007A33] hover:bg-sudan-green-light text-white text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{currentScreen === "success" ? (currentLanguage === "ar" ? "البدء من جديد" : "Restart") : (currentLanguage === "ar" ? "التالي" : "Next Stage")}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE INTERACTIVE PLAYGROUNDS FOR MICRO-INTERACTIONS */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
          <Touchpad className="h-4 w-4 text-[#007A33]" />
          {currentLanguage === "ar" ? "3. مكتبة تفاعلات العناصر الدقيقة والمدخلات" : "3. Micro-interactions & Input States Playground"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* A. BUTTON INTERACTION CARD */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[9px] text-[#007A33] font-black uppercase">TACTILE BUTTON STATES</span>
              <h4 className="text-xs font-black text-sudan-dark">
                {currentLanguage === "ar" ? "تجاوب الأزرار اللمسي" : "Button Interaction Mechanics"}
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {currentLanguage === "ar" ? "أزرار تتجاوب مادياً عند المرور، الضغط، إظهار التحميل والنجاح المكتمل." : "Sovereign buttons provide robust active scaling (haptics), state transformation loading, and success confirmation."}
              </p>
            </div>

            <div className="py-4 flex flex-col items-center justify-center gap-3">
              <motion.button
                whileHover={isReducedMotionEnabled ? {} : { scale: 1.03, boxShadow: "0 8px 16px -4px rgba(0, 122, 51, 0.15)" }}
                whileTap={isReducedMotionEnabled ? {} : { scale: 0.95 }}
                onClick={() => {
                  if (buttonState !== "idle") return;
                  setButtonState("loading");
                  setTimeout(() => {
                    setButtonState("success");
                    setTimeout(() => setButtonState("idle"), 2500);
                  }, 2000);
                }}
                disabled={buttonState !== "idle"}
                className={`px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wide transition-colors duration-200 cursor-pointer w-full text-center max-w-[200px] shadow-sm flex items-center justify-center gap-2 ${
                  buttonState === "success" 
                    ? "bg-[#007A33] text-white" 
                    : buttonState === "loading"
                    ? "bg-slate-800 text-white cursor-wait"
                    : "bg-slate-950 hover:bg-slate-900 text-white"
                }`}
              >
                {buttonState === "idle" && (
                  <>
                    <Zap className="h-4 w-4 text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? "اضغط للتجربة" : "Click to Test"}</span>
                  </>
                )}
                {buttonState === "loading" && (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? "جاري المعالجة..." : "Processing..."}</span>
                  </>
                )}
                {buttonState === "success" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-sudan-gold animate-bounce" />
                    <span>{currentLanguage === "ar" ? "اكتمل بنجاح!" : "Sovereign Success!"}</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="flex gap-2 justify-center">
              <button onClick={() => setButtonState("idle")} className="text-[9px] font-bold text-gray-400 hover:text-sudan-dark underline">Reset</button>
              <button onClick={() => setButtonState("loading")} className="text-[9px] font-bold text-gray-400 hover:text-sudan-dark underline">Set Load</button>
              <button onClick={() => setButtonState("success")} className="text-[9px] font-bold text-gray-400 hover:text-sudan-dark underline">Set Success</button>
            </div>
          </div>

          {/* B. SMART INPUT & VALIDATION SHAKE */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[9px] text-[#007A33] font-black uppercase">INTELLIGENT VALIDATORS</span>
              <h4 className="text-xs font-black text-sudan-dark">
                {currentLanguage === "ar" ? "حقول الإدخال والتحقق المباشر" : "Adaptive Forms & Input Shake"}
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {currentLanguage === "ar" ? "يرتسم الإطار بلون ذهبي عند التركيز، ويهتز أفقياً للتحذير من المدخلات الخاطئة." : "Inputs transition seamlessly, using a subtle physical horizontal shake if custom regex parameters fail."}
              </p>
            </div>

            {/* Simulated Animated Input Wrapper */}
            <div className="space-y-2 py-2">
              <motion.div
                animate={inputStatus === "error" && !isReducedMotionEnabled ? {
                  x: [0, -10, 10, -10, 10, -5, 5, 0],
                  transition: { duration: 0.5 }
                } : {}}
                className="space-y-1"
              >
                <label className="text-[10px] text-gray-400 font-black uppercase block">Federal Registration ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => {
                      const v = e.target.value;
                      setInputVal(v);
                      if (v.length === 0) setInputStatus("empty");
                      else setInputStatus("typing");
                    }}
                    placeholder="Format: SD-MCI-CR-XXXXX"
                    className={`w-full text-xs p-2.5 rounded-xl border transition-all outline-none ${
                      inputStatus === "error" 
                        ? "border-red-500 focus:ring-4 focus:ring-red-100" 
                        : inputStatus === "success"
                        ? "border-[#007A33] focus:ring-4 focus:ring-emerald-500/10"
                        : "border-gray-200 focus:border-[#007A33] focus:ring-4 focus:ring-[#007A33]/10"
                    }`}
                  />
                  {inputStatus === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-[#007A33] absolute top-3.5 right-3" />
                  )}
                  {inputStatus === "error" && (
                    <AlertTriangle className="h-4 w-4 text-red-500 absolute top-3.5 right-3" />
                  )}
                </div>
              </motion.div>
            </div>

            <div className="flex gap-2 justify-between items-center">
              <button 
                onClick={() => {
                  const regex = /^SD-MCI-CR-\d{5}$/;
                  if (regex.test(inputVal)) {
                    setInputStatus("success");
                  } else {
                    setInputStatus("error");
                    // reset shake trigger
                    setTimeout(() => setInputStatus("typing"), 1000);
                  }
                }}
                className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-slate-800"
              >
                Verify Format
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setInputVal("SD-MCI-CR-12345");
                    setInputStatus("success");
                  }} 
                  className="text-[9px] text-sudan-green font-bold hover:underline"
                >
                  Set Valid
                </button>
                <button 
                  onClick={() => {
                    setInputVal("invalid-token");
                    setInputStatus("error");
                    setTimeout(() => setInputStatus("typing"), 1000);
                  }} 
                  className="text-[9px] text-red-500 font-bold hover:underline"
                >
                  Set Error
                </button>
              </div>
            </div>
          </div>

          {/* C. BENTO GRID EXPANSION & DISCLOSURE */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[9px] text-[#007A33] font-black uppercase">LAYOUT FLUIDITY</span>
              <h4 className="text-xs font-black text-sudan-dark">
                {currentLanguage === "ar" ? "تمدد وتبويب البطاقات المرن" : "Bento Card Layout Accordion"}
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {currentLanguage === "ar" ? "تتحول الهياكل البصرية للمحتوى بسلاسة دون التسبب في قفزات مفاجئة للـ Layout." : "Cards expand smoothly using standard hardware-accelerated layouts preventing visual jumping."}
              </p>
            </div>

            <div className="py-2">
              <motion.div 
                layout
                transition={baseTransition()}
                className="bg-white p-3 rounded-2xl border border-gray-150 shadow-xs space-y-2 cursor-pointer"
                onClick={() => setIsBentoExpanded(!isBentoExpanded)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-sudan-dark">شروط التخصيص السيادية</span>
                  <motion.div
                    animate={{ rotate: isBentoExpanded ? 180 : 0 }}
                    transition={baseTransition()}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {isBentoExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={baseTransition()}
                      className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-100 pt-2 space-y-1"
                    >
                      <p>• يجب ألا يقل رأس المال للشركة الاستثمارية عن 5,000,000 جنيه.</p>
                      <p>• تقديم شهادة الخلو الضريبي الفيدرالية سارية المفعول.</p>
                      <p className="text-sudan-gold font-bold">• خاضع للمراجعة التلقائية المباشرة بموجب لوائح لعام 2026.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <p className="text-[9px] text-gray-400 text-center">
              {currentLanguage === "ar" ? "انقر فوق البطاقة أعلاه لمشاهدة التمدد الذكي" : "Click the card above to test dynamic accordion motion"}
            </p>
          </div>
        </div>
      </div>

      {/* DENSE VISUAL: LOADING STATES & SKELETON SCREENS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PROGRESSIVE PROGRESS INDICATORS & FILE UPLOADS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
          <div className="space-y-1 border-b border-gray-100 pb-2.5">
            <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 text-[#007A33]" />
              {currentLanguage === "ar" ? "4. نماذج التحميل وعدادات تقدم الإجراءات" : "4. Progress Trackers & Staged Loaders"}
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "محاكاة فورية لمراحل العمليات والتحميل الرقمي لتقليل زمن الانتظار الملحوظ." : "Simulating staged tasks, linear loads, and file parsing stages to eliminate perceived latency."}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Linear load simulation */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>{currentLanguage === "ar" ? "تصدير دراسة الجدوى وتوليد الملف" : "Generating Feasibility Report Document"}</span>
                <span className="font-mono text-sudan-green">{linearProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${linearProgress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                  className="h-full bg-gradient-to-r from-[#007A33] to-sudan-green-light rounded-full"
                />
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <button
                  onClick={() => {
                    setIsSimulatingLoad(true);
                    setLinearProgress(0);
                  }}
                  disabled={isSimulatingLoad}
                  className="px-3 py-1 bg-slate-950 text-white text-[10px] font-black rounded-lg disabled:opacity-40"
                >
                  {currentLanguage === "ar" ? "بدء التحميل" : "Run Progress"}
                </button>
                {linearProgress === 100 && (
                  <span className="text-[10px] text-[#007A33] font-bold flex items-center gap-1 animate-bounce">
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </span>
                )}
              </div>
            </div>

            {/* File upload staging loader */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-sudan-dark">إيداع الهوية الوطنية والتحقق الأمني</span>
                <span className="text-[9px] bg-slate-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">STAGED PLATFORM</span>
              </div>

              {/* Steps progression UI */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { stateId: "uploading", label: "Uploading File" },
                  { stateId: "signing", label: "Ledger Signing" },
                  { stateId: "success", label: "Verified Key" }
                ].map((st, idx) => {
                  const states = ["idle", "uploading", "signing", "success"];
                  const currentIdx = states.indexOf(uploadState);
                  const isComplete = currentIdx > idx + 1 || uploadState === "success";
                  const isCurrent = uploadState === st.stateId;
                  
                  return (
                    <div 
                      key={st.stateId} 
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isComplete 
                          ? "bg-emerald-50 border-emerald-100 text-sudan-green" 
                          : isCurrent 
                          ? "bg-[#007A33]/5 border-[#007A33] text-sudan-dark font-extrabold" 
                          : "bg-white border-gray-150 text-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 text-[10px]">
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isCurrent ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-[#007A33]" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex items-center justify-center font-bold text-[8px]">{idx+1}</div>
                        )}
                        <span>{st.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar inside file upload */}
              {uploadState === "uploading" && (
                <div className="space-y-1 pt-1.5">
                  <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                    <span>MCI_ID_CARD.pdf ({uploadProgress}%)</span>
                    <span>Uploading...</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#007A33]" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              {uploadState === "signing" && (
                <p className="text-[10px] text-sudan-gold font-bold animate-pulse text-center pt-1.5">
                  ✍️ Generating sovereign digital ledger hash & validating cryptographic signatures...
                </p>
              )}

              {uploadState === "success" && (
                <div className="text-center bg-[#007A33]/15 text-[#007A33] p-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2">
                  <FileCheck className="h-4 w-4 animate-bounce" />
                  <span>Verified: SDMCI-LEDGER-HASH-78A90F</span>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-gray-150">
                <button 
                  onClick={startUploadSimulation}
                  disabled={uploadState === "uploading" || uploadState === "signing"}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg cursor-pointer disabled:opacity-40"
                >
                  {currentLanguage === "ar" ? "محاكاة المعالجة المتكاملة" : "Execute Process"}
                </button>
                <button onClick={() => setUploadState("idle")} className="text-[10px] text-gray-400 font-bold hover:underline">Reset</button>
              </div>
            </div>
          </div>
        </div>

        {/* AI INTERACTION MOTION: QUANTUM GLOW & STREAMING RESPONSES */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-gray-100 pb-2.5">
            <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-[#007A33]" />
              {currentLanguage === "ar" ? "5. محاكاة حركات الذكاء الاصطناعي التوليدي" : "5. Sovereign AI Dialogue & Quantum Glow"}
            </h3>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "محاكاة مؤشرات التفكير الذكي والنبض الضوئي المهدئ لحالات معالجة Gemini." : "Presenting ambient glowing nodes and responsive typing delays representing real-time AI agents."}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Ambient AI Glow Box */}
            <div className="border border-gray-150 rounded-2xl bg-slate-950 p-5 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
              
              {/* Quantum Pulsating AI Aura inside */}
              {isAiResponding && (
                <div className="absolute inset-0 bg-radial-gradient from-[#007A33]/15 via-transparent to-transparent opacity-80 animate-pulse pointer-events-none"></div>
              )}

              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="w-2.5 h-2.5 bg-sudan-gold rounded-full absolute -top-0.5 -right-0.5 animate-ping"></span>
                    <span className="w-2.5 h-2.5 bg-sudan-gold rounded-full absolute -top-0.5 -right-0.5"></span>
                    <div className="bg-gradient-to-r from-[#007A33] to-sudan-gold p-2 rounded-xl text-white font-black text-xs">
                      AI
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-300 font-black block">SOVEREIGN CHAT CO-PILOT</span>
                    <span className="text-[9px] text-[#007A33] font-bold">Gemini 2.5 Flash Engine</span>
                  </div>
                </div>

                {isAiResponding && (
                  <div className="flex gap-1.5 items-center bg-[#007A33]/10 px-2 py-0.5 rounded-lg border border-[#007A33]/20">
                    <span className="w-1.5 h-1.5 bg-[#007A33] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#007A33] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#007A33] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    <span className="text-[9px] text-[#007A33] font-bold font-mono">Thinking</span>
                  </div>
                )}
              </div>

              {/* Dialog stream container */}
              <div className="my-3 text-xs text-gray-200 space-y-2 z-10 flex-1 flex flex-col justify-center">
                {aiDialogueStep === 0 && (
                  <p className="text-gray-400 italic text-center text-[11px]">
                    {currentLanguage === "ar" ? "انقر فوق الزر أدناه لتوجيه استعلام ومراقبة التجاوب" : "Click 'Ask Co-Pilot' to stream an automated AI response"}
                  </p>
                )}
                {aiDialogueStep >= 1 && (
                  <div className="space-y-2">
                    <p className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl inline-block max-w-[85%] text-gray-300">
                      💬 {currentLanguage === "ar" ? "هل يمكنني حجز اسم تجاري بدون سجل تجاري نشط؟" : "Can I reserve a trade name without an active commercial register?"}
                    </p>
                    
                    {aiDialogueStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={baseTransition()}
                        className="bg-[#007A33]/5 border border-[#007A33]/20 p-2.5 rounded-xl block max-w-[90%] text-sudan-gold font-bold self-start"
                      >
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-extrabold mb-1">
                          <Sparkle className="h-3 w-3 fill-emerald-400" />
                          <span>98.6% Confidence Score</span>
                        </div>
                        {currentLanguage === "ar" 
                          ? "نعم، بموجب المادة 4 لقانون السجل التجاري لعام 2026، يمكنك حجز الاسم التجاري لمدة 15 يوماً عمل مسبقاً قبل التأسيس النهائي." 
                          : "Yes, under Article 4 of the 2026 Commercial Act, you can reserve a secure trade name for up to 15 business days prior to full incorporation."}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-slate-900 pt-2 z-10">
                <button 
                  onClick={runAiDialogueDemo}
                  disabled={isAiResponding}
                  className="px-4 py-1.5 bg-[#007A33] hover:bg-sudan-green-light text-white text-xs font-black rounded-lg cursor-pointer disabled:opacity-40"
                >
                  {currentLanguage === "ar" ? "اسأل المساعد الذكي" : "Ask Co-Pilot"}
                </button>
                <button 
                  onClick={() => {
                    setAiDialogueStep(0);
                    setIsAiResponding(false);
                  }} 
                  className="text-[10px] text-gray-500 hover:text-white"
                >
                  Clear Dialogue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK & NOTIFICATION CANVASES (SUCCESS & ERROR CODES) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
            <ShieldAlert className="h-4 w-4 text-[#007A33]" />
            {currentLanguage === "ar" ? "6. حالات النجاح والأخطاء واللوائح الأمنية" : "6. Sovereign Success & Fatal Error Feedback Panel"}
          </h3>
          <p className="text-xs text-gray-400">
            {currentLanguage === "ar" ? "مواصفات الحركة للتنبيهات عالية الأولوية وحالات المطابقة الإيجابية أو السلبية." : "Ensuring high-contrast error shaking, micro-glow expansions, and reassurance banners."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls triggers */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              {currentLanguage === "ar" 
                ? "تتطلب الأخطاء لفت الانتباه الفوري بموجب لوائح الأمان الفيدرالية لمنع تضليل المستخدم، بينما تستدعي حالات النجاح بهجة وثقة استثنائية."
                : "Operational errors trigger immediate high-priority alert nodes with strict hardware rendering to isolate the issue securely."}
            </p>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowNotification("success")}
                className="flex-1 py-2.5 bg-[#007A33] hover:bg-sudan-green-light text-white text-xs font-black rounded-xl cursor-pointer shadow-sm text-center"
              >
                Trigger Success Modal
              </button>
              <button
                onClick={() => setShowNotification("error")}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm text-center"
              >
                Trigger Danger Modal
              </button>
            </div>
          </div>

          {/* Render Area with AnimatePresence */}
          <div className="border border-gray-150 rounded-2xl h-52 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute top-2 left-2 text-[9px] text-gray-400 font-mono">Feedback Arena</div>
            
            <AnimatePresence mode="wait">
              {showNotification === null && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-gray-400 italic"
                >
                  No active high-priority system signal.
                </motion.p>
              )}

              {showNotification === "success" && (
                <motion.div
                  initial={isReducedMotionEnabled ? { opacity: 0 } : { scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={baseTransition("spring")}
                  className="bg-white border-2 border-sudan-green p-5 rounded-2xl shadow-md max-w-sm text-center space-y-3"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#007A33] animate-bounce">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-sudan-dark">FORM SUBMITTED SUCCESSFULLY</h4>
                    <p className="text-[10px] text-gray-500">The Minister Office has been notified. National ledger certificate is processing.</p>
                  </div>
                  <button onClick={() => setShowNotification(null)} className="text-[10px] font-bold text-gray-400 hover:text-sudan-dark underline">Dismiss</button>
                </motion.div>
              )}

              {showNotification === "error" && (
                <motion.div
                  initial={isReducedMotionEnabled ? { opacity: 0 } : { x: [0, -15, 15, -15, 15, 0], opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border-2 border-red-500 p-5 rounded-2xl shadow-md max-w-sm text-center space-y-3"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 animate-pulse">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-red-600">CRITICAL ACCESS SUSPENDED</h4>
                    <p className="text-[10px] text-gray-500">Security verification token expired. Please re-authenticate your digital identity credentials.</p>
                  </div>
                  <button onClick={() => setShowNotification(null)} className="text-[10px] font-bold text-gray-400 hover:text-sudan-dark underline">Dismiss</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE TOUCH GESTURE SIMULATOR SANDBOX */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="space-y-1 border-b border-gray-100 pb-2.5">
          <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5">
            <Touchpad className="h-4 w-4 text-[#007A33]" />
            {currentLanguage === "ar" ? "7. محاكي إيماءات اللمس للهواتف الذكية" : "7. Interactive Touch Gestures & Pull-to-Refresh Lab"}
          </h3>
          <p className="text-xs text-gray-400">
            {currentLanguage === "ar" ? "محاكاة السحب للإلغاء، الضغط المطول للتحقق الأمني، وإيماءة التحديث للهواتف الذكية." : "Testing mobile-specific gestures including Swipe-to-dismiss, and unified hold-to-execute mechanisms."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Swipe to dismiss */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 space-y-3 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1">
              <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">Swipe to Dismiss</span>
              <p className="text-xs font-black text-sudan-dark">السحب الجانبي للإلغاء</p>
              <p className="text-[11px] text-gray-400">اسحب البطاقة أفقياً خارج نطاق الشاشة لإلغائها من سجل التنبيهات.</p>
            </div>

            <div className="py-2 relative overflow-hidden h-24 flex items-center justify-center border border-dashed border-gray-200 rounded-xl bg-white">
              {!isSwiped ? (
                <motion.div
                  drag="x"
                  dragConstraints={{ left: -100, right: 100 }}
                  onDragEnd={(e, info) => {
                    if (Math.abs(info.offset.x) > 80) {
                      setIsSwiped(true);
                    }
                  }}
                  className="bg-[#007A33]/5 border border-[#007A33]/25 p-3 rounded-xl cursor-grab active:cursor-grabbing text-xs font-bold text-sudan-dark max-w-[200px] text-center shadow-xs"
                >
                  ↔️ Drag Me Left or Right
                </motion.div>
              ) : (
                <button 
                  onClick={() => setIsSwiped(false)} 
                  className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  Bring Card Back
                </button>
              )}
            </div>
            <p className="text-[9px] text-gray-400 text-center">Swipe card off center by 80px to dismiss</p>
          </div>

          {/* 2. Pull down to refresh */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 space-y-3 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1">
              <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase">Pull to Refresh</span>
              <p className="text-xs font-black text-sudan-dark">السحب لأسفل لتحديث السجلات</p>
              <p className="text-[11px] text-gray-400">اسحب المقبض لأسفل بمقدار 60 بكسل لتحديث مؤشر مبيعات الصادرات السيادية.</p>
            </div>

            <div className="py-2 border border-dashed border-gray-200 rounded-xl bg-white h-24 relative overflow-hidden flex flex-col items-center justify-start pt-2">
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 60 }}
                onDrag={(e, info) => {
                  setPullProgress(info.offset.y);
                }}
                onDragEnd={() => {
                  if (pullProgress >= 50) {
                    setPullProgress(60);
                    setTimeout(() => setPullProgress(0), 1500);
                  } else {
                    setPullProgress(0);
                  }
                }}
                className="w-8 h-8 rounded-full bg-[#007A33] text-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow z-10"
              >
                <RefreshCw className={`h-4 w-4 ${pullProgress >= 50 ? "animate-spin" : ""}`} />
              </motion.div>
              <div className="text-[9px] text-gray-400 font-mono mt-1">
                {pullProgress >= 50 ? "Release to Refresh Records!" : `Pull Progress: ${Math.floor(pullProgress)}px`}
              </div>
            </div>
            <p className="text-[9px] text-gray-400 text-center">Drag circular button downward to test</p>
          </div>

          {/* 3. Long press secure unlock */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 space-y-3 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1">
              <span className="text-[9px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold uppercase">Hold to Execute</span>
              <p className="text-xs font-black text-sudan-dark">الضغط المطول للاعتماد النهائي</p>
              <p className="text-[11px] text-gray-400">اضغط مطولاً لمدة 1.5 ثانية لإصدار الختم الفيدرالي الرقمي الموحد.</p>
            </div>

            <div className="py-2 border border-dashed border-gray-200 rounded-xl bg-white h-24 flex flex-col items-center justify-center gap-2">
              {!isLongPressUnlocked ? (
                <button
                  onMouseDown={startLongPress}
                  onMouseUp={stopLongPress}
                  onMouseLeave={stopLongPress}
                  onTouchStart={startLongPress}
                  onTouchEnd={stopLongPress}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black rounded-lg cursor-pointer active:scale-95 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 h-full bg-[#007A33]/20" style={{ width: `${longPressProgress}%` }}></div>
                  🤝 Hold Secure Button ({Math.floor(longPressProgress)}%)
                </button>
              ) : (
                <div className="text-center space-y-1 animate-pulse">
                  <span className="bg-emerald-50 text-sudan-green text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 mx-auto justify-center">
                    <UserCheck className="h-3.5 w-3.5" /> SECURE KEY REVEALED
                  </span>
                  <button onClick={() => { setIsLongPressUnlocked(false); setLongPressProgress(0); }} className="text-[9px] text-gray-400 hover:underline block mx-auto">Re-Lock Key</button>
                </div>
              )}
            </div>
            <p className="text-[9px] text-gray-400 text-center">Press and keep mouse held down on button</p>
          </div>

        </div>
      </div>

      {/* COMPREHENSIVE DOCUMENTATION & QA MOTION CHECKLIST */}
      <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Terminal className="h-5 w-5 text-sudan-gold" />
          <h3 className="text-sm font-black text-sudan-gold uppercase tracking-wider">
            {currentLanguage === "ar" ? "الوثيقة التقنية وجدول اختبار جودة الحركة الفيدرالي" : "Sovereign Motion Standards Guide & Developer Integration Plan"}
          </h3>
        </div>

        {/* Developer guide grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Principles column */}
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-sudan-gold font-bold uppercase tracking-wider block border-b border-slate-800 pb-1">
              {currentLanguage === "ar" ? "1. مبادئ الحركة الرسمية" : "1. Motion Integrity Standards"}
            </span>
            <ul className="space-y-3 text-xs text-gray-300">
              <li>
                <strong className="text-white block font-black">• الهدوء الهيكلي (Calm Performance)</strong>
                يُمنع استخدام الارتدادات المبالغ فيها أو الحركات الدائرية غير المبررة. الحركة هدفها لفت الانتباه وتأكيد الفعل فقط.
              </li>
              <li>
                <strong className="text-white block font-black">• التوافقية الشاملة (Universal Easing)</strong>
                يجب ألا تتداخل الحركة مع كفاءة التنقل بلوحة المفاتيح، وأن تقبل المقاطعة الفورية بـ user input.
              </li>
              <li>
                <strong className="text-white block font-black">• كود المطابقة (60 FPS Mandate)</strong>
                جميع الانتقالات يجب أن تعتمد على الخواص المسرعة عتادياً مثل transform و opacity لتفادي بطء المتصفحات.
              </li>
            </ul>
          </div>

          {/* Timing Guide and Constants */}
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-sudan-gold font-bold uppercase tracking-wider block border-b border-slate-800 pb-1">
              {currentLanguage === "ar" ? "2. معايير المدد الزمنية" : "2. Unified Timing Constants (ms)"}
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-gray-400">Micro-Hover state</span>
                <span className="text-sudan-green font-bold">150ms</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-gray-400">Modal reveal banner</span>
                <span className="text-sudan-green font-bold">300ms</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-gray-400">Unified Page slide</span>
                <span className="text-sudan-green font-bold">400ms</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-gray-400">AI Thinking loader</span>
                <span className="text-sudan-green font-bold">Infinite Pulse</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-gray-400">Severe Error Shake</span>
                <span className="text-sudan-green font-bold">500ms (Linear)</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic leading-relaxed pt-1">
              * Note: These parameters scale directly with user's prefers-reduced-motion configuration to zero seconds immediately.
            </p>
          </div>

          {/* Interactive Quality Assurance Checklist */}
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-sudan-gold font-bold uppercase tracking-wider block border-b border-slate-800 pb-1">
              {currentLanguage === "ar" ? "3. قائمة فحص جودة الحركة الفيدرالية" : "3. QA Motion Integrity Checklist"}
            </span>
            
            <div className="space-y-2">
              {[
                { key: "interruptible", label: "Animations accept user interruption" },
                { key: "noLayoutShift", label: "No layout shift (avoid margin/padding animate)" },
                { key: "hardwareAccelerated", label: "Forces transform and opacity GPU acceleration" },
                { key: "reducedMotionCompliant", label: "Supports reduced-motion browser override" },
                { key: "interactiveUnder60fps", label: "Strictly maintains 60 FPS on lower-tier mobile" }
              ].map((chk) => (
                <label 
                  key={chk.key} 
                  className="flex items-center gap-2 text-[11px] text-gray-300 hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={(qaChecks as any)[chk.key]}
                    onChange={(e) => setQaChecks(prev => ({ ...prev, [chk.key]: e.target.checked }))}
                    className="rounded border-slate-700 bg-slate-800 text-[#007A33] focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
                  />
                  <span className={(qaChecks as any)[chk.key] ? "line-through text-gray-500" : ""}>{chk.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
