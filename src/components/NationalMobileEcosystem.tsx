/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Phase Twenty-Three - National Mobile Government Platform & Digital Wallet Ecosystem
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone, Wallet, Globe, Database, Cpu, TrendingUp, BarChart3, Shield,
  ShieldCheck, ShieldAlert, Users, Bell, Mic, MicOff, Camera, Eye, Wifi, WifiOff,
  RefreshCw, CheckCircle2, ChevronRight, X, ScanLine, Clock, HelpCircle,
  FileText, Download, Play, Plus, Trash2, Send, Award, Key, Settings,
  Activity, ArrowRight, BookOpen, Fingerprint, Lock, Layers, ListFilter,
  Check, Info, FileSpreadsheet, Scale, Terminal
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell
} from "recharts";

// Interfaces for Mobile Services
interface DeviceSession {
  id: string;
  os: "android" | "ios" | "huawei";
  deviceModel: string;
  status: "active" | "offline" | "blocked";
  lastSync: string;
  location: string;
  securityRating: number;
}

interface DigitalLicense {
  id: string;
  typeAr: string;
  typeEn: string;
  licenseNo: string;
  ownerAr: string;
  ownerEn: string;
  expiryDate: string;
  status: "valid" | "expired" | "suspended";
  blockchainHash: string;
}

interface NotificationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: "alert" | "info" | "action";
  time: string;
  priority: "high" | "medium" | "low";
  read: boolean;
}

interface OfflineDraft {
  id: string;
  serviceAr: string;
  serviceEn: string;
  formData: any;
  savedAt: string;
  status: "draft" | "pending_sync" | "synced";
}

interface MobileDevOpsMetric {
  version: string;
  activeUsers: number;
  crashFreeRate: number;
  apiLatencyMs: number;
  otaStatus: "stable" | "beta" | "deprecated";
}

interface NationalMobileEcosystemProps {
  currentLanguage: "ar" | "en";
  role?: string;
}

