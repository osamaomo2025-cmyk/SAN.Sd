/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  InnovatorRegistryRecord, ResearchProject, IpRecord, 
  TechTransferAsset, UniversityIndustryPartnership, FundApplication, 
  InnovationChallenge, ExpertProfile, KnowledgeDoc, WorkspaceProject, GisInnovationNode 
} from "./InnovationTypes";

// Pre-seeded National Innovator Registry
export const initialInnovatorRecords: InnovatorRegistryRecord[] = [
  {
    id: "rec-1",
    nii: "SD-NII-22102",
    nameAr: "جامعة الخرطوم - مكتب نقل التكنولوجيا",
    nameEn: "University of Khartoum - Technology Transfer Office",
    type: "university",
    representative: "أ.د. سمية أبو كشوة",
    email: "tto@uofk.edu.sd",
    phone: "+249155512211",
    state: "state-khartoum",
    city: "الخرطوم الوسطى",
    specializationAr: "البحوث الأكاديمية متعددة التخصصات، الصيدلة، والهندسة الزراعية",
    specializationEn: "Interdisciplinary academic research, pharmaceutical, and agronomy",
    status: "verified",
    createdAt: "2026-01-10T10:00:00Z",
    auditLogs: [
      { actionAr: "إنشاء السجل الرقمي الفيدرالي", actionEn: "Digital record created inside federal registry", timestamp: "2026-01-10T10:00:00Z", actor: "نظام السجل الوطني" },
      { actionAr: "التحقق الميداني والاعتماد السيادي", actionEn: "Physical audit verified & sovereign status approved", timestamp: "2026-01-12T14:30:00Z", actor: "مفتش وزارة الفيدرالي" }
    ]
  },
  {
    id: "rec-2",
    nii: "SD-NII-22105",
    nameAr: "مركز بحوث الصمغ العربي وتطوير الصادرات",
    nameEn: "Gum Arabic Research & Export Development Center",
    type: "research_center",
    representative: "د. طارق الطيب البشير",
    email: "garc@customs.gov.sd",
    phone: "+249183421290",
    state: "state-kordofan",
    city: "الأبيض",
    specializationAr: "تطوير وتحسين جودة الصمغ العربي والصادرات غير التقليدية",
    specializationEn: "Gum Arabic purification technology & non-traditional export optimization",
    status: "verified",
    createdAt: "2026-02-15T08:30:00Z",
    auditLogs: [
      { actionAr: "إنشاء سجل مركز البحوث الوطني", actionEn: "National research center record created", timestamp: "2026-02-15T08:30:00Z", actor: "نظام السجل الوطني" },
      { actionAr: "تكامل السجل التجاري والربط الضريبي", actionEn: "Integrated with Commercial Registry & Tax Gateway", timestamp: "2026-02-16T11:20:00Z", actor: "بوابة الربط الحكومي" }
    ]
  },
  {
    id: "rec-3",
    nii: "SD-NII-22108",
    nameAr: "شركة النيلين للتطبيقات البرمجية والحلول الذكية",
    nameEn: "Nilein Software Applications & Smart Solutions Ltd",
    type: "startup",
    representative: "م. مازن محمد الحسن",
    email: "mazen@nilein.sd",
    phone: "+249912300455",
    state: "state-khartoum",
    city: "الخرطوم 2",
    specializationAr: "أنظمة الفوترة الإلكترونية وعقود الحوكمة الذكية ومطابقة بلوكشين",
    specializationEn: "E-invoicing engines, smart governance contracts, and blockchain alignment",
    status: "verified",
    createdAt: "2026-03-01T09:15:00Z",
    auditLogs: [
      { actionAr: "تأسيس فوري عبر بوابة الشركات", actionEn: "Instant setup via Corporate Lifecycle portal", timestamp: "2026-03-01T09:15:00Z", actor: "بوابة تأسيس الشركات" }
    ]
  },
  {
    id: "rec-4",
    nii: "SD-NII-22112",
    nameAr: "وحدة البحوث الصناعية بمجموعة جياد التكنولوجية",
    nameEn: "Industrial Research Unit - Giad Technology Group",
    type: "industrial_unit",
    representative: "م. الفاتح سليمان الجاك",
    email: "research@giad.com.sd",
    phone: "+249120667788",
    state: "state-gezira",
    city: "جياد الصناعية",
    specializationAr: "الهندسة الميكانيكية، صهر المعادن، والمستشعرات الذكية للصناعة الرابعة",
    specializationEn: "Mechanical engineering, metal alloys, and Industry 4.0 smart sensors",
    status: "verified",
    createdAt: "2026-03-10T13:00:00Z",
    auditLogs: [
      { actionAr: "تسجيل الوحدة الصناعية السيادية", actionEn: "Sovereign industrial research unit registered", timestamp: "2026-03-10T13:00:00Z", actor: "وزارة الصناعة والتجارة" }
    ]
  },
  {
    id: "rec-5",
    nii: "SD-NII-22119",
    nameAr: "مشتل التقانة الزراعية المستدامة ببورتسودان",
    nameEn: "Sustainable Agro-Tech Incubator Port Sudan",
    type: "innovation_hub",
    representative: "د. آمنة تاج السر عثمان",
    email: "incubator@redsea.edu.sd",
    phone: "+249311822450",
    state: "state-redsea",
    city: "بورتسودان",
    specializationAr: "الزراعة الملحية، معالجة مياه البحر، وسلاسل التبريد اللوجستية للصادرات",
    specializationEn: "Saline agriculture, seawater treatment, and cold export supply chain",
    status: "pending",
    createdAt: "2026-05-20T11:45:00Z",
    auditLogs: [
      { actionAr: "تقديم طلب التسجيل المبدئي", actionEn: "Initial registration request submitted", timestamp: "2026-05-20T11:45:00Z", actor: "د. آمنة تاج السر" }
    ]
  }
];

