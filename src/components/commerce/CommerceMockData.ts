/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DigitalBusiness, SmeProgram, StartupRecord, MarketplaceProduct, ElectronicInvoice, DigitalContract, DisputeRecord, ShipmentRecord } from "./CommerceTypes";

export const initialDigitalBusinesses: DigitalBusiness[] = [
  {
    id: "db-1",
    digitalId: "SD-BIZ-481920",
    storeNameAr: "منصة سودا-ماركت للمنتجات العضوية",
    storeNameEn: "SudaMarket Organic Platform",
    businessType: "marketplace",
    ownerName: "ياسر عبد الكريم الطيب",
    email: "yasser@sudamarket.sd",
    phone: "+249912345001",
    status: "active",
    trustScore: 96,
    sector: "agricultural_commerce",
    addressState: "الخرطوم",
    addressCity: "الخرطوم",
    registeredAt: "2026-01-15T08:30:00Z",
    annualRevenue: 12500000,
    paymentPlatformLinked: true,
    logisticsLinked: true,
    crLink: "comp-1",
    licenseLink: "lic-1",
    auditLogs: [
      { id: "log-1", actionAr: "إنشاء السجل التجاري الرقمي", actionEn: "Digital business registry created", actor: "ياسر الطيب", role: "merchant", timestamp: "2026-01-15T08:30:00Z", ip: "197.251.48.2" },
      { id: "log-2", actionAr: "تفعيل الربط الجمركي وبوابة الدفع", actionEn: "Sovereign Payment gateway integration verified", actor: "النظام التلقائي", role: "system", timestamp: "2026-01-16T10:15:00Z", ip: "127.0.0.1" },
      { id: "log-3", actionAr: "تحديث شهادة الامتثال الفيدرالي", actionEn: "Federal compliance certification updated", actor: "أمل البشير", role: "government_officer", timestamp: "2026-05-10T12:00:00Z", ip: "196.1.200.45" }
    ]
  },
  {
    id: "db-2",
    digitalId: "SD-BIZ-759102",
    storeNameAr: "متجر كردفان لتصدير الصمغ والكركديه",
    storeNameEn: "Kordofan Gum & Hibiscus Store",
    businessType: "online_store",
    ownerName: "آمنة صالح العبيد",
    email: "amna@kordofangum.sd",
    phone: "+249123098765",
    status: "verified",
    trustScore: 92,
    sector: "export_trade",
    addressState: "شمال كردفان",
    addressCity: "الأبيض",
    registeredAt: "2026-02-20T09:00:00Z",
    annualRevenue: 8400000,
    paymentPlatformLinked: true,
    logisticsLinked: true,
    crLink: "comp-1",
    licenseLink: "lic-1",
    auditLogs: [
      { id: "log-4", actionAr: "طلب تسجيل متجر منزلي مصاحب", actionEn: "Home business extension registered", actor: "آمنة العبيد", role: "sme_owner", timestamp: "2026-02-20T09:00:00Z", ip: "197.251.52.14" },
      { id: "log-5", actionAr: "الموافقة الأمنية وفحص الموثوقية", actionEn: "Identity and safety vetting approved", actor: "مكتب التجارة الرقمية", role: "government_officer", timestamp: "2026-02-21T14:30:00Z", ip: "196.1.200.46" }
    ]
  },
  {
    id: "db-3",
    digitalId: "SD-BIZ-930412",
    storeNameAr: "دليفري نيل لخدمات التوصيل السريع",
    storeNameEn: "Delivery Nile Logistics Hub",
    businessType: "digital_service",
    ownerName: "أحمد المأمون التازي",
    email: "tazi@deliverynile.sd",
    phone: "+249915554321",
    status: "active",
    trustScore: 89,
    sector: "logistics_services",
    addressState: "البحر الأحمر",
    addressCity: "بورتسودان",
    registeredAt: "2026-03-05T11:45:00Z",
    annualRevenue: 24000000,
    paymentPlatformLinked: true,
    logisticsLinked: true,
    crLink: "comp-2",
    licenseLink: "lic-2",
    auditLogs: [
      { id: "log-6", actionAr: "إنشاء هوية الربط اللوجستي الفيدرالي", actionEn: "National logistics linkage initialized", actor: "أحمد التازي", role: "merchant", timestamp: "2026-03-05T11:45:00Z", ip: "197.251.60.101" }
    ]
  },
  {
    id: "db-4",
    digitalId: "SD-BIZ-110293",
    storeNameAr: "الرسام الرقمي السوداني للخدمات الإبداعية",
    storeNameEn: "Sudanese Digital Brush Creative Store",
    businessType: "freelancer",
    ownerName: "ميسون عمر تاج السر",
    email: "maysoon@digitalbrush.sd",
    phone: "+249921112223",
    status: "pending",
    trustScore: 85,
    sector: "creative_industries",
    addressState: "الجزيرة",
    addressCity: "ود مدني",
    registeredAt: "2026-07-12T15:10:00Z",
    annualRevenue: 1500000,
    paymentPlatformLinked: false,
    logisticsLinked: false,
    auditLogs: [
      { id: "log-7", actionAr: "تقديم طلب رخصة مهنية حرة للشباب", actionEn: "Freelancer professional license applied", actor: "ميسون عمر", role: "entrepreneur", timestamp: "2026-07-12T15:10:00Z", ip: "197.251.12.8" }
    ]
  },
  {
    id: "db-5",
    digitalId: "SD-BIZ-204192",
    storeNameAr: "جمعية سنار لتوزيع المنتجات المنزلية والصناعية",
    storeNameEn: "Sennar Home Product Alliance",
    businessType: "home_based",
    ownerName: "فاطمة التجاني يوسف",
    email: "fatima@sennarhpa.sd",
    phone: "+249127778889",
    status: "suspended",
    trustScore: 45,
    sector: "consumer_goods",
    addressState: "سنار",
    addressCity: "سنجة",
    registeredAt: "2026-04-18T10:00:00Z",
    annualRevenue: 3200000,
    paymentPlatformLinked: true,
    logisticsLinked: false,
    auditLogs: [
      { id: "log-8", actionAr: "تجميد الحساب لعدم اكتمال وثائق التحقق الشخصي", actionEn: "Account suspended due to missing identity documentation", actor: "سماح الطيب", role: "director", timestamp: "2026-05-02T16:20:00Z", ip: "196.1.200.3" }
    ]
  }
];