export default function NationalMobileEcosystem({ currentLanguage, role = "admin" }: NationalMobileEcosystemProps) {
  // Global states
  const [deviceOS, setDeviceOS] = useState<"android" | "ios" | "huawei">("android");
  const [activeMobileView, setActiveMobileView] = useState<"wallet" | "services" | "assistant" | "offline" | "inspector">("wallet");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [biometricAuthenticated, setBiometricAuthenticated] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [scannedDocText, setScannedDocText] = useState<string | null>(null);
  const [isScanningDoc, setIsScanningDoc] = useState<boolean>(false);
  const [notificationsLog, setNotificationsLog] = useState<string[]>([
    "Mobile session initialized securely via Zero-Trust JWT.",
    "Biometric credentials verified with Local Hardware Secure Enclave.",
    "Offline database initialized (Hive/SQLite) - ready for offline workflows."
  ]);

  // MODULE 2: Digital Wallet state
  const [walletLicenses, setWalletLicenses] = useState<DigitalLicense[]>([
    {
      id: "LIC-8820",
      typeAr: "السجل التجاري الفيدرالي الموحد",
      typeEn: "Unified Federal Commercial Register",
      licenseNo: "SD-2026-94829",
      ownerAr: "شركة النيل للمنتجات الغذائية المحدودة",
      ownerEn: "Nile Food Products Co. Ltd",
      expiryDate: "2027-06-12",
      status: "valid",
      blockchainHash: "sha256_b10a42f53d5a49826f43eecda34aef129fc2301f2982d1cda8"
    },
    {
      id: "LIC-1192",
      typeAr: "ترخيص التشغيل الصناعي الذكي",
      typeEn: "Smart Industrial Operating License",
      licenseNo: "IND-2026-10492",
      ownerAr: "مجمع الباقير لصناعة الغزل والنسيج",
      ownerEn: "El Bagair Textile Complex",
      expiryDate: "2026-12-30",
      status: "valid",
      blockchainHash: "sha256_c203ba39bbfcd7103ba928ecda340aef129fc2301fed89a239"
    },
    {
      id: "LIC-5541",
      typeAr: "شهادة المنشأ واعتماد الصادرات",
      typeEn: "Sovereign Certificate of Origin (Comesa)",
      licenseNo: "EXP-2026-77401",
      ownerAr: "مؤسسة الصمغ العربي السيادية",
      ownerEn: "Sovereign Gum Arabic Corporation",
      expiryDate: "2026-11-15",
      status: "valid",
      blockchainHash: "sha256_e0d991b7852b855b4938af53d5a49826f43ee9e830aef12a02"
    }
  ]);
  const [activeLicenseIndex, setActiveLicenseIndex] = useState<number>(0);
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);

  // MODULE 3: Mobile E-Services Forms
  const [activeFormTab, setActiveFormTab] = useState<"register" | "pay" | "appointment">("register");
  const [registerForm, setRegisterForm] = useState({
    companyNameAr: "مؤسسة الفجر للاستيراد والتصدير",
    companyNameEn: "Al-Fajr Import & Export Corp",
    sector: "trade",
    capital: "10,000,000",
    phone: "+249912345678"
  });
  const [serviceStatusTracking, setServiceStatusTracking] = useState<any>({
    id: "SRV-2026-9812",
    nameAr: "تجديد السجل التجاري الرقمي",
    nameEn: "Digital Commercial Register Renewal",
    status: "approved", // draft, under_review, approved, printed
    progress: 100,
    timestamp: "2026-07-19"
  });

  // MODULE 4: Push Notifications & In-App Alerts
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "N1", titleAr: "تنبيه أمان: تم تسجيل دخول جهاز جديد", titleEn: "Security Alert: New device bound to your identity", category: "alert", time: "10 Min ago", priority: "high", read: false },
    { id: "N2", titleAr: "تم إصدار ترخيص التصدير الخاص بك بنجاح", titleEn: "Your Export License has been issued", category: "info", time: "1 Hour ago", priority: "high", read: false },
    { id: "N3", titleAr: "مطلوب تجديد ترخيص تشغيل مصنع الباقير", titleEn: "Action Required: Renew El Bagair license", category: "action", time: "1 Day ago", priority: "medium", read: true },
    { id: "N4", titleAr: "تحديث اللائحة الفيدرالية للتبادل التجاري", titleEn: "Ministerial trade circular published", category: "info", time: "3 Days ago", priority: "low", read: true }
  ]);

  // MODULE 5: AI voice console commands & chat
  const [aiSpeechOutput, setAiSpeechOutput] = useState<string>("");
  const [aiTranscript, setAiTranscript] = useState<string>("");

  // MODULE 6: Offline drafts storage
  const [offlineDrafts, setOfflineDrafts] = useState<OfflineDraft[]>([
    {
      id: "DRAFT-101",
      serviceAr: "تأسيس شركة ذات مسؤولية محدودة",
      serviceEn: "LLC Corporation Incorporation",
      formData: { name: "شركة النيل الأزرق اللوجستية", capital: "5,000,000" },
      savedAt: "2026-07-18 14:32",
      status: "pending_sync"
    },
    {
      id: "DRAFT-102",
      serviceAr: "بلاغ حماية مستهلك - ممارسات احتكارية",
      serviceEn: "Consumer Protection Complaint",
      formData: { subject: "زيادة سعر السكر بورتسودان", merchant: "مستودع الأمانة" },
      savedAt: "2026-07-19 01:15",
      status: "draft"
    }
  ]);

  // MODULE 7: Mobile Inspector Platform
  const [inspectorVisits, setInspectorVisits] = useState<any[]>([
    { id: "INSP-MOB-01", siteAr: "مصنع النيل للأقطان والنسيج", siteEn: "Nile Cotton & Spinning Co.", status: "scheduled", coordinate: "الباقير - الجزيرة", inspector: "أحمد الفاتح" },
    { id: "INSP-MOB-02", siteAr: "مستودعات الغلال في بورتسودان", siteEn: "Port Sudan Grain Silos", status: "completed", coordinate: "الميناء الجنوبي", inspector: "صلاح الطاهر" }
  ]);
  const [activeInspectionIndex, setActiveInspectionIndex] = useState<number>(0);
  const [violationLogInput, setViolationLogInput] = useState<string>("");
  const [inspectionPhotoAttached, setInspectionPhotoAttached] = useState<boolean>(false);
  const [inspectorSignatureSigned, setInspectorSignatureSigned] = useState<boolean>(false);

  // MODULE 8: Executive Mobile Analytics
  const [executiveKpiData, setExecutiveKpiData] = useState<any[]>([
    { month: "Jan", transactions: 12000, appDownloads: 15000, registrations: 840 },
    { month: "Feb", transactions: 14500, appDownloads: 18400, registrations: 1020 },
    { month: "Mar", transactions: 18000, appDownloads: 22000, registrations: 1250 },
    { month: "Apr", transactions: 24000, appDownloads: 29000, registrations: 1680 },
    { month: "May", transactions: 31000, appDownloads: 35000, registrations: 2100 },
    { month: "Jun", transactions: 38900, appDownloads: 41200, registrations: 2450 }
  ]);

  // MODULE 9 & 10: Security & DevOps Console states
  const [connectedDevices, setConnectedDevices] = useState<DeviceSession[]>([
    { id: "DEV-01", os: "android", deviceModel: "Samsung Galaxy S24 Ultra", status: "active", lastSync: "Just now", location: "Khartoum, SD", securityRating: 98 },
    { id: "DEV-02", os: "ios", deviceModel: "iPhone 15 Pro Max", status: "active", lastSync: "2 hours ago", location: "Port Sudan, SD", securityRating: 99 },
    { id: "DEV-03", os: "huawei", deviceModel: "Huawei Mate 60 Pro", status: "offline", lastSync: "1 day ago", location: "Omdurman, SD", securityRating: 95 }
  ]);

  const [devOpsMetrics, setDevOpsMetrics] = useState<MobileDevOpsMetric[]>([
    { version: "v2.3.0-stable", activeUsers: 48900, crashFreeRate: 99.85, apiLatencyMs: 142, otaStatus: "stable" },
    { version: "v2.4.0-beta", activeUsers: 1420, crashFreeRate: 99.20, apiLatencyMs: 156, otaStatus: "beta" }
  ]);

  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0);
  const [appSigningFingerprint, setAppSigningFingerprint] = useState<string>("SHA256: F2:CD:33:AA:94:82:9E:FC:D4:AF:37:BB:EE:39:AA:CC:E8");
  const [otaProgress, setOtaProgress] = useState<number | null>(null);

  // -------------------------------------------------------------------------
  // VOICE COMMANDS SIMULATION (MODULE 5)
  // -------------------------------------------------------------------------
  const startVoiceCapture = () => {
    setIsRecording(true);
    setAiTranscript("");
    
    // Simulate speech-to-text processing
    setTimeout(() => {
      const phraseAr = "عرض السجل التجاري الرقمي لشركة النيل";
      const phraseEn = "Show my digital commercial register";
      setAiTranscript(currentLanguage === "ar" ? phraseAr : phraseEn);
    }, 2000);

    // Simulate AI voice reply
    setTimeout(() => {
      setIsRecording(false);
      setActiveMobileView("wallet");
      setActiveLicenseIndex(0);
      
      const replyAr = "تم الكشف عن هويتك الرقمية وجلب بطاقة السجل التجاري رقم SD-2026-94829 لشركة النيل للأغذية المحدودة من البلوكشين القومي.";
      const replyEn = "Biometric commercial register card SD-2026-94829 for Nile Food Products retrieved from the sovereign blockchain.";
      setAiSpeechOutput(currentLanguage === "ar" ? replyAr : replyEn);
      
      if (audioFeedback && window.speechSynthesis) {
        speakText(currentLanguage === "ar" ? replyAr : replyEn);
      }
      setNotificationsLog(prev => ["AI Voice Command executed successfully", ...prev]);
    }, 3800);
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = currentLanguage === "ar" ? "ar-SA" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------------------------
  // OCR SIMULATION (MODULE 5)
  // -------------------------------------------------------------------------
  const handleOcrSimulation = () => {
    setIsScanningDoc(true);
    setScannedDocText(null);
    
    setTimeout(() => {
      setIsScanningDoc(false);
      const textAr = "الجمهورية السودانية | وزارة التجارة\nالاسم: شركة النيل للمنتجات الغذائية المحدودة\nالرقم الوطني الموحد: SD-2026-94829\nحالة الترخيص: ساري ومطابق للمواصفات";
      const textEn = "Republic of Sudan | Ministry of Commerce\nName: Nile Food Products Co. Ltd\nUnified ID: SD-2026-94829\nStatus: Active & Sovereign Compliant";
      setScannedDocText(currentLanguage === "ar" ? textAr : textEn);
      setNotificationsLog(prev => ["Document OCR character recognition completed", ...prev]);
    }, 2000);
  };

  // -------------------------------------------------------------------------
  // OFFLINE SYNCHRONIZATION ENGINE (MODULE 6)
  // -------------------------------------------------------------------------
  const handleTriggerOfflineSync = () => {
    if (!isOnline) {
      setNotificationsLog(prev => ["ALERT: Cannot sync while offline. Check connectivity.", ...prev]);
      return;
    }

    setNotificationsLog(prev => ["Initiating background synchronization protocol...", ...prev]);
    
    // Simulate sync
    setTimeout(() => {
      setOfflineDrafts(prev =>
        prev.map(d => ({ ...d, status: "synced" }))
      );
      
      // Update wallet or status tracking with synced assets
      setServiceStatusTracking({
        id: "SRV-2026-9815",
        nameAr: "تأسيس شركة ذات مسؤولية محدودة",
        nameEn: "LLC Corporation Incorporation",
        status: "under_review",
        progress: 45,
        timestamp: "2026-07-19"
      });

      setNotificationsLog(prev => [
        "Offline synchronization complete: 2 drafts published to Central SQL database.",
        "Conflict resolution check: 100% compliant.",
        "Commercial wallet metadata updated on Sovereign Blockchain ledger.",
        ...prev
      ]);
    }, 2000);
  };

  // -------------------------------------------------------------------------
  // BIOMETRIC SECURITY TOGGLE (MODULE 9)
  // -------------------------------------------------------------------------
  const handleBiometricToggle = () => {
    setBiometricAuthenticated(!biometricAuthenticated);
    setNotificationsLog(prev => [
      biometricAuthenticated 
        ? "Biometric token revoked. App locked." 
        : "Biometric authentication verified (FaceID/SecureEnclave). Session active.",
      ...prev
    ]);
  };

  // -------------------------------------------------------------------------
  // DEV DEV_OPS OTA PUSH (MODULE 10)
  // -------------------------------------------------------------------------
  const triggerOtaUpdate = () => {
    setOtaProgress(0);
    const interval = setInterval(() => {
      setOtaProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setNotificationsLog(prevLog => [
            "OTA update rolled out successfully to active nodes: v2.3.0 -> v2.4.0.",
            ...prevLog
          ]);
          return null;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div id="national-mobile-ecosystem-root" className="bg-[#0b0f19] text-gray-100 p-4 md:p-6 border border-slate-800 rounded-xl shadow-2xl relative overflow-hidden font-sans">
      
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 -z-10"></div>

      {/* SOVEREIGN SYSTEM BAR */}
      <div className="mb-6 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 border border-emerald-500/40 p-2.5 rounded-lg text-emerald-400">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{currentLanguage === "ar" ? "الـمنظومة القومية للموبايل الحكومي ومحفظة الهوية الرقمية" : "National Mobile Government Ecosystem & Digital Wallet"}</span>
              <span className="bg-emerald-900/40 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">Phase 23</span>
            </h2>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "خدمات وزارة التجارة والصناعة عبر تطبيقات الهواتف الذكية مع حوكمة عدم الاتصال والذكاء الاصطناعي" : "Multi-Platform Native Applications (Android, iOS, Huawei) with Biometric Enclave, Offline Sync & AI Voice Assistance"}
            </p>
          </div>
        </div>

        {/* Global Network Status Controls */}
        <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-gray-500">{currentLanguage === "ar" ? "حالة شبكة الهاتف:" : "Mobile Signal:"}</span>
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              setNotificationsLog(prev => [`Network simulation switched to ${!isOnline ? "ONLINE" : "OFFLINE"}.`, ...prev]);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isOnline 
                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30" 
                : "bg-rose-950 text-rose-400 border border-rose-500/30"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3" />
                <span>ONLINE (متصل)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span>OFFLINE (منقطع)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN PLATFORM SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE SMARTPHONE DEVICE SIMULATOR (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          
          {/* OS Platform Switcher */}
          <div className="flex gap-1.5 mb-3 bg-slate-900 border border-slate-800 p-1.5 rounded-lg w-full max-w-[320px]">
            {[
              { id: "android", label: "Android" },
              { id: "ios", label: "iOS" },
              { id: "huawei", label: "HMS Store" }
            ].map(os => (
              <button
                key={os.id}
                onClick={() => {
                  setDeviceOS(os.id as any);
                  setNotificationsLog(prev => [`Switched smartphone model frame to ${os.label}`, ...prev]);
                }}
                className={`flex-1 text-center py-1 text-[10px] font-mono font-medium rounded transition-all cursor-pointer ${
                  deviceOS === os.id
                    ? "bg-emerald-900/40 border border-emerald-500/30 text-emerald-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {os.label}
              </button>
            ))}
          </div>

          {/* SMARTPHONE HARDWARE SHELL FRAME */}
          <div className="w-full max-w-[320px] bg-black border-[8px] border-slate-800 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col" style={{ minHeight: "580px" }}>
            
            {/* Top Speaker & Camera Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-black flex items-center justify-center z-40">
              <div className="w-24 h-4 bg-slate-900 rounded-b-xl flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                <span className="w-12 h-1 bg-slate-800 rounded-full"></span>
              </div>
            </div>

            {/* Simulated Mobile OS StatusBar */}
            <div className="pt-7 px-4 pb-2 bg-slate-950 flex items-center justify-between text-[10px] font-mono text-gray-400 select-none border-b border-slate-900/60 z-30">
              <span>09:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] bg-slate-900 text-emerald-400 px-1 py-0.2 rounded border border-slate-800">
                  {deviceOS.toUpperCase()}
                </span>
                {isOnline ? <Wifi className="h-3 w-3 text-emerald-400" /> : <WifiOff className="h-3 w-3 text-rose-500" />}
                <span className="font-semibold text-emerald-400">98%</span>
              </div>
            </div>

            {/* SMARTPHONE ACTIVE SCREEN VIEWER */}
            <div className="flex-1 bg-[#0b0f19] p-3 flex flex-col relative overflow-y-auto scrollbar-none" style={{ maxHeight: "490px" }}>
              
              {/* Device Header */}
              <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
                    <Smartphone className="h-3 w-3 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-white font-mono">SD-COMMERCE</span>
                </div>
                <button
                  onClick={handleBiometricToggle}
                  className={`p-1 rounded transition-colors ${biometricAuthenticated ? "text-emerald-400 bg-emerald-950/40" : "text-gray-500 bg-slate-950"}`}
                  title="Toggle Biometric Authentication"
                >
                  <Fingerprint className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* SECURITY SHIELD ALERT IF NOT BIOMETRIC APPROVED */}
              {!biometricAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-full text-rose-400 mb-3 animate-bounce">
                    <Lock className="h-7 w-7" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {currentLanguage === "ar" ? "التطبيق مقفل للخصوصية" : "Biometric Device Lock Active"}
                  </h4>
                  <p className="text-[10px] text-gray-400 mb-4 max-w-[200px]">
                    {currentLanguage === "ar" ? "يرجى التحقق من بصمة الإصبع أو الوجه لفتح المحفظة والمستندات السيادية" : "Please authenticate with your fingerprint or face verification to view sovereign identity documents"}
                  </p>
                  <button
                    onClick={() => {
                      setBiometricAuthenticated(true);
                      setNotificationsLog(prev => ["Local session authenticated successfully.", ...prev]);
                    }}
                    className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-semibold font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Fingerprint className="h-3.5 w-3.5" />
                    <span>{currentLanguage === "ar" ? "التحقق البيومتري" : "Authenticate"}</span>
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  
                  {/* APP SUB-VIEW 1: DIGITAL IDENTITY WALLET */}
                  {activeMobileView === "wallet" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">
                          {currentLanguage === "ar" ? "💳 المحفظة الرقمية للمستندات" : "💳 My Digital ID Wallet"}
                        </span>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                          Offline Safe
                        </span>
                      </div>

                      {/* Stack of Digital Licenses */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-emerald-900/60 to-slate-950 border border-emerald-500/40 rounded-xl p-3.5 shadow-xl min-h-[145px] flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-[8px] uppercase font-mono text-emerald-400 tracking-wider">
                                {currentLanguage === "ar" ? "جمهورية السودان | وزارة التجارة" : "REPUBLIC OF SUDAN"}
                              </div>
                              <h4 className="text-[11px] font-bold text-white mt-0.5">
                                {currentLanguage === "ar" ? walletLicenses[activeLicenseIndex].typeAr : walletLicenses[activeLicenseIndex].typeEn}
                              </h4>
                            </div>
                            <Award className="h-4.5 w-4.5 text-amber-400" />
                          </div>

                          <div className="my-3 font-mono">
                            <div className="text-[8px] text-gray-400">{currentLanguage === "ar" ? "مالك الترخيص" : "Owner"}</div>
                            <div className="text-[10px] text-white font-bold truncate">
                              {currentLanguage === "ar" ? walletLicenses[activeLicenseIndex].ownerAr : walletLicenses[activeLicenseIndex].ownerEn}
                            </div>
                            <div className="text-[9px] text-gray-300 mt-1 flex justify-between">
                              <span>No: {walletLicenses[activeLicenseIndex].licenseNo}</span>
                              <span className="text-[#D4AF37]">EXP: {walletLicenses[activeLicenseIndex].expiryDate}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-slate-800/60 pt-2 text-[8px] font-mono">
                            <span className="text-gray-400">Secure Blockchain Certified</span>
                            <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                              <ShieldCheck className="h-3 w-3" /> VERIFIED
                            </span>
                          </div>
                        </div>

                        {/* Pagination circles */}
                        <div className="flex justify-center gap-1.5 mt-2">
                          {walletLicenses.map((lic, index) => (
                            <button
                              key={lic.id}
                              onClick={() => setActiveLicenseIndex(index)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${activeLicenseIndex === index ? "w-4 bg-emerald-500" : "w-1.5 bg-slate-800"}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Wallet Quick Interactive Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => setQrModalVisible(true)}
                          className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ScanLine className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{currentLanguage === "ar" ? "رمز التحقق QR" : "Generate QR"}</span>
                        </button>
                        <button
                          onClick={() => {
                            setNotificationsLog(prev => ["Saved digital wallet backup locally.", ...prev]);
                            alert(currentLanguage === "ar" ? "تم حفظ نسخة مشفرة من الترخيص على جهازك" : "Encrypted offline copy saved to phone storage");
                          }}
                          className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{currentLanguage === "ar" ? "تحميل دون اتصال" : "Save Offline"}</span>
                        </button>
                      </div>

                      {/* Blockchain Ledger Hash Metadata */}
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-900 text-[8px] font-mono text-gray-500">
                        <div className="text-[9px] text-gray-400 font-semibold mb-0.5">Sovereign Ledger Node</div>
                        <div className="truncate">{walletLicenses[activeLicenseIndex].blockchainHash}</div>
                      </div>
                    </motion.div>
                  )}

                  {/* APP SUB-VIEW 2: MOBILE E-SERVICES */}
                  {activeMobileView === "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
                        <span className="text-[10px] font-mono text-gray-400">
                          {currentLanguage === "ar" ? "🏛️ المعاملات والخدمات الفورية" : "🏛️ Sovereign E-Services"}
                        </span>
                        <span className="text-[8px] text-amber-400 font-mono">Real-time Form</span>
                      </div>

                      {/* Form Tabs inside app */}
                      <div className="flex bg-slate-900 p-0.5 rounded-md text-[9px] font-mono">
                        <button
                          onClick={() => setActiveFormTab("register")}
                          className={`flex-1 text-center py-1 rounded transition-colors ${activeFormTab === "register" ? "bg-slate-800 text-white" : "text-gray-400"}`}
                        >
                          {currentLanguage === "ar" ? "تسجيل" : "Register"}
                        </button>
                        <button
                          onClick={() => setActiveFormTab("pay")}
                          className={`flex-1 text-center py-1 rounded transition-colors ${activeFormTab === "pay" ? "bg-slate-800 text-white" : "text-gray-400"}`}
                        >
                          {currentLanguage === "ar" ? "الدفع" : "Pay"}
                        </button>
                        <button
                          onClick={() => setActiveFormTab("appointment")}
                          className={`flex-1 text-center py-1 rounded transition-colors ${activeFormTab === "appointment" ? "bg-slate-800 text-white" : "text-gray-400"}`}
                        >
                          {currentLanguage === "ar" ? "موعد" : "Reserve"}
                        </button>
                      </div>

                      {/* Active inner form */}
                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 text-[10px]">
                        {activeFormTab === "register" && (
                          <div className="flex flex-col gap-2">
                            <div>
                              <label className="text-[8px] text-gray-400 block mb-0.5">{currentLanguage === "ar" ? "اسم الشركة (عربي)" : "Company Name (Ar)"}</label>
                              <input
                                type="text"
                                value={registerForm.companyNameAr}
                                onChange={e => setRegisterForm({ ...registerForm, companyNameAr: e.target.value })}
                                className="w-full bg-slate-900 text-white rounded p-1 text-[10px] outline-none border border-slate-800 focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-gray-400 block mb-0.5">{currentLanguage === "ar" ? "رأس المال المقترح" : "Proposed Capital (SDG)"}</label>
                              <input
                                type="text"
                                value={registerForm.capital}
                                onChange={e => setRegisterForm({ ...registerForm, capital: e.target.value })}
                                className="w-full bg-slate-900 text-white rounded p-1 text-[10px] outline-none border border-slate-800 focus:border-emerald-500 font-mono"
                              />
                            </div>
                            <button
                              onClick={() => {
                                setNotificationsLog(prev => ["Saved company registration draft local.", ...prev]);
                                alert(currentLanguage === "ar" ? "تم الحفظ كمسودة غير متصلة بالشبكة" : "Saved locally as offline draft");
                              }}
                              className="w-full py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded text-[9px] mt-1 cursor-pointer"
                            >
                              {currentLanguage === "ar" ? "تقديم المعاملة" : "Submit Service Application"}
                            </button>
                          </div>
                        )}

                        {activeFormTab === "pay" && (
                          <div className="flex flex-col gap-2 text-center py-2">
                            <div className="text-[14px] font-bold text-amber-400 font-mono">15,000 SDG</div>
                            <p className="text-[8px] text-gray-400">
                              {currentLanguage === "ar" ? "رسوم اعتماد العلامة التجارية الموحدة" : "Unified trademark verification duty"}
                            </p>
                            <button
                              onClick={() => {
                                setNotificationsLog(prev => ["Payment executed securely via Mobile Payment Gateway.", ...prev]);
                                alert(currentLanguage === "ar" ? "تم دفع الرسوم بنجاح" : "Fee paid successfully via Secure Wallet Gateway");
                              }}
                              className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[9px] font-semibold mt-1 cursor-pointer"
                            >
                              {currentLanguage === "ar" ? "دفع الرسوم الإلكترونية" : "Authenticate Mobile Payment"}
                            </button>
                          </div>
                        )}

                        {activeFormTab === "appointment" && (
                          <div className="flex flex-col gap-2">
                            <p className="text-[8px] text-gray-400 text-center">
                              {currentLanguage === "ar" ? "حجز موعد مقابلة السجل التجاري في بورتسودان" : "Reserve appointment at Port Sudan office"}
                            </p>
                            <button
                              onClick={() => {
                                setNotificationsLog(prev => ["Sovereign Office appointment scheduled for 2026-07-23", ...prev]);
                                alert(currentLanguage === "ar" ? "تم تأكيد موعدك: 23 يوليو" : "Appointment confirmed for July 23rd");
                              }}
                              className="w-full py-1.5 bg-slate-800 text-white rounded text-[9px] font-mono cursor-pointer"
                            >
                              {currentLanguage === "ar" ? "تأكيد الحجز الفيدرالي" : "Confirm Appointment"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Real-time Status Tracker widget */}
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-[10px]">
                        <div className="flex justify-between text-[8px] text-gray-400 mb-1">
                          <span>Track ID: {serviceStatusTracking.id}</span>
                          <span>{serviceStatusTracking.timestamp}</span>
                        </div>
                        <div className="font-bold text-white mb-1">
                          {currentLanguage === "ar" ? serviceStatusTracking.nameAr : serviceStatusTracking.nameEn}
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${serviceStatusTracking.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center text-[8px] mt-1.5">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-emerald-400 font-mono uppercase">{serviceStatusTracking.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* APP SUB-VIEW 3: AI VOICE ASSISTANT */}
                  {activeMobileView === "assistant" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
                        <span className="text-[10px] font-mono text-gray-400">
                          {currentLanguage === "ar" ? "🗣️ المساعد الشخصي الصوتي" : "🗣️ Mobile Spatial AI Assistant"}
                        </span>
                        <span className="text-[8px] text-emerald-400 font-mono flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
                        </span>
                      </div>

                      {/* Microphone simulation */}
                      <div className="flex flex-col items-center justify-center py-3.5 bg-slate-950 rounded-xl border border-slate-900 text-center relative">
                        {isRecording ? (
                          <div className="flex items-center gap-1.5 mb-3.5 justify-center">
                            <span className="h-3 w-1 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                            <span className="h-6 w-1 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            <span className="h-4 w-1 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                            <span className="h-7 w-1 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                            <span className="h-3 w-1 bg-emerald-500 rounded animate-bounce" style={{ animationDelay: "0.5s" }}></span>
                          </div>
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                            <Mic className="h-4 w-4 text-emerald-400" />
                          </div>
                        )}

                        <button
                          onClick={startVoiceCapture}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                            isRecording 
                              ? "bg-rose-950 border border-rose-500/40 text-rose-400" 
                              : "bg-emerald-900/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60"
                          }`}
                        >
                          {isRecording ? (currentLanguage === "ar" ? "جاري الاستماع..." : "Listening...") : (currentLanguage === "ar" ? "اضغط للتحدث" : "Press & Speak")}
                        </button>

                        {aiTranscript && (
                          <div className="mt-3.5 px-3 py-1 bg-slate-900 rounded-lg text-[9px] font-mono text-gray-300 max-w-[200px]">
                            "{aiTranscript}"
                          </div>
                        )}
                      </div>

                      {aiSpeechOutput && (
                        <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg text-[9.5px] text-gray-200">
                          <div className="font-bold text-emerald-400 text-[8px] mb-1 font-mono uppercase">Sovereign AI Voice Reply</div>
                          <p className="leading-relaxed">{aiSpeechOutput}</p>
                        </div>
                      )}

                      {/* OCR Scanner Feature inside App */}
                      <div className="border-t border-slate-800/60 pt-2.5 mt-1 flex flex-col gap-2">
                        <span className="text-[8px] uppercase font-mono text-gray-500">{currentLanguage === "ar" ? "مسح ضوئي بالذكاء الاصطناعي" : "Sovereign Document OCR"}</span>
                        <button
                          onClick={handleOcrSimulation}
                          disabled={isScanningDoc}
                          className="py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[9px] text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Camera className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{isScanningDoc ? (currentLanguage === "ar" ? "مسح ضوئي..." : "Scanning Document...") : (currentLanguage === "ar" ? "فحص شهادة الترخيص" : "Scan Certificate Photo")}</span>
                        </button>

                        {scannedDocText && (
                          <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[8px] font-mono text-emerald-400 whitespace-pre-line leading-normal">
                            {scannedDocText}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* APP SUB-VIEW 4: OFFLINE DRAFT STORAGE */}
                  {activeMobileView === "offline" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
                        <span className="text-[10px] font-mono text-gray-400">
                          {currentLanguage === "ar" ? "💾 الحفظ والـمزامنة اللامركزية" : "💾 Offline Forms & Sync"}
                        </span>
                        <button
                          onClick={handleTriggerOfflineSync}
                          className="text-[9px] text-emerald-400 flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: "3s" }} /> Sync
                        </button>
                      </div>

                      {/* Offline status banner */}
                      <div className="bg-amber-950/20 border border-amber-500/30 p-2 rounded-lg text-[9px] text-amber-400 flex items-start gap-2">
                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <p className="leading-tight">
                          {currentLanguage === "ar" 
                            ? "يتم تخزين المعاملات محلياً عند انقطاع الإنترنت. ستتم المزامنة تلقائياً عند عودة الشبكة." 
                            : "Forms are stored locally when offline. They synchronize securely with the cloud once network is restored."}
                        </p>
                      </div>

                      {/* List of Offline Drafts */}
                      <div className="flex flex-col gap-1.5">
                        {offlineDrafts.map(draft => (
                          <div key={draft.id} className="bg-slate-950 p-2 rounded border border-slate-900 flex justify-between items-center text-[9px]">
                            <div>
                              <div className="font-bold text-white truncate max-w-[140px]">
                                {currentLanguage === "ar" ? draft.serviceAr : draft.serviceEn}
                              </div>
                              <span className="text-[8px] text-gray-500 font-mono">Saved: {draft.savedAt}</span>
                            </div>
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono ${
                              draft.status === "synced" 
                                ? "bg-emerald-950 text-emerald-400" 
                                : draft.status === "pending_sync" 
                                ? "bg-amber-950 text-amber-400" 
                                : "bg-slate-900 text-gray-400"
                            }`}>
                              {draft.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* APP SUB-VIEW 5: MOBILE INSPECTOR WORKSPACE */}
                  {activeMobileView === "inspector" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
                        <span className="text-[10px] font-mono text-gray-400">
                          {currentLanguage === "ar" ? "🕵️ تفتيش الميدان الفيدرالي" : "🕵️ Inspector Workspace"}
                        </span>
                        <span className="text-[8px] text-[#D4AF37] font-mono">GPS ACTIVE</span>
                      </div>

                      {/* Active Scheduled Inspection Card */}
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[10px]">
                        <div className="text-[8px] uppercase font-mono text-emerald-400">Active Job Scheduled</div>
                        <h5 className="font-bold text-white mt-0.5">
                          {currentLanguage === "ar" ? inspectorVisits[activeInspectionIndex].siteAr : inspectorVisits[activeInspectionIndex].siteEn}
                        </h5>
                        <div className="text-[9px] text-gray-400 mt-1">
                          📍 {inspectorVisits[activeInspectionIndex].coordinate}
                        </div>

                        {/* Interactive Inspection input fields */}
                        <div className="mt-3.5 flex flex-col gap-2 border-t border-slate-800/60 pt-2.5">
                          <div>
                            <label className="text-[8px] text-gray-400 block mb-0.5">{currentLanguage === "ar" ? "تسجيل الملاحظات أو المخالفات" : "Log Compliance Issues"}</label>
                            <textarea
                              value={violationLogInput}
                              onChange={e => setViolationLogInput(e.target.value)}
                              placeholder={currentLanguage === "ar" ? "اكتب تفاصيل الفحص هنا..." : "Input facility audit notes..."}
                              className="w-full bg-slate-900 text-white rounded p-1 text-[9px] outline-none border border-slate-800 h-10 resize-none focus:border-emerald-500"
                            />
                          </div>

                          {/* Mock Photo evidence attachment */}
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setInspectionPhotoAttached(true);
                                setNotificationsLog(prev => ["Inspector attached camera photo evidence.", ...prev]);
                              }}
                              className={`flex-1 py-1 rounded text-[8px] font-semibold border transition-all cursor-pointer ${
                                inspectionPhotoAttached 
                                  ? "bg-emerald-950 border-emerald-500/30 text-emerald-400" 
                                  : "bg-slate-900 border-slate-800 text-gray-400"
                              }`}
                            >
                              📷 {inspectionPhotoAttached ? (currentLanguage === "ar" ? "تم إرفاق صورة" : "Photo Attached") : (currentLanguage === "ar" ? "إرفاق صورة" : "Attach Photo")}
                            </button>
                            <button
                              onClick={() => {
                                setInspectorSignatureSigned(true);
                                setNotificationsLog(prev => ["Inspector signed audit report electronically.", ...prev]);
                              }}
                              className={`flex-1 py-1 rounded text-[8px] font-semibold border transition-all cursor-pointer ${
                                inspectorSignatureSigned 
                                  ? "bg-emerald-950 border-emerald-500/30 text-emerald-400" 
                                  : "bg-slate-900 border-slate-800 text-gray-400"
                              }`}
                            >
                              ✍️ {inspectorSignatureSigned ? (currentLanguage === "ar" ? "تم التوقيع" : "Signed") : (currentLanguage === "ar" ? "التوقيع الرقمي" : "Sign Digital")}
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              if (!inspectorSignatureSigned || !violationLogInput) {
                                alert(currentLanguage === "ar" ? "يرجى كتابة الملاحظات وتوقيع المحضر أولاً" : "Please log notes and sign report before submitting");
                                return;
                              }
                              setNotificationsLog(prev => ["Inspection visit submitted to Federal Control board.", ...prev]);
                              alert(currentLanguage === "ar" ? "تم تسليم تقرير التفتيش الميداني والمزامنة مع المركز" : "Inspection audit report submitted and synchronized with central ministry");
                              setViolationLogInput("");
                              setInspectionPhotoAttached(false);
                              setInspectorSignatureSigned(false);
                            }}
                            className="w-full py-1 bg-[#D4AF37] hover:bg-[#B3922E] text-slate-950 font-bold rounded text-[9px] font-mono mt-1 cursor-pointer"
                          >
                            {currentLanguage === "ar" ? "تسليم وإرسال المحضر" : "Submit Signed Report"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              )}

            </div>

            {/* Simulated Navigation Bar at bottom of phone */}
            <div className="bg-slate-950 border-t border-slate-900 px-2 py-1.5 flex justify-between text-gray-400 select-none z-30">
              <button
                onClick={() => setActiveMobileView("wallet")}
                className={`flex-1 flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileView === "wallet" ? "text-emerald-400" : "hover:text-gray-200"}`}
              >
                <Wallet className="h-3.5 w-3.5" />
                <span className="text-[8px]">{currentLanguage === "ar" ? "محفظتي" : "Wallet"}</span>
              </button>
              <button
                onClick={() => setActiveMobileView("services")}
                className={`flex-1 flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileView === "services" ? "text-emerald-400" : "hover:text-gray-200"}`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="text-[8px]">{currentLanguage === "ar" ? "الخدمات" : "E-Services"}</span>
              </button>
              <button
                onClick={() => setActiveMobileView("assistant")}
                className={`flex-1 flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileView === "assistant" ? "text-emerald-400" : "hover:text-gray-200"}`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span className="text-[8px]">{currentLanguage === "ar" ? "مساعد AI" : "AI Helper"}</span>
              </button>
              <button
                onClick={() => setActiveMobileView("offline")}
                className={`flex-1 flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileView === "offline" ? "text-emerald-400" : "hover:text-gray-200"}`}
              >
                <Database className="h-3.5 w-3.5" />
                <span className="text-[8px]">{currentLanguage === "ar" ? "مزامنة" : "Offline"}</span>
              </button>
              <button
                onClick={() => setActiveMobileView("inspector")}
                className={`flex-1 flex flex-col items-center gap-0.5 cursor-pointer ${activeMobileView === "inspector" ? "text-emerald-400" : "hover:text-gray-200"}`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-[8px]">{currentLanguage === "ar" ? "تفتيش" : "Inspect"}</span>
              </button>
            </div>

            {/* Bottom Screen Bar Handle */}
            <div className="bg-slate-950 pb-2 flex justify-center items-center z-30">
              <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: ENTERPRISE MOBILE MANAGEMENT PANELS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* TAB 1: EXECUTIVE MOBILE INTEL & ACTIVE USER BASE (MODULE 8) */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  <span>{currentLanguage === "ar" ? "لوحة الإحصائيات التنفيذية لمستخدمي الهاتف" : "Executive Mobile Telemetry & KPI Analytics"}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {currentLanguage === "ar" ? "مراقبة المعاملات وعمليات التنزيل المكتملة عبر تطبيقات الهواتف الذكية" : "Sovereign usage statistics across Android, iOS and HMS app marketplaces in real-time"}
                </p>
              </div>

              {/* Stress simulation button */}
              <button
                onClick={() => {
                  setExecutiveKpiData(prev =>
                    prev.map(item => ({
                      ...item,
                      transactions: Math.floor(item.transactions * 1.15),
                      appDownloads: Math.floor(item.appDownloads * 1.08)
                    }))
                  );
                  setNotificationsLog(prev => ["User session simulation workload applied. Network spikes simulated.", ...prev]);
                }}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 flex items-center gap-2 cursor-pointer"
              >
                <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span>Simulate Traffic Surge</span>
              </button>
            </div>

            {/* Recharts Area Analytics of Downloads and Registrations */}
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={executiveKpiData}>
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="appDownloads" name="Market Downloads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDownloads)" />
                  <Area type="monotone" dataKey="transactions" name="Active E-Payments" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTransactions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Geographic Distribution Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                <span className="text-[10px] text-gray-400 uppercase font-mono">{currentLanguage === "ar" ? "حجم التنزيلات النشطة" : "Active App Downloads"}</span>
                <div className="text-xl font-bold text-white font-mono mt-1">162,300 +</div>
                <div className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +14.2% Month-on-Month
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                <span className="text-[10px] text-gray-400 uppercase font-mono">{currentLanguage === "ar" ? "متوسط تقييم المتاجر" : "App Store Rating Average"}</span>
                <div className="text-xl font-bold text-[#D4AF37] font-mono mt-1">4.82 / 5.0</div>
                <div className="text-[9px] text-gray-500 mt-1">Based on 12.4k reviews</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                <span className="text-[10px] text-gray-400 uppercase font-mono">{currentLanguage === "ar" ? "نسبة كفاءة المنظومة" : "Service Availability"}</span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">99.98%</div>
                <div className="text-[9px] text-gray-500 mt-1">High Availability Clusters</div>
              </div>
            </div>
          </div>

          {/* TWO COLUMN ROW: DEVOPS OTA & SECURITY MONITOR (MODULE 9 & 10) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COLUMN 1: MOBILE DEVOPS & STORE RELEASE CENTER */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <Settings className="h-4.5 w-4.5 text-emerald-400" />
                  <span>{currentLanguage === "ar" ? "إدارة الإصدارات والـ OTA" : "Mobile DevOps & OTA Management"}</span>
                </h4>
                <p className="text-[11px] text-gray-400 mb-4">
                  {currentLanguage === "ar" ? "نشر وتحديث التطبيقات لاسلكياً دون الحاجة لإعادة التثبيت الكامل" : "Rollout instant over-the-air binary modifications and manage store deployment states"}
                </p>

                {/* Live Build Version List */}
                <div className="space-y-2 mb-4">
                  {devOpsMetrics.map((dev, idx) => (
                    <div
                      key={dev.version}
                      onClick={() => setSelectedVersionIndex(idx)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        selectedVersionIndex === idx 
                          ? "bg-slate-950 border-emerald-500/40 text-white" 
                          : "bg-slate-950/40 border-slate-900 text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold font-mono">{dev.version}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono capitalize ${
                          dev.otaStatus === "stable" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"
                        }`}>{dev.otaStatus}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-1.5 text-[10px] font-mono text-gray-500">
                        <div>Users: {dev.activeUsers}</div>
                        <div>Crash Free: {dev.crashFreeRate}%</div>
                        <div>Latency: {dev.apiLatencyMs}ms</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* App Cryptographic Signatures Info */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[10px] font-mono text-gray-400 mb-4">
                  <div className="text-[9px] text-gray-500 font-bold mb-1">App Code Signing Thumbprint</div>
                  <div className="truncate">{appSigningFingerprint}</div>
                </div>
              </div>

              {/* DevOps Trigger Buttons */}
              <div>
                {otaProgress !== null && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] font-mono text-emerald-400 mb-1">
                      <span>OTA Rollout Progress</span>
                      <span>{otaProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${otaProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={triggerOtaUpdate}
                    className="flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-semibold font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                    <span>Push OTA Update</span>
                  </button>
                  <button
                    onClick={() => {
                      setNotificationsLog(prev => ["Triggered automated stores compilation pipeline for Android and iOS.", ...prev]);
                      alert(currentLanguage === "ar" ? "تم تشغيل خط أنابيب البناء والتصدير للمتاجر" : "Automated Gradle & Xcode compilation pipeline executed successfully.");
                    }}
                    className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded text-xs font-mono cursor-pointer"
                  >
                    Build Stores Package
                  </button>
                </div>
              </div>

            </div>

            {/* COLUMN 2: SECURITY & THREAT MITIGATION SHIELD */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                  <span>{currentLanguage === "ar" ? "منصة أمان الهاتف وحوكمة البيانات" : "Mobile Threat Protection & Zero Trust"}</span>
                </h4>
                <p className="text-[11px] text-gray-400 mb-4">
                  {currentLanguage === "ar" ? "رصد مخاطر الأجهزة المكسورة الحماية وحوكمة التشفير والتحقق بيومترياً" : "Enforce OWASP MASVS standard, hardware-level key attestation and device fingerprint binding"}
                </p>

                {/* Active Sessions of devices */}
                <span className="text-[10px] text-gray-500 font-mono block mb-2">{currentLanguage === "ar" ? "الأجهزة النشطة المصرح لها بالهوية السيادية" : "Bound Devices Attested"}</span>
                <div className="space-y-2 mb-4">
                  {connectedDevices.map(dev => (
                    <div key={dev.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex justify-between items-center text-[11px]">
                      <div>
                        <div className="font-bold text-white">{dev.deviceModel}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          📍 {dev.location} | Sync: {dev.lastSync}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                          dev.status === "active" ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                        }`}>
                          {dev.status}
                        </span>
                        <div className="text-[9px] text-emerald-400 font-mono mt-1">Attest: {dev.securityRating}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certificate Pinning logs */}
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-900 text-[9px] font-mono text-gray-500">
                  <div className="flex justify-between text-white font-semibold mb-1 text-[10px]">
                    <span>Certificate Pinning Attestation</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <div>Domain: *.commerce.gov.sd</div>
                  <div>Digest: sha256/m94829ecda340aef129fc2301fed890ae...</div>
                </div>
              </div>

              {/* Lock devices button */}
              <button
                onClick={() => {
                  setConnectedDevices(prev =>
                    prev.map(d => d.id === "DEV-03" ? { ...d, status: "blocked" } : d)
                  );
                  setNotificationsLog(prev => ["ALERT: Suspicious root attempt detected on Mate 60. Terminal blocked.", ...prev]);
                  alert(currentLanguage === "ar" ? "تم إلغاء ترخيص الجهاز المشتبه به فوراً" : "Attestation failed. Suspicious terminal successfully blocklisted.");
                }}
                className="w-full py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-400 rounded text-xs font-semibold font-mono mt-4 cursor-pointer"
              >
                Revoke All Inactive Attestations
              </button>
            </div>

          </div>

          {/* AUDIT & SECURITY SYSTEM LOGS (MODULE 10) */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Terminal className="h-4.5 w-4.5 text-emerald-400" />
              <span>{currentLanguage === "ar" ? "دفتر تدقيق عمليات المحمول الفيدرالية" : "Sovereign Mobile Audit Console & Logs"}</span>
            </h4>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent text-[10px] font-mono text-emerald-400/90 space-y-1">
              {notificationsLog.map((log, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <span className="text-gray-500 select-none">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER METADATA REPORT PANEL */}
      <div className="mt-8 border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-mono gap-4">
        <div>
          🇸🇩 {currentLanguage === "ar" ? "وزارة التجارة والصناعة الرقمية - جمهورية السودان" : "Sovereign Government of the Republic of Sudan | Vision 2035"}
        </div>
        <div className="flex gap-3">
          <span className="text-emerald-500">✔ OWASP MASVS compliant</span>
          <span className="text-gray-700">|</span>
          <span className="text-emerald-500">✔ PostGIS PostGres Certified</span>
        </div>
      </div>

      {/* QR MODAL DIALOG PREVIEW FOR MOBILE WALLET (MODULE 2) */}
      {qrModalVisible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0b0f19] border border-slate-800 p-6 rounded-xl max-w-sm w-full text-center relative">
            <button
              onClick={() => setQrModalVisible(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h4 className="text-sm font-bold text-white mb-1">
              {currentLanguage === "ar" ? "رمز الاستجابة السريعة للتحقق اللامركزي" : "Secure Blockchain QR Attestation"}
            </h4>
            <p className="text-xs text-gray-400 mb-4">
              {currentLanguage === "ar" ? "امسح هذا الرمز بواسطة أجهزة الفحص الميداني لتأكيد سريان المستند من السجل الفيدرالي" : "Federal inspectors can scan this cryptographically signed code to verify license legitimacy"}
            </p>

            {/* High fidelity simulation of a secure government QR code */}
            <div className="bg-white p-4 rounded-xl inline-block mb-4 border-2 border-emerald-500">
              <svg width="150" height="150" viewBox="0 0 100 100">
                {/* Simulated QR block layout */}
                <rect x="0" y="0" width="30" height="30" fill="#000000" />
                <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="10" width="10" height="10" fill="#000000" />

                <rect x="70" y="0" width="30" height="30" fill="#000000" />
                <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="80" y="10" width="10" height="10" fill="#000000" />

                <rect x="0" y="70" width="30" height="30" fill="#000000" />
                <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="80" width="10" height="10" fill="#000000" />

                {/* Scattered random dots for authenticity */}
                <rect x="40" y="10" width="5" height="15" fill="#000000" />
                <rect x="50" y="5" width="10" height="5" fill="#000000" />
                <rect x="45" y="25" width="5" height="5" fill="#000000" />
                <rect x="15" y="45" width="10" height="10" fill="#000000" />
                <rect x="45" y="45" width="15" height="15" fill="#000000" />
                <rect x="80" y="45" width="10" height="10" fill="#000000" />
                <rect x="45" y="75" width="15" height="5" fill="#000000" />
                <rect x="75" y="75" width="10" height="15" fill="#000000" />
              </svg>
            </div>

            <div className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-900 mb-4 truncate">
              {walletLicenses[activeLicenseIndex].blockchainHash}
            </div>

            <button
              onClick={() => setQrModalVisible(false)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded text-xs cursor-pointer"
            >
              {currentLanguage === "ar" ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
