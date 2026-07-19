/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * National Unified Digital Services Super App Platform (NUDSSAF) v1.0.0
 * Compliance with ISO/IEC 25010, ISO 9241, WCAG 2.2 AA & TOGAF Standards
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, UserCheck, Shield, Wallet, FileText, Briefcase, Landmark, 
  MapPin, HelpCircle, PhoneCall, Bell, Search, Sparkles, LayoutDashboard, 
  QrCode, Scale, RefreshCw, Send, CheckCircle2, ChevronRight, AlertTriangle, 
  Settings, Check, Compass, Printer, BarChart3, Clock, Eye, EyeOff, 
  Volume2, Sliders, Smartphone, Lock, BookOpen, Layers,
  Upload, Trash2, Download, AlertCircle, FileImage, CheckCircle
} from "lucide-react";
import { UserRole } from "../types";
import NationalMobileEcosystem from "./NationalMobileEcosystem";

interface SovereignNationalSuperAppProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// ---------------------- TYPES & INTERFACES ----------------------

interface DigitalLicense {
  id: string;
  typeAr: string;
  typeEn: string;
  number: string;
  issuer: string;
  expiry: string;
  status: "Active" | "Expired" | "Pending Renewal";
}

interface WalletTransaction {
  id: string;
  titleAr: string;
  titleEn: string;
  amount: number;
  type: "payment" | "refund" | "topup";
  date: string;
  ref: string;
}

interface InvestorOpportunity {
  id: string;
  titleAr: string;
  titleEn: string;
  sectorAr: string;
  sectorEn: string;
  zone: string;
  capital: string;
  incentives: string;
}

interface SuperAppNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  category: "alert" | "renewal" | "success" | "recommendation";
  date: string;
}

// ---------------------- SEED DATA ----------------------

const initialLicenses: DigitalLicense[] = [
  {
    id: "LIC-88210",
    typeAr: "شهادة السجل التجاري القومي",
    typeEn: "National Commercial Register Certificate",
    number: "CR-2026-9904",
    issuer: "Ministry of Commerce & Industry",
    expiry: "2027-04-12",
    status: "Active"
  },
  {
    id: "LIC-44219",
    typeAr: "رخصة تشغيل المنشأة الصناعية الغذائية",
    typeEn: "Industrial Food Manufacturing License",
    number: "IND-2026-0043",
    issuer: "Industrial Development Authority",
    expiry: "2026-09-30",
    status: "Pending Renewal"
  },
  {
    id: "LIC-11029",
    typeAr: "ترخيص استيراد المواد الخام والآلات",
    typeEn: "Raw Materials Import Authorization License",
    number: "IMP-2025-7761",
    issuer: "Import/Export Customs Board",
    expiry: "2028-01-15",
    status: "Active"
  }
];

const initialTransactions: WalletTransaction[] = [
  {
    id: "TXN-90112",
    titleAr: "رسوم تجديد السجل التجاري السنوي",
    titleEn: "Annual Commercial Register Renewal Fee",
    amount: -45000,
    type: "payment",
    date: "2026-07-16 11:30",
    ref: "REF-COMM-994"
  },
  {
    id: "TXN-88291",
    titleAr: "رد رسوم طلب أرض استثمارية ملغى",
    titleEn: "Refund for Cancelled Land Application",
    amount: 150000,
    type: "refund",
    date: "2026-07-14 09:15",
    ref: "REF-LAND-041"
  },
  {
    id: "TXN-77261",
    titleAr: "شحن رصيد المحفظة الفيدرالية - بوابة الدفع الرقمية",
    titleEn: "Sovereign Wallet Top-Up via National Gateway",
    amount: 250000,
    type: "topup",
    date: "2026-07-12 14:00",
    ref: "REF-TOP-882"
  }
];

const investmentOpportunities: InvestorOpportunity[] = [
  {
    id: "INV-ZONE-01",
    titleAr: "مجمع الصناعات الغذائية والتحويلية المتكاملة",
    titleEn: "Integrated Agro-Processing & Food Security Hub",
    sectorAr: "صناعات زراعية وغذائية",
    sectorEn: "Agribusiness & Food Processing",
    zone: "Port Sudan Free Zone",
    capital: "$1.5M - $5.0M",
    incentives: "10-Year Tax Exemption & Zero Custom Duties"
  },
  {
    id: "INV-ZONE-02",
    titleAr: "مصنع تجميع وتوطين الآليات والجرارات الزراعية",
    titleEn: "Agricultural Machinery Assembly & Local Manufacturing",
    sectorAr: "صناعات هندسية ومعدات ثقيلة",
    sectorEn: "Heavy Engineering & Manufacturing",
    zone: "Giad Industrial City",
    capital: "$4.0M - $10.0M",
    incentives: "Subsidized Industrial Electricity & Free Land Lease"
  },
  {
    id: "INV-ZONE-03",
    titleAr: "منشأة صهر وإعادة تدوير المعادن الاستراتيجية",
    titleEn: "Strategic Metal Smelting & Eco-Recycling Complex",
    sectorAr: "صناعات معدنية وإنشائية",
    sectorEn: "Metallurgy & Construction Materials",
    zone: "El Bagair Industrial Zone",
    capital: "$2.5M - $6.0M",
    incentives: "Export Freight Support & Custom Duty Free Imports"
  }
];

const initialNotifications: SuperAppNotification[] = [
  {
    id: "NTF-01",
    titleAr: "رخصة تشغيل المنشأة الصناعية تقترب من تاريخ انتهاء الصلاحية",
    titleEn: "Your Industrial Food Manufacturing License expires in 74 days",
    category: "renewal",
    date: "2026-07-17 04:30"
  },
  {
    id: "NTF-02",
    titleAr: "توصية ذكية: فرصة استثمارية جديدة متطابقة مع اهتماماتك الاستثمارية في بورتسودان",
    titleEn: "AI Match: New agribusiness opportunity matching your investor profile",
    category: "recommendation",
    date: "2026-07-16 10:15"
  },
  {
    id: "NTF-03",
    titleAr: "تم إصدار وتوثيق شهادة السجل التجاري القومي بنجاح",
    titleEn: "Commercial Register Certificate cryptographically generated & signed",
    category: "success",
    date: "2026-07-15 13:40"
  }
];

