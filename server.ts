/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory & File-backed persistent Database to prevent state loss
const DB_FILE = path.join(process.cwd(), "database.json");

interface DBState {
  companies: any[];
  factories: any[];
  licenses: any[];
  certificates: any[];
  landApplications: any[];
  complaints: any[];
  invoices: any[];
  payments: any[];
  ledger: any[];
  refunds: any[];
  reconciliations: any[];
  gatewayLogs: any[];
  products: any[];
  recalls: any[];
  safetyAlerts: any[];
  priceRecords: any[];
  marketInspections: any[];
  consumerSurveys: any[];
  riskScores: any[];
  auditLedger: any[];
  documents: any[];
  correspondences: any[];
  archiveRecords: any[];
  knowledgeBase: any[];
  retentionPolicies: any[];
  govAuditLogs: any[];
  legalCases: any[];
  legalContracts: any[];
  legalOpinions: any[];
  legalRegulations: any[];
  legalCompliance: any[];
  legalRisks: any[];
  legalEnforcements: any[];
  employees: any[];
  orgUnits: any[];
  vacancies: any[];
  applications: any[];
  payrolls: any[];
  attendance: any[];
  leaves: any[];
  performance: any[];
  trainings: any[];
  talentPools: any[];
  hrAuditLogs: any[];
  assets: any[];
  facilities: any[];
  warehouses: any[];
  inventories: any[];
  fleetVehicles: any[];
  maintenanceWorkOrders: any[];
  spareParts: any[];
  assetKpis: any[];
  facilityKpis: any[];
  assetAuditLogs: any[];
  // Procurement & GRC
  suppliers: any[];
  procurementPlans: any[];
  tenders: any[];
  bids: any[];
  purchaseOrders: any[];
  procurementContracts: any[];
  supplierKpis: any[];
  procurementAuditLogs: any[];
  grcRisks: any[];
  grcControls: any[];
  grcPolicies: any[];
  grcAudits: any[];
  grcFindings: any[];
  grcCorrectiveActions: any[];
  grcComplianceRecords: any[];
  grcIncidents: any[];
  grcAuditLogs: any[];
  // Cybersecurity & Sovereign SOC
  secEvents: any[];
  secIncidents: any[];
  secThreatIntel: any[];
  secVulnerabilities: any[];
  secCertificates: any[];
  secPolicies: any[];
  secKpis: any[];
  secAuditLogs: any[];
  comBusinesses: any[];
  comLicenses: any[];
  openDatasets: any[];
  apiGatewayLogs: any[];
  observatoryMetrics: any[];
  comNotifications: any[];
}

const defaultDBState: DBState = {
  companies: [
    {
      id: "c-1",
      companyNameAr: "شركة النيل للمنتجات الغذائية المحدودة",
      companyNameEn: "Nile Food Products Co. Ltd",
      registrationNumber: "SD-2026-94829",
      activityType: "صناعات تحويلية غذائية وتعبئة",
      capital: 25000000,
      partners: ["عمر يوسف الفكي", "صالح محمد أحمد"],
      addressState: "الخرطوم",
      addressCity: "بحري المنطقة الصناعية",
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-02-15").toISOString(),
      updatedAt: new Date("2026-02-15").toISOString()
    },
    {
      id: "c-2",
      companyNameAr: "المؤسسة الوطنية لتطوير الصمغ العربي",
      companyNameEn: "National Gum Arabic Development Corp",
      registrationNumber: "SD-2026-10293",
      activityType: "تصدير المحاصيل النقدية والصناعية",
      capital: 100000000,
      partners: ["وزارة التجارة والصناعة (شراكة)", "المستثمر خالد بن سعيد"],
      addressState: "البحر الأحمر",
      addressCity: "بورتسودان",
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-03-01").toISOString(),
      updatedAt: new Date("2026-03-01").toISOString()
    }
  ],
  factories: [
    {
      id: "f-1",
      factoryName: "مصنع الخرطوم لتدوير النسيج الحديث",
      industrialSector: "textile",
      locationState: "الخرطوم",
      productionCapacity: "100,000 متر مربع شهرياً",
      energySource: "الشبكة القومية للكهرباء + مولدات طاقة شمسية مساندة",
      productionLinesCount: 4,
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-04-10").toISOString(),
      updatedAt: new Date("2026-04-10").toISOString(),
      inspectionStatus: "passed",
      lastInspectionDate: "2026-06-12"
    }
  ],
  licenses: [
    {
      id: "l-1",
      licenseType: "export",
      companyId: "c-2",
      companyName: "المؤسسة الوطنية لتطوير الصمغ العربي",
      goodsDescription: "الصمغ العربي السوداني الخام (الهشاب والطلح)",
      annualValueEstimate: 5000000,
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-05-02").toISOString(),
      updatedAt: new Date("2026-05-02").toISOString()
    }
  ],
  certificates: [
    {
      id: "cer-1",
      certificateNumber: "CO-SD-2026-5541",
      exporterName: "المؤسسة الوطنية لتطوير الصمغ العربي",
      importerName: "Al-Baraka Food Industries",
      importerCountry: "المملكة العربية السعودية",
      hsCode: "1301.90.10",
      goodsDescriptionAr: "صمغ عربي طبيعي نقي 100% درجة ممتازة",
      goodsDescriptionEn: "100% Pure Natural Gum Arabic Premium Grade",
      weightNet: 25000,
      weightGross: 25300,
      portOfLoading: "ميناء بورتسودان الجنوبي",
      portOfDischarge: "ميناء جدة الإسلامي",
      invoiceValue: 125000,
      currency: "USD",
      status: "approved",
      applicantId: "user-default",
      createdAt: new Date("2026-06-20").toISOString()
    }
  ],
  landApplications: [
    {
      id: "la-1",
      investorId: "user-default",
      investorName: "خالد بن سعيد",
      opportunityId: "opp-1",
      proposedProject: "مجمع متكامل لتصنيع وتعبئة عصائر المانجو والبلح السوداني",
      requestedAreaSqm: 15000,
      preferredIndustrialZone: "منطقة الباقير الصناعية",
      status: "approved",
      createdAt: new Date("2026-06-05").toISOString()
    }
  ],
  complaints: [
    {
      id: "comp-1",
      violationType: "price_gouging",
      storeName: "سوبرماركت البركة الحديث",
      state: "الخرطوم",
      city: "أم درمان",
      details: "زيادة غير مبررة في أسعار السكر والدقيق الوطني بنسبة 45% عن الأسعار المعلنة من الوزارة.",
      status: "investigating",
      createdAt: new Date("2026-07-01").toISOString(),
      investigationNotes: "تم توجيه مفتش حماية المستهلك بفرع أم درمان لزيارة الموقع ومراجعة فواتير الشراء للتأكد من تسعيرة المصانع."
    },
    {
      id: "comp-2",
      violationType: "expired_goods",
      storeName: "مستودع المشروبات الغازية بالمنطقة الصناعية",
      state: "البحر الأحمر",
      city: "بورتسودان",
      details: "تخزين وتوزيع عصائر ومشروبات منتهية الصلاحية منذ أكثر من شهر في ظروف تخزين سيئة وعالية الحرارة.",
      status: "resolved",
      createdAt: new Date("2026-07-05").toISOString(),
      investigationNotes: "تم ضبط ومصادرة الكميات المنتهية الصلاحية وإتلافها رسمياً بالتنسيق مع السلطات البلدية، وتحرير مخالفة مالية وغلق الموقع لمدة أسبوعين."
    }
  ],
  invoices: [
    {
      id: "INV-2026-071501",
      titleAr: "رسوم تأسيس شركة النيل للمنتجات الغذائية المحدودة",
      titleEn: "Incorporation Fees: Nile Food Products Co. Ltd",
      feeType: "company",
      amount: 150000,
      applicantName: "عمر يوسف الفكي",
      status: "paid",
      linkedServiceId: "c-1",
      qrCode: "https://verification.mof.gov.sd/verify/INV-2026-071501",
      digitalSignature: "sig_cb3a4d8ef091a12e340a82b9eefbcda38e2101",
      createdAt: "2026-07-14T10:00:00.000Z",
      paymentMethod: "debit_card",
      paymentDate: "2026-07-14T10:05:22.000Z"
    },
    {
      id: "INV-2026-071502",
      titleAr: "رسوم رخصة تصدير الصمغ العربي",
      titleEn: "Export License Fee: National Gum Arabic Development Corp",
      feeType: "license",
      amount: 250000,
      applicantName: "المستثمر خالد بن سعيد",
      status: "paid",
      linkedServiceId: "l-1",
      qrCode: "https://verification.mof.gov.sd/verify/INV-2026-071502",
      digitalSignature: "sig_ec4b901a88b901fcde98ffcda7102e342a8b",
      createdAt: "2026-07-15T02:30:00.000Z",
      paymentMethod: "bank_transfer",
      paymentDate: "2026-07-15T02:45:10.000Z"
    },
    {
      id: "INV-2026-071503",
      titleAr: "رسوم حجز اسم تجاري: سوبا للاستثمارات الزراعية",
      titleEn: "Trade Name reservation: Soba Agricultural Investments",
      feeType: "registration",
      amount: 15000,
      applicantName: "أمل عبد القادر الشريف",
      status: "pending",
      linkedServiceId: "cn-102",
      qrCode: "https://verification.mof.gov.sd/verify/INV-2026-071503",
      digitalSignature: "sig_fa98319eac89daeeffcda109e20a340b12",
      createdAt: "2026-07-15T05:22:11.000Z"
    },
    {
      id: "INV-2026-071504",
      titleAr: "غرامة تأخير تقديم تقرير المطابقة البيئية - مصنع تدوير النسيج",
      titleEn: "Environmental Non-Compliance Penalty - Textile Factory",
      feeType: "penalty",
      amount: 75000,
      applicantName: "مصنع الخرطوم لتدوير النسيج الحديث",
      status: "pending",
      linkedServiceId: "f-1",
      qrCode: "https://verification.mof.gov.sd/verify/INV-2026-071504",
      digitalSignature: "sig_da30129bcfe1a23801f9bda01feac34891b0",
      createdAt: "2026-07-15T06:15:00.000Z"
    }
  ],
  payments: [
    {
      id: "PAY-1002931",
      invoiceId: "INV-2026-071501",
      amount: 150000,
      method: "debit_card",
      gateway: "national_gateway",
      status: "captured",
      transactionId: "TXN-SUDPAY-9482103",
      token: "tok_visa_4242_9103",
      riskScore: 0.02,
      createdAt: "2026-07-14T10:05:22.000Z"
    },
    {
      id: "PAY-1002932",
      invoiceId: "INV-2026-071502",
      amount: 250000,
      method: "bank_transfer",
      gateway: "cbs_instant",
      status: "captured",
      transactionId: "TXN-CBSNET-3012911",
      token: "tok_bank_cbs_3011",
      riskScore: 0.01,
      createdAt: "2026-07-15T02:45:10.000Z"
    }
  ],
  ledger: [
    {
      id: "LED-90201",
      type: "credit",
      amount: 150000,
      account: "general_treasury",
      description: "تسوية رسوم تأسيس شركة النيل - INV-2026-071501",
      referenceId: "INV-2026-071501",
      createdAt: "2026-07-14T10:06:00.000Z"
    },
    {
      id: "LED-90202",
      type: "credit",
      amount: 250000,
      account: "general_treasury",
      description: "تسوية رسوم رخصة تصدير صمغ عربي - INV-2026-071502",
      referenceId: "INV-2026-071502",
      createdAt: "2026-07-15T02:46:00.000Z"
    }
  ],
  refunds: [
    {
      id: "REF-50201",
      invoiceId: "INV-2026-071501",
      amount: 30000,
      reason: "تعديل فئة رأس المال والشركاء مما تطلب استرجاع جزء من رسوم التدقيق المزدوج",
      requestedBy: "عمر يوسف الفكي",
      status: "pending_review",
      approvedBy: "",
      createdAt: "2026-07-15T04:12:00.000Z"
    }
  ],
  reconciliations: [
    {
      id: "REC-801",
      reconciledAt: "2026-07-15T01:00:00.000Z",
      periodStart: "2026-07-14T00:00:00.000Z",
      periodEnd: "2026-07-14T23:59:59.000Z",
      matchedCount: 18,
      unmatchedCount: 0,
      discrepancyAmount: 0,
      alerts: []
    }
  ],
  gatewayLogs: [
    {
      id: "LOG-30101",
      endpoint: "https://api.national-gateway.gov.sd/v1/charge",
      method: "POST",
      payload: "{\"amount\":150000,\"currency\":\"SDG\",\"card_token\":\"tok_visa_4242_9103\"}",
      response: "{\"status\":\"success\",\"tx_id\":\"TXN-SUDPAY-9482103\",\"code\":\"00\"}",
      statusCode: 200,
      createdAt: "2026-07-14T10:05:21.000Z"
    }
  ],
  products: [
    { id: "prod-1", name: "زيت طعام النخيل الممتاز", hsCode: "1511.90.00", category: "food", riskRating: "low", status: "certified", barcode: "6281000100104", manufacturer: "شركة النيل للمنتجات الغذائية المحدودة", createdAt: "2026-03-10T12:00:00Z" },
    { id: "prod-2", name: "حامض كبريتيك صناعي", hsCode: "2807.00.00", category: "chemical", riskRating: "high", status: "certified", barcode: "6281000100227", manufacturer: "مصنع الخرطوم للكيماويات", createdAt: "2026-04-05T09:30:00Z" },
    { id: "prod-3", name: "شاحن هاتف ذكي سريع 45 واط", hsCode: "8504.40.90", category: "electrical", riskRating: "medium", status: "pending", barcode: "6281000100340", manufacturer: "مستورد الإلكترونيات الوطنية", createdAt: "2026-07-10T11:15:00Z" }
  ],
  recalls: [
    { id: "rec-1", productName: "شاحن هاتف سريع طراز توربو", category: "electrical", hazard: "خطر ارتفاع مفرط في درجة الحرارة قد يؤدي إلى نشوب حريق", unitsSold: 1200, unitsRecalled: 940, status: "active", createdAt: "2026-06-15T08:00:00Z" },
    { id: "rec-2", productName: "مياه معبأة صحة ملوثة دفعة #B44", category: "food", hazard: "ارتفاع نسبة البكتيريا القولونية عن الحدود المسموح بها سيادياً", unitsSold: 5000, unitsRecalled: 4850, status: "completed", createdAt: "2026-07-02T10:00:00Z" }
  ],
  safetyAlerts: [
    { id: "alert-1", title: "تنبيه صحي: سحب شوكولاتة كاكاو مستوردة", category: "food", severity: "high", details: "احتمال تلوث دفعات محددة ببكتيريا السالمونيلا. يرجى التوقف عن تناولها فوراً.", date: "2026-07-12T09:00:00Z" },
    { id: "alert-2", title: "تحذير فني: غسالات صحون جنرال تسرب كهربائي", category: "electrical", severity: "medium", details: "تسرب تيار طفيف عند التلامس الرطب. يرجى مراجعة الوكيل لإصلاح العيب مجاناً.", date: "2026-07-08T14:30:00Z" }
  ],
  priceRecords: [
    { id: "pr-1", commodity: "wheat", state: "الخرطوم", price: 1200, date: "2026-07-15" },
    { id: "pr-2", commodity: "wheat", state: "البحر الأحمر", price: 1350, date: "2026-07-15" },
    { id: "pr-3", commodity: "sugar", state: "الخرطوم", price: 850, date: "2026-07-15" },
    { id: "pr-4", commodity: "sugar", state: "البحر الأحمر", price: 920, date: "2026-07-15" },
    { id: "pr-5", commodity: "oil", state: "الخرطوم", price: 2100, date: "2026-07-15" },
    { id: "pr-6", commodity: "oil", state: "الجزيرة", price: 1950, date: "2026-07-15" }
  ],
  marketInspections: [
    { id: "insp-1", storeName: "سوبرماركت البركة الحديث", location: "الخرطوم - أم درمان", inspectorName: "أحمد منصور الفاضل", date: "2026-07-03T10:15:00Z", result: "warning_issued", notes: "تم العثور على زيادة طفيفة في تسعيرة الزيت وتوجيه إنذار كتابي رسمي مع ربط الملف بالسجل التجاري رقم SD-2026-94829." },
    { id: "insp-2", storeName: "مستودع المشروبات الغازية بالمنطقة الصناعية", location: "البحر الأحمر - بورتسودان", inspectorName: "خالد يوسف العبيد", date: "2026-07-06T11:00:00Z", result: "fine_issued", notes: "تم تأكيد وجود سلع منتهية الصلاحية ومصادرتها، وتم تحرير غرامة مالية رقمية بقيمة 75,000 جنيه سوداني عبر الفاتورة INV-2026-071504." }
  ],
  consumerSurveys: [
    { id: "srv-1", complaintId: "comp-2", rating: 5, comments: "سرعة استجابة مذهلة وحسم رادع للمخالفين. شكراً لحماية المستهلك بالوزارة.", date: "2026-07-07T12:00:00Z" }
  ],
  riskScores: [
    { id: "risk-1", state: "الخرطوم", score: 65, status: "medium", lastCalculated: "2026-07-14T20:00:00Z" },
    { id: "risk-2", state: "البحر الأحمر", score: 42, status: "low", lastCalculated: "2026-07-14T20:00:00Z" },
    { id: "risk-3", state: "الجزيرة", score: 78, status: "high", lastCalculated: "2026-07-14T20:00:00Z" }
  ],
  auditLedger: [
    { id: "aud-1", actionAr: "تلقي بلاغ حماية المستهلك رقم comp-1", actionEn: "Consumer complaint comp-1 received", actorName: "بوابة الجمهور", actorRole: "citizen", timestamp: "2026-07-01T08:12:00Z", hash: "4a7f921bc9e120daee45fa9bc01a2f90efc23b30" },
    { id: "aud-2", actionAr: "إجراء تفتيش ميداني وتحرير مخالفة للشكوى comp-2", actionEn: "Field inspection & fine issued for comp-2", actorName: "خالد يوسف العبيد", actorRole: "inspector", timestamp: "2026-07-06T11:30:00Z", hash: "bf280319caee92bcfda120e340aef129fc2301fe" }
  ],
  documents: [
    {
      id: "DOC-2026-001",
      title: "القرار الوزاري رقم 14 لتنظيم معايير فرز الصمغ العربي وتصديره",
      titleEn: "Ministerial Decree No.14 for Regulating Gum Arabic Sorting & Export",
      fileType: "pdf",
      classification: "confidential",
      version: "1.2",
      size: "2.4 MB",
      ownerName: "د. عبد السلام حسن",
      ownerRole: "Department Manager",
      department: "الصناعات الزراعية والغابات",
      retentionPeriodYears: 10,
      createdAt: "2026-05-15T09:00:00Z",
      tags: ["الصمغ العربي", "معايير التصدير", "القرار 14", "الكوميسا"],
      isSigned: true,
      signatureHash: "sig_f92b702fa1c9d83eb01cde9bc028a301a9df"
    },
    {
      id: "DOC-2026-002",
      title: "دليل حوافز الشركات الناشئة وشهادات المطابقة للمشاريع الصغيرة والمتوسطة",
      titleEn: "SME Incentive Guidelines & Compliance Certification Handbook",
      fileType: "pdf",
      classification: "public",
      version: "2.0",
      size: "4.1 MB",
      ownerName: "أ. منى صلاح الجعلي",
      ownerRole: "Director",
      department: "تطوير المشاريع الصغيرة والمتوسطة",
      retentionPeriodYears: 5,
      createdAt: "2026-06-10T11:30:00Z",
      tags: ["SMEs", "المشاريع الناشئة", "دليل المطابقة", "حوافز الاستثمار"],
      isSigned: true,
      signatureHash: "sig_cc1b901fcde98ffcda7102e342a8b30a1df2"
    },
    {
      id: "DOC-2026-003",
      title: "المخطط الهيكلي للبنية التحتية لمنطقة الباقير الصناعية الجديدة 2035",
      titleEn: "Master Plan for Infrastructure of New El Bagair Industrial Zone 2035",
      fileType: "dwg",
      classification: "secret",
      version: "3.5",
      size: "18.7 MB",
      ownerName: "م. عثمان صالح الجزولي",
      ownerRole: "Undersecretary",
      department: "التنمية الصناعية والمناطق الاستثمارية",
      retentionPeriodYears: 15,
      createdAt: "2026-07-02T14:15:00Z",
      tags: ["الباقير", "المخطط الهيكلي", "المناطق الصناعية", "خرائط فنية"],
      isSigned: false
    }
  ],
  correspondences: [
    {
      id: "CORR-2026-1049",
      referenceNumber: "SD/MCI/MIN/2026/1049",
      subject: "طلب تخصيص أراضٍ استثمارية إضافية لصالح مجمع تعبئة الزيوت النباتية ببورتسودان",
      subjectEn: "Allocation Request for Extra Investment Lands for Oil Packaging in Port Sudan",
      correspondenceType: "incoming",
      sender: "وزارة المالية والتخطيط الاقتصادي السودانية",
      recipient: "ديوان وزير التجارة والصناعة",
      digitalSignature: "sig_min_fin_9012cdbf3e0a12e340a82b9eefbc",
      qrCode: "https://verification.mof.gov.sd/verify/CORR-1049",
      priority: "high",
      classificationLevel: "confidential",
      status: "under_review",
      createdAt: "2026-07-12T08:30:00Z"
    },
    {
      id: "CORR-2026-1050",
      referenceNumber: "SD/MCI/OUT/2026/1050",
      subject: "مذكرة التفاهم الحكومية المشتركة لتسريع الصادرات الصناعية مع دول الجوار والكوميسا",
      subjectEn: "Joint Government MOU to Accelerate Industrial Exports with COMESA",
      correspondenceType: "outgoing",
      sender: "وزارة التجارة والصناعة الاتحادية",
      recipient: "الأمانة العامة للكوميسا ومصلحة الجمارك",
      digitalSignature: "sig_mci_minister_883a91bc7dfa2340b82cf7da124e",
      qrCode: "https://verification.mof.gov.sd/verify/CORR-1050",
      priority: "immediate",
      classificationLevel: "secret",
      status: "approved",
      createdAt: "2026-07-14T11:00:00Z"
    },
    {
      id: "CORR-2026-1051",
      referenceNumber: "SD/MCI/INT/2026/1051",
      subject: "منشور إداري بتسريع التحول الرقمي الكامل والتحول الورقي الصفري بجميع القطاعات",
      subjectEn: "Administrative Circular: Accelerating Full Digital Transition and Paperless Strategy",
      correspondenceType: "internal",
      sender: "مكتب السيد وكيل الوزارة",
      recipient: "مدراء الإدارات العامة والأقسام الفنية",
      digitalSignature: "sig_mci_undersec_2035bc9a12c8df0289aefcda192b",
      qrCode: "https://verification.mof.gov.sd/verify/CORR-1051",
      priority: "normal",
      classificationLevel: "public",
      status: "distributed",
      createdAt: "2026-07-15T07:45:00Z"
    }
  ],
  archiveRecords: [
    {
      id: "ARC-2026-001",
      originalDocId: "DOC-2026-001",
      title: "القرار الوزاري رقم 14 لتنظيم معايير فرز الصمغ العربي وتصديره",
      archivedBy: "البروفيسور عوض الله عمر",
      archivedAt: "2026-05-16T12:00:00Z",
      retentionUntil: "2036-05-15T00:00:00Z",
      immutableHash: "sha256_d89f02931a0e8839cb230f898124da01f3012bc0fcd3938491bc9a928edcf91a",
      classification: "confidential",
      status: "active_retention"
    },
    {
      id: "ARC-2026-002",
      originalDocId: "DOC-2026-002",
      title: "دليل حوافز الشركات الناشئة وشهادات المطابقة للمشاريع الصغيرة والمتوسطة",
      archivedBy: "أ. ليلى حسن الجزولي",
      archivedAt: "2026-06-11T13:45:00Z",
      retentionUntil: "2031-06-10T00:00:00Z",
      immutableHash: "sha256_918fc3b028da39bbfcd7103ba928ecda340aef129fc2301fed890aef9384bc7d",
      classification: "public",
      status: "active_retention"
    }
  ],
  knowledgeBase: [
    {
      id: "KB-101",
      titleAr: "لائحة الفحص الموحدة للعلامات التجارية وبراءات الاختراع لجمهورية السودان",
      titleEn: "Unified Inspection Regulations for Trademarks & Patents in Sudan",
      category: "policy",
      content: "تتضمن هذه السياسة الخطوات المعيارية والمدد المعتمدة لفحص وإقرار الأصول الابتكارية، والاشتراطات الهندسية والقانونية المطلوبة لمطابقة قاعدة بيانات الكوميسا والاتفاقيات الدولية للملكية الفكرية.",
      version: "3.2",
      lastUpdated: "2026-01-20T10:00:00Z"
    },
    {
      id: "KB-102",
      titleAr: "دليل إجراءات توطين وتأسيس الشركات الصناعية الأجنبية والمحلية",
      titleEn: "Standard Procedure Manual for Localizing & Incorporating Industrial Firms",
      category: "procedure",
      content: "الدليل الفني المعتمد لتوضيح تتابع الخطوات بين السجل التجاري، منصة التراخيص الفيدرالية، التقييم البيئي من وزارة البيئة، والربط مع بوابة الجباية والدفع الإلكتروني الموحد لضمان التأسيس الورقي الصفري في أقل من 24 ساعة.",
      version: "4.0",
      lastUpdated: "2026-03-15T14:30:00Z"
    },
    {
      id: "KB-103",
      titleAr: "قانون تيسير وتطوير التجارة الإلكترونية الرقمية للشركات الناشئة والمخترعين 2026",
      titleEn: "Digital E-Commerce Facilitation & Startup Growth Act 2026",
      category: "legal_reference",
      content: "الإطار التنظيمي المصدق من مجلس الوزراء لتمكين المخترعين السودانيين ورواد الأعمال من استخدام وتداول سندات الملكية الفكرية كأصول مالية قابلة للرهن والتمويل الفوري عبر صندوق الابتكار القومي.",
      version: "1.0",
      lastUpdated: "2026-05-02T09:15:00Z"
    }
  ],
  retentionPolicies: [
    { id: "POL-1", category: "وزارية وسيادية", retentionYears: 15, dispositionAction: "permanent_archive" },
    { id: "POL-2", category: "تراخيص وسجلات تجارية", retentionYears: 10, dispositionAction: "review" },
    { id: "POL-3", category: "بلاغات وشكاوى الجمهور", retentionYears: 5, dispositionAction: "destroy" },
    { id: "POL-4", category: "دراسات ومخططات هندسية", retentionYears: 25, dispositionAction: "permanent_archive" }
  ],
  govAuditLogs: [
    {
      id: "GLOG-001",
      eventType: "document_creation",
      descriptionAr: "إنشاء القرار الوزاري رقم 14 وتدوينه في السجل الرقمي",
      descriptionEn: "Created Ministerial Decree No.14 and logged into register",
      actorName: "د. عبد السلام حسن",
      actorRole: "Department Manager",
      timestamp: "2026-05-15T09:00:00Z",
      documentId: "DOC-2026-001",
      systemHash: "g_hash_901cdaef20138cfba1209bcaee8812c"
    },
    {
      id: "GLOG-002",
      eventType: "digital_signature",
      descriptionAr: "التوقيع الرقمي السيادي المتعدد على المذكرة الحكومية رقم 1050 من قبل وزير التجارة والصناعة",
      descriptionEn: "Multi-level sovereign digital signing of MOU 1050 by Minister",
      actorName: "ديوان وزير التجارة والصناعة",
      actorRole: "Minister",
      timestamp: "2026-07-14T11:00:00Z",
      documentId: "CORR-2026-1050",
      systemHash: "g_hash_fcaef8902cd721aee45fa9b110e34b9"
    }
  ],
  legalCases: [
    {
      id: "case-001",
      titleAr: "نزاع حول تصنيف الرسوم الجمركية على الصادرات للصمغ العربي الممتاز",
      titleEn: "Export Duty Tariff Classification Dispute for Premium Arabic Gum Grade-A",
      type: "commercial",
      status: "active_hearing",
      court: "المحكمة التجارية الاتحادية بورتسودان",
      plaintiff: "شركة النيل للمنتجات الغذائية المحدودة",
      defendant: "هيئة الجمارك ومصلحة الضرائب الاتحادية",
      deadlines: "2026-07-28 (تقديم مذكرات الدفاع الختامية)",
      hearings: [
        { id: "h-1", date: "2026-06-15", resultAr: "قبول الاستئناف شكلاً وطلب فحص عينات الشحنة من المختبر السيادي", resultEn: "Appeal accepted in form; ordered lab testing of samples" },
        { id: "h-2", date: "2026-07-20", resultAr: "جلسة المرافعة الشفوية الختامية وتقديم تقرير خبير المطابقة", resultEn: "Final oral arguments and presentation of conformity expert report" }
      ],
      evidence: [
        { id: "e-1", nameAr: "تقرير الهيئة السودانية للمواصفات والمقاييس رقم 8829", nameEn: "Sudanese Standards & Metrology Org Report #8829" },
        { id: "e-2", nameAr: "الفاتورة التجارية الموقعة رقمياً INV-2026-071502", nameEn: "Digitally signed commercial invoice INV-2026-071502" }
      ],
      judgment: "",
      enforcementStatus: "pending_judgment"
    },
    {
      id: "case-002",
      titleAr: "طعن إداري ضد قرار الإيقاف المؤقت لوحدة التعبئة القديمة",
      titleEn: "Administrative Appeal against Temporary Suspension of Old Packaging Unit",
      type: "administrative",
      status: "decided",
      court: "دائرة الطعون الإدارية بالمحكمة العليا الخرطوم",
      plaintiff: "مستودع المشروبات الغازية بالمنطقة الصناعية",
      defendant: "إدارة الإصحاح البيئي وحماية المستهلك بالوزارة",
      deadlines: "انتهت الآجال - صدر الحكم الختامي",
      hearings: [
        { id: "h-1", date: "2026-07-08", resultAr: "تأجيل للنظر في تقرير معالجة النفايات وتركيب فلاتر تنقية الهواء", resultEn: "Postponed to review waste-treatment filter installation" }
      ],
      evidence: [
        { id: "e-1", nameAr: "تقرير المخالفة المحرر عبر مفتش التفتيش الذكي رقم insp-2", nameEn: "Violation report from smart inspector #insp-2" }
      ],
      judgment: "تأييد قرار الوزارة بالإغلاق المؤقت لحين إتمام تركيب نظام الفلترة المزدوجة المتوافق مع الكوميسا.",
      enforcementStatus: "enforced"
    },
    {
      id: "case-003",
      titleAr: "تحكيم دولي بشأن حدود الأراضي الاستثمارية في الباقير",
      titleEn: "International Investment Arbitration on El Bagair Industrial Land boundaries",
      type: "arbitration",
      status: "arbitration",
      court: "مركز الخرطوم للتحكيم التجاري الدولي بموجب معاهدة الكوميسا",
      plaintiff: "المستثمر خالد بن سعيد والشريك الأجنبي",
      defendant: "وزارة الاستثمار والتنمية الصناعية والجهة المشغلة للمنطقة",
      deadlines: "2026-08-15 (جلسة استماع الشهود والمساحين)",
      hearings: [
        { id: "h-1", date: "2026-05-10", resultAr: "تعيين هيئة التحكيم الثلاثية برئاسة بروفيسور عوض الله عمر", resultEn: "Appointed three-member arbitration panel chaired by Prof. Awadallah" }
      ],
      evidence: [
        { id: "e-1", nameAr: "نسخة مصدقة رقمياً من مخطط الباقير الهيكلي 2035 - DOC-2026-003", nameEn: "Certified digital copy of El Bagair Master Plan - DOC-2026-003" }
      ],
      judgment: "",
      enforcementStatus: "pending_arbitration"
    }
  ],
  legalContracts: [
    {
      id: "contract-001",
      titleAr: "عقد الشراكة بين القطاعين العام والخاص لبناء مركز الباقير اللوجستي المبرد",
      titleEn: "PPP Agreement for Construction of El Bagair Solar Cold-Storage Hub",
      type: "ppp",
      status: "executed",
      parties: "وزارة التجارة والصناعة (الطرف الأول) وشركة سوبا للاستثمارات الزراعية (الطرف الثاني)",
      value: 125000000,
      approvalWorkflow: [
        { role: "Legal Officer", name: "أ. ماجدة الطيب", status: "approved", date: "2026-06-15" },
        { role: "Financial Reviewer", name: "أ. طارق عبد الوهاب", status: "approved", date: "2026-06-18" },
        { role: "Director of Legal Affairs", name: "د. سارة عثمان البشير", status: "approved", date: "2026-06-20" },
        { role: "Minister", name: "ديوان السيد الوزير", status: "approved", date: "2026-06-22" }
      ],
      digitalSignature: "sig_contract_948210abcdeeefda2026ff",
      expiryDate: "2036-06-22",
      amendments: []
    },
    {
      id: "contract-002",
      titleAr: "امتياز تشغيل مجمع معالجة وتصدير الصمغ العربي بميناء بورتسودان",
      titleEn: "Gum Arabic Processing Concession Contract inside Port Sudan Terminal",
      type: "investment",
      status: "draft",
      parties: "وزارة التجارة والصناعة والمستثمر خالد بن سعيد بالتنسيق مع هيئة الموانئ البحرية",
      value: 320000000,
      approvalWorkflow: [
        { role: "Legal Officer", name: "أ. ماجدة الطيب", status: "approved", date: "2026-07-12" },
        { role: "Financial Reviewer", name: "أ. طارق عبد الوهاب", status: "pending", date: "" },
        { role: "Director of Legal Affairs", name: "د. سارة عثمان البشير", status: "pending", date: "" }
      ],
      digitalSignature: "",
      expiryDate: "2041-07-12",
      amendments: []
    },
    {
      id: "contract-003",
      titleAr: "اتفاقية توريد دولية للسلع النقدية السودانية إلى أسواق دول الكوميسا",
      titleEn: "COMESA International Trade & Supply Agreement for Cash Crops",
      type: "international",
      status: "review_financial",
      parties: "المؤسسة الوطنية لتطوير الصمغ العربي وهيئة التجارة البينية في كينيا ورواندا",
      value: 85000000,
      approvalWorkflow: [
        { role: "Legal Officer", name: "أ. ماجدة الطيب", status: "approved", date: "2026-07-05" },
        { role: "Financial Reviewer", name: "أ. طارق عبد الوهاب", status: "approved", date: "2026-07-10" },
        { role: "Director of Legal Affairs", name: "د. سارة عثمان البشير", status: "pending", date: "" }
      ],
      digitalSignature: "",
      expiryDate: "2029-07-10",
      amendments: []
    }
  ],
  legalOpinions: [
    {
      id: "opinion-001",
      requestTitleAr: "طلب فتوى قانونية بخصوص إعفاء الآلات الذكية للمنشآت الناشئة من الرسوم الجمركية والضرائب",
      requestTitleEn: "Legal Consultation Request: Customs Exemption on Smart Industrial Machinery for SMEs",
      requester: "أ. منى صلاح الجعلي (إدارة المشاريع الصغيرة والمتوسطة)",
      status: "issued",
      opinionSummaryAr: "يجوز قانوناً بموجب المادة 9 من قانون تيسير التجارة الإلكترونية لعام 2026 منح إعفاءات كاملة ومؤقتة للأجهزة التقنية المستوردة للمشاريع الناشئة متى ما ثبت مساهمتها في نقل التكنولوجيا.",
      opinionSummaryEn: "SMEs qualify under Section 9 of E-Commerce Act 2026 for complete provisional customs exemption if the machinery is certified for high-tech transfer.",
      analyst: "د. سارة عثمان البشير (مدير الشؤون القانونية)",
      date: "2026-07-08"
    },
    {
      id: "opinion-002",
      requestTitleAr: "مدى مشروعية استخدام سندات براءات الاختراع والملكية الفكرية كرهن للتمويل المصرفي",
      requestTitleEn: "Validity of Patent and IP Certificates as Collateral for Bank Loans",
      requester: "صندوق الابتكار القومي بموجب طلب بنك السودان المركزي",
      status: "issued",
      opinionSummaryAr: "قانون المعاملات الرقمية ولائحة براءات الاختراع السودانية لعام 2026 يدعمان بالكامل استخدام السند الرقمي الموثق بسجل الوزارة كضمان مالي رسمي ومقبول للمصارف لتمويل المشاريع.",
      opinionSummaryEn: "Sudan E-Transactions Act and Patent Regulations 2026 fully authorize using registered digital patent certificates as legal banking collateral.",
      analyst: "أ. ماجدة الطيب (باحث قانوني أول)",
      date: "2026-07-14"
    }
  ],
  legalRegulations: [
    {
      id: "reg-001",
      titleAr: "قانون التحكيم التجاري والوساطة لجمهورية السودان لعام 2026",
      titleEn: "Sudan Commercial Arbitration & Mediation Code 2026",
      category: "laws",
      status: "published",
      effectiveDate: "2026-01-01",
      expirationDate: "دائم",
      versionHistory: [
        { version: "1.0", date: "2026-01-01", notesAr: "الإصدار المعتمد بمرسوم دستوري رئاسي", notesEn: "Ratified by Federal Decree" }
      ],
      publicConsultationStatus: "completed",
      hasAmendments: false
    },
    {
      id: "reg-002",
      titleAr: "القرار الوزاري رقم 45 الخاص بمعايير بطاقات البيانات الغذائية وحظر التلاعب بأسعار دقيق القمح الموحد",
      titleEn: "Ministerial Order #45: Mandatory Food Labeling & Price Cap of Standard Wheat Flour",
      category: "ministerial_decisions",
      status: "published",
      effectiveDate: "2026-07-01",
      expirationDate: "دائم لحين صدور تعديل",
      versionHistory: [
        { version: "1.0", date: "2026-07-01", notesAr: "توجيه وزاري فوري لمكافحة الاحتكار في ظل التذبذب العالمي", notesEn: "Immediate anti-monopoly directive" }
      ],
      publicConsultationStatus: "not_required",
      hasAmendments: false
    },
    {
      id: "reg-003",
      titleAr: "مسودة اللائحة التنفيذية لترخيص وتمويل مشاريع الطاقة الشمسية في المناطق الاستثمارية بجمهورية السودان",
      titleEn: "Draft Executive Rules for Licensing Solar Projects in Industrial Zones",
      category: "executive_regulations",
      status: "public_consultation",
      effectiveDate: "مسودة قيد المراجعة",
      expirationDate: "-",
      versionHistory: [
        { version: "0.8 (مسودة)", date: "2026-07-10", notesAr: "طرح للاستشارة العامة وأخذ مرئيات المستثمرين", notesEn: "Released for stakeholder and investor feedback" }
      ],
      publicConsultationStatus: "active",
      hasAmendments: true
    }
  ],
  legalCompliance: [
    {
      id: "comp-rec-001",
      targetNameAr: "شركة النيل للمنتجات الغذائية المحدودة",
      targetNameEn: "Nile Food Products Co. Ltd",
      category: "commercial_laws",
      score: 98,
      status: "compliant",
      lastChecked: "2026-07-12",
      violationsCount: 0,
      notesAr: "ملتزمة بالكامل بالاشتراطات القانونية وقدمت التقرير السنوي والشهادات المعتمدة.",
      notesEn: "Fully compliant with legal requirements; annual reports and certificates submitted."
    },
    {
      id: "comp-rec-002",
      targetNameAr: "مصنع الخرطوم لتدوير النسيج الحديث",
      targetNameEn: "Khartoum Modern Textile Recycling Factory (f-1)",
      category: "industrial_regulations",
      score: 62,
      status: "non_compliant",
      lastChecked: "2026-07-15",
      violationsCount: 1,
      notesAr: "تم إصدار غرامة مالية غير مدفوعة (INV-2026-071504) لتأخر تقديم شهادة المطابقة البيئية.",
      notesEn: "Unpaid non-compliance fine (INV-2026-071504) for late environment verification certification."
    }
  ],
  legalRisks: [
    {
      id: "risk-001",
      titleAr: "مخاطر تداخل الأراضي ونزاعات الإحداثيات بمحيط مجمع الباقير",
      titleEn: "El Bagair Industrial Zone Plot Boundary & Land Registration Claims",
      category: "property_disputes",
      score: 85,
      severity: "high",
      mitigationPlanAr: "تسجيل الأراضي فوري عبر الشبكة الفيدرالية والمصادقة على المخطط الهيكلي السيادي 2035.",
      mitigationPlanEn: "Instant land registration through Federal Network and sovereign 2035 Master Plan approval.",
      status: "mitigated_active"
    },
    {
      id: "risk-002",
      titleAr: "عدم تفعيل الربط الرقمي للجمارك في المعابر الحدودية غير الرئيسية للصادرات",
      titleEn: "Outdated customs inspection integration in remote border checkposts",
      category: "regulatory_gap",
      score: 45,
      severity: "medium",
      mitigationPlanAr: "توسيع نطاق منصة التفتيش والإنفاذ الذكي مع توفير أجهزة اتصال فضائي مؤمنة للمفتشين.",
      mitigationPlanEn: "Expand Smart Inspection with satellite secure tablets for remote border checkpoints.",
      status: "mitigating"
    }
  ],
  legalEnforcements: [
    {
      id: "enf-001",
      targetNameAr: "سوبرماركت البركة الحديث",
      targetNameEn: "Al-Baraka Modern Supermarket",
      violationType: "price_gouging",
      penaltyAr: "إنذار كتابي رسمي وتعهد ملزم بعدم تكرار التلاعب بأسعار دقيق القمح الموحد",
      penaltyEn: "Written warning notice with legal undertaking to abide by flour price caps",
      status: "resolved",
      linkedModule: "Consumer Protection & Inspection (insp-1)",
      date: "2026-07-03"
    },
    {
      id: "enf-002",
      targetNameAr: "مصنع الخرطوم لتدوير النسيج الحديث",
      targetNameEn: "Khartoum Modern Textile Recycling Factory (f-1)",
      violationType: "expired_goods_or_non_compliance",
      penaltyAr: "غرامة مالية 75,000 جنيه سوداني (الفاتورة INV-2026-071504) مع إنذار بالإيقاف النهائي للخط رقم 3 خلال 10 أيام",
      penaltyEn: "Fine of SDG 75,000 (Invoice INV-2026-071504) with formal 10-day line-3 suspension notice",
      status: "appeal_pending",
      linkedModule: "Industrial Licensing & Smart Inspection",
      date: "2026-07-15"
    }
  ],
  employees: [
    {
      id: "emp-001",
      nationalEmployeeId: "SD-HR-94821",
      nameAr: "أحمد الطيب محمد",
      nameEn: "Ahmed El-Tayeb Mohamed",
      email: "ahmed.tayeb@sdmci.gov.sd",
      nationalId: "192083102911",
      phone: "+249 912 345 678",
      department: "الشؤون الإدارية والمالية",
      section: "إدارة الموارد البشرية",
      position: "مدير الموارد البشرية",
      grade: "الأولى",
      hireDate: "2020-03-15",
      status: "active",
      basicSalary: 350000,
      allowances: { transport: 40000, housing: 80000, natureOfWork: 50000 },
      deductions: { tax: 15000, socialInsurance: 27000 },
      bankName: "بنك الخرطوم",
      bankAccount: "SD82BOK0010023456789",
      costCenter: "CC-HR-101",
      role: "HR Officer"
    },
    {
      id: "emp-002",
      nationalEmployeeId: "SD-HR-94822",
      nameAr: "سارة عثمان البشير",
      nameEn: "Sara Osman Al-Bashir",
      email: "sara.osman@sdmci.gov.sd",
      nationalId: "285094102933",
      phone: "+249 123 456 789",
      department: "الشؤون القانونية",
      section: "إدارة القضايا والتشريعات",
      position: "مدير الشؤون القانونية",
      grade: "الخاصة",
      hireDate: "2018-05-10",
      status: "active",
      basicSalary: 550000,
      allowances: { transport: 50000, housing: 120000, natureOfWork: 80000 },
      deductions: { tax: 25000, socialInsurance: 42000 },
      bankName: "بنك أم درمان الوطني",
      bankAccount: "SD94ONB0030012345678",
      costCenter: "CC-LEGAL-201",
      role: "Performance Manager"
    },
    {
      id: "emp-003",
      nationalEmployeeId: "SD-HR-94823",
      nameAr: "مأمون عبد القادر الشريف",
      nameEn: "Mamoun Abdelgadir Al-Sharif",
      email: "mamoun.sharif@sdmci.gov.sd",
      nationalId: "189102931021",
      phone: "+249 905 112 233",
      department: "الرقابة وحماية المستهلك",
      section: "قسم التفتيش والإنفاذ",
      position: "مفتش تجاري أول",
      grade: "الثالثة",
      hireDate: "2021-11-01",
      status: "active",
      basicSalary: 280000,
      allowances: { transport: 40000, housing: 60000, natureOfWork: 40000 },
      deductions: { tax: 10000, socialInsurance: 21000 },
      bankName: "بنك فيصل الإسلامي",
      bankAccount: "SD33FIB0040098765432",
      costCenter: "CC-INSPECT-301",
      role: "Employee"
    }
  ],
  orgUnits: [
    {
      id: "unit-1",
      nameAr: "ديوان الوزير",
      nameEn: "Office of the Minister",
      type: "office",
      parent: null,
      manager: "السيد الوزير"
    },
    {
      id: "unit-2",
      nameAr: "وكالة الوزارة",
      nameEn: "Undersecretary Office",
      type: "office",
      parent: "unit-1",
      manager: "م. عثمان صالح الجزولي"
    },
    {
      id: "unit-3",
      nameAr: "الإدارة العامة للشؤون الإدارية والمالية",
      nameEn: "General Directorate of Admin & Finance",
      type: "directorate",
      parent: "unit-2",
      manager: "د. عبد السلام حسن"
    },
    {
      id: "unit-4",
      nameAr: "إدارة الموارد البشرية والتدريب",
      nameEn: "Human Resources & Training Directorate",
      type: "department",
      parent: "unit-3",
      manager: "أحمد الطيب محمد"
    }
  ],
  vacancies: [
    {
      id: "vac-101",
      titleAr: "محلل بيانات ذكاء الأعمال المساعد",
      titleEn: "Assistant BI Data Analyst",
      department: "ذكاء الأعمال ودعم القرار",
      grade: "السادسة",
      salaryRange: "250,000 - 300,000 SDG",
      status: "active",
      postedDate: "2026-07-01",
      applicationsCount: 14,
      requirementsAr: "بكالوريوس تقنية معلومات أو إحصاء، خبرة سنة في كتابة استعلامات SQL وأدوات Recharts/BI"
    }
  ],
  applications: [
    {
      id: "app-201",
      vacancyId: "vac-101",
      nameAr: "إيناس تاج السر الفاضل",
      nameEn: "Enas Taj El-Sir Al-Fadil",
      email: "enas.fadil@gmail.com",
      phone: "+249 114 882 233",
      cvUrl: "/files/cv_enas_fadil.pdf",
      status: "interviewed",
      interviewScore: 88,
      assessmentScore: 85,
      notes: "ممتازة في التحليل الإحصائي ولديها خلفية عن بيئة العمل الحكومي."
    }
  ],
  payrolls: [
    {
      id: "pay-2026-06",
      period: "2026-06",
      totalBasic: 1180000,
      totalAllowances: 480000,
      totalDeductions: 140000,
      netAmount: 1520000,
      status: "approved",
      approvals: [
        { role: "Payroll Officer", name: "أ. منى صلاح الجعلي", status: "submitted", date: "2026-06-25" },
        { role: "Financial Auditor", name: "أ. طارق عبد الوهاب", status: "verified", date: "2026-06-26" },
        { role: "HR Director", name: "أحمد الطيب محمد", status: "approved", date: "2026-06-27" }
      ]
    }
  ],
  attendance: [
    {
      id: "att-001",
      employeeId: "emp-003",
      date: "2026-07-15",
      checkIn: "08:05:12",
      checkOut: "15:30:22",
      status: "present",
      method: "fingerprint",
      gpsCoords: { lat: 15.5007, lng: 32.5599 }
    },
    {
      id: "att-002",
      employeeId: "emp-001",
      date: "2026-07-15",
      checkIn: "08:12:45",
      checkOut: "15:45:00",
      status: "present",
      method: "mobile",
      gpsCoords: { lat: 15.5900, lng: 32.5300 }
    }
  ],
  leaves: [
    {
      id: "leave-501",
      employeeId: "emp-001",
      type: "annual",
      startDate: "2026-08-01",
      endDate: "2026-08-15",
      days: 15,
      reason: "الإجازة السنوية العادية للاستجمام",
      status: "approved"
    }
  ],
  performance: [
    {
      id: "perf-601",
      employeeId: "emp-003",
      period: "2025",
      kpiScore: 89,
      competencyScore: 85,
      feedback: "أداء ممتاز في جولات التفتيش الميدانية ومتابعة بلاغات المستهلكين بحزم.",
      finalRating: "A",
      recommendedAction: "promotion",
      evaluatorId: "emp-002"
    }
  ],
  trainings: [
    {
      id: "trn-701",
      titleAr: "دورة النزاهة وحوكمة السجلات الحكومية",
      titleEn: "Governance & Integrity in Public Records",
      startDate: "2026-06-10",
      endDate: "2026-06-14",
      status: "completed",
      attendees: ["emp-001", "emp-003"],
      instructor: "بروفيسور عوض الله عمر"
    }
  ],
  talentPools: [
    {
      id: "pool-801",
      nameAr: "برنامج إعداد القيادات التنفيذية الشابة",
      nameEn: "Young Executive Leadership Track",
      candidates: [
        { employeeId: "emp-003", readiness: "ready_1_2_years", potential: "high" }
      ]
    }
  ],
  hrAuditLogs: [
    {
      id: "hrl-901",
      timestamp: "2026-07-15T09:00:00Z",
      actor: "أحمد الطيب محمد",
      actionAr: "اعتماد مسودة الهيكل التنظيمي لفرع بورتسودان الجديد",
      actionEn: "Approved the new organizational structure for Port Sudan Branch",
      details: "تثبيت 4 وظائف مفتشين وجدول الرواتب",
      hash: "sha256_df023bdfacbe912ac82b9e82103fbc829"
    }
  ],
  assets: [
    {
      id: "ast-1",
      nationalId: "SD-NAI-2026-0001",
      nameAr: "خوادم الحوسبة السحابية الفيدرالية - مركز البيانات الرئيسي",
      nameEn: "Federal Cloud Compute Clusters - Primary Data Center",
      classificationAr: "أجهزة حاسوب وخوادم وشبكات",
      classificationEn: "Computers, Servers & Networks",
      ownerDepartmentAr: "إدارة التحول الرقمي ونظم المعلومات",
      ownerDepartmentEn: "Digital Transformation & IT Department",
      locationAr: "مبنى الوزارة الرئيسي - الخرطوم، الطابق الثالث",
      locationEn: "Ministry HQ - Khartoum, 3rd Floor",
      value: 24500000,
      depreciationTypeAr: "قسط ثابت - 5 سنوات",
      depreciationTypeEn: "Straight Line - 5 Years",
      currentValue: 19600000,
      warrantyStatusAr: "ساري المفعول حتى 2028-12-31",
      warrantyStatusEn: "Active until 2028-12-31",
      insurancePolicy: "SD-SOV-INS-9482",
      lifecycleStatus: "operational",
      healthIndex: 96,
      assignedUserAr: "مهندس سامر بابكر",
      assignedUserEn: "Eng. Samer Babiker",
      createdAt: "2026-01-10T12:00:00Z"
    },
    {
      id: "ast-2",
      nationalId: "SD-NAI-2026-0002",
      nameAr: "منظومة الطاقة الشمسية الهجينة - مجمع سوبا للمختبرات",
      nameEn: "Hybrid Solar Power Array - Soba Labs Complex",
      classificationAr: "آلات ومعدات طاقة بديلة",
      classificationEn: "Machinery & Alternative Energy Equipment",
      ownerDepartmentAr: "إدارة الخدمات الهندسية والصيانة",
      ownerDepartmentEn: "Engineering Services & Maintenance Dept",
      locationAr: "مجمع مختبرات التقييس والجودة - سوبا",
      locationEn: "Standards & Quality Labs Complex - Soba",
      value: 12800000,
      depreciationTypeAr: "قسط متناقص - 10 سنوات",
      depreciationTypeEn: "Reducing Balance - 10 Years",
      currentValue: 11520000,
      warrantyStatusAr: "ساري المفعول حتى 2031-01-15",
      warrantyStatusEn: "Active until 2031-01-15",
      insurancePolicy: "SD-SOV-INS-1029",
      lifecycleStatus: "operational",
      healthIndex: 89,
      assignedUserAr: "مهندس الطيب حسن",
      assignedUserEn: "Eng. El-Tayeb Hassan",
      createdAt: "2026-02-15T09:00:00Z"
    },
    {
      id: "ast-3",
      nationalId: "SD-NAI-2026-0003",
      nameAr: "مبنى المستودع اللوجستي الفيدرالي - بورتسودان",
      nameEn: "Federal Logistic Warehouse Structure - Port Sudan",
      classificationAr: "عقارات ومباني وإنشاءات",
      classificationEn: "Real Estate, Buildings & Structures",
      ownerDepartmentAr: "إدارة الإمداد والخدمات العامة",
      ownerDepartmentEn: "Supply & General Services Dept",
      locationAr: "المنطقة الحرة - ميناء بورتسودان",
      locationEn: "Free Zone Area - Port Sudan Port",
      value: 85000000,
      depreciationTypeAr: "قسط ثابت - 40 سنة",
      depreciationTypeEn: "Straight Line - 40 Years",
      currentValue: 82875000,
      warrantyStatusAr: "غير مطبق",
      warrantyStatusEn: "N/A",
      insurancePolicy: "SD-SOV-INS-0492",
      lifecycleStatus: "operational",
      healthIndex: 92,
      assignedUserAr: "أ. معتز الماحي",
      assignedUserEn: "Mr. Moataz Al-Mahi",
      createdAt: "2025-05-20T08:00:00Z"
    }
  ],
  facilities: [
    {
      id: "fac-1",
      nameAr: "مبنى الوزارة الرئيسي - الخرطوم",
      nameEn: "Ministry HQ Building - Khartoum",
      typeAr: "مبنى إداري حكومي",
      typeEn: "Government Admin Office",
      capacityStaff: 500,
      currentOccupancy: 420,
      utilityStatusAr: "مستقرة - طاقة شمسية مساندة بنسبة 40%",
      utilityStatusEn: "Stable - 40% Solar Hybrid Assisted",
      safetyStatusAr: "آمن - تم التفتيش الدوري والاعتماد",
      safetyStatusEn: "Secure - Periodic Inspection Approved",
      lastInspectionDate: "2026-06-15",
      energyUsageKwh: 12500,
      waterUsageLitres: 45000,
      environmentalScore: 92
    },
    {
      id: "fac-2",
      nameAr: "المستودع اللوجستي المركزي - بورتسودان",
      nameEn: "Central Logistics Warehouse - Port Sudan",
      typeAr: "مستودع تخزين استراتيجي",
      typeEn: "Strategic Storage Facility",
      capacityStaff: 80,
      currentOccupancy: 45,
      utilityStatusAr: "مستقرة - مبردات عملاقة متصلة بالطاقة",
      utilityStatusEn: "Stable - Industrial Coolers Operational",
      safetyStatusAr: "ممتاز - منظومات إطفاء حريق أوتوماتيكية مفعّلة",
      safetyStatusEn: "Excellent - Automatic Fire Suppression Armed",
      lastInspectionDate: "2026-07-01",
      energyUsageKwh: 34200,
      waterUsageLitres: 12000,
      environmentalScore: 88
    },
    {
      id: "fac-3",
      nameAr: "مجمع مختبرات التقييس والصناعات الغذائية - سوبا",
      nameEn: "Soba Industrial Quality & Food Labs Complex",
      typeAr: "مختبرات فحص وتقييس",
      typeEn: "Testing & Standardization Labs",
      capacityStaff: 150,
      currentOccupancy: 110,
      utilityStatusAr: "مستقرة - خط كهربائي ساخن مخصص للمختبرات",
      utilityStatusEn: "Stable - Dedicated Power Grid Line",
      safetyStatusAr: "حذر - فحص المواد الكيميائية نصف سنوي",
      safetyStatusEn: "Caution - Semi-annual Chemical Audit",
      lastInspectionDate: "2026-05-18",
      energyUsageKwh: 19800,
      waterUsageLitres: 35000,
      environmentalScore: 85
    }
  ],
  warehouses: [
    {
      id: "wh-1",
      nameAr: "مستودع الخرطوم للأجهزة والمكاتب",
      nameEn: "Khartoum IT & Office Assets Storage",
      locationAr: "الخرطوم، المنطقة الصناعية",
      locationEn: "Khartoum, Industrial Area",
      totalCapacitySqm: 2500,
      utilizedCapacitySqm: 1800,
      managerAr: "الأمين الفاضل",
      managerEn: "El-Amin El-Fadil",
      securityLevel: "High"
    },
    {
      id: "wh-2",
      nameAr: "مستودع بورتسودان لقطع الغيار والمعدات الثقيلة",
      nameEn: "Port Sudan Spare Parts & Machinery Storage",
      locationAr: "بورتسودان، المنطقة الحرة ب",
      locationEn: "Port Sudan, Free Zone B",
      totalCapacitySqm: 5000,
      utilizedCapacitySqm: 3200,
      managerAr: "ياسر عوض الباري",
      managerEn: "Yasser Awad El-Bari",
      securityLevel: "Sovereign Restricted"
    }
  ],
  inventories: [
    {
      id: "inv-1",
      sku: "SKU-SOL-INV-001",
      nameAr: "عواكس جهد منظومة الطاقة الشمسية (Hybrid Inverters)",
      nameEn: "Hybrid Solar Power Inverters 10KW",
      categoryAr: "قطع غيار ومستلزمات صيانة",
      categoryEn: "Spare Parts & Maintenance",
      quantity: 12,
      minQuantity: 4,
      warehouseId: "wh-2",
      unitAr: "جهاز",
      unitEn: "Unit",
      trackingMethod: "RFID",
      barcode: "626010293041",
      lastCycleCountDate: "2026-06-20"
    },
    {
      id: "inv-2",
      sku: "SKU-IT-SRV-502",
      nameAr: "أقراص صلبة فائقة السرعة للخوادم (Enterprise SSD 2TB)",
      nameEn: "Enterprise SSD 2TB SAS Drive",
      categoryAr: "أجهزة تقنية ومستهلكات شبكات",
      categoryEn: "IT & Server Storage Consumables",
      quantity: 85,
      minQuantity: 20,
      warehouseId: "wh-1",
      unitAr: "قطعة",
      unitEn: "Piece",
      trackingMethod: "QR Code",
      barcode: "626010293052",
      lastCycleCountDate: "2026-07-05"
    },
    {
      id: "inv-3",
      sku: "SKU-CHEM-LAB-102",
      nameAr: "محاليل معيارية لفحص جودة الصمغ العربي",
      nameEn: "Standard Assay Solutions for Gum Arabic Integrity",
      categoryAr: "مستهلكات مخبرية وتدقيق",
      categoryEn: "Laboratory Reagents & Consumables",
      quantity: 340,
      minQuantity: 50,
      warehouseId: "wh-2",
      unitAr: "عبوة 500 مل",
      unitEn: "Bottle 500ml",
      trackingMethod: "Barcode",
      barcode: "626010293102",
      lastCycleCountDate: "2026-07-12"
    }
  ],
  fleetVehicles: [
    {
      id: "flt-1",
      plateNumber: "خ-101-حكومي",
      nameAr: "مختبر متنقل لفحص السلع الاستهلاكية (تويوتا هايلوكس)",
      nameEn: "Mobile Commodity Assay Lab (Toyota Hilux)",
      typeAr: "عربة تفتيش ورقابة",
      typeEn: "Inspection & Control Vehicle",
      assignedDriverAr: "عثمان علي الجعلي",
      assignedDriverEn: "Osman Ali El-Jaali",
      fuelConsumptionRate: "11.2L / 100KM",
      gpsCoords: { lat: 15.5562, lng: 32.5358 },
      mileage: 48500,
      licenseExpiryDate: "2027-05-10",
      insuranceStatusAr: "مؤمن سيادياً",
      insuranceStatusEn: "Sovereign Insured",
      maintenanceStatus: "operational",
      accidentHistoryCount: 0
    },
    {
      id: "flt-2",
      plateNumber: "خ-205-حكومي",
      nameAr: "شاحنة توزيع الدعم والخدمات التجارية (ايسوزو 5 طن)",
      nameEn: "Commercial Supply & Logistics Truck (Isuzu 5-Ton)",
      typeAr: "شاحنة خدمات نقل لوجستي",
      typeEn: "Supply Chain Cargo Truck",
      assignedDriverAr: "مرتضى محمد أحمد",
      assignedDriverEn: "Murtada Mohamed Ahmed",
      fuelConsumptionRate: "16.8L / 100KM",
      gpsCoords: { lat: 15.6192, lng: 32.4828 },
      mileage: 112000,
      licenseExpiryDate: "2026-11-20",
      insuranceStatusAr: "مؤمن سيادياً",
      insuranceStatusEn: "Sovereign Insured",
      maintenanceStatus: "needs_preventive",
      accidentHistoryCount: 1
    }
  ],
  maintenanceWorkOrders: [
    {
      id: "wo-1",
      assetId: "ast-1",
      titleAr: "استبدال منظومة مراوح تبريد الخادم المركزي رقم 4",
      titleEn: "Replace Cooling Fan Assembly on Core Server Node #4",
      type: "corrective",
      priority: "high",
      status: "completed",
      cost: 380000,
      vendorAr: "الشركة الفيدرالية لحلول الشبكات",
      vendorEn: "Federal Network Solutions Co.",
      engineerAr: "مهندس أمجد عثمان",
      engineerEn: "Eng. Amjad Osman",
      descriptionAr: "تم ملاحظة ارتفاع طفيف في حرارة الخادم رقم 4، وتم استبدال مروحة التدفق المزدوج بنجاح وإعادة تشغيل النظام تحت بيئة اختبار آمنة.",
      descriptionEn: "High heat readings recorded on Node 4. Replaced complete dual-flow fan assembly. Tested under simulated workload successfully.",
      createdAt: "2026-07-01T08:00:00Z"
    },
    {
      id: "wo-2",
      assetId: "ast-2",
      titleAr: "المعايرة الدورية السنوية للمختبر الكيميائي بسوبا",
      titleEn: "Annual Standardization & Calibration of Soba Testing Rig",
      type: "preventive",
      priority: "medium",
      status: "in_progress",
      cost: 750000,
      vendorAr: "الهيئة السودانية للمواصفات والمقاييس",
      vendorEn: "Sudanese Standards & Metrology Org (SSMO)",
      engineerAr: "مهندسة ندى الطيب",
      engineerEn: "Eng. Nada El-Tayeb",
      descriptionAr: "جاري معايرة مجسات الوزن الطيفي ومقارنتها بالكتل المرجعية المعتمدة دولياً لضمان سلامة تراخيص التصدير الصادرة.",
      descriptionEn: "Calibration of spectrographic sensor elements using national standard weights to satisfy COMESA/ISO export validation mandates.",
      createdAt: "2026-07-14T10:30:00Z"
    }
  ],
  spareParts: [
    { id: "sp-1", nameAr: "مرشحات هواء أنظمة تبريد الخوادم", nameEn: "Server AC Air Filter Elements", qty: 30, unitCost: 4500 },
    { id: "sp-2", nameAr: "فيوزات كهربائية 100 أمبير لمصفوفة الشمسية", nameEn: "100A Solar Inverter Electrical Fuses", qty: 50, unitCost: 1800 }
  ],
  assetKpis: [
    { metricAr: "معدل تشغيل الأصول الإجمالي", metricEn: "Overall Asset Utilization Rate", value: "91.8%", trend: "up" },
    { metricAr: "متوسط الوقت للإصلاح (MTTR)", metricEn: "Mean Time To Repair (MTTR)", value: "3.4 Hours", trend: "down" },
    { metricAr: "العائد على الأصول الخدمية", metricEn: "Return on Sovereign Assets (ROA)", value: "14.2%", trend: "up" }
  ],
  facilityKpis: [
    { metricAr: "متوسط كفاءة استهلاك الطاقة", metricEn: "Energy Performance Index (EPI)", value: "94.5 / 100", trend: "up" },
    { metricAr: "نسبة الامتثال للسلامة والصحة والبيئة", metricEn: "HSE Compliance Safety Index", value: "98.2%", trend: "stable" }
  ],
  assetAuditLogs: [
    {
      id: "asl-001",
      timestamp: "2026-07-16T08:15:00Z",
      actor: "مهندس سامر بابكر (مسؤول الأصول)",
      actionAr: "إجراء تدقيق الأصول والتحقق الجغرافي بالـ GPS والخادم المركزي",
      actionEn: "Initiated GPS physical geolocation & asset audit verification query",
      details: "التحقق من خوادم الحوسبة السحابية (SD-NAI-2026-0001) وإعادة اعتماد سلامة الاتصال الفيدرالي",
      hash: "sha256_e738af0293bd38bc938cd485fe1032cf09"
    }
  ],
  // Procurement Seed Arrays
  suppliers: [
    {
      id: "sup-1",
      nationalId: "SD-SUP-2026-0001",
      nameAr: "مجموعة جياد للصناعات الهندسية والسيارات",
      nameEn: "Giad Engineering & Automotive Group",
      type: "manufacturer",
      typeAr: "مصنع وطني",
      commercialRegistration: "CR-94829-KRT",
      taxId: "TAX-7729103-SD",
      certifications: ["ISO 9001", "ISO 14001", "SSMO Certified"],
      financialEval: "A+ (Excellent Liquidity)",
      technicalEval: "95% (Elite Engineering Capacity)",
      riskRating: "low",
      performanceScore: 96,
      status: "active",
      address: "الخرطوم، المنطقة الصناعية جياد"
    },
    {
      id: "sup-2",
      nationalId: "SD-SUP-2026-0002",
      nameAr: "الشركة الفيدرالية للخدمات اللوجستية وتجهيز المواقع",
      nameEn: "Federal Logistics & Site Preparation Co.",
      type: "contractor",
      typeAr: "مقاول معتمد",
      commercialRegistration: "CR-10293-PTS",
      taxId: "TAX-8820391-SD",
      certifications: ["COMESA Logistics Standard", "HSE Level 3"],
      financialEval: "A (Stable)",
      technicalEval: "88% (High Capacity)",
      riskRating: "low",
      performanceScore: 89,
      status: "active",
      address: "بورتسودان، المنطقة الحرة"
    },
    {
      id: "sup-3",
      nationalId: "SD-SUP-2026-0003",
      nameAr: "بايونيرز لحلول التقنية والبرمجيات السيادية",
      nameEn: "Pioneers Sovereign Tech & Software Solutions",
      type: "consultant",
      typeAr: "مستشار ومزود حلول",
      commercialRegistration: "CR-22340-KRT",
      taxId: "TAX-1039482-SD",
      certifications: ["ISO 27001", "CMMI Level 4"],
      financialEval: "B+ (Adequate)",
      technicalEval: "94% (High Specialization)",
      riskRating: "medium",
      performanceScore: 92,
      status: "active",
      address: "الخرطوم، مجمع سوبا للابتكار"
    }
  ],
  procurementPlans: [
    {
      id: "plan-1",
      planNameAr: "خطة تحديث البنية التحتية والأنظمة التقنية 2026",
      planNameEn: "IT Infrastructure & Digital Systems Modernization Plan 2026",
      departmentAr: "إدارة تقنية المعلومات والتحول الرقمي",
      departmentEn: "IT & Digital Transformation Dept",
      budgetAllocated: 45000000,
      budgetUtilized: 12000000,
      year: "2026",
      status: "approved",
      categories: ["تراخيص برمجيات", "خوادم شبكات", "عاكسات طاقة شمسية"],
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "plan-2",
      planNameAr: "خطة تطوير أجهزة فحص ومختبرات معايرة السلع المصدرة",
      planNameEn: "Export Commodities Lab Calibration & Assay Testing Equipment Plan",
      departmentAr: "الهيئة الفيدرالية للتقييس والسيطرة على السلع",
      departmentEn: "Federal Commodity Assay & Metrology Dept",
      budgetAllocated: 60000000,
      budgetUtilized: 0,
      year: "2026",
      status: "pending_review",
      categories: ["أجهزة فحص طيفي", "محاليل معيارية", "تدريب فنيين"],
      createdAt: "2026-06-15T11:30:00Z"
    }
  ],
  tenders: [
    {
      id: "tend-1",
      tenderCode: "SD-TND-2026-001",
      titleAr: "توريد وتركيب مصفوفة خلايا شمسية هجينة بقدرة 150 كيلوواط لمجمع سوبا للابتكار",
      titleEn: "Supply and Installation of 150KW Hybrid Solar Cell Grid for Soba Innovation Center",
      type: "open",
      typeAr: "مناقصة عامة مفتوحة",
      budget: 35000000,
      tenderFee: 50000,
      publicationDate: "2026-07-01",
      submissionDeadline: "2026-08-10",
      status: "bidding",
      categoryAr: "منظومات الطاقة والكهرباء",
      categoryEn: "Power & Electrical Systems",
      clarificationCount: 2,
      bidsCount: 0
    },
    {
      id: "tend-2",
      tenderCode: "SD-TND-2026-002",
      titleAr: "تحديث خوادم التخزين السحابي الفيدرالي وتأمين رخص قواعد البيانات السيادية",
      titleEn: "Upgrade Federal Cloud Storage Nodes and Secure Sovereign Database Licenses",
      type: "limited",
      typeAr: "مناقصة محدودة",
      budget: 15000000,
      tenderFee: 25000,
      publicationDate: "2026-06-15",
      submissionDeadline: "2026-07-15",
      status: "evaluation",
      categoryAr: "البنية البرمجية والتقنية",
      categoryEn: "IT Infrastructure & Software",
      clarificationCount: 4,
      bidsCount: 2
    },
    {
      id: "tend-3",
      tenderCode: "SD-TND-2026-003",
      titleAr: "عقد إطاري لشراء وتوزيع الدقيق الوطني المدعوم لمخابز ولاية الخرطوم والجزيرة",
      titleEn: "Framework Agreement for Procurement & Distribution of National Subsidized Flour",
      type: "framework",
      typeAr: "اتفاقية إطارية سيادية",
      budget: 120000000,
      tenderFee: 0,
      publicationDate: "2026-05-10",
      submissionDeadline: "2026-06-10",
      status: "awarded",
      categoryAr: "الإمداد السلعي والتموين الموحد",
      categoryEn: "Sovereign Commodity & Rationing",
      clarificationCount: 1,
      bidsCount: 3
    }
  ],
  bids: [
    {
      id: "bid-1",
      tenderId: "tend-2",
      supplierId: "sup-3",
      supplierNameAr: "بايونيرز لحلول التقنية والبرمجيات السيادية",
      supplierNameEn: "Pioneers Sovereign Tech & Software Solutions",
      technicalScore: 92,
      financialScore: 88,
      combinedScore: 90.8, // QCBS weighted technical (70%) & financial (30%)
      amount: 14200000,
      status: "recommended",
      submissionDate: "2026-07-12",
      notes: "العرض الفني متكامل ويشتمل على تأمين وربط مباشر بأنظمة السجل التجاري والـ BI."
    },
    {
      id: "bid-2",
      tenderId: "tend-2",
      supplierId: "sup-1",
      supplierNameAr: "مجموعة جياد للصناعات الهندسية والسيارات",
      supplierNameEn: "Giad Engineering & Automotive Group",
      technicalScore: 82,
      financialScore: 94,
      combinedScore: 85.6,
      amount: 12800000,
      status: "evaluated",
      submissionDate: "2026-07-14",
      notes: "العرض المالي منافس جداً، ولكن النقاط الفنية بمجال رخص الأنظمة السحابية أقل تخصصاً."
    }
  ],
  purchaseOrders: [
    {
      id: "po-1",
      poCode: "SD-PO-2026-001",
      tenderId: "tend-3",
      supplierName: "مجموعة جياد للصناعات الهندسية والسيارات",
      itemAr: "شاحنات نقل لوجستي سعة 5 طن وتجهيزات تفتيش متنقلة",
      itemEn: "5-Ton Supply Cargo Trucks and Mobile Inspection Assay Kits",
      quantity: 5,
      totalAmount: 24000000,
      status: "delivered",
      paymentStatus: "paid",
      createdAt: "2026-06-20",
      deliveryDate: "2026-07-10",
      invoiceMatched: true
    },
    {
      id: "po-2",
      poCode: "SD-PO-2026-002",
      tenderId: "tend-2",
      supplierName: "بايونيرز لحلول التقنية والبرمجيات السيادية",
      itemAr: "تحديث خوادم وأقراص تخزين سحابية وتراخيص قواعد البيانات",
      itemEn: "Cloud node hardware upgrades and enterprise database licensing key integration",
      quantity: 1,
      totalAmount: 14200000,
      status: "approved",
      paymentStatus: "authorized",
      createdAt: "2026-07-16",
      deliveryDate: "2026-08-15",
      invoiceMatched: false
    }
  ],
  procurementContracts: [
    {
      id: "pcon-1",
      contractCode: "SD-CON-2026-401",
      titleAr: "اتفاقية توريد وتركيب أجهزة تكييف الهواء المزدوج لغرف الخوادم المركزية بالوزارة",
      titleEn: "Supply and Installation of Double Cooling Air Systems for Central Ministry Server Rooms",
      supplierName: "مجموعة جياد للصناعات الهندسية والسيارات",
      totalValue: 8500000,
      status: "execution",
      startDate: "2026-07-01",
      endDate: "2026-10-31",
      signedDigitally: true,
      milestones: [
        { title: "التوريد الميداني للأجهزة لموقع سوبا", weight: 30, status: "completed", date: "2026-07-10" },
        { title: "التركيب الهيكلي والتوصيل الكهربائي بالفيدرالية", weight: 40, status: "pending", date: "2026-08-15" },
        { title: "الاختبار الحراري والتشغيل التجريبي والتسليم النهائي", weight: 30, status: "pending", date: "2026-09-30" }
      ],
      performanceGuarantee: { amount: 850000, bank: "بنك الخرطوم", status: "active", expiry: "2026-12-31" }
    }
  ],
  supplierKpis: [
    {
      id: "skpi-1",
      supplierId: "sup-1",
      supplierName: "مجموعة جياد للصناعات الهندسية والسيارات",
      deliveryScore: 95,
      qualityScore: 98,
      complianceScore: 96,
      costEfficiencyScore: 92,
      responseTimeScore: 94,
      overallIndex: 95
    },
    {
      id: "skpi-2",
      supplierId: "sup-2",
      supplierName: "الشركة الفيدرالية للخدمات اللوجستية وتجهيز المواقع",
      deliveryScore: 88,
      qualityScore: 90,
      complianceScore: 89,
      costEfficiencyScore: 85,
      responseTimeScore: 87,
      overallIndex: 87.8
    }
  ],
  procurementAuditLogs: [
    {
      id: "pud-1",
      timestamp: "2026-07-01T09:00:00Z",
      actor: "ديوان لجان المشتريات الفيدرالية الموحدة",
      actionAr: "نشر المناقصة المفتوحة رقم SD-TND-2026-001 بالبوابة الوطنية والجريدة الرسمية",
      actionEn: "Published Open Tender SD-TND-2026-001 on the National Portal and Official Gazette",
      details: "المشروع: خلايا طاقة شمسية سوبا | القيمة التقديرية السيادية: 35 مليون ج.س",
      hash: "sha256_p01bcdefa0293bd887a02cdef001a2f90"
    },
    {
      id: "pud-2",
      timestamp: "2026-07-15T12:00:00Z",
      actor: "لجنة فض المظاريف والتقييم الفني",
      actionAr: "جلسة التشفير وفض المظاريف الفنية إلكترونياً للمناقصة رقم SD-TND-2026-002",
      actionEn: "Session of technical bid decryption and public opening for Tender SD-TND-2026-002",
      details: "عدد العروض الفنية المستلمة والمسجلة بسلسلة الكتل: 2 عروض | ضمان عدم التلاعب والسرية التامة",
      hash: "sha256_p02cdefa10293bd998f02baef10283cf9"
    }
  ],

  // GRC Seed Arrays
  grcRisks: [
    {
      id: "grisk-1",
      nationalId: "SD-NRI-2026-0001",
      titleAr: "مخاطر انقطاع البنية التحتية والكهربائية وتأثيرها على فحص المطابقة والجودة بسوبا",
      titleEn: "Soba Commodities Lab Power Interruption & Business Continuity Risk",
      category: "operational",
      categoryAr: "مخاطر تشغيلية ولوجستية",
      inherentRiskScore: 90, // Probability x Impact (e.g. 9 x 10)
      residualRiskScore: 30, // Post-mitigation
      riskAppetite: 20,
      riskTolerance: 40,
      mitigationPlanAr: "تركيب عواكس الجهد ومصفوفة خلايا شمسية هجينة هادفة لتوفير تغذية مستقلة 24 ساعة",
      mitigationPlanEn: "Installation of hybrid solar grids and backup batteries ensuring 100% lab uptime",
      status: "monitored",
      ownerAr: "إدارة المختبرات وتأمين المطابقة الفيدرالية"
    },
    {
      id: "grisk-2",
      nationalId: "SD-NRI-2026-0002",
      titleAr: "تأثير تذبذب أسعار الصرف والتضخم على تكلفة المشتريات الاستراتيجية والسلع المدعومة",
      titleEn: "Exchange Rate Fluctuation Impact on Subsidized Goods & Strategic Procurement Costs",
      category: "financial",
      categoryAr: "مخاطر مالية واقتصادية",
      inherentRiskScore: 85,
      residualRiskScore: 45,
      riskAppetite: 25,
      riskTolerance: 50,
      mitigationPlanAr: "الاعتماد على اتفاقيات إطارية طويلة الأجل وعقود التوريد بالعملة المحلية مع تثبيت الأسعار",
      mitigationPlanEn: "Utilizing long-term local framework agreements and fixed pricing schemes directly with local mills",
      status: "mitigating",
      ownerAr: "إدارة الإمداد السلعي والتموين الموحد"
    }
  ],
  grcControls: [
    {
      id: "gcon-1",
      titleAr: "المعايرة والمعاينة السنوية الإلزامية لموازين وأجهزة فحص الصادرات بسوبا والجمارك",
      titleEn: "Annual Mandatory Verification & Calibration of Export Scales & Spectrometers",
      type: "preventive",
      typeAr: "ضابط وقائي استباقي",
      methodAr: "مقارنة بالأوزان المرجعية وإصدار شهادات الامتثال والترميز الذكي للقطع",
      effectiveness: "highly_effective",
      lastTested: "2026-06-20",
      nextTestDate: "2027-06-20",
      notes: "تم الفحص والتحقق الكامل طبقاً للمعيار الدولي ISO 17025"
    },
    {
      id: "gcon-2",
      titleAr: "التفتيش والإنفاذ والرقابة الميدانية المفاجئة على الأسواق المحلية لمكافحة الاحتكار والتلاعب",
      titleEn: "Surprise Field Inspection & Market Enforcement for Anti-Monopoly Regulation Compliance",
      type: "detective",
      typeAr: "ضابط كشفي مستمر",
      methodAr: "زيارات تفتيشية لمفتشي حماية المستهلك عبر نظام المحاكاة اللوحي المتنقل",
      effectiveness: "effective",
      lastTested: "2026-07-15",
      nextTestDate: "2026-08-15",
      notes: "تم تحرير مخالفتين هذا الشهر وضبط كميات من السلع التالفة والمنتهية الصلاحية"
    }
  ],
  grcPolicies: [
    {
      id: "gpol-1",
      titleAr: "لائحة وسياسة منع وحظر تضارب المصالح في لجان المناقصات والمشتريات الحكومية",
      titleEn: "Conflict of Interest Avoidance Policy for Sovereign Tendering & Public Procurement Committees",
      categoryAr: "سياسات مكافحة الفساد والنزاهة",
      status: "approved",
      draftedBy: "المستشار القانوني العام للوزارة",
      version: "2.1",
      publishDate: "2026-02-10",
      acknowledgementsCount: 145,
      expiryDate: "2028-02-10"
    },
    {
      id: "gpol-2",
      titleAr: "سياسة وحوكمة أمن المعلومات والأمن السيبراني للمعاملات والسجلات الفيدرالية السيادية 2035",
      titleEn: "Information Security & Cybersecurity Framework for Sovereign Government Transactions 2035",
      categoryAr: "سياسات التحول الرقمي وحماية السجلات",
      status: "approved",
      draftedBy: "مركز الأمن السيبراني الوطني",
      version: "1.0",
      publishDate: "2026-05-15",
      acknowledgementsCount: 380,
      expiryDate: "2027-05-15"
    }
  ],
  grcAudits: [
    {
      id: "gaud-1",
      engagementNameAr: "برنامج تدقيق وتقييم امتثال مشتريات وتراخيص قطاع الصمغ العربي لعام 2026",
      engagementNameEn: "Procurement & Licensing Compliance Audit Program for Gum Arabic Sector 2026",
      scope: "كامل مشتريات وتراخيص بورتسودان وسوبا والمخازن التابعة",
      typeAr: "تدقيق التزام مالي وتشغيلي",
      status: "completed",
      startDate: "2026-05-01",
      endDate: "2026-06-30",
      workingPapersCount: 24,
      findingsCount: 1
    },
    {
      id: "gaud-2",
      engagementNameAr: "التدقيق المالي والتشغيلي الربع سنوي لأمر الصيانة والتشغيل للأسطول والمعدات الثقيلة",
      engagementNameEn: "Quarterly Asset Maintenance and Vehicle Fleet Operation Financial & Operations Audit",
      scope: "أوامر الصيانة وتذاكر الوقود ومطابقة الفواتير",
      typeAr: "تدقيق رقابي مالي دوري",
      status: "in_progress",
      startDate: "2026-07-01",
      endDate: "2026-09-30",
      workingPapersCount: 8,
      findingsCount: 0
    }
  ],
  grcFindings: [
    {
      id: "gfnd-1",
      auditId: "gaud-1",
      findingTitleAr: "فجوة تأخر توثيق ومطابقة الفواتير والوصولات الرقمية بفرع بورتسودان اللوجستي",
      findingTitleEn: "Delays in Digital Invoice Reconciliation & Validation at Port Sudan Regional Branch",
      severity: "medium",
      recommendationAr: "تفعيل الربط المباشر اللحظي مع بوابة الدفع والتحصيل الفيدرالي لإنشاء سندات استلام فورية بصفة آلية.",
      recommendationEn: "Integrate fully with Sovereign Digital Payment API for instant electronic receipt creation.",
      status: "resolved",
      targetResolutionDate: "2026-07-15",
      actualResolutionDate: "2026-07-14"
    }
  ],
  grcCorrectiveActions: [
    {
      id: "gcar-1",
      findingId: "gfnd-1",
      actionAr: "تركيب وبرمجة إضافة الفاتورة الرقمية الفورية ببوابة تراخيص ومشتريات الصمغ العربي وتحديث النظام",
      actionEn: "Configured and updated real-time electronic invoice and secure receipt plugin within portal",
      assignedToAr: "مهندسة رانيا صلاح - فرع بورتسودان الرقمي",
      status: "completed",
      completionDate: "2026-07-14",
      evidenceDoc: "DOC-2026-001 (ملحق دمج البوابات)"
    }
  ],
  grcComplianceRecords: [
    {
      id: "gcomp-1",
      obligationNameAr: "الامتثال لقواعد منع الاحتكار وتحديد هوية الملاك النهائيين للشركات المصدرة للصمغ",
      obligationNameEn: "Beneficial Ownership Transparency and Anti-Monopoly Compliance for Gum Exporters",
      regulationAr: "قانون مكافحة الممارسات الاحتكارية والتجارة العادلة 2026",
      score: 98,
      status: "compliant",
      lastChecked: "2026-07-12",
      evidenceAr: "سجلات الإفصاح عن الملاك وربطها التلقائي بمصفوفة السجل التجاري والـ BI"
    }
  ],
  grcIncidents: [
    {
      id: "ginc-1",
      incidentTitleAr: "بلاغ سري - محاولة تلاعب واحتكار كميات كبيرة من السكر والدقيق لإعادة تعبئتها بأسعار مرتفعة",
      incidentTitleEn: "Anonymous Whistleblower - Sugar & Flour Warehouse Hoarding in Omdurman Industrial Zone",
      categoryAr: "بلاغات الفساد والنزاهة وحماية المستهلك",
      reporterType: "anonymous_whistleblower",
      securedWhistleblowerHash: "sha256_wb_f801cdaef1092b3cde9103faee2038bf",
      detailsAr: "بلاغ تفصيلي مشفر وموثق فوتوغرافياً برقم الحاوية وموقع المستودع المظلم بأم درمان خلف المطاحن القديمة.",
      status: "under_investigation",
      loggedAt: "2026-07-15T10:00:00Z",
      investigatorAr: "مفوض النزاهة والرقابة بالوزارة"
    }
  ],
  grcAuditLogs: [
    {
      id: "gla-1",
      timestamp: "2026-07-10T14:00:00Z",
      actor: "ديوان التدقيق الداخلي وإدارة الالتزام السيادي",
      actionAr: "إجراء تقييم المخاطر الاستباقية لتشغيل مختبرات سوبا وتدوينه بسجل المخاطر الوطني الموحد",
      actionEn: "Conducted pro-active strategic risk assessment for Soba facilities and registered under SD-NRI-2026-0001",
      details: "القيمة الكامنة للمخاطر: 90 | القيمة المتبقية بعد الضوابط: 30",
      hash: "sha256_glog01baefdce8910bcdafe223901ba3"
    },
    {
      id: "gla-2",
      timestamp: "2026-07-15T11:00:00Z",
      actor: "ديوان معالي الوزير والمستشار القانوني العام",
      actionAr: "توقيع واعتماد سياسة حظر تضارب المصالح وإدراجها بمتطلبات التوقيع الرقمي للموظفين والموردين",
      actionEn: "Approved and digitally signed Conflict of Interest Policy gpol-1, deploying to employee and supplier portals",
      details: "إصدار النسخة 2.1 المعتمدة سيادياً بالتنسيق مع ديوان المراجعة القومي",
      hash: "sha256_glog02baefdce8910bcdafe223901bc4"
    }
  ],
  secEvents: [
    {
      id: "sevent-1",
      timestamp: "2026-07-16T08:15:22Z",
      source: "Sovereign Payment Gateway API",
      category: "api_call",
      severity: "low",
      messageAr: "طلب تحقق ناجح من توقيع رقمي لمعاملة جباية جمارك برقم سند #9921",
      messageEn: "Successful digital signature verification for customs payment transaction #9921",
      actor: "نظام تحصيل الجمارك الفيدرالي",
      ipAddress: "196.29.112.45",
      status: "allowed"
    },
    {
      id: "sevent-2",
      timestamp: "2026-07-16T08:22:10Z",
      source: "National Interoperability Hub",
      category: "authentication",
      severity: "high",
      messageAr: "محاولة تسجيل دخول متعددة فاشلة على حساب مدير نظام تراخيص الصمغ العربي",
      messageEn: "Brute-force alert: Multiple failed login attempts detected on Gum Arabic admin account",
      actor: "مجهول / محاولة قرصنة",
      ipAddress: "198.51.100.77",
      status: "blocked"
    },
    {
      id: "sevent-3",
      timestamp: "2026-07-16T09:05:00Z",
      source: "Commercial Registry Database",
      category: "data_access",
      severity: "medium",
      messageAr: "استعلام غير معتاد عن بيانات المالكين لـ 15 شركة تصدير في غضون 3 ثوانٍ",
      messageEn: "Anomalous bulk query: Checked beneficial ownership for 15 exporters within 3 seconds",
      actor: "محلل بيانات تجارية بورتسودان",
      ipAddress: "196.29.115.101",
      status: "flagged"
    }
  ],
  secIncidents: [
    {
      id: "sinc-1",
      titleAr: "هجوم حجب الخدمة الموزع المحدود على خوادم التسجيل التجاري",
      titleEn: "Mitigated DDoS Attack on Commercial Registry Services",
      descriptionAr: "رصد هجوم فيضان طلبات (DDoS) محدود يستهدف المنفذ 443 للبوابة الرقمية وتم صد الهجوم آلياً عبر جدار الحماية السيادي.",
      descriptionEn: "High volume HTTP flood targeted at port 443 of the commercial portal. Automatically mitigated via SDN Cloud WAF.",
      category: "ddos",
      severity: "high",
      status: "mitigated",
      loggedAt: "2026-07-16T04:30:00Z",
      assignedTo: "soc_analyst",
      timeline: [
        { timestamp: "2026-07-16T04:30:00Z", actionAr: "رصد الهجوم وتصنيفه كـ DDoS بمعدل 120,000 طلب/ثانية", actionEn: "Traffic spike detected: 120k req/sec classified as DDoS threat", actor: "SIEM Auto-Correlator" },
        { timestamp: "2026-07-16T04:32:00Z", actionAr: "تشغيل خطة الاستجابة التلقائية للـ SOAR وتفعيل حظر عناوين IP المصدرية", actionEn: "SOAR playbook triggered: Activated geographic IP blocking and rate limiting", actor: "SOAR Platform" },
        { timestamp: "2026-07-16T04:35:00Z", actionAr: "استقرار الخدمة بنسبة 100% وتحويل التذكرة للتحليل الجنائي للتحقق من المهاجمين", actionEn: "Service stabilized. Assigned to Digital Forensics Specialist for origin tracking", actor: "SOC Director" }
      ],
      containmentActionAr: "تفعيل جدار الحماية وعزل النطاق الجغرافي المستهدف وتفعيل التدقيق التلقائي (CAPTCHA)",
      containmentActionEn: "Enforced GEO-IP filtering, SDN mitigation layers and automated CAPTCHA triggers",
      rootCauseAr: "استخدام شبكة بوتات مصابة دولية لمحاولة إرباك السجل التجاري قبيل تدشين العطاءات القومية",
      rootCauseEn: "Distributed botnet targeting the Ministry commercial platform ahead of public tenders release",
      lessonsLearnedAr: "تحديث عتبات الإنذار لتفعيل جدار الحماية عند 50,000 طلب/ثانية وتوزيع الأحمال الفيدرالية بصفة استباقية",
      lessonsLearnedEn: "Refined WAF rate limit thresholds and automated DNS Anycast routing configurations"
    }
  ],
  secThreatIntel: [
    {
      id: "sthr-1",
      ioc: "198.51.100.77",
      type: "ip",
      threatActor: "APT-Sudan-Sovereign-Threat",
      mitreMapping: "T1110 (Brute Force)",
      confidenceScore: 92,
      source: "المركز الوطني للأمن السيبراني بالسودان (NCSC)",
      lastUpdated: "2026-07-16T08:30:00Z",
      status: "active",
      severity: "high"
    },
    {
      id: "sthr-2",
      ioc: "9b34fa3df801baedce8923402e1a2fca9b81baecfca03e1a0bf10e408facd8ee",
      type: "file_hash",
      threatActor: "Sudan Industrial Ransomware Group",
      mitreMapping: "T1486 (Data Encrypted for Impact)",
      confidenceScore: 98,
      source: "US-CERT / Sudan CERT Joint Bulletin",
      lastUpdated: "2026-07-15T12:00:00Z",
      status: "active",
      severity: "critical"
    },
    {
      id: "sthr-3",
      ioc: "sudan-commerce-spoof.org",
      type: "domain",
      threatActor: "Phishing & Fraud Syndicate",
      mitreMapping: "T1566 (Phishing)",
      confidenceScore: 85,
      source: "Digital Trust Watchdog Sudan",
      lastUpdated: "2026-07-14T15:45:00Z",
      status: "active",
      severity: "medium"
    }
  ],
  secVulnerabilities: [
    {
      id: "svul-1",
      titleAr: "ثغرة تجاوز المصادقة في الواجهة الخلفية لبوابة الدفع القديمة",
      titleEn: "Authentication Bypass Vulnerability in Legacy Payment Interface",
      cveId: "CVE-2026-3199",
      component: "Sovereign Payment Gateway Legacy Connector",
      severity: "critical",
      score: 9.8,
      status: "patched",
      discoveredAt: "2026-07-10T09:00:00Z",
      remediationPlanAr: "ترقية حزمة الاتصال القديمة وحظر المنافذ الفرعية غير المستخدمة وتفعيل التوثيق الثنائي لجميع الموظفين الماليين",
      remediationPlanEn: "Upgrade legacy connector package, close unused ports and enforce MFA for all financial admin roles"
    },
    {
      id: "svul-2",
      titleAr: "حقن التعليمات البرمجية عبر حقول طلبات رخص الاستيراد المفتوحة",
      titleEn: "Reflected Cross-Site Scripting (XSS) in Import License Forms",
      cveId: "CVE-2026-4021",
      component: "Import & Export Licensing Platform",
      severity: "medium",
      score: 6.1,
      status: "remediation_scheduled",
      discoveredAt: "2026-07-15T14:30:00Z",
      remediationPlanAr: "تطبيق معالجة المدخلات الصارمة وتشفير المخرجات على استمارة الويب وجاري اختبار الرقعة البرمجية بمختبر التطوير",
      remediationPlanEn: "Apply strict input sanitization and output encoding on HTML forms. Patch testing currently in progress in staging."
    }
  ],
  secCertificates: [
    {
      id: "scert-1",
      serialNumber: "SN-7721-BC-2026",
      subjectAr: "بوابة التوقيع الفيدرالي الموحد - وزارة التجارة والصناعة السودانية",
      subjectEn: "Ministry of Commerce Sovereign Digital Signature Service Authority",
      issuer: "سلطة التصديق الإلكتروني الوطنية بالسودان",
      issueDate: "2026-01-01",
      expiryDate: "2027-01-01",
      status: "active",
      keyAlgorithm: "RSA 4096 (SHA256withRSA)"
    },
    {
      id: "scert-2",
      serialNumber: "SN-9981-XX-2025",
      subjectAr: "خادم الربط البيني لقواعد بيانات بورتسودان الجمركية",
      subjectEn: "Port Sudan Customs Sync Server Legacy Peer",
      issuer: "سلطة التصديق الإلكتروني الوطنية بالسودان",
      issueDate: "2025-05-15",
      expiryDate: "2026-05-15",
      status: "revoked",
      keyAlgorithm: "RSA 2048",
      revocationReasonAr: "انتهاء العمر الافتراضي للمفتاح الأمني واستبداله بالمعيار الفيدرالي 4096 بت المطور",
      revocationReasonEn: "Key retirement. Replaced with RSA 4096-bit sovereign compliant key."
    }
  ],
  secPolicies: [
    {
      id: "spol-1",
      titleAr: "سياسة التحقق التكيفي للمطالبة بالوصول المالي والسيادي",
      titleEn: "Adaptive MFA Policy for High-Value Financial Operations",
      type: "conditional_access",
      rulesAr: "تطلب الهوية الرقمية الموثقة مع التوثيق الثنائي المعتمد لأي معاملة دفع تتخطى قيمتها 10,000,000 جنيه سوداني أو أي معاملة للموظف خارج أوقات العمل الرسمية.",
      rulesEn: "Enforce biometric digital identity and secondary HSM authorization for any financial transaction exceeding 10M SDG or performed outside standard working hours.",
      status: "enforced",
      updatedAt: "2026-07-16T08:00:00Z",
      updatedBy: "مدير الهوية الرقمية وأمن المعلومات"
    },
    {
      id: "spol-2",
      titleAr: "سياسة حظر تسريب وثائق براءات الاختراع والابتكارات الاستراتيجية",
      titleEn: "DLP Rule for Strategic Patents & Sovereign Innovation Vault",
      type: "dlp_rule",
      rulesAr: "يمنع منعاً باتاً استخراج أو تحميل أو طباعة أي وثيقة لبراءات الاختراع ذات الحماية الوطنية الخاصة بالصناعات الدفاعية أو الدوائية دون موافقة كتابية مشفرة وموقعة برمز HSM الوزير.",
      rulesEn: "Strictly prohibit downloading or exporting documents from the Sovereign Patent Vault labeled high-security without Ministry HSM key authentication.",
      status: "enforced",
      updatedAt: "2026-07-14T11:00:00Z",
      updatedBy: "رئيس أمن المعلومات القومي"
    }
  ],
  secKpis: [
    { id: "skpi-1", metricNameAr: "مؤشر المخاطر السيبرانية الوطني الموحد", metricNameEn: "Unified National Cyber Risk Score", value: 18, target: 15, unit: "Risk Points", category: "compliance" },
    { id: "skpi-2", metricNameAr: "متوسط وقت رصد الثغرات والتهديدات (MTTD)", metricNameEn: "Mean Time to Detect (MTTD)", value: 4.2, target: 5.0, unit: "Minutes", category: "soc" },
    { id: "skpi-3", metricNameAr: "متوسط وقت عزل واحتواء الهجمات (MTTR)", metricNameEn: "Mean Time to Respond (MTTR)", value: 12.5, target: 15.0, unit: "Minutes", category: "soc" },
    { id: "skpi-4", metricNameAr: "معدل تغطية التوقيع والتحقق الرقمي الموثق", metricNameEn: "Digital Certificate Trust Coverage", value: 100, target: 100, unit: "%", category: "vulnerability" }
  ],
  secAuditLogs: [
    {
      id: "slog-1",
      timestamp: "2026-07-16T08:00:00Z",
      actor: "مركز عمليات الأمن السيبراني (SOC)",
      actionAr: "عزل وتحديث قواعد حظر جدار الحماية ضد شبكة بوتات مجهولة المصدر",
      actionEn: "Isolated and updated WAF blocklists against foreign botnet networks",
      details: "Block ID: sdn-waf-4411 | Blocked IP Range: 198.51.100.0/24",
      hash: "sha256_seclog01baefdce8910bcdafe223901ba3e"
    },
    {
      id: "slog-2",
      timestamp: "2026-07-16T09:12:05Z",
      actor: "رئيس قطاع الهوية الرقمية (IAM)",
      actionAr: "إبطال وسحب الشهادة الرقمية القديمة لبنك السودان فرع بورتسودان اللوجستي للتحديث المجدول",
      actionEn: "Revoked legacy digital certificate for Port Sudan Central Bank Sync node due to key migration",
      details: "Cert Serial: SN-9981-XX-2025",
      hash: "sha256_seclog02baefdce8910bcdafe223901ba4f"
    }
  ],
  comBusinesses: [
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
    }
  ],
  comLicenses: [
    { id: "lic-e-1", licenseNumber: "SD-ELIC-839201", type: "online_store_license", businessId: "db-2", storeName: "Kordofan Gum & Hibiscus Store", issueDate: "2026-02-21T14:30:00Z", expiryDate: "2027-02-21T14:30:00Z", status: "active" },
    { id: "lic-e-2", licenseNumber: "SD-ELIC-192837", type: "platform_operator_license", businessId: "db-1", storeName: "SudaMarket Organic Platform", issueDate: "2026-01-16T10:15:00Z", expiryDate: "2027-01-16T10:15:00Z", status: "active" }
  ],
  openDatasets: [
    { id: "ds-1", titleAr: "قاعدة بيانات الشركات والسجلات الرقمية الكلية", titleEn: "Sovereign Company & Store Registry Datasets", category: "company", downloadCount: 1420, recordCount: 18450, lastUpdated: "2026-07-15T00:00:00Z", size: "3.2 MB", descAr: "الإحصاءات والبيانات الوصفية لسجلات الشركات والمتاجر الموثقة في جمهورية السودان لعام 2026.", descEn: "Metadata and structural metrics of certified company and store registries in the Republic of Sudan for 2026." },
    { id: "ds-2", titleAr: "إحصائيات وحجم التجارة الرقمية الداخلية والخارجية", titleEn: "National Digital Trade & Transaction Volume statistics", category: "trade", downloadCount: 980, recordCount: 52100, lastUpdated: "2026-07-17T00:00:00Z", size: "12.4 MB", descAr: "أحجام المبيعات وقيم التبادل الرقمي وتدفق السلع بين الولايات السودانية ومحيط الكوميسا الإقليمي.", descEn: "Sales values, digital exchange volumes, and supply chain flows across Sudanese states and the COMESA region." },
    { id: "ds-3", titleAr: "مؤشرات نمو الطاقة الصناعية ومصانع الفرز الغذائي", titleEn: "Industrial Growth Capacity & Agro-sorting Indices", category: "industrial", downloadCount: 750, recordCount: 1240, lastUpdated: "2026-07-10T00:00:00Z", size: "1.8 MB", descAr: "بيانات الطاقة التشغيلية وتوزع المصانع ومواقع الفرز الاستراتيجية في المناطق الحرة والمدن اللوجستية.", descEn: "Operational capacity, factory distributions, and strategic agro-sorting facilities in free zones and logistics cities." },
    { id: "ds-4", titleAr: "خريطة الاستثمارات الأجنبية المباشرة وتدفقات رؤوس الأموال", titleEn: "Foreign Direct Investment Mapping & Allocation Trends", category: "investment", downloadCount: 1100, recordCount: 850, lastUpdated: "2026-07-14T00:00:00Z", size: "2.1 MB", descAr: "تدفقات رؤوس الأموال الأجنبية حسب القطاعات الاستثمارية والموقع الجغرافي ونسب إنجاز المشاريع المفتوحة.", descEn: "FDI inflows by sectors, coordinates, and open project execution percentage benchmarks." },
    { id: "ds-5", titleAr: "إحصاءات شكاوى حماية المستهلك ومؤشرات سلامة الأسواق", titleEn: "Consumer Protection Recalls & Price Resolution Trends", category: "consumer", downloadCount: 540, recordCount: 9320, lastUpdated: "2026-07-18T10:00:00Z", size: "4.5 MB", descAr: "كشوف الاستدعاءات ومعدلات حل المنازعات التجارية ورصد الأسعار ومستويات الامتثال لقوانين الغش التجاري.", descEn: "Product recall lists, marketplace dispute resolutions, price auditing tracks, and anti-fraud compliance statistics." }
  ],
  apiGatewayLogs: [
    { id: "akey-1", clientId: "sd-client-4829", clientName: "Portal Developer Hub", apiKey: "sd_api_live_f893b821098e4c7ba89", scopes: ["read:registry", "read:opendata"], status: "active", requestCount: 45290, errorRate: 0.12, avgLatency: 45 },
    { id: "akey-2", clientId: "sd-client-9102", clientName: "National Custom Integration", apiKey: "sd_api_live_10c283ea09ba28dce81", scopes: ["read:registry", "write:licensing"], status: "active", requestCount: 125020, errorRate: 0.05, avgLatency: 28 }
  ],
  observatoryMetrics: [
    { id: "met-1", metricAr: "معدل تبني المدفوعات الرقمية في المتاجر", metricEn: "E-Payment Adoption Rate in Stores", value: 78.4, target: 85.0, unit: "%", trend: "up" },
    { id: "met-2", metricAr: "نمو قطاع ريادة الأعمال الرقمي السنوي", metricEn: "Annual Digital SME Expansion Index", value: 18.2, target: 15.0, unit: "%", trend: "up" },
    { id: "met-3", metricAr: "نسبة التحصيل الرقمي للرسوم السيادية", metricEn: "Sovereign Digital Fee Collection", value: 94.6, target: 100.0, unit: "%", trend: "up" },
    { id: "met-4", metricAr: "معدل بقاء الشركات التقنية الناشئة (أكثر من سنتين)", metricEn: "Tech Startup Survival Rate (>2 Years)", value: 65.0, target: 75.0, unit: "%", trend: "stable" },
    { id: "met-5", metricAr: "حجم فرص العمل الجديدة المتولدة رقمياً", metricEn: "Digital Economy Jobs Spawned", value: 45200, target: 50000, unit: "Jobs", trend: "up" },
    { id: "met-6", metricAr: "نسبة رقمنة التراخيص والخدمات الحكومية للشركات", metricEn: "Sovereign G2B Service Digitalization Rate", value: 89.1, target: 95.0, unit: "%", trend: "up" }
  ],
  comNotifications: [
    { id: "ntf-e-1", titleAr: "تفعيل رخصة الكيان الرقمي الموحد بنجاح", titleEn: "Sovereign Digital License Activated", recipient: "+249912345001", channel: "all", status: "delivered", timestamp: "2026-07-16T10:15:00Z", messageAr: "تم تفعيل رخصتكم التجارية الرقمية الموحدة رقم SD-ELIC-192837 بنجاح تحت رؤية السودان 2035.", messageEn: "Your Sovereign Unified Digital Permit SD-ELIC-192837 is successfully active." },
    { id: "ntf-e-2", titleAr: "تحديث شروط تصدير السلع بموجب الكوميسا", titleEn: "Updated COMESA Agricultural Tariff Guideline", recipient: "amna@kordofangum.sd", channel: "email", status: "delivered", timestamp: "2026-07-17T08:00:00Z", messageAr: "عزيزي التاجر، تم تصفير الرسوم الجمركية على الصمغ الطبيعي المصدر إلى كينيا ومصر بالتكامل مع الكوميسا.", messageEn: "Sovereign notice: Zero customs tariff is now active for natural gum exported to Egypt and Kenya under COMESA agreements." }
  ]
};

// Read database from file or create new
function getDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(content);
      // Ensure all keys exist for backward compatibility
      let updated = false;
      const keys: (keyof DBState)[] = [
        "companies", "factories", "licenses", "certificates", 
        "landApplications", "complaints", "invoices", "payments", 
        "ledger", "refunds", "reconciliations", "gatewayLogs",
        "products", "recalls", "safetyAlerts", "priceRecords",
        "marketInspections", "consumerSurveys", "riskScores", "auditLedger",
        "documents", "correspondences", "archiveRecords", "knowledgeBase", "retentionPolicies", "govAuditLogs",
        "legalCases", "legalContracts", "legalOpinions", "legalRegulations", "legalCompliance", "legalRisks", "legalEnforcements",
        "employees", "orgUnits", "vacancies", "applications", "payrolls", "attendance", "leaves", "performance", "trainings", "talentPools", "hrAuditLogs",
        "assets", "facilities", "warehouses", "inventories", "fleetVehicles", "maintenanceWorkOrders", "spareParts", "assetKpis", "facilityKpis", "assetAuditLogs",
        "suppliers", "procurementPlans", "tenders", "bids", "purchaseOrders", "procurementContracts", "supplierKpis", "procurementAuditLogs",
        "grcRisks", "grcControls", "grcPolicies", "grcAudits", "grcFindings", "grcCorrectiveActions", "grcComplianceRecords", "grcIncidents", "grcAuditLogs",
        "secEvents", "secIncidents", "secThreatIntel", "secVulnerabilities", "secCertificates", "secPolicies", "secKpis", "secAuditLogs",
        "comBusinesses", "comLicenses", "openDatasets", "apiGatewayLogs", "observatoryMetrics", "comNotifications"
      ];
      for (const k of keys) {
        if (!db[k]) {
          db[k] = defaultDBState[k] || [];
          updated = true;
        }
      }
      if (updated) {
        saveDB(db);
      }
      return db;
    }
  } catch (e) {
    console.error("Failed to read database.json, initializing default", e);
  }
  saveDB(defaultDBState);
  return defaultDBState;
}

function saveDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write database.json", e);
  }
}

// Ensure database file is initialized
getDB();

// --- LAZY INITIALIZATION OF GEMINI SDK ---
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiInstance;
}

// --- API ENDPOINTS ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// --- GOVERNMENT RECORDS, CORRESPONDENCE, ARCHIVE & KNOWLEDGE PLATFORM ENDPOINTS ---

// 1. Enterprise Document Management Routes
app.get("/api/documents", (req, res) => {
  const db = getDB();
  res.json(db.documents || []);
});

app.post("/api/documents", (req, res) => {
  const db = getDB();
  const doc = {
    id: `DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: req.body.title || "وثيقة حكومية غير معنونة",
    titleEn: req.body.titleEn || "Untitled Government Document",
    fileType: req.body.fileType || "pdf",
    classification: req.body.classification || "public",
    version: req.body.version || "1.0",
    size: req.body.size || "1.5 MB",
    ownerName: req.body.ownerName || "الموظف الرقمي المعتمد",
    ownerRole: req.body.ownerRole || "Clerk",
    department: req.body.department || "الشؤون الإدارية العامة",
    retentionPeriodYears: req.body.retentionPeriodYears ? parseInt(req.body.retentionPeriodYears, 10) : 5,
    createdAt: new Date().toISOString(),
    tags: req.body.tags || [],
    isSigned: req.body.isSigned || false,
    signatureHash: req.body.signatureHash || null,
    sharedDepartments: req.body.sharedDepartments || []
  };

  db.documents = [doc, ...(db.documents || [])];

  // Log Audit trail
  const log = {
    id: `GLOG-${Date.now()}`,
    eventType: "document_creation",
    descriptionAr: `إنشاء الوثيقة رقم ${doc.id} تحت تصنيف ${doc.classification}`,
    descriptionEn: `Created document ${doc.id} under ${doc.classification} classification`,
    actorName: doc.ownerName,
    actorRole: doc.ownerRole,
    timestamp: doc.createdAt,
    documentId: doc.id,
    systemHash: `g_hash_${Math.random().toString(36).substring(2, 15)}`
  };
  db.govAuditLogs = [log, ...(db.govAuditLogs || [])];

  saveDB(db);
  res.status(201).json({ document: doc, log });
});

app.post("/api/documents/:id/share", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { department, actorName, actorRole } = req.body;

  let docIndex = (db.documents || []).findIndex(d => d.id === id);
  if (docIndex === -1) {
    return res.status(404).json({ error: "Document not found" });
  }

  const doc = db.documents[docIndex];
  if (!doc.sharedDepartments) doc.sharedDepartments = [];
  if (!doc.sharedDepartments.includes(department)) {
    doc.sharedDepartments.push(department);
  }

  // Log Audit trail
  const log = {
    id: `GLOG-${Date.now()}`,
    eventType: "document_sharing",
    descriptionAr: `مشاركة الوثيقة ${doc.id} مع إدارة: ${department}`,
    descriptionEn: `Shared document ${doc.id} with department: ${department}`,
    actorName: actorName || "مسؤول الوثائق المعتمد",
    actorRole: actorRole || "Records Officer",
    timestamp: new Date().toISOString(),
    documentId: doc.id,
    systemHash: `g_hash_${Math.random().toString(36).substring(2, 15)}`
  };
  db.govAuditLogs = [log, ...(db.govAuditLogs || [])];

  saveDB(db);
  res.json({ document: doc, log });
});

app.delete("/api/documents/:id", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { actorName, actorRole, action } = req.query; // action can be 'disposed' or 'destroyed'

  let docIndex = (db.documents || []).findIndex(d => d.id === id);
  if (docIndex === -1) {
    return res.status(404).json({ error: "Document not found" });
  }

  const doc = db.documents[docIndex];
  db.documents.splice(docIndex, 1);

  // If action is disposed, we can add it to archive records or permanently delete it
  const isDestroyed = action === "destroyed";

  const log = {
    id: `GLOG-${Date.now()}`,
    eventType: isDestroyed ? "document_destruction" : "document_disposal",
    descriptionAr: isDestroyed ? `إتلاف الوثيقة ${id} نهائياً بموجب السياسات` : `تنسيق واستبعاد الوثيقة ${id} من الملفات النشطة`,
    descriptionEn: isDestroyed ? `Permanently destroyed document ${id} under policy guidelines` : `Disposed document ${id} from active workspace`,
    actorName: (actorName as string) || "مسؤول السجلات الفيدرالي",
    actorRole: (actorRole as string) || "Records Officer",
    timestamp: new Date().toISOString(),
    documentId: id,
    systemHash: `g_hash_${Math.random().toString(36).substring(2, 15)}`
  };
  db.govAuditLogs = [log, ...(db.govAuditLogs || [])];

  saveDB(db);
  res.json({ success: true, message: "Document removed", log });
});

// 2. Electronic Correspondence Routes
app.get("/api/correspondences", (req, res) => {
  const db = getDB();
  res.json(db.correspondences || []);
});

app.post("/api/correspondences", (req, res) => {
  const db = getDB();
  const { subject, subjectEn, correspondenceType, sender, recipient, priority, classificationLevel, authorName, authorRole } = req.body;

  // Generate Reference Number
  const typeCode = correspondenceType === "incoming" ? "MIN" : correspondenceType === "outgoing" ? "OUT" : "INT";
  const refNum = `SD/MCI/${typeCode}/2026/${Math.floor(1000 + Math.random() * 9000)}`;

  const corr = {
    id: `CORR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    referenceNumber: refNum,
    subject: subject || "خطاب رسمي غير معنون",
    subjectEn: subjectEn || "Untitled Formal Correspondence",
    correspondenceType: correspondenceType || "internal",
    sender: sender || "الجهة المراسلة",
    recipient: recipient || "الجهة المستلمة",
    digitalSignature: null,
    qrCode: `https://verification.mof.gov.sd/verify/${refNum.replace(/\//g, "-")}`,
    priority: priority || "normal",
    classificationLevel: classificationLevel || "confidential",
    status: correspondenceType === "incoming" ? "registered" : "draft",
    createdAt: new Date().toISOString()
  };

  db.correspondences = [corr, ...(db.correspondences || [])];

  // Log audit
  const log = {
    id: `GLOG-${Date.now()}`,
    eventType: "correspondence_registration",
    descriptionAr: `تسجيل معاملة المراسلات الرسمية رقم ${corr.referenceNumber} (${corr.subject})`,
    descriptionEn: `Registered official correspondence ${corr.referenceNumber} (${corr.subjectEn})`,
    actorName: authorName || "مسؤول المراسلات",
    actorRole: authorRole || "Correspondence Officer",
    timestamp: corr.createdAt,
    documentId: corr.id,
    systemHash: `g_hash_${Math.random().toString(36).substring(2, 15)}`
  };
  db.govAuditLogs = [log, ...(db.govAuditLogs || [])];

  saveDB(db);
  res.status(201).json({ correspondence: corr, log });
});

app.post("/api/correspondences/:id/approve", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { actorName, actorRole } = req.body;

  let corrIdx = (db.correspondences || []).findIndex(c => c.id === id);
  if (corrIdx === -1) {
    return res.status(404).json({ error: "Correspondence not found" });
  }

  const corr = db.correspondences[corrIdx];
  corr.status = "approved";
  corr.digitalSignature = `sig_approved_multi_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;

  // Log audit
  const log = {
    id: `GLOG-${Date.now()}`,
    eventType: "digital_signature",
    descriptionAr: `توقيع واعتماد المعاملة الرسمية ${corr.referenceNumber} من قبل ${actorName}`,
    descriptionEn: `Digitally signed and approved correspondence ${corr.referenceNumber} by ${actorName}`,
    actorName: actorName || "ديوان السيد الوزير",
    actorRole: actorRole || "Minister",
    timestamp: new Date().toISOString(),
    documentId: corr.id,
    systemHash: `g_hash_${Math.random().toString(36).substring(2, 15)}`
  };
  db.govAuditLogs = [log, ...(db.govAuditLogs || [])];

  saveDB(db);
  res.json({ correspondence: corr, log });
});

// 3. Sovereign Digital Archive Routes
app.get("/api/archive", (req, res) => {
  const db = getDB();
  res.json(db.archiveRecords || []);
});

app.post("/api/archive", (req, res) => {
  const db = getDB();
  const { documentId, actorName, actorRole } = req.body;

  const doc = (db.documents || []).find(d => d.id === documentId);
  if (!doc) {
    return res.status(404).json({ error: "Original document not found" });
  }

  const archiveRec = {
    id: `ARC-2026-${Math.floor(100 + Math.random() * 900)}`,
    originalDocId: doc.id,
    title: doc.title,
    archivedBy: actorName || "أمين الأرشيف القومي",
    archivedAt: new Date().toISOString(),
    retentionUntil: new Date(Date.now() + doc.retentionPeriodYears * 365 * 24 * 60 * 60 * 1000).toISOString(),
    immutableHash: `sha256_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}91bc9a928edcf91a`,
    classification: doc.classification,
    status: "active_retention"
  };

  db.archiveRecords = [archiveRec, ...(db.archiveRecords || [])];

  // Update original doc status in log
  const log = {
    id: `GLOG-${Date.now()}`,
    eventType: "document_archiving",
    descriptionAr: `أرشفة وحفظ الوثيقة ${doc.id} بصيغة حجز سيادي غير قابل للتعديل الـ Blockchain`,
    descriptionEn: `Archived document ${doc.id} in sovereign immutable long-term storage`,
    actorName: actorName || "مسؤول الأرشيف المعتمد",
    actorRole: actorRole || "Archivist",
    timestamp: archiveRec.archivedAt,
    documentId: doc.id,
    systemHash: archiveRec.immutableHash
  };
  db.govAuditLogs = [log, ...(db.govAuditLogs || [])];

  saveDB(db);
  res.status(201).json({ archiveRecord: archiveRec, log });
});

// 4. Centralized Knowledge Repository Routes
app.get("/api/knowledge", (req, res) => {
  const db = getDB();
  res.json(db.knowledgeBase || []);
});

app.post("/api/knowledge", (req, res) => {
  const db = getDB();
  const { titleAr, titleEn, category, content, version, actorName, actorRole } = req.body;

  const kbItem = {
    id: `KB-${Math.floor(100 + Math.random() * 900)}`,
    titleAr: titleAr || "منشور معرفي جديد",
    titleEn: titleEn || "New Knowledge Base Document",
    category: category || "circular",
    content: content || "",
    version: version || "1.0",
    lastUpdated: new Date().toISOString()
  };

  db.knowledgeBase = [kbItem, ...(db.knowledgeBase || [])];

  // Log audit
  const log = {
    id: `GLOG-${Date.now()}`,
    eventType: "knowledge_publish",
    descriptionAr: `نشر منشور معرفي جديد في المستودع: ${kbItem.titleAr}`,
    descriptionEn: `Published new knowledge item: ${kbItem.titleEn}`,
    actorName: actorName || "مدير المعرفة الفيدرالي",
    actorRole: actorRole || "Director",
    timestamp: kbItem.lastUpdated,
    documentId: kbItem.id,
    systemHash: `g_hash_${Math.random().toString(36).substring(2, 15)}`
  };
  db.govAuditLogs = [log, ...(db.govAuditLogs || [])];

  saveDB(db);
  res.status(201).json({ knowledgeItem: kbItem, log });
});

// 5. System Policies & Auditing Logs
app.get("/api/retention-policies", (req, res) => {
  const db = getDB();
  res.json(db.retentionPolicies || []);
});

app.get("/api/gov-audit-logs", (req, res) => {
  const db = getDB();
  res.json(db.govAuditLogs || []);
});

// 6. AI-POWERED OCR & INTELLIGENT PROCESSING ENDPOINT
app.post("/api/documents/ocr", async (req, res) => {
  const { docType, fileDescription } = req.body;
  const ai = getGeminiClient();

  // 100% compliant sovereign AI model fallback
  const fallbacks: Record<string, any> = {
    license_scanned: {
      documentNumber: "SD-2026-90412",
      dates: ["2026-07-01", "2031-06-30"],
      names: ["أحمد محمد عثمان", "سليمان حسن فضل الله", "السيد وزير الصناعة والتجارة الاتحادية"],
      companyNumbers: ["SD-2026-90412", "COMESA-SD-94"],
      nationalIds: ["103-904-812", "201-445-912"],
      keywords: ["تأسيس شركة", "صمغ عربي", "سجل تجاري", "الترخيص الصناعي", "بورتسودان"],
      extractedText: `الجمهورية السودانية - وزارة التجارة والصناعة
قرار تأسيس ورخصة تشغيل تجاري رقم SD-2026-90412
بموجب الصلاحيات المخولة لي تحت المادة 8 من قانون الشركات الفيدرالي، أقر أنا مسجل عام الشركات بأن شركة "الخرطوم الموحدة لتصدير الصمغ العربي" برئاسة السادة أحمد محمد عثمان (رقم وطني 103-904-812) وسليمان حسن فضل الله (رقم وطني 201-445-912) مرخصة للعمل وتصدير المحاصيل الاستراتيجية.
تاريخ الإصدار: 1 يوليو 2026. ينتهي الصلاحية في 30 يونيو 2031.`
    },
    decree_scanned: {
      documentNumber: "SD/MCI/MIN/2026/0014",
      dates: ["2026-05-15"],
      names: ["بروفيسور عوض الله عمر", "وزير التجارة والصناعة الاتحادية", "وكيل قطاع الغابات"],
      companyNumbers: [],
      nationalIds: [],
      keywords: ["الصمغ العربي", "الفرز والتدقيق", "الهشاب", "الطلح", "ميناء بورتسودان"],
      extractedText: `ديوان السيد الوزير - مكتب الشؤون التنفيذية والسيادية
القرار الوزاري رقم 14 الصادر بتاريخ 15 مايو 2026
بشأن إعادة تصنيف وتعبئة صادرات الصمغ العربي لجمهورية السودان. يمنع تصنيع أو تصدير الصمغ العربي الخام دون الخضوع للفحص المجهري الكيميائي من مختبرات المطابقة المعتمدة لضمان المنافسة العالمية ومطابقة شروط سوق الكوميسا المشترك.`
    },
    customs_scanned: {
      documentNumber: "CO-SD-2026-5541",
      dates: ["2026-06-20"],
      names: ["فاطمة الزهراء علي", "ضابط الجمارك المناوب", "مستورد شركة البركة الغذائية"],
      companyNumbers: ["SD-2026-30219"],
      nationalIds: ["180-204-119"],
      keywords: ["شهادة المنشأ", "جمارك بورتسودان", "صمغ عربي طبيعي", "HS Code 1301.90"],
      extractedText: `مصلحة جمارك بورتسودان - السجل الموحد لجمهورية السودان
شهادة منشأ مرافقة رقم CO-SD-2026-5541
المرسل: المؤسسة الوطنية لتطوير الصمغ العربي (رخصة SD-2026-30219). المستورد: Al-Baraka Food Industries - جدة، المملكة العربية السعودية.
البضاعة المحملة: 25,000 كجم صمغ عربي طبيعي نقي هشاب ممتاز. رمز التعريف الجمركي: HS Code 1301.90.10. تم التدقيق والمطابقة.`
    }
  };

  const selectedFallback = fallbacks[docType] || {
    documentNumber: `SD-DOC-${Math.floor(1000 + Math.random() * 9000)}`,
    dates: [new Date().toISOString().split("T")[0]],
    names: ["مقدم الطلب الرقمي"],
    companyNumbers: [],
    nationalIds: [],
    keywords: ["عام", "معاملة تجارية", "مسح ضوئي"],
    extractedText: fileDescription || "تم إجراء المسح الضوئي الذكي للوثيقة المرفقة بنجاح واستخلاص النصوص الفيدرالية."
  };

  if (!ai) {
    return res.json({
      ocrResults: {
        ...selectedFallback,
        extractedText: `💡 (ملاحظة: يعمل بنظام المحاكاة السيادية لعدم توفر مفتاح GEMINI_API_KEY)\n\n${selectedFallback.extractedText}`
      }
    });
  }

  try {
    const prompt = `
      You are the Sudan Digital Ministry of Commerce & Industry AI OCR and document processor.
      Process the following scanned document text representation:
      "${selectedFallback.extractedText}"
      
      Additional context provided by user: "${fileDescription || ""}"
      
      Identify and extract with absolute precision:
      1. Document Number (look for SD-DOC, SD/MCI, SD, CO-SD, or other numbers)
      2. Document Dates
      3. Names (people, officials, ministers, applicants)
      4. Company Numbers (e.g., SD-2026-XXXXX)
      5. National IDs (look for typical ID numbers)
      6. Primary Keywords
      
      Return the result as a raw JSON object with the following schema:
      {
        "documentNumber": "string or null",
        "dates": ["string"],
        "names": ["string"],
        "companyNumbers": ["string"],
        "nationalIds": ["string"],
        "keywords": ["string"],
        "extractedText": "string (raw transcription of the scanned document)"
      }
      Do NOT wrap the JSON in markdown blocks like \`\`\`json. Return only pure raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    let resultJson = {};
    if (response.text) {
      resultJson = JSON.parse(response.text.trim());
    }

    res.json({ ocrResults: resultJson });

  } catch (error: any) {
    console.error("Gemini OCR Error:", error);
    res.json({
      ocrResults: {
        ...selectedFallback,
        extractedText: `⚠️ (فشل الاتصال بـ Gemini، تم تفعيل النموذج المحلي)\n\n${selectedFallback.extractedText}`
      }
    });
  }
});

// 7. AI DOCUMENT ASSISTANT ENDPOINT
app.post("/api/documents/assistant", async (req, res) => {
  const { title, content, type } = req.body;
  const ai = getGeminiClient();

  const simulatedAnalyses: Record<string, any> = {
    classification: "confidential",
    filingLocationAr: "ديوان معالي الوزير - قسم المتابعة الرقمية",
    filingLocationEn: "Office of the Minister - Digital Follow-up Dept",
    summaryAr: `• وثيقة رسمية تحدد المعايير المعتمدة لتدقيق وتصدير منتجات الصمغ العربي عبر ميناء بورتسودان.
• تلزم كافة المصانع بالفحص المخبري الكيميائي لشهادات المطابقة لضمان الجودة السودانية الدولية.
• تفوض لجنة الكوميسا بالإشراف على تيسير الصادرات المشتركة وتسهيل المعاملات اللوجستية للشركات الاستراتيجية.`,
    summaryEn: `• An official regulatory decree defining premium standards for sorting and exporting natural Gum Arabic.
• Standardizes a mandatory lab-testing policy for issuing federal safety certificates to prevent adulteration.
• Authorizes the COMESA regional trade desk to handle shipping corridors with high efficiency.`,
    retentionYears: 10,
    duplicateStatus: "لا يوجد مستندات مكررة متداخلة. الجدة الفنية والجدة الإدارية مطلقة (خالٍ من النزاعات)."
  };

  if (!ai) {
    return res.json({
      aiAnalysis: {
        ...simulatedAnalyses,
        summaryAr: `💡 (ملاحظة: محاكاة محلية لعدم توفر GEMINI_API_KEY)\n\n${simulatedAnalyses.summaryAr}`
      }
    });
  }

  try {
    const prompt = `
      You are the Sudan Digital Ministry of Commerce & Industry AI Document Assistant.
      Analyze this document:
      Title: "${title}"
      Content: "${content}"
      Requested Analysis Type: "${type || "all"}"

      Analyze and return a raw JSON object with the following schema:
      {
        "classification": "string (recommend confidential, secret, top_secret, or public)",
        "filingLocationAr": "string (Arabic recommended filing location in Sudanese ministry)",
        "filingLocationEn": "string (English recommended filing location)",
        "summaryAr": "string (2-3 concise bullet points summarizing in Arabic)",
        "summaryEn": "string (2-3 concise bullet points summarizing in English)",
        "retentionYears": number (recommended retention period in years),
        "duplicateStatus": "string (simulated duplication check statement in Arabic)"
      }
      Do NOT wrap the JSON in markdown blocks. Return only the raw JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    let resultJson = {};
    if (response.text) {
      resultJson = JSON.parse(response.text.trim());
    }

    res.json({ aiAnalysis: resultJson });

  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    res.json({
      aiAnalysis: {
        ...simulatedAnalyses,
        summaryAr: `⚠️ (فشل الاتصال بـ Gemini، تم استخدام النموذج المحلي المدمج)\n\n${simulatedAnalyses.summaryAr}`
      }
    });
  }
});

// Database Fetch / Write Endpoints
app.get("/api/companies", (req, res) => {
  const db = getDB();
  res.json(db.companies);
});

app.post("/api/companies", (req, res) => {
  const db = getDB();
  const newCompany = {
    id: `c-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.companies.unshift(newCompany);
  saveDB(db);
  res.json({ success: true, company: newCompany });
});

// Update company status (Gov role)
app.post("/api/companies/:id/status", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, notes } = req.body;
  const company = db.companies.find((c) => c.id === id);
  if (company) {
    company.status = status;
    if (notes) company.notes = notes;
    company.updatedAt = new Date().toISOString();
    saveDB(db);
    res.json({ success: true, company });
  } else {
    res.status(404).json({ error: "Company not found" });
  }
});

// Factories
app.get("/api/factories", (req, res) => {
  const db = getDB();
  res.json(db.factories);
});

app.post("/api/factories", (req, res) => {
  const db = getDB();
  const newFactory = {
    id: `f-${Date.now()}`,
    status: "pending",
    inspectionStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.factories.unshift(newFactory);
  saveDB(db);
  res.json({ success: true, factory: newFactory });
});

app.post("/api/factories/:id/inspect", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { inspectionStatus, lastInspectionDate, status } = req.body;
  const factory = db.factories.find((f) => f.id === id);
  if (factory) {
    if (inspectionStatus) factory.inspectionStatus = inspectionStatus;
    if (lastInspectionDate) factory.lastInspectionDate = lastInspectionDate;
    if (status) factory.status = status;
    factory.updatedAt = new Date().toISOString();
    saveDB(db);
    res.json({ success: true, factory });
  } else {
    res.status(404).json({ error: "Factory not found" });
  }
});

// Licenses
app.get("/api/licenses", (req, res) => {
  const db = getDB();
  res.json(db.licenses);
});

app.post("/api/licenses", (req, res) => {
  const db = getDB();
  const newLicense = {
    id: `l-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.licenses.unshift(newLicense);
  saveDB(db);
  res.json({ success: true, license: newLicense });
});

// Certificates of Origin
app.get("/api/certificates", (req, res) => {
  const db = getDB();
  res.json(db.certificates);
});

app.post("/api/certificates", (req, res) => {
  const db = getDB();
  const count = db.certificates.length + 1;
  const newCertificate = {
    id: `cer-${Date.now()}`,
    certificateNumber: `CO-SD-2026-${1000 + count}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.certificates.unshift(newCertificate);
  saveDB(db);
  res.json({ success: true, certificate: newCertificate });
});

// Land Applications
app.get("/api/land-applications", (req, res) => {
  const db = getDB();
  res.json(db.landApplications);
});

app.post("/api/land-applications", (req, res) => {
  const db = getDB();
  const newApplication = {
    id: `la-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.landApplications.unshift(newApplication);
  saveDB(db);
  res.json({ success: true, application: newApplication });
});

// Consumer Complaints
app.get("/api/complaints", (req, res) => {
  const db = getDB();
  res.json(db.complaints);
});

app.post("/api/complaints", (req, res) => {
  const db = getDB();
  const newComplaint = {
    id: `comp-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.complaints.unshift(newComplaint);
  saveDB(db);
  res.json({ success: true, complaint: newComplaint });
});

// --- CONSUMER PROTECTION PLATFORM NEW ENDPOINTS ---
app.get("/api/consumer/products", (req, res) => {
  const db = getDB();
  res.json(db.products || []);
});

app.post("/api/consumer/products", (req, res) => {
  const db = getDB();
  const newProduct = {
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.products = db.products || [];
  db.products.unshift(newProduct);
  saveDB(db);
  res.json({ success: true, product: newProduct });
});

app.get("/api/consumer/recalls", (req, res) => {
  const db = getDB();
  res.json(db.recalls || []);
});

app.post("/api/consumer/recalls", (req, res) => {
  const db = getDB();
  const newRecall = {
    id: `rec-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.recalls = db.recalls || [];
  db.recalls.unshift(newRecall);
  saveDB(db);
  res.json({ success: true, recall: newRecall });
});

app.post("/api/consumer/recalls/:id/status", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, unitsRecalled } = req.body;
  const recall = (db.recalls || []).find((r: any) => r.id === id);
  if (recall) {
    if (status) recall.status = status;
    if (unitsRecalled !== undefined) recall.unitsRecalled = unitsRecalled;
    saveDB(db);
    res.json({ success: true, recall });
  } else {
    res.status(404).json({ error: "Recall record not found" });
  }
});

app.get("/api/consumer/alerts", (req, res) => {
  const db = getDB();
  res.json(db.safetyAlerts || []);
});

app.post("/api/consumer/alerts", (req, res) => {
  const db = getDB();
  const newAlert = {
    id: `alert-${Date.now()}`,
    date: new Date().toISOString(),
    ...req.body
  };
  db.safetyAlerts = db.safetyAlerts || [];
  db.safetyAlerts.unshift(newAlert);
  saveDB(db);
  res.json({ success: true, alert: newAlert });
});

app.get("/api/consumer/prices", (req, res) => {
  const db = getDB();
  res.json(db.priceRecords || []);
});

app.post("/api/consumer/prices", (req, res) => {
  const db = getDB();
  const newPrice = {
    id: `pr-${Date.now()}`,
    ...req.body
  };
  db.priceRecords = db.priceRecords || [];
  db.priceRecords.unshift(newPrice);
  saveDB(db);
  res.json({ success: true, price: newPrice });
});

app.get("/api/consumer/inspections", (req, res) => {
  const db = getDB();
  res.json(db.marketInspections || []);
});

app.post("/api/consumer/inspections", (req, res) => {
  const db = getDB();
  const newInspection = {
    id: `insp-${Date.now()}`,
    date: new Date().toISOString(),
    ...req.body
  };
  db.marketInspections = db.marketInspections || [];
  db.marketInspections.unshift(newInspection);
  saveDB(db);
  res.json({ success: true, inspection: newInspection });
});

app.get("/api/consumer/surveys", (req, res) => {
  const db = getDB();
  res.json(db.consumerSurveys || []);
});

app.post("/api/consumer/surveys", (req, res) => {
  const db = getDB();
  const newSurvey = {
    id: `srv-${Date.now()}`,
    date: new Date().toISOString(),
    ...req.body
  };
  db.consumerSurveys = db.consumerSurveys || [];
  db.consumerSurveys.unshift(newSurvey);
  saveDB(db);
  res.json({ success: true, survey: newSurvey });
});

app.get("/api/consumer/risk-scores", (req, res) => {
  const db = getDB();
  res.json(db.riskScores || []);
});

app.get("/api/consumer/audit", (req, res) => {
  const db = getDB();
  res.json(db.auditLedger || []);
});

app.post("/api/consumer/audit", (req, res) => {
  const db = getDB();
  const newAudit = {
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body
  };
  db.auditLedger = db.auditLedger || [];
  db.auditLedger.unshift(newAudit);
  saveDB(db);
  res.json({ success: true, audit: newAudit });
});


// --- GOVERNMENT PAYMENT & REVENUE GATEWAY ENDPOINTS ---

// Invoices Endpoints
app.get("/api/invoices", (req, res) => {
  const db = getDB();
  res.json(db.invoices || []);
});

app.post("/api/invoices", (req, res) => {
  const db = getDB();
  const newInvoice = {
    id: `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    qrCode: "",
    digitalSignature: `sig_${Math.random().toString(16).substr(2, 40)}`,
    ...req.body,
  };
  newInvoice.qrCode = `https://verification.mof.gov.sd/verify/${newInvoice.id}`;
  db.invoices = db.invoices || [];
  db.invoices.unshift(newInvoice);
  saveDB(db);
  res.json({ success: true, invoice: newInvoice });
});

// Payments Endpoints
app.get("/api/payments", (req, res) => {
  const db = getDB();
  res.json(db.payments || []);
});

app.post("/api/payments", (req, res) => {
  const db = getDB();
  const { invoiceId, amount, method, gateway, token } = req.body;
  
  // Create payment transaction
  const payment = {
    id: `PAY-${Math.floor(1000000 + Math.random() * 9000000)}`,
    invoiceId,
    amount,
    method,
    gateway,
    status: "captured",
    transactionId: `TXN-SUDPAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
    token: token || `tok_${method}_${Math.floor(1000 + Math.random() * 9000)}`,
    riskScore: parseFloat((Math.random() * 0.1).toFixed(3)),
    createdAt: new Date().toISOString(),
  };

  // Find linked invoice and update
  const invoice = (db.invoices || []).find((inv) => inv.id === invoiceId);
  if (invoice) {
    invoice.status = "paid";
    invoice.paymentMethod = method;
    invoice.paymentDate = payment.createdAt;
  }

  // Create immutable Financial Ledger credit entry
  const ledgerEntry = {
    id: `LED-${Math.floor(100000 + Math.random() * 900000)}`,
    type: "credit",
    amount,
    account: "general_treasury",
    description: `تسوية رسوم ${invoice ? invoice.titleAr : 'خدمات تجارية'} - ${invoiceId}`,
    referenceId: invoiceId,
    createdAt: payment.createdAt,
  };

  // Create payment gateway mTLS API logs
  const logEntry = {
    id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
    endpoint: `https://api.national-gateway.gov.sd/v1/charge`,
    method: "POST",
    payload: JSON.stringify({ amount, currency: "SDG", invoice_id: invoiceId, method, gateway }),
    response: JSON.stringify({ status: "success", tx_id: payment.transactionId, code: "00", amount }),
    statusCode: 200,
    createdAt: payment.createdAt,
  };

  db.payments = db.payments || [];
  db.payments.unshift(payment);

  db.ledger = db.ledger || [];
  db.ledger.unshift(ledgerEntry);

  db.gatewayLogs = db.gatewayLogs || [];
  db.gatewayLogs.unshift(logEntry);

  saveDB(db);
  res.json({ success: true, payment, invoice });
});

// Financial Ledger Endpoints
app.get("/api/ledger", (req, res) => {
  const db = getDB();
  res.json(db.ledger || []);
});

// Refunds Endpoints
app.get("/api/refunds", (req, res) => {
  const db = getDB();
  res.json(db.refunds || []);
});

app.post("/api/refunds", (req, res) => {
  const db = getDB();
  const { invoiceId, amount, reason, requestedBy } = req.body;
  
  const refund = {
    id: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    invoiceId,
    amount,
    reason,
    requestedBy,
    status: "pending_review",
    approvedBy: "",
    createdAt: new Date().toISOString(),
  };

  // Find linked invoice and set status to refund_requested
  const invoice = (db.invoices || []).find((inv) => inv.id === invoiceId);
  if (invoice) {
    invoice.status = "refund_requested";
  }

  db.refunds = db.refunds || [];
  db.refunds.unshift(refund);
  saveDB(db);

  res.json({ success: true, refund });
});

app.post("/api/refunds/:id/status", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, approvedBy } = req.body;

  const refund = (db.refunds || []).find((r) => r.id === id);
  if (refund) {
    refund.status = status;
    refund.approvedBy = approvedBy || "وزير التجارة والصناعة";
    
    const invoice = (db.invoices || []).find((inv) => inv.id === refund.invoiceId);
    if (invoice) {
      invoice.status = status === "approved" ? "refunded" : "paid";
    }

    if (status === "approved") {
      // Create debit entry in Financial Ledger
      const ledgerEntry = {
        id: `LED-${Math.floor(100000 + Math.random() * 900000)}`,
        type: "debit",
        amount: refund.amount,
        account: "general_treasury",
        description: `استرجاع مالي لمشترك - ${refund.invoiceId} - سبب: ${refund.reason}`,
        referenceId: refund.id,
        createdAt: new Date().toISOString(),
      };
      db.ledger = db.ledger || [];
      db.ledger.unshift(ledgerEntry);
    }

    saveDB(db);
    res.json({ success: true, refund, invoice });
  } else {
    res.status(404).json({ error: "Refund request not found" });
  }
});

// Reconciliations Endpoints
app.get("/api/reconciliations", (req, res) => {
  const db = getDB();
  res.json(db.reconciliations || []);
});

app.post("/api/reconciliations", (req, res) => {
  const db = getDB();
  const { matchedCount, unmatchedCount, discrepancyAmount, periodStart, periodEnd } = req.body;
  
  const rec = {
    id: `REC-${Math.floor(100 + Math.random() * 900)}`,
    reconciledAt: new Date().toISOString(),
    periodStart: periodStart || new Date(Date.now() - 86400000).toISOString(),
    periodEnd: periodEnd || new Date().toISOString(),
    matchedCount: matchedCount || Math.floor(10 + Math.random() * 40),
    unmatchedCount: unmatchedCount || 0,
    discrepancyAmount: discrepancyAmount || 0,
    alerts: unmatchedCount > 0 ? ["كشف الفروقات المالي غير متطابق مع البوابة"] : [],
  };

  db.reconciliations = db.reconciliations || [];
  db.reconciliations.unshift(rec);
  saveDB(db);
  res.json({ success: true, reconciliation: rec });
});

// Gateway API logs
app.get("/api/gateway-logs", (req, res) => {
  const db = getDB();
  res.json(db.gatewayLogs || []);
});

// --- LEGAL AFFAIRS & LITIGATION PLATFORM ENDPOINTS ---

// Cases
app.get("/api/legal/cases", (req, res) => {
  const db = getDB();
  res.json(db.legalCases || []);
});

app.post("/api/legal/cases", (req, res) => {
  const db = getDB();
  const newCase = {
    id: `case-${Math.floor(100 + Math.random() * 900)}`,
    hearings: [],
    evidence: [],
    judgment: "",
    enforcementStatus: "pending_judgment",
    ...req.body
  };
  db.legalCases = db.legalCases || [];
  db.legalCases.unshift(newCase);
  saveDB(db);
  res.status(201).json({ success: true, case: newCase });
});

app.post("/api/legal/cases/:id/hearings", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { date, resultAr, resultEn } = req.body;
  const targetCase = (db.legalCases || []).find((c: any) => c.id === id);
  if (targetCase) {
    const newHearing = {
      id: `h-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      resultAr: resultAr || "",
      resultEn: resultEn || ""
    };
    targetCase.hearings = targetCase.hearings || [];
    targetCase.hearings.push(newHearing);
    saveDB(db);
    res.json({ success: true, hearing: newHearing, case: targetCase });
  } else {
    res.status(404).json({ error: "Case not found" });
  }
});

app.post("/api/legal/cases/:id/status", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, judgment, enforcementStatus } = req.body;
  const targetCase = (db.legalCases || []).find((c: any) => c.id === id);
  if (targetCase) {
    if (status) targetCase.status = status;
    if (judgment !== undefined) targetCase.judgment = judgment;
    if (enforcementStatus) targetCase.enforcementStatus = enforcementStatus;
    saveDB(db);
    res.json({ success: true, case: targetCase });
  } else {
    res.status(404).json({ error: "Case not found" });
  }
});

// Contracts
app.get("/api/legal/contracts", (req, res) => {
  const db = getDB();
  res.json(db.legalContracts || []);
});

app.post("/api/legal/contracts", (req, res) => {
  const db = getDB();
  const newContract = {
    id: `contract-${Math.floor(100 + Math.random() * 900)}`,
    status: "draft",
    approvalWorkflow: [
      { role: "Legal Officer", name: "أ. ماجدة الطيب", status: "approved", date: new Date().toISOString().split('T')[0] },
      { role: "Financial Reviewer", name: "أ. طارق عبد الوهاب", status: "pending", date: "" },
      { role: "Director of Legal Affairs", name: "د. سارة عثمان البشير", status: "pending", date: "" },
      { role: "Minister", name: "ديوان السيد الوزير", status: "pending", date: "" }
    ],
    digitalSignature: "",
    amendments: [],
    ...req.body
  };
  db.legalContracts = db.legalContracts || [];
  db.legalContracts.unshift(newContract);
  saveDB(db);
  res.status(201).json({ success: true, contract: newContract });
});

app.post("/api/legal/contracts/:id/review", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { role, name, status, digitalSignature } = req.body;
  const contract = (db.legalContracts || []).find((c: any) => c.id === id);
  if (contract) {
    const step = contract.approvalWorkflow.find((w: any) => w.role === role);
    if (step) {
      step.status = status || "approved";
      step.name = name || step.name;
      step.date = new Date().toISOString().split('T')[0];
    }
    
    // Check if fully approved
    const allApproved = contract.approvalWorkflow.every((w: any) => w.status === "approved");
    if (allApproved) {
      contract.status = "executed";
      if (digitalSignature) {
        contract.digitalSignature = digitalSignature;
      } else {
        contract.digitalSignature = `sig_contract_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      }
    } else {
      // Transition through states depending on role progress
      if (role === "Legal Officer" && status === "approved") {
        contract.status = "review_financial";
      } else if (role === "Financial Reviewer" && status === "approved") {
        contract.status = "review_governance";
      } else if (role === "Director of Legal Affairs" && status === "approved") {
        contract.status = "review_minister";
      }
    }
    saveDB(db);
    res.json({ success: true, contract });
  } else {
    res.status(404).json({ error: "Contract not found" });
  }
});

// Opinions
app.get("/api/legal/opinions", (req, res) => {
  const db = getDB();
  res.json(db.legalOpinions || []);
});

app.post("/api/legal/opinions", (req, res) => {
  const db = getDB();
  const newOpinion = {
    id: `opinion-${Math.floor(100 + Math.random() * 900)}`,
    status: "pending",
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.legalOpinions = db.legalOpinions || [];
  db.legalOpinions.unshift(newOpinion);
  saveDB(db);
  res.status(201).json({ success: true, opinion: newOpinion });
});

// Regulations
app.get("/api/legal/regulations", (req, res) => {
  const db = getDB();
  res.json(db.legalRegulations || []);
});

app.post("/api/legal/regulations", (req, res) => {
  const db = getDB();
  const newReg = {
    id: `reg-${Math.floor(100 + Math.random() * 900)}`,
    versionHistory: [
      { version: "1.0", date: new Date().toISOString().split('T')[0], notesAr: "الإصدار المبدئي للمنشور", notesEn: "Initial release" }
    ],
    ...req.body
  };
  db.legalRegulations = db.legalRegulations || [];
  db.legalRegulations.unshift(newReg);
  saveDB(db);
  res.status(201).json({ success: true, regulation: newReg });
});

// Compliance
app.get("/api/legal/compliance", (req, res) => {
  const db = getDB();
  res.json(db.legalCompliance || []);
});

app.post("/api/legal/compliance", (req, res) => {
  const db = getDB();
  const newComp = {
    id: `comp-rec-${Math.floor(100 + Math.random() * 900)}`,
    lastChecked: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.legalCompliance = db.legalCompliance || [];
  db.legalCompliance.unshift(newComp);
  saveDB(db);
  res.status(201).json({ success: true, compliance: newComp });
});

// Risks
app.get("/api/legal/risks", (req, res) => {
  const db = getDB();
  res.json(db.legalRisks || []);
});

app.post("/api/legal/risks", (req, res) => {
  const db = getDB();
  const newRisk = {
    id: `risk-${Math.floor(100 + Math.random() * 900)}`,
    status: "mitigating",
    ...req.body
  };
  db.legalRisks = db.legalRisks || [];
  db.legalRisks.unshift(newRisk);
  saveDB(db);
  res.status(201).json({ success: true, risk: newRisk });
});

// Enforcements
app.get("/api/legal/enforcements", (req, res) => {
  const db = getDB();
  res.json(db.legalEnforcements || []);
});

app.post("/api/legal/enforcements", (req, res) => {
  const db = getDB();
  const newEnf = {
    id: `enf-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.legalEnforcements = db.legalEnforcements || [];
  db.legalEnforcements.unshift(newEnf);
  saveDB(db);
  res.status(201).json({ success: true, enforcement: newEnf });
});

// AI LEGAL ADVISOR ENDPOINT
app.post("/api/legal/ai-advisor", async (req, res) => {
  const { docTitle, docContent, analysisType } = req.body;
  const ai = getGeminiClient();

  const simulatedAnalyses = {
    classify: {
      classification: "Confidential",
      reasonAr: "يحتوي هذا المستند على تفاهمات وشراكات مالية وعقدية سيادية قد تضر بالوضع المالي للوزارة إذا كُشفت للعلن.",
      reasonEn: "Contains sovereign commercial stipulations and financial commitments that require restricted legal access."
    },
    summarize: {
      summaryAr: [
        "يحدد هذا العقد إلتزامات وواجبات الأطراف الموقعة بالتفصيل لبناء وتطوير مركز الصادرات.",
        "تم الاتفاق على شروط سداد مالي صارمة عبر البوابة الوطنية الرقمية للمدفوعات حصرًا.",
        "تخضع كافة بنود تسوية المنازعات لسلطة مركز الخرطوم للتحكيم التجاري الدولي."
      ],
      summaryEn: [
        "Defines clear operational deliverables for construction and terminal expansion.",
        "Mandates centralized electronic processing of all fees and tariffs on the national portal.",
        "Explicitly references the Khartoum International Commercial Arbitration Code for dispute resolution."
      ]
    },
    risk_detect: {
      risks: [
        {
          severity: "high",
          titleAr: "بند الاختصاص القضائي الأجنبي المفتوح",
          titleEn: "Vague Jurisdiction Clause",
          descAr: "النص الحالي يفتح الباب للمحاكم الأجنبية لحل النزاعات بدلاً من مركز التحكيم السوداني المعتمد.",
          descEn: "Current wording permits potential foreign litigation instead of binding Khartoum arbitration."
        },
        {
          severity: "medium",
          titleAr: "غياب شرط القوة القاهرة المفصل في السودان",
          titleEn: "Inadequate Force Majeure Clause",
          descAr: "لا تغطي البنود الحالية الظروف الطارئة الخاصة بالمنطقة الإقليمية.",
          descEn: "Does not specifically enumerate logistical or regional operational disruption events."
        }
      ]
    },
    recommend_clauses: {
      clauses: [
        {
          titleAr: "بند تسوية المنازعات الموصى به سيادياً",
          titleEn: "Sovereign Dispute Resolution Clause",
          textAr: "«تُسوّى أي خلافات تنشأ عن هذا العقد بطريق التحكيم الودي أمام مركز الخرطوم للتحكيم التجاري الدولي وتكون أحكامه نهائية وملزمة للطرفين.»",
          textEn: "'Any disputes arising from this contract shall be settled exclusively and finally through binding friendly arbitration at the Khartoum International Commercial Arbitration Center.'"
        }
      ]
    },
    conflict_check: {
      conflicts: [
        {
          severity: "medium",
          regNameAr: "قانون تيسير وتطوير التجارة الإلكترونية الرقمية 2026",
          regNameEn: "E-Commerce Facilitation Act 2026",
          conflictAr: "المادة 4 تتطلب معالجة الفواتير رقمياً حصراً بينما المستند المرفق يشير لمعاملات ورقية بنكية اختيارية.",
          conflictEn: "Section 4 mandates electronic invoicing whereas this draft permits alternative manual banking flows."
        }
      ]
    },
    litigation_prediction: {
      probability: "Low (15%)",
      reasonsAr: "العقود المبرمة مع الوزارة تلتزم بقواعد التحكيم وتتضمن آليات تصفية حسابات رقمية تمنع نشوء النزاعات القضائية الطويلة.",
      reasonsEn: "Clear electronic escrow payment rules and binding local arbitration heavily suppress trial risk."
    }
  };

  const selectedResponse = simulatedAnalyses[analysisType] || simulatedAnalyses;

  if (!ai) {
    return res.json({
      aiAnalysis: {
        ...selectedResponse,
        note: "💡 (ملاحظة: محاكاة محلية لعدم توفر GEMINI_API_KEY)"
      }
    });
  }

  try {
    let prompt = "";
    if (analysisType === "classify") {
      prompt = `
        You are the Lead Government Legal Systems Architect.
        Classify this legal document:
        Title: "${docTitle}"
        Content: "${docContent}"
        Analyze and return a JSON object with this exact schema:
        {
          "classification": "string (Confidential, Secret, Top Secret, or Public)",
          "reasonAr": "detailed reason in Arabic",
          "reasonEn": "detailed reason in English"
        }
        Return ONLY raw JSON. Do not wrap in markdown block.
      `;
    } else if (analysisType === "summarize") {
      prompt = `
        You are the Lead Government Legal Systems Architect.
        Summarize this contract/document:
        Title: "${docTitle}"
        Content: "${docContent}"
        Analyze and return a JSON object with this exact schema:
        {
          "summaryAr": ["bullet 1", "bullet 2", "bullet 3 in Arabic"],
          "summaryEn": ["bullet 1", "bullet 2", "bullet 3 in English"]
        }
        Return ONLY raw JSON. Do not wrap in markdown block.
      `;
    } else if (analysisType === "risk_detect") {
      prompt = `
        You are the Lead Government Legal Systems Architect.
        Identify major contract risks or legal loopholes in:
        Title: "${docTitle}"
        Content: "${docContent}"
        Analyze and return a JSON object with this exact schema:
        {
          "risks": [
            {
              "severity": "high" or "medium" or "low",
              "titleAr": "Arabic title of risk",
              "titleEn": "English title of risk",
              "descAr": "Arabic description of the risk",
              "descEn": "English description of the risk"
            }
          ]
        }
        Return ONLY raw JSON. Do not wrap in markdown block.
      `;
    } else if (analysisType === "recommend_clauses") {
      prompt = `
        Recommend 1 or 2 ideal legal clauses to fortify this document:
        Title: "${docTitle}"
        Content: "${docContent}"
        Analyze and return a JSON object with this exact schema:
        {
          "clauses": [
            {
              "titleAr": "title",
              "titleEn": "title",
              "textAr": "Arabic full clause text",
              "textEn": "English full clause text"
            }
          ]
        }
        Return ONLY raw JSON. Do not wrap in markdown block.
      `;
    } else if (analysisType === "conflict_check") {
      prompt = `
        Identify any potential conflicts with Sudan Trade Regulations, E-Commerce Act 2026 or Consumer Protection laws in:
        Title: "${docTitle}"
        Content: "${docContent}"
        Analyze and return a JSON object with this exact schema:
        {
          "conflicts": [
            {
              "severity": "high" or "medium" or "low",
              "regNameAr": "Sudanese Regulation name in Arabic",
              "regNameEn": "Sudanese Regulation name in English",
              "conflictAr": "detailed conflict explanation in Arabic",
              "conflictEn": "detailed conflict explanation in English"
            }
          ]
        }
        Return ONLY raw JSON. Do not wrap in markdown block.
      `;
    } else if (analysisType === "litigation_prediction") {
      prompt = `
        Evaluate the likelihood of litigation or regulatory breach for:
        Title: "${docTitle}"
        Content: "${docContent}"
        Analyze and return a JSON object with this exact schema:
        {
          "probability": "Low (X%)" or "Medium (X%)" or "High (X%)",
          "reasonsAr": "detailed reasons in Arabic",
          "reasonsEn": "detailed reasons in English"
        }
        Return ONLY raw JSON. Do not wrap in markdown block.
      `;
    } else {
      prompt = `
        Perform general legal analysis for:
        Title: "${docTitle}"
        Content: "${docContent}"
        Return ONLY raw JSON matching a general summary schema.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    let resultJson = {};
    if (response.text) {
      resultJson = JSON.parse(response.text.trim());
    }
    res.json({ aiAnalysis: resultJson });

  } catch (error: any) {
    console.error("AI Legal Advisor Error:", error);
    res.json({
      aiAnalysis: {
        ...selectedResponse,
        note: "⚠️ (فشل الاتصال بـ Gemini، تم استخدام النموذج المدمج)"
      }
    });
  }
});

// AI Copilot Integration
app.post(["/api/chat", "/api/gemini/chat"], async (req, res) => {
  try {
    const { message, history, context } = req.body;
    
    // Lazy initialize Gemini SDK
    let ai: GoogleGenAI | null = null;
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined in environment. Using high-fidelity fallback simulator.");
      
      let mockReply = "";
      const query = message.toLowerCase();
      
      if (query.includes("رخصة") || query.includes("ترخيص") || query.includes("تصريح") || query.includes("مطابقة") || query.includes("license") || query.includes("permit") || query.includes("compliance")) {
        mockReply = "مرحباً بك في المنصة الفيدرالية الموحدة للتراخيص والمطابقة لجمهورية السودان. تتيح لك المنصة استخراج الرخص التجارية والتشغيل الصناعي (تأسيس المصانع وخطوط الفرز) وإجراء التعديلات والتجديدات سيادياً بالكامل إلكترونياً، مع تتبع الزيارات والرقابة الميدانية ومطابقة الشروط البيئية والصحية بالتكامل مع السجل التجاري.";
      } else if (query.includes("تأسيس") || query.includes("شركة") || query.includes("حوكمة") || query.includes("دمج") || query.includes("تعديل") || query.includes("incorporate") || query.includes("company") || query.includes("corporate")) {
        mockReply = "مرحباً بك في نظام تأسيس وحوكمة الشركات الرقمي لجمهورية السودان. يمكنك الآن تأسيس الشركات بمختلف أنواعها (المسؤولية المحدودة ذ.م.م، التوصية البسيطة، المساهمة العامة) وإيداع الحصص والتحقق منها وتحديث البيانات القانونية وتأسيس الفروع وتطبيق التصفية إلكترونياً بالكامل حوكمةً وامتثالاً لرؤية 2035.";
      } else if (query.includes("اسم") || query.includes("حجز") || query.includes("name") || query.includes("classification")) {
        mockReply = "مرحباً بك في نظام حجز الأسماء التجارية الفيدرالي الرقمي الموحد لعام 2026. يمكنك من خلال هذه المنصة فحص وحجز الأسماء التجارية في ثوانٍ، وتعديل الملكية ونقلها، وتمديد فترة حجز الاسم، والتحقق الفوري من شهادة حجز الاسم عبر رمز الاستجابة السريعة (QR Code).";
      } else if (query.includes("تصدير") || query.includes("استيراد") || query.includes("منشأ") || query.includes("export") || query.includes("import")) {
        mockReply = "لتسجيل المصدرين والمستوردين وتوثيق عمليات التبادل التجاري، يمكنك استخدام وحدة الاستيراد والتصدير (Import & Export). هذه الوحدة تمكنك من حجز الحصص السنوية وتصدير شهادة المنشأ الإلكترونية الموثقة برمز QR لتسهيل التخليص الجمركي في الموانئ.";
      } else {
        mockReply = "أهلاً بك في منصة وزارة التجارة والصناعة السودانية الرقمية 2035. أنا مساعدك الذكي المتكامل للوزارة الرقمية السودانية 2035. يمكنني إرشادك في حجز الأسماء التجارية، السجل التجاري، تأسيس وحوكمة الشركات، التراخيص الفيدرالية والمطابقة، التراخيص الصناعية، شهادات المنشأ، تتبع الاستثمارات، أو رفع شكاوى حماية المستهلك. كيف يمكنني خدمتك اليوم؟";
      }

      return res.json({
        text: `💡 (ملاحظة: يعمل المساعد حالياً بنظام محاكاة الذكاء الاصطناعي لعدم توفر مفتاح GEMINI_API_KEY في الإعدادات)\n\n${mockReply}`,
        suggestions: [
          "كيف يمكنني تقديم رخصة تشغيل صناعي للمصنع؟",
          "تجديد رخصة تجارية أو تقديم طلب تعديل أنشطة",
          "التحقق من صحة ترخيص عبر رمز الاستجابة السريعة QR",
          "قوانين المطابقة والرقابة البيئية المعتمدة"
        ]
      });
    }

    // System instruction to guide Gemini perfectly
    const systemInstruction = `
      You are the Sudan Digital Ministry of Commerce & Industry AI Assistant (مساعد وزارة التجارة والصناعة السودانية الرقمية الذكي - رؤية 2035).
      Your role is to guide and advise users (citizens, local businesses, international investors, and government employees) about policies, registrations, trade regulations, consumer protection, and industrial development in Sudan.
      
      Always frame responses around Sudan's "Vision 2035" for digital transformation, including:
      - Quick, modern company incorporation and corporate lifecycle (تأسيس وحوكمة الشركات وإدارة دورة حياتها بالكامل).
      - Complete Licensing Platform supporting commercial/industrial licenses and special permits lifecycle (منصة التراخيص والمطابقة الوطنية الموحدة).
      - Quick, modern commercial registration (السجل التجاري الرقمي والأسماء التجارية).
      - Modernizing industrial factories and smart manufacturing (المنصة الصناعية الذكية).
      - Seamless export/import certifications and digitized certificates of origin (شهادة المنشأ الرقمية وميناء بورتسودان الذكي).
      - Investment opportunities in golden sectors (الصمغ العربي, agriculture, gold, industrial zones like Giad, Port Sudan Free Zone, El Bagair).
      - Active consumer protection and market surveillance (حماية المستهلك وضبط الأسواق).

      Be extremely professional, encouraging, and formally polite. Use Sudan government administrative terms appropriately.
      Always respond in Arabic by default unless the user communicates in English.
      If the user is asking how to do something, provide step-by-step instructions and refer to the specific modules in this system.
      
      Current system context:
      ${JSON.stringify(context)}
    `;

    // Map history to Google GenAI schema format
    const formattedContents = [];
    for (const h of history) {
      if (h.sender === "user") {
        formattedContents.push({ role: "user", parts: [{ text: h.text }] });
      } else {
        formattedContents.push({ role: "model", parts: [{ text: h.text }] });
      }
    }
    // Add current query
    formattedContents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "عذراً، لم أتمكن من معالجة الطلب في الوقت الحالي.";

    // Generate smart follow-up suggestions dynamically
    const suggestionsResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `بناءً على الرد التالي، اقترح 3 أسئلة متابعة قصيرة جداً ومناسبة يمكن للمستثمر أو المواطن السوداني طرحها. عد بـ JSON كصفوف نصوص بسيطة فقط:
      الرد: "${responseText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: { type: "string" }
        }
      }
    });

    let suggestions = [
      "كيف أبدأ بتسجيل شركتي؟",
      "ما هي شروط ترخيص منشأة صناعية؟",
      "ما هي تكلفة إصدار شهادة المنشأ؟"
    ];

    try {
      if (suggestionsResponse.text) {
        const parsed = JSON.parse(suggestionsResponse.text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          suggestions = parsed;
        }
      }
    } catch (e) {
      // Ignore parse errors, use defaults
    }

    res.json({
      text: responseText,
      suggestions: suggestions.slice(0, 4)
    });

  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({
      error: "فشل مساعد الذكاء الاصطناعي في الاتصال بـ Gemini",
      details: error.message
    });
  }
});

// AI Industrial Advisor Route
app.post("/api/industrial/ai-advisor", async (req, res) => {
  const { prompt, scenario, context } = req.body;
  const ai = getGeminiClient();

  // Sophisticated Sudanese industrial simulated response if no Gemini key
  if (!ai) {
    let simulatedResponse = "";
    if (scenario === "recommend_incentives") {
      simulatedResponse = `### 📋 توصية الحوافز والتسهيلات الصناعية المقترحة لعام 2035
بناءً على معطيات مصنعك وموقعه الجغرافي ونوعه، نوصي بالحوافز الاستثمارية التالية طبقاً لـ **قانون تشجيع الاستثمار والتنمية الصناعية السوداني المحدث**:

1. **الإعفاء الضريبي الكامل**: إعفاء من ضريبة أرباح الأعمال لمدة **7 سنوات** نظراً لإنشاء خطوط إنتاج وتعبئة في قطاع ذو أولوية استراتيجية.
2. **خصم جمركي سيادي بنسبة 100%**: إعفاء كامل على كافة الآلات، المعدات، خطوط الإنتاج وقطع الغيار المستوردة عبر ميناء بورتسودان لصالح المشروع.
3. **تخصيص أرض صناعية مخفضة**: أولوية تخصيص أرض بمساحة إضافية للتوسع في **منطقة الباقير الصناعية** بسعر رمزي وفترة سماح سداد تصل إلى 10 سنوات.
4. **دعم استهلاك الطاقة الهجين**: خصم بنسبة **25%** على تعرفة الكهرباء الصناعية الحكومية نظراً لإدراج خلايا طاقة شمسية هجينة لخطوط الإنتاج كطاقة صديقة للبيئة.

*هذا التقرير صادر آلياً كمسودة استشارية من مكتب التنمية الفيدرالي في الخرطوم.*`;
    } else if (scenario === "predict_bottlenecks") {
      simulatedResponse = `### ⚠️ تحليل التنبؤ باختناقات ومخاطر الإنتاج
تم إجراء تدقيق محاكاة رقمي ديناميكي استناداً إلى سلاسل الإمداد ومصادر تشغيل الطاقة في السودان:

- **الكهرباء المستقرة (الخطورة: متوسطة إلى عالية)**: نتوقع اختناقاً بنسبة **18%** في ساعات الذروة خلال الصيف. ننصح بجدولة دورات الصيانة الكبرى للمحركات في فترات الصيانة المخططة للشبكة الوطنية، مع تفعيل نظام المولدات الهجينة.
- **سلسلة إمداد المواد الخام (الخطورة: منخفضة)**: تتوفر مدخلات الإنتاج المحلية (الزيوت، الصمغ العربي، أو مدخلات الغزل والنسيج) بشكل جيد، لكن نوصي برفع المخزون الاحتياطي بمستودعات التخزين لتغطية **45 يوماً** تحسباً لتقلبات الشحن الداخلي.
- **كفاءة الآلات وسرعة الخطوط (OEE)**: نلاحظ احتمالية تعطل المحرك الرئيسي لخط الإنتاج رقم 2 بسبب تذبذب الجهد. يُقترح تركيب نظام استقرار جهد مغناطيسي حاسم لحماية خطوط Industry 4.0.`;
    } else if (scenario === "forecast_growth") {
      simulatedResponse = `### 📈 التوقعات المستقبلية للنمو الصناعي (2026 - 2035)
تحليل اقتصادي واستراتيجي للنمو المقدر للمنشآت الصناعية في الجمهورية السودانية:

- **معدل النمو المتوقع لقطاعك**: **12.4% سنويًا** مدعوماً بطلب السوق الإقليمي المتزايد في دول الكوميسا ودول الجوار.
- **توقعات زيادة القدرة التنافسية للشركة**: رفع الحصة السوقية بمقدار **15%** بمجرد الحصول على شهادة المطابقة البيئية والجودة الكاملة وتطبيق الأتمتة الذكية.
- **الصادرات الاستراتيجية**: فرص ممتازة لفتح أسواق تصديرية جديدة لمنتجاتك المصنعة إلى الخليج العربي وشرق أفريقيا بإعفاءات جمركية تفضيلية طبقاً للاتفاقيات المشتركة.`;
    } else if (scenario === "detect_risks") {
      simulatedResponse = `### 🛡️ كشف وتقييم المخاطر التشغيلية والسيبرانية الصناعية
تقرير أمن وسلامة المنشأة الصناعية:

1. **المخاطر التشغيلية**: عدم اكتمال تدريب فريق العمل الميداني على بروتوكولات الأجهزة الهيدروليكية المتقدمة. نوصي بعقد دورة تدريبية عاجلة بالتعاون مع معهد جياد التكنولوجي.
2. **المخاطر البيئية**: مستويات انبعاث كربونية دقيقة متوافقة مع الحدود المسموح بها، لكن هناك حاجة لتحديث فلاتر معالجة الصرف الصناعي لمنع غرامات التفتيش البيئي الفيدرالي.
3. **مخاطر الأمن السيبراني لـ Industry 4.0**: خطوط الإنتاج المتصلة بالإنترنت للمراقبة الآلية قد تتعرض لثغرات في حال عدم تشفير قنوات اتصالات الحافة (Edge Devices). يجب تفعيل ميزة التوقيع الرقمي ومطابقة معايير جدار الحماية الحكومي الموحد.`;
    } else if (scenario === "optimize_performance") {
      simulatedResponse = `### ⚙️ توصيات تحسين الكفاءة التشغيلية (OEE)
مقترحات لرفع معدلات الفعالية الإجمالية للمعدات لتصل إلى المعدل العالمي المستهدف وهو **85%**:

- **تقليل فترات التوقف غير المخطط لها**: تطبيق الصيانة الوقائية المستندة إلى ساعات العمل الفعلية للماكينات، والتحول من الصيانة التفاعلية إلى الاستباقية عبر مستشعرات الحرارة والاهتزاز الدورية.
- **تحسين جودة المخرجات**: أتمتة نظام فرز الجودة النهائي باستخدام كاميرات فحص رقمية مرتبطة بوحدات المعالجة لتحديد المنتجات المعيبة تلقائياً قبل مرحلة التعبئة النهائية.
- **ترشيد استهلاك الطاقة**: استبدال المحركات الكهربائية القديمة بمحركات ذات تردد متغير (VFD) مما سيوفر ما يقارب **32%** من تكلفة استهلاك التيار والكهرباء شهرياً.`;
    } else if (scenario === "recommend_inspections") {
      simulatedResponse = `### 🔍 أولويات وجدولة التفتيش الفني والبيئي الذكي
توجيهات لجدولة عمليات التفتيش بناءً على معايير نظام الرقابة والامتثال الفيدرالي:

- **أولوية الزيارة الميدانية**: **منخفضة الخطورة** نظراً لالتزام المصنع بتسجيل كافة خطوط الإنتاج وتقديم تقارير دورية.
- **موعد التفتيش القادم الموصى به**: الربع الأخير من العام الحالي (سبتمبر 2026).
- **محاور التركيز للمفتشين**: مراجعة أنظمة السلامة المهنية ومخارج الطوارئ، ومطابقة سجل التدقيق الموحد للوزارة مع السجلات التشغيلية للمصنع للتأكد من تدوين كميات المنتجات الحقيقية.`;
    } else {
      simulatedResponse = `### 📊 تقرير الذكاء الاستراتيجي والأداء الصناعي الموحد
تم إعداد هذا التقرير الفيدرالي الشامل لدعم متخذي القرار والمستثمرين في السودان:

1. **ملخص الكفاءة**: الطاقة الإنتاجية للمنشآت الصناعية في السودان تشهد تعافياً ملحوظاً بنسبة **8.5%** نتيجة التحول الرقمي وتسهيلات الرخص الفورية.
2. **توزيع الموارد**: تتركز أكبر كثافة صناعية في ولاية الخرطوم وولاية البحر الأحمر (بورتسودان)، مع نمو متسارع لمدن التصنيع الزراعي في الجزيرة والقضارف ونهر النيل.
3. **التوصية الاستراتيجية**: ينصح بالتوسع الفوري في تأسيس خطوط Industry 4.0 لتقليص الاعتماد على العمالة اليدوية ورفع جودة المنتج السوداني للمنافسة العالمية.`;
    }

    if (prompt) {
      simulatedResponse += `\n\n**💡 إجابة مخصصة لاستفسارك ("${prompt}")**:\nلقد تم تحليل استفسارك الخاص ضمن محاكي التنمية الصناعية الذكي. بناءً على السياسات المعتمدة، نؤكد أن الوزارة تدعم هذه التوجهات وتوفر نوافذ تمويلية ميسرة بالتعاون مع بنك التنمية الصناعي لتمويل التحول الرقمي ومعدات الأتمتة الحديثة بنسبة مرابحة رمزية لا تتجاوز 4% مع فترة سداد تصل لـ 5 سنوات.`;
    }

    return res.json({
      text: `💡 (ملاحظة: يعمل مستشار الذكاء الاصطناعي بنظام محاكاة التنمية الفيدرالي المحدث لعدم توفر مفتاح GEMINI_API_KEY)\n\n${simulatedResponse}`,
    });
  }

  try {
    const systemInstruction = `
      You are the world's leading Industrial Digital Transformation Advisor, Smart Manufacturing Architect, and AI Industrial Policy Consultant for the Sudan Digital Ministry of Commerce & Industry (رؤية السودان للتنمية الصناعية الرقمية 2035).
      Your role is to analyze factories, production capacities, industrial cities, and supply chain data, and to generate world-class, precise, executive industrial recommendations, growth forecasts, risk detections, or compliance priorities.
      
      Provide deeply contextualized advice for Sudan. Incorporate reference locations like Khartoum North, El Bagair, Giad, Port Sudan Free Zone, Soba, or Gum Arabic clusters. Mention challenges and advantages like solar hybrid energy, local crop processing, regional trade with COMESA, and raw materials (Sesame, Cotton, Gum Arabic, Minerals).
      
      Respond in Arabic by default with highly elegant, professional, administrative, and strategic tone. Format your response beautifully using rich Markdown.
      
      Scenario selected: ${scenario}
      Factory/Sector context: ${JSON.stringify(context || {})}
    `;

    const userMessage = prompt 
      ? `تحليل وتوجيه خاص بـ: ${prompt}` 
      : `الرجاء إصدار التقرير والتحليل الاستراتيجي الفوري المناسب لهذا القسم الصناعي طبقاً للسيناريو المحدد.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن مستشار الذكاء الاصطناعي من صياغة التقرير."
    });

  } catch (err: any) {
    console.error("Industrial AI Error:", err);
    res.status(500).json({
      error: "فشل مستشار الصناعة الذكي في الاتصال بـ Gemini",
      details: err.message
    });
  }
});

// AI Innovation & IP Advisor Route
app.post("/api/innovation/advisor", async (req, res) => {
  const { query, lang } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Return high-fidelity sovereign fallback advice based on keywords in the query
    let responseText = "";
    const isAr = lang === "ar";
    const q = (query || "").toLowerCase();

    if (q.includes("براءة") || q.includes("براءات") || q.includes("صياغ") || q.includes("patent") || q.includes("claim")) {
      responseText = isAr
        ? `### 📝 دليل صياغة عناصر براءات الاختراع والملكية الفكرية السودانية (رؤية 2035)

بموجب قانون براءات الاختراع السوداني، يجب صياغة عناصر الحماية (Claims) بدقة هندسية عالية باللغتين العربية والإنجليزية. ننصحك باتباع الهيكل الفيدرالي التالي:

1. **القسم التمهيدي (Preamble)**: يحدد فئة الاختراع وتطبيقاته (مثال: "نظام هجين لفرز وتعبئة الحبوب...").
2. **القسم الانتقالي (Transitional Phrase)**: يربط التمهيد بالعناصر المحددة (يفضل استخدام عبارة: "يتميز بـ..." أو "Comprising of...").
3. **الجسم الرئيسي (Body)**: تفصيل الخطوات والمكونات الميكانيكية أو البرمجية المبتكرة المترابطة وعلاقتها الفنية التفاعلية.

**⚠️ توصية فنية**: يجب ألا تتداخل بنود الحماية مع براءات اختراع سابقة مسجلة في قاعدة بيانات الكوميسا (COMESA) أو السجل الفيدرالي لجمهورية السودان لضمان الجدة المطلقة.`
        : `### 📝 Sudanese Patent Drafting & Claims Guide (Vision 2035)

Under the Sudanese Intellectual Property Office bylaws, patent claims must be structured with high technical precision in both Arabic and English:

1. **The Preamble**: Defines the technical category (e.g., "A hybrid sensor-driven crops compactor...").
2. **The Transitional Phrase**: e.g., "characterized in that..." or "comprising of...".
3. **The Body**: Describes the structural interconnection of the physical or algorithmic components that form the invention.

**⚠️ Regulatory Recommendation**: Run an exhaustive prior art search across the regional COMESA patent database and the sovereign SDMCI registry prior to final deposition to ensure absolute industrial novelty.`;
    } else if (q.includes("تمويل") || q.includes("منح") || q.includes("صندوق") || q.includes("fund") || q.includes("grant") || q.includes("money")) {
      responseText = isAr
        ? `### 💰 برامج التمويل والمنح المتاحة في صندوق الابتكار الفيدرالي 2026

يسر صندوق الابتكار والتحول الصناعي الوطني توفير المسارات المالية التالية لدعم البحث والتطوير التجاري:

1. **شريحة منحة الابتكار الفردية**: تمويل فوري يصل إلى **10 مليون جنيه سوداني** للمخترعين المستقلين المسجلين في السجل الوطني لتطوير النماذج الأولية المعملية.
2. **شريحة تمويل بذور الشركات الناشئة (Startup Seed Capital)**: مساهمة رأسمالية تصل إلى **50 مليون جنيه سوداني** لتغطية مصاريف التأسيس والتسويق لشركات الابتكار الصناعي.
3. **صندوق تطوير التكنولوجيا الصناعية**: مخصص للمشاريع البحثية المشتركة (جامعة ⇆ مصنع) بميزانيات تصل إلى **200 مليون جنيه سوداني** لتوطين خطوط الإنتاج المتقدمة ومطابقتها للشروط الفيدرالية.

**🔗 خطوة المتابعة**: تفضل بملء طلب تخصيص سيادي متكامل عبر علامة التبويب "صندوق الابتكار" وسيتم توجيه الملف لمدير المخصصات لتقييم الملاءمة المالية المباشرة.`
        : `### 💰 Federal Funding Opportunities within the National Innovation Fund (NIF)

The sovereign Innovation Fund provides robust financial tracks to accelerate technological commercialization in Sudan:

1. **Individual Innovation Grants**: Up to **10 Million SDG** for independent creators to develop lab-validated models.
2. **Startup Seed Funding**: Up to **50 Million SDG** equity-free or matched seed capital to incorporate and scale.
3. **Technology Development Funds**: Up to **200 Million SDG** specifically allocated for joint Academia-Industry partnerships localizing key supply chain parts.

**🔗 Action Item**: Apply directly inside the "Innovation Fund" tab in the portal to route your dossier to the Sovereign Allocations Board.`;
    } else if (q.includes("trl") || q.includes("جاهز") || q.includes("نقل") || q.includes("transfer") || q.includes("readiness")) {
      responseText = isAr
        ? `### ⚙️ خريطة ترقية مستويات الجاهزية التكنولوجية (TRL) ونقل المعرفة

لتوطين الابتكارات في المنشآت الصناعية المسجلة، نعتمد المنهجية الفيدرالية التالية:

- **مستويات الأبحاث والمختبرات (TRL 1 - TRL 4)**: يتم تتبع مخرجاتها في علامة التبويب "المشاريع البحثية" بالتعاون مع الجامعات والعلماء الاستشاريين.
- **مستويات النماذج التجريبية (TRL 5 - TRL 7)**: نوصي بتسجيلها في "سوق الأصول التكنولوجية" لتسهيل جذب المستثمرين وتأسيس شراكات جامعية صناعية مشتركة.
- **مستويات الإنتاج والتطبيق الفعلي (TRL 8 - TRL 9)**: جاهزية كاملة للترخيص التجاري الفوري وصياغة اتفاقيات عقود استغلال البراءات وتصدير المنتجات المصنعة.

**💡 توجيه ذكي**: استخدم ميزة "طلب تفاوض وصياغة اتفاق" في صفحة نقل التكنولوجيا للتواصل المباشر مع المصانع المهتمة بتسويق أبحاثك.`
        : `### ⚙️ Technology Readiness Level (TRL) Acceleration & Tech Transfer Guide

To bridge academic research and active Sudanese manufacturing plants, we map all inventions across the TRL standard:

- **Laboratory Research Phases (TRL 1 - TRL 4)**: Tracked directly under the "Research Projects" module in partnership with local universities.
- **Pilot & Prototype Phases (TRL 5 - TRL 7)**: Registered as virtual assets in the "Tech Transfer Marketplace" to match with corporate investors.
- **Commercial Validation (TRL 8 - TRL 9)**: Fully mature systems ready to establish legal licensing contracts and begin mass-scale production.

**💡 Intelligent Tip**: Utilize the "Initiate Negotiation" button on the Tech Transfer tab to request a secure collaborative workspace with active factories in El Bagair or Port Sudan.`;
    } else {
      responseText = isAr
        ? `### 💡 بوابة الاستشارة الفيدرالية الذكية للابتكار والملكيات الفكرية

مرحباً بك في مستشارك الذكي الموحد. استفسارك يقع في صميم أهداف خطة التحول الاستراتيجي السوداني "رؤية 2035".

إليك التوجيهات السيادية العامة:
1. **السجل الموحد**: تأكد من تسجيل ملفك الشخصي أو منشأتك في "السجل الوطني للمبتكرين" للحصول على شارة الفحص الفيدرالية لتسهيل المعاملات.
2. **الحماية القانونية**: إيداع براءة الاختراع أو العلامة التجارية مبكراً يحميك سيادياً من المنازعات، ويمنحك حق صياغة عقود استغلال تجاري مرخصة لإنعاش خطوط الإنتاج المحلية.
3. **اقتصاد المعرفة**: تصفح "المستودع المعرفي والوثائق" لتحميل أدلة الفحص الفنية وصياغات العقود الرسمية المعتمدة مجاناً بالكامل.

*بإمكانك صياغة سؤال محدد حول: عناصر الحماية، قنوات التمويل المالي، ترخيص براءات الاختراع، أو التكتلات الجغرافية الصناعية.*`
        : `### 💡 Unified Sovereign AI Innovation & Intellectual Property Guide

Welcome to your central advisory portal. Your query contributes to the strategic growth pathways of "Vision Sudan 2035".

Key Sovereign Recommendations:
1. **Unified Registration**: Keep your record updated on the "National Innovators Registry" to unlock high-priority federal credentialing.
2. **Legal Protection**: Filing Patents and Trademarks early safeguards your competitive edge and grants you the legal power to license innovations to regional players.
3. **Knowledge Access**: Check the "Sovereign PDF Repository" within the Knowledge Economy tab to download state-certified compliance templates.

*Please feel free to ask a precise question regarding: patent drafting claims, regional funding programs, academic partnerships, or GIS innovation nodes.*`;
    }

    return res.json({
      response: `💡 (ملاحظة: يعمل المستشار الفيدرالي بنظام محاكاة الذكاء الاصطناعي لعدم توفر مفتاح GEMINI_API_KEY)\n\n${responseText}`
    });
  }

  try {
    const systemInstruction = `
      You are the world's leading National Innovation Strategist, Intellectual Property Attorney, Tech Transfer Advisor, and Senior AI Policy Consultant for the Sudan Digital Ministry of Commerce & Industry (رؤية السودان 2035 لتمكين اقتصاد المعرفة والابتكار الوطني).
      Your role is to guide innovators, academic researchers, patent examiners, and investors.
      
      Provide highly actionable, expert, and authoritative advice. Mention Sudanese patent structures, COMESA IP compliance, Technology Readiness Levels (TRL 1 to 9), geographical indications for domestic goods (Gum Arabic, Sesame, hibiscus), National Innovation Fund grants, and university-industry JVs.
      
      Respond in Arabic by default unless the query is in English. Use a highly sophisticated, encouraging, and formally polite tone. Format your response elegantly using clean Markdown.
    `;

    const userMessage = `المستخدم يستفسر عما يلي: "${query}"\nالرجاء توليد تقرير استشاري أو توصية فنية ممتازة وشاملة باللغة المناسبة ومطابقة لقوانين حماية الملكية الفكرية والابتكار الوطني السوداني لعام 2026.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      response: response.text || "عذراً، لم يتمكن المستشار الذكي من صياغة التوصية الفنية."
    });

  } catch (err: any) {
    console.error("Innovation AI Error:", err);
    res.status(500).json({
      error: "فشل مستشار الابتكار في الاتصال بـ Gemini",
      details: err.message
    });
  }
});

// --- HUMAN RESOURCES, PAYROLL, TALENT & WORKFORCE PLATFORM ENDPOINTS ---

app.get("/api/hr/employees", (req, res) => {
  const db = getDB();
  res.json(db.employees || []);
});

app.post("/api/hr/employees", (req, res) => {
  const db = getDB();
  const newEmployee = req.body;
  const count = (db.employees || []).length + 1;
  const id = `emp-${Date.now()}`;
  const nationalEmployeeId = `SD-HR-${94820 + count}`;
  
  const employee = {
    id,
    nationalEmployeeId,
    status: "probation",
    ...newEmployee,
    createdAt: new Date().toISOString()
  };
  
  db.employees = db.employees || [];
  db.employees.push(employee);
  
  // Add log to HR audit ledger
  db.hrAuditLogs = db.hrAuditLogs || [];
  db.hrAuditLogs.push({
    id: `hrl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.body.createdBy || "نظام الموارد البشرية",
    actionAr: `تعيين الموظف الجديد: ${employee.nameAr} وبرقم وظيفي سيادي ${nationalEmployeeId}`,
    actionEn: `Hired new employee: ${employee.nameEn} with National ID ${nationalEmployeeId}`,
    details: `القسم: ${employee.section} | الراتب الأساسي: ${employee.basicSalary}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(employee);
});

app.post("/api/hr/employees/lifecycle", (req, res) => {
  const db = getDB();
  const { employeeId, action, details, actor } = req.body;
  
  db.employees = db.employees || [];
  const empIndex = db.employees.findIndex((e: any) => e.id === employeeId);
  if (empIndex === -1) {
    return res.status(404).json({ error: "الموظف غير موجود" });
  }
  
  const emp = db.employees[empIndex];
  
  // Lifecycle steps: onboarding, probation, promotion, transfer, delegation, secondment, resignation, retirement, end of service
  let actionAr = "";
  let actionEn = "";
  
  switch(action) {
    case "probation_pass":
      emp.status = "active";
      actionAr = `تجاوز فترة الاختبار بنجاح للموظف ${emp.nameAr}`;
      actionEn = `Successfully passed probation period for employee ${emp.nameEn}`;
      break;
    case "promotion":
      emp.grade = details.newGrade || emp.grade;
      emp.basicSalary = Number(details.newSalary) || emp.basicSalary;
      actionAr = `ترقية الموظف ${emp.nameAr} إلى الدرجة الوظيفية ${emp.grade} وتعديل الراتب`;
      actionEn = `Promoted employee ${emp.nameEn} to grade ${emp.grade} with updated salary`;
      break;
    case "transfer":
      emp.department = details.newDepartment || emp.department;
      emp.section = details.newSection || emp.section;
      actionAr = `نقل الموظف ${emp.nameAr} إلى إدارة ${emp.department}`;
      actionEn = `Transferred employee ${emp.nameEn} to department ${emp.department}`;
      break;
    case "delegation":
      emp.status = "delegated";
      actionAr = `ندب الموظف ${emp.nameAr} إلى ${details.targetEntity || "جهة خارجية"}`;
      actionEn = `Delegated employee ${emp.nameEn} to ${details.targetEntity || "external entity"}`;
      break;
    case "secondment":
      emp.status = "seconded";
      actionAr = `إعارة الموظف ${emp.nameAr} إلى ${details.targetEntity || "جهة خارجية"}`;
      actionEn = `Seconded employee ${emp.nameEn} to ${details.targetEntity || "external entity"}`;
      break;
    case "resignation":
      emp.status = "resigned";
      actionAr = `قبول استقالة الموظف ${emp.nameAr}`;
      actionEn = `Accepted resignation of employee ${emp.nameEn}`;
      break;
    case "retirement":
      emp.status = "retired";
      actionAr = `إحالة الموظف ${emp.nameAr} إلى التقاعد لبلوغ السن القانونية`;
      actionEn = `Retired employee ${emp.nameEn} upon reaching statutory age`;
      break;
    case "end_of_service":
      emp.status = "terminated";
      actionAr = `إنهاء الخدمة للموظف ${emp.nameAr}`;
      actionEn = `Terminated service for employee ${emp.nameEn}`;
      break;
    default:
      actionAr = `تحديث ملف الموظف ${emp.nameAr}`;
      actionEn = `Updated profile of employee ${emp.nameEn}`;
  }
  
  db.employees[empIndex] = emp;
  
  db.hrAuditLogs = db.hrAuditLogs || [];
  db.hrAuditLogs.push({
    id: `hrl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "مدير الموارد البشرية",
    actionAr,
    actionEn,
    details: JSON.stringify(details || {}),
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json({ success: true, employee: emp });
});

app.get("/api/hr/org-units", (req, res) => {
  const db = getDB();
  res.json(db.orgUnits || []);
});

app.post("/api/hr/org-units", (req, res) => {
  const db = getDB();
  const unit = req.body;
  unit.id = `unit-${Date.now()}`;
  
  db.orgUnits = db.orgUnits || [];
  db.orgUnits.push(unit);
  
  db.hrAuditLogs = db.hrAuditLogs || [];
  db.hrAuditLogs.push({
    id: `hrl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: "المسؤول التنظيمي",
    actionAr: `إنشاء وحدة تنظيمية جديدة: ${unit.nameAr}`,
    actionEn: `Created new organizational unit: ${unit.nameEn}`,
    details: `النوع: ${unit.type} | الوحدة الأعلى: ${unit.parent || "رئيسي"}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(unit);
});

app.get("/api/hr/vacancies", (req, res) => {
  const db = getDB();
  res.json(db.vacancies || []);
});

app.post("/api/hr/vacancies", (req, res) => {
  const db = getDB();
  const vacancy = req.body;
  vacancy.id = `vac-${Date.now()}`;
  vacancy.status = "active";
  vacancy.applicationsCount = 0;
  vacancy.postedDate = new Date().toISOString().split("T")[0];
  
  db.vacancies = db.vacancies || [];
  db.vacancies.push(vacancy);
  
  saveDB(db);
  res.json(vacancy);
});

app.get("/api/hr/applications", (req, res) => {
  const db = getDB();
  res.json(db.applications || []);
});

app.post("/api/hr/applications", (req, res) => {
  const db = getDB();
  const application = req.body;
  application.id = `app-${Date.now()}`;
  application.status = "applied";
  application.createdAt = new Date().toISOString();
  
  db.applications = db.applications || [];
  db.applications.push(application);
  
  // Increment count on vacancy
  db.vacancies = db.vacancies || [];
  const vacIdx = db.vacancies.findIndex((v: any) => v.id === application.vacancyId);
  if (vacIdx !== -1) {
    db.vacancies[vacIdx].applicationsCount = (db.vacancies[vacIdx].applicationsCount || 0) + 1;
  }
  
  saveDB(db);
  res.json(application);
});

app.post("/api/hr/applications/status", (req, res) => {
  const db = getDB();
  const { applicationId, status, notes, interviewScore, assessmentScore } = req.body;
  
  db.applications = db.applications || [];
  const appIdx = db.applications.findIndex((a: any) => a.id === applicationId);
  if (appIdx === -1) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }
  
  const appl = db.applications[appIdx];
  appl.status = status;
  if (notes) appl.notes = notes;
  if (interviewScore !== undefined) appl.interviewScore = interviewScore;
  if (assessmentScore !== undefined) appl.assessmentScore = assessmentScore;
  
  // If status is "hired", let's create an employee file automatically!
  if (status === "hired") {
    const count = (db.employees || []).length + 1;
    const empId = `emp-${Date.now()}`;
    const nationalEmployeeId = `SD-HR-${94820 + count}`;
    
    const newEmp = {
      id: empId,
      nationalEmployeeId,
      nameAr: appl.nameAr,
      nameEn: appl.nameEn,
      email: appl.email,
      phone: appl.phone,
      nationalId: appl.nationalId || "123456789012",
      department: "قيد التعيين",
      section: "قيد التعيين",
      position: "وظيفة جديدة",
      grade: "السادسة",
      hireDate: new Date().toISOString().split("T")[0],
      status: "probation",
      basicSalary: 250000,
      allowances: { transport: 30000, housing: 50000, natureOfWork: 30000 },
      deductions: { tax: 10000, socialInsurance: 15000 },
      bankName: "بنك الخرطوم",
      bankAccount: "SD82BOK0010000000000",
      role: "Employee"
    };
    
    db.employees = db.employees || [];
    db.employees.push(newEmp);
    
    db.hrAuditLogs = db.hrAuditLogs || [];
    db.hrAuditLogs.push({
      id: `hrl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "لجنة التعيينات والإنفاذ",
      actionAr: `تعيين تلقائي للمرشح المقبول: ${newEmp.nameAr} برقم وظيفي ${nationalEmployeeId}`,
      actionEn: `Automatic hire of candidate: ${newEmp.nameEn} with National ID ${nationalEmployeeId}`,
      details: "تحويل ملف المتقدم من منصة الاستقطاب الإلكتروني إلى ملف الموظفين الدائمين",
      hash: `sha256_${Math.random().toString(36).substring(2)}`
    });
  }
  
  saveDB(db);
  res.json(appl);
});

app.get("/api/hr/payrolls", (req, res) => {
  const db = getDB();
  res.json(db.payrolls || []);
});

app.post("/api/hr/payrolls", (req, res) => {
  const db = getDB();
  const { period } = req.body;
  
  db.payrolls = db.payrolls || [];
  const exists = db.payrolls.some((p: any) => p.period === period);
  if (exists) {
    return res.status(400).json({ error: "مسودة الرواتب لهذه الفترة مسجلة مسبقاً" });
  }
  
  // Calculate payroll totals based on active employees
  db.employees = db.employees || [];
  const activeEmployees = db.employees.filter((e: any) => e.status === "active" || e.status === "probation");
  
  let totalBasic = 0;
  let totalAllowances = 0;
  let totalDeductions = 0;
  
  activeEmployees.forEach((e: any) => {
    totalBasic += e.basicSalary || 0;
    const allowances = (e.allowances || {}) as Record<string, number>;
    totalAllowances += Object.values(allowances).reduce((sum: number, val: number) => sum + (Number(val) || 0), 0);
    const deductions = (e.deductions || {}) as Record<string, number>;
    totalDeductions += Object.values(deductions).reduce((sum: number, val: number) => sum + (Number(val) || 0), 0);
  });
  
  const netAmount = totalBasic + totalAllowances - totalDeductions;
  
  const newPayroll = {
    id: `pay-${Date.now()}`,
    period,
    totalBasic,
    totalAllowances,
    totalDeductions,
    netAmount,
    status: "draft",
    approvals: [
      { role: "Payroll Officer", name: req.body.officerName || "منى صلاح الجعلي", status: "submitted", date: new Date().toISOString().split("T")[0] }
    ]
  };
  
  db.payrolls.push(newPayroll);
  saveDB(db);
  res.json(newPayroll);
});

app.post("/api/hr/payrolls/approve", (req, res) => {
  const db = getDB();
  const { payrollId, role, name, action } = req.body;
  
  db.payrolls = db.payrolls || [];
  const payIdx = db.payrolls.findIndex((p: any) => p.id === payrollId);
  if (payIdx === -1) {
    return res.status(404).json({ error: "مسودة المرتبات غير موجودة" });
  }
  
  const pay = db.payrolls[payIdx];
  pay.approvals = pay.approvals || [];
  pay.approvals.push({
    role,
    name,
    status: action === "approve" ? "approved" : "rejected",
    date: new Date().toISOString().split("T")[0]
  });
  
  // If we have approvals from Payroll Officer, Financial Auditor and HR Director, then mark as fully approved & transfer files
  const hasAuditor = pay.approvals.some((a: any) => a.role === "Financial Auditor");
  const hasDirector = pay.approvals.some((a: any) => a.role === "HR Director");
  
  if (hasAuditor && hasDirector) {
    pay.status = "approved";
    
    // Add to national audit trail
    db.hrAuditLogs = db.hrAuditLogs || [];
    db.hrAuditLogs.push({
      id: `hrl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: name,
      actionAr: `اعتماد نهائي وتحويل ملفات رواتب شهر ${pay.period} للبنك المركزي بقيمة ${pay.netAmount} جنيه سوداني`,
      actionEn: `Final approval & transmission of salary file for ${pay.period} to CBS Net of value SDG ${pay.netAmount}`,
      details: `إجمالي الرواتب الأساسية: ${pay.totalBasic} | إجمالي البدلات: ${pay.totalAllowances}`,
      hash: `sha256_${Math.random().toString(36).substring(2)}`
    });
  }
  
  saveDB(db);
  res.json(pay);
});

app.get("/api/hr/attendance", (req, res) => {
  const db = getDB();
  res.json(db.attendance || []);
});

app.post("/api/hr/attendance", (req, res) => {
  const db = getDB();
  const { employeeId, method, gpsCoords } = req.body;
  
  db.attendance = db.attendance || [];
  const today = new Date().toISOString().split("T")[0];
  
  const todayIdx = db.attendance.findIndex((a: any) => a.employeeId === employeeId && a.date === today);
  
  if (todayIdx === -1) {
    // Check-in
    const att = {
      id: `att-${Date.now()}`,
      employeeId,
      date: today,
      checkIn: new Date().toTimeString().split(" ")[0],
      checkOut: "",
      status: "present",
      method: method || "GPS",
      gpsCoords: gpsCoords || { lat: 15.5007, lng: 32.5599 }
    };
    db.attendance.push(att);
    saveDB(db);
    return res.json(att);
  } else {
    // Check-out
    const att = db.attendance[todayIdx];
    att.checkOut = new Date().toTimeString().split(" ")[0];
    db.attendance[todayIdx] = att;
    saveDB(db);
    return res.json(att);
  }
});

app.get("/api/hr/leaves", (req, res) => {
  const db = getDB();
  res.json(db.leaves || []);
});

app.post("/api/hr/leaves", (req, res) => {
  const db = getDB();
  const leave = req.body;
  leave.id = `leave-${Date.now()}`;
  leave.status = "pending";
  
  db.leaves = db.leaves || [];
  db.leaves.push(leave);
  
  saveDB(db);
  res.json(leave);
});

app.post("/api/hr/leaves/approve", (req, res) => {
  const db = getDB();
  const { leaveId, status, managerName } = req.body;
  
  db.leaves = db.leaves || [];
  const idx = db.leaves.findIndex((l: any) => l.id === leaveId);
  if (idx === -1) {
    return res.status(404).json({ error: "طلب الإجازة غير موجود" });
  }
  
  db.leaves[idx].status = status;
  
  // If approved, log it
  if (status === "approved") {
    const l = db.leaves[idx];
    db.hrAuditLogs = db.hrAuditLogs || [];
    db.hrAuditLogs.push({
      id: `hrl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: managerName || "مدير الموارد البشرية",
      actionAr: `الموافقة على إجازة الموظف: ${l.employeeId} من ${l.startDate} إلى ${l.endDate}`,
      actionEn: `Approved leave for employee: ${l.employeeId} from ${l.startDate} to ${l.endDate}`,
      details: `النوع: ${l.type} | عدد الأيام: ${l.days}`,
      hash: `sha256_${Math.random().toString(36).substring(2)}`
    });
  }
  
  saveDB(db);
  res.json(db.leaves[idx]);
});

app.get("/api/hr/performance", (req, res) => {
  const db = getDB();
  res.json(db.performance || []);
});

app.post("/api/hr/performance", (req, res) => {
  const db = getDB();
  const perf = req.body;
  perf.id = `perf-${Date.now()}`;
  
  db.performance = db.performance || [];
  db.performance.push(perf);
  
  saveDB(db);
  res.json(perf);
});

app.get("/api/hr/trainings", (req, res) => {
  const db = getDB();
  res.json(db.trainings || []);
});

app.post("/api/hr/trainings", (req, res) => {
  const db = getDB();
  const trn = req.body;
  trn.id = `trn-${Date.now()}`;
  
  db.trainings = db.trainings || [];
  db.trainings.push(trn);
  
  saveDB(db);
  res.json(trn);
});

app.get("/api/hr/talent-pools", (req, res) => {
  const db = getDB();
  res.json(db.talentPools || []);
});

app.post("/api/hr/talent-pools", (req, res) => {
  const db = getDB();
  const pool = req.body;
  pool.id = `pool-${Date.now()}`;
  
  db.talentPools = db.talentPools || [];
  db.talentPools.push(pool);
  
  saveDB(db);
  res.json(pool);
});

app.get("/api/hr/audit-logs", (req, res) => {
  const db = getDB();
  res.json(db.hrAuditLogs || []);
});

// --- AI HR ADVISOR ROUTE WITH HIGH-FIDELITY SUDANESE SPECIFIC MODELS ---
app.post("/api/hr/ai-advisor", async (req, res) => {
  const { prompt, scenario, context } = req.body;
  const ai = getGeminiClient();

  // Robust Sudanese HR simulated responses if no Gemini key is set
  if (!ai) {
    let simulatedResponse = "";
    if (scenario === "predict_turnover") {
      simulatedResponse = `### 🔮 تقرير التنبؤ بمعدلات تسرب الموظفين (Turnover Risk Analysis)
تحليل ذكي استباقي بناءً على مؤشرات الأداء، سنوات الخدمة، والتقييم السنوي لبيانات موظفي الوزارة:

1. **إدارة الرقابة والتفتيش (مستوى الخطورة: متوسطة - 14%)**:
   - نلاحظ ارتفاع احتمالية طلبات النقل للمفتشين الميدانيين بسبب ضغط جولات التفتيش المستمرة في ولاية الخرطوم والجزيرة.
   - **التوصية**: زيادة مخصصات بدل طبيعة العمل الميداني بنسبة 10% وجدولة نظام التناوب بين الولايات.

2. **المهندسون والفنيون التقنيون (مستوى الخطورة: منخفضة جداً - 3%)**:
   - استقرار ممتاز لحديثي التعيين بسبب برامج التدريب المتكاملة مع مركز جياد للتكنولوجيا وحوافز الابتكار المالي.

3. **مؤشرات عامة**:
   - معدل الدوران العام المتوقع للوزارة في الربع القادم: **1.8%** وهو متوافق تماماً مع النسبة القياسية للخدمة المدنية السودانية ورؤية 2035.`;
    } else if (scenario === "recommend_promotions") {
      simulatedResponse = `### 📈 توصية الترقيات الاستحقاقية والذكية (Smart Promotion Recommendations)
تم مسح قاعدة بيانات التقييم السنوي ومطابقة متطلبات الخدمة المدنية ومجلس الوزراء السوداني:

1. **المرشح الأول: مأمون عبد القادر الشريف (مفتش تجاري أول)**:
   - **التقييم الحالي**: الدرجة الثالثة | تقييم الأداء: **امتياز (A)** لمدة عامين متتاليين.
   - **المؤشر الداعم**: إغلاق بنجاح لأكبر عدد من شكاوى حماية المستهلك (أبرزها قضية مستودع المشروبات الغازية comp-2).
   - **التوصية**: ترقية استثنائية للدرجة الثانية مع إلحاقه ببرنامج إعداد القيادات الشابة.

2. **المرشح الثاني: أ. ماجدة الطيب (باحث قانوني أول)**:
   - **التقييم الحالي**: الدرجة الثالثة | تقييم الأداء: **امتياز (A)**.
   - **المؤشر الداعم**: المساهمة الفعالة في صياغة لائحة التحكيم التجاري 2026 وصياغة MoUs الكوميسا.
   - **التوصية**: ترقيتها لدرجة باحث قانوني مستشار مع تعديل طبيعة العمل.`;
    } else if (scenario === "identify_training") {
      simulatedResponse = `### 🎓 مصفوفة تحديد الاحتياجات التدريبية وسد الفجوات (Skills Gap & Training Matrix)
مقارنة ذكية لمهارات الموظفين ضد متطلبات الرقمنة الشاملة للوزارة (رؤية 2035):

1. **إدارة الشؤون القانونية**:
   - **الفجوة المرصودة**: حاجة طاقم الباحثين المساعدين لمعرفة معمقة بنظم التجارة الإلكترونية الرقمية وقوانين سندات الملكية الفكرية كرهون بنكية.
   - **البرنامج المقترح**: ورشة عمل متخصصة تحت عنوان "التحول السيادي للعقود الإلكترونية الذكية".

2. **المفتشون الميدانيون (حماية المستهلك)**:
   - **الفجوة المرصودة**: التعامل مع أجهزة الفحص الميداني المحمولة المرتبطة بالبث الفضائي للمواقع البعيدة.
   - **البرنامج المقترح**: دورة مكثفة لـ "منصة التفتيش والإنفاذ الذكي المتقدمة".`;
    } else if (scenario === "forecast_demand") {
      simulatedResponse = `### 👥 التوقع الرقمي للطلب على القوى العاملة (Workforce Demand Forecast 2026-2035)
بناءً على خطط توسيع الفروع ومجمعات التنمية اللوجستية الجديدة (الباقير، بورتسودان، وسوبا):

- **وظائف التفتيش والرقابة الميدانية**: نتوقع الحاجة لتوظيف **18 مفتشاً تجارياً إضافياً** خلال 12 شهراً القادمة لتغطية مجمع التعبئة والموانئ الجافة بالباقير.
- **إدارة تكنولوجيا المعلومات**: الحاجة لتعيين **3 مهندسي نظم حوسبة سحابية ومحلل بيانات** لدعم التحول السيادي الورقي الصفري الكامل.
- **الشؤون القانونية**: الاستعانة بـ **2 مستشار قانوني متخصص في عقود الشراكة بين القطاعين (PPP)** لمراجعة عقود تشغيل المستودعات المبردة.`;
    } else if (scenario === "detect_payroll_anomalies") {
      simulatedResponse = `### 🚨 فحص وكشف التجاوزات والاختلالات المالية (Payroll Anomaly Detection)
تم إجراء تدقيق مالي ذكي لمسودة مرتبات شهر يوليو ومقارنتها بالشهور السابقة لوزارة التجارة والصناعة:

1. **مطابقة الأرصدة**: نسبة التطابق **100%** مع نظام CBS Net للمدفوعات الفيدرالية ولا توجد تكرارات في أرقام الحسابات البنكية للموظفين.
2. **تنبيه بدل العمل الإضافي**: نلاحظ زيادة بنسبة 12% في بدل العمل الإضافي لمهندسي قسم الأرشفة والوثائق الرقمية.
   - **التفسير الفني**: يرجع ذلك لتسريع إدخال القرار الوزاري رقم 14 ومخططات الباقير (DOC-2026-003) في الأرشيف الوطني السيادي.
3. **الحالة العامة**: الرواتب متوافقة تماماً مع لائحة الخدمة المدنية ولا وجود لموظفين وهميين.`;
    } else if (scenario === "recommend_succession") {
      simulatedResponse = `### 🛡️ خطط التعاقب الوظيفي للمواقع السيادية (Succession Planning and Readiness)
لضمان استمرارية الأعمال والمحافظة على الكفاءة القيادية لوزارة التجارة والصناعة:

1. **الموقع المستهدف: مدير الموارد البشرية**:
   - **شاغل الوظيفة الحالي**: أحمد الطيب محمد (الدرجة الأولى) - جاهز للترقية لمنصب مستشار وكيل الوزارة.
   - **المرشح البديل الأول**: أ. منى صلاح الجعلي (الدرجة الثالثة) - جاهزية متوسطة (خلال سنتين بعد إتمام دورة القيادات العليا).
   - **المرشح البديل الثاني**: سارة عثمان البشير (مدير الشؤون القانونية) - جاهزية فورية للنقل الأفقي نظراً للمهارات القيادية الممتازة.

2. **الموقع المستهدف: مدير الشؤون القانونية**:
   - **شاغل الوظيفة**: سارة عثمان البشير (الدرجة الخاصة).
   - **المرشح البديل الأول**: أ. ماجدة الطيب (باحث قانوني أول) - جاهزية عالية جداً (خلال عام واحد).`;
    } else {
      simulatedResponse = `### 📊 التقرير التحليلي الاستراتيجي لرأس المال البشري (Executive HR Master Report)
تحديث فوري شامل لمؤشرات رأس المال البشري لدى وزارة التجارة والصناعة:

- **إجمالي القوة العاملة**: **78 موظفاً ومستشاراً** (بما في ذلك فروع بورتسودان والباقير).
- **نسبة التوطين (التوطين والكوادر الوطنية)**: **100%**.
- **معدل الرضا الأداء العام**: **89.4%** استناداً لمؤشرات الأداء (KPIs).
- **التدريب والتطوير**: تم إنجاز **48 ساعت تدريبية** لكل موظف خلال هذا الربع، متجاوزاً المستهدف الوطني لرؤية 2035.
- **التوصية الاستراتيجية**: يرجى الاستمرار في خطة تمكين المرأة والشباب في المناصب القيادية الفيدرالية لرفع كفاءة اتخاذ القرار.`;
    }

    if (prompt) {
      simulatedResponse += `\n\n**💡 إجابة مخصصة لاستفسارك ("${prompt}")**:\nلقد تم تحليل استفسارك الخاص ضمن نموذج رأس المال البشري للخدمة المدنية الاتحادية. بناءً على لوائح الخدمة المدنية السودانية لعام 2026 وموجهات مجلس الوزراء، نؤكد أن الوزارة تسعى لدعم وتمكين جميع الكفاءات الوطنية عبر توفير بيئة عمل محفزة ورقمية بالكامل متوافقة مع متطلبات التميز الحكومي الإقليمي.`;
    }

    return res.json({
      text: `💡 (ملاحظة: يعمل مستشار الموارد البشرية والرواتب الذكي بنظام محاكاة الخدمة المدنية الاتحادية لعدم توفر مفتاح GEMINI_API_KEY)\n\n${simulatedResponse}`,
    });
  }

  try {
    const systemInstruction = `
      You are the world's leading Government Human Capital Architect, Civil Service Transformation Specialist, and AI Workforce Consultant for the Sudan Digital Ministry of Commerce & Industry (رؤية السودان لتطوير رأس المال البشري والخدمة المدنية 2035).
      Your role is to analyze employee directories, organizational charts, vacancy trackings, payroll states, performance matrices, and training logs, and generate elite, regulatory-compliant, strategic HR and workforce recommendations.
      
      Always frame advice in the context of the Sudan Public Sector, incorporating references to Sudanese labor laws, federal grade hierarchies (الدرجة الخاصة، الدرجة الأولى، الثانية، الثالثة الخ), local cost centers, national identity systems (الرقم الوطني والمدفوعات الإلكترونية عبر بنك السودان المركزي), and coordinates/clusters like Khartoum, Port Sudan Free Zone, or El Bagair.
      
      Respond in Arabic with an authoritative, elegant, highly administrative, and strategic tone. Format your response beautifully using rich Markdown.
      
      Scenario selected: ${scenario}
      HR Context provided: ${JSON.stringify(context || {})}
    `;

    const userMessage = prompt 
      ? `الرجاء إجراء التحليل الاستشاري الخاص بالموارد البشرية والرواتب والتنبؤ حول: ${prompt}` 
      : `الرجاء إصدار التقرير الاستشاري أو التوقعات السيادية الشاملة لرأس المال البشري طبقاً للسيناريو المحدد.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن مستشار رأس المال البشري الذكي من صياغة التقرير."
    });

  } catch (err: any) {
    console.error("HR AI Advisor Error:", err);
    res.status(500).json({
      error: "فشل مستشار الموارد البشرية الذكي في الاتصال بـ Gemini",
      details: err.message
    });
  }
});

// --- ENTERPRISE ASSET, FACILITIES, INVENTORY, FLEET & MAINTENANCE MANAGEMENT ENDPOINTS (EAM) ---

app.get("/api/assets", (req, res) => {
  const db = getDB();
  res.json(db.assets || []);
});

app.post("/api/assets", (req, res) => {
  const db = getDB();
  const asset = req.body;
  
  db.assets = db.assets || [];
  
  // Auto-generate a National Asset Identifier (NAI)
  const currentCount = db.assets.length + 1;
  const paddingNum = String(currentCount).padStart(4, "0");
  const nationalId = `SD-NAI-2026-${paddingNum}`;
  
  const newAsset = {
    id: `ast-${Date.now()}`,
    nationalId,
    nameAr: asset.nameAr || "أصل غير مسمى",
    nameEn: asset.nameEn || "Unnamed Asset",
    classificationAr: asset.classificationAr || "عام",
    classificationEn: asset.classificationEn || "General",
    ownerDepartmentAr: asset.ownerDepartmentAr || "إدارة الإمداد",
    ownerDepartmentEn: asset.ownerDepartmentEn || "Supply Dept",
    locationAr: asset.locationAr || "الخرطوم",
    locationEn: asset.locationEn || "Khartoum",
    value: Number(asset.value) || 0,
    depreciationTypeAr: asset.depreciationTypeAr || "قسط ثابت",
    depreciationTypeEn: asset.depreciationTypeEn || "Straight Line",
    currentValue: Number(asset.value) || 0,
    warrantyStatusAr: asset.warrantyStatusAr || "ساري المفعول",
    warrantyStatusEn: asset.warrantyStatusEn || "Active",
    insurancePolicy: asset.insurancePolicy || "SD-SOV-INS-0000",
    lifecycleStatus: asset.lifecycleStatus || "operational",
    healthIndex: Number(asset.healthIndex) || 100,
    assignedUserAr: asset.assignedUserAr || "غير مخصص",
    assignedUserEn: asset.assignedUserEn || "Unassigned",
    createdAt: new Date().toISOString()
  };
  
  db.assets.unshift(newAsset);
  
  // Log in Audit Logs
  db.assetAuditLogs = db.assetAuditLogs || [];
  db.assetAuditLogs.unshift({
    id: `asl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: asset.actorName || "مسؤول تسجيل الأصول المعتمد",
    actionAr: `تسجيل أصل رأسمالي جديد بنظام المعرف الوطني الموحد: ${newAsset.nameAr}`,
    actionEn: `Registered new capital asset with National NAI: ${newAsset.nameEn}`,
    details: `القيمة الاقتصادية: ${newAsset.value} ج.س | المعرف الوطني: ${newAsset.nationalId}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.status(210).json(newAsset);
});

app.post("/api/assets/workflow", (req, res) => {
  const db = getDB();
  const { assetId, action, targetState, notes, actor } = req.body;
  
  db.assets = db.assets || [];
  const idx = db.assets.findIndex((a: any) => a.id === assetId);
  if (idx === -1) {
    return res.status(404).json({ error: "الأصل المطلوب غير موجود" });
  }
  
  const asset = db.assets[idx];
  const oldStatus = asset.lifecycleStatus;
  
  if (action === "transfer") {
    asset.locationAr = req.body.targetLocationAr || asset.locationAr;
    asset.locationEn = req.body.targetLocationEn || asset.locationEn;
    asset.ownerDepartmentAr = req.body.targetDeptAr || asset.ownerDepartmentAr;
    asset.ownerDepartmentEn = req.body.targetDeptEn || asset.ownerDepartmentEn;
  } else if (action === "verify") {
    asset.healthIndex = Number(req.body.healthIndex) || asset.healthIndex;
    asset.lifecycleStatus = "operational";
  } else if (action === "dispose") {
    asset.lifecycleStatus = "disposed";
  } else if (action === "update-status") {
    asset.lifecycleStatus = targetState || asset.lifecycleStatus;
  }
  
  db.assets[idx] = asset;
  
  // Create audit trail entry
  db.assetAuditLogs = db.assetAuditLogs || [];
  db.assetAuditLogs.unshift({
    id: `asl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "مفتش الأصول الفيدرالي",
    actionAr: `تنفيذ معاملة أصول: [${action}] على الأصل ${asset.nameAr}`,
    actionEn: `Executed asset transaction: [${action}] on ${asset.nameEn}`,
    details: `ملاحظات المعاملة: ${notes || "لا توجد ملاحظات"} | الحالة السابقة: ${oldStatus} -> الحالة الحالية: ${asset.lifecycleStatus}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(asset);
});

app.get("/api/facilities", (req, res) => {
  const db = getDB();
  res.json(db.facilities || []);
});

app.post("/api/facilities", (req, res) => {
  const db = getDB();
  const fac = req.body;
  
  db.facilities = db.facilities || [];
  const newFac = {
    id: `fac-${Date.now()}`,
    nameAr: fac.nameAr,
    nameEn: fac.nameEn,
    typeAr: fac.typeAr,
    typeEn: fac.typeEn,
    capacityStaff: Number(fac.capacityStaff) || 0,
    currentOccupancy: Number(fac.currentOccupancy) || 0,
    utilityStatusAr: fac.utilityStatusAr || "مستقرة",
    utilityStatusEn: fac.utilityStatusEn || "Stable",
    safetyStatusAr: fac.safetyStatusAr || "آمن",
    safetyStatusEn: fac.safetyStatusEn || "Secure",
    lastInspectionDate: fac.lastInspectionDate || new Date().toISOString().split("T")[0],
    energyUsageKwh: Number(fac.energyUsageKwh) || 0,
    waterUsageLitres: Number(fac.waterUsageLitres) || 0,
    environmentalScore: Number(fac.environmentalScore) || 100
  };
  
  db.facilities.unshift(newFac);
  saveDB(db);
  res.json(newFac);
});

app.get("/api/warehouses", (req, res) => {
  const db = getDB();
  res.json(db.warehouses || []);
});

app.get("/api/inventories", (req, res) => {
  const db = getDB();
  res.json(db.inventories || []);
});

app.post("/api/inventories/transfer", (req, res) => {
  const db = getDB();
  const { itemId, sourceWarehouseId, targetWarehouseId, quantity, actor } = req.body;
  
  db.inventories = db.inventories || [];
  const idx = db.inventories.findIndex((i: any) => i.id === itemId);
  if (idx === -1) {
    return res.status(404).json({ error: "الصنف المطلوب غير موجود" });
  }
  
  const item = db.inventories[idx];
  const qtyToTransfer = Number(quantity) || 0;
  
  if (item.quantity < qtyToTransfer) {
    return res.status(400).json({ error: "الكمية المطلوبة للنقل غير متوفرة بالمستودع الحالي" });
  }
  
  // Deduct quantity from the current item
  item.quantity -= qtyToTransfer;
  item.warehouseId = targetWarehouseId; // Move it or update its location details
  item.lastCycleCountDate = new Date().toISOString().split("T")[0];
  
  // In a robust relational design, we would have quantities per warehouse. Since we mock with single record state,
  // we update its current warehouseId to target, or simply simulate a logistics transfer.
  
  db.inventories[idx] = item;
  
  // Log in Audit logs
  db.assetAuditLogs = db.assetAuditLogs || [];
  db.assetAuditLogs.unshift({
    id: `asl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "أمين مستودع فيدرالي",
    actionAr: `تحويل لوجستي لصنف مخزني: ${item.nameAr}`,
    actionEn: `Logistics inventory transfer for: ${item.nameEn}`,
    details: `نقل كمية قدرها ${qtyToTransfer} من المستودع ${sourceWarehouseId} إلى ${targetWarehouseId}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(item);
});

app.post("/api/inventories/count", (req, res) => {
  const db = getDB();
  const { itemId, physicalQty, actor } = req.body;
  
  db.inventories = db.inventories || [];
  const idx = db.inventories.findIndex((i: any) => i.id === itemId);
  if (idx === -1) {
    return res.status(404).json({ error: "الصنف المطلوب غير موجود" });
  }
  
  const item = db.inventories[idx];
  const oldQty = item.quantity;
  item.quantity = Number(physicalQty);
  item.lastCycleCountDate = new Date().toISOString().split("T")[0];
  
  db.inventories[idx] = item;
  
  db.assetAuditLogs = db.assetAuditLogs || [];
  db.assetAuditLogs.unshift({
    id: `asl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "مفتش مخزون فيدرالي",
    actionAr: `إجراء جرد دوري (Cycle Count) على الصنف: ${item.nameAr}`,
    actionEn: `Performed cycle count on inventory: ${item.nameEn}`,
    details: `الكمية الدفترية السابقة: ${oldQty} -> الكمية الفعلية المكتشفة بالجرد: ${item.quantity}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(item);
});

app.get("/api/fleet", (req, res) => {
  const db = getDB();
  res.json(db.fleetVehicles || []);
});

app.post("/api/fleet", (req, res) => {
  const db = getDB();
  const vehicle = req.body;
  
  db.fleetVehicles = db.fleetVehicles || [];
  const newVehicle = {
    id: `flt-${Date.now()}`,
    plateNumber: vehicle.plateNumber,
    nameAr: vehicle.nameAr,
    nameEn: vehicle.nameEn,
    typeAr: vehicle.typeAr,
    typeEn: vehicle.typeEn,
    assignedDriverAr: vehicle.assignedDriverAr || "غير مخصص",
    assignedDriverEn: vehicle.assignedDriverEn || "Unassigned",
    fuelConsumptionRate: vehicle.fuelConsumptionRate || "12.5L / 100KM",
    gpsCoords: vehicle.gpsCoords || { lat: 15.5562, lng: 32.5358 },
    mileage: Number(vehicle.mileage) || 0,
    licenseExpiryDate: vehicle.licenseExpiryDate || "2027-12-31",
    insuranceStatusAr: vehicle.insuranceStatusAr || "مؤمن سيادياً",
    insuranceStatusEn: vehicle.insuranceStatusEn || "Sovereign Insured",
    maintenanceStatus: vehicle.maintenanceStatus || "operational",
    accidentHistoryCount: Number(vehicle.accidentHistoryCount) || 0
  };
  
  db.fleetVehicles.unshift(newVehicle);
  saveDB(db);
  res.json(newVehicle);
});

app.post("/api/fleet/update", (req, res) => {
  const db = getDB();
  const { vehicleId, mileage, lat, lng, maintenanceStatus, actor } = req.body;
  
  db.fleetVehicles = db.fleetVehicles || [];
  const idx = db.fleetVehicles.findIndex((v: any) => v.id === vehicleId);
  if (idx === -1) {
    return res.status(404).json({ error: "المركبة غير موجودة" });
  }
  
  const vehicle = db.fleetVehicles[idx];
  vehicle.mileage = Number(mileage) || vehicle.mileage;
  if (lat && lng) {
    vehicle.gpsCoords = { lat: Number(lat), lng: Number(lng) };
  }
  vehicle.maintenanceStatus = maintenanceStatus || vehicle.maintenanceStatus;
  
  db.fleetVehicles[idx] = vehicle;
  
  db.assetAuditLogs = db.assetAuditLogs || [];
  db.assetAuditLogs.unshift({
    id: `asl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "مدير الأسطول الحكومي",
    actionAr: `تحديث بيانات تتبع المركبة الفيدرالية: ${vehicle.plateNumber}`,
    actionEn: `Updated telemetry logs for vehicle: ${vehicle.plateNumber}`,
    details: `عداد المسافات الحالي: ${vehicle.mileage} كم | حالة الصيانة: ${vehicle.maintenanceStatus} | تحديث الـ GPS`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(vehicle);
});

app.get("/api/maintenance/work-orders", (req, res) => {
  const db = getDB();
  res.json(db.maintenanceWorkOrders || []);
});

app.post("/api/maintenance/work-orders", (req, res) => {
  const db = getDB();
  const wo = req.body;
  
  db.maintenanceWorkOrders = db.maintenanceWorkOrders || [];
  const newWo = {
    id: `wo-${Date.now()}`,
    assetId: wo.assetId || "ast-1",
    titleAr: wo.titleAr || "أمر صيانة جديد",
    titleEn: wo.titleEn || "New Work Order",
    type: wo.type || "corrective",
    priority: wo.priority || "medium",
    status: "pending",
    cost: Number(wo.cost) || 0,
    vendorAr: wo.vendorAr || "الورشة الوطنية المركزية",
    vendorEn: wo.vendorEn || "National Central Workshop",
    engineerAr: wo.engineerAr || "مهندس معتمد",
    engineerEn: wo.engineerEn || "Certified Engineer",
    descriptionAr: wo.descriptionAr || "لا توجد تفاصيل إضافية",
    descriptionEn: wo.descriptionEn || "No additional description",
    createdAt: new Date().toISOString()
  };
  
  db.maintenanceWorkOrders.unshift(newWo);
  
  // Log in Audit logs
  db.assetAuditLogs = db.assetAuditLogs || [];
  db.assetAuditLogs.unshift({
    id: `asl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: wo.actor || "مهندس الصيانة المسؤول",
    actionAr: `إصدار أمر صيانة جديد رقم: ${newWo.id} للأصل: ${newWo.assetId}`,
    actionEn: `Issued new maintenance work order: ${newWo.id} for asset: ${newWo.assetId}`,
    details: `العنوان: ${newWo.titleAr} | الأولوية: ${newWo.priority} | التكلفة التقديرية: ${newWo.cost} ج.س`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newWo);
});

app.post("/api/maintenance/work-orders/status", (req, res) => {
  const db = getDB();
  const { workOrderId, status, notes, actualCost, actor } = req.body;
  
  db.maintenanceWorkOrders = db.maintenanceWorkOrders || [];
  const idx = db.maintenanceWorkOrders.findIndex((w: any) => w.id === workOrderId);
  if (idx === -1) {
    return res.status(404).json({ error: "أمر الصيانة المطلوب غير موجود" });
  }
  
  const wo = db.maintenanceWorkOrders[idx];
  wo.status = status;
  if (actualCost) {
    wo.cost = Number(actualCost);
  }
  
  db.maintenanceWorkOrders[idx] = wo;
  
  // If completed, update the asset health
  if (status === "completed") {
    db.assets = db.assets || [];
    const assetIdx = db.assets.findIndex((a: any) => a.id === wo.assetId);
    if (assetIdx !== -1) {
      db.assets[assetIdx].healthIndex = Math.min(100, db.assets[assetIdx].healthIndex + 15);
      db.assets[assetIdx].lifecycleStatus = "operational";
    }
  }
  
  db.assetAuditLogs = db.assetAuditLogs || [];
  db.assetAuditLogs.unshift({
    id: `asl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "رئيس قسم الصيانة الفنية",
    actionAr: `تحديث حالة أمر الصيانة: [${wo.titleAr}] إلى [${status}]`,
    actionEn: `Updated status of work order: [${wo.titleEn}] to [${status}]`,
    details: `ملاحظات الإغلاق: ${notes || "تمت الصيانة بنجاح"} | التكلفة النهائية: ${wo.cost} ج.س`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(wo);
});

app.get("/api/assets/audit-logs", (req, res) => {
  const db = getDB();
  res.json(db.assetAuditLogs || []);
});

// --- AI ASSET ADVISOR ROUTE WITH HIGH-FIDELITY SUDANESE SPECIFIC MODELS ---
app.post("/api/assets/ai-advisor", async (req, res) => {
  const { prompt, scenario, context } = req.body;
  const ai = getGeminiClient();

  // Sophisticated simulated response if no Gemini API key
  if (!ai) {
    let simulatedResponse = "";
    if (scenario === "predict_failures") {
      simulatedResponse = `### 🔮 تقرير التنبؤ بأعطال المعدات والبنى التحتية الاتحادية لعام 2026/2027

التحليل الذكي الاستباقي بناءً على اهتزازات المحركات، معدلات استخدام الطاقة، وقواعد المعايرة السنوية بالتعاون مع مصانع جياد والهيئة السودانية للمواصفات:

1. **عاكسات الجهد الشمسي بمجمع سوبا (مستوى الخطورة: متوسطة - 42% خطورة عطل خلال 90 يوم)**:
   - **السبب الفني**: نلاحظ تذبذباً طفيفاً في الجهد الناتج خلال فترات الظهيرة القصوى بسبب تراكم الغبار والارتفاع المفاجئ في درجات الحرارة.
   - **الإجراء الموصى به**: جدولة تنظيف آلي مائي للألواح كل أسبوعين، وفحص المشتت الحراري للمروحة البديلة (إضافة صنف SKU-SOL-INV-001).

2. **أنظمة تبريد مركز البيانات بالوزارة (مستوى الخطورة: منخفضة جداً - 8% خطورة عطل)**:
   - **السبب الفني**: الصيانة الوقائية الأخيرة (أمر الصيانة wo-1) واستبدال المراوح أدى إلى استقرار تام لدرجات حرارة المعالجات المركزية عند 34 درجة مئوية.
   - **الإجراء الموصى به**: لا شيء حالياً. إعادة التدقيق مبرمجة في 2026-10-15.

3. **شاحنة نقل الإمداد اللوجستي خ-205 (مستوى الخطورة: مرتفعة - 68% خطورة عطل بالمحرك)**:
   - **السبب الفني**: تجاوز العداد 112 ألف كم وتأخر الصيانة الدورية (Status: needs_preventive) مع ارتفاع استهلاك الوقود إلى 17.2 لتر/100كم.
   - **الإجراء الموصى به**: إيقاف مؤقت للسيارة وإرسالها فوراً لورشة الخرطوم المركزية لغيار فلاتر الزيت والوقود وفحص سيور ناقل الحركة.`;
    } else if (scenario === "forecast_demand") {
      simulatedResponse = `### 📦 تقرير التنبؤ بطلب قطع الغيار ومعدلات التخزين المثلى

محاكاة متقدمة لسلاسل الإمداد بناءً على مستويات الاستخدام الحالية ومعدلات الاستهلاك في الفروع الاتحادية:

1. **عاكسات الجهد الشمسي (Hybrid Inverters)**:
   - **المخزون الحالي**: 12 وحدة | **الاستهلاك المتوقع**: 5 وحدات في الربع القادم.
   - **التوصية**: الحفاظ على حد الأمان الحالي (MinQty: 4)، ولا داعي للشراء في الدورة الحالية لتجنب تجميد رأس المال.

2. **أقراص التخزين الصلبة للخوادم (Enterprise SSD 2TB)**:
   - **المخزون الحالي**: 85 وحدة | **الاستهلاك المتوقع**: 15 وحدة نظراً لتزايد أرشفة المعاملات بالوزارة.
   - **التوصية**: التخزين الحالي كافي ومستقر جداً.

3. **زيوت وفلاتر شاحنات الأسطول**:
   - **المخزون الحالي**: حرج (0 وحدات) | **الاستهلاك المتوقع**: 15 فلتر زيت و 30 لتر زيت محرك ديزل ثقيل.
   - **التوصية**: إصدار أمر شراء عاجل من المورد الوطني المعتمد لتفادي تعطل شاحنات التفتيش التجاري والرقابي.`;
    } else {
      simulatedResponse = `### 📋 تقرير ذكاء الأصول والتحليل الهيكلي الشامل لجمهورية السودان لعام 2035

تحديث شامل لمنظومة الحوكمة والامتثال طبقاً للمعيار الدولي ISO 55001:

- **إجمالي عدد الأصول المرصودة رقمياً**: **124,500 أصل وطني**.
- **إجمالي القيمة الاستثمارية المقدرة**: **122.3 مليون دولار أمريكي** (القيمة الدفترية للأصول الحالية).
- **معدل كفاءة تشغيل الأصول العام**: **91.8%** (متوافق مع المستهدفات الحكومية للتحول الرقمي).
- **الاستقرار البيئي للمنشآت**: **88.3 / 100** بفضل زيادة الاعتماد على الطاقة الهجينة المتجددة بمباني الوزارة وسوبا.
- **التوصية الاستراتيجية**: الإسراع في تعميم منظومة الباركود وQR الذكية على جميع الأصول المكتبية بالوزارات الولائية لضمان تكامل الأرصدة ومنع الفقد الفني والتجاري.`;
    }

    if (prompt) {
      simulatedResponse += `\n\n**💡 إجابة مخصصة لاستفسارك ("${prompt}")**:\nلقد تم فحص وتحليل طلبكم بخصوص الأصول بمساعدة محاكي الذكاء الاصطناعي السيادي لوزارة التجارة والصناعة. نوصي بمراجعة دورية للأصول الحرجة جغرافياً في ميناء بورتسودان ومجمع سوبا للمختبرات لضمان جودة وحيوية التدفق اللوجستي وتجنيب الاقتصاد الوطني تكاليف التوقف غير المجدولة.`;
    }

    return res.json({
      text: `💡 (ملاحظة: يعمل مستشار الأصول الذكي بنظام محاكاة الذكاء الاصطناعي السيادي لعدم توفر مفتاح GEMINI_API_KEY)\n\n${simulatedResponse}`,
    });
  }

  try {
    const systemInstruction = `
      You are the world's leading Enterprise Asset Management Architect, ISO 55001 Auditor, Smart Maintenance Specialist, and AI Asset Analytics Advisor for the Sudan Digital Ministry of Commerce & Industry.
      Your role is to analyze government physical buildings, data centers, testing laboratories, specialized equipment, logistics warehouses, vehicle fleets, spare parts inventories, and IoT telemetries, and generate elite predictive maintenance, health tracking, and operational intelligence reports.
      
      Always reference Sudanese locations (Khartoum Headquarters, Soba Standardization Labs, Port Sudan Free Zone, El Bagair Industrial Cluster), specific Sudan-grade assets, and National Asset Identifiers (NAIs). Frame recommendations around cost-effectiveness, energy efficiency, and modern solar integration under severe climate conditions.
      
      Respond in Arabic with an authoritative, technical, and strategic administrative tone. Format your response beautifully using rich Markdown.
      
      Scenario selected: ${scenario}
      Asset / Maintenance Context provided: ${JSON.stringify(context || {})}
    `;

    const userMessage = prompt 
      ? `الرجاء إجراء التحليل الاستشاري الخاص بإدارة الأصول والصيانة الاستباقية والـ GIS حول: ${prompt}` 
      : `الرجاء إصدار التقرير الاستشاري أو توقعات الفشل الفني الشاملة للأصول طبقاً للسيناريو المحدد.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن مستشار الأصول الذكي من صياغة تقرير التحليل التنبئي."
    });

  } catch (err: any) {
    console.error("Asset AI Advisor Error:", err);
    res.status(500).json({
      error: "فشل مستشار الأصول الذكي في الاتصال بـ Gemini",
      details: err.message
    });
  }
});

// --- VITE MIDDLEWARE & STATIC SERVING DEFINED AT THE BOTTOM ---

// --- SOVEREIGN PROCUREMENT PLATFORM ENDPOINTS ---
app.get("/api/procurement/suppliers", (req, res) => {
  const db = getDB();
  res.json(db.suppliers || []);
});

app.post("/api/procurement/suppliers", (req, res) => {
  const db = getDB();
  const sup = req.body;
  
  db.suppliers = db.suppliers || [];
  const currentCount = db.suppliers.length + 1;
  const paddingNum = String(currentCount).padStart(4, "0");
  const nationalId = `SD-SUP-2026-${paddingNum}`;
  
  const newSupplier = {
    id: `sup-${Date.now()}`,
    nationalId,
    nameAr: sup.nameAr || "مورد غير مسمى",
    nameEn: sup.nameEn || "Unnamed Supplier",
    type: sup.type || "local",
    typeAr: sup.typeAr || "مورد محلي",
    commercialRegistration: sup.commercialRegistration || `CR-TEMP-${Date.now()}`,
    taxId: sup.taxId || "TAX-PENDING-SD",
    certifications: sup.certifications || ["SSMO Standard Registered"],
    financialEval: sup.financialEval || "B+ (Satisfactory)",
    technicalEval: sup.technicalEval || "80% (Certified Capability)",
    riskRating: sup.riskRating || "low",
    performanceScore: Number(sup.performanceScore) || 85,
    status: sup.status || "active",
    address: sup.address || "الجمهورية السودانية"
  };
  
  db.suppliers.unshift(newSupplier);
  
  // Register KPI record
  db.supplierKpis = db.supplierKpis || [];
  db.supplierKpis.unshift({
    id: `skpi-${Date.now()}`,
    supplierId: newSupplier.id,
    supplierName: newSupplier.nameAr,
    deliveryScore: 85,
    qualityScore: 85,
    complianceScore: 90,
    costEfficiencyScore: 80,
    responseTimeScore: 85,
    overallIndex: 85
  });
  
  // Audit Log
  db.procurementAuditLogs = db.procurementAuditLogs || [];
  db.procurementAuditLogs.unshift({
    id: `pud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: sup.actor || "مسؤول تسجيل الموردين السيادي",
    actionAr: `تسجيل مورد وطني/أجنبي جديد بالمنصة الموحدة: ${newSupplier.nameAr}`,
    actionEn: `Registered new supplier with National Identifier: ${newSupplier.nameEn}`,
    details: `المعرف الوطني الموحد: ${newSupplier.nationalId} | السجل التجاري: ${newSupplier.commercialRegistration}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newSupplier);
});

app.get("/api/procurement/plans", (req, res) => {
  const db = getDB();
  res.json(db.procurementPlans || []);
});

app.post("/api/procurement/plans", (req, res) => {
  const db = getDB();
  const plan = req.body;
  
  db.procurementPlans = db.procurementPlans || [];
  const newPlan = {
    id: `plan-${Date.now()}`,
    planNameAr: plan.planNameAr || "خطة مشتريات عامة",
    planNameEn: plan.planNameEn || "General Procurement Plan",
    departmentAr: plan.departmentAr || "إدارة المشتريات العامة",
    departmentEn: plan.departmentEn || "Public Procurement Dept",
    budgetAllocated: Number(plan.budgetAllocated) || 0,
    budgetUtilized: 0,
    year: plan.year || "2026",
    status: "approved",
    categories: plan.categories || ["مستهلكات عامة"],
    createdAt: new Date().toISOString()
  };
  
  db.procurementPlans.unshift(newPlan);
  
  db.procurementAuditLogs = db.procurementAuditLogs || [];
  db.procurementAuditLogs.unshift({
    id: `pud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: plan.actor || "مدير التخطيط والموازنة المشتريات",
    actionAr: `المصادقة الرقمية على خطة المشتريات السنوية: ${newPlan.planNameAr}`,
    actionEn: `Approved and signed annual procurement plan: ${newPlan.planNameEn}`,
    details: `الجهة الطالبة: ${newPlan.departmentAr} | الموازنة المعتمدة: ${newPlan.budgetAllocated} ج.س`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newPlan);
});

app.get("/api/procurement/tenders", (req, res) => {
  const db = getDB();
  res.json(db.tenders || []);
});

app.post("/api/procurement/tenders", (req, res) => {
  const db = getDB();
  const tend = req.body;
  
  db.tenders = db.tenders || [];
  const currentCount = db.tenders.length + 1;
  const paddingNum = String(currentCount).padStart(3, "0");
  const tenderCode = `SD-TND-2026-${paddingNum}`;
  
  const newTender = {
    id: `tend-${Date.now()}`,
    tenderCode,
    titleAr: tend.titleAr || "تفاصيل العطاء المفتوح الموحد",
    titleEn: tend.titleEn || "Unified Open Tender Specifications",
    type: tend.type || "open",
    typeAr: tend.typeAr || "مناقصة عامة مفتوحة",
    budget: Number(tend.budget) || 0,
    tenderFee: Number(tend.tenderFee) || 0,
    publicationDate: new Date().toISOString().split("T")[0],
    submissionDeadline: tend.submissionDeadline || "2026-12-31",
    status: tend.status || "bidding",
    categoryAr: tend.categoryAr || "عام",
    categoryEn: tend.categoryEn || "General",
    clarificationCount: 0,
    bidsCount: 0
  };
  
  db.tenders.unshift(newTender);
  
  db.procurementAuditLogs = db.procurementAuditLogs || [];
  db.procurementAuditLogs.unshift({
    id: `pud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: tend.actor || "ديوان المشتريات والعطاءات الوطني",
    actionAr: `نشر مناقصة سيادية جديدة برقم: ${newTender.tenderCode}`,
    actionEn: `Published new sovereign tender: ${newTender.tenderCode}`,
    details: `العنوان: ${newTender.titleAr} | الموازنة المرصودة: ${newTender.budget} ج.س | رسوم العطاء: ${newTender.tenderFee} ج.س`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newTender);
});

app.get("/api/procurement/bids", (req, res) => {
  const db = getDB();
  res.json(db.bids || []);
});

app.post("/api/procurement/tenders/bids", (req, res) => {
  const db = getDB();
  const bidData = req.body;
  
  db.bids = db.bids || [];
  
  // Calculate combined score (QCBS weighted: 70% technical, 30% financial)
  const techScore = Number(bidData.technicalScore) || 80;
  const finScore = Number(bidData.financialScore) || 80;
  const combinedScore = Number((techScore * 0.7 + finScore * 0.3).toFixed(1));
  
  const newBid = {
    id: `bid-${Date.now()}`,
    tenderId: bidData.tenderId,
    supplierId: bidData.supplierId || "sup-default",
    supplierNameAr: bidData.supplierNameAr || "مورد سيادي",
    supplierNameEn: bidData.supplierNameEn || "Sovereign Supplier",
    technicalScore: techScore,
    financialScore: finScore,
    combinedScore,
    amount: Number(bidData.amount) || 0,
    status: bidData.status || "submitted",
    submissionDate: new Date().toISOString().split("T")[0],
    notes: bidData.notes || "لا توجد ملاحظات إضافية"
  };
  
  db.bids.unshift(newBid);
  
  // Increment bids count in the target tender
  db.tenders = db.tenders || [];
  const tIdx = db.tenders.findIndex((t: any) => t.id === bidData.tenderId);
  if (tIdx !== -1) {
    db.tenders[tIdx].bidsCount = (db.tenders[tIdx].bidsCount || 0) + 1;
  }
  
  db.procurementAuditLogs = db.procurementAuditLogs || [];
  db.procurementAuditLogs.unshift({
    id: `pud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: bidData.actor || "أمين لجنة استلام العطاءات الموحدة",
    actionAr: `استلام وتشفير عرض منافسة للعطاء رقم: ${bidData.tenderId}`,
    actionEn: `Received and encrypted competitor bid for tender: ${bidData.tenderId}`,
    details: `المورد: ${newBid.supplierNameAr} | القيمة المالية المقترحة: ${newBid.amount} ج.س | التقييم التقني الأولي: ${techScore}%`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newBid);
});

app.post("/api/procurement/tenders/award", (req, res) => {
  const db = getDB();
  const { tenderId, bidId, actor } = req.body;
  
  db.tenders = db.tenders || [];
  const tIdx = db.tenders.findIndex((t: any) => t.id === tenderId);
  if (tIdx === -1) {
    return res.status(404).json({ error: "المناقصة المطلوبة غير موجودة" });
  }
  
  db.bids = db.bids || [];
  const bIdx = db.bids.findIndex((b: any) => b.id === bidId);
  if (bIdx === -1) {
    return res.status(404).json({ error: "العرض المطلوب غير موجود" });
  }
  
  const tender = db.tenders[tIdx];
  const bid = db.bids[bIdx];
  
  // Update status
  tender.status = "awarded";
  bid.status = "awarded";
  
  db.tenders[tIdx] = tender;
  db.bids[bIdx] = bid;
  
  // Generate Contract
  db.procurementContracts = db.procurementContracts || [];
  const contractCode = `SD-CON-2026-${String(db.procurementContracts.length + 1).padStart(3, "0")}`;
  const newContract = {
    id: `pcon-${Date.now()}`,
    contractCode,
    titleAr: `اتفاقية تنفيذ وإمداد بخصوص: ${tender.titleAr}`,
    titleEn: `Procurement & Implementation Contract for: ${tender.titleEn}`,
    supplierName: bid.supplierNameAr,
    totalValue: bid.amount,
    status: "execution",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 6 months
    signedDigitally: true,
    milestones: [
      { title: "اعتماد التجهيزات وبداية العمل الهيكلي", weight: 20, status: "pending", date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
      { title: "التسليم التجريبي الأولي والربط الشبكي", weight: 50, status: "pending", date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
      { title: "التسليم النهائي وضمان الكفاءة التشغيلية", weight: 30, status: "pending", date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }
    ],
    performanceGuarantee: { amount: bid.amount * 0.1, bank: "بنك الخرطوم", status: "active", expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }
  };
  db.procurementContracts.unshift(newContract);
  
  // Generate Purchase Order
  db.purchaseOrders = db.purchaseOrders || [];
  const poCode = `SD-PO-2026-${String(db.purchaseOrders.length + 1).padStart(3, "0")}`;
  const newPO = {
    id: `po-${Date.now()}`,
    poCode,
    tenderId: tender.id,
    supplierName: bid.supplierNameAr,
    itemAr: tender.titleAr,
    itemEn: tender.titleEn,
    quantity: 1,
    totalAmount: bid.amount,
    status: "approved",
    paymentStatus: "authorized",
    createdAt: new Date().toISOString().split("T")[0],
    deliveryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    invoiceMatched: false
  };
  db.purchaseOrders.unshift(newPO);
  
  // Integrate into Asset Management if it's an asset tender
  if (tender.categoryAr.includes("طاقة") || tender.categoryAr.includes("خوادم") || tender.categoryAr.includes("معدات")) {
    db.assets = db.assets || [];
    const astCount = db.assets.length + 1;
    const paddingNum = String(astCount).padStart(4, "0");
    const nationalId = `SD-NAI-2026-${paddingNum}`;
    db.assets.unshift({
      id: `ast-${Date.now()}`,
      nationalId,
      nameAr: tender.titleAr.replace("توريد وتركيب ", ""),
      nameEn: tender.titleEn.replace("Supply and Installation of ", ""),
      classificationAr: "معدات تشغيلية استراتيجية",
      classificationEn: "Strategic Operating Equipment",
      ownerDepartmentAr: "المخازن المركزية واللوجستيات",
      ownerDepartmentEn: "Central Warehouses & Logistics",
      locationAr: "مجمع سوبا للابتكار",
      locationEn: "Soba Innovation Cluster",
      value: bid.amount,
      depreciationTypeAr: "قسط ثابت",
      depreciationTypeEn: "Straight Line",
      currentValue: bid.amount,
      warrantyStatusAr: "ساري (تحت التنفيذ)",
      warrantyStatusEn: "Active (Under Execution)",
      insurancePolicy: "SD-SOV-INS-7720",
      lifecycleStatus: "under_installation",
      healthIndex: 100,
      assignedUserAr: bid.supplierNameAr,
      assignedUserEn: bid.supplierNameEn || bid.supplierNameAr,
      createdAt: new Date().toISOString()
    });
  }
  
  // Log
  db.procurementAuditLogs = db.procurementAuditLogs || [];
  db.procurementAuditLogs.unshift({
    id: `pud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "رئيس لجنة البت والترسية الفيدرالية الموحدة",
    actionAr: `ترسية العطاء رقم: ${tender.tenderCode} وصياغة العقد والـ PO السيادي`,
    actionEn: `Awarded tender: ${tender.tenderCode}, generated contract and public PO`,
    details: `الترسية على: ${bid.supplierNameAr} | القيمة المعتمدة: ${bid.amount} ج.س | الرمز التعاقدي الموحد: ${newContract.contractCode}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json({ tender, bid, contract: newContract, po: newPO });
});

app.get("/api/procurement/contracts", (req, res) => {
  const db = getDB();
  res.json(db.procurementContracts || []);
});

app.post("/api/procurement/contracts", (req, res) => {
  const db = getDB();
  const cData = req.body;
  
  db.procurementContracts = db.procurementContracts || [];
  const contractCode = `SD-CON-2026-${String(db.procurementContracts.length + 1).padStart(3, "0")}`;
  
  const newContract = {
    id: `pcon-${Date.now()}`,
    contractCode,
    titleAr: cData.titleAr || "اتفاقية توريد عامة",
    titleEn: cData.titleEn || "General Procurement Agreement",
    supplierName: cData.supplierName || "مورد معتمد",
    totalValue: Number(cData.totalValue) || 0,
    status: cData.status || "execution",
    startDate: cData.startDate || new Date().toISOString().split("T")[0],
    endDate: cData.endDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    signedDigitally: true,
    milestones: cData.milestones || [
      { title: "التوريد الأولي للأجهزة والمستلزمات", weight: 50, status: "pending", date: "2026-09-15" },
      { title: "التسليم والتشغيل النهائي للمشروع", weight: 50, status: "pending", date: "2026-12-15" }
    ],
    performanceGuarantee: { amount: (Number(cData.totalValue) || 0) * 0.1, bank: "بنك الخرطوم", status: "active", expiry: "2027-06-30" }
  };
  
  db.procurementContracts.unshift(newContract);
  
  db.procurementAuditLogs = db.procurementAuditLogs || [];
  db.procurementAuditLogs.unshift({
    id: `pud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: cData.actor || "مسؤول الشؤون القانونية والمشتريات",
    actionAr: `المصادقة والتوقيع الرقمي لعقد توريد مشتريات برقم: ${newContract.contractCode}`,
    actionEn: `Signed and registered procurement contract: ${newContract.contractCode}`,
    details: `الطرف الثاني: ${newContract.supplierName} | إجمالي القيمة المالية: ${newContract.totalValue} ج.س`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newContract);
});

app.get("/api/procurement/purchase-orders", (req, res) => {
  const db = getDB();
  res.json(db.purchaseOrders || []);
});

app.post("/api/procurement/purchase-orders", (req, res) => {
  const db = getDB();
  const poData = req.body;
  
  db.purchaseOrders = db.purchaseOrders || [];
  const poCode = `SD-PO-2026-${String(db.purchaseOrders.length + 1).padStart(3, "0")}`;
  
  const newPO = {
    id: `po-${Date.now()}`,
    poCode,
    tenderId: poData.tenderId || "direct",
    supplierName: poData.supplierName || "مورد معتمد",
    itemAr: poData.itemAr || "صنف مشتريات عام",
    itemEn: poData.itemEn || "General Procurement Item",
    quantity: Number(poData.quantity) || 1,
    totalAmount: Number(poData.totalAmount) || 0,
    status: poData.status || "approved",
    paymentStatus: poData.paymentStatus || "authorized",
    createdAt: new Date().toISOString().split("T")[0],
    deliveryDate: poData.deliveryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    invoiceMatched: false
  };
  
  db.purchaseOrders.unshift(newPO);
  
  db.procurementAuditLogs = db.procurementAuditLogs || [];
  db.procurementAuditLogs.unshift({
    id: `pud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: poData.actor || "مسؤول الموازنة والمخازن",
    actionAr: `إصدار أمر شراء (Purchase Order) برقم: ${newPO.poCode}`,
    actionEn: `Issued new purchase order: ${newPO.poCode}`,
    details: `التوريد من: ${newPO.supplierName} | المادة: ${newPO.itemAr} | إجمالي القيمة: ${newPO.totalAmount} ج.س`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newPO);
});

app.get("/api/procurement/audit-logs", (req, res) => {
  const db = getDB();
  res.json(db.procurementAuditLogs || []);
});

app.post("/api/procurement/ai-advisor", async (req, res) => {
  const { prompt, scenario, context } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    let simulatedResponse = "";
    if (scenario === "detect_collusion") {
      simulatedResponse = `### 🔍 تقرير الكشف التنبئي عن التواطؤ وأنماط العطاءات المشبوهة
التحليل الرقمي الذكي بناءً على خوارزميات سلسلة الكتل ومقارنة السجلات الجغرافية وعناوين الـ IP للعطاءات المقدمة لعام 2026:

1. **المناقصة SD-TND-2026-002 (تحديث خوادم التخزين السحابي)**:
   - **النمط المكتشف**: تم رصد تطابق كامل بنسبة 95% في التنسيق الهيكلي والتحليل التقديري للتكاليف في جداول الكميات بين عرضين منافسين.
   - **التحليل الرقمي**: تم تقديم العروض بفارق زمني يبلغ 4 دقائق فقط ومن عنوان شبكة متقارب جغرافياً بمجمع سوبا.
   - **التقييم الفني**: خطورة تواطؤ مرتفعة جداً (High Risk - 84%).
   - **التوصية الأمنية**: إحالة العروض فوراً لديوان المستشار القانوني للوزارة وتوجيه لجنة فض المظاريف بإيقاف الترسية لحين الانتهاء من التحقيق الداخلي لضمان النزاهة وحماية المال العام.

2. **التسعير غير الطبيعي (Abnormal Pricing)**:
   - تم كشف تقديم عرض مالي من أحد الوكلاء الفرعيين يقل بنسبة 42% عن التكلفة المعيارية الدنيا للاستيراد طبقاً للجمارك وبوابة الكوميسا. هذا يرجح توريد معدات غير مطابقة للمواصفات الفيدرالية السودانية.`;
    } else if (scenario === "strategy_recommendation") {
      simulatedResponse = `### 🎯 تقرير توصية الاستراتيجية الشرائية وتخفيض التكاليف لعام 2026
توصية استراتيجية لتحسين سلاسل الإمداد ومعدلات التوفير المالي بالوزارة:

1. **منظومات الطاقة الشمسية والبطاريات الهجينة**:
   - **الاستراتيجية الموصى بها**: الانتقال من الشراء المباشر الفردي للمنشآت إلى **العقود الإطارية السيادية الموحدة (Sovereign Framework Agreements)**.
   - **العائد المالي المتوقع**: خفض تكاليف الشراء بنسبة 22% بفضل وفورات الحجم الكبيرة مع كبار الموردين المحليين والدوليين (جياد والموردين الإقليميين).
   - **المرونة والضمان**: توحيد معايير الضمان الفني الفيدرالي ليكون 5 سنوات صيانة شاملة ملزمة من الموردين المعتمدين.

2. **قطع غيار الخوادم ومستلزمات مراكز البيانات**:
   - **الاستراتيجية**: دمج طلبات المشتريات لجميع الوزارات الخدمية تحت مظلة واحدة وإطلاق عطاء محدود للشركات المتخصصة الحاملة لشهادات الامتثال الرقمي.`;
    } else {
      simulatedResponse = `### 📊 تقرير ذكاء المشتريات والتحليل الهيكلي العام لوزارة التجارة والصناعة
التحليل العام ومعدلات التوفير طبقاً لبيانات الربع الحالي:

- **إجمالي المشتريات المعتمدة**: **179.2 مليون جنيه سوداني**
- **معدل التوفير المالي (Procurement Savings)**: **14.3%** بفضل تفعيل لجان البت التنافسية الذكية ومكافحة الاحتكار.
- **متوسط زمن دورة المناقصة (Tender Cycle Time)**: **18 يوماً** (انخفاض من 35 يوماً في العام السابق بفضل الرقمنة الكاملة للعقود وسندات القبض الفورية).
- **نسبة التوقيع الرقمي المعتمد للعقود**: **100%** من العقود مسجلة وموثقة بصمات مشفرة غير قابلة للتلاعب.`;
    }

    if (prompt) {
      simulatedResponse += `\n\n**💡 إجابة مخصصة لاستفسارك ("${prompt}")**:\nتم تحليل الاستعلام الشرائي بمساعدة الذكاء الاصطناعي السيادي لوزارة التجارة والصناعة. نوصي بتفعيل التدقيق المستمر على الضمانات البنكية للموردين المسجلين لضمان تنفيذ المشاريع الحيوية في ميعادها التعاقدي المبرم.`;
    }

    return res.json({
      text: `💡 (ملاحظة: يعمل مستشار المشتريات الذكي بنظام محاكاة الذكاء الاصطناعي السيادي لعدم توفر مفتاح GEMINI_API_KEY)\n\n${simulatedResponse}`,
    });
  }

  try {
    const systemInstruction = `
      You are the world's leading Government Procurement Architect, Enterprise Sourcing Consultant, Tender Management Specialist, and AI Procurement Analytics Consultant for the Sudan Digital Ministry of Commerce & Industry.
      Your role is to analyze government tenders, bids, supplier profiles, purchase orders, contracts, and financial records to detect bid-rigging/collusion, recommend strategic sourcing plans, identify abnormal pricing, and write elite intelligence reports.
      
      Always frame recommendations around public transparency, anti-corruption controls, COMESA rules, SSMO requirements, and local economic development for Sudanese enterprises. Reference Sudanese entities like Giad Group, SSMO, soba labs, and National Supplier Identifiers.
      
      Respond in Arabic with an authoritative, technical, and strategic administrative tone. Format your response beautifully using rich Markdown.
      
      Scenario selected: ${scenario}
      Procurement / Bidding Context: ${JSON.stringify(context || {})}
    `;

    const userMessage = prompt 
      ? `الرجاء إجراء التحليل الاستشاري الخاص بالمشتريات والعطاءات والتحليل الاستباقي حول: ${prompt}` 
      : `الرجاء إصدار التقرير الاستشاري أو تحليل النمط المحدد طبقاً للسيناريو الشرائي المختار.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن مستشار المشتريات الذكي من صياغة تقرير التحليل التنبئي."
    });

  } catch (err: any) {
    console.error("Procurement AI Advisor Error:", err);
    res.status(500).json({
      error: "فشل مستشار المشتريات الذكي في الاتصال بـ Gemini",
      details: err.message
    });
  }
});


// --- SOVEREIGN GRC PLATFORM ENDPOINTS ---
app.get("/api/grc/risks", (req, res) => {
  const db = getDB();
  res.json(db.grcRisks || []);
});

app.post("/api/grc/risks", (req, res) => {
  const db = getDB();
  const risk = req.body;
  
  db.grcRisks = db.grcRisks || [];
  const currentCount = db.grcRisks.length + 1;
  const paddingNum = String(currentCount).padStart(4, "0");
  const nationalId = `SD-NRI-2026-${paddingNum}`;
  
  const inherentRiskScore = Number(risk.probability || 5) * Number(risk.impact || 5);
  const residualRiskScore = Math.round(inherentRiskScore * (1 - (Number(risk.controlEffectiveness || 50) / 100)));
  
  const newRisk = {
    id: `grisk-${Date.now()}`,
    nationalId,
    titleAr: risk.titleAr || "مخاطر تشغيلية عامة",
    titleEn: risk.titleEn || "General Operational Risk",
    category: risk.category || "operational",
    categoryAr: risk.categoryAr || "مخاطر تشغيلية",
    inherentRiskScore,
    residualRiskScore,
    riskAppetite: Number(risk.riskAppetite) || 25,
    riskTolerance: Number(risk.riskTolerance) || 40,
    mitigationPlanAr: risk.mitigationPlanAr || "إعداد خطة تقليل المخاطر الوقائية",
    mitigationPlanEn: risk.mitigationPlanEn || "Formulate protective risk mitigation plan",
    status: risk.status || "identifying",
    ownerAr: risk.ownerAr || "إدارة الحوكمة والالتزام"
  };
  
  db.grcRisks.unshift(newRisk);
  
  db.grcAuditLogs = db.grcAuditLogs || [];
  db.grcAuditLogs.unshift({
    id: `gla-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: risk.actor || "مسؤول سجل المخاطر الفيدرالي الموحد",
    actionAr: `تسجيل وتقييم خطر مؤسسي جديد برقم معرف وطني: ${newRisk.nationalId}`,
    actionEn: `Registered and evaluated new enterprise risk under National ID: ${newRisk.nationalId}`,
    details: `العنوان: ${newRisk.titleAr} | القيمة الكامنة: ${newRisk.inherentRiskScore} | القيمة المتبقية بعد الضوابط: ${newRisk.residualRiskScore}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newRisk);
});

app.get("/api/grc/controls", (req, res) => {
  const db = getDB();
  res.json(db.grcControls || []);
});

app.post("/api/grc/controls", (req, res) => {
  const db = getDB();
  const con = req.body;
  
  db.grcControls = db.grcControls || [];
  const newControl = {
    id: `gcon-${Date.now()}`,
    titleAr: con.titleAr || "ضابط رقابي مؤسسي",
    titleEn: con.titleEn || "Enterprise Control Element",
    type: con.type || "preventive",
    typeAr: con.typeAr || "وقائي استباقي",
    methodAr: con.methodAr || "مراجعة وفحص دوري مؤتمت",
    effectiveness: con.effectiveness || "effective",
    lastTested: new Date().toISOString().split("T")[0],
    nextTestDate: con.nextTestDate || "2027-12-31",
    notes: con.notes || "لا توجد تفاصيل"
  };
  
  db.grcControls.unshift(newControl);
  
  db.grcAuditLogs = db.grcAuditLogs || [];
  db.grcAuditLogs.unshift({
    id: `gla-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: con.actor || "أخصائي التدقيق الداخلي وإدارة الضوابط",
    actionAr: `إنشاء وتوثيق ضابط رقابي جديد بمكتبة الضوابط: ${newControl.titleAr}`,
    actionEn: `Created and cataloged new control in Controls Library: ${newControl.titleEn}`,
    details: `نوع الضابط: ${newControl.typeAr} | مستوى الفعالية: ${newControl.effectiveness}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newControl);
});

app.get("/api/grc/policies", (req, res) => {
  const db = getDB();
  res.json(db.grcPolicies || []);
});

app.post("/api/grc/policies", (req, res) => {
  const db = getDB();
  const pol = req.body;
  
  db.grcPolicies = db.grcPolicies || [];
  const newPolicy = {
    id: `gpol-${Date.now()}`,
    titleAr: pol.titleAr || "سياسة تنظيمية جديدة",
    titleEn: pol.titleEn || "New Corporate Policy Directive",
    categoryAr: pol.categoryAr || "سياسات عامة وحوكمة",
    status: pol.status || "approved",
    draftedBy: pol.draftedBy || "المستشار القانوني العام",
    version: pol.version || "1.0",
    publishDate: new Date().toISOString().split("T")[0],
    acknowledgementsCount: 0,
    expiryDate: pol.expiryDate || "2028-12-31"
  };
  
  db.grcPolicies.unshift(newPolicy);
  
  db.grcAuditLogs = db.grcAuditLogs || [];
  db.grcAuditLogs.unshift({
    id: `gla-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: pol.actor || "مدير إدارة الحوكمة والسياسات",
    actionAr: `صياغة ونشر منشور سياسي رسمي جديد: ${newPolicy.titleAr}`,
    actionEn: `Drafted and published new enterprise policy: ${newPolicy.titleEn}`,
    details: `النسخة: ${newPolicy.version} | الفئة: ${newPolicy.categoryAr}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newPolicy);
});

app.get("/api/grc/audits", (req, res) => {
  const db = getDB();
  res.json(db.grcAudits || []);
});

app.post("/api/grc/audits", (req, res) => {
  const db = getDB();
  const aud = req.body;
  
  db.grcAudits = db.grcAudits || [];
  const newAudit = {
    id: `gaud-${Date.now()}`,
    engagementNameAr: aud.engagementNameAr || "برنامج تدقيق داخلي",
    engagementNameEn: aud.engagementNameEn || "Internal Audit Engagement",
    scope: aud.scope || "فحص وتدقيق الالتزام والضوابط المالية",
    typeAr: aud.typeAr || "تدقيق التزام مالي وتشغيلي",
    status: aud.status || "in_progress",
    startDate: aud.startDate || new Date().toISOString().split("T")[0],
    endDate: aud.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    workingPapersCount: 0,
    findingsCount: 0
  };
  
  db.grcAudits.unshift(newAudit);
  
  db.grcAuditLogs = db.grcAuditLogs || [];
  db.grcAuditLogs.unshift({
    id: `gla-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: aud.actor || "مدير التدقيق الداخلي الفيدرالي",
    actionAr: `إطلاق مهمة تدقيق ورقابة داخلية جديدة: ${newAudit.engagementNameAr}`,
    actionEn: `Initiated new internal audit engagement: ${newAudit.engagementNameEn}`,
    details: `الوضع: ${newAudit.status} | النطاق الفني: ${newAudit.scope}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newAudit);
});

app.get("/api/grc/findings", (req, res) => {
  const db = getDB();
  res.json(db.grcFindings || []);
});

app.post("/api/grc/findings", (req, res) => {
  const db = getDB();
  const fnd = req.body;
  
  db.grcFindings = db.grcFindings || [];
  const newFinding = {
    id: `gfnd-${Date.now()}`,
    auditId: fnd.auditId || "gaud-default",
    findingTitleAr: fnd.findingTitleAr || "فجوة أو قصور بالامتثال",
    findingTitleEn: fnd.findingTitleEn || "Compliance Gap Finding",
    severity: fnd.severity || "medium",
    recommendationAr: fnd.recommendationAr || "إجراء الربط والضبط وتصحيح المسار",
    recommendationEn: fnd.recommendationEn || "Implement corrective actions immediately",
    status: fnd.status || "open",
    targetResolutionDate: fnd.targetResolutionDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    actualResolutionDate: ""
  };
  
  db.grcFindings.unshift(newFinding);
  
  // Increment findings count in target audit
  db.grcAudits = db.grcAudits || [];
  const aIdx = db.grcAudits.findIndex((a: any) => a.id === fnd.auditId);
  if (aIdx !== -1) {
    db.grcAudits[aIdx].findingsCount = (db.grcAudits[aIdx].findingsCount || 0) + 1;
  }
  
  // Create Corrective Action automatically
  db.grcCorrectiveActions = db.grcCorrectiveActions || [];
  db.grcCorrectiveActions.unshift({
    id: `gcar-${Date.now()}`,
    findingId: newFinding.id,
    actionAr: `خطة علاجية مخصصة لمعالجة: ${newFinding.findingTitleAr}`,
    actionEn: `Corrective action to remediate: ${newFinding.findingTitleEn}`,
    assignedToAr: fnd.assignedToAr || "مسؤول معالجة الثغرات والالتزام",
    status: "open",
    completionDate: "",
    evidenceDoc: ""
  });
  
  db.grcAuditLogs = db.grcAuditLogs || [];
  db.grcAuditLogs.unshift({
    id: `gla-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: fnd.actor || "مدقق داخلي معتمد",
    actionAr: `تسجيل ثغرة أو قصور تفتيش رقمي: ${newFinding.findingTitleAr}`,
    actionEn: `Registered new internal audit finding: ${newFinding.findingTitleEn}`,
    details: `الخطورة: ${newFinding.severity} | تاريخ التسوية المبرمج: ${newFinding.targetResolutionDate}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(newFinding);
});

app.get("/api/grc/corrective-actions", (req, res) => {
  const db = getDB();
  res.json(db.grcCorrectiveActions || []);
});

app.post("/api/grc/corrective-actions/resolve", (req, res) => {
  const db = getDB();
  const { correctiveActionId, evidenceDoc, actor } = req.body;
  
  db.grcCorrectiveActions = db.grcCorrectiveActions || [];
  const cIdx = db.grcCorrectiveActions.findIndex((c: any) => c.id === correctiveActionId);
  if (cIdx === -1) {
    return res.status(404).json({ error: "الخطة العلاجية المطلوبة غير موجودة" });
  }
  
  const action = db.grcCorrectiveActions[cIdx];
  action.status = "completed";
  action.completionDate = new Date().toISOString().split("T")[0];
  action.evidenceDoc = evidenceDoc || "سند امتثال رقمي";
  
  db.grcCorrectiveActions[cIdx] = action;
  
  // Resolve the finding
  db.grcFindings = db.grcFindings || [];
  const fIdx = db.grcFindings.findIndex((f: any) => f.id === action.findingId);
  if (fIdx !== -1) {
    db.grcFindings[fIdx].status = "resolved";
    db.grcFindings[fIdx].actualResolutionDate = new Date().toISOString().split("T")[0];
  }
  
  db.grcAuditLogs = db.grcAuditLogs || [];
  db.grcAuditLogs.unshift({
    id: `gla-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: actor || "مسؤول الالتزام والجودة",
    actionAr: `إغلاق خطة علاجية وتأكيد امتثال الثغرة رقم: ${action.id}`,
    actionEn: `Resolved corrective action and closed finding: ${action.id}`,
    details: `البينة الرقمية: ${action.evidenceDoc} | تاريخ الإغلاق الفعلي: ${action.completionDate}`,
    hash: `sha256_${Math.random().toString(36).substring(2)}`
  });
  
  saveDB(db);
  res.json(action);
});

app.get("/api/grc/incidents", (req, res) => {
  const db = getDB();
  res.json(db.grcIncidents || []);
});

app.post("/api/grc/incidents", (req, res) => {
  const db = getDB();
  const inc = req.body;
  
  db.grcIncidents = db.grcIncidents || [];
  const securesHash = `sha256_wb_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  
  const newIncident = {
    id: `ginc-${Date.now()}`,
    incidentTitleAr: inc.incidentTitleAr || "بلاغ/مخالفة أخلاقية أو إدارية",
    incidentTitleEn: inc.incidentTitleEn || "Governance/Ethics Violation Incident",
    categoryAr: inc.categoryAr || "بلاغات الفساد والنزاهة وحماية المستهلك",
    reporterType: inc.reporterType || "anonymous_whistleblower",
    securedWhistleblowerHash: securesHash,
    detailsAr: inc.detailsAr || "التفاصيل مشفرة بالكامل طبقاً لسياسة حماية كاشفي الفساد.",
    status: "under_investigation",
    loggedAt: new Date().toISOString(),
    investigatorAr: "مفوض النزاهة والرقابة بالوزارة"
  };
  
  db.grcIncidents.unshift(newIncident);
  
  db.grcAuditLogs = db.grcAuditLogs || [];
  db.grcAuditLogs.unshift({
    id: `gla-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: inc.reporterType === "anonymous_whistleblower" ? "نظام حماية البلاغات المشفرة" : (inc.actor || "مسؤول الأمن الإداري والامتثال"),
    actionAr: `تلقي وتسجيل بلاغ حوكمة/مكافحة فساد بنظام البصمة المؤمنة: ${newIncident.id}`,
    actionEn: `Received and cryptographically logged governance whistleblower report: ${newIncident.id}`,
    details: `التصنيف: ${newIncident.categoryAr} | البصمة السرية لكاشف الفساد: ${newIncident.securedWhistleblowerHash}`,
    hash: securesHash
  });
  
  saveDB(db);
  res.json(newIncident);
});

app.get("/api/grc/audit-logs", (req, res) => {
  const db = getDB();
  res.json(db.grcAuditLogs || []);
});

app.post("/api/grc/ai-advisor", async (req, res) => {
  const { prompt, scenario, context } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    let simulatedResponse = "";
    if (scenario === "predict_emerging_risks") {
      simulatedResponse = `### 🔮 تقرير التنبؤ الذكي بالمخاطر الاستراتيجية والتشغيلية الناشئة لعام 2026/2035
التحليل الاستباقي لمحاكاة المخاطر بالاعتماد على ذكاء الأعمال السيادي ومؤشرات أداء الإمداد والأسواق السودانية:

1. **مخاطر فجوات الامتثال للتقييس والمواصفات (مستوى الخطورة: متوسطة - 45% خطورة تكرار الثغرات)**:
   - **المحفز الفني**: تزايد حجم صادرات الصمغ العربي عبر ميناء بورتسودان بمتوسط نمو شهري 15% قد يفوق السعة الاستيعابية الحالية لأجهزة المعايرة والتدقيق الكيميائي بسوبا.
   - **توصية التخفيف الاستباقية**: الإسراع في توفير محاليل معيارية احتياطية (Spare Parts SKU-CHEM-LAB-102) وتوسيع فحص المطابقة ليكون مميكناً بالكامل.

2. **مخاطر الاحتكار غير العادل وتأخير الإفصاح عن الملكية النهائية للمستوردين**:
   - **التقييم الفني**: رصد 3 حالات تداخل في المالكين النهائيين لمجموعات تسعى للتحكم في أسعار السلع الغذائية المدعومة.
   - **التوصية**: ربط آلي صارم وفوري بين سجلات المستوردين بالسجل التجاري الموحد والتدقيق المالي الذكي لكشف أي محاولات غسيل أموال أو ممارسات احتكارية مخلة.`;
    } else if (scenario === "prioritize_audits") {
      simulatedResponse = `### 📋 خطة تدقيق الحسابات والامتثال الاستراتيجية المبنية على درجة المخاطر
تحليل ذكي لجدولة أولويات لجان التدقيق الفيدرالية بالوزارة لتعظيم العائد والحد من تبديد موارد الدولة:

1. **الأولوية الأولى (خطورة بالغة): تدقيق مشتريات وسلاسل إمداد السلع المدعومة (الدقيق والتموين)**:
   - **معدل التعرض للمخاطر (Risk Score)**: 85% (نظراً للموازنات الضخمة وحساسية سلاسل الإمداد).
   - **النطاق**: مراجعة شاملة للعقود الإطارية (SD-TND-2026-003) ومطابقة الفواتير والوصولات مع بوابة الدفع الفيدرالي الموحد.

2. **الأولوية الثانية (خطورة متوسطة): مراجعة حوكمة تسجيل الأصول والتراخيص الإدارية**:
   - **معدل التعرض للمخاطر**: 55%
   - **النطاق**: التحقق من فاعلية ضوابط التتبع الجغرافي للأسطول الفيدرالي والمطابقة المستندية لأمر الصيانة الفنية.`;
    } else {
      simulatedResponse = `### 🛡️ تقرير ذكاء الحوكمة والمخاطر والالتزام (GRC) الشامل
الملخص التنفيذي لمستوى الامتثال الكلي بوزارة التجارة والصناعة:

- **مؤشر النزاهة والالتزام الكلي (Compliance Index)**: **96.4 / 100** (متوافق مع معايير الشفافية الدولية للكوميسا).
- **معدل نضج الحوكمة (Governance Maturity)**: **المستوى الرابع (مؤتمت ومسيطر عليه)**.
- **إجمالي عدد المخاطر المرصودة والمسيطر عليها**: **12 مخاطر وطنية** (Residual Risk يتراوح في الحدود الآمنة أقل من 40%).
- **معدل إغلاق وتسوية التوصيات الرقابية**: **94%** بفضل الاستجابة الفورية وتفعيل الخطط العلاجية (Corrective Actions).
- **التوصية الاستراتيجية للوزير**: الاستمرار في توثيق وحماية بلاغات الجمهور السرية (Whistleblower Protection) لتوسيع شبكة الرقابة الذاتية الفعالة.`;
    }

    if (prompt) {
      simulatedResponse += `\n\n**💡 إجابة مخصصة لاستفسارك ("${prompt}")**:\nتم تحليل الاستفسار الخاص بالحوكمة والامتثال بمساعدة نظام المحاكاة السيادي للذكاء الاصطناعي. نوصي بتفعيل التدريب الإلزامي المستمر للموظفين على لائحة حظر تضارب المصالح لضمان أعلى مستويات النزاهة الحكومية.`;
    }

    return res.json({
      text: `💡 (ملاحظة: يعمل مستشار الحوكمة والمخاطر الذكي بنظام محاكاة الذكاء الاصطناعي السيادي لعدم توفر مفتاح GEMINI_API_KEY)\n\n${simulatedResponse}`,
    });
  }

  try {
    const systemInstruction = `
      You are the world's leading Enterprise Governance Architect, GRC Expert, Risk Management Consultant, and Internal Audit Specialist for the Sudan Digital Ministry of Commerce & Industry.
      Your role is to analyze government GRC databases (risks, controls, policies, audit working papers, whistleblower cases, compliance exceptions) to predict emerging risks, prioritize audit programs, identify compliance gaps, and draft ministerial reports.
      
      Respond in Arabic with an authoritative, technical, and highly strategic administrative tone. Format your response beautifully using rich Markdown. Include references to Sudanese locations, specific regulatory frameworks (SSMO, COMESA, Sudan Digital Vision 2035), and National Risk Identifiers.
      
      Scenario selected: ${scenario}
      GRC / Audit / Risk Context: ${JSON.stringify(context || {})}
    `;

    const userMessage = prompt 
      ? `الرجاء إجراء التحليل الرقابي الاستشاري الخاص بالحوكمة والمخاطر والالتزام والتدقيق الداخلي حول: ${prompt}` 
      : `الرجاء إصدار التقرير الاستشاري أو تحليل النمط الرقابي المحدد طبقاً لسيناريو الحوكمة والالتزام المختار.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن مستشار الحوكمة والالتزام الذكي من صياغة تقرير التحليل التنبئي."
    });

  } catch (err: any) {
    console.error("GRC AI Advisor Error:", err);
    res.status(500).json({
      error: "فشل مستشار الحوكمة والالتزام الذكي في الاتصال بـ Gemini",
      details: err.message
    });
  }
});

// --- CYBERSECURITY & SOVEREIGN SOC ENDPOINTS ---

// Helper to create tamper-proof logs
function addSecurityAuditLog(actor: string, actionAr: string, actionEn: string, details: string) {
  const db = getDB();
  const id = `slog-${Date.now()}`;
  const timestamp = new Date().toISOString();
  // Simulated SHA-256 block hash for audit integrity
  const rawData = `${timestamp}|${actor}|${actionEn}|${details}`;
  let hashVal = 0;
  for (let i = 0; i < rawData.length; i++) {
    hashVal = (hashVal << 5) - hashVal + rawData.charCodeAt(i);
    hashVal |= 0;
  }
  const hash = `sha256_seclog_${Math.abs(hashVal).toString(16)}_${id}`;
  
  const logEntry = { id, timestamp, actor, actionAr, actionEn, details, hash };
  db.secAuditLogs.unshift(logEntry);
  saveDB(db);
  return logEntry;
}

// 1. Get Security Events (SIEM)
app.get("/api/sec/events", (req, res) => {
  const db = getDB();
  res.json(db.secEvents || []);
});

// 2. Ingest Security Event (Live Log Ingestion)
app.post("/api/sec/events", (req, res) => {
  const db = getDB();
  const { source, category, severity, messageAr, messageEn, actor, ipAddress, status, payload } = req.body;
  
  const newEvent = {
    id: `sevent-${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: source || "System API",
    category: category || "system",
    severity: severity || "low",
    messageAr: messageAr || "حدث أمني جديد",
    messageEn: messageEn || "Generic security event",
    actor: actor || "anonymous",
    ipAddress: ipAddress || "127.0.0.1",
    status: status || "allowed",
    payload: payload || ""
  };

  db.secEvents.unshift(newEvent);
  
  // Recalculate MTTD or generate incident if severity is critical and status is allowed
  if (severity === "critical" && status !== "blocked") {
    // Generate an automatic high-priority incident via SOAR
    const incId = `sinc-${Date.now()}`;
    const autoIncident = {
      id: incId,
      titleAr: `إنذار تلقائي: ${messageAr}`,
      titleEn: `SOAR Triggered Incident: ${messageEn}`,
      descriptionAr: `توليد تلقائي للتذكرة بناءً على رصد حدث فائق الخطورة من مصدر: ${source}`,
      descriptionEn: `Automated high-priority ticket generated by SIEM correlation for critical event from: ${source}`,
      category: category === "authentication" ? "unauthorized_access" : "insider_threat",
      severity: "critical",
      status: "new",
      loggedAt: new Date().toISOString(),
      assignedTo: "soc_analyst",
      timeline: [
        {
          timestamp: new Date().toISOString(),
          actionAr: "توليد التنبيه وتثبيت الحدث في نظام الـ SIEM",
          actionEn: "Correlation engine triggered. Critical threat alert registered.",
          actor: "SIEM Correlator Engine"
        },
        {
          timestamp: new Date().toISOString(),
          actionAr: "تفعيل كتاب الاستجابة التلقائي (SOAR Playbook) - جاري العزل وتوجيه إشعار لمدير النظام",
          actionEn: "SOAR Incident Containment Playbook initiated. Triggered admin notification.",
          actor: "SOAR Automated Platform"
        }
      ]
    };
    db.secIncidents.unshift(autoIncident);
    addSecurityAuditLog(
      "SOAR Automated Platform",
      `توليد تذكرة تحقيق تلقائية ${incId} للحدث فائق الخطورة من ${source}`,
      `Generated automated incident response ticket ${incId} for critical event from ${source}`,
      `Automated ticket generated for source ${source}`
    );
  }

  saveDB(db);
  res.status(201).json(newEvent);
});

// 3. Get Incidents
app.get("/api/sec/incidents", (req, res) => {
  const db = getDB();
  res.json(db.secIncidents || []);
});

// 4. Create Incident manually
app.post("/api/sec/incidents", (req, res) => {
  const db = getDB();
  const { titleAr, titleEn, descriptionAr, descriptionEn, category, severity, assignedTo } = req.body;
  
  const newIncident = {
    id: `sinc-${Date.now()}`,
    titleAr,
    titleEn,
    descriptionAr,
    descriptionEn,
    category: category || "unauthorized_access",
    severity: severity || "medium",
    status: "new",
    loggedAt: new Date().toISOString(),
    assignedTo: assignedTo || "soc_analyst",
    timeline: [
      {
        timestamp: new Date().toISOString(),
        actionAr: "تسجيل البلاغ الأمني وتصنيفه مبدئياً",
        actionEn: "Incident registered and classified in SDMCI SOC",
        actor: "مركز عمليات الأمن السيبراني"
      }
    ]
  };

  db.secIncidents.unshift(newIncident);
  addSecurityAuditLog(
    "SOC Portal Admin",
    `تسجيل بلاغ أمني يدوي جديد بعنوان: ${titleAr}`,
    `Created new manual security incident: ${titleEn}`,
    descriptionEn || ""
  );
  saveDB(db);
  res.status(201).json(newIncident);
});

// 5. Append Timeline Action
app.post("/api/sec/incidents/:id/timeline", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { actionAr, actionEn, actor } = req.body;
  
  const incident = db.secIncidents.find(i => i.id === id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }

  if (!incident.timeline) incident.timeline = [];
  
  incident.timeline.push({
    timestamp: new Date().toISOString(),
    actionAr,
    actionEn,
    actor: actor || "SOC Analyst"
  });

  // Automatically update status to investigating if new
  if (incident.status === "new") {
    incident.status = "investigating";
  }

  addSecurityAuditLog(
    actor || "SOC Analyst",
    `تحديث الجدول الزمني للبلاغ ${id}: ${actionAr}`,
    `Updated timeline for incident ${id}: ${actionEn}`,
    `Incident ID: ${id}`
  );
  
  saveDB(db);
  res.json(incident);
});

// 6. Resolve / Contain Incident
app.post("/api/sec/incidents/:id/resolve", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { containmentActionAr, containmentActionEn, rootCauseAr, rootCauseEn, lessonsLearnedAr, lessonsLearnedEn, nextStatus } = req.body;

  const incident = db.secIncidents.find(i => i.id === id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }

  incident.status = nextStatus || "resolved";
  incident.containmentActionAr = containmentActionAr;
  incident.containmentActionEn = containmentActionEn;
  incident.rootCauseAr = rootCauseAr;
  incident.rootCauseEn = rootCauseEn;
  incident.lessonsLearnedAr = lessonsLearnedAr;
  incident.lessonsLearnedEn = lessonsLearnedEn;

  incident.timeline.push({
    timestamp: new Date().toISOString(),
    actionAr: `عزل واحتواء البلاغ بنجاح وتصنيف الإجراء تحت حالة [${nextStatus || "resolved"}]`,
    actionEn: `Successfully mitigated/contained incident, status updated to [${nextStatus || "resolved"}]`,
    actor: "SOC Specialist"
  });

  // Calculate MTTR and update secKpis
  const logTime = new Date(incident.loggedAt).getTime();
  const resTime = Date.now();
  const minutes = Math.max(1, Math.round((resTime - logTime) / 60000));
  
  if (db.secKpis) {
    const mttrKpi = db.secKpis.find(k => k.id === "skpi-3");
    if (mttrKpi) {
      // average calculation
      mttrKpi.value = parseFloat(((mttrKpi.value * 3 + minutes) / 4).toFixed(1));
    }
  }

  addSecurityAuditLog(
    "SOC Specialist",
    `إغلاق وحل البلاغ الأمني رقم ${id} وتثبيت الدروس المستفادة`,
    `Closed and resolved security incident ${id} with root cause and remediation logs`,
    containmentActionEn || ""
  );

  saveDB(db);
  res.json(incident);
});

// 7. Get Threat Intelligence
app.get("/api/sec/threat-intel", (req, res) => {
  const db = getDB();
  res.json(db.secThreatIntel || []);
});

// 8. Add Threat Intel feed
app.post("/api/sec/threat-intel", (req, res) => {
  const db = getDB();
  const { ioc, type, threatActor, mitreMapping, confidenceScore, source, severity } = req.body;
  
  const newIntel = {
    id: `sthr-${Date.now()}`,
    ioc,
    type: type || "ip",
    threatActor: threatActor || "Unknown Threat Actor",
    mitreMapping: mitreMapping || "T1110",
    confidenceScore: confidenceScore || 70,
    source: source || "National Feed",
    lastUpdated: new Date().toISOString(),
    status: "active",
    severity: severity || "medium"
  };

  db.secThreatIntel.unshift(newIntel);
  addSecurityAuditLog(
    "Threat Hunter Admin",
    `إضافة مؤشر اختراق استخباراتي جديد (IOC): ${ioc}`,
    `Added new threat indicator (IOC) for: ${threatActor}`,
    ioc || ""
  );
  saveDB(db);
  res.status(201).json(newIntel);
});

// 9. Get Vulnerabilities
app.get("/api/sec/vulnerabilities", (req, res) => {
  const db = getDB();
  res.json(db.secVulnerabilities || []);
});

// 10. Update Vulnerability Status (Patch Management)
app.post("/api/sec/vulnerabilities/:id/status", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status } = req.body;

  const vuln = db.secVulnerabilities.find(v => v.id === id);
  if (!vuln) {
    return res.status(404).json({ error: "Vulnerability not found" });
  }

  vuln.status = status;
  addSecurityAuditLog(
    "Security Engineer",
    `تحديث حالة معالجة الثغرة ${vuln.cveId} إلى: ${status}`,
    `Updated mitigation status of CVE ${vuln.cveId} to: ${status}`,
    `Mitigation: ${status}`
  );

  // Recalculate Cyber Risk Score based on remaining critical/high open vulnerabilities
  if (db.secKpis) {
    const openVulns = db.secVulnerabilities.filter(v => v.status !== "patched" && v.status !== "risk_accepted");
    const newRiskScore = Math.max(10, Math.min(100, openVulns.length * 10 + 5));
    const riskKpi = db.secKpis.find(k => k.id === "skpi-1");
    if (riskKpi) {
      riskKpi.value = newRiskScore;
    }
  }

  saveDB(db);
  res.json(vuln);
});

// 11. Get PKI Certificates
app.get("/api/sec/certificates", (req, res) => {
  const db = getDB();
  res.json(db.secCertificates || []);
});

// 12. Revoke Certificate
app.post("/api/sec/certificates/:id/revoke", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { reasonAr, reasonEn } = req.body;

  const cert = db.secCertificates.find(c => c.id === id);
  if (!cert) {
    return res.status(404).json({ error: "Certificate not found" });
  }

  cert.status = "revoked";
  cert.revocationReasonAr = reasonAr || "سحب يدوي أمني للشهادة";
  cert.revocationReasonEn = reasonEn || "Manual security revocation";
  cert.expiryDate = new Date().toISOString(); // Immediatly expire

  addSecurityAuditLog(
    "IAM Administrator",
    `إلغاء وسحب شهادة التشفير الرقمي ${cert.serialNumber}`,
    `Revoked encryption key/certificate: ${cert.serialNumber}`,
    reasonEn || "No details provided"
  );

  saveDB(db);
  res.json(cert);
});

// 13. Get Security Policies (Zero Trust)
app.get("/api/sec/policies", (req, res) => {
  const db = getDB();
  res.json(db.secPolicies || []);
});

// 14. Enforce/Add Security Policy
app.post("/api/sec/policies", (req, res) => {
  const db = getDB();
  const { titleAr, titleEn, type, rulesAr, rulesEn, status, actor } = req.body;

  const newPolicy = {
    id: `spol-${Date.now()}`,
    titleAr,
    titleEn,
    type: type || "conditional_access",
    rulesAr,
    rulesEn,
    status: status || "enforced",
    updatedAt: new Date().toISOString(),
    updatedBy: actor || "Security Manager"
  };

  db.secPolicies.push(newPolicy);
  addSecurityAuditLog(
    actor || "Security Manager",
    `تفعيل فرض سياسة أمن معلومات جديدة: ${titleAr}`,
    `Enforced new digital trust information policy: ${titleEn}`,
    rulesEn || "No details provided"
  );
  saveDB(db);
  res.status(201).json(newPolicy);
});

// 15. Get KPIs & Risk Scores
app.get("/api/sec/kpis", (req, res) => {
  const db = getDB();
  res.json(db.secKpis || []);
});

// 16. Get Immutable Audit Logs
app.get("/api/sec/audit-logs", (req, res) => {
  const db = getDB();
  res.json(db.secAuditLogs || []);
});

// 17. AI Cyber Defense Advisor (Gemini)
app.post("/api/sec/ai-defense", async (req, res) => {
  const { prompt, scenario, context } = req.body;
  const db = getDB();

  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  if (!ai) {
    // Generate an incredibly detailed and beautiful mock national executive threat intelligence report
    let simulatedResponse = `
### 🛡️ التقرير الوطني الموحد للأمن السيبراني والتحليل الاستباقي (SD-NCSC-2026)

طبقاً لتوجيهات معالي الوزير المحترم والأمانة العامة للأمن السيبراني، يسعد مركز العمليات السيبرانية السيادي (SOC) بوزارة التجارة والصناعة السودانية تقديم هذا التقرير الاستباقي المدعوم بالذكاء الاصطناعي:

---

#### 📊 1. المؤشرات الرقمية والوضع العام للمخاطر (Cybersecurity Posture)
* **مؤشر المخاطر السيبراني الموحد (Unified Cyber Risk Score)**: **18 / 100** (تصنيف: **ممتاز / آمن للغاية**)
* **متوسط وقت الرصد (MTTD)**: **4.2 دقيقة** (أفضل من مستهدف الاستراتيجية البالغ 5 دقائق)
* **متوسط وقت الاحتواء والعزل (MTTR)**: **12.5 دقيقة** (أفضل من مستهدف الاستراتيجية البالغ 15 دقيقة)
* **تغطية الهوية الرقمية الثنائية (MFA Coverage)**: **100%** لجميع الموظفين السياديين والماليين بورتسودان وسوبا.

---

#### 🚨 2. تحليل التهديدات ومكافحة التسلل (SIEM & SOAR Threat Analysis)
لقد تم رصد ومكافحة مهدد أمني هجين خلال الـ 24 ساعة الماضية:
1. **هجمات DDoS الموزعة**: تم رصد فيضان طلبات بقوة **120,000 طلب/ثانية** استهدف خادم المعاملات التجارية وبوابة التراخيص. تم عزل وتفعيل كتاب الاستجابة **SOAR-DDoS-Playbook** لفرض قيود جغرافية فورية وحجب النطاقات المصدرية المصابة، مما حال دون أي انقطاع بالخدمات.
2. **محاولات brute-force متطورة**: تم حجب عنوان IP أجنبي (${context?.lastIp || '198.51.100.77'}) حاول تخمين كلمة مرور مدير نظام تراخيص الصمغ العربي لـ 45 مرة متتالية. تم تفعيل الحظر الدائم وعزل الهوية الاحترازي.

---

#### 🔍 3. إدارة الثغرات الاستباقية وحوكمة الترقيع (Vulnerability Management)
* **CVE-2026-3199 (مخاطر حاسمة 9.8)**: ثغرة تجاوز المصادقة في بوابة الدفع القديمة. **الحالة: تم ترقيعها وعزلها بالكامل (Patched)**.
* **CVE-2026-4021 (مخاطر متوسطة 6.1)**: حقن نصوص برمجية في نماذج رخص الاستيراد. **الحالة: مجدولة للترقيع الفوري (Testing in Staging)**.

---

#### 👤 4. التنبؤ بالتهديدات الداخلية ومكافحة الاحتيال (Insider Threat & Fraud Detection)
رصد نظام تحليل السلوك الذكي (UEBA) نشاطاً غير معتاد من الحساب الرقمي لموظف بفرع بورتسودان يقوم بالاستعلام بشكل سريع وغير نمطي عن السجلات التجارية لشركات تصدير الغلال والمواشي (15 استعلاماً متتالياً خلال ثوانٍ معدودة). 
* **الإجراء الموصى به**: فرض مصادقة بيومترية فورية للتأكد من هوية المستخدم الحقيقي، وتحويل السجل الجنائي لفريق التدقيق الداخلي التابع لوزارة الشؤون القانونية.

---

#### 🔐 5. توصيات تطبيق معايير الثقة الرقمية والـ Zero Trust
1. **الربط البيني الآمن**: فرض ميكرو-تجزئة (Micro-segmentation) مشددة بين خوادم بوابة الاستثمار وبوابة الدفع الرقمية لضمان عدم عبور أي حركة مرور شبكية دون تدقيق.
2. **البنية التحتية للمفاتيح العامة (PKI)**: التوجيه بسحب جميع الشهادات الرقمية العاملة بمعيار التشفير القديم RSA 2048 واعتماد معيار RSA 4096-bit المشفر سيادياً عبر خوادم الـ HSM الفيدرالية المعتمدة.

---

`;
    if (prompt) {
      simulatedResponse += `
#### 💡 إجابة مخصصة لاستفسارك الفني ("${prompt}"):
تم إخضاع استعلامك للتدقيق الفني في محرك الأنماط السيبرانية التابع للمركز الوطني للأمن السيبراني. نوصي بتطبيق سياسة التحقق التكيفي المستمر (Conditional Access) مع قصر صلاحيات المسؤولين على النطاقات الجغرافية السودانية الآمنة فقط، مع تفعيل ميزة التوقيع الرقمي المعتمد HSM لجميع المدراء لضمان عدم تزييف الموافقات الوزارية الرسمية.`;
    }

    return res.json({
      text: `💡 (ملاحظة: يعمل مستشار الدفاع السيبراني الذكي بنظام محاكاة الذكاء الاصطناعي السيادي لعدم توفر مفتاح GEMINI_API_KEY)\n\n${simulatedResponse}`
    });
  }

  try {
    const systemInstruction = `
      You are the world's leading Government Cybersecurity Architect, SOC Director, Digital Trust Consultant, and AI Cyber Defense Advisor for the Sudan National Cybersecurity Center (NCSC) and the Digital Ministry of Commerce & Industry.
      Your role is to analyze Ministry SIEM logs, security events, active incidents, open vulnerabilities, PKI certificate cycles, conditional access policies, and threat intelligence feeds. 
      Your task is to detect abnormal patterns, predict future attacks, prioritize high-value vulnerabilities, identify potential insider threats or fraud, and recommend automated containment playbooks.
      
      Respond in Arabic with an authoritative, technical, and highly strategic national security and administrative tone. Format your response beautifully using rich Markdown. Include references to specific Sudanese institutions, regional challenges (Port Sudan shipping, Red Sea security, Khartoum saba complex), and National Vision 2035 rules.
      
      Scenario Selected: ${scenario || "General Security Overview"}
      Security Database Context: ${JSON.stringify({
        events: db.secEvents.slice(0, 10),
        incidents: db.secIncidents.slice(0, 5),
        vulnerabilities: db.secVulnerabilities,
        intel: db.secThreatIntel.slice(0, 10),
        kpis: db.secKpis,
        policies: db.secPolicies
      })}
    `;

    const userMessage = prompt 
      ? `الرجاء إجراء التحليل الأمني الاستباقي وصياغة تقرير الدفاع السيبراني حول: ${prompt}` 
      : `الرجاء تشغيل التحليل الشامل لبيانات الـ SIEM وإصدار التقرير القومي الاستخباراتي لمركز العمليات SOC.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن مستشار الدفاع السيبراني الذكي من صياغة التقرير الاستخباراتي."
    });

  } catch (err: any) {
    console.error("AI Cyber Defense Advisor Error:", err);
    res.status(500).json({
      error: "فشل مستشار الدفاع السيبراني الذكي في الاتصال بـ Gemini",
      details: err.message
    });
  }
});

// ==========================================
// PHASE SEVEN: NATIONAL DIGITAL ECONOMY & SMART COMMERCE PLATFORM ENDPOINTS
// ==========================================

// --- MODULE 1: NATIONAL E-COMMERCE REGISTRY ---
app.get("/api/commerce/businesses", (req, res) => {
  const db = getDB();
  res.json(db.comBusinesses || []);
});

app.post("/api/commerce/businesses", (req, res) => {
  const db = getDB();
  const { storeNameAr, storeNameEn, businessType, ownerName, email, phone, sector, addressState, addressCity, annualRevenue, crLink, licenseLink } = req.body;

  // Validation Rules
  if (!storeNameAr || !storeNameEn || !ownerName || !email || !phone) {
    return res.status(400).json({ error: "Missing required business registration fields" });
  }

  const id = `db-${Date.now()}`;
  const digitalId = `SD-BIZ-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const newBusiness = {
    id,
    digitalId,
    storeNameAr,
    storeNameEn,
    businessType,
    ownerName,
    email,
    phone,
    sector: sector || "general_commerce",
    addressState: addressState || "الخرطوم",
    addressCity: addressCity || "الخرطوم",
    registeredAt: new Date().toISOString(),
    annualRevenue: Number(annualRevenue) || 0,
    paymentPlatformLinked: false,
    logisticsLinked: false,
    crLink: crLink || null,
    licenseLink: licenseLink || null,
    status: "pending",
    trustScore: 75,
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        actionAr: "تقديم طلب التسجيل في منصة السجل الوطني للتجارة الإلكترونية",
        actionEn: "E-Commerce Business Registration application submitted",
        actor: ownerName,
        role: "merchant",
        timestamp: new Date().toISOString(),
        ip: req.ip || "127.0.0.1"
      }
    ]
  };

  db.comBusinesses.unshift(newBusiness);

  // Workflow integration: Generate an automated notification
  const notificationId = `ntf-${Date.now()}`;
  db.comNotifications.unshift({
    id: notificationId,
    titleAr: "استلام طلب تسجيل الكيان الرقمي",
    titleEn: "Digital Merchant Application Received",
    recipient: phone,
    channel: "all",
    status: "delivered",
    timestamp: new Date().toISOString(),
    messageAr: `عزيزي المالك، تم استلام طلب تسجيل متجرك "${storeNameAr}" بنجاح تحت المعرف الوطني ${digitalId}. جاري التدقيق.`,
    messageEn: `Dear Owner, your application for "${storeNameEn}" has been received with ID ${digitalId}. Review pending.`
  });

  // Update observatory metrics (Increment SME or startup registrations)
  const jobMetric = db.observatoryMetrics.find(m => m.id === "met-5");
  if (jobMetric) {
    jobMetric.value += 12; // Simulate employment expansion estimate
  }

  saveDB(db);
  res.status(201).json({ success: true, business: newBusiness });
});

// Update Business Vetting & Compliance Status
app.post("/api/commerce/businesses/:id/status", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, actionAr, actionEn, actor, role } = req.body;

  const biz = db.comBusinesses.find(b => b.id === id);
  if (!biz) {
    return res.status(404).json({ error: "Digital business not found" });
  }

  biz.status = status;
  
  // Update Trust Score based on vetting status
  if (status === "active") biz.trustScore = Math.min(biz.trustScore + 10, 100);
  if (status === "verified") biz.trustScore = Math.min(biz.trustScore + 15, 100);
  if (status === "suspended") biz.trustScore = 30;

  const newLog = {
    id: `log-${Date.now()}`,
    actionAr: actionAr || `تحديث حالة النشاط إلى: ${status}`,
    actionEn: actionEn || `Activity status updated to: ${status}`,
    actor: actor || "مفتش الوزارة الفيدرالي",
    role: role || "government_officer",
    timestamp: new Date().toISOString(),
    ip: req.ip || "127.0.0.1"
  };

  biz.auditLogs.unshift(newLog);

  // Auto-generate notification on status change
  db.comNotifications.unshift({
    id: `ntf-${Date.now()}`,
    titleAr: `تحديث حالة الكيان الرقمي الموحد`,
    titleEn: `Sovereign Digital Store Status Change`,
    recipient: biz.phone,
    channel: "all",
    status: "delivered",
    timestamp: new Date().toISOString(),
    messageAr: `تم تحديث حالة متجركم "${biz.storeNameAr}" إلى: ${status}. الإجراء: ${actionAr}`,
    messageEn: `Your store "${biz.storeNameEn}" status has been updated to: ${status}. Action: ${actionEn}`
  });

  // If approved/activated, auto-generate a Digital Business License
  if (status === "verified" || status === "active") {
    const hasLicense = db.comLicenses.some(l => l.businessId === biz.id);
    if (!hasLicense) {
      const licenseNumber = `SD-ELIC-${Math.floor(100000 + Math.random() * 900000)}`;
      db.comLicenses.unshift({
        id: `lic-${Date.now()}`,
        licenseNumber,
        type: biz.businessType === "marketplace" ? "platform_operator_license" : "online_store_license",
        businessId: biz.id,
        storeName: biz.storeNameEn,
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active"
      });
      biz.licenseLink = licenseNumber;
    }
  }

  saveDB(db);
  res.json({ success: true, business: biz });
});

// --- MODULE 2: DIGITAL BUSINESS LICENSES LIFECYCLE ---
app.get("/api/commerce/licenses", (req, res) => {
  const db = getDB();
  res.json(db.comLicenses || []);
});

// License Renewal
app.post("/api/commerce/licenses/:id/renew", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { actor } = req.body;

  const license = db.comLicenses.find(l => l.id === id);
  if (!license) {
    return res.status(404).json({ error: "Digital license not found" });
  }

  license.status = "active";
  const currentExpiry = new Date(license.expiryDate).getTime();
  const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
  license.expiryDate = new Date(baseTime + 365 * 24 * 60 * 60 * 1000).toISOString();

  // Find linked business and write log
  const biz = db.comBusinesses.find(b => b.id === license.businessId);
  if (biz) {
    biz.status = "active";
    biz.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionAr: "تم تجديد رخصة التجارة الإلكترونية الرقمية لعام إضافي",
      actionEn: "Digital business license renewed for an additional year",
      actor: actor || biz.ownerName,
      role: "merchant",
      timestamp: new Date().toISOString(),
      ip: req.ip || "127.0.0.1"
    });

    // Notify
    db.comNotifications.unshift({
      id: `ntf-${Date.now()}`,
      titleAr: "تجديد الرخصة الرقمية الموحدة",
      titleEn: "Unified Digital Permit Renewed",
      recipient: biz.phone,
      channel: "all",
      status: "delivered",
      timestamp: new Date().toISOString(),
      messageAr: `تم تجديد رخصتكم رقم ${license.licenseNumber} لمتجر "${biz.storeNameAr}" بنجاح حتى تاريخ ${new Date(license.expiryDate).toLocaleDateString()}.`,
      messageEn: `Your permit ${license.licenseNumber} for "${biz.storeNameEn}" has been successfully extended until ${new Date(license.expiryDate).toLocaleDateString()}.`
    });
  }

  saveDB(db);
  res.json({ success: true, license });
});

// License Amendment (Update store meta)
app.post("/api/commerce/licenses/:id/amend", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { storeNameAr, storeNameEn, email, phone, sector } = req.body;

  const license = db.comLicenses.find(l => l.id === id);
  if (!license) {
    return res.status(404).json({ error: "Digital license not found" });
  }

  const biz = db.comBusinesses.find(b => b.id === license.businessId);
  if (biz) {
    if (storeNameAr) biz.storeNameAr = storeNameAr;
    if (storeNameEn) biz.storeNameEn = storeNameEn;
    if (email) biz.email = email;
    if (phone) biz.phone = phone;
    if (sector) biz.sector = sector;

    license.storeName = biz.storeNameEn;

    biz.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionAr: "إجراء تعديل وتصحيح في وثائق الرخصة الرقمية الموحدة",
      actionEn: "Amendment executed in Unified Digital License document",
      actor: biz.ownerName,
      role: "merchant",
      timestamp: new Date().toISOString(),
      ip: req.ip || "127.0.0.1"
    });

    db.comNotifications.unshift({
      id: `ntf-${Date.now()}`,
      titleAr: "تعديل بيانات الرخصة بنجاح",
      titleEn: "Sovereign License Amendment Finalized",
      recipient: biz.phone,
      channel: "push",
      status: "delivered",
      timestamp: new Date().toISOString(),
      messageAr: `تم اعتماد التعديل القانوني لبيانات رخصتكم رقم ${license.licenseNumber} بنجاح.`,
      messageEn: `Your license amendment for ${license.licenseNumber} has been officially approved.`
    });
  }

  saveDB(db);
  res.json({ success: true, license });
});

// License Upgrades, Transfers and Cancellations
app.post("/api/commerce/licenses/:id/lifecycle", (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { actionType, paramValue, actor } = req.body; // actionType: 'upgrade' | 'transfer' | 'cancel'

  const license = db.comLicenses.find(l => l.id === id);
  if (!license) {
    return res.status(404).json({ error: "Digital license not found" });
  }

  const biz = db.comBusinesses.find(b => b.id === license.businessId);
  if (!biz) {
    return res.status(404).json({ error: "Linked business not found" });
  }

  if (actionType === "upgrade") {
    license.type = paramValue || "platform_operator_license";
    biz.businessType = "marketplace";
    biz.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionAr: `ترقية رخصة الأعمال الرقمية إلى: ${paramValue}`,
      actionEn: `Upgraded digital business license to: ${paramValue}`,
      actor: actor || biz.ownerName,
      role: "merchant",
      timestamp: new Date().toISOString(),
      ip: req.ip || "127.0.0.1"
    });
  } else if (actionType === "transfer") {
    const previousOwner = biz.ownerName;
    biz.ownerName = paramValue;
    biz.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionAr: `نقل ملكية الكيان التجاري الرقمي بالكامل إلى: ${paramValue}`,
      actionEn: `Transferred digital store ownership fully to: ${paramValue}`,
      actor: actor || previousOwner,
      role: "merchant",
      timestamp: new Date().toISOString(),
      ip: req.ip || "127.0.0.1"
    });
  } else if (actionType === "cancel") {
    license.status = "archived";
    biz.status = "archived";
    biz.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionAr: "إلغاء وأرشفة رخصة التجارة الإلكترونية بطلب من التاجر",
      actionEn: "Unified digital trade license cancelled and archived upon request",
      actor: actor || biz.ownerName,
      role: "merchant",
      timestamp: new Date().toISOString(),
      ip: req.ip || "127.0.0.1"
    });
  }

  saveDB(db);
  res.json({ success: true, license, business: biz });
});

// --- MODULE 3: OPEN DATA PLATFORM ---
app.get("/api/commerce/opendata", (req, res) => {
  const db = getDB();
  res.json(db.openDatasets || []);
});

app.post("/api/commerce/opendata/:id/download", (req, res) => {
  const db = getDB();
  const { id } = req.params;

  const dataset = db.openDatasets.find(d => d.id === id);
  if (!dataset) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  dataset.downloadCount += 1;
  saveDB(db);
  res.json({ success: true, dataset });
});

// --- MODULE 6: DIGITAL ECONOMY OBSERVATORY ---
app.get("/api/commerce/observatory", (req, res) => {
  const db = getDB();
  res.json(db.observatoryMetrics || []);
});

// --- MODULE 7: SMART NOTIFICATION CENTER ---
app.get("/api/commerce/notifications", (req, res) => {
  const db = getDB();
  res.json(db.comNotifications || []);
});

app.post("/api/commerce/notifications", (req, res) => {
  const db = getDB();
  const { titleAr, titleEn, recipient, channel, messageAr, messageEn, scheduledFor } = req.body;

  if (!titleAr || !titleEn || !recipient || !messageAr || !messageEn) {
    return res.status(400).json({ error: "Missing required notification properties" });
  }

  const newNotification = {
    id: `ntf-${Date.now()}`,
    titleAr,
    titleEn,
    recipient,
    channel: channel || "all",
    status: scheduledFor ? "scheduled" : "delivered",
    timestamp: new Date().toISOString(),
    messageAr,
    messageEn,
    scheduledFor: scheduledFor || null
  };

  db.comNotifications.unshift(newNotification);
  saveDB(db);
  res.status(201).json({ success: true, notification: newNotification });
});

// --- MODULE 8: NATIONAL API GATEWAY ---
app.get("/api/commerce/apigateway/keys", (req, res) => {
  const db = getDB();
  res.json(db.apiGatewayLogs || []);
});

app.post("/api/commerce/apigateway/keys", (req, res) => {
  const db = getDB();
  const { clientName, scopes } = req.body;

  if (!clientName) {
    return res.status(400).json({ error: "Client Name is required" });
  }

  const newKey = {
    id: `akey-${Date.now()}`,
    clientId: `sd-client-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName,
    apiKey: `sd_api_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    scopes: scopes || ["read:opendata"],
    status: "active",
    requestCount: 0,
    errorRate: 0.0,
    avgLatency: 20
  };

  db.apiGatewayLogs.unshift(newKey);
  saveDB(db);
  res.status(201).json({ success: true, credential: newKey });
});

app.delete("/api/commerce/apigateway/keys/:id", (req, res) => {
  const db = getDB();
  const { id } = req.params;

  db.apiGatewayLogs = db.apiGatewayLogs.filter(k => k.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// --- MODULE 5: NATIONAL AI SERVICES (ADVISOR & FORECASTING) ---
app.post("/api/commerce/ai-advisor", async (req, res) => {
  try {
    const { message, contextType, businessesCount } = req.body;

    let ai: GoogleGenAI | null = null;
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    if (!ai) {
      // Return beautiful bilingual intelligent summaries based on context type
      let responseText = "";
      if (contextType === "forecasting") {
        responseText = `
📊 **التحليل التنبئي واستشراف المؤشرات الاقتصادية لعام ٢٠٢٧** (رؤية السودان ٢٠٣٥):
بناءً على النمذجة الرياضية والبيانات التشغيلية لسجلات وزارة التجارة الفيدرالية والمشروعات الناشئة:
- **معدل نمو التجارة الرقمية:** من المتوقع تسارعه من ١٨.٢٪ الحالية ليصل إلى **٢٤.٥٪ لعام ٢٠٢٧** مدفوعاً بتبني بوابات الدفع الفيدرالية الموحدة في الولايات الزراعية.
- **تبني المدفوعات القومية:** نتوقع ملامسة **٨٩٪ بحلول نهاية عام ٢٠٢٧** مقارنة بـ ٧٨.٤٪ حالياً نتيجة إدماج المحافظ الرقمية وإلغاء الرسوم البينية للمشاريع الريفية.
- **تأثير النفاذ الإقليمي لـ الكوميسا:** سيساهم تصفير التعريفة الجمركية وتوطين شهادات المنشأ الرقمية في نمو صادرات الصمغ والكركديه بنسبة **٣٢٪ كقيمة إجمالية للمدفوعات**.
- **رصد المخاطر الكلية:** يوصي النموذج برصد مستويات السيولة التنافسية ورفع مهارات موظفي سلاسل الإمداد بنسب متوازنة لمنع حدوث تضخم في أسعار الشحن اللوجستي الداخلي.
        `;
      } else if (contextType === "recommendation") {
        responseText = `
💡 **محرك التوصيات السيادي الذكي لأصحاب المشاريع الصغيرة (SME & Startups):**
استناداً إلى معطيات السوق ونشاط تجارتكم والمؤشرات الكلية:
- **توصية التمويل والمنح:** نقترح التقديم الفوري على "برنامج منحة التحول الرقمي للمشاريع الريفية" (المنحة الحكومية المتاحة لتمويل المتاجر برأس مال ٥,٠٠٠,٠٠٠ جنيه).
- **توصية التصدير اللوجستي:** متجركم يبدي جدارة عالية في قطاع التصدير الزراعي. نوصي بتفعيل "الربط اللوجستي مع بورتسودان" لتلقي عروض أسعار شحن تفضيلية من النواقل القومية المسجلة.
- **الامتثال الفيدرالي:** للحفاظ على تصنيفكم الائتماني والائتمان التجاري (>٩٠)، يرجى إتمام ربط رخصتكم بالسجل التجاري الموحد والتحقق من الهوية الرقمية للتاجر عبر نافذة المفتش الفيدرالي.
        `;
      } else if (contextType === "compliance") {
        responseText = `
🛡️ **تقرير تدقيق الامتثال التلقائي والذكاء الاصطناعي الرقابي:**
- **حالة الامتثال العام:** مستوفاة بنسبة **٩٢٪**.
- **نقاط التدقيق المكتملة:** الهوية الرقمية مربوطة بالرقم الوطني الموحد، السجل التجاري مُفعّل ومطابق، توفير بوابات دفع سيادية معتمدة.
- **التوصيات التصحيحية:** يرجى إرفاق شهادة مطابقة المواصفات SSMO لضمان سلامة الكيان في عمليات التصدير الإقليمية، وتجنب أي مخالفات للغش التجاري أو الرقابة السعرية.
        `;
      } else {
        responseText = `
أهلاً بك في منصة مستشار الذكاء الاصطناعي لوزارة التجارة والصناعة السودانية 2035. أنا جاهز لمساعدتكم في فحص شروط الترخيص، الاستشارات القانونية، والتنبؤ بمعدلات نمو تجارتكم ومطابقتها للمعايير والسياسات الفيدرالية. كيف يمكنني إرشادك اليوم؟
        `;
      }

      return res.json({
        text: `💡 (ملاحظة: يعمل المساعد حالياً بنظام محاكاة الذكاء الاصطناعي لعدم توفر مفتاح GEMINI_API_KEY في الإعدادات)\n\n${responseText}`
      });
    }

    const systemInstruction = `
      You are the world's leading Sovereign Digital Economy AI Consultant and Government Advisor for the Sudan Digital Ministry of Commerce & Industry under Sudan Vision 2035.
      Your task is to analyze commercial trends, detect business risks, predict economic indicators, recommend digital services, and assist entrepreneurs with high professional accuracy.
      Provide detailed, professional, bilingual (Arabic & English) insights or reports based on the user's request.
    `;

    const userMessage = `
      Request Type: ${contextType || "general"}
      User Query: ${message}
      Context: We currently have ${businessesCount || 5} registered digital commerce businesses.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن مستشار الذكاء الاصطناعي التجاري من تقديم الرد."
    });

  } catch (err: any) {
    console.error("Commerce AI Advisor Error:", err);
    res.status(500).json({
      error: "فشل مستشار الذكاء الاصطناعي التجاري في الاتصال بـ Gemini",
      details: err.message
    });
  }
});

// ============================================================================
// --- NATIONAL INTELLIGENT DIGITAL GOVERNMENT PLATFORM ENDPOINTS ---
// ============================================================================

// Searchable Entities for Unified Search
const SYSTEM_SEARCH_ENTITIES = [
  { type: "company", id: "c-1", nameAr: "شركة النيل للمنتجات الغذائية المحدودة", nameEn: "Nile Food Products Co. Ltd", number: "SD-2026-94829", stateAr: "الخرطوم", activityAr: "صناعات تحويلية غذائية" },
  { type: "company", id: "c-2", nameAr: "المؤسسة الوطنية لتطوير الصمغ العربي", nameEn: "National Gum Arabic Development Corp", number: "SD-2026-10293", stateAr: "البحر الأحمر", activityAr: "تصدير المحاصيل الصناعية" },
  { type: "factory", id: "f-1", nameAr: "مصنع الخرطوم لتدوير النسيج الحديث", nameEn: "Khartoum Modern Textile Recycling Factory", number: "FAC-SD-8820", stateAr: "الخرطوم", activityAr: "تدوير الغزل والنسيج" },
  { type: "license", id: "l-1", nameAr: "رخصة تصدير صمغ عربي خام", nameEn: "Raw Gum Arabic Export License", number: "LIC-EXP-9023", stateAr: "البحر الأحمر", activityAr: "تصدير الصمغ العربي" },
  { type: "complaint", id: "comp-1", nameAr: "مخالفة تسعير الدقيق الوطني - سوبرماركت البركة", nameEn: "National Flour Price Gouging - Al-Baraka", number: "COMP-2026-102", stateAr: "الخرطوم", activityAr: "رقابة الأسواق" }
];

// 1. AI Copilot (Module 1 & 2 & 9)
app.post("/api/intelligent-gov/copilot", async (req, res) => {
  try {
    const { message, activeTab, role, language } = req.body;

    let ai: GoogleGenAI | null = null;
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    if (!ai) {
      // High-quality Bilingual Fallbacks
      let responseText = "";
      let sources: string[] = [];

      if (activeTab === "knowledge") {
        responseText = language === "ar"
          ? `🔍 **المسترجع المعرفي الذكي (RAG):**\n\nبناءً على الفهرسة الفيكتورية لقوانين السجل التجاري وحماية المستهلك السودانية:\n\n- **المادة ٥ (ترخيص الشركات):** يستلزم تأسيس الكيان الصناعي ربطاً مسبقاً بنظام الهوية الرقمية للتاجر ومطابقة المعايير الفيدرالية للبيئة.\n- **المخالفات:** تقع غرامة بقيمة تصل إلى ٥,٠٠٠,٠٠٠ جنيه سوداني في حال عدم الإفصاح عن الشركاء الملاك أو استخدام رخص تجارية منتهية الصلاحية.\n- **رؤية ٢٠٣٥:** جميع المستندات تدعم التوقيع الرقمي السيادي المشفر بالكامل.`
          : `🔍 **Smart Knowledge Retrieval (RAG):**\n\nBased on your query inside the Sudan Commercial & Consumer Protection database:\n\n- **Section 5 (Company Licensing):** Creating a food or commercial entity requires prior integration with the Sovereign Identity Gateway.\n- **Penalties:** Fines up to 5,000,000 SDG apply for non-disclosure of registry partners or operating with expired trade permits.\n- **Vision 2035:** All regulatory documents are fully mapped with cryptographic timestamps.`;
        sources = ["قانون السجل التجاري لعام 1925", "قانون الرقابة وحماية المستهلك 2026"];
      } else if (activeTab === "ai-assistant") {
        responseText = language === "ar"
          ? `💡 **مستشارك الرقمي السيادي (Copilot):**\n\nأهلاً بك بصفتك **${role || "مستثمر"}**.\n\nيسعدني توجيهك في الخطوات التنفيذية للتجارة والتأسيس الرقمي الموحد:\n١. قم بتسجيل شركتك والحصول على الرقم التجاري الموحد.\n٢. تقدم بطلب رخصة التصدير اللوجستي المربوط ببوابة الكوميسا.\n٣. قم بتأكيد التزامك بمتطلبات حوكمة البيانات والضرائب الوطنية لتجنب أي تعارض في السجلات.`
          : `💡 **Your Sovereign Digital Copilot:**\n\nHello, acting as a certified **${role || "Investor"}**.\n\nI am here to guide you through the process of unified commercial setups:\n1. Register your company to receive a Unified Commercial Number.\n2. Apply for export licenses connected to the COMESA customs network.\n3. Verify your master data profile to ensure full tax and compliance integration.`;
        sources = ["دليل خدمات التاجر الموحد v2.1"];
      } else {
        responseText = language === "ar"
          ? `🛡️ **مستشار القرار ومكافحة التزوير:**\n\nتم مراجعة طلب الاستعلام دلالياً. النظام يوصي بالتحقق الفيدرالي الشامل من مستندات الطرف الآخر عبر بوابة التدقيق، والتأكد من ملاءمة الميزانية للمؤشرات الاقتصادية المقدرة لعام ٢٠٢٧ لولاية البحر الأحمر والخرطوم.`
          : `🛡️ **Sovereign Policy Advisor:**\n\nYour inquiry has been checked against state protocols. The system suggests carrying out a federated document verification through the GRC console and aligning operational plans with the 2027 macroeconomic trends.`;
        sources = ["معايير الحوكمة والتحقق القومي"];
      }

      return res.json({ text: responseText, sources });
    }

    const systemInstruction = `
      You are the ultimate Sovereign Government Enterprise AI Consultant for the Sudan Digital Ministry of Commerce & Industry.
      You operate on strict regulatory codes, including Sudan Commercial Registry laws, Investment acts, and consumer protection regulations.
      Your answers must be highly professional, legally accurate, bilingual (Arabic & English), and helpful for developers, government staff, and foreign/local investors under Sudan Vision 2035.
      Reference specific parts of the Sudan Commercial Registry Act of 1925 or Sudan Consumer Protection Act of 2026 when relevant.
    `;

    const userPrompt = `
      User Query: "${message}"
      Context: System module is "${activeTab}". User Role is "${role || "guest"}". Requested Language is "${language || "ar"}".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    res.json({
      text: response.text || "عذراً، لم يتمكن النظام الذكي من توليد الرد المطلوب.",
      sources: ["قاعدة بيانات RAG السيادية الفيدرالية المحدثة لعام 2026"]
    });

  } catch (err: any) {
    console.error("Intelligent Gov Copilot Error:", err);
    res.status(500).json({ error: "Failed to communicate with AI Copilot", details: err.message });
  }
});

// 2. Twin Simulator (Module 3)
app.post("/api/intelligent-gov/simulation", (req, res) => {
  const { scenario } = req.body;

  let simulation = {
    riskLevel: "low",
    latencyImpactMs: 15,
    recommendationAr: "",
    recommendationEn: ""
  };

  if (scenario === "season-peak") {
    simulation = {
      riskLevel: "medium",
      latencyImpactMs: 42,
      recommendationAr: "يوصى بزيادة عدد وحدات خوادم حاويات رخص الصادرات من ٤ إلى ١٢ مع تفعيل الذاكرة المؤقتة الذكية لمستندات شهادات المنشأ.",
      recommendationEn: "Recommend scaling API container replicas for export licensing from 4 to 12 and enabling intelligent Redis caching on COMESA origin files."
    };
  } else if (scenario === "api-outage") {
    simulation = {
      riskLevel: "critical",
      latencyImpactMs: 250,
      recommendationAr: "تفعيل وضع العمل الاحتياطي غير المتصل (Offline Buffer) وحفظ المعاملات مؤقتاً في طوابير الحفظ المحلي الموثق بالبلوكشين لحين استعادة الاتصال.",
      recommendationEn: "Activate fallback Offline Buffering and queue pending state signatures on the decentralized ledger nodes until customs gateway is restored."
    };
  } else if (scenario === "cyber-attack") {
    simulation = {
      riskLevel: "high",
      latencyImpactMs: 120,
      recommendationAr: "تفعيل محدد معدلات الطلبات الفيدرالي (Rate Limiting) وتمرير حركة المرور فوراً عبر جدار الحماية السيادي القائم على التعرف على السلوك الشاذ (WAF).",
      recommendationEn: "Activate rate-limiting on unified gateways and route traffic immediately through the Sovereign Web Application Firewall (WAF) using anomaly profiling."
    };
  }

  res.json({ success: true, simulation });
});

// 3. Unified Federated Search (Module 5)
app.post("/api/intelligent-gov/unified-search", (req, res) => {
  const { query, facet } = req.body;
  if (!query) {
    return res.json({ results: [] });
  }

  const q = query.toLowerCase();
  let results = SYSTEM_SEARCH_ENTITIES.filter(e => {
    const matchText = (e.nameAr + " " + e.nameEn + " " + e.number + " " + e.stateAr + " " + e.activityAr).toLowerCase();
    const matchesQuery = matchText.includes(q);
    const matchesFacet = facet === "all" || e.type === facet;
    return matchesQuery && matchesFacet;
  });

  res.json({ results });
});

// 4. Document Intelligence (Module 6)
app.post("/api/intelligent-gov/document-intelligence", (req, res) => {
  const { documentType } = req.body;

  let ocrText = "";
  let extractedEntities = {};
  let fraudAudit = { status: "verified", confidence: 99 };

  if (documentType === "preset-cr") {
    ocrText = `جمهورية السودان - وزارة التجارة والصناعة الفيدرالية\nشهادة قيد السجل التجاري الوطني رقم: SD-2026-94829\nاسم الشركة: شركة النيل للمنتجات الغذائية المحدودة\nرأس المال المسجل: 25,000,000 جنيه سوداني\nالموقع: الخرطوم بحري المنطقة الصناعية\nالشركاء: عمر يوسف الفكي، صالح محمد أحمد`;
    extractedEntities = {
      "Document Type": "Commercial Registry",
      "Registration Number": "SD-2026-94829",
      "Company Name": "Nile Food Products Co. Ltd",
      "Registered Capital": "25,000,000 SDG",
      "Audit Authority": "Federal Registry Dept"
    };
    fraudAudit = { status: "fully_authentic", confidence: 99.4 };
  } else if (documentType === "preset-coo") {
    ocrText = `COMESA CERTIFICATE OF ORIGIN - SUDAN CUSTOMS\nOriginating Exporter: National Gum Arabic Development Corp\nConsignee: Al-Baraka Food Industries (Saudi Arabia)\nHS-Code: 1301.90.10\nDescription: 100% Pure Natural Gum Arabic\nWeight: 25,000 KG\nVerification ID: VER-CO-99120`;
    extractedEntities = {
      "Document Type": "COMESA Certificate of Origin",
      "Exporter": "National Gum Arabic Corp",
      "Importer": "Al-Baraka Food Industries",
      "HS Code": "1301.90.10",
      "Consigned Weight": "25,000 KG"
    };
    fraudAudit = { status: "fully_authentic", confidence: 98.7 };
  } else {
    ocrText = `جمهورية السودان - إدارة التراخيص الصناعية والإنتاج\nرخصة إنتاج صناعي فئة (أ) رقم: FAC-SD-8820\nالمنشأة: مصنع الخرطوم لتدوير النسيج الحديث\nالقطاع: الغزل والنسيج والملابس\nالطاقة الإنتاجية: 100,000 متر مربع شهرياً\nتاريخ الصدور: 2026-04-10`;
    extractedEntities = {
      "Document Type": "Industrial Production License",
      "License ID": "FAC-SD-8820",
      "Factory Name": "Khartoum Modern Textile Recycling Factory",
      "Sector Classification": "Textile & Fabrics",
      "Approved Capacity": "100,000 sqm/month"
    };
    fraudAudit = { status: "fully_authentic", confidence: 99.1 };
  }

  res.json({ ocrText, extractedEntities, fraudAudit });
});

// ============================================================================
// --- NATIONAL COMMERCE ECOSYSTEM PLATFORM ENDPOINTS (PHASE 11) ---
// ============================================================================

let ecoDirectories = [
  { id: "dir-1", nameAr: "شركة النيل الأزرق للمطاحن وصناعة الدقيق", nameEn: "Blue Nile Flour Mills Co.", type: "manufacturer", locationAr: "الخرطوم", verified: true, trust: 98, sectorAr: "صناعات غذائية" },
  { id: "dir-2", nameAr: "المؤسسة الوطنية لتطوير الصمغ العربي", nameEn: "National Gum Arabic Development Corp", type: "exporter", locationAr: "بورتسودان", verified: true, trust: 99, sectorAr: "تصدير المحاصيل الاستراتيجية" }
];

let ecoProducts = [
  { id: "p-1", nameAr: "صمغ عربي خام فئة ممتازة (هشاب)", nameEn: "Premium Raw Gum Arabic (Hashab)", company: "National Gum Arabic Corp", price: 3400, unit: "Metric Ton", stock: 120 },
  { id: "p-2", nameAr: "زيت سمسم أبيض نقي معصور على البارد", nameEn: "Pure Cold-Pressed White Sesame Oil", company: "Blue Nile Flour Mills Co.", price: 1850, unit: "Metric Ton", stock: 85 }
];

let ecoShipments = [
  { id: "shp-1", tracking: "SD-LOG-9082", cargoAr: "شحنة صمغ عربي خام", originAr: "الأبيض - كردفان", destinationAr: "ميناء بورتسودان الجنوبي", carrier: "Sudan Unified Cargo", status: "in-transit", risk: "low" }
];

let ecoTenders = [
  { id: "ten-1", number: "FED-TEN-2026-904", titleAr: "عطاء توريد وقود الديزل المخصص للمصانع والمنشآت الاقتصادية", authorityAr: "إدارة الإمداد الصناعي الفيدرالي", deadline: "2026-08-15", status: "open", bidsSubmitted: 14 }
];

let ecoSmes = [
  { id: "sme-1", name: "محاصيل كردفان للتصدير المحدودة", category: "Micro", employees: 8, location: "الأبيض", score: 94 }
];

app.get("/api/commerce-ecosystem/directories", (req, res) => {
  res.json({ success: true, directories: ecoDirectories });
});

app.get("/api/commerce-ecosystem/marketplace/products", (req, res) => {
  res.json({ success: true, products: ecoProducts });
});

app.post("/api/commerce-ecosystem/marketplace/products", express.json(), (req, res) => {
  const { nameAr, nameEn, company, price, unit, stock } = req.body;
  const newProduct = {
    id: `p-${Date.now()}`,
    nameAr: nameAr || "منتج تجاري جديد",
    nameEn: nameEn || "New Trade Product",
    company: company || "Unified Sudanese Partner",
    price: parseFloat(price) || 1000,
    unit: unit || "Metric Ton",
    stock: parseInt(stock) || 50
  };
  ecoProducts.push(newProduct);
  res.json({ success: true, product: newProduct });
});

app.get("/api/commerce-ecosystem/supply-chain/shipments", (req, res) => {
  res.json({ success: true, shipments: ecoShipments });
});

app.post("/api/commerce-ecosystem/supply-chain/shipments", express.json(), (req, res) => {
  const { tracking, cargoAr, cargoEn, originAr, destinationAr, carrier } = req.body;
  const newShipment = {
    id: `shp-${Date.now()}`,
    tracking: tracking || `SD-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    cargoAr: cargoAr || "شحنة تجارية وطنية",
    originAr: originAr || "الخرطوم",
    destinationAr: destinationAr || "بورتسودان",
    carrier: carrier || "Nile National Logistics",
    status: "pickup",
    risk: "low"
  };
  ecoShipments.push(newShipment);
  res.json({ success: true, shipment: newShipment });
});

app.get("/api/commerce-ecosystem/smes", (req, res) => {
  res.json({ success: true, smes: ecoSmes });
});

app.post("/api/commerce-ecosystem/smes", express.json(), (req, res) => {
  const { name, employees, location } = req.body;
  const newSme = {
    id: `sme-${Date.now()}`,
    name: name || "شركة ريادية صغيرة جديدة",
    category: parseInt(employees) < 10 ? "Micro" : "Small",
    employees: parseInt(employees) || 5,
    location: location || "الخرطوم",
    score: 85 + Math.floor(Math.random() * 15)
  };
  ecoSmes.push(newSme);
  res.json({ success: true, sme: newSme });
});

app.get("/api/commerce-ecosystem/tenders", (req, res) => {
  res.json({ success: true, tenders: ecoTenders });
});

app.post("/api/commerce-ecosystem/tenders/bid", express.json(), (req, res) => {
  const { tenderId, amount, proposal } = req.body;
  ecoTenders = ecoTenders.map(t => t.id === tenderId ? { ...t, bidsSubmitted: t.bidsSubmitted + 1 } : t);
  res.json({ success: true, message: "Bid submitted successfully", tenderId, amount });
});

app.post("/api/commerce-ecosystem/graphql", express.json(), (req, res) => {
  const { query } = req.body;
  console.log("Parsing Federal Commerce Ecosystem GraphQL Query:", query);
  
  if (query && query.includes("directories")) {
    return res.json({
      data: {
        directories: ecoDirectories
      }
    });
  }
  
  if (query && query.includes("products")) {
    return res.json({
      data: {
        products: ecoProducts
      }
    });
  }
  
  res.json({
    data: {
      sudanCommerceEcosystem: {
        status: "active",
        version: "11.0.0",
        nodeCount: 14812,
        networkSecurity: "Zero Trust Enabled",
        lastBackup: new Date().toISOString()
      }
    }
  });
});

// ============================================================================
// --- PHASE 12: NATIONAL ECONOMIC INTELLIGENCE & STRATEGIC PLANNING ---
// ============================================================================

let nationalIndicators = [
  { year: "2021", gdp: 28.5, inflation: 120.4, tradeBalance: -4.2, industrialProduction: 92.5 },
  { year: "2022", gdp: 30.1, inflation: 85.2, tradeBalance: -3.8, industrialProduction: 94.8 },
  { year: "2023", gdp: 32.4, inflation: 64.1, tradeBalance: -2.9, industrialProduction: 98.1 },
  { year: "2024", gdp: 35.8, inflation: 42.5, tradeBalance: -1.2, industrialProduction: 104.2 },
  { year: "2025", gdp: 40.2, inflation: 24.8, tradeBalance: 0.8, industrialProduction: 112.9 },
  { year: "2026", gdp: 45.5, inflation: 12.4, tradeBalance: 2.1, industrialProduction: 124.6 }
];

let strategicInitiatives = [
  { id: "init-1", titleAr: "التحول اللوجستي لمنطقة البحر الأحمر الحرة", titleEn: "Red Sea Free Zone Logistics Transformation", status: "on-track", progress: 78, category: "Infrastructure" },
  { id: "init-2", titleAr: "مجمع الصناعات التحويلية الزراعية بالقضارف", titleEn: "Al Qadarif Agro-Industrial Manufacturing Cluster", status: "on-track", progress: 85, category: "Agriculture" }
];

let stateGisMetadata = [
  { state: "Red Sea", activeProjects: 24, resources: ["Gum Arabic", "Gold", "Salt"] },
  { state: "Gezira", activeProjects: 18, resources: ["Cotton", "Wheat", "Livestock"] }
];

app.get("/api/economic-intelligence/indicators", (req, res) => {
  res.json({ success: true, indicators: nationalIndicators });
});

app.post("/api/economic-intelligence/indicators", express.json(), (req, res) => {
  const { year, gdp, inflation, tradeBalance, industrialProduction } = req.body;
  if (!year || isNaN(parseFloat(gdp))) {
    return res.status(400).json({ success: false, message: "Invalid parameters" });
  }
  const newIndicator = {
    year: String(year),
    gdp: parseFloat(gdp),
    inflation: parseFloat(inflation) || 10.0,
    tradeBalance: parseFloat(tradeBalance) || 0.0,
    industrialProduction: parseFloat(industrialProduction) || 100.0
  };
  nationalIndicators.push(newIndicator);
  res.json({ success: true, indicator: newIndicator });
});

app.get("/api/economic-intelligence/initiatives", (req, res) => {
  res.json({ success: true, initiatives: strategicInitiatives });
});

app.post("/api/economic-intelligence/initiatives", express.json(), (req, res) => {
  const { titleAr, titleEn, category } = req.body;
  if (!titleAr) {
    return res.status(400).json({ success: false, message: "Title required" });
  }
  const newInit = {
    id: `init-${Date.now()}`,
    titleAr,
    titleEn: titleEn || titleAr,
    status: "on-track",
    progress: 0,
    category: category || "General"
  };
  strategicInitiatives.push(newInit);
  res.json({ success: true, initiative: newInit });
});

app.post("/api/economic-intelligence/predict-failure", express.json(), (req, res) => {
  const { companyAge, employeeCount, leverage } = req.body;
  const age = parseFloat(companyAge) || 3;
  const emp = parseFloat(employeeCount) || 10;
  const lev = parseFloat(leverage) || 0.5;
  const failureChance = Math.min(100, Math.max(0, (lev * 80) - (age * 4) + (emp < 5 ? 15 : 0)));
  res.json({
    success: true,
    riskPercent: failureChance.toFixed(2),
    assessment: failureChance > 50 ? "High Risk of Solvency Strain" : "Stable & Growth Eligible"
  });
});

app.post("/api/economic-intelligence/graphql", express.json(), (req, res) => {
  const { query } = req.body;
  console.log("Parsing Phase 12 GraphQL Query:", query);
  
  if (query && query.includes("indicators")) {
    return res.json({
      data: {
        indicators: nationalIndicators
      }
    });
  }
  
  if (query && query.includes("initiatives")) {
    return res.json({
      data: {
        initiatives: strategicInitiatives
      }
    });
  }
  
  res.json({
    data: {
      sudanStrategicIntelligence: {
        status: "operational",
        version: "12.0.0",
        lastBackup: new Date().toISOString(),
        systemIntegrity: "Zero Trust Verified",
        modelsActive: [
          "GDP_PROJECTION_MODEL",
          "INSOLVENCY_RISK_PREDICTOR",
          "REGIONAL_RESOURCE_GIS_MODEL",
          "LEGISLATIVE_IMPACT_SIMULATOR"
        ]
      }
    }
  });
});

// ============================================================================
// --- PHASE 13: INTERNATIONAL TRADE & REGIONAL INTEGRATION ---
// ============================================================================

let tradeCerts = [
  { id: "co-2026-001", exporter: "Blue Nile Gum Corp", destination: "Germany", product: "Grade-1 Hashab Gum Arabic", quantity: "180 Metric Tons", workflowStep: "Issued", signature: "Ministry Trade Director E-Sign", qrCodeValue: "VERIFIED-SD-CO-001" },
  { id: "co-2026-002", exporter: "Sennar Agro Products", destination: "Saudi Arabia", product: "Premium Raw White Sesame", quantity: "450 Metric Tons", workflowStep: "Compliance Review", signature: "Pending", qrCodeValue: "PENDING-SD-CO-002" }
];

app.get("/api/trade-integration/certificates", (req, res) => {
  res.json({ success: true, certificates: tradeCerts });
});

app.post("/api/trade-integration/certificates", express.json(), (req, res) => {
  const { exporter, destination, product, quantity } = req.body;
  if (!exporter || !destination) {
    return res.status(400).json({ success: false, message: "Exporter and destination are required" });
  }
  const newCert = {
    id: `co-2026-${Math.floor(100 + Math.random() * 900)}`,
    exporter,
    destination,
    product: product || "Agricultural Produce",
    quantity: quantity || "100 Tons",
    workflowStep: "Application",
    signature: "None (Awaiting Signature)",
    qrCodeValue: `PENDING-SD-CO-${Math.floor(1000 + Math.random() * 9000)}`
  };
  tradeCerts.push(newCert);
  res.json({ success: true, certificate: newCert });
});

app.post("/api/trade-integration/verify-co", express.json(), (req, res) => {
  const { qrCodeValue } = req.body;
  const match = tradeCerts.find(c => c.qrCodeValue === qrCodeValue);
  if (match) {
    res.json({ success: true, verified: true, match });
  } else {
    res.json({ success: true, verified: false, message: "No certified record matches the requested QR identifier" });
  }
});

// ============================================================================
// --- PHASE 14: NATIONAL INDUSTRIAL DEVELOPMENT & INNOVATION PLATFORM ---
// ============================================================================

let industrialClusters = [
  { id: "cls-1", nameAr: "مجمع الصناعات التحويلية الغذائية بجياد", nameEn: "Giad Agro-Industrial Processing Cluster", locationAr: "ولاية الخرطوم", factoriesCount: 14, growthRate: 12.5, capacityPct: 88, complianceScore: 94 },
  { id: "cls-2", nameAr: "المدينة الصناعية المتكاملة للجلود بكسلا", nameEn: "Kassala Integrated Leather Industrial City", locationAr: "ولاية كسلا", factoriesCount: 8, growthRate: 8.2, capacityPct: 75, complianceScore: 89 },
  { id: "cls-3", nameAr: "حاضنة الصناعات النسيجية بالجزيرة", nameEn: "Gezira Textile & Spinning Hub", locationAr: "ولاية الجزيرة", factoriesCount: 11, growthRate: 15.4, capacityPct: 91, complianceScore: 92 },
  { id: "cls-4", nameAr: "مجمع معالجة الصمغ العربي المتطور بسوبا", nameEn: "Soba Advanced Gum Arabic Downstream Hub", locationAr: "الخرطوم سوبا", factoriesCount: 6, growthRate: 22.1, capacityPct: 94, complianceScore: 98 }
];

app.get("/api/industrial-development/clusters", (req, res) => {
  res.json({ success: true, clusters: industrialClusters });
});

app.post("/api/industrial-development/clusters", express.json(), (req, res) => {
  const { nameAr, nameEn, locationAr } = req.body;
  if (!nameAr) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }
  const newCluster = {
    id: `cls-${Date.now()}`,
    nameAr,
    nameEn: nameEn || nameAr,
    locationAr: locationAr || "الخرطوم",
    factoriesCount: 1,
    growthRate: 10.0,
    capacityPct: 80,
    complianceScore: 85
  };
  industrialClusters.push(newCluster);
  res.json({ success: true, cluster: newCluster });
});

// ============================================================================
// --- PHASE 16: NATIONAL LEGISLATIVE GOVERNANCE & REGULATORY POLICY ---
// ============================================================================

let commercialLaws = [
  { id: "law-1", code: "LAW-2026-04", titleAr: "قانون تشجيع الاستثمار الصناعي وحماية الإنتاج الوطني", titleEn: "Industrial Investment Incentive & Domestic Production Protection Act", categoryAr: "قوانين الاستثمار", statusAr: "ساري", statusEn: "Active", date: "2026-03-12" },
  { id: "law-2", code: "REG-2026-11", titleAr: "اللائحة التنفيذية لرقابة الأسواق ومكافحة الاحتكار", titleEn: "Executive Regulations for Market Surveillance & Anti-Monopoly", categoryAr: "لوائح أسواق", statusAr: "ساري", statusEn: "Active", date: "2026-05-18" },
  { id: "law-3", code: "DEC-2026-88", titleAr: "القرار الوزاري بشأن التفتيش الرقمي الموحد على المصانع", titleEn: "Ministerial Decision on Unified Digital Factory Inspections", categoryAr: "قرارات وزارية", statusAr: "ساري", statusEn: "Active", date: "2026-06-01" },
  { id: "law-4", code: "CIR-2026-09", titleAr: "المنشور الدوري لتسهيل الإجراءات الجمركية لمدخلات الإنتاج الزراعي", titleEn: "Circular on Streamlining Customs Procedures for Agro-inputs", categoryAr: "منشورات دورية", statusAr: "ساري", statusEn: "Active", date: "2026-07-10" }
];

app.get("/api/legislative-governance/laws", (req, res) => {
  res.json({ success: true, laws: commercialLaws });
});

app.post("/api/legislative-governance/laws", express.json(), (req, res) => {
  const { code, titleAr, titleEn, categoryAr } = req.body;
  if (!code || !titleAr) {
    return res.status(400).json({ success: false, message: "Code and titleAr are required" });
  }
  const newLaw = {
    id: `law-${Date.now()}`,
    code,
    titleAr,
    titleEn: titleEn || `Sovereign Policy - ${titleAr}`,
    categoryAr: categoryAr || "قوانين الاستثمار",
    statusAr: "ساري",
    statusEn: "Active",
    date: new Date().toISOString().split("T")[0]
  };
  commercialLaws.push(newLaw);
  res.json({ success: true, law: newLaw });
});

// ============================================================================
// --- PHASE 17: NATIONAL COMMERCIAL DATA GOVERNANCE & OPEN DATA ---
// ============================================================================

let masterDataRecords = [
  { id: "rec-1", type: "business", code: "SD-BUS-94829", nameAr: "شركة النيل للمنتجات الغذائية المحدودة", nameEn: "Nile Food Products Co. Ltd", classification: "ISIC-1071 (Manufacture of bakery products)", status: "Active", lastSync: "2026-07-19" },
  { id: "rec-2", type: "business", code: "SD-BUS-10293", nameAr: "المؤسسة الوطنية لتطوير الصمغ العربي", nameEn: "National Gum Arabic Development Corp", classification: "ISIC-0230 (Gathering of non-wood forest products)", status: "Active", lastSync: "2026-07-18" },
  { id: "rec-3", type: "product", code: "SD-HS-130120", nameAr: "صمغ عربي طبيعي خام (هشاب وطلح)", nameEn: "Natural Raw Gum Arabic (Hashab & Talha)", classification: "HS-1301.20 (Natural Gums & Resins)", status: "Active", lastSync: "2026-07-19" },
  { id: "rec-4", type: "product", code: "SD-HS-120740", nameAr: "حبوب سمسم سوداني أبيض طبيعي", nameEn: "Natural White Sudanese Sesame Seeds", classification: "HS-1207.40 (Sesame Seeds)", status: "Updated", lastSync: "2026-07-17" },
  { id: "rec-5", type: "service", code: "SD-SRV-9111", nameAr: "النافذة القومية الموحدة لترخيص الصادرات", nameEn: "National Export Licensing Single Window", classification: "Sovereign Trade Service", status: "Active", lastSync: "2026-07-19" }
];

let openDatasetsList = [
  { id: "ds-1", titleAr: "مؤشرات نمو الصادرات السلعية والمحاصيل النقدية 2026", titleEn: "Sovereign Export Growth & Commodity Trade Indices 2026", category: "Trade Indices", version: "2.1.0", license: "Sovereign Open Data License v1.0", citations: 48, downloads: 1420, lastUpdated: "2026-07-15", classification: "Public" },
  { id: "ds-2", titleAr: "الإنتاج الصناعي السنوي وطاقات المصانع التحويلية", titleEn: "Annual Manufacturing Capacity & Industrial Production Output", category: "Industrial Capacity", version: "1.4.0", license: "Sovereign Open Data License v1.0", citations: 22, downloads: 850, lastUpdated: "2026-07-10", classification: "Public" },
  { id: "ds-3", titleAr: "الشركات التجارية الفعالة المسجلة وتوزيعها الجغرافي", titleEn: "Geographic Distribution of Federally Registered Corporations", category: "Demographics", version: "3.0.1", license: "Sovereign Open Data License v1.0", citations: 56, downloads: 3110, lastUpdated: "2026-07-18", classification: "Public" },
  { id: "ds-4", titleAr: "قائمة تصنيفات الأنشطة الاقتصادية الموحدة للسودان", titleEn: "Sudan Unified Economic Activity & ISIC v4 Classification Codes", category: "Classifications", version: "1.0.0", license: "Sovereign Open Data License v1.0", citations: 112, downloads: 6420, lastUpdated: "2026-05-01", classification: "Sovereign" }
];

let replicationLogs = [
  { id: "exch-1", source: "Customs Single Window Gateway", destination: "National Commercial Data Hub", dataType: "Export Manifest Sync", volume: 142, status: "Success", timestamp: "10:14:22" },
  { id: "exch-2", source: "Federal Taxation System", destination: "National Commercial Data Hub", dataType: "SME VAT Compliance Logs", volume: 88, status: "Success", timestamp: "10:14:05" },
  { id: "exch-3", source: "Central Bank of Sudan", destination: "National Commercial Data Hub", dataType: "Sovereign Forex Allocation Sync", volume: 310, status: "Success", timestamp: "10:13:41" },
  { id: "exch-4", source: "Ministry of Investment Registry", destination: "National Commercial Data Hub", dataType: "Foreign Investment Project Approvals", volume: 215, status: "Success", timestamp: "10:12:18" }
];

app.get("/api/commercial-data-governance/hub-records", (req, res) => {
  res.json({ success: true, records: masterDataRecords });
});

app.post("/api/commercial-data-governance/hub-records", express.json(), (req, res) => {
  const { type, code, nameAr, nameEn, classification } = req.body;
  if (!code || !nameAr || !nameEn) {
    return res.status(400).json({ success: false, message: "Code, nameAr, and nameEn are mandatory fields" });
  }
  const newRecord = {
    id: `rec-${Date.now()}`,
    type: type || "business",
    code,
    nameAr,
    nameEn,
    classification: classification || "General",
    status: "Active",
    lastSync: new Date().toISOString().split("T")[0]
  };
  masterDataRecords.unshift(newRecord);
  res.json({ success: true, record: newRecord });
});

app.get("/api/commercial-data-governance/datasets", (req, res) => {
  res.json({ success: true, datasets: openDatasetsList });
});

app.get("/api/commercial-data-governance/exchange-logs", (req, res) => {
  res.json({ success: true, logs: replicationLogs });
});

// ============================================================================
// --- PHASE 19: NATIONAL DIGITAL ECONOMY & SMART BUSINESS PLATFORM ---
// ============================================================================

// State store for Phase 19 (persists in memory)
let digitalIdentities = [
  { id: "DBI-101", companyNameAr: "شركة النيل للمنتجات الغذائية المحدودة", companyNameEn: "Nile Food Products Co. Ltd", crNumber: "SD-2026-94829", status: "Verified", badge: "Gold Trusted Partner", qrCode: "QR-DBI-94829", score: 98, email: "nile@sdmci.gov.sd", certificates: ["Active Commercial License", "mTLS Cryptographic Identity Certificate"], lifecycle: "Active", auditTrail: [{ action: "Identity Issued", user: "Admin", timestamp: "2026-07-19T01:10:00Z" }] },
  { id: "DBI-102", companyNameAr: "المؤسسة الوطنية لتطوير الصمغ العربي", companyNameEn: "National Gum Arabic Development Corp", crNumber: "SD-2026-10293", status: "Verified", badge: "Sovereign Strategic Partner", qrCode: "QR-DBI-10293", score: 99, email: "gum_arabic@sdmci.gov.sd", certificates: ["mTLS Cryptographic Identity Certificate", "COMESA Border Customs Pass"], lifecycle: "Active", auditTrail: [{ action: "mTLS Certificate Renewed", user: "Admin", timestamp: "2026-07-19T01:12:00Z" }] }
];

let ecommerceStores = [
  { id: "ECO-201", storeName: "سودان مارت التجاري", platform: "NileShop Platform", sellerName: "أحمد المأمون", licenseNo: "EC-99382", status: "Approved", badge: "Consumer Trust Certified", url: "https://sudanmart.sd", complianceScore: 96, auditLogs: [{ action: "Seller Verified", timestamp: "2026-07-19T01:15:00Z" }] }
];

let businessLicenses = [
  { id: "LIC-301", companyName: "Nile Food Products Co. Ltd", licenseType: "Food Processing License", status: "Active", issueDate: "2026-01-15", expiryDate: "2027-01-15", qrCode: "QR-LIC-301", notification: "All clear. Renewal due in 180 days." }
];

let startupRecords = [
  { id: "STP-401", startupName: "حصاد التقنية للزراعة الذكية", founder: "مريم العبيد", sector: "AgriTech", projectTitle: "AI Irrigation Sensor Network", status: "Incubated", fundingTarget: 50000, fundingRaised: 12000, mentor: "د. عبد الباسط محمد", trainingStatus: "Advanced Certificate" }
];

let digitalTransactions = [
  { id: "TXN-601", buyer: "سودان مارت التجاري", seller: "Nile Food Products Co. Ltd", amount: 45000, currency: "SDG", status: "Success", fraudRisk: "Low", compliance: "Passed", timestamp: "2026-07-19T01:20:00Z", signature: "SHA256:09a8f7b...e" }
];

let digitalMarketplace = [
  { id: "MKT-701", name: "الشركة الوطنية للوجستيات الرقمية", type: "Service Provider", services: "Cold-chain transport & customs clearance", rate: "$150/hr", complianceBadge: "Verified", contract: "Active sovereign master agreement" }
];

let economyIndicators = {
  digitalizationIndex: 94.2,
  ecommerceAdoption: 85.6,
  startupCount: 145,
  totalTransactionsVolume: 1248000,
  growthForecast: "12.4%",
  digitalReadinessScore: 92.5,
  innovationScore: 89.1,
  smeDigitalizationScore: 88.4
};

// REST APIs
app.get("/api/digital-economy/identities", (req, res) => {
  res.json({ success: true, identities: digitalIdentities });
});

app.post("/api/digital-economy/identities", express.json(), (req, res) => {
  const { companyNameAr, companyNameEn, crNumber, email } = req.body;
  if (!companyNameAr || !crNumber) {
    return res.status(400).json({ success: false, message: "Company Name (Ar) and CR Number are required" });
  }
  const newIdentity = {
    id: `DBI-${Math.floor(100 + Math.random() * 900)}`,
    companyNameAr,
    companyNameEn: companyNameEn || companyNameAr,
    crNumber,
    status: "Verified",
    badge: "Verified Merchant",
    qrCode: `QR-DBI-${crNumber}`,
    score: 95,
    email: email || "info@sdmci.gov.sd",
    certificates: ["Commercial Register ID Token"],
    lifecycle: "Active",
    auditTrail: [{ action: "Digital Business Identity Provisioned", user: "Applicant", timestamp: new Date().toISOString() }]
  };
  digitalIdentities.unshift(newIdentity);
  res.json({ success: true, identity: newIdentity });
});

app.get("/api/digital-economy/ecommerce", (req, res) => {
  res.json({ success: true, stores: ecommerceStores });
});

app.post("/api/digital-economy/ecommerce", express.json(), (req, res) => {
  const { storeName, platform, sellerName, licenseNo, url } = req.body;
  if (!storeName || !sellerName) {
    return res.status(400).json({ success: false, message: "Store Name and Seller Name are required" });
  }
  const newStore = {
    id: `ECO-${Math.floor(200 + Math.random() * 900)}`,
    storeName,
    platform: platform || "Custom",
    sellerName,
    licenseNo: licenseNo || `EC-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "Approved",
    badge: "Consumer Trust Certified",
    url: url || "https://market.sd",
    complianceScore: 95,
    auditLogs: [{ action: "Seller Registered and Verified", timestamp: new Date().toISOString() }]
  };
  ecommerceStores.unshift(newStore);
  res.json({ success: true, store: newStore });
});

app.get("/api/digital-economy/licensing", (req, res) => {
  res.json({ success: true, licenses: businessLicenses });
});

app.post("/api/digital-economy/licensing", express.json(), (req, res) => {
  const { companyName, licenseType } = req.body;
  const newLic = {
    id: `LIC-${Math.floor(300 + Math.random() * 900)}`,
    companyName,
    licenseType,
    status: "Active",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
    qrCode: `QR-LIC-${Math.floor(100 + Math.random() * 900)}`,
    notification: "Renewal automatically registered."
  };
  businessLicenses.unshift(newLic);
  res.json({ success: true, license: newLic });
});

app.get("/api/digital-economy/entrepreneurship", (req, res) => {
  res.json({ success: true, startups: startupRecords });
});

app.post("/api/digital-economy/entrepreneurship", express.json(), (req, res) => {
  const { startupName, founder, sector, projectTitle, fundingTarget } = req.body;
  const newSt = {
    id: `STP-${Math.floor(400 + Math.random() * 900)}`,
    startupName,
    founder,
    sector,
    projectTitle,
    status: "Incubated",
    fundingTarget: Number(fundingTarget) || 50000,
    fundingRaised: 0,
    mentor: "Assigned Sovereign Advisor",
    trainingStatus: "Registered"
  };
  startupRecords.unshift(newSt);
  res.json({ success: true, startup: newSt });
});

app.get("/api/digital-economy/transactions", (req, res) => {
  res.json({ success: true, transactions: digitalTransactions });
});

app.post("/api/digital-economy/transactions", express.json(), (req, res) => {
  const { buyer, seller, amount, currency } = req.body;
  const riskScore = Number(amount) > 100000 ? "Medium Risk (Large Value)" : "Low";
  const newTxn = {
    id: `TXN-${Math.floor(600 + Math.random() * 900)}`,
    buyer,
    seller,
    amount: Number(amount) || 1000,
    currency: currency || "SDG",
    status: "Success",
    fraudRisk: riskScore,
    compliance: "Passed",
    timestamp: new Date().toISOString(),
    signature: `SHA256:${Math.random().toString(16).substring(2, 10)}...e`
  };
  digitalTransactions.unshift(newTxn);
  res.json({ success: true, transaction: newTxn });
});

app.get("/api/digital-economy/marketplace", (req, res) => {
  res.json({ success: true, marketplace: digitalMarketplace });
});

app.get("/api/digital-economy/observatory", (req, res) => {
  res.json({ success: true, observatory: { ...economyIndicators, identitiesCount: digitalIdentities.length, ecommerceStoresCount: ecommerceStores.length, startupsCount: startupRecords.length } });
});

// AI Advisor with local fallback & smart predictions
app.post("/api/digital-economy/smart-advisor", express.json(), async (req, res) => {
  const { prompt, type } = req.body;
  
  // Local fallback business logic models
  if (type === "plan") {
    return res.json({
      success: true,
      result: `**Sovereign Business Plan Report for [${prompt || "Enterprise"}]**\n\n` +
              `1. **Market Analysis:** Sudan Vision 2035 prioritizes industrial clusters, digital logistics, and food secure supply chains.\n` +
              `2. **Financial Forecast:** Break-even expected within 14 months of operation with 12% projected annual growth.\n` +
              `3. **E-Commerce Strategy:** Full compliance integration via standard Ministry of Commerce digital identities and mTLS cryptographic shields.\n` +
              `4. **AI Recommendations:** Launch a digital storefront on NileShop Platform to automatically clear COMESA customs duties.`
    });
  }

  if (type === "risk") {
    const riskScore = prompt && prompt.toLowerCase().includes("food") ? "Low Risk (Strategic National Sector)" : "Medium Risk (Subject to Exchange Fluctuations)";
    return res.json({
      success: true,
      result: `**Cryptographic Compliance & Risk Assessment**\n\n` +
              `* **Overall Risk Category:** ${riskScore}\n` +
              `* **WAF/ mTLS Handshake Status:** Valid & Secured via Government Public Key Infrastructure (PKI)\n` +
              `* **Regulatory Alignment:** 100% compliant with Sudan Electronic Transactions Act and regional GRC policies\n` +
              `* **Mitigation Strategy:** Leverage central bank sovereign liquidity accounts to cushion transactional volatility.`
    });
  }

  // General advisor response
  res.json({
    success: true,
    result: `**Ministry of Commerce sovereign AI Advisor Assistant**\n\n` +
            `Our AI models have processed your query: "${prompt || "Commercial growth advice"}".\n\n` +
            `Based on recent data in the Sudan Digital Business Observatory:\n` +
            `- **SME digitization is up 14.8%** this quarter, spurred by the mTLS identity single-sign-on framework.\n` +
            `- We recommend configuring digital payment gateways directly to settle corporate tax and regulatory compliance automatically.\n` +
            `- For cross-border COMESA trade, ensure your digital certificate of origin is SHA-256 stamped.`
  });
});

// GRAPHQL Simulated Endpoint
app.post("/api/digital-economy/graphql", express.json(), (req, res) => {
  const { query } = req.body;
  console.log("Parsing Phase 19 GraphQL Query:", query);
  
  if (query && query.includes("observatory")) {
    return res.json({
      data: {
        observatory: {
          digitalizationIndex: economyIndicators.digitalizationIndex,
          ecommerceAdoption: economyIndicators.ecommerceAdoption,
          digitalReadinessScore: economyIndicators.digitalReadinessScore
        }
      }
    });
  }

  if (query && query.includes("identities")) {
    return res.json({
      data: {
        identities: digitalIdentities.map(id => ({ id: id.id, companyNameAr: id.companyNameAr, status: id.status }))
      }
    });
  }

  res.json({
    data: {
      sudanDigitalEconomy: {
        status: "active",
        nodesOnline: "Federal Trust Center Core Node v19.0",
        pkiVerification: " mTLS Zero-Trust Enforcement Active"
      }
    }
  });
});

// ============================================================================
// --- PHASE 20: NATIONAL DIGITAL ECONOMIC GOVERNMENT PLATFORM ---
// ============================================================================

let p20Ministries = [
  { id: "m-1", nameAr: "وزارة التجارة والصناعة", nameEn: "Ministry of Commerce & Industry", code: "MCI", servicesCount: 24, status: "Active" },
  { id: "m-2", nameAr: "وزارة الاستثمار والتعاون الدولي", nameEn: "Ministry of Investment", code: "MOI", servicesCount: 15, status: "Active" },
  { id: "m-3", nameAr: "وزارة المالية والتخطيط الاقتصادي", nameEn: "Ministry of Finance", code: "MOF", servicesCount: 32, status: "Active" },
  { id: "m-4", nameAr: "سلطة الجمارك السودانية", nameEn: "Sudanese Customs Authority", code: "SCA", servicesCount: 18, status: "Active" }
];

let p20ServiceCatalog = [
  { id: "srv-1", nameAr: "طلب رخصة استيراد وتصدير ذكية", nameEn: "Smart Import/Export License", dept: "MCI", type: "G2B", fee: "50,000 SDG" },
  { id: "srv-2", nameAr: "تسجيل السجل التجاري الرقمي", nameEn: "Commercial Registry Registration", dept: "MCI", type: "G2B", fee: "120,000 SDG" },
  { id: "srv-3", nameAr: "طلب تخصيص أرض صناعية", nameEn: "Industrial Land Allocation", dept: "MOI", type: "G2B", fee: "250,000 SDG" },
  { id: "srv-4", nameAr: "تفريغ جمركي ذكي عبر نافذة واحدة", nameEn: "Single-Window Customs Clearance", dept: "SCA", type: "G2B", fee: "80,000 SDG" }
];

let p20AiModels = [
  { id: "aim-1", name: "Sovereign-Trade-Predictor-v2", type: "Regression", status: "Active", compliance: "Passed", version: "2.1.0", latency: "14ms" },
  { id: "aim-2", name: "Nile-Arabic-Llama-7B-MCI", type: "LLM-FineTuned", status: "Active", compliance: "Passed", version: "1.0.4", latency: "42ms" },
  { id: "aim-3", name: "Customs-Anomalies-Detector", type: "AnomalyDetection", status: "Testing", compliance: "Auditing", version: "0.8.2", latency: "8ms" }
];

let p20OnboardingRequests = [
  { id: "onb-1", entityAr: "وزارة الصحة الاتحادية", entityEn: "Federal Ministry of Health", status: "Under Review", date: "2026-07-18" },
  { id: "onb-2", entityAr: "وزارة الثروة الحيوانية والسمكية", entityEn: "Ministry of Animal Resources", status: "Approved", date: "2026-07-15" }
];

let p20PaymentsLog = [
  { id: "pay-1", payee: "Nile Food Corp", amount: "120,000 SDG", type: "License Fee", time: "Just now" }
];

// 1. Get Portal Stats
app.get("/api/national-economic-gov/portal-stats", (req, res) => {
  res.json({
    success: true,
    ministries: p20Ministries,
    serviceCatalog: p20ServiceCatalog,
    aiModels: p20AiModels,
    onboardingRequests: p20OnboardingRequests
  });
});

// 2. Register AI Model
app.post("/api/national-economic-gov/ai-models", express.json(), (req, res) => {
  const { name, type, version } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Model name is required" });
  }
  const newModel = {
    id: `aim-${Date.now()}`,
    name,
    type: type || "LLM-FineTuned",
    status: "Testing",
    compliance: "Auditing",
    version: version || "1.0.0",
    latency: "25ms"
  };
  p20AiModels.push(newModel);
  res.json({ success: true, model: newModel });
});

// 3. Register Onboarding Request
app.post("/api/national-economic-gov/onboarding-requests", express.json(), (req, res) => {
  const { entityAr, entityEn, contactEmail, preferredPlugins } = req.body;
  if (!entityAr || !entityEn) {
    return res.status(400).json({ success: false, message: "Arabic and English entity names are required" });
  }
  const newRequest = {
    id: `onb-${Date.now()}`,
    entityAr,
    entityEn,
    status: "Under Review",
    date: new Date().toISOString().split("T")[0]
  };
  p20OnboardingRequests.push(newRequest);
  res.json({ success: true, request: newRequest });
});

// 4. Explain AI decision simulation
app.post("/api/national-economic-gov/explain-ai", express.json(), (req, res) => {
  const { prompt } = req.body;
  let explanation = `Decision Engine matched the prompt "${prompt || "general scan"}". All standard mTLS compliance requirements have been successfully audited. Fraud risk rating computed as 1.4% (Extremely Low Risk). Automatic routing cleared to SCA Gateway.`;
  if (prompt && prompt.toLowerCase().includes("grain")) {
    explanation = `Decision Engine identified cash crop/grain export conditions. National Strategic reserve buffer: Checked (Sufficient). COMESA regional trade certificate of origin: Validated. Export clearance approved.`;
  }
  res.json({ success: true, explanation });
});

// 5. Shared Payments
app.post("/api/national-economic-gov/shared-payments", express.json(), (req, res) => {
  const { amount, payee } = req.body;
  const newPayment = {
    id: `pay-${Date.now()}`,
    payee: payee || "Authorized Entity",
    amount: `${Number(amount).toLocaleString()} SDG`,
    type: "Sovereign Settlement",
    time: "Just now"
  };
  p20PaymentsLog.unshift(newPayment);
  res.json({ success: true, payment: newPayment });
});

// 6. GraphQL simulated endpoint
app.post("/api/national-economic-gov/graphql", express.json(), (req, res) => {
  const { query } = req.body;
  if (query && query.includes("nationalEconomicCenter")) {
    return res.json({
      data: {
        nationalEconomicCenter: {
          registeredMinistries: p20Ministries.map(m => ({ code: m.code, servicesCount: m.servicesCount })),
          cyberSecurityComplianceScore: 98.4,
          aiRiskIndicator: 12.4
        }
      }
    });
  }
  res.json({
    data: {
      nationalEconomicCenter: {
        status: "Online",
        pkiSignature: "SHA256:7739a2d...e"
      }
    }
  });
});

// --- VITE MIDDLEWARE & STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Check if dist exists, if not, alert
    if (!fs.existsSync(distPath)) {
      console.warn("WARNING: 'dist' folder not found. Please build the frontend first!");
    }

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SDMCI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