export const initialSmePrograms: SmeProgram[] = [
  {
    id: "prog-1",
    titleAr: "برنامج منحة التحول الرقمي للمشاريع الريفية",
    titleEn: "Rural Enterprise Digital Transformation Grant",
    descriptionAr: "دعم تمويلي فيدرالي مباشر لتجهيز البنية التحتية الرقمية، المتاجر الإلكترونية، وتدريب الموظفين في الولايات الزراعية.",
    descriptionEn: "Direct federal funding for digital store deployment, computer infrastructure and electronic commerce training in rural states.",
    type: "grant",
    sponsor: "وزارة التجارة الفيدرالية بالتعاون مع بنك السودان المركزي",
    fundingAmount: 5000000, // in SDG per SME
    eligibilityCriteriaAr: "سجل تجاري نشط، متجر مسجل بالمنصة الوطنية، مبيعات سنوية أقل من ٢٠ مليون جنيه.",
    eligibilityCriteriaEn: "Active commercial registry, certified digital store, annual sales below 20M SDG.",
    registeredCount: 42,
    status: "active"
  },
  {
    id: "prog-2",
    titleAr: "مسرعة تصدير الصمغ العربي والمنتجات المحلية",
    titleEn: "Gum Arabic & Local Commodities Export Accelerator",
    descriptionAr: "توجيه وتأهيل المصنعين والشباب للنفاذ إلى أسواق الكوميسا، وإصدار شهادات المنشأ الذكية ومطابقة الجودة SSMO.",
    descriptionEn: "Mentorship and readiness verification for exporting agricultural yields into COMESA zones, standard compliance matching.",
    type: "accelerator",
    sponsor: "مجلس الصادرات الوطني ومجلس اللوجستيات السوداني",
    fundingAmount: 0,
    eligibilityCriteriaAr: "منتجات ذات منشأ سوداني، شهادة فحص معملي سارية، عضوية بسجل المتعاملين.",
    eligibilityCriteriaEn: "Sovereign Sudanese origin goods, valid laboratory test results, registered trader status.",
    registeredCount: 19,
    status: "active"
  },
  {
    id: "prog-3",
    titleAr: "حاضنة وادي النيل لتقنيات التجارة والذكاء الاصطناعي",
    titleEn: "Nile Valley AI & Commerce Technology Incubator",
    descriptionAr: "احتضان مشاريع البرمجيات، وتصميم بوابات البيع، ونظم التوصيل الجغرافي والربط بالخريطة القومية.",
    descriptionEn: "Incubating e-commerce tech startups, supply chain software, GIS logistics integration, and predictive pricing algorithms.",
    type: "incubation",
    sponsor: "المنصة القومية للابتكار والصناعة",
    fundingAmount: 15000000,
    eligibilityCriteriaAr: "فريق عمل سوداني، نموذج أولي تقني مبتكر، استهداف السوق المحلي أو الإقليمي.",
    eligibilityCriteriaEn: "Sudanese startup team, innovative functional prototype, target local or regional digital market.",
    registeredCount: 11,
    status: "active"
  },
  {
    id: "prog-4",
    titleAr: "أكاديمية رواد الأعمال والمهارات الرقمية",
    titleEn: "Digital Skills Academy for Entrepreneurs",
    descriptionAr: "دورات تفاعلية ومؤهلات سيادية في مجالات التجارة الإلكترونية، العقود الذكية، وقوانين حماية المستهلك السودانية.",
    descriptionEn: "Interactive courses and certifications on digital commerce compliance, electronic contract law, and consumer protection.",
    type: "skills_training",
    sponsor: "إدارة تنمية الموارد والتحول الرقمي 2035",
    fundingAmount: 0,
    eligibilityCriteriaAr: "مفتوح لكافة المواطنين المسجلين بهوية وطنية موثقة.",
    eligibilityCriteriaEn: "Open to all verified Sudanese citizens with dynamic national ID registrations.",
    registeredCount: 156,
    status: "active"
  }
];

