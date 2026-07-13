/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Cpu, Globe, Landmark, ShieldAlert, 
  Menu, LayoutDashboard, Layers, Palette 
} from "lucide-react";

import { 
  UserRole, CommercialRegistration, FactoryRegistration, 
  ImportExportLicense, CertificateOfOrigin, LandApplication, 
  ConsumerComplaint, ApplicationStatus 
} from "./types";

import AIChatAssistant from "./components/AIChatAssistant";
import CommercialRegistrationModule from "./components/CommercialRegistration";
import IndustrialPlatformModule from "./components/IndustrialPlatform";
import ImportExportModule from "./components/ImportExport";
import InvestmentPortalModule from "./components/InvestmentPortal";
import ConsumerProtectionModule from "./components/ConsumerProtection";
import Dashboards from "./components/Dashboards";
import EnterpriseArchitecture from "./components/EnterpriseArchitecture";
import GovernmentDesignSystem from "./components/GovernmentDesignSystem";

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
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    { id: "dashboard", labelAr: "لوحة المتابعة الرقمية", labelEn: "Sovereign Dashboard", icon: LayoutDashboard },
    { id: "commercial", labelAr: "السجل التجاري الذكي", labelEn: "Commercial Registry", icon: Building2 },
    { id: "industrial", labelAr: "المنصة الصناعية", labelEn: "Industrial Platform", icon: Cpu },
    { id: "importexport", labelAr: "الاستيراد والتصدير", labelEn: "Import & Export", icon: Globe },
    { id: "investment", labelAr: "بوابة الاستثمار والمدن", labelEn: "Investment Lands", icon: Landmark },
    { id: "consumer", labelAr: "حماية المستهلك والرقابة", labelEn: "Consumer Protection", icon: ShieldAlert },
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
      className="min-h-screen bg-[#F4F6F5] flex flex-col font-sans text-[#1A1A1A] selection:bg-sudan-green selection:text-white"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Upper Navigation/Branding Bar */}
      <header className="bg-white text-[#1A1A1A] border-b border-gray-200 sticky top-0 z-30 shadow-sm h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
          {/* Logo / Title Block */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 md:hidden cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-4">
              {/* Emblem Logo Emblem - Sudan Flag Inspired */}
              <div className="w-12 h-12 bg-[#007229] rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-[#005220]/20">
                <div className="w-6 h-4 bg-white relative rounded-sm overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-[#D21034]"></div>
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-[#000000]"></div>
                </div>
              </div>
              <div>
                <h1 className="text-base md:text-lg font-extrabold leading-none text-sudan-green">
                  {currentLanguage === "ar" ? "وزارة التجارة والصناعة" : "Ministry of Commerce & Industry"}
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-1">
                  {currentLanguage === "ar" ? "الخدمات الاتحادية والتحول الرقمي • السودان 2035" : "Federal Service Hub | Sudan 2035"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Language + Role switcher */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Elegant Role Swapper Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#F4F6F5] border border-gray-200 px-2.5 md:px-3 py-1.5 rounded-xl text-xs">
              <span className="text-gray-400 text-[10px] uppercase font-bold hidden md:inline">{currentLanguage === "ar" ? "الصلاحية:" : "Role:"}</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-[#1A1A1A] outline-none font-bold cursor-pointer"
              >
                <option value={UserRole.BUSINESS_INVESTOR} className="bg-white text-[#1A1A1A]">{currentLanguage === "ar" ? "مستثمر / مواطن" : "Investor / Citizen"}</option>
                <option value={UserRole.GOVERNMENT_EMPLOYEE} className="bg-white text-[#1A1A1A]">{currentLanguage === "ar" ? "موظف مراجع" : "Ministry Reviewer"}</option>
                <option value={UserRole.GOVERNMENT_EXECUTIVE} className="bg-white text-[#1A1A1A]">{currentLanguage === "ar" ? "مدير تنفيذي" : "Executive Admin"}</option>
                <option value={UserRole.GOVERNMENT_MINISTER} className="bg-white text-[#1A1A1A]">{currentLanguage === "ar" ? "معالي الوزير" : "His Excellency Minister"}</option>
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
        
        {/* Sidebar Left Navigation */}
        <aside 
          className={`bg-white border-r border-gray-200 w-64 shrink-0 p-5 space-y-4 absolute md:sticky md:top-20 h-[calc(100vh-80px)] z-20 md:block transition-all duration-300 ${
            isSidebarOpen ? "translate-x-0" : currentLanguage === "ar" ? "translate-x-64" : "-translate-x-64"
          } md:translate-x-0 ${currentLanguage === "ar" ? "right-0 border-l border-r-0" : "left-0"}`}
        >
          {/* Active User Header */}
          <div className="p-4 bg-[#F4F6F5] rounded-3xl border border-gray-200 flex items-center gap-3">
            <div className="h-10 w-10 bg-sudan-green text-white rounded-2xl flex items-center justify-center font-bold uppercase shadow-sm">
              {currentRole[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-extrabold text-xs text-[#1A1A1A] truncate">{currentProfile.fullName}</h4>
              <p className="text-[10px] text-sudan-gold font-bold mt-0.5">{currentRoleObj()[currentLanguage]}</p>
            </div>
          </div>

          <div className="pt-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-sudan-green text-white shadow-sm font-extrabold" 
                      : "text-gray-500 hover:text-sudan-green hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-sudan-gold" : "text-gray-400"}`} />
                  <span>{currentLanguage === "ar" ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-2 text-[10px] text-gray-400">
            <p className="text-center font-semibold font-mono">SDMCI © 2035</p>
            <p className="text-center leading-normal">
              {currentLanguage === "ar" 
                ? "بوابة مرخصة بموجب اللوائح السيادية لجمهورية السودان لعام 2026." 
                : "Licensed under general sovereignty guidelines of the Republic of Sudan."}
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-4 md:p-6 overflow-hidden min-h-[calc(100vh-80px)]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
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
                  complaints={complaints}
                  onAddComplaint={handleAddComplaint}
                  isAdmin={currentRole !== UserRole.BUSINESS_INVESTOR}
                  onUpdateComplaintStatus={handleUpdateComplaintStatus}
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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Sudan Commerce Floating AI Assistant */}
      <AIChatAssistant 
        currentLanguage={currentLanguage} 
        userProfile={currentProfile} 
      />
    </div>
  );
}
