/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Search, Plus, CheckCircle, Clock, X, FileText, 
  MapPin, ShieldCheck, QrCode, AlertCircle, TrendingUp, Users, DollarSign 
} from "lucide-react";
import { CommercialRegistration, ApplicationStatus } from "../types";
import { SUDANESE_STATES } from "../data";

interface CommercialRegistrationProps {
  currentLanguage: "ar" | "en";
  companies: CommercialRegistration[];
  onAddCompany: (companyData: any) => Promise<any>;
  isAdmin: boolean;
  onUpdateStatus?: (id: string, status: ApplicationStatus, notes?: string) => Promise<any>;
}

export default function CommercialRegistrationModule({
  currentLanguage,
  companies,
  onAddCompany,
  isAdmin,
  onUpdateStatus
}: CommercialRegistrationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CommercialRegistration | null>(null);
  
  // New company form states
  const [companyNameAr, setCompanyNameAr] = useState("");
  const [companyNameEn, setCompanyNameEn] = useState("");
  const [activityType, setActivityType] = useState("");
  const [capital, setCapital] = useState("");
  const [partners, setPartners] = useState("");
  const [addressState, setAddressState] = useState(SUDANESE_STATES[0].nameAr);
  const [addressCity, setAddressCity] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyNameAr || !companyNameEn || !activityType || !capital || !partners || !addressCity) {
      alert(currentLanguage === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        companyNameAr,
        companyNameEn,
        activityType,
        capital: Number(capital),
        partners: partners.split(",").map(p => p.trim()).filter(p => p.length > 0),
        addressState,
        addressCity,
        registrationNumber: `SD-2026-${Math.floor(10000 + Math.random() * 90000)}`
      };

      await onAddCompany(payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
        // Clear form
        setCompanyNameAr("");
        setCompanyNameEn("");
        setActivityType("");
        setCapital("");
        setPartners("");
        setAddressCity("");
      }, 2000);
    } catch (e) {
      console.error(e);
      alert(currentLanguage === "ar" ? "فشل تقديم الطلب" : "Application submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    if (onUpdateStatus) {
      try {
        await onUpdateStatus(id, newStatus, reviewNotes);
        setReviewNotes("");
        // Update selected company view if open
        if (selectedCompany && selectedCompany.id === id) {
          setSelectedCompany(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.companyNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesState = filterState === "all" || c.addressState === filterState;
    
    return matchesSearch && matchesState;
  });

  return (
    <div id="commercial-registration-module" className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sudan-green" />
            {currentLanguage === "ar" ? "نظام السجل التجاري الرقمي 2035" : "Digital Commercial Registry System 2035"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {currentLanguage === "ar" 
              ? "إنشاء وإصدار سجل تجاري ذكي وموثق برمز QR للتحقق السريع" 
              : "Create, search, and verify commercial registrations with instant official QR validation"}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
        >
          <Plus className="h-4.5 w-4.5" />
          {currentLanguage === "ar" ? "طلب سجل تجاري جديد" : "Apply for New Registry"}
        </button>
      </div>

      {/* Grid of Stats - Styled as elegant Bento boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "السجلات المعتمدة" : "Approved Registries"}</h4>
            <p className="text-2xl font-black text-[#1A1A1A] mt-1">
              {companies.filter(c => c.status === "approved").length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "تحت المراجعة" : "Under Review"}</h4>
            <p className="text-2xl font-black text-[#1A1A1A] mt-1">
              {companies.filter(c => c.status === "pending" || c.status === "under_review").length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:scale-[1.01] transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-[#C5A059] border border-amber-100">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "إجمالي رؤوس الأموال الاستثمارية" : "Total Venture Capital"}</h4>
            <p className="text-2xl font-black text-[#1A1A1A] mt-1">
              {companies.reduce((sum, c) => sum + c.capital, 0).toLocaleString()} <span className="text-xs font-normal">SDG</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === "ar" ? "البحث باسم الشركة أو رقم السجل التجاري..." : "Search by company name or registry number..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F6F5] border border-gray-200 text-sm pl-4 pr-11 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          />
        </div>
        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          className="bg-[#F4F6F5] border border-gray-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-sudan-green min-w-[150px]"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
          <option value="all">{currentLanguage === "ar" ? "كل الولايات" : "All States"}</option>
          {SUDANESE_STATES.map(s => (
            <option key={s.id} value={s.nameAr}>{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
          ))}
        </select>
      </div>

      {/* Grid of Registered Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompanies.map(comp => (
          <div
            key={comp.id}
            onClick={() => setSelectedCompany(comp)}
            className="bg-white border border-gray-200 hover:border-sudan-green hover:shadow-md rounded-3xl p-6 transition-all duration-300 cursor-pointer flex justify-between items-start"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  comp.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                  comp.status === "rejected" ? "bg-rose-100 text-rose-800 border-rose-200" :
                  "bg-amber-100 text-amber-800 border-amber-200"
                }`}>
                  {comp.status === "approved" ? (currentLanguage === "ar" ? "نشط / معتمد" : "Approved") :
                   comp.status === "rejected" ? (currentLanguage === "ar" ? "مرفوض" : "Rejected") :
                   (currentLanguage === "ar" ? "تحت التدقيق" : "Pending")}
                </span>
                <span className="text-xs text-gray-400 font-mono font-bold">{comp.registrationNumber}</span>
              </div>
              <div>
                <h3 className="font-extrabold text-[#1A1A1A] text-sm md:text-base">
                  {currentLanguage === "ar" ? comp.companyNameAr : comp.companyNameEn}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {currentLanguage === "ar" ? comp.companyNameEn : comp.companyNameAr}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-sudan-gold" />
                  <span className="text-gray-500 font-bold">{comp.addressState} - {comp.addressCity}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-gray-700">
                  <span>{comp.capital.toLocaleString()} SDG</span>
                </div>
              </div>
            </div>
            
            {/* Stamp / Certificate button */}
            <button className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-2.5 rounded-xl border border-gray-200 hover:scale-105 transition-all">
              <QrCode className="h-5 w-5 text-sudan-green" />
            </button>
          </div>
        ))}
        {filteredCompanies.length === 0 && (
          <div className="col-span-full bg-white text-center py-12 rounded-3xl border border-gray-200 space-y-3 shadow-sm">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm">
              {currentLanguage === "ar" ? "لا توجد سجلات تجارية مطابقة للبحث" : "No commercial registries matching search criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sudan-dark text-white rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-5 w-5 text-sudan-gold" />
                  <h3 className="font-bold text-base">
                    {currentLanguage === "ar" ? "تقديم طلب سجل تجاري جديد 2035" : "Submit New Commercial Registration"}
                  </h3>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full text-white cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {currentLanguage === "ar" ? "تم تقديم طلبك بنجاح!" : "Application Submitted Successfully!"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {currentLanguage === "ar" 
                      ? "رقم طلبك قيد المراجعة الفورية من موظف الوزارة المختص وسوف يتم مراسلتك خلال ساعة." 
                      : "Your request is under instant review by our specialists. You will be notified shortly."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم الشركة باللغة العربية *" : "Company Name (Arabic) *"}</label>
                      <input
                        type="text"
                        required
                        value={companyNameAr}
                        onChange={(e) => setCompanyNameAr(e.target.value)}
                        placeholder="مثال: شركة السودان للتجارة الرقمية المحدودة"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم الشركة باللغة الإنجليزية *" : "Company Name (English) *"}</label>
                      <input
                        type="text"
                        required
                        value={companyNameEn}
                        onChange={(e) => setCompanyNameEn(e.target.value)}
                        placeholder="e.g. Sudan Digital Trade Co. Ltd"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "نوع النشاط التجاري *" : "Activity Type *"}</label>
                      <input
                        type="text"
                        required
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "مثال: تصدير محاصيل وتطوير صناعي" : "e.g. Agriculture Exports & Processing"}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "رأس المال التأسيسي (SDG) *" : "Venture Capital (SDG) *"}</label>
                      <input
                        type="number"
                        required
                        value={capital}
                        onChange={(e) => setCapital(e.target.value)}
                        placeholder="e.g. 5000000"
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      {currentLanguage === "ar" ? "أسماء الشركاء (مفصولين بفاصلة) *" : "Partners Names (comma-separated) *"}
                    </label>
                    <textarea
                      required
                      value={partners}
                      onChange={(e) => setPartners(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: عثمان علي محمد، محمد حسن صالح" : "e.g. Osman Ali Mohamed, Mohamed Hassan Saleh"}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الولاية *" : "State *"}</label>
                      <select
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      >
                        {SUDANESE_STATES.map(s => (
                          <option key={s.id} value={s.nameAr}>{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "المدينة / المنطقة *" : "City / Zone *"}</label>
                      <input
                        type="text"
                        required
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "مثال: الخرطوم بحري المنطقة الصناعية" : "e.g. Khartoum North Industrial Zone"}
                        className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 leading-normal">
                      {currentLanguage === "ar" 
                        ? "يتعهد مقدم الطلب بمطابقة الأنشطة التجارية المدخلة للوائح والتعليمات الصادرة عن وزارة التجارة والصناعة بجمهورية السودان لعام 2026 وقوانين حوكمة الرقابة الرقمية." 
                        : "The applicant promises to adhere to all commercial acts and regulations from the Ministry of Commerce & Industry of the Republic of Sudan."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                    >
                      {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                    >
                      {isSubmitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                      {currentLanguage === "ar" ? "إرسال طلب السجل" : "Submit Registry Request"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verification Certificate (QR Code Detail Modal) */}
      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden border border-sudan-gold"
            >
              {/* Header Certificate */}
              <div className="relative p-6 bg-gradient-to-br from-slate-850 to-slate-900 border-b border-sudan-gold/20 flex flex-col items-center text-center space-y-2">
                <div className="absolute top-4 right-4">
                  <button onClick={() => setSelectedCompany(null)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full cursor-pointer transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Government Crest Logo Concept */}
                <div className="h-14 w-14 bg-white/10 rounded-full border border-sudan-gold flex items-center justify-center mb-1">
                  <ShieldCheck className="h-8 w-8 text-sudan-gold" />
                </div>
                
                <h4 className="text-xs tracking-widest text-sudan-gold uppercase font-bold">
                  {currentLanguage === "ar" ? "جمهورية السودان" : "Republic of the Sudan"}
                </h4>
                <h3 className="text-sm font-semibold">
                  {currentLanguage === "ar" ? "وزارة التجارة والصناعة - التحول الرقمي 2035" : "Ministry of Commerce & Industry - Digital 2035"}
                </h3>
                <h2 className="text-lg font-bold text-slate-100 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 mt-2">
                  {currentLanguage === "ar" ? "شهادة قيد السجل التجاري الموثق" : "Verified Commercial Registry Certificate"}
                </h2>
              </div>

              {/* Certificate content */}
              <div className="p-6 space-y-4 text-slate-300 text-sm">
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-xs text-slate-400">{currentLanguage === "ar" ? "رقم السجل الموحد" : "Unified Register ID"}</span>
                    <span className="font-mono text-sudan-gold font-bold">{selectedCompany.registrationNumber}</span>
                  </div>
                  <div className="flex flex-col py-1 border-b border-white/5 gap-1">
                    <span className="text-xs text-slate-400">{currentLanguage === "ar" ? "اسم المنشأة التجاري" : "Registered Name"}</span>
                    <span className="font-bold text-white text-base">
                      {currentLanguage === "ar" ? selectedCompany.companyNameAr : selectedCompany.companyNameEn}
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentLanguage === "ar" ? selectedCompany.companyNameEn : selectedCompany.companyNameAr}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-xs text-slate-400">{currentLanguage === "ar" ? "نوع النشاط" : "Business Activity"}</span>
                    <span className="font-semibold text-white">{selectedCompany.activityType}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-xs text-slate-400">{currentLanguage === "ar" ? "رأس المال المقيد" : "Registered Capital"}</span>
                    <span className="font-semibold text-emerald-400">{selectedCompany.capital.toLocaleString()} SDG</span>
                  </div>
                  <div className="flex flex-col py-1 border-b border-white/5 gap-1">
                    <span className="text-xs text-slate-400">{currentLanguage === "ar" ? "الشركاء والمالكون" : "Partners & Owners"}</span>
                    <span className="text-xs text-white leading-normal">
                      {selectedCompany.partners.join(" ، ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-slate-400">{currentLanguage === "ar" ? "العنوان والتسجيل" : "Address & Origin"}</span>
                    <span className="text-xs text-white">{selectedCompany.addressState} - {selectedCompany.addressCity}</span>
                  </div>
                </div>

                {/* QR and digital signature */}
                <div className="flex items-center gap-4 bg-sudan-green/10 p-4 rounded-2xl border border-sudan-green/20">
                  {/* Styled Dynamic QR Code representation */}
                  <div className="bg-white p-2 rounded-xl shrink-0 border border-sudan-gold">
                    <div className="bg-slate-900 p-2 text-white font-mono text-[8px] border border-slate-700 select-none flex flex-col items-center justify-center w-18 h-18 text-center leading-none font-bold">
                      <QrCode className="h-10 w-10 text-sudan-green" />
                      <span className="text-[6px] tracking-tight text-sudan-gold mt-1">SDMCI CERT</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs text-sudan-green">{currentLanguage === "ar" ? "التحقق الرقمي والـ QR Code" : "QR Digital Integrity Signature"}</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "تم التحقق الفوري من صحة هذه الشهادة من خلال خوادم وزارة التجارة السودانية المركزية لعام 2035. صالحة وموثقة قانونياً." 
                        : "This digital certificate is instantly validated on Ministry of Commerce blockchain secure servers."}
                    </p>
                  </div>
                </div>

                {/* ADMIN APPROVAL OPTIONS */}
                {isAdmin && onUpdateStatus && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h5 className="text-xs font-bold text-sudan-gold uppercase">{currentLanguage === "ar" ? "صلاحيات المشرف / مراجعة الطلب" : "Admin Review Decision"}</h5>
                    
                    <div className="space-y-1.5">
                      <input 
                        type="text" 
                        placeholder={currentLanguage === "ar" ? "إضافة ملاحظات التدقيق هنا..." : "Add audit notes here..."}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs border border-white/10 px-3 py-2 rounded-lg outline-none focus:border-sudan-gold"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(selectedCompany.id, ApplicationStatus.APPROVED)}
                        className="flex-1 bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-2 rounded-xl cursor-pointer transition-colors"
                      >
                        {currentLanguage === "ar" ? "اعتماد / تشغيل السجل" : "Approve & Activate"}
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedCompany.id, ApplicationStatus.REJECTED)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-xl cursor-pointer transition-colors"
                      >
                        {currentLanguage === "ar" ? "رفض الطلب" : "Reject Request"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
