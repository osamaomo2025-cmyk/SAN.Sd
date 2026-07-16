/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Award, BookOpen, Star, Target, Users, MapPin, 
  DollarSign, Briefcase, Plus, Send, CheckCircle, 
  Sparkles, ShieldAlert, Cpu, Heart, Check, X 
} from "lucide-react";
import { SmeProgram, StartupRecord, CommerceUserRole } from "./CommerceTypes";

interface SmeProgramsProps {
  currentLanguage: "ar" | "en";
  programs: SmeProgram[];
  startups: StartupRecord[];
  onAddStartup: (startup: any) => void;
  onApplyProgram: (progId: string) => void;
  userRole: CommerceUserRole;
}

export default function SmePrograms({
  currentLanguage,
  programs,
  startups,
  onAddStartup,
  onApplyProgram,
  userRole
}: SmeProgramsProps) {
  const [subTab, setSubTab] = useState<"sme" | "startups" | "challenges">("sme");
  const [isStartupRegisterOpen, setIsStartupRegisterOpen] = useState(false);

  // New Startup form state
  const [startupName, setStartupName] = useState("");
  const [founder, setFounder] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [industry, setIndustry] = useState("FinTech");
  const [fundingStage, setFundingStage] = useState<"pre-seed" | "seed" | "series-a" | "bootstrapped">("seed");
  const [investmentAmount, setInvestmentAmount] = useState("");

  const handleRegisterStartup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupName || !founder || !descAr || !descEn) {
      alert(currentLanguage === "ar" ? "يرجى ملء جميع البيانات المطلوبة" : "Please fill in all required fields");
      return;
    }

    const newStartup: StartupRecord = {
      id: `st-${Date.now()}`,
      name: startupName,
      founder,
      descriptionAr: descAr,
      descriptionEn: descEn,
      industry,
      fundingStage,
      status: "incubating",
      survivalYears: 1,
      investmentAmount: Number(investmentAmount) || 0,
      registeredAt: new Date().toISOString()
    };

    onAddStartup(newStartup);
    setIsStartupRegisterOpen(false);

    // Reset fields
    setStartupName("");
    setFounder("");
    setDescAr("");
    setDescEn("");
    setInvestmentAmount("");
  };

  const challenges = [
    {
      id: "ch-1",
      titleAr: "تحدي تسييل وتصدير الصمغ العربي الرقمي",
      titleEn: "Gum Arabic Supply Chain Digitalization Challenge",
      descAr: "ابتكار تطبيق أو نموذج برمجي لربط صغار المنتجين بموانئ التصدير والجمارك لتقليل الفاقد وتوفير تتبع كامل.",
      descEn: "Inventing software pipelines to link local farmers directly to maritime shipping terminals, improving transparency.",
      prizeAr: "١٥,٠٠٠,٠٠٠ جنيه منحة فيدرالية نقدية + تفعيل فوري",
      prizeEn: "15,000,000 SDG Cash Grant + Direct Government Contract",
      deadline: "2026-09-30"
    },
    {
      id: "ch-2",
      titleAr: "جائزة التمويل الأصغر الرقمي لدعم المرأة المنتجة",
      titleEn: "Digital Micro-Financing & Female Entrepreneurship Award",
      descAr: "حلول لتسهيل قروض وتبرعات جماعية وتجارة إلكترونية للنساء العاملات من المنازل بالريف السوداني.",
      descEn: "Solutions to foster peer-to-peer microloans and digital retail avenues for rural female cottage industries.",
      prizeAr: "١٠,٠٠٠,٠٠٠ جنيه دعم رأسمالي مصاحب",
      prizeEn: "10,000,000 SDG Seed Investment Capital",
      deadline: "2026-10-15"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Sub-Navigation Buttons */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "sme", labelAr: "برامج تنمية ودعم المشاريع (SME)", labelEn: "SME Development Programs", icon: Award },
          { id: "startups", labelAr: "منظومة الشركات الناشئة والابتكار", labelEn: "Startup Ecosystem & Incubators", icon: Cpu },
          { id: "challenges", labelAr: "تحديات الابتكار الوطني والجوائز", labelEn: "National Innovation Challenges", icon: Target }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isSelected = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap ${
                isSelected 
                  ? "border-sudan-green text-sudan-green font-extrabold bg-sudan-green/5 rounded-t-xl" 
                  : "border-transparent text-gray-400 hover:text-gray-800"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* SME DEVELOPMENT TAB */}
      {subTab === "sme" && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,114,41,0.15),transparent)] pointer-events-none"></div>
            <div className="space-y-1 relative z-10">
              <h3 className="font-extrabold text-base md:text-lg">
                {currentLanguage === "ar" ? "بوابة تنمية المشاريع الصغيرة والمتوسطة الموحدة" : "Unified Federal SME Development Hub"}
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl font-medium leading-relaxed">
                {currentLanguage === "ar" 
                  ? "سجل مشروعك، قدم على منح التجهيز الرقمي الفيدرالية، وشارك في تدريبات رواد الأعمال لرفع القدرة التصديرية."
                  : "Register your commercial trade project, apply for digital setup grants, and obtain certifications to expand COMESA export volume."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <div 
                key={prog.id}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:border-sudan-green"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      prog.type === "grant" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      prog.type === "accelerator" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                      prog.type === "incubation" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {currentLanguage === "ar" ? 
                        (prog.type === "grant" ? "منحة مالية" : prog.type === "accelerator" ? "مسرعة أعمال" : prog.type === "incubation" ? "حاضنة أعمال" : "مهارات وتدريب") : 
                        prog.type.toUpperCase()
                      }
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {currentLanguage === "ar" ? `المسجلون: ${prog.registeredCount}` : `Enrolled: ${prog.registeredCount}`}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-snug">
                      {currentLanguage === "ar" ? prog.titleAr : prog.titleEn}
                    </h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {currentLanguage === "ar" ? prog.descriptionAr : prog.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed text-slate-500">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "الراعي الرسمي" : "Sponsor"}</p>
                      <p className="font-bold text-slate-800">{prog.sponsor}</p>
                    </div>
                    {prog.fundingAmount > 0 && (
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "قيمة الدعم المالي" : "Grant Amount"}</p>
                        <p className="font-mono font-bold text-emerald-600">{prog.fundingAmount.toLocaleString()} SDG</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "معايير الأهلية والمطابقة" : "Eligibility Criteria"}</p>
                    <p className="font-semibold text-slate-600 text-[11px] mt-0.5">
                      {currentLanguage === "ar" ? prog.eligibilityCriteriaAr : prog.eligibilityCriteriaEn}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      onApplyProgram(prog.id);
                      alert(currentLanguage === "ar" ? "تم إرسال مستندات المطابقة والهوية الموحدة للتسجيل في هذا البرنامج الفيدرالي" : "Sovereign application packet dispatched successfully");
                    }}
                    className="bg-[#1E293B] hover:bg-slate-800 text-white text-[10px] font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "تقديم طلب اشتراك سريع" : "Apply & Integrate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STARTUP ECOSYSTEM TAB */}
      {subTab === "startups" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
                {currentLanguage === "ar" ? "سجل الشركات التقنية والابتكار الوطني" : "National Technology Startup Registry"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {currentLanguage === "ar" 
                  ? "تتبع ورصد الشركات الريادية عالية النمو، مطابقة التمويل والمستثمرين، وإحصائيات الاستمرار والنمو."
                  : "Track high-growth tech ventures, match seed investments, and observe sovereign startup survivability indexes."}
              </p>
            </div>

            <button
              onClick={() => setIsStartupRegisterOpen(true)}
              className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? "تسجيل شركة ناشئة" : "Register Tech Startup"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((st) => (
              <div 
                key={st.id}
                className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:border-sudan-green"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2.5 py-0.5 rounded-md border border-slate-200 uppercase">
                      {st.fundingStage}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                      {st.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#1E293B] text-base">
                      {st.name}
                    </h4>
                    <p className="text-[10px] text-sudan-gold font-bold uppercase tracking-wider mt-1">
                      {currentLanguage === "ar" ? `قطاع الابتكار: ${st.industry}` : `Industry: ${st.industry}`} • {currentLanguage === "ar" ? `مؤسس: ${st.founder}` : `Founder: ${st.founder}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
                      {currentLanguage === "ar" ? st.descriptionAr : st.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] leading-relaxed text-slate-500">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "إجمالي التمويل" : "Funding Secured"}</p>
                      <p className="font-mono font-bold text-slate-800">{st.investmentAmount.toLocaleString()} SDG</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "سنوات التأسيس" : "Est. Age (Years)"}</p>
                      <p className="font-bold text-slate-800">{st.survivalYears} {currentLanguage === "ar" ? "أعوام" : "Years"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">
                    {new Date(st.registeredAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => alert(currentLanguage === "ar" ? "تم إرسال بروفايل الشركة الاستثماري لشركاء التمويل الإقليميين بالكوميسا" : "Startup dispatch to regional investors initiated")}
                    className="bg-slate-50 hover:bg-slate-100 text-[#1E293B] text-[10px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "مطابقة الاستثمار" : "Investor Matching"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHALLENGES TAB */}
      {subTab === "challenges" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((ch) => (
              <div 
                key={ch.id}
                className="bg-white border-2 border-dashed border-gray-200 hover:border-sudan-green rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {currentLanguage === "ar" ? "تحدي سيادي مفتوح" : "Active Challenge"}
                    </span>
                    <span className="text-[10px] text-rose-500 font-bold">
                      {currentLanguage === "ar" ? `الموعد النهائي: ${ch.deadline}` : `Deadline: ${ch.deadline}`}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#1E293B] text-base leading-snug">
                      {currentLanguage === "ar" ? ch.titleAr : ch.titleEn}
                    </h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {currentLanguage === "ar" ? ch.descAr : ch.descEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 p-3 bg-sudan-gold/5 border-2 border-sudan-gold/20 rounded-2xl">
                    <p className="text-[9px] text-sudan-gold font-bold uppercase tracking-wider">{currentLanguage === "ar" ? "قيمة المكافأة الوطنية للمركز الأول" : "Sovereign Winner Prize"}</p>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">
                      {currentLanguage === "ar" ? ch.prizeAr : ch.prizeEn}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => alert(currentLanguage === "ar" ? "تم فتح بوابة تقديم مقترحات الابتكار والتطوير التجاري" : "Proposal upload terminal opened")}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "تقديم مقترح الابتكار" : "Submit Proposal"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Register Startup Overlay Dialog */}
      {isStartupRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full text-slate-800 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
              <h3 className="font-bold text-base">
                {currentLanguage === "ar" ? "تسجيل شركة ابتكار ناشئة بالدليل الوطني" : "National Startup Registry Form"}
              </h3>
              <button onClick={() => setIsStartupRegisterOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterStartup} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم الشركة الناشئة *" : "Startup Name *"}</label>
                  <input
                    type="text"
                    required
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="e.g. NileTrack Solutions"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المؤسس الرئيسي *" : "Founder Name *"}</label>
                  <input
                    type="text"
                    required
                    value={founder}
                    onChange={(e) => setFounder(e.target.value)}
                    placeholder="م. محمد عثمان"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "مجال التقنية/الصناعة *" : "Tech Sector *"}</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  >
                    <option value="FinTech">FinTech (التقنية المالية)</option>
                    <option value="AgriTech">AgriTech (تقنيات الزراعة)</option>
                    <option value="LogisticsTech">LogisticsTech (الخدمات اللوجستية)</option>
                    <option value="E-Commerce Tech">E-Commerce Tech (برمجيات التجارة)</option>
                    <option value="HealthTech">HealthTech (التقنية الصحية)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "مرحلة التمويل الحالية *" : "Funding Stage *"}</label>
                  <select
                    value={fundingStage}
                    onChange={(e) => setFundingStage(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  >
                    <option value="bootstrapped">Bootstrapped (تمويل ذاتي)</option>
                    <option value="pre-seed">Pre-Seed (ما قبل التأسيس)</option>
                    <option value="seed">Seed (تمويل تأسيسي)</option>
                    <option value="series-a">Series-A (جولة أ)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "وصف المشروع باللغة العربية *" : "Description (Arabic) *"}</label>
                <textarea
                  required
                  rows={2}
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "وصف المشروع باللغة الإنجليزية *" : "Description (English) *"}</label>
                <textarea
                  required
                  rows={2}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "إجمالي قيمة الاستثمارات المؤمنة إن وجدت (SDG)" : "Investments Secured (SDG)"}</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 bg-white sticky bottom-0">
                <button type="button" onClick={() => setIsStartupRegisterOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
                  {currentLanguage === "ar" ? "تأكيد التسجيل بالدليل" : "Confirm Startup Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