export default function SovereignNationalSuperApp({ currentLanguage, role }: SovereignNationalSuperAppProps) {
  // App-level views: citizen, business, investor, executive dashboard, AI assistant, Settings
  const [activeTab, setActiveTab] = useState<"dashboard" | "wallet" | "services" | "investor" | "assistant" | "analytics" | "mobile-ecosystem">("mobile-ecosystem");

  // Core Data States
  const [licenses, setLicenses] = useState<DigitalLicense[]>(initialLicenses);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [notifications, setNotifications] = useState<SuperAppNotification[]>(initialNotifications);
  
  // Interactive States
  const [isIdentityVerified, setIsIdentityVerified] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [walletBalance, setWalletBalance] = useState(355000); // SDG
  const [selectedLicenseForQR, setSelectedLicenseForQR] = useState<DigitalLicense | null>(null);
  const [appointmentBranch, setAppointmentBranch] = useState("Headquarters - Khartoum");
  const [appointmentDate, setAppointmentDate] = useState("2026-07-25");
  const [appointmentTime, setAppointmentTime] = useState("10:00 AM");
  const [appointmentsList, setAppointmentsList] = useState<{ id: string; branch: string; date: string; time: string }[]>([]);
  const [complaintStore, setComplaintStore] = useState("");
  const [complaintType, setComplaintType] = useState("price_gouging");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [complaintStatus, setComplaintStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Secure evidence document file upload states
  const [evidenceFiles, setEvidenceFiles] = useState<{ id: string; name: string; size: number; type: string; progress: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Sovereign consumer complaints record storage
  const [submittedComplaints, setSubmittedComplaints] = useState<any[]>([
    {
      id: "CMP-4210",
      store: currentLanguage === "ar" ? "مخبز الوادي الفيدرالي" : "Al-Wadi Federal Bakery",
      type: "price_gouging",
      details: currentLanguage === "ar" 
        ? "بيع الخبز المدعوم خارج منافذ البيع الرسمية ومضاعفة السعر للرغيف الواحد." 
        : "Selling subsidized bread outside official retail points and doubling the unit price.",
      status: "investigating",
      createdAt: "2026-07-16 11:20",
      files: [{ name: "receipt_wheat_leak.jpg", size: 312 * 1024, type: "image/jpeg" }]
    },
    {
      id: "CMP-1084",
      store: currentLanguage === "ar" ? "مستودع الأدوية الكبرى" : "Grand Pharmaceutical Depot",
      type: "expired_goods",
      details: currentLanguage === "ar"
        ? "عرض وبيع محاليل تغذية منتهية الصلاحية منذ فبراير الماضي."
        : "Displaying and selling expired infant nutrition solutions since last February.",
      status: "resolved",
      createdAt: "2026-07-14 09:45",
      files: [{ name: "batch_expiry_photo.png", size: 1204 * 1024, type: "image/png" }]
    }
  ]);

  // Secure document processing & validation handler
  const handleFileUpload = (filesList: FileList) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    Array.from(filesList).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(currentLanguage === "ar" 
          ? `عذراً، نوع الملف [${file.name}] غير مدعوم. يرجى رفع صور JPG, PNG أو ملفات PDF فقط كدليل.`
          : `Sorry, the file type of [${file.name}] is not supported. Please upload JPG, PNG, or PDF evidence files.`);
        return;
      }
      if (file.size > maxSize) {
        alert(currentLanguage === "ar"
          ? `عذراً، حجم الملف [${file.name}] يتجاوز الحد الأقصى المسموح به (5 ميجابايت).`
          : `Sorry, the file [${file.name}] exceeds the maximum federal evidence size limit of 5MB.`);
        return;
      }

      const fileId = `EV-FILE-${Math.floor(Math.random() * 100000)}`;
      const newFileObj = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0
      };

      setEvidenceFiles(prev => [...prev, newFileObj]);

      // Simulate cryptographic scanning & secure upload progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        setEvidenceFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: currentProgress } : f));
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 120);
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setEvidenceFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Interactive QR Certificate & Registration Generator using HTML5 Canvas
  const downloadCertificateAsImage = (license: DigitalLicense) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient (Elegant deep emerald/charcoal combination representing sovereignty and security)
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGradient.addColorStop(0, "#031c13"); // Very dark emerald
    bgGradient.addColorStop(1, "#0a261a"); // Deep rich spruce
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 850);

    // Gold Ornate Border Frame
    ctx.strokeStyle = "#c5a85a"; // Classic gold color
    ctx.lineWidth = 16;
    ctx.strokeRect(24, 24, 1152, 802);

    ctx.strokeStyle = "#e2d2a4"; // Lighter gold accent inner frame
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 770);

    // Decorative Solid Gold Corner Squares
    ctx.fillStyle = "#c5a85a";
    ctx.fillRect(40, 40, 40, 40);
    ctx.fillRect(1120, 40, 40, 40);
    ctx.fillRect(40, 770, 40, 40);
    ctx.fillRect(1120, 770, 40, 40);

    // Header Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#e2d2a4";
    ctx.font = "bold 34px 'Cairo', 'Inter', sans-serif";
    ctx.fillText("جمهورية السودان • REPUBLIC OF SUDAN", 600, 105);

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px 'Cairo', 'Inter', sans-serif";
    ctx.fillText("وزارة التجارة والصناعة • MINISTRY OF COMMERCE & INDUSTRY", 600, 145);

    // Document Title
    ctx.fillStyle = "#c5a85a";
    ctx.font = "bold 42px 'Cairo', sans-serif";
    ctx.fillText("شهادة السجل التجاري والترخيص القومي المعتمد", 600, 235);
    ctx.font = "bold 26px 'Inter', sans-serif";
    ctx.fillText("OFFICIAL COMMERCE REGISTRATION CERTIFICATE", 600, 275);

    // Horizontal Separator
    ctx.strokeStyle = "rgba(197, 168, 90, 0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, 315);
    ctx.lineTo(1080, 315);
    ctx.stroke();

    // Watermark Seal Outline
    ctx.fillStyle = "rgba(197, 168, 90, 0.07)";
    ctx.beginPath();
    ctx.arc(600, 500, 160, 0, Math.PI * 2);
    ctx.fill();

    // Details Grid Columns - Left (Arabic), Right (English)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 21px 'Cairo', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`نوع الترخيص: ${license.typeAr}`, 520, 390);
    ctx.fillText(`الرقم الفيدرالي الموحد: ${license.number}`, 520, 450);
    ctx.fillText(`الجهة المصدرة: ${license.issuer}`, 520, 510);
    ctx.fillText(`تاريخ الصلاحية والانتهاء: ${license.expiry}`, 520, 570);
    ctx.fillText(`الحالة الأمنية: نشط معتمد رقمياً`, 520, 630);

    ctx.textAlign = "left";
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillText(`License Type: ${license.typeEn}`, 680, 390);
    ctx.fillText(`Federal Identity ID: ${license.number}`, 680, 450);
    ctx.fillText(`Authority: ${license.issuer}`, 680, 510);
    ctx.fillText(`Expiration Limit: ${license.expiry}`, 680, 570);
    ctx.fillText(`Sovereign Status: SECURE VALIDATED`, 680, 630);

    // Center QR Block with Golden Core
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(525, 415, 150, 150);
    ctx.fillStyle = "#031c13";
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        if ((r % 2 === 0 && c % 3 === 0) || r < 3 || c < 3 || r > 10 || c > 10) {
          ctx.fillRect(535 + c * 9.5, 425 + r * 9.5, 7.5, 7.5);
        }
      }
    }
    // QR Core Seal
    ctx.fillStyle = "#c5a85a";
    ctx.fillRect(588, 478, 24, 24);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SD", 600, 494);

    // Footnote Details
    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 15px 'Cairo', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("هذه شهادة مبرمة إلكترونياً ومسجلة في قواعد البيانات السيادية ولا تحتاج لتوقيع ورقي لإنفاذها.", 600, 715);
    ctx.fillText("This document is cryptographically signed. Immediate verification is persistent in federal ledgers.", 600, 740);

    // Download Link Click
    const link = document.createElement("a");
    link.download = `SD-CERT-${license.number}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // AI Assistant States
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: currentLanguage === "ar" 
        ? "مرحباً بك في المساعد الفيدرالي الذكي لجمهورية السودان. كيف يمكنني إرشادك اليوم في خدمات التراخيص، الاستثمار، السجلات التجارية، أو المشتريات؟"
        : "Welcome to the Sovereign Digital Government Assistant of Sudan. How may I assist you today regarding licensing, commerce, investments, or procurement?"
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Accessibility State (within-component)
  const [textSize, setTextSize] = useState<"normal" | "large" | "extra">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [voiceNavigation, setVoiceNavigation] = useState(false);

  // Digital Wallet Simulation
  const [payAmount, setPayAmount] = useState("");
  const [payDesc, setPayDesc] = useState("");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");

  // Workflow Wizard State
  const [workflowStep, setWorkflowStep] = useState(1);
  const [businessNameInputAr, setBusinessNameInputAr] = useState("");
  const [businessNameInputEn, setBusinessNameInputEn] = useState("");
  const [businessSector, setBusinessSector] = useState("Agribusiness");
  const [businessCapital, setBusinessCapital] = useState("5,000,000");

  // AI Assistant responses database
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentMsg = userInput;
    setChatHistory(prev => [...prev, { sender: "user", text: currentMsg }]);
    setUserInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      const query = currentMsg.toLowerCase();

      if (query.includes("سجل") || query.includes("register") || query.includes("commercial")) {
        aiText = currentLanguage === "ar"
          ? "توجيهات السجل التجاري: يمكنك حجز الاسم التجاري وبدء التأسيس رقمياً بالكامل عبر بوابة الخدمات التابعة للمنصة. يتطلب الأمر بطاقة هوية وطنية سارية المفعول وإثبات رأس المال الفيدرالي."
          : "Commercial Register: You can reserve commercial names and complete corporate incorporation fully online. It requires an active national ID and proof of authorized capital deposit.";
      } else if (query.includes("تجديد") || query.includes("renew") || query.includes("license")) {
        aiText = currentLanguage === "ar"
          ? "تنبيه التجديد: رخصة المنشأة الغذائية الخاصة بك (IND-2026-0043) ستنتهي قريباً. لقد حددنا الرسوم المطلوبة بمبلغ 45,000 جنيه سوداني. هل تود سدادها الآن عبر محفظتك الرقمية؟"
          : "Renewal Notice: Your industrial license (IND-2026-0043) is expiring. The renewal fee is assessed at 45,000 SDG. Would you like to execute payment via your sovereign digital wallet?";
      } else if (query.includes("استثمار") || query.includes("invest") || query.includes("zone")) {
        aiText = currentLanguage === "ar"
          ? "فرص الاستثمار القومية: لقد حددنا تطابقاً بنسبة %98 مع اهتمامك بالصناعات الغذائية في منطقة بورتسودان الحرة. تقدم الدولة إعفاءً ضريبياً كاملاً لمدة 10 سنوات."
          : "Investment Alignment: We identified a 98% match for food processing infrastructure in the Port Sudan Free Zone. Benefits include a 10-year corporate tax holiday.";
      } else {
        aiText = currentLanguage === "ar"
          ? "لقد استقبلت استفسارك بعناية. بصفتي مساعدك الرقمي الحكومي الموحد، أنا مسخر لتسهيل كافة الخدمات التجارية والاستثمارية. يرجى مراجعة بوابات الدليل أو اختيار خطوة سريعة."
          : "I have received your request. As your unified digital government assistant, I am optimized to streamline all corporate and investment operations. Please browse our portal directories for direct actions.";
      }

      setChatHistory(prev => [...prev, { sender: "ai", text: aiText }]);
      setIsTyping(false);
    }, 1200);
  };

  // Handle simulated wallet payment
  const handleWalletPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(payAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > walletBalance) return;

    setPaymentState("processing");
    setTimeout(() => {
      setWalletBalance(prev => prev - parsedAmount);
      const newTxn: WalletTransaction = {
        id: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
        titleAr: payDesc || "رسوم معاملة حكومية سيادية",
        titleEn: payDesc || "Sovereign Digital Government Transaction Fee",
        amount: -parsedAmount,
        type: "payment",
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        ref: `REF-PAY-${Math.floor(Math.random() * 900) + 100}`
      };
      setTransactions([newTxn, ...transactions]);
      
      // Add success notification
      const newNtf: SuperAppNotification = {
        id: `NTF-${Math.floor(Math.random() * 1000)}`,
        titleAr: `تم سداد مبلغ ${parsedAmount} ج.س بنجاح عبر المحفظة`,
        titleEn: `Sovereign payment of ${parsedAmount} SDG completed successfully`,
        category: "success",
        date: new Date().toISOString().replace("T", " ").substring(0, 16)
      };
      setNotifications([newNtf, ...notifications]);

      setPayAmount("");
      setPayDesc("");
      setPaymentState("success");
      setTimeout(() => setPaymentState("idle"), 2500);
    }, 1500);
  };

  // Handle appointment scheduling
  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = {
      id: `APP-${Math.floor(Math.random() * 9000) + 1000}`,
      branch: appointmentBranch,
      date: appointmentDate,
      time: appointmentTime
    };
    setAppointmentsList([newAppointment, ...appointmentsList]);
    
    // Alert Notification
    const newNtf: SuperAppNotification = {
      id: `NTF-${Math.floor(Math.random() * 1000)}`,
      titleAr: `تم حجز موعد مقابلة بنجاح في فرع: ${appointmentBranch}`,
      titleEn: `Appointment confirmed at branch: ${appointmentBranch}`,
      category: "success",
      date: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setNotifications([newNtf, ...notifications]);
  };

  // Submit consumer protection complaint
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintStore || !complaintDetails) return;
    setComplaintStatus("submitting");

    setTimeout(() => {
      const newComp = {
        id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
        store: complaintStore,
        type: complaintType,
        details: complaintDetails,
        status: "new",
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        files: [...evidenceFiles]
      };
      setSubmittedComplaints(prev => [newComp, ...prev]);

      setComplaintStatus("success");
      setComplaintStore("");
      setComplaintDetails("");
      setEvidenceFiles([]); // Clear file list
      
      // Notification
      const newNtf: SuperAppNotification = {
        id: `NTF-${Math.floor(Math.random() * 1000)}`,
        titleAr: `تم قيد الشكوى ضد [${complaintStore}] بنجاح وإرفاق الأدلة البصرية لفرق التفتيش الفيدرالية`,
        titleEn: `Complaint against [${complaintStore}] successfully lodged with ${evidenceFiles.length} evidence attachment(s)`,
        category: "alert",
        date: new Date().toISOString().replace("T", " ").substring(0, 16)
      };
      setNotifications([newNtf, ...notifications]);
      setTimeout(() => setComplaintStatus("idle"), 3000);
    }, 1200);
  };

  // Commercial register wizard setup
  const handleWorkflowNext = () => {
    if (workflowStep < 4) {
      setWorkflowStep(prev => prev + 1);
    } else {
      // Create new license / certificate
      const newLic: DigitalLicense = {
        id: `LIC-${Math.floor(Math.random() * 90000) + 10000}`,
        typeAr: businessNameInputAr || "سجل تجاري وطني جديد",
        typeEn: businessNameInputEn || "New Commercial Registration",
        number: `CR-2026-${Math.floor(Math.random() * 9000) + 1000}`,
        issuer: "Ministry of Commerce & Industry",
        expiry: "2027-07-17",
        status: "Active"
      };
      setLicenses([newLic, ...licenses]);
      
      // Wallet deduction for registration fee
      setWalletBalance(prev => prev - 75000);
      const feeTxn: WalletTransaction = {
        id: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
        titleAr: `رسوم تأسيس سجل تجاري: ${businessNameInputAr}`,
        titleEn: `Incorporation registration fee: ${businessNameInputEn}`,
        amount: -75000,
        type: "payment",
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        ref: "REF-CR-WIZARD"
      };
      setTransactions([feeTxn, ...transactions]);

      setWorkflowStep(1);
      setBusinessNameInputAr("");
      setBusinessNameInputEn("");
      setActiveTab("dashboard");
    }
  };

  // Font class dynamic map
  const textClass = textSize === "large" ? "text-lg" : textSize === "extra" ? "text-xl" : "text-sm";
  const labelClass = textSize === "large" ? "text-base" : textSize === "extra" ? "text-lg" : "text-xs";
  const titleClass = textSize === "large" ? "text-2xl" : textSize === "extra" ? "text-3xl" : "text-xl";

  return (
    <div className={`space-y-6 ${highContrast ? "bg-slate-950 text-white border-2 border-amber-400" : ""}`} id="sovereign-super-app-wrapper">
      
      {/* Super App Premium Master Header Card */}
      <div className={`bg-gradient-to-r ${highContrast ? "from-black to-slate-900 text-white border-b-2 border-amber-400" : "from-emerald-950 via-teal-900 to-slate-950 text-white"} p-6 rounded-2xl shadow-xl relative overflow-hidden`} id="superapp-head-banner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30 font-mono tracking-wider">
                NUDSSAF COMPLIANT v1.0
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-500/30 flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-indigo-400" />
                SECURE SIGN-ON ACTIVE
              </span>
            </div>
            <h1 className={`${titleClass} font-bold tracking-tight mb-2`} style={{ fontFamily: "var(--font-arabic)" }}>
              {currentLanguage === "ar" ? "بوابة الخدمات الرقمية الفيدرالية الموحدة (السودان الرقمي)" : "Sovereign Unified Digital Services Platform (Digital Sudan)"}
            </h1>
            <p className="text-teal-100/80 text-xs md:text-sm max-w-4xl">
              {currentLanguage === "ar" 
                ? "تطبيق الخدمات الوطني الموحد للمواطنين والشركات والمستثمرين؛ لتيسير معاملات السجلات، التفتيش، رخص التشغيل، المحفظة الرقمية المدعومة، ووكيل الاستثمار الذكي في نافذة رقمية حكومية واحدة."
                : "The single national digital gateway providing seamless government services, digital identity authorization, decentralized document vault, commercial licenses, state payment reconciliation, and intelligent investor matches."}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-teal-950/80 p-3 rounded-xl border border-emerald-800 self-stretch md:self-auto justify-center">
            <UserCheck className="w-10 h-10 text-emerald-400" />
            <div className="text-right font-mono text-xs">
              <div className="text-teal-300">{currentLanguage === "ar" ? "الهوية الرقمية الموحدة" : "Sovereign Digital ID"}</div>
              <div className="text-xs font-bold text-white uppercase">{role.replace("_", " ")}</div>
            </div>
          </div>
        </div>

        {/* Super App Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-teal-800 pt-4 relative z-10" id="superapp-tabs">
          {[
            { id: "mobile-ecosystem", labelAr: "📱 منظومة الهاتف ومحفظة الهوية الرقمية", labelEn: "📱 National Mobile Government Platform", icon: Smartphone },
            { id: "dashboard", labelAr: "الحساب والمستندات الرقمية", labelEn: "Wallet & Document Vault", icon: LayoutDashboard },
            { id: "services", labelAr: "الخدمات وتأسيس الأعمال", labelEn: "Citizen & Business Portal", icon: Briefcase },
            { id: "wallet", labelAr: "المحفظة والجباية الحكومية", labelEn: "Sovereign Wallet & Pay", icon: Wallet },
            { id: "investor", labelAr: "بوابة المستثمر والمناطق الحرة", labelEn: "Sovereign Investor Portal", icon: Landmark },
            { id: "assistant", labelAr: "المساعد الحكومي الفيدرالي AI", labelEn: "AI Federal Assistant", icon: Sparkles },
            { id: "analytics", labelAr: "لوحة مؤشرات التبني والتحول", labelEn: "National Adoption Index", icon: BarChart3 }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg font-bold border border-emerald-500" 
                    : "bg-slate-950/40 text-slate-300 hover:bg-slate-900/60 hover:text-white border border-slate-800"
                }`}
              >
                <IconComponent className="w-4 h-4 text-emerald-400" />
                <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 150 }}
        >
          {activeTab === "mobile-ecosystem" && (
            <NationalMobileEcosystem currentLanguage={currentLanguage} role={role} />
          )}

          {/* TAB 1: PERSONAL DIGITAL DASHBOARD & DOCUMENT WALLET */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="superapp-personal-dash">
              {/* Left Column: Digital Wallet & Wallet Balance */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* User Info & Identity Status Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "أهلاً بك، أسامة عمر محمد" : "Welcome back, Osama Omer Mohamed"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "الرقم الفيدرالي القومي الموحد: SD-4012-9921" : "Unified National Citizen Registry Number: SD-4012-9921"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 font-semibold">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {currentLanguage === "ar" ? "مفعل بالبصمة الحيوية" : "Biometrically Verified"}
                    </span>
                    <button
                      onClick={() => setMfaEnabled(!mfaEnabled)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-200 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span>{mfaEnabled ? "MFA On" : "MFA Off"}</span>
                    </button>
                  </div>
                </div>

                {/* Digital Document Wallet Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "محفظة المستندات والتراخيص الرقمية الموثقة" : "Sovereign Digital Document Wallet"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {currentLanguage === "ar" ? "استعرض مستندات السجل والتراخيص الصناعية الصادرة بصيغة مشفرة مع إمكانية التحقق دون اتصال عبر الـ QR" : "Store, download, or cryptographically verify certificates and permit templates locally"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {licenses.map((lic) => (
                      <div key={lic.id} className="p-4 rounded-xl bg-slate-50 border border-gray-100 flex flex-col justify-between gap-3 relative overflow-hidden">
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] text-gray-400">[{lic.number}]</span>
                          <h4 className="font-bold text-slate-900 text-xs" style={{ fontFamily: "var(--font-arabic)" }}>
                            {currentLanguage === "ar" ? lic.typeAr : lic.typeEn}
                          </h4>
                          <span className="text-[10px] text-gray-400 block">{lic.issuer}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                          <span className={`text-[10px] font-bold ${
                            lic.status === "Active" ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            {lic.status === "Active" ? "● ACTIVE" : "● RENEWAL REQ"}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedLicenseForQR(lic)}
                              className="p-1.5 bg-slate-200/60 hover:bg-slate-200 rounded text-slate-700 cursor-pointer text-xs flex items-center gap-1"
                              title="Show QR"
                            >
                              <QrCode className="w-4 h-4 text-emerald-800" />
                              <span>{currentLanguage === "ar" ? "تحقق" : "Verify"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scheduled Appointments Grid */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "مواعيدي وجدول الاستشارات الافتراضية" : "My Scheduled Appointments"}
                    </h3>
                  </div>

                  {appointmentsList.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      {currentLanguage === "ar" ? "لا توجد مواعيد نشطة محجوزة حالياً. استخدم علامة تبويب الخدمات لحجز موعد." : "No current active appointments found. Schedule your branch or virtual consultation below."}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {appointmentsList.map((app) => (
                        <div key={app.id} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-emerald-950 block">{app.branch}</span>
                            <span className="text-gray-500 block text-[10px]">{app.date} | {app.time}</span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                            CONFIRMED
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Side: Smart Notifications Feed & Quick Settings */}
              <div className="space-y-6">
                
                {/* Personal Digital Wallet Balance Quick Glance */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-900 shadow-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-400 font-bold tracking-wider">{currentLanguage === "ar" ? "المحفظة الرقمية الفيدرالية" : "SOVEREIGN WALLET"}</span>
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block font-mono">{currentLanguage === "ar" ? "الرصيد المتاح للاستخدام" : "AVAILABLE CONVERTIBLE BALANCE"}</span>
                    <span className="text-3xl font-bold font-mono text-white">{walletBalance.toLocaleString()} <span className="text-xs">SDG</span></span>
                  </div>
                  <div className="pt-2 border-t border-emerald-900/60 flex justify-between items-center text-xs text-teal-300">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      {currentLanguage === "ar" ? "جاهز لـ CBDC الرقمي" : "Digital CBDC Ready"}
                    </span>
                    <button onClick={() => setActiveTab("wallet")} className="text-white font-bold hover:underline flex items-center gap-0.5">
                      {currentLanguage === "ar" ? "سداد رسوم" : "Pay Fees"} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Smart Real-time Notifications */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                    <Bell className="w-4.5 h-4.5 text-emerald-600" />
                    <span>{currentLanguage === "ar" ? "التنبيهات الفيدرالية الذكية" : "Smart Sovereign Notifications"}</span>
                  </h3>

                  <div className="space-y-3">
                    {notifications.map((ntf) => (
                      <div key={ntf.id} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            ntf.category === "renewal" ? "bg-amber-100 text-amber-800" : ntf.category === "success" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {ntf.category}
                          </span>
                          <span className="text-gray-400 text-[9px] font-mono">{ntf.date}</span>
                        </div>
                        <p className="text-slate-900 font-semibold" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? ntf.titleAr : ntf.titleEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Portal Accessibility Panel */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200/60 space-y-4">
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                    <Sliders className="w-4.5 h-4.5 text-emerald-600" />
                    <span>{currentLanguage === "ar" ? "تخصيص الوصول الشامل (WCAG 2.2)" : "Universal Accessibility (WCAG 2.2)"}</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-gray-500 block mb-1.5">{currentLanguage === "ar" ? "حجم الخط الفيدرالي" : "Portal Text Size Scale"}</span>
                      <div className="flex gap-2">
                        {["normal", "large", "extra"].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setTextSize(sz as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              textSize === sz 
                                ? "bg-emerald-600 text-white border-emerald-500" 
                                : "bg-white text-slate-700 border-gray-300 hover:bg-slate-100"
                            }`}
                          >
                            {sz.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                      <span>{currentLanguage === "ar" ? "تباين عالي للرؤية" : "High Contrast Display"}</span>
                      <button
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${highContrast ? "bg-emerald-600" : "bg-gray-300"}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform transform ${highContrast ? "translate-x-4" : ""}`} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>{currentLanguage === "ar" ? "التوجيه الصوتي للخدمات" : "Voice Navigation Engine"}</span>
                      <button
                        onClick={() => setVoiceNavigation(!voiceNavigation)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${voiceNavigation ? "bg-emerald-600" : "bg-gray-300"}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform transform ${voiceNavigation ? "translate-x-4" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* QR Verification Modal */}
              {selectedLicenseForQR && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-100">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-900 text-xs font-mono">{selectedLicenseForQR.number}</span>
                      <button onClick={() => setSelectedLicenseForQR(null)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? selectedLicenseForQR.typeAr : selectedLicenseForQR.typeEn}
                    </h4>

                    <div className="bg-slate-50 p-6 rounded-xl flex justify-center">
                      {/* High-fidelity Mock QR */}
                      <div className="w-48 h-48 bg-white border border-gray-200 p-3 rounded-lg flex flex-col justify-between items-center relative">
                        <div className="grid grid-cols-6 gap-1 w-full h-full opacity-90">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`rounded-sm ${
                                (i % 2 === 0 && i % 3 === 0) || i < 6 || i % 7 === 0 || i > 30 ? "bg-slate-900" : "bg-slate-100"
                              }`} 
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                            SECURE VERIFIED
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      {currentLanguage === "ar"
                        ? "أبرز رمز الـ QR لمفتشي الوزارة للتحقق اللحظي المشفر دون الحاجة للاتصال بالإنترنت."
                        : "Scan this cryptographically signed QR code for instant offline verification via inspector tools."}
                    </p>

                    <button
                      onClick={() => downloadCertificateAsImage(selectedLicenseForQR)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-amber-500/40"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>
                        {currentLanguage === "ar"
                          ? "تحميل الشهادة الرسمية المشفرة (PNG)"
                          : "Download Secured Certificate (PNG)"}
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedLicenseForQR(null)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "إغلاق النافذة" : "Close Certificate"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CITIZEN & BUSINESS SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6" id="superapp-services-tab">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Action Area: Commercial Registration Wizard */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "منظومة تسجيل وتأسيس الشركات الرقمية" : "Sovereign Digital Corporate Registration Platform"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "دليل مبسط ومؤتمت من 4 خطوات لتأسيس منشأة تجارية جديدة وسداد رسومها الفيدرالية بشكل آمن" : "Unified declarative workflow engine for instant business reservation, signing, and registration"}
                    </p>
                  </div>

                  {/* Wizard Step Progress Tracker */}
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-gray-100">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                          workflowStep >= step ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}>
                          {step}
                        </div>
                        <span className="hidden sm:inline text-[10px] font-bold text-gray-500">
                          {step === 1 && (currentLanguage === "ar" ? "حجز الاسم" : "Name Reservation")}
                          {step === 2 && (currentLanguage === "ar" ? "بيانات النشاط" : "Business Profile")}
                          {step === 3 && (currentLanguage === "ar" ? "التوقيع الرقمي" : "E-Signature")}
                          {step === 4 && (currentLanguage === "ar" ? "تأكيد السداد" : "Escrow Payment")}
                        </span>
                        {step < 4 && <div className="hidden sm:block w-8 h-px bg-gray-300" />}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Name Reservation */}
                  {workflowStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className={`${labelClass} text-slate-700 block`}>{currentLanguage === "ar" ? "الاسم التجاري المقترح (بالعربية)" : "Proposed Name (Arabic)"}</label>
                          <input
                            type="text"
                            value={businessNameInputAr}
                            onChange={(e) => setBusinessNameInputAr(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                            placeholder="مثال: شركة سنار للاستثمارات الغذائية المحدودة"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={`${labelClass} text-slate-700 block`}>{currentLanguage === "ar" ? "الاسم التجاري المقترح (بالإنجليزي)" : "Proposed Name (English)"}</label>
                          <input
                            type="text"
                            value={businessNameInputEn}
                            onChange={(e) => setBusinessNameInputEn(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                            placeholder="e.g. Sennar Food Investments Ltd."
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex items-start gap-2 text-xs text-emerald-800">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>
                          {currentLanguage === "ar"
                            ? "يقوم الذكاء الاصطناعي الآن بمسح قاعدة البيانات الوطنية ومطابقتها للتأكد من عدم وجود أسماء مشابهة أو مسجلة مسبقاً لضمان عدم رفض الطلب."
                            : "Real-time AI matching check scans federal records to verify uniqueness and prevent namespace overlap."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Business Profile */}
                  {workflowStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="text-gray-600 block">{currentLanguage === "ar" ? "القطاع التجاري" : "Industrial / Commercial Sector"}</label>
                          <select
                            value={businessSector}
                            onChange={(e) => setBusinessSector(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                          >
                            <option value="Agribusiness">Agribusiness & Food Safety</option>
                            <option value="Logistics">Sovereign Freight & Logistics</option>
                            <option value="Import/Export">Trading & Import/Export</option>
                            <option value="Technology">Technology & Cloud Infrastructure</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-gray-600 block">{currentLanguage === "ar" ? "رأس المال المقترح (جنيه سوداني)" : "Authorized Capital (SDG)"}</label>
                          <input
                            type="text"
                            value={businessCapital}
                            onChange={(e) => setBusinessCapital(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Electronic Signature */}
                  {workflowStep === 3 && (
                    <div className="space-y-4 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-slate-50">
                      <Lock className="w-12 h-12 text-indigo-600 mx-auto" />
                      <h4 className="font-bold text-gray-900 text-sm">{currentLanguage === "ar" ? "التوقيع الرقمي الفيدرالي المؤمن" : "Sovereign Digital Cryptographic Signature"}</h4>
                      <p className="text-xs text-gray-400 max-w-md mx-auto">
                        {currentLanguage === "ar"
                          ? "بالنقر على المتابعة، يتم توقيع عقد التأسيس رقمياً باستخدام بطاقة الهوية الرقمية ومفتاح التعمية الخاص بك."
                          : "By proceeding, your corporate charter is cryptographically signed using your private identity keys."}
                      </p>
                    </div>
                  )}

                  {/* Step 4: Escrow Fee Confirmation */}
                  {workflowStep === 4 && (
                    <div className="space-y-4 text-xs bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-950 text-sm border-b border-emerald-200/50 pb-2">
                        {currentLanguage === "ar" ? "ملخص رسوم التأسيس والتسجيل" : "Corporate Incorporation Fees Ledger"}
                      </h4>
                      <div className="space-y-2 text-emerald-950">
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "الاسم التجاري المقترح:" : "Proposed Business Name:"}</span>
                          <span className="font-mono font-bold">{businessNameInputEn || "Sennar Food Ltd."}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "رسوم حجز الاسم والتصديق السنوي:" : "Name Reservation & Audit Fee:"}</span>
                          <span className="font-mono">45,000 SDG</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{currentLanguage === "ar" ? "رسوم التوثيق وتوليد الـ QR الموثق:" : "Sovereign QR Cryptographic Fee:"}</span>
                          <span className="font-mono">30,000 SDG</span>
                        </div>
                        <div className="flex justify-between border-t border-emerald-200 pt-2 text-sm font-bold">
                          <span>{currentLanguage === "ar" ? "إجمالي المبلغ المطلوب خصمه:" : "Total Registration Balance due:"}</span>
                          <span className="font-mono">75,000 SDG</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    {workflowStep > 1 && (
                      <button
                        onClick={() => setWorkflowStep(prev => prev - 1)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "السابق" : "Back"}
                      </button>
                    )}
                    <button
                      onClick={handleWorkflowNext}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {workflowStep === 4 ? (currentLanguage === "ar" ? "سداد وتأسيس السجل" : "Pay & Incorporate") : (currentLanguage === "ar" ? "المتابعة" : "Next Step")}
                    </button>
                  </div>

                </div>

                {/* Right Side: Consumer Protection Complaints & Appointments */}
                <div className="space-y-6 text-xs">
                  
                  {/* Consumer Protection form */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                      <Scale className="w-4.5 h-4.5 text-emerald-600" />
                      <span>{currentLanguage === "ar" ? "تقديم شكوى حماية المستهلك" : "Sovereign Consumer Protection"}</span>
                    </h3>

                    <form onSubmit={handleComplaintSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-gray-500 block">{currentLanguage === "ar" ? "اسم المنشأة أو المحل التجاري" : "Accused Merchant / Store Name"}</label>
                        <input
                          type="text"
                          required
                          value={complaintStore}
                          onChange={(e) => setComplaintStore(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                          placeholder="مثال: مخبز الأمانة الفيدرالي"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-500 block">{currentLanguage === "ar" ? "نوع المخالفة المرصودة" : "Violation Classification"}</label>
                        <select
                          value={complaintType}
                          onChange={(e) => setComplaintType(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                        >
                          <option value="price_gouging">{currentLanguage === "ar" ? "رفع الأسعار بشكل احتكاري" : "Monopoly / Price Gouging"}</option>
                          <option value="expired_goods">{currentLanguage === "ar" ? "سلع منتهية الصلاحية" : "Expired / Dangerous Goods"}</option>
                          <option value="counterfeit">{currentLanguage === "ar" ? "منتجات مقلدة أو تفتقر للجودة" : "Counterfeit / Low Quality"}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-500 block">{currentLanguage === "ar" ? "تفاصيل الشكوى" : "Complaint Description"}</label>
                        <textarea
                          required
                          value={complaintDetails}
                          onChange={(e) => setComplaintDetails(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-gray-200 rounded-xl h-20"
                          placeholder="..."
                        />
                      </div>

                      {/* Premium Secure Drag-and-Drop Evidence File Uploader */}
                      <div className="space-y-1.5">
                        <label className="text-gray-500 block flex items-center justify-between">
                          <span>{currentLanguage === "ar" ? "إرفاق مستندات أو صور الإثبات" : "Attach Proof, Photos, or PDFs"}</span>
                          <span className="text-[10px] text-slate-400">({currentLanguage === "ar" ? "أقصى حجم: 5MB" : "Max 5MB"})</span>
                        </label>
                        
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              handleFileUpload(e.dataTransfer.files);
                            }
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                            isDragging 
                              ? "border-rose-500 bg-rose-50/50" 
                              : "border-gray-200 hover:border-slate-300 bg-slate-50"
                          }`}
                          onClick={() => document.getElementById("evidence-input")?.click()}
                        >
                          <input
                            type="file"
                            id="evidence-input"
                            multiple
                            accept=".pdf, .jpg, .jpeg, .png"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleFileUpload(e.target.files);
                              }
                            }}
                          />
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1 animate-pulse" />
                          <p className="font-semibold text-[11px] text-slate-700">
                            {currentLanguage === "ar" ? "اسحب الأدلة والمستندات هنا أو اضغط للاختيار" : "Drag files here or click to browse"}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF</p>
                        </div>

                        {/* List of active evidence files */}
                        {evidenceFiles.length > 0 && (
                          <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto pr-1">
                            {evidenceFiles.map((file) => (
                              <div key={file.id} className="p-2 bg-white rounded-lg border border-gray-100 flex items-center justify-between text-[11px] space-x-2">
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  {file.type.includes("pdf") ? (
                                    <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  ) : (
                                    <FileImage className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                  )}
                                  <span className="truncate text-slate-700 font-medium" title={file.name}>{file.name}</span>
                                  <span className="text-gray-400 text-[10px] shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {file.progress < 100 ? (
                                    <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                      <div className="bg-emerald-600 h-full transition-all" style={{ width: `${file.progress}%` }} />
                                    </div>
                                  ) : (
                                    <span className="text-emerald-600 font-bold text-[9px] flex items-center gap-0.5">
                                      <CheckCircle className="w-3 h-3" /> SECURE
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveFile(file.id);
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded text-rose-500 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={complaintStatus === "submitting"}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1 mt-2"
                      >
                        {complaintStatus === "submitting" ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>SUBMITTING COMPLAINT...</span>
                          </>
                        ) : complaintStatus === "success" ? (
                          <span>✓ شكوى مسجلة بنجاح!</span>
                        ) : (
                          <span>{currentLanguage === "ar" ? "إرسال الشكوى الفوري" : "Register Violation Alert"}</span>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Dynamic submitted complaints tracker list */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center justify-between" style={{ fontFamily: "var(--font-arabic)" }}>
                      <span className="flex items-center gap-1.5">
                        <Scale className="w-4.5 h-4.5 text-rose-600" />
                        <span>{currentLanguage === "ar" ? "سجل شكاواي والرقابة الشعبية" : "My Lodged Complaints & Evidence"}</span>
                      </span>
                      <span className="bg-slate-100 text-slate-800 font-mono px-2 py-0.5 rounded text-[10px]">
                        {submittedComplaints.length}
                      </span>
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {submittedComplaints.map((comp) => (
                        <div key={comp.id} className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-2 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-slate-400 font-bold">[{comp.id}]</span>
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                              comp.status === "resolved" 
                                ? "bg-emerald-100 text-emerald-800" 
                                : comp.status === "investigating" 
                                  ? "bg-amber-100 text-amber-800" 
                                  : "bg-blue-100 text-blue-800"
                            }`}>
                              {comp.status === "resolved" 
                                ? (currentLanguage === "ar" ? "تم الإنفاذ والحل" : "Resolved & Enforced")
                                : comp.status === "investigating"
                                  ? (currentLanguage === "ar" ? "قيد التحقيق الفيدرالي" : "Federal Investigation")
                                  : (currentLanguage === "ar" ? "جديد / قيد الفرز" : "New / Reviewing")}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-900 text-[11.5px]" style={{ fontFamily: "var(--font-arabic)" }}>
                              {comp.store}
                            </h4>
                            <p className="text-slate-500 mt-1 leading-relaxed">{comp.details}</p>
                          </div>

                          {/* Evidence list in the submitted complaints list */}
                          {comp.files && comp.files.length > 0 && (
                            <div className="pt-2 border-t border-gray-200/50 space-y-1">
                              <span className="text-[10px] text-slate-400 font-bold block">{currentLanguage === "ar" ? "المستندات والأدلة المرفقة:" : "Attached Evidence Documents:"}</span>
                              <div className="flex flex-wrap gap-1.5">
                                {comp.files.map((file: any, fIdx: number) => (
                                  <div key={fIdx} className="bg-white border border-gray-200 px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] text-slate-600">
                                    <FileText className="w-3 h-3 text-rose-500" />
                                    <span className="truncate max-w-[120px]" title={file.name}>{file.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <span className="text-gray-400 block text-[9px] text-right font-mono">{comp.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Branch Appointment Scheduling */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                      <Clock className="w-4.5 h-4.5 text-emerald-600" />
                      <span>{currentLanguage === "ar" ? "حجز موعد أو استشارة مرئية" : "Appointment & Virtual Consulting"}</span>
                    </h3>

                    <form onSubmit={handleScheduleAppointment} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-gray-500 block">{currentLanguage === "ar" ? "موقع المقابلة أو الفرع" : "Consultation Target"}</label>
                        <select
                          value={appointmentBranch}
                          onChange={(e) => setAppointmentBranch(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                        >
                          <option value="Headquarters - Khartoum">Headquarters - Khartoum</option>
                          <option value="Port Sudan Port Branch">Port Sudan Port Office</option>
                          <option value="El Bagair Industrial Office">El Bagair Office</option>
                          <option value="Virtual Video Link - Microsoft Teams">Virtual Consultation (Video Link)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-gray-500 block">{currentLanguage === "ar" ? "التاريخ" : "Select Date"}</label>
                          <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-gray-200 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-500 block">{currentLanguage === "ar" ? "الوقت" : "Select Time"}</label>
                          <select
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-gray-200 rounded-xl"
                          >
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="02:00 PM">02:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تأكيد حجز الموعد" : "Schedule Consultation"}
                      </button>
                    </form>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: SOVEREIGN PAYMENT GATEWAY & FINANCIAL HISTORY */}
          {activeTab === "wallet" && (
            <div className="space-y-6" id="superapp-wallet-tab">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Unified Wallet Payments Interface */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 text-xs">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "بوابة الدفع والجباية الفيدرالية المؤمنة" : "Sovereign Electronic Settlement & Payment"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "سداد رسوم العطاءات، التراخيص السنوية، والضرائب عبر رصيد المحفظة مع تسوية فورية للقيود في وزارة المالية" : "Execute government fee settlements, certificates, and escrow balances instantly"}
                    </p>
                  </div>

                  <form onSubmit={handleWalletPayment} className="space-y-4 max-w-lg">
                    <div className="space-y-1.5">
                      <label className="text-gray-600 block">{currentLanguage === "ar" ? "نوع المعاملة أو وصف الرسوم" : "Sovereign Fee Category / Purpose"}</label>
                      <input
                        type="text"
                        required
                        value={payDesc}
                        onChange={(e) => setPayDesc(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl"
                        placeholder="مثال: رسوم تجديد رخصة المنشأة IND-2026-0043"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-600 block">{currentLanguage === "ar" ? "قيمة المبلغ المطلوب سداده (جنيه سوداني)" : "Payment Value amount (SDG)"}</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl font-mono text-base font-bold pr-12"
                          placeholder="45000"
                        />
                        <span className="absolute right-3 top-3 text-gray-400 font-bold">SDG</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-950 space-y-1">
                      <span className="font-bold text-[11px] block">{currentLanguage === "ar" ? "نظام الخصم الفيدرالي المؤمن" : "Sovereign Escrow Settlement"}</span>
                      <p className="text-[10.5px]">
                        {currentLanguage === "ar"
                          ? "سيتم خصم المبلغ من رصيدك الحالي في المحفظة الحكومية. جميع العمليات مقيدة على سجل غير قابل للتعديل لتفادي عمليات الاحتيال."
                          : "Funds will be settled immediately into the central bank general ledger under cryptographic block audits."}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={paymentState === "processing"}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      {paymentState === "processing" ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>PROCESSING SECURE PAYMENT...</span>
                        </>
                      ) : paymentState === "success" ? (
                        <span>✓ {currentLanguage === "ar" ? "تم السداد بنجاح!" : "Sovereign Settlement Complete!"}</span>
                      ) : (
                        <span>{currentLanguage === "ar" ? "إجراء السداد الآمن" : "Settle Government Fee Now"}</span>
                      )}
                    </button>
                  </form>

                </div>

                {/* Wallet Balance & Historic Transaction ledger */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 text-xs">
                  <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                    <Wallet className="w-4.5 h-4.5 text-emerald-600" />
                    <span>{currentLanguage === "ar" ? "سجل المعاملات والمدفوعات الأخير" : "Sovereign Transactions Ledger"}</span>
                  </h3>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {transactions.map((txn) => (
                      <div key={txn.id} className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] border border-gray-100 flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] text-gray-400">[{txn.ref}]</span>
                          <h4 className="font-bold text-slate-900" style={{ fontFamily: "var(--font-arabic)" }}>
                            {currentLanguage === "ar" ? txn.titleAr : txn.titleEn}
                          </h4>
                          <span className="text-gray-400 block text-[9px]">{txn.date}</span>
                        </div>

                        <span className={`font-mono font-bold text-xs shrink-0 ${
                          txn.type === "topup" || txn.type === "refund" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {txn.type === "topup" || txn.type === "refund" ? "+" : ""}{txn.amount.toLocaleString()} SDG
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: SOVEREIGN INVESTOR PORTAL & MAP */}
          {activeTab === "investor" && (
            <div className="space-y-6" id="superapp-investor-tab">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Detailed Investment Opportunities Map View & Matcher */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 text-xs">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "بوابة المستثمر الأجنبي والوطني الحرة" : "Sovereign Investor Dashboard & Trade Zones"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {currentLanguage === "ar" ? "تصفح الخارطة الاستثمارية للمناطق الحرة في بورتسودان وجياد الصناعية، مع تتبع الحوافز والإعفاءات الضريبية" : "Identify matched projects, tax incentives, and free industrial zones for commercial assembly"}
                    </p>
                  </div>

                  {/* Interactive Investment Matcher Grid */}
                  <div className="space-y-4">
                    {investmentOpportunities.map((op) => (
                      <div key={op.id} className="p-4 bg-slate-50 border border-gray-100 rounded-xl flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] font-bold text-gray-400">[{op.id}]</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                              {currentLanguage === "ar" ? op.sectorAr : op.sectorEn}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-950 text-xs" style={{ fontFamily: "var(--font-arabic)" }}>
                            {currentLanguage === "ar" ? op.titleAr : op.titleEn}
                          </h4>
                          <span className="text-[10px] text-gray-500 block"><strong>Zone:</strong> {op.zone} | <strong>Capital Guide:</strong> {op.capital}</span>
                          <p className="text-[10.5px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100/50 mt-1 font-medium">
                            ★ {op.incentives}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            // Simulation of Match
                            alert(currentLanguage === "ar" 
                              ? `تم تحويل اهتمامك بفرصة [${op.titleAr}] للمراجعة الذكية للجنة الاستثمارات الفيدرالية`
                              : `Your interest in [${op.titleEn}] has been securely routed to the National Foreign Investment Commission.`);
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl self-end sm:self-center shrink-0 cursor-pointer text-xs"
                        >
                          {currentLanguage === "ar" ? "تقديم اهتمام سريع" : "Express Interest"}
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

                {/* GIS / Maps Mock Center */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 text-xs">
                  <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-arabic)" }}>
                    <MapPin className="w-4.5 h-4.5 text-emerald-600" />
                    <span>{currentLanguage === "ar" ? "الخارطة الجغرافية الصناعية الفيدرالية (GIS)" : "Sovereign Industrial Zone Map"}</span>
                  </h3>

                  {/* High fidelity simulated map visual */}
                  <div className="h-64 rounded-xl bg-slate-900 relative overflow-hidden flex flex-col justify-between p-4 border border-slate-800">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80')" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
                        GIS ENGINE ACTIVE
                      </span>
                      <span className="bg-slate-900/90 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                        Red Sea Port Coordinates
                      </span>
                    </div>

                    <div className="relative z-10 space-y-2">
                      <div className="p-2.5 bg-slate-950/90 rounded-lg border border-slate-800 text-[10px] space-y-1">
                        <strong className="text-emerald-400 block">Port Sudan Federal Industrial Area</strong>
                        <span className="text-gray-400 block">Status: Fully Operational | Power Grid: Stabilized</span>
                        <span className="text-gray-400 block">Total Factories Match: 43 Heavy | 12 Food Security</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-slate-950 block">{currentLanguage === "ar" ? "قائمة المواقع الاستراتيجية للوزارة" : "Key Sovereign Commerce Locations"}</span>
                    <ul className="space-y-1 text-gray-500 list-disc list-inside">
                      <li>Khartoum Federal Ministry HQ (Active-A)</li>
                      <li>Port Sudan Customs Coordination Center (Active-B)</li>
                      <li>El Bagair Metrology Laboratories</li>
                      <li>Giad Sovereign Heavy Metal Registry Node</li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: AI FEDERAL ASSISTANT */}
          {activeTab === "assistant" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4" id="superapp-assistant-tab">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "المساعد الحكومي الفيدرالي الموحد (الذكاء الاصطناعي السيادي)" : "Sovereign Federal AI Personal Assistant"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {currentLanguage === "ar" ? "المستشار الذكي للإجابة عن إجراءات التراخيص، الاستيراد والتصدير، السلع الاستهلاكية، وحساب رسوم التأسيس فورياً" : "Aide helping citizens auto-fill forms, track cases, check regulatory metrics, and compute fee schedules"}
                  </p>
                </div>
              </div>

              {/* Chat Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Chat screen */}
                <div className="lg:col-span-3 bg-slate-50 p-4 rounded-xl border border-gray-200/60 flex flex-col justify-between min-h-[450px]">
                  
                  <div className="space-y-4 max-h-[350px] overflow-y-auto p-2" id="chat-scroller">
                    {chatHistory.map((chat, idx) => (
                      <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                          chat.sender === "user" 
                            ? "bg-emerald-600 text-white font-bold" 
                            : "bg-white text-slate-950 shadow-sm border border-gray-100"
                        }`} style={{ fontFamily: chat.sender === "ai" ? "var(--font-arabic)" : "inherit" }}>
                          {chat.text}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="p-3 bg-white text-gray-400 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm border border-gray-100">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                          <span>Federal AI Advisor typing...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-200/60 pt-3">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اسألني عن تأسيس الشركات أو تجديد التراخيص الصناعية..." : "Ask about commercial setup, fee calculations, or industrial inspections..."}
                      className="flex-grow p-3 bg-white border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{currentLanguage === "ar" ? "إرسال" : "Send"}</span>
                    </button>
                  </form>

                </div>

                {/* Suggested actions list */}
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-slate-950 border-b border-gray-100 pb-1.5">{currentLanguage === "ar" ? "إجراءات واقتراحات سريعة" : "Recommended Quick-Actions"}</h4>
                  
                  <div className="space-y-2">
                    {[
                      { ar: "ما هي شروط تأسيس شركة مساهمة عامة؟", en: "What are the rules for LLC setup?" },
                      { ar: "احسب لي رسوم رخصة الاستيراد السنوية", en: "How much is the Import License fee?" },
                      { ar: "احجز لي موعد استشارة استثمارية بورتسودان", en: "Schedule investment consultation" },
                      { ar: "تفاصيل حوافز الإعفاء الضريبي للمصانع", en: "Show me heavy manufacturing incentives" }
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUserInput(currentLanguage === "ar" ? prompt.ar : prompt.en)}
                        className="w-full text-right sm:text-left p-3 bg-slate-50 hover:bg-slate-100 border border-gray-200/50 rounded-xl text-[11px] font-medium text-slate-800 transition-colors cursor-pointer"
                      >
                        {currentLanguage === "ar" ? prompt.ar : prompt.en}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: ADOPTION ANALYTICS & KPIs */}
          {activeTab === "analytics" && (
            <div className="space-y-6" id="superapp-analytics-tab">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Daily Active Users (DAU) & Platform adoption Index */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-400 text-xs font-bold font-mono">NATIONAL ADOPTION INDEX</span>
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-3xl font-bold font-mono text-emerald-600">92.4%</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentLanguage === "ar" ? "نسبة التحول الرقمي الكامل في السجلات والشركات" : "Commerce registry paperless workflow conversion index"}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-400 text-xs font-bold font-mono">DAILY ACTIVE USERS (DAU)</span>
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-3xl font-bold font-mono text-slate-900">12,450+</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentLanguage === "ar" ? "مواطنون وتجار ومستثمرون نشطون يومياً" : "Daily concurrent merchants & legal investors using super-app"}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-400 text-xs font-bold font-mono">SERVICE COMPLETION RATE</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-3xl font-bold font-mono text-indigo-600">98.1%</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentLanguage === "ar" ? "نسبة نجاح واكتمال المعاملات بدون مراجعة ورقية" : "Escrow payments & certificate delivery conversion success rate"}
                    </p>
                  </div>
                </div>

              </div>

              {/* National Adoption detailed index chart layout mockup */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "var(--font-arabic)" }}>
                  {currentLanguage === "ar" ? "مؤشرات التحول الرقمي والتبني لمحافظة السجل التجاري" : "Sovereign Digital Transition & Engagement Metrics"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
                  <div className="space-y-3">
                    <span className="font-bold block border-b border-gray-100 pb-1.5">{currentLanguage === "ar" ? "معدل تبني الخدمات الأساسية" : "Service Module Conversion Metrics"}</span>
                    {[
                      { label: "Commercial Registration (LLC / Sole)", progress: 95 },
                      { label: "Sovereign Document Wallet Downloads", progress: 88 },
                      { label: "State Escrow & Payment Gateway Use", progress: 91 },
                      { label: "Consumer Violation Alerts Resolved", progress: 84 }
                    ].map((bar, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between">
                          <span>{bar.label}</span>
                          <span className="font-mono font-bold">{bar.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${bar.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="font-bold block text-slate-950 mb-2">{currentLanguage === "ar" ? "تقرير أداء استجابة الأنظمة والمجالس الفيدرالية" : "Ministry Service Delivery Intelligence"}</span>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {currentLanguage === "ar"
                          ? "تسجل المنصة متوسط زمن قياسي لإنهاء وحيازة السجل التجاري للمستثمرين في أقل من 4 دقائق؛ متفوقة على المعيار القياسي الإقليمي البالغ 3 أيام عمل. كافة قيود المعاملات مؤرشفة رقمياً وغير قابلة للتعديل."
                          : "The state platform records an average of 4.2 minutes for full commercial registration incorporation, exceeding global regional parameters of 3 business days. Absolute non-repudiation of records achieved."}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => alert("Digital Adoption Report downloaded successfully.")}
                        className="flex-grow py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-center cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{currentLanguage === "ar" ? "تصدير التقرير الفيدرالي" : "Print Executive Report"}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
