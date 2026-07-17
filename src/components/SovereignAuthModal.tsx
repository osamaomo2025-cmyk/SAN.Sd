/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Sovereign Identity & Unified Authentication Portal
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Lock, Key, UserCheck, UserPlus, ShieldCheck, Mail, Phone, 
  MapPin, Check, Eye, EyeOff, Database, Server, Cpu, FileCheck, 
  AlertCircle, Shield, ArrowUpRight, Fingerprint, Activity, Clock, Zap
} from "lucide-react";
import { UserRole } from "../types";

interface SovereignAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: "ar" | "en";
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

interface SimulatedUser {
  fullName: string;
  email: string;
  nationalId: string;
  phone: string;
  state: string;
  role: string;
  status: "verified" | "pending";
  timestamp: string;
  ipAddress: string;
}

export default function SovereignAuthModal({
  isOpen,
  onClose,
  currentLanguage,
  currentRole,
  onChangeRole
}: SovereignAuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "report" | "explain">("login");
  const [userType, setUserType] = useState<"citizen" | "admin">("citizen");
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regNationalId, setRegNationalId] = useState("");
  const [regState, setRegState] = useState("الخرطوم");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Simulated live registries for the login/registration report
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>([
    {
      fullName: "عمر الفاروق أحمد",
      email: "omar.farouk@sudanagro.sd",
      nationalId: "189204829103",
      phone: "+249912344556",
      state: "الخرطوم",
      role: "مستثمر محلي",
      status: "verified",
      timestamp: "منذ دقيقة",
      ipAddress: "196.29.34.112 (بورتسودان)"
    },
    {
      fullName: "منى محمد عثمان",
      email: "m.osman@industry.gov.sd",
      nationalId: "284019284910",
      phone: "+249122345678",
      state: "الجزيرة",
      role: "الإدارة العامة - مراجع ميزانيات",
      status: "verified",
      timestamp: "منذ 4 دقائق",
      ipAddress: "196.29.32.45 (أم درمان)"
    },
    {
      fullName: "فراس البدري",
      email: "f.badri@niletextile.com",
      nationalId: "195820194820",
      phone: "+249900987654",
      state: "البحر الأحمر",
      role: "مصنع وطني",
      status: "verified",
      timestamp: "منذ 12 دقيقة",
      ipAddress: "196.29.40.89 (بورتسودان)"
    }
  ]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regNationalId || !regPassword) {
      setRegError(currentLanguage === "ar" ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    if (regNationalId.length < 11) {
      setRegError(currentLanguage === "ar" ? "الرقم الوطني يجب أن يتكون من 11 رقم على الأقل" : "National ID must be at least 11 digits");
      return;
    }

    setRegError("");
    setRegSuccess(true);
    
    // Add to simulated log report
    const newUser: SimulatedUser = {
      fullName: regName,
      email: regEmail,
      nationalId: regNationalId,
      phone: regPhone,
      state: regState,
      role: currentLanguage === "ar" ? "مستثمر جديد (بروفايل معتمد)" : "New Verified Investor",
      status: "verified",
      timestamp: "الآن",
      ipAddress: "196.29.32.1 (موقعك الحالي)"
    };
    
    setSimulatedUsers([newUser, ...simulatedUsers]);
    
    // Auto-update parent state role if needed
    onChangeRole(UserRole.BUSINESS_INVESTOR);

    setTimeout(() => {
      setRegSuccess(false);
      setActiveTab("report"); // Switch to report to view registration status
    }, 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError(currentLanguage === "ar" ? "الرجاء إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password");
      return;
    }

    setLoginError("");
    setLoginSuccess(true);

    // Simulate switching active role based on user selected type
    if (userType === "admin") {
      onChangeRole(UserRole.GOVERNMENT_MINISTER);
    } else {
      onChangeRole(UserRole.BUSINESS_INVESTOR);
    }

    // Add login event to history logs
    const newLog: SimulatedUser = {
      fullName: userType === "admin" 
        ? (currentLanguage === "ar" ? "سعادة الوزير القومي" : "HE Sovereign Minister") 
        : (currentLanguage === "ar" ? "مستثمر معتمد" : "Verified Investor"),
      email: loginEmail,
      nationalId: userType === "admin" ? "000000000001" : "194029481029",
      phone: userType === "admin" ? "+249111111111" : "+249912345678",
      state: "الخرطوم",
      role: userType === "admin" ? "الإدارة القومية العامة" : "مستثمر معتمد",
      status: "verified",
      timestamp: "الآن",
      ipAddress: "196.29.32.1 (موقعك الحالي)"
    };

    setSimulatedUsers([newLog, ...simulatedUsers]);

    setTimeout(() => {
      setLoginSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 font-sans text-slate-800"
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-sudan-green to-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Fingerprint className="w-6 h-6 text-sudan-gold" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-extrabold" style={{ fontFamily: "Cairo, sans-serif" }}>
                {currentLanguage === "ar" ? "بوابة الهوية الرقمية الموحدة والتسجيل السيادي" : "Unified Digital Identity & Sovereign Auth Portal"}
              </h2>
              <p className="text-[10px] text-emerald-100 font-bold">
                {currentLanguage === "ar" ? "وزارة التجارة والصناعة • جمهورية السودان" : "Ministry of Commerce & Industry • Republic of Sudan"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-100 bg-slate-50 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 px-4 border-b-2 transition-all flex items-center justify-center gap-2 shrink-0 ${
              activeTab === "login" 
                ? "border-sudan-green text-sudan-green bg-white font-black" 
                : "border-transparent text-gray-500 hover:text-slate-800"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{currentLanguage === "ar" ? "تسجيل الدخول" : "Sovereign Login"}</span>
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 px-4 border-b-2 transition-all flex items-center justify-center gap-2 shrink-0 ${
              activeTab === "register" 
                ? "border-sudan-green text-sudan-green bg-white font-black" 
                : "border-transparent text-gray-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{currentLanguage === "ar" ? "حساب مستخدم جديد" : "New User Registration"}</span>
          </button>
          <button
            onClick={() => setActiveTab("explain")}
            className={`flex-1 py-3 px-4 border-b-2 transition-all flex items-center justify-center gap-2 shrink-0 ${
              activeTab === "explain" 
                ? "border-sudan-green text-sudan-green bg-white font-black" 
                : "border-transparent text-gray-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentLanguage === "ar" ? "ما معنى بروفايل معتمد؟" : "What is a Verified Profile?"}</span>
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`flex-1 py-3 px-4 border-b-2 transition-all flex items-center justify-center gap-2 shrink-0 ${
              activeTab === "report" 
                ? "border-sudan-green text-sudan-green bg-white font-black" 
                : "border-transparent text-gray-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{currentLanguage === "ar" ? "تقرير عمليات الدخول والتحقق" : "Live Session & Verification Audit"}</span>
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto">
          
          {/* Main Workspace Column (Takes 2 Cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* TAB 1: LOGIN */}
            {activeTab === "login" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-800" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "تسجيل الدخول لبوابة الخدمات السيادية" : "Access the Sovereign Service Portal"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === "ar" 
                      ? "قم بتسجيل الدخول كأحد المواطنين أو كعضو في الإدارة العامة الفيدرالية لمتابعة المعاملات الحكومية." 
                      : "Login as a citizen or as part of the General Administration to administer and monitor state registries."}
                  </p>
                </div>

                {/* User Type Selector */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setUserType("citizen")}
                    className={`py-2 px-4 rounded-lg transition-all ${
                      userType === "citizen" ? "bg-white text-sudan-green shadow-xs" : "text-gray-500 hover:text-slate-800"
                    }`}
                  >
                    {currentLanguage === "ar" ? "مواطن / مستثمر معتمد" : "Citizen / Verified Investor"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("admin")}
                    className={`py-2 px-4 rounded-lg transition-all ${
                      userType === "admin" ? "bg-white text-sudan-green shadow-xs" : "text-gray-500 hover:text-slate-800"
                    }`}
                  >
                    {currentLanguage === "ar" ? "الإدارة العامة / موظف سيادي" : "General Administration / Official"}
                  </button>
                </div>

                {loginSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
                    <div className="h-12 w-12 bg-sudan-green text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "تم تسجيل الدخول بنجاح!" : "Login Successful!"}</h4>
                    <p className="text-xs text-gray-600">
                      {currentLanguage === "ar" 
                        ? "جاري توجيهك إلى لوحة التحكم الفيدرالية المخصصة لصلاحياتك..." 
                        : "Directing you to the sovereign dashboard mapped to your role permissions..."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        {currentLanguage === "ar" ? "البريد الإلكتروني المعتمد" : "Verified Corporate/Citizen Email"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="yourname@domain.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                          {currentLanguage === "ar" ? "كلمة المرور المشفرة" : "Encrypted Security Password"}
                        </label>
                        <a href="#" className="text-[10px] text-sudan-green font-bold hover:underline">
                          {currentLanguage === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-gray-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <div className="p-3 bg-rose-50 border border-rose-150 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>
                        {userType === "admin" 
                          ? (currentLanguage === "ar" ? "تسجيل دخول كإدارة عامة سيادية" : "Sovereign Admin Sign In")
                          : (currentLanguage === "ar" ? "تسجيل دخول كمواطن / مستثمر معتمد" : "Citizen / Investor Sign In")}
                      </span>
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-[11px] text-gray-500">
                        {currentLanguage === "ar" ? "ليس لديك حساب معتمد؟" : "Don't have a verified account?"}{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("register")}
                          className="text-sudan-green font-extrabold hover:underline"
                        >
                          {currentLanguage === "ar" ? "سجل مستخدماً جديداً الآن" : "Register a new user now"}
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === "register" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-800" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "تسجيل مستخدم جديد وطلب ربط الهوية" : "Register New Account & Link Digital ID"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === "ar" 
                      ? "أنشئ حساباً تجارياً وسيتم التحقق منه تلقائياً وربطه بالرقم الوطني المدني لمنحك بروفايل معتمد." 
                      : "Incorporate a digital profile, verified and linked directly with the civil registry to issue a Verified Profile."}
                  </p>
                </div>

                {regSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
                    <div className="h-12 w-12 bg-sudan-green text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "تم التسجيل بنجاح في السجل الفيدرالي!" : "Registered Successfully in Federal Registry!"}</h4>
                    <p className="text-xs text-gray-600">
                      {currentLanguage === "ar" 
                        ? "تم التحقق من رقمك الوطني وربط حسابك كـ 'بروفايل معتمد' جاهز لإجراء المعاملات..." 
                        : "National ID verified. Your 'Verified Profile' is ready to launch business transactions..."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        {currentLanguage === "ar" ? "الاسم الكامل (مطابق للهوية الوطنية)" : "Full Name (Matches National ID)"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={currentLanguage === "ar" ? "مثال: عثمان علي محمد عبد الله" : "e.g. Osman Ali Mohamed Abdallah"}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        {currentLanguage === "ar" ? "البريد الإلكتروني المعتمد" : "Verified Corporate/Citizen Email"}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@domain.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        {currentLanguage === "ar" ? "رقم الهاتف الموثق" : "Verified Phone Number"}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+249912345678"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        {currentLanguage === "ar" ? "الرقم الوطني السوداني (11 خانة)" : "Sudanese National ID (11 Digits)"}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        placeholder="189XXXXXXXX"
                        value={regNationalId}
                        onChange={(e) => setRegNationalId(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        {currentLanguage === "ar" ? "الولاية المقيمة" : "Residential/Industrial State"}
                      </label>
                      <select
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800 font-bold"
                      >
                        <option value="الخرطوم">الخرطوم</option>
                        <option value="البحر الأحمر">البحر الأحمر</option>
                        <option value="الجزيرة">الجزيرة</option>
                        <option value="شمال كردفان">شمال كردفان</option>
                        <option value="القضارف">القضارف</option>
                        <option value="نهر النيل">نهر النيل</option>
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        {currentLanguage === "ar" ? "كلمة المرور المشفرة" : "Sovereign Access Password"}
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white text-slate-800"
                      />
                    </div>

                    {regError && (
                      <div className="md:col-span-2 p-3 bg-rose-50 border border-rose-150 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4.5 h-4.5" />
                        <span>{currentLanguage === "ar" ? "تسجيل جديد وتفعيل الهوية الفيدرالية" : "Register and Activate Sovereign Identity"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: EXPLAIN "PROFAILE MOATAMAD" */}
            {activeTab === "explain" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="bg-sudan-gold/15 text-sudan-gold border border-sudan-gold/30 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    {currentLanguage === "ar" ? "توضيح سيادي" : "Sovereign Clarification"}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 pt-1" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "ماذا يعني بروفايل معتمد؟" : "What does a Verified Profile mean?"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === "ar" 
                      ? "البروفايل المعتمد هو حجر الزاوية في التحول الرقمي بوزارة التجارة والصناعة بجمهورية السودان." 
                      : "A Verified Profile is the bedrock of digital services in the Ministry of Commerce & Industry of the Republic of Sudan."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex gap-3">
                    <div className="h-10 w-10 bg-sudan-green/10 text-sudan-green rounded-xl flex items-center justify-center shrink-0">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {currentLanguage === "ar" ? "الربط المباشر مع السجل المدني" : "Civil Registry Integration"}
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-normal">
                        {currentLanguage === "ar" 
                          ? "يتم فحص حسابك ومطابقته فورياً مع قاعدة بيانات السجل المدني الفيدرالي بالرقم الوطني لتأكيد هويتك الحقيقية وقانونية أعمالك." 
                          : "Your profile is instantly matched with the Federal Civil Registry database using your National ID to confirm your legal trade status."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex gap-3">
                    <div className="h-10 w-10 bg-sudan-green/10 text-sudan-green rounded-xl flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {currentLanguage === "ar" ? "التوقيع الرقمي السيادي" : "Sovereign Digital Signature"}
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-normal">
                        {currentLanguage === "ar" 
                          ? "توقيعك على عقود التأسيس، رخص الاستيراد والتصدير، وشهادات المنشأ يصبح ملزماً قانونياً بنسبة 100% أمام كافة المحاكم والمصارف الفيدرالية." 
                          : "Any signature on trade licenses, incorporations, or origins certificates is 100% legally binding across federal courts & banks."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex gap-3">
                    <div className="h-10 w-10 bg-sudan-green/10 text-sudan-green rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {currentLanguage === "ar" ? "الأمان ومكافحة التزوير والاحتيال" : "Anti-Fraud & Security Core"}
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-normal">
                        {currentLanguage === "ar" 
                          ? "استخدام تقنيات التشفير المتقدمة لمنع انتحال الشخصيات التجارية أو التلاعب في بيانات السجل التجاري للشركات السودانية." 
                          : "Advanced encryption eliminates business identity theft or manipulation of commercial registry credentials."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex gap-3">
                    <div className="h-10 w-10 bg-sudan-green/10 text-sudan-green rounded-xl flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {currentLanguage === "ar" ? "الوصول الفوري للخدمات دون مراجعة ورقية" : "Instant Zero-Paper Access"}
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-normal">
                        {currentLanguage === "ar" 
                          ? "أداء وتجديد رخصتك وتأسيس الشركات واستيراد وتصدير الشحنات بضغطة زر واحدة دون الحاجة لزيارة مباني الوزارات أو المكاتب الحكومية." 
                          : "Renew, incorporate, or dispatch trade cargo with a single click without ever stepping foot inside a physical government office."}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl text-[11px] text-emerald-900 leading-relaxed space-y-1">
                  <p className="font-extrabold">{currentLanguage === "ar" ? "✔ هل حسابك الحالي معتمد؟" : "✔ Is your current account verified?"}</p>
                  <p>
                    {currentLanguage === "ar" 
                      ? "نعم، النظام يقوم تلقائياً بتهيئة حساب مسبق معتمد وموثق لك كـ 'بروفايل معتمد' لمساعدتك في اختبار وتجربة كافة الميزات بكفاءة فائقة." 
                      : "Yes! The system automatically provisions a pre-approved digital credentials profile for you, enabling seamless testing of all capabilities."}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: AUDIT REPORT */}
            {activeTab === "report" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-800" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "تقرير عمليات تسجيل الدخول والإدارة العامة" : "Sovereign Auth Sessions & Admin Audit Logs"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === "ar" 
                      ? "تقرير حي من خوادم السجل والتحقق الفيدرالي لمراقبة الجلسات النشطة وعمليات التحقق الرقمي." 
                      : "Live federal logs tracking user registrations, session validations, and civil status checks."}
                  </p>
                </div>

                {/* Audit Grid Statistics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F4F6F5] p-3 rounded-2xl border border-gray-150 text-center space-y-1">
                    <p className="text-sm font-black text-sudan-green font-mono">1,382</p>
                    <p className="text-[9px] text-gray-500 font-bold">{currentLanguage === "ar" ? "جلسة نشطة اليوم" : "Active Sessions Today"}</p>
                  </div>
                  <div className="bg-[#F4F6F5] p-3 rounded-2xl border border-gray-150 text-center space-y-1">
                    <p className="text-sm font-black text-sudan-gold font-mono">100%</p>
                    <p className="text-[9px] text-gray-500 font-bold">{currentLanguage === "ar" ? "نسبة تطابق السجل المدني" : "Civil Registry Match %"}</p>
                  </div>
                  <div className="bg-[#F4F6F5] p-3 rounded-2xl border border-gray-150 text-center space-y-1">
                    <p className="text-sm font-black text-emerald-600 font-mono">0.02ms</p>
                    <p className="text-[9px] text-gray-500 font-bold">{currentLanguage === "ar" ? "سرعة التحقق الفيدرالي" : "Federal Match Latency"}</p>
                  </div>
                </div>

                {/* Active Session Logs */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    {currentLanguage === "ar" ? "آخر العمليات المسجلة في النظام" : "Most Recent Security Operations"}
                  </h4>

                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-slate-50">
                    {simulatedUsers.map((user, idx) => (
                      <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-all">
                        <div className="flex gap-3 items-start">
                          <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100">
                            <UserCheck className="w-4.5 h-4.5 text-sudan-green" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-black text-slate-800">{user.fullName}</p>
                              <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {user.role}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono mt-1">
                              {user.email} • {currentLanguage === "ar" ? "الرقم الوطني:" : "National ID:"} {user.nationalId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:text-right gap-4">
                          <div className="text-left md:text-right">
                            <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1 md:justify-end">
                              <Server className="w-3 h-3 text-gray-400" />
                              <span>{user.ipAddress}</span>
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1 md:justify-end">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>{user.timestamp}</span>
                            </p>
                          </div>
                          <span className="bg-emerald-50 text-sudan-green text-[9px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{currentLanguage === "ar" ? "معتمد" : "Verified"}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Explanatory & System Status Column (1 Col) */}
          <div className="space-y-6 lg:border-l lg:border-gray-100 lg:pl-6">
            
            {/* System Status Panel */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h4 className="text-xs font-extrabold text-white" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {currentLanguage === "ar" ? "حالة الخدمة والتحقق" : "Federated Node Health"}
                </h4>
              </div>

              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Civil DB Endpoint</span>
                  <span className="text-emerald-400">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Cryptographic Core</span>
                  <span className="text-emerald-400">SECURE (SHA-256)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">National SSO Node</span>
                  <span className="text-emerald-400">SUDAN-GATEWAY-1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Signature Authority</span>
                  <span className="text-sudan-gold font-bold">APPROVED</span>
                </div>
              </div>
            </div>

            {/* Quick Informational Cards */}
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-150 space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-800">
                {currentLanguage === "ar" ? "خطوات الاعتماد الفيدرالي:" : "Verification Steps:"}
              </h4>
              <ul className="space-y-2 text-gray-600 text-[11px] list-disc list-inside">
                <li>
                  {currentLanguage === "ar" ? "التسجيل بالرقم الوطني" : "Input Sudanese National ID"}
                </li>
                <li>
                  {currentLanguage === "ar" ? "المطابقة الفورية مع السجل المدني" : "Instant Civil Registry matching"}
                </li>
                <li>
                  {currentLanguage === "ar" ? "إصدار شهادة التوقيع الرقمي" : "Issue Sovereign Digital Certificate"}
                </li>
                <li>
                  {currentLanguage === "ar" ? "تفعيل حساب بروفايل معتمد" : "Activate Verified Profile status"}
                </li>
              </ul>
            </div>

            <div className="bg-sudan-gold/10 p-4 rounded-2xl border border-sudan-gold/20 space-y-2">
              <div className="flex items-center gap-1.5 text-sudan-gold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <h4 className="text-[11px] font-black uppercase">
                  {currentLanguage === "ar" ? "ملاحظة أمان هام" : "Important Security Note"}
                </h4>
              </div>
              <p className="text-[10px] text-gray-700 leading-normal">
                {currentLanguage === "ar" 
                  ? "جميع معاملاتك الرقمية وكلمات المرور مشفرة ومؤمنة بالكامل طبقاً لقانون المعاملات الإلكترونية بجمهورية السودان لعام 2026." 
                  : "All transactions and cryptographic passes are secure as per the electronic acts framework (2026)."}
              </p>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-xs">
          <p className="text-[10px] text-gray-400 font-mono">
            SECURE ACCESS PORTAL • SD-SSO-V2
          </p>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            {currentLanguage === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