// Pre-seeded Research Projects
export const initialResearchProjects: ResearchProject[] = [
  {
    id: "res-1",
    titleAr: "أتمتة تنقية واستخلاص رذاذ الصمغ العربي للدرجات الدوائية العالية",
    titleEn: "Automation of Purification & Spray-Drying of Gum Arabic for Advanced Pharmaceutical Grades",
    leadResearcherId: "rec-2",
    leadResearcherName: "د. طارق الطيب البشير",
    institutionAr: "مركز بحوث الصمغ العربي وتطوير الصادرات",
    institutionEn: "Gum Arabic Research & Export Development Center",
    fundingSourceAr: "صندوق الابتكار الوطني الفيدرالي",
    fundingSourceEn: "Federal National Innovation Fund",
    allocatedBudget: 18000000,
    progressPercentage: 75,
    status: "active",
    startDate: "2026-01-15",
    endDate: "2026-11-30",
    collaborators: ["د. سحر الهادي كمال", "م. معتز الفاضل البشير"],
    publications: ["Optimizing Acacia Senegal Spray-Drying under Arid Conditions", "Viscosity Control Protocols in Sudan Gum Grades"],
    outcomesAr: "تطوير براءة اختراع لجهاز بخاخ ميكانيكي يعمل بالطاقة الهجينة لزيادة نقاء المنتج بنسبة 28%.",
    outcomesEn: "Designed a hybrid-powered spray-drying mechanism improving material purity by 28%.",
    isInternational: false,
    programAr: "البرنامج القومي لتطوير السلع السيادية الاستراتيجية",
    programEn: "National Sovereign Commodity Expansion Initiative"
  },
  {
    id: "res-2",
    titleAr: "مستشعرات الأمن الصناعي الذكية ومنع تسرب الغازات السامة بمصانع جياد",
    titleEn: "Smart Industrial Safety Sensors & Hazardous Gas Detection Systems in Giad Factories",
    leadResearcherId: "rec-4",
    leadResearcherName: "م. الفاتح سليمان الجاك",
    institutionAr: "وحدة البحوث الصناعية بمجموعة جياد التكنولوجية",
    institutionEn: "Industrial Research Unit - Giad Technology Group",
    fundingSourceAr: "منحة جياد للتطوير التكنولوجي بالتعاون مع الوزارة",
    fundingSourceEn: "Giad Tech Grant in collaboration with Ministry",
    allocatedBudget: 12500000,
    progressPercentage: 100,
    status: "completed",
    startDate: "2026-02-10",
    endDate: "2026-06-15",
    collaborators: ["م. نزار التجاني أحمد", "أ.د. عثمان الصافي فرج"],
    publications: ["IoT Safety Nodes in High-Temperature Metallurgy Plants", "Real-time Gas telemetry on Sudan GSM Bandwidth"],
    outcomesAr: "تأسيس نموذج صناعي مدمج وحاصل على ترخيص هيئة المواصفات والمطابقة السودانية SSMO.",
    outcomesEn: "Developed and certified a compact IoT safety monitor fully compliant with SSMO standards.",
    isInternational: true,
    internationalPartners: ["East African Tech Alliance (EATA)"],
    programAr: "مبادرة حماية البيئة والتصنيع النظيف الذكي",
    programEn: "Clean & Smart Industrial Safety Program 2035"
  },
  {
    id: "res-3",
    titleAr: "تطوير بذور الكركديه المقاومة للملوحة والجفاف لتحسين إنتاج ولاية البحر الأحمر",
    titleEn: "Bio-Engineering Saline-Resistant Hibiscus Cultivars for Arid Red Sea Agriculture",
    leadResearcherId: "rec-5",
    leadResearcherName: "د. آمنة تاج السر عثمان",
    institutionAr: "مشتل التقانة الزراعية المستدامة ببورتسودان",
    institutionEn: "Sustainable Agro-Tech Incubator Port Sudan",
    fundingSourceAr: "منحة الكوميسا للتنمية المستدامة",
    fundingSourceEn: "COMESA Sustainable Development Seed Grant",
    allocatedBudget: 8500000,
    progressPercentage: 30,
    status: "funding_review",
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    collaborators: ["د. منى عبد الباقي يوسف"],
    publications: [],
    outcomesAr: "تحت الدراسة والتدقيق الفني لإطلاق أول سلالة قابلة للري بمياه الآبار عالية الملوحة.",
    outcomesEn: "Under evaluation to establish the first seed strains capable of highly saline well water irrigation.",
    isInternational: true,
    internationalPartners: ["ICARDA", "University of Nairobi"],
    programAr: "الصندوق الريفي للابتكار ومقاومة التصحر",
    programEn: "Rural Innovation & Antidesertification Fund"
  }
];

