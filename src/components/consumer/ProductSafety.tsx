/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, AlertTriangle, AlertCircle, Plus, 
  CheckCircle, RefreshCw, BarChart3, Search, QrCode, FileText
} from "lucide-react";

interface ProductSafetyProps {
  currentLanguage: "ar" | "en";
  products: any[];
  recalls: any[];
  safetyAlerts: any[];
  onAddProduct: (productData: any) => Promise<any>;
  onAddRecall: (recallData: any) => Promise<any>;
  onAddSafetyAlert: (alertData: any) => Promise<any>;
  onUpdateRecallStatus: (id: string, updateData: any) => Promise<any>;
}

export default function ProductSafety({
  currentLanguage,
  products,
  recalls,
  safetyAlerts,
  onAddProduct,
  onAddRecall,
  onAddSafetyAlert,
  onUpdateRecallStatus
}: ProductSafetyProps) {
  const [activeTab, setActiveTab] = useState<"recalls" | "alerts" | "products">("recalls");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);

  // New Product Form
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("food");
  const [prodHsCode, setProdHsCode] = useState("");
  const [prodBarcode, setProdBarcode] = useState("");
  const [prodManufacturer, setProdManufacturer] = useState("");
  const [prodRisk, setProdRisk] = useState("low");

  // New Alert Form
  const [alertTitle, setAlertTitle] = useState("");
  const [alertCategory, setAlertCategory] = useState("food");
  const [alertSeverity, setAlertSeverity] = useState("high");
  const [alertDetails, setAlertDetails] = useState("");

  // New Recall Form
  const [recProductName, setRecProductName] = useState("");
  const [recCategory, setRecCategory] = useState("food");
  const [recHazard, setRecHazard] = useState("");
  const [recUnitsSold, setRecUnitsSold] = useState(1000);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddProduct({
        name: prodName,
        hsCode: prodHsCode || "N/A",
        category: prodCategory,
        riskRating: prodRisk,
        status: "certified",
        barcode: prodBarcode || `628${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        manufacturer: prodManufacturer
      });
      setIsProductModalOpen(false);
      setProdName("");
      setProdHsCode("");
      setProdBarcode("");
      setProdManufacturer("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddSafetyAlert({
        title: alertTitle,
        category: alertCategory,
        severity: alertSeverity,
        details: alertDetails
      });
      setIsAlertModalOpen(false);
      setAlertTitle("");
      setAlertDetails("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddRecall({
        productName: recProductName,
        category: recCategory,
        hazard: recHazard,
        unitsSold: recUnitsSold,
        unitsRecalled: 0,
        status: "active"
      });
      setIsRecallModalOpen(false);
      setRecProductName("");
      setRecHazard("");
      setRecUnitsSold(1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyRecallCompletion = async (id: string, units: number) => {
    try {
      await onUpdateRecallStatus(id, { unitsRecalled: units, status: "completed" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="product-safety-tab" className="space-y-6">
      
      {/* Sub Tabs Toggle */}
      <div className="bg-white p-3 rounded-3xl border border-gray-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("recalls")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === "recalls" ? "bg-sudan-green text-white shadow" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {currentLanguage === "ar" ? "قائمة سحب المنتجات والسلع" : "Product Recall Center"}
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === "alerts" ? "bg-sudan-green text-white shadow" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {currentLanguage === "ar" ? "التنبيهات والتحذيرات الفنية" : "Sovereign Safety Alerts"}
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === "products" ? "bg-sudan-green text-white shadow" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {currentLanguage === "ar" ? "تسجيل وفحص المنتجات" : "Product Registry Database"}
        </button>
      </div>

      {/* Recalls Workspace */}
      <AnimatePresence mode="wait">
        {activeTab === "recalls" && (
          <motion.div
            key="recalls-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-sudan-gold" />
                  {currentLanguage === "ar" ? "منصة سحب المنتجات وحظر التداول" : "Sovereign Recall Enforcement"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {currentLanguage === "ar" 
                    ? "سحب فوري للسلع التي تم التحقق من تلوثها أو عدم مطابقتها للمواصفات القياسية السيادية السودانية لعام 2035" 
                    : "Track active recalls, recall completions, and collect compliance verification logs."}
                </p>
              </div>
              <button
                onClick={() => setIsRecallModalOpen(true)}
                className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow transition-all"
              >
                {currentLanguage === "ar" ? "إنشاء قرار سحب منتج" : "Issue New Product Recall"}
              </button>
            </div>

            {/* Recalls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recalls.map(rec => {
                const completionRate = rec.unitsSold > 0 ? Math.round((rec.unitsRecalled / rec.unitsSold) * 100) : 0;
                return (
                  <div key={rec.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          rec.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                        }`}>
                          {rec.status === "completed" ? (currentLanguage === "ar" ? "مكتمل التدقيق والتحقق" : "Verified Completed") : (currentLanguage === "ar" ? "قيد السحب الفوري" : "Enforcement Active")}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {rec.id}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">{rec.productName}</h4>
                      <p className="text-[11px] text-rose-700 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 italic leading-relaxed">
                        {rec.hazard}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">{currentLanguage === "ar" ? "معدل الإسترجاع الفعلي" : "Recall Completion"}</span>
                        <span className="font-bold text-slate-800">{completionRate}% ({rec.unitsRecalled.toLocaleString()} / {rec.unitsSold.toLocaleString()})</span>
                      </div>
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${completionRate >= 90 ? "bg-emerald-500" : "bg-sudan-gold"}`}
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>

                      {rec.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() => handleVerifyRecallCompletion(rec.id, rec.unitsSold)}
                          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black py-2 rounded-xl transition-all cursor-pointer text-center mt-2"
                        >
                          {currentLanguage === "ar" ? "التحقق والتدقيق من سحب كامل الكمية سيادياً" : "Verify 100% Completion"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "alerts" && (
          <motion.div
            key="alerts-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  {currentLanguage === "ar" ? "التنبيهات الفنية والتحذيرات العاجلة" : "Sovereign Market Safety Alerts"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {currentLanguage === "ar" 
                    ? "إصدار وتعميم فوري للتحذيرات الصحية والفنية لجميع منافذ البيع والجمهور" 
                    : "Urgent health and technical alerts issued directly by the Ministry to protect citizens."}
                </p>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow transition-all"
              >
                {currentLanguage === "ar" ? "نشر تحذير عاجل" : "Issue New Safety Alert"}
              </button>
            </div>

            {/* Alerts List */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
              {safetyAlerts.map(alert => (
                <div key={alert.id} className="p-5 flex gap-4 items-start hover:bg-slate-50 transition-all">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    alert.severity === "high" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        alert.severity === "high" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {alert.severity === "high" ? (currentLanguage === "ar" ? "عاجل جداً" : "High Severity") : (currentLanguage === "ar" ? "تحذير متوسط" : "Medium Severity")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(alert.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">{alert.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{alert.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "products" && (
          <motion.div
            key="products-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-sudan-green" />
                  {currentLanguage === "ar" ? "قاعدة بيانات مطابقة وفحص المنتجات" : "Product Compliance Database"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {currentLanguage === "ar" 
                    ? "قاعدة بيانات سيادية مدمجة لفحص شهادات المطابقة والباركود للسلع الوطنية والمستوردة" 
                    : "Central register of all cleared, tested, and certified commodities in Sudan."}
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow transition-all"
              >
                {currentLanguage === "ar" ? "تسجيل وفحص منتج جديد" : "Register Compliant Product"}
              </button>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{currentLanguage === "ar" ? "السلع والمنتجات المسجلة والمطابقة" : "Certified Commodities Registry"}</h4>
              </div>

              <div className="divide-y divide-gray-100">
                {products.map(p => (
                  <div key={p.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-all">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {currentLanguage === "ar" ? "مطابق سيادياً" : "Certified Compliant"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">HS Code: {p.hsCode}</span>
                      </div>
                      <h5 className="font-extrabold text-slate-800 text-xs md:text-sm">{p.name}</h5>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        <p>{currentLanguage === "ar" ? `جهة التصنيع: ${p.manufacturer}` : `Mfg: ${p.manufacturer}`}</p>
                        <p className="font-mono flex items-center gap-1">
                          <QrCode className="h-3.5 w-3.5 text-slate-400" />
                          <span>EAN: {p.barcode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1 border-t md:border-t-0 pt-2 md:pt-0 self-stretch md:self-auto flex md:flex-col justify-between items-center md:items-end">
                      <span className="text-[10px] text-slate-400">{currentLanguage === "ar" ? "مستوى المخاطر" : "Risk Profile"}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        p.riskRating === "high" ? "bg-red-100 text-red-800" : p.riskRating === "medium" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.riskRating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      {/* Product Registration Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-700 text-xs space-y-4"
            >
              <h3 className="font-black text-sm md:text-base">{currentLanguage === "ar" ? "تسجيل وفحص منتج جديد بالسجل الموحد" : "Register Compliant Product"}</h3>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "اسم السلعة / المنتج المعتمد *" : "Product Name *"}</label>
                    <input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "الباركود الدولي (EAN) *" : "International Barcode *"}</label>
                    <input type="text" required value={prodBarcode} onChange={(e) => setProdBarcode(e.target.value)} placeholder="6281000..." className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "رمز التعريف الجمركي HS *" : "HS Code *"}</label>
                    <input type="text" required value={prodHsCode} onChange={(e) => setProdHsCode(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "فئة المنتج *" : "Category *"}</label>
                    <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl">
                      <option value="food">غذائي</option>
                      <option value="chemical">كيميائي</option>
                      <option value="electrical">كهربائي</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "مستوى تقييم المخاطر *" : "Risk Level *"}</label>
                    <select value={prodRisk} onChange={(e) => setProdRisk(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl">
                      <option value="low">منخفض (Low)</option>
                      <option value="medium">متوسط (Medium)</option>
                      <option value="high">مرتفع (High)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold">{currentLanguage === "ar" ? "المصنع / المستورد المعتمد *" : "Manufacturer / Importer *"}</label>
                  <input type="text" required value={prodManufacturer} onChange={(e) => setProdManufacturer(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                </div>
                <div className="pt-4 border-t flex justify-end gap-2">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                  <button type="submit" disabled={isSubmitting} className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "حفظ المنتج" : "Save Product"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Safety Alert Modal */}
      <AnimatePresence>
        {isAlertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-700 text-xs space-y-4"
            >
              <h3 className="font-black text-sm md:text-base">{currentLanguage === "ar" ? "نشر تنبيه فني وعاجل للأسواق" : "Issue Sovereign Safety Alert"}</h3>
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "عنوان التنبيه *" : "Alert Title *"}</label>
                    <input type="text" required value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "مستوى الخطورة *" : "Severity *"}</label>
                    <select value={alertSeverity} onChange={(e) => setAlertSeverity(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl">
                      <option value="high">مرتفع جداً (High)</option>
                      <option value="medium">متوسط (Medium)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold">{currentLanguage === "ar" ? "تفاصيل الخطر والإجراءات المطلوبة *" : "Alert details & Actions required *"}</label>
                  <textarea required rows={4} value={alertDetails} onChange={(e) => setAlertDetails(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl resize-none" />
                </div>
                <div className="pt-4 border-t flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAlertModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                  <button type="submit" disabled={isSubmitting} className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "نشر فوري" : "Issue Alert"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Recall Modal */}
      <AnimatePresence>
        {isRecallModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-700 text-xs space-y-4"
            >
              <h3 className="font-black text-sm md:text-base">{currentLanguage === "ar" ? "إصدار قرار سحب عاجل للمنتجات" : "Issue Product Recall Order"}</h3>
              <form onSubmit={handleCreateRecall} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "اسم المنتج المطلوب سحبه من الأسواق *" : "Product Name *"}</label>
                    <input type="text" required value={recProductName} onChange={(e) => setRecProductName(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold">{currentLanguage === "ar" ? "إجمالي الوحدات المباعة بالأسواق *" : "Total Units Sold *"}</label>
                    <input type="number" required value={recUnitsSold} onChange={(e) => setRecUnitsSold(parseInt(e.target.value, 10) || 0)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold">{currentLanguage === "ar" ? "تفاصيل مكمن الخطر والعيوب المصنعية *" : "Hazard description & faults *"}</label>
                  <textarea required rows={3} value={recHazard} onChange={(e) => setRecHazard(e.target.value)} className="w-full bg-slate-50 border px-3 py-2 rounded-xl resize-none" />
                </div>
                <div className="pt-4 border-t flex justify-end gap-2">
                  <button type="button" onClick={() => setIsRecallModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                  <button type="submit" disabled={isSubmitting} className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2 rounded-xl">{currentLanguage === "ar" ? "إصدار قرار السحب" : "Issue Recall Order"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
