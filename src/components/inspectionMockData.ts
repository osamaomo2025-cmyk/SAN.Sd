/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Documents data for Smart Inspection and Enforcement to avoid bloating the component file
export interface DocumentSection {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
}

export const inspectionManualsAndDocs: DocumentSection[] = [
  {
    id: "architecture",
    titleAr: "1. المخطط المعماري لمنصة التفتيش والإنقاذ الذكي",
    titleEn: "1. Smart Inspection Platform Architecture",
    contentAr: `تعتمد بنية المنصة على بنية حوسبة موزعة وهجينة تفصل بين بيئة الهاتف المحمول للمفتشين الميدانيين (المجهزة للعمل بدون اتصال بالإنترنت Offline-First) ومستودع البيانات التحليلي (Analytics DW) المركزي.
تشمل الطبقات الرئيسية:
1. طبقة المزامنة اللامركزية (Bi-directional Sync Service): وتعمل على توثيق المعاملات الميدانية جغرافياً (GPS) والتأكد من بصمة الصور التفتيشية رقمياً قبل رفعها.
2. محرك تقييم المخاطر (Risk Scoring Engine): ويتم تشغيله دورياً لتحديث قوائم التفتيش بناءً على النشاط التاريخي ومعدلات الشكاوى.
3. بوابة المطابقة والربط السيادي (API Interop Gateway): لمزامنة بيانات التفتيش مع وزارة الداخلية (السجل المدني) ووزارة الصحة ومختبرات المواصفات والجودة الفيدرالية.`,
    contentEn: "The platform architecture leverages a hybrid, distributed schema separating field mobile apps (Offline-First) from the central Analytical DW.\nKey tiers include:\n1. Bi-directional Sync Service: Geographically validates field reports (GPS) and verifies visual evidence cryptographic integrity prior to committing.\n2. Risk Scoring Engine: Periodically runs database heuristics to update priority schedules based on complaint density and historical compliance rates.\n3. API Interop Gateway: Syncs field violations in real-time with Civil Registry, Health authorities, and Sudan Standard Metrology Org (SSMO)."
  },
  {
    id: "risk-assessment",
    titleAr: "2. مصفوفة تقييم ومكافحة المخاطر الوطنية",
    titleEn: "2. National Risk Assessment & Compliance Framework",
    contentAr: `يتم حساب درجة مخاطر المنشآت (Entity Risk Score) تلقائياً عبر معادلة تجمع العوامل التالية:
- معامل قطاع الصناعة (مخاطر عالية للأغذية والأدوية والتعدين معامل 1.5، ومخاطر منخفضة للخدمات معامل 0.8).
- السجل التاريخي للمخالفات (زيادة 10% لكل مخالفة نشطة غير مغلقة).
- حجم شكاوى المستهلكين (زيادة 5% لكل شكوى مؤكدة خلال الـ 90 يوماً الماضية).
- حالة الترخيص وصلاحية شهادات المطابقة البيئية والبلدية.
المعادلة: Risk Score = (Base Industry Index * 40) + (Historical Violations * 25) + (Complaint Volume * 20) + (License Status factor * 15)`,
    contentEn: "The Enterprise Risk Score is dynamically computed using a multi-factor formula:\n- Sector Risk Weight (High risk for food, chemical, mining at 1.5; low risk for retail/services at 0.8).\n- Violations History (Accumulates +10% for each active unresolved warning).\n- Consumer Complaints Volume (+5% per verified citizen report over the trailing 90 days).\n- License Expiry & Compliance state (+15%).\nFormula: Risk Score = (Base Industry Index * 40) + (Historical Violations * 25) + (Complaint Volume * 20) + (License Status factor * 15)"
  },
  {
    id: "enforcement-actions",
    titleAr: "3. مصفوفة الجزاءات وتدرج إنفاذ القانون واللوائح",
    titleEn: "3. Progressive Enforcement & Penalty Framework",
    contentAr: `يتدرج الإجراء القانوني لإنفاذ المطابقة لضمان العدالة والتنمية:
1. الإنذار الإداري (Warning Notice): يمنح المنشأة مهلة 7 أيام للتصحيح للمخالفات الطفيفة.
2. الغرامات المالية التصاعدية (Progressive Fines): تحسب تلقائياً بناءً على تصنيف المخالفة (مثلاً: بيع مواد منتهية الصلاحية = غرامة 50,000 جنيه، الاحتكار والتلاعب بالأسعار = غرامة 150,000 جنيه).
3. الإغلاق الإداري المؤقت (Temporary Suspension): من 24 ساعة إلى 14 يوماً مع تعليق رمز الاستجابة السريعة (QR) على الواجهة.
4. مصادرة البضائع وسحب التراخيص (Product Seizure & License Revocation) في الحالات القصوى المرتبطة بالأمن الصحي والبيئي القومي.`,
    contentEn: "Progressive compliance matrix ensures fair play, public safety, and market health:\n1. Administrative Warning: Grants a 7-day cure window for low-severity infractions.\n2. Automated Financial Penalties: Calculated dynamically based on category (e.g., selling expired goods = 50k SDG fine; price gouging/monopoly = 150k SDG fine).\n3. Temporary Shut-down (24h to 14 days): Automatically flags the public digital portal and suspends QR compliance badge.\n4. Seizure & License Revocation: Reserved for acute national health, environmental, or security violations."
  },
  {
    id: "gis-design",
    titleAr: "4. موجه الربط الجغرافي والخرائط الذكية GIS",
    titleEn: "4. GIS Smart Map Integration & Routing Design",
    contentAr: `يرتبط التفتيش الذكي بالإحداثيات الجغرافية (WGS84). يتم تتبع مسار المفتش الميداني ومطابقته مع إحداثيات السجل التجاري لضمان دقة الزيارة والتصدي للتقارير المكتوبة عن بعد.
- ميزات الخريطة المدمجة: عرض الكثافة اللونية للمخالفات، تحديد المجمعات الصناعية الحرجة، وتوليد مسارات التفتيش المثلى (Optimization Routing) لتوفير استهلاك الوقود وزيادة كفاءة الزيارات اليومية بنسبة 35%.`,
    contentEn: "Unified spatial integration maps (WGS84) reconcile inspector locations directly with registered company coordinates to eliminate remote report fabrication.\n- Map Overlays: Real-time Heat-mapping of complaints, critical industrial clusters, and vehicle path optimization algorithms designed to boost inspector daily coverage by up to 35% while lowering transit fuel costs."
  }
];