// Pre-seeded Intellectual Property (IP) Records
export const initialIpRecords: IpRecord[] = [
  {
    id: "ip-1",
    ipNumber: "SD-PAT-2026-00349",
    titleAr: "نظام تحلية ومضخة مياه شمسية هجينة بنظام التناضح العكسي الذاتي للمناطق الريفية",
    titleEn: "Hybrid Solar Water Pump with Self-Cleaning Reverse Osmosis Desalination for Arid Zones",
    type: "patent",
    ownerId: "rec-1",
    ownerName: "جامعة الخرطوم - مكتب نقل التكنولوجيا",
    inventors: ["بروفيسور علي الطيب مصطفى", "م. رامي عبد الحليم يونس"],
    status: "technical_examination",
    submissionDate: "2026-01-20",
    descriptionAr: "جهاز ري وتصفية مدمج يعتمد بالكامل على نظام تتبع طاقة شمسية ثنائي المحور، ومزود بوحدة استخلاص الملوحة الذاتية التي لا تطلق رواسب بيئية ضارة بالتربة الزراعية.",
    descriptionEn: "A compact irrigation and filtration system powered entirely by dual-axis solar trackers, equipped with a low-impact desalination unit safeguarding arable soil quality.",
    claimsAr: [
      "1. تصميم المقتفي الشمسي المائي ذو المحورين المصنع محلياً.",
      "2. نظام الغسيل العكسي الميكانيكي المستمر للغشاء دون الحاجة لتفكيكه."
    ],
    claimsEn: [
      "1. Design of the dual-axis low-cost hydro-solar tracker built locally.",
      "2. Continuous mechanical backwash membrane cycle preventing mineral crusting."
    ],
    oppositionRecords: [],
    auditLogs: [
      { status: "submission", actionAr: "إيداع ملف براءة الاختراع المستوفي للرسوم السيادية", actionEn: "Patent application dossier submitted with federal fee escrow", timestamp: "2026-01-20T08:00:00Z", actor: "م. رامي عبد الحليم" },
      { status: "technical_examination", actionAr: "إحالة الملف للفحص الفني ومطابقة قواعد الجدة والابتكار", actionEn: "Referred to Federal Patent Examiner for novelty and inventiveness check", timestamp: "2026-02-15T11:00:00Z", actor: "أ. معتصم يوسف (فاحص براءات)" }
    ]
  },
  {
    id: "ip-2",
    ipNumber: "SD-TM-2026-00412",
    titleAr: "شعار وهوية صمغ سنار الموحد (مؤشر جغرافي محمي)",
    titleEn: "Sennar Gold Gum - Geographical Indication Certified Brand",
    type: "geographical_indication",
    ownerId: "rec-2",
    ownerName: "مركز بحوث الصمغ العربي وتطوير الصادرات",
    inventors: ["رابطة مزارعي ومنتجي ولاية سنار الموحدة"],
    status: "registered",
    submissionDate: "2026-02-10",
    registrationDate: "2026-05-15",
    expiryDate: "2036-05-15",
    descriptionAr: "شعار ورمز تصديق وطني يحمي منشأ الصمغ العربي المستخرج من غابات الطلح والهشاب بولاية سنار لضمان منع التزييف وتتبع مسار شحنات التصدير للاتحاد الأوروبي.",
    descriptionEn: "Certified sovereign branding protecting Origin of Gum Arabic harvested from Acacia Senegal forests in Sennar State, ensuring strict traceability for EU export lines.",
    oppositionRecords: [
      {
        opposerName: "الشركة الأفريقية للمستوردات الغذائية",
        reasonAr: "الادعاء بأن الاسم يحد من القدرة على استخدام تسمية صمغ السودان العام.",
        reasonEn: "Arguing the geographical naming restricts general Sudan Gum Arabic labeling rights.",
        date: "2026-03-01",
        status: "dismissed"
      }
    ],
    licensingAgreements: [
      { licensee: "المؤسسة الوطنية لتطوير الصمغ العربي", termsAr: "ترخيص غير حصري للمصدرين المعتمدين المطابقين لقواعد الجودة", termsEn: "Non-exclusive licensing to certified exporters complying with national purity rules", fee: 450000, date: "2026-05-20" }
    ],
    auditLogs: [
      { status: "submission", actionAr: "إيداع طلب المؤشر الجغرافي واللوجو الفني", actionEn: "GI trademark and technical logo design submitted", timestamp: "2026-02-10T09:00:00Z", actor: "رابطة مزارعي سنار" },
      { status: "legal_review", actionAr: "مراجعة عدم تداخل الاسم مع العلامات المسجلة سابقاً", actionEn: "Legal conflict clearance audit successfully run", timestamp: "2026-02-28T14:15:00Z", actor: "المستشار القانوني للوزارة" },
      { status: "publication", actionAr: "النشر في جريدة غازيتا العلامات الفيدرالية لمدة 60 يوماً للتلقي الاعتراضات", actionEn: "Published in Federal Trademarks Gazette for standard 60-day objection wait", timestamp: "2026-03-01T08:00:00Z", actor: "مسؤول النشر الفيدرالي" },
      { status: "opposition", actionAr: "تلقي اعتراض قانوني من مستورد أفريقي وجدولة جلسة فض المنازعات الموحدة", actionEn: "Received trademark objection, scheduled dispute resolution hearing", timestamp: "2026-03-02T10:00:00Z", actor: "مكتب شؤون الملكية الفكرية" },
      { status: "registered", actionAr: "رفض الاعتراض وإصدار شهادة المؤشر الجغرافي برمز استجابة سريعة QR سيادي معتمد", actionEn: "Objection dismissed. Registered with dynamic secure QR authentication certificate", timestamp: "2026-05-15T12:00:00Z", actor: "أحمد المرتضى (مسجل العلامات)" }
    ]
  }
];

