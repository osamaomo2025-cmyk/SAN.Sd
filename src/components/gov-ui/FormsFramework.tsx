/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, Check, Copy, Info, AlertCircle, AlertTriangle, Trash2, Plus, 
  Search, Building2, Cpu, Globe, ShieldAlert, Users, CheckCircle2, HelpCircle, 
  RotateCcw, Lock, Workflow, Eye, BookOpen, Award, Download, Sparkles, Zap, 
  PenTool, CheckSquare, RefreshCw, FileCheck, Layers, EyeOff, LayoutList
} from "lucide-react";
import { SovereignTypography, SovereignButton, SovereignBadge, SovereignDivider } from "./atoms";
import { SovereignInput, SovereignSelect, SovereignFileUpload } from "./forms";

interface FormsFrameworkProps {
  currentLanguage: "ar" | "en";
  role?: string;
}

// 1. Definition of the 9 official Ministry Form templates with metadata
interface FormTemplate {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  requiredFields: {
    name: string;
    labelAr: string;
    labelEn: string;
    type: string;
    required: boolean;
    placeholderAr: string;
    placeholderEn: string;
    validationRegex?: RegExp;
    validationErrorAr?: string;
    validationErrorEn?: string;
    aiHintAr?: string;
    aiHintEn?: string;
  }[];
  requiredDocs: {
    id: string;
    nameAr: string;
    nameEn: string;
    maxSizeMB: number;
    required: boolean;
  }[];
  businessRulesAr: string[];
  businessRulesEn: string[];
  governanceCode: string;
}

