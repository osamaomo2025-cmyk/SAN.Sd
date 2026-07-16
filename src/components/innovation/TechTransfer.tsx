/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowRightLeft, Plus, Search, Building, Landmark, Award, 
  Settings, CheckCircle, HelpCircle, ShoppingCart, MessageSquare, AlertCircle 
} from "lucide-react";
import { TechTransferAsset, UniversityIndustryPartnership, InnovationUserRole } from "./InnovationTypes";

interface TechTransferProps {
  currentLanguage: "ar" | "en";
  assets: TechTransferAsset[];
  partnerships: UniversityIndustryPartnership[];
  onAddPartnership: (newPartner: UniversityIndustryPartnership) => void;
  onNegotiateAsset: (id: string) => void;
  userRole: InnovationUserRole;
}

export default function TechTransfer({
  currentLanguage,
  assets,
  partnerships,
  onAddPartnership,
  onNegotiateAsset,
  userRole
}: TechTransferProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrl, setSelectedTrl] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Partnership form states
  const [projNameAr, setProjNameAr] = useState("");
  const [projNameEn, setProjNameEn] = useState("");
  const [universityAr, setUniversityAr] = useState("");
  const [universityEn, setUniversityEn] = useState("");
  const [industryPartnerAr, setIndustryPartnerAr] = useState("");
  const [industryPartnerEn, setIndustryPartnerEn] = useState("");
  const [scopeAr, setScopeAr] = useState("");
  const [scopeEn, setScopeEn] = useState("");

  const handleCreatePartnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projNameAr || !universityAr || !industryPartnerAr) return;

    const newPartner: UniversityIndustryPartnership = {
      id: `prt-${Date.now()}`,
      projectNameAr: projNameAr,
      projectNameEn: projNameEn || projNameAr,
      universityAr,
      universityEn: universityEn || universityAr,
      industryPartnerAr,
      industryPartnerEn: industryPartnerEn || industryPartnerAr,
      scopeAr,
      scopeEn: scopeEn || scopeAr,
      startDate: new Date().toISOString().split("T")[0],
      milestones: [
        { titleAr: "مراجعة صياغة العقد المبدئي والالتزامات المالية", titleEn: "Review initial draft & capital allocations", dueDate: "2026-06-30", status: "pending" },
        { titleAr: "إجراء الفحص التجريبي ومطابقة خط الإنتاج", titleEn: "Conduct pilot validation and machinery mapping", dueDate: "2026-09-15", status: "pending" }
      ]
    };

    onAddPartnership(newPartner);
    setIsFormOpen(false);

    // Reset Form
    setProjNameAr("");
    setProjNameEn("");
    setUniversityAr("");
    setUniversityEn("");
    setIndustryPartnerAr("");
    setIndustryPartnerEn("");
    setScopeAr("");
    setScopeEn("");
  };

  const filteredAssets = assets.filter((as) => {
    const matchesSearch = 
      as.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      as.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      as.sourceInstitutionAr.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTrl = selectedTrl === "all" || as.trl >= Number(selectedTrl);
    return matchesSearch && matchesTrl;
  });

  const getTrlDescription = (trl: number) => {
    const trlDescriptions: Record<number, { ar: string; en: string }> = {
      1: { ar: "الأبحاث الأساسية والمبادئ الفيزيائية", en: "Basic principles observed" },
      2: { ar: "صياغة المفهوم التكنولوجي والتطبيقات", en: "Technology concept formulated" },
      3: { ar: "الإثبات المعملي والمخبري للمفهوم", en: "Analytical & experimental proof of concept" },
      4: { ar: "التحقق من المكونات في بيئة مخبرية مدمجة", en: "Component validation in laboratory" },
      5: { ar: "التحقق من المكونات في بيئة تشغيلية تجريبية", en: "Component validation in relevant environment" },
      6: { ar: "نموذج تجريبي للأنظمة في بيئة تشغيلية", en: "System prototype demonstration" },
      7: { ar: "عرض النظام في بيئة تشغيلية حقيقية", en: "System demonstration in operational environment" },
      8: { ar: "اكتمال النظام وتأهيله بالكامل عبر الفحص", en: "System complete and qualified" },
      9: { ar: "إطلاق النظام الفعلي والإنتاج التجاري الكامل", en: "Actual system proven in operational environment" }
    };
    return trlDescriptions[trl] || { ar: "", en: "" };
  };

  return (
    <div className="space-y-6">
      
      {/* Banner introduction with TRL visual indicator summary */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-[#1E293B] text-base md:text-lg">
            {currentLanguage === "ar" ? "سوق نقل التكنولوجيا وبناء الشراكات الوطنية" : "National Tech Transfer & Academia-Industry Matchmaker"}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {currentLanguage === "ar" 
              ? "الربط الفعال بين البحوث الجامعية والمنشآت الصناعية. تقييم جاهزية التكنولوجيا (TRL) وتسهيل عقود التراخيص السيادية."
              : "Bridging the gap between university research outputs and manufacturing plants. Standardizing Technology Readiness Levels (TRL) for licensing."}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>{currentLanguage === "ar" ? "تأسيس تحالف جامعي صناعي" : "Form Academia-Industry Alliance"}</span>
        </button>
      </div>

      {/* Partnership creation form */}
      {isFormOpen && (
        <form onSubmit={handleCreatePartnership} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <ArrowRightLeft className="h-5 w-5 text-sudan-green" />
            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">
              {currentLanguage === "ar" ? "نموذج توثيق الشراكة البحثية والصناعية الموحدة" : "University-Industry Alliance Specifications"}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Project Name Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم التحالف / المشروع الصناعي المشترك (بالعربية) *" : "Joint Venture Project Name (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={projNameAr}
                onChange={(e) => setProjNameAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "توطين خط إنتاج اللقاحات الزراعية..." : "e.g. Localizing agricultural vaccine line..."}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Project Name En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "اسم التحالف / المشروع الصناعي المشترك (بالإنجليزية)" : "Joint Venture Project Name (English)"}
              </label>
              <input
                type="text"
                value={projNameEn}
                onChange={(e) => setProjNameEn(e.target.value)}
                placeholder="e.g. Localizing agricultural vaccine line..."
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* University Ar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الجامعة أو المركز البحثي الرئيسي (بالعربية) *" : "Lead University/Center (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={universityAr}
                onChange={(e) => setUniversityAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "جامعة الجزيرة" : "e.g. Al Gezira University"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* University En */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الجامعة أو المركز البحثي الرئيسي (بالإنجليزية)" : "Lead University/Center (English)"}
              </label>
              <input
                type="text"
                value={universityEn}
                onChange={(e) => setUniversityEn(e.target.value)}
                placeholder="e.g. Al Gezira University"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Industry Partner Ar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الشريك الصناعي / المنشأة (بالعربية) *" : "Industry Partner Name (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={industryPartnerAr}
                onChange={(e) => setIndustryPartnerAr(e.target.value)}
                placeholder={currentLanguage === "ar" ? "شركة النيل للأغذية" : "e.g. Nile Foods"}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Industry Partner En */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "الشريك الصناعي / المنشأة (بالإنجليزية)" : "Industry Partner Name (English)"}
              </label>
              <input
                type="text"
                value={industryPartnerEn}
                onChange={(e) => setIndustryPartnerEn(e.target.value)}
                placeholder="e.g. Nile Foods"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Scope Ar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "نطاق العمل ومخرجات التعاون الفني (بالعربية) *" : "Technical Working Scope & Outputs (Arabic) *"}
              </label>
              <textarea
                required
                rows={3}
                value={scopeAr}
                onChange={(e) => setScopeAr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

            {/* Scope En */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block">
                {currentLanguage === "ar" ? "نطاق العمل ومخرجات التعاون الفني (بالإنجليزية)" : "Technical Working Scope & Outputs (English)"}
              </label>
              <textarea
                rows={3}
                value={scopeEn}
                onChange={(e) => setScopeEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#1E293B] text-xs font-bold rounded-xl cursor-pointer"
            >
              {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {currentLanguage === "ar" ? "توثيق وتأسيس التحالف" : "Establish Alliance"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of panels: Left Technology Marketplace, Right Partnerships list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Technology Marketplace (8 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base flex items-center gap-1.5">
                <ShoppingCart className="h-5 w-5 text-sudan-green" />
                <span>{currentLanguage === "ar" ? "سوق الأصول التكنولوجية وبراءات الاستغلال" : "IP & Commercial Technology Marketplace"}</span>
              </h4>

              {/* TRL Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">TRL:</span>
                <select
                  value={selectedTrl}
                  onChange={(e) => setSelectedTrl(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded outline-none"
                >
                  <option value="all">{currentLanguage === "ar" ? "الكل" : "All"}</option>
                  <option value="5">TRL 5+</option>
                  <option value="7">TRL 7+</option>
                  <option value="9">TRL 9 (جاهز للتطبيق)</option>
                </select>
              </div>
            </div>

            {/* Search asset */}
            <div className="relative">
              <input
                type="text"
                placeholder={currentLanguage === "ar" ? "بحث عن براءة، مستشعر، آلية صناعية..." : "Search assets, patents..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs pl-8 pr-3.5 py-1.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Assets list */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((as) => {
                  const trlDesc = getTrlDescription(as.trl);

                  return (
                    <div 
                      key={as.id} 
                      className="bg-slate-50 hover:bg-slate-100/50 border border-slate-150 p-4 rounded-2xl space-y-3 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          
                          {/* Title */}
                          <h5 className="font-extrabold text-[#1E293B] text-xs md:text-sm">
                            {currentLanguage === "ar" ? as.titleAr : as.titleEn}
                          </h5>

                          <p className="text-[10px] font-bold text-sudan-green">
                            {currentLanguage === "ar" ? as.sourceInstitutionAr : as.sourceInstitutionEn}
                          </p>
                        </div>

                        {/* asking price */}
                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">
                            {currentLanguage === "ar" ? "قيمة الترخيص المبدئية" : "Initial License Fee"}
                          </span>
                          <span className="font-mono text-xs font-extrabold text-[#1E293B]">
                            {as.askingPrice > 0 ? `${as.askingPrice.toLocaleString()} SDG` : (currentLanguage === "ar" ? "للتفاوض" : "Negotiable")}
                          </span>
                        </div>
                      </div>

                      {/* TRL Level Visualizer Gauge */}
                      <div className="bg-white border border-slate-150 rounded-xl p-2.5 space-y-1">
                        <div className="flex justify-between text-[9px] font-extrabold text-slate-600">
                          <span>{currentLanguage === "ar" ? `مستوى الجاهزية التكنولوجية: TRL ${as.trl}` : `Technology Readiness Level: TRL ${as.trl}`}</span>
                          <span className="text-sudan-gold font-extrabold">{currentLanguage === "ar" ? trlDesc.ar : trlDesc.en}</span>
                        </div>
                        {/* Gauge indicators */}
                        <div className="grid grid-cols-9 gap-1 h-2">
                          {[1,2,3,4,5,6,7,8,9].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`h-full rounded-sm ${
                                lvl <= as.trl 
                                  ? "bg-sudan-green" 
                                  : "bg-slate-100"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Description / target industries */}
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {currentLanguage === "ar" ? as.descriptionAr : as.descriptionEn}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                        <div className="flex flex-wrap gap-1">
                          {as.targetIndustries.map((ind, idx) => (
                            <span key={idx} className="bg-slate-200/60 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded">
                              {ind}
                            </span>
                          ))}
                        </div>

                        {as.status === "available" ? (
                          <button
                            onClick={() => onNegotiateAsset(as.id)}
                            className="bg-slate-900 text-[#FFD700] hover:bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{currentLanguage === "ar" ? "طلب تفاوض وصياغة اتفاق" : "Initiate Negotiation"}</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            <span className="h-1 w-1 rounded-full bg-current" />
                            <span>{currentLanguage === "ar" ? "قيد التفاوض والامتثال القانوني" : "Under Contract Audit"}</span>
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 font-semibold">
                  <AlertCircle className="h-6 w-6 mx-auto text-slate-300 mb-1" />
                  {currentLanguage === "ar" ? "لم يتم العثور على أصول تكنولوجية مطابقة" : "No technical assets found"}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT: University Industry Partnerships list (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
            
            <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Landmark className="h-5 w-5 text-sudan-green" />
              <span>{currentLanguage === "ar" ? "التحالفات والاتفاقيات الجامعية الصناعية" : "Active Academia-Industry JVs"}</span>
            </h4>

            <div className="space-y-4">
              {partnerships.map((prt) => (
                <div key={prt.id} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3">
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-[#1E293B] text-xs">
                      {currentLanguage === "ar" ? prt.projectNameAr : prt.projectNameEn}
                    </h5>
                    
                    <div className="flex items-center gap-1 text-[10px] font-bold text-sudan-green">
                      <Building className="h-3.5 w-3.5" />
                      <span>{currentLanguage === "ar" ? `${prt.universityAr} ⇆ ${prt.industryPartnerAr}` : `${prt.universityEn} ⇆ ${prt.industryPartnerEn}`}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {currentLanguage === "ar" ? prt.scopeAr : prt.scopeEn}
                  </p>

                  {/* Milestones list */}
                  <div className="space-y-1.5 border-t border-slate-200 pt-2.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                      {currentLanguage === "ar" ? "المراحل والتاريخ المحدد لمطابقة الخط" : "Execution Milestones & Audit Dates"}
                    </span>
                    <div className="space-y-2">
                      {prt.milestones.map((ms, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-between text-[10px]">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-700">{currentLanguage === "ar" ? ms.titleAr : ms.titleEn}</p>
                            <span className="text-[9px] text-slate-400 font-bold block">{currentLanguage === "ar" ? `الموعد: ${ms.dueDate}` : `Due: ${ms.dueDate}`}</span>
                          </div>

                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            ms.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>
                            {ms.status === "completed" ? (currentLanguage === "ar" ? "مكتمل" : "Passed") : (currentLanguage === "ar" ? "معلق" : "Pending")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
