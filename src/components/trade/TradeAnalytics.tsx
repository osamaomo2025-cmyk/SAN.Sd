/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BarChart2, TrendingUp, Settings, Activity, ArrowLeftRight, Check, Anchor, Globe } from "lucide-react";

interface TradeAnalyticsProps {
  currentLanguage: "ar" | "en";
}

export default function TradeAnalytics({ currentLanguage }: TradeAnalyticsProps) {
  // KPI Weights State for interactive simulator
  const [speedWeight, setSpeedWeight] = useState(30);
  const [complianceWeight, setComplianceWeight] = useState(30);
  const [costWeight, setCostWeight] = useState(20);
  const [digitalWeight, setDigitalWeight] = useState(20);

  // Dynamic Calculation of overall Trade Efficiency Score
  const rawSpeed = 82; // average speed score
  const rawCompliance = 94; // compliance score
  const rawCost = 85; // cost efficiency
  const rawDigital = 96; // digital integration rate

  const totalWeights = speedWeight + complianceWeight + costWeight + digitalWeight;
  const efficiencyScore = Math.round(
    ((rawSpeed * speedWeight) +
     (rawCompliance * complianceWeight) +
     (rawCost * costWeight) +
     (rawDigital * digitalWeight)) / (totalWeights || 1)
  );

  return (
    <div id="trade-analytics-panel" className="space-y-6">
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            titleAr: "إجمالي قيمة الصادرات",
            titleEn: "Total Export Value",
            value: "2.4B USD",
            trend: "+12.4%",
            trendUp: true,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50 border-emerald-100"
          },
          {
            titleAr: "إجمالي قيمة الواردات",
            titleEn: "Total Import Value",
            value: "1.9B USD",
            trend: "-4.2%",
            trendUp: false,
            color: "text-cyan-600",
            bg: "bg-cyan-50/50 border-cyan-100"
          },
          {
            titleAr: "الميزان التجاري القومي",
            titleEn: "Net Trade Balance",
            value: "+500M USD",
            trend: "+34.5%",
            trendUp: true,
            color: "text-sudan-green",
            bg: "bg-emerald-50 border-sudan-green/20"
          },
          {
            titleAr: "زمن التخليص الجمركي",
            titleEn: "Customs Clearance",
            value: "14.2 Hours",
            trend: "-3.1h Speedup",
            trendUp: true,
            color: "text-amber-600",
            bg: "bg-amber-50/50 border-amber-100"
          },
          {
            titleAr: "مؤشر الكفاءة الوطني",
            titleEn: "National Efficiency Index",
            value: `${efficiencyScore}%`,
            trend: "Sovereign Target",
            trendUp: true,
            color: "text-sudan-gold",
            bg: "bg-sudan-gold/5 border-sudan-gold/20"
          }
        ].map((kpi, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border bg-white ${kpi.bg} shadow-xs space-y-2`}>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {currentLanguage === "ar" ? kpi.titleAr : kpi.titleEn}
            </p>
            <div className="flex items-baseline justify-between">
              <span className={`text-lg md:text-xl font-black ${kpi.color} font-mono`}>{kpi.value}</span>
              <span className={`text-[10px] font-bold ${kpi.trendUp ? "text-emerald-600" : "text-rose-500"}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Interactive KPI Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Balance Trend Bar Chart (Custom Clean SVG) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-sudan-green" />
              {currentLanguage === "ar" ? "أداء الصادرات والواردات الوطنية (2026)" : "Sovereign Trade Volumes (2026)"}
            </h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Quarterly - USD Millions</span>
          </div>

          <div className="h-64 flex flex-col justify-between pt-4">
            {/* Custom SVG Bar/Line Chart */}
            <div className="flex-1 w-full flex items-end justify-around gap-2 px-2 relative">
              {/* Chart Grid Lines */}
              <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none opacity-5 pr-1">
                <div className="border-b border-gray-400 w-full"></div>
                <div className="border-b border-gray-400 w-full"></div>
                <div className="border-b border-gray-400 w-full"></div>
                <div className="border-b border-gray-400 w-full"></div>
              </div>

              {/* Data points */}
              {[
                { label: "Q1", exp: 520, imp: 460 },
                { label: "Q2", exp: 580, imp: 420 },
                { label: "Q3", exp: 640, imp: 490 },
                { label: "Q4", exp: 660, imp: 530 }
              ].map((data, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group relative z-10 w-1/5">
                  <div className="flex items-end gap-1.5 h-44 w-full justify-center">
                    {/* Export Bar */}
                    <div 
                      style={{ height: `${(data.exp / 800) * 100}%` }}
                      className="w-5 md:w-8 bg-sudan-green rounded-t-md hover:opacity-80 transition-all duration-300 shadow-xs relative"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-sudan-green text-white text-[9px] font-bold font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.exp}M
                      </span>
                    </div>
                    {/* Import Bar */}
                    <div 
                      style={{ height: `${(data.imp / 800) * 100}%` }}
                      className="w-5 md:w-8 bg-[#C5A059] rounded-t-md hover:opacity-80 transition-all duration-300 shadow-xs relative"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-sudan-gold text-white text-[9px] font-bold font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.imp}M
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{data.label}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 border-t border-gray-100 pt-3 text-[11px] font-bold">
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 bg-sudan-green rounded-sm"></span>
                <span>{currentLanguage === "ar" ? "الصادرات السودانية" : "Sudanese Exports"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 bg-sudan-gold rounded-sm"></span>
                <span>{currentLanguage === "ar" ? "الواردات" : "Imports"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic KPI Configurator & Interactive Index */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-sudan-gold" />
            {currentLanguage === "ar" ? "محاكي أوزان كفاءة التجارة" : "Trade Efficiency Weighting"}
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {currentLanguage === "ar" 
              ? "قم بتعديل أوزان مؤشرات الأداء الحاكمة لحساب النسبة الوطنية لكفاءة الاستيراد والتصدير تلقائياً."
              : "Adjust weight parameters of governing KPIs to calculate national digital trade efficiency score dynamically."}
          </p>

          <div className="space-y-4 pt-2">
            {[
              { labelAr: "سرعة التخليص والجمركة", labelEn: "Clearance Speed", val: speedWeight, set: setSpeedWeight },
              { labelAr: "نسبة مطابقة المعايير (SSMO)", labelEn: "Standard Compliance", val: complianceWeight, set: setComplianceWeight },
              { labelAr: "معدل انخفاض التكلفة اللوجستية", labelEn: "Logistics Cost Factor", val: costWeight, set: setCostWeight },
              { labelAr: "تكامل التوقيع والشهادات الرقمية", labelEn: "Digital Certificate Ratio", val: digitalWeight, set: setDigitalWeight }
            ].map((slider, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{currentLanguage === "ar" ? slider.labelAr : slider.labelEn}</span>
                  <span className="font-mono text-sudan-green">{slider.val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider.val}
                  onChange={(e) => slider.set(Number(e.target.value))}
                  className="w-full accent-sudan-green cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">
                {currentLanguage === "ar" ? "مؤشر الكفاءة المحتسب" : "Calculated Efficiency"}
              </span>
              <span className="text-xl font-black text-sudan-green font-mono">{efficiencyScore}%</span>
            </div>
            <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
              efficiencyScore >= 90 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
            }`}>
              {efficiencyScore >= 90 
                ? (currentLanguage === "ar" ? "ممتاز سيادي" : "Sovereign Grade")
                : (currentLanguage === "ar" ? "مقبول جمركي" : "Standard Grade")}
            </span>
          </div>
        </div>
      </div>

      {/* Port & Sector Performance Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Port Sudan Logistics Performance KPI Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Anchor className="h-4.5 w-4.5 text-sudan-green" />
            {currentLanguage === "ar" ? "مؤشرات موانئ البحر الأحمر والمنافذ" : "Red Sea Port Operations Overview"}
          </h4>

          <div className="space-y-3 pt-2">
            {[
              { portAr: "ميناء بورتسودان الجنوبي (حاويات)", portEn: "Port Sudan South (Containers)", speed: "11.2 Hours", traffic: "78%", status: "optimal" },
              { portAr: "ميناء بورتسودان الشمالي (بضائع)", portEn: "Port Sudan North (Bulk)", speed: "16.5 Hours", traffic: "62%", status: "optimal" },
              { portAr: "ميناء سواكن البحري (مواشي وركاب)", portEn: "Suakin Port (Livestock & Pax)", speed: "10.8 Hours", traffic: "45%", status: "optimal" },
              { portAr: "مطار الخرطوم الدولي للشحن (جوي)", portEn: "Khartoum Air Cargo Terminal", speed: "4.5 Hours", traffic: "55%", status: "optimal" }
            ].map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? p.portAr : p.portEn}</p>
                  <p className="text-[10px] text-gray-400">
                    {currentLanguage === "ar" ? `معدل إشغال الأرصفة: ${p.traffic}` : `Berth Occupancy: ${p.traffic}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-sudan-green">{p.speed}</p>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase">{currentLanguage === "ar" ? "مستقر" : "Optimal"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Export Performance Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-4.5 w-4.5 text-sudan-gold" />
            {currentLanguage === "ar" ? "توزيع حجم الصادرات حسب القطاع الاستراتيجي" : "Sector Strategic Export Allocation"}
          </h4>

          <div className="space-y-4 pt-2">
            {[
              { sectorAr: "الصمغ العربي والمنتجات الغابية", sectorEn: "Gum Arabic & Forestry Products", ratio: 38, val: "912M USD", color: "bg-sudan-green" },
              { sectorAr: "المعادن النفيسة والذهب الخالص", sectorEn: "Precious Metals & Refined Gold", ratio: 32, val: "768M USD", color: "bg-amber-500" },
              { sectorAr: "الثروة الحيوانية والماشية الحية", sectorEn: "Livestock & Animal Resources", ratio: 18, val: "432M USD", color: "bg-indigo-600" },
              { sectorAr: "الحبوب الزيتية والمحاصيل الزراعية", sectorEn: "Oilseeds & Agricultural Cash Crops", ratio: 12, val: "288M USD", color: "bg-teal-500" }
            ].map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{currentLanguage === "ar" ? sec.sectorAr : sec.sectorEn}</span>
                  <span className="font-mono text-slate-900">{sec.val}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${sec.ratio}%` }} className={`h-full ${sec.color} rounded-full transition-all duration-1000`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
