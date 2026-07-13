/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InvestmentOpportunity } from "./types";

// Official Sudanese States list
export const SUDANESE_STATES = [
  { id: "khartoum", nameAr: "الخرطوم", nameEn: "Khartoum" },
  { id: "red_sea", nameAr: "البحر الأحمر", nameEn: "Red Sea" },
  { id: "river_nile", nameAr: "نهر النيل", nameEn: "River Nile" },
  { id: "gezira", nameAr: "الجزيرة", nameEn: "Gezira" },
  { id: "white_nile", nameAr: "النيل الأبيض", nameEn: "White Nile" },
  { id: "blue_nile", nameAr: "النيل الأزرق", nameEn: "Blue Nile" },
  { id: "sennar", nameAr: "سنار", nameEn: "Sennar" },
  { id: "gadarif", nameAr: "القضارف", nameEn: "Gadarif" },
  { id: "kassala", nameAr: "كسلا", nameEn: "Kassala" },
  { id: "north_kordofan", nameAr: "شمال كردفان", nameEn: "North Kordofan" },
  { id: "south_kordofan", nameAr: "جنوب كردفان", nameEn: "South Kordofan" },
  { id: "west_kordofan", nameAr: "غرب كردفان", nameEn: "West Kordofan" },
  { id: "north_darfur", nameAr: "شمال دارفور", nameEn: "North Darfur" },
  { id: "south_darfur", nameAr: "جنوب دارفور", nameEn: "South Darfur" },
  { id: "west_darfur", nameAr: "غرب دارفور", nameEn: "West Darfur" },
  { id: "central_darfur", nameAr: "وسط دارفور", nameEn: "Central Darfur" },
  { id: "east_darfur", nameAr: "شرق دارفور", nameEn: "East Darfur" },
  { id: "northern", nameAr: "الولاية الشمالية", nameEn: "Northern" }
];

// Official Industrial Zones
export const INDUSTRIAL_ZONES = [
  { id: "giad", nameAr: "مدينة جياد الصناعية", nameEn: "Giad Industrial City", state: "Gezira" },
  { id: "port_sudan_free", nameAr: "المنطقة الحرة بورتسودان", nameEn: "Port Sudan Free Zone", state: "Red Sea" },
  { id: "el_bagair", nameAr: "منطقة الباقير الصناعية", nameEn: "El Bagair Industrial Zone", state: "Gezira" },
  { id: "khartoum_north", nameAr: "المنطقة الصناعية بحري", nameEn: "Khartoum North Industrial Zone", state: "Khartoum" },
  { id: "salamat", nameAr: "مدينة السلامات للصناعات الجلدية", nameEn: "Salamat Leather Industrial City", state: "Khartoum" },
  { id: "kosti", nameAr: "المنطقة الصناعية كوستي", nameEn: "Kosti Industrial Zone", state: "White Nile" }
];

