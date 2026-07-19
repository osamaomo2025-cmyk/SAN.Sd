/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Compass, TrendingUp, Cpu, Users, Award, ShieldAlert, Sparkles, RefreshCw, BarChart2, PieChart } from "lucide-react";

interface Metric {
  id: string;
  metricAr: string;
  metricEn: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

interface DigitalEconomyObservatoryProps {
  currentLanguage: "ar" | "en";
  metrics: Metric[];
}

export default function DigitalEconomyObservatory({ currentLanguage, metrics }: DigitalEconomyObservatoryProps) {
  const [aiReport, setAiReport] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState(false);

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />;
    return <TrendingUp className="h-4.5 w-4.5 text-gray-400 rotate-90" />;
  };

  const runAiAnalytics = async () => {
    setLoadingReport(true);
    setAiReport("");
    try {
      const response = await fetch("/api/commerce/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "قم بإجراء تحليل شامل للأثر الكلي للمؤشرات الرقمية الوطنية وتقديم استشراف ذكي لـ رؤية ٢٠٣٥.",
          contextType: "forecasting",
          businessesCount: metrics.length
        })
      });
      const data = await response.json();
      setAiReport(data.text || "");
    } catch (err) {
      console.error(err);
      setAiReport(currentLanguage === "ar" ? "فشل النظام في تشغيل محاكاة مستشار الذكاء الاصطناعي." : "Failed to connect to the Sovereign AI Agent.");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top statistics overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div key={m.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                {currentLanguage === "ar" ? "مؤشر الأداء الوطني الرقمي" : "Sovereign Digital KPI"}
              </span>
              <h5 className="font-extrabold text-[#1E293B] text-xs md:text-sm">
                {currentLanguage === "ar" ? m.metricAr : m.metricEn}
              </h5>
              
              <div className="flex items-baseline gap-1.5 pt-2">
                <span className="font-mono text-xl md:text-2xl font-extrabold text-slate-900">
                  {m.value.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  {m.unit}
                </span>
              </div>

              <div className="text-[10px] text-gray-400 font-semibold pt-1">
                {currentLanguage === "ar" 
                  ? `الهدف المستهدف: ${m.target}${m.unit === "%" ? "%" : ""}` 
                  : `Vision 2035 Target: ${m.target}${m.unit === "%" ? "%" : ""}`}
              </div>
            </div>

            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-150">
              {getTrendIcon(m.trend)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progress Gauges Panel */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-5 md:p-6 space-y-5">
          <h4 className="font-extrabold text-slate-800 text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <BarChart2 className="h-4.5 w-4.5 text-sudan-green" />
            <span>{currentLanguage === "ar" ? "مستويات الامتثال والإنجاز لرؤية التحول ٢٠٣٥" : "National Digital Economy Target Alignment"}</span>
          </h4>

          <div className="space-y-4">
            {metrics.map((m) => {
              const pct = Math.min((m.value / m.target) * 100, 100);
              return (
                <div key={m.id} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-700">{currentLanguage === "ar" ? m.metricAr : m.metricEn}</span>
                    <span className="text-sudan-green font-mono">{pct.toFixed(1)}%</span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      className="h-full bg-sudan-green rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Economic Analysis Panel */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-5 md:p-6 space-y-4 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,114,41,0.15),transparent_50%)] pointer-events-none"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-sudan-gold/20 text-sudan-gold border border-sudan-gold/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{currentLanguage === "ar" ? "استشراف الذكاء الاصطناعي السيادي" : "Sovereign AI forecasting agent"}</span>
            </div>

            <h4 className="font-extrabold text-white text-sm md:text-base">
              {currentLanguage === "ar" ? "التحليل الاستشرافي الكلي للذكاء الاصطناعي" : "AI Predictive Economic Forecasting"}
            </h4>

            <p className="text-slate-400 text-xs leading-relaxed">
              {currentLanguage === "ar" 
                ? "تفعيل النمذجة المتقدمة من Gemini لفحص مؤشرات السجل التجاري الوطني وعوائد المتاجر للتنبؤ بنسب النمو الكلي للناتج القومي الرقمي."
                : "Initiates advanced Gemini analytical modeling to examine commercial registries and output digital GDP forecast targets."}
            </p>

            {aiReport && (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl max-h-60 overflow-y-auto text-slate-300 font-medium text-xs leading-relaxed space-y-2 whitespace-pre-line text-right">
                {aiReport}
              </div>
            )}
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={runAiAnalytics}
              disabled={loadingReport}
              className="w-full bg-[#FFD700] hover:bg-[#FFC800] text-slate-950 text-xs font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {loadingReport ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>{currentLanguage === "ar" ? "جاري تشغيل محاكاة التنبؤ والتحليل..." : "Running Sovereign Models..."}</span>
                </>
              ) : (
                <>
                  <Cpu className="h-4 w-4 text-slate-950" />
                  <span>{currentLanguage === "ar" ? "تشغيل تقرير استشراف الذكاء الاصطناعي الكلي" : "Execute AI Macro Economic Analysis"}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