export const initialStartupRecords: StartupRecord[] = [
  {
    id: "st-1",
    name: "SudaPay Fintech Systems",
    founder: "د. هاني عثمان البدري",
    descriptionAr: "تطوير حلول دفع عبر الويب والمحمول، بوابات التمويل الجماعي متوافقة مع الأنظمة المصرفية السيادية.",
    descriptionEn: "Developing web and mobile micro-payment APIs, crowdfunding portals aligned with central bank regulations.",
    industry: "FinTech",
    fundingStage: "seed",
    status: "funded",
    survivalYears: 2,
    investmentAmount: 45000000,
    registeredAt: "2024-04-12T10:00:00Z"
  },
  {
    id: "st-2",
    name: "AgriTrack Sudan Map Solutions",
    founder: "سارة الفاتح حمزة",
    descriptionAr: "نظم تتبع وإدارة سلاسل الإمداد للمحاصيل الزراعية عبر الأقمار الصناعية والـ GIS المتكامل للوزارة.",
    descriptionEn: "GIS-based logistics tracking and satellite crop yield forecasting for agricultural export optimization.",
    industry: "AgriTech",
    fundingStage: "pre-seed",
    status: "incubating",
    survivalYears: 1,
    investmentAmount: 12000000,
    registeredAt: "2025-09-18T14:22:00Z"
  },
  {
    id: "st-3",
    name: "E-Nile Courier Robotics",
    founder: "م. محمد كمال الجزولي",
    descriptionAr: "شحن وتوصيل الطرود الصغيرة ذاتية القيادة والمؤمنة بمستشعرات درجات الحرارة لحماية المنتجات والأدوية.",
    descriptionEn: "Autonomous smart couriers and cold-chain sensor-equipped packages for high-value organic commodities.",
    industry: "LogisticsTech",
    fundingStage: "series-a",
    status: "active",
    survivalYears: 3,
    investmentAmount: 110000000,
    registeredAt: "2023-11-05T09:10:00Z"
  }
];