export const mockInspectors = [
  { id: "insp-01", name: "المهندس مجتبى مأمون", level: "Senior Inspector", sector: "Industrial", region: "الخرطوم", activeCases: 4, complianceScore: 97.4 },
  { id: "insp-02", name: "أ. نضال الطيب", level: "Field Inspector", sector: "Consumer Protection", region: "البحر الأحمر", activeCases: 6, complianceScore: 94.2 },
  { id: "insp-03", name: "د. إبراهيم عثمان", level: "Compliance Officer", sector: "Licensing & Health", region: "الخرطوم", activeCases: 2, complianceScore: 99.1 },
  { id: "insp-04", name: "أ. منال عبد القادر", level: "Senior Inspector", sector: "Commercial", region: "الجزيرة", activeCases: 5, complianceScore: 91.8 }
];

export const mockInitialInspections = [
  {
    id: "INSP-2026-001",
    entityName: "مصنع النيل الأزرق للمطاحن والنشويات",
    entityType: "industrial",
    activity: "الصناعات الغذائية",
    region: "الخرطوم",
    city: "بحري",
    inspectorId: "insp-01",
    inspectorName: "المهندس مجتبى مأمون",
    priority: "high",
    riskScore: 84,
    status: "assigned", // planned, assigned, field_execution, review, completed
    scheduledDate: "2026-07-16",
    gpsLocation: { lat: 15.6083, lng: 32.5294 },
    violations: [] as any[],
    checklist: [
      { item: "صلاحية المواد الخام وشهادات SSMO", checked: false },
      { item: "مطابقة التراخيص الصناعية والبيئية", checked: false },
      { item: "أنظمة الإطفاء والسلامة المهنية", checked: false }
    ],
    evidence: { photos: [] as string[], voiceNotes: [] as string[], signature: "" },
    findings: ""
  },
  {
    id: "INSP-2026-002",
    entityName: "شركة البشير للمواد الطبية والتجميل",
    entityType: "commercial",
    activity: "التجارة العامة",
    region: "البحر الأحمر",
    city: "بورتسودان",
    inspectorId: "insp-02",
    inspectorName: "أ. نضال الطيب",
    priority: "critical",
    riskScore: 94,
    status: "field_execution",
    scheduledDate: "2026-07-15",
    gpsLocation: { lat: 19.6158, lng: 37.2164 },
    violations: [
      { id: "VIO-01", category: "expired_goods", severity: "high", fine: 150000, description: "وجود مستحضرات طبية منتهية الصلاحية منذ 4 أشهر." }
    ],
    checklist: [
      { item: "صلاحية السلع الطبية المعروضة", checked: true },
      { item: "إبراز لوائح الأسعار الرسمية والترخيص", checked: true },
      { item: "المطابقة الدوائية وبطاقة المنشأ", checked: false }
    ],
    evidence: { photos: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=60"] as string[], voiceNotes: ["ملاحظة صوتية: تم رصد عبوات مجهولة المصدر مخزنة في الطابق الأرضي."] as string[], signature: "Nidal_Signed" },
    findings: "تم العثور على أدوية منتهية الصلاحية ومجهولة المنشأ مخزنة بشكل مخالف لشروط التراخيص."
  },
  {
    id: "INSP-2026-003",
    entityName: "سوبرماركت التضامن العائلي",
    entityType: "consumer",
    activity: "بيع التجزئة",
    region: "الجزيرة",
    city: "ود مدني",
    inspectorId: "insp-04",
    inspectorName: "أ. منال عبد القادر",
    priority: "medium",
    riskScore: 54,
    status: "completed",
    scheduledDate: "2026-07-12",
    gpsLocation: { lat: 14.4012, lng: 33.5192 },
    violations: [],
    checklist: [
      { item: "مطابقة أسعار السلع المحددة اتحادياً", checked: true },
      { item: "صلاحية الألبان واللحوم المعلبة", checked: true }
    ],
    evidence: { photos: [] as string[], voiceNotes: [] as string[], signature: "Owner_Acknowledge" },
    findings: "المنشأة ملتزمة تماماً بلوائح الأسعار وصلاحية المعروضات."
  }
];
