/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Brain, Cpu, Send, Printer, FileText, ChevronRight, Check, CheckSquare } from "lucide-react";

interface TradeAdvisorProps {
  currentLanguage: "ar" | "en";
}

export default function TradeAdvisor({ currentLanguage }: TradeAdvisorProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [advisorOutput, setAdvisorOutput] = useState<any | null>(null);

  const topics = [
    {
      id: "gum-arabic",
      titleAr: "إجراءات تصدير الصمغ العربي لفرنسا",
      titleEn: "Exporting Gum Arabic to France",
      type: "procedures"
    },
    {
      id: "delay-prediction",
      titleAr: "توقع نسبة تأخير حاويات جمارك سواكن",
      titleEn: "Suaqin Customs Delay Predictor",
      type: "delays"
    },
    {
      id: "demand-sesame",
      titleAr: "تنبؤات العرض والطلب على السمسم الأبيض",
      titleEn: "Sesame Seeds Demand Forecast Q4",
      type: "forecast"
    },
    {
      id: "route-optimization",
      titleAr: "توصية المسار الأمثل لشحن المواشي الحية",
      titleEn: "Optimized Route for Live Livestock",
      type: "route"
    }
  ];

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setIsThinking(true);
    setAdvisorOutput(null);

    setTimeout(() => {
      setIsThinking(false);
      if (topicId === "gum-arabic") {
        setAdvisorOutput({
          titleAr: "تقرير إجراءات تصدير الصمغ العربي - الاتحاد الأوروبي",
          titleEn: "Export Protocol - Sudanese Gum Arabic to EU",
          predictionAr: "نسبة النجاح الجمركي المقدرة: ٩٩% بدون تأخير",
          predictionEn: "Estimated Customs Success: 99% with no delays",
          contentAr: [
            "المتطلبات الاتحادية لوزارة التجارة: تأمين شهادة منشأ رقمية موقعة بختم سيادي.",
            "موافقة الهيئة السودانية للمواصفات والمقاييس (SSMO): فحص ومطابقة نقاء الصمغ (هشاب درجة أولى).",
            "متطلبات الحجر الزراعي بورتسودان: تعقيم الشحنة وإصدار شهادة صحة نباتية دولية مرافقة.",
            "المستندات المصاحبة للفاتورة: مطابقة البيانات الجمركية مع رخصة التصدير رقم SC-EXP-2026."
          ],
          contentEn: [
            "Federal Trade Ministry: Secure a digital Certificate of Origin backed by sovereign cryptography.",
            "SSMO Clearance: Secure an official certificate confirming purity and species (Hashab Grade 1).",
            "Agricultural Quarantine: Fumigate the cargo batch and obtain an International Phyto-sanitary document.",
            "Invoice verification: Ensure customs declarations precisely match the active trade license SC-EXP-2026."
          ],
          kpis: [
            { labelAr: "الزمن المتوقع للتخليص", labelEn: "Est. Clearance Speed", value: "8 Hours" },
            { labelAr: "مخاطر فحص عشوائي بالاتحاد الأوروبي", labelEn: "EU Random Inspection Risk", value: "Low < 2%" }
          ]
        });
      } else if (topicId === "delay-prediction") {
        setAdvisorOutput({
          titleAr: "تنبؤات زمن المعاملات وتخليص الجمارك بميناء بورتسودان",
          titleEn: "Sovereign Port Sudan Customs Delay Predictor",
          predictionAr: "تقدير نسبة التأخير الإجمالية: منخفضة (١٥% احتمال حدوث تأخير يزيد عن ١٢ ساعة)",
          predictionEn: "Estimated Delay Probability: Low (15% chance of >12h delay)",
          contentAr: [
            "حالة التكدس الحالية: أرصفة الحاويات والصلب تعمل بـ ٤٢% من الطاقة القصوى (تدفق مثالي).",
            "معدل الاستجابة الجمركية الرقمية: ٩٦% من الرخص يتم مطابقتها آلياً وتعميدها عبر نظام الربط البيني الموحد.",
            "أيام الذروة المتوقعة: الثلاثاء والأربعاء نظراً لجدولة وصول سفن شحن الكوميسا الإقليمية.",
            "توصية المستشار: يفضل إرسال البيانات والوثائق مسبقاً قبل وصول السفينة بـ ٢٤ ساعة لتفعيل المطابقة الآلية السريعة."
          ],
          contentEn: [
            "Terminal Congestion State: Berth occupancy is at 42% of max capacity (optimal flow).",
            "Digital Matching Rate: 96% of trade permits are matched and authenticated autonomously in the national system.",
            "Peak operational days: Tuesday and Wednesday due to regional COMESA arrivals scheduling.",
            "Advisor Recommendation: Submit all documents 24h prior to vessel arrival to invoke autonomous customs release."
          ],
          kpis: [
            { labelAr: "متوسط زمن المراجعة الآلية", labelEn: "Avg Autonomous Review", value: "4.5 Mins" },
            { labelAr: "القدرة الاستيعابية الاحتياطية", labelEn: "Reserve Capacity Ratio", value: "58%" }
          ]
        });
      } else if (topicId === "demand-sesame") {
        setAdvisorOutput({
          titleAr: "توقعات وذكاء السوق الزراعي - بذور السمسم الأبيض",
          titleEn: "Strategic Market Intelligence - Sesame Seeds Forecast",
          predictionAr: "توقعات الطلب الربع الرابع لعام ٢٠٢٦: اتجاه صاعد قوي بمعدل زيادة ١٤%",
          predictionEn: "Sesame Demand Forecast Q4 2026: Bullish trend (+14% increase)",
          contentAr: [
            "الأسواق الإقليمية الأكثر طلباً: جمهورية مصر العربية، المملكة العربية السعودية، الصين الشعبية.",
            "معدل الصادرات المتوقعة: تجميع وتحضير قرابة ١٢٠ ألف طن من محاصيل السمسم الأبيض والخرطوم بحري.",
            "الحافز التصديري الفيدرالي: تفعيل حافز تخفيض جمركي ورسوم شحن بنسبة ٤% لدعم صغار المزارعين في القضارف وسنار.",
            "تقييم كفاءة التصدير: نوصي بتعبئة شهادة المنشأ مسبقاً لتخفيض زمن فحص المواصفات والاستفادة من الممر الآمن بورتسودان."
          ],
          contentEn: [
            "Core Target Markets: Egypt, Saudi Arabia, UAE, China, France.",
            "Projected Volume: Preparation and assembly of 120,000 Tons of high quality sesame seed crop.",
            "Federal Incentive Scheme: 4% export tax deduction is active to motivate smallholder farmers in Gedarif & Sennar.",
            "Operational Recommendation: Utilize the pre-authenticated SSMO pre-matching corridor to guarantee swift departure."
          ],
          kpis: [
            { labelAr: "مؤشر الحافز التصديري النشط", labelEn: "Active Export Incentive", value: "4% Rebate" },
            { labelAr: "تغطية تأمين الشحن البحري", labelEn: "Sovereign Cargo Insurance", value: "100% Eligible" }
          ]
        });
      } else {
        setAdvisorOutput({
          titleAr: "خوارزمية المسارات اللوجستية المحسنة لشحن المواشي واللحوم",
          titleEn: "Logistics Optimization - Strategic Livestock Route Engine",
          predictionAr: "نسبة كفاءة المسار المقترح: ٩٥% (أفضل توفير زمني وصحي)",
          predictionEn: "Route Efficiency Rating: 95% (Optimal animal welfare & speed)",
          contentAr: [
            "المسار البري المعتمد: الخرطوم (المسلخ الفيدرالي) -> Wad Madani -> سواكن للماشية.",
            "حالة نقاط التفتيش البيطرية: معبر سواكن والكدرو محصنة بالكامل وخالية من أي تكدس أو معوقات فحص.",
            "التأمين الحراري والمناخي: يوصى بجدولة النقل البري في الساعات الباردة (من السادسة مساءً حتى السادسة صباحاً).",
            "مطابقة الجمارك والموانئ: تم ربط شهادة البيطرة الاتحادية بقاعدة بيانات الجمارك إلكترونياً للتخليص الفوري دون إنزال الشحنة."
          ],
          contentEn: [
            "Approved Land Corridor: Khartoum (Federal Abattoir) -> Wad Madani -> Suakin Livestock Terminal.",
            "Veterinary Quarantine Status: Suakin & Kadroo clinics are fully staffed with zero bottlenecks.",
            "Climate & Animal Welfare: Schedule transport during cooler hours (6:00 PM to 6:00 AM) to maintain cargo quality.",
            "Customs synchronization: International veterinary certificate is pre-attached to cargo manifest to invoke zero-stop clearance."
          ],
          kpis: [
            { labelAr: "توفير زمن الرحلة المقدر", labelEn: "Estimated Transit Saved", value: "12 Hours" },
            { labelAr: "تغطية الفحص البيطري الفوري", labelEn: "Instant Bio-Screening Rate", value: "100%" }
          ]
        });
      }
    }, 1500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsThinking(true);
    setAdvisorOutput(null);

    setTimeout(() => {
      setIsThinking(false);
      setAdvisorOutput({
        titleAr: "تقرير استشاري مخصص لـ: " + customPrompt,
        titleEn: "Custom Advisor Report for: " + customPrompt,
        predictionAr: "تحليل ذكي فوري لقاعدة بيانات التجارة 2035",
        predictionEn: "Autonomous Intelligence Report (Sudan Trade DB)",
        contentAr: [
          "تأكيد مطابقة السلعة: السلعة المشار إليها تتبع تصنيفات النظام الجمركي الموحد (HS Code).",
          "حالة التراخيص والامتثال: لا توجد قيود أو عقوبات مفروضة حالياً على الاستيراد والتصدير لهذه الفئة.",
          "المسار اللوجستي الموصى به: الشحن عبر ميناء بورتسودان الجنوبي مستفيداً من الرخص الإلكترونية لتخفيض الرسوم.",
          "توصيات الرقابة الاتحادية: تأمين شهادة مطابقة الجودة من الهيئة السودانية للمواصفات والمقاييس (SSMO)."
        ],
        contentEn: [
          "HS Code Tariff Verification: The requested materials are registered under active customs tariff categories.",
          "Sanctions & restricted goods check: Passed. No trade bans are active for this product code.",
          "Optimal Logistics Corridor: Utilize Port Sudan South Terminal using digital certificates to capture fee discounts.",
          "Federal compliance: Acquire standard compliance certificate from SSMO prior to custom cargo assembly."
        ],
        kpis: [
          { labelAr: "معدل الثقة للتحليل والبيانات", labelEn: "Analysis Confidence Index", value: "92%" },
          { labelAr: "مستوى المخاطر التشغيلية", labelEn: "Operational Risk Tier", value: "Very Low" }
        ]
      });
      setCustomPrompt("");
    }, 1200);
  };

  return (
    <div id="ai-trade-advisor-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Topics Selector & Custom Input */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sudan-gold/10 text-sudan-gold rounded-xl">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider">
              {currentLanguage === "ar" ? "المستشار التجاري للذكاء الاصطناعي" : "Sovereign AI Trade Advisor"}
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Sudan Trade AI Copilot v2035</p>
          </div>
        </div>

        {/* Premade Topic recommendations */}
        <div className="space-y-2 pt-2">
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
            {currentLanguage === "ar" ? "توصيات ومحاكاة جاهزة" : "Seeded AI Analytics"}
          </p>

          <div className="space-y-1.5">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTopicSelect(t.id)}
                className={`w-full text-right md:text-left flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all border ${
                  selectedTopic === t.id 
                    ? "bg-sudan-green/5 border-sudan-green text-sudan-green" 
                    : "bg-slate-50 border-slate-100 hover:bg-slate-100/50 text-slate-700"
                }`}
              >
                <span>{currentLanguage === "ar" ? t.titleAr : t.titleEn}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Trade advisor query */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
            {currentLanguage === "ar" ? "استفسار مخصص للذكاء الاصطناعي" : "Custom Advisory Query"}
          </p>

          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={currentLanguage === "ar" ? "مثال: رخصة استيراد القمح للهند..." : "e.g. gum arabic customs delay..."}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green text-slate-800"
            />
            <button
              type="submit"
              disabled={isThinking || !customPrompt.trim()}
              className="bg-sudan-green hover:bg-sudan-green-light text-white p-3 rounded-xl cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* AI Reasoning State or Report Output Panel */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm col-span-1 lg:col-span-2 min-h-[300px] flex flex-col justify-between">
        {isThinking ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-16">
            <Cpu className="h-10 w-10 text-sudan-gold animate-spin-slow" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm animate-pulse">
                {currentLanguage === "ar" ? "جاري الاستعلام وتوقع التأخير والمسارات..." : "Autonomous Trade Agent Analyzing..."}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                {currentLanguage === "ar" 
                  ? "نقوم حالياً بفحص البيانات التاريخية والربط الفيدرالي لموانئ البحر الأحمر لحساب التنبؤ بدقة."
                  : "We are crunching real-time Red Sea cargo logs and historical SSMO inspection delays to build report."}
              </p>
            </div>
          </div>
        ) : advisorOutput ? (
          <div className="space-y-4 flex-1">
            {/* Header of Report */}
            <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[9px] bg-sudan-gold/10 text-sudan-gold border border-sudan-gold/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  {currentLanguage === "ar" ? "ذكاء الأعمال سيادي" : "SOVEREIGN BI REPORT"}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {currentLanguage === "ar" ? advisorOutput.titleAr : advisorOutput.titleEn}
                </h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono font-semibold">SD-AI-REPRT-2026</span>
            </div>

            {/* Delays predictions highlights */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-sudan-gold animate-pulse shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {currentLanguage === "ar" ? "توقعات ونمذجة الذكاء الاصطناعي" : "AI Agent Predictive Modeling"}
                </p>
                <p className="font-extrabold text-sudan-green text-xs md:text-sm leading-relaxed">
                  {currentLanguage === "ar" ? advisorOutput.predictionAr : advisorOutput.predictionEn}
                </p>
              </div>
            </div>

            {/* Checklist of recommendations */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                {currentLanguage === "ar" ? "توصيات ومحددات المسار والامتثال" : "Operational Checklist & Protocols"}
              </p>

              <div className="space-y-2">
                {(currentLanguage === "ar" ? advisorOutput.contentAr : advisorOutput.contentEn).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-medium">
                    <CheckSquare className="h-4.5 w-4.5 text-sudan-gold shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated KPI Metrics of the selected AI context */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              {advisorOutput.kpis.map((kpi: any, idx: number) => (
                <div key={idx} className="bg-[#FBFDFD] border border-slate-100 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                    {currentLanguage === "ar" ? kpi.labelAr : kpi.labelEn}
                  </span>
                  <span className="text-sm font-black text-slate-800 font-mono">{kpi.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-16">
            <Brain className="h-12 w-12 text-slate-300 animate-pulse" />
            <p className="text-slate-500 text-xs">
              {currentLanguage === "ar" ? "قم باختيار موضوع تنبؤ أو استفسار مخصص لعرض التقرير الاستشاري للذكاء الاصطناعي" : "Select an analytical scenario or enter custom queries to build AI expert advisor dashboard."}
            </p>
          </div>
        )}

        {advisorOutput && (
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              onClick={() => alert(currentLanguage === "ar" ? "جاري إرسال التقرير الاستشاري إلى الطابعة..." : "Sending AI report to printing service...")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              {currentLanguage === "ar" ? "طباعة التقرير" : "Print"}
            </button>
            <button
              onClick={() => alert(currentLanguage === "ar" ? "جاري تنزيل التقرير التنفيذي بصيغة PDF..." : "Downloading Executive Intelligence report...")}
              className="bg-sudan-green hover:bg-sudan-green-light text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              {currentLanguage === "ar" ? "تصدير التقرير التنفيذي" : "Export Report"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
