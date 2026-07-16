/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TraderRecord, ShipmentRecord, InspectionRecord, DigitalSovereignCertificate, HsCodeRecord } from "./TradeTypes";

export const initialTraders: TraderRecord[] = [
  {
    id: "trader-1",
    nti: "SD-NTI-2026-90412",
    companyName: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    category: "exporter",
    ownerName: "أحمد محمد عثمان",
    registrationNumber: "SD-2026-90412",
    status: "approved",
    registeredAt: "2026-07-01T12:00:00Z"
  },
  {
    id: "trader-2",
    nti: "SD-NTI-2026-10294",
    companyName: "شركة سوبا للمواد الغذائية والاستيراد",
    category: "importer",
    ownerName: "سليمان حسن فضل الله",
    registrationNumber: "SD-2026-10294",
    status: "approved",
    registeredAt: "2026-07-02T10:30:00Z"
  },
  {
    id: "trader-3",
    nti: "SD-NTI-2026-44029",
    companyName: "مخلص جمارك البحر الأحمر السريعة",
    category: "broker",
    ownerName: "فاطمة الزهراء علي",
    registrationNumber: "SD-2026-30219",
    status: "approved",
    registeredAt: "2026-07-03T15:45:00Z"
  },
  {
    id: "trader-4",
    nti: "SD-NTI-2026-30219",
    companyName: "النيل الأزرق لخدمات الشحن واللوجستيات",
    category: "forwarder",
    ownerName: "عثمان صالح الجزولي",
    registrationNumber: "SD-2026-51204",
    status: "approved",
    registeredAt: "2026-07-04T09:15:00Z"
  }
];

export const initialShipments: ShipmentRecord[] = [
  {
    id: "ship-1",
    trackingId: "SD-TRK-2026-10492",
    traderName: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    cargoDescription: "صمغ عربي هشاب طبيعي 100% فرز أول",
    weightNet: 22000,
    weightGross: 22400,
    status: "customs",
    currentNodeAr: "محطة جمارك ميناء بورتسودان",
    currentNodeEn: "Port Sudan Customs Terminal",
    originAr: "الأبيض، شمال كردفان",
    originEn: "El Obeid, North Kordofan",
    destinationAr: "ميناء مارسيليا، فرنسا",
    destinationEn: "Marseille Port, France",
    eta: "2026-07-20",
    transitDays: 5,
    efficiencyScore: 94,
    routeAr: "الأبيض -> الخرطوم -> بورتسودان -> مارسيليا",
    routeEn: "El Obeid -> Khartoum -> Port Sudan -> Marseille"
  },
  {
    id: "ship-2",
    trackingId: "SD-TRK-2026-22941",
    traderName: "شركة سوبا للمواد الغذائية والاستيراد",
    cargoDescription: "أرز بسمتي هندي ممتاز حبة طويلة",
    weightNet: 18000,
    weightGross: 18250,
    status: "shipping",
    currentNodeAr: "البحر الأحمر - الممر المائي",
    currentNodeEn: "Red Sea Maritime Passage",
    originAr: "ميناء كندا، الهند",
    originEn: "Kandla Port, India",
    destinationAr: "مستودعات سوبا، الخرطوم",
    destinationEn: "Soba Warehouses, Khartoum",
    eta: "2026-07-24",
    transitDays: 9,
    efficiencyScore: 88,
    routeAr: "الهند -> بورتسودان -> الخرطوم",
    routeEn: "India -> Port Sudan -> Khartoum"
  },
  {
    id: "ship-3",
    trackingId: "SD-TRK-2026-90412",
    traderName: "شركة النيل الذهبي للتعدين والتصدير",
    cargoDescription: "سبائك ذهب سوداني مصفى عيار 24",
    weightNet: 150,
    weightGross: 152,
    status: "delivered",
    currentNodeAr: "الاستلام النهائي - دبي",
    currentNodeEn: "Final Delivery - Dubai",
    originAr: "منجم أبو حمد، ولاية نهر النيل",
    originEn: "Abu Hamad Mine, River Nile State",
    destinationAr: "بورصة دبي للذهب، الإمارات",
    destinationEn: "Dubai Gold Exchange, UAE",
    eta: "2026-07-14",
    transitDays: 2,
    efficiencyScore: 98,
    routeAr: "أبو حمد -> الخرطوم -> مطار دبي",
    routeEn: "Abu Hamad -> Khartoum -> Dubai Airport"
  }
];

