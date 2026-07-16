/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * National Government Integration Platform (NGIP) v2.0.0
 * Interoperability Gateway with Unified API Gateway, MDM, Event Broker, & Security Shield
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, Share2, KeyRound, Database, Workflow, Activity, ShieldCheck, 
  CheckCircle2, AlertTriangle, XCircle, Clock, Search, RefreshCw, Play, 
  Send, Lock, Settings, Terminal, ArrowRight, Sparkles, Check, X, FileCode,
  Trash2, ShieldAlert, Cpu, Landmark, Globe, Building2, HelpCircle, UserCheck, CheckSquare
} from "lucide-react";

import { UserRole } from "../types";

interface NationalIntegrationHubProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
}

// Interoperability Government Agencies Status Schema
interface IntegratedAgency {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  icon: React.ComponentType<any>;
  endpoint: string;
  pingMs: number;
  status: "online" | "degraded" | "offline";
  syncFrequency: string;
  syncFrequencyAr: string;
  lastSync: string;
  lastSyncAr: string;
  exchangedCount: number;
}

// Pre-configured government systems integration metadata
const initialAgencies: IntegratedAgency[] = [
  {
    id: "finance",
    nameAr: "وزارة المالية والتخطيط الاقتصادي",
    nameEn: "Ministry of Finance & Economic Planning",
    category: "Financial / Fees",
    icon: Landmark,
    endpoint: "https://api.mof.gov.sd/v1/payments",
    pingMs: 14,
    status: "online",
    syncFrequency: "Real-time",
    syncFrequencyAr: "فوري مستمر",
    lastSync: "3 seconds ago",
    lastSyncAr: "منذ 3 ثوانٍ",
    exchangedCount: 342918
  },
  {
    id: "customs",
    nameAr: "هيئة الجمارك السودانية",
    nameEn: "Sudan Customs Authority",
    category: "Trade / Clearance",
    icon: Globe,
    endpoint: "https://api.customs.gov.sd/v2/clearance",
    pingMs: 31,
    status: "online",
    syncFrequency: "Real-time",
    syncFrequencyAr: "فوري مستمر",
    lastSync: "12 seconds ago",
    lastSyncAr: "منذ 12 ثانية",
    exchangedCount: 184910
  },
  {
    id: "tax",
    nameAr: "ديوان الضرائب السوداني",
    nameEn: "Sudan Tax Chamber",
    category: "Fiscal / Compliance",
    icon: ShieldCheck,
    endpoint: "https://api.taxes.gov.sd/v1/compliance",
    pingMs: 24,
    status: "online",
    syncFrequency: "Every 15 mins",
    syncFrequencyAr: "كل 15 دقيقة",
    lastSync: "14 minutes ago",
    lastSyncAr: "منذ 14 دقيقة",
    exchangedCount: 228491
  },
  {
    id: "registry",
    nameAr: "السجل المدني القومي",
    nameEn: "National Civil Registry",
    category: "Identity / Security",
    icon: UserCheck,
    endpoint: "https://api.civil.gov.sd/v1/national-id",
    pingMs: 18,
    status: "online",
    syncFrequency: "Real-time",
    syncFrequencyAr: "فوري مستمر",
    lastSync: "Just now",
    lastSyncAr: "الآن",
    exchangedCount: 452918
  },
  {
    id: "justice",
    nameAr: "وزارة العدل والتوثيقات",
    nameEn: "Ministry of Justice (Registrar Gen)",
    category: "Legal / Litigation",
    icon: Building2,
    endpoint: "https://api.moj.gov.sd/v3/entities",
    pingMs: 42,
    status: "degraded",
    syncFrequency: "Hourly",
    syncFrequencyAr: "كل ساعة",
    lastSync: "52 minutes ago",
    lastSyncAr: "منذ 52 دقيقة",
    exchangedCount: 94812
  },
  {
    id: "cbs",
    nameAr: "بنك السودان المركزي",
    nameEn: "Central Bank of Sudan",
    category: "Banking / AML",
    icon: Landmark,
    endpoint: "https://api.cbos.gov.sd/v1/bank-verification",
    pingMs: 11,
    status: "online",
    syncFrequency: "Real-time",
    syncFrequencyAr: "فوري مستمر",
    lastSync: "Just now",
    lastSyncAr: "الآن",
    exchangedCount: 512094
  },
  {
    id: "investment",
    nameAr: "مفوضية الاستثمار والمدن",
    nameEn: "Sudanese Investment Authority",
    category: "Development",
    icon: Cpu,
    endpoint: "https://api.investment.gov.sd/v2/incentives",
    pingMs: 56,
    status: "online",
    syncFrequency: "Every 30 mins",
    syncFrequencyAr: "كل 30 دقيقة",
    lastSync: "28 minutes ago",
    lastSyncAr: "منذ 28 دقيقة",
    exchangedCount: 49812
  }
];

// Endpoint templates for the API gateway simulator
interface GatewayEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  descriptionAr: string;
  descriptionEn: string;
  defaultPayload: string;
  targetAgency: string;
}

const gatewayEndpoints: GatewayEndpoint[] = [
  {
    id: "verify-id",
    method: "POST",
    path: "/api/v1/registry/id-verify",
    descriptionAr: "التحقق من الهوية الوطنية ورقم القيد المدني للشركاء ومؤسسي الشركات",
    descriptionEn: "Verify national identity and civil registration records for company founders",
    defaultPayload: JSON.stringify({
      nationalId: "1-8392-1029112",
      birthDate: "1988-11-23",
      fullNameAr: "أحمد بن محمد الفاضل",
      strictBiometrics: false
    }, null, 2),
    targetAgency: "registry"
  },
  {
    id: "tax-compliance",
    method: "GET",
    path: "/api/v1/tax/compliance?tin=4920491-2",
    descriptionAr: "التحقق الفوري من حالة السداد الضريبي وصلاحية شهادة خلو الطرف للشركة",
    descriptionEn: "Retrieve company tax compliance status and tax clearance validities",
    defaultPayload: "{}",
    targetAgency: "tax"
  },
  {
    id: "mof-fees",
    method: "POST",
    path: "/api/v1/finance/calculate-fees",
    descriptionAr: "احتساب وتحصيل الرسوم السيادية المقررة لتسجيل الشركات وترخيص المصانع",
    descriptionEn: "Calculate and settle mandatory government fees via centralized finance gateway",
    defaultPayload: JSON.stringify({
      entityId: "CO-17293",
      serviceCode: "SRV-REG-LLC-2026",
      capitalSdg: 15000000,
      currency: "SDG"
    }, null, 2),
    targetAgency: "finance"
  },
  {
    id: "customs-import",
    method: "POST",
    path: "/api/v1/customs/validate-import-permit",
    descriptionAr: "مطابقة رخصة الاستيراد السنوية وحصة السلع المعفاة بالمنصة الجمركية ببورتسودان",
    descriptionEn: "Match annual import licenses and custom duty exemptions at Port Sudan dry docks",
    defaultPayload: JSON.stringify({
      permitId: "IMP-2026-8319",
      hscode: "0902.10.000",
      originCountry: "India",
      quantityMetricTons: 120,
      declaredValueUsd: 145000
    }, null, 2),
    targetAgency: "customs"
  },
  {
    id: "cbs-bank",
    method: "GET",
    path: "/api/v1/cbs/verify-capital-deposit?bankCode=BOSD&reference=DEP-938291",
    descriptionAr: "تأكيد إيداع رأس مال الشركة التأسيسي في المصرف مع مكافحة غسيل الأموال AML",
    descriptionEn: "Verify validation of corporate capital deposit with anti-money laundering audit",
    defaultPayload: "{}",
    targetAgency: "cbs"
  }
];

// Master Data Management Models
interface MDMRecord {
  id: string;
  entityTypeAr: string;
  entityTypeEn: string;
  sdmciValue: string;
  mojValue: string;
  taxValue: string;
  status: "synced" | "conflict";
  lastChecked: string;
}

