import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, ShoppingBag, Truck, Globe, Award, Cpu, Briefcase, MessageSquare, BarChart3,
  Network, Search, CheckCircle, AlertTriangle, Play, RefreshCw, Send, Plus, ArrowUpRight,
  ShieldAlert, Layers, Activity, TrendingUp, BookOpen, AlertCircle, Check, Info, FileText,
  Lock, HelpCircle, MapPin, Building2, DollarSign, ExternalLink, Calendar, Heart, Shield,
  ChevronRight, ThumbsUp, Radio, UserCheck, MessageCircle, FileCheck, Share2, Eye
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

interface Props {
  currentLanguage: "ar" | "en";
  role: string;
}

// Preset Directories (Module 1)
const INITIAL_DIRECTORIES = [
  { id: "dir-1", nameAr: "شركة النيل الأزرق للمطاحن وصناعة الدقيق", nameEn: "Blue Nile Flour Mills Co.", type: "manufacturer", size: "large", locationAr: "الخرطوم", locationEn: "Khartoum", verified: true, trust: 98, sectorAr: "صناعات غذائية", sectorEn: "Food Industry", category: "industrial" },
  { id: "dir-2", nameAr: "المؤسسة الوطنية لتطوير الصمغ العربي", nameEn: "National Gum Arabic Development Corp", type: "exporter", size: "large", locationAr: "بورتسودان", locationEn: "Port Sudan", verified: true, trust: 99, sectorAr: "تصدير المحاصيل الاستراتيجية", sectorEn: "Strategic Crop Export", category: "exporters" },
  { id: "dir-3", nameAr: "مصنع سنار للغزل والنسيج الحديث", nameEn: "Sennar Modern Textile Factory", type: "manufacturer", size: "medium", locationAr: "سنار", locationEn: "Sennar", verified: true, trust: 92, sectorAr: "الغزل والنسيج", sectorEn: "Textiles", category: "industrial" },
  { id: "dir-4", nameAr: "شركة سوداتك للحلول البرمجية المتكاملة", nameEn: "Sudatech Integrated Software Solutions", type: "sme", size: "small", locationAr: "الخرطوم", locationEn: "Khartoum", verified: true, trust: 95, sectorAr: "تقنية معلومات", sectorEn: "IT Services", category: "sme" },
  { id: "dir-5", nameAr: "مزرعة البركة لإنتاج وتصدير المانجو والبلح", nameEn: "Al-Baraka Export Farms (Mango & Dates)", type: "exporter", size: "medium", locationAr: "كسلا", locationEn: "Kassala", verified: false, trust: 85, sectorAr: "إنتاج زراعي", sectorEn: "Agricultural Production", category: "exporters" },
  { id: "dir-6", nameAr: "المجموعة السودانية للخدمات اللوجستية الموحدة", nameEn: "Sudanese Unified Logistics Group", type: "service", size: "large", locationAr: "الخرطوم بحري", locationEn: "Khartoum North", verified: true, trust: 97, sectorAr: "شحن وسلاسل إمداد", sectorEn: "Shipping & Supply Chain", category: "service" }
];

// Preset Products (Module 2)
const INITIAL_PRODUCTS = [
  { id: "p-1", nameAr: "صمغ عربي خام فئة ممتازة (هشاب)", nameEn: "Premium Raw Gum Arabic (Hashab)", company: "National Gum Arabic Corp", price: 3400, unit: "Metric Ton", stock: 120, categoryAr: "صادرات زراعية", categoryEn: "Agricultural Exports" },
  { id: "p-2", nameAr: "زيت سمسم أبيض نقي معصور على البارد", nameEn: "Pure Cold-Pressed White Sesame Oil", company: "Blue Nile Flour Mills Co.", price: 1850, unit: "Metric Ton", stock: 85, categoryAr: "زيوت نباتية", categoryEn: "Vegetable Oils" },
  { id: "p-3", nameAr: "دقيق قمح فيدرالي مدعوم للمخابز", nameEn: "Subsidized Federal Wheat Flour for Bakeries", company: "Blue Nile Flour Mills Co.", price: 420, unit: "Metric Ton", stock: 500, categoryAr: "مواد غذائية أساسية", categoryEn: "Basic Foodstuffs" }
];

// RFQs (Module 2)
const INITIAL_RFQS = [
  { id: "rfq-1", titleAr: "طلب توريد 50 طن صمغ عربي معالج", titleEn: "RFQ: 50 Metric Tons Processed Gum Arabic", buyerAr: "شركة الأغذية العالمية المحدودة", buyerEn: "Global Foodstuffs Ltd", status: "open", responses: 4 },
  { id: "rfq-2", titleAr: "مطلوب شريك نقل مبرد من كسلا لبورتسودان", titleEn: "RFQ: Refrigerated Logistics Partner (Kassala to Port Sudan)", buyerAr: "شركة مزارع كسلا", buyerEn: "Kassala Farms Co", status: "open", responses: 1 }
];

// Supply Chain Shipments (Module 3)
const INITIAL_SHIPMENTS = [
  { id: "shp-1", tracking: "SD-LOG-9082", cargoAr: "شحنة صمغ عربي خام", cargoEn: "Raw Gum Arabic Bulk", originAr: "الأبيض - كردفان", originEn: "El Obeid - Kordofan", destinationAr: "ميناء بورتسودان الجنوبي", destinationEn: "Port Sudan South Port", carrier: "Sudan Unified Cargo", status: "in-transit", risk: "low" },
  { id: "shp-2", tracking: "SD-LOG-4421", cargoAr: "شحنة زيوت وسمسم زراعي", cargoEn: "Sesame Seeds Cargo", originAr: "القضارف", originEn: "Al Qadarif", destinationAr: "المنطقة الصناعية - الخرطوم", destinationEn: "Khartoum Industrial Area", carrier: "Nile Fleet Logistics", status: "delayed", risk: "medium" }
];

// Export promotion programs (Module 4)
const EXPORT_PROGRAMS = [
  { id: "exp-1", titleAr: "برنامج الربط اللوجستي بأسواق الكوميسا (COMESA)", titleEn: "COMESA Logistics Connectivity Program", descriptionAr: "دعم لوجستي وتسهيل جمركي مخصص للصادرات السودانية لدول السوق المشتركة.", descriptionEn: "Customs facilitation & logistic subsidies for Sudanese exporters to COMESA countries.", activeExporters: 48 },
  { id: "exp-2", titleAr: "مسرعة الصادرات الصناعية والتحويلية لدول الخليج", titleEn: "Industrial Exports Accelerator to GCC Markets", descriptionAr: "برنامج تأهيل واختبار جودة المنتجات لمطابقة المقاييس الخليجية وربط مع مشترين مباشرين.", descriptionEn: "SME product standards qualification and direct buyer matchmaking for the Gulf markets.", activeExporters: 32 }
];

// SME classification and growth metrics (Module 5)
const SME_GROWTH_PROGRAMS = [
  { id: "sme-p1", titleAr: "برنامج التمويل الأصغر بنسبة مرابحة مدعومة", titleEn: "Subsidized Micro-Finance & Murabaha Initiative", budget: "2.5B SDG", applicationsCount: 142, status: "open" },
  { id: "sme-p2", titleAr: "حاضنة التحول الرقمي الموحد للتجار والشركات الصغيرة", titleEn: "Unified SME Digital Transformation Incubation", budget: "800M SDG", applicationsCount: 89, status: "active" }
];

// Investor Opportunities (Module 6)
const INVESTMENT_OPPS = [
  { id: "opp-1", titleAr: "مشروع الشراكة لتطوير رصيف الشحن بميناء بورتسودان الجنوبي", titleEn: "PPP: Port Sudan South Port Cargo Berth Expansion", type: "PPP", capitalNeeded: "$45M USD", sectorAr: "النقل واللوجستيات", sectorEn: "Transport & Logistics", matchesCount: 12 },
  { id: "opp-2", titleAr: "المدينة الصناعية الجديدة لإنتاج وتعبئة زيوت الطعام - القضارف", titleEn: "Al Qadarif Vegetable Oil Industrial Park Venture", type: "Private Joint", capitalNeeded: "$18M USD", sectorAr: "صناعات تحويلية", sectorEn: "Agro-Industrial Manufacturing", matchesCount: 8 }
];