export const initialMarketplaceProducts: MarketplaceProduct[] = [
  {
    id: "prod-1",
    businessId: "db-2",
    nameAr: "صمغ عربي طبيعي درجة زوّار (علبة مصفاة ١ كجم)",
    nameEn: "Premium Gum Arabic Grade A (1KG Refined Container)",
    descriptionAr: "منتج ومصفى من ولاية شمال كردفان، مطابق لمواصفات الهيئة السودانية للمواصفات SSMO ومعد للتصدير الفوري.",
    descriptionEn: "Refined Gum Arabic directly from North Kordofan fields, verified compliant with SSMO standards.",
    price: 32000,
    currency: "SDG",
    category: "local_commodities",
    stock: 450,
    rating: 4.9,
    reviewsCount: 38,
    status: "active"
  },
  {
    id: "prod-2",
    businessId: "db-2",
    nameAr: "كركديه بري مجفف نخب أول (شوال ٢٥ كجم)",
    nameEn: "Wild Dried Karkadeh/Hibiscus Premium (25KG Bag)",
    descriptionAr: "كركديه بلدي بلون غني من مزارع جبل مرة وجنوب دارفور معبأ ومفحوص مخبرياً.",
    descriptionEn: "Rich crimson dried hibiscus calyces from Jebel Marra mزارع, laboratory checked for quality assurance.",
    price: 95000,
    currency: "SDG",
    category: "local_commodities",
    stock: 120,
    rating: 4.7,
    reviewsCount: 15,
    status: "active"
  },
  {
    id: "prod-3",
    businessId: "db-1",
    nameAr: "زيت سمسم طبيعي معصور على البارد (٥ لتر)",
    nameEn: "Cold Pressed Organic Sesame Oil (5 Litres)",
    descriptionAr: "سمسم أبيض سوداني من القضارف معصور بالطرق الطبيعية بدون إضافات.",
    descriptionEn: "Genuine white sesame seeds from Al Qadarif, cold pressed under standard hygienic regulations.",
    price: 18500,
    currency: "SDG",
    category: "processed_foods",
    stock: 200,
    rating: 4.8,
    reviewsCount: 29,
    status: "active"
  },
  {
    id: "prod-4",
    businessId: "db-5",
    nameAr: "ثوب سوداني مطرز يدوياً - تصميم الفراشة",
    nameEn: "Hand-Embroidered Sudanese Toub - Butterfly Design",
    descriptionAr: "تصميم نسائي وطني راقٍ مطرز يدوياً بخيوط حريرية ممتازة.",
    descriptionEn: "Sophisticated traditional Sudanese wear handwoven with premium silk patterns.",
    price: 65000,
    currency: "SDG",
    category: "handicrafts",
    stock: 5,
    rating: 4.2,
    reviewsCount: 4,
    status: "under_review"
  }
];

export const initialInvoices: ElectronicInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "SD-EINV-2026-90412",
    issuerId: "db-2",
    buyerName: "مؤسسة النور للاستيراد بجدة",
    buyerTaxId: "SA-904128912",
    issueDate: "2026-07-01T12:00:00Z",
    amount: 12000,
    vatAmount: 1800,
    status: "paid",
    paymentGatewayRef: "SP-PAY-94101"
  },
  {
    id: "inv-2",
    invoiceNumber: "SD-EINV-2026-30219",
    issuerId: "db-1",
    buyerName: "شركة سوبر دليفري للمواد الغذائية",
    issueDate: "2026-07-10T14:30:00Z",
    amount: 320000,
    vatAmount: 48000,
    status: "pending"
  },
  {
    id: "inv-3",
    invoiceNumber: "SD-EINV-2026-11048",
    issuerId: "db-3",
    buyerName: "شركة الموانئ البحرية المحدودة",
    issueDate: "2026-07-14T09:00:00Z",
    amount: 1450000,
    vatAmount: 217500,
    status: "paid",
    paymentGatewayRef: "SP-PAY-11048"
  }
];

