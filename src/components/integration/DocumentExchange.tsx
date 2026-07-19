import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderGit, Send, FileText, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, Landmark, Stamp, Check } from "lucide-react";

interface DocumentExchangeProps {
  currentLanguage: "ar" | "en";
}

export default function DocumentExchange({ currentLanguage }: DocumentExchangeProps) {
  const [docTitleInput, setDocTitleInput] = useState("القرار الوزاري رقم 14 لعام 2026 لتنظيم ترخيص المنشآت الصناعية");
  const [docRecipientInput, setDocRecipientInput] = useState("mof");
  const [docSealed, setDocSealed] = useState(false);
  const [docSigned, setDocSigned] = useState(false);
  const [isSealingDoc, setIsSealingDoc] = useState(false);
  const [exchDocs, setExchDocs] = useState([
    { id: "S-DOC-981", title: "مذكرة الجمارك المشتركة - الاستيراد التفضيلى", sender: "SDMCI", recipient: "customs", status: "Sealed & Sent", date: "2026-07-15" },
    { id: "S-DOC-812", title: "شهادة الامتثال الضريبية الموحدة", sender: "Tax Chamber", recipient: "SDMCI", status: "Verified & Archived", date: "2026-07-18" }
  ]);

  const handleApplySignature = () => {
    setDocSigned(true);
  };

  const handleApplySeal = () => {
    setIsSealingDoc(true);
    setTimeout(() => {
      setIsSealingDoc(false);
      setDocSealed(true);
    }, 1200);
  };

  const handleDispatchDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitleInput.trim()) return;

    const newDoc = {
      id: `S-DOC-${Math.floor(100 + Math.random() * 900)}`,
      title: docTitleInput,
      sender: "SDMCI",
      recipient: docRecipientInput,
      status: "Sealed & Sent",
      date: new Date().toISOString().split("T")[0]
    };

    setExchDocs([newDoc, ...exchDocs]);
    // Reset inputs
    setDocTitleInput("");
    setDocSigned(false);
    setDocSealed(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6" id="module-document-exchange">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
          <FolderGit className="w-5 h-5 text-emerald-600" />
          <span>{currentLanguage === "ar" ? "المنصة والناقل الوطني الموحد للوثائق والقرارات" : "National Document Exchange Platform"}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {currentLanguage === "ar"
            ? "نقل المذكرات والقرارات والشهادات الرسمية بين الوزارات إلكترونياً بالتوقيع الرقمي والختم السيادي المشفر."
            : "Authorized system to dispatch, sign, and apply cryptographic state seals on official decrees, clearances, and certificates."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Document Dispatch Panel */}
        <div className="lg:col-span-6 bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            {currentLanguage === "ar" ? "صياغة وإرسال وثيقة رسمية" : "Dispatch Sovereign Official Document"}
          </h4>

          <form onSubmit={handleDispatchDoc} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "عنوان الوثيقة أو القرار" : "Document Title / Decree Decree"}</label>
              <input
                type="text"
                value={docTitleInput}
                onChange={(e) => setDocTitleInput(e.target.value)}
                placeholder={currentLanguage === "ar" ? "أدخل عنوان المراسلة الرسمي..." : "Decree description..."}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "الجهة الحكومية المستقبلة" : "Target Government Agency"}</label>
              <select
                value={docRecipientInput}
                onChange={(e) => setDocRecipientInput(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none"
              >
                <option value="mof">{currentLanguage === "ar" ? "وزارة المالية والتخطيط الاقتصادي" : "Ministry of Finance (MOF)"}</option>
                <option value="customs">{currentLanguage === "ar" ? "هيئة الجمارك السودانية" : "Sudan Customs Authority"}</option>
                <option value="cbs">{currentLanguage === "ar" ? "بنك السودان المركزي" : "Central Bank of Sudan (CBS)"}</option>
              </select>
            </div>

            {/* Interactive Signing and Sealing Gates */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleApplySignature}
                className={`py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  docSigned 
                    ? "bg-amber-100 text-amber-800 border-amber-300" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${docSigned ? "text-amber-700" : "text-gray-400"}`} />
                <span>{docSigned ? (currentLanguage === "ar" ? "تم التوقيع الرقمي" : "Signed") : (currentLanguage === "ar" ? "التوقيع الرقمي" : "Sign Document")}</span>
              </button>

              <button
                type="button"
                onClick={handleApplySeal}
                disabled={!docSigned || isSealingDoc}
                className={`py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  docSealed 
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                    : "bg-white text-gray-400 border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {isSealingDoc ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Stamp className={`w-4 h-4 ${docSealed ? "text-emerald-700" : "text-gray-400"}`} />
                )}
                <span>{docSealed ? (currentLanguage === "ar" ? "تم الختم السيادي" : "Sealed") : (currentLanguage === "ar" ? "تطبيق الختم" : "Apply Seal")}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!docSigned || !docSealed}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{currentLanguage === "ar" ? "تأمين وبث الوثيقة عبر الشبكة السيادية" : "Cryptographically Dispatch Document"}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Active Document Registry & Live Hologram Seal preview */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Hologram Seal Preview */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden flex items-center gap-4 text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center shrink-0 relative">
              <Stamp className="w-8 h-8 text-amber-500" />
              {docSealed && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute inset-0 bg-emerald-500/90 rounded-full flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-slate-950 font-bold" />
                </motion.div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-wider">SOVEREIGN SEAL GATE</span>
              <p className="text-xs font-semibold leading-relaxed">
                {docSealed 
                  ? (currentLanguage === "ar" ? "الختم السيادي نشط والوثيقة محمية ضد التلاعب" : "Sovereign State Seal applied. Integrity assured.")
                  : (currentLanguage === "ar" ? "في انتظار توقيع وختم المراسلة لتنشيط التشفير البيني" : "Sign and apply seal to activate inter-governmental encryption")}
              </p>
              <span className="text-[10px] text-gray-500 block font-mono">STATUS: {docSealed ? "VERIFIED SHA256" : "PENDING GATES"}</span>
            </div>
          </div>

          {/* Active correspondences list */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex-1 space-y-3">
            <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider">{currentLanguage === "ar" ? "سجل حركة الوثائق الفيدرالية الصادرة" : "Federal Dispatched Document Ledger"}</h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {exchDocs.map(doc => (
                <div key={doc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <span className="font-mono text-[9px] text-gray-400 block">{doc.id} | {doc.date}</span>
                      <strong className="text-slate-800 block line-clamp-1 text-[11px]" style={{ fontFamily: "var(--font-arabic)" }}>{doc.title}</strong>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] border border-emerald-200">
                      {doc.status}
                    </span>
                    <span className="block text-[8px] text-gray-400 font-mono mt-0.5 uppercase">to: {doc.recipient.toUpperCase()}</span>
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
