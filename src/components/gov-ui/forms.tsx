/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UploadCloud, FileText, Check, AlertCircle, Trash2, Edit } from "lucide-react";
import { SovereignTypography, SovereignButton } from "./atoms";

// ==========================================
// 1. INPUT CONTROL
// ==========================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelAr: string;
  labelEn: string;
  helperAr?: string;
  helperEn?: string;
  error?: string;
  isRequired?: boolean;
  currentLanguage?: "ar" | "en";
}

export const SovereignInput: React.FC<InputProps> = ({
  labelAr,
  labelEn,
  helperAr,
  helperEn,
  error,
  isRequired = false,
  currentLanguage = "ar",
  className = "",
  type = "text",
  id,
  ...props
}) => {
  const labelText = currentLanguage === "ar" ? labelAr : labelEn;
  const helperText = currentLanguage === "ar" ? helperAr : helperEn;

  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs md:text-[13px] font-bold text-sudan-dark flex items-center gap-1">
          <span>{labelText}</span>
          {isRequired && <span className="text-rose-500 font-extrabold">*</span>}
        </label>
        {error && (
          <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1 animate-pulse">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </span>
        )}
      </div>

      <input
        type={type}
        id={id}
        className={`w-full text-xs p-3.5 rounded-2xl border bg-white text-sudan-dark outline-none transition-all ${
          error 
            ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" 
            : "border-gray-200 focus:border-sudan-green focus:ring-1 focus:ring-sudan-green"
        } disabled:bg-gray-50 disabled:text-gray-400`}
        {...props}
      />

      {helperText && !error && (
        <p className="text-[10px] text-gray-400 leading-normal">
          {helperText}
        </p>
      )}
    </div>
  );
};

// ==========================================
// 2. SELECT DROP-DOWN CONTROL
// ==========================================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  labelAr: string;
  labelEn: string;
  options: { labelAr: string; labelEn: string; value: string }[];
  helperAr?: string;
  helperEn?: string;
  error?: string;
  isRequired?: boolean;
  currentLanguage?: "ar" | "en";
}

export const SovereignSelect: React.FC<SelectProps> = ({
  labelAr,
  labelEn,
  options,
  helperAr,
  helperEn,
  error,
  isRequired = false,
  currentLanguage = "ar",
  className = "",
  id,
  ...props
}) => {
  const labelText = currentLanguage === "ar" ? labelAr : labelEn;
  const helperText = currentLanguage === "ar" ? helperAr : helperEn;

  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs md:text-[13px] font-bold text-sudan-dark flex items-center gap-1">
          <span>{labelText}</span>
          {isRequired && <span className="text-rose-500 font-extrabold">*</span>}
        </label>
        {error && (
          <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </span>
        )}
      </div>

      <select
        id={id}
        className={`w-full text-xs p-3.5 rounded-2xl border bg-white text-sudan-dark outline-none transition-all appearance-none ${
          error 
            ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" 
            : "border-gray-200 focus:border-sudan-green focus:ring-1 focus:ring-sudan-green"
        } disabled:bg-gray-50 disabled:text-gray-400`}
        {...props}
      >
        <option value="" disabled>{currentLanguage === "ar" ? "-- اختر الخيار --" : "-- Select option --"}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {currentLanguage === "ar" ? opt.labelAr : opt.labelEn}
          </option>
        ))}
      </select>

      {helperText && !error && (
        <p className="text-[10px] text-gray-400 leading-normal">
          {helperText}
        </p>
      )}
    </div>
  );
};

// ==========================================
// 3. FILE UPLOADER (DRAG & DROP)
// ==========================================

interface FileUploadProps {
  labelAr: string;
  labelEn: string;
  allowedTypes?: string;
  currentLanguage?: "ar" | "en";
  onFileSelect?: (file: File) => void;
  className?: string;
}