// Pre-seeded Technology Transfer Assets
export const initialTechTransferAssets: TechTransferAsset[] = [
  {
    id: "tt-1",
    titleAr: "براءة اختراع نظام الغسيل الميكانيكي المستمر لأغشية التناضح العكسي (TRL 7)",
    titleEn: "Patent for Continuous Mechanical Backwash of RO Desalination Membranes (TRL 7)",
    sourceInstitutionAr: "جامعة الخرطوم - مكتب نقل التكنولوجيا",
    sourceInstitutionEn: "University of Khartoum - Technology Transfer Office",
    trl: 7,
    licenseType: "non-exclusive",
    askingPrice: 5000000,
    descriptionAr: "آلية ميكانيكية مدمجة متوافقة مع محطات التحلية والري، توفر ٢٥٪ من استهلاك الطاقة في المحطات وتزيد العمر الافتراضي للأغشية بمقدار الضعف.",
    descriptionEn: "Mechanical mechanism retrofitted into RO desalination plants, reducing energy spikes by 25% and doubling membrane operational lifespan.",
    targetIndustries: ["الزراعة والري", "معالجة المياه وصناعات البيئة", "التصنيع الهندسي"],
    status: "available"
  },
  {
    id: "tt-2",
    titleAr: "نظام المستشعرات والتحكم الذكي لمنع تسرب المعادن المنصهرة Industry 4.0",
    titleEn: "Continuous Molten Metal Leak Prevention Sensors & Industry 4.0 IoT controller",
    sourceInstitutionAr: "وحدة البحوث الصناعية بمجموعة جياد التكنولوجية",
    sourceInstitutionEn: "Industrial Research Unit - Giad Technology Group",
    trl: 9,
    licenseType: "exclusive",
    askingPrice: 15000000,
    descriptionAr: "نظام استشعار كهرومغناطيسي عالي الحساسية يراقب درجات الحرارة والتدفق للمعادن السائلة ويطلق إشارة كبح فوري للخطوط قبل حدوث كوارث الانصهار.",
    descriptionEn: "Highly sensitive electromagnetic sensor array tracking liquid steel temperature, initiating automatic safety blockages in case of mold degradation.",
    targetIndustries: ["التصنيع الثقيل والمعادن", "الأمن والسلامة الصناعية"],
    status: "negotiation"
  }
];

