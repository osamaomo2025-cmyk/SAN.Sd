/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * National Electronic Services Center (المركز الوطني الموحد للخدمات الإلكترونية)
 * Aligned with Sudan Vision 2035 & Sudanese Electronic Transactions Acts
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Sparkles, Filter, Grid, Compass, Landmark, Shield, 
  HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, Play,
  Download, ThumbsUp, Star, Eye, Scale, FileText, Globe, 
  ArrowLeft, ArrowRight, Layers, Database, Code, RefreshCw, 
  Fingerprint, Clock, Check, Bell, Smartphone, Send, Plus, 
  Trash2, Award, ClipboardList, ShoppingBag, Network, Brain, 
  MapPin, Printer, HelpCircle as HelpIcon, ShieldCheck, FileCheck, Info
} from "lucide-react";
import { UserRole } from "../types";

interface NationalElectronicServicesCenterProps {
  currentLanguage: "ar" | "en";
  role: UserRole;
  onNavigateModule?: (moduleId: string) => void;
}

// Service Interface representing the Unified Services Catalog
interface ServiceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string; // Service Groups
  targetAudience: "citizen" | "business" | "investor" | "manufacturer" | "exporter_importer" | "employee";
  feesAr: string;
  feesEn: string;
  timeAr: string;
  timeEn: string;
  legalBasisAr: string;
  legalBasisEn: string;
  eligibilityAr: string;
  eligibilityEn: string;
  docsAr: string[];
  docsEn: string[];
  stepsAr: string[];
  stepsEn: string[];
  mappedModuleId?: string; // Links to existing functional pages
  isMostUsed?: boolean;
  isNew?: boolean;
  isEmergency?: boolean;
}

