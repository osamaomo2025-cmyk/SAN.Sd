/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, Coins, BarChart3, AlertTriangle, 
  CheckCircle, ShieldAlert, Sparkles, RefreshCw
} from "lucide-react";

interface PriceMonitorProps {
  currentLanguage: "ar" | "en";
  priceRecords: any[];
  onAddPriceRecord: (priceData: any) => Promise<any>;
}

export default function PriceMonitor({
  currentLanguage,
  priceRecords,
  onAddPriceRecord
}: PriceMonitorProps) {
  const [selectedCommodity, setSelectedCommodity] = useState<string>("wheat");
  const [isAddingPrice, setIsAddingPrice] = useState(false);

  // New Price Entry
  const [newCommodity, setNewCommodity] = useState("wheat");
  const [newState, setNewState] = useState("الخرطوم");
  const [newPriceVal, setNewPriceVal] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Market Intelligence Reports
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddPriceRecord({
        commodity: newCommodity,
        state: newState,
        price: newPriceVal,
        date: new Date().toISOString().slice(0, 10)
      });
      setIsAddingPrice(false);
      setNewPriceVal(1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAiReport = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      if (currentLanguage === "ar") {
        setAiAnalysis(
          `*** تقرير ذكاء السوق الفيدرالي - حماية المستهلك السودانية لعام 2035 ***\n\n` +
          `1. **رصد غسيل الأسعار**: تم رصد ارتفاع بنسبة **12.5%** في أسعار القمح في ولاية البحر الأحمر مقارنة بولاية الخرطوم. يعود ذلك بشكل أساسي لارتفاع تكلفة الوقود ورسوم النقل البري.\n` +
          `2. **مؤشر الإنذار المبكر**: السكر والزيوت النباتية تشهد استقراراً نسبياً بفضل السحب الفيدرالي للاحتياطي الاستراتيجي وزيادة إنتاج مصانع كنانة وعسلاية.\n` +
          `3. **توصيات الذكاء الاصطناعي**: يُنصح بتسيير دوريات ضبط قضائي إضافية لقطاع الجملة بولاية الجزيرة لوجود تباين غير مبرر في أسعار التجزئة للزيوت يعادل **18%** فوق السعر المعياري العادل.`
        );
      } else {
        setAiAnalysis(
          `*** Federal Market Intelligence Report - Sudan Vision 2035 ***\n\n` +
          `1. **Price Surge Detection**: A **12.5%** spike in wheat commodities was flagged in Red Sea State compared to Khartoum. Logistics costs are the driving variable.\n` +
          `2. **Stability Index**: Sugar and oil commodities display healthy horizontal bounds, bolstered by release of sovereign strategic food reserves.\n` +
          `3. **AI Actionable Advice**: Deploy secondary field compliance units to Gezira state wholesale distributors, due to unexplained price gaps of **18%** above Fair-Value benchmarks.`
        );
      }
    }, 1500);
  };

  // Prepare chart data comparing states
  const chartData = priceRecords
    .filter(r => r.commodity === selectedCommodity)
    .map(r => ({
      state: r.state,
      [currentLanguage === "ar" ? "السعر ج.س" : "Price (SDG)"]: r.price
    }));

  // Historical simulation for line chart (prices over recent months)
  const historicalData = [
    { date: "03/01", [currentLanguage === "ar" ? "قمح" : "Wheat"]: 950, [currentLanguage === "ar" ? "سكر" : "Sugar"]: 700, [currentLanguage === "ar" ? "زيت" : "Oil"]: 1800 },
    { date: "04/01", [currentLanguage === "ar" ? "قمح" : "Wheat"]: 1020, [currentLanguage === "ar" ? "سكر" : "Sugar"]: 750, [currentLanguage === "ar" ? "زيت" : "Oil"]: 1850 },
    { date: "05/01", [currentLanguage === "ar" ? "قمح" : "Wheat"]: 1100, [currentLanguage === "ar" ? "سكر" : "Sugar"]: 800, [currentLanguage === "ar" ? "زيت" : "Oil"]: 1900 },
    { date: "06/01", [currentLanguage === "ar" ? "قمح" : "Wheat"]: 1150, [currentLanguage === "ar" ? "سكر" : "Sugar"]: 820, [currentLanguage === "ar" ? "زيت" : "Oil"]: 1950 },
    { date: "07/01", [currentLanguage === "ar" ? "قمح" : "Wheat"]: 1200, [currentLanguage === "ar" ? "سكر" : "Sugar"]: 850, [currentLanguage === "ar" ? "زيت" : "Oil"]: 2100 }
  ];

  return (
    <div id="price-monitor-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Visual Analytics Left 2 Columns */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Interactive Recharts */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5 text-sudan-green" />
                {currentLanguage === "ar" ? "مقارنة أسعار السلع عبر الولايات" : "Commodity Prices Across Sudan States"}
              </h4>
              <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "مؤشر الرصد الفيدرالي اليومي" : "Federal daily commodity tracking benchmark"}</p>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="bg-[#F4F6F5] border border-gray-200 text-xs px-3 py-1.5 rounded-xl font-bold"
              >
                <option value="wheat">{currentLanguage === "ar" ? "القمح الفيدرالي" : "Federal Wheat"}</option>
                <option value="sugar">{currentLanguage === "ar" ? "السكر الأبيض" : "White Sugar"}</option>
                <option value="oil">{currentLanguage === "ar" ? "زيت طعام نباتي" : "Vegetable Cooking Oil"}</option>
              </select>
              <button
                onClick={() => setIsAddingPrice(true)}
                className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                {currentLanguage === "ar" ? "تحديث سعر" : "Update Price"}
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fontSize: 10, fontWeight: 700 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0" }} />
                <Bar 
                  dataKey={currentLanguage === "ar" ? "السعر ج.س" : "Price (SDG)"} 
                  fill="#007A33" 
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Price Trend line */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-sudan-green" />
              {currentLanguage === "ar" ? "مؤشر تضخم وحركة أسعار السلع الموحد" : "Consolidated Inflation & Price Trends"}
            </h4>
            <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "تتبع المؤشرات التراكمية في الأسواق" : "Cumulative historical marketplace trends"}</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 800 }} />
                <Line type="monotone" dataKey={currentLanguage === "ar" ? "قمح" : "Wheat"} stroke="#007A33" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey={currentLanguage === "ar" ? "سكر" : "Sugar"} stroke="#D2A02E" strokeWidth={3} />
                <Line type="monotone" dataKey={currentLanguage === "ar" ? "زيت" : "Oil"} stroke="#0F2C1C" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Market intelligence Right Column */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Statistics highlights */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "مؤشرات الغش والتلاعب بالتسعيرة" : "Sovereign Market Indicators"}</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-800">{currentLanguage === "ar" ? "معدل الإلتزام الفيدرالي" : "Benchmark Compliance"}</p>
              <p className="text-xl font-black text-sudan-green mt-1">94.2%</p>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100">
              <p className="text-[10px] font-bold text-rose-800">{currentLanguage === "ar" ? "نسبة الفروقات الشاذة" : "Surge Alerts"}</p>
              <p className="text-xl font-black text-rose-700 mt-1">3.1%</p>
            </div>
          </div>
        </div>

        {/* AI Market Analysis */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(#ffffff_15%,transparent_15%)] [background-size:12px_12px] opacity-10"></div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500 rounded-lg text-slate-950 animate-pulse">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-400">{currentLanguage === "ar" ? "الذكاء الاصطناعي السيادي لرصد الأسواق" : "Sovereign AI Market Surveillance"}</h4>
              <p className="text-[9px] text-slate-400">{currentLanguage === "ar" ? "فحص وتحليل تباين الأسعار واكتشاف الاحتكار" : "Anti-Monopoly and price-gouging predictive intelligence"}</p>
            </div>
          </div>

          {aiAnalysis ? (
            <div className="space-y-3">
              <div className="bg-slate-800/80 p-4 rounded-2xl text-[11px] leading-relaxed font-sans text-slate-300 border border-slate-700 whitespace-pre-line">
                {aiAnalysis}
              </div>
              <button
                onClick={() => setAiAnalysis(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black py-2 rounded-xl cursor-pointer"
              >
                {currentLanguage === "ar" ? "تحديث الفحص" : "Clear & Refresh Report"}
              </button>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <Coins className="h-12 w-12 text-slate-700 mx-auto animate-bounce" />
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                {currentLanguage === "ar" 
                  ? "توليد تقرير استخباري رقمي ذكي يحلل أسعار السلع بجميع الولايات السودانية الـ18 ويوصي بتدخلات الرقابة."
                  : "Generate a federal smart report examining pricing anomalies across all 18 states."}
              </p>
              <button
                onClick={generateAiReport}
                disabled={isGeneratingAi}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer shadow transition-all disabled:opacity-50"
              >
                {isGeneratingAi ? (currentLanguage === "ar" ? "جاري التحليل والمطابقة..." : "Analyzing markets...") : (currentLanguage === "ar" ? "تحليل ذكي لأسواق السودان" : "Generate Market Intel Report")}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Add Price Entry Modal */}
      {isAddingPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-slate-700 text-xs space-y-4">
            <h3 className="font-black text-sm">{currentLanguage === "ar" ? "تحديث السعر المرجعي اليومي" : "Update Daily Price Benchmark"}</h3>
            <form onSubmit={handleAddPrice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold">{currentLanguage === "ar" ? "السلعة الأساسية *" : "Commodity *"}</label>
                <select value={newCommodity} onChange={(e) => setNewCommodity(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl">
                  <option value="wheat">القمح الفيدرالي</option>
                  <option value="sugar">السكر الأبيض</option>
                  <option value="oil">زيت طعام نباتي</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold">{currentLanguage === "ar" ? "الولاية السودانية *" : "State *"}</label>
                <input type="text" required value={newState} onChange={(e) => setNewState(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold">{currentLanguage === "ar" ? "متوسط السعر الفعلي بالأسواق (ج.س) *" : "Average Market Price (SDG) *"}</label>
                <input type="number" required value={newPriceVal} onChange={(e) => setNewPriceVal(parseInt(e.target.value, 10) || 0)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
              </div>
              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddingPrice(false)} className="bg-slate-100 px-4 py-2 rounded-xl">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" disabled={isSubmitting} className="bg-sudan-green text-white px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "حفظ وتعديل" : "Save Price"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
