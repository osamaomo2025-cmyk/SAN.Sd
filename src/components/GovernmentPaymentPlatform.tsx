/**
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Government Digital Payment & Revenue Management Platform
 * Conforming to Sovereign Digital Design Standards (DIN Next Arabic & Lucide Icons)
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard, Landmark, Coins, FileText, Receipt, ArrowRight, CheckCircle2,
  AlertTriangle, XCircle, Search, RefreshCw, Send, Lock, Sparkles, Check, X,
  TrendingUp, Percent, FileDown, ShieldAlert, History, KeyRound, Radio, HelpCircle,
  Clock, Filter, BarChart3, Database, FileSignature, ShieldCheck, Download, Award
} from "lucide-react";
import { UserRole } from "../types";
import { PAYMENT_DOCS_DATA, PaymentDoc } from "./paymentDocsData";

interface GovernmentPaymentPlatformProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

export default function GovernmentPaymentPlatform({ currentLanguage, role }: GovernmentPaymentPlatformProps) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "payments" | "ledger" | "refunds" | "reconciliation" | "logs" | "ai" | "docs">("dashboard");
  
  // Local Database States
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [reconciliations, setReconciliations] = useState<any[]>([]);
  const [gatewayLogs, setGatewayLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from backend
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [invRes, payRes, ledRes, refRes, recRes, logRes] = await Promise.all([
        fetch("/api/invoices").then(r => r.json()),
        fetch("/api/payments").then(r => r.json()),
        fetch("/api/ledger").then(r => r.json()),
        fetch("/api/refunds").then(r => r.json()),
        fetch("/api/reconciliations").then(r => r.json()),
        fetch("/api/gateway-logs").then(r => r.json())
      ]);

      setInvoices(invRes || []);
      setPayments(payRes || []);
      setLedger(ledRes || []);
      setRefunds(refRes || []);
      setReconciliations(recRes || []);
      setGatewayLogs(logRes || []);
    } catch (error) {
      console.error("Failed to load backend payment state, utilizing client-side backup", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // QR Code generator helper (Canvas)
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawQRCode = (text: string) => {
    const canvas = qrCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 120, 120);
        ctx.fillStyle = "#1e293b"; // Charcoal block color
        // Draw three corner locator blocks
        ctx.fillRect(0, 0, 30, 30);
        ctx.clearRect(5, 5, 20, 20);
        ctx.fillRect(10, 10, 10, 10);

        ctx.fillRect(90, 0, 30, 30);
        ctx.clearRect(95, 5, 20, 20);
        ctx.fillRect(100, 10, 10, 10);

        ctx.fillRect(0, 90, 30, 30);
        ctx.clearRect(5, 95, 20, 20);
        ctx.fillRect(10, 100, 10, 10);

        // Draw dynamic random binary blocks to look like an authentic QR Code
        for (let x = 35; x < 85; x += 5) {
          for (let y = 0; y < 120; y += 5) {
            if (Math.random() > 0.5) ctx.fillRect(x, y, 4, 4);
          }
        }
        for (let x = 0; x < 35; x += 5) {
          for (let y = 35; y < 85; y += 5) {
            if (Math.random() > 0.5) ctx.fillRect(x, y, 4, 4);
          }
        }
        for (let x = 85; x < 120; x += 5) {
          for (let y = 35; y < 120; y += 5) {
            if (Math.random() > 0.5) ctx.fillRect(x, y, 4, 4);
          }
        }
      }
    }
  };

  // Payment Hub Workflow State
  const [paymentStep, setPaymentStep] = useState<"calc" | "invoice" | "auth" | "success">("calc");
  const [selectedService, setSelectedService] = useState("company");
  const [applicantNameAr, setApplicantNameAr] = useState("عثمان هاشم علي");
  const [applicantNameEn, setApplicantNameEn] = useState("Osman Hashim Ali");
  const [serviceDetails, setServiceDetails] = useState("طلب تأسيس شركة زراعية متكاملة");
  const [paymentMethod, setPaymentMethod] = useState<"debit_card" | "credit_card" | "bank_transfer" | "mobile_wallet" | "ipn">("debit_card");
  const [activeInvoice, setActiveInvoice] = useState<any>(null);
  
  // Card Details (mock inputs)
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pinError, setPinError] = useState("");

  const feeStructures = {
    registration: { price: 15000, labelAr: "رسوم حجز اسم تجاري", labelEn: "Trade Name Reservation Fee" },
    company: { price: 150000, labelAr: "رسوم تأسيس شركة محدودة", labelEn: "Company Incorporation Fee" },
    license: { price: 250000, labelAr: "رسوم إصدار رخصة تصدير سنوية", labelEn: "Annual Export License Fee" },
    inspection: { price: 50000, labelAr: "رسوم معاينة وتفتيش المصنع", labelEn: "Factory Inspection & Compliance Fee" },
    penalty: { price: 75000, labelAr: "غرامة تأخير تقديم تقارير المطابقة", labelEn: "Environmental Delay Penalty" }
  };

  // 1. Generate Invoice (POST to backend)
  const handleGenerateInvoice = async () => {
    const feeInfo = feeStructures[selectedService as keyof typeof feeStructures];
    const payload = {
      titleAr: `${feeInfo.labelAr} - ${applicantNameAr}`,
      titleEn: `${feeInfo.labelEn} - ${applicantNameEn}`,
      feeType: selectedService,
      amount: feeInfo.price,
      applicantName: currentLanguage === "ar" ? applicantNameAr : applicantNameEn,
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setActiveInvoice(data.invoice);
        setInvoices(prev => [data.invoice, ...prev]);
        setPaymentStep("invoice");
        // Draw the QR Code canvas after the step changes and canvas mounts
        setTimeout(() => drawQRCode(data.invoice.qrCode), 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Submit payment (POST to backend)
  const handleAuthorizePayment = async () => {
    if (paymentMethod === "debit_card" || paymentMethod === "credit_card") {
      if (otpCode !== "1956") {
        setPinError(currentLanguage === "ar" ? "رمز التحقق الثنائي OTP غير صحيح. أدخل 1956!" : "OTP verification code is incorrect. Enter 1956!");
        return;
      }
    }

    setIsProcessingPayment(true);
    setPinError("");
    
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: activeInvoice.id,
          amount: activeInvoice.amount,
          method: paymentMethod,
          gateway: paymentMethod === "debit_card" ? "national_gateway" : "cbs_instant",
          token: `tok_sim_${Date.now().toString(16)}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setPaymentStep("success");
        fetchAllData(); // refresh database states
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Supervisor Refund Approval
  const [activeRefundTab, setActiveRefundTab] = useState<"pending" | "processed">("pending");
  const handleRefundAction = async (id: string, action: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/refunds/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          approvedBy: currentLanguage === "ar" ? "وزارة المالية - مدير الإيرادات" : "MoF - Revenue Director"
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bank Reconciliation Run
  const [isReconciling, setIsReconciling] = useState(false);
  const handleRunReconciliation = async () => {
    setIsReconciling(true);
    try {
      // simulate delay
      await new Promise(r => setTimeout(r, 1200));
      const res = await fetch("/api/reconciliations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchedCount: invoices.filter(i => i.status === "paid").length + 5,
          unmatchedCount: 0,
          discrepancyAmount: 0
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReconciling(false);
    }
  };

  // AI Financial Copilot
  const [aiQuery, setAiQuery] = useState("");
  const [aiChat, setAiChat] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: currentLanguage === "ar"
        ? "أهلاً بك في المساعد المالي التنبئي للوزارة الرقمية لعام 2026. يمكنني احتساب الرسوم لشركتك وتفصيل المعايير الأمنية PCI DSS وشرح بروتوكولات mTLS وكشف المعاملات المشبوهة."
        : "Welcome to the predictive Financial Copilot for the Digital Ministry. I can calculate your registration fees, explain PCI DSS controls, mTLS protocols, and detect transaction anomalies."
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSendAiMessage = async (msgText: string) => {
    if (!msgText.trim()) return;
    setAiChat(prev => [...prev, { sender: "user", text: msgText }]);
    setAiQuery("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          history: [],
          context: {
            language: currentLanguage,
            system: "payments_module",
            role: role
          }
        })
      });
      const data = await res.json();
      setAiChat(prev => [...prev, { sender: "ai", text: data.text }]);
    } catch (e) {
      console.error(e);
      setAiChat(prev => [...prev, { sender: "ai", text: currentLanguage === "ar" ? "عذراً، لم أستطع معالجة السؤال الآن." : "Sorry, I could not process that request now." }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Specs & Docs Search & Filter
  const [docSearch, setDocSearch] = useState("");
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>("All");
  const [selectedDoc, setSelectedDoc] = useState<PaymentDoc | null>(PAYMENT_DOCS_DATA[0]);

  // Calculations for Dashboard
  const totalRevenue = ledger.filter(l => l.type === "credit").reduce((acc, curr) => acc + curr.amount, 0);
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === "paid").length;
  const pendingInvoices = invoices.filter(i => i.status === "pending").length;
  const refundCount = refunds.length;

  return (
    <div id="government-payment-platform" className="w-full bg-[#fafafa] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200">
      {/* Top Ministry Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-6 rounded-b-3xl border-b-4 border-amber-500 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-20 -translate-y-10 scale-150 font-sans font-bold text-9xl">SD</div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Landmark className="h-8 w-8 text-amber-500 animate-pulse" />
              <div className="h-6 w-px bg-slate-700"></div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Republic of the Sudan | جمهورية السودان</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-sans font-bold text-white mt-1 tracking-tight">
              {currentLanguage === "ar" ? "منصة الدفع الإلكتروني والجباية الوطنية الموحدة" : "Sovereign Digital Payments & Revenue Management"}
            </h1>
            <p className="text-xs md:text-sm text-emerald-400 mt-1">
              {currentLanguage === "ar" 
                ? "نظام المقاصة والفوترة السيادي لوزارة التجارة والصناعة بالتنسيق مع بنك السودان المركزي" 
                : "Sovereign Billing, Revenue Settlement & Multi-Channel Clearing with the Central Bank"}
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-500/30 flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">PORTAL ROLE / رتبة الولوج</span>
              <span className="text-xs text-amber-400 font-bold font-sans capitalize">{role.replace("_", " ")}</span>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <KeyRound className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Quick Metrics */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">
                {currentLanguage === "ar" ? "إجمالي الجباية السيادية" : "Total Sovereign Revenue"}
              </span>
              <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {totalRevenue.toLocaleString()} SDG
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">
                {currentLanguage === "ar" ? "الفواتير الإلكترونية الموحدة" : "Electronic Invoices"}
              </span>
              <span className="text-xl font-mono font-bold text-slate-800 dark:text-white">
                {totalInvoices}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">
                {currentLanguage === "ar" ? "المطابقة والتسوية البنكية" : "Reconciliation Match Rate"}
              </span>
              <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                100.0%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
              <History className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">
                {currentLanguage === "ar" ? "طلبات الاسترداد المفتوحة" : "Active Refund Claims"}
              </span>
              <span className="text-xl font-mono font-bold text-red-600 dark:text-red-400">
                {refunds.filter(r => r.status === "pending_review").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Module Content & Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                {currentLanguage === "ar" ? "الأقسام والخدمات" : "Sections & Operations"}
              </div>

              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {currentLanguage === "ar" ? "المؤشرات والتحليلات" : "Revenue Analytics"}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "payments"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {currentLanguage === "ar" ? "بوابة الدفع الفوري" : "Instant Payment Hub"}
                </span>
                <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">LIVE</span>
              </button>

              <button
                onClick={() => setActiveTab("ledger")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "ledger"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  {currentLanguage === "ar" ? "الدفتر العام المالي" : "Financial Ledger"}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("refunds")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "refunds"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  {currentLanguage === "ar" ? "إدارة الاسترداد المالي" : "Refund Claims"}
                </span>
                {refunds.filter(r => r.status === "pending_review").length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] h-4 w-4 flex items-center justify-center rounded-full font-bold">
                    {refunds.filter(r => r.status === "pending_review").length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("reconciliation")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "reconciliation"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {currentLanguage === "ar" ? "التسوية والمطابقة الفيدرالية" : "Federal Reconciliation"}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "logs"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  {currentLanguage === "ar" ? "سجلات أمن البوابة mTLS" : "Gateway mTLS Logs"}
                </span>
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

              <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                {currentLanguage === "ar" ? "الذكاء الاصطناعي والمستندات" : "AI & SPECIFICATIONS"}
              </div>

              <button
                onClick={() => setActiveTab("ai")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "ai"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  {currentLanguage === "ar" ? "المستشار المالي التنبئي" : "Predictive Copilot"}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("docs")}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-sans text-sm cursor-pointer ${
                  activeTab === "docs"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {currentLanguage === "ar" ? "الوثائق السيادية والاعتمادات" : "Sovereign Specs Center"}
                </span>
                <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">14 Docs</span>
              </button>
            </div>

            {/* Quick Cyber Security Card */}
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-slate-800 translate-x-4 translate-y-4 pointer-events-none">
                <Lock className="h-20 w-20" />
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs uppercase font-mono font-bold tracking-widest">PCI DSS Compliant</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {currentLanguage === "ar"
                  ? "جميع اتصالات المعاملات محمية بتشفير الأجهزة ثنائي الاتجاه والتوقيع الرقمي لمنع التلاعب السيادي."
                  : "All transactions route via bilateral mutual TLS (mTLS) with tokenized payloads guaranteeing banking integrity."}
              </p>
            </div>
          </div>

          {/* Core Panel Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: ANALYTICS DASHBOARD */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        {currentLanguage === "ar" ? "لوحة المتابعة وتتبع الإيرادات الحكومية" : "Treasury Dashboard & Revenue Monitor"}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "تتبع مباشر للتدفقات النقدية السيادية وتوزيعها الفيدرالي في حسابات الدولة البنكية" : "Real-time auditing of state coffers, fee captures, and distribution to central treasury"}
                      </p>
                    </div>

                    {/* Chart Visualization */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">
                          {currentLanguage === "ar" ? "توزيع الإيرادات حسب الإدارات الفيدرالية" : "Revenue Share by Federal Sector"}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                          <TrendingUp className="h-3 w-3" />
                          <span>+14.2% YoY Growth</span>
                        </div>
                      </div>

                      {/* Styled Custom Responsive SVG Chart */}
                      <div className="h-64 w-full flex items-end justify-between gap-6 pt-8 px-4 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-200 dark:border-slate-800"></div>
                        <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-200 dark:border-slate-800"></div>
                        <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-200 dark:border-slate-800"></div>
                        
                        {/* Bar 1 */}
                        <div className="flex-1 flex flex-col items-center group relative z-10">
                          <div className="text-[10px] font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-0.5 rounded absolute -top-6">150K</div>
                          <div className="w-12 bg-emerald-600 group-hover:bg-emerald-500 rounded-t-lg transition-all" style={{ height: "130px" }}></div>
                          <span className="text-[10px] mt-2 font-mono text-slate-500 block truncate max-w-full">
                            {currentLanguage === "ar" ? "تأسيس الشركات" : "Companies"}
                          </span>
                        </div>

                        {/* Bar 2 */}
                        <div className="flex-1 flex flex-col items-center group relative z-10">
                          <div className="text-[10px] font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-0.5 rounded absolute -top-6">250K</div>
                          <div className="w-12 bg-amber-500 group-hover:bg-amber-400 rounded-t-lg transition-all" style={{ height: "190px" }}></div>
                          <span className="text-[10px] mt-2 font-mono text-slate-500 block truncate max-w-full">
                            {currentLanguage === "ar" ? "التراخيص التجارية" : "Licensing"}
                          </span>
                        </div>

                        {/* Bar 3 */}
                        <div className="flex-1 flex flex-col items-center group relative z-10">
                          <div className="text-[10px] font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-0.5 rounded absolute -top-6">15K</div>
                          <div className="w-12 bg-teal-600 group-hover:bg-teal-500 rounded-t-lg transition-all" style={{ height: "40px" }}></div>
                          <span className="text-[10px] mt-2 font-mono text-slate-500 block truncate max-w-full">
                            {currentLanguage === "ar" ? "حجز الأسماء" : "Names Registry"}
                          </span>
                        </div>

                        {/* Bar 4 */}
                        <div className="flex-1 flex flex-col items-center group relative z-10">
                          <div className="text-[10px] font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-0.5 rounded absolute -top-6">0K</div>
                          <div className="w-12 bg-rose-500 group-hover:bg-rose-400 rounded-t-lg transition-all" style={{ height: "10px" }}></div>
                          <span className="text-[10px] mt-2 font-mono text-slate-500 block truncate max-w-full">
                            {currentLanguage === "ar" ? "الغرامات والمخالفات" : "Penalties"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Operational KPIs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs text-slate-500 block font-sans">
                          {currentLanguage === "ar" ? "حساب المقاصة - الخزينة العامة" : "General Treasury Ledger Allocations (85%)"}
                        </span>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-mono font-bold text-slate-800 dark:text-white">
                            {(totalRevenue * 0.85).toLocaleString()} SDG
                          </span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded">
                            {currentLanguage === "ar" ? "الخزانة العامة" : "Treasury Account"}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs text-slate-500 block font-sans">
                          {currentLanguage === "ar" ? "حساب صندوق التطوير والتشغيل الفني" : "DMCI Infrastructure Operations Fund (15%)"}
                        </span>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-mono font-bold text-slate-800 dark:text-white">
                            {(totalRevenue * 0.15).toLocaleString()} SDG
                          </span>
                          <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold px-2 py-0.5 rounded">
                            {currentLanguage === "ar" ? "حساب التشغيل" : "Operations Account"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: INSTANT PAYMENT HUB */}
              {activeTab === "payments" && (
                <motion.div
                  key="payments-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-emerald-500" />
                          {currentLanguage === "ar" ? "حساب ودفع الرسوم الحكومية الموحدة" : "Unified Government Fee Payment Wizard"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {currentLanguage === "ar" ? "احسب الرسوم المعيارية فورياً، وصدر فاتورتك الموثقة، وأكمل الدفع الآمن بنقرة واحدة" : "Instantly calculate standard fee items, issue authenticated invoice, and execute secure clearing"}
                        </p>
                      </div>
                      <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                          onClick={() => setPaymentStep("calc")}
                          disabled={paymentStep === "success"}
                          className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                            paymentStep === "calc" ? "bg-white dark:bg-slate-950 shadow-sm font-bold" : "text-slate-500"
                          }`}
                        >
                          1. {currentLanguage === "ar" ? "الاحتساب" : "Calculate"}
                        </button>
                        <button
                          disabled
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${
                            paymentStep === "invoice" ? "bg-white dark:bg-slate-950 shadow-sm font-bold" : "text-slate-500"
                          }`}
                        >
                          2. {currentLanguage === "ar" ? "الفاتورة" : "Invoice"}
                        </button>
                        <button
                          disabled
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${
                            paymentStep === "auth" ? "bg-white dark:bg-slate-950 shadow-sm font-bold" : "text-slate-500"
                          }`}
                        >
                          3. {currentLanguage === "ar" ? "التصديق" : "Authorize"}
                        </button>
                      </div>
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                      
                      {/* SUBSTEP 1: CALCULATE FEES */}
                      {paymentStep === "calc" && (
                        <motion.div
                          key="calc-substep"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-500 block">
                                {currentLanguage === "ar" ? "اختر الخدمة الفيدرالية" : "Select Federal Service"}
                              </label>
                              <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                              >
                                <option value="company">{currentLanguage === "ar" ? "تأسيس شركة محدودة المسؤولية ذ.م.م" : "Company Incorporation (LLC)"}</option>
                                <option value="license">{currentLanguage === "ar" ? "إصدار رخصة التصدير السيادية" : "Sovereign Export License"}</option>
                                <option value="registration">{currentLanguage === "ar" ? "حجز اسم تجاري بالسجل الفيدرالي" : "Trade Name Registry Reservation"}</option>
                                <option value="inspection">{currentLanguage === "ar" ? "تفتيش ومطابقة منشأة صناعية" : "Industrial Factory Inspection"}</option>
                                <option value="penalty">{currentLanguage === "ar" ? "سداد غرامة عدم الامتثال البيئي" : "Environmental Non-Compliance Penalty"}</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-500 block">
                                {currentLanguage === "ar" ? "اسم مقدم الطلب" : "Applicant Legal Name"}
                              </label>
                              <input
                                type="text"
                                value={applicantNameAr}
                                onChange={(e) => {
                                  setApplicantNameAr(e.target.value);
                                  setApplicantNameEn(e.target.value); // fallback
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                                placeholder={currentLanguage === "ar" ? "الاسم الكامل لمالك المنشأة" : "Full legal name"}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 block">
                              {currentLanguage === "ar" ? "تفاصيل إضافية عن المعاملة" : "Transaction Purpose & Context"}
                            </label>
                            <textarea
                              value={serviceDetails}
                              onChange={(e) => setServiceDetails(e.target.value)}
                              rows={2}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm"
                              placeholder={currentLanguage === "ar" ? "تحديد كود وتفاصيل السجل أو رخصة الصمغ العربي" : "Specify license details"}
                            />
                          </div>

                          {/* Live Calculation Preview Card */}
                          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <div>
                              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                                {currentLanguage === "ar" ? "الرسوم القانونية المعتمدة" : "Statutory Fixed Fee"}
                              </span>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                                {feeStructures[selectedService as keyof typeof feeStructures].labelAr}
                              </h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase block w-max ml-auto mb-1">
                                {currentLanguage === "ar" ? "معتمد سيادياً" : "Federal Tariff"}
                              </span>
                              <span className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {feeStructures[selectedService as keyof typeof feeStructures].price.toLocaleString()} SDG
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={handleGenerateInvoice}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-emerald-600/10"
                          >
                            <FileSignature className="h-5 w-5" />
                            {currentLanguage === "ar" ? "إصدار الفاتورة الإلكترونية الفيدرالية" : "Generate Sovereign Electronic Invoice"}
                          </button>
                        </motion.div>
                      )}

                      {/* SUBSTEP 2: RENDER GENERATED INVOICE */}
                      {paymentStep === "invoice" && activeInvoice && (
                        <motion.div
                          key="invoice-substep"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          {/* Formal Invoice Card layout */}
                          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 space-y-6 font-sans relative">
                            {/* Watermark Logo background */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                              <Landmark className="h-64 w-64 text-emerald-500" />
                            </div>

                            {/* Formal Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
                              <div>
                                <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
                                  {currentLanguage === "ar" ? "وزارة التجارة والصناعة | الفاتورة الإلكترونية الفيدرالية" : "DMCI | Sovereign Electronic Invoice"}
                                </div>
                                <div className="text-xl font-bold font-mono text-slate-800 dark:text-white mt-1">
                                  {activeInvoice.id}
                                </div>
                              </div>
                              <div className="bg-amber-500/15 border border-amber-500/30 text-amber-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 animate-spin" />
                                <span>{currentLanguage === "ar" ? "فاتورة مستحقة وبانتظار الدفع" : "Unpaid - Pending Settlement"}</span>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[10px] uppercase font-mono text-slate-400 block">{currentLanguage === "ar" ? "مقدم الطلب" : "Applicant"}</span>
                                  <span className="text-sm font-medium">{activeInvoice.applicantName}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-mono text-slate-400 block">{currentLanguage === "ar" ? "البيان والخدمة" : "Description"}</span>
                                  <span className="text-sm font-medium">
                                    {currentLanguage === "ar" ? activeInvoice.titleAr : activeInvoice.titleEn}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-mono text-slate-400 block">{currentLanguage === "ar" ? "تاريخ الإصدار والفوترة" : "Issued At"}</span>
                                  <span className="text-sm font-mono">{new Date(activeInvoice.createdAt).toLocaleString()}</span>
                                </div>
                              </div>

                              {/* QR Code and Cryptographic Hash */}
                              <div className="flex flex-col items-center md:items-end justify-center space-y-2">
                                <div className="bg-white p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                  <canvas ref={qrCanvasRef} width={120} height={120} className="w-24 h-24" />
                                </div>
                                <div className="text-center md:text-right max-w-xs">
                                  <span className="text-[9px] uppercase font-mono text-slate-400 block">Digital Certificate Hash / ختم التشفير السيادي</span>
                                  <span className="text-[9px] font-mono break-all text-slate-500 dark:text-slate-400">{activeInvoice.digitalSignature}</span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-500">{currentLanguage === "ar" ? "المبلغ الإجمالي المطلق" : "Total Due Amount"}</span>
                              <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                {activeInvoice.amount.toLocaleString()} SDG
                              </span>
                            </div>
                          </div>

                          {/* Choose Payment Method */}
                          <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                              {currentLanguage === "ar" ? "اختر وسيلة وقناة الدفع الآمنة" : "Choose Secure Clearing Method"}
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <button
                                onClick={() => setPaymentMethod("debit_card")}
                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                  paymentMethod === "debit_card"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                <CreditCard className="h-6 w-6" />
                                <span className="text-xs">{currentLanguage === "ar" ? "بطاقة دفع فيدرالية" : "Sovereign Debit Card"}</span>
                              </button>

                              <button
                                onClick={() => setPaymentMethod("bank_transfer")}
                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                  paymentMethod === "bank_transfer"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                <Landmark className="h-64 w-64" />
                                <span className="text-xs">{currentLanguage === "ar" ? "تحويل حساب بنكي" : "CBS Bank Transfer"}</span>
                              </button>

                              <button
                                onClick={() => setPaymentMethod("mobile_wallet")}
                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                  paymentMethod === "mobile_wallet"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                <Coins className="h-6 w-6" />
                                <span className="text-xs">{currentLanguage === "ar" ? "المحفظة الرقمية" : "Sudar Wallet"}</span>
                              </button>

                              <button
                                onClick={() => setPaymentMethod("ipn")}
                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                  paymentMethod === "ipn"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                <RefreshCw className="h-6 w-6 animate-spin-slow" />
                                <span className="text-xs">{currentLanguage === "ar" ? "شبكة دفع فوري (SyberPay)" : "Instant Net (SyberPay)"}</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={() => setPaymentStep("calc")}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                            >
                              {currentLanguage === "ar" ? "إلغاء والعودة" : "Cancel & Return"}
                            </button>
                            <button
                              onClick={() => setPaymentStep("auth")}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                            >
                              <span>{currentLanguage === "ar" ? "الاستمرار للدفع" : "Proceed to Payment"}</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* SUBSTEP 3: SECURE TRANSACTION AUTHENTICATION */}
                      {paymentStep === "auth" && activeInvoice && (
                        <motion.div
                          key="auth-substep"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 font-sans shadow-inner">
                            <div className="text-center">
                              <div className="inline-block p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full mb-2">
                                <Lock className="h-6 w-6" />
                              </div>
                              <h3 className="text-md font-bold text-slate-800 dark:text-white">
                                {currentLanguage === "ar" ? "بوابة التحقق الثنائي الآمنة (CBS)" : "Central Bank Secure Authentication Gateway"}
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">
                                {currentLanguage === "ar" 
                                  ? `تأكيد معاملة بقيمة ${activeInvoice.amount.toLocaleString()} SDG لوزارة التجارة` 
                                  : `Confirming transaction of ${activeInvoice.amount.toLocaleString()} SDG to DMCI`}
                              </p>
                            </div>

                            {/* Simulated card details inputs */}
                            {(paymentMethod === "debit_card" || paymentMethod === "credit_card") && (
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">{currentLanguage === "ar" ? "رقم بطاقة الصراف الوطني" : "National Card Number"}</label>
                                  <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={19}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-center tracking-widest"
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">{currentLanguage === "ar" ? "تاريخ الانتهاء" : "Expiry"}</label>
                                    <input
                                      type="text"
                                      value={cardExpiry}
                                      onChange={(e) => setCardExpiry(e.target.value)}
                                      maxLength={5}
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-center"
                                      placeholder="MM/YY"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">{currentLanguage === "ar" ? "رمز الأمان CVV" : "CVV"}</label>
                                    <input
                                      type="password"
                                      value={cardCVV}
                                      onChange={(e) => setCardCVV(e.target.value)}
                                      maxLength={3}
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-center"
                                      placeholder="***"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1 border-t border-slate-200 dark:border-slate-800 pt-3">
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">{currentLanguage === "ar" ? "أدخل رمز OTP المؤقت" : "Enter Secure OTP"}</label>
                                    <span className="text-[9px] text-amber-500 font-sans font-bold">{currentLanguage === "ar" ? "أدخل الكود: 1956 للتحقق" : "Use simulation code: 1956"}</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    maxLength={6}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-md font-mono text-center tracking-widest font-bold"
                                    placeholder="XXXX"
                                  />
                                </div>
                              </div>
                            )}

                            {pinError && (
                              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                <span>{pinError}</span>
                              </div>
                            )}

                            <div className="flex gap-3">
                              <button
                                onClick={() => setPaymentStep("invoice")}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                              >
                                {currentLanguage === "ar" ? "تراجع" : "Back"}
                              </button>
                              <button
                                onClick={handleAuthorizePayment}
                                disabled={isProcessingPayment}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md"
                              >
                                {isProcessingPayment ? (
                                  <>
                                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                                    <span>{currentLanguage === "ar" ? "جاري الخصم الفيدرالي..." : "Processing Clearing..."}</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="h-4.5 w-4.5" />
                                    <span>{currentLanguage === "ar" ? "تأكيد وتصديق المعاملة" : "Confirm & Authorize"}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* SUBSTEP 4: SUCCESS RECEIPT */}
                      {paymentStep === "success" && activeInvoice && (
                        <motion.div
                          key="success-substep"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center space-y-6 max-w-lg mx-auto"
                        >
                          <div className="inline-block p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full mb-1">
                            <Check className="h-10 w-10 animate-bounce" />
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                              {currentLanguage === "ar" ? "تم سداد الرسوم وقبول المقاصة بنجاح!" : "Sovereign Payment Cleared Successfully!"}
                            </h3>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-sans">
                              {currentLanguage === "ar" 
                                ? "تم إيداع وتأكيد المبالغ مباشرة في حساب الخزانة الوطنية العام للجمهورية" 
                                : "The funds have been settled directly into the Federal Treasury account."}
                            </p>
                          </div>

                          {/* Beautiful Receipt component */}
                          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 rounded-2xl text-left font-sans space-y-4 shadow-md relative">
                            <div className="text-center border-b border-slate-100 dark:border-slate-800 pb-4">
                              <span className="text-xs uppercase font-mono tracking-widest text-emerald-600 font-bold block">Official Receipt / إيصال مالي معتمد</span>
                              <span className="text-xs font-mono text-slate-400">REC-SD-2026-{Math.floor(100000 + Math.random() * 900000)}</span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">{currentLanguage === "ar" ? "المسدد باسم" : "Paid By"}</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">{activeInvoice.applicantName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">{currentLanguage === "ar" ? "رقم الفاتورة المرجعي" : "Linked Invoice ID"}</span>
                                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{activeInvoice.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">{currentLanguage === "ar" ? "طريقة الجباية" : "Clearing Method"}</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{paymentMethod.replace("_", " ")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">{currentLanguage === "ar" ? "الرقم المرجعي الفيدرالي لـ CBS" : "CBS Clearing Ref"}</span>
                                <span className="font-mono text-slate-800 dark:text-slate-200">TXN-SUDPAY-{(Math.floor(10000000 + Math.random() * 90000000))}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">{currentLanguage === "ar" ? "تاريخ استلام المقاصة" : "Settled At"}</span>
                                <span className="font-mono text-slate-800 dark:text-slate-200">{new Date().toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center">
                              <span className="text-xs font-bold">{currentLanguage === "ar" ? "المبلغ المقبوض" : "Sovereign Fee Captured"}</span>
                              <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{activeInvoice.amount.toLocaleString()} SDG</span>
                            </div>

                            <div className="text-[8px] text-center text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 leading-relaxed">
                              {currentLanguage === "ar"
                                ? "إيصال مالي إلكتروني موقع رقمياً وصادر مباشرة عن البنك المركزي السوداني بموجب المخطط الفيدرالي لعام 2026."
                                : "Digitally sealed invoice with SHA-256 validation. Recognized as a sovereign financial document."}
                            </div>
                          </div>

                          <div className="flex gap-4 max-w-sm mx-auto">
                            <button
                              onClick={() => {
                                setPaymentStep("calc");
                                setActiveInvoice(null);
                              }}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                            >
                              {currentLanguage === "ar" ? "دفع معاملة أخرى" : "Pay New Fee"}
                            </button>
                            <button
                              onClick={() => setActiveTab("ledger")}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1"
                            >
                              <Database className="h-4 w-4" />
                              <span>{currentLanguage === "ar" ? "عرض الدفتر العام" : "View Ledger"}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: IMMUTABLE FINANCIAL LEDGER */}
              {activeTab === "ledger" && (
                <motion.div
                  key="ledger-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Database className="h-5 w-5 text-emerald-500" />
                        {currentLanguage === "ar" ? "سجل المعاملات والعمليات المالية (الدفتر السيادي)" : "Sovereign Cryptographic Financial Ledger"}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "دفتر محاسبي مركزي يسجل حركات الجباية دقيقة بدقيقة مع تأمين البصمة الرقمية للتدقيق الوطني" : "Immutable ledger recording collection entries with unique audit anchors and referential ties"}
                      </p>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono">
                            <th className="p-3 font-semibold">{currentLanguage === "ar" ? "رقم القيد" : "Ledger ID"}</th>
                            <th className="p-3 font-semibold">{currentLanguage === "ar" ? "نوع الحركة" : "Type"}</th>
                            <th className="p-3 font-semibold">{currentLanguage === "ar" ? "الحساب المتأثر" : "Impacted Account"}</th>
                            <th className="p-3 font-semibold">{currentLanguage === "ar" ? "البيان والتفاصيل" : "Description"}</th>
                            <th className="p-3 font-semibold text-right">{currentLanguage === "ar" ? "المبلغ" : "Value"}</th>
                            <th className="p-3 font-semibold">{currentLanguage === "ar" ? "التوقيت" : "Timestamp"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                          {ledger.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                              <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{entry.id}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  entry.type === "credit" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }`}>
                                  {entry.type.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-3 capitalize">{entry.account.replace("_", " ")}</td>
                              <td className="p-3 text-slate-600 dark:text-slate-400">{entry.description}</td>
                              <td className={`p-3 text-right font-bold ${
                                entry.type === "credit" ? "text-emerald-600" : "text-red-600"
                              }`}>
                                {entry.type === "credit" ? "+" : "-"}{entry.amount.toLocaleString()} SDG
                              </td>
                              <td className="p-3 text-slate-400 text-[10px]">{new Date(entry.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: REFUND MANAGEMENT */}
              {activeTab === "refunds" && (
                <motion.div
                  key="refunds-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <History className="h-5 w-5 text-emerald-500" />
                          {currentLanguage === "ar" ? "بوابة استرداد الرسوم والمبالغ المدفوعة" : "Sovereign Refund & Claim Workspace"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {currentLanguage === "ar" ? "مراجعة وتدقيق وإقرار طلبات استرداد الرسوم بموجب اللوائح الفيدرالية وديوان المراجعة" : "Auditing and executing full/partial refunds following central bank mandates"}
                        </p>
                      </div>

                      {/* Sub tab switch */}
                      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                          onClick={() => setActiveRefundTab("pending")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                            activeRefundTab === "pending" ? "bg-white dark:bg-slate-950 shadow-sm font-bold" : "text-slate-500"
                          }`}
                        >
                          {currentLanguage === "ar" ? "قيد المراجعة والتدقيق" : "Pending Audit"}
                        </button>
                        <button
                          onClick={() => setActiveRefundTab("processed")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                            activeRefundTab === "processed" ? "bg-white dark:bg-slate-950 shadow-sm font-bold" : "text-slate-500"
                          }`}
                        >
                          {currentLanguage === "ar" ? "الطلبات المنجزة" : "Processed"}
                        </button>
                      </div>
                    </div>

                    {/* Refund list */}
                    <div className="space-y-4 pt-2">
                      {refunds
                        .filter(r => activeRefundTab === "pending" ? r.status === "pending_review" : r.status !== "pending_review")
                        .map((refund) => (
                          <div key={refund.id} className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Claim ID / معرّف طلب الاسترجاع</span>
                                <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">{refund.id}</span>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono uppercase ${
                                  refund.status === "approved" ? "bg-emerald-500/10 text-emerald-600" :
                                  refund.status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                                }`}>
                                  {refund.status.replace("_", " ")}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                              <div>
                                <span className="text-slate-400 block">{currentLanguage === "ar" ? "الفاتورة المتربطة" : "Invoice Ref"}</span>
                                <span className="font-mono">{refund.invoiceId}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">{currentLanguage === "ar" ? "مقدم الطلب" : "Applicant"}</span>
                                <span>{refund.requestedBy}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">{currentLanguage === "ar" ? "قيمة طلب الاسترداد" : "Refund Value"}</span>
                                <span className="font-mono font-bold text-amber-600">{refund.amount.toLocaleString()} SDG</span>
                              </div>
                            </div>

                            <div className="text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                              <span className="font-bold text-slate-400 block mb-1">{currentLanguage === "ar" ? "مبررات وسبب الاسترجاع" : "Reason / Justification"}</span>
                              <p className="text-slate-600 dark:text-slate-300">{refund.reason}</p>
                            </div>

                            {/* Actions for Government Super Admin or Minister */}
                            {refund.status === "pending_review" && (
                              <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
                                <button
                                  onClick={() => handleRefundAction(refund.id, "rejected")}
                                  className="px-4 py-2 border border-red-500/30 hover:bg-red-500/5 text-red-500 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                                >
                                  {currentLanguage === "ar" ? "رفض الطلب" : "Reject Claim"}
                                </button>
                                <button
                                  onClick={() => handleRefundAction(refund.id, "approved")}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  <Check className="h-4 w-4" />
                                  <span>{currentLanguage === "ar" ? "الموافقة المباشرة وتسييل المبلغ" : "Approve & Liquidate"}</span>
                                </button>
                              </div>
                            )}

                            {refund.status === "approved" && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                                <span>{currentLanguage === "ar" ? `تم اعتماد الصرف بواسطة: ${refund.approvedBy}` : `Refund disbursed by: ${refund.approvedBy}`}</span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: FEDERAL RECONCILIATION */}
              {activeTab === "reconciliation" && (
                <motion.div
                  key="reconciliation-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          {currentLanguage === "ar" ? "مطابقة وتسوية الحسابات المالية اليومية" : "Federal Bank Reconciliation & Settlements"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {currentLanguage === "ar" ? "مطابقة تسوية كشوف حساب البنك المركزي تلقائياً مع البوابة لمطابقة القيود وحل أي تفاوت" : "Automated matching of CBS statements against system records, flagging ledger variances"}
                        </p>
                      </div>

                      <button
                        onClick={handleRunReconciliation}
                        disabled={isReconciling}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/10"
                      >
                        {isReconciling ? (
                          <>
                            <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                            <span>{currentLanguage === "ar" ? "جاري المطابقة الحية..." : "Running Reconciliation..."}</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4.5 w-4.5" />
                            <span>{currentLanguage === "ar" ? "تشغيل محرك المطابقة اليومي" : "Run Daily Match Engine"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Reconciliation logs history */}
                    <div className="space-y-4">
                      <div className="px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono flex justify-between items-center">
                        <span className="text-slate-400 uppercase">{currentLanguage === "ar" ? "سجل التسويات الفيدرالية" : "Settlement & Match Ledger"}</span>
                        <span>{reconciliations.length} {currentLanguage === "ar" ? "عمليات مطابقة" : "runs logged"}</span>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono">
                              <th className="p-3 font-semibold">{currentLanguage === "ar" ? "رقم الجلسة" : "Session ID"}</th>
                              <th className="p-3 font-semibold">{currentLanguage === "ar" ? "تاريخ المطابقة" : "Reconciled At"}</th>
                              <th className="p-3 font-semibold">{currentLanguage === "ar" ? "الفترة المالية" : "Fiscal Period"}</th>
                              <th className="p-3 font-semibold text-center">{currentLanguage === "ar" ? "القيود المتطابقة" : "Matched"}</th>
                              <th className="p-3 font-semibold text-center">{currentLanguage === "ar" ? "الفروقات المكتشفة" : "Variances"}</th>
                              <th className="p-3 font-semibold text-right">{currentLanguage === "ar" ? "تفاوت المبالغ" : "Variance SDG"}</th>
                              <th className="p-3 font-semibold">{currentLanguage === "ar" ? "الحالة" : "Status"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                            {reconciliations.map((rec) => (
                              <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                                <td className="p-3 font-bold">{rec.id}</td>
                                <td className="p-3">{new Date(rec.reconciledAt).toLocaleString()}</td>
                                <td className="p-3 text-slate-500">
                                  {new Date(rec.periodStart).toLocaleDateString()} - {new Date(rec.periodEnd).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-center text-emerald-600 font-bold">{rec.matchedCount}</td>
                                <td className="p-3 text-center text-red-600 font-bold">{rec.unmatchedCount}</td>
                                <td className="p-3 text-right font-bold">{rec.discrepancyAmount.toLocaleString()} SDG</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    rec.unmatchedCount === 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                                  }`}>
                                    {rec.unmatchedCount === 0 ? "BALANCED" : "DISCREPANCY"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: mTLS GATEWAY LOGS */}
              {activeTab === "logs" && (
                <motion.div
                  key="logs-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Radio className="h-5 w-5 text-emerald-500" />
                        {currentLanguage === "ar" ? "سجلات أمن البوابة والاتصالات mTLS" : "Mutual TLS (mTLS) Security & Gateway API Logs"}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "مراقبة حية لاتصالات البوابة السيادية مع البنك المركزي الموثقة بشهادات X.509" : "Live stream of server-to-server TLS 1.3 handshakes and cryptographically signed REST payloads"}
                      </p>
                    </div>

                    <div className="space-y-3 font-mono">
                      {gatewayLogs.map((log) => (
                        <div key={log.id} className="bg-slate-950 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                          <div className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-1 text-slate-500">
                            <span className="flex items-center gap-1">
                              <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                              <span>{log.id}</span>
                            </span>
                            <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                            <div className="md:col-span-2">
                              <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">{log.method}</span>
                              <span className="text-slate-400 ml-2">SSLv3/mTLS</span>
                            </div>
                            <div className="md:col-span-10 text-slate-400 break-all">{log.endpoint}</div>
                          </div>

                          <div className="space-y-1 bg-slate-900 p-2.5 rounded-lg border border-slate-800/40">
                            <span className="text-[10px] text-slate-500 block">ENCRYPTED PAYLOAD (AES-256-GCM)</span>
                            <pre className="text-[10px] text-amber-400 overflow-x-auto whitespace-pre-wrap">{log.payload}</pre>
                          </div>

                          <div className="space-y-1 bg-slate-900 p-2.5 rounded-lg border border-slate-800/40">
                            <span className="text-[10px] text-slate-500 block">GATEWAY RESPONSE</span>
                            <pre className="text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">{log.response}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 7: AI FINANCIAL ASSISTANT */}
              {activeTab === "ai" && (
                <motion.div
                  key="ai-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                        {currentLanguage === "ar" ? "مساعد الذكاء الاصطناعي والمستشار المالي" : "Generative AI Predictive Financial Assistant"}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "حلل الرسوم، تفقد مخاطر الاحتيال، واحسب تكلفة التأسيس فورياً عبر محرك Gemini" : "Leverage predictive AI model integration to calculate dynamic tariffs and detect ledger anomalies"}
                      </p>
                    </div>

                    {/* Chat History */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 h-80 overflow-y-auto space-y-3 font-sans">
                      {aiChat.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-emerald-600 text-white rounded-br-none"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-300 dark:border-slate-700"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="flex justify-start">
                          <div className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-2xl text-xs flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Gemini thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage(aiQuery)}
                        placeholder={currentLanguage === "ar" ? "مثال: احسب لي رسوم تأسيس شركة رأسمالها 50 مليون..." : "e.g. Calculate registration fee for card..."}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-sans"
                      />
                      <button
                        onClick={() => handleSendAiMessage(aiQuery)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl cursor-pointer"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Suggested questions */}
                    <div className="flex flex-wrap gap-2 pt-2 text-xs">
                      <button
                        onClick={() => handleSendAiMessage("احسب لي رسوم تأسيس شركة محدودة المسؤولية بالجنيه السوداني")}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "حساب رسوم التأسيس" : "Calculate Incorporation"}
                      </button>
                      <button
                        onClick={() => handleSendAiMessage("ما هي بروتوكولات الأمان المستعملة لتأمين البوابة mTLS؟")}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "بروتوكول mTLS والأمن" : "mTLS Security Specs"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 8: SPECIFICATIONS & master report */}
              {activeTab === "docs" && (
                <motion.div
                  key="docs-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-500" />
                        {currentLanguage === "ar" ? "مجلد الاعتمادات والوثائق الفيدرالية السيادية" : "Sovereign Financial Deliverables & Architecture Specifications"}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentLanguage === "ar" ? "الأرشيف الكامل للـ 14 دراسة، دليل تشغيلي، وهندسة سيادية المعتمدة للمنصة" : "The 14 mandatory enterprise architectural, security, integration, and operational blueprints"}
                      </p>
                    </div>

                    {/* Search & filters */}
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder={currentLanguage === "ar" ? "ابحث في محتوى الـ 14 مستند المعتمد..." : "Search deliverables..."}
                          value={docSearch}
                          onChange={(e) => setDocSearch(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-sans"
                        />
                      </div>
                      <select
                        value={selectedDocCategory}
                        onChange={(e) => setSelectedDocCategory(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-sans"
                      >
                        <option value="All">{currentLanguage === "ar" ? "كل الفئات" : "All Categories"}</option>
                        <option value="Architecture">{currentLanguage === "ar" ? "البنية والهندسة" : "Architecture"}</option>
                        <option value="Security">{currentLanguage === "ar" ? "الأمن والحماية" : "Security"}</option>
                        <option value="Revenue">{currentLanguage === "ar" ? "الإيرادات والجباية" : "Revenue"}</option>
                        <option value="Manual">{currentLanguage === "ar" ? "دليل تشغيلي" : "Operational Manual"}</option>
                        <option value="Disaster Recovery">{currentLanguage === "ar" ? "إدارة الكوارث" : "Disaster Recovery"}</option>
                      </select>
                    </div>

                    {/* Split View: List on left, Document Viewer on right */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                      <div className="md:col-span-5 space-y-2 h-[450px] overflow-y-auto border border-slate-100 dark:border-slate-800 p-2 rounded-2xl">
                        {PAYMENT_DOCS_DATA
                          .filter(doc => selectedDocCategory === "All" || doc.category === selectedDocCategory)
                          .filter(doc => 
                            doc.titleAr.toLowerCase().includes(docSearch.toLowerCase()) ||
                            doc.titleEn.toLowerCase().includes(docSearch.toLowerCase())
                          )
                          .map((doc) => (
                            <button
                              key={doc.id}
                              onClick={() => setSelectedDoc(doc)}
                              className={`w-full text-left p-3 rounded-xl transition-all font-sans text-xs flex flex-col gap-1 cursor-pointer ${
                                selectedDoc?.id === doc.id
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                              }`}
                            >
                              <span className="font-bold">{currentLanguage === "ar" ? doc.titleAr : doc.titleEn}</span>
                              <span className="bg-slate-100 dark:bg-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono block w-max mt-1">{doc.category}</span>
                            </button>
                          ))}
                      </div>

                      {/* Active Document View Panel */}
                      <div className="md:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-[450px] overflow-y-auto space-y-4">
                        {selectedDoc ? (
                          <div className="space-y-4">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-start">
                              <div>
                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Sovereign Deliverable / وثيقة رسمية معتمدة</span>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                                  {currentLanguage === "ar" ? selectedDoc.titleAr : selectedDoc.titleEn}
                                </h3>
                              </div>
                              <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">{selectedDoc.category}</span>
                            </div>

                            <div className="prose prose-sm max-w-none text-xs leading-relaxed font-sans text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                              {currentLanguage === "ar" ? selectedDoc.contentAr : selectedDoc.contentEn}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                            {currentLanguage === "ar" ? "اختر وثيقة من القائمة لعرض المحتوى التفصيلي" : "Select a document from the left panel"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