export default function NationalElectronicServicesCenter({
  currentLanguage,
  role,
  onNavigateModule
}: NationalElectronicServicesCenterProps) {
  // WCAG Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1); // 1 = 100%, 1.15 = 115%, 1.3 = 130%

  // Navigation / Tab States
  const [activeTab, setActiveTab] = useState<"catalog" | "my-dashboard" | "tracking" | "reports">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Form Submission & Workflow Engine States
  const [activeFormService, setActiveFormService] = useState<ServiceItem | null>(null);
  const [formFields, setFormFields] = useState<Record<string, string>>({
    fullName: "عمر الفاروق أحمد",
    nationalId: "189204829103",
    companyName: "شركة النيل الأزرق للمحاصيل المحدودة",
    commercialNumber: "SD-2026-90412",
    state: "الخرطوم",
    details: ""
  });
  const [formFiles, setFormFiles] = useState<File[]>([]);
  const [isSignatureDone, setIsSignatureDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  // Tracking states
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);

  // Ratings & KPIs State
  const [ratingService, setRatingService] = useState<ServiceItem | null>(null);
  const [ratings, setRatings] = useState({ quality: 5, speed: 5, staff: 5, ease: 5 });
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ministryKPIs, setMinistryKPIs] = useState({
    avgSatisfaction: 4.85,
    processingTimeReduction: "42%",
    totalSubmissionsToday: 1349,
    complianceRate: "99.2%"
  });

  // Favorite Services State
  const [favorites, setFavorites] = useState<string[]>(["corp-reg", "export-lic", "cons-comp"]);

  // Proactive Alerts State
  const [proactiveAlerts, setProactiveAlerts] = useState([
    {
      id: "alert-1",
      titleAr: "تنبيه: شهادة السجل التجاري لشركة النيل تقترب من تاريخ الانتهاء",
      titleEn: "Alert: Commercial Registration for Nile Co. is nearing expiry",
      expiryDate: "2026-08-15",
      type: "renewal",
      serviceId: "corp-reg",
      descAr: "يتعين عليك تقديم التأكيد السنوي قبل 15 أغسطس لتفادي تجميد الحساب التجاري.",
      descEn: "You must submit the annual confirmation before August 15 to avoid business portal suspension."
    },
    {
      id: "alert-2",
      titleAr: "مستندات معلقة: رخصة الاستيراد رقم IMP-2026 بحاجة لشهادة المنشأ",
      titleEn: "Pending Document: Import License IMP-2026 requires Certificate of Origin",
      expiryDate: "2026-07-28",
      type: "documents",
      serviceId: "export-lic",
      descAr: "الرجاء رفع شهادة المنشأ الصادرة من الغرفة التجارية لإتمام الفسح الجمركي ببورتسودان.",
      descEn: "Please upload the Certificate of Origin to complete customs clearance in Port Sudan."
    },
    {
      id: "alert-3",
      titleAr: "طلب تفتيش مجدول: مصنع جياد للأغذية",
      titleEn: "Scheduled Inspection: Giad Food Factory",
      expiryDate: "2026-07-22",
      type: "inspection",
      serviceId: "fac-lic",
      descAr: "تم جدولة موعد التفتيش الصحي السنوي لخطوط الإنتاج يوم الأربعاء القادم الساعة 10 صباحاً.",
      descEn: "Annual health inspection has been scheduled for production lines next Wednesday at 10 AM."
    }
  ]);

  // Unified Services Catalog
  const servicesCatalog: ServiceItem[] = [
    {
      id: "corp-reg",
      nameAr: "تسجيل شركة جديدة (السجل التجاري)",
      nameEn: "Register New Company (Commercial Registry)",
      descriptionAr: "الخدمة الأساسية لتأسيس الشركات وتسجيل رخصها التجارية وتخصيص الرقم التجاري الموحد بجمهورية السودان.",
      descriptionEn: "The core service to incorporate new commercial companies, issue business registry numbers, and activate fiscal certificates in Sudan.",
      category: "registry",
      targetAudience: "business",
      feesAr: "15,000 جنيه سوداني",
      feesEn: "15,000 SDG",
      timeAr: "يوم عمل واحد",
      timeEn: "1 Business Day",
      legalBasisAr: "قانون الشركات السوداني لعام 2015 وتعديلاته لعام 2026.",
      legalBasisEn: "Sudanese Companies Act 2015 and its modern amendments (2026).",
      eligibilityAr: "المواطنون والمستثمرون الأجانب البالغون سن الأهلية القانونية ولهم مقر تجاري مسجل.",
      eligibilityEn: "Citizens and international investors who hold valid physical corporate addresses.",
      docsAr: ["عقد التأسيس والنظام الأساسي", "إثبات الهوية (الرقم الوطني / جواز السفر)", "شهادة حجز الاسم التجاري"],
      docsEn: ["Memorandum of Association & Articles", "Proof of Identity (National ID / Passport)", "Commercial Name Reservation Certificate"],
      stepsAr: ["حجز الاسم التجاري الموحد", "تعبئة بيانات الشركاء والأنشطة وتحديد رأس المال", "دفع الرسوم عبر بوابة الجباية الرقمية", "مراجعة مسجل الشركات وتوقيع المستندات إلكترونياً"],
      stepsEn: ["Reserve unified commercial name", "Fill partners' credentials and capital declarations", "Pay via the secure sovereign billing gateway", "Digital review and electronic signature by Registrar"],
      mappedModuleId: "commercial",
      isMostUsed: true
    },
    {
      id: "name-res",
      nameAr: "حجز اسم تجاري جديد",
      nameEn: "Commercial Name Reservation",
      descriptionAr: "الاستعلام الفوري وحجز الأسماء التجارية للشركات والمؤسسات وضمان عدم تكرارها على المستوى الاتحادي.",
      descriptionEn: "Instantly search, validate, and reserve unique names for business entities across all Sudanese states.",
      category: "registry",
      targetAudience: "business",
      feesAr: "2,000 جنيه سوداني",
      feesEn: "2,000 SDG",
      timeAr: "10 دقائق (إلكتروني بالكامل)",
      timeEn: "10 Minutes (Fully Automated)",
      legalBasisAr: "قانون أسماء الأعمال السوداني لعام 1931 ولائحته التنفيذية.",
      legalBasisEn: "Sudan Business Names Act 1931 and electronic updates.",
      eligibilityAr: "أي مواطن سوداني أو مستثمر معتمد يملك حساباً رقمياً موثقاً.",
      eligibilityEn: "Any citizen or authenticated investor profile holder.",
      docsAr: ["الرقم الوطني للمتقدم", "مقترح الاسم التجاري باللغة العربية والانجليزية"],
      docsEn: ["National Identification card", "Proposed bilingual name proposals"],
      stepsAr: ["البحث الذكي عن الاسم للتأكد من خلوه", "تقديم طلب الحجز مع تحديد الأنشطة", "دفع الرسوم والحصول على وثيقة حجز معتمدة صالحة لـ 60 يوماً"],
      stepsEn: ["Run AI search to ensure vacancy", "Submit reservation with registered business domains", "Sovereign e-payment to download reservation certificate valid for 60 days"],
      mappedModuleId: "commercial-names",
      isMostUsed: true
    },
    {
      id: "lic-renew",
      nameAr: "تجديد رخصة الاستيراد والتصدير",
      nameEn: "Renew Import / Export License",
      descriptionAr: "تجديد تراخيص العمليات التجارية الدولية للشركات السودانية لممارسة التصدير والاستيراد عبر الموانئ القومية.",
      descriptionEn: "Renew trade authorizations to dispatch and source goods globally through sovereign sea/land portals.",
      category: "licensing",
      targetAudience: "exporter_importer",
      feesAr: "25,000 جنيه سوداني سنوياً",
      feesEn: "25,000 SDG Annually",
      timeAr: "ساعتان",
      timeEn: "2 Hours",
      legalBasisAr: "قانون تنظيم الاستيراد والتصدير لجمهورية السودان لعام 2026.",
      legalBasisEn: "Republic of Sudan Trade Regulation and License Acts (2026).",
      eligibilityAr: "الشركات السودانية ذات السجل التجاري المعتمد الخالي من المخالفات.",
      eligibilityEn: "Registered business entities with zero compliance citations in Sudan registries.",
      docsAr: ["صورة السجل التجاري الساري", "الشهادة الضريبية المبرئة للذمة", "شهادة الالتزام بالزكاة القومية"],
      docsEn: ["Valid commercial registry sheet", "Corporate tax clearance certificate", "National Zakat clearance proof"],
      stepsAr: ["اختيار السجل التجاري النشط", "التحقق التلقائي من الربط الضريبي والزكوي الموحد", "دفع رسوم التجديد السيادية", "تحميل الرخصة الرقمية فورياً ببطاقة الرمز السريع QR"],
      stepsEn: ["Select active commercial record", "Interoperability check for tax/zakat compliance", "Submit sovereign e-payments", "Instantly download digital certificate with secure QR codes"],
      mappedModuleId: "importexport",
      isMostUsed: true
    },
    {
      id: "export-lic",
      nameAr: "إصدار شهادة المنشأ الرقمية",
      nameEn: "Issue Digital Certificate of Origin",
      descriptionAr: "إصدار وتصديق شهادة المنشأ الرسمية للمحاصيل والمنتجات السودانية المصدرة للخارج وفق النماذج العالمية والكوميسا.",
      descriptionEn: "Formulate and legally validate regional and COMESA Certificates of Origin for national exports.",
      category: "certificates",
      targetAudience: "exporter_importer",
      feesAr: "5,000 جنيه سوداني",
      feesEn: "5,000 SDG",
      timeAr: "30 دقيقة",
      timeEn: "30 Minutes",
      legalBasisAr: "اتفاقية تنظيم منطقة التجارة الحرة الأفريقية وحكومة الكوميسا الموحدة.",
      legalBasisEn: "AfCFTA and COMESA trade protocols of origin validation.",
      eligibilityAr: "المصدرون الحاصلون على رخصة تصدير سارية.",
      eligibilityEn: "Licensed corporate exporters with valid trade credentials.",
      docsAr: ["الفاتورة التجارية للشحنة", "رخصة التصدير السارية", "تقرير فحص الجودة والمواصفات"],
      docsEn: ["Export commercial invoice", "Valid export license sheet", "Quality and metrology inspection report"],
      stepsAr: ["تعبئة الفاتورة وبلد المقصد والموانئ", "تحديد البند الجمركي وتفاصيل التعبئة والأوزان", "دفع رسوم الشهادة الرقمية", "التوقيع التلقائي بالختم الفيدرالي لوزارة التجارة"],
      stepsEn: ["Fill invoice, destination port, and weights", "Map HS Codes and packaging specifications", "Submit digital payments", "Instant sovereign digital seal stamping"],
      mappedModuleId: "importexport",
      isMostUsed: true
    },
    {
      id: "cons-comp",
      nameAr: "تقديم شكوى حماية المستهلك والأسعار",
      nameEn: "Submit Consumer Protection Complaint",
      descriptionAr: "بوابة المواطنين للإبلاغ الفوري عن حالات الاحتكار، زيادة الأسعار غير القانونية، البضائع الفاسدة أو المغشوشة.",
      descriptionEn: "Citizen gateway to immediately report price-gouging, commercial monopolies, or counterfeit health goods in Sudanese markets.",
      category: "consumer",
      targetAudience: "citizen",
      feesAr: "مجانية بالكامل",
      feesEn: "Fully Free of Charge",
      timeAr: "فوري (الإحالة لفرق الطوارئ خلال 10 دقائق)",
      timeEn: "Instant (Referred to field agents within 10 minutes)",
      legalBasisAr: "قانون حماية المستهلك والمنافسة السوداني لعام 1957 ولائحة التفتيش والإنفاذ لعام 2026.",
      legalBasisEn: "Sudanese Trade Practices and Consumer Protection Act 1957.",
      eligibilityAr: "متاحة لكافة المواطنين والمقيمين والزوار بجمهورية السودان.",
      eligibilityEn: "Open to all general public, citizens, and residents inside Sudan.",
      docsAr: ["صورة للمخالفة أو الفاتورة (إن وجدت)", "موقع المحل أو تفاصيل النشاط"],
      docsEn: ["Visual photo of violation or billing slip", "Store physical coordinates or commercial name"],
      stepsAr: ["تحديد نوع المخالفة والولاية", "إدخال اسم المتجر وتفاصيل البلاغ والشكوى", "إرفاق صور الأدلة والمستندات", "إصدار رقم المعاملة للمتابعة الفورية والتفتيش"],
      stepsEn: ["Select violation category and state", "Provide store branding & details", "Upload visual evidence attachment", "Receive unique secure tracking token for audit tracking"],
      mappedModuleId: "consumer",
      isMostUsed: true
    },
    {
      id: "fac-lic",
      nameAr: "ترخيص تشغيل مصنع جديد",
      nameEn: "Register New Industrial Factory License",
      descriptionAr: "تقديم طلب للحصول على ترخيص التأسيس والتشغيل للمنشآت والمصانع الإنتاجية في القطاعات الهندسية والغذائية والدوائية.",
      descriptionEn: "Acquire federal operation permits for food, pharma, and engineering manufacturing hubs.",
      category: "industrial",
      targetAudience: "manufacturer",
      feesAr: "50,000 جنيه سوداني",
      feesEn: "50,000 SDG",
      timeAr: "3 أيام عمل (شامل التفتيش والربط)",
      timeEn: "3 Business Days (Including inspection and mapping)",
      legalBasisAr: "قانون تنظيم وتنمية الصناعة بجمهورية السودان لعام 2025.",
      legalBasisEn: "Sudan Industrial Development and Regulation Act 2025.",
      eligibilityAr: "رواد الصناعة والمؤسسات التي ينطبق عليها المعيار البيئي والصحي الوطني.",
      eligibilityEn: "Industrialists complying with national safety, environmental, and spatial guidelines.",
      docsAr: ["موافقة وزارة الصحة والبيئة", "الرسم الهندسي للمنشأة", "عقد ملكية أو إيجار الأرض الصناعية"],
      docsEn: ["Environmental and health board approvals", "Facility engineering blueprints", "Property deeds or industrial land lease"],
      stepsAr: ["تعبئة السعة الإنتاجية ونوع الصناعة والمحركات", "تحديد آلية التخلص من النفايات ومصادر الطاقة", "طلب موعد فحص هندسي وبيئي موحد", "تحصيل الموافقة الرقمية بعد الفحص الناجح"],
      stepsEn: ["Submit production output capacity and energy inputs", "Declare safety protocols and ecological waste plans", "Request unified on-site engineering checkup", "Download digital license upon passing verification"],
      mappedModuleId: "industrial",
      isMostUsed: true
    },
    {
      id: "land-app",
      nameAr: "طلب تخصيص أرض صناعية استثمارية",
      nameEn: "Apply for Industrial Investment Land Allocation",
      descriptionAr: "التقديم على الأراضي الصناعية والمساحات المتاحة في المدن والمناطق الاستثمارية الحرة بجمهورية السودان لإنشاء المشاريع التنموية.",
      descriptionEn: "Lease and allocate dedicated zoning plots within federal industrial and free zones across Sudan.",
      category: "investment",
      targetAudience: "investor",
      feesAr: "100,000 جنيه سوداني (رسوم حجز مبدئي مستردة)",
      feesEn: "100,000 SDG (Fully refundable reservation deposits)",
      timeAr: "5 أيام عمل",
      timeEn: "5 Business Days",
      legalBasisAr: "قانون تشجيع الاستثمار السوداني لعام 2021 وتوجيهات الوزير الاتحادي لعام 2026.",
      legalBasisEn: "Sudanese Investment Promotion Act 2021.",
      eligibilityAr: "المستثمرون المحليون والأجانب الحاصلون على ترخيص استثماري مبدئي.",
      eligibilityEn: "Approved domestic or foreign sovereign investment profile holders.",
      docsAr: ["دراسة الجدوى الفنية والاقتصادية المعتمدة", "إثبات المقدرة المالية أو التمويل المصرفي", "السجل التجاري للجهة المستثمرة"],
      docsEn: ["Approved technical feasibility study", "Proof of financial solvency or banking credit lines", "Exporters/Investors Commercial registration sheet"],
      stepsAr: ["اختيار المنطقة الصناعية والمدينة المفضلين", "تحديد مساحة الأرض المطلوبة وطبيعة الإنتاج", "رفع دراسة الجدوى وتعهد الالتزام البيئي", "سداد التأمين المالي وحجز القطعة رقمياً في المخطط الشامل"],
      stepsEn: ["Select preferred industrial zone and plot boundaries", "Fill physical area required and production lines", "Submit feasibility study and environment pledge", "Pay holding deposit to reserve digital plot"],
      mappedModuleId: "investment",
      isNew: true
    },
    {
      id: "ann-confirm",
      nameAr: "التأكيد السنوي للسجلات والشركات",
      nameEn: "Corporate Annual Filing & Confirmation",
      descriptionAr: "تحديث البيانات والجمعيات العمومية السنوية للشركات السودانية لضمان استمرار الحالة النشطة في السجل التجاري القومي.",
      descriptionEn: "Mandatory yearly filing to update shareholder structures, financial returns, and retain 'Active' legal corporate status.",
      category: "registry",
      targetAudience: "business",
      feesAr: "10,000 جنيه سوداني",
      feesEn: "10,000 SDG",
      timeAr: "15 دقيقة (تلقائي بالكامل)",
      timeEn: "15 Minutes (Fully Automated)",
      legalBasisAr: "المادة 121 من قانون الشركات السوداني لعام 2015.",
      legalBasisEn: "Section 121 of the Sudanese Companies Act 2015.",
      eligibilityAr: "جميع مجالس إدارة وملاك الشركات والمؤسسات بالسودان.",
      eligibilityEn: "All corporate administrators and legal counsel representatives in Sudan.",
      docsAr: ["محضر اجتماع الجمعية العمومية السنوي المعتمد", "التقرير المالي السنوي المدقق"],
      docsEn: ["Certified Board Minutes of the Annual AGM", "Audited Financial Balance Sheets"],
      stepsAr: ["التحقق من بيانات الشركاء والمدراء الحاليين", "تأكيد رأس المال والجمعية العمومية للعام الحالي", "رفع القوائم المالية المدققة", "سداد رسوم التأكيد وتنزيل شهادة الاستمرارية"],
      stepsEn: ["Validate current executives and shares mapping", "Confirm AGM meeting dates and capital structure", "Upload audited returns document", "Sovereign checkout to generate active Certificate of Good Standing"],
      mappedModuleId: "corporate-lifecycle",
      isMostUsed: true
    }
  ];

  // Natural Language Search Navigation Function
  const handleSmartSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    const query = searchQuery.toLowerCase();
    
    // AI Intelligent Matcher (mapping key phrases to service IDs)
    let matchedId = "";
    if (query.includes("تجديد") || query.includes("renew")) {
      if (query.includes("رخصة") || query.includes("import") || query.includes("export") || query.includes("استيراد") || query.includes("تصدير")) {
        matchedId = "lic-renew";
      } else if (query.includes("سجل") || query.includes("شركة") || query.includes("تجاري") || query.includes("company") || query.includes("register")) {
        matchedId = "ann-confirm"; // Annual Filing handles renewal
      }
    } else if (query.includes("تسجيل") || query.includes("تأسيس") || query.includes("register") || query.includes("incorporate")) {
      if (query.includes("مصنع") || query.includes("factory") || query.includes("صناعي")) {
        matchedId = "fac-lic";
      } else {
        matchedId = "corp-reg";
      }
    } else if (query.includes("حجز") || query.includes("اسم") || query.includes("reserve") || query.includes("name")) {
      matchedId = "name-res";
    } else if (query.includes("شكوى") || query.includes("بلاغ") || query.includes("حماية") || query.includes("سعر") || query.includes("complaint") || query.includes("consumer") || query.includes("price")) {
      matchedId = "cons-comp";
    } else if (query.includes("منشأ") || query.includes("origin") || query.includes("تصدير") || query.includes("certificate")) {
      matchedId = "export-lic";
    } else if (query.includes("أرض") || query.includes("أراضي") || query.includes("استثمار") || query.includes("land") || query.includes("zone")) {
      matchedId = "land-app";
    }

    if (matchedId) {
      const found = servicesCatalog.find(s => s.id === matchedId);
      if (found) {
        setSelectedService(found);
      }
    }
  };

  // Quick prompt selection triggers Smart AI Search instantly
  const handleQuickPrompt = (prompt: string) => {
    setSearchQuery(prompt);
    // Directly run matching logic
    const query = prompt.toLowerCase();
    let matchedId = "";
    if (query.includes("تجديد") || query.includes("renew")) {
      if (query.includes("رخصة") || query.includes("import") || query.includes("export") || query.includes("استيراد") || query.includes("تصدير")) {
        matchedId = "lic-renew";
      } else if (query.includes("سجل") || query.includes("شركة") || query.includes("تجاري") || query.includes("company") || query.includes("register")) {
        matchedId = "ann-confirm";
      }
    } else if (query.includes("تسجيل") || query.includes("تأسيس") || query.includes("register") || query.includes("incorporate")) {
      if (query.includes("مصنع") || query.includes("factory") || query.includes("صناعي")) {
        matchedId = "fac-lic";
      } else {
        matchedId = "corp-reg";
      }
    } else if (query.includes("حجز") || query.includes("اسم") || query.includes("reserve") || query.includes("name")) {
      matchedId = "name-res";
    } else if (query.includes("شكوى") || query.includes("بلاغ") || query.includes("حماية") || query.includes("سعر") || query.includes("complaint") || query.includes("consumer") || query.includes("price")) {
      matchedId = "cons-comp";
    } else if (query.includes("منشأ") || query.includes("origin") || query.includes("تصدير") || query.includes("certificate")) {
      matchedId = "export-lic";
    } else if (query.includes("أرض") || query.includes("أراضي") || query.includes("استثمار") || query.includes("land") || query.includes("zone")) {
      matchedId = "land-app";
    }

    if (matchedId) {
      const found = servicesCatalog.find(s => s.id === matchedId);
      if (found) {
        setSelectedService(found);
      }
    }
  };

  // Toggle favorites helper
  const handleToggleFavorite = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter(id => id !== serviceId));
    } else {
      setFavorites([...favorites, serviceId]);
    }
  };

  // Electronic Form submit simulator
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFormService) return;

    setIsSubmitting(true);
    
    // Simulate smart validation and digital signing flow
    setTimeout(() => {
      const trackingNum = `SD-SRV-${Math.floor(100000 + Math.random() * 900000)}`;
      const requestObject = {
        trackingNumber: trackingNum,
        serviceId: activeFormService.id,
        serviceNameAr: activeFormService.nameAr,
        serviceNameEn: activeFormService.nameEn,
        submittedAt: new Date().toLocaleDateString("ar-EG"),
        status: "under_review",
        step: 1,
        applicant: formFields.fullName,
        nationalId: formFields.nationalId,
        feePaid: activeFormService.feesAr,
        assignedDept: currentLanguage === "ar" ? "الإدارة العامة للتحول الرقمي والسجل" : "General Administration of Digital Registries",
        estimatedCompletion: currentLanguage === "ar" ? "غداً الساعة 2 ظهراً" : "Tomorrow at 2 PM",
        timeline: [
          { stage: "تقديم الطلب والتحقق", status: "completed", date: "الآن" },
          { stage: "المطابقة المدنية مع السجل المدني الفيدرالي", status: "completed", date: "الآن" },
          { stage: "المراجعة الفنية ودراسة المرفقات القانونية", status: "pending", date: "جاري العمل" },
          { stage: "التوقيع وإصدار المحرر الرقمي السيادي", status: "pending", date: "معلق" }
        ]
      };

      setSubmittedRequest(requestObject);
      setTrackingResult(requestObject);
      setIsSubmitting(false);
      setActiveFormService(null);
      // Add as recently processed
      setMinistryKPIs(prev => ({
        ...prev,
        totalSubmissionsToday: prev.totalSubmissionsToday + 1
      }));
      // Switch to tracking tab automatically to view process live
      setActiveTab("tracking");
    }, 2000);
  };

  // Tracking engine simulator
  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumberInput) return;

    // Search existing mock submissions or build a random responsive tracking response
    if (submittedRequest && trackingNumberInput.trim() === submittedRequest.trackingNumber) {
      setTrackingResult(submittedRequest);
    } else {
      // Simulate real-time lookup for any tracking ID
      setTrackingResult({
        trackingNumber: trackingNumberInput.toUpperCase(),
        serviceId: "corp-reg",
        serviceNameAr: "تحديث السجل وتغيير الشركاء",
        serviceNameEn: "Commercial Registry - Shareholder Amendment",
        submittedAt: "2026-07-16",
        status: "pending_inspection",
        step: 2,
        applicant: "مجموعة البشير للتجارة",
        feePaid: "15,000 SDG",
        assignedDept: currentLanguage === "ar" ? "إدارة الرقابة والتفتيش الصناعي والخدمي" : "Industrial & Commercial Inspection Board",
        estimatedCompletion: currentLanguage === "ar" ? "في غضون 48 ساعة" : "Within 48 hours",
        timeline: [
          { stage: "تقديم الطلب والتحقق", status: "completed", date: "2026-07-16" },
          { stage: "المراجعة القانونية للأوراق الثبوتية وعقود التأسيس", status: "completed", date: "2026-07-17" },
          { stage: "تفتيش الموقع للتأكد من المطابقة والاشتراطات", status: "pending", date: "الزيارة مجدولة اليوم" },
          { stage: "التصديق الرقمي النهائي وإرسال الرمز المعتمد", status: "pending", date: "معلق" }
        ]
      });
    }
  };

  // Star Ratings Handler
  const submitRating = (e: React.FormEvent) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setTimeout(() => {
      setRatingSubmitted(false);
      setRatingService(null);
      setRatings({ quality: 5, speed: 5, staff: 5, ease: 5 });
      setRatingComment("");
    }, 2500);
  };

  // Filtering Logic
  const filteredServices = servicesCatalog.filter(service => {
    const matchesSearch = 
      service.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAudience = selectedAudience === "all" || service.targetAudience === selectedAudience;
    const matchesGroup = selectedGroup === "all" || service.category === selectedGroup;

    return matchesSearch && matchesAudience && matchesGroup;
  });

  return (
    <div 
      className={`space-y-6 ${highContrast ? "bg-[#0F172A] text-white" : "text-[#1E293B]"}`} 
      id="unified-electronic-services-center"
      style={{ fontSize: `${fontSizeMultiplier}rem` }}
    >
      
      {/* 1. TOP ACCESS PANEL (WCAG 2.2 Accessibility toolbar + Title) */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-sudan-green text-white rounded-2xl flex items-center justify-center border border-emerald-700/20 shadow-xs">
            <Compass className="w-6 h-6 text-sudan-gold" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800" style={{ fontFamily: "Cairo, sans-serif" }}>
              {currentLanguage === "ar" ? "المركز الوطني الموحد للخدمات الإلكترونية" : "National Electronic Services Center"}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              {currentLanguage === "ar" ? "بوابة الخدمات السيادية والربط المالي والفيدرالي الموحد" : "Unified Sovereign Digital Gate & Interoperability Center"}
            </p>
          </div>
        </div>

        {/* Accessibility Buttons (WCAG 2.2 Compliant) */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-gray-400 hidden lg:inline">{currentLanguage === "ar" ? "أدوات إمكانية الوصول (WCAG 2.2):" : "WCAG Assistive Tools:"}</span>
          
          {/* Font Resize Trigger */}
          <button
            onClick={() => setFontSizeMultiplier(prev => prev === 1 ? 1.15 : prev === 1.15 ? 1.3 : 1)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
            title="تغيير حجم الخط"
          >
            A+ {fontSizeMultiplier > 1 ? `(${Math.round(fontSizeMultiplier * 100)}%)` : ""}
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-3 py-1.5 rounded-lg transition-all ${highContrast ? "bg-[#C5A059] text-slate-900" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
            title="تباين عالي للرؤية"
          >
            {currentLanguage === "ar" ? "تباين عالٍ" : "High Contrast"}
          </button>
        </div>
      </div>

      {/* 2. LIVE SOVEREIGN COUNTERS (MINISTRY KPIS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#EBFDF2] border border-emerald-100 p-4 rounded-3xl text-center space-y-1">
          <span className="text-[10px] text-emerald-800 font-black block uppercase tracking-wide">
            {currentLanguage === "ar" ? "معدل الرضا القومي عن الخدمات" : "Sovereign Customer Satisfaction"}
          </span>
          <p className="text-xl font-black text-sudan-green font-mono flex items-center justify-center gap-1">
            <Star className="w-5 h-5 text-sudan-gold fill-sudan-gold" />
            <span>{ministryKPIs.avgSatisfaction} / 5</span>
          </p>
        </div>
        <div className="bg-[#FEF9EC] border border-amber-100 p-4 rounded-3xl text-center space-y-1">
          <span className="text-[10px] text-amber-800 font-black block uppercase tracking-wide">
            {currentLanguage === "ar" ? "تقليص زمن إنجاز المعاملات" : "Processing Delay Reduction"}
          </span>
          <p className="text-xl font-black text-[#C5A059] font-mono">{ministryKPIs.processingTimeReduction}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-3xl text-center space-y-1 text-white border border-slate-800">
          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wide">
            {currentLanguage === "ar" ? "إجمالي المعاملات المنجزة اليوم" : "Total e-Requests Logged Today"}
          </span>
          <p className="text-xl font-black text-emerald-400 font-mono">{ministryKPIs.totalSubmissionsToday}</p>
        </div>
        <div className="bg-slate-50 border border-gray-200 p-4 rounded-3xl text-center space-y-1">
          <span className="text-[10px] text-gray-500 font-black block uppercase tracking-wide">
            {currentLanguage === "ar" ? "معدل الالتزام والامتثال للتشريعات" : "National Legislative Compliance"}
          </span>
          <p className="text-xl font-black text-slate-800 font-mono">{ministryKPIs.complianceRate}</p>
        </div>
      </div>

      {/* 3. CENTER WORKSPACE TABS */}
      <div className="flex border-b border-gray-200 bg-white rounded-3xl overflow-hidden p-1 gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "catalog" ? "bg-sudan-green text-white shadow-xs font-black" : "text-gray-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <Grid className="w-4 h-4 text-sudan-gold" />
          <span>{currentLanguage === "ar" ? "دليل الخدمات الموحد" : "Sovereign Services Catalog"}</span>
        </button>
        <button
          onClick={() => setActiveTab("my-dashboard")}
          className={`flex-1 py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "my-dashboard" ? "bg-sudan-green text-white shadow-xs font-black" : "text-gray-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <Smartphone className="w-4 h-4 text-sudan-gold" />
          <span>{currentLanguage === "ar" ? "المحفظة والبروفايل المعتمد" : "My Smart Dashboard & Wallet"}</span>
        </button>
        <button
          onClick={() => setActiveTab("tracking")}
          className={`flex-1 py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "tracking" ? "bg-sudan-green text-white shadow-xs font-black" : "text-gray-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4 text-sudan-gold" />
          <span>{currentLanguage === "ar" ? "تتبع المعاملات الفيدرالية" : "Live Service Tracking"}</span>
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex-1 py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "reports" ? "bg-sudan-green text-white shadow-xs font-black" : "text-gray-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4 text-sudan-gold" />
          <span>{currentLanguage === "ar" ? "التقرير الرئيسي وخطة التنفيذ" : "Sovereign Implementation Report"}</span>
        </button>
      </div>

      {/* 4. TABBED CONTENT ROUTER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          
          {/* 4.1 CATALOG TAB */}
          {activeTab === "catalog" && (
            <div className="space-y-6">

              {/* Proactive Push Alerts (License renewal, file actions, etc.) */}
              <div className="bg-[#FEF9EC] border border-amber-200/60 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <Bell className="w-5 h-5 text-sudan-gold animate-bounce" />
                  <h3 className="text-xs font-black" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "تنبيهات استباقية ذكية من محرك القوانين والالتزام" : "Smart Proactive Compliance Alerts"}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {proactiveAlerts.map(alert => (
                    <div key={alert.id} className="bg-white p-4 rounded-2xl border border-amber-100 flex flex-col justify-between hover:shadow-xs transition-all">
                      <div className="space-y-1.5">
                        <span className="bg-amber-50 text-amber-800 text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase">
                          {alert.type}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-800 leading-normal">
                          {currentLanguage === "ar" ? alert.titleAr : alert.titleEn}
                        </h4>
                        <p className="text-[10.5px] text-gray-500 leading-relaxed">
                          {currentLanguage === "ar" ? alert.descAr : alert.descEn}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-[10.5px]">
                        <span className="text-gray-400 font-mono">
                          {currentLanguage === "ar" ? `مستحق: ${alert.expiryDate}` : `Due: ${alert.expiryDate}`}
                        </span>
                        <button
                          onClick={() => {
                            const found = servicesCatalog.find(s => s.id === alert.serviceId);
                            if (found) {
                              setSelectedService(found);
                            }
                          }}
                          className="text-sudan-green hover:text-sudan-green-light font-black hover:underline flex items-center gap-0.5"
                        >
                          <span>{currentLanguage === "ar" ? "معالجة الآن" : "Resolve"}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global AI Intelligent & Dynamic Natural Language Search Panel */}
              <div className="bg-gradient-to-r from-slate-900 to-[#0C321E] p-8 rounded-3xl border border-emerald-800/30 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sudan-green/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sudan-gold/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
                  <span className="bg-sudan-gold/15 text-sudan-gold border border-sudan-gold/30 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentLanguage === "ar" ? "المنظومة القومية للبحث الذكي والربط البيني" : "AI Natural Language Sovereign Search Engine"}</span>
                  </span>
                  
                  <h3 className="text-lg md:text-2xl font-black text-white" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "ما هي المعاملة التي ترغب بإنجازها اليوم؟" : "Which Sovereign Transaction can we help you complete today?"}
                  </h3>
                  
                  <p className="text-xs text-emerald-100">
                    {currentLanguage === "ar" 
                      ? "اكتب بلغتك الطبيعية، وسيقوم المحرك الذكي بنقلك تلقائياً للخدمة والاستمارة المخصصة."
                      : "Type naturally in English or Arabic, and our system maps your request to the exact regulatory form."}
                  </p>

                  <form onSubmit={handleSmartSearch} className="relative pt-2">
                    <Search className="absolute left-4 top-5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: 'أريد تجديد رخصة الاستيراد' أو 'تسجيل شركة جديدة'" : "e.g., 'I want to reserve a new commercial name' or 'register food factory'"}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sudan-gold focus:bg-white focus:text-slate-800 transition-all font-bold"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-3.5 bg-sudan-gold hover:bg-sudan-gold-light text-slate-950 text-xs font-black px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      {currentLanguage === "ar" ? "استعلام ذكي" : "AI Search"}
                    </button>
                  </form>

                  {/* AI Quick Prompt Recommendations */}
                  <div className="flex flex-wrap justify-center gap-2 pt-2 text-[10.5px]">
                    <span className="text-emerald-200 mt-1.5">{currentLanguage === "ar" ? "اقتراحات البحث السريع:" : "Quick Prompt Suggestions:"}</span>
                    <button 
                      onClick={() => handleQuickPrompt(currentLanguage === "ar" ? "أريد تجديد رخصة الاستيراد" : "I want to renew import export license")} 
                      className="bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full text-emerald-100 font-bold transition-all"
                    >
                      {currentLanguage === "ar" ? "تجديد رخصة الاستيراد والتصدير 🔄" : "Renew Import/Export License 🔄"}
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt(currentLanguage === "ar" ? "تسجيل مصنع صناعي جديد" : "incorporate new factory license")} 
                      className="bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full text-emerald-100 font-bold transition-all"
                    >
                      {currentLanguage === "ar" ? "تأسيس مصنع وطني 🏭" : "Register Factory 🏭"}
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt(currentLanguage === "ar" ? "بلاغ حماية المستهلك زيادة أسعار" : "consumer protection complaint price gouging")} 
                      className="bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full text-emerald-100 font-bold transition-all"
                    >
                      {currentLanguage === "ar" ? "الإبلاغ عن التلاعب بالأسعار ⚖" : "Report Price Gouging ⚖"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Classification (Target Audience) Filters */}
              <div className="bg-white p-4 rounded-3xl border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap gap-1 text-xs font-bold">
                  <button
                    onClick={() => setSelectedAudience("all")}
                    className={`px-3.5 py-2 rounded-xl transition-all ${selectedAudience === "all" ? "bg-sudan-green text-white" : "bg-slate-50 text-gray-500 hover:text-slate-800"}`}
                  >
                    {currentLanguage === "ar" ? "جميع الخدمات" : "All Audiences"}
                  </button>
                  <button
                    onClick={() => setSelectedAudience("citizen")}
                    className={`px-3.5 py-2 rounded-xl transition-all ${selectedAudience === "citizen" ? "bg-sudan-green text-white" : "bg-slate-50 text-gray-500 hover:text-slate-800"}`}
                  >
                    {currentLanguage === "ar" ? "المواطنون والمستهلكون" : "Citizens"}
                  </button>
                  <button
                    onClick={() => setSelectedAudience("business")}
                    className={`px-3.5 py-2 rounded-xl transition-all ${selectedAudience === "business" ? "bg-sudan-green text-white" : "bg-slate-50 text-gray-500 hover:text-slate-800"}`}
                  >
                    {currentLanguage === "ar" ? "أصحاب الأعمال" : "Business Owners"}
                  </button>
                  <button
                    onClick={() => setSelectedAudience("investor")}
                    className={`px-3.5 py-2 rounded-xl transition-all ${selectedAudience === "investor" ? "bg-sudan-green text-white" : "bg-slate-50 text-gray-500 hover:text-slate-800"}`}
                  >
                    {currentLanguage === "ar" ? "المستثمرون" : "Investors"}
                  </button>
                  <button
                    onClick={() => setSelectedAudience("manufacturer")}
                    className={`px-3.5 py-2 rounded-xl transition-all ${selectedAudience === "manufacturer" ? "bg-sudan-green text-white" : "bg-slate-50 text-gray-500 hover:text-slate-800"}`}
                  >
                    {currentLanguage === "ar" ? "المصانع والمنتجون" : "Manufacturers"}
                  </button>
                  <button
                    onClick={() => setSelectedAudience("exporter_importer")}
                    className={`px-3.5 py-2 rounded-xl transition-all ${selectedAudience === "exporter_importer" ? "bg-sudan-green text-white" : "bg-slate-50 text-gray-500 hover:text-slate-800"}`}
                  >
                    {currentLanguage === "ar" ? "المصدرون والمستوردون" : "Exporters & Importers"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "المجموعة الوزارية:" : "Service Group:"}</span>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="bg-[#F4F6F5] border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="all">{currentLanguage === "ar" ? "جميع الفئات" : "All Groups"}</option>
                    <option value="registry">{currentLanguage === "ar" ? "السجل التجاري وأسماء الأعمال" : "Commercial Registry"}</option>
                    <option value="licensing">{currentLanguage === "ar" ? "التراخيص والتجارة الخارجية" : "Digital Licensing"}</option>
                    <option value="certificates">{currentLanguage === "ar" ? "الشهادات الفيدرالية والمنشأ" : "Digital Certificates"}</option>
                    <option value="consumer">{currentLanguage === "ar" ? "حماية المستهلك ورقابة الأسواق" : "Consumer Protection"}</option>
                    <option value="industrial">{currentLanguage === "ar" ? "التنمية والترخيص الصناعي" : "Industrial Development"}</option>
                    <option value="investment">{currentLanguage === "ar" ? "بوابة الاستثمار والمدن" : "Investment Services"}</option>
                  </select>
                </div>
              </div>

              {/* Service Cards Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => {
                  const isFav = favorites.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="bg-white border border-gray-200 rounded-3xl p-5 hover:border-sudan-green hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`text-[8.5px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            service.category === "registry" ? "bg-emerald-50 text-sudan-green border-emerald-100" :
                            service.category === "licensing" ? "bg-sky-50 text-sky-800 border-sky-100" :
                            service.category === "certificates" ? "bg-purple-50 text-purple-800 border-purple-100" :
                            service.category === "consumer" ? "bg-rose-50 text-sudan-red border-rose-100" :
                            "bg-amber-50 text-amber-800 border-amber-100"
                          }`}>
                            {service.category.toUpperCase()}
                          </span>
                          
                          {/* Favorite toggle button */}
                          <button
                            onClick={(e) => handleToggleFavorite(service.id, e)}
                            className="text-gray-300 hover:text-amber-500 transition-all p-1"
                          >
                            <Star className={`w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : ""}`} />
                          </button>
                        </div>

                        <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-sudan-green transition-all" style={{ fontFamily: "Cairo, sans-serif" }}>
                          {currentLanguage === "ar" ? service.nameAr : service.nameEn}
                        </h4>

                        <p className="text-[11.5px] text-gray-500 leading-relaxed line-clamp-3">
                          {currentLanguage === "ar" ? service.descriptionAr : service.descriptionEn}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-semibold text-gray-400">
                        <div>
                          <p>{currentLanguage === "ar" ? "الرسوم:" : "Fees:"} <span className="text-slate-800 font-extrabold">{currentLanguage === "ar" ? service.feesAr : service.feesEn}</span></p>
                        </div>
                        <div className="text-left">
                          <p>{currentLanguage === "ar" ? "المدة:" : "Time:"} <span className="text-slate-800 font-extrabold">{currentLanguage === "ar" ? service.timeAr : service.timeEn}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* If empty filtered results */}
              {filteredServices.length === 0 && (
                <div className="bg-slate-50 border border-gray-200 p-8 rounded-3xl text-center space-y-3">
                  <AlertTriangle className="w-10 h-10 text-sudan-gold mx-auto" />
                  <h4 className="font-extrabold text-xs">{currentLanguage === "ar" ? "عذراً، لم نعثر على أي خدمة مطابقة" : "No matching electronic services found"}</h4>
                  <p className="text-[11px] text-gray-500">{currentLanguage === "ar" ? "يرجى تعديل مصطلحات البحث أو اختيار فئات مستهدفة مختلفة." : "Please check your search filters or try search term variations."}</p>
                </div>
              )}
            </div>
          )}

          {/* 4.2 MY DASHBOARD / WALLET TAB */}
          {activeTab === "my-dashboard" && (
            <div className="space-y-6">
              
              {/* Wallet and Sovereign Profile Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Digital Wallet Component */}
                <div className="bg-gradient-to-br from-slate-900 via-[#133F27] to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/30 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-sudan-green/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <p className="text-[10px] text-emerald-200 uppercase font-black tracking-widest">
                        {currentLanguage === "ar" ? "المحفظة الرقمية الحكومية الموحدة" : "Sovereign Digital Trade Wallet"}
                      </p>
                      <h4 className="text-lg font-black text-white" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "جمهورية السودان" : "Republic of Sudan"}
                      </h4>
                    </div>
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                      <Fingerprint className="w-6 h-6 text-sudan-gold" />
                    </div>
                  </div>

                  <div className="relative z-10 pt-4">
                    <p className="text-[10px] text-emerald-200 uppercase font-bold">{currentLanguage === "ar" ? "الرصيد المتاح للسداد والجمارك" : "Available Balance (Sovereign Fees/Customs)"}</p>
                    <p className="text-3xl font-black font-mono tracking-wide text-sudan-gold">
                      782,450.00 <span className="text-xs">{currentLanguage === "ar" ? "جنيه سوداني" : "SDG"}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/10 pt-4 mt-4 relative z-10">
                    <div>
                      <p className="text-gray-400">HOLDER SIGNATURE ID</p>
                      <p className="text-emerald-300">SD-SSO-9018482</p>
                    </div>
                    <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      {currentLanguage === "ar" ? "بروفايل معتمد" : "Verified Profile"}
                    </span>
                  </div>
                </div>

                {/* Profile detail cards */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider" style={{ fontFamily: "Cairo, sans-serif" }}>
                      {currentLanguage === "ar" ? "البيانات المسجلة في السجل الفيدرالي الموحد" : "Federal Unified Identity Registry Data"}
                    </h3>
                    <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-gray-500">
                      ID: 189204829103
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-400 font-bold block">{currentLanguage === "ar" ? "الاسم الكامل (مطابق للسجل المدني):" : "Full Name:"}</span>
                      <p className="font-extrabold text-slate-800">عمر الفاروق أحمد</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 font-bold block">{currentLanguage === "ar" ? "البريد الإلكتروني المعتمد:" : "Verified Corporate Email:"}</span>
                      <p className="font-extrabold text-slate-800">omar.farouk@sudanagro.sd</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 font-bold block">{currentLanguage === "ar" ? "الرقم الوطني السوداني:" : "Sudanese National ID:"}</span>
                      <p className="font-extrabold text-slate-800 font-mono">189204829103</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 font-bold block">{currentLanguage === "ar" ? "الولاية / المدينة:" : "Residential State / City:"}</span>
                      <p className="font-extrabold text-slate-800">الخرطوم • الخرطوم بحري</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl flex gap-3">
                    <div className="h-8 w-8 bg-sudan-green text-white rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5 text-sudan-gold" />
                    </div>
                    <div className="space-y-0.5 text-emerald-900 text-[11px] leading-relaxed">
                      <p className="font-extrabold">{currentLanguage === "ar" ? "حالة الهوية: نشطة ومطابقة للسجل الفيدرالي لجمهورية السودان" : "Sovereign Status: Active & Synced with Civil Registry"}</p>
                      <p>{currentLanguage === "ar" ? "يمكنك استخدام حسابك الموحد للتوقيع الرقمي على كافة عقود التأسيس والرخص واستحقاقات الاستيراد والتصدير مباشرة." : "Your digital identity token permits immediate automated electronic signature of corporate certificates and trade permits."}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Saved Drafts and Favorite Services Block */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Active e-Services Requests */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "المعاملات النشطة والطلبات السابقة" : "Active Service Transactions & Requests"}
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 flex justify-between items-center">
                      <div>
                        <span className="bg-emerald-100 text-sudan-green text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          {currentLanguage === "ar" ? "جاري المراجعة القانونية" : "Under Review"}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-800 mt-1">تجديد رخصة الاستيراد والتصدير</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">SD-SRV-901843 • 2026-07-16</p>
                      </div>
                      <button
                        onClick={() => {
                          setTrackingNumberInput("SD-SRV-901843");
                          setActiveTab("tracking");
                        }}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-black px-3 py-1.5 rounded-xl transition-all"
                      >
                        {currentLanguage === "ar" ? "تتبع الآن" : "Track"}
                      </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 flex justify-between items-center">
                      <div>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          {currentLanguage === "ar" ? "زيارة التفتيش مجدولة" : "Inspection Scheduled"}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-800 mt-1">ترخيص تشغيل مصنع جديد</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">SD-SRV-442190 • 2026-07-15</p>
                      </div>
                      <button
                        onClick={() => {
                          setTrackingNumberInput("SD-SRV-442190");
                          setActiveTab("tracking");
                        }}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-black px-3 py-1.5 rounded-xl transition-all"
                      >
                        {currentLanguage === "ar" ? "تتبع الآن" : "Track"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Favorite Services Shortcut */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "الخدمات المفضلة والاختصارات السريعة" : "Favorite Services & Quick Actions"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {favorites.map(favId => {
                      const service = servicesCatalog.find(s => s.id === favId);
                      if (!service) return null;
                      return (
                        <div
                          key={favId}
                          onClick={() => setSelectedService(service)}
                          className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-gray-150 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800">{currentLanguage === "ar" ? service.nameAr : service.nameEn}</h4>
                            <p className="text-[9px] text-gray-400 uppercase mt-0.5 font-bold">{service.category}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 4.3 LIVE SERVICE TRACKING TAB */}
          {activeTab === "tracking" && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 max-w-2xl mx-auto">
                <div className="space-y-1 text-center">
                  <h3 className="text-base font-extrabold text-slate-800" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "منظومة تتبع المعاملات والرخص الفيدرالية" : "Sovereign Transaction Tracking Console"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {currentLanguage === "ar" 
                      ? "أدخل رقم المعاملة المكون من 10 خانات لتتبع مراحل الموافقة والتوقيع الرقمي السيادي." 
                      : "Input the 10-character tracking ID to evaluate current review milestones and AI predictions."}
                  </p>
                </div>

                <form onSubmit={handleTrackSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "مثال: SD-SRV-901843" : "e.g., SD-SRV-901843"}
                    className="flex-1 bg-[#F8FAFC] border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-sudan-green"
                  />
                  <button
                    type="submit"
                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    {currentLanguage === "ar" ? "بحث وتتبع" : "Query Status"}
                  </button>
                </form>

                {/* If tracking result exists */}
                {trackingResult ? (
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex justify-between items-start bg-slate-50 p-4 rounded-2xl border border-gray-150">
                      <div className="space-y-1">
                        <p className="text-[9.5px] text-gray-400 font-bold uppercase">{currentLanguage === "ar" ? "اسم الخدمة:" : "SERVICE:"}</p>
                        <h4 className="text-xs font-black text-slate-800">
                          {currentLanguage === "ar" ? trackingResult.serviceNameAr : trackingResult.serviceNameEn}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {currentLanguage === "ar" ? "المتقدم:" : "Applicant:"} {trackingResult.applicant}
                        </p>
                      </div>
                      <div className="text-left font-mono">
                        <p className="text-[9.5px] text-gray-400 font-bold">TRACKING ID</p>
                        <p className="text-xs font-black text-sudan-green">{trackingResult.trackingNumber}</p>
                      </div>
                    </div>

                    {/* Timeline Stages */}
                    <div className="space-y-4 pl-4 pr-4">
                      <p className="text-[10.5px] font-black text-gray-400 uppercase tracking-wider">{currentLanguage === "ar" ? "خطوات سير المعاملة الرقمية:" : "MILITARY SPEC PROGRESS:"}</p>
                      
                      <div className="relative border-l-2 border-gray-200 space-y-6 pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-6">
                        {trackingResult.timeline.map((item: any, idx: number) => {
                          const isDone = item.status === "completed";
                          return (
                            <div key={idx} className="relative">
                              <span className={`absolute -left-[31px] rtl:-right-[31px] top-0 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                isDone ? "bg-sudan-green border-sudan-green text-white" : "bg-white border-gray-300"
                              }`}>
                                {isDone && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-extrabold text-slate-800">{item.stage}</h5>
                                <p className="text-[10px] text-gray-400">{item.date}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Status Prediction */}
                    <div className="bg-[#EBFDF2] border border-emerald-150 p-4 rounded-2xl flex gap-3">
                      <div className="h-8 w-8 bg-sudan-green text-white rounded-lg flex items-center justify-center shrink-0">
                        <Brain className="w-4.5 h-4.5 text-sudan-gold" />
                      </div>
                      <div className="space-y-0.5 text-emerald-900 text-[11px] leading-relaxed">
                        <p className="font-extrabold">{currentLanguage === "ar" ? "الذكاء الاصطناعي السيادي: توقع حالة المعاملة" : "Sovereign AI Status & Resolution Predictor"}</p>
                        <p>
                          {currentLanguage === "ar" 
                            ? "استناداً لمطابقة البيانات والمرفقات الكاملة بنسبة 100%، يتوقع النظام إصدار شهادتك الرسمية والتوقيع عليها رقمياً غداً الساعة 2 ظهراً." 
                            : "Based on historical registry benchmarks, there is a 99.4% probability of successful dispatch in 1.2 business days."}
                        </p>
                      </div>
                    </div>

                    {/* Action to trigger Service Ratings */}
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => {
                          const s = servicesCatalog.find(itm => itm.id === trackingResult.serviceId);
                          if (s) {
                            setRatingService(s);
                          }
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                      >
                        {currentLanguage === "ar" ? "القيام بتقييم جودة الخدمة وتقديم الملاحظات" : "Submit Service Quality Feedback"}
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-50 border border-gray-150 p-6 rounded-2xl text-center text-gray-500 text-xs">
                    {currentLanguage === "ar" ? "أدخل رقم تتبع ساري المفعول للبدء" : "No active query. Input a tracking ID above."}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 4.4 SYSTEM REPORT / DOCUMENTATION TAB */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              
              {/* Grand System Deliverables Accordion / Report Panels */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                
                <div className="space-y-1.5 pb-4 border-b border-gray-100 text-center">
                  <span className="bg-sudan-gold/15 text-sudan-gold border border-sudan-gold/30 text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest inline-flex">
                    {currentLanguage === "ar" ? "وثيقة معتمدة وموجهة لسيادة الوزير والجمهور" : "Sovereign Architectural Blueprint & Implementation Guide"}
                  </span>
                  <h3 className="text-base md:text-xl font-black text-slate-900" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {currentLanguage === "ar" ? "تقرير المخطط الاتحادي الرئيسي للمركز الوطني للخدمات الإلكترونية" : "Master National Electronic Services Implementation Report"}
                  </h3>
                  <p className="text-[10.5px] text-gray-400 font-bold uppercase tracking-wider">
                    Ministry of Commerce & Industry • Digital Government Transformation Framework 2035
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Part 1: National Architecture */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sudan-green">
                      <Layers className="w-5 h-5 text-sudan-gold" />
                      <h4 className="text-sm font-black" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "1. هندسة معمارية بوابة الخدمات الوطنية الموحدة" : "1. National Electronic Services Portal Architecture"}
                      </h4>
                    </div>
                    <p className="text-[11.5px] text-gray-600 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "تأسست معمارية المركز الوطني للخدمات الإلكترونية على هيكلية خوادم الخدمات المصغرة (Microservices Architecture) المربوطة من خلال بوابة واجهة برمجية سيادية موحدة (API Gateway). يتم دمج محركات الهوية الرقمية والفوترة الوطنية مع السجل المدني للوصول الفوري والآمن لمعلومات المواطنين والمستثمرين، مما يضمن أداء مهام التأسيس السريع دون أية معاملات ورقية." 
                        : "The sovereign portal is architected using highly robust, containerized microservices communicating via an Enterprise API Gateway. It connects directly with the Federal Civil Registry for instant data checks, bypassing legacy paperwork pipelines."}
                    </p>
                  </div>

                  {/* Part 2: Catalog Structure */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sudan-green">
                      <Compass className="w-5 h-5 text-sudan-gold" />
                      <h4 className="text-sm font-black" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "2. دليل الخدمات الشامل وتصنيف السودان المعتمد" : "2. Unified Services Catalog & Classification Framework"}
                      </h4>
                    </div>
                    <p className="text-[11.5px] text-gray-600 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "يتم فرز وتصنيف كافة الخدمات طبقاً لطبيعة طالب المعاملة: مواطنون ومستهلكون، أصحاب أعمال، مستثمرون، مصنعون، ومصدرون ومستوردون. يتم تقسيم الخدمات إلى 15 فئة رئيسية تغطي كافة النطاقات القانونية، من التأسيس إلى حماية المستهلك ورقابة أسواق السلع الأساسية بالسودان." 
                        : "Our taxonomy splits services based on target personas (Citizens, Investors, Manufacturers, Exporters, and Government Officers) under 15 master groups including Corporate Registry, Food safety, Digital Seals, COMESA Origins, and Metrology audits."}
                    </p>
                  </div>

                  {/* Part 3: AI Recommendation & Natural Search */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sudan-green">
                      <Brain className="w-5 h-5 text-sudan-gold" />
                      <h4 className="text-sm font-black" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "3. محرك التوصيات والبحث الذكي بالذكاء الاصطناعي" : "3. AI Recommendation & Intelligent Search Architecture"}
                      </h4>
                    </div>
                    <p className="text-[11.5px] text-gray-600 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "يستخدم محرك البحث الذكي تقنية معالجة اللغات الطبيعية (NLP) المتقدمة لربط الكلمات الدلالية مباشرة باستمارة الخدمة. في حين يعمل محرك التوصيات على تقييم بروفايل المستثمر ونشاطه التجاري وسجلات التزام الشركة لتنبيهه تلقائياً بالرخص الواجب تجديدها أو استحقاقات التفتيش القادمة." 
                        : "Intelligent search utilizes advanced natural language parsing to immediately route conversational user inquiries to compliant workflows. The proactive AI recommendation engine scans business activity codes to suggest renewals and inspection preparation steps before penalties arise."}
                    </p>
                  </div>

                  {/* Part 4: Smart Electronic Forms */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sudan-green">
                      <ClipboardList className="w-5 h-5 text-sudan-gold" />
                      <h4 className="text-sm font-black" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "4. إطار عمل الاستمارات الإلكترونية الموحدة" : "4. Electronic Forms & Sovereign Validation Framework"}
                      </h4>
                    </div>
                    <p className="text-[11.5px] text-gray-600 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "يدعم إطار الاستمارات الملء التلقائي للبيانات عبر الهوية الرقمية الموحدة وتدقيق المدخلات بصورة فورية لمنع الأخطاء المطبعية، مع توفير خاصية حفظ المسودات ورفع المرفقات المشفرة بالكامل طبقاً لقانون المعاملات الإلكترونية السوداني لعام 2026." 
                        : "Dynamic electronic forms pull authenticated personal identifiers from the digital identity vault. Built-in, context-aware validation ensures zero structural error rates, enforcing secure document uploads compliant with local secure storage standards."}
                    </p>
                  </div>

                  {/* Part 5: Database Schema */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sudan-green">
                      <Database className="w-5 h-5 text-sudan-gold" />
                      <h4 className="text-sm font-black" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "5. تمديد قاعدة البيانات ومواصفات الربط البرمجي (API)" : "5. Database Schema Extensions & API Integration Specification"}
                      </h4>
                    </div>
                    <div className="space-y-2 text-[11px] leading-relaxed text-gray-600 font-mono">
                      <p className="font-extrabold">{currentLanguage === "ar" ? "✔ تمديد الجداول في MySQL / MariaDB:" : "✔ Schema Extensions for Federated Repositories:"}</p>
                      <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto text-[9.5px]">
{`CREATE TABLE services_catalog (
  service_id VARCHAR(50) PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  group_id VARCHAR(50),
  fees_sdg DECIMAL(10,2),
  processing_time_hours INT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_favorites (
  user_id VARCHAR(100),
  service_id VARCHAR(50),
  PRIMARY KEY (user_id, service_id)
);

CREATE TABLE transaction_tracking (
  tracking_id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(100),
  service_id VARCHAR(50),
  current_stage VARCHAR(100),
  assigned_department VARCHAR(150),
  predicted_completion_time TIMESTAMP
);`}
                      </pre>
                    </div>
                  </div>

                  {/* Part 6: Security and Zero Trust */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sudan-green">
                      <Shield className="w-5 h-5 text-sudan-gold" />
                      <h4 className="text-sm font-black" style={{ fontFamily: "Cairo, sans-serif" }}>
                        {currentLanguage === "ar" ? "6. الأمان الفيدرالي وسياسة صفر ثقة (Zero Trust)" : "6. Sovereign Security, Zero Trust, & Cryptography"}
                      </h4>
                    </div>
                    <p className="text-[11.5px] text-gray-600 leading-relaxed">
                      {currentLanguage === "ar" 
                        ? "يتم معالجة كافة اتصالات بوابة الخدمات إلكترونياً بالتشفير التام (E2EE) باستخدام بروتوكول TLS 1.3 مع تطبيق سياسة صفر ثقة لكافة صلاحيات الإدارة ومراجعي الوزارة. يتم تسجيل وتوقيع كافة الحركات والطلبات بسجلات مدققة غير قابلة للتلاعب." 
                        : "All interactions leverage military-grade TLS 1.3 transport encryption. Zero Trust policy ensures that backend staff access rights are continuously assessed using multi-factor identity challenges and non-repudiable system audit logging."}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* 5. SERVICE DETAILS MODAL & SMART FORM */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedService(null)} />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 font-sans text-slate-800 flex flex-col max-h-[85vh]"
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            >
              {/* Modal Header Ribbon */}
              <div className="bg-gradient-to-r from-sudan-green to-emerald-800 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <FileText className="w-5 h-5 text-sudan-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-extrabold" style={{ fontFamily: "Cairo, sans-serif" }}>
                      {currentLanguage === "ar" ? selectedService.nameAr : selectedService.nameEn}
                    </h3>
                    <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wide">
                      {currentLanguage === "ar" ? `دليل الخدمات • فئة: ${selectedService.category.toUpperCase()}` : `Services Catalog • Group: ${selectedService.category.toUpperCase()}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Scrolling Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Intro details */}
                <div className="space-y-1 pb-4 border-b border-gray-100">
                  <h4 className="font-extrabold text-slate-800 text-sm">{currentLanguage === "ar" ? "حول الخدمة الإلكترونية:" : "Service Information:"}</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {currentLanguage === "ar" ? selectedService.descriptionAr : selectedService.descriptionEn}
                  </p>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-gray-150 text-center">
                    <span className="text-gray-400 font-bold block text-[10px]">{currentLanguage === "ar" ? "الرسوم المقررة" : "Sovereign Fees"}</span>
                    <p className="font-extrabold text-slate-800 mt-1">{currentLanguage === "ar" ? selectedService.feesAr : selectedService.feesEn}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-gray-150 text-center">
                    <span className="text-gray-400 font-bold block text-[10px]">{currentLanguage === "ar" ? "زمن المعالجة المتوقع" : "Processing Delay"}</span>
                    <p className="font-extrabold text-slate-800 mt-1">{currentLanguage === "ar" ? selectedService.timeAr : selectedService.timeEn}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-gray-150 text-center col-span-2">
                    <span className="text-gray-400 font-bold block text-[10px]">{currentLanguage === "ar" ? "الفئة المستهدفة" : "Target Audience"}</span>
                    <p className="font-extrabold text-sudan-green mt-1 uppercase text-[11px] font-mono">{selectedService.targetAudience.replace("_", " ")}</p>
                  </div>
                </div>

                {/* Legislative/Eligibility details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-slate-800 flex items-center gap-1">
                      <Scale className="w-4 h-4 text-sudan-gold" />
                      <span>{currentLanguage === "ar" ? "السند التشريعي والقانوني:" : "Legal & Legislative Basis:"}</span>
                    </h5>
                    <p className="text-gray-600 leading-normal">
                      {currentLanguage === "ar" ? selectedService.legalBasisAr : selectedService.legalBasisEn}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-extrabold text-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-sudan-green" />
                      <span>{currentLanguage === "ar" ? "شروط الأهلية والقبول:" : "Eligibility Criteria:"}</span>
                    </h5>
                    <p className="text-gray-600 leading-normal">
                      {currentLanguage === "ar" ? selectedService.eligibilityAr : selectedService.eligibilityEn}
                    </p>
                  </div>
                </div>

                {/* Docs requirements */}
                <div className="space-y-2 pt-2 bg-slate-50 p-4 rounded-2xl border border-gray-150">
                  <h5 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <FileCheck className="w-4.5 h-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "المستندات والأوراق الثبوتية المطلوبة:" : "Mandatory Attached Documents:"}</span>
                  </h5>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc list-inside text-gray-600 text-[11px]">
                    {currentLanguage === "ar" 
                      ? selectedService.docsAr.map((d, i) => <li key={i}>{d}</li>)
                      : selectedService.docsEn.map((d, i) => <li key={i}>{d}</li>)
                    }
                  </ul>
                </div>

                {/* Actionable items */}
                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => {
                      setActiveFormService(selectedService);
                      setSelectedService(null);
                    }}
                    className="flex-1 bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? "بدء الخدمة الإلكترونية والملء التلقائي" : "Incorporate & Begin Smart Form"}</span>
                  </button>

                  {/* Redirect directly to mapped module if active */}
                  {selectedService.mappedModuleId && onNavigateModule && (
                    <button
                      onClick={() => {
                        if (selectedService.mappedModuleId) {
                          onNavigateModule(selectedService.mappedModuleId);
                          setSelectedService(null);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="bg-[#F4F6F5] hover:bg-slate-200 border border-gray-200 text-slate-700 text-xs font-black py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Globe className="w-4 h-4 text-sudan-green" />
                      <span>{currentLanguage === "ar" ? "الذهاب للمنصة المخصصة" : "Go to Dedicated Module"}</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-[10.5px]">
                <p className="text-gray-400 font-mono">SD-SSO-V2 • COMPLIANT WITH SUDAN Vision 2035</p>
                <button
                  onClick={() => setSelectedService(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {currentLanguage === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. SMART ELECTRONIC FORMS WINDOW */}
      <AnimatePresence>
        {activeFormService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setActiveFormService(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 font-sans text-slate-800 flex flex-col max-h-[90vh]"
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-sudan-green to-emerald-800 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <ClipboardList className="w-5 h-5 text-sudan-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-extrabold" style={{ fontFamily: "Cairo, sans-serif" }}>
                      {currentLanguage === "ar" ? `استمارة: ${activeFormService.nameAr}` : `Smart Form: ${activeFormService.nameEn}`}
                    </h3>
                    <p className="text-[10px] text-emerald-100 font-bold">
                      {currentLanguage === "ar" ? "ملء معتمد ومدقق عبر السجل المدني الاتحادي" : "Federal Verification Enabled via Civil SSO"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveFormService(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Scrollable Body */}
              <form onSubmit={handleFormSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* AutoFill Banner */}
                <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-sudan-green shrink-0" />
                  <div className="text-[10.5px] text-emerald-900 leading-normal">
                    <p className="font-extrabold">{currentLanguage === "ar" ? "تم التحقق والملء التلقائي للهوية الرقمية" : "Identity Verified & Fields Populated"}</p>
                    <p>{currentLanguage === "ar" ? "تم ربط البيانات تلقائياً ببروفايلك المعتمد ورقمك الوطني لتسريع المصادقة." : "Credentials retrieved from your Civil identity card."}</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wide block">
                      {currentLanguage === "ar" ? "الاسم الكامل لطالب المعاملة:" : "Full Name of Applicant:"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.fullName}
                      onChange={(e) => setFormFields({ ...formFields, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wide block">
                      {currentLanguage === "ar" ? "الرقم الوطني السوداني (11 خانة):" : "Sudanese National ID:"}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={formFields.nationalId}
                      onChange={(e) => setFormFields({ ...formFields, nationalId: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wide block">
                      {currentLanguage === "ar" ? "اسم المؤسسة / النشاط التجاري:" : "Company / Business Name:"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.companyName}
                      onChange={(e) => setFormFields({ ...formFields, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wide block">
                      {currentLanguage === "ar" ? "الرقم التجاري الموحد (إن وجد):" : "Commercial Registry Number (If applicable):"}
                    </label>
                    <input
                      type="text"
                      value={formFields.commercialNumber}
                      onChange={(e) => setFormFields({ ...formFields, commercialNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wide block">
                      {currentLanguage === "ar" ? "الولاية المقررة للمعاملة والنشاط:" : "State Location for Active Business:"}
                    </label>
                    <select
                      value={formFields.state}
                      onChange={(e) => setFormFields({ ...formFields, state: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-slate-800 font-extrabold focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white"
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
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wide block">
                      {currentLanguage === "ar" ? "تفاصيل إضافية أو مبررات طلب الخدمة:" : "Additional Supporting Details or Declarations:"}
                    </label>
                    <textarea
                      rows={3}
                      value={formFields.details}
                      onChange={(e) => setFormFields({ ...formFields, details: e.target.value })}
                      placeholder={currentLanguage === "ar" ? "اكتب هنا أية تفاصيل تسهم في سرعة تصديق المعاملة..." : "Provide context or special requirements..."}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sudan-green focus:bg-white"
                    />
                  </div>
                </div>

                {/* Secure File Attachments block */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-gray-150">
                  <h5 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "رفع المرفقات والمستندات الثبوتية المشفرة:" : "Secure Documents Attachments Portal:"}</span>
                  </h5>
                  <div className="border-2 border-dashed border-gray-200 hover:border-sudan-green transition-all p-4 rounded-xl text-center bg-white">
                    <p className="text-[10.5px] text-gray-500">
                      {currentLanguage === "ar" 
                        ? "اسحب الملفات هنا أو اضغط للاختيار من جهازك (بحد أقصى 10 ميغابايت لكل مرفق)" 
                        : "Drag and drop certified PDFs, PNGs or deeds (Max size 10MB)"}
                    </p>
                    <div className="pt-2">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer">
                        {currentLanguage === "ar" ? "تصفح الملفات" : "Upload Files"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Digital Signature Panel */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-gray-150">
                  <h5 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Fingerprint className="w-4.5 h-4.5 text-sudan-green" />
                    <span>{currentLanguage === "ar" ? "المصادقة والتوقيع الرقمي السيادي المتكامل:" : "Integrated Sovereign Digital Signature Certification:"}</span>
                  </h5>
                  
                  <div className="border border-gray-200 bg-white p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-[10.5px] text-gray-600 leading-normal">
                      <p className="font-black text-slate-800">{currentLanguage === "ar" ? "توقيع معتمد بالشهادة القومية السودانية" : "Approved Sudanese National ID Signature"}</p>
                      <p>
                        {currentLanguage === "ar" 
                          ? "التوقيع الرقمي الصادر ملزم قانونياً بنسبة 100% أمام كافة الهيئات القضائية والمصرفية الفيدرالية." 
                          : "Any transaction is non-repudiable across federal judiciary and banking networks."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSignatureDone(!isSignatureDone)}
                      className={`px-4 py-2 rounded-xl text-[10.5px] font-black transition-all ${
                        isSignatureDone 
                          ? "bg-emerald-50 text-sudan-green border border-sudan-green/30" 
                          : "bg-sudan-gold text-slate-950 hover:bg-sudan-gold-light"
                      }`}
                    >
                      {isSignatureDone 
                        ? (currentLanguage === "ar" ? "✓ تم التوقيع رقمياً" : "✓ Electronically Signed") 
                        : (currentLanguage === "ar" ? "اضغط للتوقيع والمصادقة" : "Click to Digitally Seal")
                      }
                    </button>
                  </div>
                </div>

                {/* Submit actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveFormService(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    {currentLanguage === "ar" ? "إلغاء الطلب" : "Cancel Request"}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isSignatureDone}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black px-6 py-2 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-sudan-gold" />
                        <span>{currentLanguage === "ar" ? "جاري الإرسال والتحقق..." : "Transmitting & Validating..."}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4.5 h-4.5 text-sudan-gold" />
                        <span>{currentLanguage === "ar" ? "تقديم المعاملة رسمياً للدراسة والفسح" : "Submit Certified Transaction"}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. SERVICE RATING & KPI GENERATOR MODAL */}
      <AnimatePresence>
        {ratingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setRatingService(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden relative z-10 font-sans text-slate-800"
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            >
              <div className="bg-gradient-to-r from-sudan-green to-emerald-800 text-white px-5 py-4 flex items-center justify-between">
                <h3 className="text-xs font-extrabold" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {currentLanguage === "ar" ? `تقييم الخدمة: ${ratingService.nameAr}` : `Rate Service: ${ratingService.nameEn}`}
                </h3>
                <button onClick={() => setRatingService(null)} className="text-white">✕</button>
              </div>

              {ratingSubmitted ? (
                <div className="p-8 text-center space-y-3">
                  <div className="h-12 w-12 bg-emerald-50 text-sudan-green rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm">{currentLanguage === "ar" ? "شكراً لمساهمتك القيمة!" : "Thank You for Your Feedback!"}</h4>
                  <p className="text-xs text-gray-500">
                    {currentLanguage === "ar" 
                      ? "تم دمج تقييمك فورياً في منظومة مؤشرات الأداء (KPIs) لوزارة التجارة والصناعة لتحسين جودة الخدمات." 
                      : "Your review has been directly compiled into the ministry dashboards to enhance execution quality."}
                  </p>
                </div>
              ) : (
                <form onSubmit={submitRating} className="p-5 space-y-4 text-xs">
                  <p className="text-[11px] text-gray-500">
                    {currentLanguage === "ar" 
                      ? "تقييمك يسهم مباشرة في رفع كفاءة العمل الحكومي بجمهورية السودان." 
                      : "Your metrics help design higher efficiency and responsiveness in digital state registries."}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                      <span className="font-bold text-gray-600">{currentLanguage === "ar" ? "جودة وكفاءة الخدمة:" : "Service quality:"}</span>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map(num => (
                          <Star key={num} className={`w-4 h-4 cursor-pointer ${ratings.quality >= num ? "fill-amber-500" : ""}`} onClick={() => setRatings({ ...ratings, quality: num })} />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                      <span className="font-bold text-gray-600">{currentLanguage === "ar" ? "سرعة إنجاز المعاملة:" : "Processing Speed:"}</span>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map(num => (
                          <Star key={num} className={`w-4 h-4 cursor-pointer ${ratings.speed >= num ? "fill-amber-500" : ""}`} onClick={() => setRatings({ ...ratings, speed: num })} />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                      <span className="font-bold text-gray-600">{currentLanguage === "ar" ? "سهولة الاستخدام والوضوح:" : "Ease of use & clarity:"}</span>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map(num => (
                          <Star key={num} className={`w-4 h-4 cursor-pointer ${ratings.ease >= num ? "fill-amber-500" : ""}`} onClick={() => setRatings({ ...ratings, ease: num })} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wide block">
                      {currentLanguage === "ar" ? "ملاحظات إضافية للتطوير:" : "Additional Improvement Remarks:"}
                    </label>
                    <textarea
                      rows={2}
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اكتب هنا أية تعليقات أو مقترحات..." : "Type your advice or recommendations..."}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl p-2 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sudan-green hover:bg-sudan-green-light text-white font-black py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    {currentLanguage === "ar" ? "إرسال التقييم رسمياً" : "Submit Official Metrics"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
