import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database, Activity, Shield, Share2, FileSpreadsheet, TrendingUp, FileText,
  BarChart3, Eye, Settings, Search, Bot, Download, Plus, CheckCircle2,
  AlertTriangle, RefreshCw, Play, Lock, UserCheck, History, Calendar,
  ListTodo, Sliders, Globe, Server, AlertCircle, FileSignature, ChevronRight,
  ShieldAlert, ShieldCheck, Layers, HelpCircle, Check, Info, InfoIcon, Key, ArrowUpRight
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

interface Props {
  currentLanguage: "ar" | "en";
  role: string;
}

// Interfaces & Types for Phase 17
interface MasterRecord {
  id: string;
  type: "business" | "product" | "service";
  code: string;
  nameAr: string;
  nameEn: string;
  classification: string; // e.g. ISIC v4, HS Code
  status: "Active" | "Pending" | "Updated";
  lastSync: string;
}

interface OpenDataset {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  version: string;
  license: string;
  citations: number;
  downloads: number;
  lastUpdated: string;
  classification: "Public" | "Restricted" | "Sovereign";
}

interface DataQualityIssue {
  id: string;
  field: string;
  issueAr: string;
  issueEn: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "Resolved";
}

export default function SovereignCommercialDataGovernance({ currentLanguage, role }: Props) {
  const [activeTab, setActiveTab] = useState<string>("data-hub");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Module 1 States: Master Registries
  const [masterRecords, setMasterRecords] = useState<MasterRecord[]>([]);
  const [newCode, setNewCode] = useState("");
  const [newNameAr, setNewNameAr] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newClassification, setNewClassification] = useState("");
  const [newRecordType, setNewRecordType] = useState<"business" | "product" | "service">("business");

  // Module 2 States: Open Data datasets
  const [datasets, setDatasets] = useState<OpenDataset[]>([]);
  const [datasetSearch, setDatasetSearch] = useState("");

  // Module 3 & 7 States: Economic & Business Analytics
  const [statsPeriod, setStatsPeriod] = useState<"2026" | "five-year">("2026");

  // Module 4 States: Data Stewardship & Governance Lineage
  const [selectedAsset, setSelectedAsset] = useState<string>("corp-registry");

  // Module 5 States: Data Quality Scan
  const [qualityScore, setQualityScore] = useState<number>(94);
  const [qualityIssues, setQualityIssues] = useState<DataQualityIssue[]>([
    { id: "iss-1", field: "Capital Amount", issueAr: "قيمة رأس المال لشركة الخرطوم مفقودة أو صفرية في السجل البديل", issueEn: "Capital value for Khartoum Co. is missing or zero in secondary registry", severity: "High", status: "Open" },
    { id: "iss-2", field: "HS Code Matching", issueAr: "تعارض طفيف في تصنيف رمز التنسيق (HS Code) لصادرات السمسم", issueEn: "Minor discrepancy in HS Code classification for sesame exports", severity: "Medium", status: "Open" },
    { id: "iss-3", field: "License Expiry", issueAr: "تاريخ انتهاء الترخيص الصناعي يحتاج مراجعة مع هيئة الصناعة الاتحادية", issueEn: "Industrial license expiry date requires cross-reference with Federal Industry Bureau", severity: "Low", status: "Open" }
  ]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [aiQualityRecommendation, setAiQualityRecommendation] = useState<string>("");

  // Module 6 States: National Data Exchange
  const [exchangeLogs, setExchangeLogs] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  // Module 7: AI Analytics Assistant
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // Module 8: Data Privacy Consent
  const [maskSensitiveData, setMaskSensitiveData] = useState<boolean>(true);
  const [consents, setConsents] = useState([
    { id: "con-1", entity: "Ministry of Finance", purpose: "Revenue Calculation & Taxation Hub Sync", status: "Approved", expiry: "2027-12-31" },
    { id: "con-2", entity: "Central Bank of Sudan", purpose: "National Financial Flow Reporting & AML", status: "Approved", expiry: "2028-06-30" },
    { id: "con-3", entity: "Sudan Customs Authority", purpose: "Import/Export Single Window Clearing Integration", status: "Approved", expiry: "2027-10-15" }
  ]);

  // REST / GraphQL Log
  const [apiLogs, setApiLogs] = useState<string[]>([]);

  // Database Generation State (MySQL DDL Script Generation)
  const [sqlType, setSqlType] = useState<"migration" | "rollback">("migration");

  // Load Initial Hub & Dataset Records
  const fetchHubData = async () => {
    setLoading(true);
    try {
      setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] GET /api/commercial-data-governance/hub-records`, ...prev]);
      const res = await fetch("/api/commercial-data-governance/hub-records");
      const data = await res.json();
      if (data.success) {
        setMasterRecords(data.records);
        setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] Response: 200 OK (${data.records.length} Master records loaded)`, ...prev]);
      }
    } catch (e) {
      setErrorMessage(currentLanguage === "ar" ? "فشل الاتصال بخادم حوكمة البيانات الوطني" : "Failed to connect to National Data Governance server");
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] GET /api/commercial-data-governance/datasets`, ...prev]);
      const res = await fetch("/api/commercial-data-governance/datasets");
      const data = await res.json();
      if (data.success) {
        setDatasets(data.datasets);
        setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] Response: 200 OK (${data.datasets.length} Open Datasets loaded)`, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeLogs = async () => {
    try {
      const res = await fetch("/api/commercial-data-governance/exchange-logs");
      const data = await res.json();
      if (data.success) {
        setExchangeLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHubData();
    fetchDatasets();
    fetchExchangeLogs();

    // Setup an interval to mock real-time event streaming in Data Exchange
    const interval = setInterval(() => {
      if (isStreaming) {
        const mockLog = {
          id: `exch-${Date.now()}`,
          source: ["Customs System", "Central Bank Hub", "Taxation Authority", "SME Registry Gateway"][Math.floor(Math.random() * 4)],
          destination: "National Commercial Data Hub",
          dataType: ["Export Shipments", "Capital Registry Updates", "HS Classification Codes", "VAT Returns Mapping"][Math.floor(Math.random() * 4)],
          volume: Math.floor(Math.random() * 500) + 50,
          status: Math.random() > 0.05 ? "Success" : "Warning",
          timestamp: new Date().toLocaleTimeString()
        };
        setExchangeLogs(prev => [mockLog, ...prev.slice(0, 14)]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handle Add Master Registry Record (Module 1)
  const handleAddMasterRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newNameAr || !newNameEn) {
      setErrorMessage(currentLanguage === "ar" ? "الرجاء تعبئة كافة الحقول الأساسية" : "Please fill in all mandatory fields");
      return;
    }
    setLoading(true);
    try {
      setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] POST /api/commercial-data-governance/hub-records`, ...prev]);
      const res = await fetch("/api/commercial-data-governance/hub-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newRecordType,
          code: newCode,
          nameAr: newNameAr,
          nameEn: newNameEn,
          classification: newClassification || "General"
        })
      });
      const data = await res.json();
      if (data.success) {
        setMasterRecords(prev => [data.record, ...prev]);
        setSuccessMessage(currentLanguage === "ar" ? "تم تسجيل وحفظ السجل الرئيسي الجديد ومزامنته فوراً" : "New master data record registered and synchronized successfully");
        setNewCode("");
        setNewNameAr("");
        setNewNameEn("");
        setNewClassification("");
        setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] Response: 201 Created (ID: ${data.record.id})`, ...prev]);
      }
    } catch (e) {
      setErrorMessage("Error adding record to database");
    } finally {
      setLoading(false);
    }
  };

  // GraphQL Simulated Trigger
  const runGraphQLQuery = async (queryName: string) => {
    setLoading(true);
    try {
      setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] GraphQL Query: query ${queryName} { ... }`, ...prev]);
      const queryStr = `
        query ${queryName} {
          getNationalRegistryAnalytics {
            dataIntegrityScore
            activeConsentsCount
            totalExchangedLogsBytes
            datasetsPublished
          }
        }
      `;
      const res = await fetch("/api/economic-intelligence/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryStr })
      });
      const data = await res.json();
      if (data.data) {
        setSuccessMessage(currentLanguage === "ar" ? "تم استدعاء بيانات الحوكمة بنجاح عبر بوابة GraphQL" : "Governance analytics retrieved successfully via GraphQL gateway");
        setApiLogs(prev => [`[${new Date().toLocaleTimeString()}] GraphQL Response: Success`, ...prev]);
      }
    } catch (e) {
      setErrorMessage("GraphQL connection error");
    } finally {
      setLoading(false);
    }
  };

  // Run AI Data Quality Advisor (Module 5)
  const handleAIQualityScan = () => {
    setScanning(true);
    setAiQualityRecommendation("");
    setTimeout(() => {
      setScanning(false);
      const isCritical = qualityIssues.length > 0;
      if (isCritical) {
        setQualityScore(97);
        setAiQualityRecommendation(
          currentLanguage === "ar"
            ? "نصيحة جودة البيانات بالذكاء الاصطناعي: تم فحص 2,480 سجلاً. تم رصد قيم صفرية لمستويات رأس المال لشركات تم تأسيسها مؤخراً. نقترح تطبيق قاعدة تحقق إجبارية (JSON Schema Validation) تمنع القيم الفارغة. تم تصحيح رمزي HS لتصنيف السمسم والفول السوداني تلقائياً ومطابقتها مع تصنيف الجمارك الوطني الموحد."
            : "AI Data Quality Recommendation: 2,480 master records scanned. Identified empty capital amount values on newly registered companies. Recommendation: enforce database validation constraint. Automatically harmonized 2 mismatched HS export classification codes with customs database guidelines."
        );
      } else {
        setQualityScore(99.5);
        setAiQualityRecommendation(
          currentLanguage === "ar"
            ? "تقرير جودة البيانات بالذكاء الاصطناعي: ممتاز! مستوى سلامة وموثوقية البيانات يتطابق مع معايير الـ ISO 27001 والإنفاذ السيادي بنسبة 99.5%."
            : "AI Quality Report: Perfect alignment! Data integrity scorecard checks indicate 99.5% adherence to ISO 27001 data governance and compliance protocols."
        );
      }
    }, 1200);
  };

  // Clean Quality Issue
  const handleResolveIssue = (id: string) => {
    setQualityIssues(prev => prev.map(iss => iss.id === id ? { ...iss, status: "Resolved" } : iss));
    setQualityScore(prev => Math.min(100, prev + 1));
    setSuccessMessage(currentLanguage === "ar" ? "تم تصحيح وتطهير السجل المختار بنجاح" : "Selected data quality issue resolved and cleansed");
  };

  // AI Analytics Assistant (Module 7)
  const handleAIAnalyticsQuery = () => {
    if (!aiPrompt) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const promptLower = aiPrompt.toLowerCase();
      if (promptLower.includes("trade") || promptLower.includes("تصدير") || promptLower.includes("تجارة")) {
        setAiResponse(
          currentLanguage === "ar"
            ? "الذكاء الاصطناعي الاقتصادي: تشير الإحصاءات الزمنية لعام 2026 إلى نمو مطرد في صادرات الصمغ العربي والذهب والماشية بنسبة 14.2% مقارنة بالربع السابق. يرجع ذلك إلى تفعيل منصة النافذة الموحدة للاستيراد والتصدير وسرعة فحص المستندات المشتركة مع الجمارك."
            : "Economic AI Insight: Time-series statistical modeling for 2026 reveals a robust 14.2% Q-o-Q expansion in national agricultural commodity and mineral exports (specifically Gum Arabic and sesame seed markets), powered by streamlined interoperability integration between Ministry of Commerce and Sudan Customs Systems."
        );
      } else if (promptLower.includes("quality") || promptLower.includes("جودة")) {
        setAiResponse(
          currentLanguage === "ar"
            ? "الذكاء الاصطناعي الاقتصادي: مؤشر جودة البيانات الكلي للمستودع الوطني يبلغ حالياً 94%. مجالات التحسين الرئيسية تنحصر في مطابقة البيانات الجغرافية القديمة للمصانع والولايات."
            : "Economic AI Insight: Overall data quality index is 94%. Recommended improvement vector is mapping historical geographical and regional registration records to the new Unified Geographic Reference Master."
        );
      } else {
        setAiResponse(
          currentLanguage === "ar"
            ? "الذكاء الاصطناعي الاقتصادي: تم تحليل طلبك. بناءً على لوحة البيانات الكبرى، يظهر القطاع التجاري والاستثماري بالسودان تعافياً نشطاً بقيادة الولايات الإقليمية (الخرطوم، البحر الأحمر، ونهر النيل) بفضل تسهيلات التراخيص الرقمية."
            : "Economic AI Insight: Request analyzed. According to national registers, corporate registrations and investment inflows are showing a resilient 8.4% rebound, led by Khartoum, Red Sea, and River Nile states, accelerated by decentralized automated digital licensing."
        );
      }
    }, 1000);
  };

  // SQL Script Generator
  const generateSqlScript = () => {
    if (sqlType === "migration") {
      return `
-- ============================================================================
-- SDMCI NATIONAL COMMERCIAL DATA GOVERNANCE & STATISTICS SCHEMA
-- MIGRATION SCRIPT: PHASE 17
-- Target Platform: MySQL 8.0+ | Engine: InnoDB | Character Set: utf8mb4
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Master Data Registries Table
CREATE TABLE IF NOT EXISTS \`sdmci_master_data\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`record_type\` ENUM('business', 'product', 'service') NOT NULL,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name_ar\` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`name_en\` VARCHAR(255) NOT NULL,
  \`classification\` VARCHAR(100) DEFAULT 'General',
  \`status\` ENUM('Active', 'Pending', 'Updated') DEFAULT 'Active',
  \`last_sync\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_record_type\` (\`record_type\`),
  INDEX \`idx_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. National Open Datasets Registry Table
CREATE TABLE IF NOT EXISTS \`sdmci_open_datasets\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`title_ar\` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`title_en\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`version\` VARCHAR(20) DEFAULT '1.0.0',
  \`license\` VARCHAR(50) DEFAULT 'Sovereign Open Data License v1.0',
  \`citations\` INT DEFAULT 0,
  \`downloads\` INT DEFAULT 0,
  \`classification\` ENUM('Public', 'Restricted', 'Sovereign') DEFAULT 'Public',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Data Governance Audit & Ownership Lineage
CREATE TABLE IF NOT EXISTS \`sdmci_data_lineage\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`asset_name\` VARCHAR(100) NOT NULL,
  \`steward_role\` VARCHAR(100) NOT NULL,
  \`sensitivity\` VARCHAR(50) DEFAULT 'Internal',
  \`quality_score\` DECIMAL(5,2) DEFAULT 100.00,
  \`retention_policy\` VARCHAR(255) DEFAULT '10 Years',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. National Interoperability Exchange Logs
CREATE TABLE IF NOT EXISTS \`sdmci_exchange_logs\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`source_node\` VARCHAR(100) NOT NULL,
  \`dest_node\` VARCHAR(100) NOT NULL,
  \`data_type\` VARCHAR(150) NOT NULL,
  \`volume_bytes\` INT DEFAULT 0,
  \`status\` VARCHAR(50) DEFAULT 'Success',
  \`timestamp\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Seed Records for Integrity
INSERT IGNORE INTO \`sdmci_data_lineage\` (\`id\`, \`asset_name\`, \`steward_role\`, \`sensitivity\`, \`quality_score\`, \`retention_policy\`)
VALUES 
('corp-registry', 'Federal Corporate Registry Master', 'Director of Corporate Governance', 'Sovereign Confidential', 98.40, 'Permanent Sovereign Record'),
('export-indices', 'Customs Single Window Trade Registers', 'Trade Statistics Advisor', 'Public Restricted', 96.10, '15 Years Policy'),
('sme-data', 'SME Classification and Classification Codes', 'Director of SME Incubators', 'Public Open', 94.20, '10 Years Archive');

SET FOREIGN_KEY_CHECKS = 1;
      `;
    } else {
      return `
-- ============================================================================
-- SDMCI NATIONAL COMMERCIAL DATA GOVERNANCE & STATISTICS SCHEMA
-- ROLLBACK SCRIPT: PHASE 17
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS \`sdmci_exchange_logs\`;
DROP TABLE IF EXISTS \`sdmci_data_lineage\`;
DROP TABLE IF EXISTS \`sdmci_open_datasets\`;
DROP TABLE IF EXISTS \`sdmci_master_data\`;

SET FOREIGN_KEY_CHECKS = 1;
      `;
    }
  };

  // Filter master records
  const filteredMaster = masterRecords.filter(rec => {
    const matchesSearch = rec.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || rec.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Filter datasets
  const filteredDatasets = datasets.filter(ds => 
    ds.titleAr.toLowerCase().includes(datasetSearch.toLowerCase()) ||
    ds.titleEn.toLowerCase().includes(datasetSearch.toLowerCase()) ||
    ds.category.toLowerCase().includes(datasetSearch.toLowerCase())
  );

  // Time-Series Mock Data
  const timeSeriesData2026 = [
    { period: "Jan", corporateRegistrations: 420, tradeExportsValue: 310, industrialOutputIndex: 82, qualityIndex: 94 },
    { period: "Feb", corporateRegistrations: 480, tradeExportsValue: 340, industrialOutputIndex: 85, qualityIndex: 94 },
    { period: "Mar", corporateRegistrations: 510, tradeExportsValue: 380, industrialOutputIndex: 88, qualityIndex: 95 },
    { period: "Apr", corporateRegistrations: 590, tradeExportsValue: 420, industrialOutputIndex: 90, qualityIndex: 94 },
    { period: "May", corporateRegistrations: 640, tradeExportsValue: 490, industrialOutputIndex: 93, qualityIndex: 96 },
    { period: "Jun", corporateRegistrations: 710, tradeExportsValue: 540, industrialOutputIndex: 95, qualityIndex: 96 },
    { period: "Jul", corporateRegistrations: 780, tradeExportsValue: 590, industrialOutputIndex: 98, qualityIndex: 97 }
  ];

  const timeSeriesFiveYear = [
    { period: "2022", corporateRegistrations: 2800, tradeExportsValue: 1900, industrialOutputIndex: 68, qualityIndex: 88 },
    { period: "2023", corporateRegistrations: 3400, tradeExportsValue: 2400, industrialOutputIndex: 72, qualityIndex: 90 },
    { period: "2024", corporateRegistrations: 4100, tradeExportsValue: 2900, industrialOutputIndex: 78, qualityIndex: 92 },
    { period: "2025", corporateRegistrations: 5200, tradeExportsValue: 3700, industrialOutputIndex: 86, qualityIndex: 93 },
    { period: "2026", corporateRegistrations: 7200, tradeExportsValue: 4900, industrialOutputIndex: 96, qualityIndex: 96 }
  ];

  const dynamicChartData = statsPeriod === "2026" ? timeSeriesData2026 : timeSeriesFiveYear;

  // Pie chart data for Category Distributions
  const categoryChartData = [
    { name: "Agricultural Exports", value: 45, color: "#10B981" },
    { name: "Industrial Production", value: 25, color: "#0D9488" },
    { name: "SME Trade / Retail", value: 20, color: "#0F766E" },
    { name: "Sovereign Services", value: 10, color: "#115E59" }
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#1E293B]" id="sdmci-data-governance-platform">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#0A2E24] to-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl mb-6 border border-emerald-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
              {currentLanguage === "ar" ? "رؤية السودان 2035 - حوكمة وإتاحة البيانات التجارية والوطنية" : "SUDAN VISION 2035 - NATIONAL COMMERCE GOVERNANCE & OPEN DATA"}
            </span>
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2.5" style={{ fontFamily: "Cairo, sans-serif" }}>
              <Database className="w-8 h-8 text-emerald-400 animate-pulse" />
              {currentLanguage === "ar" ? "المنصة الوطنية الموحدة لحوكمة البيانات التجارية والإحصاء الاقتصادي" : "National Commercial Data Governance & Economic Statistics Platform"}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-4xl leading-relaxed">
              {currentLanguage === "ar"
                ? "البوابة القومية الرسمية لإدارة البيانات التجارية الكبرى، وتصنيف السجلات والسلع، وتوفير مجموعات البيانات المفتوحة، والإحصاء الزمني، ومطابقة جودة البيانات بالذكاء الاصطناعي مع التبادل البيني الآمن."
                : "Authoritative sovereign platform for corporate registries, national commodity catalogs (HS code mapping), open-data APIs, time-series economic indicators, AI-driven registry cleansing, and secure multi-agency data exchange."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                fetchHubData();
                fetchDatasets();
                setSuccessMessage(currentLanguage === "ar" ? "تمت إعادة تحميل ومزامنة البيانات الفيدرالية بنجاح" : "Federal registries reloaded and synchronized");
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              {currentLanguage === "ar" ? "تحديث المزامنة" : "Force Refresh"}
            </button>
            <div className="bg-slate-900/80 border border-emerald-800/80 px-3.5 py-2 rounded-xl text-center text-xs font-bold font-mono">
              <span className="text-emerald-400 block text-[9px] uppercase tracking-widest font-black">Data Governance Node</span>
              SECURE INTEGRITY 256
            </div>
          </div>
        </div>
      </div>

      {/* Message banners */}
      {(successMessage || errorMessage) && (
        <div className="mb-6 flex flex-col gap-2">
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="mr-auto font-mono hover:text-slate-950 font-black cursor-pointer">✕</button>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 text-red-900 p-4 rounded-2xl border border-red-200 text-xs font-bold flex items-center gap-2 shadow-xs">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage("")} className="mr-auto font-mono hover:text-slate-950 font-black cursor-pointer">✕</button>
            </div>
          )}
        </div>
      )}

      {/* Core Grid Platform */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* 10 MODULES SIDEBAR SELECTOR */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1 h-fit">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3.5 pb-2.5 border-b border-slate-100 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            {currentLanguage === "ar" ? "منظومة البيانات القومية" : "COMMERCE GOVERNANCE"}
          </h3>

          {[
            { id: "data-hub", labelAr: "السجل التجاري الرئيسي الموحد", labelEn: "Commercial Data Hub", icon: Database, descAr: "إدارة البيانات المرجعية الموحدة", descEn: "Commercial master registry" },
            { id: "open-data", labelAr: "منصة البيانات المفتوحة", labelEn: "National Open Data Portal", icon: Share2, descAr: "إتاحة السجلات وعقود الترخيص للجمهور", descEn: "Public dataset catalog & open APIs" },
            { id: "statistics-center", labelAr: "مركز الإحصاءات الاقتصادية", labelEn: "Economic Statistics Center", icon: TrendingUp, descAr: "تحليلات البيانات الكبرى الزمنية", descEn: "Economic & trade metrics" },
            { id: "data-lineage", labelAr: "إشراف وحوكمة البيانات", labelEn: "Enterprise Governance", icon: Shield, descAr: "مسؤولو السجلات وتتبع التدفق (Lineage)", descEn: "Stewardship & metadata catalog" },
            { id: "data-quality", labelAr: "إدارة جودة وصحة السجلات", labelEn: "Data Quality Management", icon: AlertTriangle, descAr: "تحليل وتطهير البيانات بالذكاء الاصطناعي", descEn: "Scans & automated cleansing" },
            { id: "data-exchange", labelAr: "منصة التبادل البيني الآمن", labelEn: "National Data Exchange", icon: Server, descAr: "مزامنة الأنظمة الحكومية والجمارك", descEn: "Event stream & secure API logs" },
            { id: "business-analytics", labelAr: "مركز ذكاء الأعمال المتقدم", labelEn: "Business Analytics", icon: BarChart3, descAr: "لوحات تفاعلية ومستشار التحليل", descEn: "Sovereign dashboards & AI insights" },
            { id: "data-privacy", labelAr: "حماية الخصوصية وتصنيف السرية", labelEn: "Data Privacy & Consent", icon: Lock, descAr: "حجب البيانات الحساسة وصلاحيات التبادل", descEn: "Masking & consent management" },
            { id: "reporting-center", labelAr: "مركز التقارير الإحصائية المعتمدة", labelEn: "National Reporting Center", icon: FileSpreadsheet, descAr: "توليد التقارير التنفيذية والـ PDF", descEn: "KPI booklets & AI summaries" },
            { id: "data-observatory", labelAr: "المرصد الوطني لأداء البيانات", labelEn: "National Observatory", icon: Activity, descAr: "لوحة تحكم مؤشرات الأداء الكبرى", descEn: "Executive data telemetry & KPIs" }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className={`w-full flex flex-col gap-0.5 px-3 py-2.5 text-right transition-all border ${
                  isSelected
                    ? "bg-[#064E3B] text-white border-[#064E3B] shadow-md font-black rounded-2xl"
                    : "bg-white border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-100 rounded-xl"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="text-xs font-bold leading-tight">{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
                </div>
                <span className={`text-[9px] font-semibold block ${isSelected ? "text-slate-300" : "text-gray-400"}`}>
                  {currentLanguage === "ar" ? tab.descAr : tab.descEn}
                </span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 mt-2">
            <button
              onClick={() => runGraphQLQuery("GetSovereignDataStats")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
            >
              <Activity className="w-3 h-3 text-emerald-700" />
              {currentLanguage === "ar" ? "فحص تكامل GraphQL API" : "Verify GraphQL API Gateway"}
            </button>
          </div>
        </div>

        {/* 10 MODULES CONTENT PANELS */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex-1 flex flex-col justify-between">

            {/* MODULE 1: NATIONAL COMMERCIAL DATA HUB */}
            {activeTab === "data-hub" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2 font-mono">
                    <Database className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "السجل التجاري الرئيسي والبيانات المرجعية" : "National Commercial Master Data Hub"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "قاعدة البيانات الاتحادية المركزية للشركات، المنتجات والخدمات مع دعم تصنيف الـ HS الدولي وتصنيف الأنشطة الصناعية ISIC v4." : "Unified federal index containing registered corporate profiles, manufactured goods (HS Codes), and regulatory status parameters."}
                  </p>
                </div>

                {/* Filter and Search controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative md:col-span-2">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "البحث برمز السجل أو الاسم التجاري..." : "Search by code or commercial name..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-2.5 pr-10 pl-3 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-[#064E3B]"
                    />
                  </div>
                  <div>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer text-slate-800"
                    >
                      <option value="All">{currentLanguage === "ar" ? "جميع السجلات" : "All Record Types"}</option>
                      <option value="business">{currentLanguage === "ar" ? "سجلات المنشآت والشركات" : "Businesses Master"}</option>
                      <option value="product">{currentLanguage === "ar" ? "رموز وتصنيفات المنتجات" : "Products Catalog"}</option>
                      <option value="service">{currentLanguage === "ar" ? "رموز وتصنيفات الخدمات" : "Services Directory"}</option>
                    </select>
                  </div>
                </div>

                {/* Table & Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Master Records list */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "السجلات الرئيسية الفعالة" : "Authoritative Master Records"}</span>
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {filteredMaster.length > 0 ? (
                        filteredMaster.map(rec => (
                          <div key={rec.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all text-xs font-bold space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-emerald-800 font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md uppercase">{rec.type}: {rec.code}</span>
                              <span className="text-[10px] text-gray-400 font-medium font-mono">{rec.lastSync}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <h4 className="text-slate-950 font-black text-sm">{currentLanguage === "ar" ? rec.nameAr : rec.nameEn}</h4>
                              <p className="text-[10px] text-slate-500 font-semibold">{currentLanguage === "ar" ? `التصنيف: ${rec.classification}` : `Classification: ${rec.classification}`}</p>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-slate-200/50">
                              <span className="text-[10px] text-slate-400">Status: {rec.status}</span>
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 text-[9px] uppercase tracking-wider">
                                <Check className="w-3 h-3" /> VERIFIED
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-50 p-8 rounded-2xl text-center text-xs font-bold text-gray-400">
                          {currentLanguage === "ar" ? "لا توجد سجلات مطابقة للبحث." : "No records matching search."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add New Master Form */}
                  <form onSubmit={handleAddMasterRecord} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 h-fit">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-emerald-700" />
                      {currentLanguage === "ar" ? "إدراج سجل رئيسي معتمد" : "Register Master Record"}
                    </h4>
                    
                    <div className="space-y-3.5 text-xs font-bold">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "نوع السجل الرئيسي:" : "Record Type:"}</label>
                        <select
                          value={newRecordType}
                          onChange={(e) => setNewRecordType(e.target.value as any)}
                          className="bg-white border border-slate-200 p-2 rounded-xl outline-none"
                        >
                          <option value="business">Business</option>
                          <option value="product">Product</option>
                          <option value="service">Service</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "رمز السجل الموحد:" : "Unique Register Code:"}</label>
                        <input
                          type="text"
                          required
                          value={newCode}
                          onChange={(e) => setNewCode(e.target.value)}
                          placeholder="SD-HS-1209 / SD-BUS-5532"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "الاسم التجاري / التعريفي (عربي):" : "Name (Arabic):"}</label>
                        <input
                          type="text"
                          required
                          value={newNameAr}
                          onChange={(e) => setNewNameAr(e.target.value)}
                          placeholder="مثال: قطن سوداني طويل التيلة"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "الاسم التجاري / التعريفي (إنجليزي):" : "Name (English):"}</label>
                        <input
                          type="text"
                          required
                          value={newNameEn}
                          onChange={(e) => setNewNameEn(e.target.value)}
                          placeholder="Example: Sudanese Long Staple Cotton"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400">{currentLanguage === "ar" ? "رمز التصنيف الاقتصادي (ISIC/HS):" : "Classification Code:"}</label>
                        <input
                          type="text"
                          value={newClassification}
                          onChange={(e) => setNewClassification(e.target.value)}
                          placeholder="HS-5201.00 / ISIC-1311"
                          className="bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#064E3B] hover:bg-emerald-950 text-white p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تسجيل ومزامنة السجل الموحد" : "Register and Sync Master"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 2: NATIONAL OPEN DATA PLATFORM */}
            {activeTab === "open-data" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "منصة البيانات المفتوحة للجمهور والباحثين" : "National Commercial Open Data Portal"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "توفير مجموعات البيانات الاقتصادية، التجارية والصناعية الموثوقة بصيغة مفتوحة للتنزيل والبحث والتكامل البرمجي مع توثيق التراخيص وحقوق الاستشهاد." : "Access public dataset catalogs, download CSV/JSON formats, trace metadata schemas, and review active API access policies."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative md:col-span-2">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder={currentLanguage === "ar" ? "البحث في مستودع البيانات المفتوحة..." : "Search public dataset catalog..."}
                      value={datasetSearch}
                      onChange={(e) => setDatasetSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-2.5 pr-10 pl-3 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSuccessMessage(currentLanguage === "ar" ? "تم توليد وتنزيل حزمة البيانات بنجاح" : "Dataset package generated successfully for export");
                      }}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 p-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 text-slate-800 w-full cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-700" />
                      {currentLanguage === "ar" ? "تصدير الكل" : "Export Catalog"}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredDatasets.map(ds => (
                    <div key={ds.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between gap-4 text-xs font-bold items-start md:items-center hover:border-slate-200 transition-all">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="bg-emerald-50 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">{ds.category}</span>
                          <span className="text-[10px] text-gray-400 font-mono">v{ds.version}</span>
                          <span className="bg-slate-900 text-emerald-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-emerald-800 uppercase font-black">{ds.classification}</span>
                        </div>
                        <h4 className="text-slate-950 font-black text-sm">{currentLanguage === "ar" ? ds.titleAr : ds.titleEn}</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                          {currentLanguage === "ar" 
                            ? `الترخيص: ${ds.license} | تاريخ التحديث: ${ds.lastUpdated}` 
                            : `License: ${ds.license} | Updated: ${ds.lastUpdated}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "التحميلات" : "Downloads"}</span>
                          <span className="font-mono text-xs text-slate-900 font-black">{ds.downloads.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "الاستشهاد" : "Citations"}</span>
                          <span className="font-mono text-xs text-emerald-700 font-black">{ds.citations}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSuccessMessage(currentLanguage === "ar" ? `بدأ تحميل ملف ${ds.titleAr} بنجاح.` : `Download started for ${ds.titleEn}`);
                          }}
                          className="bg-[#064E3B] hover:bg-emerald-950 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                          title="Download Dataset"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 3: ECONOMIC STATISTICS CENTER */}
            {activeTab === "statistics-center" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-700" />
                      {currentLanguage === "ar" ? "مركز الإحصاءات التجارية والاقتصادية الزمنية" : "National Economic Statistics & Time-Series Center"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "مؤشرات نمو قطاع الأعمال، إنتاج المصانع، صادرات المحاصيل النقدية ومعدلات الامتثال الكلي." : "Analyze historical time-series logs for industrial capacities, trade volumes, SME dynamics, and register quality scorecards."}
                    </p>
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
                    <button
                      onClick={() => setStatsPeriod("2026")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        statsPeriod === "2026" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {currentLanguage === "ar" ? "عام 2026" : "2026 Monthly"}
                    </button>
                    <button
                      onClick={() => setStatsPeriod("five-year")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        statsPeriod === "five-year" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {currentLanguage === "ar" ? "تتبع 5 سنوات" : "5-Year Trend"}
                    </button>
                  </div>
                </div>

                {/* Economic Trends Graph */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                      {currentLanguage === "ar" ? "مؤشرات نمو التسجيلات وحجم التجارة الخارجية" : "Business Registrations & Export Valuation Indices"}
                    </span>
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicChartData}>
                          <defs>
                            <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="tradeGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="period" className="text-[10px] font-bold" />
                          <YAxis className="text-[10px] font-bold" />
                          <Tooltip contentStyle={{ fontSize: 11, fontWeight: "bold" }} />
                          <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                          <Area type="monotone" name={currentLanguage === "ar" ? "السجلات الجديدة" : "New Registrations"} dataKey="corporateRegistrations" stroke="#10B981" fillOpacity={1} fill="url(#regGrad)" strokeWidth={2} />
                          <Area type="monotone" name={currentLanguage === "ar" ? "صادرات التجارة (مليون دولار)" : "Exports Val ($M)"} dataKey="tradeExportsValue" stroke="#0F766E" fillOpacity={1} fill="url(#tradeGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Distribution breakdown */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2">
                      {currentLanguage === "ar" ? "توزيع حجم التجارة الوطنية حسب القطاع" : "Trade Sector Distribution Breakdown"}
                    </span>
                    <div className="h-[180px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: 10, fontWeight: "bold" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1.5 text-[10px] font-bold">
                      {categoryChartData.map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: cat.color }}></span>
                            {cat.name}
                          </span>
                          <span className="text-slate-900 font-mono">{cat.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: ENTERPRISE DATA GOVERNANCE & STEWARDSHIP */}
            {activeTab === "data-lineage" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "حوكمة وإشراف البيانات وسجل الامتثال الموحد" : "Enterprise Data Governance & Lineage Portal"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "تحديد ملكية البيانات، وتصنيف درجة السرية والحساسية، ومطابقة سياسات الاحتفاظ مع أرشيف السجلات الوطني." : "Track metadata lineages, audit individual registry stewards, specify data sensitivity codes, and monitor compliance rules."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Metadata Lineage Tree Selector */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "أصول المستودع الوطني للبيانات" : "National Data Assets Directory"}</span>
                    {[
                      { id: "corp-registry", nameAr: "سجل حوكمة وتأسيس الشركات الفيدرالي", steward: "Commercial Affairs Director", sensitivity: "Sovereign Confidential" },
                      { id: "export-indices", nameAr: "قاعدة بيانات المنشورات وتكامل الجمارك", steward: "Foreign Trade Officer", sensitivity: "Public Restricted" },
                      { id: "sme-data", nameAr: "المنظومة الرقمية للـ SMEs وتصنيفها", steward: "SME Promotion Advisor", sensitivity: "Public Open" }
                    ].map(asset => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset.id)}
                        className={`w-full text-right p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col gap-1 ${
                          selectedAsset === asset.id
                            ? "bg-emerald-50 border-emerald-300 text-slate-900"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-extrabold text-slate-900">{asset.nameAr}</span>
                        <div className="flex justify-between text-[9px] text-slate-500 border-t border-slate-100 pt-1.5 w-full">
                          <span>Steward: {asset.steward}</span>
                          <span className="font-mono text-emerald-700">{asset.sensitivity}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right: Selected Asset Metadata Details & Data Lineage Diagram */}
                  <div className="lg:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest block font-mono">DATA ASSET METADATA & LINEAGE</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full">ACTIVE POLICIES</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">{currentLanguage === "ar" ? "مسؤول الإشراف على الأصل:" : "Data Owner / Steward Role:"}</span>
                        <span className="text-slate-950 block mt-1">
                          {selectedAsset === "corp-registry" ? "Director of Corporate Governance" : selectedAsset === "export-indices" ? "Trade Statistics Advisor" : "Director of SME Incubators"}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">{currentLanguage === "ar" ? "قاعدة الاحتفاظ والأرشفة:" : "Data Retention & Disposal Rule:"}</span>
                        <span className="text-slate-950 block mt-1">
                          {selectedAsset === "corp-registry" ? "Permanent Sovereign Archive" : "15 Years Active Log Archive"}
                        </span>
                      </div>
                    </div>

                    {/* Visual Lineage Flowchart */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{currentLanguage === "ar" ? "مخطط سريان وتكامل البيانات الفيدرالية:" : "Commercial Data Lineage & Flow Tree:"}</span>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-center">
                        <div className="bg-slate-100 border border-slate-200 p-2 rounded-lg w-full md:w-auto">
                          <span className="text-slate-500 block uppercase">Ingestion Core</span>
                          <span className="text-slate-950 block">SDMCI Application Gate</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" />
                        <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg w-full md:w-auto">
                          <span className="text-emerald-700 block uppercase">Transformation Node</span>
                          <span className="text-emerald-950 block">Sovereign Validation Rule v12</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" />
                        <div className="bg-slate-950 text-white p-2 rounded-lg w-full md:w-auto">
                          <span className="text-emerald-400 block uppercase">National Registry Hub</span>
                          <span className="text-white block font-mono">InnoDB Master Database</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: DATA QUALITY MANAGEMENT */}
            {activeTab === "data-quality" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "منظومة فحص وصيانة جودة السجلات التجارية" : "National Data Quality & Cleansing Center"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "رصد تلقائي للازدواجية، تتبع القيم المفقودة، مطابقة وتطهير السجلات، والاستعانة بالذكاء الاصطناعي لإرساء معايير الجودة القومية." : "Run automated registry checks for duplicates, null-value constraints, character encoding discrepancies, and resolve anomalies instantly."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Quality metrics and Scan trigger */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">{currentLanguage === "ar" ? "مؤشر جودة البيانات الكلي" : "Global Data Quality Index"}</span>
                      <span className="text-4xl font-extrabold text-emerald-800 block my-2 font-mono">{qualityScore}%</span>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full transition-all" style={{ width: `${qualityScore}%` }}></div>
                      </div>
                    </div>

                    <button
                      onClick={handleAIQualityScan}
                      disabled={scanning}
                      className="w-full bg-[#064E3B] hover:bg-emerald-950 text-white p-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
                      {scanning ? (currentLanguage === "ar" ? "جاري تشغيل الفحص والتدقيق..." : "Scanning registry records...") : (currentLanguage === "ar" ? "تشغيل فحص جودة السجلات" : "Run Diagnostic Integrity Scan")}
                    </button>

                    {/* AI Data Quality Advisor Response */}
                    <AnimatePresence>
                      {aiQualityRecommendation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 text-[11px] leading-relaxed font-semibold space-y-2"
                        >
                          <div className="flex items-center gap-1.5 text-emerald-400 border-b border-slate-800 pb-1.5 font-bold uppercase font-mono">
                            <Bot className="w-4 h-4" />
                            <span>AI Data Quality Advisor</span>
                          </div>
                          <p>{aiQualityRecommendation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Column: Open issues and action workflow */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      {currentLanguage === "ar" ? "الحالات والتعارضات المفتوحة للمراجعة والتطهير" : "Identified Quality Anomalies & Issue Workflows"}
                    </span>

                    <div className="space-y-2.5">
                      {qualityIssues.map(issue => (
                        <div key={issue.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center gap-4 text-xs font-bold shadow-2xs">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                issue.severity === "High" ? "bg-red-50 text-red-800" : issue.severity === "Medium" ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-600"
                              }`}>{issue.severity} Severity</span>
                              <span className="text-slate-400 font-mono text-[10px]">{issue.field}</span>
                            </div>
                            <p className="text-slate-950 font-black">{currentLanguage === "ar" ? issue.issueAr : issue.issueEn}</p>
                          </div>

                          <div className="shrink-0">
                            {issue.status === "Resolved" ? (
                              <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Resolved
                              </span>
                            ) : (
                              <button
                                onClick={() => handleResolveIssue(issue.id)}
                                className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer"
                              >
                                {currentLanguage === "ar" ? "تطهير ومطابقة" : "Cleanse Record"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 6: NATIONAL DATA EXCHANGE (Secure Interoperability) */}
            {activeTab === "data-exchange" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <Server className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "منصة التكامل والتبادل الحكومي البيني الموحد" : "National Secure Commerce Data Exchange Hub"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "مزامنة الأنظمة وتكامل السجل التجاري مع مصلحة الجمارك، هيئة الضرائب الفيدرالية، الغرف التجارية والبنك المركزي عبر بروتوكولات آمنة." : "Monitor multi-agency database replication logs, transaction volumes, live event streaming, and schema integrations."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left panel: Exchange Telemetry & Active Toggle */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 text-xs font-bold">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "حالة تدفق البيانات" : "Replication Status"}</span>
                      <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px]">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        LIVE STREAMING
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{currentLanguage === "ar" ? "الشبكة الفيدرالية:" : "Node Network:"}</span>
                        <span className="text-slate-900 font-extrabold font-mono">SDMCI-EXCH-PRIMARY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{currentLanguage === "ar" ? "بروتوكول الأمان:" : "Encryption Code:"}</span>
                        <span className="text-slate-900 font-mono text-[10px]">TLS 1.3 AES-GCM-256</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setIsStreaming(!isStreaming);
                          setSuccessMessage(isStreaming ? "Stream paused" : "Stream resumed");
                        }}
                        className={`w-full p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isStreaming ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100" : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        <Play className="w-4 h-4" />
                        {isStreaming ? (currentLanguage === "ar" ? "إيقاف المزامنة اللحظية مؤقتاً" : "Pause Live Ingestion") : (currentLanguage === "ar" ? "استئناف تدفق المزامنة اللحظية" : "Resume Live Ingestion")}
                      </button>
                    </div>
                  </div>

                  {/* Right panel: Real-time event log streaming */}
                  <div className="lg:col-span-2 space-y-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      {currentLanguage === "ar" ? "سجل المعاملات والتبادل اللحظي" : "Active Data Ingestion & Sync Stream Logs"}
                    </span>

                    <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-900 font-mono text-[11px] leading-relaxed max-h-[300px] overflow-y-auto space-y-1.5">
                      {exchangeLogs.map(log => (
                        <div key={log.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-900 pb-1.5 hover:bg-slate-900 transition-colors">
                          <span className="text-white">{log.timestamp}</span>
                          <span className="text-emerald-500 font-bold">{log.source} ➔ {log.destination}</span>
                          <span className="text-slate-400">[{log.dataType}]</span>
                          <span className="text-amber-300 font-extrabold">{log.volume} KB</span>
                          <span className={log.status === "Success" ? "text-emerald-400" : "text-red-400"}>{log.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 7: BUSINESS ANALYTICS & AI ASSISTANT */}
            {activeTab === "business-analytics" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "مركز ذكاء الأعمال والتحليلات التجارية المتقدمة" : "Sovereign Commerce BI & AI Analytics Center"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "تفاعل مع مستودع البيانات القومي، توليد التحليلات التفاعلية المخصصة والمؤشرات الجغرافية الكبرى للإنتاج والتسجيلات بالسودان." : "Explore interactive national business intelligence dashboards or generate automated reports using AI-powered analytical assistant."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 cols: Regional Bento-grid Analytics */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <span className="text-xs font-black text-slate-400 block">{currentLanguage === "ar" ? "الإنتاج الصناعي الوطني المعتمد" : "National Certified Factory Capacity"}</span>
                      <span className="text-2xl font-black text-emerald-900 block my-2">184,500 <span className="text-xs font-bold text-slate-500">MT/Year</span></span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50/50 px-2 py-0.5 rounded-full w-fit">➔ +8.4% YoY Expansion</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <span className="text-xs font-black text-slate-400 block">{currentLanguage === "ar" ? "رأسمال الشركات الفعالة المسجلة" : "Aggregate Corporate Capital Valuation"}</span>
                      <span className="text-2xl font-black text-emerald-900 block my-2">SDG 18.2B</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50/50 px-2 py-0.5 rounded-full w-fit">➔ High Capital Stability</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <span className="text-xs font-black text-slate-400 block">{currentLanguage === "ar" ? "معدل الرضا وحل الشكاوى التجارية" : "Consumer Complaint Resolution Rate"}</span>
                      <span className="text-2xl font-black text-[#064E3B] block my-2">91.4%</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50/50 px-2 py-0.5 rounded-full w-fit">➔ Compliant with OM-3 Guidelines</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <span className="text-xs font-black text-slate-400 block">{currentLanguage === "ar" ? "المنشآت النشطة المصنفة رقمياً" : "SME Digitally Active Registers"}</span>
                      <span className="text-2xl font-black text-emerald-900 block my-2">12,480 Registers</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50/50 px-2 py-0.5 rounded-full w-fit">➔ 98% Compliance Level</span>
                    </div>
                  </div>

                  {/* Right Col: AI Analytical Assistant Panel */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-emerald-400 block tracking-widest font-mono uppercase">AI COMMERCE ANALYTICS PRO</span>
                      <p className="text-[11px] text-slate-300 font-bold">
                        {currentLanguage === "ar" ? "اكتب سؤالاً حول الصادرات، أداء السجلات، أو نسب الامتثال للحصول على تحليل فوري." : "Input queries regarding foreign trade, SME registrations, or regional industrial output index."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "مثال: حلل نمو حجم تجارة الصمغ العربي لعام 2026..." : "Example: analyze trade export growth trends..."}
                        className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-xs font-semibold outline-none text-white focus:border-emerald-400"
                      />
                      <button
                        onClick={handleAIAnalyticsQuery}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Bot className="w-4 h-4 text-slate-950 animate-pulse" />
                        {currentLanguage === "ar" ? "طلب تحليل ذكاء اصطناعي" : "Query Economic AI"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {aiResponse && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] leading-relaxed font-medium text-slate-200 mt-2"
                        >
                          {aiResponse}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: DATA PRIVACY & ACCESS CONTROL (GRC) */}
            {activeTab === "data-privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "إدارة سرية خصوصية البيانات وسجلات التبادل المشروط" : "National Data Privacy & Consent Management Portal"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "التحكم في مستويات مشاركة البيانات الحساسة وحجب الهويات الرقمية لضمان سلامة السجلات بما يتماشى مع قانون الأمن السيبراني." : "Manage inter-agency data sharing consent forms, enforce PII redaction policies, and audit platform security roles."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Toggle Mask Sensitive Data */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 text-xs font-bold flex flex-col justify-between">
                    <div>
                      <span className="text-slate-800 uppercase tracking-wider block mb-2">{currentLanguage === "ar" ? "قاعدة حجب وحماية البيانات الشخصية" : "PII Redaction & Masking Rules"}</span>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        {currentLanguage === "ar"
                          ? "عند تفعيل هذه القاعدة، سيقوم النظام تلقائياً بحجب الأرقام الوطنية وعناوين وهوية الشركاء في السجلات المفتوحة للجمهور."
                          : "When enabled, owner national ID numbers, personal emails, and individual stakeholder shares are dynamically masked on public endpoints."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <span>{currentLanguage === "ar" ? "حجب الهويات الشخصية (PII)" : "Mask Private Entities"}</span>
                      <button
                        onClick={() => {
                          setMaskSensitiveData(!maskSensitiveData);
                          setSuccessMessage(currentLanguage === "ar" ? "تم تعديل مستوى أمان البيانات الحساسة" : "Privacy masking rules modified");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                          maskSensitiveData ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {maskSensitiveData ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>

                  {/* Active sharing consents list */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "موافقات تفويض تبادل البيانات السيادية الفعالة" : "Active Inter-Agency Consent Certificates"}</span>

                    <div className="space-y-2.5">
                      {consents.map(con => (
                        <div key={con.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center text-xs font-bold shadow-2xs">
                          <div className="space-y-1">
                            <span className="text-[#064E3B] text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md font-mono">{con.id}</span>
                            <h4 className="text-slate-950 font-black mt-1">{con.entity}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{con.purpose}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full text-[9px] uppercase font-black block">APPROVED</span>
                            <span className="text-[10px] text-gray-400 font-mono block mt-1">Exp: {con.expiry}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 9: NATIONAL REPORTING CENTER & SQL SCRIPT DOWNLOADS */}
            {activeTab === "reporting-center" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "مركز توليد التقارير والمطبوعات الإحصائية وسكربتات المزامنة" : "Sovereign Reporting & Database Deployment Center"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "قم بتحميل كتيبات الإحصاء المعتمدة أو استخراج سكربتات التهيئة والترحيل (MySQL DDL Migrations) المخصصة للمستودع التجاري الوطني." : "Export certified national PDF publications, verify reporting schemas, or generate official SQL database schema deployment bundles."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left panel: PDF publications & AI booklets */}
                  <div className="space-y-3 text-xs font-bold">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{currentLanguage === "ar" ? "مطبوعات وتقارير إحصائية جاهزة للتصدير" : "Certified Publications Library"}</span>
                    
                    {[
                      { title: "Annual Trade & Crop Exports Report 2026", format: "PDF", size: "3.4 MB" },
                      { title: "Industrial Plant Capacity & SME Growth Statistics 2026", format: "XLSX", size: "12.8 MB" },
                      { title: "Sudan Commerce Data Governance Framework Book", format: "PDF", size: "1.2 MB" }
                    ].map((rep, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex justify-between items-center">
                        <div>
                          <h4 className="text-slate-900 font-black leading-tight">{rep.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{rep.format} • {rep.size}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSuccessMessage(currentLanguage === "ar" ? `بدأ تصدير تقرير: ${rep.title}` : `Exporting report: ${rep.title}`);
                          }}
                          className="bg-[#064E3B] hover:bg-emerald-950 text-white p-2 rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Right Panel: SQL Migration and Rollback Generator */}
                  <div className="lg:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                          <Sliders className="w-4 h-4 text-emerald-700" />
                          {currentLanguage === "ar" ? "مولد سكربتات قواعد البيانات الموحدة (MySQL)" : "MySQL Migration Script Engine"}
                        </span>
                        
                        <div className="flex bg-slate-200 p-0.5 rounded-lg">
                          <button
                            onClick={() => setSqlType("migration")}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${sqlType === "migration" ? "bg-[#064E3B] text-white" : "text-slate-600"}`}
                          >
                            Migration (DDL)
                          </button>
                          <button
                            onClick={() => setSqlType("rollback")}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${sqlType === "rollback" ? "bg-red-800 text-white" : "text-slate-600"}`}
                          >
                            Rollback DDL
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
                        {currentLanguage === "ar"
                          ? "السكربت أدناه يولد الجداول الوطنية للامتثال والبيانات التجارية والتبادل البيني مع الحفاظ التام على سلامة الربط والعلاقات المرجعية (Referential Integrity)."
                          : "This script creates or tears down the complete national relational schema tables for commerce directories, metadata lineages, and exchange audit logs."}
                      </p>

                      <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl border border-slate-900 text-[10px] font-mono leading-normal max-h-[180px] overflow-y-auto whitespace-pre-wrap selection:bg-emerald-900">
                        {generateSqlScript()}
                      </pre>
                    </div>

                    <div className="pt-3 flex justify-between items-center">
                      <span className="text-[9px] text-slate-400 font-mono">Engine: InnoDB | CHARSET: utf8mb4</span>
                      <button
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([generateSqlScript()], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = sqlType === "migration" ? "sdmci_data_gov_migration.sql" : "sdmci_data_gov_rollback.sql";
                          document.body.appendChild(element);
                          element.click();
                          setSuccessMessage(currentLanguage === "ar" ? "تم تحميل سكربت قاعدة البيانات بنجاح" : "SQL deployment script downloaded");
                        }}
                        className="bg-[#064E3B] hover:bg-emerald-950 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-md"
                      >
                        <Download className="w-3.5 h-3.5 text-white" />
                        {currentLanguage === "ar" ? "تحميل ملف SQL" : "Download SQL Script"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 10: NATIONAL DATA OBSERVATORY (Telemetry Hub) */}
            {activeTab === "data-observatory" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-[#064E3B] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-700" />
                    {currentLanguage === "ar" ? "المرصد الوطني لحوكمة وسلامة تدفق البيانات التجارية" : "National Commercial Data Telemetry & Observatory"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-bold mt-1">
                    {currentLanguage === "ar" ? "لوحة المراقبة السيادية الكبرى التي تقيس استهلاك الـ APIs، وسرعة معالجة الملفات، والتحليلات الإحصائية، وصحة الربط البيني الحكومي." : "Sovereign mission control telemetry charting API request thresholds, sync validation states, and data ingestion health metrics."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between text-xs font-bold">
                    <span className="text-slate-400 block text-[10px] uppercase">Registry Sync Rate</span>
                    <span className="text-2xl font-black text-emerald-900 block my-1">99.98%</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">Optimal Health</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between text-xs font-bold">
                    <span className="text-slate-400 block text-[10px] uppercase">Daily API Volume</span>
                    <span className="text-2xl font-black text-emerald-900 block my-1">14,250 <span className="text-xs text-slate-500">Reqs</span></span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">➔ +12.4% Traffic</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between text-xs font-bold">
                    <span className="text-slate-400 block text-[10px] uppercase">Metadata Compliance</span>
                    <span className="text-2xl font-black text-emerald-900 block my-1">100.00%</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">Strict Validation</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between text-xs font-bold">
                    <span className="text-slate-400 block text-[10px] uppercase">Database Engine SLA</span>
                    <span className="text-2xl font-black text-emerald-900 block my-1">99.99%</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">Sovereign Cluster</span>
                  </div>
                </div>

                {/* API Request Latency Line Chart */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    {currentLanguage === "ar" ? "أداء استجابة الشبكة الوطنية للتبادل البيني (ms)" : "National Data Exchange Replication & Response Latency (ms)"}
                  </span>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { hour: "00:00", latency: 24, load: 12 },
                        { hour: "04:00", latency: 18, load: 8 },
                        { hour: "08:00", latency: 32, load: 42 },
                        { hour: "12:00", latency: 45, load: 78 },
                        { hour: "16:00", latency: 38, load: 61 },
                        { hour: "20:00", latency: 28, load: 24 },
                        { hour: "23:59", latency: 22, load: 14 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" className="text-[10px] font-mono font-bold" />
                        <YAxis className="text-[10px] font-mono font-bold" />
                        <Tooltip contentStyle={{ fontSize: 11, fontWeight: "bold" }} />
                        <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                        <Line type="monotone" name={currentLanguage === "ar" ? "زمن الاستجابة (ميلي ثانية)" : "API Response Latency (ms)"} dataKey="latency" stroke="#0F766E" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" name={currentLanguage === "ar" ? "حجم الحمل (%)" : "Transaction Load (%)"} dataKey="load" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Diagnostics REST Logs panel */}
          <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono">
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-widest border-b border-slate-800 pb-2 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                SDMCI PLATFORM GATEWAY CONSOLE
              </span>
              <span>REST & GRAPHQL ENGINE v1.7</span>
            </div>
            <div className="max-h-[80px] overflow-y-auto space-y-1 text-slate-300">
              {apiLogs.length > 0 ? (
                apiLogs.map((log, idx) => <div key={idx} className="leading-relaxed">{log}</div>)
              ) : (
                <div className="text-slate-500">Console listening for network triggers...</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
