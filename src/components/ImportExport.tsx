/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileCheck, Globe, Plus, CheckCircle, Clock, Search, X, 
  ArrowLeftRight, FileText, Anchor, Compass, Printer, Download,
  UserCheck, Map, Truck, ShieldAlert, BarChart2, Brain, Sparkles, Check
} from "lucide-react";
import { ImportExportLicense, CertificateOfOrigin, ApplicationStatus } from "../types";

// Import modular sub-components
import TraderRegistry from "./trade/TraderRegistry";
import TradeLogistics from "./trade/TradeLogistics";
import TradeGisMap from "./trade/TradeGisMap";
import TradeCompliance from "./trade/TradeCompliance";
import TradeAnalytics from "./trade/TradeAnalytics";
import TradeAdvisor from "./trade/TradeAdvisor";
import TradeCertificates from "./trade/TradeCertificates";

interface ImportExportProps {
  currentLanguage: "ar" | "en";
  licenses: ImportExportLicense[];
  certificates: CertificateOfOrigin[];
  onAddLicense: (licenseData: any) => Promise<any>;
  onAddCertificate: (certData: any) => Promise<any>;
  isAdmin: boolean;
  onUpdateLicenseStatus?: (id: string, status: ApplicationStatus) => Promise<any>;
  onUpdateCertStatus?: (id: string, status: ApplicationStatus) => Promise<any>;
}

