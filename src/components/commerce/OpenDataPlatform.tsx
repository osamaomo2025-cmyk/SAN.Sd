/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Database, Download, Eye, FileText, Search, Code, Check, ExternalLink, Calendar, HelpCircle, Table } from "lucide-react";

interface Dataset {
  id: string;
  titleAr: string;
  titleEn: string;
  category: "company" | "trade" | "industrial" | "investment" | "consumer";
  downloadCount: number;
  recordCount: number;
  lastUpdated: string;
  size: string;
  descAr: string;
  descEn: string;
}

interface OpenDataPlatformProps {
  currentLanguage: "ar" | "en";
  datasets: Dataset[];
  onDownloadDataset: (id: string) => void;
}

export default function OpenDataPlatform({ currentLanguage, datasets, onDownloadDataset }: OpenDataPlatformProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [activeSnippetLang, setActiveSnippetLang] = useState<"curl" | "javascript" | "python">("curl");
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: "all", labelAr: "كل القطاعات", labelEn: "All Sectors" },
    { id: "company", labelAr: "الشركات والمتاجر", labelEn: "Companies & Stores" },
    { id: "trade", labelAr: "التجارة والتبادل", labelEn: "Trade & Volume" },
    { id: "industrial", labelAr: "الصناعة والفرز", labelEn: "Industrial Growth" },
    { id: "investment", labelAr: "الاستثمار المباشر", labelEn: "Direct Investments" },
    { id: "consumer", labelAr: "سلامة الأسواق", labelEn: "Consumer Protection" }
  ];

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = 
      d.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.descAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.descEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    const found = categories.find(c => c.id === cat);
    return found ? (currentLanguage === "ar" ? found.labelAr : found.labelEn) : cat;
  };

  const handleDownload = (id: string) => {
    onDownloadDataset(id);
    
    // Simulate downloading as JSON
    const dataset = datasets.find(d => d.id === id);
    if (!dataset) return;

    // Create JSON content
    const sampleData = [
      { id: 1, nationalId: "SD-BIZ-481920", name: "SudaMarket Organic Platform", sector: "agricultural_commerce", status: "active", registeredAt: "2026-01-15" },
      { id: 2, nationalId: "SD-BIZ-759102", name: "Kordofan Gum & Hibiscus Store", sector: "export_trade", status: "verified", registeredAt: "2026-02-20" },
      { id: 3, nationalId: "SD-BIZ-930412", name: "Delivery Nile Logistics Hub", sector: "logistics_services", status: "active", registeredAt: "2026-03-05" }
    ];
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dataset.titleEn.replace(/\s+/g, "_").toLowerCase()}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = (dataset: Dataset) => {
    const endpoint = `https://api.sdmci.gov.sd/v1/open/datasets/${dataset.id}/records`;
    if (activeSnippetLang === "curl") {
      return `curl -X GET "${endpoint}" \\\n  -H "Accept: application/json" \\\n  -H "X-API-Key: YOUR_API_KEY"`;
    }
    if (activeSnippetLang === "javascript") {
      return `fetch("${endpoint}", {\n  headers: {\n    "X-API-Key": "YOUR_API_KEY",\n    "Accept": "application/json"\n  }\n})\n.then(response => response.json())\n.then(data => console.log(data));`;
    }
    return `import requests\n\nurl = "${endpoint}"\nheaders = {\n    "X-API-Key": "YOUR_API_KEY",\n    "Accept": "application/json"\n}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())`;
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Category Filters */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentLanguage === "ar" ? "ابحث في البيانات المفتوحة، الكتالوج والملفات..." : "Search open datasets and catalogs..."}
              className="w-full bg-slate-50 border border-slate-200 text-xs px-10 py-3 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
            />
          </div>

          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold px-3 py-1.5 rounded-xl">
            <Database className="h-4 w-4 text-blue-600" />
            <span>{currentLanguage === "ar" ? "التحول الرقمي السيادي: إتاحة البيانات بشفافية" : "Sovereign Digital Transition: Open Data Compliance"}</span>
          </div>
        </div>

        {/* Categories Rail */}
        <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {currentLanguage === "ar" ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dataset Listing Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm uppercase tracking-wider">
              {currentLanguage === "ar" ? `كتالوج البيانات المتاحة (${filteredDatasets.length})` : `Available Open Datasets (${filteredDatasets.length})`}
            </h4>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredDatasets.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds)}
                className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer text-right flex flex-col justify-between gap-3 ${
                  selectedDataset?.id === ds.id
                    ? "border-sudan-green shadow-sm ring-1 ring-sudan-green/30"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-bold text-slate-500">
                      {getCategoryLabel(ds.category)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Download className="h-3 w-3 text-slate-400" />
                      {ds.downloadCount.toLocaleString()}
                    </span>
                  </div>

                  <h5 className="font-extrabold text-[#1E293B] text-xs md:text-sm pt-1">
                    {currentLanguage === "ar" ? ds.titleAr : ds.titleEn}
                  </h5>

                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                    {currentLanguage === "ar" ? ds.descAr : ds.descEn}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[10px] text-slate-400 font-bold font-mono">
                  <span>{currentLanguage === "ar" ? `السجلات: ${ds.recordCount.toLocaleString()}` : `Records: ${ds.recordCount.toLocaleString()}`}</span>
                  <span>{currentLanguage === "ar" ? `الحجم: ${ds.size}` : `Size: ${ds.size}`}</span>
                </div>
              </div>
            ))}

            {filteredDatasets.length === 0 && (
              <div className="p-8 text-center bg-white border border-gray-200 rounded-3xl text-gray-400 font-bold">
                {currentLanguage === "ar" ? "لم يتم العثور على مجموعات بيانات تطابق البحث" : "No datasets match your search parameters"}
              </div>
            )}
          </div>
        </div>

        {/* Dataset Preview & API Client Column */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 md:p-6 space-y-6">
          {selectedDataset ? (
            <div className="space-y-6">
              
              {/* Detailed Title Section */}
              <div className="space-y-2 pb-4 border-b border-gray-100">
                <span className="text-[10px] bg-sudan-green/10 text-sudan-green border border-sudan-green/20 px-2.5 py-1 rounded-md font-bold uppercase">
                  {getCategoryLabel(selectedDataset.category)}
                </span>
                <h4 className="font-extrabold text-[#1E293B] text-base pt-1">
                  {currentLanguage === "ar" ? selectedDataset.titleAr : selectedDataset.titleEn}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {currentLanguage === "ar" ? selectedDataset.descAr : selectedDataset.descEn}
                </p>
              </div>

              {/* Data Specifications & Download Actions */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                <h5 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Table className="h-4 w-4 text-sudan-green" />
                  <span>{currentLanguage === "ar" ? "تفاصيل وبنية التصدير السيادي" : "Sovereign Schema Specifications"}</span>
                </h5>

                <div className="grid grid-cols-2 gap-y-2.5 pt-1 text-[11px] font-medium text-slate-600">
                  <span className="text-gray-400">{currentLanguage === "ar" ? "إجمالي السجلات المتاحة:" : "Record Count:"}</span>
                  <span className="font-mono font-extrabold text-slate-800">{selectedDataset.recordCount.toLocaleString()} {currentLanguage === "ar" ? "سجل" : "records"}</span>

                  <span className="text-gray-400">{currentLanguage === "ar" ? "حجم حزمة البيانات:" : "File Compression Size:"}</span>
                  <span className="font-mono font-extrabold text-slate-800">{selectedDataset.size}</span>

                  <span className="text-gray-400">{currentLanguage === "ar" ? "تاريخ آخر تحديث دوري:" : "Sovereign Sync Date:"}</span>
                  <span className="font-mono font-extrabold text-slate-800">{new Date(selectedDataset.lastUpdated).toLocaleDateString()}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleDownload(selectedDataset.id)}
                    className="w-full bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>{currentLanguage === "ar" ? "تحميل مجلد البيانات الفيدرالي الموثق (JSON)" : "Download Sovereign Dataset Package (JSON)"}</span>
                  </button>
                </div>
              </div>

              {/* API Access Snippet Code Generator */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="h-4 w-4 text-sudan-gold" />
                    <span>{currentLanguage === "ar" ? "نافذة دمج المطورين والاتصال الفوري" : "Developer REST API Integration Console"}</span>
                  </h5>
                  
                  <div className="flex gap-1.5 text-[10px] font-bold">
                    {(["curl", "javascript", "python"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveSnippetLang(lang)}
                        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                          activeSnippetLang === lang
                            ? "bg-slate-900 text-[#FFD700] font-extrabold"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Snippet box */}
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-[10px] overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{getCodeSnippet(selectedDataset)}</code>
                  </pre>
                  
                  <button
                    onClick={() => copyToClipboard(getCodeSnippet(selectedDataset))}
                    className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white p-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 leading-normal">
                  <HelpCircle className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>
                    {currentLanguage === "ar" 
                      ? "يتطلب الاتصال بالبوابة الوطنية الفيدرالية توفر مفتاح ترخيص API صالح ومصرح من وحدة المفاتيح السيادية."
                      : "Public queries require a valid National Gateway Credential with selective scopes assigned."}
                  </span>
                </p>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="bg-slate-50 p-4 rounded-full border border-slate-100">
                <Database className="h-8 w-8 text-slate-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-[#1E293B] text-xs md:text-sm">
                  {currentLanguage === "ar" ? "تصفح البيانات المفتوحة" : "Sovereign Public Directory Index"}
                </h5>
                <p className="text-gray-400 text-xs font-semibold max-w-sm leading-relaxed">
                  {currentLanguage === "ar" 
                    ? "اختر أي مجموعة بيانات أو كشوفات إحصائية من القائمة الجانبية المحدثة لاستعراض البنية وتحميلها والاندماج معها سيادياً."
                    : "Select a structural government dataset from the list to preview metadata, download files, and generate instant API code integrations."}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
