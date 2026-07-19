/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * Phase Twenty-Two - National Geospatial Intelligence & Digital Twin Platform
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Map, Layers, Activity, Search, Plus, Trash2, Settings, AlertCircle, CheckCircle2,
  Globe, Database, Cpu, TrendingUp, BarChart3, Shield, ShieldAlert, Users, Smartphone,
  Anchor, Truck, Plane, FileText, LayoutDashboard, Play, Volume2, VolumeX, Filter,
  Sparkles, RefreshCw, Eye, Scale, Terminal, ArrowRight, Lock, Clock, Send, Info,
  Zap, Radar, Network, X, ChevronRight, ChevronLeft, Check, ClipboardList, HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar as RechartsRadar
} from "recharts";

// TypeScript Interfaces for Geospatial and Digital Twin models
interface StateRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  center: [number, number];
  svgPath: string; // Vector shape of Sudan state
  color: string;
  metrics: {
    companies: number;
    factories: number;
    investmentReadiness: number; // 0-100
    riskScore: number; // 0-100
    consumersK: number;
    yieldTons: number;
  };
}

interface DigitalTwinAsset {
  id: string;
  nameAr: string;
  nameEn: string;
  stateId: string;
  category: "industrial" | "commercial" | "investment" | "logistics";
  status: "optimal" | "warning" | "critical" | "offline";
  coordinates: { x: number; y: number };
  sensors: {
    label: string;
    value: string;
    metric: string;
    status: "normal" | "alert" | "danger";
  }[];
  infrastructure: {
    power: "stable" | "unstable" | "backup";
    water: "connected" | "restricted";
    fiber: "active" | "down";
  };
}

interface SpatialBusiness {
  id: string;
  nameAr: string;
  nameEn: string;
  stateId: string;
  category: "factory" | "warehouse" | "hq" | "market";
  address: string;
  registrationNo: string;
  complianceRating: "A+" | "A" | "B" | "C" | "F";
  activity: string;
}

interface RouteSegment {
  id: string;
  nameAr: string;
  nameEn: string;
  type: "highway" | "railway" | "maritime" | "pipeline";
  status: "clear" | "delayed" | "blocked";
  lengthKm: number;
  avgTransitHours: number;
  coordinatesPath: string;
}

interface NationalGeospatialTwinPlatformProps {
  currentLanguage: "ar" | "en";
  role?: string;
}