export default function ImportExportModule({
  currentLanguage,
  licenses,
  certificates,
  onAddLicense,
  onAddCertificate,
  isAdmin,
  onUpdateLicenseStatus,
  onUpdateCertStatus
}: ImportExportProps) {
  // Navigation tabs for the National Trade Platform
  const [activeTab, setActiveTab] = useState<
    "overview" | "licenses" | "certificates" | "registry" | "logistics" | "gis" | "compliance" | "analytics" | "advisor" | "digital_certs"
  >("overview");

  // Forms states
  const [isLicenseFormOpen, setIsLicenseFormOpen] = useState(false);
  const [isCertFormOpen, setIsCertFormOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateOfOrigin | null>(null);

  // License Form State
  const [licenseType, setLicenseType] = useState<"import" | "export">("export");
  const [companyName, setCompanyName] = useState("");
  const [goodsDescription, setGoodsDescription] = useState("");
  const [annualValueEstimate, setAnnualValueEstimate] = useState("");
  const [isSubmittingLicense, setIsSubmittingLicense] = useState(false);
  const [licenseSuccess, setLicenseSuccess] = useState(false);

  // Certificate Form State
  const [exporterName, setExporterName] = useState("");
  const [importerName, setImporterName] = useState("");
  const [importerCountry, setImporterCountry] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [goodsAr, setGoodsAr] = useState("");
  const [goodsEn, setGoodsEn] = useState("");
  const [weightNet, setWeightNet] = useState("");
  const [weightGross, setWeightGross] = useState("");
  const [portOfLoading, setPortOfLoading] = useState("ميناء بورتسودان الجنوبي");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [invoiceValue, setInvoiceValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);
  const [certSuccess, setCertSuccess] = useState(false);

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !goodsDescription || !annualValueEstimate) {
      alert(currentLanguage === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all fields");
      return;
    }

    setIsSubmittingLicense(true);
    try {
      await onAddLicense({
        licenseType,
        companyName,
        goodsDescription,
        annualValueEstimate: Number(annualValueEstimate)
      });
      setLicenseSuccess(true);
      setTimeout(() => {
        setLicenseSuccess(false);
        setIsLicenseFormOpen(false);
        setCompanyName("");
        setGoodsDescription("");
        setAnnualValueEstimate("");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingLicense(false);
    }
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exporterName || !importerName || !importerCountry || !hsCode || !goodsAr || !goodsEn || !weightNet || !weightGross || !invoiceValue) {
      alert(currentLanguage === "ar" ? "يرجى ملء كافة حقول الاستمارة" : "Please fill in all form details");
      return;
    }

    setIsSubmittingCert(true);
    try {
      await onAddCertificate({
        exporterName,
        importerName,
        importerCountry,
        hsCode,
        goodsDescriptionAr: goodsAr,
        goodsDescriptionEn: goodsEn,
        weightNet: Number(weightNet),
        weightGross: Number(weightGross),
        portOfLoading,
        portOfDischarge,
        invoiceValue: Number(invoiceValue),
        currency
      });
      setCertSuccess(true);
      setTimeout(() => {
        setCertSuccess(false);
        setIsCertFormOpen(false);
        setExporterName("");
        setImporterName("");
        setImporterCountry("");
        setHsCode("");
        setGoodsAr("");
        setGoodsEn("");
        setWeightNet("");
        setWeightGross("");
        setPortOfDischarge("");
        setInvoiceValue("");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingCert(false);
    }
  };

  return (
    <div id="import-export-module-root" className="space-y-6">
      
      {/* Top Main Platform Banner */}
      <div className="bg-[#1E293B] text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Abstract Vector Backdrop Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sudan-green/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <span className="text-[10px] bg-sudan-gold/20 text-sudan-gold border border-sudan-gold/30 px-3 py-1 rounded-full font-mono font-bold tracking-wider uppercase">
            {currentLanguage === "ar" ? "منصة وزارة التجارة الموحدة ٢٠٣٥" : "FEDERAL UNIFIED TRADE GATEWAY 2035"}
          </span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none text-white">
            {currentLanguage === "ar" ? "المنصة الوطنية لتسهيل التجارة، الاستيراد، التصدير والخدمات اللوجستية" : "National Trade Facilitation, Import, Export & Logistics Portal"}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
            {currentLanguage === "ar" 
              ? "الربط الفيدرالي الشامل بين السجل التجاري، الجمارك، مواصفات SSMO، والموانئ لتسييل حركات البضائع والترانزيت الإقليمي للكوميسا." 
              : "Comprehensive federal linkage between Trader Registry, Customs, SSMO standard clearances, and marine terminals to streamline COMESA transits."}
          </p>
        </div>

        {/* Global Stats or Quick Action widget */}
        <div className="flex gap-2 relative z-10 w-full md:w-auto shrink-0 justify-end">
          {activeTab === "licenses" && (
            <button
              onClick={() => setIsLicenseFormOpen(true)}
              className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-5 py-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="h-4.5 w-4.5" />
              {currentLanguage === "ar" ? "طلب رخصة صادر/وارد" : "Apply for Trade License"}
            </button>
          )}

          {activeTab === "certificates" && (
            <button
              onClick={() => setIsCertFormOpen(true)}
              className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-5 py-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="h-4.5 w-4.5" />
              {currentLanguage === "ar" ? "إصدار شهادة منشأ جديدة" : "Request Origin Cert"}
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Sub-Navigation Tab Links */}
      <div className="flex flex-wrap border-b border-gray-200 gap-1 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "overview", labelAr: "لوحة التحكم العامة", labelEn: "Overview Dashboard", icon: Globe },
          { id: "licenses", labelAr: "رخص الاستيراد والتصدير", labelEn: "Trade Licenses", icon: ArrowLeftRight },
          { id: "certificates", labelAr: "شهادات المنشأ الجمركية", labelEn: "Origin Certificates", icon: FileCheck },
          { id: "registry", labelAr: "سجل المتعاملين (NTI)", labelEn: "Trader Registry", icon: UserCheck },
          { id: "logistics", labelAr: "سلسلة التتبع واللوجستيات", labelEn: "Logistics Tracking", icon: Truck },
          { id: "gis", labelAr: "الخريطة الجغرافية (GIS)", labelEn: "GIS Trade Map", icon: Map },
          { id: "compliance", labelAr: "الامتثال والمطابقة (SSMO)", labelEn: "Compliance Hub", icon: ShieldAlert },
          { id: "analytics", labelAr: "ذكاء الأعمال والبيانات (BI)", labelEn: "Trade BI & Analytics", icon: BarChart2 },
          { id: "advisor", labelAr: "المستشار الذكي (AI)", labelEn: "AI Trade Advisor", icon: Brain },
          { id: "digital_certs", labelAr: "بوابة الشهادات الرقمية", labelEn: "Sovereign Documents", icon: FileText }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap ${
                isSelected 
                  ? "border-sudan-green text-sudan-green font-extrabold" 
                  : "border-transparent text-gray-400 hover:text-gray-800"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container Switcher */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  titleAr: "البنية التحتية والممرات",
                  titleEn: "Logistics Corridors Status",
                  descAr: "تتبع نشط لـ ٥ ممرات تجارية متكاملة مع معابر مصر وإثيوبيا وموانئ البحر الأحمر بكفاءة تبلغ ٩٢%.",
                  descEn: "Active telemetry for 5 national trade corridors feeding into Egypt, Ethiopia, and maritime hubs.",
                  actionLabelAr: "فتح الخريطة الجغرافية",
                  actionLabelEn: "Open GIS Map",
                  target: "gis"
                },
                {
                  titleAr: "المستشار التجاري للذكاء الاصطناعي",
                  titleEn: "Predictive Trade AI Copilot",
                  descAr: "خوارزميات فحص تلقائي لتوقع نسب تأخير جمارك بورتسودان وسواكن، وتوصيات مسارات الشحن.",
                  descEn: "Autonomous algorithms predicting port customs clearance speeds and optimizing live cargo routes.",
                  actionLabelAr: "استشارة المستشار الذكي",
                  actionLabelEn: "Query AI Advisor",
                  target: "advisor"
                },
                {
                  titleAr: "الامتثال الجمركي ومكافحة AML",
                  titleEn: "Sovereign Compliance & Integrity",
                  descAr: "نظام التحقق المسبق من العقوبات وفحص السلع المقيدة ومطابقتها للمعايير والرقابة الفيدرالية.",
                  descEn: "Sovereign screening checks for restricted tariff codes and coordinating SSMO inspection workflows.",
                  actionLabelAr: "دخول بوابة الامتثال",
                  actionLabelEn: "Open Compliance Hub",
                  target: "compliance"
                }
              ].map((card, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 hover:border-sudan-green hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-[#1E293B] text-base">
                      {currentLanguage === "ar" ? card.titleAr : card.titleEn}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      {currentLanguage === "ar" ? card.descAr : card.descEn}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab(card.target as any)}
                    className="text-xs font-bold text-sudan-green hover:text-sudan-green-light underline mt-2 text-right md:text-left cursor-pointer"
                  >
                    {currentLanguage === "ar" ? card.actionLabelAr : card.actionLabelEn} &rarr;
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Summary of Active Licenses & Certificates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Trade Licenses summary */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {currentLanguage === "ar" ? "أحدث التراخيص الجمركية المسجلة" : "Recent Active Trade Permits"}
                  </h4>
                  <button onClick={() => setActiveTab("licenses")} className="text-xs text-sudan-green font-bold hover:underline cursor-pointer">
                    {currentLanguage === "ar" ? "عرض الكل" : "View All"}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {licenses.slice(0, 3).map((lic) => (
                    <div key={lic.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 truncate">{lic.companyName}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded font-mono font-bold ${
                            lic.licenseType === "export" ? "bg-indigo-150 text-indigo-800" : "bg-cyan-150 text-cyan-800"
                          }`}>
                            {lic.licenseType.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold truncate">{lic.goodsDescription}</p>
                      </div>
                      <span className="font-mono text-sudan-green font-bold shrink-0">{lic.annualValueEstimate.toLocaleString()} SDG</span>
                    </div>
                  ))}

                  {licenses.length === 0 && (
                    <p className="text-xs text-slate-400 font-bold text-center py-6">{currentLanguage === "ar" ? "لا توجد تراخيص مسجلة" : "No licenses registered."}</p>
                  )}
                </div>
              </div>

              {/* Active Certificates summary */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {currentLanguage === "ar" ? "آخر شهادات المنشأ الرقمية المعتمدة" : "Recent Digital Origin Certificates"}
                  </h4>
                  <button onClick={() => setActiveTab("certificates")} className="text-xs text-sudan-green font-bold hover:underline cursor-pointer">
                    {currentLanguage === "ar" ? "عرض الكل" : "View All"}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {certificates.slice(0, 3).map((cert) => (
                    <div key={cert.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                      <div className="space-y-1 overflow-hidden">
                        <p className="font-extrabold text-slate-800 truncate">
                          {currentLanguage === "ar" ? cert.goodsDescriptionAr : cert.goodsDescriptionEn}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold truncate">
                          {currentLanguage === "ar" ? `المصدر: ${cert.exporterName}` : `Exporter: ${cert.exporterName}`}
                        </p>
                      </div>
                      <span className="font-mono text-sudan-gold font-bold shrink-0">{cert.invoiceValue.toLocaleString()} {cert.currency}</span>
                    </div>
                  ))}

                  {certificates.length === 0 && (
                    <p className="text-xs text-slate-400 font-bold text-center py-6">{currentLanguage === "ar" ? "لا توجد شهادات مسجلة" : "No certificates registered."}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "licenses" && (
          <div className="space-y-4">
            {/* List and Grid for Licenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licenses.map(lic => (
                <div key={lic.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 hover:border-sudan-green hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      lic.licenseType === "export" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-cyan-100 text-cyan-800 border-cyan-200"
                    }`}>
                      {lic.licenseType === "export" ? (currentLanguage === "ar" ? "رخصة تصدير" : "Export License") : (currentLanguage === "ar" ? "رخصة استيراد" : "Import License")}
                    </span>
                    
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      lic.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}>
                      {lic.status === "approved" ? (currentLanguage === "ar" ? "نشط" : "Approved") : (currentLanguage === "ar" ? "معلق" : "Pending")}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base">{lic.companyName}</h4>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{lic.goodsDescription}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                    <span>{currentLanguage === "ar" ? "القيمة التقديرية السنوية:" : "Est. Annual Value:"}</span>
                    <span className="font-extrabold text-[#1E293B] font-mono">{lic.annualValueEstimate.toLocaleString()} SDG</span>
                  </div>

                  {isAdmin && lic.status === "pending" && onUpdateLicenseStatus && (
                    <div className="pt-3 flex justify-end gap-1.5 border-t border-gray-100">
                      <button
                        onClick={() => onUpdateLicenseStatus(lic.id, ApplicationStatus.APPROVED)}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "الموافقة" : "Approve"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {licenses.length === 0 && (
                <div className="col-span-full bg-white text-center py-12 rounded-3xl border border-gray-200 space-y-2 shadow-sm">
                  <Globe className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="text-slate-500 text-sm">{currentLanguage === "ar" ? "لا توجد تراخيص استيراد وتصدير مسجلة" : "No trade licenses found"}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="space-y-4">
            {/* List and Grid for Certificates of Origin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div 
                  key={cert.id} 
                  onClick={() => setSelectedCert(cert)}
                  className="bg-white border border-gray-200 hover:border-sudan-green hover:shadow-md rounded-3xl p-6 shadow-sm space-y-4 cursor-pointer transition-all duration-300 flex items-start justify-between"
                >
                  <div className="space-y-3 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-50 border border-gray-100 px-2 py-0.5 rounded-md font-mono font-bold text-slate-500">{cert.certificateNumber}</span>
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        cert.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}>
                        {cert.status === "approved" ? (currentLanguage === "ar" ? "معتمدة" : "Certified") : (currentLanguage === "ar" ? "قيد المراجعة" : "Pending")}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base truncate">
                        {currentLanguage === "ar" ? cert.goodsDescriptionAr : cert.goodsDescriptionEn}
                      </h4>
                      <p className="text-xs text-gray-400 mt-2 truncate">
                        {currentLanguage === "ar" ? `المصدر: ${cert.exporterName}` : `Exporter: ${cert.exporterName}`}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentLanguage === "ar" ? `المستورد: ${cert.importerName} (${cert.importerCountry})` : `Importer: ${cert.importerName} (${cert.importerCountry})`}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "ميناء التصدير" : "Port of Loading"}</p>
                        <p className="font-bold text-gray-600 truncate mt-0.5">{cert.portOfLoading}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-extrabold tracking-wider">{currentLanguage === "ar" ? "قيمة الفاتورة" : "Invoice Value"}</p>
                        <p className="font-mono font-bold text-emerald-600 mt-0.5">{cert.invoiceValue.toLocaleString()} {cert.currency}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F4F6F5] border border-gray-200 p-2.5 rounded-2xl text-sudan-green shrink-0 ml-2">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <div className="col-span-full bg-white text-center py-12 rounded-3xl border border-gray-200 space-y-2 shadow-sm">
                  <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="text-slate-500 text-sm">{currentLanguage === "ar" ? "لم يتم استخراج شهادات منشأ بعد" : "No certificates of origin issued yet"}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modular Tabs */}
        {activeTab === "registry" && <TraderRegistry currentLanguage={currentLanguage} />}
        {activeTab === "logistics" && <TradeLogistics currentLanguage={currentLanguage} />}
        {activeTab === "gis" && <TradeGisMap currentLanguage={currentLanguage} />}
        {activeTab === "compliance" && <TradeCompliance currentLanguage={currentLanguage} />}
        {activeTab === "analytics" && <TradeAnalytics currentLanguage={currentLanguage} />}
        {activeTab === "advisor" && <TradeAdvisor currentLanguage={currentLanguage} />}
        {activeTab === "digital_certs" && <TradeCertificates currentLanguage={currentLanguage} />}
      </div>

      {/* --- FORMS AND MODALS OVERLAYS --- */}

      {/* License Application Form */}
      <AnimatePresence>
        {isLicenseFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full text-slate-800"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
                <h3 className="font-bold text-base">
                  {currentLanguage === "ar" ? "طلب ترخيص استيراد وتصدير تجاري" : "Request Import / Export License"}
                </h3>
                <button onClick={() => setIsLicenseFormOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {licenseSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "تم استلاف الطلب!" : "Request Sent!"}</h4>
                  <p className="text-xs text-slate-400">{currentLanguage === "ar" ? "سوف تتم مراجعته وإرسال رخصة التشغيل خلال دقائق." : "We are reviewing your trade license request."}</p>
                </div>
              ) : (
                <form onSubmit={handleLicenseSubmit} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "نوع الترخيص المطلوب" : "License Type"}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLicenseType("export")}
                        className={`py-2 px-4 rounded-xl text-sm font-semibold border cursor-pointer transition-all ${
                          licenseType === "export" ? "bg-sudan-green text-white border-sudan-green" : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        {currentLanguage === "ar" ? "ترخيص تصدير" : "Export License"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setLicenseType("import")}
                        className={`py-2 px-4 rounded-xl text-sm font-semibold border cursor-pointer transition-all ${
                          licenseType === "import" ? "bg-sudan-green text-white border-sudan-green" : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        {currentLanguage === "ar" ? "ترخيص استيراد" : "Import License"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم الشركة المعتمد بالسجل *" : "Registered Company Name *"}</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Nile Food Products Co. Ltd"
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "وصف تفصيلي للسلع والمنتجات *" : "Goods & Raw Materials Description *"}</label>
                    <textarea
                      required
                      rows={3}
                      value={goodsDescription}
                      onChange={(e) => setGoodsDescription(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "الصمغ العربي، السمسم الأبيض، المواشي، الفول السوداني..." : "Gum Arabic, raw sesame, peanut kernels, livestock..."}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "القيمة التقديرية التصديرية/الاستيرادية السنوية (SDG) *" : "Est. Annual Trade Value (SDG) *"}</label>
                    <input
                      type="number"
                      required
                      value={annualValueEstimate}
                      onChange={(e) => setAnnualValueEstimate(e.target.value)}
                      placeholder="e.g. 10000000"
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-mono font-semibold"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-150 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsLicenseFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                    <button type="submit" disabled={isSubmittingLicense} className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer">
                      {isSubmittingLicense ? "..." : (currentLanguage === "ar" ? "تقديم الطلب" : "Apply Now")}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Certificate of Origin Form */}
      <AnimatePresence>
        {isCertFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-800"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Compass className="h-5 w-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "إصدار شهادة منشأ سودانية رقمية معتمدة" : "Issue Digital Certificate of Origin"}
                </h3>
                <button onClick={() => setIsCertFormOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {certSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-800">{currentLanguage === "ar" ? "تم إصدار الشهادة بنجاح!" : "Certificate Issued Successfully!"}</h4>
                  <p className="text-xs text-slate-400">{currentLanguage === "ar" ? "تم التحقق ومطابقة منشأ البضائع السودانية 2035 وتعميد الجمارك تلقائياً." : "Sudan certified digital origin documents has been successfully verified."}</p>
                </div>
              ) : (
                <form onSubmit={handleCertSubmit} className="p-6 space-y-4 text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المصدر السوداني *" : "Sudan Exporter Name *"}</label>
                      <input type="text" required value={exporterName} onChange={(e) => setExporterName(e.target.value)} placeholder="e.g. Nile Gum Arabic Corp" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم المستورد الأجنبي *" : "Foreign Importer Name *"}</label>
                      <input type="text" required value={importerName} onChange={(e) => setImporterName(e.target.value)} placeholder="e.g. Al-Baraka Foods Ltd" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "بلد الاستيراد النهائي *" : "Final Importer Country *"}</label>
                      <input type="text" required value={importerCountry} onChange={(e) => setImporterCountry(e.target.value)} placeholder="e.g. Saudi Arabia, UAE, France" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "رمز التعريف المنسق الجمركي (HS Code) *" : "HS Tariff Code *"}</label>
                      <input type="text" required value={hsCode} onChange={(e) => setHsCode(e.target.value)} placeholder="e.g. 1301.90.10" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "وصف البضائع (بالعربية) *" : "Goods Description (Arabic) *"}</label>
                      <input type="text" required value={goodsAr} onChange={(e) => setGoodsAr(e.target.value)} placeholder="صمغ عربي طبيعي درجة ممتاز" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "وصف البضائع (بالإنجليزية) *" : "Goods Description (English) *"}</label>
                      <input type="text" required value={goodsEn} onChange={(e) => setGoodsEn(e.target.value)} placeholder="Premium Grade Natural Gum Arabic" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الوزن الصافي (كجم) *" : "Net Weight (KG) *"}</label>
                      <input type="number" required value={weightNet} onChange={(e) => setWeightNet(e.target.value)} placeholder="e.g. 25000" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الوزن القائم الكلي (كجم) *" : "Gross Weight (KG) *"}</label>
                      <input type="number" required value={weightGross} onChange={(e) => setWeightGross(e.target.value)} placeholder="e.g. 25300" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "ميناء الشحن والتصدير *" : "Port of Loading *"}</label>
                      <select value={portOfLoading} onChange={(e) => setPortOfLoading(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green">
                        <option value="ميناء بورتسودان الجنوبي">{currentLanguage === "ar" ? "ميناء بورتسودان الجنوبي" : "Port Sudan South Port"}</option>
                        <option value="ميناء بورتسودان الشمالي">{currentLanguage === "ar" ? "ميناء بورتسودان الشمالي" : "Port Sudan North Port"}</option>
                        <option value="مطار الخرطوم الدولي للشحن">{currentLanguage === "ar" ? "مطار الخرطوم الدولي للشحن" : "Khartoum Cargo International Airport"}</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "ميناء التفريغ والاستلاف *" : "Port of Discharge *"}</label>
                      <input type="text" required value={portOfDischarge} onChange={(e) => setPortOfDischarge(e.target.value)} placeholder="e.g. Marseille, France" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "قيمة الفاتورة المالية *" : "Invoice Value *"}</label>
                      <input type="number" required value={invoiceValue} onChange={(e) => setInvoiceValue(e.target.value)} placeholder="e.g. 50000" className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green transition-all font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "العملة *" : "Currency *"}</label>
                      <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="SDG">SDG (ج.س)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsCertFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                    <button type="submit" disabled={isSubmittingCert} className="bg-sudan-green hover:bg-sudan-green-light text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md transition-all">
                      {isSubmittingCert ? "..." : (currentLanguage === "ar" ? "إصدار وتعميد الشهادة" : "Issue Certificate")}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Certificate view Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-slate-800 rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border-4 border-sudan-green p-4 sm:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Seal Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
                <Globe className="h-96 w-96 text-sudan-green" />
              </div>

              {/* Close Button */}
              <div className="absolute top-4 right-4 no-print">
                <button onClick={() => setSelectedCert(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Header */}
              <div className="border-b-2 border-sudan-gold pb-4 text-center space-y-1 relative z-10">
                <h3 className="font-bold text-sm tracking-wide text-slate-500 uppercase">
                  {currentLanguage === "ar" ? "جمهورية السودان" : "Republic of the Sudan"}
                </h3>
                <h2 className="text-lg font-bold text-sudan-green">
                  {currentLanguage === "ar" ? "وزارة التجارة والصناعة - الإدارة العامة للجمارك والتجارة" : "Ministry of Commerce & Industry - General Customs & Trade"}
                </h2>
                <h1 className="text-xl font-extrabold text-slate-900 border-2 border-sudan-gold px-6 py-2 rounded-xl inline-block bg-sudan-gold/5 mt-2">
                  {currentLanguage === "ar" ? "شهادة منشأ للمنتجات الوطنية السودانية" : "Certificate of Origin for Sudanese Products"}
                </h1>
                <p className="text-xs text-slate-400 mt-2 font-mono">{currentLanguage === "ar" ? "شهادة رقم:" : "Certificate No:"} {selectedCert.certificateNumber}</p>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-sm leading-relaxed">
                <div className="space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "1. المصدر السوداني المعتمد" : "1. Certified Sudan Exporter"}</h5>
                    <p className="font-bold text-slate-900 text-base">{selectedCert.exporterName}</p>
                    <p className="text-xs text-slate-500">{currentLanguage === "ar" ? "جمهورية السودان - بورتسودان" : "Republic of the Sudan - Port Sudan"}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "2. المستورد وجهة الشحن" : "2. Importer & Final Destination"}</h5>
                    <p className="font-bold text-slate-800">{selectedCert.importerName}</p>
                    <p className="text-xs font-semibold text-sudan-gold">{selectedCert.importerCountry}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "3. ميناء التصدير والشحن" : "3. Loading Port & Route"}</h5>
                    <p className="font-medium text-slate-800 flex items-center gap-1">
                      <Anchor className="h-4 w-4 text-sudan-green" />
                      <span>{selectedCert.portOfLoading}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "4. تفاصيل ووصف البضائع السودانية" : "4. Goods & Packaging Details"}</h5>
                    <p className="font-bold text-slate-900">{selectedCert.goodsDescriptionAr}</p>
                    <p className="text-xs text-slate-500 font-medium italic">{selectedCert.goodsDescriptionEn}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{currentLanguage === "ar" ? "رمز البند الجمركي (HS)" : "HS Code"}</p>
                      <p className="font-mono font-bold text-slate-800">{selectedCert.hsCode}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{currentLanguage === "ar" ? "قيمة الفاتورة" : "Invoice Value"}</p>
                      <p className="font-mono font-bold text-emerald-600">{selectedCert.invoiceValue.toLocaleString()} {selectedCert.currency}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{currentLanguage === "ar" ? "الوزن الصافي" : "Net Weight"}</p>
                      <p className="font-bold text-slate-800">{selectedCert.weightNet.toLocaleString()} KG</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{currentLanguage === "ar" ? "الوزن الكلي القائم" : "Gross Weight"}</p>
                      <p className="font-bold text-slate-800">{selectedCert.weightGross.toLocaleString()} KG</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal confirmation & Digital stamp */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <div className="space-y-1 text-center md:text-right">
                  <h4 className="text-xs font-bold text-sudan-green flex items-center justify-center md:justify-start gap-1">
                    <FileCheck className="h-4 w-4" />
                    {currentLanguage === "ar" ? "تصديق المنشأ والسيادة الوطنية 2035" : "Official Sovereign Origin Endorsement"}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {currentLanguage === "ar"
                      ? "تشهد وزارة التجارة والصناعة السودانية بأن المنتجات المذكورة أعلاه ذات منشأ وطني سوداني خالص 100% تم إنتاجها وتعبئتها وتصديرها بموجب اللوائح السودانية الحاكمة لعام 2026."
                      : "The Sudan Digital Ministry of Commerce certifies that the above mentioned goods are of 100% genuine Sudanese national origin and conform to all international trade laws."}
                  </p>
                </div>

                {/* Digital Stamp Graphic */}
                <div className="h-20 w-20 border-4 border-dashed border-sudan-gold rounded-full flex flex-col items-center justify-center text-center p-1 bg-white rotate-6 select-none shrink-0 shadow-sm animate-pulse">
                  <span className="text-[6px] text-slate-400 font-mono">SDMCI 2035</span>
                  <span className="text-[8px] text-sudan-green font-extrabold leading-none tracking-tight">ختم معتمد</span>
                  <span className="text-[6px] text-slate-400 font-mono">APPROVED</span>
                </div>
              </div>

              {/* Printable buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 no-print relative z-10">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" />
                  {currentLanguage === "ar" ? "طباعة الشهادة" : "Print"}
                </button>
                <button
                  onClick={() => alert(currentLanguage === "ar" ? "جاري تنزيل شهادة المنشأ الرسمية بصيغة PDF..." : "Downloading official PDF certificate...")}
                  className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  {currentLanguage === "ar" ? "تنزيل مستند معتمد" : "Download PDF"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