// University Industry Partnerships
export const initialPartnerships: UniversityIndustryPartnership[] = [
  {
    id: "prt-1",
    projectNameAr: "توطين خطوط التعبئة المعقمة لمنتجات الكركديه والمانجو السودانية الطبيعية",
    projectNameEn: "Localization of Sterile Aseptic Packaging for Sudanese Natural Mango & Hibiscus Products",
    universityAr: "جامعة الجزيرة - كلية الصناعات الغذائية",
    universityEn: "Al Gezira University - Food Industries College",
    industryPartnerAr: "شركة النيل للمنتجات الغذائية المحدودة",
    industryPartnerEn: "Nile Food Products Co. Ltd",
    scopeAr: "مواءمة نتائج الأبحاث الزراعية لتأسيس أول خط معقم خالي من المواد الحافظة للتصدير عبر الكوميسا.",
    scopeEn: "Aligning agricultural studies to pilot the first preservative-free aseptic line for direct COMESA exports.",
    startDate: "2026-03-15",
    milestones: [
      { titleAr: "التحقق المعملي ومطابقة معايير السمية", titleEn: "Laboratory toxicological and safety compliance audit", dueDate: "2026-05-15", status: "completed" },
      { titleAr: "تدشين خط الإنتاج التجريبي بمصنع بحري", titleEn: "Inaugurating pilot production line at Bahri factory", dueDate: "2026-08-30", status: "pending" }
    ]
  }
];