// Curated Investment Opportunities Sudan Vision 2035
export const INVESTMENT_OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: "opp-1",
    titleAr: "مجمع الصناعات التحويلية الحديثة للصمغ العربي",
    titleEn: "Modern Gum Arabic Processing Complex",
    sectorAr: "الصناعات الغذائية والصيدلانية والتحويلية",
    sectorEn: "Food, Pharma & Agro-Processing",
    locationAr: "مدينة بورتسودان الحرة والابيض",
    locationEn: "Port Sudan Free Zone & El Obeid",
    descriptionAr: "يهدف المشروع إلى تأسيس مجمعات تكرير وتصنيع متقدمة لرفع نسبة الصادرات السودانية المصنعة من الصمغ العربي بدلاً من تصديره كخام، مما يضاعف القيمة المضافة بمعدل 4 أضعاف وفق رؤية 2035.",
    descriptionEn: "This project aims to establish advanced refining and manufacturing complexes to increase Sudan's processed exports of Gum Arabic rather than raw materials, quadrupling value addition according to Vision 2035.",
    requiredCapital: "$15,000,000",
    incentivesAr: "إعفاء ضريبي كامل لمدة 10 سنوات، أرض استثمارية مجهزة بأسعار تفضيلية، وربط مباشر بمحطة الشحن بميناء بورتسودان.",
    incentivesEn: "Full 10-year tax holiday, fully-serviced industrial land at preferential rates, and direct link to Port Sudan shipping terminal."
  },
  {
    id: "opp-2",
    titleAr: "مدينة جياد المتكاملة للطاقة الشمسية والحديد",
    titleEn: "Giad Integrated Solar Energy & Steel City",
    sectorAr: "صناعات ثقيلة وطاقة متجددة",
    sectorEn: "Heavy Industry & Renewable Energy",
    locationAr: "مدينة جياد الصناعية، ولاية الجزيرة",
    locationEn: "Giad Industrial City, Gezira State",
    descriptionAr: "إنشاء محطة توليد طاقة شمسية بطاقة 250 ميغاوات لتغذية مصانع الحديد والصلب والصناعات الهندسية بمدينة جياد، مع فتح خطوط إنتاج جديدة للسيارات والمركبات الكهربائية السودانية.",
    descriptionEn: "Developing a 250MW solar power generation plant to feed steel mills and engineering industries in Giad City, while launching new production lines for Sudanese electric vehicles.",
    requiredCapital: "$45,000,000",
    incentivesAr: "حق امتلاك للأراضي بنسبة 100%، إعفاء جمركي للمعدات المستوردة، وضمان شراء الطاقة الفائضة من الشبكة القومية.",
    incentivesEn: "100% foreign ownership allowed, custom duty exemption on imported machinery, and guaranteed buyback of excess power by national grid."
  },
  {
    id: "opp-3",
    titleAr: "المجمع الوطني لصناعة وتصدير اللحوم والجلود",
    titleEn: "National Integrated Meat & Leather Export Hub",
    sectorAr: "صناعات زراعية وحيوانية",
    sectorEn: "Agro-Pastoral & Tannery",
    locationAr: "أم درمان وغرب كردفان",
    locationEn: "Omdurman & West Kordofan",
    descriptionAr: "تأسيس مسالخ آلية حديثة وصديقة للبيئة بأحدث تقنيات حفظ وتبريد اللحوم مع مدبغة متطورة لتصنيع وتصدير المنتجات الجلدية السودانية الفاخرة للأسواق العالمية والمحلية.",
    descriptionEn: "Establishment of modern automated, eco-friendly abattoirs with cryogenic storage technologies, integrated with an advanced tannery for premium Sudanese leather exports.",
    requiredCapital: "$20,000,000",
    incentivesAr: "أولوية مطلقة في رخص التصدير، دعم مالي حكومي للشحن الجوي والبحري، وتدريب مدعوم للعمالة الفنية السودانية.",
    incentivesEn: "Absolute priority in export licensing, government air/sea freight subsidies, and sponsored training for Sudanese technical workforce."
  },
  {
    id: "opp-4",
    titleAr: "مصنع تكرير السكر الحديث بكنانة",
    titleEn: "Kenana Refined Sugar Modernization",
    sectorAr: "الصناعات الغذائية والزراعية",
    sectorEn: "Agro-Industrial Food Processing",
    locationAr: "كنانة، ولاية النيل الأبيض",
    locationEn: "Kenana, White Nile State",
    descriptionAr: "شراكة لتوسيع إنتاج السكر وتوليد الإيثانول الحيوي من قصب السكر، باستخدام أحدث خطوط الإنتاج والذكاء الاصطناعي في فرز وتعبئة السكر المكرر عالي الجودة لأسواق الكوميسا.",
    descriptionEn: "Joint-venture partnership to expand sugar production and bio-ethanol generation from sugarcane, leveraging AI-powered sorting and packing for COMESA markets.",
    requiredCapital: "$30,000,000",
    incentivesAr: "دخول معفى من الرسوم الجمركية لكافة دول الكوميسا، أسعار مياه تفضيلية للري، وتوفير العمالة المتخصصة مجاناً للعام الأول.",
    incentivesEn: "Duty-free entry to all COMESA nations, preferential water tariffs, and free provision of specialized labor for the first year."
  }
];

// Dynamic Procedure Guides for the AI Assistant and Info pages
export const REGISTRATION_GUIDES = {
  commercial: [
    { step: 1, title: "حجز الاسم التجاري", desc: "تقديم طلب إلكتروني لحجز اسم فريد لا يتعارض مع سجلات أخرى." },
    { step: 2, title: "تقديم عقد التأسيس", desc: "رفع عقد التأسيس وشهادة أسماء الشركاء ووثائق الهوية." },
    { step: 3, title: "دفع الرسوم والتوقيع", desc: "تسديد الرسوم الحكومية إلكترونياً واستلام العقد الموثق رقمياً." },
    { step: 4, title: "إصدار السجل والـ QR Code", desc: "صدور شهادة السجل التجاري لعام 2035 برمز QR معتمد للتفتيش." }
  ],
  factory: [
    { step: 1, title: "الموافقة المبدئية", desc: "تقديم طلب تصنيف صناعي وإثبات تملك الأرض أو عقد إيجار بالمدينة الصناعية." },
    { step: 2, title: "دراسة الأثر البيئي والصحي", desc: "رفع دراسات السلامة المهنية وموافقة المجلس الأعلى للبيئة." },
    { step: 3, title: "تعبئة بيانات خطوط الإنتاج", desc: "تسجيل الماكينات ومصادر الطاقة المتوقعة والإنتاجية السنوية المستهدفة." },
    { step: 4, title: "التفتيش والترخيص النهائي", desc: "زيارة المفتش الصناعي الميداني وصدور ترخيص التشغيل السنوي." }
  ],
  export: [
    { step: 1, title: "التسجيل في سجل المصدرين والمستوردين", desc: "ترخيص سنوي للشركة بمزاولة أعمال التجارة الخارجية." },
    { step: 2, title: "طلب شهادة المنشأ", desc: "تقديم تفاصيل الفاتورة، دولة المستورد، رمز المنسق (HS Code) وقائمة التعبئة." },
    { step: 3, title: "الفحص ومطابقة المواصفات", desc: "إصدار تصديق من هيئة المواصفات والمقاييس السودانية إلكترونياً." },
    { step: 4, title: "الربط مع الجمارك وموانئ السودان", desc: "إرسال شهادة المنشأ الرقمية مباشرة لنظام التخليص الجمركي ببورتسودان." }
  ]
};
