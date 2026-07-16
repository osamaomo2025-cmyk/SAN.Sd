/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FileCheck, Search, ShieldCheck, Printer, Download, X, QrCode, History, FileText, Check } from "lucide-react";
import { DigitalSovereignCertificate } from "./TradeTypes";
import { initialSovereignCertificates } from "./TradeMockData";

interface TradeCertificatesProps {
  currentLanguage: "ar" | "en";
}

export default function TradeCertificates({ currentLanguage }: TradeCertificatesProps) {
  const [certs, setCerts] = useState<DigitalSovereignCertificate[]>(initialSovereignCertificates);
  const [activeCategory, setActiveCategory] = useState<string>("origin");
  const [selectedCert, setSelectedCert] = useState<DigitalSovereignCertificate | null>(null);

  // Verification Input states
  const [verificationInput, setVerificationInput] = useState("");
  const [verifiedCert, setVerifiedCert] = useState<DigitalSovereignCertificate | null>(null);
  const [verificationError, setVerificationError] = useState(false);

  const categories = [
    { id: "origin", labelAr: "شهادة منشأ سودانية", labelEn: "Certificate of Origin" },
    { id: "export_approval", labelAr: "موافقة صادر سلع", labelEn: "Export Approval Permit" },
    { id: "import_permit", labelAr: "رخصة استيراد أغذية", labelEn: "Import Permit" },
    { id: "compliance", labelAr: "مطابقة جودة SSMO", labelEn: "Product Compliance" },
    { id: "invoice_verification", labelAr: "فواتير تجارية معتمدة", labelEn: "Commercial Invoice" },
    { id: "license_verification", labelAr: "توثيق السجل التجاري", labelEn: "Trade License Verify" }
  ];

  // Map to generate dynamic certificates for display if missing
  const filteredCerts = certs.filter(c => c.category === activeCategory);

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifiedCert(null);
    setVerificationError(false);

    const cleanInput = verificationInput.trim().toLowerCase();
    if (!cleanInput) return;

    // Search by certificateNumber or signatureHash
    const found = certs.find(
      c => c.certificateNumber.toLowerCase().includes(cleanInput) ||
           c.signatureHash.toLowerCase().includes(cleanInput)
    );

    if (found) {
      setVerifiedCert(found);
    } else {
      setVerificationError(true);
    }
  };

  const handleGenerateCertificate = (category: string) => {
    const code = `SD-${category.toUpperCase().slice(0, 4)}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCert: DigitalSovereignCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: code,
      category: category as any,
      titleAr: categories.find(c => c.id === category)?.labelAr || "شهادة رقمية سيادية",
      titleEn: categories.find(c => c.id === category)?.labelEn || "Digital Sovereign Certificate",
      issuedTo: "مؤسسة القضارف الموحدة للإنتاج الزراعي",
      detailsAr: `مستند رسمي معتمد وموثق اتحادياً تحت إشراف وزارة التجارة لتأكيد صحة ومطابقة ونزاهة البيانات التجارية المسجلة لعام ٢٠٢٦.`,
      detailsEn: `Official sovereign document verified and signed by the Ministry of Commerce confirming compliance and integrity of the registered operations of 2026.`,
      signatureHash: `SD-SIG-SHA256-${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
      verificationUrl: `https://sdmci.gov.sd/verify/${code}`,
      timestamp: new Date().toISOString(),
      auditTrail: [
        { actionAr: "إنشاء المعاملة إلكترونياً", actionEn: "Autonomous document initialization", timestamp: new Date().toISOString(), actor: "النظام الفيدرالي" },
        { actionAr: "توقيع المستند رقمياً بختم الوزير", actionEn: "Sovereign signature appended by Ministry Cluster", timestamp: new Date().toISOString(), actor: "الإدارة العامة للتجارة" }
      ]
    };

    const updated = [newCert, ...certs];
    setCerts(updated);
    setSelectedCert(newCert);
  };

  return (
    <div id="digital-certificates-platform" className="space-y-6">
      {/* Top Banner with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
            <FileCheck className="h-5.5 w-5.5 text-sudan-green" />
            {currentLanguage === "ar" ? "نظام الشهادات والمواثيق التجارية الموقعة رقمياً" : "Digital Sovereign Trade Certificates Portal"}
          </h2>
          <p className="text-xs text-gray-400">
            {currentLanguage === "ar" 
              ? "إصدار، تعميد، والتحقق الفوري من صحة وموثوقية وثائق الاستيراد والتصدير وعقد المنشأ بختم رقمي سيادي غير قابل للتزوير." 
              : "Generate, countersign, and verify digital trade documents backed by unique cryptographic hashes and QR codes."}
          </p>
        </div>

        <button
          onClick={() => handleGenerateCertificate(activeCategory)}
          className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-5 py-3 rounded-2xl cursor-pointer transition-all shrink-0"
        >
          {currentLanguage === "ar" ? "إصدار وتعميد وثيقة جديدة" : "Generate & Sign Document"}
        </button>
      </div>

      {/* Categories Tabs & Verification Lookup Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Tabs (Vertical List) */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm space-y-1">
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider px-2 pb-2 border-b border-gray-100">
              {currentLanguage === "ar" ? "فئات العقود والشهادات" : "Sovereign Document Types"}
            </p>

            <div className="space-y-1 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-right md:text-left flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    activeCategory === cat.id 
                      ? "bg-sudan-green text-white font-extrabold" 
                      : "text-slate-500 hover:text-sudan-green hover:bg-slate-50"
                  }`}
                >
                  <span>{currentLanguage === "ar" ? cat.labelAr : cat.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Lookup Tool Widget */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-sudan-gold" />
              {currentLanguage === "ar" ? "أداة تدقيق صحة الشهادات" : "Certificate Validity Auditor"}
            </h4>
            <p className="text-[10px] text-gray-400 leading-normal">
              {currentLanguage === "ar" 
                ? "أدخل الرقم المرجعي أو توقيع SHA-256 للتحقق الفوري من الحالة ومطابقة الأصول."
                : "Input standard reference ID or SHA-256 signature hash to query authenticity directly."}
            </p>

            <form onSubmit={handleVerifyLookup} className="space-y-2">
              <div className="flex gap-1">
                <input
                  type="text"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  placeholder="e.g. SD-ORIG-2026..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green text-slate-800 font-mono"
                />
                <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white p-2.5 rounded-xl cursor-pointer">
                  <Search className="h-4.5 w-4.5" />
                </button>
              </div>
            </form>

            {/* Verification Result message */}
            {verifiedCert && (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl space-y-1 text-center animate-bounce">
                <p className="text-[10px] font-black text-emerald-800 uppercase flex items-center justify-center gap-1">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {currentLanguage === "ar" ? "مستند أصلي معتمد" : "100% Authentic"}
                </p>
                <p className="text-[9px] text-slate-500 truncate font-mono">{verifiedCert.certificateNumber}</p>
                <button 
                  onClick={() => setSelectedCert(verifiedCert)}
                  className="text-[9px] text-sudan-green font-bold underline mt-1 block w-full text-center"
                >
                  {currentLanguage === "ar" ? "فتح ومعاينة الأصول" : "View Certificate Details"}
                </button>
              </div>
            )}

            {verificationError && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-center text-xs">
                <p className="text-[10px] font-bold text-rose-800">
                  {currentLanguage === "ar" ? "لا توجد شهادة متطابقة" : "No match found"}
                </p>
                <p className="text-[9px] text-rose-500 mt-0.5">
                  {currentLanguage === "ar" ? "يرجى فحص صيغة الرمز المدخل وإعادة المحاولة" : "Please check signature hash structure."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Certificates List & Grid (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="bg-white border border-gray-200 hover:border-sudan-green hover:shadow-md rounded-3xl p-6 shadow-sm space-y-4 cursor-pointer transition-all duration-300 flex items-start justify-between"
              >
                <div className="space-y-3 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono font-bold text-slate-600">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {currentLanguage === "ar" ? "معتمد سيادياً" : "Sovereign Signed"}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#1E293B] text-sm md:text-base truncate">
                      {currentLanguage === "ar" ? cert.titleAr : cert.titleEn}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                      {currentLanguage === "ar" ? `الجهة المستلمة: ${cert.issuedTo}` : `Issued to: ${cert.issuedTo}`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>SIGNATURE SIGN:</span>
                    <span className="font-bold text-slate-500 truncate max-w-[120px]">{cert.signatureHash}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-sudan-green shrink-0 ml-2">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            ))}

            {filteredCerts.length === 0 && (
              <div className="col-span-full bg-white text-center py-16 rounded-3xl border border-gray-200 space-y-2">
                <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-slate-500 text-xs">
                  {currentLanguage === "ar" ? "لم يتم استخراج مستندات في هذه الفئة بعد" : "No certificates issued under this category yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Master Digital Certificate Viewer Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-sudan-green p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Document Frame Header */}
            <div className="border-b-2 border-sudan-gold pb-4 text-center space-y-1 relative z-10">
              <p className="font-bold text-xs tracking-wide text-slate-500 uppercase">
                {currentLanguage === "ar" ? "جمهورية السودان الاتحادية" : "Republic of the Sudan"}
              </p>
              <h2 className="text-base font-bold text-sudan-green">
                {currentLanguage === "ar" ? "وزارة التجارة والصناعة - قطاع التجارة الخارجية واللوجستيات" : "Ministry of Commerce & Industry - Federal Trade and Logistics"}
              </h2>
              <h1 className="text-lg font-black text-slate-900 border border-sudan-gold/30 px-5 py-2 rounded-xl inline-block bg-sudan-gold/5 mt-2">
                {currentLanguage === "ar" ? selectedCert.titleAr : selectedCert.titleEn}
              </h1>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">ID: {selectedCert.certificateNumber}</p>
            </div>

            {/* Document Content Details */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-[9px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "الجهة الصادر لصالحها" : "Issued To / Beneficiary"}</h5>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedCert.issuedTo}</p>
                </div>
                <div>
                  <h5 className="text-[9px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "التاريخ والطابع الزمني الفيدرالي" : "Issued Timestamp (Sovereign clock)"}</h5>
                  <p className="font-mono font-semibold text-slate-700 mt-0.5">{new Date(selectedCert.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-2">
                <h5 className="text-[9px] uppercase font-bold text-slate-400">{currentLanguage === "ar" ? "تفاصيل ومضمون الوثيقة الاتحادية" : "Official Document Provisions"}</h5>
                <p className="font-semibold text-slate-800 text-sm bg-slate-50 border border-slate-100 p-4 rounded-xl mt-1 leading-normal">
                  {currentLanguage === "ar" ? selectedCert.detailsAr : selectedCert.detailsEn}
                </p>
              </div>

              {/* Complete Audit Trail Timeline */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h5 className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <History className="h-4 w-4" />
                  {currentLanguage === "ar" ? "سجل التوقيعات وتدقيق الصلاحية (Audit Trail)" : "Cryptographic Immutable Audit Trail"}
                </h5>

                <div className="space-y-2 pt-1.5">
                  {selectedCert.auditTrail.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-start text-[10px] border-b border-slate-50 pb-2">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-700">
                          {currentLanguage === "ar" ? log.actionAr : log.actionEn}
                        </p>
                        <p className="text-[9px] text-gray-400 font-semibold">
                          {currentLanguage === "ar" ? `المنفذ: ${log.actor}` : `Actor: ${log.actor}`}
                        </p>
                      </div>
                      <span className="font-mono text-gray-400 font-semibold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cryptographic Stamps */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-right overflow-hidden w-full">
                <h4 className="text-[10px] font-bold text-sudan-green uppercase tracking-wider">
                  {currentLanguage === "ar" ? "التوقيع والتعميد الإلكتروني المشفر" : "SOVEREIGN CRYPTOGRAPHIC SIGNATURE"}
                </h4>
                <p className="text-[9px] text-gray-400 font-mono font-bold truncate">
                  {selectedCert.signatureHash}
                </p>
              </div>

              {/* QR Emblem */}
              <div className="h-16 w-16 border-2 border-sudan-green p-1 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-xs relative cursor-pointer" onClick={() => alert("Verification code matches live SDMCI cloud cluster.")}>
                <QrCode className="h-full w-full text-slate-800" />
              </div>
            </div>

            {/* Print and Download Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                {currentLanguage === "ar" ? "طباعة" : "Print Document"}
              </button>
              <button
                onClick={() => alert(currentLanguage === "ar" ? "جاري تنزيل المستند المشفر بصيغة PDF..." : "Downloading sovereign PDF file...")}
                className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                {currentLanguage === "ar" ? "تنزيل نسخة رقمية" : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
