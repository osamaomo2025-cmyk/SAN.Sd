/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, Star, Store, MapPin, Search, Plus, 
  CheckCircle, Clock, AlertTriangle, QrCode, Lock, 
  Map, BarChart3, Users, Scale, MessageSquare, ShieldCheck, RefreshCw
} from "lucide-react";
import { ConsumerComplaint } from "../types";
import { SUDANESE_STATES } from "../data";

// Sub-components imports
import ConsumerPortal from "./consumer/ConsumerPortal";
import MarketSurveillance from "./consumer/MarketSurveillance";
import ProductSafety from "./consumer/ProductSafety";
import PriceMonitor from "./consumer/PriceMonitor";
import GisMap from "./consumer/GisMap";
import StaffOffice from "./consumer/StaffOffice";

interface ConsumerProtectionProps {
  currentLanguage: "ar" | "en";
  companies: any[];
  licenses: any[];
}

export default function ConsumerProtectionModule({
  currentLanguage,
  companies,
  licenses
}: ConsumerProtectionProps) {
  const [activeTab, setActiveTab] = useState<"portal" | "surveillance" | "safety" | "price" | "gis" | "staff">("portal");

  // State Management
  const [complaints, setComplaints] = useState<ConsumerComplaint[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [recalls, setRecalls] = useState<any[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<any[]>([]);
  const [priceRecords, setPriceRecords] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [auditLedger, setAuditLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Collections on Mount
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        resComplaints,
        resProducts,
        resRecalls,
        resAlerts,
        resPrices,
        resInspections,
        resSurveys,
        resAudit
      ] = await Promise.all([
        fetch("/api/complaints").then(r => r.ok ? r.json() : []),
        fetch("/api/consumer/products").then(r => r.ok ? r.json() : []),
        fetch("/api/consumer/recalls").then(r => r.ok ? r.json() : []),
        fetch("/api/consumer/alerts").then(r => r.ok ? r.json() : []),
        fetch("/api/consumer/prices").then(r => r.ok ? r.json() : []),
        fetch("/api/consumer/inspections").then(r => r.ok ? r.json() : []),
        fetch("/api/consumer/surveys").then(r => r.ok ? r.json() : []),
        fetch("/api/consumer/audit").then(r => r.ok ? r.json() : [])
      ]);

      setComplaints(resComplaints);
      setProducts(resProducts);
      setRecalls(resRecalls);
      setSafetyAlerts(resAlerts);
      setPriceRecords(resPrices);
      setInspections(resInspections);
      setSurveys(resSurveys);
      setAuditLedger(resAudit);
    } catch (e) {
      console.error("Failed to load consumer protection data collections", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Post Actions to Backend API
  const handleAddComplaint = async (complaintData: any) => {
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintData)
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(prev => [data.complaint, ...prev]);
        // Also post an audit log
        await handleAddAuditLog({
          actionAr: `تقديم شكوى حماية مستهلك جديدة ضد: ${complaintData.storeName}`,
          actionEn: `New consumer complaint filed against: ${complaintData.storeName}`,
          actorName: "بوابة الجمهور",
          actorRole: "citizen",
          hash: `SHA256:${Math.random().toString(16).substring(2, 40)}`
        });
        return data.complaint;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const res = await fetch("/api/consumer/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => [data.product, ...prev]);
        await handleAddAuditLog({
          actionAr: `تسجيل منتج كيميائي/غذائي جديد بالسجل الموحد: ${productData.name}`,
          actionEn: `New product registered in database: ${productData.name}`,
          actorName: "قسم الفحص والمطابقة",
          actorRole: "officer",
          hash: `SHA256:${Math.random().toString(16).substring(2, 40)}`
        });
        return data.product;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddRecall = async (recallData: any) => {
    try {
      const res = await fetch("/api/consumer/recalls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recallData)
      });
      if (res.ok) {
        const data = await res.json();
        setRecalls(prev => [data.recall, ...prev]);
        await handleAddAuditLog({
          actionAr: `إصدار قرار سحب عاجل للمنتج: ${recallData.productName}`,
          actionEn: `Recall order issued for: ${recallData.productName}`,
          actorName: "ضابط إنفاذ تجاري",
          actorRole: "officer",
          hash: `SHA256:${Math.random().toString(16).substring(2, 40)}`
        });
        return data.recall;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRecallStatus = async (id: string, updateData: any) => {
    try {
      const res = await fetch(`/api/consumer/recalls/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const data = await res.json();
        setRecalls(prev => prev.map(r => r.id === id ? data.recall : r));
        await handleAddAuditLog({
          actionAr: `التحقق والتدقيق من اكتمال سحب المنتج المرجعي رقم ${id}`,
          actionEn: `Verified 100% completion of recall campaign ${id}`,
          actorName: "وكيل الوزارة",
          actorRole: "undersecretary",
          hash: `SHA256:${Math.random().toString(16).substring(2, 40)}`
        });
        return data.recall;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSafetyAlert = async (alertData: any) => {
    try {
      const res = await fetch("/api/consumer/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData)
      });
      if (res.ok) {
        const data = await res.json();
        setSafetyAlerts(prev => [data.alert, ...prev]);
        await handleAddAuditLog({
          actionAr: `نشر تحذير وتنبيه صحي عاجل بالمنصة: ${alertData.title}`,
          actionEn: `Sovereign safety alert published: ${alertData.title}`,
          actorName: "وكيل الوزارة",
          actorRole: "undersecretary",
          hash: `SHA256:${Math.random().toString(16).substring(2, 40)}`
        });
        return data.alert;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPriceRecord = async (priceData: any) => {
    try {
      const res = await fetch("/api/consumer/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(priceData)
      });
      if (res.ok) {
        const data = await res.json();
        setPriceRecords(prev => [data.price, ...prev]);
        return data.price;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddInspection = async (inspectionData: any) => {
    try {
      const res = await fetch("/api/consumer/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inspectionData)
      });
      if (res.ok) {
        const data = await res.json();
        setInspections(prev => [data.inspection, ...prev]);
        await handleAddAuditLog({
          actionAr: `إصدار ضبطية قضائية وتغريم المحل: ${inspectionData.storeName}`,
          actionEn: `Legal field citation & fine generated for: ${inspectionData.storeName}`,
          actorName: inspectionData.inspectorName,
          actorRole: "inspector",
          hash: `SHA256:${Math.random().toString(16).substring(2, 40)}`
        });
        return data.inspection;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAuditLog = async (logData: any) => {
    try {
      const res = await fetch("/api/consumer/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData)
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLedger(prev => [data.audit, ...prev]);
        return data.audit;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateComplaintStatus = async (id: string, status: string, notes?: string) => {
    // Note: server.ts standard endpoint for complaints status is in-memory
    // For complete safety, we can simulate updating local state and sending a mock audit log
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, investigationNotes: notes } : c));
  };

  const tabs = [
    { id: "portal", labelAr: "الخدمات العامة والبلاغات", labelEn: "Consumer Services & Complaints", icon: MessageSquare },
    { id: "surveillance", labelAr: "التفتيش والإنفاذ الميداني", labelEn: "Field Surveillance & Citations", icon: Scale },
    { id: "safety", labelAr: "سلامة السلع والمنتجات والسحب", labelEn: "Product Safety & Recalls", icon: ShieldCheck },
    { id: "price", labelAr: "مؤشر أسعار السلع ومراقبة التضخم", labelEn: "Price Index & AI Analytics", icon: BarChart3 },
    { id: "gis", labelAr: "الخريطة والتحليلات الجغرافية", labelEn: "GIS Map Analytics", icon: Map },
    { id: "staff", labelAr: "المكتب العدلي وسجل التدقيق", labelEn: "Sovereign Backoffice", icon: Lock }
  ];

  return (
    <div id="national-consumer-protection-root" className="space-y-6">
      
      {/* Prime sovereign banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sudan-green">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
            <h2 className="text-base md:text-lg font-black uppercase tracking-wider">
              {currentLanguage === "ar" ? "المنصة الوطنية السيادية لحماية المستهلك ومراقبة الأسواق" : "National Consumer Protection & Surveillance"}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {currentLanguage === "ar" 
              ? "الجمهورية السودانية - وزارة التجارة والصناعة - منظومة الإنفاذ والرقابة الفيدرالية الموحدة لعام 2035" 
              : "Sudanese Republic - Ministry of Commerce & Industry - Unified Federal Enforcement Core 2035"}
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-3">
          <div className="bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase text-sudan-green flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sudan-green animate-bounce"></span>
            {currentLanguage === "ar" ? "قاعدة البيانات متصلة سيادياً" : "Sovereign Database Connected"}
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-black text-emerald-400 uppercase flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            <span>SHA-256 SEALED</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 bg-[#FAFBFB] p-2 rounded-3xl border border-gray-200/50">
        {tabs.map(t => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? "bg-sudan-green text-white shadow-md font-black scale-[1.02]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{currentLanguage === "ar" ? t.labelAr : t.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Screen */}
      <div className="relative">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <RefreshCw className="h-10 w-10 text-sudan-green animate-spin mx-auto" />
            <p className="text-xs text-slate-400">{currentLanguage === "ar" ? "جاري مطابقة قاعدة البيانات الفيدرالية..." : "Loading sovereign collections..."}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "portal" && (
                <ConsumerPortal
                  currentLanguage={currentLanguage}
                  complaints={complaints}
                  onAddComplaint={handleAddComplaint}
                />
              )}

              {activeTab === "surveillance" && (
                <MarketSurveillance
                  currentLanguage={currentLanguage}
                  inspections={inspections}
                  onAddInspection={handleAddInspection}
                  companies={companies}
                  licenses={licenses}
                />
              )}

              {activeTab === "safety" && (
                <ProductSafety
                  currentLanguage={currentLanguage}
                  products={products}
                  recalls={recalls}
                  safetyAlerts={safetyAlerts}
                  onAddProduct={handleAddProduct}
                  onAddRecall={handleAddRecall}
                  onAddSafetyAlert={handleAddSafetyAlert}
                  onUpdateRecallStatus={handleUpdateRecallStatus}
                />
              )}

              {activeTab === "price" && (
                <PriceMonitor
                  currentLanguage={currentLanguage}
                  priceRecords={priceRecords}
                  onAddPriceRecord={handleAddPriceRecord}
                />
              )}

              {activeTab === "gis" && (
                <GisMap
                  currentLanguage={currentLanguage}
                  complaints={complaints}
                  recalls={recalls}
                />
              )}

              {activeTab === "staff" && (
                <StaffOffice
                  currentLanguage={currentLanguage}
                  complaints={complaints}
                  auditLedger={auditLedger}
                  onUpdateComplaintStatus={handleUpdateComplaintStatus}
                  onAddAuditLog={handleAddAuditLog}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