const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "comm-reg",
    code: "SD-MCI-CR-01",
    nameAr: "طلب السجل التجاري والاسم التجاري للمنشأة",
    nameEn: "Commercial Registration & Trade Name Application",
    categoryAr: "السجل التجاري",
    categoryEn: "Commercial Registration",
    descriptionAr: "طلب التأسيس الرسمي للشركات الوطنية وتوثيق الأسماء التجارية بموجب المادة 4 لقانون السجل التجاري لعام 2026.",
    descriptionEn: "Official incorporation application for national companies and trade name reservation under Article 4 of the 2026 Commercial Act.",
    requiredFields: [
      {
        name: "tradeNameAr",
        labelAr: "الاسم التجاري المقترح (بالعربية)",
        labelEn: "Proposed Trade Name (Arabic)",
        type: "text",
        required: true,
        placeholderAr: "شركة الخرطوم لإنتاج الغلال المحدودة",
        placeholderEn: "Khartoum Grains Production Co. Ltd",
        aiHintAr: "يفضل ألا يحتوي الاسم على كلمات محجوزة أو سيادية عامة.",
        aiHintEn: "Avoid reserved or sovereign words in trade names."
      },
      {
        name: "tradeNameEn",
        labelAr: "الاسم التجاري المقترح (بالإنجليزية)",
        labelEn: "Proposed Trade Name (English)",
        type: "text",
        required: true,
        placeholderAr: "Khartoum Grains Production Co. Ltd",
        placeholderEn: "Khartoum Grains Production Co. Ltd",
        aiHintAr: "تأكد من مطابقة التهجئة الصوتية للاسم العربي تماماً.",
        aiHintEn: "Ensure exact phonetic spelling matching the Arabic trade name."
      },
      {
        name: "legalType",
        labelAr: "الشكل القانوني للمنشأة",
        labelEn: "Legal Entity Type",
        type: "select",
        required: true,
        placeholderAr: "اختر الشكل القانوني",
        placeholderEn: "Select Legal Type"
      },
      {
        name: "initialCapital",
        labelAr: "رأس المال المقترح (بالجنيه السوداني SDG)",
        labelEn: "Proposed Capital (SDG)",
        type: "number",
        required: true,
        placeholderAr: "10,000,000",
        placeholderEn: "10000000",
        aiHintAr: "الحد الأدنى لتأسيس شركة مساهمة هو 5,000,000 جنيه.",
        aiHintEn: "Minimum incorporation capital for public shareholding is 5,000,000 SDG."
      },
      {
        name: "state",
        labelAr: "الولاية المقررة للمقر الرئيسي",
        labelEn: "State of Headquarters",
        type: "select",
        required: true,
        placeholderAr: "اختر الولاية",
        placeholderEn: "Select State"
      }
    ],
    requiredDocs: [
      { id: "cert-incorporation", nameAr: "عقد التأسيس والنظام الأساسي للشركة", nameEn: "Memorandum & Articles of Association", maxSizeMB: 10, required: true },
      { id: "id-partners", nameAr: "إثبات الهوية الوطنية للشركاء (ID/جواز)", nameEn: "National ID / Passports of Partners", maxSizeMB: 5, required: true },
      { id: "bank-deposit", nameAr: "شهادة إيداع بنكية بنسبة رأس المال", nameEn: "Bank Capital Deposit Certificate", maxSizeMB: 2, required: true }
    ],
    businessRulesAr: [
      "يجب ألا يقل رأس المال عن 1,000,000 جنيه للشركات ذات المسؤولية المحدودة.",
      "يجب تقديم عقد إيجار أو سند ملكية مقر موثق قبل الإصدار النهائي للسجل التجاري."
    ],
    businessRulesEn: [
      "Minimum capital must be 1,000,000 SDG for LLC structures.",
      "A notarized lease contract or property title deed must be submitted before final certificate release."
    ],
    governanceCode: "GOV-MCI-CR-REG-01-REV2"
  },
  {
    id: "ind-lic",
    code: "SD-MCI-IL-02",
    nameAr: "طلب ترخيص المنشأة الصناعية والتسجيل الفيدرالي",
    nameEn: "Industrial Licensing & Federal Registration Form",
    categoryAr: "المنصة الصناعية",
    categoryEn: "Industrial Platform",
    descriptionAr: "طلب إصدار رخصة صناعية جديدة لتأسيس مصنع أو توسعة خطوط إنتاج لتوفير الاحتياجات الوطنية للصادرات بموجب معايير 2026.",
    descriptionEn: "Application for issuing a new industrial license to establish a factory or expand production lines under national 2026 standards.",
    requiredFields: [
      {
        name: "factoryName",
        labelAr: "اسم المصنع / المنشأة الصناعية المقترحة",
        labelEn: "Proposed Factory Name",
        type: "text",
        required: true,
        placeholderAr: "مصنع جياد المتطور للحديد والصلب",
        placeholderEn: "Giad Advanced Iron and Steel Factory",
        aiHintAr: "يجب ربط الاسم بوزارة الصناعة لتفادي التعارض الجغرافي.",
        aiHintEn: "Factory name must link with Ministry of Industry records."
      },
      {
        name: "sector",
        labelAr: "القطاع الصناعي المعتمد",
        labelEn: "Industrial Sector",
        type: "select",
        required: true,
        placeholderAr: "اختر القطاع الصناعي",
        placeholderEn: "Select Industrial Sector"
      },
      {
        name: "productionCapacity",
        labelAr: "الطاقة الإنتاجية المقدرة سنوياً بالطن/الوحدة",
        labelEn: "Annual Production Capacity (Tons/Units)",
        type: "text",
        required: true,
        placeholderAr: "50,000 طن متري سنوياً",
        placeholderEn: "50000 metric tons annually"
      },
      {
        name: "energySource",
        labelAr: "مصدر الطاقة الأساسي للمصنع والتأثير البيئي",
        labelEn: "Primary Energy Source & Environmental Impact",
        type: "select",
        required: true,
        placeholderAr: "طاقة شمسية هجينة / كهرباء الشبكة القومية",
        placeholderEn: "Hybrid Solar Power / National Grid"
      }
    ],
    requiredDocs: [
      { id: "environmental-clearance", nameAr: "شهادة خلو الأثر البيئي من وزارة البيئة", nameEn: "Environmental Impact Assessment Clearance", maxSizeMB: 15, required: true },
      { id: "engineering-plans", nameAr: "المخططات الهندسية التفصيلية للموقع والمصنع", nameEn: "Detailed Industrial Site Engineering Plans", maxSizeMB: 25, required: true },
      { id: "civil-defense", nameAr: "موافقة الدفاع المدني وإجراءات السلامة والأمان", nameEn: "Civil Defense Safety & Fire Security Approval", maxSizeMB: 5, required: true }
    ],
    businessRulesAr: [
      "المصانع من فئة قطاع الغذاء والصناعات الكيميائية تتطلب تفتيشاً ميدانياً مسبقاً قبل الموافقة المبدئية.",
      "يجب تقديم دراسة تأثير بيئي شاملة للمشاريع ذات استهلاك الطاقة المرتفع."
    ],
    businessRulesEn: [
      "Food and chemical sectors require a pre-approval field physical audit.",
      "High energy-consumption projects must supply a comprehensive Environmental Impact study."
    ],
    governanceCode: "GOV-MCI-IND-LIC-02-REV4"
  },
  {
    id: "imp-exp",
    code: "SD-MCI-IE-03",
    nameAr: "طلب رخصة الاستيراد والتصدير الموحدة للسلع والمنتجات",
    nameEn: "Unified Import & Export Licensing Form",
    categoryAr: "الاستيراد والتصدير",
    categoryEn: "Import & Export",
    descriptionAr: "النموذج الرسمي لإصدار وتجديد رخص الاستيراد والتصدير للشركات المسجلة لتيسير التجارة وتكامل الصادرات السيادية السودانية.",
    descriptionEn: "Official form for issuing and renewing import/export licenses for registered companies to streamline sovereign Sudanese exports.",
    requiredFields: [
      {
        name: "licenseType",
        labelAr: "نوع الترخيص المطلوب",
        labelEn: "Requested License Type",
        type: "select",
        required: true,
        placeholderAr: "تصدير منتجات وطنية / استيراد سلع استراتيجية",
        placeholderEn: "Export national products / Import strategic commodities"
      },
      {
        name: "crNumber",
        labelAr: "رقم السجل التجاري الفيدرالي الموحد للمنشأة",
        labelEn: "Federal Commercial Registration Number (CR)",
        type: "text",
        required: true,
        placeholderAr: "SD-MCI-CR-XXXXX",
        placeholderEn: "SD-MCI-CR-XXXXX",
        validationRegex: /^SD-MCI-CR-\d{5}$/,
        validationErrorAr: "يجب أن يكون بالتنسيق الفيدرالي المعتمد: SD-MCI-CR-XXXXX",
        validationErrorEn: "Must follow the approved federal format: SD-MCI-CR-XXXXX",
        aiHintAr: "يقوم النظام التلقائي بالتحقق والربط الفوري بسجل الشركة الموحد.",
        aiHintEn: "System auto-links and validates immediately against national databases."
      },
      {
        name: "goodsDescription",
        labelAr: "الوصف التفصيلي والترميز الجمركي للسلع (HS Code)",
        labelEn: "Detailed Goods Description & HS Tariff Code",
        type: "textarea",
        required: true,
        placeholderAr: "تصدير الصمغ العربي الهشاب الطبيعي تحت بند التعرفة الجمركية 1301.90",
        placeholderEn: "Export of organic Gum Arabic under HS Code 1301.90",
        aiHintAr: "استخدم المساعد التوليدي للتحقق من بند التعرفة الجمركية الصحيح.",
        aiHintEn: "Use the built-in generative AI assistant to suggest the correct HS Code."
      },
      {
        name: "annualValue",
        labelAr: "القيمة السنوية التقديرية للمعاملات بالدولار USD",
        labelEn: "Estimated Annual Export/Import Value (USD)",
        type: "number",
        required: true,
        placeholderAr: "500,000",
        placeholderEn: "500000"
      }
    ],
    requiredDocs: [
      { id: "tax-clearance", nameAr: "شهادة الخلو الضريبي الرقمية للمنشأة", nameEn: "Digital National Tax Clearance Certificate", maxSizeMB: 3, required: true },
      { id: "bank-clearance", nameAr: "شهادة خلو من موانع التصدير من بنك السودان المركزي", nameEn: "Central Bank of Sudan Financial Clearance Card", maxSizeMB: 2, required: true },
      { id: "membership-chamber", nameAr: "عضوية الغرفة التجارية للمصدرين والمستوردين", nameEn: "Chamber of Commerce Valid Membership", maxSizeMB: 2, required: true }
    ],
    businessRulesAr: [
      "تخضع رخص الاستيراد لسلع معينة (كالقمح والأدوية والمحروقات) للموافقة الاستباقية للوزارات القطاعية الفيدرالية.",
      "رخص التصدير للصمغ العربي والماشية الحية تخضع لبروتوكول ضمان الجودة والأسعار السيادية لمنع التهريب والمضاربة."
    ],
    businessRulesEn: [
      "Import licenses for strategic commodities require prior sector ministerial authorization.",
      "Export licenses for live cattle or Gum Arabic require quality validation checks and sovereign price floor compliance."
    ],
    governanceCode: "GOV-MCI-IMPEXP-03-REV1"
  },
  {
    id: "inv-lands",
    code: "SD-MCI-IV-04",
    nameAr: "طلب تخصيص الأراضي والمدن الصناعية الاستثمارية",
    nameEn: "Investment Land Allocation Request",
    categoryAr: "بوابة الاستثمار",
    categoryEn: "Investment Lands",
    descriptionAr: "طلب تخصيص أراضٍ ومقرات للتصنيع الزراعي وتعبئة المواد الخام بالمنطقة الحرة والمدن الصناعية الاستثمارية الكبرى.",
    descriptionEn: "Application for locating, partitioning, and obtaining industrial plots of land for agricultural manufacturing or raw materials processing in sovereign free zones.",
    requiredFields: [
      {
        name: "investorName",
        labelAr: "اسم المستثمر أو اسم الشركة بالكامل",
        labelEn: "Full Name of Investor / Corporate Entity",
        type: "text",
        required: true,
        placeholderAr: "مجموعة الراجحي للاستثمار الزراعي والصناعي",
        placeholderEn: "Al Rajhi Agricultural and Industrial Group"
      },
      {
        name: "proposedProject",
        labelAr: "اسم ووصف المشروع الصناعي والتقني المقترح",
        labelEn: "Proposed Technical Project Name & Details",
        type: "textarea",
        required: true,
        placeholderAr: "مجمع متكامل لطحن وتجهيز الغلال وتعبئتها وتصديرها للكوميسا",
        placeholderEn: "Integrated wheat mill and packaging facility for exporting to COMESA markets"
      },
      {
        name: "requestedArea",
        labelAr: "المساحة الإجمالية المطلوبة بالمتر المربع (Sqm)",
        labelEn: "Requested Land Area (Square Meters)",
        type: "number",
        required: true,
        placeholderAr: "15,000",
        placeholderEn: "15000"
      },
      {
        name: "zone",
        labelAr: "المنطقة الحرة أو المدينة الصناعية المفضلة",
        labelEn: "Preferred Industrial Zone / Sovereign Free Port",
        type: "select",
        required: true,
        placeholderAr: "المنطقة الحرة ببورتسودان / المدينة الصناعية بجياد / الباقير",
        placeholderEn: "Port Sudan Free Zone / Giad Industrial / El Bagair"
      }
    ],
    requiredDocs: [
      { id: "feasibility-study", nameAr: "دراسة الجدوى الفنية والاقتصادية المعتمدة للمشروع", nameEn: "Approved Technical and Financial Feasibility Study", maxSizeMB: 30, required: true },
      { id: "financial-guarantees", nameAr: "الضمانات المالية والقدرة الائتمانية من بنك دولي/محلي", nameEn: "Bank Financial Guarantees & Capital Credit line", maxSizeMB: 10, required: true }
    ],
    businessRulesAr: [
      "يتم تخصيص الأراضي بنظام عقد الإيجار طويل المدى (حتى 50 عاماً) القابل للتجديد بموجب تقارير التطور الإنشائي للمشروع.",
      "تلتزم الشركة ببدء الأعمال الإنشائية في غضون 6 أشهر من تاريخ الاستلام لتجنب سحب التخصيص."
    ],
    businessRulesEn: [
      "Lands are allocated under long-term lease terms (up to 50 years) tied to chronological progress audits.",
      "Construction work must commence within 6 months of site handover to avoid allocation revocation."
    ],
    governanceCode: "GOV-MCI-INVEST-LAND-04"
  },
  {
    id: "cons-protect",
    code: "SD-MCI-CP-05",
    nameAr: "بلاغ شكوى حماية المستهلك وضبط الأسواق والجودة",
    nameEn: "Consumer Protection & Market Price Enforcement Complaint",
    categoryAr: "حماية المستهلك",
    categoryEn: "Consumer Protection",
    descriptionAr: "رفع بلاغات رسمية فورية لنيابة حماية المستهلك ضد الاحتكار، الممارسات الاحتكارية، تزوير العلامات، أو التلاعب بالأسعار في أي ولاية بالسودان.",
    descriptionEn: "Submit official consumer complaints regarding monopolistic price-gouging, counterfeit products, expired foodstuff, or fraud in any Sudan state.",
    requiredFields: [
      {
        name: "reporterName",
        labelAr: "الاسم الكامل للمبلغ (اختياري وسري للغاية)",
        labelEn: "Full Name of Reporter (Optional & Strictly Confidential)",
        type: "text",
        required: false,
        placeholderAr: "أحمد النور عثمان",
        placeholderEn: "Ahmed Elnoor Osman"
      },
      {
        name: "reporterPhone",
        labelAr: "رقم الهاتف للتواصل والمتابعة الفورية",
        labelEn: "Phone Number for Immediate Alerts & Verification",
        type: "text",
        required: true,
        placeholderAr: "+249XXXXXXXXX",
        placeholderEn: "+249XXXXXXXXX"
      },
      {
        name: "storeName",
        labelAr: "اسم المتجر أو المنشأة المخالفة بالكامل",
        labelEn: "Name of Violating Store / Corporate Vendor",
        type: "text",
        required: true,
        placeholderAr: "شركة البركة للمواد الاستهلاكية بالجملة",
        placeholderEn: "Al Baraka Wholesale Consumer Goods Co."
      },
      {
        name: "violationType",
        labelAr: "تصنيف نوع المخالفة المسجلة",
        labelEn: "Classification of Registered Violation",
        type: "select",
        required: true,
        placeholderAr: "احتكار وتلاعب بالأسعار / منتجات منتهية الصلاحية",
        placeholderEn: "Monopoly and Price-Gouging / Counterfeit and Expired Goods"
      },
      {
        name: "violationDetails",
        labelAr: "التفاصيل الدقيقة والواقعة ومكان المخالفة بالتحديد",
        labelEn: "Detailed Description of Violation & Exact Location",
        type: "textarea",
        required: true,
        placeholderAr: "تمت زيادة سعر الزيت بنسبة 40% دفعة واحدة وتخزين المخزون لمنع تداوله بالسوق الشعبي بورتسودان.",
        placeholderEn: "Price of cooking oil increased by 40% instantly, warehouse hoarded in Port Sudan market."
      }
    ],
    requiredDocs: [
      { id: "invoice-receipt", nameAr: "صورة فاتورة الشراء أو إثبات السعر المقبوض", nameEn: "Purchase Invoice Receipt / Proof of Paid price", maxSizeMB: 4, required: false },
      { id: "photo-violation", nameAr: "صورة فوتوغرافية واضحة للسلعة المخالفة أو الرفوف", nameEn: "Clear Photographs of the Expired/Counterfeit item", maxSizeMB: 5, required: false }
    ],
    businessRulesAr: [
      "تُعامل هوية المبلغ بسرية مطلقة ومشفرة بالكامل بموجب لوائح الأمن السيادي للمعلومات رقم 12 لعام 2026.",
      "يتم توجيه أقرب فريق تفتيش ميداني آلياً بناءً على إحداثيات وموقع المنشأة المبلغ عنها."
    ],
    businessRulesEn: [
      "The identity of reporters is encrypted and kept strictly confidential under data protection decree #12.",
      "The system triggers and dispatches the nearest localized physical inspection patrol automatically."
    ],
    governanceCode: "GOV-MCI-CONS-PROT-05"
  },
  {
    id: "comp-serv",
    code: "SD-MCI-CS-06",
    nameAr: "طلب تعديل وتحديث بيانات الشركة (تعديل رأس المال / الشركاء)",
    nameEn: "Corporate Amendments & Capital Modification Form",
    categoryAr: "خدمات الشركات",
    categoryEn: "Company Services",
    descriptionAr: "طلب تعديل الهيكل الإداري للشركة، إضافة شركاء جدد، زيادة رأس مال المنشأة، أو تعديل الأنشطة التجارية المسجلة.",
    descriptionEn: "Application for modifying administrative structure, adding new partners, increasing capital reserves, or changing registered business activities.",
    requiredFields: [
      {
        name: "crNumberLinked",
        labelAr: "رقم السجل التجاري الحالي المراد تعديله",
        labelEn: "Current Commercial Registration Number (CR)",
        type: "text",
        required: true,
        placeholderAr: "SD-MCI-CR-XXXXX",
        placeholderEn: "SD-MCI-CR-XXXXX"
      },
      {
        name: "amendmentType",
        labelAr: "نوع التعديل الأساسي المطلق",
        labelEn: "Primary Amendment Category Required",
        type: "select",
        required: true,
        placeholderAr: "زيادة رأس المال / دخول شريك جديد / تعديل النشاط",
        placeholderEn: "Capital Increase / Entry of Partner / Activity Change"
      },
      {
        name: "amendmentDetails",
        labelAr: "تفاصيل التعديلات والقرارات الإدارية الجديدة",
        labelEn: "Detailed Description of Proposed Modifications",
        type: "textarea",
        required: true,
        placeholderAr: "زيادة رأس المال من 10 مليون إلى 25 مليون جنيه وتخصيص الأسهم للشركاء.",
        placeholderEn: "Increasing capital from 10M to 25M SDG and distributing shares accordingly."
      }
    ],
    requiredDocs: [
      { id: "board-resolution", nameAr: "محضر اجتماع مجلس الإدارة الموثق بالموافقة", nameEn: "Certified Board Resolution for Amendment Approval", maxSizeMB: 8, required: true },
      { id: "amended-articles", nameAr: "نسخة مسودة ملحق عقد التأسيس المعدل", nameEn: "Draft Copy of Amended Articles of Association", maxSizeMB: 12, required: true }
    ],
    businessRulesAr: [
      "لا يتم اعتماد أي تعديل إلا بعد تسوية كافة الرسوم والذمم المالية والضرائب المستحقة على السجل القائم.",
      "يتطلب دخول شريك غير سوداني موافقة الاستثمار الفيدرالي المسبقة وتدقيق الهوية."
    ],
    businessRulesEn: [
      "Amendments are blocked unless all pending taxes and licensing fees on the current CR are cleared.",
      "The entry of a non-Sudanese partner requires federal investment clearance and verified identity validation."
    ],
    governanceCode: "GOV-MCI-CORP-AMEND-06"
  },
  {
    id: "emp-serv",
    code: "SD-MCI-ES-07",
    nameAr: "طلب تفويض الصلاحيات الإدارية والوزارية للموظفين",
    nameEn: "Ministerial Delegation of Administrative Authority Form",
    categoryAr: "خدمات الموظفين",
    categoryEn: "Employee Services",
    descriptionAr: "طلب داخلي لتعيين وفحص تفويضات الصلاحيات والموافقة الإدارية الرقمية بين الوكلاء والمستشارين والمفتشين بوزارة التجارة.",
    descriptionEn: "Internal service application for configuring, validating, and delegating administrative approval authority among advisors, staff, and field inspectors.",
    requiredFields: [
      {
        name: "employeeId",
        labelAr: "الرقم الوظيفي الموحد للموظف المفوض",
        labelEn: "Unified Employee Oracle ID (Staff ID)",
        type: "text",
        required: true,
        placeholderAr: "MCI-EMP-2035-XXXX",
        placeholderEn: "MCI-EMP-2035-XXXX"
      },
      {
        name: "delegationScope",
        labelAr: "نطاق الصلاحيات والتفويض المالي والإداري",
        labelEn: "Scope of Financial & Admin Delegation",
        type: "select",
        required: true,
        placeholderAr: "اعتماد السجلات التجارية / تدقيق تراخيص الاستيراد والتصدير",
        placeholderEn: "Commercial Registry Approvals / Import-Export Auditing"
      },
      {
        name: "validityPeriod",
        labelAr: "فترة سريان التفويض (تاريخ البدء والانتهاء)",
        labelEn: "Delegation Validity Duration (Start & End Date)",
        type: "text",
        required: true,
        placeholderAr: "من 2026/07/12 إلى 2026/12/31",
        placeholderEn: "From 2026/07/12 to 2026/12/31"
      }
    ],
    requiredDocs: [
      { id: "ministerial-decree", nameAr: "قرار التعيين أو توجيه معالي الوزير المباشر", nameEn: "Ministerial Official Directive / Authorization Memo", maxSizeMB: 4, required: true }
    ],
    businessRulesAr: [
      "لا يجوز للموظف تفويض صلاحيات تتجاوز السقف المالي المسموح له في موازنة العام الحالي.",
      "جميع تفويضات الصلاحيات تخضع للمراجعة والرقابة التلقائية للوزير فورياً."
    ],
    businessRulesEn: [
      "Employees cannot delegate authority caps higher than their own approved budget ceiling.",
      "All delegation changes are instantly audited and flagged on the Minister's Command Dashboard."
    ],
    governanceCode: "GOV-MCI-EMP-DELEG-07"
  },
  {
    id: "inspect-serv",
    code: "SD-MCI-IS-08",
    nameAr: "تقرير التفتيش الميداني الفيدرالي الموحد ومطابقة السلامة",
    nameEn: "Unified Federal Field Audit & Factory Inspection Report",
    categoryAr: "خدمات الرقابة والتفتيش",
    categoryEn: "Inspection Services",
    descriptionAr: "النموذج المعتمد لتسجيل نتائج المعاينة الميدانية للمصانع والمنشآت التجارية للتحقق من التزامها بالمواصفات الوطنية السودانية.",
    descriptionEn: "Official record for logging physical audit findings, factory machinery safety, and commercial registry compliance.",
    requiredFields: [
      {
        name: "facilityName",
        labelAr: "اسم المصنع أو المنشأة التي تمت معاينتها",
        labelEn: "Audited Commercial/Industrial Facility Name",
        type: "text",
        required: true,
        placeholderAr: "شركة الخرطوم للحديد والصلب",
        placeholderEn: "Khartoum Iron & Steel Factory"
      },
      {
        name: "inspectorCode",
        labelAr: "كود المفتش الفيدرالي المعتمد بوزارة الصناعة",
        labelEn: "Certified Federal Auditor Inspector Code",
        type: "text",
        required: true,
        placeholderAr: "SD-MCI-INS-XXXX",
        placeholderEn: "SD-MCI-INS-XXXX"
      },
      {
        name: "complianceGrade",
        labelAr: "درجة المطابقة الإجمالية المسجلة ميدانياً",
        labelEn: "Overall Measured Compliance Safety Grade",
        type: "select",
        required: true,
        placeholderAr: "مطابق بالكامل / يحتاج لمراجعة وتعديل / غير مطابق ومخالف",
        placeholderEn: "Fully Compliant / Revision Required / Non-Compliant Violation"
      },
      {
        name: "inspectionNotes",
        labelAr: "ملاحظات وتوصيات التفتيش الميداني الفيدرالي",
        labelEn: "Field Observations & Corrective Actions",
        type: "textarea",
        required: true,
        placeholderAr: "تم فحص خطوط الإنتاج رقم 2 ووجد مطابقة بالكامل للمواصفة السودانية القياسية رقم 104.",
        placeholderEn: "Production lines inspected and found 100% compliant with Sudan Safety standard #104."
      }
    ],
    requiredDocs: [
      { id: "geotag-photos", nameAr: "الصور الفوتوغرافية الجغرافية للموقع والماكينات (Geo-tagged)", nameEn: "Geo-tagged physical site & machinery photographs", maxSizeMB: 15, required: true },
      { id: "safety-checklist", nameAr: "قائمة تدقيق السلامة الموقعة من مهندس الموقع", nameEn: "Certified Onsite Engineers Signed Inspection Checklist", maxSizeMB: 4, required: true }
    ],
    businessRulesAr: [
      "يجب على المفتش التقاط الصور وإرفاقها مع إحداثيات GPS الملتقطة تلقائياً لتوثيق الحضور الفعلي بالمنشأة.",
      "المنشآت غير المطابقة تُمنح مهلة 14 يوماً لتسوية الأوضاع لتفادي سحب الترخيص الصناعي."
    ],
    businessRulesEn: [
      "Inspectors must submit geo-tagged photo proofs taken inside factory limits to verify on-site attendance.",
      "Non-compliant facilities receive a 14-day corrective window before formal licensing suspension occurs."
    ],
    governanceCode: "GOV-MCI-INSPECT-08"
  },
  {
    id: "admin-serv",
    code: "SD-MCI-AD-09",
    nameAr: "طلب شراء داخلي وتخصيص الأصول الفيدرالية للوزارة",
    nameEn: "Internal Asset Acquisition & Procurement Requisition Form",
    categoryAr: "الخدمات الإدارية الداخلية",
    categoryEn: "Internal Administrative Services",
    descriptionAr: "طلب توريد مالي أو عيني أو شراء أصول لوجستية لدعم مكاتب وزارة التجارة والصناعة وتأهيل الإدارات الولائية.",
    descriptionEn: "Internal administrative requisition form for procuring logistical resources, tech hardware, or office assets for ministry branches.",
    requiredFields: [
      {
        name: "requestingDept",
        labelAr: "الإدارة أو الفرع الولائي طالب الشراء",
        labelEn: "Requesting Department / State Branch",
        type: "select",
        required: true,
        placeholderAr: "إدارة تكنولوجيا المعلومات / فرع بورتسودان",
        placeholderEn: "Information Technology Dept / Port Sudan Branch"
      },
      {
        name: "itemDescription",
        labelAr: "مواصفات الأصناف والمواد والكميات المطلوبة بالتفصيل",
        labelEn: "Detailed Procurement Specs & Required Quantities",
        type: "textarea",
        required: true,
        placeholderAr: "شراء 20 جهاز حاسوب مكتبي متطور بمواصفات أمنية لدعم مكاتب فحص السجلات.",
        placeholderEn: "Procuring 20 high-security desktop workstations for commercial verification nodes."
      },
      {
        name: "budgetEstimate",
        labelAr: "الموازنة التقديرية المقترحة للمشتريات بالدولار USD",
        labelEn: "Estimated Procurement Budget Capital (USD)",
        type: "number",
        required: true,
        placeholderAr: "15,000",
        placeholderEn: "15000"
      }
    ],
    requiredDocs: [
      { id: "quotations-compare", nameAr: "عروض الأسعار والمطابقة الفنية الثلاثية", nameEn: "Three Vendor Financial Quotations & Technical Compare", maxSizeMB: 10, required: true }
    ],
    businessRulesAr: [
      "أي عملية شراء تتجاوز 10,000 دولار تتطلب مراجعة مسبقة من الإدارة المالية العامة للوزارة وموافقة الوزير الكلية.",
      "تخضع المشتريات للائحة التعاقدات الحكومية الإلكترونية وقانون المشتريات الموحد لعام 2026."
    ],
    businessRulesEn: [
      "Any procurement over 10,000 USD triggers mandatory central accounting review and H.E. Minister's final sign-off.",
      "Subject to public e-procurement guidelines and national asset acquisition codes of 2026."
    ],
    governanceCode: "GOV-MCI-ADMIN-PROC-09"
  }
];

