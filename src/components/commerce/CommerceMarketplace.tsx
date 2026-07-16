/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShoppingBag, Tag, Box, Star, CheckCircle, Search, 
  Trash2, Plus, PlusCircle, UserCheck, AlertTriangle, X, ShieldAlert 
} from "lucide-react";
import { MarketplaceProduct, CommerceUserRole, DigitalBusiness } from "./CommerceTypes";

interface CommerceMarketplaceProps {
  currentLanguage: "ar" | "en";
  products: MarketplaceProduct[];
  businesses: DigitalBusiness[];
  onAddProduct: (prod: any) => void;
  onUpdateProductStatus: (id: string, status: any) => void;
  userRole: CommerceUserRole;
}

export default function CommerceMarketplace({
  currentLanguage,
  products,
  businesses,
  onAddProduct,
  onUpdateProductStatus,
  userRole
}: CommerceMarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Product form state
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("local_commodities");
  const [stock, setStock] = useState("");
  const [businessId, setBusinessId] = useState("");

  const isGov = [
    CommerceUserRole.GOVERNMENT_OFFICER,
    CommerceUserRole.DEPARTMENT_MANAGER,
    CommerceUserRole.DIRECTOR,
    CommerceUserRole.UNDERSECRETARY,
    CommerceUserRole.MINISTER,
    CommerceUserRole.SUPER_ADMIN
  ].includes(userRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !price || !stock || !businessId) {
      alert(currentLanguage === "ar" ? "يرجى تعبئة كافة الحقول" : "Please fill in all required fields");
      return;
    }

    const newProd: MarketplaceProduct = {
      id: `prod-${Date.now()}`,
      businessId,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price: Number(price),
      currency: "SDG",
      category,
      stock: Number(stock),
      rating: 5.0,
      reviewsCount: 0,
      status: isGov ? "active" : "under_review"
    };

    onAddProduct(newProd);
    setIsAddOpen(false);

    // reset
    setNameAr("");
    setNameEn("");
    setDescriptionAr("");
    setDescriptionEn("");
    setPrice("");
    setStock("");
  };

  const getCategoryLabel = (cat: string) => {
    const mappings: Record<string, { ar: string, en: string }> = {
      local_commodities: { ar: "سلع سودانية وطنية", en: "Sovereign Commodities" },
      processed_foods: { ar: "صناعات غذائية تحويلية", en: "Processed Foods" },
      handicrafts: { ar: "صناعات يدوية وتراثية", en: "Sudanese Handicrafts" },
      digital_services: { ar: "خدمات رقمية واستشارية", en: "Digital Services" }
    };
    return mappings[cat] ? (currentLanguage === "ar" ? mappings[cat].ar : mappings[cat].en) : cat;
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Find linked vendor reputation and names
  const getVendorDetails = (bizId: string) => {
    const biz = businesses.find(b => b.id === bizId);
    if (!biz) {
      return {
        name: currentLanguage === "ar" ? "تاجر وطني مستقل" : "Independent Native Vendor",
        reputation: 85,
        status: "verified"
      };
    }
    return {
      name: currentLanguage === "ar" ? biz.storeNameAr : biz.storeNameEn,
      reputation: biz.trustScore,
      status: biz.status
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Categories Nav */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={currentLanguage === "ar" ? "ابحث عن منتج، كود تعريفي، أو تصنيف..." : "Search product, code, or category..."}
            className="w-full bg-slate-50 border border-slate-200 text-xs px-10 py-3 rounded-2xl outline-none focus:bg-white focus:border-sudan-green transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {["all", "local_commodities", "processed_foods", "handicrafts", "digital_services"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-[11px] font-bold border transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? "bg-sudan-green text-white border-sudan-green shadow-xs" 
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
              }`}
            >
              {cat === "all" ? (currentLanguage === "ar" ? "كل المعروضات" : "All Products") : getCategoryLabel(cat)}
            </button>
          ))}

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-sudan-green hover:bg-sudan-green-light text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm md:ml-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? "إدراج منتج جديد" : "Onboard Product"}</span>
          </button>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => {
          const vendor = getVendorDetails(prod.businessId);
          return (
            <div
              key={prod.id}
              className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-sudan-green transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {prod.status === "under_review" && (
                <div className="absolute top-3 left-3 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 z-10">
                  <ShieldAlert className="h-3 w-3 animate-pulse" />
                  {currentLanguage === "ar" ? "تحت التدقيق الرقابي" : "Under Vetting"}
                </div>
              )}

              <div className="space-y-3">
                {/* SVG Image placeholder / Visual accent */}
                <div className="aspect-video bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 relative overflow-hidden">
                  <ShoppingBag className="h-8 w-8 text-slate-300" />
                  <span className="absolute bottom-2 right-2 text-[9px] bg-slate-900/60 text-white font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                    {getCategoryLabel(prod.category)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#1E293B] text-xs md:text-sm tracking-tight leading-snug line-clamp-2">
                    {currentLanguage === "ar" ? prod.nameAr : prod.nameEn}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {currentLanguage === "ar" ? prod.descriptionAr : prod.descriptionEn}
                  </p>
                </div>

                {/* Rating and Stock specs */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-sudan-gold fill-sudan-gold" />
                    <span className="font-bold text-slate-800">{prod.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({prod.reviewsCount})</span>
                  </div>
                  <div>
                    {currentLanguage === "ar" ? `المخزون المتاح: ${prod.stock}` : `Stock: ${prod.stock}`}
                  </div>
                </div>

                {/* Associated Vendor Card */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold text-slate-800 truncate max-w-[120px]">{vendor.name}</p>
                    {vendor.status === "verified" || vendor.status === "active" ? (
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-100 uppercase">
                        {currentLanguage === "ar" ? "تاجر معتمد" : "Verified"}
                      </span>
                    ) : (
                      <span className="text-[8px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.2 rounded border border-rose-100 uppercase">
                        {vendor.status}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400">
                    <span>{currentLanguage === "ar" ? "مؤشر السمعة:" : "Vendor Reputation:"}</span>
                    <span className="font-bold text-sudan-gold">{vendor.reputation}%</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-sudan-green font-extrabold text-xs md:text-sm">
                  {prod.price.toLocaleString()} SDG
                </span>

                {isGov && prod.status === "under_review" ? (
                  <button
                    onClick={() => onUpdateProductStatus(prod.id, "active")}
                    className="bg-sudan-green hover:bg-sudan-green-light text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "اعتماد وإدراج" : "Approve Listing"}
                  </button>
                ) : (
                  <button
                    onClick={() => alert(currentLanguage === "ar" ? "تمت إضافة المنتج لعربة الشراء المؤقتة المربوطة بالدفع الفيدرالي" : "Added to sovereign checkout basket")}
                    className="bg-[#1E293B] hover:bg-slate-800 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    {currentLanguage === "ar" ? "شراء المنتج" : "Buy Product"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full bg-white text-center py-12 rounded-3xl border border-gray-200 space-y-2 shadow-sm">
            <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm font-bold">
              {currentLanguage === "ar" ? "لم يتم العثور على أي منتج يطابق معايير البحث" : "No products found matches selection"}
            </p>
          </div>
        )}
      </div>

      {/* Onboard Product Overlay Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full text-slate-800 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
              <h3 className="font-bold text-base">
                {currentLanguage === "ar" ? "إدراج سلع أو منتجات جديدة بالدليل التجاري الوطني" : "Onboard New Product to Sovereign Catalog"}
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اختر المتجر الرقمي المسجل *" : "Associated Digital Business *"}</label>
                <select
                  required
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                >
                  <option value="">{currentLanguage === "ar" ? "--- اختر المتجر المعتمد ---" : "--- Select Verified Store ---"}</option>
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>
                      {currentLanguage === "ar" ? b.storeNameAr : b.storeNameEn} ({b.digitalId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم السلعة/المنتج (بالعربية) *" : "Product Name (Arabic) *"}</label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="سمسم أبيض من القضارف ممتاز"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "اسم السلعة/المنتج (بالإنجليزية) *" : "Product Name (English) *"}</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Organic White Sesame from Al Qadarif"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الوصف التفصيلي (بالعربية)" : "Description (Arabic)"}</label>
                  <textarea
                    rows={2}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الوصف التفصيلي (بالإنجليزية)" : "Description (English)"}</label>
                  <textarea
                    rows={2}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "تصنيف المنتجات *" : "Category *"}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green"
                  >
                    <option value="local_commodities">{currentLanguage === "ar" ? "سلع سودانية وطنية" : "Sovereign Commodities"}</option>
                    <option value="processed_foods">{currentLanguage === "ar" ? "صناعات غذائية تحويلية" : "Processed Foods"}</option>
                    <option value="handicrafts">{currentLanguage === "ar" ? "صناعات يدوية وتراثية" : "Handicrafts"}</option>
                    <option value="digital_services">{currentLanguage === "ar" ? "خدمات رقمية واستشارية" : "Digital Services"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "السعر (SDG) *" : "Price (SDG) *"}</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="15000"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">{currentLanguage === "ar" ? "الكمية المتاحة بالمخزن *" : "Stock Volume *"}</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-sudan-green font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 bg-white sticky bottom-0">
                <button type="button" onClick={() => setIsAddOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer">{currentLanguage === "ar" ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="bg-sudan-green hover:bg-sudan-green-light text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
                  {currentLanguage === "ar" ? "تأكيد وإرسال للمراجعة" : "Confirm Onboarding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