export const initialContracts: DigitalContract[] = [
  {
    id: "con-1",
    contractNumber: "SD-CON-2026-0129",
    partyA: "منصة سودا-ماركت للمنتجات العضوية",
    partyB: "دليفري نيل لخدمات التوصيل السريع",
    titleAr: "اتفاقية شراكة لوجستية وتوصيل طرود مبردة",
    titleEn: "Logistics & Cold-Chain delivery partnership agreement",
    signedAt: "2026-03-10T08:00:00Z",
    status: "signed",
    hash: "0x89f1a23b4cd5e6f790412b304c5e6f7a"
  },
  {
    id: "con-2",
    contractNumber: "SD-CON-2026-0581",
    partyA: "متجر كردفان لتصدير الصمغ",
    partyB: "وكالة الشحن الإقليمية بموانئ سواكن",
    titleAr: "اتفاقية توريد وشحن محاصيل للكوميسا",
    titleEn: "Sudanese Commodities Export & Sea Freight Contract",
    signedAt: "2026-05-12T11:00:00Z",
    status: "signed",
    hash: "0x91d3e8fa02b5c711048e302c1d2e3f4a"
  }
];

export const initialDisputes: DisputeRecord[] = [
  {
    id: "disp-1",
    ticketNumber: "SD-DISP-1049",
    businessId: "db-1",
    consumerName: "خالد عبد الحليم أحمد",
    consumerPhone: "+249122334455",
    complaintType: "defective_product",
    details: "اشتريت علبة زيت سمسم معبأة، ووجدت الزجاجة مكسورة تماماً ومسربة للمنتج، ورفض البائع الاستبدال.",
    status: "resolved",
    createdAt: "2026-06-18T10:00:00Z",
    resolutionAr: "تم فحص الشكوى من قبل مفتش التجارة الإلكترونية، وتعيين استرجاع القيمة بالكامل للمشتري عبر بوابة الدفع الإلكتروني الحكومية.",
    resolutionEn: "Dispute reviewed by E-Commerce ombudsman. Complete financial refund processed back to user via sovereign wallet gateway."
  },
  {
    id: "disp-2",
    ticketNumber: "SD-DISP-2051",
    businessId: "db-5",
    consumerName: "نعمة الله فضل المولى",
    consumerPhone: "+249911991199",
    complaintType: "non_delivery",
    details: "تم دفع قيمة ثوب حريري مطرز منذ أسبوعين كاملين، ولم يتم التوصيل، ويتعذر التواصل مع الهاتف المسجل للمحل.",
    status: "under_investigation",
    createdAt: "2026-07-13T12:00:00Z"
  }
];

export const initialShipments: ShipmentRecord[] = [
  {
    id: "shp-1",
    trackingNumber: "SD-TRK-9410129",
    businessId: "db-2",
    carrier: "Delivery Nile Logistics",
    origin: "الأبيض (مستودع كردفان الفيدرالي)",
    destination: "ميناء بورتسودان الجنوبي (الرصيف ٥ صادر)",
    currentLocation: "عطبرة (معبر الفحص الفيدرالي)",
    status: "transit",
    lastUpdated: "2026-07-15T16:45:00Z",
    warehouseId: "wh-kordofan-1"
  },
  {
    id: "shp-2",
    trackingNumber: "SD-TRK-1104892",
    businessId: "db-1",
    carrier: "الناقل الوطني السريع",
    origin: "الخرطوم بحري",
    destination: "أم درمان حي الروضة",
    currentLocation: "أم درمان الروضة",
    status: "delivered",
    lastUpdated: "2026-07-14T11:20:00Z",
    warehouseId: "wh-khartoum-3"
  }
];