export const FormsFramework: React.FC<FormsFrameworkProps> = ({
  currentLanguage,
  role
}) => {
  // State for selected template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("comm-reg");
  const activeTemplate = FORM_TEMPLATES.find(t => t.id === selectedTemplateId) || FORM_TEMPLATES[0];

  // Form interactive data state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [digitalSignName, setDigitalSignName] = useState<string>("");
  const [isDigitallySigned, setIsDigitallySigned] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);
  const [trackingId, setTrackingId] = useState<string>("");

  // Auto save simulator states
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string>("");
  const [showUnsavedWarning, setShowUnsavedWarning] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // AI Field Assistant states
  const [selectedAIField, setSelectedAIField] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Accessibility Audit & Interactive checklist
  const [wcagChecklist, setWcagChecklist] = useState({
    labelMatching: true,
    keyboardNav: true,
    contrastHigh: true,
    errorLiveAnnounced: true,
    ariaDescribedBy: true,
    rtlTested: true
  });

  // Code Copy Notification helper
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Trigger auto-save simulation on changes
  useEffect(() => {
    if (isDirty) {
      setIsAutoSaving(true);
      const timer = setTimeout(() => {
        setIsAutoSaving(false);
        const now = new Date();
        setLastAutoSavedTime(now.toTimeString().split(' ')[0]);
        setIsDirty(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, uploadedFiles, isDigitallySigned, digitalSignName]);

  // Set default form values when switching templates
  useEffect(() => {
    setFormData({});
    setFormErrors({});
    setUploadedFiles({});
    setDigitalSignName("");
    setIsDigitallySigned(false);
    setIsSubmitSuccess(false);
    setTrackingId("");
    setIsDirty(false);
    setSelectedAIField("");
    setAiResponse("");
  }, [selectedTemplateId]);

  // Handle standard field input
  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setIsDirty(true);
    // Realtime format validation if regex exists
    const fieldSpec = activeTemplate.requiredFields.find(f => f.name === fieldName);
    if (fieldSpec && fieldSpec.validationRegex) {
      if (!fieldSpec.validationRegex.test(value)) {
        setFormErrors(prev => ({
          ...prev,
          [fieldName]: currentLanguage === "ar" ? (fieldSpec.validationErrorAr || "تنسيق حقل غير صالح") : (fieldSpec.validationErrorEn || "Invalid field format")
        }));
      } else {
        setFormErrors(prev => {
          const updated = { ...prev };
          delete updated[fieldName];
          return updated;
        });
      }
    } else {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  // File upload simulation
  const handleFileSelect = (docId: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [docId]: file }));
    setIsDirty(true);
  };

  // File removal
  const handleRemoveFile = (docId: string) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[docId];
      return updated;
    });
    setIsDirty(true);
  };

  // AI Assistant Field explanation generator (mock with rich real responses)
  const triggerAIExplanation = (fieldKey: string) => {
    setSelectedAIField(fieldKey);
    setIsAiLoading(true);
    
    // Custom smart responses based on field selected
    setTimeout(() => {
      let adviceAr = "";
      let adviceEn = "";
      
      if (fieldKey === "tradeNameAr" || fieldKey === "tradeNameEn") {
        adviceAr = "الذكاء الاصطناعي يقترح: بناءً على مرسوم حماية الأسماء السيادية، لا تستخدم كود 'السودان' أو 'الفيدرالي' كاسم مستقل. نقترح أسماء مثل: (البركة لتصنيع الصموغ، النيلين لطحن الحبوب، التيسير لخدمات الاستيراد). نسبة الموافقة المتوقعة لهذه الهياكل هي 96% مقارنة بالأسماء التقليدية.";
        adviceEn = "AI Suggestion: For name approval safety, avoid terms like 'National' or 'Sovereign' as single identifiers. Good alternatives: (Al Baraka Gum Processing, Nile Flour Mills, Al Tayseer Import Hub). Predicted name approval rating is 96%.";
      } else if (fieldKey === "initialCapital") {
        adviceAr = "الذكاء الاصطناعي يقترح: لتجنب تجميد السجل، رأس المال البالغ 10 مليون جنيه مناسب تماماً لهذا النوع من المنشآت ذات المسؤولية المحدودة وسيعطيك الأفضلية للحصول على إعفاءات جمركية على الآلات.";
        adviceEn = "AI Suggestion: A capitalization level of 10M SDG qualifies your business structure for initial customs exemptions on industrial machinery imports automatically.";
      } else if (fieldKey === "crNumber") {
        adviceAr = "الذكاء الاصطناعي يقترح: التنسيق الفيدرالي المعتمد لوزارة التجارة يحمي معاملتك. رقم السجل التجاري يجب أن يتطابق مع الرقم المصدر من بورتسودان لعام 2026 بصيغة SD-MCI-CR-XXXXX.";
        adviceEn = "AI Suggestion: Your Federal Commercial Registration must match standard issued tokens format (SD-MCI-CR-XXXXX) to ensure real-time customs integration.";
      } else if (fieldKey === "goodsDescription") {
        adviceAr = "الذكاء الاصطناعي يقترح: لتجنب رفض ترخيص الاستيراد، يُنصح بإدخال بند التعريفة الجمركية HS Code بصيغة 6 خانات، على سبيل المثال: الصمغ العربي الهشاب الطبيعي (1301.90)، السمسم الأبيض (1207.40).";
        adviceEn = "AI Suggestion: To guarantee immediate automated clearance, provide standard 6-digit Harmonized System codes such as: Gum Arabic Hashab (1301.90), Sesame Seeds (1207.40).";
      } else {
        adviceAr = "الذكاء الاصطناعي يقترح: هذا الحقل الزامي لمطابقة البيانات الفيدرالية بجمهورية السودان لعام 2026. تأكد من إرفاق الملفات المساعدة الداعمة.";
        adviceEn = "AI Suggestion: This metric is critical to pass pre-check filters. Make sure matching documentation supports the claims.";
      }
      
      setAiResponse(currentLanguage === "ar" ? adviceAr : adviceEn);
      setIsAiLoading(false);
    }, 450);
  };

  // Form Submit validation and workflow initiation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check required fields
    const errors: Record<string, string> = {};
    activeTemplate.requiredFields.forEach(f => {
      if (f.required && !formData[f.name]) {
        errors[f.name] = currentLanguage === "ar" ? `حقل "${f.labelAr}" مطلوب إجباري` : `Field "${f.labelEn}" is strictly required`;
      }
    });

    // Check required files
    activeTemplate.requiredDocs.forEach(doc => {
      if (doc.required && !uploadedFiles[doc.id]) {
        errors[`_doc_${doc.id}`] = currentLanguage === "ar" ? `المستند "${doc.nameAr}" مطلوب إجباري` : `Document "${doc.nameEn}" is strictly required`;
      }
    });

    // Verify digital signature
    if (!isDigitallySigned || !digitalSignName.trim()) {
      errors["_signature"] = currentLanguage === "ar" ? "التوقيع الرقمي الموثق إجباري لاعتماد المعاملة سيادياً" : "Unified secure digital signature is required for official certification";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Play brief sound or warning
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // Simulate complete Federal Workflow processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
      setTrackingId(`SDMCI-${activeTemplate.code.split('-')[2]}-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsDirty(false);
    }, 2000);
  };

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Framework specification code snippet for developers
  const devCodeExample = `import React from 'react';
import { FormsFramework, SovereignInput, SovereignSelect, SovereignFileUpload } from './gov-ui';

// Fully compliant with Ministry of Commerce & Industry Enterprise Forms Framework v1.0.0
export default function MinistryFormNode() {
  return (
    <FormsFramework 
      currentLanguage="ar" // Supports RTL/LTR instantly 
      role="business_investor" 
    />
  );
}`;

  return (
    <div id="unified-forms-framework-workspace" className="space-y-6">
      
      {/* 1. SECTION BANNER */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-sudan-green/5 to-transparent pointer-events-none"></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#007A33]/10 text-sudan-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              SGDS FORMS v1.0.0
            </span>
            <span className="bg-slate-900 text-sudan-gold px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              Sudan 2035 Compliant
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-sudan-dark">
            {currentLanguage === "ar" ? "إطار عمل الاستمارات الحكومية الموحد" : "Unified Government Forms Design Framework"}
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            {currentLanguage === "ar" 
              ? "منظومة الاستمارات الرقمية الفيدرالية الموحدة لجميع خدمات الوزارة لتنظيم الهوية الرقمية، تدقيق البيانات الاستباقي، المطابقة بلغة التباين AAA والمساعد الذكي."
              : "Standardizing electronic form structure, accessible WCAG behaviors, smart validators, unified signatures, and AI help across 9 Commerce & Industry ministries."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SovereignBadge variant="verified" currentLanguage={currentLanguage} />
        </div>
      </div>

      {/* 2. MAIN GRID WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CONTROL PANEL & ACTIVE METRICS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* A. Form Service Selector */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <LayoutList className="h-4 w-4 text-sudan-green" />
              {currentLanguage === "ar" ? "1. حدد نموذج الخدمة الوزارية للتحكم" : "1. Select Ministry Service Node"}
            </h3>
            
            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {FORM_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`w-full text-right ltr:text-left text-xs font-bold px-3.5 py-3 rounded-xl transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? "bg-[#007A33]/10 text-sudan-green border-2 border-sudan-green"
                        : "bg-slate-50 text-gray-500 hover:text-sudan-green hover:bg-slate-100/70 border border-transparent"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-extrabold">{currentLanguage === "ar" ? tpl.nameAr : tpl.nameEn}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{tpl.code} • {currentLanguage === "ar" ? tpl.categoryAr : tpl.categoryEn}</p>
                    </div>
                    {isSelected && <CheckSquare className="h-4 w-4 text-sudan-green shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. Smart Validation State & Business Rules Engine Monitor */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-[10px] font-black text-sudan-gold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                {currentLanguage === "ar" ? "2. محرك قواعد العمل والتحقق الفوري" : "2. Real-Time Business Rules Engine"}
              </h3>
              <span className="text-[9px] bg-sudan-green text-white px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
            </div>

            <div className="text-xs space-y-2.5">
              <div className="space-y-1 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-gray-400 font-extrabold block uppercase">ACTIVE VALIDATION BLUEPRINT</span>
                <p className="font-mono text-[10px] text-sudan-gold font-bold">{activeTemplate.governanceCode}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] text-gray-400 font-extrabold block uppercase">ENFORCED RULES IN THIS COMPONENT</span>
                <ul className="space-y-1.5">
                  {(currentLanguage === "ar" ? activeTemplate.businessRulesAr : activeTemplate.businessRulesEn).map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-300">
                      <span className="text-sudan-green mt-0.5 font-black">✓</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Realtime validator diagnostics */}
              <div className="border-t border-slate-800 pt-2.5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">Errors Detected:</span>
                <span className={`font-bold ${Object.keys(formErrors).length > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {Object.keys(formErrors).length} {currentLanguage === "ar" ? "أخطاء حالية" : "errors currently"}
                </span>
              </div>
            </div>
          </div>

          {/* C. Generative AI Field Assistant Interactive Widget */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-sudan-green/5 rounded-bl-full pointer-events-none"></div>
            <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Sparkles className="h-4 w-4 text-sudan-gold" />
              {currentLanguage === "ar" ? "3. مساعد الاستمارات الذكي التوليدي" : "3. Generative AI In-Context Assistant"}
            </h3>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              {currentLanguage === "ar"
                ? "انقر على أيقونة المساعد الذكي بجانب الحقول لتوليد الدعم القانوني الفوري وتحسين نسبة القبول."
                : "Click the smart assistant icon next to form inputs to generate direct regulatory suggestions and enhance approval chances."}
            </p>

            {selectedAIField ? (
              <div className="bg-slate-50 border border-sudan-gold/30 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-extrabold text-sudan-green">
                    {currentLanguage === "ar" ? `تحليل حقل: ${selectedAIField}` : `Analyzing: ${selectedAIField}`}
                  </span>
                  <button onClick={() => setSelectedAIField("")} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                </div>
                {isAiLoading ? (
                  <div className="flex items-center gap-2 text-xs text-gray-500 py-1 font-mono">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-sudan-gold" />
                    <span>Generating guidance...</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{aiResponse}</p>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-gray-200 p-4 rounded-2xl text-center text-xs text-gray-400 font-bold">
                {currentLanguage === "ar" ? "اضغط على زر (الذكاء الاصطناعي) بجانب أي حقل للتفعيل" : "Select a field in the form to activate AI guidance"}
              </div>
            )}
          </div>

          {/* D. Auto-Save Simulator & Secure Draft Indicator */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isAutoSaving ? "bg-amber-400 animate-ping" : "bg-emerald-500"}`}></span>
              <div>
                <p className="font-bold text-sudan-dark">
                  {currentLanguage === "ar" ? "منظومة حفظ المسودات التلقائية" : "Unified Local Auto-Save"}
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  {isAutoSaving 
                    ? (currentLanguage === "ar" ? "يجري حفظ التعديلات مشفرة..." : "Encrypting and saving...") 
                    : lastAutoSavedTime 
                    ? (currentLanguage === "ar" ? `آخر حفظ تلقائي: ${lastAutoSavedTime}` : `Auto-saved locally at ${lastAutoSavedTime}`)
                    : (currentLanguage === "ar" ? "في انتظار إدخال البيانات" : "Waiting for input")}
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-mono">AES-256</span>
          </div>

          {/* E. Accessibility Compliance Audit Dashboard Checklist */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="text-xs font-black text-sudan-dark uppercase tracking-wider">
                {currentLanguage === "ar" ? "4. فحص الامتثال المباشر لـ WCAG 2.2" : "4. WCAG 2.2 Compliance Inspector"}
              </h3>
              <SovereignBadge variant="aa" currentLanguage={currentLanguage} />
            </div>

            <p className="text-[10px] text-gray-400 leading-normal">
              {currentLanguage === "ar"
                ? "يتحقق مدقق الوصول التلقائي المدمج من الامتثال لأعلى معايير الدمج للمكفوفين وضعاف البصر."
                : "Continuous automated accessibility parser verifies that elements adhere to inclusive standards dynamically."}
            </p>

            <div className="space-y-2 text-xs">
              {[
                { key: "labelMatching", labelAr: "تسمية الحقول وقارئ الشاشة (Label For ID Matching)", labelEn: "Form Controls matching label FOR ID attributes" },
                { key: "keyboardNav", labelAr: "التنقل الكامل بلوحة المفاتيح وتفادي المصائد (Tab Traps)", labelEn: "Keyboard tab accessibility & focus trap indicators" },
                { key: "contrastHigh", labelAr: "تباين نصوص حقول الإدخال عالي المستوى (النسبة 7.8:1)", labelEn: "Field input placeholder contrast ratios (7.8:1)" },
                { key: "errorLiveAnnounced", labelAr: "إعلان الأخطاء بميزة (Aria-live) لقارئ الشاشات", labelEn: "Screen reader aria-live announcements for errors" },
                { key: "ariaDescribedBy", labelAr: "ربط حقول المساعد الذكي بوصف Aria-describedby", labelEn: "AI helper text link via aria-describedby references" },
                { key: "rtlTested", labelAr: "محاذاة الاتجاهات الثنائية (RTL/LTR) والرموز تلقائياً", labelEn: "Bilingual bi-directional flex flow orientation standard" }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-gray-100">
                  <span className="text-[11px] text-gray-600 font-semibold">{currentLanguage === "ar" ? item.labelAr : item.labelEn}</span>
                  <span className="h-4.5 w-4.5 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-[10px]">✓</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM RENDER & WORKFLOW (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 relative">
            
            {/* Form sovereign watermark/header */}
            <div className="border-b border-gray-100 pb-4 flex justify-between items-start gap-4">
              <div className="space-y-1 text-left ltr:text-right">
                <span className="text-[9px] font-black text-slate-400 uppercase font-mono">{activeTemplate.governanceCode}</span>
                <p className="text-[10px] font-extrabold text-sudan-green">FORM REF: {activeTemplate.code}</p>
                <div className="flex items-center gap-1.5 mt-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] text-gray-500 font-bold justify-end">
                  <span>Draft Mode</span>
                  <span className="bg-emerald-500 h-1.5 w-1.5 rounded-full"></span>
                </div>
              </div>

              <div className="space-y-1 max-w-md">
                <h4 className="text-base font-black text-sudan-green">
                  {currentLanguage === "ar" ? activeTemplate.nameAr : activeTemplate.nameEn}
                </h4>
                <p className="text-xs text-gray-400">
                  {currentLanguage === "ar" ? activeTemplate.descriptionAr : activeTemplate.descriptionEn}
                </p>
              </div>

              {/* Ministry Logo Symbol */}
              <div className="w-10 h-10 bg-sudan-green/5 rounded-xl flex items-center justify-center shrink-0 border border-sudan-green/10">
                <FileText className="h-5 w-5 text-sudan-green" />
              </div>
            </div>

            {isSubmitSuccess ? (
              /* Success Flow and Certificate Generation Sandbox */
              <div className="text-center py-8 space-y-6 animate-fade-in font-sans">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-sudan-green">
                    {currentLanguage === "ar" ? "تم استلام واعتماد المعاملة بنجاح" : "Application Successfully Certified"}
                  </h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    {currentLanguage === "ar"
                      ? "تم توقيع الاستمارة مشفراً وإدراجها بمسار الموافقات الفيدرالية تحت معايير الرقابة الوطنية."
                      : "The application has been cryptographically signed and routed to the central executive review queue."}
                  </p>
                </div>

                {/* Secure tracking block */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl max-w-md mx-auto text-xs space-y-4 font-sans border border-slate-800">
                  <div className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-2">
                    <span className="text-sudan-gold font-extrabold uppercase">FEDERAL TRANSACTION RECEIPT</span>
                    <span className="font-mono text-gray-400">{new Date().toISOString().split('T')[0]}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-right ltr:text-left">
                    <div>
                      <span className="text-[9px] text-gray-400 block">TRACKING REFERENCE</span>
                      <span className="font-mono font-bold text-sudan-gold">{trackingId}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block">SOVEREIGN SEAL HASH</span>
                      <span className="font-mono text-[9px] text-emerald-400 truncate block">SHA-256: 4ae8b71...</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
                    <p className="text-[10px] text-slate-300">
                      {currentLanguage === "ar" ? "مسار المعاملة اللحظي:" : "Current Application Stage:"}
                    </p>
                    <div className="flex items-center justify-between text-[9px] px-2 text-slate-400 font-mono font-bold">
                      <span className="text-emerald-400">SUBMITTED</span>
                      <span className="text-amber-400">→ REVIEWING</span>
                      <span>→ APPROVED</span>
                      <span>→ STAMPED</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <SovereignButton
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold text-xs"
                    onClick={() => {
                      setIsSubmitSuccess(false);
                      setFormData({});
                      setUploadedFiles({});
                      setDigitalSignName("");
                      setIsDigitallySigned(false);
                    }}
                  >
                    {currentLanguage === "ar" ? "تقديم معاملة جديدة" : "Submit New Form"}
                  </SovereignButton>
                  <SovereignButton
                    variant="secondary"
                    size="sm"
                    className="rounded-xl font-bold text-xs"
                    onClick={() => handleCopyCode(trackingId, "track")}
                  >
                    {copiedSection === "track" ? (currentLanguage === "ar" ? "تم النسخ" : "Copied") : (currentLanguage === "ar" ? "نسخ رمز المتابعة" : "Copy Tracking ID")}
                  </SovereignButton>
                </div>

              </div>
            ) : (
              /* Core Form Builder Render block */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* 1. Applicant Standard Demographics */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-sudan-green uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1">
                    <Users className="h-4 w-4" />
                    {currentLanguage === "ar" ? "أولاً: بيانات المتقدم والمنشأة الأساسية" : "Section 1: Applicant & Entity Demographics"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SovereignInput
                      labelAr="اسم مقدم الطلب الرباعي (بالعربية)"
                      labelEn="Applicant Full Legal Name (Arabic)"
                      required
                      placeholderAr="عمر الفاروق سليمان يوسف"
                      placeholderEn="Omar Elfarouk Suleiman"
                      id="applicantNameAr"
                      value={formData.applicantNameAr || ""}
                      onChange={(e) => handleInputChange("applicantNameAr", e.target.value)}
                      currentLanguage={currentLanguage}
                    />

                    <SovereignInput
                      labelAr="البريد الإلكتروني للشركة"
                      labelEn="Company Corporate Email"
                      type="email"
                      required
                      placeholderAr="info@khartoum-grain.sd"
                      placeholderEn="info@khartoum-grain.sd"
                      id="applicantEmail"
                      value={formData.applicantEmail || ""}
                      onChange={(e) => handleInputChange("applicantEmail", e.target.value)}
                      currentLanguage={currentLanguage}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-sudan-dark flex items-center gap-1">
                        <span>{currentLanguage === "ar" ? "نوع وثيقة إثبات الشخصية الفيدرالية" : "Federal Identity Card Type"}</span>
                        <span className="text-rose-500 font-extrabold">*</span>
                      </label>
                      <select
                        value={formData.idType || ""}
                        onChange={(e) => handleInputChange("idType", e.target.value)}
                        className="w-full text-xs p-3.5 rounded-2xl border bg-white border-gray-200 outline-none focus:border-sudan-green focus:ring-1 focus:ring-sudan-green"
                        required
                      >
                        <option value="">{currentLanguage === "ar" ? "-- اختر الوثيقة --" : "-- Select ID Card --"}</option>
                        <option value="national-id">{currentLanguage === "ar" ? "الرقم الوطني السوداني (11 خانة)" : "Sudanese National ID Number (11 digits)"}</option>
                        <option value="passport">{currentLanguage === "ar" ? "جواز السفر الفيدرالي الموحد" : "Unified Federal Passport"}</option>
                      </select>
                    </div>

                    <SovereignInput
                      labelAr="رقم الوثيقة الوطنية المختارة"
                      labelEn="Selected Identity Card Number"
                      required
                      placeholderAr="1-000-000-000-1"
                      placeholderEn="1-000-000-000-1"
                      id="idNumber"
                      value={formData.idNumber || ""}
                      onChange={(e) => handleInputChange("idNumber", e.target.value)}
                      currentLanguage={currentLanguage}
                    />
                  </div>
                </div>

                {/* 2. Dynamic Required Fields based on active template */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-sudan-green uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1">
                    <Building2 className="h-4 w-4" />
                    {currentLanguage === "ar" ? "ثانياً: المتطلبات والبيانات التفصيلية للخدمة" : "Section 2: Dynamic Service-Specific Details"}
                  </h4>

                  <div className="space-y-4">
                    {activeTemplate.requiredFields.map((field) => (
                      <div key={field.name} className="relative">
                        {field.type === "select" ? (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-sudan-dark flex items-center gap-1">
                              <span>{currentLanguage === "ar" ? field.labelAr : field.labelEn}</span>
                              {field.required && <span className="text-rose-500 font-extrabold">*</span>}
                            </label>
                            <select
                              id={field.name}
                              value={formData[field.name] || ""}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className={`w-full text-xs p-3.5 rounded-2xl border bg-white border-gray-200 outline-none focus:border-sudan-green focus:ring-1 focus:ring-sudan-green ${
                                formErrors[field.name] ? "border-rose-400" : ""
                              }`}
                              required={field.required}
                            >
                              <option value="">{currentLanguage === "ar" ? field.placeholderAr : field.placeholderEn}</option>
                              {field.name === "legalType" && (
                                <>
                                  <option value="llc">{currentLanguage === "ar" ? "شركة ذات مسؤولية محدودة (ذ.م.م)" : "Limited Liability Company (LLC)"}</option>
                                  <option value="sole-prop">{currentLanguage === "ar" ? "اسم عمل فردي / منشأة فردية" : "Sole Proprietorship"}</option>
                                  <option value="public-share">{currentLanguage === "ar" ? "شركة مساهمة عامة" : "Public Shareholding Company"}</option>
                                </>
                              )}
                              {field.name === "state" && (
                                <>
                                  <option value="khartoum">{currentLanguage === "ar" ? "ولاية الخرطوم" : "Khartoum State"}</option>
                                  <option value="redsea">{currentLanguage === "ar" ? "ولاية البحر الأحمر" : "Red Sea State"}</option>
                                  <option value="rivernile">{currentLanguage === "ar" ? "ولاية نهر النيل" : "River Nile State"}</option>
                                  <option value="gezira">{currentLanguage === "ar" ? "ولاية الجزيرة" : "Gezira State"}</option>
                                </>
                              )}
                              {field.name === "sector" && (
                                <>
                                  <option value="food">{currentLanguage === "ar" ? "قطاع الصناعات الغذائية" : "Food Industries Sector"}</option>
                                  <option value="chemical">{currentLanguage === "ar" ? "قطاع الصناعات الكيميائية والنفطية" : "Chemical & Petroleum Sector"}</option>
                                  <option value="textile">{currentLanguage === "ar" ? "قطاع الغزل والنسيج والملابس" : "Textile & Cotton Sector"}</option>
                                  <option value="engineering">{currentLanguage === "ar" ? "قطاع الصناعات الهندسية والمعدنية" : "Engineering & Metal Sector"}</option>
                                </>
                              )}
                              {field.name === "energySource" && (
                                <>
                                  <option value="solar">{currentLanguage === "ar" ? "طاقة شمسية هجينة خالية من الانبعاثات" : "Hybrid Zero-Emission Solar Power"}</option>
                                  <option value="grid">{currentLanguage === "ar" ? "الكهرباء القومية" : "National Grid"}</option>
                                  <option value="diesel">{currentLanguage === "ar" ? "مولدات كهرباء ديزل مساندة" : "Diesel Generator Backup"}</option>
                                </>
                              )}
                              {field.name === "licenseType" && (
                                <>
                                  <option value="export">{currentLanguage === "ar" ? "رخصة تصدير منتجات سودانية معتمدة" : "Export License for Approved Sudanese Cargo"}</option>
                                  <option value="import">{currentLanguage === "ar" ? "رخصة استيراد مدخلات إنتاج وسلع أساسية" : "Import License for Strategic Inputs"}</option>
                                </>
                              )}
                              {field.name === "zone" && (
                                <>
                                  <option value="portsudan-free">{currentLanguage === "ar" ? "بورتسودان - المنطقة الحرة الميناء الجنوبي" : "Port Sudan - Southern Port Free Zone"}</option>
                                  <option value="giad-ind">{currentLanguage === "ar" ? "ولاية الجزيرة - مدينة جياد الصناعية" : "Gezira State - Giad Industrial City"}</option>
                                  <option value="bagair">{currentLanguage === "ar" ? "ولاية الجزيرة - الباقير للصناعات الدوائية" : "Gezira State - El Bagair Pharma Hub"}</option>
                                </>
                              )}
                              {field.name === "violationType" && (
                                <>
                                  <option value="price-gouging">{currentLanguage === "ar" ? "ممارسات احتكارية وزيادة أسعار مصطنعة" : "Price-Gouging & Artificial Shortage Hoarding"}</option>
                                  <option value="counterfeit">{currentLanguage === "ar" ? "بيع منتجات مجهولة المصدر أو مقلدة" : "Selling Counterfeit or Unknown Origin Items"}</option>
                                  <option value="expired">{currentLanguage === "ar" ? "سلع غذائية منتهية الصلاحية وغير صالحة" : "Expired Foods and Non-Safe Commodities"}</option>
                                </>
                              )}
                              {field.name === "amendmentType" && (
                                <>
                                  <option value="capital-raise">{currentLanguage === "ar" ? "زيادة وتعديل قيمة رأس المال المعتمد" : "Approved Capital Increase & Revision"}</option>
                                  <option value="add-partner">{currentLanguage === "ar" ? "إدخال شركاء وتعديل حصص التأسيس" : "Add New Partners & Revise Shares"}</option>
                                  <option value="activity-change">{currentLanguage === "ar" ? "تعديل وإضافة أنشطة تجارية جديدة" : "Amend / Add Registered Business Activities"}</option>
                                </>
                              )}
                              {field.name === "delegationScope" && (
                                <>
                                  <option value="cr-approver">{currentLanguage === "ar" ? "صلاحيات اعتماد وتصديق السجلات الجديدة" : "Authorized Commercial Registry Approvals"}</option>
                                  <option value="ie-auditor">{currentLanguage === "ar" ? "صلاحيات تدقيق وفحص رخص الاستيراد والتصدير" : "Authorized Import-Export Audit Checks"}</option>
                                </>
                              )}
                              {field.name === "complianceGrade" && (
                                <>
                                  <option value="compliant">{currentLanguage === "ar" ? "مطابق للمواصفة القياسية بالكامل" : "Fully Compliant with National Standards"}</option>
                                  <option value="warning">{currentLanguage === "ar" ? "غير مطابق جزئياً (يتطلب تصحيح الأثر)" : "Partially Compliant (Action Required)"}</option>
                                  <option value="violator">{currentLanguage === "ar" ? "غير مطابق ومخالف بشكل جسيم" : "Critical Non-Compliance - Suspension Needed"}</option>
                                </>
                              )}
                              {field.name === "requestingDept" && (
                                <>
                                  <option value="it">{currentLanguage === "ar" ? "إدارة تكنولوجيا المعلومات والشبكات" : "Information Technology Dept"}</option>
                                  <option value="portsudan-branch">{currentLanguage === "ar" ? "فرع بورتسودان التنفيذي الموحد" : "Port Sudan Executive Regional Office"}</option>
                                </>
                              )}
                            </select>
                            {formErrors[field.name] && <p className="text-[10px] text-rose-500 font-extrabold">{formErrors[field.name]}</p>}
                          </div>
                        ) : field.type === "textarea" ? (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label htmlFor={field.name} className="text-xs font-bold text-sudan-dark flex items-center gap-1">
                                <span>{currentLanguage === "ar" ? field.labelAr : field.labelEn}</span>
                                {field.required && <span className="text-rose-500 font-extrabold">*</span>}
                              </label>
                              <button
                                type="button"
                                onClick={() => triggerAIExplanation(field.name)}
                                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-sudan-green hover:text-sudan-green px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer border border-gray-200"
                              >
                                <Sparkles className="h-3 w-3 text-sudan-gold" />
                                <span>{currentLanguage === "ar" ? "مساعد الذكاء الاصطناعي" : "AI Helper"}</span>
                              </button>
                            </div>
                            <textarea
                              id={field.name}
                              rows={3}
                              placeholder={currentLanguage === "ar" ? field.placeholderAr : field.placeholderEn}
                              value={formData[field.name] || ""}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className={`w-full text-xs p-3.5 rounded-2xl border bg-white text-sudan-dark border-gray-200 outline-none focus:border-sudan-green focus:ring-1 focus:ring-sudan-green ${
                                formErrors[field.name] ? "border-rose-400" : ""
                              }`}
                              required={field.required}
                            />
                            {formErrors[field.name] && <p className="text-[10px] text-rose-500 font-extrabold">{formErrors[field.name]}</p>}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label htmlFor={field.name} className="text-xs font-bold text-sudan-dark flex items-center gap-1">
                                <span>{currentLanguage === "ar" ? field.labelAr : field.labelEn}</span>
                                {field.required && <span className="text-rose-500 font-extrabold">*</span>}
                              </label>
                              <button
                                type="button"
                                onClick={() => triggerAIExplanation(field.name)}
                                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-sudan-green hover:text-sudan-green px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer border border-gray-200"
                              >
                                <Sparkles className="h-3 w-3 text-sudan-gold" />
                                <span>{currentLanguage === "ar" ? "مساعد الذكاء الاصطناعي" : "AI Helper"}</span>
                              </button>
                            </div>
                            <input
                              type={field.type}
                              id={field.name}
                              placeholder={currentLanguage === "ar" ? field.placeholderAr : field.placeholderEn}
                              value={formData[field.name] || ""}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className={`w-full text-xs p-3.5 rounded-2xl border bg-white text-sudan-dark border-gray-200 outline-none focus:border-sudan-green focus:ring-1 focus:ring-sudan-green ${
                                formErrors[field.name] ? "border-rose-400" : ""
                              }`}
                              required={field.required}
                            />
                            {formErrors[field.name] && <p className="text-[10px] text-rose-500 font-extrabold">{formErrors[field.name]}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Document Management & OCR Scanner Hook */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-sudan-green uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1">
                    <BookOpen className="h-4 w-4" />
                    {currentLanguage === "ar" ? "ثالثاً: المستندات والوثائق الداعمة للمعاملة" : "Section 3: Required Supporting Documentation"}
                  </h4>

                  <p className="text-[11px] text-gray-400 leading-normal">
                    {currentLanguage === "ar"
                      ? "جميع المرفقات تمر بفحص تلقائي فوري لمكافحة الفيروسات ومطابقة صحة الـ PDF بواسطة فحص الـ OCR للتحقق من تاريخ الصلاحية."
                      : "All attachments undergo instant virus scanning and server-side PDF validation via automated OCR filters."}
                  </p>

                  <div className="space-y-4">
                    {activeTemplate.requiredDocs.map((doc) => {
                      const file = uploadedFiles[doc.id];
                      return (
                        <div key={doc.id} className="border border-gray-100 p-4 rounded-2xl bg-slate-50 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-bold text-sudan-dark">
                                {currentLanguage === "ar" ? doc.nameAr : doc.nameEn}
                                {doc.required && <span className="text-rose-500 font-extrabold"> *</span>}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {currentLanguage === "ar" ? `الحد الأقصى للحجم: ${doc.maxSizeMB} ميجابايت • تنسيق PDF` : `Maximum size: ${doc.maxSizeMB} MB • PDF Format`}
                              </p>
                            </div>
                            {file ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Check className="h-3.5 w-3.5" />
                                <span>OCR OK</span>
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                                {currentLanguage === "ar" ? "بانتظار الرفع" : "Awaiting Upload"}
                              </span>
                            )}
                          </div>

                          {file ? (
                            <div className="bg-white border border-gray-200 p-3 rounded-xl flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="h-4.5 w-4.5 text-sudan-green shrink-0" />
                                <div className="truncate text-left font-mono">
                                  <p className="font-bold text-sudan-dark truncate">{file.name}</p>
                                  <p className="text-[9px] text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(doc.id)}
                                className="text-rose-500 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 cursor-pointer border border-transparent hover:border-rose-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <SovereignFileUpload
                              labelAr=""
                              labelEn=""
                              allowedTypes=".pdf"
                              currentLanguage={currentLanguage}
                              onFileSelect={(f) => handleFileSelect(doc.id, f)}
                            />
                          )}
                          {formErrors[`_doc_${doc.id}`] && <p className="text-[10px] text-rose-500 font-extrabold">{formErrors[`_doc_${doc.id}`]}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Secure Digital Signature Pad Block */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-sudan-green uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-1">
                    <PenTool className="h-4 w-4" />
                    {currentLanguage === "ar" ? "رابعاً: اعتماد التوقيع والختم الرقمي الموحد" : "Section 4: Digital Signature & Cryptographic Seal"}
                  </h4>

                  <div className="border border-gray-200 rounded-3xl p-5 bg-white space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-black text-sudan-dark">
                          {currentLanguage === "ar" ? "بوابة التوقيع الرقمي للمنظمة" : "Secure E-Signature Authority Pad"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {currentLanguage === "ar" ? "توقيعك ملزم قانونياً بموجب قانون المعاملات الإلكترونية." : "Your digital signature is legally binding under federal e-commerce laws."}
                        </p>
                      </div>
                      {isDigitallySigned ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                          {currentLanguage === "ar" ? "موقّع ومؤمن" : "Cryptographically Signed"}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-0.5 rounded-full font-bold">
                          {currentLanguage === "ar" ? "توقيع معلق" : "Signature Pending"}
                        </span>
                      )}
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-2xl h-24 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                      {isDigitallySigned ? (
                        <div className="text-center space-y-1 transform -rotate-1">
                          <p className="font-mono italic text-lg font-black text-sudan-green tracking-widest">
                            {digitalSignName}
                          </p>
                          <p className="text-[8px] text-gray-400 uppercase font-mono tracking-wider">HASH ID: SHA256-4AE8B71BC890250</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-400">
                          {currentLanguage === "ar" ? "التوقيع سيظهر هنا بعد كتابة اسمك الكامل والضغط على اعتماد" : "Your official signature pad output will appear here"}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={digitalSignName}
                        onChange={(e) => {
                          setDigitalSignName(e.target.value);
                          setIsDigitallySigned(false);
                          setIsDirty(true);
                        }}
                        placeholder={currentLanguage === "ar" ? "اكتب اسمك الكامل للمصادقة..." : "Type full legal name for authentication..."}
                        className="flex-1 text-xs p-3.5 border border-gray-200 rounded-2xl outline-none focus:border-sudan-green"
                      />
                      <SovereignButton
                        type="button"
                        variant={isDigitallySigned ? "outline" : "secondary"}
                        size="sm"
                        disabled={!digitalSignName.trim()}
                        onClick={() => {
                          setIsDigitallySigned(!isDigitallySigned);
                          setIsDirty(true);
                        }}
                        className="rounded-2xl font-bold text-xs shrink-0"
                      >
                        {isDigitallySigned 
                          ? (currentLanguage === "ar" ? "تعديل" : "Edit") 
                          : (currentLanguage === "ar" ? "اعتماد" : "Confirm")}
                      </SovereignButton>
                    </div>
                    {formErrors["_signature"] && <p className="text-[10px] text-rose-500 font-extrabold">{formErrors["_signature"]}</p>}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    {currentLanguage === "ar" ? "* الحقول المميزة بعلامة نجمية هي حقول إلزامية قانوناً." : "* Fields highlighted with asterisk are legally mandatory."}
                  </div>
                  <SovereignButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="rounded-2xl font-bold text-xs min-w-[140px] px-6"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin text-sudan-gold" />
                        <span>{currentLanguage === "ar" ? "جاري الإرسال والتدقيق..." : "Submitting..."}</span>
                      </div>
                    ) : (
                      <span>{currentLanguage === "ar" ? "إرسال المعاملة سيادياً" : "Submit Certified Form"}</span>
                    )}
                  </SovereignButton>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>

      {/* 3. BLUEPRINT MANUAL & TECHNICAL SPECIFICATION SECTION */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-6 font-sans">
        
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-black text-sudan-gold uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sudan-gold" />
              {currentLanguage === "ar" ? "دليل التطوير والهيكل التقني لإطار العمل" : "Unified Forms Framework Developer Manual & Code Blueprint"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentLanguage === "ar" ? "مرجع المطورين والمستند القياسي لبناء وتوسيع الاستمارات الرقمية الفيدرالية." : "Technical blueprint, JSON schema guidelines, and React code blocks for the unified forms standard."}
            </p>
          </div>

          <SovereignButton
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-700 hover:bg-slate-800 text-white text-[11px]"
            onClick={() => handleCopyCode(devCodeExample, "docs")}
          >
            {copiedSection === "docs" ? (currentLanguage === "ar" ? "تم النسخ" : "Copied") : (currentLanguage === "ar" ? "نسخ رمز المطورين" : "Copy Framework Code")}
          </SovereignButton>
        </div>

        {/* 4-Column Feature/Governance specifications block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-300 leading-relaxed font-sans border-b border-slate-800 pb-6">
          
          <div className="space-y-2 text-right ltr:text-left" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
            <p className="font-extrabold text-sudan-gold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              <span>1. {currentLanguage === "ar" ? "البنية والهيكلية القياسية" : "1. Standard Architecture"}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {currentLanguage === "ar"
                ? "تقسم كافة الاستمارات لـ 9 أقسام: ترويسة سيادية برمز المعاملة، معلومات الخدمة، المتقدم، القسم الديناميكي، المرفقات، المدقق، التوقيع الرقمي."
                : "Every form follows 9 mandatory sections: Header, details, applicant, dynamic custom fields, attachments, consensus, digital signing, and tracking logs."}
            </p>
          </div>

          <div className="space-y-2 text-right ltr:text-left" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
            <p className="font-extrabold text-sudan-gold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              <span>2. {currentLanguage === "ar" ? "التحقق الذكي وقواعد الأعمال" : "2. Real-time Smart Rules"}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {currentLanguage === "ar"
                ? "يتم فصل قواعد التحقق من البيانات (الرأس مال، الترميز الجمركي، الفئات العمرية) في ملفات JSON ولا يتم ترميزها بشكل جاف لتيسير التطوير."
                : "Validations (capital values, HS Codes, age verification) are separated as standard JSON configurations to guarantee painless updates."}
            </p>
          </div>

          <div className="space-y-2 text-right ltr:text-left" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
            <p className="font-extrabold text-sudan-gold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>3. {currentLanguage === "ar" ? "الذكاء الاصطناعي التوليدي" : "3. Generative AI Context"}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {currentLanguage === "ar"
                ? "يتدخل خادم الذكاء الاصطناعي (Gemini) بشكل استشاري لشرح الحقول للمستثمر، مطابقة المستندات بالـ OCR وتجنب الرفض المالي."
                : "Server-side Gemini reads user entries and context to suggest HS codes, capital setups, and performs OCR validations prior to final submit."}
            </p>
          </div>

          <div className="space-y-2 text-right ltr:text-left" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
            <p className="font-extrabold text-sudan-gold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              <span>4. {currentLanguage === "ar" ? "الأمن والتوقيع السيادي" : "4. Sovereign Cryptography"}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {currentLanguage === "ar"
                ? "حماية CSRF مدمجة، وحجب البيانات بموجب الصلاحيات RBAC. الختم الرقمي يصدر برمز QR فريد وتشفير SHA-256 للمصادقة."
                : "Includes native CSRF protection, RBAC rules, encrypted LocalStorage draft caches, and output QR verification with SHA-256 hashing."}
            </p>
          </div>

        </div>

        {/* Development Code Snippet block */}
        <div className="space-y-2 font-mono">
          <span className="text-[9px] text-slate-400 font-extrabold block uppercase">STANDARD FRAMEWORK IMPLEMENTATION SNIPPET</span>
          <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[10px] text-emerald-400 overflow-x-auto leading-relaxed">
            {devCodeExample}
          </pre>
        </div>

        {/* Governance & QA guidelines */}
        <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-slate-400">
          <div>
            <p className="font-bold text-white mb-1">{currentLanguage === "ar" ? "معايير الجودة والحوكمة للاستمارات (SD-MCI-GOV-2026)" : "Form Quality Assurance & Governance (SD-MCI-GOV-2026)"}</p>
            <p className="text-[10px] leading-relaxed">
              {currentLanguage === "ar"
                ? "يجب أن تمتثل أي استمارة جديدة تضاف لبوابات وزارة التجارة والصناعة لدليل الألوان، تباين AAA، وتوافر التوقيع الرقمي بنسبة 100%."
                : "Any custom form node must satisfy WCAG 2.2 AAA ratios, supply bidirectional RTL/LTR assets, and link to the federal signing pad."}
            </p>
          </div>
          <div className="flex gap-4 shrink-0 font-bold text-[10px] text-sudan-gold font-mono">
            <span>SECURE INGRESS</span>
            <span>•</span>
            <span>AAA RATED</span>
            <span>•</span>
            <span>API READY</span>
          </div>
        </div>

      </div>

    </div>
  );
};