// Pre-seeded Fund Applications
export const initialFundApplications: FundApplication[] = [
  {
    id: "fund-1",
    refCode: "SD-NIF-2026-0104",
    applicantName: "شركة النيلين للتطبيقات البرمجية والحلول الذكية",
    applicantId: "rec-3",
    projectTitleAr: "منصة حوكمة وسجل الملكية الفكرية الوطني على تقنيات التشفير والتحقق السيادي الموزع",
    projectTitleEn: "Distributed Ledger IP Governance & Sovereign Smart Certification Engine",
    type: "startup_seed",
    requestedAmount: 6000000,
    approvedAmount: 5000000,
    status: "disbursing",
    milestones: [
      { id: "m-1", titleAr: "تسليم نموذج التصميم وهندسة تدفق البيانات", titleEn: "Architectural blueprint & system design flow submission", amount: 1500000, status: "released" },
      { id: "m-2", titleAr: "إطلاق النموذج التجريبي والربط مع قاعدة الملكية الفكرية للوزارة", titleEn: "Beta release and live API integration with Federal IP registry", amount: 2000000, status: "released" },
      { id: "m-3", titleAr: "التدقيق الأمني النهائي للاتصالات المشفرة وإصدار الشهادات", titleEn: "Security pen-testing and production-grade certificate dispatch", amount: 1500000, status: "pending" }
    ],
    impactMetrics: {
      jobsCreated: 8,
      trlProgress: "TRL 4 to TRL 8",
      patentsFiled: 1
    },
    createdAt: "2026-03-10"
  },
  {
    id: "fund-2",
    refCode: "SD-NIF-2026-0125",
    applicantName: "د. آمنة تاج السر عثمان",
    applicantId: "rec-5",
    projectTitleAr: "حاصنة البذور ومقاومة الجفاف في سواحل البحر الأحمر لتعزيز الصادرات الزراعية",
    projectTitleEn: "Coastal Soil Hibiscus Germination Incubator for Export Acceleration",
    type: "grant",
    requestedAmount: 3500000,
    status: "under_evaluation",
    milestones: [
      { id: "m-4", titleAr: "جمع العينات الجينية وتصنيف التربة الساحلية", titleEn: "Sovereign gene cataloging and coastal soil testing", amount: 1500000, status: "pending" },
      { id: "m-5", titleAr: "تأسيس المشتل التجريبي الذكي المتكامل مع تتبع الطاقة الشمسية", titleEn: "Establishing smart solar hybrid botanical incubator", amount: 2000000, status: "pending" }
    ],
    createdAt: "2026-05-25"
  }
];

