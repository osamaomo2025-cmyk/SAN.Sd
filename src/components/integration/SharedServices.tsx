import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Smartphone, MapPin, Send, CheckCircle2, RefreshCw, Eye, MessageSquare, AlertCircle, HelpCircle } from "lucide-react";

interface SharedServicesProps {
  currentLanguage: "ar" | "en";
}

export default function SharedServices({ currentLanguage }: SharedServicesProps) {
  const [sharedSmsPhone, setSharedSmsPhone] = useState("+249 912 345 678");
  const [sharedSmsMessage, setSharedSmsMessage] = useState("تنبيه: تم ترخيص منشأتك الصناعية رقم IND-94829 بنجاح. برجاء طباعة الشهادة.");
  const [sharedSmsLogs, setSharedSmsLogs] = useState<any[]>([
    { id: "sms-1", recipient: "+249 912 345 678", message: "تنبيه: محاولة تسجيل دخول جديدة للسجل التجاري رقم SD-2026-94829", status: "Delivered", timestamp: "10:14:22" }
  ]);
  const [isSendingSms, setIsSendingSms] = useState(false);

  const [geopointInput, setGeopointInput] = useState("15.5007, 32.5599");
  const [geopointResult, setGeopointResult] = useState<any>(null);
  const [isVerifyingGeo, setIsVerifyingGeo] = useState(false);

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharedSmsPhone.trim() || !sharedSmsMessage.trim()) return;

    setIsSendingSms(true);
    setTimeout(() => {
      setIsSendingSms(false);
      const newLog = {
        id: `sms-${Math.floor(100 + Math.random() * 900)}`,
        recipient: sharedSmsPhone,
        message: sharedSmsMessage,
        status: "Delivered",
        timestamp: new Date().toLocaleTimeString()
      };
      setSharedSmsLogs([newLog, ...sharedSmsLogs]);
      setSharedSmsMessage("");
    }, 1000);
  };

  const handleVerifyGeo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geopointInput.trim()) return;

    setIsVerifyingGeo(true);
    setGeopointResult(null);

    setTimeout(() => {
      setIsVerifyingGeo(false);
      setGeopointResult({
        coordinates: geopointInput,
        plotNumber: "PL-SD-839210",
        stateAr: "ولاية الخرطوم",
        stateEn: "Khartoum State",
        zoneAr: "المنطقة الصناعية بحري",
        zoneEn: "Industrial Area - Bahri",
        status: "APPROVED_FOR_INDUSTRIAL_USE"
      });
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6" id="module-shared-services">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
          <Share2 className="w-5 h-5 text-emerald-600" />
          <span>{currentLanguage === "ar" ? "منصة الخدمات الحكومية المشتركة والمصادر العامة" : "Shared Government Services Platform"}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {currentLanguage === "ar"
            ? "تشغيل وتوفير الخدمات العامة الموحدة مثل بوابة الرسائل الوطنية الموحدة SMS ومطابقة المواقع الجغرافية للمنشآت."
            : "Centralized utility services and micro-gateways including unified SMS dispatch and physical facility land plot GIS verification."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: National SMS Notification Gateway */}
        <div className="lg:col-span-6 bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>{currentLanguage === "ar" ? "بوابة الرسائل النصية القصيرة الموحدة" : "Unified SMS Gateway Simulator"}</span>
          </h4>

          <form onSubmit={handleSendSms} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "رقم الجوال المستلم" : "Recipient Phone Number"}</label>
              <input
                type="text"
                value={sharedSmsPhone}
                onChange={(e) => setSharedSmsPhone(e.target.value)}
                placeholder="+249 XXXXXXXXX"
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-gray-500 text-[10px] font-bold uppercase">{currentLanguage === "ar" ? "نص الرسالة" : "SMS Content"}</label>
              <textarea
                value={sharedSmsMessage}
                onChange={(e) => setSharedSmsMessage(e.target.value)}
                rows={3}
                placeholder={currentLanguage === "ar" ? "اكتب نص الرسالة هنا..." : "Type alert text..."}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-bold focus:outline-none leading-normal"
              />
            </div>

            <button
              type="submit"
              disabled={isSendingSms}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              {isSendingSms ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{currentLanguage === "ar" ? "إرسال التنبيه الفوري للمواطن" : "Dispatch SMS Notification"}</span>
            </button>
          </form>

          {/* SMS logs */}
          <div className="space-y-2 pt-2">
            <div className="text-[9px] text-gray-400 uppercase font-mono tracking-wider">{currentLanguage === "ar" ? "أرشيف الرسائل الأخيرة" : "Recent SMS Deliveries"}</div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {sharedSmsLogs.map(log => (
                <div key={log.id} className="p-2.5 bg-white rounded-lg border border-gray-100 text-[11px] leading-relaxed flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono text-[9px] text-gray-400 block">{log.recipient} | {log.timestamp}</span>
                    <p className="text-slate-700 line-clamp-1" style={{ fontFamily: "var(--font-arabic)" }}>{log.message}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Geopoint physical verification GIS */}
        <div className="lg:col-span-6 bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{currentLanguage === "ar" ? "بوابة مطابقة الأراضي والمنشآت الجغرافية (GIS)" : "GIS Plot Verification Gateway"}</span>
          </h4>

          <p className="text-xs text-gray-500 leading-normal">
            {currentLanguage === "ar"
              ? "مزامنة مواقع المصانع والأراضي الصناعية جغرافياً مع وزارة التخطيط لمنع التداخل وحماية الحقوق العقارية."
              : "Verify industrial factory geographic coordinates (GPS) and match plot numbers against national ministry cadastral maps."}
          </p>

          <form onSubmit={handleVerifyGeo} className="flex gap-2">
            <input
              type="text"
              value={geopointInput}
              onChange={(e) => setGeopointInput(e.target.value)}
              placeholder="15.5007, 32.5599"
              className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-mono font-bold focus:outline-none"
            />
            <button
              type="submit"
              disabled={isVerifyingGeo}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              {isVerifyingGeo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{currentLanguage === "ar" ? "استعلام" : "Query"}</span>
            </button>
          </form>

          <AnimatePresence mode="wait">
            {geopointResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 text-xs font-mono text-gray-700"
              >
                <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-emerald-700">{currentLanguage === "ar" ? "حالة العقار: معتمد ومطابق" : "Status: MATCHED / APPROVED"}</span>
                  <span className="text-[9px] text-gray-400">GIS LIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "رقم القطعة العقارية" : "Plot Number"}</span>
                    <span className="font-semibold text-slate-800">{geopointResult.plotNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "الإحداثيات الجغرافية" : "GIS GPS Coords"}</span>
                    <span className="font-semibold text-slate-800">{geopointResult.coordinates}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "الولاية" : "State"}</span>
                    <span className="font-semibold text-slate-800">{currentLanguage === "ar" ? geopointResult.stateAr : geopointResult.stateEn}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase">{currentLanguage === "ar" ? "المنطقة" : "Zone Area"}</span>
                    <span className="font-semibold text-slate-800">{currentLanguage === "ar" ? geopointResult.zoneAr : geopointResult.zoneEn}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
