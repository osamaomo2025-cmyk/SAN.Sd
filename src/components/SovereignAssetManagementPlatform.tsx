import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Boxes, Building2, Truck, ClipboardList, ShieldAlert, 
  Map, Eye, Plus, ArrowRightLeft, RefreshCw, Cpu, 
  Sparkles, FileText, BarChart3, Search, Filter, CheckCircle2, 
  AlertTriangle, Play, HelpCircle, Lock, Calendar, Fuel, MapPin, 
  TrendingUp, Users, Activity, QrCode
} from "lucide-react";

interface SovereignAssetManagementPlatformProps {
  currentLanguage: "ar" | "en";
  role: string;
}

export default function SovereignAssetManagementPlatform({
  currentLanguage,
  role
}: SovereignAssetManagementPlatformProps) {
  const isAr = currentLanguage === "ar";

  // Navigation within the platform
  const [activeTab, setActiveTab] = useState<"dashboard" | "assets" | "facilities" | "inventory" | "fleet" | "maintenance" | "ai" | "audit">("dashboard");

  // State Management
  const [assets, setAssets] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);
  const [fleet, setFleet] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Telemetry sensor mocks & states
  const [iotAlerts, setIotAlerts] = useState<any[]>([
    { id: "al-1", assetId: "ast-2", messageAr: "درجة حرارة عاكس الجهد مرتفعة: 78° مئوية", messageEn: "Inverter Temp Alert: 78°C", severity: "warning", timestamp: "الآن" },
    { id: "al-2", assetId: "flt-2", messageAr: "استهلاك وقود غير طبيعي للشاحنة خ-205", messageEn: "Abnormal fuel usage on Truck #205", severity: "danger", timestamp: "قبل 10 دقائق" }
  ]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form States
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    nameAr: "",
    nameEn: "",
    classificationAr: "أجهزة حاسوب وخوادم وشبكات",
    classificationEn: "Computers, Servers & Networks",
    ownerDepartmentAr: "إدارة التحول الرقمي ونظم المعلومات",
    ownerDepartmentEn: "Digital Transformation & IT Department",
    locationAr: "مبنى الوزارة الرئيسي - الخرطوم",
    locationEn: "Ministry HQ - Khartoum",
    value: "",
    depreciationTypeAr: "قسط ثابت - 5 سنوات",
    depreciationTypeEn: "Straight Line - 5 Years",
    warrantyStatusAr: "ساري المفعول",
    warrantyStatusEn: "Active",
    insurancePolicy: "SD-SOV-INS-" + Math.floor(1000 + Math.random() * 9000),
    healthIndex: "95"
  });

  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [workflowAction, setWorkflowAction] = useState<"transfer" | "verify" | "dispose">("verify");
  const [workflowPayload, setWorkflowPayload] = useState({
    notes: "",
    targetLocationAr: "",
    targetLocationEn: "",
    targetDeptAr: "",
    targetDeptEn: "",
    healthIndex: "90"
  });

  const [showAddWOModal, setShowAddWOModal] = useState(false);
  const [newWO, setNewWO] = useState({
    assetId: "",
    titleAr: "",
    titleEn: "",
    type: "preventive",
    priority: "medium",
    cost: "",
    vendorAr: "",
    vendorEn: "",
    engineerAr: "",
    engineerEn: "",
    descriptionAr: "",
    descriptionEn: ""
  });

  const [selectedWO, setSelectedWO] = useState<any | null>(null);
  const [showWOStatusModal, setShowWOStatusModal] = useState(false);
  const [woStatusPayload, setWoStatusPayload] = useState({
    status: "completed",
    notes: "",
    actualCost: ""
  });

  const [showTransferInventoryModal, setShowTransferInventoryModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any | null>(null);
  const [transferPayload, setTransferPayload] = useState({
    targetWarehouseId: "wh-1",
    quantity: ""
  });

  const [showCountInventoryModal, setShowCountInventoryModal] = useState(false);
  const [countPayload, setCountPayload] = useState({
    physicalQty: ""
  });

  const [showFleetUpdateModal, setShowFleetUpdateModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [fleetUpdatePayload, setFleetUpdatePayload] = useState({
    mileage: "",
    maintenanceStatus: "operational",
    lat: "15.5562",
    lng: "32.5358"
  });

  // AI Advisor state
  const [aiScenario, setAiScenario] = useState<"predict_failures" | "forecast_demand" | "general_report">("predict_failures");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");

  // Fetch all initial EAM data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAssets, resFac, resWh, resInv, resFleet, resWO, resLogs] = await Promise.all([
        fetch("/api/assets").then(r => r.json()),
        fetch("/api/facilities").then(r => r.json()),
        fetch("/api/warehouses").then(r => r.json()),
        fetch("/api/inventories").then(r => r.json()),
        fetch("/api/fleet").then(r => r.json()),
        fetch("/api/maintenance/work-orders").then(r => r.json()),
        fetch("/api/assets/audit-logs").then(r => r.json())
      ]);

      setAssets(resAssets);
      setFacilities(resFac);
      setWarehouses(resWh);
      setInventories(resInv);
      setFleet(resFleet);
      setWorkOrders(resWO);
      setAuditLogs(resLogs);
    } catch (err) {
      console.error("Error fetching EAM data:", err);
      showToast(isAr ? "حدث خطأ أثناء تحميل بيانات الأصول الاتحادية" : "Error loading federal asset data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Form submissions
  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAsset,
          actorName: role + " User"
        })
      });
      if (response.ok) {
        showToast(isAr ? "تم تسجيل الأصل الرأسمالي بنجاح في السجل الوطني الموحد" : "Capital asset registered successfully in unified national registry", "success");
        setShowAddAssetModal(false);
        setNewAsset({
          nameAr: "",
          nameEn: "",
          classificationAr: "أجهزة حاسوب وخوادم وشبكات",
          classificationEn: "Computers, Servers & Networks",
          ownerDepartmentAr: "إدارة التحول الرقمي ونظم المعلومات",
          ownerDepartmentEn: "Digital Transformation & IT Department",
          locationAr: "مبنى الوزارة الرئيسي - الخرطوم",
          locationEn: "Ministry HQ - Khartoum",
          value: "",
          depreciationTypeAr: "قسط ثابت - 5 سنوات",
          depreciationTypeEn: "Straight Line - 5 Years",
          warrantyStatusAr: "ساري المفعول",
          warrantyStatusEn: "Active",
          insurancePolicy: "SD-SOV-INS-" + Math.floor(1000 + Math.random() * 9000),
          healthIndex: "95"
        });
        fetchData();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      showToast(isAr ? "فشل تسجيل الأصل. يرجى التحقق من المدخلات" : "Asset registration failed. Check inputs", "error");
    }
  };

  const handleWorkflowAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      const response = await fetch("/api/assets/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAsset.id,
          action: workflowAction,
          notes: workflowPayload.notes,
          healthIndex: workflowPayload.healthIndex,
          targetLocationAr: workflowPayload.targetLocationAr,
          targetLocationEn: workflowPayload.targetLocationEn,
          targetDeptAr: workflowPayload.targetDeptAr,
          targetDeptEn: workflowPayload.targetDeptEn,
          actor: role + " Operator"
        })
      });
      if (response.ok) {
        showToast(isAr ? "تمت معالجة معاملة الأصول وحفظها في التدقيق المالي" : "Asset transaction processed and saved in audit trails", "success");
        setShowWorkflowModal(false);
        setSelectedAsset(null);
        setWorkflowPayload({
          notes: "",
          targetLocationAr: "",
          targetLocationEn: "",
          targetDeptAr: "",
          targetDeptEn: "",
          healthIndex: "90"
        });
        fetchData();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      showToast(isAr ? "فشل تنفيذ إجراء الحوكمة" : "Governance action execution failed", "error");
    }
  };

  const handleCreateWO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/maintenance/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newWO,
          actor: role + " Technical Supervisor"
        })
      });
      if (response.ok) {
        showToast(isAr ? "تم إصدار أمر صيانة فنية معتمد وإشعار المقاول" : "Approved technical maintenance work order issued and vendor notified", "success");
        setShowAddWOModal(false);
        setNewWO({
          assetId: "",
          titleAr: "",
          titleEn: "",
          type: "preventive",
          priority: "medium",
          cost: "",
          vendorAr: "",
          vendorEn: "",
          engineerAr: "",
          engineerEn: "",
          descriptionAr: "",
          descriptionEn: ""
        });
        fetchData();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      showToast(isAr ? "فشل إصدار أمر الصيانة" : "Failed to issue work order", "error");
    }
  };

  const handleUpdateWOStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWO) return;
    try {
      const response = await fetch("/api/maintenance/work-orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workOrderId: selectedWO.id,
          status: woStatusPayload.status,
          notes: woStatusPayload.notes,
          actualCost: woStatusPayload.actualCost,
          actor: role + " Engineer"
        })
      });
      if (response.ok) {
        showToast(isAr ? "تم تحديث أمر العمل وإعادة معايرة مؤشر صحة الأصل" : "Work order updated and asset health index recalibrated", "success");
        setShowWOStatusModal(false);
        setSelectedWO(null);
        fetchData();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      showToast(isAr ? "فشل إغلاق أمر الصيانة" : "Failed to update work order", "error");
    }
  };

  const handleInventoryTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventoryItem) return;
    try {
      const response = await fetch("/api/inventories/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedInventoryItem.id,
          sourceWarehouseId: selectedInventoryItem.warehouseId,
          targetWarehouseId: transferPayload.targetWarehouseId,
          quantity: transferPayload.quantity,
          actor: role + " Warehouse Officer"
        })
      });
      if (response.ok) {
        showToast(isAr ? "تمت جدولة التحويل اللوجستي وتحديث السجلات المخزنية" : "Logistics transfer scheduled and warehouse records updated", "success");
        setShowTransferInventoryModal(false);
        setSelectedInventoryItem(null);
        fetchData();
      } else {
        const errData = await response.json();
        throw new Error(errData.error || "Failed");
      }
    } catch (err: any) {
      showToast(err.message || (isAr ? "فشل نقل المخزون" : "Inventory transfer failed"), "error");
    }
  };

  const handleInventoryCount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventoryItem) return;
    try {
      const response = await fetch("/api/inventories/count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedInventoryItem.id,
          physicalQty: countPayload.physicalQty,
          actor: role + " Auditor"
        })
      });
      if (response.ok) {
        showToast(isAr ? "تم تسجيل نتائج الجرد وتحديث فروقات المخزون" : "Audit counts registered and inventory differences balanced", "success");
        setShowCountInventoryModal(false);
        setSelectedInventoryItem(null);
        fetchData();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      showToast(isAr ? "فشل تسجيل التدقيق المخزني" : "Failed to record audit count", "error");
    }
  };

  const handleFleetUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    try {
      const response = await fetch("/api/fleet/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          mileage: fleetUpdatePayload.mileage,
          lat: fleetUpdatePayload.lat,
          lng: fleetUpdatePayload.lng,
          maintenanceStatus: fleetUpdatePayload.maintenanceStatus,
          actor: role + " Fleet Controller"
        })
      });
      if (response.ok) {
        showToast(isAr ? "تم تحديث تتبع المركبة وحفظ سجل المسافات الجغرافي" : "Vehicle telemetry updated and mileage logs saved", "success");
        setShowFleetUpdateModal(false);
        setSelectedVehicle(null);
        fetchData();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      showToast(isAr ? "فشل تحديث بيانات التتبع" : "Failed to update fleet telemetry", "error");
    }
  };

  // Trigger AI Intelligence Advice
  const handleAIAdvisor = async () => {
    setAiLoading(true);
    setAiResponse("");
    try {
      const contextObj = {
        assets: assets.map(a => ({ id: a.id, name: a.nameAr, health: a.healthIndex, status: a.lifecycleStatus })),
        fleet: fleet.map(f => ({ plate: f.plateNumber, mileage: f.mileage, status: f.maintenanceStatus })),
        inventories: inventories.map(i => ({ sku: i.sku, name: i.nameAr, qty: i.quantity, min: i.minQuantity }))
      };
      const response = await fetch("/api/assets/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: aiScenario,
          prompt: aiPrompt,
          context: contextObj
        })
      });
      const data = await response.json();
      setAiResponse(data.text || "");
    } catch (err) {
      console.error(err);
      setAiResponse(isAr ? "❌ فشل الاتصال بمستشار الذكاء الاصطناعي السيادي للأصول" : "❌ Failed to communicate with sovereign AI asset advisor");
    } finally {
      setAiLoading(false);
    }
  };

  // Filtered Assets
  const filteredAssets = assets.filter(a => {
    const matchesSearch = 
      (a.nameAr || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.nationalId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classificationFilter ? (a.classificationAr === classificationFilter || a.classificationEn === classificationFilter) : true;
    return matchesSearch && matchesClass;
  });

  // Calculate high-fidelity KPIs
  const totalAssetValue = assets.reduce((sum, a) => sum + (Number(a.value) || 0), 0);
  const averageHealthIndex = assets.length ? Math.round(assets.reduce((sum, a) => sum + (Number(a.healthIndex) || 0), 0) / assets.length) : 100;
  const criticalAssetsCount = assets.filter(a => (Number(a.healthIndex) || 100) < 90).length;
  const activeWOsCount = workOrders.filter(w => w.status === "pending" || w.status === "in_progress").length;

  return (
    <div id="eam-platform-root" className="w-full bg-[#F8FAFC] min-h-screen p-4 md:p-6 lg:p-8 rounded-xl border border-gray-100 shadow-sm font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Sovereignty Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-6 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex h-3 w-3 rounded-full bg-sudan-green animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-sudan-gold bg-sudan-green/10 px-2 py-1 rounded">
              {isAr ? "وزارة التجارة والصناعة الاتحادية" : "FEDERAL MINISTRY OF COMMERCE & INDUSTRY"}
            </span>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
              ISO 55001 ALIGNED
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            {isAr ? "منصة إدارة الأصول والمنشآت وأسطول النقل" : "Enterprise Asset, Facilities, Fleet & Logistics Platform"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAr ? "إدارة كاملة للأصول السيادية، المستودعات اللوجستية، وحوكمة الصيانة المدعومة بالذكاء الاصطناعي لرؤية 2035" : "Comprehensive EAM, logistics warehousing, & AI predictive maintenance systems for Vision Sudan 2035"}
          </p>
        </div>

        {/* Action Controls & Reload */}
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {isAr ? "تحديث السجلات" : "Sync Records"}
          </button>
          
          <button 
            onClick={() => setShowAddAssetModal(true)}
            className="inline-flex items-center gap-2 bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg px-4 py-2 text-sm font-semibold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            {isAr ? "تسجيل أصل سيادي" : "Register Sovereign Asset"}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border ${
              message.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IoT Sensory Alerts Strip */}
      {iotAlerts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-3 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-800 p-1 rounded-full">
              <ShieldAlert className="h-4 w-4 animate-bounce text-amber-600" />
            </span>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              [ {isAr ? "مجسات IoT النشطة" : "Active IoT Alerts"} ]
            </span>
            <p className="text-xs font-medium text-amber-700">
              {isAr 
                ? `${iotAlerts[0].messageAr} (${iotAlerts[0].timestamp})`
                : `${iotAlerts[0].messageEn} (${iotAlerts[0].timestamp})`}
            </p>
          </div>
          <button 
            onClick={() => setIotAlerts([])}
            className="text-xs text-amber-600 hover:text-amber-800 font-semibold underline"
          >
            {isAr ? "تجاوز التنبيه" : "Acknowledge Alert"}
          </button>
        </div>
      )}

      {/* EAM Inner Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-gray-200 pb-1 mb-6 no-scrollbar">
        {[
          { id: "dashboard", labelAr: "مؤشرات الأداء العامة", labelEn: "EAM Overview", icon: BarChart3 },
          { id: "assets", labelAr: "سجل الأصول الرأسمالية", labelEn: "Sovereign Asset Registry", icon: Boxes },
          { id: "facilities", labelAr: "المنشآت والمستودعات", labelEn: "Facilities & Warehouses", icon: Building2 },
          { id: "inventory", labelAr: "المخزون وقطع الغيار", labelEn: "Inventory & RFID", icon: QrCode },
          { id: "fleet", labelAr: "أسطول النقل والـ GPS", labelEn: "Fleet & GPS Tracking", icon: Truck },
          { id: "maintenance", labelAr: "الصيانة الذكية وأوامر العمل", labelEn: "Smart Maintenance", icon: ClipboardList },
          { id: "ai", labelAr: "مستشار الأصول الذكي AI", labelEn: "AI Asset Advisor", icon: Cpu },
          { id: "audit", labelAr: "سجل حوكمة الأصول", labelEn: "Asset Audit Trail", icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap border-b-2 ${
                isActive 
                  ? "bg-white text-sudan-green border-sudan-green font-bold shadow-xs" 
                  : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Panels */}
      <div className="min-h-[500px]">
        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isAr ? "إجمالي قيمة الأصول السيادية" : "Sovereign Asset Capitalization"}
                  </p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1 font-mono">
                    {totalAssetValue.toLocaleString()} <span className="text-sm font-semibold">{isAr ? "ج.س" : "SDG"}</span>
                  </h3>
                  <p className="text-xs text-sudan-green font-medium mt-1">
                    {isAr ? "أرصدة مدققة بالكامل" : "Fully audited asset portfolio"}
                  </p>
                </div>
                <div className="bg-sudan-green/10 p-3 rounded-lg text-sudan-green">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isAr ? "مؤشر صحة الأصول العام" : "Overall Asset Health Index"}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-800 font-mono">{averageHealthIndex}%</h3>
                    <span className="text-xs text-emerald-600 font-bold font-mono">↑ 1.2%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "تجاوز المستهدف الوطني (90%)" : "Surpasses national benchmark (90%)"}
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                  <Activity className="h-6 w-6 animate-pulse" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isAr ? "أصول تحت عتبة الصيانة" : "Assets at Maintenance Threshold"}
                  </p>
                  <h3 className="text-3xl font-black text-amber-600 mt-1 font-mono">{criticalAssetsCount}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "مجدولة لمعايرة الصيانة الذكية" : "Scheduled for smart calibration"}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isAr ? "أوامر العمل والتشغيل النشطة" : "Active Work Orders"}
                  </p>
                  <h3 className="text-3xl font-black text-blue-600 mt-1 font-mono">{activeWOsCount}</h3>
                  <p className="text-xs text-blue-500 mt-1">
                    {isAr ? "جاري العمل عليها مع المقاولين" : "Assigned & active with contractors"}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <ClipboardList className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Quick Overview Visual Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Asset Depreciation & Analytics Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <h3 className="font-bold text-slate-800 text-base">
                    {isAr ? "كفاءة المنشآت والاستقرار البيئي الفيدرالي" : "Federal Facility Resource & Environmental Score"}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-sudan-gold/10 text-sudan-gold px-2 py-1 rounded">
                    REAL-TIME IOT DATA
                  </span>
                </div>

                <div className="space-y-4">
                  {facilities.map(f => (
                    <div key={f.id} className="border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <span className="text-sm font-bold text-slate-800">{isAr ? f.nameAr : f.nameEn}</span>
                          <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded ml-2">
                            {f.currentOccupancy} / {f.capacityStaff} {isAr ? "موظف" : "Staff"}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${f.environmentalScore > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {isAr ? "النتيجة البيئية" : "Eco-Score"}: {f.environmentalScore}%
                        </span>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-sudan-green h-full rounded-full" 
                          style={{ width: `${(f.currentOccupancy / f.capacityStaff) * 100}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-slate-500">
                        <div>
                          <strong>{isAr ? "الكهرباء" : "Electricity"}:</strong> {isAr ? f.utilityStatusAr : f.utilityStatusEn}
                        </div>
                        <div>
                          <strong>{isAr ? "استهلاك الطاقة" : "Power Draw"}:</strong> {f.energyUsageKwh.toLocaleString()} KWh
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IoT Sensor & Alerts Quick Panel */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <h3 className="font-bold text-slate-800 text-base">
                    {isAr ? "تتبع الأسطول والمجسات اللوجستية" : "Fleet GIS Telemetry Map"}
                  </h3>
                  <span className="h-2 w-2 rounded-full bg-sudan-green animate-ping"></span>
                </div>

                {/* Styled Sudan map / grid visual representation */}
                <div className="bg-slate-950 rounded-lg p-4 h-48 flex flex-col items-center justify-center border border-slate-800 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient from-slate-900 to-black opacity-60"></div>
                  
                  {/* Mock Radar Circles */}
                  <div className="absolute h-32 w-32 rounded-full border border-sudan-green/10 animate-ping"></div>
                  <div className="absolute h-40 w-40 rounded-full border border-sudan-green/5 animate-pulse"></div>
                  
                  {/* SVG Map Path Grid Mock */}
                  <div className="z-10 text-center">
                    <span className="text-slate-400 text-xs font-mono block mb-1">
                      [ KHARTOUM - PORT SUDAN CORRIDOR ]
                    </span>
                    <span className="text-sudan-green font-black font-mono text-sm block">
                      {fleet.length} Active GPS Transponders
                    </span>
                    <p className="text-slate-500 text-[10px] mt-2">
                      {isAr ? "مراقبة جغرافية مشفرة بالكامل لممرات التجارة الفيدرالية" : "Fully encrypted geo-monitoring of federal trade corridors"}
                    </p>
                  </div>

                  {/* Vehicle GPS Mock badges in map */}
                  {fleet.map((v, idx) => (
                    <div 
                      key={v.id} 
                      className="absolute z-10 p-1 bg-sudan-green text-white rounded font-mono text-[9px] font-bold flex items-center gap-1 shadow-md"
                      style={{ 
                        top: idx === 0 ? "20%" : "60%", 
                        left: idx === 0 ? "30%" : "70%" 
                      }}
                    >
                      <MapPin className="h-2 w-2 animate-bounce" />
                      {v.plateNumber}
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isAr ? "مواقع المركبات النشطة" : "Active Telemetry Feeds"}
                  </h4>
                  {fleet.map(v => (
                    <div key={v.id} className="flex justify-between items-center text-xs text-slate-600 bg-slate-50 p-2 rounded">
                      <span className="font-semibold">{v.plateNumber}</span>
                      <span className="font-mono text-slate-500">
                        {v.gpsCoords.lat.toFixed(4)}° N, {v.gpsCoords.lng.toFixed(4)}° E
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${v.maintenanceStatus === 'operational' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {v.maintenanceStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Integration with other modules block */}
            <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-sudan-green/20 p-2 rounded-lg text-sudan-green">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    {isAr ? "التكامل السيادي والربط البيني للأصول" : "Sovereign Interoperability & Governance"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAr ? "نظام الأصول مرتبط تلقائياً مع المشتريات، الشؤون القانونية، وسجل حماية المستهلك" : "Assets integrated with Procurement, Legal Affairs, and Consumer Protection records"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isAr 
                  ? "يضمن النظام حوكمة الأصول عبر معايير ISO 55001 الوطنية المعتمدة من مجلس الوزراء. في حال إصدار ترخيص تجاري أو تفتيش لأصل صناعي، يتم التحقق تلقائياً من الرقم الوطني للأصل (NAI) للتأكد من الحالة التشغيلية والترخيص والتأمين قبل إقرار أي معاملة استثمارية."
                  : "Ensures comprehensive federal governance aligned with international ISO 55001 standards. Any industrial inspections or licensing activities verify the National Asset Identifier (NAI) dynamically to secure validity, insurance parameters, and status."}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: CAPITAL ASSETS REGISTRY */}
        {activeTab === "assets" && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "ابحث بالاسم، الرقم الوطني للأصل NAI..." : "Search by Asset Name, NAI..."}
                  className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sudan-green transition"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="text-slate-400 h-4 w-4" />
                <select 
                  value={classificationFilter}
                  onChange={(e) => setClassificationFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="">{isAr ? "كل التصنيفات الرأسمالية" : "All Asset Classes"}</option>
                  <option value={isAr ? "أجهزة حاسوب وخوادم وشبكات" : "Computers, Servers & Networks"}>
                    {isAr ? "أجهزة حاسوب وخوادم وشبكات" : "Computers, Servers & Networks"}
                  </option>
                  <option value={isAr ? "آلات ومعدات طاقة بديلة" : "Machinery & Alternative Energy Equipment"}>
                    {isAr ? "آلات ومعدات طاقة بديلة" : "Machinery & Alternative Energy Equipment"}
                  </option>
                  <option value={isAr ? "عقارات ومباني وإنشاءات" : "Real Estate, Buildings & Structures"}>
                    {isAr ? "عقارات ومباني وإنشاءات" : "Real Estate, Buildings & Structures"}
                  </option>
                </select>
              </div>
            </div>

            {/* Asset cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map(asset => {
                const isCritical = asset.healthIndex < 90;
                return (
                  <div key={asset.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-sudan-green transition-all flex flex-col justify-between">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {asset.nationalId}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          asset.lifecycleStatus === 'operational' ? 'bg-emerald-50 text-emerald-700' :
                          asset.lifecycleStatus === 'needs_maintenance' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {asset.lifecycleStatus}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">
                        {isAr ? asset.nameAr : asset.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 mb-4">
                        {isAr ? asset.classificationAr : asset.classificationEn}
                      </p>

                      <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{isAr ? "الموقع الجغرافي:" : "Location:"}</span>
                          <span className="font-medium text-slate-800">{isAr ? asset.locationAr : asset.locationEn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{isAr ? "القسم المالك:" : "Department:"}</span>
                          <span className="font-medium text-slate-800">{isAr ? asset.ownerDepartmentAr : asset.ownerDepartmentEn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{isAr ? "القيمة الاقتصادية:" : "Economic Value:"}</span>
                          <span className="font-bold text-slate-900 font-mono">{(asset.value || 0).toLocaleString()} SDG</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{isAr ? "الاستهلاك المالي:" : "Depreciation:"}</span>
                          <span className="font-medium text-slate-600">{isAr ? asset.depreciationTypeAr : asset.depreciationTypeEn}</span>
                        </div>
                      </div>

                      {/* Health bar indicator */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-500">{isAr ? "مؤشر صحة الأصول (AHI):" : "Asset Health:"}</span>
                          <span className={isCritical ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                            {asset.healthIndex}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isCritical ? 'bg-amber-500' : 'bg-sudan-green'}`} 
                            style={{ width: `${asset.healthIndex}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Quick governance/workflow action buttons */}
                    <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button 
                        onClick={() => {
                          setSelectedAsset(asset);
                          setWorkflowAction("verify");
                          setShowWorkflowModal(true);
                        }}
                        className="text-xs text-sudan-green hover:bg-sudan-green/5 font-bold px-2 py-1 rounded transition"
                      >
                        {isAr ? "تدقيق الأصول" : "Verify Asset"}
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedAsset(asset);
                          setWorkflowAction("transfer");
                          setShowWorkflowModal(true);
                        }}
                        className="text-xs text-slate-600 hover:bg-slate-100 font-bold px-2 py-1 rounded transition"
                      >
                        {isAr ? "نقل الملكية والموقع" : "Transfer / Relocate"}
                      </button>

                      <button 
                        onClick={() => {
                          setNewWO(prev => ({ ...prev, assetId: asset.id }));
                          setShowAddWOModal(true);
                        }}
                        className="text-xs text-amber-700 hover:bg-amber-50 font-bold px-2 py-1 rounded transition"
                      >
                        {isAr ? "أمر صيانة" : "Create WO"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FACILITIES & WAREHOUSES */}
        {activeTab === "facilities" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Facility Cards */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
                  {isAr ? "المقرات والمجمعات الخدمية الفيدرالية" : "Ministry Service Complexes & Offices"}
                </h3>

                {facilities.map(fac => (
                  <div key={fac.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 hover:border-sudan-green transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{isAr ? fac.nameAr : fac.nameEn}</h4>
                        <p className="text-xs text-slate-500">{isAr ? fac.typeAr : fac.typeEn}</p>
                      </div>
                      <span className="text-[10px] font-mono bg-sudan-green/10 text-sudan-green px-2 py-0.5 rounded font-bold">
                        {fac.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 mt-3 border-t border-slate-100/50 pt-3">
                      <div>
                        <strong>{isAr ? "القدرة الاستيعابية:" : "Staff Capacity:"}</strong> {fac.currentOccupancy} / {fac.capacityStaff}
                      </div>
                      <div>
                        <strong>{isAr ? "الامتثال والسلامة:" : "Safety Rating:"}</strong> {isAr ? fac.safetyStatusAr : fac.safetyStatusEn}
                      </div>
                      <div>
                        <strong>{isAr ? "آخر تفتيش دوري:" : "Last Audit:"}</strong> {fac.lastInspectionDate}
                      </div>
                      <div>
                        <strong>{isAr ? "استهلاك المياه الكلي:" : "Water Load:"}</strong> {fac.waterUsageLitres.toLocaleString()} Litres
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warehouses & Depot Inventory Summary */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
                  {isAr ? "المستودعات والقدرة اللوجستية" : "Warehouses & Logistics Depots"}
                </h3>

                {warehouses.map(wh => (
                  <div key={wh.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{isAr ? wh.nameAr : wh.nameEn}</h4>
                        <p className="text-xs text-slate-500">{isAr ? wh.locationAr : wh.locationEn}</p>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {wh.securityLevel} Security
                      </span>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">{isAr ? "المساحة المستغلة:" : "Capacity Utilized:"}</span>
                        <span className="font-bold text-slate-800">
                          {wh.utilizedCapacitySqm} / {wh.totalCapacitySqm} Sqm
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-sudan-gold h-full rounded-full" 
                          style={{ width: `${(wh.utilizedCapacitySqm / wh.totalCapacitySqm) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100/50">
                      <strong>{isAr ? "أمين المستودع المسؤول:" : "Depot Manager:"}</strong> {isAr ? wh.managerAr : wh.managerEn}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY & RFID TRACKING */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {isAr ? "قطع الغيار والمستهلكات المدعومة بـ RFID/QR" : "RFID & QR Code Tracked Spares & Supplies"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAr ? "تتبع فوري لمخزون المستودعات المركزية وتدقيق حد الأمان الفيدرالي" : "Live inventory counts with automatic minimum buffer levels"}
                  </p>
                </div>
              </div>

              {/* Inventory table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-slate-600" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">{isAr ? "المعرف الفرعي SKU" : "SKU Code"}</th>
                      <th className="px-6 py-3">{isAr ? "اسم الصنف" : "Item Name"}</th>
                      <th className="px-6 py-3">{isAr ? "التصنيف" : "Category"}</th>
                      <th className="px-6 py-3">{isAr ? "المستودع" : "Warehouse"}</th>
                      <th className="px-6 py-3 text-center">{isAr ? "الكمية الحالية" : "Current Qty"}</th>
                      <th className="px-6 py-3 text-center">{isAr ? "حد الأمان" : "Min Qty"}</th>
                      <th className="px-6 py-3">{isAr ? "طريقة التتبع" : "Tracking"}</th>
                      <th className="px-6 py-3 text-center">{isAr ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventories.map(item => {
                      const isLowStock = item.quantity <= item.minQuantity;
                      return (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-xs font-semibold">{item.sku}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{isAr ? item.nameAr : item.nameEn}</div>
                          </td>
                          <td className="px-6 py-4 text-xs">{isAr ? item.categoryAr : item.categoryEn}</td>
                          <td className="px-6 py-4 text-xs font-medium font-mono">{item.warehouseId === "wh-1" ? (isAr ? "مستودع الخرطوم" : "Khartoum Depot") : (isAr ? "مستودع بورتسودان" : "Port Sudan Depot")}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                              isLowStock ? 'bg-red-50 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {item.quantity} {isAr ? item.unitAr : item.unitEn}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-xs text-slate-500">{item.minQuantity}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono font-medium">
                              <QrCode className="h-3 w-3" />
                              {item.trackingMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedInventoryItem(item);
                                  setShowTransferInventoryModal(true);
                                }}
                                className="text-xs font-bold text-sudan-green hover:underline"
                              >
                                {isAr ? "نقل لوجستي" : "Transfer"}
                              </button>
                              <span className="text-slate-300">|</span>
                              <button 
                                onClick={() => {
                                  setSelectedInventoryItem(item);
                                  setCountPayload({ physicalQty: String(item.quantity) });
                                  setShowCountInventoryModal(true);
                                }}
                                className="text-xs font-bold text-slate-600 hover:underline"
                              >
                                {isAr ? "جرد دوري" : "Audit Count"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FLEET & GPS TELEMETRY */}
        {activeTab === "fleet" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-4 mb-4">
                {isAr ? "إدارة أسطول المركبات الحكومية وتتبع الـ GPS" : "Government Vehicle Fleet & GPS Tracking"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fleet.map(vehicle => {
                  const needsMaintenance = vehicle.maintenanceStatus === "needs_preventive" || vehicle.maintenanceStatus === "critical";
                  return (
                    <div key={vehicle.id} className="border border-slate-200 rounded-xl p-5 hover:border-sudan-green transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-slate-900 text-white font-black px-3 py-1 rounded text-xs tracking-wider font-mono">
                            {vehicle.plateNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            vehicle.maintenanceStatus === "operational" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {vehicle.maintenanceStatus}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mb-1">
                          {isAr ? vehicle.nameAr : vehicle.nameEn}
                        </h4>
                        <p className="text-xs text-slate-500 mb-4">{isAr ? vehicle.typeAr : vehicle.typeEn}</p>

                        <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                          <div className="flex justify-between">
                            <span>{isAr ? "السائق المعين:" : "Assigned Driver:"}</span>
                            <span className="font-medium text-slate-900">{isAr ? vehicle.assignedDriverAr : vehicle.assignedDriverEn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{isAr ? "عداد المسافات الكلي:" : "Odometer Reading:"}</span>
                            <span className="font-bold font-mono text-slate-900">{vehicle.mileage.toLocaleString()} KM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{isAr ? "معدل استهلاك الوقود:" : "Fuel Consumption:"}</span>
                            <span className="font-mono">{vehicle.fuelConsumptionRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{isAr ? "انتهاء رخصة السير:" : "License Expiry:"}</span>
                            <span className="font-medium">{vehicle.licenseExpiryDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{isAr ? "حالة التأمين والغطاء:" : "Insurance status:"}</span>
                            <span className="font-medium">{isAr ? vehicle.insuranceStatusAr : vehicle.insuranceStatusEn}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="text-xs text-slate-500 font-mono">
                          GPS: {vehicle.gpsCoords.lat.toFixed(4)}, {vehicle.gpsCoords.lng.toFixed(4)}
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setFleetUpdatePayload({
                              mileage: String(vehicle.mileage),
                              maintenanceStatus: vehicle.maintenanceStatus,
                              lat: String(vehicle.gpsCoords.lat),
                              lng: String(vehicle.gpsCoords.lng)
                            });
                            setShowFleetUpdateModal(true);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          {isAr ? "تحديث التتبع" : "Update Telemetry"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MAINTENANCE & WORK ORDERS */}
        {activeTab === "maintenance" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {isAr ? "أوامر صيانة المعدات الفيدرالية والمشغلات" : "Maintenance Work Orders & Schedules"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAr ? "تنسيق الصيانة الوقائية والتصحيحية لرفع كفاءة تشغيل الأصول السيادية" : "Schedule periodic and emergency corrective operations"}
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddWOModal(true)}
                  className="bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg px-4 py-2 text-xs font-bold transition shadow-sm"
                >
                  {isAr ? "إصدار أمر صيانة جديد" : "New Work Order"}
                </button>
              </div>

              {/* Work orders list */}
              <div className="space-y-4">
                {workOrders.map(wo => {
                  const isHighPriority = wo.priority === "high" || wo.priority === "critical";
                  return (
                    <div key={wo.id} className="border border-slate-200 rounded-xl p-5 hover:border-sudan-green transition flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            isHighPriority ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {wo.priority} Priority
                          </span>
                          <span className="text-xs font-mono font-medium text-slate-500">
                            ID: {wo.id} | Asset: {wo.assetId}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">
                          {isAr ? wo.titleAr : wo.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                          {isAr ? wo.descriptionAr : wo.descriptionEn}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                          <span><strong>{isAr ? "المهندس المعتمد:" : "Engineer:"}</strong> {isAr ? wo.engineerAr : wo.engineerEn}</span>
                          <span><strong>{isAr ? "المقاول الفني:" : "Contractor:"}</strong> {isAr ? wo.vendorAr : wo.vendorEn}</span>
                          <span><strong>{isAr ? "التكلفة:" : "Cost:"}</strong> {wo.cost.toLocaleString()} SDG</span>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-start md:items-end justify-between gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          wo.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                          wo.status === "in_progress" ? "bg-blue-50 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {wo.status}
                        </span>

                        {wo.status !== "completed" && (
                          <button 
                            onClick={() => {
                              setSelectedWO(wo);
                              setWoStatusPayload({
                                status: "completed",
                                notes: "",
                                actualCost: String(wo.cost)
                              });
                              setShowWOStatusModal(true);
                            }}
                            className="text-xs text-sudan-green hover:bg-sudan-green/5 border border-sudan-green px-3 py-1 rounded-lg transition font-bold"
                          >
                            {isAr ? "تحديث وإغلاق" : "Close order"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI ASSET ADVISOR */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-sudan-green/10 p-3 rounded-lg text-sudan-green">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {isAr ? "مستشار الأصول والتنبؤ الذكي بالأعطال" : "Sovereign AI Asset Advisor"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAr ? "تنبؤات الفشل الوقائي، وتقدير كفاءة الإمداد والخدمات بالذكاء الاصطناعي" : "Predict equipment failures and optimize storage/warehousing"}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {isAr ? "سيناريو التحليل المطلوب" : "Analysis Scenario"}
                  </label>
                  <select 
                    value={aiScenario} 
                    onChange={(e) => setAiScenario(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sudan-green"
                  >
                    <option value="predict_failures">{isAr ? "التنبؤ بأعطال المعدات والبنية التحتية" : "Predict Infrastructure Failures"}</option>
                    <option value="forecast_demand">{isAr ? "طلب قطع الغيار ومستويات التخزين" : "Forecast Spare Parts Demand"}</option>
                    <option value="general_report">{isAr ? "تقرير ذكاء الأصول الاستراتيجي 2035" : "Strategic Asset Intelligence Report"}</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {isAr ? "إدخال استفسار مخصص (اختياري)" : "Custom Inquiry (Optional)"}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={isAr ? "مثال: فحص سلامة مولدات سوبا، أو التوصية بزيادة مخزون الأقراص..." : "e.g., recommend solar inverter safety, check SSD buffers..."}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sudan-green"
                    />
                    <button 
                      onClick={handleAIAdvisor}
                      disabled={aiLoading}
                      className="bg-sudan-green hover:bg-sudan-green/90 text-white font-bold rounded-lg px-6 py-2 text-sm transition shadow-sm whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
                    >
                      {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {isAr ? "توليد التقرير" : "Generate Advice"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Response Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[250px] relative overflow-hidden">
                {aiLoading ? (
                  <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-8 w-8 text-sudan-green animate-spin" />
                    <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                      {isAr ? "جاري تشغيل محاكي الذكاء الاصطناعي السيادي..." : "Executing Sovereign AI Analytics..."}
                    </span>
                  </div>
                ) : null}

                {!aiResponse ? (
                  <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Sparkles className="h-8 w-8 text-slate-300" />
                    <p className="text-xs font-medium">
                      {isAr ? "يرجى اختيار السيناريو والنقر على زر توليد التقرير لبدء المعالجة" : "Select a scenario and click Generate Advice to run AI analysis"}
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none text-right font-sans" dir="rtl">
                    {/* Render AI custom Markdown cleanly */}
                    <div className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed">
                      {aiResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: AUDIT TRAIL */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-sudan-green" />
                {isAr ? "سجل التدقيق الرقمي المشفر لأصول الدولة" : "Immutable Sovereign Asset Audit Ledger"}
              </h3>

              <div className="space-y-4">
                {auditLogs.map(log => (
                  <div key={log.id} className="bg-slate-50 border-r-4 border-sudan-green rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span>{log.timestamp}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-600">{log.actor}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {isAr ? log.actionAr : log.actionEn}
                      </h4>
                      <p className="text-xs text-slate-500">{log.details}</p>
                    </div>

                    <div className="flex flex-col justify-end items-start md:items-end">
                      <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        HASH: {log.hash ? log.hash.substring(0, 16) : "N/A"}...
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 tracking-wider uppercase font-mono mt-1">
                        Verified Secure ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL POPUPS --- */}

      {/* MODAL 1: ADD ASSET */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">{isAr ? "تسجيل أصل رأسمالي سيادي جديد" : "Register New Capital Asset"}</h3>
              <button onClick={() => setShowAddAssetModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleCreateAsset} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الاسم باللغة العربية" : "Name (Arabic)"}</label>
                  <input 
                    type="text" 
                    required
                    value={newAsset.nameAr}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="مثال: مولد طاقة شمسية سوبا"
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الاسم باللغة الإنجليزية" : "Name (English)"}</label>
                  <input 
                    type="text" 
                    required
                    value={newAsset.nameEn}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, nameEn: e.target.value }))}
                    placeholder="e.g., Soba Solar Inverter Rig"
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "التصنيف الرأسمالي" : "Asset Class"}</label>
                  <select 
                    value={newAsset.classificationAr}
                    onChange={(e) => {
                      const val = e.target.value;
                      const enVal = val === "أجهزة حاسوب وخوادم وشبكات" ? "Computers, Servers & Networks" :
                                    val === "آلات ومعدات طاقة بديلة" ? "Machinery & Alternative Energy Equipment" :
                                    "Real Estate, Buildings & Structures";
                      setNewAsset(prev => ({ ...prev, classificationAr: val, classificationEn: enVal }));
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  >
                    <option value="أجهزة حاسوب وخوادم وشبكات">{isAr ? "أجهزة حاسوب وخوادم وشبكات" : "Computers, Servers & Networks"}</option>
                    <option value="آلات ومعدات طاقة بديلة">{isAr ? "آلات ومعدات طاقة بديلة" : "Machinery & Alternative Energy Equipment"}</option>
                    <option value="عقارات ومباني وإنشاءات">{isAr ? "عقارات ومباني وإنشاءات" : "Real Estate, Buildings & Structures"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "القيمة الاقتصادية (SDG)" : "Economic Value (SDG)"}</label>
                  <input 
                    type="number" 
                    required
                    value={newAsset.value}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="2500000"
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الموقع الأولي للأصل" : "Initial Location"}</label>
                  <input 
                    type="text" 
                    required
                    value={newAsset.locationAr}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, locationAr: e.target.value, locationEn: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "طريقة حساب الاستهلاك" : "Depreciation Type"}</label>
                  <input 
                    type="text" 
                    required
                    value={newAsset.depreciationTypeAr}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, depreciationTypeAr: e.target.value, depreciationTypeEn: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg transition"
                >
                  {isAr ? "تأكيد التسجيل السيادي" : "Confirm Sovereign Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSET WORKFLOW ACTION */}
      {showWorkflowModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">
                {isAr ? `حوكمة ومعالجة الأصل: ${selectedAsset.nationalId}` : `Govern Asset: ${selectedAsset.nationalId}`}
              </h3>
              <button onClick={() => setShowWorkflowModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleWorkflowAction} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الإجراء المطلوب" : "Action Type"}</label>
                <select 
                  value={workflowAction}
                  onChange={(e) => setWorkflowAction(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                >
                  <option value="verify">{isAr ? "تدقيق الأصول والتحقق الفعلي" : "Verify Physical Integrity"}</option>
                  <option value="transfer">{isAr ? "تحويل لوجستي وتعديل الملكية والموقع" : "Transfer ownership / Relocate"}</option>
                  <option value="dispose">{isAr ? "التخلص من الأصل وشهادة التخريد" : "Decommission & Dispose"}</option>
                </select>
              </div>

              {workflowAction === "verify" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    {isAr ? "مؤشر الصحة الفعلي بعد الفحص" : "Observed Health Index (%)"}
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    required
                    value={workflowPayload.healthIndex}
                    onChange={(e) => setWorkflowPayload(prev => ({ ...prev, healthIndex: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono"
                  />
                </div>
              )}

              {workflowAction === "transfer" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الموقع الجغرافي الجديد" : "New Location"}</label>
                    <input 
                      type="text" 
                      required
                      value={workflowPayload.targetLocationAr}
                      onChange={(e) => setWorkflowPayload(prev => ({ ...prev, targetLocationAr: e.target.value, targetLocationEn: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "القسم الفيدرالي المستلم" : "New Owner Department"}</label>
                    <input 
                      type="text" 
                      required
                      value={workflowPayload.targetDeptAr}
                      onChange={(e) => setWorkflowPayload(prev => ({ ...prev, targetDeptAr: e.target.value, targetDeptEn: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "ملاحظات الفحص والتدقيق" : "Governance Notes"}</label>
                <textarea 
                  required
                  value={workflowPayload.notes}
                  onChange={(e) => setWorkflowPayload(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={isAr ? "أدخل تفاصيل حالة المعاينة أو مسببات التحويل" : "Enter inspection details or transfer justifications..."}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm h-20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowWorkflowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg"
                >
                  {isAr ? "تنفيذ الإجراء" : "Execute Action"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE WORK ORDER */}
      {showAddWOModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">{isAr ? "إصدار أمر صيانة فنية معتمد" : "Issue Maintenance Work Order"}</h3>
              <button onClick={() => setShowAddWOModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleCreateWO} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "معرف الأصل الوطني (NAI)" : "Asset National NAI"}</label>
                  <input 
                    type="text" 
                    required
                    value={newWO.assetId}
                    onChange={(e) => setNewWO(prev => ({ ...prev, assetId: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "نوع الصيانة" : "Maintenance Type"}</label>
                  <select 
                    value={newWO.type}
                    onChange={(e) => setNewWO(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  >
                    <option value="preventive">{isAr ? "صيانة وقائية دورية" : "Preventive Maintenance"}</option>
                    <option value="corrective">{isAr ? "إصلاح طارئ وتصحيحي" : "Corrective Repair"}</option>
                    <option value="predictive">{isAr ? "معايرة مجسات استباقية" : "Predictive Calibration"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "عنوان أمر العمل (عربي)" : "Title (Arabic)"}</label>
                  <input 
                    type="text" 
                    required
                    value={newWO.titleAr}
                    onChange={(e) => setNewWO(prev => ({ ...prev, titleAr: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "عنوان أمر العمل (إنجليزي)" : "Title (English)"}</label>
                  <input 
                    type="text" 
                    required
                    value={newWO.titleEn}
                    onChange={(e) => setNewWO(prev => ({ ...prev, titleEn: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الأولوية التشغيلية" : "Priority"}</label>
                  <select 
                    value={newWO.priority}
                    onChange={(e) => setNewWO(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  >
                    <option value="low">{isAr ? "منخفضة" : "Low"}</option>
                    <option value="medium">{isAr ? "متوسطة" : "Medium"}</option>
                    <option value="high">{isAr ? "مرتفعة جداً" : "High"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "التكلفة التقديرية (SDG)" : "Estimated Cost (SDG)"}</label>
                  <input 
                    type="number" 
                    required
                    value={newWO.cost}
                    onChange={(e) => setNewWO(prev => ({ ...prev, cost: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "المهندس المسؤول" : "Assigned Engineer"}</label>
                  <input 
                    type="text" 
                    required
                    value={newWO.engineerAr}
                    onChange={(e) => setNewWO(prev => ({ ...prev, engineerAr: e.target.value, engineerEn: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم المقاول الفني المعتمد" : "Vendor / Contractor Name"}</label>
                <input 
                  type="text" 
                  required
                  value={newWO.vendorAr}
                  onChange={(e) => setNewWO(prev => ({ ...prev, vendorAr: e.target.value, vendorEn: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "تفاصيل الأعطال والمشكلة" : "Problem Details & Scope"}</label>
                <textarea 
                  required
                  value={newWO.descriptionAr}
                  onChange={(e) => setNewWO(prev => ({ ...prev, descriptionAr: e.target.value, descriptionEn: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm h-16"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddWOModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg"
                >
                  {isAr ? "إصدار وتعميد" : "Issue Work Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CLOSE WORK ORDER STATUS */}
      {showWOStatusModal && selectedWO && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">{isAr ? "إغلاق وتحديث مسار أمر الصيانة" : "Update and Close Work Order"}</h3>
              <button onClick={() => setShowWOStatusModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleUpdateWOStatus} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "حالة الإغلاق" : "Closure Status"}</label>
                <select 
                  value={woStatusPayload.status}
                  onChange={(e) => setWoStatusPayload(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                >
                  <option value="completed">{isAr ? "تم الإصلاح بنجاح (Completed)" : "Completed Successfully"}</option>
                  <option value="in_progress">{isAr ? "قيد العمل والمتابعة (In Progress)" : "In Progress"}</option>
                  <option value="rejected">{isAr ? "تم الإلغاء أو الرفض" : "Cancelled / Rejected"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "التكلفة النهائية الفعلية" : "Final Actual Cost (SDG)"}</label>
                <input 
                  type="number" 
                  required
                  value={woStatusPayload.actualCost}
                  onChange={(e) => setWoStatusPayload(prev => ({ ...prev, actualCost: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "ملاحظات الفنيين وتفاصيل الإنجاز" : "Closure Details & Notes"}</label>
                <textarea 
                  required
                  value={woStatusPayload.notes}
                  onChange={(e) => setWoStatusPayload(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm h-20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowWOStatusModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg"
                >
                  {isAr ? "إغلاق أمر العمل" : "Close order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: LOGISTICS STOCK TRANSFER */}
      {showTransferInventoryModal && selectedInventoryItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">{isAr ? "تحويل لوجستي بين المستودعات الاتحادية" : "Logistics stock transfer"}</h3>
              <button onClick={() => setShowTransferInventoryModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleInventoryTransfer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">{isAr ? "الصنف المراد تحويله" : "Selected Item"}</label>
                <div className="bg-slate-50 p-3 rounded-lg text-sm font-bold text-slate-800">
                  {isAr ? selectedInventoryItem.nameAr : selectedInventoryItem.nameEn}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مستودع الوجهة" : "Target Warehouse"}</label>
                <select 
                  value={transferPayload.targetWarehouseId}
                  onChange={(e) => setTransferPayload(prev => ({ ...prev, targetWarehouseId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                >
                  <option value="wh-1">{isAr ? "مستودع الخرطوم للأجهزة والمكاتب" : "Khartoum IT Depot"}</option>
                  <option value="wh-2">{isAr ? "مستودع بورتسودان للمعدات الثقيلة" : "Port Sudan Heavy Depot"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الكمية المطلوبة للنقل" : "Quantity to Transfer"}</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max={selectedInventoryItem.quantity}
                  value={transferPayload.quantity}
                  onChange={(e) => setTransferPayload(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowTransferInventoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg"
                >
                  {isAr ? "تأكيد التحويل اللوجستي" : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: CYCLE COUNT INVENTORY */}
      {showCountInventoryModal && selectedInventoryItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">{isAr ? "تسجيل تدقيق وجرد مخزني" : "Cycle count audit"}</h3>
              <button onClick={() => setShowCountInventoryModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleInventoryCount} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">{isAr ? "اسم الصنف المدقق" : "Inspected Item"}</label>
                <div className="bg-slate-50 p-3 rounded-lg text-sm font-bold text-slate-800">
                  {isAr ? selectedInventoryItem.nameAr : selectedInventoryItem.nameEn}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الكمية الفعلية الموجودة على الرف" : "Physical Qty on Rack"}</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={countPayload.physicalQty}
                  onChange={(e) => setCountPayload(prev => ({ ...prev, physicalQty: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowCountInventoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg"
                >
                  {isAr ? "تسجيل الجرد الفعلي" : "Post Audit Count"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: FLEET GPS & TELEMETRY UPDATE */}
      {showFleetUpdateModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-base">
                {isAr ? `تحديث تتبع المركبة: ${selectedVehicle.plateNumber}` : `Update vehicle: ${selectedVehicle.plateNumber}`}
              </h3>
              <button onClick={() => setShowFleetUpdateModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            <form onSubmit={handleFleetUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "عداد المسافات الحالي (KM)" : "Current Mileage (KM)"}</label>
                <input 
                  type="number" 
                  required
                  value={fleetUpdatePayload.mileage}
                  onChange={(e) => setFleetUpdatePayload(prev => ({ ...prev, mileage: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "خط العرض (Latitude)" : "Latitude"}</label>
                  <input 
                    type="text" 
                    required
                    value={fleetUpdatePayload.lat}
                    onChange={(e) => setFleetUpdatePayload(prev => ({ ...prev, lat: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "خط الطول (Longitude)" : "Longitude"}</label>
                  <input 
                    type="text" 
                    required
                    value={fleetUpdatePayload.lng}
                    onChange={(e) => setFleetUpdatePayload(prev => ({ ...prev, lng: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "حالة التشغيل والصيانة" : "Maintenance Status"}</label>
                <select 
                  value={fleetUpdatePayload.maintenanceStatus}
                  onChange={(e) => setFleetUpdatePayload(prev => ({ ...prev, maintenanceStatus: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                >
                  <option value="operational">{isAr ? "جاهز للخدمة (Operational)" : "Operational"}</option>
                  <option value="needs_preventive">{isAr ? "بحاجة لصيانة دورية وقائية" : "Needs Preventive maintenance"}</option>
                  <option value="critical">{isAr ? "متعطل - يتطلب إصلاح عاجل" : "Critical breakdown"}</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowFleetUpdateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-sudan-green hover:bg-sudan-green/90 text-white rounded-lg"
                >
                  {isAr ? "تحديث وتأكيد" : "Confirm Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
