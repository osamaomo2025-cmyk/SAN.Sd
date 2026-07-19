/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Cpu, Globe, Landmark, ShieldAlert, 
  Menu, LayoutDashboard, Layers, Palette, Award, ShieldCheck, Scale, Network, Fingerprint, BarChart3, ClipboardList,
  ShoppingBag, Database, Users, Boxes, Briefcase, Shield, Brain, Smartphone, Grid, TrendingUp, Bot
} from "lucide-react";

import { 
  UserRole, CommercialRegistration, FactoryRegistration, 
  ImportExportLicense, CertificateOfOrigin, LandApplication, 
  ConsumerComplaint, ApplicationStatus 
} from "./types";

import AIChatAssistant from "./components/AIChatAssistant";
import NationalElectronicServicesCenter from "./components/NationalElectronicServicesCenter";
import CommercialRegistrationModule from "./components/CommercialRegistration";
import CommercialNamesModule from "./components/CommercialNames";
import IndustrialPlatformModule from "./components/IndustrialPlatform";
import ImportExportModule from "./components/ImportExport";
import InvestmentPortalModule from "./components/InvestmentPortal";
import ConsumerProtectionModule from "./components/ConsumerProtection";
import Dashboards from "./components/Dashboards";
import EnterpriseArchitecture from "./components/EnterpriseArchitecture";
import GovernmentDesignSystem from "./components/GovernmentDesignSystem";
import CorporateLifecycleModule from "./components/CorporateLifecycle";
import LicensingPlatform from "./components/LicensingPlatform";
import NationalIntegrationHub from "./components/NationalIntegrationHub";
import TrustServicesPlatform from "./components/TrustServicesPlatform";
import GovernmentPaymentPlatform from "./components/GovernmentPaymentPlatform";
import SovereignBIPlatform from "./components/SovereignBIPlatform";
import SmartInspectionPlatform from "./components/SmartInspectionPlatform";
import DigitalCommercePlatform from "./components/DigitalCommercePlatform";
import SovereignDigitalEconomyPlatform from "./components/SovereignDigitalEconomyPlatform";
import NationalInnovationPlatform from "./components/innovation/NationalInnovationPlatform";
import GovernmentRecordsArchivePlatform from "./components/GovernmentRecordsArchivePlatform";
import SovereignLegalAffairsPlatform from "./components/SovereignLegalAffairsPlatform";
import SovereignHumanCapitalPlatform from "./components/SovereignHumanCapitalPlatform";
import SovereignAssetManagementPlatform from "./components/SovereignAssetManagementPlatform";
import SovereignProcurementPlatform from "./components/SovereignProcurementPlatform";
import SovereignGRCPlatform from "./components/SovereignGRCPlatform";
import SovereignSOCPlatform from "./components/SovereignSOCPlatform";
import SovereignAIGovernancePlatform from "./components/SovereignAIGovernancePlatform";
import SovereignDRResiliencePlatform from "./components/SovereignDRResiliencePlatform";
import SovereignNationalSuperApp from "./components/SovereignNationalSuperApp";
import SovereignExecutiveCommandCenter from "./components/SovereignExecutiveCommandCenter";
import SovereignAutonomousOperationsHub from "./components/SovereignAutonomousOperationsHub";
import SovereignAuthModal from "./components/SovereignAuthModal";
import SovereignIntelligentGovPlatform from "./components/SovereignIntelligentGovPlatform";
import SovereignCommerceEcosystemPlatform from "./components/SovereignCommerceEcosystemPlatform";
import SovereignEconomicIntelligencePlatform from "./components/SovereignEconomicIntelligencePlatform";
import SovereignTradeIntegrationPlatform from "./components/SovereignTradeIntegrationPlatform";
import SovereignIndustrialDevelopmentPlatform from "./components/SovereignIndustrialDevelopmentPlatform";
import SovereignLegislativeGovernancePlatform from "./components/SovereignLegislativeGovernancePlatform";
import SovereignCommercialDataGovernance from "./components/SovereignCommercialDataGovernance";
import NationalDigitalEconomicPlatform from "./components/NationalDigitalEconomicPlatform";
import NationalAiCopilotCenter from "./components/NationalAiCopilotCenter";
import NationalGeospatialTwinPlatform from "./components/NationalGeospatialTwinPlatform";
import NationalMobileEcosystem from "./components/NationalMobileEcosystem";
import NationalEconomicCommandCenter from "./components/NationalEconomicCommandCenter";
import NationalProductionReadinessCenter from "./components/NationalProductionReadinessCenter";