// Knowledge Economy Challenges & Resources
export const initialChallenges: InnovationChallenge[] = [
  {
    id: "ch-1",
    titleAr: "تحدي تكنولوجيا الكبس الميكانيكي المستدام للصمغ العربي بمواقع التجميع",
    titleEn: "National Gum Arabic High-Density Mobile Compaction Technology Challenge",
    descriptionAr: "ابتكار مكبس متنقل واقتصادي يعمل بالطاقة النظيفة لتقليص حجم شحنات الصمغ الخام في مناطق كردفان والقضارف لتوفير 40% من نفقات النقل البري لميناء التصدير.",
    descriptionEn: "Design a high-efficiency clean-energy compaction kit for raw Gum Arabic at farmgates, shrinking logistics volumes to cut shipping costs by 40%.",
    rewardPool: 8000000,
    deadline: "2026-09-15",
    participantsCount: 14,
    status: "open"
  },
  {
    id: "ch-2",
    titleAr: "هاكاثون الفوترة الموحدة وأنظمة الحوكمة وحماية المستهلك السوداني",
    titleEn: "National Smart Escrow & Consumer Invoice Integrity Hackathon",
    descriptionAr: "تطوير تطبيق مدمج وآمن لمنع تزوير الفواتير ودمج خدمات حماية المستهلك والوساطة في بوابات الدفع الإلكترونية الوطنية.",
    descriptionEn: "Code secure lightweight engines for digital escrow, transparent VAT accounting, and integrated mediation for national payments.",
    rewardPool: 5000000,
    deadline: "2026-06-30",
    participantsCount: 42,
    status: "evaluating"
  }
];

export const initialExperts: ExpertProfile[] = [
  {
    id: "exp-1",
    name: "بروفيسور فاروق محمد أحمد",
    fieldAr: "كيمياء الصمغ العربي والبوليمرات الحيوية الطبيعية",
    fieldEn: "Chemistry of Acacia Senegal & Natural Biopolymers",
    organizationAr: "جامعة الخرطوم - معهد بحوث الكيمياء الصناعية",
    organizationEn: "University of Khartoum - Industrial Chemistry Institute",
    publicationsCount: 68,
    patentsCount: 4,
    email: "farouk@uofk.edu"
  },
  {
    id: "exp-2",
    name: "د. هبة عمر جلال",
    fieldAr: "نظم الطاقة المتجددة وتطبيقات الألواح الهجينة",
    fieldEn: "Photovoltaic Systems & Microgrid Hybrid Control",
    organizationAr: "جامعة السودان للعلوم والتكنولوجيا",
    organizationEn: "Sudan University of Science & Technology",
    publicationsCount: 24,
    patentsCount: 2,
    email: "heba@sustech.edu"
  }
];

export const initialKnowledgeDocs: KnowledgeDoc[] = [
  {
    id: "doc-1",
    title: "National Patent Filing and Novelty Examination Standards - Republic of Sudan 2026",
    category: "patent_guide",
    author: "Ministry Patent Office",
    downloads: 1420,
    date: "2026-01-15",
    url: "#"
  },
  {
    id: "doc-2",
    title: "Gum Arabic Export Standards and European Union Chemical Registration Compliance Guide",
    category: "policy",
    author: "Acacia Research Council",
    downloads: 980,
    date: "2026-02-28",
    url: "#"
  }
];