export const SovereignFileUpload: React.FC<FileUploadProps> = ({
  labelAr,
  labelEn,
  allowedTypes = ".pdf,.docx,.jpg,.png",
  currentLanguage = "ar",
  onFileSelect,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      <label className="text-xs md:text-[13px] font-bold text-sudan-dark">
        {currentLanguage === "ar" ? labelAr : labelEn}
      </label>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center transition-all ${
          dragActive 
            ? "border-sudan-green bg-emerald-50/20" 
            : selectedFile 
            ? "border-emerald-300 bg-emerald-50/10" 
            : "border-gray-200 bg-white hover:border-sudan-green/50"
        }`}
      >
        <input
          type="file"
          accept={allowedTypes}
          onChange={handleFileChange}
          className="hidden"
          id="gov-file-upload-input"
        />

        <UploadCloud className={`h-10 w-10 mb-2 transition-colors ${selectedFile ? "text-sudan-green" : "text-gray-400"}`} />
        
        <label htmlFor="gov-file-upload-input" className="text-xs font-bold text-sudan-green hover:underline cursor-pointer">
          {currentLanguage === "ar" ? "اضغط لرفع الملف أو اسحبه هنا" : "Click to upload or drag & drop here"}
        </label>
        
        <p className="text-[10px] text-gray-400 mt-1">
          {currentLanguage === "ar" ? `الملفات المسموحة: ${allowedTypes}` : `Allowed file extensions: ${allowedTypes}`}
        </p>

        {selectedFile && (
          <div className="mt-4 bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between w-full max-w-xs shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden text-[11px]">
              <FileText className="h-4.5 w-4.5 text-sudan-green shrink-0" />
              <div className="truncate text-left font-mono">
                <p className="font-bold text-sudan-dark truncate">{selectedFile.name}</p>
                <p className="text-[9px] text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-rose-500 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. DIGITAL SIGNATURE PAD SIMULATOR
// ==========================================

export const SovereignSignaturePad: React.FC<{ currentLanguage?: "ar" | "en" }> = ({
  currentLanguage = "ar"
}) => {
  const [signedName, setSignedName] = useState("");
  const [isSigned, setIsSigned] = useState(false);

  return (
    <div className="border border-gray-200 rounded-3xl p-5 bg-white space-y-3 font-sans">
      <div className="flex justify-between items-center">
        <label className="text-xs md:text-[13px] font-bold text-sudan-dark">
          {currentLanguage === "ar" ? "بوابة التوقيع الرقمي المؤمن الموحد" : "Unified Secure Digital Signature"}
        </label>
        {isSigned && (
          <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
            {currentLanguage === "ar" ? "موقّع إلكترونياً" : "Signed & Secured"}
          </span>
        )}
      </div>

      <div className="border border-gray-100 rounded-2xl h-24 bg-slate-50 flex items-center justify-center relative overflow-hidden">
        {isSigned ? (
          <p className="font-sans italic text-lg font-black text-sudan-green transform -rotate-2 select-none tracking-wider">
            {signedName}
          </p>
        ) : (
          <p className="text-[11px] text-gray-400">
            {currentLanguage === "ar" ? "توقيعك الإلكتروني سيظهر هنا" : "Your electronic signature will be generated here"}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={signedName}
          onChange={(e) => {
            setSignedName(e.target.value);
            setIsSigned(false);
          }}
          placeholder={currentLanguage === "ar" ? "اكتب اسمك الكامل للمصادقة..." : "Type full name for digital signature..."}
          className="flex-1 text-xs p-3 border border-gray-200 rounded-xl outline-none focus:border-sudan-green"
        />
        <SovereignButton
          variant={isSigned ? "outline" : "secondary"}
          size="sm"
          disabled={!signedName.trim()}
          onClick={() => setIsSigned(!isSigned)}
          className="rounded-xl font-bold text-xs"
        >
          {isSigned 
            ? (currentLanguage === "ar" ? "تعديل" : "Edit") 
            : (currentLanguage === "ar" ? "اعتماد" : "Sign")}
        </SovereignButton>
      </div>
    </div>
  );
};