// Standard Seeding Data fully compliant with Typescript structures
const initialCompanies: CommercialRegistration[] = [
  {
    id: "comp-1",
    companyNameAr: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    companyNameEn: "Khartoum Unified Gum Arabic Export Co.",
    registrationNumber: "SD-2026-90412",
    activityType: "تصدير صمغ عربي ومحاصيل زراعية",
    capital: 10000000,
    partners: ["أحمد محمد عثمان", "سليمان حسن فضل الله"],
    addressState: "الخرطوم",
    addressCity: "الخرطوم بحري",
    status: ApplicationStatus.APPROVED,
    applicantId: "user-default",
    createdAt: "2026-07-01T12:00:00Z",
    updatedAt: "2026-07-02T12:00:00Z"
  },
  {
    id: "comp-2",
    companyNameAr: "مؤسسة البحر الأحمر للخدمات الملاحية والتجارة",
    companyNameEn: "Red Sea Maritime Services & Trade",
    registrationNumber: "SD-2026-30219",
    activityType: "خدمات لوجستية وتخليص جمركي",
    capital: 5000000,
    partners: ["فاطمة الزهراء علي"],
    addressState: "البحر الأحمر",
    addressCity: "بورتسودان الجنوبي",
    status: ApplicationStatus.APPROVED,
    applicantId: "user-default",
    createdAt: "2026-07-03T12:00:00Z",
    updatedAt: "2026-07-04T12:00:00Z"
  },
  {
    id: "comp-3",
    companyNameAr: "الشركة السودانية للصناعات النسيجية المتطورة",
    companyNameEn: "Sudanese Advanced Textile Industries",
    registrationNumber: "SD-2026-51204",
    activityType: "تصنيع وغزل الأقطان الوطنية",
    capital: 25000000,
    partners: ["عثمان صالح الجزولي", "مستثمر أجنبي الكوميسا"],
    addressState: "الجزيرة",
    addressCity: "مدني المنطقة الصناعية",
    status: ApplicationStatus.PENDING,
    applicantId: "user-default",
    createdAt: "2026-07-10T12:00:00Z",
    updatedAt: "2026-07-10T12:00:00Z"
  }
];

const initialFactories: FactoryRegistration[] = [
  {
    id: "fac-1",
    factoryName: "مصنع جياد لصناعة وتجميع الآلات الزراعية ذ.م.م",
    industrialSector: "engineering",
    locationState: "الجزيرة",
    productionCapacity: "150 وحدة جرار زراعي سنوياً",
    energySource: "طاقة شمسية هجينة 100 كيلووات",
    productionLinesCount: 4,
    status: ApplicationStatus.APPROVED,
    applicantId: "user-default",
    createdAt: "2026-07-01T12:00:00Z",
    updatedAt: "2026-07-02T12:00:00Z",
    inspectionStatus: "passed",
    lastInspectionDate: "2026-06-20"
  },
  {
    id: "fac-2",
    factoryName: "المجمع الطبي الدوائي الحديث للشرق",
    industrialSector: "pharmaceutical",
    locationState: "البحر الأحمر",
    productionCapacity: "5 مليون عبوة دواء سنوياً",
    energySource: "الشبكة القومية للكهرباء",
    productionLinesCount: 2,
    status: ApplicationStatus.APPROVED,
    applicantId: "user-default",
    createdAt: "2026-07-03T12:00:00Z",
    updatedAt: "2026-07-04T12:00:00Z",
    inspectionStatus: "passed",
    lastInspectionDate: "2026-07-01"
  },
  {
    id: "fac-3",
    factoryName: "مطاحن الغلال والمواد الغذائية الكبرى بالأبيض",
    industrialSector: "food",
    locationState: "شمال كردفان",
    productionCapacity: "120 طن دقيق يومياً",
    energySource: "مولدات وقود حيوي مساندة",
    productionLinesCount: 3,
    status: ApplicationStatus.PENDING,
    applicantId: "user-default",
    createdAt: "2026-07-11T12:00:00Z",
    updatedAt: "2026-07-11T12:00:00Z",
    inspectionStatus: "pending"
  }
];

const initialLicenses: ImportExportLicense[] = [
  {
    id: "lic-1",
    licenseType: "export",
    companyId: "comp-1",
    companyName: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    goodsDescription: "صمغ عربي خام و مصنع درجة أولى زوّار الكوميسا",
    annualValueEstimate: 8000000,
    status: ApplicationStatus.APPROVED,
    applicantId: "user-default",
    createdAt: "2026-07-01T12:00:00Z",
    updatedAt: "2026-07-02T12:00:00Z"
  },
  {
    id: "lic-2",
    licenseType: "import",
    companyId: "comp-2",
    companyName: "مؤسسة البحر الأحمر للخدمات الملاحية والتجارة",
    goodsDescription: "قطع غيار ماكينات وآلات مصانع هندسية",
    annualValueEstimate: 4000000,
    status: ApplicationStatus.APPROVED,
    applicantId: "user-default",
    createdAt: "2026-07-03T12:00:00Z",
    updatedAt: "2026-07-04T12:00:00Z"
  }
];

const initialCertificates: CertificateOfOrigin[] = [
  {
    id: "cert-1",
    certificateNumber: "SD-ORIG-2026-10492",
    exporterName: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    importerName: "Nour Global Trading LLC",
    importerCountry: "الإمارات العربية المتحدة",
    hsCode: "1301.90",
    goodsDescriptionAr: "صمغ عربي هشاب طبيعي 100% فرز أول",
    goodsDescriptionEn: "100% Organic Hashab Gum Arabic Grade 1",
    weightNet: 22000,
    weightGross: 22400,
    portOfLoading: "ميناء بورتسودان الجنوبي",
    portOfDischarge: "ميناء جبل علي، دبي",
    invoiceValue: 48000,
    currency: "USD",
    status: ApplicationStatus.APPROVED,
    applicantId: "user-default",
    createdAt: "2026-07-05T12:00:00Z"
  }
];

