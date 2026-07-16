/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Building2, Cpu, FileText, Compass, Bot, 
  UserCheck, AlertCircle, Sparkles, LayoutDashboard, Database, ShieldAlert 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Imports of Modular Commerce subcomponents
import { CommerceUserRole, DigitalBusiness, SmeProgram, StartupRecord, MarketplaceProduct, ElectronicInvoice, DigitalContract, DisputeRecord, ShipmentRecord } from "./commerce/CommerceTypes";
import { initialDigitalBusinesses, initialSmePrograms, initialStartupRecords, initialMarketplaceProducts, initialInvoices, initialContracts, initialDisputes, initialShipments } from "./commerce/CommerceMockData";
import CommerceRegistry from "./commerce/CommerceRegistry";
import CommerceMarketplace from "./commerce/CommerceMarketplace";
import SmePrograms from "./commerce/SmePrograms";
import CommerceServices from "./commerce/CommerceServices";
import CommerceAnalytics from "./commerce/CommerceAnalytics";
import CommerceAdvisor from "./commerce/CommerceAdvisor";

interface DigitalCommercePlatformProps {
  currentLanguage: "ar" | "en";
}

export default function DigitalCommercePlatform({ currentLanguage }: DigitalCommercePlatformProps) {
  const [activeTab, setActiveTab] = useState<"registry" | "marketplace" | "sme" | "services" | "analytics" | "advisor">("registry");
  const [userRole, setUserRole] = useState<CommerceUserRole>(CommerceUserRole.GOVERNMENT_OFFICER);

  // States with localStorage synchronization
  const [businesses, setBusinesses] = useState<DigitalBusiness[]>([]);
  const [programs, setPrograms] = useState<SmeProgram[]>([]);
  const [startups, setStartups] = useState<StartupRecord[]>([]);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [invoices, setInvoices] = useState<ElectronicInvoice[]>([]);
  const [contracts, setContracts] = useState<DigitalContract[]>([]);
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);

  // Hydrate states on mount
  useEffect(() => {
    const getOrSetLocal = (key: string, defaultVal: any) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return defaultVal;
        }
      }
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    };

    setBusinesses(getOrSetLocal("com_businesses", initialDigitalBusinesses));
    setPrograms(getOrSetLocal("com_programs", initialSmePrograms));
    setStartups(getOrSetLocal("com_startups", initialStartupRecords));
    setProducts(getOrSetLocal("com_products", initialMarketplaceProducts));
    setInvoices(getOrSetLocal("com_invoices", initialInvoices));
    setContracts(getOrSetLocal("com_contracts", initialContracts));
    setDisputes(getOrSetLocal("com_disputes", initialDisputes));
    setShipments(getOrSetLocal("com_shipments", initialShipments));
  }, []);

  // Sync state changes to localStorage
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // State update handlers
  const handleAddBusiness = (newBiz: DigitalBusiness) => {
    const updated = [newBiz, ...businesses];
    setBusinesses(updated);
    saveState("com_businesses", updated);
  };

  const handleUpdateBusinessStatus = (id: string, status: any) => {
    const updated = businesses.map(b => b.id === id ? { ...b, status } : b);
    setBusinesses(updated);
    saveState("com_businesses", updated);
  };

  const handleUpdateBusinessLogs = (id: string, log: any) => {
    const updated = businesses.map(b => b.id === id ? { ...b, auditLogs: [log, ...b.auditLogs] } : b);
    setBusinesses(updated);
    saveState("com_businesses", updated);
  };

  const handleAddProduct = (newProd: MarketplaceProduct) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    saveState("com_products", updated);
  };

  const handleUpdateProductStatus = (id: string, status: any) => {
    const updated = products.map(p => p.id === id ? { ...p, status } : p);
    setProducts(updated);
    saveState("com_products", updated);
  };

  const handleAddStartup = (newStartup: StartupRecord) => {
    const updated = [newStartup, ...startups];
    setStartups(updated);
    saveState("com_startups", updated);
  };

  const handleApplyProgram = (progId: string) => {
    const updated = programs.map(p => p.id === progId ? { ...p, registeredCount: p.registeredCount + 1 } : p);
    setPrograms(updated);
    saveState("com_programs", updated);
  };

  const handleAddInvoice = (newInv: ElectronicInvoice) => {
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    saveState("com_invoices", updated);
  };

  const handleAddDispute = (newDisp: DisputeRecord) => {
    const updated = [newDisp, ...disputes];
    setDisputes(updated);
    saveState("com_disputes", updated);
  };

  const handleResolveDispute = (id: string, resolutionAr: string, resolutionEn: string) => {
    const updated = disputes.map(d => d.id === id ? { ...d, status: "resolved" as any, resolutionAr, resolutionEn } : d);
    setDisputes(updated);
    saveState("com_disputes", updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Title Header Section */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,114,41,0.2),transparent_60%)] pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-sudan-green/20 text-sudan-green border border-sudan-green/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{currentLanguage === "ar" ? "رؤية السودان الرقمي ٢٠٣٥" : "Sudan Vision 2035"}</span>
          </div>
          <h2 className="font-extrabold text-xl md:text-2xl tracking-tight text-[#F8FAFC]">
            {currentLanguage === "ar" 
              ? "البوابة الوطنية للتجارة الرقمية وتطوير المشاريع الصغيرة والناشئة" 
              : "National Digital Commerce & SME Development Platform"}
          </h2>
          <p className="text-slate-400 text-xs font-semibold max-w-3xl leading-relaxed">
            {currentLanguage === "ar" 
              ? "منظومة حوكمة سيادية موحدة متكاملة مع السجل التجاري، بوابات الدفع الوطنية، حماية المستهلك، وسلاسل الإمداد الإقليمية (الكوميسا)."
              : "Sovereign governance ecosystem integrated with Commercial Registry, National Payment Gateways, Consumer Escrow, and COMESA Logistics networks."}
          </p>
        </div>
      </div>

      {/* Role-Based Selector Switcher Header */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm space-y-3.5">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4.5 w-4.5 text-sudan-gold" />
          <h4 className="font-extrabold text-slate-800 text-xs md:text-sm uppercase tracking-wider">
            {currentLanguage === "ar" ? "نظام حوكمة الصلاحيات والأدوار الموحد" : "Unified Identity & Role-Based Access Control"}
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: CommerceUserRole.GOVERNMENT_OFFICER, labelAr: "مفتش وزارة الفيدرالي", labelEn: "Federal Commerce Officer" },
            { id: CommerceUserRole.SME_OWNER, labelAr: "صاحب مشروع صغير (SME)", labelEn: "SME Trade Owner" },
            { id: CommerceUserRole.STARTUP_FOUNDER, labelAr: "مؤسس شركة تقنية ناشئة", labelEn: "Startup Tech Founder" },
            { id: CommerceUserRole.CONSUMER, labelAr: "المواطن والمستهلك المشتري", labelEn: "Sovereign Consumer" }
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setUserRole(role.id)}
              className={`px-3.5 py-2 rounded-2xl text-[10px] md:text-xs font-bold transition-all cursor-pointer border ${
                userRole === role.id 
                  ? "bg-slate-900 border-slate-900 text-[#FFD700] shadow-sm font-extrabold" 
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
              }`}
            >
              {currentLanguage === "ar" ? role.labelAr : role.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Core Tab-Based Navigation Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Tab Selection Sidebar (Left-hand rail) */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-4 shadow-xs space-y-1.5">
          {[
            { id: "registry", labelAr: "السجل الرقمي الموحد للأعمال", labelEn: "Digital Business Registry", icon: Building2 },
            { id: "marketplace", labelAr: "السوق الرقمي الوطني للمنتجات", labelEn: "Sovereign Marketplace", icon: ShoppingBag },
            { id: "sme", labelAr: "تنمية وحواضن ريادة المشاريع", labelEn: "SME & Startups Portal", icon: Cpu },
            { id: "services", labelAr: "الفواتير والعقود واللوجستيات", labelEn: "Integrated Services", icon: FileText },
            { id: "analytics", labelAr: "الخرائط الاقتصادية والتحليلات", labelEn: "GIS Map & Analytics", icon: Compass },
            { id: "advisor", labelAr: "مستشار الذكاء الاصطناعي التجاري", labelEn: "AI Commerce Advisor", icon: Bot }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-right lg:text-right flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] md:text-xs font-bold transition-all border cursor-pointer uppercase ${
                  isSelected 
                    ? "bg-sudan-green text-white border-sudan-green font-extrabold shadow-sm" 
                    : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <IconComponent className="h-4.5 w-4.5 shrink-0" />
                <span className="truncate">{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Output Panels */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "registry" && (
                <CommerceRegistry
                  currentLanguage={currentLanguage}
                  businesses={businesses}
                  onAddBusiness={handleAddBusiness}
                  onUpdateStatus={handleUpdateBusinessStatus}
                  onUpdateLogs={handleUpdateBusinessLogs}
                  userRole={userRole}
                />
              )}

              {activeTab === "marketplace" && (
                <CommerceMarketplace
                  currentLanguage={currentLanguage}
                  products={products}
                  businesses={businesses}
                  onAddProduct={handleAddProduct}
                  onUpdateProductStatus={handleUpdateProductStatus}
                  userRole={userRole}
                />
              )}

              {activeTab === "sme" && (
                <SmePrograms
                  currentLanguage={currentLanguage}
                  programs={programs}
                  startups={startups}
                  onAddStartup={handleAddStartup}
                  onApplyProgram={handleApplyProgram}
                  userRole={userRole}
                />
              )}

              {activeTab === "services" && (
                <CommerceServices
                  currentLanguage={currentLanguage}
                  invoices={invoices}
                  contracts={contracts}
                  disputes={disputes}
                  shipments={shipments}
                  businesses={businesses}
                  onAddInvoice={handleAddInvoice}
                  onAddDispute={handleAddDispute}
                  onResolveDispute={handleResolveDispute}
                  userRole={userRole}
                />
              )}

              {activeTab === "analytics" && (
                <CommerceAnalytics
                  currentLanguage={currentLanguage}
                  businesses={businesses}
                  startups={startups}
                />
              )}

              {activeTab === "advisor" && (
                <CommerceAdvisor
                  currentLanguage={currentLanguage}
                  businesses={businesses}
                  userRole={userRole}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
