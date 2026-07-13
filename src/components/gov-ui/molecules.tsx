/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Search, Sparkles, Loader2, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { SovereignTypography, SovereignButton } from "./atoms";

// ==========================================
// 1. SEARCH BOX & AI SEARCH COMPONENTS
// ==========================================

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  isAIActive?: boolean;
  currentLanguage?: "ar" | "en";
  className?: string;
}

export const SovereignSearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "ابحث هنا...",
  onSearch,
  isAIActive = false,
  currentLanguage = "ar",
  className = ""
}) => {
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearch?.(value);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-xs p-3.5 ltr:pl-11 rtl:pr-11 rounded-2xl border border-gray-200 outline-none transition-all focus:border-sudan-green focus:ring-1 focus:ring-sudan-green font-sans bg-white text-sudan-dark ${
            isAIActive ? "focus:border-sudan-gold focus:ring-sudan-gold" : ""
          }`}
        />
        <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin text-sudan-green" />
          ) : isAIActive ? (
            <Sparkles className="h-4.5 w-4.5 text-sudan-gold" />
          ) : (
            <Search className="h-4.5 w-4.5" />
          )}
        </div>
      </div>
      
      <SovereignButton
        type="submit"
        variant={isAIActive ? "ai-action" : "primary"}
        size="md"
        className="ltr:ml-2.5 rtl:mr-2.5 shadow-sm font-bold shrink-0 rounded-2xl h-[46px]"
      >
        {isAIActive ? (currentLanguage === "ar" ? "توجيه ذكي" : "Ask AI") : (currentLanguage === "ar" ? "بحث" : "Search")}
      </SovereignButton>
    </form>
  );
};

// ==========================================
// 2. OTP COMPONENT
// ==========================================

interface OTPProps {
  length?: number;
  onComplete?: (code: string) => void;
  currentLanguage?: "ar" | "en";
  className?: string;
}

export const SovereignOTP: React.FC<OTPProps> = ({
  length = 4,
  onComplete,
  currentLanguage = "ar",
  className = ""
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "");
    if (!cleanVal) return;
    
    const newCode = [...code];
    newCode[index] = cleanVal.slice(-1);
    setCode(newCode);

    // Trigger complete
    if (newCode.every(item => item !== "")) {
      onComplete?.(newCode.join(""));
    }

    // Auto-focus next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      
      // Auto-focus previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`} dir="ltr">
      <div className="flex justify-center gap-3">
        {code.map((num, idx) => (
          <input
            key={idx}
            ref={(el) => {
              if (el) inputRefs.current[idx] = el;
            }}
            type="text"
            maxLength={1}
            value={num}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-12 h-14 text-center font-mono text-xl font-bold bg-white border border-gray-200 focus:border-sudan-green focus:ring-2 focus:ring-sudan-green/20 outline-none rounded-xl shadow-sm transition-all text-sudan-dark"
          />
        ))}
      </div>
      <p className="text-center text-[10px] text-gray-400 font-sans">
        {currentLanguage === "ar" 
          ? "أدخل رمز التحقق الثنائي الآمن المرسل إلى هاتفك الموثق." 
          : "Enter the secure authentication code sent to your verified device."}
      </p>
    </div>
  );
};

// ==========================================
// 3. TIMELINE & STEP INDICATOR
// ==========================================

export interface TimelineNode {
  titleAr: string;
  titleEn: string;
  date: string;
  status: "completed" | "current" | "pending";
  descAr?: string;
  descEn?: string;
}

interface TimelineProps {
  steps: TimelineNode[];
  currentLanguage?: "ar" | "en";
  className?: string;
}

export const SovereignTimeline: React.FC<TimelineProps> = ({
  steps,
  currentLanguage = "ar",
  className = ""
}) => {
  return (
    <div className={`space-y-6 relative ${className}`}>
      {/* Connector line */}
      <div className="absolute top-2 bottom-2 ltr:left-3 rtl:right-3 w-[2px] bg-gray-100" />

      {steps.map((step, idx) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";

        return (
          <div key={idx} className="relative flex items-start gap-4 ltr:pl-8 rtl:pr-8">
            {/* Status node */}
            <div 
              className={`absolute top-1 ltr:left-1 rtl:right-1 w-4 h-4 rounded-full border-2 transition-colors duration-200 z-10 flex items-center justify-center ${
                isCompleted 
                  ? "bg-sudan-green border-sudan-green" 
                  : isCurrent 
                  ? "bg-white border-sudan-gold animate-pulse" 
                  : "bg-white border-gray-200"
              }`}
            >
              {isCompleted && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SovereignTypography variant="label-lg" className="font-extrabold text-xs">
                  {currentLanguage === "ar" ? step.titleAr : step.titleEn}
                </SovereignTypography>
                <span className="text-[10px] bg-slate-100 text-gray-500 px-2 py-0.5 rounded font-mono font-bold">
                  {step.date}
                </span>
              </div>
              
              {(step.descAr || step.descEn) && (
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-lg">
                  {currentLanguage === "ar" ? step.descAr : step.descEn}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 4. PASSWORD STRENGTH METER
// ==========================================

export const SovereignPasswordStrength: React.FC<{ password?: string; currentLanguage?: "ar" | "en" }> = ({
  password = "",
  currentLanguage = "ar"
}) => {
  const getStrength = (val: string) => {
    let score = 0;
    if (val.length > 5) score++;
    if (val.length > 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const score = password ? getStrength(password) : 0;
  
  const levels = [
    { textAr: "ضعيف جداً", textEn: "Very Weak", color: "bg-rose-500", width: "w-1/5" },
    { textAr: "ضعيف", textEn: "Weak", color: "bg-red-400", width: "w-2/5" },
    { textAr: "متوسط", textEn: "Fair", color: "bg-amber-400", width: "w-3/5" },
    { textAr: "قوي", textEn: "Strong", color: "bg-emerald-500", width: "w-4/5" },
    { textAr: "سيادي آمن", textEn: "Sovereign Secure", color: "bg-sudan-green", width: "w-full" }
  ];

  const currentLevel = score > 0 ? levels[Math.min(score - 1, 4)] : null;

  return (
    <div className="space-y-1.5 font-sans">
      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
        <span>{currentLanguage === "ar" ? "قوة كلمة المرور الحكومية" : "Sovereign Password Strength"}</span>
        {currentLevel && (
          <span className="font-extrabold text-sudan-green">
            {currentLanguage === "ar" ? currentLevel.textAr : currentLevel.textEn}
          </span>
        )}
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div 
            key={idx}
            className={`h-full flex-1 transition-all duration-300 ${
              idx <= score 
                ? currentLevel?.color || "bg-gray-200" 
                : "bg-gray-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