const initialMDMRecords: MDMRecord[] = [
  {
    id: "M-101",
    entityTypeAr: "رأس مال شركة النيل للتعدين",
    entityTypeEn: "Nile Mining Corporate Capital",
    sdmciValue: "50,000,000 SDG",
    mojValue: "50,000,000 SDG",
    taxValue: "40,000,000 SDG",
    status: "conflict",
    lastChecked: "منذ 10 دقائق"
  },
  {
    id: "M-102",
    entityTypeAr: "الاسم التجاري: الفارس اللوجستي",
    entityTypeEn: "Commercial Name: Al-Faris Logistics",
    sdmciValue: "شركة الفارس المحدودة للنقل والخدمات",
    mojValue: "شركة الفارس المحدودة للنقل والخدمات",
    taxValue: "شركة الفارس المحدودة للنقل والخدمات",
    status: "synced",
    lastChecked: "منذ ساعة"
  },
  {
    id: "M-103",
    entityTypeAr: "الغرض الصناعي: مصنع فرز المحاصيل",
    entityTypeEn: "Industrial Goal: Crop Grading Mill",
    sdmciValue: "صناعات تحويلية زراعية - صادر",
    mojValue: "تجارة عامة وخدمات زراعية",
    taxValue: "صناعات تحويلية زراعية - صادر",
    status: "conflict",
    lastChecked: "منذ دقيقتين"
  },
  {
    id: "M-104",
    entityTypeAr: "العنوان المسجل: بورتسودان مربع 4",
    entityTypeEn: "Registered Address: Port Sudan Sq 4",
    sdmciValue: "منطقة بورتسودان الحرة - مكتب رقم 11",
    mojValue: "منطقة بورتسودان الحرة - مكتب رقم 11",
    taxValue: "منطقة بورتسودان الحرة - مكتب رقم 11",
    status: "synced",
    lastChecked: "منذ 4 ساعات"
  }
];

// Event Broker Schema
interface BrokerEvent {
  id: string;
  eventName: string;
  payload: string;
  source: string;
  timestamp: string;
  retries: number;
  status: "completed" | "retrying" | "dlq";
  errorMessage?: string;
}

const initialBrokerEvents: BrokerEvent[] = [
  {
    id: "EV-94029",
    eventName: "corporate.registered",
    payload: '{"companyId": "CO-8392", "name": "Sino-Sudan Gum Arabic Ltd", "capital": 25000000}',
    source: "SDMCI-Companies",
    timestamp: "2026-07-15T06:14:02",
    retries: 0,
    status: "completed"
  },
  {
    id: "EV-94030",
    eventName: "license.issued",
    payload: '{"licenseId": "LIC-941", "type": "Export", "exporter": "Nile Gold Refining"}',
    source: "SDMCI-Licenses",
    timestamp: "2026-07-15T06:15:20",
    retries: 0,
    status: "completed"
  },
  {
    id: "EV-94031",
    eventName: "factory.compliance.passed",
    payload: '{"factoryId": "FAC-502", "rating": "A+", "inspector": "Ali Al-Sudani"}',
    source: "SDMCI-Industrial",
    timestamp: "2026-07-15T06:16:11",
    retries: 0,
    status: "completed"
  },
  {
    id: "EV-94032",
    eventName: "finance.fee.settled",
    payload: '{"paymentRef": "PAY-84920", "amountSDG": 450000, "status": "approved"}',
    source: "MOF-Integration-Agent",
    timestamp: "2026-07-15T06:18:00",
    retries: 3,
    status: "dlq",
    errorMessage: "Gateway response timeout (504) from Sudan Central Bank clearing queue."
  },
  {
    id: "EV-94033",
    eventName: "tax.clearance.updated",
    payload: '{"tin": "9021-93", "exemptUntil": "2027-12-31", "status": "active"}',
    source: "Sudan-Tax-Chamber",
    timestamp: "2026-07-15T06:19:12",
    retries: 1,
    status: "retrying",
    errorMessage: "Connection refused (111) at secure VPN tunnel gateway."
  }
];