const initialApplications: LandApplication[] = [
  {
    id: "app-1",
    investorId: "user-default",
    investorName: "الشيخ فهد بن عبدالله آل سعود",
    opportunityId: "opp-1",
    proposedProject: "مجمع الصناعات التحويلية الحديثة للصمغ العربي وتعبئة البودرة الرذاذية",
    requestedAreaSqm: 15000,
    preferredIndustrialZone: "المنطقة الحرة بورتسودان",
    status: ApplicationStatus.APPROVED,
    createdAt: "2026-07-06T12:00:00Z"
  },
  {
    id: "app-2",
    investorId: "user-default",
    investorName: "الشركة الوطنية للتطوير الزراعي الحديث",
    opportunityId: "opp-3",
    proposedProject: "المجمع الوطني لإنتاج وتجميد اللحوم السودانية الموجهة للتصدير",
    requestedAreaSqm: 20000,
    preferredIndustrialZone: "المنطقة الصناعية بحري",
    status: ApplicationStatus.PENDING,
    createdAt: "2026-07-11T12:00:00Z"
  }
];

const initialComplaints: ConsumerComplaint[] = [
  {
    id: "comp-c1",
    reporterName: "أحمد النور",
    reporterPhone: "+249912345678",
    violationType: "price_gouging",
    storeName: "مجموعة البركة لتوزيع المواد الغذائية بالجملة",
    details: "قام الموزع بزيادة أسعار شوال الدقيق بنسبة 35% دون أي زيادة رسمية ومخالفة لقوانين حماية المستهلك السودانية الصادرة للعام 2026.",
    state: "الخرطوم",
    city: "أم درمان السوق الشعبي",
    status: "resolved",
    createdAt: "2026-07-05T12:00:00Z"
  },
  {
    id: "comp-c2",
    reporterName: "منى محمد",
    reporterPhone: "+249123456789",
    violationType: "counterfeit",
    storeName: "محلات النيل للتجارة السريعة",
    details: "عرض زيوت نباتية معبأة محلياً ببطاقات منشأ وتواريخ تعبئة وهمية وغير مطابقة للمواصفات الصحية والبيئية.",
    state: "الجزيرة",
    city: "مدني سوق أركويت",
    status: "investigating",
    createdAt: "2026-07-11T12:00:00Z"
  }
];

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<"ar" | "en">("ar");
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.BUSINESS_INVESTOR);
  const [activeModule, setActiveModule] = useState<string>("national-production-readiness");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");

  // Core Data State Synchronized via LocalStorage
  const [companies, setCompanies] = useState<CommercialRegistration[]>([]);
  const [factories, setFactories] = useState<FactoryRegistration[]>([]);
  const [licenses, setLicenses] = useState<ImportExportLicense[]>([]);
  const [certificates, setCertificates] = useState<CertificateOfOrigin[]>([]);
  const [applications, setApplications] = useState<LandApplication[]>([]);
  const [complaints, setComplaints] = useState<ConsumerComplaint[]>([]);

  // Initialize data
  useEffect(() => {
    const localCompanies = localStorage.getItem("sdmci_companies");
    const localFactories = localStorage.getItem("sdmci_factories");
    const localLicenses = localStorage.getItem("sdmci_licenses");
    const localCerts = localStorage.getItem("sdmci_certificates");
    const localApps = localStorage.getItem("sdmci_applications");
    const localComplaints = localStorage.getItem("sdmci_complaints");

    if (localCompanies) setCompanies(JSON.parse(localCompanies));
    else {
      setCompanies(initialCompanies);
      localStorage.setItem("sdmci_companies", JSON.stringify(initialCompanies));
    }

    if (localFactories) setFactories(JSON.parse(localFactories));
    else {
      setFactories(initialFactories);
      localStorage.setItem("sdmci_factories", JSON.stringify(initialFactories));
    }

    if (localLicenses) setLicenses(JSON.parse(localLicenses));
    else {
      setLicenses(initialLicenses);
      localStorage.setItem("sdmci_licenses", JSON.stringify(initialLicenses));
    }

    if (localCerts) setCertificates(JSON.parse(localCerts));
    else {
      setCertificates(initialCertificates);
      localStorage.setItem("sdmci_certificates", JSON.stringify(initialCertificates));
    }

    if (localApps) setApplications(JSON.parse(localApps));
    else {
      setApplications(initialApplications);
      localStorage.setItem("sdmci_applications", JSON.stringify(initialApplications));
    }

    if (localComplaints) setComplaints(JSON.parse(localComplaints));
    else {
      setComplaints(initialComplaints);
      localStorage.setItem("sdmci_complaints", JSON.stringify(initialComplaints));
    }
  }, []);

  // Sync state helpers
  const handleAddCompany = async (newComp: any) => {
    const comp: CommercialRegistration = {
      id: `comp-${Date.now()}`,
      companyNameAr: newComp.companyNameAr,
      companyNameEn: newComp.companyNameEn,
      registrationNumber: newComp.registrationNumber,
      activityType: newComp.activityType,
      capital: Number(newComp.capital),
      partners: newComp.partners,
      addressState: newComp.addressState,
      addressCity: newComp.addressCity,
      status: ApplicationStatus.PENDING,
      applicantId: "user-default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...companies, comp];
    setCompanies(updated);
    localStorage.setItem("sdmci_companies", JSON.stringify(updated));
    return comp;
  };

  const handleUpdateCompanyStatus = async (id: string, status: ApplicationStatus) => {
    const updated = companies.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c);
    setCompanies(updated);
    localStorage.setItem("sdmci_companies", JSON.stringify(updated));
  };

  const handleAddFactory = async (newFac: any) => {
    const fac: FactoryRegistration = {
      id: `fac-${Date.now()}`,
      factoryName: newFac.factoryName,
      industrialSector: newFac.industrialSector,
      locationState: newFac.locationState,
      productionCapacity: newFac.productionCapacity,
      energySource: newFac.energySource,
      productionLinesCount: Number(newFac.productionLinesCount),
      status: ApplicationStatus.PENDING,
      applicantId: "user-default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inspectionStatus: "pending"
    };
    const updated = [...factories, fac];
    setFactories(updated);
    localStorage.setItem("sdmci_factories", JSON.stringify(updated));
    return fac;
  };

  const handleInspectFactory = async (id: string, inspectionStatus: "passed" | "failed", status: ApplicationStatus) => {
    const updated = factories.map(f => 
      f.id === id 
        ? { 
            ...f, 
            inspectionStatus, 
            status, 
            lastInspectionDate: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString()
          } 
        : f
    );
    setFactories(updated);
    localStorage.setItem("sdmci_factories", JSON.stringify(updated));
  };

  const handleAddLicense = async (newLic: any) => {
    const lic: ImportExportLicense = {
      id: `lic-${Date.now()}`,
      licenseType: newLic.licenseType,
      companyId: "comp-1",
      companyName: newLic.companyName,
      goodsDescription: newLic.goodsDescription,
      annualValueEstimate: Number(newLic.annualValueEstimate),
      status: ApplicationStatus.PENDING,
      applicantId: "user-default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...licenses, lic];
    setLicenses(updated);
    localStorage.setItem("sdmci_licenses", JSON.stringify(updated));
    return lic;
  };

  const handleUpdateLicenseStatus = async (id: string, status: ApplicationStatus) => {
    const updated = licenses.map(l => l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l);
    setLicenses(updated);
    localStorage.setItem("sdmci_licenses", JSON.stringify(updated));
  };

  const handleAddCertificate = async (newCert: any) => {
    const cert: CertificateOfOrigin = {
      id: `cert-${Date.now()}`,
      certificateNumber: `SD-ORIG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      exporterName: newCert.exporterName,
      importerName: newCert.importerName,
      importerCountry: newCert.importerCountry,
      hsCode: newCert.hsCode,
      goodsDescriptionAr: newCert.goodsDescriptionAr,
      goodsDescriptionEn: newCert.goodsDescriptionEn,
      weightNet: Number(newCert.weightNet),
      weightGross: Number(newCert.weightGross),
      portOfLoading: newCert.portOfLoading,
      portOfDischarge: newCert.portOfDischarge,
      invoiceValue: Number(newCert.invoiceValue),
      currency: newCert.currency,
      status: ApplicationStatus.APPROVED,
      applicantId: "user-default",
      createdAt: new Date().toISOString()
    };
    const updated = [...certificates, cert];
    setCertificates(updated);
    localStorage.setItem("sdmci_certificates", JSON.stringify(updated));
    return cert;
  };

  const handleAddApplication = async (newApp: any) => {
    const app: LandApplication = {
      id: `app-${Date.now()}`,
      investorId: "user-default",
      investorName: newApp.investorName,
      opportunityId: newApp.opportunityId,
      proposedProject: newApp.proposedProject,
      requestedAreaSqm: Number(newApp.requestedAreaSqm),
      preferredIndustrialZone: newApp.preferredIndustrialZone,
      status: ApplicationStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    const updated = [...applications, app];
    setApplications(updated);
    localStorage.setItem("sdmci_applications", JSON.stringify(updated));
    return app;
  };

  const handleUpdateAppStatus = async (id: string, status: ApplicationStatus) => {
    const updated = applications.map(a => a.id === id ? { ...a, status } : a);
    setApplications(updated);
    localStorage.setItem("sdmci_applications", JSON.stringify(updated));
  };

  const handleAddComplaint = async (newComp: any) => {
    const comp: ConsumerComplaint = {
      id: `comp-c-${Date.now()}`,
      reporterName: newComp.reporterName,
      reporterPhone: newComp.reporterPhone,
      storeName: newComp.storeName,
      violationType: newComp.violationType,
      details: newComp.details,
      state: newComp.state,
      city: newComp.city,
      status: "new",
      createdAt: new Date().toISOString()
    };
    const updated = [...complaints, comp];
    setComplaints(updated);
    localStorage.setItem("sdmci_complaints", JSON.stringify(updated));
    return comp;
  };

  const handleUpdateComplaintStatus = async (id: string, status: "new" | "investigating" | "resolved" | "dismissed") => {
    const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
    setComplaints(updated);
    localStorage.setItem("sdmci_complaints", JSON.stringify(updated));
  };

  // Nav menu items
  const menuItems = [
    { id: "national-production-readiness", labelAr: "جاهزية التشغيل والتميز الحكومي الفيدرالي", labelEn: "Go-Live & Enterprise Excellence Center", icon: ShieldCheck },
    { id: "national-economic-command", labelAr: "غرفة طوارئ القيادة الاقتصادية والأزمات الفيدرالية", labelEn: "National Economic Command & Crisis Room", icon: ShieldAlert },
    { id: "national-ai-copilot", labelAr: "كوبايلوت الحكومة الوطنية والمساعد الذكي", labelEn: "National AI Copilot & Government Assistant", icon: Bot },
    { id: "national-gis-digitaltwin", labelAr: "منصة الاستخبارات الجغرافية والتوأم الرقمي الوطني", labelEn: "National GIS & Sovereign Digital Twin Platform", icon: Globe },
    { id: "national-economic-gov", labelAr: "المنصة الرقمية الوطنية للاقتصاد والحوكمة", labelEn: "National Digital Economic Gov Platform", icon: Landmark },
    { id: "services-center", labelAr: "المركز الوطني للخدمات الإلكترونية", labelEn: "National Electronic Services Center", icon: Grid },
    { id: "dashboard", labelAr: "لوحة المتابعة الرقمية", labelEn: "Sovereign Dashboard", icon: LayoutDashboard },
    { id: "intelligent-gov", labelAr: "منصة الذكاء والسيادة الوطنية ٢٠٣٥", labelEn: "National Intelligent Government 2035", icon: Brain },
    { id: "autonomous-operations", labelAr: "التشغيل الذاتي والابتكار السيادي", labelEn: "Autonomous Gov & Future Innovation", icon: Cpu },
    { id: "executive-command-center", labelAr: "مركز القيادة التنفيذي ورؤية 2035", labelEn: "Executive Command Center 2035", icon: Landmark },
    { id: "gov-records", labelAr: "المنصة الاتحادية للسجلات والأرشيف", labelEn: "Federal Records & Archive", icon: Database },
    { id: "legal-affairs", labelAr: "الشؤون القانونية والقضايا والتشريعات", labelEn: "Sovereign Legal Affairs", icon: Scale },
    { id: "human-capital", labelAr: "إدارة رأس المال البشري والرواتب", labelEn: "Human Capital & Payroll", icon: Users },
    { id: "sovereign-eam", labelAr: "إدارة الأصول والمنشآت واللوجستيات", labelEn: "Sovereign EAM & Logistics", icon: Boxes },
    { id: "sovereign-procurement", labelAr: "المشتريات والعطاءات والتعاقدات", labelEn: "Sovereign Procurement", icon: Briefcase },
    { id: "sovereign-grc", labelAr: "الحوكمة والمخاطر والالتزام والتدقيق", labelEn: "Sovereign GRC & Audit", icon: Shield },
    { id: "sovereign-soc", labelAr: "العمليات السيبرانية والـ SOC السيادي", labelEn: "Sovereign SOC & InfoSec", icon: ShieldAlert },
    { id: "dr-resilience", labelAr: "المرونة والتعافي واستمرارية الأعمال", labelEn: "Disaster Recovery & Resilience", icon: ShieldCheck },
    { id: "national-superapp", labelAr: "التطبيق الوطني والخدمات الموحدة", labelEn: "National Super App Portal", icon: Smartphone },
    { id: "bi-platform", labelAr: "ذكاء الأعمال ودعم القرار", labelEn: "Sovereign BI & Decision Support", icon: BarChart3 },
    { id: "smart-inspection", labelAr: "منصة التفتيش والإنفاذ الذكي", labelEn: "Smart Inspection & Enforcement", icon: ClipboardList },
    { id: "digital-commerce", labelAr: "المنصة الوطنية للاقتصاد الرقمي والأعمال الذكية", labelEn: "National Digital Economy & Smart Business Platform", icon: ShoppingBag },
    { id: "commerce-ecosystem", labelAr: "المنظومة التجارية الوطنية الموحدة", labelEn: "National Commerce Ecosystem", icon: Network },
    { id: "international-trade", labelAr: "التجارة الدولية والتكامل الإقليمي", labelEn: "Int'l Trade & Regional Integration", icon: Globe },
    { id: "industrial-development-innovation", labelAr: "التطوير الصناعي والابتكار الوطني", labelEn: "Industrial Dev & Innovation", icon: Cpu },
    { id: "legislative-governance-policy", labelAr: "التشريعات والحوكمة والسياسات التنظيمية", labelEn: "Legislative Governance & Policy", icon: Scale },
    { id: "commercial-data-governance", labelAr: "منصة حوكمة البيانات المفتوحة والإحصاء", labelEn: "Commercial Data Governance & Statistics", icon: Database },
    { id: "economic-intelligence-platform", labelAr: "المنصة الوطنية للذكاء الاقتصادي ودعم القرار", labelEn: "Economic Intelligence & Strategic Decision Support", icon: TrendingUp },
    { id: "national-innovation", labelAr: "المنصة الوطنية للابتكار وبراءات الاختراع", labelEn: "National Innovation & Patents", icon: Award },
    { id: "commercial-names", labelAr: "نظام الأسماء التجارية", labelEn: "Commercial Names", icon: Award },
    { id: "commercial", labelAr: "السجل التجاري الذكي", labelEn: "Commercial Registry", icon: Building2 },
    { id: "corporate-lifecycle", labelAr: "تأسيس وحوكمة الشركات", labelEn: "Corporate Lifecycle", icon: ShieldCheck },
    { id: "licensing-platform", labelAr: "التراخيص الوطنية والمطابقة", labelEn: "Licensing Platform", icon: Scale },
    { id: "industrial", labelAr: "المنصة الصناعية", labelEn: "Industrial Platform", icon: Cpu },
    { id: "importexport", labelAr: "الاستيراد والتصدير", labelEn: "Import & Export", icon: Globe },
    { id: "investment", labelAr: "بوابة الاستثمار والمدن", labelEn: "Investment Lands", icon: Landmark },
    { id: "consumer", labelAr: "حماية المستهلك والرقابة", labelEn: "Consumer Protection", icon: ShieldAlert },
    { id: "integration-hub", labelAr: "الربط والتبادل الحكومي البيني", labelEn: "National Interoperability Hub", icon: Network },
    { id: "ai-governance", labelAr: "الحوكمة والذكاء الاصطناعي السيادي", labelEn: "National AI Governance Platform", icon: Brain },
    { id: "trust-services", labelAr: "الهوية الرقمية والخدمات الموثوقة", labelEn: "Identity & Trust Services", icon: Fingerprint },
    { id: "payment-platform", labelAr: "بوابة الدفع والجباية الرقمية", labelEn: "Sovereign Payment Gateway", icon: Landmark },
    { id: "architecture", labelAr: "المخطط السيادي للتحول 2035", labelEn: "Enterprise Blueprint 2035", icon: Layers },
    { id: "design-system", labelAr: "نظام التصميم الحكومي الموحد", labelEn: "Government Design System", icon: Palette }
  ];

  const currentRoleObj = () => {
    if (currentRole === UserRole.GOVERNMENT_MINISTER) return { ar: "ديوان الوزير", en: "Sovereign Minister" };
    if (currentRole === UserRole.GOVERNMENT_EXECUTIVE) return { ar: "المتابعة التنفيذية", en: "Executive Admin" };
    if (currentRole === UserRole.GOVERNMENT_EMPLOYEE) return { ar: "الموظف الرقمي", en: "Ministry Staff" };
    return { ar: "المستثمر والمواطن", en: "Investor & Citizen" };
  };

  const currentProfile = {
    fullName: currentLanguage === "ar" ? "بروفايل معتمد" : "Verified Sudanese Account",
    role: currentRole
  };

  return (
    <div 
      className="min-h-screen bg-[#F4F6F5] flex flex-col font-sans text-[#1E293B] selection:bg-sudan-green selection:text-white overflow-x-hidden"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Upper Navigation/Branding Bar */}
      <header className="bg-white text-[#1E293B] border-b border-gray-200 sticky top-0 z-30 shadow-sm h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
          {/* Logo / Title Block */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 md:hidden cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <button 
              onClick={() => {
                setActiveModule("dashboard");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-4 text-start hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
              title={currentLanguage === "ar" ? "العودة إلى الصفحة الرئيسية" : "Go to Homepage"}
            >
              {/* Emblem Logo Emblem - Sudan Flag Inspired */}
              <div className="w-12 h-12 bg-[#007229] rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-[#005220]/20">
                <div className="w-6 h-4 bg-white relative rounded-sm overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-[#D21034]"></div>
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-[#000000]"></div>
                </div>
              </div>
              <div className="py-1">
                <h1 className="text-base md:text-xl font-extrabold text-sudan-green" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {currentLanguage === "ar" ? "وزارة التجارة والصناعة" : "Ministry of Commerce & Industry"}
                </h1>
              </div>
            </button>
          </div>

          {/* Quick Language + Role switcher */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Sovereign Identity Auth Portal Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-sudan-green hover:bg-sudan-green-light text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-transparent"
              title={currentLanguage === "ar" ? "بوابة الهوية الموحدة وتفعيل الحساب" : "Unified Auth & Identity Portal"}
            >
              <Fingerprint className="w-4.5 h-4.5 text-sudan-gold" />
              <span className="hidden sm:inline">
                {currentLanguage === "ar" ? "تسجيل الدخول والتحقق" : "Login & Verify"}
              </span>
            </button>

            {/* Elegant Role Swapper Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#F4F6F5] border border-gray-200 px-2.5 md:px-3 py-1.5 rounded-xl text-xs">
              <span className="text-gray-400 text-[10px] uppercase font-bold hidden md:inline">{currentLanguage === "ar" ? "الصلاحية:" : "Role:"}</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-[#1E293B] outline-none font-bold cursor-pointer"
              >
                <option value={UserRole.BUSINESS_INVESTOR} className="bg-white text-[#1E293B]">{currentLanguage === "ar" ? "مستثمر / مواطن" : "Investor / Citizen"}</option>
                <option value={UserRole.GOVERNMENT_EMPLOYEE} className="bg-white text-[#1E293B]">{currentLanguage === "ar" ? "موظف مراجع" : "Ministry Reviewer"}</option>
                <option value={UserRole.GOVERNMENT_EXECUTIVE} className="bg-white text-[#1E293B]">{currentLanguage === "ar" ? "مدير تنفيذي" : "Executive Admin"}</option>
                <option value={UserRole.GOVERNMENT_MINISTER} className="bg-white text-[#1E293B]">{currentLanguage === "ar" ? "معالي الوزير" : "His Excellency Minister"}</option>
              </select>
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setCurrentLanguage(prev => prev === "ar" ? "en" : "ar")}
              className="bg-white hover:bg-[#F4F6F5] text-sudan-green hover:text-sudan-green-light px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-gray-200 cursor-pointer"
            >
              {currentLanguage === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        
        {/* Mobile Sidebar Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar Left Navigation */}
        <aside 
          className={`bg-white w-64 shrink-0 p-4 space-y-4 fixed md:sticky top-0 md:top-20 bottom-0 h-full md:h-[calc(100vh-80px)] z-40 md:z-20 md:block transition-all duration-300 overflow-y-auto ${
            isSidebarOpen 
              ? "translate-x-0" 
              : currentLanguage === "ar" 
                ? "translate-x-full" 
                : "-translate-x-full"
          } md:translate-x-0 ${currentLanguage === "ar" ? "right-0 border-l border-gray-200 border-r-0" : "left-0"}`}
        >
          {/* Active User Header */}
          <div className="p-3.5 bg-[#F4F6F5] rounded-3xl border border-gray-200 flex items-center gap-3">
            <div className="h-9 w-9 bg-sudan-green text-white rounded-2xl flex items-center justify-center font-black uppercase shadow-xs shrink-0">
              {currentRole[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-extrabold text-xs text-[#1E293B] truncate">{currentProfile.fullName}</h4>
              <p className="text-[9px] text-sudan-gold font-black mt-0.5">{currentRoleObj()[currentLanguage]}</p>
            </div>
          </div>

          {/* Quick Menu Search bar */}
          <div className="relative">
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder={currentLanguage === "ar" ? "بحث في القائمة..." : "Search services..."}
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-[11px] font-bold px-3 py-2 rounded-xl outline-none border border-slate-200 focus:border-sudan-green transition-all"
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            />
            {menuSearch && (
              <button 
                onClick={() => setMenuSearch("")}
                className="absolute inset-y-0 ltr:right-2.5 rtl:left-2.5 my-auto text-gray-400 hover:text-gray-600 text-xs font-bold px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Grouped & Filtered Navigation Links */}
          <div className="space-y-4">
            {[
              {
                id: "citizens-investors",
                labelAr: "بوابات الخدمات والمعاملات",
                labelEn: "Services & Portals",
                items: ["services-center", "commercial", "commercial-names", "corporate-lifecycle", "licensing-platform", "industrial", "importexport", "investment", "consumer", "digital-commerce", "national-superapp", "national-innovation"]
              },
              {
                id: "strategic-command",
                labelAr: "الرقابة والقيادة الاستراتيجية",
                labelEn: "Leadership & Control",
                items: ["national-production-readiness", "national-economic-command", "national-ai-copilot", "national-gis-digitaltwin", "national-economic-gov", "dashboard", "intelligent-gov", "executive-command-center", "bi-platform", "smart-inspection", "autonomous-operations"]
              },
              {
                id: "resource-ops",
                labelAr: "الموارد والعمليات الداخلية",
                labelEn: "Resources & ERP",
                items: ["human-capital", "sovereign-eam", "sovereign-procurement", "gov-records", "legal-affairs"]
              },
              {
                id: "infrastructure-sec",
                labelAr: "الربط والأمن السيبراني",
                labelEn: "Infrastructure & Security",
                items: ["sovereign-grc", "sovereign-soc", "dr-resilience", "integration-hub", "ai-governance", "trust-services", "payment-platform", "architecture", "design-system"]
              }
            ].map((group) => {
              // Filter items inside this group that match the search query
              const groupItems = menuItems.filter(
                (item) =>
                  group.items.includes(item.id) &&
                  (currentLanguage === "ar"
                    ? item.labelAr.toLowerCase().includes(menuSearch.toLowerCase())
                    : item.labelEn.toLowerCase().includes(menuSearch.toLowerCase()))
              );

              if (groupItems.length === 0) return null;

              return (
                <div key={group.id} className="space-y-1">
                  <h5 className="text-[9px] uppercase font-black text-sudan-gold/90 tracking-wider px-2 py-1 bg-slate-50 rounded-lg inline-block w-full" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? group.labelAr : group.labelEn}
                  </h5>
                  <div className="space-y-1">
                    {groupItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeModule === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveModule(item.id);
                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            isActive 
                              ? "bg-sudan-green text-white shadow-xs font-black" 
                              : "text-gray-500 hover:text-sudan-green hover:bg-slate-50"
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-sudan-gold" : "text-gray-400"}`} />
                          <span className="truncate">{currentLanguage === "ar" ? item.labelAr : item.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-[10px] text-gray-400">
            <p className="text-center font-semibold font-mono">SDMCI © 2035</p>
            <p className="text-center leading-normal">
              {currentLanguage === "ar" 
                ? "بوابة مرخصة بموجب اللوائح السيادية لجمهورية السودان لعام 2026." 
                : "Licensed under general sovereignty guidelines of the Republic of Sudan."}
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden min-h-[calc(100vh-80px)]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeModule === "services-center" && (
                <NationalElectronicServicesCenter
                  currentLanguage={currentLanguage}
                  role={currentRole}
                  onNavigateModule={setActiveModule}
                />
              )}

              {activeModule === "dashboard" && (
                <Dashboards
                  currentLanguage={currentLanguage}
                  role={currentRole}
                  companies={companies}
                  factories={factories}
                  licenses={licenses}
                  certificates={certificates}
                  applications={applications}
                  complaints={complaints}
                  onNavigateModule={setActiveModule}
                />
              )}

              {activeModule === "bi-platform" && (
                <SovereignBIPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                  companies={companies}
                  factories={factories}
                  licenses={licenses}
                  certificates={certificates}
                  applications={applications}
                  complaints={complaints}
                />
              )}

              {activeModule === "smart-inspection" && (
                <SmartInspectionPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                  companies={companies}
                  factories={factories}
                  licenses={licenses}
                  certificates={certificates}
                  applications={applications}
                  complaints={complaints}
                />
              )}

              {activeModule === "national-production-readiness" && (
                <NationalProductionReadinessCenter
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "national-economic-command" && (
                <NationalEconomicCommandCenter
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "national-ai-copilot" && (
                <NationalAiCopilotCenter
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "national-gis-digitaltwin" && (
                <NationalGeospatialTwinPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "national-economic-gov" && (
                <NationalDigitalEconomicPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "digital-commerce" && (
                <SovereignDigitalEconomyPlatform
                  currentLanguage={currentLanguage}
                />
              )}

              {activeModule === "commerce-ecosystem" && (
                <SovereignCommerceEcosystemPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "international-trade" && (
                <SovereignTradeIntegrationPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "industrial-development-innovation" && (
                <SovereignIndustrialDevelopmentPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "legislative-governance-policy" && (
                <SovereignLegislativeGovernancePlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "commercial-data-governance" && (
                <SovereignCommercialDataGovernance
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "economic-intelligence-platform" && (
                <SovereignEconomicIntelligencePlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "national-innovation" && (
                <NationalInnovationPlatform
                  currentLanguage={currentLanguage}
                />
              )}

              {activeModule === "commercial-names" && (
                <CommercialNamesModule
                  currentLanguage={currentLanguage}
                  isAdmin={currentRole !== UserRole.BUSINESS_INVESTOR}
                  companies={companies}
                />
              )}

              {activeModule === "commercial" && (
                <CommercialRegistrationModule
                  currentLanguage={currentLanguage}
                  companies={companies}
                  onAddCompany={handleAddCompany}
                  isAdmin={currentRole !== UserRole.BUSINESS_INVESTOR}
                  onUpdateStatus={handleUpdateCompanyStatus}
                />
              )}

              {activeModule === "corporate-lifecycle" && (
                <CorporateLifecycleModule
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "licensing-platform" && (
                <LicensingPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "industrial" && (
                <IndustrialPlatformModule
                  currentLanguage={currentLanguage}
                  factories={factories}
                  onAddFactory={handleAddFactory}
                  isAdmin={currentRole !== UserRole.BUSINESS_INVESTOR}
                  onInspectFactory={handleInspectFactory}
                />
              )}

              {activeModule === "importexport" && (
                <ImportExportModule
                  currentLanguage={currentLanguage}
                  licenses={licenses}
                  certificates={certificates}
                  onAddLicense={handleAddLicense}
                  onAddCertificate={handleAddCertificate}
                  isAdmin={currentRole !== UserRole.BUSINESS_INVESTOR}
                  onUpdateLicenseStatus={handleUpdateLicenseStatus}
                />
              )}

              {activeModule === "investment" && (
                <InvestmentPortalModule
                  currentLanguage={currentLanguage}
                  applications={applications}
                  onAddApplication={handleAddApplication}
                  isAdmin={currentRole !== UserRole.BUSINESS_INVESTOR}
                  onUpdateAppStatus={handleUpdateAppStatus}
                />
              )}

              {activeModule === "consumer" && (
                <ConsumerProtectionModule
                  currentLanguage={currentLanguage}
                  companies={companies}
                  licenses={licenses}
                />
              )}

              {activeModule === "integration-hub" && (
                <NationalIntegrationHub
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "ai-governance" && (
                <SovereignAIGovernancePlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "dr-resilience" && (
                <SovereignDRResiliencePlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "national-superapp" && (
                <SovereignNationalSuperApp
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "trust-services" && (
                <TrustServicesPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "payment-platform" && (
                <GovernmentPaymentPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "architecture" && (
                <EnterpriseArchitecture
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "design-system" && (
                <GovernmentDesignSystem
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "gov-records" && (
                <GovernmentRecordsArchivePlatform
                  currentLanguage={currentLanguage}
                />
              )}

              {activeModule === "legal-affairs" && (
                <SovereignLegalAffairsPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "human-capital" && (
                <SovereignHumanCapitalPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "sovereign-eam" && (
                <SovereignAssetManagementPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "sovereign-procurement" && (
                <SovereignProcurementPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "sovereign-grc" && (
                <SovereignGRCPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "sovereign-soc" && (
                <SovereignSOCPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "executive-command-center" && (
                <SovereignExecutiveCommandCenter
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "autonomous-operations" && (
                <SovereignAutonomousOperationsHub
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}

              {activeModule === "intelligent-gov" && (
                <SovereignIntelligentGovPlatform
                  currentLanguage={currentLanguage}
                  role={currentRole}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Sudan Commerce Floating AI Assistant */}
      <AIChatAssistant 
        currentLanguage={currentLanguage} 
        userProfile={currentProfile} 
      />

      {/* Sovereign unified Login & Registration Portal Modal */}
      <SovereignAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLanguage={currentLanguage}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
      />
    </div>
  );
}
