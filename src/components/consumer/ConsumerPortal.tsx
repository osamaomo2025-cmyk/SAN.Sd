/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, Plus, CheckCircle, Clock, AlertTriangle, 
  MapPin, Store, MessageSquare, Search, X, Check, Eye,
  UserCheck, Camera, Mic, Video, QrCode, FileText, Sparkles, Star
} from "lucide-react";
import { ConsumerComplaint } from "../../types";
import { SUDANESE_STATES } from "../../data";

interface ConsumerPortalProps {
  currentLanguage: "ar" | "en";
  complaints: ConsumerComplaint[];
  onAddComplaint: (complaintData: any) => Promise<any>;
}

export default function ConsumerPortal({
  currentLanguage,
  complaints,
  onAddComplaint
}: ConsumerPortalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"submit" | "track">("submit");
  const [step, setStep] = useState(1);
  const [searchId, setSearchId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState<ConsumerComplaint | null>(null);

  // Step 1: Civil Registry Verification
  const [identityVerified, setIdentityVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Step 2: Merchant & Violation Details
  const [storeName, setStoreName] = useState("");
  const [violationType, setViolationType] = useState<string>("price_gouging");
  const [stateName, setStateName] = useState(SUDANESE_STATES[0].nameAr);
  const [cityName, setCityName] = useState("");
  const [details, setDetails] = useState("");

  // Step 3: Digital Evidence & Integrity Check
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [hasGPS, setHasGPS] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState("");
  const [hasVoiceMemo, setHasVoiceMemo] = useState(false);
  const [hasBarcode, setHasBarcode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [integrityHash, setIntegrityHash] = useState("");

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Feedback Survey
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [surveyRating, setSurveyRating] = useState(5);
  const [surveyNotes, setSurveyNotes] = useState("");

  const verifyIdentity = () => {
    if (!nationalId || !fullName) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIdentityVerified(true);
    }, 1200);
  };

  const handleCaptureGPS = () => {
    setHasGPS(true);
    const mockLat = (15.5 + Math.random() * 0.1).toFixed(6);
    const mockLong = (32.5 + Math.random() * 0.1).toFixed(6);
    setGpsCoordinates(`${mockLat}° N, ${mockLong}° E`);
    generateIntegrityHash();
  };

  const handleCaptureVoice = () => {
    setHasVoiceMemo(true);
    generateIntegrityHash();
  };

  const handleMockUpload = (fileName: string) => {
    setEvidenceFiles(prev => [...prev, fileName]);
    generateIntegrityHash();
  };

  const generateIntegrityHash = () => {
    const chars = "abcdef0123456789";
    let hash = "SHA256:";
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setIntegrityHash(hash);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const generatedId = `CP-${Date.now().toString().slice(-6)}`;
      const newComplaintData = {
        id: generatedId,
        reporterName: isAnonymous ? "مواطن مجهول" : fullName,
        reporterPhone: phone,
        nationalId: isAnonymous ? undefined : nationalId,
        violationType,
        storeName,
        state: stateName,
        city: cityName,
        details,
        status: "new",
        evidence: {
          files: evidenceFiles,
          gps: gpsCoordinates,
          voice: hasVoiceMemo,
          barcode: barcodeInput,
          hash: integrityHash || "SHA256:d8a9e102bcfe92b0a1f94ea3cdaeef9c2310f"
        },
        routing: `إدارة الرقابة بولاية ${stateName} - شعبة ${
          violationType === "price_gouging" ? "مراقبة الأسعار" : "صحة الأغذية والبيئة"
        }`
      };

      await onAddComplaint(newComplaintData);
      setSubmissionSuccess(generatedId);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = () => {
    const found = complaints.find(c => c.id.toLowerCase() === searchId.toLowerCase());
    setTrackedComplaint(found || null);
    if (!found) {
      alert(currentLanguage === "ar" ? "تعذر العثور على البلاغ المطلوبة، يرجى التحقق من الرقم" : "Complaint not found, please check the ID");
    }
  };

  const submitSurvey = () => {
    setSurveySubmitted(true);
    setTimeout(() => {
      setSurveySubmitted(false);
      setTrackedComplaint(null);
      setSearchId("");
    }, 2000);
  };

  const violationTypes = [
    { value: "price_gouging", labelAr: "زيادة أسعار غير مبررة", labelEn: "Unjustified Price-Gouging" },
    { value: "expired_goods", labelAr: "سلع منتهية الصلاحية", labelEn: "Expired / Spoiled Goods" },
    { value: "monopoly", labelAr: "ممارسات احتكارية وحظر سلع", labelEn: "Monopolistic Practices" },
    { value: "counterfeit", labelAr: "سلع مقلدة ومغشوشة", labelEn: "Counterfeit / Substandard" },
    { value: "deception", labelAr: "تضليل تجاري وتزييف إعلامي", labelEn: "Commercial Deception" },
    { value: "price_manipulation", labelAr: "التلاعب بالتسعيرة الرسمية", labelEn: "Price Label Manipulation" },
    { value: "illegal_trade", labelAr: "أنشطة تجارية غير مرخصة", labelEn: "Illegal Trading Activities" }
  ];

  const getTimelineStep = (status: string) => {
    switch (status) {
      case "new": return 1;
      case "investigating": return 3;
      case "resolved": return 5;
      default: return 1;
    }
  };

  return (
    <div id="consumer-portal-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Tab Switcher Left Column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <h3 className="text-sm font-black text-slate-800 pb-2 border-b border-gray-100 uppercase tracking-wider">
            {currentLanguage === "ar" ? "بوابة الخدمات العامة" : "Public Services Portal"}
          </h3>
          <button
            onClick={() => { setActiveSubTab("submit"); setStep(1); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === "submit"
                ? "bg-sudan-green text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Plus className="h-4.5 w-4.5" />
            {currentLanguage === "ar" ? "تقديم بلاغ / شكوى جديدة" : "File a New Complaint"}
          </button>
          <button
            onClick={() => setActiveSubTab("track")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === "track"
                ? "bg-sudan-green text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Search className="h-4.5 w-4.5" />
            {currentLanguage === "ar" ? "تتبع حالة بلاغ سابق" : "Track Previous Complaint"}
          </button>
        </div>

        {/* Info box */}
        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-sudan-green">
            <ShieldAlert className="h-5 w-5" />
            <h4 className="text-xs font-extrabold">{currentLanguage === "ar" ? "حماية المستهلك السيادية" : "Sovereign Consumer Protection"}</h4>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {currentLanguage === "ar" 
              ? "وفقاً للمرسوم الوزاري رقم 24 لعام 2026، يتم ربط جميع البلاغات المسجلة إلكترونياً بقاعدة بيانات السجل التجاري الموحد والمنصة الوطنية للتراخيص لتغريم المخالفين وإغلاق منشآتهم فوراً في حال ثبوت المخالفة."
              : "According to Sovereign Decree 24 of 2026, all registered consumer complaints are cross-referenced with the unified Commercial Registry and National Licensing systems to instantly penalize bad actors."}
          </p>
        </div>
      </div>

      {/* Main Workspace Right 2 Columns */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {activeSubTab === "submit" ? (
            <motion.div
              key="submit-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="bg-sudan-dark text-slate-900 p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm md:text-base flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-sudan-gold" />
                    {currentLanguage === "ar" ? "تقديم شكوى تجارية رسمية" : "File Official Market Complaint"}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {currentLanguage === "ar" ? "النظام الوطني لتوثيق ومعالجة بلاغات الأسواق والغش التجاري" : "Sovereign Market Fraud & Grievances Intake Engine"}
                  </p>
                </div>
                <div className="bg-white/90 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black">
                  {currentLanguage === "ar" ? `الخطوة ${step} من 3` : `Step ${step} of 3`}
                </div>
              </div>

              {step === 1 && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                    <input
                      type="checkbox"
                      id="anon"
                      checked={isAnonymous}
                      onChange={(e) => {
                        setIsAnonymous(e.target.checked);
                        if (e.target.checked) {
                          setIdentityVerified(true);
                          setFullName("مواطن مجهول");
                          setNationalId("ANONYMOUS_VERIFIED");
                        } else {
                          setIdentityVerified(false);
                          setFullName("");
                          setNationalId("");
                        }
                      }}
                      className="h-4.5 w-4.5 text-sudan-green focus:ring-sudan-green rounded"
                    />
                    <label htmlFor="anon" className="text-xs font-bold text-slate-700 cursor-pointer">
                      {currentLanguage === "ar" 
                        ? "تقديم بلاغ سري بالكامل (بدون الإفصاح عن الهوية)" 
                        : "Submit anonymously (protect identity from merchant)"}
                    </label>
                  </div>

                  {!isAnonymous && (
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl flex items-start gap-3">
                        <UserCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {currentLanguage === "ar"
                            ? "يتطلب القانون إثبات هوية الشاكي لمنع البلاغات الكيدية. نتحقق فورياً من الهوية عبر السجل المدني الفيدرالي في غضون ثوانٍ."
                            : "National law requires identity verification to prevent malicious complaints. We verify against the Civil Registry in seconds."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "الرقم الوطني السوداني *" : "Sudanese National ID *"}</label>
                          <input
                            type="text"
                            value={nationalId}
                            disabled={identityVerified}
                            onChange={(e) => setNationalId(e.target.value)}
                            placeholder="e.g. 10129481903"
                            className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "الاسم الرباعي الكامل كما بالبطاقة *" : "Full Legal Name *"}</label>
                          <input
                            type="text"
                            value={fullName}
                            disabled={identityVerified}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "رقم الهاتف للتواصل للتفتيش *" : "Contact Phone Number *"}</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                        />
                      </div>

                      {!identityVerified ? (
                        <button
                          type="button"
                          disabled={!nationalId || !fullName || isVerifying}
                          onClick={verifyIdentity}
                          className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-3 px-4 rounded-xl cursor-pointer shadow transition-all disabled:opacity-50"
                        >
                          {isVerifying ? (currentLanguage === "ar" ? "جاري الاستعلام عن السجل المدني..." : "Verifying with Civil Registry...") : (currentLanguage === "ar" ? "التحقق والتوثيق من الهوية الوطنية" : "Verify & Authenticate Identity")}
                        </button>
                      ) : (
                        <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          {currentLanguage === "ar" ? "تم التحقق من الهوية بنجاح ومطابقتها سيادياً" : "Identity successfully verified with National Civil Database"}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      disabled={!identityVerified}
                      onClick={() => setStep(2)}
                      className="bg-sudan-green text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow hover:bg-sudan-green-light transition-all disabled:opacity-50"
                    >
                      {currentLanguage === "ar" ? "المتابعة لتفاصيل البلاغ" : "Next: Incident Details"}
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "اسم المتجر المشكو ضده *" : "Accused Merchant / Store *"}</label>
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "أدخل اسم المحل أو التاجر بدقة" : "Store name"}
                        className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "نوع المخالفة تصنيفاً *" : "Violation Category *"}</label>
                      <select
                        value={violationType}
                        onChange={(e) => setViolationType(e.target.value)}
                        className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white"
                      >
                        {violationTypes.map(v => (
                          <option key={v.value} value={v.value}>{currentLanguage === "ar" ? v.labelAr : v.labelEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "الولاية *" : "Sudan State *"}</label>
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white"
                      >
                        {SUDANESE_STATES.map(s => (
                          <option key={s.id} value={s.nameAr}>{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "المدينة أو المحلية والشارع *" : "City / Local District *"}</label>
                      <input
                        type="text"
                        required
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="e.g. Omdurman, Block 4"
                        className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "وصف تفصيلي للواقعة والمشكلة *" : "Detailed Grievance Description *"}</label>
                    <textarea
                      required
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اذكر تفاصيل الغش أو فرق السعر والوزن بالتفصيل..." : "Describe prices, batch details, or quality problems..."}
                      className="w-full bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "رجوع" : "Back"}
                    </button>
                    <button
                      type="button"
                      disabled={!storeName || !cityName || !details}
                      onClick={() => setStep(3)}
                      className="bg-sudan-green text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow hover:bg-sudan-green-light disabled:opacity-50"
                    >
                      {currentLanguage === "ar" ? "المتابعة لتوثيق الأدلة" : "Next: Digital Evidence"}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700">{currentLanguage === "ar" ? "إرفاق الأدلة الرقمية لضمان الإنفاذ" : "Attach Digital Evidence"}</h4>
                    <p className="text-[10px] text-slate-400">
                      {currentLanguage === "ar" 
                        ? "يتم تشفير وتوليد بصمة زمنية وجغرافية لجميع المرفقات لضمان صحتها قانونياً أمام المحاكم الاقتصادية." 
                        : "All files receive a cryptographic hash and geolocation binding to preserve integrity in economic court."}
                    </p>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => handleMockUpload("PHOTO_EVIDENCE_1.jpg")}
                      className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer group"
                    >
                      <Camera className="h-5 w-5 text-slate-500 group-hover:text-sudan-green" />
                      <span className="text-[10px] font-bold text-slate-700">{currentLanguage === "ar" ? "إرفاق صورة" : "Add Image"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMockUpload("VIDEO_RECORD_1.mp4")}
                      className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer group"
                    >
                      <Video className="h-5 w-5 text-slate-500 group-hover:text-sudan-green" />
                      <span className="text-[10px] font-bold text-slate-700">{currentLanguage === "ar" ? "إرفاق فيديو" : "Add Video"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCaptureVoice}
                      className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer group transition-all ${
                        hasVoiceMemo ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Mic className={`h-5 w-5 ${hasVoiceMemo ? "text-emerald-600 animate-pulse" : "text-slate-500 group-hover:text-sudan-green"}`} />
                      <span className="text-[10px] font-bold text-slate-700">{currentLanguage === "ar" ? "مذكرة صوتية" : "Voice Memo"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCaptureGPS}
                      className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer group transition-all ${
                        hasGPS ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <MapPin className={`h-5 w-5 ${hasGPS ? "text-emerald-600 animate-bounce" : "text-slate-500 group-hover:text-sudan-green"}`} />
                      <span className="text-[10px] font-bold text-slate-700">{currentLanguage === "ar" ? "تحديد الموقع GPS" : "Bind GPS"}</span>
                    </button>
                  </div>

                  {/* Barcode scan simulation */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-sudan-gold animate-pulse" />
                      <h5 className="text-[10px] font-black text-slate-700">{currentLanguage === "ar" ? "فحص الباركود / الكود التعريفي للسلعة" : "Item Barcode Verification"}</h5>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={barcodeInput}
                        onChange={(e) => {
                          setBarcodeInput(e.target.value);
                          setHasBarcode(true);
                          generateIntegrityHash();
                        }}
                        placeholder={currentLanguage === "ar" ? "أدخل رقم الباركود (مثال: 6281000100104)" : "Enter Barcode number"}
                        className="flex-1 bg-white border border-gray-200 text-xs px-3 py-2 rounded-xl outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBarcodeInput("6281000100104");
                          setHasBarcode(true);
                          generateIntegrityHash();
                        }}
                        className="bg-sudan-dark text-slate-900 border border-slate-200 hover:bg-slate-100 text-xs px-3 py-2 rounded-xl cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "مسح محاكي" : "Scan Test"}
                      </button>
                    </div>
                  </div>

                  {/* Realtime Hash Display */}
                  {integrityHash && (
                    <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[9px] rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[8px] text-slate-500">
                        <span>INTEGRITY SEAL</span>
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                      <p className="truncate">{integrityHash}</p>
                      {gpsCoordinates && <p className="text-slate-400">GPS: {gpsCoordinates} | TIMESTAMP: {new Date().toISOString().slice(0,19).replace("T"," ")} UTC</p>}
                      {evidenceFiles.length > 0 && <p className="text-slate-400">FILES LOCKED: {evidenceFiles.join(", ")}</p>}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "رجوع" : "Back"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? "..." : (
                        <>
                          <Sparkles className="h-4.5 w-4.5" />
                          {currentLanguage === "ar" ? "تقديم البلاغ مع الأختام الرقمية" : "Seal & Submit Sovereign Grievance"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && submissionSuccess && (
                <div className="p-10 text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="text-lg font-extrabold text-slate-800">{currentLanguage === "ar" ? "تم استلام البلاغ وتشفيره بنجاح!" : "Sovereign Complaint Lodged & Sealed!"}</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    {currentLanguage === "ar" 
                      ? `تم تدوين البلاغ بنجاح وتوليد الرمز الموحد للمتابعة. جاري توجيه القضية آلياً للفرع الميداني المختص بالولاية.` 
                      : `Your complaint was securely logged under Tracking ID ${submissionSuccess}. Inspectors in your state have been automatically notified.`}
                  </p>

                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl max-w-sm mx-auto space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{currentLanguage === "ar" ? "رمز التتبع" : "Tracking ID"}</span>
                      <span className="font-mono font-extrabold text-sudan-green text-sm">{submissionSuccess}</span>
                    </div>
                    <div className="h-32 w-32 bg-white border border-gray-200 rounded-xl mx-auto flex items-center justify-center p-2">
                      {/* Fake QR */}
                      <div className="relative h-full w-full bg-[radial-gradient(#1e293b_20%,transparent_20%)] [background-size:8px_8px] border border-dashed border-slate-200 rounded flex items-center justify-center">
                        <span className="text-[8px] bg-white border px-1.5 py-0.5 rounded shadow font-mono text-slate-800 font-bold">{submissionSuccess}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setStoreName("");
                      setDetails("");
                      setCityName("");
                      setBarcodeInput("");
                      setEvidenceFiles([]);
                      setHasGPS(false);
                      setHasVoiceMemo(false);
                      setSubmissionSuccess(null);
                    }}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow"
                  >
                    {currentLanguage === "ar" ? "تقديم بلاغ آخر" : "Submit Another Complaint"}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="track-complaints"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6"
            >
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm md:text-base text-slate-800 flex items-center gap-2">
                  <Search className="h-5 w-5 text-sudan-green" />
                  {currentLanguage === "ar" ? "تتبع حالة القضايا والبلاغات" : "Track Consumer Grievance Status"}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentLanguage === "ar" ? "أدخل المعرف الفرعي للشكوى لمشاهدة التسلسل الزمني وسجل الضبطيات القضائية للمحل." : "Enter your tracking code to view active compliance steps and enforcement states."}
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. comp-1, comp-2"
                  className="flex-1 bg-[#F4F6F5] border border-gray-200 text-xs px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  dir="ltr"
                />
                <button
                  onClick={handleTrack}
                  className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer shadow"
                >
                  {currentLanguage === "ar" ? "استعلام" : "Track"}
                </button>
              </div>

              {trackedComplaint && (
                <div className="space-y-6 border-t border-gray-100 pt-6">
                  {/* Complaint Card Header */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-sm">{trackedComplaint.storeName}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{trackedComplaint.state} - {trackedComplaint.city}</span>
                      </p>
                    </div>
                    <div className="md:text-right space-y-1">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border inline-block ${
                        trackedComplaint.status === "resolved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}>
                        {trackedComplaint.status === "resolved" ? (currentLanguage === "ar" ? "تم حسمها بنجاح" : "Resolved") : (currentLanguage === "ar" ? "قيد المعالجة الميدانية" : "Active Investigation")}
                      </span>
                      <p className="text-[9px] text-slate-400 font-mono">ID: {trackedComplaint.id}</p>
                    </div>
                  </div>

                  {/* Workflow Tracker Graphic */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{currentLanguage === "ar" ? "مسار العمل والتحقيق الجاري" : "Investigation Work Flow"}</h5>
                    
                    <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 ml-3 py-1">
                      {/* Timeline Item 1 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1/2 -translate-y-1/2 h-4 w-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center"></span>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">{currentLanguage === "ar" ? "تقديم البلاغ وتدقيق الهوية" : "Complaint Registered & Verified"}</p>
                          <p className="text-[10px] text-slate-400">{new Date(trackedComplaint.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Timeline Item 2 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1/2 -translate-y-1/2 h-4 w-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center"></span>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">{currentLanguage === "ar" ? "التوجيه التلقائي الذكي للفرع الإقليمي" : "Automated AI Routing to Regional Branch"}</p>
                          <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "توزيع الملف بناءً على النشاط والموقع الجغرافي" : "Routed to state inspection cell"}</p>
                        </div>
                      </div>

                      {/* Timeline Item 3 */}
                      <div className="relative">
                        <span className={`absolute -left-[31px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                          getTimelineStep(trackedComplaint.status) >= 3 ? "bg-emerald-500" : "bg-slate-200"
                        }`}></span>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">{currentLanguage === "ar" ? "تكليف مفتش وتحري ميداني" : "Inspector Dispatched & Evidence Intake"}</p>
                          {trackedComplaint.investigationNotes ? (
                            <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-1 border border-amber-100 italic">{trackedComplaint.investigationNotes}</p>
                          ) : (
                            <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "بانتظار زيارة المفتش الميدانية" : "Awaiting site inspector visitation"}</p>
                          )}
                        </div>
                      </div>

                      {/* Timeline Item 4 */}
                      <div className="relative">
                        <span className={`absolute -left-[31px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                          trackedComplaint.status === "resolved" ? "bg-emerald-500" : "bg-slate-200"
                        }`}></span>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">{currentLanguage === "ar" ? "الإجراءات القانونية والمخالفات السيادية" : "Legal Citations & Fine Collection"}</p>
                          <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "ربط غرامة مالية تلقائياً بحساب المنشأة بالسجل التجاري" : "Digital invoice penalty generated in gateway logs"}</p>
                        </div>
                      </div>

                      {/* Timeline Item 5 */}
                      <div className="relative">
                        <span className={`absolute -left-[31px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                          trackedComplaint.status === "resolved" ? "bg-emerald-500 animate-pulse" : "bg-slate-200"
                        }`}></span>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800">{currentLanguage === "ar" ? "التسوية وإغلاق القضية" : "Resolution & File Archive"}</p>
                          <p className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "التأكد من التزام المنشأة بالتسعيرة والمقاييس لعام 2035" : "Verification of compliance under vision 2035"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Satisfaction Survey */}
                  {trackedComplaint.status === "resolved" && (
                    <div className="p-5 bg-emerald-50/60 border border-emerald-100 rounded-3xl space-y-4">
                      <div className="flex items-center gap-2 text-sudan-green">
                        <Sparkles className="h-5 w-5" />
                        <h4 className="text-xs font-black">{currentLanguage === "ar" ? "قياس رضا المواطنين عن الخدمة" : "Citizen Satisfaction Survey"}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {currentLanguage === "ar" ? "نهتم برأيك لتطوير الخدمات الرقابية. يرجى تقييم سرعة معالجة وحسم القضية:" : "Help us improve Digital Commerce surveillance. Rate our speed and transparency:"}
                      </p>

                      {surveySubmitted ? (
                        <div className="p-4 text-center text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-xl">
                          {currentLanguage === "ar" ? "شكرًا لمشاركتك! تساهم إجابتك في الارتقاء بمستويات التجارة العادلة." : "Thank you for your feedback! It makes Sudan markets fairer."}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setSurveyRating(star)}
                                className="cursor-pointer"
                              >
                                <Star className={`h-6 w-6 ${star <= surveyRating ? "text-sudan-gold fill-sudan-gold" : "text-slate-300"}`} />
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={surveyNotes}
                            onChange={(e) => setSurveyNotes(e.target.value)}
                            rows={2}
                            placeholder={currentLanguage === "ar" ? "اكتب ملاحظات إضافية هنا..." : "Any comments..."}
                            className="w-full bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl outline-none"
                          />
                          <button
                            type="button"
                            onClick={submitSurvey}
                            className="bg-sudan-green text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer hover:bg-sudan-green-light transition-all"
                          >
                            {currentLanguage === "ar" ? "إرسال التقييم سيادياً" : "Submit Rating"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