export const initialInspections: InspectionRecord[] = [
  {
    id: "insp-1",
    targetId: "lic-1",
    targetName: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    inspectorName: "د. عبدالحليم الطيب",
    agency: "SSMO",
    scheduledDate: "2026-07-12",
    status: "passed",
    comments: "تمت مطابقة المواصفات القياسية للصمغ العربي من الدرجة الأولى وخلوه من الشوائب."
  },
  {
    id: "insp-2",
    targetId: "ship-2",
    targetName: "شحنة أرز بسمتي هندي ممتاز",
    inspectorName: "م. إبراهيم يوسف",
    agency: "Quarantine",
    scheduledDate: "2026-07-17",
    status: "pending",
    comments: "مجدول للمعاينة وفحص الصحة النباتية عند وصول السفينة لميناء بورتسودان."
  }
];

export const hsCodesDatabase: HsCodeRecord[] = [
  {
    code: "1301.90.10",
    nameAr: "صمغ عربي طبيعي خام (هشاب أو طلحة)",
    nameEn: "Raw Natural Gum Arabic (Hashab or Talha)",
    dutyRate: "2%",
    exportIncentive: "5%",
    restricted: false,
    requirementsAr: ["شهادة منشأ رقمية معتمدة", "شهادة صحة نباتية من وزارة الزراعة", "فاتورة تجارية معمدة"],
    requirementsEn: ["Certified Digital Certificate of Origin", "Phyto-sanitary Certificate from Agriculture Ministry", "Attested Commercial Invoice"]
  },
  {
    code: "1207.40.00",
    nameAr: "بذور سمسم بيضاء أو حمراء صالحة للأكل",
    nameEn: "White or Red Sesame Seeds for Human Consumption",
    dutyRate: "3%",
    exportIncentive: "4%",
    restricted: false,
    requirementsAr: ["شهادة فحص سموم ومبيدات", "شهادة منشأ وطني", "موافقة الحجر الزراعي بورتسودان"],
    requirementsEn: ["Toxin & Pesticide Free Analysis Certificate", "National Origin Certificate", "Port Sudan Agricultural Quarantine approval"]
  },
  {
    code: "0104.10.00",
    nameAr: "ضأن وإبل سودانية حية موجهة للتصدير",
    nameEn: "Live Sudanese Sheep & Camels for Export",
    dutyRate: "5%",
    exportIncentive: "6%",
    restricted: true,
    requirementsAr: ["موافقة وزارة الثروة الحيوانية", "شهادة بيطرية دولية معتمدة", "حجر صحي بمحجر سواكن أو الكدرو"],
    requirementsEn: ["Ministry of Animal Resources Approval", "Certified International Veterinary Certificate", "Quarantine at Suakin or Kadroo facility"]
  },
  {
    code: "7108.12.00",
    nameAr: "ذهب غير مشغول أو سبائك مصفاة عيار 24",
    nameEn: "Unwrought Gold or Refined Gold Bullion (24K)",
    dutyRate: "1%",
    exportIncentive: "0%",
    restricted: true,
    requirementsAr: ["موافقة بنك السودان المركزي", "رخصة صادر ذهب معتمدة", "شهادة فحص المعايرة والنقاوة الاتحادية"],
    requirementsEn: ["Central Bank of Sudan (CBOS) Approval", "Valid Gold Export License", "Federal Assaying & Purity Certificate"]
  },
  {
    code: "1006.30.00",
    nameAr: "أرز نصف مطحون أو مبيض كلياً (مستورد)",
    nameEn: "Semi-milled or Wholly Milled Rice (Imported)",
    dutyRate: "10%",
    exportIncentive: "0%",
    restricted: false,
    requirementsAr: ["شهادة مطابقة من الهيئة السودانية للمواصفات", "إفراج صحي من وزارة الصحة", "رخصة استيراد نشطة"],
    requirementsEn: ["Compliance Certificate from SSMO", "Health Release from Ministry of Health", "Active Import License"]
  }
];

