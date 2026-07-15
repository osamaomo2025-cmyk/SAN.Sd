/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, Landmark, Plus, CheckCircle, Search, MapPin, 
  Coins, ArrowRight, X, Sparkles, LayoutGrid, CheckSquare 
} from "lucide-react";
import { LandApplication, InvestmentOpportunity, ApplicationStatus } from "../types";
import { INVESTMENT_OPPORTUNITIES, INDUSTRIAL_ZONES } from "../data";

interface InvestmentPortalProps {
  currentLanguage: "ar" | "en";
  applications: LandApplication[];
  onAddApplication: (appData: any) => Promise<any>;
  isAdmin: boolean;
  onUpdateAppStatus?: (id: string, status: ApplicationStatus) => Promise<any>;
}

export default function InvestmentPortalModule({
  currentLanguage,
  applications,
  onAddApplication,
  isAdmin,
  onUpdateAppStatus
}: InvestmentPortalProps) {
  const [selectedOpp, setSelectedOpp] = useState<InvestmentOpportunity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [proposedProject, setProposedProject] = useState("");
  const [requestedAreaSqm, setRequestedAreaSqm] = useState("");
  const [preferredIndustrialZone, setPreferredIndustrialZone] = useState(INDUSTRIAL_ZONES[0].nameAr);
  const [investorName, setInvestorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedProject || !requestedAreaSqm || !investorName) {
      alert(currentLanguage === "ar" ? "يرجى ملء البيانات المطلوبة لحجز الأرض" : "Please fill in all requested fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddApplication({
        investorName,
        opportunityId: selectedOpp ? selectedOpp.id : "custom",
        proposedProject,
        requestedAreaSqm: Number(requestedAreaSqm),
        preferredIndustrialZone
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
        setProposedProject("");
        setRequestedAreaSqm("");
        setInvestorName("");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenFormWithOpp = (opp: InvestmentOpportunity) => {
    setSelectedOpp(opp);
    setProposedProject(currentLanguage === "ar" ? `مشروع متكامل لـ ${opp.titleAr}` : `Integrated Project for ${opp.titleEn}`);
    setPreferredIndustrialZone(opp.id === "opp-1" ? "المنطقة الحرة بورتسودان" : opp.id === "opp-2" ? "مدينة جياد الصناعية" : "منطقة الباقير الصناعية");
    setIsFormOpen(true);
  };

  const filteredOpportunities = INVESTMENT_OPPORTUNITIES.filter(opp => {
    return opp.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
           opp.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
           opp.sectorAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
           opp.sectorEn.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div id="investment-portal-module" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sudan-dark text-white p-6 rounded-3xl shadow-sm border border-sudan-gold/20 relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-sudan-green/20 rounded-full blur-3xl"></div>
        <div className="absolute left-10 bottom-0 w-60 h-60 bg-sudan-gold/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-3">
          <span className="bg-sudan-gold text-sudan-dark font-bold text-[10px] px-3 py-1 rounded-full uppercase flex items-center gap-1 w-fit">
            <Sparkles className="h-3.5 w-3.5 fill-sudan-dark" />
            {currentLanguage === "ar" ? "رؤية السودان 2035 للتجارة والصناعة" : "Sudan Vision 2035 Trade & Industry"}
          </span>
          <h2 className="text-2xl font-black text-white">
            {currentLanguage === "ar" ? "بوابة الاستثمار وتخصيص الأراضي الصناعية" : "Investment Portal & Industrial Lands"}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "استعرض الفرص الاستثمارية السيادية والفريدة في قطاعات الصمغ العربي والتعدين والتصنيع الثقيل، وقدم طلباً لحجز أرضك فورياً بالمدن الصناعية الذكية." 
              : "Explore sovereign industrial opportunities in Sudanese Gum Arabic, green energy, and heavy industries. Submit instant lease requests for certified industrial plots."}
          </p>
        </div>
      </div>

      {/* Industrial Cities Grid Showcase */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider">
          <Landmark className="h-4 w-4 text-sudan-green" />
          {currentLanguage === "ar" ? "خارطة المدن والمناطق الصناعية الحرة 2035" : "Sudanese Industrial Cities & Free Zones Map"}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDUSTRIAL_ZONES.map(zone => (
            <div 
              key={zone.id}
              className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm hover:border-sudan-gold hover:shadow-md transition-all duration-300 text-center space-y-2 group cursor-default"
            >
              <div className="h-10 w-10 bg-[#F4F6F5] text-sudan-green rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 text-sudan-gold" />
              </div>
              <h5 className="font-extrabold text-xs text-slate-800 line-clamp-1">{currentLanguage === "ar" ? zone.nameAr : zone.nameEn}</h5>
              <p className="text-[10px] text-slate-400 font-extrabold">{currentLanguage === "ar" ? `ولاية ${zone.state}` : `${zone.state} State`}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search opportunities */}
      <div className="relative">
        <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder={currentLanguage === "ar" ? "ابحث عن فرصة استثمارية محددة..." : "Search investment opportunities..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 text-sm pl-4 pr-11 py-2.5 rounded-xl outline-none focus:border-sudan-gold shadow-sm transition-all"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        />
      </div>

      {/* Opportunities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map(opp => (
          <div 
            key={opp.id} 
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-sudan-gold/30 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] bg-amber-100 text-[#C5A059] border border-amber-200 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {currentLanguage === "ar" ? opp.sectorAr : opp.sectorEn}
                  </span>
                  <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base leading-snug">
                    {currentLanguage === "ar" ? opp.titleAr : opp.titleEn}
                  </h4>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-bold text-xs font-mono border border-emerald-100 shrink-0">
                  {opp.requiredCapital}
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {currentLanguage === "ar" ? opp.descriptionAr : opp.descriptionEn}
              </p>

              <div className="bg-[#F4F6F5] p-3.5 rounded-2xl space-y-1 border border-gray-100 text-xs">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{currentLanguage === "ar" ? "الحوافز والتسهيلات المتاحة:" : "Incentives & Tax Deductions:"}</p>
                <p className="text-gray-500 leading-relaxed font-bold">
                  {currentLanguage === "ar" ? opp.incentivesAr : opp.incentivesEn}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                <MapPin className="h-3 w-3 text-sudan-gold" />
                {currentLanguage === "ar" ? opp.locationAr : opp.locationEn}
              </span>
              <button
                onClick={() => handleOpenFormWithOpp(opp)}
                className="bg-sudan-dark hover:bg-sudan-dark/80 text-slate-900 text-[10px] font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all duration-300 shadow-sm"
              >
                <span>{currentLanguage === "ar" ? "التقديم وتخصيص أرض" : "Apply & Lease Land"}</span>
                <ArrowRight className={`h-3.5 w-3.5 ${currentLanguage === "ar" ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Applications list */}
      <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-sudan-green" />
          {currentLanguage === "ar" ? "طلبات حجز الأراضي الصناعية السابقة" : "Industrial Lease Applications History"}
        </h4>
        
        <div className="divide-y divide-gray-100">
          {applications.map(app => (
            <div key={app.id} className="py-4 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5">
                <p className="font-extrabold text-[#1E293B]">{app.proposedProject}</p>
                <p className="text-gray-400">
                  {currentLanguage === "ar" 
                    ? `المستثمر: ${app.investorName} | المنطقة المفضلة: ${app.preferredIndustrialZone} (${app.requestedAreaSqm.toLocaleString()} متر مربع)` 
                    : `Investor: ${app.investorName} | Zone: ${app.preferredIndustrialZone} (${app.requestedAreaSqm.toLocaleString()} SQM)`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  app.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                  app.status === "rejected" ? "bg-rose-100 text-rose-800 border-rose-200" :
                  "bg-amber-100 text-amber-800 border-amber-200"
                }`}>
                  {app.status === "approved" ? (currentLanguage === "ar" ? "موافق عليها" : "Lease Granted") :
                   app.status === "rejected" ? (currentLanguage === "ar" ? "مرفوضة" : "Rejected") :
                   (currentLanguage === "ar" ? "قيد الدراسة الفنية" : "Under Study")}
                </span>

                {isAdmin && app.status === "pending" && onUpdateAppStatus && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onUpdateAppStatus(app.id, ApplicationStatus.APPROVED)}
                      className="bg-sudan-green hover:bg-sudan-green-light text-white font-bold p-1 rounded-md cursor-pointer"
                      title={currentLanguage === "ar" ? "الموافقة والمنح" : "Approve & Grant"}
                    >
                      ✓
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-center py-6 text-slate-400">{currentLanguage === "ar" ? "لا توجد طلبات جارية" : "No ongoing lease applications found"}</p>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sudan-dark text-slate-900 rounded-t-3xl">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "حجز أرض صناعية استثمارية" : "Apply for Industrial Land Lease"}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "تم تسجيل طلب التخصيص!" : "Application Logged!"}</h4>
                  <p className="text-xs text-slate-400">{currentLanguage === "ar" ? "سيقوم فريق التنمية الصناعية بدراسة المخطط والموافقة." : "The Industrial Development Unit will review your project layout."}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-700">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المستثمر / الشركة المستفيدة *" : "Investor / Company Name *"}</label>
                    <input
                      type="text"
                      required
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      placeholder="e.g. Khaled bin Saeed Al-Nahdi"
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "المشروع الصناعي المقترح *" : "Proposed Industrial Project *"}</label>
                    <textarea
                      required
                      rows={2}
                      value={proposedProject}
                      onChange={(e) => setProposedProject(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: مصنع تدوير و تعبئة الصمغ العربي" : "e.g. Factory for Refined Gum Arabic"}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "المساحة المطلوبة (متر مربع) *" : "Area Required (SQM) *"}</label>
                      <input
                        type="number"
                        required
                        value={requestedAreaSqm}
                        onChange={(e) => setRequestedAreaSqm(e.target.value)}
                        placeholder="e.g. 10000"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "المدينة الصناعية المفضلة *" : "Preferred Industrial Zone *"}</label>
                      <select
                        value={preferredIndustrialZone}
                        onChange={(e) => setPreferredIndustrialZone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      >
                        {INDUSTRIAL_ZONES.map(z => (
                          <option key={z.id} value={z.nameAr}>{currentLanguage === "ar" ? z.nameAr : z.nameEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                    <button type="submit" disabled={isSubmitting} className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md">
                      {isSubmitting ? "..." : (currentLanguage === "ar" ? "إرسال طلب تخصيص الأرض" : "Submit Lease Lease")}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