export default function NationalIntegrationHub({ currentLanguage, role }: NationalIntegrationHubProps) {
  // Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "gateway" | "mdm" | "events" | "security" | "ai">("dashboard");

  // Core Data States
  const [agencies, setAgencies] = useState<IntegratedAgency[]>(initialAgencies);
  const [endpoints, setEndpoints] = useState<GatewayEndpoint[]>(gatewayEndpoints);
  const [selectedEndpoint, setSelectedEndpoint] = useState<GatewayEndpoint>(gatewayEndpoints[0]);
  const [mdmRecords, setMdmRecords] = useState<MDMRecord[]>(initialMDMRecords);
  const [events, setEvents] = useState<BrokerEvent[]>(initialBrokerEvents);

  // Filter terms
  const [agencySearch, setAgencySearch] = useState("");
  const [mdmSearch, setMdmSearch] = useState("");

  // Gateway Simulation States
  const [simulatedPayload, setSimulatedPayload] = useState(gatewayEndpoints[0].defaultPayload);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResponse, setSimulationResponse] = useState<any>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [customHeaders, setCustomHeaders] = useState<string>("{\n  \"Authorization\": \"Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5HSVAtMjAyNiJ9...\",\n  \"X-Sovereign-Signature\": \"sha256-s7d8a9fd8f912...\",\n  \"X-Agency-Origin\": \"SDMCI-CO-GATEWAY\"\n}");

  // Security Configuration Settings
  const [mtlsEnabled, setMtlsEnabled] = useState(true);
  const [encryptionLevel, setEncryptionLevel] = useState<"aes-256" | "plaintext">("aes-256");
  const [owaspRateLimiting, setOwaspRateLimiting] = useState(500);
  const [apiKeys, setApiKeys] = useState([
    { label: "MOF Central Sync", key: "sdmci_pk_live_mof_7392810293", active: true, usage: "45k req/day" },
    { label: "Customs Clearing Integration", key: "sdmci_pk_live_customs_82910392", active: true, usage: "122k req/day" },
    { label: "Civil Registry Verification Engine", key: "sdmci_pk_live_civil_10293812", active: true, usage: "320k req/day" }
  ]);
  const [showKeyGenerator, setShowKeyGenerator] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");

  // Real-Time National ID & TIN verification panel inputs
  const [nationalIdInput, setNationalIdInput] = useState("1-8392-1029112");
  const [tinInput, setTinInput] = useState("4920491-2");
  const [checkingIdentity, setCheckingIdentity] = useState(false);
  const [checkingTax, setCheckingTax] = useState(false);
  const [verifiedIdentityResult, setVerifiedIdentityResult] = useState<any>(null);
  const [verifiedTaxResult, setVerifiedTaxResult] = useState<any>(null);

  // AI assistant simulation interaction states
  const [aiDiagnostic, setAiDiagnostic] = useState<string>("");
  const [aiIsAnalyzing, setAiIsAnalyzing] = useState(false);
  const [activeErrorPreset, setActiveErrorPreset] = useState<string | null>(null);

  // Set default values when selected endpoint switches
  useEffect(() => {
    setSimulatedPayload(selectedEndpoint.defaultPayload);
    setSimulationResponse(null);
    setSimulationLogs([]);
  }, [selectedEndpoint]);

  // Ping updates to make dashboard look real-time and active
  useEffect(() => {
    const timer = setInterval(() => {
      setAgencies(prev => prev.map(a => {
        if (a.status === "online") {
          // slight fluctuation in ping
          const variance = Math.floor(Math.random() * 5) - 2;
          const nextPing = Math.max(5, a.pingMs + variance);
          return {
            ...a,
            pingMs: nextPing,
            exchangedCount: a.exchangedCount + Math.floor(Math.random() * 4)
          };
        }
        return a;
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Action: Trigger Live Identity query against civil registry
  const runLiveIdentityCheck = () => {
    setCheckingIdentity(true);
    setVerifiedIdentityResult(null);
    setTimeout(() => {
      setCheckingIdentity(false);
      if (nationalIdInput === "1-8392-1029112") {
        setVerifiedIdentityResult({
          valid: true,
          nationalId: "1-8392-1029112",
          fullNameAr: "أحمد بن محمد الفاضل",
          fullNameEn: "Ahmed Bin Mohammed Al-Fadel",
          motherName: "فاطمة إبراهيم سليمان",
          birthPlace: "أم درمان - الخرطوم",
          birthDate: "1988-11-23",
          status: "ساري الصلاحية / ACTIVE",
          issuer: "وزارة الداخلية - السجل المدني الفيدرالي"
        });
      } else {
        // dynamic generate mock record
        setVerifiedIdentityResult({
          valid: true,
          nationalId: nationalIdInput,
          fullNameAr: "عبد الله عثمان الطيب",
          fullNameEn: "Abdullah Osman El-Tayeb",
          motherName: "آمنة صالح أحمد",
          birthPlace: "بورتسودان - البحر الأحمر",
          birthDate: "1991-05-15",
          status: "ساري الصلاحية / ACTIVE",
          issuer: "وزارة الداخلية - السجل المدني الفيدرالي"
        });
      }
    }, 1200);
  };

  // Action: Trigger Live Tax check
  const runLiveTaxCheck = () => {
    setCheckingTax(true);
    setVerifiedTaxResult(null);
    setTimeout(() => {
      setCheckingTax(false);
      if (tinInput === "4920491-2") {
        setVerifiedTaxResult({
          valid: true,
          tin: "4920491-2",
          taxpayerName: "مجموعة النيل للصناعات الغذائية المحدودة",
          taxChamberOffice: "شعبة كبار المكلفين - الخرطوم",
          vatRegistered: true,
          vatNumber: "VAT-2026-948291",
          clearanceCertificateStatus: "خلو طرف ساري المفعول / COMPLIANT",
          expiryDate: "2027-03-31"
        });
      } else {
        setVerifiedTaxResult({
          valid: true,
          tin: tinInput,
          taxpayerName: "شركة الفارس للتوزيع اللوجستي",
          taxChamberOffice: "شعبة الشركات العامة والولايات",
          vatRegistered: false,
          vatNumber: "N/A",
          clearanceCertificateStatus: "خلو طرف ساري المفعول / COMPLIANT",
          expiryDate: "2026-12-31"
        });
      }
    }, 1000);
  };

  // Action: Execute mock REST API Request via Centralized API Gateway
  const handleRunGatewaySimulation = () => {
    setIsSimulating(true);
    setSimulationResponse(null);
    
    const logs: string[] = [];
    logs.push(`[${new Date().toISOString()}] INITIALIZING secure handshakes...`);
    logs.push(`[${new Date().toISOString()}] DETECTED: mTLS Certificate enabled. Client certificate SHA256 matches.`);
    logs.push(`[${new Date().toISOString()}] EXECUTING JWT Decryption: Issuer "SDMCI" validated.`);
    logs.push(`[${new Date().toISOString()}] DECODED JWT USER ROLES: Role set to "${role}"`);
    logs.push(`[${new Date().toISOString()}] COMPILING Cryptographic signature payload...`);
    
    setSimulationLogs(logs);

    setTimeout(() => {
      logs.push(`[${new Date().toISOString()}] OUTBOUNDING request proxy to: ${selectedEndpoint.path}`);
      logs.push(`[${new Date().toISOString()}] FORWARDING target payload to Agency Node: "${selectedEndpoint.targetAgency}"`);
      
      const isPost = selectedEndpoint.method === "POST";
      let parsedPayload = {};
      if (isPost) {
        try {
          parsedPayload = JSON.parse(simulatedPayload);
        } catch {
          parsedPayload = { raw: simulatedPayload };
        }
      }

      const mockResponse = {
        meta: {
          gatewayNode: "NGIP-Sovereign-SUDAN-Node-01",
          apiVersion: "2.0.0",
          timestamp: new Date().toISOString(),
          requestId: `REQ-${Math.floor(Math.random() * 900000) + 100000}`,
          processingDurationMs: selectedEndpoint.id === "verify-id" ? 18 : selectedEndpoint.id === "tax-compliance" ? 24 : 35,
          securityValidation: {
            mtlsVerified: mtlsEnabled,
            jwtAuthenticated: true,
            apiThreatChecked: true,
            sqlInjectionShielded: true,
            digitalSignatureVerified: true,
            integrityHash: `sha256-${Math.random().toString(36).substring(2, 18)}`
          }
        },
        payload: selectedEndpoint.id === "verify-id" 
          ? {
              status: "FOUND",
              civilRecord: {
                nationalId: "1-8392-1029112",
                fullName: "أحمد بن محمد الفاضل",
                verified: true,
                verificationAgency: "جمهورية السودان - الإدارة العامة للسجل المدني",
                restrictedListCheck: "PASSED / خالي من القيود القضائية",
                activeBiometricsLinked: true
              }
            }
          : selectedEndpoint.id === "tax-compliance"
          ? {
              status: "COMPLIANT",
              taxRecord: {
                tin: "4920491-2",
                vatRegistered: true,
                unsettledDuesSdg: 0,
                clearanceCertificateId: "TCC-2026-981240",
                complianceRating: "A+ / Sovereign Premium"
              }
            }
          : selectedEndpoint.id === "mof-fees"
          ? {
              status: "SUCCESS",
              feeBreakdown: {
                baseRegistrationFee: 150000,
                stateDevelopmentLevy: 30000,
                smartSystemsStampSDG: 10000,
                totalCalculatedSDG: 190000,
                centralBankClearingRef: "CBOS-9381029"
              }
            }
          : selectedEndpoint.id === "customs-import"
          ? {
              status: "VALID_PERMIT",
              importPermit: {
                permitId: "IMP-2026-8319",
                goodsMatchPercent: 100,
                exemptPercentageDuty: 100,
                portSudanCustomsCode: "PTSD-HQ-9",
                cargoClearanceStatus: "PRE_APPROVED_FOR_IMMEDIATE_DE_DOCK"
              }
            }
          : {
              status: "DEPOSIT_VERIFIED",
              bankConfirmation: {
                reference: "DEP-938291",
                clearedCapitalSdg: 15000000,
                verifiedBy: "بنك السودان المركزي",
                flaggedForAMLReview: false
              }
            }
      };

      logs.push(`[${new Date().toISOString()}] ENVELOPE security validated. Appended response integrity headers.`);
      logs.push(`[${new Date().toISOString()}] SUCCESS (200 OK): Exchanged payload securely.`);

      setSimulationLogs([...logs]);
      setSimulationResponse(mockResponse);
      setIsSimulating(false);

      // Increment changed count in active agency
      setAgencies(prev => prev.map(a => {
        if (a.id === selectedEndpoint.targetAgency) {
          return { ...a, exchangedCount: a.exchangedCount + 1 };
        }
        return a;
      }));
    }, 1500);
  };

  // Action: Resolve MDM Conflicts
  const handleResolveConflict = (id: string, resolution: "sdmci" | "moj" | "tax") => {
    setMdmRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        const value = resolution === "sdmci" ? rec.sdmciValue : resolution === "moj" ? rec.mojValue : rec.taxValue;
        return {
          ...rec,
          sdmciValue: value,
          mojValue: value,
          taxValue: value,
          status: "synced",
          lastChecked: currentLanguage === "ar" ? "تم الحل بالوفاق السيادي الآن" : "Consensus resolved"
        };
      }
      return rec;
    }));
  };

  // Action: Replay an event from the Dead Letter Queue (DLQ)
  const handleReplayEvent = (id: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        return { ...ev, status: "retrying", errorMessage: "Replay initiated: executing dynamic backoff retry..." };
      }
      return ev;
    }));

    setTimeout(() => {
      setEvents(prev => prev.map(ev => {
        if (ev.id === id) {
          return { 
            ...ev, 
            status: "completed", 
            retries: ev.retries + 1, 
            errorMessage: undefined 
          };
        }
        return ev;
      }));
    }, 2000);
  };

  // Action: Generate a new secure API Key
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel.trim()) return;
    const randHex = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newKey = {
      label: newKeyLabel,
      key: `sdmci_pk_live_${newKeyLabel.toLowerCase().replace(/\s+/g, '_')}_${randHex}`,
      active: true,
      usage: "0 req/day"
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyLabel("");
    setShowKeyGenerator(false);
  };

  // Action: Deactivate an existing API Key
  const toggleApiKey = (keyString: string) => {
    setApiKeys(apiKeys.map(k => k.key === keyString ? { ...k, active: !k.active } : k));
  };

  // Action: AI Diagnostic for typical integration failures
  const runAIDiagnostic = (presetId: string) => {
    setAiIsAnalyzing(true);
    setActiveErrorPreset(presetId);
    setAiDiagnostic("");

    setTimeout(() => {
      setAiIsAnalyzing(false);
      if (presetId === "signature") {
        setAiDiagnostic(
          currentLanguage === "ar"
            ? "تشخيص الذكاء الاصطناعي السيادي:\n\n" +
              "🔴 سبب الفشل: عدم تطابق التوقيع الرقمي (Signature Mismatch) للمدفوعات المرسلة لوزارة المالية.\n\n" +
              "🔍 التحليل العميق:\n" +
              "1. تم إرسال حمولة الطلب برأس 'X-Sovereign-Signature' يحتوي على ترميز SHA256 غير متطابق مع الحمولة المعدلة.\n" +
              "2. يظهر الفحص أن حقل 'capitalSdg' تم تحديثه من 15,000,000 إلى 50,000,000 بعد توليد التوقيع الرقمي، مما أدى لإبطال التوقيع عند جدار الحماية (WAF).\n\n" +
              "🛠️ الإجراء التصحيحي الموصى به:\n" +
              "- تأكد من عدم تعديل حمولة JSON بعد توقيعها بالرمز السري للوزارة.\n" +
              "- تفعيل خيار إعادة الحساب التلقائي للتوقيع (Payload Hash Auto-Recalculate) في خيارات بوابة الربط."
            : "Sovereign AI Integration Diagnostic:\n\n" +
              "🔴 ROOT CAUSE: Digital signature verification failed for payments dispatched to Ministry of Finance.\n\n" +
              "🔍 DEEP ANALYSIS:\n" +
              "1. The request payload header 'X-Sovereign-Signature' (SHA256) did not match the hashed representation of the incoming request body.\n" +
              "2. Records show the 'capitalSdg' value was altered from 15,000,000 to 50,000,000 post-signature compilation, triggering immediate rejection at the Finance WAF.\n\n" +
              "🛠️ RECOMMENDATION:\n" +
              "- Settle all payload properties BEFORE invoking signature libraries.\n" +
              "- Enable 'Payload Hash Auto-Recalculate' inside your API Client middleware."
        );
      } else if (presetId === "timeout") {
        setAiDiagnostic(
          currentLanguage === "ar"
            ? "تشخيص الذكاء الاصطناعي السيادي:\n\n" +
              "🔴 سبب الفشل: انتهاء وقت الاتصال المتاح (HTTP 504 Gateway Timeout) مع خوادم هيئة الجمارك.\n\n" +
              "🔍 التحليل العميق:\n" +
              "1. استغرق خادم هيئة الجمارك ببورتسودان أكثر من 10,000ms للرد على فحص رخص الاستيراد.\n" +
              "2. يعود ذلك لضغط معاملات الصادر والوارد وتراكم الحزم بسبب صيانة الخط الفيدرالي في بورتسودان.\n\n" +
              "🛠️ الإجراء التصحيحي الموصى به:\n" +
              "- قم بزيادة مهلة الانتظار (API Timeout) في إعدادات الربط من 5,000ms إلى 15,000ms مؤقتاً.\n" +
              "- تفعيل خيار 'قائمة الانتظار الاحتياطية' (Fall-Back Event Queueing) بالاتحاد الوطني للربط."
            : "Sovereign AI Integration Diagnostic:\n\n" +
              "🔴 ROOT CAUSE: Gateway timeout error (HTTP 504) returned from Sudan Customs Authority API node.\n\n" +
              "🔍 DEEP ANALYSIS:\n" +
              "1. Outbound query to Port Sudan customs verification terminal did not respond within the allocated 10,000ms envelope.\n" +
              "2. Due to high shipping logs queue and routine line maintenance on the main federal fiber-optic link in Port Sudan.\n\n" +
              "🛠️ RECOMMENDATION:\n" +
              "- Increment local gateway timeout configuration from 5,000ms to 15,000ms to allow queue stabilization.\n" +
              "- Enable fallback batch synchronization for non-critical clearance records."
        );
      } else {
        setAiDiagnostic(
          currentLanguage === "ar"
            ? "تشخيص الذكاء الاصطناعي السيادي:\n\n" +
              "🔴 سبب الفشل: رمز هوية منتهي الصلاحية أو غير صالح (Expired Bearer Token) في نظام السجل المدني القومي.\n\n" +
              "🔍 التحليل العميق:\n" +
              "1. الرمز JWT المقدم في ترويسة الطلب انتهت فترة صلاحيته البالغة ساعة واحدة.\n" +
              "2. فشل نظام تدوير الرموز التلقائي (Token Rotation Loop) بسبب خلل في مزامنة التوقيت المحلي للخادم.\n\n" +
              "🛠️ الإجراء التصحيحي الموصى به:\n" +
              "- تفعيل مزامنة التوقيت بروتوكول NTP على الخوادم فوراً.\n" +
              "- استدعاء آلية تجديد الرمز التلقائي (Refresh Token OAuth 2.1) لاستبدال الرموز منتهية الصلاحية."
            : "Sovereign AI Integration Diagnostic:\n\n" +
              "🔴 ROOT CAUSE: Identity authentication token expired (HTTP 401 Unauthorized) against Civil Registry database.\n\n" +
              "🔍 DEEP ANALYSIS:\n" +
              "1. The Bearer JWT transmitted has surpassed its 60-minute time-to-live threshold.\n" +
              "2. Automated token rotation loop failed due to local system clock desynchronization with NTP clock.\n\n" +
              "🛠️ RECOMMENDATION:\n" +
              "- Synch system clocks using Network Time Protocol (NTP) to eliminate drift.\n" +
              "- Leverage OAuth 2.1 Refresh Token parameters to dynamically fetch fresh credentials without workflow interruption."
        );
      }
    }, 1200);
  };

  // Filter lists
  const filteredAgencies = agencies.filter(a => 
    a.nameAr.includes(agencySearch) || 
    a.nameEn.toLowerCase().includes(agencySearch.toLowerCase()) ||
    a.category.toLowerCase().includes(agencySearch.toLowerCase())
  );

  const filteredMdmRecords = mdmRecords.filter(m => 
    m.entityTypeAr.includes(mdmSearch) || 
    m.entityTypeEn.toLowerCase().includes(mdmSearch.toLowerCase())
  );

  const totalExchanged = agencies.reduce((sum, current) => sum + current.exchangedCount, 0);

  return (
    <div className="space-y-6" id="integration-hub-wrapper">
      {/* Sovereign Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 rounded-2xl shadow-xl border border-emerald-800/40 relative overflow-hidden" id="ngip-sovereign-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-500/30 font-mono tracking-wider">
                NGIP v2.0.0 (SOVEREIGN GATEWAY)
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                {currentLanguage === "ar" ? "نشط سيادياً" : "Active Sovereignty"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: "var(--font-arabic)" }}>
              {currentLanguage === "ar" ? "المنصة الوطنية للربط والتبادل البيني (NGIP)" : "National Government Integration Platform (NGIP)"}
            </h1>
            <p className="text-gray-300 text-sm max-w-3xl">
              {currentLanguage === "ar" 
                ? "بوابة الربط والتشغيل البيني الفيدرالي لوزارة التجارة والصناعة مع المالية، الضرائب، الجمارك، السجل المدني، بنك السودان المركزي والجهات المعنية، تطبيقاً للسيادة الرقمية ومكافحة غسيل الأموال بالتكامل مع السجل التجاري."
                : "Sovereign digital interoperability layer of SDMCI integrated in real-time with Ministry of Finance, Taxes, Customs, Civil Registry, Central Bank, and relevant federal bodies, enforcing strict zero-trust standards."}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-center">
            <Network className="w-10 h-10 text-amber-400" />
            <div className="text-right font-mono text-xs">
              <div className="text-gray-400">{currentLanguage === "ar" ? "حجم التبادل القومي" : "Total Federal Exchange"}</div>
              <div className="text-lg font-bold text-emerald-400">{totalExchanged.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Nav Menu */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-emerald-800/60 pt-4 relative z-10" id="ngip-nav-tabs">
          {[
            { id: "dashboard", labelAr: "لوحة تحكم الربط القومي", labelEn: "Sovereign Dashboard", icon: Activity },
            { id: "gateway", labelAr: "بوابة ومحاكي الـ API", labelEn: "API Gateway Simulator", icon: Play },
            { id: "mdm", labelAr: "إدارة البيانات الرئيسية MDM", labelEn: "Master Data Hub (MDM)", icon: Database },
            { id: "events", labelAr: "ناقل الأحداث السيادي", labelEn: "Sovereign Event Broker", icon: Workflow },
            { id: "security", labelAr: "دروع الحماية والـ mTLS", labelEn: "Security & mTLS Shield", icon: KeyRound },
            { id: "ai", labelAr: "المساعد الذكي للمطابقة", labelEn: "AI Integration Co-Pilot", icon: Sparkles }
          ].map(tab => {
            const isActive = activeSubTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-amber-500 text-slate-950 shadow-lg font-bold" 
                    : "bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60 hover:text-white border border-emerald-900/50"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sub-Tab Render Pipeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 250 }}
        >
          {/* TAB 1: INTEGRATION DASHBOARD */}
          {activeSubTab === "dashboard" && (
            <div className="space-y-6" id="tab-dashboard">
              {/* Sovereign State Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metric-grid">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "الهيئات المرتبطة" : "CONNECTED AGENCIES"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-slate-900">12 / 12</span>
                    <span className="text-emerald-500 text-xs block mt-1 font-semibold">100% {currentLanguage === "ar" ? "معدل الربط الكامل" : "Coverage Rate"}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "سلامة الاتصال الفيدرالي" : "GATEWAY HEALTH"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-slate-900">99.86%</span>
                    <span className="text-emerald-500 text-xs block mt-1 font-semibold">{currentLanguage === "ar" ? "ضمن النطاق السيادي المستقر" : "Excellent Uptime Status"}</span>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-xl">
                    <Activity className="w-6 h-6 text-sky-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "أحداث قيد المعالجة" : "SYNC QUEUE LOAD"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-slate-900">{events.filter(e => e.status === "retrying").length}</span>
                    <span className="text-amber-500 text-xs block mt-1 font-semibold">{currentLanguage === "ar" ? "إعادة محاولة نشطة ذكية" : "Active Dynamic Retries"}</span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl">
                    <Workflow className="w-6 h-6 text-amber-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs block mb-1 font-semibold uppercase tracking-wider">
                      {currentLanguage === "ar" ? "فشل التحويلات (DLQ)" : "DEAD LETTER QUEUE"}
                    </span>
                    <span className="text-3xl font-bold font-mono text-red-600">{events.filter(e => e.status === "dlq").length}</span>
                    <span className="text-red-500 text-xs block mt-1 font-semibold">{currentLanguage === "ar" ? "تتطلب إعادة الإرسال أو تشخيص" : "Needs replay or manual fix"}</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-xl">
                    <ShieldAlert className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Instant Verification Panel - Interactive Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="instant-verifications">
                {/* Widget A: National Civil Registry ID Verification */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "التحقق الفوري من الهوية الوطنية (السجل المدني)" : "Instant ID Audit (National Civil Registry)"}
                      </h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">LIVE API</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    {currentLanguage === "ar"
                      ? "يتيح هذا النموذج الاستعلام المباشر عبر الرقم الوطني للتحقق من هوية ملاك ومدراء الشركات وتفاصيل الميلاد والقيود الجنائية."
                      : "Direct transactional integration with the federal civil registry system to validate founders identity files instantly."}
                  </p>

                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={nationalIdInput}
                        onChange={(e) => setNationalIdInput(e.target.value)}
                        placeholder="1-XXXX-XXXXXXXX"
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition-all"
                      />
                    </div>
                    <button
                      onClick={runLiveIdentityCheck}
                      disabled={checkingIdentity}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {checkingIdentity ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      <span>{currentLanguage === "ar" ? "استعلام" : "Query"}</span>
                    </button>
                  </div>

                  {verifiedIdentityResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs font-mono text-gray-700"
                    >
                      <div className="flex justify-between border-b border-gray-200 pb-1.5 mb-2">
                        <span className="font-bold text-emerald-700">{currentLanguage === "ar" ? "حالة التحقق: متطابق ومصرح" : "Verification Status: VERIFIED"}</span>
                        <span className="text-gray-500">{verifiedIdentityResult.issuer}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "الاسم الكامل" : "Full Name"}</span>
                          <span className="font-semibold text-slate-800">{currentLanguage === "ar" ? verifiedIdentityResult.fullNameAr : verifiedIdentityResult.fullNameEn}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "الرقم الوطني" : "National ID"}</span>
                          <span className="font-semibold text-slate-800">{verifiedIdentityResult.nationalId}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "اسم الأم" : "Mother Name"}</span>
                          <span className="font-semibold text-slate-800">{verifiedIdentityResult.motherName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "مكان وتاريخ الميلاد" : "Birth Place & Date"}</span>
                          <span className="font-semibold text-slate-800">{verifiedIdentityResult.birthPlace} ({verifiedIdentityResult.birthDate})</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Widget B: Sudan Tax Chamber TIN verification */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "فحص المكلفين والامتثال الضريبي (ديوان الضرائب)" : "Tax Compliance Verification (Tax Chamber)"}
                      </h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">LIVE API</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    {currentLanguage === "ar"
                      ? "مطابقة وتأكيد الرقم الضريبي للشركة TIN واسترداد شهادة خلو الطرف لتسهيل حجز الاسم أو الحصول على ترخيص التشغيل."
                      : "Direct query to match Tax Identification Number (TIN) and check dynamic clearance certifications."}
                  </p>

                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={tinInput}
                        onChange={(e) => setTinInput(e.target.value)}
                        placeholder="TIN XXXXXXX-X"
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition-all"
                      />
                    </div>
                    <button
                      onClick={runLiveTaxCheck}
                      disabled={checkingTax}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {checkingTax ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      <span>{currentLanguage === "ar" ? "استعلام" : "Query"}</span>
                    </button>
                  </div>

                  {verifiedTaxResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs font-mono text-gray-700"
                    >
                      <div className="flex justify-between border-b border-gray-200 pb-1.5 mb-2">
                        <span className="font-bold text-emerald-700">{currentLanguage === "ar" ? "الحالة المترابطة: ملتزم ضريبياً" : "Tax compliance: COMPLIANT"}</span>
                        <span className="text-gray-500">{verifiedTaxResult.taxChamberOffice}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "المكلف الضريبي" : "Taxpayer Name"}</span>
                          <span className="font-semibold text-slate-800">{verifiedTaxResult.taxpayerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "الرقم الضريبي TIN" : "TIN Number"}</span>
                          <span className="font-semibold text-slate-800">{verifiedTaxResult.tin}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "شهادة خلو الطرف" : "Clearance status"}</span>
                          <span className="font-semibold text-emerald-600 font-bold">{verifiedTaxResult.clearanceCertificateStatus}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "تاريخ انتهاء الشهادة" : "Clearance Expiry"}</span>
                          <span className="font-semibold text-slate-800">{verifiedTaxResult.expiryDate}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Connected Federal Nodes Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="connected-nodes-table">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "قائمة خوادم الربط والجهات الفيدرالية المترابطة" : "Federal Interoperability Nodes & Agencies"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {currentLanguage === "ar" 
                        ? "رصد حي للكمون ومعدل استهلاك المعاملات الصادرة والواردة لكل سلطة حكومية سيادية."
                        : "Real-time auditing table of connection latencies and transactions volume exchanged with sovereign nodes."}
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={agencySearch}
                      onChange={(e) => setAgencySearch(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "ابحث عن جهة أو تصنيف..." : "Search agency or type..."}
                      className="pl-9 pr-4 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64 transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider">
                        <th className="p-3 text-right">{currentLanguage === "ar" ? "الجهة الحكومية" : "Agency Name"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "التصنيف والـ API" : "Type & Endpoint"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "زمن الاستجابة (Latency)" : "Latency (Ping)"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "معدل المزامنة" : "Sync Profile"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "آخر مزامنة ناجحة" : "Last Success Sync"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "تراكم المعاملات" : "Accumulated Ex"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "الحالة" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium text-slate-700">
                      {filteredAgencies.map(agency => {
                        const AgencyIcon = agency.icon;
                        return (
                          <tr key={agency.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                                  <AgencyIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 text-sm">
                                    {currentLanguage === "ar" ? agency.nameAr : agency.nameEn}
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-mono">{agency.endpoint}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                                {agency.category}
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono font-bold">
                              <span className={agency.pingMs < 30 ? "text-emerald-600" : agency.pingMs < 50 ? "text-amber-600" : "text-red-500"}>
                                {agency.status === "offline" ? "∞" : `${agency.pingMs} ms`}
                              </span>
                            </td>
                            <td className="p-3 text-center font-bold text-gray-500">
                              {currentLanguage === "ar" ? agency.syncFrequencyAr : agency.syncFrequency}
                            </td>
                            <td className="p-3 text-center text-gray-400">
                              {currentLanguage === "ar" ? agency.lastSyncAr : agency.lastSync}
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-emerald-700">
                              {agency.exchangedCount.toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                agency.status === "online" 
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                  : agency.status === "degraded" 
                                  ? "bg-amber-50 text-amber-800 border-amber-200" 
                                  : "bg-red-50 text-red-800 border-red-200"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  agency.status === "online" ? "bg-emerald-500" : agency.status === "degraded" ? "bg-amber-500" : "bg-red-500"
                                }`} />
                                {agency.status === "online" 
                                  ? (currentLanguage === "ar" ? "مستقر" : "Stable") 
                                  : agency.status === "degraded" 
                                  ? (currentLanguage === "ar" ? "مجهد" : "Degraded") 
                                  : (currentLanguage === "ar" ? "منقطع" : "Offline")}
                              </span>
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

          {/* TAB 2: CENTRALIZED API GATEWAY SIMULATOR */}
          {activeSubTab === "gateway" && (
            <div className="space-y-6" id="tab-gateway">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Selector lists */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "قائمة واجهات الـ API المدعومة" : "Standard REST API Endpoints"}
                  </h3>

                  <div className="space-y-2.5">
                    {endpoints.map(ep => {
                      const isSelected = selectedEndpoint.id === ep.id;
                      return (
                        <button
                          key={ep.id}
                          onClick={() => setSelectedEndpoint(ep)}
                          className={`w-full text-right p-3 rounded-xl transition-all border text-xs cursor-pointer flex flex-col gap-1.5 ${
                            isSelected 
                              ? "bg-emerald-50/50 border-emerald-500/40 shadow-sm" 
                              : "bg-white hover:bg-gray-50 border-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                              ep.method === "POST" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {ep.method}
                            </span>
                            <span className="font-mono text-gray-400 tracking-tight">{ep.path}</span>
                          </div>
                          <div className="font-bold text-gray-800 leading-snug">
                            {currentLanguage === "ar" ? ep.descriptionAr : ep.descriptionEn}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/50 text-[11px] text-amber-900 leading-normal">
                    <div className="flex gap-2 font-bold mb-1">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{currentLanguage === "ar" ? "ميزة التحقق الأمنية للأطراف السيادية" : "Sovereign Verification Token Guard"}</span>
                    </div>
                    <p>
                      {currentLanguage === "ar" 
                        ? "جميع الطلبات الفيدرالية المتبادلة مشفرة ومعززة بمصادقة ثنائية وتوقيع رقمي سيادي مشفر بمفاتيح تشفير AES-256 لمنع تزوير المعاملات."
                        : "All federal integration exchange calls require dual mTLS certificate binds and cryptographically signed headers."}
                    </p>
                  </div>
                </div>

                {/* Right side: Interactive payload console */}
                <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-800">
                  {/* Console Header */}
                  <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-amber-400" />
                      <span className="font-mono text-xs font-bold text-gray-300">
                        GATEWAY AGENT SIMULATOR v2
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-gray-400 text-[10px] font-mono mb-1 uppercase">REST ENDPOINT PATH</label>
                        <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 font-mono text-sm text-emerald-400 flex items-center justify-between">
                          <span>{selectedEndpoint.method} {selectedEndpoint.path}</span>
                          <span className="text-slate-600 text-xs font-semibold">HTTP/1.1</span>
                        </div>
                      </div>
                    </div>

                    {/* Custom Sandbox Headers */}
                    <div>
                      <label className="block text-gray-400 text-[10px] font-mono mb-1 uppercase">OAUTH 2.1 HEADERS</label>
                      <textarea
                        value={customHeaders}
                        onChange={(e) => setCustomHeaders(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 p-3 font-mono text-xs text-amber-300 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-normal"
                      />
                    </div>

                    {/* Sandbox payload */}
                    {selectedEndpoint.method === "POST" && (
                      <div>
                        <label className="block text-gray-400 text-[10px] font-mono mb-1 uppercase">REQUEST BODY (JSON PAYLOAD)</label>
                        <textarea
                          value={simulatedPayload}
                          onChange={(e) => setSimulatedPayload(e.target.value)}
                          rows={6}
                          className="w-full bg-slate-950 p-3 font-mono text-xs text-blue-300 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-normal"
                        />
                      </div>
                    )}

                    {/* Simulation trigger */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleRunGatewaySimulation}
                        disabled={isSimulating}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-gray-500 text-slate-950 font-bold rounded-xl font-mono text-xs cursor-pointer transition-all flex items-center gap-2 shadow-lg"
                      >
                        {isSimulating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                            <span>PROCESSING SECURE PROXIES...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-slate-950" />
                            <span>EXECUTE INTEROPERABILITY TEST</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Output Terminal */}
                    {(simulationLogs.length > 0 || simulationResponse) && (
                      <div className="space-y-3 pt-4 border-t border-slate-800">
                        <div>
                          <label className="block text-gray-400 text-[10px] font-mono mb-1 uppercase">INTERACTION SECURE COMPLIANCE LOGS</label>
                          <div className="bg-slate-950/70 p-3 rounded-xl font-mono text-[10px] text-gray-400 space-y-1 max-h-32 overflow-y-auto leading-relaxed">
                            {simulationLogs.map((log, index) => (
                              <div key={index} className="flex gap-1.5">
                                <span className="text-emerald-600 font-bold">&gt;</span>
                                <span>{log}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {simulationResponse && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <label className="block text-gray-400 text-[10px] font-mono mb-1 uppercase">RESPONSE BODY (200 OK SUCCESS)</label>
                            <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-normal max-h-48 border border-emerald-950">
                              {JSON.stringify(simulationResponse, null, 2)}
                            </pre>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MASTER DATA MANAGEMENT (MDM) */}
          {activeSubTab === "mdm" && (
            <div className="space-y-6" id="tab-mdm">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "مركز السجلات والبيانات السيادية الموحدة (MDM)" : "Master Data Management (MDM) Center"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {currentLanguage === "ar" 
                        ? "يمنع هذا المحور تكرار واختلاف البيانات وتضارب رأس المال وعناوين السجل التجاري والأنشطة عبر مزامنة ممتدة مع العدل والضرائب."
                        : "Centralized synchronization core maintaining a single source of truth for corporate capital, names, and activities."}
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={mdmSearch}
                      onChange={(e) => setMdmSearch(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "بحث في السجلات الرئيسية..." : "Search master records..."}
                      className="pl-9 pr-4 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64 transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider">
                        <th className="p-3 text-right">{currentLanguage === "ar" ? "المعرف والمعجل" : "Record ID / Entity"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "قيمة وزارة التجارة والشركات (SDMCI)" : "SDMCI Local Value"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "قيمة وزارة العدل (MOJ)" : "Justice System Value"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "قيمة ديوان الضرائب" : "Tax Chamber Value"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "حالة التطابق الموحد" : "Consensus State"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "إجراءات الحل السيادي" : "Consensus Sovereign Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium text-slate-700">
                      {filteredMdmRecords.map(rec => (
                        <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3">
                            <div>
                              <span className="font-mono text-gray-400 block text-[10px]">{rec.id}</span>
                              <span className="font-bold text-gray-900 text-sm">
                                {currentLanguage === "ar" ? rec.entityTypeAr : rec.entityTypeEn}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{currentLanguage === "ar" ? `مراجعة: ${rec.lastChecked}` : `Audit: ${rec.lastChecked}`}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-800 bg-emerald-50/20 font-mono">
                            {rec.sdmciValue}
                          </td>
                          <td className="p-3 text-center font-mono">
                            {rec.mojValue}
                          </td>
                          <td className="p-3 text-center font-mono">
                            {rec.taxValue}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              rec.status === "synced" 
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                : "bg-red-50 text-red-800 border-red-200"
                            }`}>
                              {rec.status === "synced" ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>{currentLanguage === "ar" ? "متطابق تماماً" : "Fully Synchronized"}</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                  <span>{currentLanguage === "ar" ? "تعارض بيانات" : "Data Conflict"}</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {rec.status === "conflict" ? (
                              <div className="flex gap-1 justify-center">
                                <button
                                  onClick={() => handleResolveConflict(rec.id, "sdmci")}
                                  className="px-2 py-1 bg-emerald-700 text-white font-semibold rounded text-[10px] hover:bg-emerald-800 transition-all cursor-pointer"
                                  title={currentLanguage === "ar" ? "اعتماد قيمة التجارة والصناعة" : "Use Local Commerce Value"}
                                >
                                  {currentLanguage === "ar" ? "اعتماد التجارة" : "Use SDMCI"}
                                </button>
                                <button
                                  onClick={() => handleResolveConflict(rec.id, "moj")}
                                  className="px-2 py-1 bg-blue-700 text-white font-semibold rounded text-[10px] hover:bg-blue-800 transition-all cursor-pointer"
                                  title={currentLanguage === "ar" ? "اعتماد قيمة وزارة العدل" : "Use Justice Value"}
                                >
                                  {currentLanguage === "ar" ? "اعتماد العدل" : "Use Justice"}
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVENT-DRIVEN ARCHITECTURE BROKER */}
          {activeSubTab === "events" && (
            <div className="space-y-6" id="tab-events">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Event Broker Schema Infographics */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "مخطط ناقل الأحداث الوطني" : "National Event Broker Infrastructure"}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {currentLanguage === "ar"
                      ? "يعتمد نظام الربط البيني على تصميم موجه بالأحداث (Event-Driven) لضمان استمرارية المعاملات حتى في حال انقطاع الأنظمة الخارجية المؤقت."
                      : "The National Interoperability Gateway deploys high-volume event streams ensuring non-blocking microservice handshakes."}
                  </p>

                  {/* Visual Flow diagram of Event streaming */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 font-mono text-[11px] text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">1. Publisher (SDMCI)</span>
                      <span className="text-gray-400">Events Triggered</span>
                    </div>
                    <div className="text-center text-gray-400">↓</div>
                    <div className="flex items-center justify-between border-y border-dashed border-gray-200 py-1.5">
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">2. Broker Queue</span>
                      <span className="text-gray-400">Sovereign Kafka Node</span>
                    </div>
                    <div className="text-center text-gray-400">↓</div>
                    <div className="flex items-center justify-between">
                      <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">3. Retry Envelope</span>
                      <span className="text-gray-400">Automatic backoff</span>
                    </div>
                    <div className="text-center text-gray-400">↓</div>
                    <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-1.5">
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">4. Dead Letter Queue</span>
                      <span className="text-gray-400">Needs Replay</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="text-xs text-amber-400 font-bold tracking-wide uppercase font-mono">BROKER PERFORMANCE STATS</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <div className="text-gray-400">{currentLanguage === "ar" ? "سعة ناقل النبض" : "Broker capacity"}</div>
                        <div className="font-bold text-emerald-400">10,000 msg/sec</div>
                      </div>
                      <div>
                        <div className="text-gray-400">{currentLanguage === "ar" ? "نسبة تسليم الأحداث" : "Delivery Success"}</div>
                        <div className="font-bold text-emerald-400">99.982%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Events Queue list */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "var(--font-arabic)" }}>
                      {currentLanguage === "ar" ? "تدفق الأحداث والمزامنة الحية" : "Live Federal Domain Events Queue"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {currentLanguage === "ar" 
                        ? "متابعة تدفق الرسائل والأحداث بين الأنظمة الحكومية والتدخل الفوري لحل تحويلات Dead Letter Queue المتوقفة."
                        : "Monitor live domain events stream and trigger instantaneous replay for transactions inside the Dead Letter Queue."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {events.map(ev => {
                      const isCompleted = ev.status === "completed";
                      const isRetrying = ev.status === "retrying";
                      const isDLQ = ev.status === "dlq";

                      return (
                        <div 
                          key={ev.id} 
                          className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                            isCompleted 
                              ? "bg-emerald-50/20 border-emerald-100" 
                              : isRetrying 
                              ? "bg-amber-50/20 border-amber-100 animate-pulse" 
                              : "bg-red-50/20 border-red-100"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-2 mb-2 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                                isCompleted ? "bg-emerald-100 text-emerald-800" : isRetrying ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                              }`}>
                                {ev.status.toUpperCase()}
                              </span>
                              <span className="font-bold text-slate-900">{ev.eventName}</span>
                              <span className="text-gray-400">({ev.id})</span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(ev.timestamp).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="sm:col-span-3 font-mono text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 overflow-x-auto text-[10px]">
                              <div className="text-gray-400 uppercase text-[8px] mb-1">EVENT SCHEMA PAYLOAD</div>
                              {ev.payload}
                            </div>

                            <div className="flex flex-col justify-between font-mono">
                              <div>
                                <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "مصدر الحدث" : "Event Source"}</span>
                                <span className="font-bold text-slate-800">{ev.source}</span>
                              </div>
                              <div className="mt-2">
                                <span className="text-gray-400 block text-[9px]">{currentLanguage === "ar" ? "محاولات الإرسال" : "Retries Count"}</span>
                                <span className="font-bold text-slate-800">{ev.retries} / 5</span>
                              </div>
                            </div>
                          </div>

                          {ev.errorMessage && (
                            <div className="mt-2 bg-red-50 text-red-900 p-2 rounded border border-red-100/50 font-mono text-[10px] flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              <span>{ev.errorMessage}</span>
                            </div>
                          )}

                          {isDLQ && (
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => handleReplayEvent(ev.id)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 text-[10px]"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>{currentLanguage === "ar" ? "إعادة تشغيل فوري (Replay Event)" : "Force Replay from DLQ"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & KEY MANAGER */}
          {activeSubTab === "security" && (
            <div className="space-y-6" id="tab-security">
              {/* Central configuration control panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Outbound credentials management keys */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "var(--font-arabic)" }}>
                        {currentLanguage === "ar" ? "مفاتيح الاتصال الفيدرالي المعتمدة" : "Centralized API Access Credentials"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {currentLanguage === "ar" 
                          ? "إدارة وتدوير مفاتيح الاتصال والأذونات الرمزية للهيئات المترابطة بالتوافق مع معايير الـ API الوطنية."
                          : "Configure, verify, and rotate secure application-level credentials for approved state systems."}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowKeyGenerator(true)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{currentLanguage === "ar" ? "توليد مفتاح" : "Create API Key"}</span>
                    </button>
                  </div>

                  {/* Key generator form */}
                  {showKeyGenerator && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      onSubmit={handleCreateApiKey}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-3"
                    >
                      <div className="font-bold text-gray-800">{currentLanguage === "ar" ? "طلب ترخيص مفتاح API جديد" : "Request New API Access Token"}</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={newKeyLabel}
                          onChange={(e) => setNewKeyLabel(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "اسم الجهة الحكومية أو الغرض..." : "e.g., Central Bank Verification Endpoint"}
                          className="flex-1 px-3 py-1.5 bg-white text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                        />
                        <button
                          type="submit"
                          className="px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer transition-all"
                        >
                          {currentLanguage === "ar" ? "تأكيد التوليد" : "Generate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowKeyGenerator(false)}
                          className="px-3 bg-gray-200 hover:bg-gray-300 text-slate-700 font-bold rounded-lg text-xs cursor-pointer transition-all"
                        >
                          {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                      </div>
                    </motion.form>
                  )}

                  <div className="space-y-3">
                    {apiKeys.map((keyObj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="font-mono space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-xs">{keyObj.label}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              keyObj.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              {keyObj.active ? (currentLanguage === "ar" ? "نشط" : "ACTIVE") : (currentLanguage === "ar" ? "ملغى" : "REVOKED")}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 select-all font-semibold tracking-wider bg-white px-2 py-1.5 rounded border border-gray-200 flex items-center justify-between">
                            <span>{keyObj.key}</span>
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono">
                          <div className="text-right">
                            <span className="text-gray-400 text-[10px] block">{currentLanguage === "ar" ? "الاستهلاك اليومي" : "Daily Usage"}</span>
                            <span className="font-bold text-slate-800">{keyObj.usage}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleApiKey(keyObj.key)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                              keyObj.active 
                                ? "bg-red-50 text-red-700 hover:bg-red-100" 
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {keyObj.active 
                              ? (currentLanguage === "ar" ? "إلغاء تنشيط" : "Revoke Key") 
                              : (currentLanguage === "ar" ? "تنشيط مجدداً" : "Activate Key")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left Side: Security Shield Settings (mTLS config) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-arabic)" }}>
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>{currentLanguage === "ar" ? "إعدادات درع الحماية الوطني" : "Sovereign DevSecOps Shield"}</span>
                  </h3>

                  {/* Config Widget 1: mTLS validation toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800 text-xs block">{currentLanguage === "ar" ? "فرض مصادقة الـ mTLS ثنائية الاتجاه" : "Enforce Mutual TLS Authentication"}</span>
                        <span className="text-[10px] text-gray-400 block">{currentLanguage === "ar" ? "يتطلب شهادات رقمية سيادية معتمدة" : "Requires valid national digital certs"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMtlsEnabled(!mtlsEnabled)}
                        className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${
                          mtlsEnabled ? "bg-emerald-600" : "bg-gray-300"
                        }`}
                      >
                        <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                          mtlsEnabled ? "right-1" : "right-6"
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Config Widget 2: Encryption level */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="font-bold text-gray-800 text-xs block">{currentLanguage === "ar" ? "تشفير حمولات التبادل (AES-256)" : "Payload Encryption Algorithm"}</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setEncryptionLevel("aes-256")}
                        className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                          encryptionLevel === "aes-256" 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-500" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        AES-256 (Secure)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEncryptionLevel("plaintext")}
                        className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                          encryptionLevel === "plaintext" 
                            ? "bg-red-50 text-red-800 border-red-500" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        Plaintext payload
                      </button>
                    </div>
                  </div>

                  {/* Config Widget 3: OWASP Rate Limiting */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{currentLanguage === "ar" ? "حدود تدفق الطلبات لكل دقيقة" : "OWASP Rate Limit per Agency"}</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{owaspRateLimiting} req/min</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={owaspRateLimiting}
                      onChange={(e) => setOwaspRateLimiting(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <p className="text-[10px] text-gray-400">
                      {currentLanguage === "ar" 
                        ? "يمنع هجمات الحرمان من الخدمة (DDoS) ويحمي قواعد بيانات السجل التجاري من الإغراق."
                        : "Shields target servers against DDoS threats by capping incoming traffic volumes."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AI CO-PILOT INTEGRATION ASSISTANT */}
          {activeSubTab === "ai" && (
            <div className="space-y-6" id="tab-ai">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Error Log Presets selection */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3" style={{ fontFamily: "var(--font-arabic)" }}>
                    {currentLanguage === "ar" ? "الأعطال الفيدرالية الشائعة للتشخيص" : "Simulate Common Integration Issues"}
                  </h3>

                  <div className="space-y-3">
                    <button
                      onClick={() => runAIDiagnostic("signature")}
                      className={`w-full text-right p-3 rounded-xl transition-all border text-xs cursor-pointer flex items-center gap-3 ${
                        activeErrorPreset === "signature" 
                          ? "bg-red-50/50 border-red-500/40 shadow-sm" 
                          : "bg-white hover:bg-gray-50 border-gray-100"
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <div className="font-bold text-gray-800">
                          {currentLanguage === "ar" ? "فشل التوقيع الرقمي (المالية)" : "Digital Signature Mismatch (MOF)"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">X-Sovereign-Signature Mismatch</div>
                      </div>
                    </button>

                    <button
                      onClick={() => runAIDiagnostic("timeout")}
                      className={`w-full text-right p-3 rounded-xl transition-all border text-xs cursor-pointer flex items-center gap-3 ${
                        activeErrorPreset === "timeout" 
                          ? "bg-red-50/50 border-red-500/40 shadow-sm" 
                          : "bg-white hover:bg-gray-50 border-gray-100"
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <div className="font-bold text-gray-800">
                          {currentLanguage === "ar" ? "انتهاء المهلة (هيئة الجمارك)" : "504 Gateway Timeout (Customs)"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">Customs Clearing Queue Timeout</div>
                      </div>
                    </button>

                    <button
                      onClick={() => runAIDiagnostic("expired-token")}
                      className={`w-full text-right p-3 rounded-xl transition-all border text-xs cursor-pointer flex items-center gap-3 ${
                        activeErrorPreset === "expired-token" 
                          ? "bg-red-50/50 border-red-500/40 shadow-sm" 
                          : "bg-white hover:bg-gray-50 border-gray-100"
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <div className="font-bold text-gray-800">
                          {currentLanguage === "ar" ? "رمز JWT منتهي (السجل المدني)" : "401 Expired JWT Token (Identity)"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">Bearer Token Expired</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right side: Interactive AI troubleshooting result console */}
                <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-800 min-h-[400px]">
                  {/* Console Header */}
                  <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span className="font-mono text-xs font-bold text-gray-300">
                        SOVEREIGN INTEROPERABILITY CO-PILOT AI
                      </span>
                    </div>

                    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      GENAI POWERED
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-center">
                    {aiIsAnalyzing ? (
                      <div className="text-center space-y-4">
                        <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                        <p className="font-mono text-xs text-amber-300">
                          RUNNING OWASP INTEGRATION AUDITS & PAYLOAD DECRYPTION ANALYSIS...
                        </p>
                      </div>
                    ) : aiDiagnostic ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs leading-relaxed font-mono whitespace-pre-wrap text-gray-300">
                          {aiDiagnostic}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setAiDiagnostic("");
                              setActiveErrorPreset(null);
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-all"
                          >
                            {currentLanguage === "ar" ? "مسح التشخيص" : "Clear Diagnostic"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center space-y-3 py-12">
                        <Sparkles className="w-12 h-12 text-amber-400/40 mx-auto" />
                        <h4 className="font-bold text-gray-400 text-sm" style={{ fontFamily: "var(--font-arabic)" }}>
                          {currentLanguage === "ar" ? "جاهز لتحليل وتصحيح أعطال الربط البيني" : "Ready to diagnose interoperability anomalies"}
                        </h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                          {currentLanguage === "ar"
                            ? "يرجى تحديد أحد الأعطال الفيدرالية الشائعة من اللوحة الجانبية، وسيقوم المساعد الذكي بفحص توقيعات المفاتيح ورموز JWT واقتراح خطوات الحل الفورية."
                            : "Select one of the simulated error logs on the left to invoke the AI diagnostic workflow instantly."}
                        </p>
                      </div>
                    )}
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
