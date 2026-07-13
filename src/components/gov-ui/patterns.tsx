/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, Search, Sparkles, Filter, ChevronRight, FileText, Check, Shield, 
  MapPin, Phone, HelpCircle, ArrowRight, ArrowLeft, Send, CheckCircle2, AlertTriangle, 
  XCircle, Clock, DollarSign, Download, Printer, User, Compass, Layers, PieChart, 
  Map, Bell, Calendar, Eye, ClipboardCheck, FileSpreadsheet, Star, Settings, ChevronDown, RefreshCw
} from "lucide-react";
import { SovereignTypography, SovereignButton, SovereignBadge, SovereignAvatar, SovereignDivider } from "./atoms";
import { SovereignSearchBox, SovereignOTP, SovereignTimeline, SovereignPasswordStrength } from "./molecules";
import { SovereignDataGrid, SovereignDocumentViewer, SovereignAIChatWindow } from "./organisms";
import { SovereignInput, SovereignSelect, SovereignFileUpload, SovereignSignaturePad } from "./forms";

// ==========================================
// 1. PATTERN 01: Government Home Page Pattern
// ==========================================
export const GovHomePagePattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-slate-50 border border-gray-200 rounded-3xl overflow-hidden shadow-sm font-sans">
      {/* 1. Government Ribbon & Header */}
      <div className="bg-[#007A33] text-white py-2.5 px-6 text-[11px] font-bold flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span>{isAr ? "البوابة الوطنية الموحدة لجمهورية السودان" : "Official Unified Portal of the Republic of Sudan"}</span>
          <span className="opacity-50">|</span>
          <span className="text-sudan-gold font-extrabold">{isAr ? "وزارة التجارة والصناعة" : "Ministry of Commerce & Industry"}</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span>SD-VISION-2035</span>
        </div>
      </div>

      {/* 2. Emergency / Important Alert banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 px-6 py-3 text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce text-amber-600" />
          <span>
            {isAr 
              ? "تنبيه سيادي: تم تفعيل نظام تدقيق الهوية الثنائي لجميع السجلات الاستثمارية الأجنبية." 
              : "Sovereign Alert: Two-Factor Identity Verification is now active for all foreign investment registrations."}
          </span>
        </div>
        <button className="underline text-[11px] font-extrabold cursor-pointer">{isAr ? "التفاصيل" : "Details"}</button>
      </div>

      {/* 3. Hero Section & Smart Search */}
      <div className="relative py-12 px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-[#007A33]/20 text-white text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-sudan-gold text-xs font-black tracking-widest uppercase">
            {isAr ? "خدمات تجارية وصناعية رقمية موحدة" : "Digital Unified Commerce & Industry Services"}
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
            {isAr ? "بوابة الاستثمار والترخيص التجاري السيادي" : "Sovereign Investment & Commercial Licensing Portal"}
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            {isAr 
              ? "أنجز معاملاتك التجارية، سجل شركاتك، واستخرج التراخيص الفيدرالية في دقائق معدودة بدعم من الذكاء الاصطناعي." 
              : "Complete your commercial registries, incorporate companies, and extract federal licenses in minutes with AI support."}
          </p>
        </div>

        {/* AI Smart Search embedded */}
        <div className="max-w-xl mx-auto bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <SovereignSearchBox 
            placeholder={isAr ? "اسأل المساعد الذكي: 'كيف أستخرج ترخيص تصدير صمغ عربي؟'..." : "Ask AI: 'How do I extract a Gum Arabic export license?'..."}
            currentLanguage={currentLanguage}
            isAIActive={true}
          />
        </div>
      </div>

      {/* 4. Featured e-Services & Quick Access */}
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-end border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-sudan-green">{isAr ? "الخدمات الإلكترونية المتميزة" : "Featured e-Services"}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{isAr ? "الخدمات الأكثر استخداماً من قبل المستثمرين والشركات" : "The most used services by investors and corporations"}</p>
          </div>
          <button className="text-xs font-bold text-sudan-gold hover:underline flex items-center gap-1">
            <span>{isAr ? "عرض كافة الخدمات" : "Browse Catalog"}</span>
            <ArrowRight className="h-4.5 w-4.5 transform rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { titleAr: "تأسيس شركة سيادية", titleEn: "Sovereign Company Incorporation", descAr: "تأسيس فوري للشركات المساهمة والمحدودة.", descEn: "Instant setup of public & limited liability companies.", time: "10 mins", fee: "Free" },
            { titleAr: "تجديد السجل التجاري الموحد", titleEn: "Unified Registry Renewal", descAr: "تحديث السجل التجاري واستخراج الشهادة الرقمية.", descEn: "Update commercial registry and generate smart credentials.", time: "3 mins", fee: "50,000 SDG" },
            { titleAr: "تصاريح الاستيراد والتصدير", titleEn: "Import & Export Clearances", descAr: "تراخيص فيدرالية للمواد الغذائية والمنتجات الزراعية والماكينات.", descEn: "Federal customs clearance and agricultural licenses.", time: "1 day", fee: "Varies" }
          ].map((srv, idx) => (
            <div key={idx} className="bg-white border border-gray-200/60 hover:border-sudan-green/50 p-5 rounded-2xl transition-all hover:-translate-y-0.5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-[#007A33]/10 border border-[#007A33]/20 flex items-center justify-center text-sudan-green">
                  <Building2 className="h-5 w-5" />
                </div>
                <SovereignBadge variant="active" currentLanguage={currentLanguage} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-800">{isAr ? srv.titleAr : srv.titleEn}</h4>
                <p className="text-[11px] text-gray-400 leading-normal">{isAr ? srv.descAr : srv.descEn}</p>
              </div>
              <div className="border-t border-gray-100/50 pt-3 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {srv.time}</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {srv.fee}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 5. National Economic Indicators widget */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="space-y-1 col-span-1">
            <span className="text-[10px] text-sudan-gold font-extrabold uppercase tracking-widest">{isAr ? "المؤشرات الاقتصادية" : "Economic Indicators"}</span>
            <h4 className="font-black text-sm">{isAr ? "لوحة الأداء الاتحادي" : "Federal Performance Ledger"}</h4>
            <p className="text-[10px] text-gray-500">{isAr ? "تحديث تلقائي من البنك المركزي" : "Real-time feeds from Central Bank"}</p>
          </div>
          {[
            { labelAr: "معدل نمو الصادرات", labelEn: "Export Growth Rate", val: "+14.2%", status: "success" },
            { labelAr: "السجلات التجارية النشطة", labelEn: "Active Commercial Registers", val: "142,900", status: "info" },
            { labelAr: "حجم الاستثمار الأجنبي", labelEn: "Foreign Investments Act", val: "$2.4 Billion", status: "warning" }
          ].map((ind, idx) => (
            <div key={idx} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
              <p className="text-[10px] text-gray-400">{isAr ? ind.labelAr : ind.labelEn}</p>
              <h3 className="text-base font-black text-sudan-gold font-mono">{ind.val}</h3>
              <span className="text-[9px] text-emerald-400 font-bold">● Live Updates</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. PATTERN 02: Government Service Catalog Pattern
// ==========================================
export const GovServiceCatalogPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", nameAr: "الكل", nameEn: "All Services" },
    { id: "register", nameAr: "السجلات والشركات", nameEn: "Registry & Companies" },
    { id: "license", nameAr: "التراخيص والتصاريح", nameEn: "Licenses & Permits" },
    { id: "export", nameAr: "الاستيراد والتصدير", nameEn: "Import & Export" },
    { id: "industrial", nameAr: "التنمية الصناعية", nameEn: "Industrial Growth" }
  ];

  const services = [
    { id: 1, cat: "register", titleAr: "تسجيل شركة محدودة جديدة", titleEn: "Incorporate New LLC Company", time: "15 mins", price: "Free", docs: 3 },
    { id: 2, cat: "license", titleAr: "رخصة منشأة صناعية فئة أ", titleEn: "Industrial Facility Permit Grade A", time: "2 days", price: "120,000 SDG", docs: 5 },
    { id: 3, cat: "export", titleAr: "شهادة منشأ للمنتجات الزراعية", titleEn: "Certificate of Origin - Agriculture", time: "1 hour", price: "15,000 SDG", docs: 2 },
    { id: 4, cat: "industrial", titleAr: "طلب تخصيص أرض صناعية", titleEn: "Industrial Land Allocation Request", time: "5 days", price: "Free", docs: 6 }
  ];

  const filteredServices = services.filter(srv => {
    if (selectedCategory !== "all" && srv.cat !== selectedCategory) return false;
    if (searchQuery) {
      const match = isAr ? srv.titleAr : srv.titleEn;
      return match.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      {/* Search & AI Search header panel */}
      <div className="space-y-4">
        <div>
          <h3 className="font-black text-sm text-sudan-green">{isAr ? "دليل الخدمات الحكومية الذكي" : "Smart Government Services Catalog"}</h3>
          <p className="text-[10px] text-gray-400">{isAr ? "اختر تصنيف الخدمة أو اسأل الذكاء الاصطناعي للمساعدة الفورية في توجيه طلبك" : "Select service category or ask AI for immediate guided submission workflow"}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث بالكلمات المفتاحية... (مثل: شركة، ترخيص)" : "Filter by keywords... (e.g., company, license)"}
              className="w-full text-xs p-3.5 ltr:pl-10 rtl:pr-10 border border-gray-200 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:border-sudan-green"
            />
            <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 h-4 w-4 text-gray-400" />
          </div>
          <button className="bg-gradient-to-r from-sudan-gold to-sudan-green text-white text-xs font-bold px-4.5 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shrink-0">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span>{isAr ? "سؤال المساعد الذكي" : "Consult Smart Agent"}</span>
          </button>
        </div>
      </div>

      {/* Category horizontal pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat.id 
                ? "bg-[#007A33]/10 text-sudan-green border-2 border-sudan-green" 
                : "text-gray-500 hover:bg-slate-50 border border-gray-200"
            }`}
          >
            {isAr ? cat.nameAr : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Service grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((srv) => (
            <div key={srv.id} className="border border-gray-200 hover:border-sudan-green/30 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-sm transition-all bg-white">
              <div className="space-y-1">
                <span className="text-[9px] bg-slate-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{srv.cat}</span>
                <h4 className="font-extrabold text-xs text-slate-800">{isAr ? srv.titleAr : srv.titleEn}</h4>
                <div className="flex items-center gap-4 text-[10px] text-gray-400 pt-1 font-mono">
                  <span>⏰ {srv.time}</span>
                  <span>💳 {srv.price}</span>
                  <span>📄 {srv.docs} {isAr ? "مستندات مطلوبة" : "documents"}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-end">
                <SovereignButton variant="primary" size="sm" className="rounded-xl font-bold">
                  <span>{isAr ? "ابدأ الخدمة الفيدرالية" : "Initiate e-Service"}</span>
                  <ArrowRight className="h-3.5 w-3.5 ltr:ml-1 rtl:mr-1 transform rtl:rotate-180" />
                </SovereignButton>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center p-8 text-gray-400 text-xs">
            {isAr ? "لا توجد خدمات مطابقة لبحثك." : "No services match your criteria."}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. PATTERN 03: Government Service Wizard
// ==========================================
export const GovServiceWizardPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, labelAr: "مقدمة وأهلية", labelEn: "Eligibility & Terms" },
    { id: 2, labelAr: "بيانات المنشأة", labelEn: "Company Details" },
    { id: 3, labelAr: "رفع المستندات", labelEn: "Upload Docs" },
    { id: 4, labelAr: "المصادقة والطلب", labelEn: "Signature & Submit" }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      {/* Wizard Header Progress Bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] bg-[#007A33]/10 text-sudan-green px-2.5 py-0.5 rounded-full font-black">
            {isAr ? `المعاملة #SDW-2026` : `Transaction #SDW-2026`}
          </span>
          <span className="text-xs font-black text-sudan-gold font-mono">
            {isAr ? `الخطوة ${currentStep} من ${steps.length}` : `Step ${currentStep} of ${steps.length}`}
          </span>
        </div>

        {/* Step Indicator Bullets */}
        <div className="flex items-center gap-1">
          {steps.map((st) => (
            <div 
              key={st.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                st.id <= currentStep ? "bg-sudan-green" : "bg-gray-100"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-gray-400 font-bold overflow-hidden">
          {steps.map((st) => (
            <span key={st.id} className={st.id === currentStep ? "text-sudan-green" : ""}>
              {isAr ? st.labelAr : st.labelEn}
            </span>
          ))}
        </div>
      </div>

      {/* Wizard Step Content Switcher */}
      <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50/50 min-h-[220px] flex flex-col justify-between">
        {currentStep === 1 && (
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-sudan-dark">{isAr ? "الباب الأول: شروط وأهلية استخراج الترخيص الصناعي" : "Chapter I: General Terms & Industrial Eligibility"}</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {isAr 
                ? "يخضع استخراج تراخيص فئة أ لقانون تشجيع الاستثمار والرقابة الصناعية لعام 2035. يجب التأكد من تطابق رأس المال وشروط البيئة." 
                : "Industrial Category A licensing is subject to the Investment Promotion & Environmental Audits Act of 2035. Ensure minimum asset matching."}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
              <Check className="h-4 w-4 shrink-0" />
              <span className="font-bold">{isAr ? "تم التحقق من هويتك الفيدرالية الموحدة بنجاح." : "Unified Federal Identity matched and verified."}</span>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-sudan-dark">{isAr ? "الباب الثاني: بيانات المنشأة الاستثمارية" : "Chapter II: Investment Facility Particulars"}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SovereignInput 
                labelAr="اسم المنشأة التجاري بالكامل" 
                labelEn="Full Corporate Trade Name"
                placeholder="مثال: شركة النيلين للغزل"
                currentLanguage={currentLanguage}
              />
              <SovereignSelect 
                labelAr="النشاط الصناعي الأساسي" 
                labelEn="Primary Industrial Activity"
                currentLanguage={currentLanguage}
                options={[
                  { labelAr: "الصناعات التحويلية الغذائية", labelEn: "Food Processing Industry", value: "food" },
                  { labelAr: "صناعة الجلود والمنسوجات", labelEn: "Textiles & Leather Goods", value: "textiles" }
                ]}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-3">
            <SovereignFileUpload 
              labelAr="دراسة الجدوى الفنية وتقرير الأثر البيئي المعمد (PDF)" 
              labelEn="Technical Feasibility Study & Environmental Report (PDF)"
              currentLanguage={currentLanguage}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-3">
            <SovereignSignaturePad currentLanguage={currentLanguage} />
            <p className="text-[10px] text-amber-600 text-center font-bold">
              {isAr ? "بالضغط على تقديم، فإنك تصادق على صحة البيانات أمام وزارة العدل." : "By signing and submitting, you verify data truthfulness under penalty of commerce auditing acts."}
            </p>
          </div>
        )}

        {/* Navigation Actions bar inside Wizard */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
          <SovereignButton 
            variant="outline" 
            size="sm" 
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(p => Math.max(p - 1, 1))}
            leftIcon={<ArrowLeft className="h-3.5 w-3.5 transform rtl:rotate-180" />}
          >
            {isAr ? "السابق" : "Back"}
          </SovereignButton>

          <div className="flex gap-2">
            <SovereignButton variant="ghost" size="sm" className="text-gray-400 font-bold">
              {isAr ? "حفظ كمسودة" : "Save Draft"}
            </SovereignButton>
            
            {currentStep < steps.length ? (
              <SovereignButton 
                variant="primary" 
                size="sm" 
                onClick={() => setCurrentStep(p => Math.min(p + 1, steps.length))}
                rightIcon={<ArrowRight className="h-3.5 w-3.5 transform rtl:rotate-180" />}
              >
                {isAr ? "التالي" : "Next"}
              </SovereignButton>
            ) : (
              <SovereignButton variant="success" size="sm">
                {isAr ? "تقديم الطلب للوزير" : "Submit to Ministry"}
              </SovereignButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. PATTERN 04: Dashboard Pattern
// ==========================================
export const GovDashboardPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  const [selectedDashboard, setSelectedDashboard] = useState<"minister" | "investor">("minister");

  return (
    <div className="bg-slate-50 border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h3 className="font-black text-sm text-sudan-green">{isAr ? "لوحات قياس الأداء الحكومي والسيادي" : "Federal & Sovereign Performance Dashboards"}</h3>
          <p className="text-[10px] text-gray-400">{isAr ? "تصفح موازين الأداء بحسب صلاحياتك المعتمدة" : "Switch dashboard profiles according to your authorized credentials"}</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setSelectedDashboard("minister")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              selectedDashboard === "minister" ? "bg-white text-sudan-green shadow-xs" : "text-gray-500 hover:text-sudan-green"
            }`}
          >
            {isAr ? "لوحة الوزير والمدير العام" : "Ministerial Ledger"}
          </button>
          <button 
            onClick={() => setSelectedDashboard("investor")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              selectedDashboard === "investor" ? "bg-white text-sudan-green shadow-xs" : "text-gray-500 hover:text-sudan-green"
            }`}
          >
            {isAr ? "لوحة المستثمر والمنشأة" : "Investor Hub"}
          </button>
        </div>
      </div>

      {selectedDashboard === "minister" ? (
        <div className="space-y-6">
          {/* Minister KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { labelAr: "معدل الرخص الصادرة اليوم", labelEn: "Licenses Approved Today", val: "1,240", change: "+12.4%", trend: "up" },
              { labelAr: "رسوم الاستثمار الفيدرالية", labelEn: "Federal Investment Duties", val: "420.5M SDG", change: "+4.5%", trend: "up" },
              { labelAr: "معاملات متأخرة بالانتظار", labelEn: "Overdue Pending Reviews", val: "12", change: "-25%", trend: "down" }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs space-y-2">
                <p className="text-[10px] text-gray-400 font-bold">{isAr ? kpi.labelAr : kpi.labelEn}</p>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-black text-sudan-green font-mono">{kpi.val}</h3>
                  <span className={`text-[9px] font-black font-mono ${kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights & Recent Activities for Minister */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sudan-gold">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <h4 className="font-extrabold text-xs">{isAr ? "تحليل الذكاء الاصطناعي السيادي" : "Sovereign AI Analytical Insights"}</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isAr 
                  ? "تحذير أداء: ارتفع معدل انتظار ترخيص الصمغ العربي بولاية البحر الأحمر إلى 4 أيام. نوصي بتفويض وكيل ولاية فرعي لتلافي التراكم." 
                  : "Performance Alert: Red Sea Gum Arabic export license latency increased to 4 days. Suggest delegation to local hub."}
              </p>
              <div className="flex justify-end pt-2">
                <SovereignButton variant="ai-action" size="sm" className="text-[10px] font-bold">
                  {isAr ? "تنفيذ التوجيه التلقائي" : "Apply Suggested Optimization"}
                </SovereignButton>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-5 space-y-3">
              <h4 className="font-extrabold text-xs text-sudan-green">{isAr ? "آخر الأنشطة والتدقيق الفيدرالي" : "Live Audit Logs & Actions"}</h4>
              <div className="space-y-3 text-[11px] font-sans">
                {[
                  { descAr: "اعتمد المسجل العام سجل شركة مروي للتعدين المحدودة.", descEn: "Registrar General approved Merowe Mining Co.", date: "10 mins ago" },
                  { descAr: "تم رفض طلب استيراد مواد كيميائية لمخالفته المعايير البيئية.", descEn: "Chemical Import request rejected (Environmental breach).", date: "1 hr ago" }
                ].map((act, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-gray-100/50 pb-2.5">
                    <p className="text-gray-600 leading-relaxed max-w-xs">{isAr ? act.descAr : act.descEn}</p>
                    <span className="text-[9px] text-gray-400 font-mono">{act.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 p-5 rounded-3xl space-y-3">
            <h4 className="font-extrabold text-xs text-sudan-dark">{isAr ? "تراخيصك النشطة وسجلات الشركات" : "Your Active Sovereign Registries"}</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 border border-gray-100 p-3.5 rounded-2xl text-xs">
                <div className="space-y-1">
                  <h5 className="font-extrabold text-sudan-green">شركة الخرطوم الموحدة لتصدير الصمغ العربي</h5>
                  <p className="text-[9px] text-gray-400 font-mono">REG-ID: SD-2026-90412</p>
                </div>
                <SovereignBadge variant="approved" currentLanguage={currentLanguage} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. PATTERN 05: Approval Workflow Pattern
// ==========================================
export const GovApprovalWorkflowPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  const [workflowState, setWorkflowState] = useState<"auditing" | "signed">("auditing");

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div>
        <h3 className="font-black text-sm text-sudan-green">{isAr ? "مسار التدقيق والاعتماد السيادي المتكامل" : "Sovereign Audit & Approval Ledger"}</h3>
        <p className="text-[10px] text-gray-400">{isAr ? "تتبع حالة الطلبات والتدقيق والختم النهائي" : "Track legal workflow, multi-agency audit consensus, and signature steps"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* State Flow Map */}
        <div className="col-span-1 bg-slate-50 border border-gray-100 p-4 rounded-2xl space-y-4">
          <h4 className="font-bold text-xs text-sudan-green">{isAr ? "حالة مسار الاعتماد" : "Workflow Consensus Step"}</h4>
          <SovereignTimeline 
            currentLanguage={currentLanguage}
            steps={[
              { titleAr: "إرسال البيانات واستلامها", titleEn: "Submission received", date: "July 01", status: "completed" },
              { titleAr: "مطابقة السجل المدني والضرائب", titleEn: "Consolidated Federal Check", date: "July 05", status: "completed" },
              { titleAr: "الاعتماد والتوقيع بالختم الموحد", titleEn: "Sovereign Signature Pad", date: "July 12", status: workflowState === "signed" ? "completed" : "current" }
            ]}
          />
        </div>

        {/* Action Panel for Auditor or User */}
        <div className="col-span-2 space-y-5">
          {workflowState === "auditing" ? (
            <div className="bg-white border border-gray-200 p-5 rounded-3xl space-y-4">
              <h4 className="font-extrabold text-xs text-sudan-dark">{isAr ? "مطلوب إجراء: التوقيع والمصادقة النهائية للوزير" : "Action Required: Official Ministerial Signature"}</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {isAr 
                  ? "تأكد من مراجعة دراسة الأثر التجاري والبيئي قبل التوقيع. التوقيع الرقمي التالي سيقوم بختم الترخيص وإرساله برمز QR لبلد المنشأ." 
                  : "Review commercial and technical feasibility before signing. The digital signature below will cryptographically lock the record."}
              </p>
              
              <SovereignSignaturePad currentLanguage={currentLanguage} />

              <div className="flex justify-end gap-2 pt-2">
                <SovereignButton variant="danger" size="sm">
                  {isAr ? "رفض الطلب مع السبب" : "Reject application"}
                </SovereignButton>
                <SovereignButton 
                  variant="success" 
                  size="sm"
                  onClick={() => setWorkflowState("signed")}
                >
                  {isAr ? "إصدار وتعميد الشهادة" : "Verify & Issue Certificate"}
                </SovereignButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-3xl flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-xs text-emerald-800">{isAr ? "تم تعميد الترخيص وإصداره بالختم السيادي بنجاح!" : "Sovereign Certificate Successfully Signed & Cryptographically Stamped!"}</h4>
                  <p className="text-[10px] text-emerald-600 mt-0.5">{isAr ? "تم تضمين الرمز الوطني المشفر وإرساله بالبريد المعتمد للمنشأة." : "Encrypted barcode has been registered. PDF document generated below."}</p>
                </div>
              </div>

              {/* Document viewer integration */}
              <SovereignDocumentViewer 
                titleAr="شهادة التصدير السيادية لصمغ الهشاب الفاخر"
                titleEn="Official Sovereign Export Certificate - Premium Hashab Gum"
                docId="SD-EXP-2026-90025"
                issueDate="2026-07-12"
                ownerAr="مؤسسة صادرات النيل الأزرق الزراعية"
                ownerEn="Blue Nile Agricultural Export Syndicate"
                currentLanguage={currentLanguage}
                additionalDetails={[
                  { labelAr: "الكمية المعتمدة للتصدير سنويًا", labelEn: "Authorized Annual Export Quota", value: "250 Metric Tons" },
                  { labelAr: "ميناء التصدير الرسمي المعتمد", labelEn: "Official Shipping Port", value: "ميناء بورتسودان الجنوبي" }
                ]}
              />

              <div className="flex justify-center">
                <SovereignButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => setWorkflowState("auditing")}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  {isAr ? "إعادة تعيين للتجربة" : "Reset Test View"}
                </SovereignButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. PATTERN 06: Government Search Experience
// ==========================================
export const GovSearchExperiencePattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5 font-sans">
      <div>
        <h3 className="font-black text-sm text-sudan-green">{isAr ? "نظام البحث والتقصي الرقمي الفيدرالي" : "Federal Search & Registry Intelligence Experience"}</h3>
        <p className="text-[10px] text-gray-400">{isAr ? "تصفح مستندات وسجلات الشركات الوطنية الموثقة بالرقم القومي" : "Query certified national company profiles and public administrative gazettes"}</p>
      </div>

      <SovereignSearchBox 
        placeholder={isAr ? "ابحث بالاسم، رقم السجل، أو بنشاط الاستيراد..." : "Search by company name, registry code, or export license..."}
        currentLanguage={currentLanguage}
        isAIActive={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        <div className="border border-gray-100 p-4 rounded-2xl bg-slate-50/50 space-y-2">
          <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">{isAr ? "أحدث عمليات البحث" : "Recent Search History"}</h4>
          <ul className="space-y-1.5 text-[11px] font-bold text-slate-700">
            <li className="flex items-center gap-2 hover:text-sudan-green cursor-pointer">🔍 {isAr ? "شركة النيل الأزرق للملاحة" : "Blue Nile Shipping"}</li>
            <li className="flex items-center gap-2 hover:text-sudan-green cursor-pointer">🔍 {isAr ? "ترخيص تصدير صمغ عربي" : "Gum Arabic export license"}</li>
          </ul>
        </div>

        <div className="border border-gray-100 p-4 rounded-2xl bg-slate-50/50 space-y-2 md:col-span-2">
          <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">{isAr ? "الكلمات المفتاحية المقترحة ذكياً" : "Suggested AI Search Queries"}</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "الاستثمار في ولاية الجزيرة",
              "شروط استيراد الجرارات والمعدات الزراعية",
              "المسجل التجاري بورتسودان",
              "تراخيص الفئة أ للحديد والصلب"
            ].map((kw, idx) => (
              <span key={idx} className="bg-white border border-gray-200/60 text-slate-700 hover:text-sudan-green hover:border-sudan-green text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. PATTERN 07: Government Document Center
// ==========================================
export const GovDocumentCenterPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-sm text-sudan-green">{isAr ? "مركز المستندات والوثائق السيادية الموحد" : "Unified Sovereign Document Vault"}</h3>
          <p className="text-[10px] text-gray-400">{isAr ? "تحقق من مستندات ورخص شركتك الصادرة إلكترونياً وصلاحيتها" : "Verify credibility, status, and expiry schedules of corporate licenses"}</p>
        </div>
        <SovereignButton variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          {isAr ? "تحميل الكل (ZIP)" : "Download All (ZIP)"}
        </SovereignButton>
      </div>

      <div className="space-y-3 text-xs">
        {[
          { nameAr: "شهادة السجل التجاري الفيدرالي الموحد", nameEn: "Unified Federal Commercial Register", code: "REG-901", date: "2026-07-12", expiry: "2027-07-12", status: "approved" },
          { nameAr: "رخصة الدفاع المدني والسلامة الفئة أ", nameEn: "Civil Defense Safety Permit - Class A", code: "SAF-142", date: "2026-05-10", expiry: "2027-05-10", status: "completed" },
          { nameAr: "موافقة المسجل العام للأراضي الصناعية", nameEn: "Registrar General Industrial Land Consent", code: "LAN-502", date: "2026-01-15", expiry: "Permanent", status: "approved" }
        ].map((doc, idx) => (
          <div key={idx} className="bg-slate-50 border border-gray-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-sudan-green">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800">{isAr ? doc.nameAr : doc.nameEn}</h4>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                  <span>CODE: {doc.code}</span>
                  <span>EXP: {doc.expiry}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SovereignBadge variant={doc.status as any} currentLanguage={currentLanguage} />
              <button className="p-2 rounded-lg bg-white border border-gray-200 hover:text-sudan-green cursor-pointer"><Eye className="h-4 w-4" /></button>
              <button className="p-2 rounded-lg bg-white border border-gray-200 hover:text-sudan-green cursor-pointer"><Download className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. PATTERN 08: Company Profile Pattern
// ==========================================
export const GovCompanyProfilePattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div className="flex items-start gap-4 border-b border-gray-100 pb-5">
        <SovereignAvatar roleType="company" name="Khartoum" size="lg" />
        <div className="space-y-1">
          <h2 className="text-base font-black text-sudan-dark">{isAr ? "شركة الخرطوم الموحدة لتصدير الصمغ العربي" : "Khartoum Unified Gum Arabic Export Co."}</h2>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-gray-400">
            <span>SD-2026-90412</span>
            <span>•</span>
            <span>{isAr ? "المركز الرئيسي: ولاية الخرطوم - بحري" : "Headquarters: Khartoum North"}</span>
          </div>
          <div className="pt-1 flex gap-1.5">
            <SovereignBadge variant="approved" currentLanguage={currentLanguage} />
            <SovereignBadge variant="active" currentLanguage={currentLanguage} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Company specifications */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-extrabold text-xs text-sudan-green border-b border-gray-100 pb-1.5">{isAr ? "تفاصيل التسجيل والشركاء" : "Incorporate Shareholders & Registry Details"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] text-gray-400 font-bold">{isAr ? "رأس المال المدفوع والمصرح" : "Authorized Paid Capital"}</p>
              <p className="font-extrabold text-slate-800 font-mono">10,000,000 SDG</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold">{isAr ? "المدير التنفيذي المفوض" : "Authorized Executive Manager"}</p>
              <p className="font-extrabold text-slate-800">{isAr ? "أسامة عبد المنعم" : "Osama Abdelmoniem"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold">{isAr ? "أنشطة التصدير المرخصة" : "Licensed Export Activities"}</p>
              <p className="font-extrabold text-slate-800">{isAr ? "الصمغ العربي، الكركدي، الهشاب الفاخر" : "Gum Arabic, Hibiscus, Agricultural commodities"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold">{isAr ? "الرقم الضريبي الموحد" : "Unified Corporate Tax Code"}</p>
              <p className="font-extrabold text-slate-800 font-mono">TAX-SUD-350124-M</p>
            </div>
          </div>
        </div>

        {/* Compliance checklist sidebar */}
        <div className="border border-gray-100 p-4 rounded-2xl bg-slate-50/50 space-y-3">
          <h4 className="font-bold text-xs text-sudan-green">{isAr ? "مؤشر الامتثال السيادي" : "Sovereign Compliance Index"}</h4>
          <div className="space-y-2 text-[11px] font-sans">
            <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
              <span>{isAr ? "تراخيص البيئة نشطة" : "Environmental Clearance"}</span>
              <span className="text-emerald-600 font-bold">✓ Active</span>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
              <span>{isAr ? "التقرير المالي السنوي" : "Annual Financial Filing"}</span>
              <span className="text-emerald-600 font-bold">✓ Filed</span>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
              <span>{isAr ? "شهادة الزكاة الموحدة" : "Unified Zakat Ledger"}</span>
              <span className="text-emerald-600 font-bold">✓ Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. PATTERN 09: Investor Workspace Pattern
// ==========================================
export const GovInvestorWorkspacePattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-black text-sm text-sudan-green">{isAr ? "مساحة عمل المستثمر الذكية" : "Investor Workspace & Opportunities Ledger"}</h3>
          <p className="text-[10px] text-gray-400">{isAr ? "إدارة طلباتك، التراخيص، وفرص الاستثمار الفيدرالي السوداني لعام 2035" : "Manage applications, licenses, and verified Sudan 2035 economic opportunities"}</p>
        </div>
        <SovereignButton variant="ai-action" size="sm" leftIcon={<Sparkles className="h-4 w-4" />}>
          {isAr ? "توصيات استثمارية بالذكاء الاصطناعي" : "AI Investment Matchmaking"}
        </SovereignButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Active applications */}
        <div className="md:col-span-2 border border-gray-100 p-5 rounded-3xl space-y-3.5 bg-slate-50/50">
          <h4 className="font-extrabold text-xs text-sudan-green">{isAr ? "الطلبات والمشاريع قيد التدقيق الفيدرالي" : "Your Applications in Queue"}</h4>
          <div className="space-y-3">
            {[
              { titleAr: "طلب توسيع مصنع طحن الغلال ببحر الغزال", titleEn: "Ghazal Flour Mill Extension Project", progress: "80%", status: "pending" },
              { titleAr: "ترخيص استيراد خطوط إنتاج وتعبئة صمغ", titleEn: "Package & Production Line Import", progress: "completed", status: "completed" }
            ].map((app, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800">{isAr ? app.titleAr : app.titleEn}</h5>
                  <span className="text-[10px] text-gray-400 font-mono">Progress: {app.progress}</span>
                </div>
                <SovereignBadge variant={app.status as any} currentLanguage={currentLanguage} />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Calendar agenda widget */}
        <div className="border border-gray-100 p-4 rounded-3xl bg-white space-y-3 shadow-xs">
          <h4 className="font-extrabold text-xs text-sudan-dark flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-sudan-gold" />
            <span>{isAr ? "المواعيد والزيارات الميدانية" : "Field Inspections Agenda"}</span>
          </h4>
          <div className="space-y-2.5 text-[11px] font-sans">
            <div className="p-2.5 bg-amber-500/10 border-r-4 border-amber-500 rounded-lg text-amber-800">
              <p className="font-bold">{isAr ? "معاينة موقع المصنع - بحري" : "Inspection: Factory site Bahri"}</p>
              <p className="text-[10px] text-amber-600 mt-0.5">July 15, 10:00 AM</p>
            </div>
            <div className="p-2.5 bg-emerald-500/10 border-r-4 border-emerald-500 rounded-lg text-emerald-800">
              <p className="font-bold">{isAr ? "اجتماع مطابقة اللوائح مع المسجل" : "Ministry Compliance Session"}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">July 20, 11:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. PATTERN 10: Inspection Pattern
// ==========================================
export const GovInspectionPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div>
        <h3 className="font-black text-sm text-sudan-green">{isAr ? "بوابة التفتيش والرقابة الميدانية والامتثال" : "Federal Field Inspection & Regulatory Compliance Portal"}</h3>
        <p className="text-[10px] text-gray-400">{isAr ? "تخطيط خطوط سير المفتشين وتعبئة تقارير المخالفات الفورية الموثقة بالصور والموقع" : "Auditor routing, field violation logging, and immediate geographic site synchronization"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inspection routing and schedule */}
        <div className="border border-gray-100 p-5 rounded-3xl space-y-4 bg-slate-50/50">
          <h4 className="font-extrabold text-xs text-sudan-dark flex items-center gap-1.5">
            <MapPin className="h-4.5 w-4.5 text-sudan-green" />
            <span>{isAr ? "مسار التفتيش الميداني اليوم" : "Today's Field Route Audit"}</span>
          </h4>
          
          <div className="space-y-3">
            {[
              { nameAr: "مجمع طحن النيل لإنتاج الدقيق", nameEn: "Nile Flour Processing Plant", loc: "منطقة بحري الصناعية", status: "completed" },
              { nameAr: "شركة الخرطوم للغزل والمنسوجات", nameEn: "Khartoum Textile Syndicate", loc: "منطقة أمدرمان الصناعية", status: "pending" }
            ].map((ins, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800">{isAr ? ins.nameAr : ins.nameEn}</h5>
                  <p className="text-[10px] text-gray-400">📍 {ins.loc}</p>
                </div>
                <SovereignBadge variant={ins.status as any} currentLanguage={currentLanguage} />
              </div>
            ))}
          </div>
        </div>

        {/* Violations & Immediate audit report form */}
        <div className="border border-gray-200 p-5 rounded-3xl space-y-4 bg-white">
          <h4 className="font-extrabold text-xs text-rose-600 flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5" />
            <span>{isAr ? "تقرير مخالفة أو تجاوز للمواصفات" : "Log Regulatory Violation / Breach"}</span>
          </h4>

          <div className="space-y-3">
            <SovereignSelect 
              labelAr="نوع المخالفة الميدانية" 
              labelEn="Breach Classification"
              currentLanguage={currentLanguage}
              options={[
                { labelAr: "مخالفة بيئية أو انبعاثات ضارة", labelEn: "Environmental Pollutant Hazard", value: "env" },
                { labelAr: "عدم تجديد رخصة الأمن والسلامة", labelEn: "Safety Code / Fire License Overdue", value: "safety" }
              ]}
            />
            
            <SovereignFileUpload 
              labelAr="إرفاق صور المخالفة والأثر (PDF/JPG)" 
              labelEn="Evidence File / Photographic Audit"
              currentLanguage={currentLanguage}
            />

            <SovereignSignaturePad currentLanguage={currentLanguage} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 11. PATTERN 11: Reporting & Analytics Pattern
// ==========================================
export const GovReportingPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-black text-sm text-sudan-green">{isAr ? "مركز التقارير السنوية والتحليلات السيادية" : "Sovereign Reporting & Analytics Vault"}</h3>
          <p className="text-[10px] text-gray-400">{isAr ? "تصدير الإحصائيات وبلاغات التنمية الصناعية الفيدرالية لعام 2035" : "Export verified statistical ledgers and industrial development parameters"}</p>
        </div>
        <SovereignButton variant="outline" size="sm" leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
          {isAr ? "تصدير التقرير (Excel)" : "Export Spreadsheet"}
        </SovereignButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Analytics KPIs */}
        <div className="md:col-span-2 bg-slate-50 border border-gray-100 p-5 rounded-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-gray-100 space-y-1">
            <p className="text-[10px] text-gray-400 font-bold">{isAr ? "مجموع عوائد الصادرات الصناعية" : "Consolidated Industrial Export Revenue"}</p>
            <h3 className="text-base font-black text-sudan-green font-mono">1.2B USD</h3>
            <span className="text-[9px] text-emerald-600 font-bold">↑ 18.5% {isAr ? "مقارنة بالعام الماضي" : "vs previous term"}</span>
          </div>
          <div className="bg-white p-4.5 rounded-2xl border border-gray-100 space-y-1">
            <p className="text-[10px] text-gray-400 font-bold">{isAr ? "نسبة المنشآت المستوفية لشروط التنمية" : "Corporate Regulatory Compliance Ratio"}</p>
            <h3 className="text-base font-black text-sudan-green font-mono">94.2%</h3>
            <span className="text-[9px] text-emerald-600 font-bold">↑ 2.4% {isAr ? "زيادة وعي الامتثال" : "improvement"}</span>
          </div>
        </div>

        {/* AI Analytical Summary */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3.5">
          <div className="flex items-center gap-1.5 text-sudan-gold">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <h4 className="font-extrabold text-xs">{isAr ? "ملخص ذكي من مساعد التجارة" : "AI Analytical Intelligence Brief"}</h4>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            {isAr 
              ? "يظهر تحليل تداول الصمغ والسمسم نمواً غير مسبوق في ميناء بورتسودان الجنوبي. نوصي بتهيئة مساحات تخزين مبردة وتدشين مسار استثمار معمد." 
              : "Sesame and Gum Arabic exports depict exceptional growth curves. Advise opening specialized cold-storage facilities near the hub."}
          </p>
          <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest border-t border-slate-800 pt-2 text-center">
            {isAr ? "إشعار: القرار النهائي مخول لموظف الوزارة المعتمد." : "Final decisions remain subject to authorized human audit."}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. PATTERN 12: AI Assistant Pattern
// ==========================================
export const GovAIAssistantPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div>
        <h3 className="font-black text-sm text-sudan-green">{isAr ? "مساعد الوزارة الذكي والتشريعات" : "Ministry Intelligence & Regulatory AI Guide"}</h3>
        <p className="text-[10px] text-gray-400">{isAr ? "بوابة استفسارات القوانين واللوائح الفيدرالية والشركات" : "Inquire about investment frameworks, legal guidelines, or import quotas"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          <SovereignAIChatWindow currentLanguage={currentLanguage} />
          
          {/* Important government official disclaimer required by pattern */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-800 leading-relaxed font-medium">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" />
            <p>
              {isAr 
                ? "إخلاء مسؤولية سيادية: يعتبر مساعد الذكاء الاصطناعي أداة استشارية فقط لتوضيح اللوائح والتشريعات. كافة القرارات والاعتمادات والتراخيص الرسمية تصدر حصرياً من قبل مسؤولي وموظفي وزارة التجارة والصناعة المخولين قانوناً." 
                : "Sovereign Disclaimer: This AI Assistant is an advisory channel to help explain rules. All formal credentials, approvals, and legal licensing authorizations are exclusively issued by authorized officers of the Ministry."}
            </p>
          </div>
        </div>

        {/* Suggestion questions sidebar */}
        <div className="md:col-span-2 border border-gray-100 p-5 rounded-3xl bg-slate-50/50 space-y-4">
          <h4 className="font-extrabold text-xs text-sudan-green">{isAr ? "مواضيع مقترح للاستعلام عنها" : "Suggested Queries"}</h4>
          <div className="space-y-3 text-xs font-bold text-slate-700">
            {[
              { qAr: "ما هي الأوراق المطلوبة لتسجيل مصنع أدوية؟", qEn: "What are the requirements for a pharmaceutical plant?" },
              { qAr: "شروط إعفاء الآلات الزراعية من الرسوم الضريبية", qEn: "Agricultural machinery custom duty exemptions" },
              { qAr: "تحديث السجلات الأجنبية وفقاً لقوانين 2035", qEn: "Foreign investment amendments under 2035 code" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 hover:border-sudan-green transition-colors cursor-pointer flex justify-between items-center">
                <span>{isAr ? item.qAr : item.qEn}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 transform rtl:rotate-180" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 13. PATTERN 13: Notification Center Pattern
// ==========================================
export const GovNotificationCenterPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-sm text-sudan-green">{isAr ? "مركز الإشعارات والإنذارات السيادية الموحد" : "Unified Sovereign Notifications Ledger"}</h3>
          <p className="text-[10px] text-gray-400">{isAr ? "تلقي وتتبع الإشعارات والقرارات الرسمية من المدير والوزارة" : "Sovereign administrative notices, license status updates, and cabinet circulars"}</p>
        </div>
        <span className="text-[11px] bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full font-bold">2 {isAr ? "غير مقروءة" : "Unread"}</span>
      </div>

      <div className="space-y-3.5 text-xs">
        {[
          { titleAr: "موافقة نهائية على رخصة تصدير السمسم المقشر", titleEn: "Sesame Export License Authorized", descAr: "تم اعتماد توقيعك وإصدار الشهادة بالرمز QR المشفر.", descEn: "Registry successfully authenticated. Stamped PDF generated.", priority: "high", unread: true },
          { titleAr: "تنبيه: اقتراب انتهاء صلاحية رخصة البيئة والأمن الصناعي", titleEn: "Warning: Industrial Safety Code Expiry", descAr: "يجب تجديد الرخصة خلال 14 يوماً لتفادي الغرامات المالية.", descEn: "Permit expires in 14 days. Please file renewal promptly.", priority: "medium", unread: true },
          { titleAr: "تم تسوية الرسوم والضرائب السنوية للشركة بنجاح", titleEn: "Annual Corporate Tax Settled", descAr: "تم تحديث السجل التجاري الموحد تلقائياً في البوابة.", descEn: "Tax clearance complete. Registry sync finalized.", priority: "low", unread: false }
        ].map((notif, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              notif.unread 
                ? "bg-[#007A33]/5 border-sudan-green/20 shadow-xs" 
                : "bg-white border-gray-100"
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
              notif.priority === "high" ? "bg-rose-500 animate-pulse" : notif.priority === "medium" ? "bg-amber-500" : "bg-gray-300"
            }`} />
            
            <div className="space-y-1 flex-1">
              <h4 className="font-extrabold text-slate-800">{isAr ? notif.titleAr : notif.titleEn}</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">{isAr ? notif.descAr : notif.descEn}</p>
            </div>

            <button className="text-[10px] text-sudan-green font-bold hover:underline shrink-0">{isAr ? "عرض التفاصيل" : "Inspect"}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 14. PATTERN 14: Error & Empty States Pattern
// ==========================================
export const GovErrorStatesPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  const [activeError, setActiveError] = useState<"no-data" | "permission-denied" | "expired-session">("permission-denied");

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h3 className="font-black text-sm text-sudan-green">{isAr ? "نماذج الأخطاء وحالات فراغ البيانات المعتمدة" : "Standardized Error & Empty Experience States"}</h3>
          <p className="text-[10px] text-gray-400">{isAr ? "تصفح معايير الاسترداد والدعم لحالات انقطاع الخدمة أو نقص الصلاحية" : "Test recoverability UI workflows and instructions for broken sessions or access denials"}</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveError("no-data")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeError === "no-data" ? "bg-white text-sudan-green shadow-xs" : "text-gray-500 hover:text-sudan-green"
            }`}
          >
            {isAr ? "فراغ السجلات" : "No Data State"}
          </button>
          <button 
            onClick={() => setActiveError("permission-denied")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeError === "permission-denied" ? "bg-white text-sudan-green shadow-xs" : "text-gray-500 hover:text-sudan-green"
            }`}
          >
            {isAr ? "غير مسموح" : "Access Denied"}
          </button>
          <button 
            onClick={() => setActiveError("expired-session")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeError === "expired-session" ? "bg-white text-sudan-green shadow-xs" : "text-gray-500 hover:text-sudan-green"
            }`}
          >
            {isAr ? "انتهاء الجلسة" : "Session Expired"}
          </button>
        </div>
      </div>

      <div className="border border-gray-100 rounded-3xl p-8 bg-slate-50/50 flex flex-col items-center text-center space-y-5 max-w-lg mx-auto">
        {activeError === "no-data" && (
          <>
            <div className="w-14 h-14 bg-gray-200/60 rounded-full flex items-center justify-center text-gray-400">
              <Layers className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-800">{isAr ? "لا توجد سجلات تراخيص نشطة حالياً" : "No Active Sovereign Credentials Found"}</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                {isAr 
                  ? "لم نجد أي طلبات تأسيس مرصودة باسمك في قاعدة البيانات المركزية لعام 2035." 
                  : "We could not locate any registered corporations under your unified citizen credentials."}
              </p>
            </div>
            <SovereignButton variant="primary" size="sm">
              {isAr ? "إنشاء شركة جديدة" : "Initiate Incorporation"}
            </SovereignButton>
          </>
        )}

        {activeError === "permission-denied" && (
          <>
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-600">
              <XCircle className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-rose-800">{isAr ? "عذراً، لا تمتلك الصلاحية الكافية" : "Unified Access Level Check Failed"}</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                {isAr 
                  ? "هذا الباب مخصص للمفتش الميداني المفوض والوزير فقط. يرجى توثيق هويتك بمستوى 2A." 
                  : "This section is restricted to authorized field auditors and ministerial cabinets. Upgrade security clearance to level 2A."}
              </p>
            </div>
            <div className="flex gap-2">
              <SovereignButton variant="outline" size="sm">
                {isAr ? "تقديم طلب الصلاحية" : "Request Clearance"}
              </SovereignButton>
              <SovereignButton variant="primary" size="sm">
                {isAr ? "العودة للرئيسية" : "Back to Home"}
              </SovereignButton>
            </div>
          </>
        )}

        {activeError === "expired-session" && (
          <>
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-600">
              <Clock className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-800">{isAr ? "انتهت جلسة العمل الآمنة للمصادقة" : "Secure Session Handshake Timeout"}</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                {isAr 
                  ? "لحماية أسرار منشأتك وبياناتك الضريبية، يتم إغلاق الحساب تلقائياً بعد فترة من الخمول." 
                  : "To secure proprietary commercial ledgers and tax records, session is auto-closed after inactivity thresholds."}
              </p>
            </div>
            <SovereignButton variant="secondary" size="sm">
              {isAr ? "أعد إثبات الهوية (Re-Authenticate)" : "Re-Authenticate"}
            </SovereignButton>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 15. PATTERN 15: Government Help & Support Pattern
// ==========================================
export const GovHelpSupportPattern: React.FC<{ currentLanguage: "ar" | "en" }> = ({ currentLanguage }) => {
  const isAr = currentLanguage === "ar";
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      <div>
        <h3 className="font-black text-sm text-sudan-green">{isAr ? "بوابة المساعدة وبلاغات الغش والدعم الفني" : "Unified Federal Help, Grievance, & Technical Support"}</h3>
        <p className="text-[10px] text-gray-400">{isAr ? "تصفح الأسئلة الشائعة أو افتح تذكرة امتثال عاجلة للنزاعات التجارية" : "Browse FAQs, initiate live tickets, or consult AI on grievance filing protocols"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQs */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs text-sudan-green">{isAr ? "الأسئلة الفيدرالية الشائعة" : "Authorized Registry FAQs"}</h4>
          <div className="space-y-2.5 text-xs">
            {[
              { qAr: "كم يستغرق تجديد السجل التجاري؟", qEn: "How long does registry renewal take?", aAr: "يتم في خلال 3 دقائق عبر بوابة الدفع والختم الموحد في حالة استيفاء الضرائب والزكاة.", qEnA: "Renewal takes 3 minutes if tax and zakat parameters are met." },
              { qAr: "ما هو الرمز الموحد للمنشآت الأجنبية؟", qEn: "What is the foreign enterprise code?", aAr: "هو رمز رقمي من 10 خانات يمنح للمستثمر الخارجي فور توثيق رأس المال.", qEnA: "A unique 10-digit ledger code issued to certified foreign capitalists." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100 space-y-1.5">
                <p className="font-extrabold text-slate-800">{isAr ? faq.qAr : faq.qEn}</p>
                <p className="text-[11px] text-gray-400 leading-normal">{isAr ? faq.aAr : faq.qEnA}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support ticket submission form */}
        <div className="border border-gray-200 p-5 rounded-3xl space-y-4">
          <h4 className="font-extrabold text-xs text-sudan-dark">{isAr ? "فتح بلاغ أو طلب دعم فني سيادي" : "Initiate Support Circular / Ticket"}</h4>
          
          <div className="space-y-3">
            <SovereignInput 
              labelAr="موضوع البلاغ أو الاستفسار" 
              labelEn="Grievance Subject"
              isRequired={true}
              currentLanguage={currentLanguage}
            />
            
            <SovereignSelect 
              labelAr="تصنيف البلاغ والخطورة" 
              labelEn="Urgency Classification"
              currentLanguage={currentLanguage}
              options={[
                { labelAr: "مستعجل جداً - تعطل عملية التصدير بالميناء", labelEn: "Critical - Export halt at Shipping Port", value: "critical" },
                { labelAr: "استفسار إداري عن تجديد السجل", labelEn: "Administrative registry inquiry", value: "normal" }
              ]}
            />

            <SovereignButton variant="primary" isFullWidth={true}>
              {isAr ? "إرسال البلاغ لغرفة العمليات" : "Forward Grievance to Ministry Command"}
            </SovereignButton>
          </div>
        </div>
      </div>
    </div>
  );
};