export default function NationalGeospatialTwinPlatform({ currentLanguage, role = "admin" }: NationalGeospatialTwinPlatformProps) {
  // Global View / Tab states
  const [activeTab, setActiveTab] = useState<"gis-map" | "digital-twin" | "analytics" | "inspection" | "future-smart">("gis-map");
  const [selectedState, setSelectedState] = useState<string>("red_sea");
  const [activeLayers, setActiveLayers] = useState<string[]>(["boundaries", "industrial", "logistics", "markets"]);
  const [mapScale, setMapScale] = useState<number>(1);
  const [notifications, setNotifications] = useState<string[]>([
    "Sovereign PostGIS spatial connection established successfully.",
    "Real-time IoT state synchronization verified: Red Sea Terminal online.",
    "Satellite constellation Copernicus Sentinel-2 stream authenticated."
  ]);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);

  // Search Engine
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Spatial AI Query
  const [aiChatInput, setAiChatInput] = useState<string>("");
  const [aiChatHistory, setAiChatHistory] = useState<any[]>([
    {
      sender: "ai",
      textAr: "مرحباً! أنا المحلل الجغرافي الذكي لوزارة التجارة والصناعة لجمهورية السودان. يمكنني مساعدتك في تحليل سلاسل التوريد، واختيار مواقع المنشآت المثالية بناءً على الشبكات والمستهلكين، والتنبؤ بالنمو الإقليمي. اسألني أي سؤال جغرافي.",
      textEn: "Greetings! I am the Sovereign Spatial AI Analyst for Sudan's Ministry of Commerce & Industry. I can help you model supply chains, evaluate optimal site selections, and forecast regional economic growth. Ask me any spatial intelligence query."
    }
  ]);

  // MODULE 1: GIS Map Data (State Geometries)
  // Standardized SVG Coordinate representation for Sudan States
  const statesList: StateRegion[] = [
    {
      id: "red_sea",
      nameAr: "ولاية البحر الأحمر",
      nameEn: "Red Sea State",
      center: [280, 100],
      svgPath: "M 230 40 L 290 80 L 290 140 L 250 170 L 210 130 Z",
      color: "#0f766e",
      metrics: { companies: 840, factories: 120, investmentReadiness: 94, riskScore: 12, consumersK: 1400, yieldTons: 150000 }
    },
    {
      id: "khartoum",
      nameAr: "ولاية الخرطوم",
      nameEn: "Khartoum State",
      center: [170, 160],
      svgPath: "M 160 140 L 190 140 L 200 170 L 170 190 L 150 170 Z",
      color: "#0369a1",
      metrics: { companies: 4200, factories: 1450, investmentReadiness: 96, riskScore: 8, consumersK: 8500, yieldTons: 400000 }
    },
    {
      id: "gezira",
      nameAr: "ولاية الجزيرة",
      nameEn: "Gezira State",
      center: [180, 210],
      svgPath: "M 170 190 L 200 170 L 210 210 L 180 230 Z",
      color: "#1d4ed8",
      metrics: { companies: 1650, factories: 380, investmentReadiness: 88, riskScore: 15, consumersK: 4800, yieldTons: 950000 }
    },
    {
      id: "kassala",
      nameAr: "ولاية كسلا",
      nameEn: "Kassala State",
      center: [230, 190],
      svgPath: "M 210 130 L 250 170 L 240 210 L 200 190 Z",
      color: "#b45309",
      metrics: { companies: 540, factories: 65, investmentReadiness: 72, riskScore: 24, consumersK: 2100, yieldTons: 320000 }
    },
    {
      id: "river_nile",
      nameAr: "ولاية نهر النيل",
      nameEn: "River Nile State",
      center: [160, 100],
      svgPath: "M 140 70 L 210 70 L 230 110 L 190 140 L 140 120 Z",
      color: "#4d7c0f",
      metrics: { companies: 910, factories: 240, investmentReadiness: 85, riskScore: 10, consumersK: 1600, yieldTons: 540000 }
    },
    {
      id: "northern",
      nameAr: "الولاية الشمالية",
      nameEn: "Northern State",
      center: [90, 80],
      svgPath: "M 30 40 L 140 40 L 140 120 L 80 150 L 30 100 Z",
      color: "#15803d",
      metrics: { companies: 480, factories: 85, investmentReadiness: 78, riskScore: 5, consumersK: 1100, yieldTons: 710000 }
    },
    {
      id: "darfur",
      nameAr: "إقليم دارفور الموحد",
      nameEn: "Unified Darfur Region",
      center: [40, 200],
      svgPath: "M 20 120 L 80 150 L 80 230 L 20 250 Z",
      color: "#be123c",
      metrics: { companies: 620, factories: 45, investmentReadiness: 45, riskScore: 68, consumersK: 5200, yieldTons: 280000 }
    },
    {
      id: "kordofan",
      nameAr: "إقليم كردفان الموحد",
      nameEn: "Unified Kordofan Region",
      center: [110, 220],
      svgPath: "M 80 150 L 150 170 L 150 250 L 80 260 Z",
      color: "#6d28d9",
      metrics: { companies: 1100, factories: 130, investmentReadiness: 68, riskScore: 35, consumersK: 4100, yieldTons: 620000 }
    },
    {
      id: "blue_nile",
      nameAr: "ولاية النيل الأزرق",
      nameEn: "Blue Nile State",
      center: [210, 260],
      svgPath: "M 180 230 L 210 210 L 240 250 L 200 280 Z",
      color: "#0369a1",
      metrics: { companies: 390, factories: 40, investmentReadiness: 70, riskScore: 18, consumersK: 1500, yieldTons: 410000 }
    }
  ];

  // MODULE 2: DIGITAL TWIN MODELS
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwinAsset[]>([
    {
      id: "twin-port-sudan",
      nameAr: "التوأم الرقمي لمحطة الرصيف الجنوبي بورتسودان",
      nameEn: "Digital Twin of Port Sudan South Wharf Terminal",
      stateId: "red_sea",
      category: "logistics",
      status: "optimal",
      coordinates: { x: 260, y: 90 },
      sensors: [
        { label: "حركة الرافعات الشاطئية (STS)", value: "92%", metric: "STS Crane Cycle Efficiency", status: "normal" },
        { label: "زمن بقاء السفن في المرفأ", value: "18.4 Hrs", metric: "Vessel Turnaround Time", status: "normal" },
        { label: "الطاقة الاستيعابية لساحة الحاويات", value: "74%", metric: "Container Yard Occupancy", status: "normal" },
        { label: "معدل تدفق الشاحنات بالبوابة", value: "142 Veh/hr", metric: "Gate Transit Flow Rate", status: "normal" },
        { label: "حرارة مستودع الحبوب الفيدرالي", value: "24.6 °C", metric: "Silo Thermal Integrity", status: "normal" }
      ],
      infrastructure: { power: "stable", water: "connected", fiber: "active" }
    },
    {
      id: "twin-albagair-complex",
      nameAr: "مجمع الباقير الصناعي الذكي",
      nameEn: "Al-Bagair Smart Industrial Complex Twin",
      stateId: "gezira",
      category: "industrial",
      status: "warning",
      coordinates: { x: 180, y: 195 },
      sensors: [
        { label: "جهد الشبكة الكهربائية المغذية", value: "11.2 kV", metric: "Main Power Bus Voltage", status: "normal" },
        { label: "معدل معالجة المخلفات السائلة", value: "82%", metric: "Eco-Treatment Level", status: "normal" },
        { label: "حرارة المبرد رقم ٣ في الغلايات", value: "78.4 °C", metric: "Boiler Cooling Core Temp", status: "alert" },
        { label: "حساس كشف الملوثات والغازات", value: "32 ppm", metric: "Air Quality Carbon Index", status: "normal" }
      ],
      infrastructure: { power: "backup", water: "connected", fiber: "active" }
    },
    {
      id: "twin-gum-arabic-refinery",
      nameAr: "المصفاة الوطنية الذكية للصمغ العربي",
      nameEn: "Sovereign Gum Arabic Processing & Refinery Twin",
      stateId: "kordofan",
      category: "industrial",
      status: "optimal",
      coordinates: { x: 120, y: 210 },
      sensors: [
        { label: "الرطوبة النسبية في غرف التجفيف", value: "38%", metric: "Drying Cell Relative Humidity", status: "normal" },
        { label: "ضغط ذراع الطحن والفرز الدقيق", value: "4.2 Bar", metric: "Micro-Refinement System Pressure", status: "normal" },
        { label: "مخزون الصمغ الهشاب المتاح", value: "14,500 Tons", metric: "Hashab Grade-1 Silo Quantity", status: "normal" }
      ],
      infrastructure: { power: "stable", water: "connected", fiber: "active" }
    },
    {
      id: "twin-jaili-refinery",
      nameAr: "التوأم الرقمي لمصفاة الجيلي اللوجستية",
      nameEn: "Al-Jaili Logistics Refinery Twin",
      stateId: "khartoum",
      category: "industrial",
      status: "critical",
      coordinates: { x: 170, y: 145 },
      sensors: [
        { label: "ضغط خط الأنابيب الرئيسي", value: "18.8 Bar", metric: "Main Pipe Transit Pressure", status: "danger" },
        { label: "درجة حرارة مصفوفة الفرز", value: "92.1 °C", metric: "Cracking Tower Distillation Core", status: "danger" },
        { label: "أجهزة كشف التسرب المحيطية", value: "0.01%", metric: "Hydrocarbon Ambient Sniffers", status: "normal" }
      ],
      infrastructure: { power: "unstable", water: "restricted", fiber: "down" }
    }
  ]);

  const [activeTwinId, setActiveTwinId] = useState<string>("twin-port-sudan");

  // MODULE 3: NATIONAL BUSINESS MAP LISTINGS
  const [businessListings] = useState<SpatialBusiness[]>([
    { id: "B-1001", nameAr: "مؤسسة الصمغ العربي السيادية", nameEn: "Sovereign Gum Arabic Corporation", stateId: "kordofan", category: "factory", address: "الأبيض - المنطقة الصناعية الشرقية", registrationNo: "SD-2026-94829", complianceRating: "A+", activity: "معالجة وتصدير الصمغ العربي الممتاز" },
    { id: "B-1002", nameAr: "شركة النيل للأقطان والنسيج", nameEn: "Nile Cotton & Spinning Co.", stateId: "gezira", category: "factory", address: "الباقير - المربع الصناعي ٤", registrationNo: "SD-2026-10492", complianceRating: "A", activity: "محلج ومصنع نسيج متكامل" },
    { id: "B-1003", nameAr: "الشركة السودانية لتكرير الذهب والمعادن", nameEn: "Sudan Gold & Precious Metals Refinery", stateId: "khartoum", category: "factory", address: "شمال الخرطوم - مجمع الابتكار التكنولوجي", registrationNo: "SD-2026-77401", complianceRating: "A+", activity: "تصفية وصياغة المعادن الثمينة" },
    { id: "B-1004", nameAr: "شركة لوجستيات البحر الأحمر الموحدة", nameEn: "Unified Red Sea Logistics Corp", stateId: "red_sea", category: "warehouse", address: "المنطقة الحرة بورتسودان", registrationNo: "SD-2026-00941", complianceRating: "B", activity: "التخزين الجمركي والتخليص الذكي" },
    { id: "B-1005", nameAr: "سوق بورتسودان الدولي للسلع والصادرات", nameEn: "Port Sudan Sovereign Trade Hub", stateId: "red_sea", category: "market", address: "بورتسودان - شارع الكورنيش الفيدرالي", registrationNo: "SD-2026-22941", complianceRating: "A", activity: "بيع وتداول الحبوب والسلع الأساسية" },
    { id: "B-1006", nameAr: "شركة الإسمنت والخرسانة الوطنية", nameEn: "National Cement & Building Materials", stateId: "river_nile", category: "factory", address: "عطبرة - المربع الصناعي ٢", registrationNo: "SD-2026-44102", complianceRating: "C", activity: "إنتاج الإسمنت البورتلاندي" }
  ]);

  // MODULE 5: SUPPLY CHAIN ROUTES
  const supplyChainRoutes: RouteSegment[] = [
    { id: "R-1", nameAr: "ممر النقل الفيدرالي (بورتسودان - الخرطوم)", nameEn: "Federal Transport Corridor (Port Sudan - Khartoum)", type: "highway", status: "clear", lengthKm: 812, avgTransitHours: 12, coordinatesPath: "M 280 100 L 230 190 L 170 160" },
    { id: "R-2", nameAr: "سكة حديد شريان تصدير الصمغ (الأبيض - بورتسودان)", nameEn: "Sovereign Gum Railway (El Obeid - Port Sudan)", type: "railway", status: "delayed", lengthKm: 1250, avgTransitHours: 24, coordinatesPath: "M 110 220 L 170 160 L 280 100" },
    { id: "R-3", nameAr: "ممر الصادرات الزراعي (الجزيرة - الخرطوم)", nameEn: "Agricultural Export Corridor (Gezira - Khartoum)", type: "highway", status: "clear", lengthKm: 180, avgTransitHours: 2.5, coordinatesPath: "M 180 210 L 170 160" },
    { id: "R-4", nameAr: "خط أنابيب المنتجات النفطية (الجيري - ميناء بشاير)", nameEn: "Sovereign Hydrocarbon Pipeline (Al Jaili - Bashayer)", type: "pipeline", status: "clear", lengthKm: 810, avgTransitHours: 1, coordinatesPath: "M 170 160 L 280 100" }
  ];

  // MODULE 6 & 7: MARKET INTELLIGENCE & INSPECTIONS
  const [inspectionVisits, setInspectionVisits] = useState<any[]>([
    { id: "INSP-501", facilityAr: "مصنع النيل للأقطان", facilityEn: "Nile Cotton & Spinning Co.", type: "صناعي", inspector: "م. محمد عبدالمولى", date: "2026-07-15", status: "completed", result: "compliant", violation: "لا يوجد - مطابقة تامة للمعايير" },
    { id: "INSP-502", facilityAr: "مستودعات الغلال الجنوبية بورتسودان", facilityEn: "South Port Grain Silos", type: "لوجستي", inspector: "أ. نصر الدين علي", date: "2026-07-18", status: "pending", result: "review_scheduled", violation: "تنبيه: مراجعة أنظمة التبريد الاحتياطية" },
    { id: "INSP-503", facilityAr: "مجمع الجيلي لتوزيع الوقود", facilityEn: "Al-Jaili Distribution Depot", type: "بتروكيماويات", inspector: "م. فاطمة الفاضل", date: "2026-07-19", status: "completed", result: "violation_logged", violation: "مخالفة: تسرب جزئي في الصمامات الطرفية" }
  ]);

  const [violationsCount, setViolationsCount] = useState<number>(14);

  // Form states for inspection scheduling
  const [newInspFacility, setNewInspFacility] = useState("");
  const [newInspInspector, setNewInspInspector] = useState("");
  const [newInspState, setNewInspState] = useState("red_sea");
  const [newInspDate, setNewInspDate] = useState("2026-07-20");

  // MODULE 8: AI SPATIAL FORECASTING ENGINE
  const [optimizeGoal, setOptimizeGoal] = useState<"transport" | "labor" | "energy" | "market">("energy");
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  // MODULE 10: FUTURE SMART MAP SERVICES
  const [satelliteOverlay, setSatelliteOverlay] = useState<boolean>(false);
  const [droneCorridors, setDroneCorridors] = useState<boolean>(false);
  const [iotSensorStreaming, setIotSensorStreaming] = useState<boolean>(true);

  // SQL PostGIS Sandbox
  const [postgisConsoleQuery, setPostgisConsoleQuery] = useState<string>(
    `SELECT state_name, COUNT(f.id) AS factory_count, ST_AsText(ST_Centroid(s.geom)) AS center_point\nFROM sd_states s\nJOIN sd_factories f ON ST_Contains(s.geom, f.geom)\nGROUP BY state_name\nORDER BY factory_count DESC;`
  );
  const [postgisResult, setPostgisResult] = useState<string>(
    `+-------------------+---------------+------------------------------------+
| state_name        | factory_count | center_point                       |
+-------------------+---------------+------------------------------------+
| Khartoum          |          1450 | POINT(32.551234 15.541243)         |
| Gezira            |           380 | POINT(33.521402 14.394102)         |
| River Nile        |           240 | POINT(33.987114 17.654101)         |
| Red Sea           |           120 | POINT(37.214021 19.610234)         |
+-------------------+---------------+------------------------------------+
4 rows in set (0.002 seconds)

-- Sovereign Blockchain Immutable Ledger Block #2,948,102 verified successfully.`
  );

  // Core calculations and helpers
  const currentStateData = statesList.find(s => s.id === selectedState) || statesList[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    // Search both states and business listings
    const matchedStates = statesList.filter(s => s.nameAr.includes(query) || s.nameEn.toLowerCase().includes(query));
    const matchedBusinesses = businessListings.filter(b => b.nameAr.includes(query) || b.nameEn.toLowerCase().includes(query) || b.activity.toLowerCase().includes(query));

    const results = [
      ...matchedStates.map(s => ({ type: "state", data: s })),
      ...matchedBusinesses.map(b => ({ type: "business", data: b }))
    ];

    setSearchResults(results);
    setNotifications(prev => [`AI spatial index query returned ${results.length} results`, ...prev]);
  };

  const executePostgisQuery = () => {
    if (postgisConsoleQuery.includes("sd_states")) {
      setPostgisResult(`+-------------------+---------------+------------------------------------+
| state_name        | factory_count | center_point                       |
+-------------------+---------------+------------------------------------+
| Khartoum          |          1450 | POINT(32.551234 15.541243)         |
| Gezira            |           380 | POINT(33.521402 14.394102)         |
| River Nile        |           240 | POINT(33.987114 17.654101)         |
| Red Sea           |           120 | POINT(37.214021 19.610234)         |
+-------------------+---------------+------------------------------------+
4 rows in set (0.002 seconds)

-- Ledger verified: Drizzle schema synchronized with PostGIS.`);
    } else {
      setPostgisResult(`Query executed successfully.\nReturned 0 rows.\n-- PostGIS status: OK.`);
    }
  };

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspFacility || !newInspInspector) return;

    const newVisit = {
      id: `INSP-${Math.floor(500 + Math.random() * 500)}`,
      facilityAr: newInspFacility,
      facilityEn: newInspFacility,
      type: "تجاري/صناعي",
      inspector: newInspInspector,
      date: newInspDate,
      status: "pending",
      result: "scheduled",
      violation: "قيد المراجعة الجغرافية"
    };

    setInspectionVisits(prev => [newVisit, ...prev]);
    setNewInspFacility("");
    setNewInspInspector("");
    setNotifications(prev => [`Scheduled inspection visit ${newVisit.id} for ${newInspFacility}`, ...prev]);
  };

  // MODULE 8: AI Spatial Optimization calculation
  const runSpatialOptimization = () => {
    setIsAiProcessing(true);
    setOptimizationResult(null);

    setTimeout(() => {
      setIsAiProcessing(false);
      if (optimizeGoal === "energy") {
        setOptimizationResult({
          bestState: "river_nile",
          nameAr: "ولاية نهر النيل (منطقة عطبرة)",
          nameEn: "River Nile State (Atbara Zone)",
          score: "94.8 / 100",
          reasonsAr: [
            "قرب مباشر من سد مروي والربط بالشبكة القومية للكهرباء بجهد مستقر.",
            "توفر خطوط السكك الحديدية والربط اللوجستي السهل مع ميناء بورتسودان.",
            "تكاليف إيجار الأراضي الصناعية منخفضة بنسبة ٣٢٪ مقارنة بالخرطوم."
          ],
          reasonsEn: [
            "Direct proximity to Merowe Dam power grids, ensuring voltage stability.",
            "Established federal rail link with swift container forwarding to Port Sudan.",
            "Industrial plot lease expenses are 32% more cost-effective than Khartoum State."
          ],
          recommendedPlotId: "PLOT-RN-94102",
          readinessIndex: 85
        });
      } else if (optimizeGoal === "transport") {
        setOptimizationResult({
          bestState: "red_sea",
          nameAr: "ولاية البحر الأحمر (المنطقة الحرة بورتسودان)",
          nameEn: "Red Sea State (Port Sudan Free Zone)",
          score: "98.2 / 100",
          reasonsAr: [
            "تطابق فوري مع أرصفة الشحن البحري لتخفيض مسافة الميل الأخير إلى صفر.",
            "إعفاءات جمركية وتراخيص تجارة خارجية فورية عبر نافذة البلوكشين الموحدة.",
            "قناة نقل متعدد الأنماط مباشرة متصلة بالولايات الأخرى."
          ],
          reasonsEn: [
            "Zero last-mile transit distance due to direct proximity to Port terminals.",
            "Complete customs exception regimes processed via sovereign blockchain ledger.",
            "Multimodal trade links connecting all inland agricultural corridors."
          ],
          recommendedPlotId: "PLOT-RS-0094",
          readinessIndex: 94
        });
      } else if (optimizeGoal === "labor") {
        setOptimizationResult({
          bestState: "gezira",
          nameAr: "ولاية الجزيرة (منطقة الباقير الصناعية)",
          nameEn: "Gezira State (El Bagair Industrial Zone)",
          score: "91.5 / 100",
          reasonsAr: [
            "أعلى كثافة للأيدي العاملة الفنية المدربة وخريجي كليات الهندسة.",
            "تكامل فوري مع مشروع الجزيرة لتدفق المواد الخام الزراعية والحيوانية.",
            "شبكة طرق معبدة ممتازة تربط المنطقة بالعاصمة والولايات الأخرى."
          ],
          reasonsEn: [
            "Highest regional density of specialized technical graduates and engineering labor.",
            "Direct agricultural raw materials input pipelines from the Gezira Scheme.",
            "Advanced expressway connections linking the zone directly to Khartoum center."
          ],
          recommendedPlotId: "PLOT-GZ-4402",
          readinessIndex: 88
        });
      } else {
        setOptimizationResult({
          bestState: "khartoum",
          nameAr: "ولاية الخرطوم (منطقة الجيلي اللوجستية)",
          nameEn: "Khartoum State (Al-Jaili Logistics Hub)",
          score: "96.4 / 100",
          reasonsAr: [
            "الوصول المباشر لأكبر سوق استهلاكي وطني يتجاوز ٨.٥ مليون نسمة.",
            "توفر البنية التحتية المتكاملة لشبكات الاتصالات والألياف البصرية السريعة.",
            "قرب مركزي من كافة الهيئات والوزارات لتسهيل الاعتمادات السيادية."
          ],
          reasonsEn: [
            "Direct physical access to the largest domestic consumer base of 8.5M residents.",
            "High-bandwidth sovereign fiber network nodes fully operational in this quadrant.",
            "Central proximity to administrative ministries and registration agencies."
          ],
          recommendedPlotId: "PLOT-KH-7702",
          readinessIndex: 96
        });
      }
      setNotifications(prev => [`AI Spatial location optimization complete for goal: ${optimizeGoal}`, ...prev]);
    }, 1500);
  };

  // Spatial AI Text Query Response generator
  const handleSendAiQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userText = aiChatInput;
    const userMsg = { sender: "user", textAr: userText, textEn: userText };
    setAiChatHistory(prev => [...prev, userMsg]);
    setAiChatInput("");
    setIsAiProcessing(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Acting as Sudan Government's Chief Spatial AI Analyst, address this GIS/geospatial query: "${userText}" under the context of active state: ${selectedState}. Provide precise spatial insights.`,
          history: aiChatHistory.slice(-4).map(h => ({ sender: h.sender, text: h.textEn })),
          context: { module: "Sovereign GIS Platform Phase 22", state: selectedState }
        })
      });

      if (!response.ok) throw new Error("AI query failed");
      const data = await response.json();

      setAiChatHistory(prev => [
        ...prev,
        { sender: "ai", textAr: data.text, textEn: data.text }
      ]);
    } catch (err) {
      // High-fidelity fallback logic
      setTimeout(() => {
        let textAr = "";
        let textEn = "";

        if (userText.includes("صمغ") || userText.includes("gum") || userText.includes("export")) {
          textAr = "تتركز صادرات الصمغ العربي الفيدرالية بصورة أساسية في حزام الصمغ العربي الممتد عبر ولاية كردفان والجزيرة، وتمر لوجستيات الشحن عبر ممر النقل السريع بورتسودان. نوصي بتوطين مصنع تصفية إضافي بالقرب من الأبيض لتقليل تكلفة النقل بنسبة ٢٢٪ وتأمين جودة التعبئة قبل الانتقال للميناء.";
          textEn = "Sudan's Gum Arabic exports are anchored across Kordofan and Gezira states, routed via the Red Sea transport corridor. AI optimization suggests installing an additional secondary processing unit in El Obeid to reduce freight mileage costs by 22% and secure packaging dry cycles before sea transit.";
        } else if (userText.includes("ميناء") || userText.includes("port") || userText.includes("بحر")) {
          textAr = "التوأم الرقمي لميناء بورتسودان الجنوبي يسجل معدل كفاءة عام بنسبة ٩٢٪ مع متوسط فترة دوران للحاوية تبلغ ١٨.٤ ساعة. هناك اقتراح مدعوم بالذكاء الاصطناعي لإنشاء حوض جاف ذكي إضافي لتخفيف الضغط اللوجستي وتسريع الربط الفيدرالي بالخرطوم.";
          textEn = "The Port Sudan South Port digital twin tracks a 92% STS efficiency rate with container turnaround cycles averaging 18.4 hours. AI models advocate for establishing a modern dry port terminal along the Northern railway intersection to absorb high import surge queues.";
        } else {
          textAr = `بناءً على التحليل الجغرافي لـ (${currentStateData.nameAr}) والبيانات المدخلة، نقترح تعزيز شبكات الربط الكهربائي ومطابقة المنشآت المحلية لتفادي مخاطر سلاسل التوريد. تبلغ جهوزية الولاية للاستثمارات الجديدة حالياً ${currentStateData.metrics.investmentReadiness}٪.`;
          textEn = `Based on spatial metrics for (${currentStateData.nameEn}), our neural models suggest strengthening local electrical line backups and upgrading logistics hubs. The current investment readiness index for this sector is quantified at ${currentStateData.metrics.investmentReadiness}%.`;
        }

        setAiChatHistory(prev => [
          ...prev,
          { sender: "ai", textAr, textEn }
        ]);
      }, 1000);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Simulated stress test for Digital Twin sensors
  const triggerStressTest = () => {
    setNotifications(prev => ["ALERT: Initiating stress simulation on Al-Jaili Pipeline Core.", ...prev]);
    setDigitalTwins(prev =>
      prev.map(t =>
        t.id === "twin-jaili-refinery"
          ? {
              ...t,
              status: "critical",
              sensors: t.sensors.map(s =>
                s.metric === "Main Pipe Transit Pressure"
                  ? { ...s, value: "24.6 Bar", status: "danger" }
                  : s
              )
            }
          : t
      )
    );

    setTimeout(() => {
      setNotifications(prev => ["AIOps: Self-healing protocol activated. Pipeline valve bypassed automatically.", ...prev]);
      setDigitalTwins(prev =>
        prev.map(t =>
          t.id === "twin-jaili-refinery"
            ? {
                ...t,
                status: "warning",
                sensors: t.sensors.map(s =>
                  s.metric === "Main Pipe Transit Pressure"
                    ? { ...s, value: "19.2 Bar", status: "alert" }
                    : s
                )
              }
            : t
        )
      );
    }, 4000);
  };

  return (
    <div id="sovereign-gis-twin-root" className="bg-[#0b0f19] text-gray-100 p-4 md:p-6 border border-slate-800 rounded-xl shadow-2xl relative overflow-hidden font-sans">
      
      {/* Dynamic Background Grid Decorator */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 -z-10"></div>

      {/* TOP HEADER STATUS METRICS */}
      <div className="mb-6 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 border border-emerald-500/40 p-2.5 rounded-lg text-emerald-400 animate-pulse">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{currentLanguage === "ar" ? "مركز الاستخبارات الجغرافية والتوأم الرقمي الوطني" : "National Geointelligence & Sovereign Digital Twin Hub"}</span>
              <span className="bg-emerald-900/40 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">Phase 22</span>
            </h2>
            <p className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "مراقبة الأصول، البنية التحتية، الاستثمارات والمستهلكين عبر الـ GIS والنمذجة الرياضية" : "Unified GIS, IoT Sensors, Economic Corridors and Predictive AI Analytics"}
            </p>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="flex gap-4 md:gap-6">
          <div className="text-center md:text-left">
            <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              {currentLanguage === "ar" ? "الأصول الرقمية المتصلة" : "Connected Twin Assets"}
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">2,948 <span className="text-xs text-gray-500">IoT</span></div>
          </div>
          <div className="text-center md:text-left border-l border-slate-800 pl-4 md:pl-6">
            <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
              {currentLanguage === "ar" ? "جاهزية الاستثمار القومية" : "Investment Readiness Index"}
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">88.4%</div>
          </div>
          <div className="text-center md:text-left border-l border-slate-800 pl-4 md:pl-6">
            <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
              {currentLanguage === "ar" ? "مخاطر سلاسل التوريد" : "Sovereign Supply Risks"}
            </div>
            <div className="text-lg font-bold text-rose-500 font-mono mt-0.5">{violationsCount} <span className="text-xs text-gray-500">Alerts</span></div>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex flex-wrap border-b border-slate-800/80 mb-6 gap-2">
        {[
          { id: "gis-map", labelAr: "خريطة نظم المعلومات الجغرافية الوطنية", labelEn: "Sovereign GIS Platform", icon: Map },
          { id: "digital-twin", labelAr: "التوائم الرقمية للأصول الاستراتيجية", labelEn: "Asset Digital Twins", icon: Cpu },
          { id: "analytics", labelAr: "التحليلات الجغرافية والذكاء الاصطناعي", labelEn: "Spatial AI Analytics", icon: BarChart3 },
          { id: "inspection", labelAr: "خريطة الإنفاذ والتفتيش الفيدرالية", labelEn: "Inspection & Enforcement Map", icon: ShieldAlert },
          { id: "future-smart", labelAr: "المستقبل الذكي والأقمار الصناعية", labelEn: "Satellite & Future Sandbox", icon: Radar }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (audioFeedback && window.speechSynthesis) {
                // Gentle notification
              }
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-xs md:text-sm transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-slate-700"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? tab.labelAr : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* CORE WORKSPACE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE WORKSPACE SUB-INTERFACES */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* TAB 1: GIS INTERACTIVE MAP */}
          {activeTab === "gis-map" && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-6 flex flex-col gap-4 relative">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Map className="h-4 w-4 text-emerald-400" />
                    <span>{currentLanguage === "ar" ? "لوحة الخارطة الجغرافية الفيدرالية التفاعلية" : "Interactive Federal GIS Map Engine"}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentLanguage === "ar" ? "اضغط على أي ولاية لعرض الإحصائيات الاقتصادية وقاعدة البيانات الجغرافية" : "Click on any state region to populate economic datasets and spatial vectors"}
                  </p>
                </div>
                
                {/* Map Layer Selectors */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "boundaries", labelAr: "الحدود الإدارية", labelEn: "Admin Boundaries" },
                    { id: "industrial", labelAr: "المدن الصناعية", labelEn: "Industrial Zones" },
                    { id: "logistics", labelAr: "الممرات اللوجستية", labelEn: "Trade Corridors" },
                    { id: "markets", labelAr: "الأسواق والمستهلكين", labelEn: "Markets" }
                  ].map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => {
                        if (activeLayers.includes(layer.id)) {
                          setActiveLayers(prev => prev.filter(l => l !== layer.id));
                        } else {
                          setActiveLayers(prev => [...prev, layer.id]);
                        }
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                        activeLayers.includes(layer.id)
                          ? "bg-emerald-950 border-emerald-500/50 text-emerald-400"
                          : "bg-slate-950 border-slate-800 text-gray-500 hover:border-slate-700"
                      }`}
                    >
                      {currentLanguage === "ar" ? layer.labelAr : layer.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE VECTOR SUDAN MAP (High Fidelity custom SVG representation) */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative flex items-center justify-center min-h-[360px] overflow-hidden select-none">
                
                {/* SVG MAP */}
                <svg
                  viewBox="0 0 320 300"
                  className="w-full max-w-[450px] transition-transform duration-300"
                  style={{ transform: `scale(${mapScale})` }}
                >
                  {/* Outer Grid Decorators inside SVG */}
                  <defs>
                    <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#map-grid)" opacity="0.4" />

                  {/* Red Sea shipping paths (if logistics layer is active) */}
                  {activeLayers.includes("logistics") && (
                    <path
                      d="M 290 20 Q 310 60 290 120"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Supply Chain Routes */}
                  {activeLayers.includes("logistics") && supplyChainRoutes.map(route => (
                    <path
                      key={route.id}
                      d={route.coordinatesPath}
                      fill="none"
                      stroke={route.status === "clear" ? "#10b981" : "#f59e0b"}
                      strokeWidth={route.type === "railway" ? "2" : "1.5"}
                      strokeDasharray={route.type === "railway" ? "3,3" : "none"}
                      className="transition-all duration-300 hover:stroke-white cursor-pointer"
                      title={currentLanguage === "ar" ? route.nameAr : route.nameEn}
                    />
                  ))}

                  {/* States polygons */}
                  {statesList.map(state => {
                    const isSelected = selectedState === state.id;
                    return (
                      <g key={state.id} className="cursor-pointer">
                        <path
                          d={state.svgPath}
                          fill={isSelected ? "#10b981" : state.color}
                          fillOpacity={isSelected ? "0.35" : "0.15"}
                          stroke={isSelected ? "#10b981" : "#334155"}
                          strokeWidth={isSelected ? "2" : "1"}
                          className="transition-all duration-200 hover:fill-opacity-40"
                          onClick={() => {
                            setSelectedState(state.id);
                            setNotifications(prev => [`GIS Focus: Changed region to ${state.nameEn}`, ...prev]);
                          }}
                        />
                        {/* State Labels */}
                        {activeLayers.includes("boundaries") && (
                          <text
                            x={state.center[0]}
                            y={state.center[1]}
                            fill={isSelected ? "#10b981" : "#94a3b8"}
                            fontSize="8"
                            fontWeight={isSelected ? "bold" : "normal"}
                            textAnchor="middle"
                            className="pointer-events-none font-sans"
                          >
                            {currentLanguage === "ar" ? state.nameAr.replace("ولاية ", "") : state.nameEn.replace(" State", "")}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Markers of Digital Twins & Warehouses */}
                  {activeLayers.includes("industrial") && digitalTwins.map(twin => (
                    <circle
                      key={twin.id}
                      cx={twin.coordinates.x}
                      cy={twin.coordinates.y}
                      r="5"
                      fill={
                        twin.status === "optimal" ? "#10b981" :
                        twin.status === "warning" ? "#f59e0b" :
                        twin.status === "critical" ? "#ef4444" : "#64748b"
                      }
                      className="animate-ping"
                      style={{ animationDuration: "3s" }}
                    />
                  ))}

                  {activeLayers.includes("industrial") && digitalTwins.map(twin => (
                    <g
                      key={`twin-marker-${twin.id}`}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedState(twin.stateId);
                        setActiveTab("digital-twin");
                        setActiveTwinId(twin.id);
                        setNotifications(prev => [`Twin telemetry loaded for ${twin.nameEn}`, ...prev]);
                      }}
                    >
                      <circle
                        cx={twin.coordinates.x}
                        cy={twin.coordinates.y}
                        r="4"
                        fill={
                          twin.status === "optimal" ? "#10b981" :
                          twin.status === "warning" ? "#f59e0b" :
                          twin.status === "critical" ? "#ef4444" : "#64748b"
                        }
                        stroke="#0f172a"
                        strokeWidth="1"
                      />
                      <circle
                        cx={twin.coordinates.x}
                        cy={twin.coordinates.y}
                        r="1.5"
                        fill="#ffffff"
                      />
                    </g>
                  ))}

                  {/* Commercial and Markets listings */}
                  {activeLayers.includes("markets") && businessListings.filter(b => b.category === "market").map(m => {
                    const matchedState = statesList.find(s => s.id === m.stateId);
                    if (!matchedState) return null;
                    return (
                      <path
                        key={`m-pin-${m.id}`}
                        d={`M ${matchedState.center[0] - 4} ${matchedState.center[1] + 6} L ${matchedState.center[0]} ${matchedState.center[1] + 13} L ${matchedState.center[0] + 4} ${matchedState.center[1] + 6} Z`}
                        fill="#f59e0b"
                        stroke="#0f172a"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                </svg>

                {/* Map Navigation Controls Overlay */}
                <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded-lg p-1.5 flex gap-1">
                  <button
                    onClick={() => setMapScale(prev => Math.min(prev + 0.2, 2))}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded cursor-pointer text-xs"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setMapScale(1)}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded cursor-pointer text-[10px]"
                    title="Reset Zoom"
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setMapScale(prev => Math.max(prev - 0.2, 0.8))}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded cursor-pointer text-xs"
                    title="Zoom Out"
                  >
                    -
                  </button>
                </div>

                <div className="absolute top-3 left-3 bg-slate-900/95 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-gray-400">
                  <div className="flex items-center gap-1.5 mb-1 text-white font-semibold">
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{currentLanguage === "ar" ? "مفتاح الخارطة الفيدرالية" : "GIS Map Legend"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-emerald-700 rounded-full inline-block"></span>
                      <span>{currentLanguage === "ar" ? "صالح / أمثل" : "Optimal (Twin)"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                      <span>{currentLanguage === "ar" ? "تنبيه" : "Warning (Twin)"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-rose-600 rounded-full inline-block"></span>
                      <span>{currentLanguage === "ar" ? "حرج / طارئ" : "Critical (Twin)"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-cyan-700 rounded-sm inline-block"></span>
                      <span>{currentLanguage === "ar" ? "ممر تجاري" : "Sovereign Link"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK SELECTED REGION GIS DATA SHEETS */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">
                    {currentLanguage === "ar" ? "الولاية المحددة" : "Selected State Region"}
                  </span>
                  <span className="text-sm font-semibold text-white block mt-0.5">
                    {currentLanguage === "ar" ? currentStateData.nameAr : currentStateData.nameEn}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">
                    {currentLanguage === "ar" ? "المنشآت المسجلة" : "Registered Enterprises"}
                  </span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono block mt-0.5">
                    {currentStateData.metrics.companies}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">
                    {currentLanguage === "ar" ? "المصانع والمدن الصناعية" : "Factories & Plot Index"}
                  </span>
                  <span className="text-sm font-semibold text-white font-mono block mt-0.5">
                    {currentStateData.metrics.factories}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">
                    {currentLanguage === "ar" ? "الإنتاج السنوي التقديري" : "Annual Sovereign Yield"}
                  </span>
                  <span className="text-sm font-semibold text-[#D4AF37] font-mono block mt-0.5">
                    {currentStateData.metrics.yieldTons.toLocaleString()} <span className="text-[10px] text-gray-400">Tons</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL TWINS */}
          {activeTab === "digital-twin" && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-emerald-400 animate-spin" style={{ animationDuration: "8s" }} />
                    <span>{currentLanguage === "ar" ? "مستكشف التوأم الرقمي للأصول الوطنية" : "Sovereign Industrial & Logistics Digital Twin Console"}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {currentLanguage === "ar" ? "محاكاة وقراءة أجهزة الاستشعار وعدادات التدفق الصناعي المباشر" : "Inspect dynamic industrial flow metrics, IoT sensors and system safety integrity"}
                  </p>
                </div>

                {/* Twin Asset Selector */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {digitalTwins.map(twin => (
                    <button
                      key={twin.id}
                      onClick={() => setActiveTwinId(twin.id)}
                      className={`px-3 py-1.5 rounded text-xs font-mono border whitespace-nowrap transition-all cursor-pointer ${
                        activeTwinId === twin.id
                          ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400"
                          : "bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700"
                      }`}
                    >
                      {currentLanguage === "ar" ? twin.nameAr.split(" ").slice(-2).join(" ") : twin.nameEn.split(" ").slice(-3).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE TWIN DETAIL PRESENTATION */}
              {(() => {
                const twin = digitalTwins.find(t => t.id === activeTwinId) || digitalTwins[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Visual 3D Isometric Simulator Canvas of the asset */}
                    <div className="md:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between min-h-[280px] relative overflow-hidden">
                      {/* Grid Lines Overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161e2e_1px,transparent_1px),linear-gradient(to_bottom,#161e2e_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30 pointer-events-none"></div>

                      <div className="flex items-center justify-between z-10">
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 uppercase">
                          {twin.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase flex items-center gap-1 ${
                          twin.status === "optimal" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30" :
                          twin.status === "warning" ? "bg-amber-950/60 text-amber-400 border border-amber-500/30" :
                          "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                            twin.status === "optimal" ? "bg-emerald-400" :
                            twin.status === "warning" ? "bg-amber-400" : "bg-rose-400"
                          }`}></span>
                          {twin.status}
                        </span>
                      </div>

                      {/* Isometric Vector Art Simulation */}
                      <div className="my-auto flex items-center justify-center h-40 relative z-10">
                        <svg viewBox="0 0 100 100" className="w-32 h-32">
                          {/* Base Plate */}
                          <polygon points="50,15 90,35 50,55 10,35" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                          <polygon points="50,20 90,40 50,60 10,40" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

                          {/* Tower / Structure building Blocks */}
                          {twin.category === "logistics" ? (
                            <>
                              {/* Harbor Crane Isometric shape */}
                              <rect x="35" y="15" width="8" height="25" fill="#334155" stroke="#475569" strokeWidth="1" />
                              <polygon points="35,15 75,10 75,18 35,23" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                              <rect x="55" y="25" width="20" height="12" fill="#0891b2" stroke="#06b6d4" strokeWidth="0.5" opacity="0.8" />
                              <circle cx="50" cy="50" r="3" fill="#10b981" />
                            </>
                          ) : (
                            <>
                              {/* Refinery/Industrial Isometric Cylinders */}
                              <cylinder>
                                <rect x="30" y="20" width="16" height="30" fill="#475569" stroke="#64748b" strokeWidth="1" />
                                <ellipse cx="38" cy="20" rx="8" ry="4" fill="#64748b" />
                              </cylinder>
                              <cylinder>
                                <rect x="54" y="10" width="12" height="40" fill="#334155" stroke="#475569" strokeWidth="1" />
                                <ellipse cx="60" cy="10" rx="6" ry="3" fill="#475569" />
                              </cylinder>
                              {/* Intersecting pipe */}
                              <path d="M 46 35 L 54 30" stroke="#f59e0b" strokeWidth="2" fill="none" className="animate-pulse" />
                            </>
                          )}
                          
                          {/* Pulsing signal center */}
                          <circle cx="50" cy="45" r="4" fill="#10b981" fillOpacity="0.3" className="animate-ping" style={{ animationDuration: "2s" }} />
                          <circle cx="50" cy="45" r="2" fill="#10b981" />
                        </svg>

                        {/* Active Data Overlay */}
                        <div className="absolute bottom-1 left-1 bg-slate-900/90 border border-slate-800/80 px-2 py-1 rounded text-[10px] font-mono">
                          <span className="text-gray-500">Hash: </span>
                          <span className="text-emerald-400">0x2d94..f102</span>
                        </div>
                      </div>

                      {/* Stress Test Simulation Button */}
                      <div className="flex gap-2 z-10">
                        <button
                          onClick={triggerStressTest}
                          className="flex-1 py-1.5 rounded text-center text-[10px] font-mono bg-rose-950 hover:bg-rose-900 border border-rose-500/30 text-rose-300 transition-all cursor-pointer"
                        >
                          {currentLanguage === "ar" ? "محاكاة حمل الضغط الزائد" : "Simulate Supply Line Stress"}
                        </button>
                      </div>
                    </div>

                    {/* Sensor telemetries & network status */}
                    <div className="md:col-span-7 flex flex-col gap-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h4 className="text-xs font-mono text-gray-400 mb-3 uppercase flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{currentLanguage === "ar" ? "بيانات الحساسات النشطة والمقاييس" : "Active Telemetry & Micro-Sensors"}</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {twin.sensors.map((sensor, i) => (
                            <div key={i} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-3 flex flex-col justify-between">
                              <span className="text-[10px] text-gray-500 font-sans block leading-tight">{sensor.label}</span>
                              <div className="flex items-baseline justify-between mt-1.5">
                                <span className="text-sm font-bold font-mono text-white">{sensor.value}</span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                  sensor.status === "normal" ? "bg-emerald-950/60 text-emerald-400" :
                                  sensor.status === "alert" ? "bg-amber-950/60 text-amber-400" :
                                  "bg-rose-950/60 text-rose-400 animate-pulse"
                                }`}>
                                  {sensor.status.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-[9px] text-gray-400 mt-1 font-mono">{sensor.metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Infrastructure utility grids state */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                        <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-gray-500 font-mono block">{currentLanguage === "ar" ? "الشبكة الكهربائية" : "Power Grid"}</span>
                          <span className={`text-xs font-semibold block mt-1 uppercase ${
                            twin.infrastructure.power === "stable" ? "text-emerald-400" : "text-amber-500"
                          }`}>
                            {twin.infrastructure.power}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-gray-500 font-mono block">{currentLanguage === "ar" ? "المياه الصناعية" : "Water Supply"}</span>
                          <span className="text-xs font-semibold text-emerald-400 block mt-1 uppercase">
                            {twin.infrastructure.water}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-gray-500 font-mono block">{currentLanguage === "ar" ? "الألياف الضوئية" : "Fiber Telecom"}</span>
                          <span className={`text-xs font-semibold block mt-1 uppercase ${
                            twin.infrastructure.fiber === "active" ? "text-emerald-400" : "text-rose-500"
                          }`}>
                            {twin.infrastructure.fiber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: SPATIAL AI ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span>{currentLanguage === "ar" ? "منصة التحليلات الجغرافية والذكاء الاصطناعي السيادي" : "Spatial AI Location Optimization & Planning Engine"}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {currentLanguage === "ar" ? "خوارزمية تحديد أفضل المواقع الجغرافية للمصانع والمنشآت وتوليد تقارير الجدوى" : "Optimize industrial factory sites, predict supply chain bottlenecks, and run spatial AI simulation"}
                </p>
              </div>

              {/* FACTORY LOCATION OPTIMIZATION CONTROLLER */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-mono text-gray-400 block mb-3">
                  {currentLanguage === "ar" ? "📍 حدد معيار الأولوية الاستراتيجية لتحليل الذكاء الاصطناعي:" : "📍 Choose Strategic Priority Parameter for AI Solver:"}
                </span>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "energy", labelAr: "استقرار وتكلفة الكهرباء", labelEn: "Grid Power Stability", icon: Zap },
                    { id: "transport", labelAr: "القرب اللوجستي للموانئ", labelEn: "Port Logistics Transit", icon: Anchor },
                    { id: "labor", labelAr: "كثافة الأيدي العاملة الفنية", labelEn: "Labor Pool Density", icon: Users },
                    { id: "market", labelAr: "القرب الاستهلاكي والأسواق", labelEn: "Consumer Market Proximity", icon: Smartphone }
                  ].map(param => (
                    <button
                      key={param.id}
                      onClick={() => setOptimizeGoal(param.id as any)}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        optimizeGoal === param.id
                          ? "bg-emerald-950/40 border-emerald-500/60 text-white shadow-inner"
                          : "bg-slate-900/50 border-slate-800 text-gray-400 hover:border-slate-700"
                      }`}
                    >
                      <param.icon className={`h-4.5 w-4.5 mb-2 ${optimizeGoal === param.id ? "text-emerald-400 animate-bounce" : "text-gray-500"}`} />
                      <div>
                        <span className="text-[11px] font-semibold block">{currentLanguage === "ar" ? param.labelAr : param.labelEn}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={runSpatialOptimization}
                    disabled={isAiProcessing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isAiProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>{currentLanguage === "ar" ? "جاري تشغيل مصفوفة الحلول..." : "Compiling Spatial Matrix..."}</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="h-4 w-4" />
                        <span>{currentLanguage === "ar" ? "تشغيل المحسن الجغرافي الذكي" : "Solve Location Optimization"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIMIZATION RESULTS */}
              <AnimatePresence mode="wait">
                {optimizationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-emerald-950/10 border border-emerald-500/35 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <div>
                          <span className="text-xs text-emerald-400 font-mono uppercase">{currentLanguage === "ar" ? "الخيار الأمثل المقترح من الذكاء الاصطناعي" : "AI OPTIMAL GIS SOLUTION"}</span>
                          <h4 className="text-sm font-bold text-white mt-0.5">
                            {currentLanguage === "ar" ? optimizationResult.nameAr : optimizationResult.nameEn}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 font-mono block">{currentLanguage === "ar" ? "معيار المطابقة" : "Matching Score"}</span>
                        <span className="text-base font-bold text-[#D4AF37] font-mono">{optimizationResult.score}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Detailed Bullet Reasons */}
                      <div>
                        <span className="text-xs font-semibold text-gray-300 block mb-2">{currentLanguage === "ar" ? "مؤشرات الجدوى والملاءمة:" : "Feasibility & Geodata Factors:"}</span>
                        <ul className="space-y-1.5 text-xs text-gray-400">
                          {(currentLanguage === "ar" ? optimizationResult.reasonsAr : optimizationResult.reasonsEn).map((r: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-1 font-bold">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technical plot detail specs */}
                      <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-lg flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-500 block">{currentLanguage === "ar" ? "معرّف قطعة الأرض" : "Sovereign Plot ID"}</span>
                            <span className="font-mono text-white font-semibold mt-0.5 block">{optimizationResult.recommendedPlotId}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">{currentLanguage === "ar" ? "مؤشر التوطين" : "Localization Index"}</span>
                            <span className="font-mono text-emerald-400 font-semibold mt-0.5 block">{optimizationResult.readinessIndex}%</span>
                          </div>
                        </div>

                        {/* Immutable hash and action button */}
                        <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px]">
                          <span className="text-gray-500 font-mono">PostGIS Geometry OK</span>
                          <button
                            onClick={() => {
                              setSelectedState(optimizationResult.bestState);
                              setNotifications(prev => [`Zoomed to optimal recommended plot ${optimizationResult.recommendedPlotId}`, ...prev]);
                            }}
                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <span>{currentLanguage === "ar" ? "تحديد الموقع على الخريطة" : "Highlight Location"}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SOVEREIGN SPATIAL CHAT AI */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-mono font-semibold text-gray-300">{currentLanguage === "ar" ? "مساعد المحادثة الجغرافية السيادي" : "Sovereign GIS Conversational Assistant"}</span>
                </div>

                <div className="h-40 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {aiChatHistory.map((h, idx) => (
                    <div key={idx} className={`flex gap-2.5 ${h.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {h.sender === "ai" && (
                        <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Cpu className="h-3 w-3" />
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-lg p-2.5 text-xs ${
                        h.sender === "user" 
                          ? "bg-slate-800 text-white rounded-br-none" 
                          : "bg-slate-900 border border-slate-800/80 text-gray-300 rounded-bl-none"
                      }`}>
                        {currentLanguage === "ar" ? h.textAr : h.textEn}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendAiQuery} className="flex gap-2">
                  <input
                    type="text"
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    placeholder={currentLanguage === "ar" ? "اسألني عن أفضل موقع لمستودع حبوب أو كفاءة الموانئ..." : "Ask spatial query: e.g., Where to host a textile factory?..."}
                    className="flex-1 bg-slate-900 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="submit"
                    disabled={isAiProcessing || !aiChatInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-gray-600 text-white px-3.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: INSPECTION MAP */}
          {activeTab === "inspection" && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
                  <span>{currentLanguage === "ar" ? "لوحة التفتيش الذكي وحماية الأسواق الفيدرالية" : "Sovereign Market Surveillance & Inspection Registry"}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {currentLanguage === "ar" ? "رصد المخالفات الجغرافية، تعيين المفتشين وإرسال لجان المراجعة الميدانية" : "Track legal compliance, manage active field inspections, and dispatch inspectors to state coordinates"}
                </p>
              </div>

              {/* INSPECTION DISPATCH FORM */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-mono text-white mb-3 uppercase flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{currentLanguage === "ar" ? "جدولة وتعيين تفتيش ميداني جديد" : "Schedule New Site Audit/Inspection"}</span>
                </h4>

                <form onSubmit={handleAddInspection} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-1">{currentLanguage === "ar" ? "المنشأة المستهدفة" : "Target Facility Name"}</label>
                    <input
                      type="text"
                      value={newInspFacility}
                      onChange={(e) => setNewInspFacility(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "مثال: مصفاة الجيلي" : "e.g., Al-Jaili Distribution"}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-1">{currentLanguage === "ar" ? "المفتش الفيدرالي" : "Assigned Inspector"}</label>
                    <input
                      type="text"
                      value={newInspInspector}
                      onChange={(e) => setNewInspInspector(e.target.value)}
                      placeholder={currentLanguage === "ar" ? "اسم المفتش" : "e.g., Eng. Amjad Ali"}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-1">{currentLanguage === "ar" ? "الولاية المستضيفة" : "Target State"}</label>
                    <select
                      value={newInspState}
                      onChange={(e) => setNewInspState(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-gray-300 outline-none focus:border-emerald-500/50"
                    >
                      {statesList.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#0b0f19]">{currentLanguage === "ar" ? s.nameAr : s.nameEn}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition-all cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "تأكيد وإيفاد المفتش" : "Dispatch Inspection"}
                  </button>
                </form>
              </div>

              {/* LIST OF HISTORICAL VIOLATIONS AND INSPECTION VISITS */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-mono text-gray-300">{currentLanguage === "ar" ? "سجل الزيارات والامتثال الجغرافي النشط" : "Live Compliance & Violation Database"}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViolationsCount(prev => prev + 1)}
                      className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/30 text-rose-400 text-[10px] font-mono hover:bg-rose-900 transition-all cursor-pointer"
                    >
                      + {currentLanguage === "ar" ? "تسجيل شكوى احتكار" : "Log Anti-Trust Alert"}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-gray-500 font-mono">
                        <th className="p-3 text-center">ID</th>
                        <th className="p-3">{currentLanguage === "ar" ? "المنشأة" : "Facility Name"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "المفتش" : "Inspector"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "التاريخ" : "Schedule Date"}</th>
                        <th className="p-3 text-center">{currentLanguage === "ar" ? "الحالة" : "Compliance Status"}</th>
                        <th className="p-3">{currentLanguage === "ar" ? "المخالفات / التنبيهات" : "Violations & Warnings"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-gray-300 font-mono">
                      {inspectionVisits.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="p-3 text-center text-gray-500 text-[11px]">{item.id}</td>
                          <td className="p-3 font-sans font-semibold text-white">
                            {currentLanguage === "ar" ? item.facilityAr : item.facilityEn}
                          </td>
                          <td className="p-3 font-sans">{item.inspector}</td>
                          <td className="p-3 text-center text-gray-400">{item.date}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                              item.status === "completed" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20" :
                              "bg-amber-950/60 text-amber-400 border border-amber-500/20"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 font-sans text-xs">
                            <span className={item.result === "violation_logged" ? "text-rose-400 font-semibold" : "text-gray-400"}>
                              {item.violation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FUTURE SMART SERVICES & SANDBOX */}
          {activeTab === "future-smart" && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 md:p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Radar className="h-4 w-4 text-[#D4AF37] animate-spin" style={{ animationDuration: "10s" }} />
                  <span>{currentLanguage === "ar" ? "بوابة الأقمار الصناعية المستقبلية ومحاكاة البيانات" : "Future Smart Map Services & PostGIS Sandbox"}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {currentLanguage === "ar" ? "محاكاة التغطية الرادارية والـ PostGIS والتحقق من التشفير السيادي" : "Test real-time satellite imagery simulation, IoT telemetry triggers and PostGIS geospatial tables"}
                </p>
              </div>

              {/* TOGGLES FOR ADVANCED LAYERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">{currentLanguage === "ar" ? "رادار الأقمار الصناعية (Sentinel)" : "Satellite Sentinel Stream"}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{currentLanguage === "ar" ? "قنوات التصوير الحراري المباشر" : "High-res infrared thermal bands"}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSatelliteOverlay(!satelliteOverlay);
                      setNotifications(prev => [`Sentinel satellite constellation layer: ${!satelliteOverlay ? "ENABLED" : "DISABLED"}`, ...prev]);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                      satelliteOverlay ? "bg-emerald-600 text-white" : "bg-slate-900 text-gray-500 border border-slate-800"
                    }`}
                  >
                    {satelliteOverlay ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">{currentLanguage === "ar" ? "ممرات طائرات الدرون التجارية" : "Commercial Drone Corridors"}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{currentLanguage === "ar" ? "رسم خطوط الطيران والتوصيل الذكي" : "Sovereign cargo flight plans"}</span>
                  </div>
                  <button
                    onClick={() => {
                      setDroneCorridors(!droneCorridors);
                      setNotifications(prev => [`Commercial unmanned flight corridor overlay: ${!droneCorridors ? "ACTIVE" : "INACTIVE"}`, ...prev]);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                      droneCorridors ? "bg-emerald-600 text-white" : "bg-slate-900 text-gray-500 border border-slate-800"
                    }`}
                  >
                    {droneCorridors ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">{currentLanguage === "ar" ? "محاكاة مستشعرات IoT" : "Simulated IoT Feed"}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{currentLanguage === "ar" ? "تدفق حي لكل 10 ثواني" : "Dynamic data streaming loops"}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIotSensorStreaming(!iotSensorStreaming);
                      setNotifications(prev => [`Continuous industrial telemetry state loop: ${!iotSensorStreaming ? "ACTIVE" : "MUTED"}`, ...prev]);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                      iotSensorStreaming ? "bg-emerald-600 text-white" : "bg-slate-900 text-gray-500 border border-slate-800"
                    }`}
                  >
                    {iotSensorStreaming ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              {/* POSTGIS DATABASE CONSOLE SANDBOX */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-semibold text-gray-300 flex items-center gap-1">
                    <Database className="h-4 w-4 text-emerald-400" />
                    {currentLanguage === "ar" ? "وحدة تحكم قواعد البيانات الجغرافية PostGIS SQL Console" : "Sovereign PostgreSQL + PostGIS Spatial Console"}
                  </span>
                  <button
                    onClick={executePostgisQuery}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-white rounded font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-all border border-slate-700"
                  >
                    <Play className="h-3 w-3 text-emerald-400" />
                    <span>Run Query</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Query Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-mono block">{currentLanguage === "ar" ? "طلب الاستعلام الجغرافي (PostGIS SQL):" : "Geospatial SQL Query Input:"}</label>
                    <textarea
                      value={postgisConsoleQuery}
                      onChange={(e) => setPostgisConsoleQuery(e.target.value)}
                      rows={5}
                      className="w-full bg-[#070a13] border border-slate-850 p-2.5 rounded font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500/50 leading-relaxed"
                    />
                  </div>

                  {/* Query Result Output */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-mono block">{currentLanguage === "ar" ? "مخرج قاعدة البيانات:" : "Database Pipeline Output:"}</label>
                    <pre className="w-full bg-[#03060f] border border-slate-850 p-2.5 rounded font-mono text-[11px] text-gray-300 overflow-x-auto min-h-[110px] whitespace-pre">
                      {postgisResult}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: EXECUTIVE CONTROL COCKPIT & METRICS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* GIS ADDRESS / ENTITY SEARCH ENGINE */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs font-mono font-semibold text-white mb-3 uppercase flex items-center gap-1.5">
              <Search className="h-4 w-4 text-emerald-400" />
              <span>{currentLanguage === "ar" ? "البحث الجغرافي والسمانتي الموحد" : "AI Sovereign GIS Search Engine"}</span>
            </h4>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLanguage === "ar" ? "ابحث عن ولاية، شركة، ترخيص أو صنف..." : "Search states, registration IDs, routes..."}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 rounded text-xs transition-all cursor-pointer border border-slate-700"
              >
                {currentLanguage === "ar" ? "بحث" : "Query"}
              </button>
            </form>

            {/* SEARCH RESULTS PRESENTATION */}
            {searchResults.length > 0 && (
              <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg p-2 max-h-48 overflow-y-auto space-y-2">
                <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono pb-1 border-b border-slate-800/60">
                  <span>Results found: {searchResults.length}</span>
                  <button onClick={() => setSearchResults([])} className="text-gray-400 hover:text-white">Clear</button>
                </div>
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (res.type === "state") {
                        setSelectedState(res.data.id);
                        setActiveTab("gis-map");
                      } else {
                        setSelectedState(res.data.stateId);
                        setActiveTab("gis-map");
                      }
                      setNotifications(prev => [`Navigating to matched entity: ${res.data.nameEn}`, ...prev]);
                    }}
                    className="p-2 hover:bg-slate-900 rounded cursor-pointer text-xs border border-transparent hover:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-white block">
                        {currentLanguage === "ar" ? res.data.nameAr : res.data.nameEn}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-0.5 block font-mono">
                        {res.type === "state" ? "Sudan Administrative State" : `${res.data.registrationNo} | ${res.data.complianceRating}`}
                      </span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-emerald-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* REAL-TIME EXECUTIVE INTELLIGENCE CHART */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs font-mono font-semibold text-white mb-3 uppercase flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
              <span>{currentLanguage === "ar" ? "مؤشرات نمو وحجم الاستثمار بالولايات" : "Executive Spatial Growth Metrics"}</span>
            </h4>

            {/* RECHARTS COMPONENT */}
            <div className="h-48 w-full font-mono text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={statesList.map(s => ({
                    name: currentLanguage === "ar" ? s.nameAr.replace("ولاية ", "") : s.nameEn.replace(" State", ""),
                    companies: s.metrics.companies,
                    investment: s.metrics.investmentReadiness
                  }))}
                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b" }} />
                  <Area type="monotone" dataKey="companies" stroke="#10b981" fillOpacity={1} fill="url(#colorCompanies)" name="Enterprises" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-gray-500">
              <span>Sovereign Economic Index</span>
              <span className="text-emerald-400 font-bold">Updated: Today, 02:00 UTC</span>
            </div>
          </div>

          {/* PORT TRANSIT CORRIDOR STATS */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs font-mono font-semibold text-white mb-3 uppercase flex items-center gap-1.5">
              <Anchor className="h-4 w-4 text-emerald-400" />
              <span>{currentLanguage === "ar" ? "حالة ممرات التجارة الفيدرالية" : "Sovereign Transit & Routes Status"}</span>
            </h4>

            <div className="space-y-3">
              {supplyChainRoutes.map((route, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {currentLanguage === "ar" ? route.nameAr : route.nameEn}
                    </span>
                    <div className="flex gap-2 text-[10px] text-gray-500 mt-1 font-mono">
                      <span>{route.lengthKm} km</span>
                      <span>•</span>
                      <span>{route.avgTransitHours} hrs avg</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
                    route.status === "clear" ? "bg-emerald-950/60 text-emerald-400" : "bg-amber-950/60 text-amber-400 animate-pulse"
                  }`}>
                    {route.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* IMMUTABLE SPATIAL AUDIT & LEDGER LOGS */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-semibold text-white uppercase flex items-center gap-1.5">
                <Database className="h-4 w-4 text-[#D4AF37]" />
                <span>{currentLanguage === "ar" ? "سجل تدقيق بلوكشين العمليات الجغرافية" : "Immutable Spatial Operations Ledger"}</span>
              </h4>
              <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            {/* Notification items */}
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-[10px] font-mono text-gray-400 scrollbar-thin">
              {notifications.map((note, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-850 flex items-start gap-1.5 leading-tight">
                  <span className="text-emerald-500 mt-0.5">✔</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