// Digital Procurement Tenders (Module 7)
const PROCUREMENT_TENDERS = [
  { id: "ten-1", number: "FED-TEN-2026-904", titleAr: "عطاء توريد وقود الديزل المخصص للمصانع والمنشآت الاقتصادية", titleEn: "Tender: National Industry Subsidized Diesel Supply 2026", authorityAr: "إدارة الإمداد الصناعي الفيدرالي", authorityEn: "Federal Industrial Supply Department", deadline: "2026-08-15", status: "open", bidsSubmitted: 14 },
  { id: "ten-2", number: "FED-TEN-2026-112", titleAr: "عطاء رقمنة وتوريد خوادم السحابة الفيدرالية لوزارة التجارة", titleEn: "Tender: Sovereign Commerce Cloud Node Procurement", authorityAr: "الإدارة العامة للمعلومات والتحول الرقمي", authorityEn: "General Department of Digital Transformation", deadline: "2026-08-01", status: "under_evaluation", bidsSubmitted: 6 }
];

// Communities preset messages (Module 8)
const COMMUNITY_POSTS = [
  { id: "post-1", author: "المهندس عثمان عبد الرحيم - مجمع سوبا الصناعي", authorEn: "Eng. Osman Abdelrahim", textAr: "هل واجه أحدكم تحديات في استخراج رخص التصدير عبر نافذة الكوميسا الرقمية اليوم؟ نرجو الإفادة.", textEn: "Has anyone faced delay issues with the COMESA single window licensing today?", sectorAr: "الصناعات التحويلية", sectorEn: "Manufacturing Sector", replies: 12, likes: 24, date: "قبل ساعتين" },
  { id: "post-2", author: "الأستاذة محاسن الطيب - مجلس سيدات الأعمال السودانيات", authorEn: "Mrs. Mahasin Al-Tayeb", textAr: "نعلن عن إطلاق ورشة تدريبية مشتركة مع منظمة الأمم المتحدة للتنمية الصناعية (يونيدو) لدعم رائدات الأعمال.", textEn: "Anouncing a joint training workshop with UNIDO to support female entrepreneurs in Sudan.", sectorAr: "ريادة الأعمال والمشاريع الصغيرة", sectorEn: "SMEs & Entrepreneurship", replies: 8, likes: 45, date: "أمس" }
];

// Predictive charts generator
const SUPPLY_CHAIN_CHART_DATA = [
  { month: "Jan", capacity: 85, disruptions: 3, recoveryRate: 98 },
  { month: "Feb", capacity: 89, disruptions: 2, recoveryRate: 97 },
  { month: "Mar", capacity: 74, disruptions: 7, recoveryRate: 90 },
  { month: "Apr", capacity: 80, disruptions: 5, recoveryRate: 94 },
  { month: "May", capacity: 92, disruptions: 1, recoveryRate: 99 },
  { month: "Jun", capacity: 95, disruptions: 2, recoveryRate: 98 },
  { month: "Jul (Est)", capacity: 97, disruptions: 1, recoveryRate: 99 }
];