export const initialSovereignCertificates: DigitalSovereignCertificate[] = [
  {
    id: "sc-1",
    certificateNumber: "SD-ORIG-2026-10492",
    category: "origin",
    titleAr: "شهادة منشأ للمنتجات الوطنية السودانية",
    titleEn: "Certificate of Origin for Sudanese Products",
    issuedTo: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    detailsAr: "صمغ عربي هشاب طبيعي 100% فرز أول مصدّر إلى ميناء مارسيليا بجمهورية فرنسا بوزن صافي قدره 22,000 كجم وقيمة فاتورة قدرها 48,000 دولار أمريكي.",
    detailsEn: "100% Organic Hashab Gum Arabic Grade 1 exported to Marseille Port, France, with net weight of 22,000 KG and invoice value of 48,000 USD.",
    signatureHash: "SD-SIG-SHA256-419b28a902df61c9b204910284c718a209b",
    verificationUrl: "https://sdmci.gov.sd/verify/SD-ORIG-2026-10492",
    timestamp: "2026-07-05T12:00:00Z",
    auditTrail: [
      { actionAr: "تقديم الطلب والوثائق", actionEn: "Submission of application & documents", timestamp: "2026-07-04T09:00:00Z", actor: "المصدر المعتمد" },
      { actionAr: "مراجعة جودة الصمغ من الهيئة السودانية للمواصفات والمقاييس", actionEn: "SSMO compliance and purity inspection passed", timestamp: "2026-07-04T14:30:00Z", actor: "مفتش الهيئة" },
      { actionAr: "توقيع وتعميد شهادة المنشأ إلكترونياً", actionEn: "Sovereign cryptographic signing & verification successful", timestamp: "2026-07-05T12:00:00Z", actor: "الإدارة العامة للتجارة الخارجية" }
    ]
  },
  {
    id: "sc-2",
    certificateNumber: "SD-EXP-APRV-2026-90214",
    category: "export_approval",
    titleAr: "رخصة وموافقة تصدير سلع ومحاصيل زراعية",
    titleEn: "Agricultural Crop Export Approval Permit",
    issuedTo: "شركة الخرطوم الموحدة لتصدير الصمغ العربي",
    detailsAr: "ترخيص رسمي لتصدير كميات من الصمغ العربي والمحاصيل الاستراتيجية لدول منطقة الكوميسا والاتحاد الأوروبي لموسم 2026 بمجموع قيمة تقديرية 8,000,000 ج.س.",
    detailsEn: "Official permit for exporting Gum Arabic and strategic crops to COMESA and EU zones for 2026 season up to an estimated value of 8,000,000 SDG.",
    signatureHash: "SD-SIG-SHA256-992a40bfd013e8d2491b2c39d04294b293c",
    verificationUrl: "https://sdmci.gov.sd/verify/SD-EXP-APRV-2026-90214",
    timestamp: "2026-07-02T12:00:00Z",
    auditTrail: [
      { actionAr: "تعبئة طلب رخصة تصدير تجارية", actionEn: "Applied for export commercial license", timestamp: "2026-07-01T12:00:00Z", actor: "ممثل الشركة" },
      { actionAr: "موافقة مدير إدارة الصادرات والتبادل البيني", actionEn: "Approval by Director of Export & Interoperability", timestamp: "2026-07-02T12:00:00Z", actor: "مدير الإدارة العامة" }
    ]
  },
  {
    id: "sc-3",
    certificateNumber: "SD-IMP-PRMT-2026-44129",
    category: "import_permit",
    titleAr: "تصريح استيراد أغذية ومواد خام أساسية",
    titleEn: "Sovereign Import Permit for Basic Commodities",
    issuedTo: "شركة سوبا للمواد الغذائية والاستيراد",
    detailsAr: "تصريح استيراد سلعة الأرز الأبيض والمواد الغذائية التموينية من جمهورية الهند عبر ميناء بورتسودان لصالح الأمن الغذائي القومي لعام 2026.",
    detailsEn: "Import permit for white rice and basic commodities from India through Port Sudan, supporting the national food security mission of 2026.",
    signatureHash: "SD-SIG-SHA256-118cf9421a92d8f9411cba10294fe71b",
    verificationUrl: "https://sdmci.gov.sd/verify/SD-IMP-PRMT-2026-44129",
    timestamp: "2026-07-03T12:00:00Z",
    auditTrail: [
      { actionAr: "طلب رخصة استيراد مواد أساسية", actionEn: "Requested basic materials import permit", timestamp: "2026-07-02T10:00:00Z", actor: "مدير الاستيراد" },
      { actionAr: "إجازة الفحص الفني والموافقة الاستيرادية", actionEn: "Technical screening and security clearance passed", timestamp: "2026-07-03T12:00:00Z", actor: "مسؤول قطاع الاستيراد" }
    ]
  }
];