// Collaboration Workspaces
export const initialWorkspaceProjects: WorkspaceProject[] = [
  {
    id: "work-1",
    nameAr: "فريق دراسة جودة وصادرات غابات الطلح لأسواق الكوميسا",
    nameEn: "Talha Gum Export Purity Harmonization - COMESA Standards Working Group",
    descriptionAr: "مساحة عمل مشتركة لصياغة الدليل الفيدرالي الموحد لمواصفات صمغ الطلح لتعزيز حصة الصادر وضمان مطابقة الجودة.",
    descriptionEn: "Interactive framework establishing Talha Gum specifications to secure zero-rejection trade within COMESA.",
    members: [
      { name: "د. طارق الطيب البشير", role: "رئيس الفريق العلمي", organization: "مركز بحوث الصمغ العربي" },
      { name: "م. الفاتح سليمان الجاك", role: "ممثل الصناعة والابتكار", organization: "مجموعة جياد" },
      { name: "أ. معتصم يوسف", role: "مستشار الملكية الفكرية والامتثال", organization: "وزارة التجارة والصناعة" }
    ],
    documents: [
      { id: "wd-1", name: "Talha_Comesa_Chemical_Specs_Draft.pdf", size: "2.4 MB", uploadedBy: "د. طارق الطيب", uploadedAt: "2026-04-10" },
      { id: "wd-2", name: "SSMO_Export_Testing_Regimes.docx", size: "1.1 MB", uploadedBy: "أ. معتصم يوسف", uploadedAt: "2026-04-15" }
    ],
    discussions: [
      { id: "disc-1", sender: "د. طارق الطيب", organization: "مركز بحوث الصمغ العربي", text: "مرحباً بالجميع. لقد قمت بتحميل مسودة التعديلات الكيميائية المعتمدة لمطابقة المواصفة رقم 4 للاتحاد الأفريقي، يرجى مراجعتها وتأكيد النقاط الفنية.", timestamp: "2026-04-10T10:30:00Z" },
      { id: "disc-2", sender: "م. الفاتح سليمان", organization: "مجموعة جياد", text: "ممتاز دكتور طارق. مراجعة الباب الرابع للمواصفات تؤكد تطابقها مع معايير الآلات الضاغطة الجديدة التي نقوم ببرمجتها حالياً لتخفيض مساحة الشحن.", timestamp: "2026-04-12T14:20:00Z" }
    ],
    milestones: [
      { id: "wm-1", titleAr: "اعتماد المواصفة الفنية الموحدة وصياغة مسودة القرار", titleEn: "Approve Unified Technical Standards and Draft Decree", status: "completed", dueDate: "2026-05-10" },
      { id: "wm-2", titleAr: "الرفع المباشر لمجلس الوزراء الفيدرالي ووزير التجارة للاعتماد الشامل", titleEn: "Sovereign cabinet review & Ministerial endorsement filing", status: "pending", dueDate: "2026-08-15" }
    ]
  }
];

// GIS Innovation Node coordinates mapping for custom SVG grid
export const initialGisNodes: GisInnovationNode[] = [
  { id: "gis-khartoum", nameAr: "مجمع الابتكار ونقل التقانة بجامعة الخرطوم", nameEn: "UofK Innovation & Technology Transfer Hub", type: "hub", stateAr: "ولاية الخرطوم", stateEn: "Khartoum State", coordinates: "15.55° N, 32.53° E", x: 180, y: 140, activePatents: 24, researchProjectsCount: 15, startupsCount: 18, fundingDisbursed: 45000000 },
  { id: "gis-port-sudan", nameAr: "مشتل التقانة الزراعية المستدامة وحاضنة التميز ببورتسودان", nameEn: "Sustainable Agro-Tech Port Sudan Terminal", type: "incubator", stateAr: "ولاية البحر الأحمر", stateEn: "Red Sea State", coordinates: "19.61° N, 37.21° E", x: 310, y: 50, activePatents: 5, researchProjectsCount: 6, startupsCount: 4, fundingDisbursed: 12000000 },
  { id: "gis-gezira", nameAr: "حاضنة تكنولوجيا الأغذية المتطورة بجامعة الجزيرة", nameEn: "Al Gezira Food Technology Accelerator", type: "park", stateAr: "ولاية الجزيرة", stateEn: "Al Gezira State", coordinates: "14.40° N, 33.51° E", x: 210, y: 170, activePatents: 12, researchProjectsCount: 8, startupsCount: 6, fundingDisbursed: 28000000 },
  { id: "gis-obeyid", nameAr: "مجمع استشعار وتطوير أبحاث الصمغ العربي بالأبيض", nameEn: "Gum Arabic Research Park El Obeid", type: "center", stateAr: "ولاية شمال كردفان", stateEn: "North Kordofan State", coordinates: "13.18° N, 30.20° E", x: 110, y: 210, activePatents: 8, researchProjectsCount: 12, startupsCount: 5, fundingDisbursed: 21000000 }
];