export default function SovereignCommerceEcosystemPlatform({ currentLanguage, role }: Props) {
  const [activeModule, setActiveModule] = useState<string>("directory");
  const [loading, setLoading] = useState<boolean>(false);
  const [matchStatus, setMatchStatus] = useState<any>(null);

  // Module 1 States
  const [directories, setDirectories] = useState(INITIAL_DIRECTORIES);
  const [dirSearch, setDirSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Module 2 States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [rfqs, setRfqs] = useState(INITIAL_RFQS);
  const [newProductNameAr, setNewProductNameAr] = useState("");
  const [newProductNameEn, setNewProductNameEn] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [newRfqTitleAr, setNewRfqTitleAr] = useState("");
  const [negotiationText, setNegotiationText] = useState("");
  const [negotiationLog, setNegotiationLog] = useState<Array<{ sender: string; text: string; date: string }>>([
    { sender: "Buyer (Global Foods)", text: "We need 50 tons of Hashab gum arabic. Can you offer a volume discount on the $3,400 price?", date: "15:30" },
    { sender: "Seller (National Gum Arabic)", text: "We can reduce to $3,250 for contracts above 40 tons with immediate letter of credit.", date: "15:45" }
  ]);

  // Module 3 States
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [newShipmentTracking, setNewShipmentTracking] = useState("");
  const [newShipmentCargo, setNewShipmentCargo] = useState("");
  const [newShipmentOrigin, setNewShipmentOrigin] = useState("");
  const [newShipmentDest, setNewShipmentDest] = useState("");

  // Module 5 States
  const [registeredSmes, setRegisteredSmes] = useState<any[]>([
    { id: "sme-1", name: "محاصيل كردفان للتصدير المحدودة", category: "Micro", employees: 8, location: "الأبيض", score: 94 },
    { id: "sme-2", name: "مخبز النيلين الحديث للحلويات", category: "Small", employees: 24, location: "أم درمان", score: 88 }
  ]);
  const [newSmeName, setNewSmeName] = useState("");
  const [newSmeEmployees, setNewSmeEmployees] = useState("");
  const [newSmeLocation, setNewSmeLocation] = useState("");

  // Module 7 States
  const [tenders, setTenders] = useState(PROCUREMENT_TENDERS);
  const [selectedTenderId, setSelectedTenderId] = useState("ten-1");
  const [bidAmount, setBidAmount] = useState("");
  const [bidProposal, setBidProposal] = useState("");
  const [bidSubmittedSuccessfully, setBidSubmittedSuccessfully] = useState(false);

  // Module 8 States
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [newPostText, setNewPostText] = useState("");

  // Module 10 States
  const [activeWorkspaceUsers, setActiveWorkspaceUsers] = useState<any[]>([
    { name: "أ. معتز الماحي - رئيس قطاع اللوجستيات", active: true },
    { name: "د. بثينة عوض الله - ممثلة بنك السودان المركزي", active: true },
    { name: "م. الهادي الفاضل - رئيس هيئة الرقابة على الصادرات", active: false }
  ]);
  const [workspaceMessages, setWorkspaceMessages] = useState<any[]>([
    { sender: "معتز الماحي", text: "تم تحديث مستندات بوليصة الشحن السيادية رقم SD-994 المربوطة بميناء دبي للمراجعة والاعتماد الجمركي السريع.", time: "14:10" },
    { sender: "بثينة عوض الله", text: "تمت مراجعة خط الإقراض والاعتماد المستندي للمصانع، جاري تفعيل نافذة الدفع الفوري لدول الكوميسا.", time: "14:22" }
  ]);
  const [newWorkspaceMsg, setNewWorkspaceMsg] = useState("");

  // AI Matching Recommendation Logic (Module 1, 2 & 6)
  const handleTriggerAiMatcher = () => {
    setLoading(true);
    setMatchStatus(null);
    setTimeout(() => {
      setLoading(false);
      setMatchStatus({
        matchedPartners: [
          { companyAr: "المؤسسة الوطنية لتطوير الصمغ العربي", companyEn: "National Gum Arabic Development Corp", score: 99, type: "Exporter", reasonAr: "مطابقة عالية القدرة على التصدير وسجل خالي من المخالفات الجمركية لولاية البحر الأحمر.", reasonEn: "Highest compliance rating and active customs integration at Port Sudan." },
          { companyAr: "شركة سوداتك للحلول البرمجية المتكاملة", companyEn: "Sudatech Integrated Software", score: 94, type: "IT SME Partner", reasonAr: "خيار ريادي ممتاز لتنفيذ التحول التقني المطلوب وبثقة معاملات مرتفعة.", reasonEn: "Strategic partner for automating digital logistics pipelines and compliance tracking." }
        ],
        marketAdviceAr: "الأسواق ذات الفرص الأعلى حالياً للتصدير: فرنسا (الطلب على الصمغ بنسبة +14%)، المملكة العربية السعودية (الزيوت الزراعية بنسبة +22%)، كينيا (سلاسل التوزيع والمنسوجات بنسبة +18%).",
        marketAdviceEn: "Highest opportunity markets: France (Gum Arabic imports up 14%), Saudi Arabia (Agricultural Oils up 22%), Kenya (Textiles distribution networks up 18%)."
      });
    }, 2000);
  };

  // Add Product to Marketplace
  const handleAddProduct = () => {
    if (!newProductNameAr || !newProductPrice) return;
    const prod = {
      id: `p-${Date.now()}`,
      nameAr: newProductNameAr,
      nameEn: newProductNameEn || newProductNameAr,
      company: "Your Verified Enterprise Co.",
      price: parseFloat(newProductPrice),
      unit: "Metric Ton",
      stock: parseInt(newProductStock || "50"),
      categoryAr: "منتجات وطنية مضافة",
      categoryEn: "Sovereign Added Products"
    };
    setProducts(prev => [...prev, prod]);
    setNewProductNameAr("");
    setNewProductNameEn("");
    setNewProductPrice("");
    setNewProductStock("");
  };

  // Create RFQ
  const handleAddRfq = () => {
    if (!newRfqTitleAr) return;
    const rfq = {
      id: `rfq-${Date.now()}`,
      titleAr: newRfqTitleAr,
      titleEn: newRfqTitleAr,
      buyerAr: "Your Company",
      buyerEn: "Your Company",
      status: "open",
      responses: 0
    };
    setRfqs(prev => [rfq, ...prev]);
    setNewRfqTitleAr("");
  };

  // Submit Bid for Tenders (Module 7)
  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBidSubmittedSuccessfully(true);
      setTenders(prev =>
        prev.map(t =>
          t.id === selectedTenderId ? { ...t, bidsSubmitted: t.bidsSubmitted + 1 } : t
        )
      );
      setTimeout(() => setBidSubmittedSuccessfully(false), 5000);
      setBidAmount("");
      setBidProposal("");
    }, 1500);
  };

  // Submit Negotiation message
  const handleSendNegotiationMsg = () => {
    if (!negotiationText.trim()) return;
    setNegotiationLog(prev => [...prev, { sender: "You (Authorized Dealer)", text: negotiationText, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    const currentText = negotiationText;
    setNegotiationText("");

    // AI automated negotiation reply simulation
    setTimeout(() => {
      setNegotiationLog(prev => [...prev, {
        sender: "AI Negotiator Co-Pilot",
        text: currentLanguage === "ar"
          ? `[اقتراح ذكي]: بناءً على أسعار السوق الحالية في الكوميسا ومخزونات الطرف الآخر، يُنصح بقبول السعر بقيمة 3,280 دولار مع اشتراط تسليم مجاني لميناء بورتسودان.`
          : `[AI Suggestion]: Based on current COMESA index pricing and supplier capacity, we recommend offering a counter-offer of $3,280 conditional on Port Sudan FOB delivery.`,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // Create community post (Module 8)
  const handleAddPost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: currentLanguage === "ar" ? "بروفايل معتمد - مندوب شركة" : "Verified Enterprise Account",
      authorEn: "Verified Corporate Member",
      textAr: newPostText,
      textEn: newPostText,
      sectorAr: "المنتدى العام للأعمال",
      sectorEn: "General Business Forum",
      replies: 0,
      likes: 0,
      date: "الآن"
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostText("");
  };

  // Add SME Registry
  const handleAddSme = () => {
    if (!newSmeName) return;
    const s = {
      id: `sme-${Date.now()}`,
      name: newSmeName,
      category: parseInt(newSmeEmployees || "5") < 10 ? "Micro" : "Small",
      employees: parseInt(newSmeEmployees || "5"),
      location: newSmeLocation || "الخرطوم",
      score: 85 + Math.floor(Math.random() * 15)
    };
    setRegisteredSmes(prev => [...prev, s]);
    setNewSmeName("");
    setNewSmeEmployees("");
    setNewSmeLocation("");
  };

  // Add Shipment Tracker (Module 3)
  const handleAddShipment = () => {
    if (!newShipmentTracking || !newShipmentCargo) return;
    const s = {
      id: `shp-${Date.now()}`,
      tracking: newShipmentTracking,
      cargoAr: newShipmentCargo,
      cargoEn: newShipmentCargo,
      originAr: newShipmentOrigin || "الخرطوم",
      originEn: newShipmentOrigin || "Khartoum",
      destinationAr: newShipmentDest || "بورتسودان",
      destinationEn: newShipmentDest || "Port Sudan",
      carrier: "Nile National Logistics",
      status: "pickup",
      risk: "low"
    };
    setShipments(prev => [...prev, s]);
    setNewShipmentTracking("");
    setNewShipmentCargo("");
    setNewShipmentOrigin("");
    setNewShipmentDest("");
  };

  // Add Inter-company messaging
  const handleSendWorkspaceMsg = () => {
    if (!newWorkspaceMsg.trim()) return;
    setWorkspaceMessages(prev => [...prev, { sender: currentLanguage === "ar" ? "أنت (ممثل الشركة)" : "You (Company Representative)", text: newWorkspaceMsg, time: "الآن" }]);
    setNewWorkspaceMsg("");
  };

  // Filtering Business Directory list
  const filteredDirectories = directories.filter(d => {
    const term = dirSearch.toLowerCase();
    const matchTerm = (d.nameAr + " " + d.nameEn + " " + d.sectorAr + " " + d.sectorEn).toLowerCase().includes(term);
    const matchCategory = selectedCategory === "all" || d.category === selectedCategory;
    return matchTerm && matchCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-[#1E293B]" id="national-commerce-ecosystem-portal">
      {/* Platform Header */}
      <div className="bg-gradient-to-r from-sudan-green to-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black bg-sudan-gold/20 text-sudan-gold border border-sudan-gold/30 px-3 py-1 rounded-full uppercase tracking-wider">
              {currentLanguage === "ar" ? "رؤية السودان ٢٠٣٥ - المرحلة ١١" : "SUDAN VISION 2035 - PHASE 11"}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "Cairo, sans-serif" }}>
              {currentLanguage === "ar" ? "منصة المنظومة التجارية الوطنية الموحدة" : "National Commerce Ecosystem Platform"}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-semibold max-w-2xl leading-relaxed">
              {currentLanguage === "ar"
                ? "بوابة موحدة لربط المؤسسات الحكومية والقطاع الخاص، سلاسل الإمداد الوطنية والإقليمية، وتنمية المشاريع الصغيرة وجذب المستثمرين بذكاء اصطناعي سيادي."
                : "A unified gateway connecting public entities, private sectors, logistics, regional COMESA trade pipelines, and intelligent AI-powered business development."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleTriggerAiMatcher}
              className="bg-sudan-gold hover:bg-amber-500 text-slate-900 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-slate-900 animate-spin" />
              {currentLanguage === "ar" ? "توصيات ومطابقة الذكاء الاصطناعي" : "AI Matchmaking & Advices"}
            </button>
            <div className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-center text-xs font-bold font-mono">
              <span className="text-sudan-gold block text-[10px] uppercase">Ecosystem nodes</span>
              14,812 Connected
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 10 Modules menu & contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar (10 Modules) */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2.5 mb-3">
            {currentLanguage === "ar" ? "الوحدات التشغيلية العشر" : "THE 10 SYSTEM MODULES"}
          </h3>

          {[
            { id: "directory", labelAr: "دليل الأعمال والشركاء", labelEn: "Business Directory", icon: Users, descAr: "دليل السجلات والشركاء المعتمدين", descEn: "Companies & partner database" },
            { id: "marketplace", labelAr: "سوق الـ B2B والتعاقد", labelEn: "B2B Digital Marketplace", icon: ShoppingBag, descAr: "إدارة المنتجات، العروض والمفاوضات", descEn: "Products, RFQs & Negotiation" },
            { id: "supply-chain", labelAr: "سلاسل الإمداد والخدمات", labelEn: "National Supply Chain", icon: Truck, descAr: "المخازن والتتبع ومخاطر النقل", descEn: "Warehouses, tracking & risk log" },
            { id: "export", labelAr: "مركز ترويج الصادرات", labelEn: "Export Promotion Center", icon: Globe, descAr: "الربط الدولي وأسواق الكوميسا", descEn: "COMESA and global market expansion" },
            { id: "sme", labelAr: "تنمية المشروعات الصغيرة", labelEn: "SME Development Hub", icon: Award, descAr: "التصنيف والتمويل وبرامج النمو", descEn: "SME classification & programs" },
            { id: "investor", labelAr: "منصة الاستثمار المشترك", labelEn: "Investor Collaboration Hub", icon: Cpu, descAr: "مشاريع الشراكة وفرص التمويل", descEn: "Investment mapping & due diligence" },
            { id: "procurement", labelAr: "المشتريات والعطاءات الرقمية", labelEn: "Digital Procurement", icon: Briefcase, descAr: "تقديم العطاءات والتقييم الفيدرالي", descEn: "Sovereign bidding & supplier ratings" },
            { id: "community", labelAr: "مجتمع الأعمال والقطاعات", labelEn: "National Business Community", icon: MessageSquare, descAr: "المنتديات وورش العمل والفعاليات", descEn: "Sector forums & knowledge share" },
            { id: "bi", labelAr: "ذكاء الأعمال والتحليلات", labelEn: "BI Ecosystem & Forecasts", icon: BarChart3, descAr: "مؤشرات التجارة والتنبؤ الاقتصادي", descEn: "Trade intelligence & macro charts" },
            { id: "collaboration", labelAr: "منصة التعاون الآمنة", labelEn: "Collaboration Workspace", icon: Network, descAr: "المراسلات والملفات والمشاريع المشتركة", descEn: "Inter-company chat & workspace" }
          ].map(module => {
            const Icon = module.icon;
            const isSelected = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  setMatchStatus(null);
                }}
                className={`w-full flex flex-col gap-0.5 px-3 py-2.5 rounded-2xl text-right transition-all border ${
                  isSelected
                    ? "bg-sudan-green text-white border-sudan-green shadow-xs font-black"
                    : "bg-white border-transparent text-slate-600 hover:text-sudan-green hover:bg-slate-50 hover:border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-sudan-gold" : "text-gray-400"}`} />
                  <span className="text-xs font-bold leading-tight">{currentLanguage === "ar" ? module.labelAr : module.labelEn}</span>
                </div>
                <span className={`text-[9px] font-semibold block ${isSelected ? "text-slate-200" : "text-gray-400"}`}>
                  {currentLanguage === "ar" ? module.descAr : module.descEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Core Workspace Output Container */}
        <div className="lg:col-span-3 flex flex-col">
          
          {/* AI Matching recommendations block (if triggered or visible) */}
          {matchStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 p-4 rounded-3xl mb-6 shadow-2xs text-xs space-y-3 font-semibold"
            >
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-sudan-gold animate-bounce" />
                  {currentLanguage === "ar" ? "توصيات المطابقة والفرص الاقتصادية (الذكاء الاصطناعي السيادي):" : "Sovereign AI Matchmaker & Investment Advisory:"}
                </span>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm">CONFIDENCE: 98.4%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-sudan-green">{currentLanguage === "ar" ? "الشركاء والفرص المقترحة للتوافق:" : "Matching Suppliers & Partners:"}</h4>
                  <div className="space-y-1.5">
                    {matchStatus.matchedPartners.map((p: any, idx: number) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-start gap-2 text-[11px]">
                        <div>
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? p.companyAr : p.companyEn}</p>
                          <p className="text-[10px] text-gray-500 font-semibold">{currentLanguage === "ar" ? p.reasonAr : p.reasonEn}</p>
                        </div>
                        <span className="shrink-0 bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-sm font-mono">{p.score}% MATCH</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/60 p-3 rounded-2xl border border-amber-200/55 leading-relaxed text-[11px] text-slate-700 space-y-1">
                  <p className="font-bold text-amber-800 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {currentLanguage === "ar" ? "تحليل الأسواق النشطة والنمو:" : "Market Intelligence Advisory:"}
                  </p>
                  <p>{currentLanguage === "ar" ? matchStatus.marketAdviceAr : matchStatus.marketAdviceEn}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Module Inner Workspace Layout */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-2xs flex-1 flex flex-col">
            
            {/* MODULE 1: NATIONAL BUSINESS DIRECTORY */}
            {activeModule === "directory" && (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-sudan-green" />
                        {currentLanguage === "ar" ? "الدليل الوطني الموحد للأعمال والشركاء مع الموازاة الفيدرالية" : "National Business Directory & Certified Partners"}
                      </h2>
                      <p className="text-[11px] text-gray-500 font-bold mt-1">
                        {currentLanguage === "ar" ? "دليل مركزي معتمد للبحث في الشركات المسجلة، المصانع، المصدرين، والمستوردين بجمهورية السودان." : "Federated national register of verified suppliers, startups, logistics operators, and government partners."}
                      </p>
                    </div>
                    <span className="bg-sudan-green/10 text-sudan-green text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0">
                      {directories.length} {currentLanguage === "ar" ? "مؤسسة مسجلة" : "Connected Enterprises"}
                    </span>
                  </div>

                  {/* Filter and Search controls */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="md:col-span-2 relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={dirSearch}
                        onChange={(e) => setDirSearch(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "ابحث بالاسم، القطاع، أو الولاية..." : "Search by name, sector, state..."}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-sudan-green focus:bg-white text-xs font-bold pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-xl outline-none"
                      >
                        <option value="all">{currentLanguage === "ar" ? "كل الفئات" : "All Categories"}</option>
                        <option value="manufacturer">{currentLanguage === "ar" ? "منشآت صناعية ومصانع" : "Industrial & Factories"}</option>
                        <option value="exporter">{currentLanguage === "ar" ? "مصدرون معتمدون" : "Certified Exporters"}</option>
                        <option value="service">{currentLanguage === "ar" ? "مزودو خدمات ولوجستيات" : "Logistics & Services"}</option>
                        <option value="sme">{currentLanguage === "ar" ? "شركات صغيرة ومتوسطة" : "SMEs & Startups"}</option>
                      </select>
                    </div>
                  </div>

                  {/* Directory Entries List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDirectories.map(ent => (
                      <div key={ent.id} className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-sudan-green p-4 rounded-2xl transition-all shadow-3xs flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-800 px-2 py-0.5 rounded-sm">
                              {currentLanguage === "ar" ? ent.sectorAr : ent.sectorEn}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs">
                              {ent.verified && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                                  <Check className="w-3 h-3" />
                                  {currentLanguage === "ar" ? "موثق سيادياً" : "Verified"}
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-sudan-gold font-bold">TRUST: {ent.trust}%</span>
                            </div>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 mb-1">
                            {currentLanguage === "ar" ? ent.nameAr : ent.nameEn}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold mb-3">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{currentLanguage === "ar" ? ent.locationAr : ent.locationEn}</span>
                            <span className="text-gray-300">|</span>
                            <span>{currentLanguage === "ar" ? `حجم المؤسسة: ${ent.size}` : `Size: ${ent.size}`}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] font-bold">
                          <button
                            onClick={() => {
                              setDirSearch(ent.nameEn);
                              handleTriggerAiMatcher();
                            }}
                            className="text-sudan-green hover:text-sudan-green-light flex items-center gap-1"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            {currentLanguage === "ar" ? "مطابقة أعمال ذكية" : "AI Business Match"}
                          </button>
                          <span className="text-gray-400">UID: SD-{ent.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: B2B DIGITAL MARKETPLACE */}
            {activeModule === "marketplace" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "سوق الصفقات والمنتجات والطلبات (B2B Marketplace)" : "National B2B Digital Marketplace & Negotiation Workspace"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "نشر كتالوجات المنتجات الوطنية، تقديم طلبات عروض الأسعار (RFQ)، ومساحة التفاوض الذكي والتعاقد الفوري." : "Publish national wholesale trade catalogs, manage request for quotations, and execute smart contract agreements."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Products List & Submission */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "المنتجات الوطنية النشطة" : "Active Strategic Wholesale Products"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {products.map(prod => (
                        <div key={prod.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-sudan-green transition-all shadow-3xs flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                              {currentLanguage === "ar" ? prod.categoryAr : prod.categoryEn}
                            </span>
                            <h4 className="text-xs font-black text-slate-800 mt-2">
                              {currentLanguage === "ar" ? prod.nameAr : prod.nameEn}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-semibold">{prod.company}</p>
                            <p className="text-xs font-black text-slate-900 mt-2 font-mono">
                              ${prod.price.toLocaleString()} USD <span className="text-[10px] text-gray-500 font-semibold">/ {prod.unit}</span>
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mt-3 pt-2 border-t border-slate-200/50">
                            <span>{currentLanguage === "ar" ? `المخزون: ${prod.stock}` : `Stock: ${prod.stock}`}</span>
                            <button
                              onClick={() => {
                                setNegotiationText(`Hello, we are interested in placing an order for ${prod.nameEn}. Please send us your best quotation.`);
                                handleSendNegotiationMsg();
                              }}
                              className="text-sudan-green hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              {currentLanguage === "ar" ? "تفاوض فوري" : "Negotiate"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Product Form */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 mb-3">
                        {currentLanguage === "ar" ? "أضف منتج جديد لكتالوج التصدير والبيع الوطني" : "Add Wholesale Product to State Trade Catalog"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          value={newProductNameAr}
                          onChange={(e) => setNewProductNameAr(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "اسم المنتج بالعربية..." : "Product Name (Arabic)..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sudan-green"
                        />
                        <input
                          type="text"
                          value={newProductNameEn}
                          onChange={(e) => setNewProductNameEn(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "اسم المنتج بالإنجليزية..." : "Product Name (English)..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sudan-green"
                        />
                        <input
                          type="number"
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "السعر للطن بالدولار ($)..." : "Price per ton USD ($)..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sudan-green font-mono"
                        />
                        <input
                          type="number"
                          value={newProductStock}
                          onChange={(e) => setNewProductStock(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "المخزون المتوفر بالطن..." : "Available wholesale stock (Tons)..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sudan-green font-mono"
                        />
                      </div>
                      <button
                        onClick={handleAddProduct}
                        disabled={!newProductNameAr || !newProductPrice}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        {currentLanguage === "ar" ? "نشر وتدقيق المنتج فوراً" : "Publish Wholesale Product"}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Negotiation workspace and RFQs */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "مساحة التفاوض والتعاقد الفوري" : "Sovereign Contract Negotiation Board"}
                    </h3>

                    {/* Negotiation logs */}
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl h-[260px] overflow-y-auto space-y-3 font-semibold text-[11px] leading-relaxed shadow-sm">
                      {negotiationLog.map((log, idx) => (
                        <div key={idx} className={`p-2 rounded-xl ${log.sender.includes("AI") ? "bg-amber-950/40 border border-amber-900/40 text-sudan-gold" : "bg-slate-800 text-slate-100"}`}>
                          <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold mb-1">
                            <span>{log.sender}</span>
                            <span>{log.date}</span>
                          </div>
                          <p>{log.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={negotiationText}
                        onChange={(e) => setNegotiationText(e.target.value)}
                        placeholder={currentLanguage === "ar" ? "أرسل عرض سعر أو رد قانوني للمشتري..." : "Send price quote or counter-offer..."}
                        className="flex-1 bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none"
                      />
                      <button
                        onClick={handleSendNegotiationMsg}
                        className="bg-sudan-green text-white p-2.5 rounded-xl font-bold hover:bg-emerald-700 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-sudan-gold" />
                      </button>
                    </div>

                    {/* RFQs List */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 mb-2">{currentLanguage === "ar" ? "طلبات عروض الأسعار الوطنية المفتوحة" : "Active State RFQs"}</h4>
                      <div className="space-y-2">
                        {rfqs.map(rfq => (
                          <div key={rfq.id} className="bg-white p-2.5 rounded-xl border border-slate-150 flex justify-between items-center text-[11px]">
                            <div>
                              <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? rfq.titleAr : rfq.titleEn}</p>
                              <p className="text-[9px] text-gray-400 font-semibold">{currentLanguage === "ar" ? rfq.buyerAr : rfq.buyerEn}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-sm shrink-0 font-mono text-[9px]">
                              {rfq.responses} Offer(s)
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          value={newRfqTitleAr}
                          onChange={(e) => setNewRfqTitleAr(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "عنوان طلب توريد للمنتجات..." : "Request custom sourcing/RFQ..."}
                          className="flex-1 bg-white border border-slate-200 text-xs font-semibold p-2 rounded-lg outline-none"
                        />
                        <button
                          onClick={handleAddRfq}
                          className="bg-slate-900 text-[#FFD700] text-xs font-black px-3 py-2 rounded-lg cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* MODULE 3: NATIONAL SUPPLY CHAIN PLATFORM */}
            {activeModule === "supply-chain" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "منصة سلاسل الإمداد وتتبع شحنات المحاصيل الاستراتيجية" : "National Supply Chain & Real-Time Logistics Tracking"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "رصد الشحنات ومستويات مخزون المستودعات الفيدرالية وتحليلات مخاطر النقل الإقليمية." : "Monitor strategic crop shipments, federal warehouse inventories, and cross-border logistics telemetry."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Shipment List and Live Map telemetry mock */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-sudan-green animate-pulse" />
                      {currentLanguage === "ar" ? "الشحنات الاستراتيجية قيد العبور الفيدرالي" : "Live Trans-Federal Shipments & Cargo Tracing"}
                    </h3>

                    <div className="space-y-3">
                      {shipments.map(shp => (
                        <div key={shp.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-sudan-green transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-slate-800">{shp.tracking}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                                shp.status === "in-transit" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800 animate-pulse"
                              }`}>
                                {shp.status.toUpperCase()}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                                shp.risk === "low" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }`}>
                                RISK: {shp.risk.toUpperCase()}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-slate-800">
                              {currentLanguage === "ar" ? shp.cargoAr : shp.cargoEn}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-semibold font-mono">
                              {currentLanguage === "ar" ? `المسار: من ${shp.originAr} ➔ إلى ${shp.destinationAr}` : `Route: ${shp.originEn} ➔ ${shp.destinationEn}`}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-4 text-xs font-bold text-gray-500">
                            <div>
                              <span className="text-[9px] text-gray-400 block uppercase font-mono">Carrier</span>
                              <span>{shp.carrier}</span>
                            </div>
                            <button
                              onClick={() => {
                                handleTriggerAiMatcher();
                              }}
                              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 p-2 rounded-xl transition-all cursor-pointer"
                            >
                              <Search className="w-4 h-4 text-sudan-gold" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* New Shipment Registry form */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 mb-3">{currentLanguage === "ar" ? "تسجيل بوليصة شحن أو ترخيص عبور جديد" : "Register Sovereign Cargo & Dispatch Ticket"}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          value={newShipmentTracking}
                          onChange={(e) => setNewShipmentTracking(e.target.value)}
                          placeholder="Tracking Code (e.g. SD-LOG-9000)..."
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                        />
                        <input
                          type="text"
                          value={newShipmentCargo}
                          onChange={(e) => setNewShipmentCargo(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "وصف الشحنة والوزن..." : "Cargo description and weight..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none"
                        />
                        <input
                          type="text"
                          value={newShipmentOrigin}
                          onChange={(e) => setNewShipmentOrigin(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "نقطة الانطلاق (الولاية/المخزن)..." : "Origin (State/Warehouse)..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none"
                        />
                        <input
                          type="text"
                          value={newShipmentDest}
                          onChange={(e) => setNewShipmentDest(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "الوجهة النهائية أو منفذ التصدير..." : "Destination (Port/Border)..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none"
                        />
                      </div>
                      <button
                        onClick={handleAddShipment}
                        disabled={!newShipmentTracking || !newShipmentCargo}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تسجيل وإرسال إشعار للجمارك" : "Register Logistics Shipment"}
                      </button>
                    </div>

                  </div>

                  {/* Right Column: Supply Chain Risk & Inventory Analysis */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold">
                      <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        {currentLanguage === "ar" ? "رصد المخاطر والتنبؤ اللوجستي الذكي" : "Sovereign Supply Chain Risk Analysis"}
                      </h4>
                      <div className="space-y-2 leading-relaxed">
                        <div className="bg-white p-2.5 rounded-xl border-l-4 border-l-amber-500">
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "بطء نسبي في منفذ بورتسودان" : "Port Sudan Gate 4 Congestion"}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{currentLanguage === "ar" ? "مدة الانتظار المقدرة للشاحنات تزيد بنسبة ٢٥٪ بسبب تدقيق الأوراق اليدوية." : "Due to manual paper verification processes. Recommend digital APIs transition."}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border-l-4 border-l-emerald-500">
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "جاهزية مستودعات القضارف المبردة" : "Al Qadarif Storage Node Ready"}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{currentLanguage === "ar" ? "سعة التخزين الحالية ٨٢٪ والمستشعرات تعمل بكفاءة تامة." : "82% storage volume index. Smart cooling and humidity sensors fully functional."}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                      <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-sudan-green" />
                        {currentLanguage === "ar" ? "مؤشرات المرونة والتعافي" : "Logistics Performance & Capacity"}
                      </h4>
                      <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={SUPPLY_CHAIN_CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                            <YAxis tick={{ fontSize: 9 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="capacity" stroke="#007229" fill="#007229" fillOpacity={0.1} />
                            <Area type="monotone" dataKey="recoveryRate" stroke="#FFD700" fill="#FFD700" fillOpacity={0.1} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* MODULE 4: EXPORT PROMOTION CENTER */}
            {activeModule === "export" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مركز ترويج الصادرات السودانية والشراكات الإقليمية" : "Sudan Export Promotion Center & Regional Trade Gateway"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "مواءمة الصادرات الوطنية مع أسواق الكوميسا، والمطابقة الفورية لمعايير الاتحاد الأوروبي والخليج بذكاء اصطناعي سيادي." : "Aligning exports with COMESA and international markets, utilizing smart sovereign standards compliance checking."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Export promotion programs */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "مبادرات ترويج الصادرات الفيدرالية" : "Active National Export Promotion Programs"}</h3>
                    <div className="space-y-3">
                      {EXPORT_PROGRAMS.map(prog => (
                        <div key={prog.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-sudan-green transition-all shadow-3xs">
                          <h4 className="text-xs font-black text-slate-800 mb-1">{currentLanguage === "ar" ? prog.titleAr : prog.titleEn}</h4>
                          <p className="text-[11px] text-gray-500 font-semibold leading-relaxed mb-3">{currentLanguage === "ar" ? prog.descriptionAr : prog.descriptionEn}</p>
                          <div className="flex justify-between items-center text-[10px] font-bold text-sudan-green pt-2 border-t border-slate-200/60">
                            <span>{currentLanguage === "ar" ? `${prog.activeExporters} مصدر مسجل` : `${prog.activeExporters} Enrolled Exporters`}</span>
                            <button
                              onClick={() => {
                                handleTriggerAiMatcher();
                              }}
                              className="text-sudan-gold bg-slate-900 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              {currentLanguage === "ar" ? "تقديم طلب اشتراك" : "Enroll Now"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export AI Advisor & Country opportunity */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-sudan-green" />
                        {currentLanguage === "ar" ? "المستشار الجمركي والترويجي الذكي (Export AI Advisor)" : "Autonomous Export Compliance Advisor"}
                      </h3>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs text-[11px] font-semibold text-slate-700 leading-relaxed space-y-2">
                        <p className="font-bold text-sudan-green">💡 {currentLanguage === "ar" ? "تحديث المعايير الجمركية للكوميسا (2026):" : "COMESA Regulatory Quality Update (2026):"}</p>
                        <p>
                          {currentLanguage === "ar"
                            ? "تم تحديث الرقم التعريفي لجمارك شهادات المنشأ المشتركة. يرجى مطابقة بوليصة الشحن مع نظام الجمارك الفيدرالي في بورتسودان لتفادي الغرامات وتأخير السفن."
                            : "National Certificate of Origin system is now connected with Port Sudan customs database. Align shipping HS codes to skip redundant terminal inspections."}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">{currentLanguage === "ar" ? "تقييم الجاهزية للتصدير الخارجي" : "Instant Export Readiness Assessment"}</h4>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "درجة الجاهزية الرقمية للمؤسسة" : "Sovereign Digital Trade Score"}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">EXCELLENT (92 / 100)</p>
                        </div>
                        <button
                          onClick={handleTriggerAiMatcher}
                          className="bg-sudan-green hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "تحسين الجاهزية" : "Optimize Ready"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* MODULE 5: SME DEVELOPMENT PLATFORM */}
            {activeModule === "sme" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "حاضنة ومسرعة ريادة الأعمال والمشاريع الصغيرة (SMEs)" : "National SME Classification & Business Development Hub"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "تصنيف المشاريع، مبادرات التمويل الأصغر المدعوم، ومتابعة الأداء الرقمي لريادة الأعمال." : "Register SMEs, apply for micro-grants and funding stage programs, and track digital business readiness metrics."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* SME Register list */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "الشركات والمشاريع الريادية المسجلة" : "Enrolled SMEs & Growth Cohort"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {registeredSmes.map(sme => (
                        <div key={sme.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-sm">
                              {sme.category} Enterprise
                            </span>
                            <h4 className="text-xs font-black text-slate-800 mt-2">{sme.name}</h4>
                            <p className="text-[10px] text-gray-500 font-semibold">{currentLanguage === "ar" ? `الولاية: ${sme.location} | موظفين: ${sme.employees}` : `Location: ${sme.location} | Employees: ${sme.employees}`}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[9px] text-gray-400 block font-mono">GROWTH SCORE</span>
                            <span className="text-emerald-600 font-mono font-black text-sm">{sme.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Registry input form */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 mb-3">{currentLanguage === "ar" ? "سجل مشروعك الريادي في منظومة الدعم الفيدرالية" : "Enroll SME / Startup into National Incubation"}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <input
                          type="text"
                          value={newSmeName}
                          onChange={(e) => setNewSmeName(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "اسم المشروع التجاري..." : "SME Enterprise Name..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none"
                        />
                        <input
                          type="number"
                          value={newSmeEmployees}
                          onChange={(e) => setNewSmeEmployees(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "عدد الموظفين الحاليين..." : "Employee head count..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                        />
                        <input
                          type="text"
                          value={newSmeLocation}
                          onChange={(e) => setNewSmeLocation(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "الولاية/المقر..." : "State / Location..."}
                          className="bg-white text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-none"
                        />
                      </div>
                      <button
                        onClick={handleAddSme}
                        disabled={!newSmeName}
                        className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                      >
                        {currentLanguage === "ar" ? "تسجيل الملاءمة والحوكمة فوراً" : "Register SME Profile"}
                      </button>
                    </div>
                  </div>

                  {/* Growth funding programs info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "خطوط الائتمان وحواضن النمو" : "SME Development Programs"}</h3>
                    <div className="space-y-3">
                      {SME_GROWTH_PROGRAMS.map(prog => (
                        <div key={prog.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-sudan-green transition-all text-xs">
                          <h4 className="font-extrabold text-slate-800 mb-1">{currentLanguage === "ar" ? prog.titleAr : prog.titleEn}</h4>
                          <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 mt-2 border-t border-slate-200/60 font-bold">
                            <span>BUDGET: <span className="text-sudan-gold">{prog.budget}</span></span>
                            <span>{prog.applicationsCount} enrolled</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* MODULE 6: INVESTOR COLLABORATION HUB */}
            {activeModule === "investor" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "محور تعاون المستثمرين ومشاريع الشراكة العامة (PPP)" : "National Investor Collaboration Hub & PPP Marketplace"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "عرض مشاريع البنية التحتية، الاستيراد والتصدير الكبرى، ومطابقة المستثمرين الإقليميين والدوليين مع الشركات الوطنية." : "Expose strategic public-private partnership (PPP) opportunities, and coordinate international investor due diligence workspace."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strategic Investment Opportunities list */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "فرص الاستثمار الاستراتيجي المفتوحة" : "Active Strategic Investment Opportunities"}</h3>
                    <div className="space-y-3">
                      {INVESTMENT_OPPS.map(opp => (
                        <div key={opp.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-sudan-green transition-all shadow-3xs flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] bg-sudan-gold/20 text-slate-900 border border-sudan-gold/30 font-bold px-2 py-0.5 rounded-sm">
                                {opp.type} Project
                              </span>
                              <span className="text-[11px] font-mono text-sudan-green font-black">{opp.capitalNeeded}</span>
                            </div>
                            <h4 className="text-xs font-black text-slate-800 mb-2 leading-relaxed">{currentLanguage === "ar" ? opp.titleAr : opp.titleEn}</h4>
                            <p className="text-[10px] text-gray-500 font-semibold">{currentLanguage === "ar" ? `القطاع: ${opp.sectorAr}` : `Sector: ${opp.sectorEn}`}</p>
                          </div>
                          <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mt-3 pt-2 border-t border-slate-200/50">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              {currentLanguage === "ar" ? `${opp.matchesCount} مستثمر مهتم` : `${opp.matchesCount} Active Inquiries`}
                            </span>
                            <button
                              onClick={() => {
                                handleTriggerAiMatcher();
                              }}
                              className="text-sudan-green hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              {currentLanguage === "ar" ? "بدء المراجعة الفنية" : "Enter GRC Workspace"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investor matchmaking and GRC due diligence workspace */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-sudan-gold" />
                        {currentLanguage === "ar" ? "بوابة التدقيق النافي للجهالة المشفرة (Due Diligence)" : "Sovereign Encrypted Due Diligence Vault"}
                      </h3>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs text-[11px] font-semibold text-slate-700 leading-relaxed space-y-3">
                        <p className="font-bold text-red-700 flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {currentLanguage === "ar" ? "بروتوكول السرية والتحقق الفيدرالي:" : "Federal Non-Disclosure Agreement Protocol:"}
                        </p>
                        <p>
                          {currentLanguage === "ar"
                            ? "جميع المراسلات ومستندات دراسات الجدوى الفنية والمالية مشفرة بالكامل بنظام المفتاح العام والخاص المعترف به من بنك السودان المركزي ومسجلة على السجل الوطني."
                            : "All feasibility study file transactions, audit trails, and financial spreadsheets are cryptographically signed and logged onto the sovereign commerce ledger."}
                        </p>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono flex justify-between">
                          <span>SHA256 SIGNATURE:</span>
                          <span className="text-sudan-green font-black">9ab82...f91a2</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2">{currentLanguage === "ar" ? "تقييم أثر المشروع وموازاة الاستثمار" : "Sovereign PPP Impact Assessment"}</h4>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "درجة التوافق مع رؤية ٢٠٣٥" : "National Vision Alignment"}</p>
                          <p className="text-[10px] text-sudan-gold font-bold">GOLDEN CLASSIFICATION (96%)</p>
                        </div>
                        <button
                          onClick={handleTriggerAiMatcher}
                          className="bg-slate-950 text-[#FFD700] hover:bg-slate-900 font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "رؤية تفاصيل المؤشر" : "View Analytics"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* MODULE 7: DIGITAL PROCUREMENT SERVICES */}
            {activeModule === "procurement" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "بوابة المناقصات والمشتريات الرقمية الفيدرالية" : "National Digital Procurement & Unified Tender Hub"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "عرض العطاءات والمناقصات الحكومية المفتوحة، تقديم المقترحات الفنية والمالية، وتقييم أداء الموردين بشكل فوري وموثق." : "Bid on national commerce tenders, submit technical & financial proposals, and track real-time supplier performance ratings."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Tenders List */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "العطاءات والمناقصات الوطنية الجارية" : "Open Sovereign Tenders & Bidding Opportunities"}</h3>
                    <div className="space-y-3">
                      {tenders.map(ten => (
                        <div
                          key={ten.id}
                          onClick={() => {
                            setSelectedTenderId(ten.id);
                            setBidSubmittedSuccessfully(false);
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-3xs flex flex-col justify-between ${
                            selectedTenderId === ten.id
                              ? "bg-slate-55 border-sudan-green ring-1 ring-sudan-green"
                              : "bg-slate-50 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2 text-[10px] font-mono font-bold">
                              <span className="text-gray-400">{ten.number}</span>
                              <span className={`px-2 py-0.5 rounded-sm ${
                                ten.status === "open" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                              }`}>
                                {ten.status.toUpperCase()}
                              </span>
                            </div>
                            <h4 className="text-xs font-extrabold text-slate-900 mb-2 leading-relaxed">
                              {currentLanguage === "ar" ? ten.titleAr : ten.titleEn}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-bold">{currentLanguage === "ar" ? `الجهة المالكة: ${ten.authorityAr}` : `Authority: ${ten.authorityEn}`}</p>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 pt-3 mt-3 border-t border-slate-200/60">
                            <span>{currentLanguage === "ar" ? `آخر موعد لتقديم العروض: ${ten.deadline}` : `Deadline: ${ten.deadline}`}</span>
                            <span className="text-sudan-green flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {currentLanguage === "ar" ? `${ten.bidsSubmitted} عرض مقدم` : `${ten.bidsSubmitted} Bids Received`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bid Submission form */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "بوابة تقديم العروض والترشح" : "Bid Submission & GRC Check"}</h3>
                    <form onSubmit={handleSubmitBid} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{currentLanguage === "ar" ? "العطاء المحدد:" : "Selected Tender:"}</label>
                        <span className="text-xs font-black text-slate-800 block truncate">
                          {currentLanguage === "ar" ? tenders.find(t => t.id === selectedTenderId)?.titleAr : tenders.find(t => t.id === selectedTenderId)?.titleEn}
                        </span>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{currentLanguage === "ar" ? "قيمة العرض المالي (بالجنيه السوداني):" : "Financial Proposal Bid (SDG):"}</label>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="e.g. 45,000,000..."
                          className="w-full bg-white border border-slate-200 text-xs font-bold p-2.5 rounded-xl outline-none font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{currentLanguage === "ar" ? "الملخص الفني والمنهجية:" : "Technical proposal synopsis:"}</label>
                        <textarea
                          rows={3}
                          value={bidProposal}
                          onChange={(e) => setBidProposal(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "أدخل نبذة فنية عن جاهزيتكم وقدرة التوريد والشهادات الفيدرالية..." : "Detail technical compliance, logistical readiness..."}
                          className="w-full bg-white border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none"
                        ></textarea>
                      </div>

                      {bidSubmittedSuccessfully && (
                        <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 animate-pulse">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>{currentLanguage === "ar" ? "تم تسجيل العرض وتوقيعه بنجاح!" : "Bid submitted successfully!"}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || !bidAmount}
                        className="w-full bg-sudan-green hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin text-sudan-gold" /> : <Plus className="w-4 h-4 text-sudan-gold" />}
                        {currentLanguage === "ar" ? "تقديم وتوقيع العطاء رقمياً" : "Submit Encrypted Proposal"}
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* MODULE 8: NATIONAL BUSINESS COMMUNITY */}
            {activeModule === "community" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "مجتمع ومجالس قطاع الأعمال والشركاء الفيدراليين" : "National Business Community & Sector forums"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "شبكة مهنية موحدة للتجار، والمهندسين، والمصدرين لتبادل الخبرات وعقد الفعاليات والندوات المباشرة." : "Unified communication channel for certified business practitioners, commerce chambers, and trade organizations."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Forum posts feed */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h3 className="text-xs font-black text-slate-800 mb-2">{currentLanguage === "ar" ? "شارك مشاركة جديدة مع مجالس الأعمال" : "Publish new forum message to certified members"}</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "اكتب سؤالك، تحديثك، أو مبادرتك هنا..." : "Share a query or industry announcement..."}
                          className="flex-1 bg-white border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none"
                        />
                        <button
                          onClick={handleAddPost}
                          disabled={!newPostText.trim()}
                          className="bg-sudan-green text-white p-2.5 rounded-xl hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-4 h-4 text-sudan-gold" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {posts.map(post => (
                        <div key={post.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs text-xs space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                            <span className="text-slate-800">{currentLanguage === "ar" ? post.author : post.authorEn}</span>
                            <span>{post.date}</span>
                          </div>
                          <p className="text-slate-700 font-semibold leading-relaxed">
                            {currentLanguage === "ar" ? post.textAr : post.textEn}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-sudan-green font-bold pt-2 mt-2 border-t border-slate-100">
                            <span>SECTOR: {currentLanguage === "ar" ? post.sectorAr : post.sectorEn}</span>
                            <div className="flex items-center gap-3">
                              <span>👍 {post.likes}</span>
                              <span>💬 {post.replies} replies</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Expert Directory & Events */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-sudan-gold" />
                        {currentLanguage === "ar" ? "الفعاليات والغرف التجارية القادمة" : "Upcoming Trade Events"}
                      </h4>
                      <div className="space-y-2 leading-relaxed text-[11px] font-semibold">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "المؤتمر السنوي لصادرات الصمغ العربي" : "Annual Gum Arabic Export Convention"}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">2026-07-28 | بورتسودان (حضوري وافتراضي)</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                          <p className="font-extrabold text-slate-800">{currentLanguage === "ar" ? "ندوة الفرص واللوائح والتحصيل في الكوميسا" : "COMESA Customs & Tax Interoperability Workshop"}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">2026-08-05 | قاعة مجمع سوبا للأبحاث</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* MODULE 9: BUSINESS INTELLIGENCE ECOSYSTEM */}
            {activeModule === "bi" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "منظومة ذكاء الأعمال والتحليلات الاقتصادية الفيدرالية" : "National Business Intelligence & Macroeconomic Forecasting"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "تحليلات التجارة والصادرات، وتتبع حجم المعاملات الاقتصادية والتنبؤ بذكاء اصطناعي سيادي لجمهورية السودان." : "Track state commerce KPIs, strategic supply chain capacities, and AI-predicted trade volumes under Sudan Vision 2035."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Big trade forecast chart */}
                  <div className="lg:col-span-2 bg-white border border-slate-200 p-4 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {currentLanguage === "ar" ? "توقعات حجم صادرات الصمغ العربي والمحاصيل الزراعية" : "Predicted Strategic Export Volumes & Trade Growth"}
                    </h3>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={SUPPLY_CHAIN_CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="capacity" stroke="#007229" strokeWidth={3} name="Current Trade Volume" />
                          <Line type="monotone" dataKey="recoveryRate" stroke="#FFD700" strokeWidth={2} name="Sovereign AI Trend Model" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Column: Key Economic KPIs */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                      <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <Activity className="w-4 h-4 text-sudan-green" />
                        {currentLanguage === "ar" ? "المؤشرات الاقتصادية السيادية" : "Sovereign Commerce Indices"}
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-150">
                          <span className="text-[9px] text-gray-400 block uppercase font-mono">Net Export Value</span>
                          <span className="text-xs font-black text-slate-800 font-mono">$1.4B USD</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-150">
                          <span className="text-[9px] text-gray-400 block uppercase font-mono">SME Contribution</span>
                          <span className="text-xs font-black text-slate-800 font-mono">34.2%</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-150">
                          <span className="text-[9px] text-gray-400 block uppercase font-mono">COMESA Share</span>
                          <span className="text-xs font-black text-emerald-600 font-mono">42.8%</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-150">
                          <span className="text-[9px] text-gray-400 block uppercase font-mono">Tax Compliance</span>
                          <span className="text-xs font-black text-slate-800 font-mono">94.1%</span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl leading-relaxed text-[11px] text-slate-700">
                        <p className="font-extrabold text-emerald-800">🔮 {currentLanguage === "ar" ? "التقرير التنبئي الذكي لعام ٢٠٢٧:" : "AI Macroeconomic Forecast Model (2027):"}</p>
                        <p className="mt-0.5">
                          {currentLanguage === "ar"
                            ? "معدل النمو المتوقع لقطاع التصدير الصناعي يزيد بنسبة ١٨.٥٪ في حال تفعيل بوابات الربط الجمركية بالكامل مع دول الكوميسا والقرن الأفريقي."
                            : "Predicted industrial export growth to surge 18.5% conditional on completing unified customs integration with COMESA partner nations."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* MODULE 10: NATIONAL COLLABORATION PLATFORM */}
            {activeModule === "collaboration" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Network className="w-5 h-5 text-sudan-green" />
                      {currentLanguage === "ar" ? "بوابة الغرف المشتركة والتكامل الفيدرالي الآمن" : "National Collaborative Chambers & Secure Inter-Company Platform"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">
                      {currentLanguage === "ar" ? "التنسيق المباشر والمراسلة وتبادل الملفات بمرونة تامة وأمن مطلق تحت المظلة الفيدرالية لوزارة التجارة." : "Coordinate files and communicate inside encrypted, multi-agency workspaces directly overseen by Ministry directors."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Column: Active team members */}
                  <div className="lg:col-span-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <h3 className="font-black text-slate-800 uppercase tracking-wider">{currentLanguage === "ar" ? "الشركاء والجهات المتصلة" : "Collaborators & Staff"}</h3>
                    <div className="space-y-2 font-bold text-[11px]">
                      {activeWorkspaceUsers.map((usr, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-xl border border-slate-150 flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${usr.active ? "bg-emerald-500" : "bg-gray-300"}`} />
                          <span className="text-slate-800">{usr.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Encrypted chat log & Document upload */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-slate-55 border border-slate-200 p-4 rounded-2xl">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                          <Lock className="w-4 h-4 text-sudan-gold" />
                          {currentLanguage === "ar" ? "الغرفة الفيدرالية لتراخيص الصادرات المشتركة" : "Chamber: Joint Export Clearance Pipeline"}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm">SECURE NODE</span>
                      </div>

                      {/* Chat messages */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 h-[220px] overflow-y-auto space-y-3 text-xs leading-relaxed font-semibold">
                        {workspaceMessages.map((msg, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                              <span className="text-slate-800 font-extrabold">{msg.sender}</span>
                              <span className="font-mono">{msg.time}</span>
                            </div>
                            <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-slate-700">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Input form */}
                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          value={newWorkspaceMsg}
                          onChange={(e) => setNewWorkspaceMsg(e.target.value)}
                          placeholder={currentLanguage === "ar" ? "اكتب رسالة مشفرة لأعضاء الغرفة..." : "Message secure chamber partners..."}
                          className="flex-1 bg-white border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none"
                        />
                        <button
                          onClick={handleSendWorkspaceMsg}
                          className="bg-sudan-green text-white p-2.5 rounded-xl hover:bg-emerald-700 cursor-pointer"
                        >
                          <Send className="w-4 h-4 text-sudan-gold" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Verification tests results (UX Excellence indicator) */}
      <div className="mt-8 bg-slate-900 text-slate-100 rounded-3xl p-5 md:p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs shadow-md">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sudan-gold text-sm tracking-wider uppercase">
            {currentLanguage === "ar" ? "مركز التدقيق والتحقق والامتثال الفيدرالي" : "Federal Quality & Compliance Verification Council"}
          </h4>
          <p className="text-slate-400 font-semibold">
            {currentLanguage === "ar"
              ? "جميع العمليات، التوصيات، العقود، والمطابقات في المنظومة التجارية الوطنية الموحدة مجازة وتعمل وفق المعايير الفيدرالية."
              : "All system parameters, secure transaction pipelines, and compliance models are verified under Sudan National Standards (SSMO)."}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 font-mono font-bold">
          <div className="bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl">
            <span className="text-emerald-400 block text-[9px] uppercase">Compliance</span>
            ISO 27001 PASSED
          </div>
          <div className="bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl">
            <span className="text-emerald-400 block text-[9px] uppercase">Database Integr</span>
            99.98% COMPLETE
          </div>
          <div className="bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl">
            <span className="text-emerald-400 block text-[9px] uppercase">Security Level</span>
            ZERO TRUST ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}
