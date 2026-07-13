/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Sparkles, Loader2, Check, AlertTriangle, X } from "lucide-react";

// ==========================================
// 1. TYPOGRAPHY COMPONENT
// ==========================================

export type TypographyVariant =
  | "display-xxl"
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle-xl"
  | "subtitle-lg"
  | "subtitle-md"
  | "subtitle-sm"
  | "body-xl"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "caption-lg"
  | "caption-sm"
  | "label-lg"
  | "label-md"
  | "label-sm";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  isDarkMode?: boolean;
}

export const SovereignTypography: React.FC<TypographyProps> = ({
  variant = "body-md",
  as,
  isDarkMode = false,
  className = "",
  children,
  ...props
}) => {
  const Component = as || getComponentTag(variant);

  const baseStyles = "font-sans leading-relaxed transition-colors duration-200";
  
  const variantStyles: Record<TypographyVariant, string> = {
    "display-xxl": "text-4xl md:text-[3.50rem] font-black tracking-tight leading-none",
    "display-xl": "text-3xl md:text-[2.50rem] font-black tracking-tight leading-tight",
    "display-lg": "text-2xl md:text-[2.00rem] font-bold tracking-tight leading-tight",
    "display-md": "text-xl md:text-[1.75rem] font-bold tracking-tight leading-snug",
    "display-sm": "text-lg md:text-[1.50rem] font-bold tracking-normal leading-snug",
    "h1": "text-xl md:text-[1.75rem] font-bold tracking-tight leading-snug",
    "h2": "text-lg md:text-[1.50rem] font-bold tracking-normal leading-snug",
    "h3": "text-base md:text-[1.25rem] font-bold leading-normal",
    "h4": "text-sm md:text-[1.125rem] font-bold leading-normal",
    "h5": "text-xs md:text-[1.00rem] font-medium leading-normal",
    "h6": "text-[11px] md:text-[0.875rem] font-medium tracking-wide leading-normal",
    "subtitle-xl": "text-base md:text-[1.25rem] font-medium text-sudan-gold leading-normal",
    "subtitle-lg": "text-sm md:text-[1.125rem] font-medium leading-relaxed",
    "subtitle-md": "text-xs md:text-[1.00rem] font-medium leading-relaxed",
    "subtitle-sm": "text-[11px] md:text-[0.875rem] font-medium leading-relaxed",
    "body-xl": "text-sm md:text-[1.125rem] font-normal leading-relaxed",
    "body-lg": "text-xs md:text-[1.00rem] font-normal leading-relaxed",
    "body-md": "text-[13px] md:text-[0.875rem] font-normal leading-relaxed",
    "body-sm": "text-[12px] md:text-[0.8125rem] font-normal leading-relaxed",
    "caption-lg": "text-[11px] md:text-[0.75rem] font-normal tracking-wide text-gray-400",
    "caption-sm": "text-[10px] md:text-[0.6875rem] font-normal tracking-wider text-gray-400 uppercase",
    "label-lg": "text-xs md:text-[0.875rem] font-bold tracking-wide leading-normal",
    "label-md": "text-[11px] md:text-[0.80rem] font-medium tracking-wide leading-normal",
    "label-sm": "text-[10px] md:text-[0.75rem] font-normal tracking-wide leading-normal"
  };

  const themeStyles = isDarkMode 
    ? "text-slate-100" 
    : "text-sudan-dark";

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${themeStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

function getComponentTag(variant: string): React.ElementType {
  if (variant.startsWith("display")) return "h1";
  if (variant === "h1") return "h1";
  if (variant === "h2") return "h2";
  if (variant === "h3") return "h3";
  if (variant === "h4") return "h4";
  if (variant === "h5") return "h5";
  if (variant === "h6") return "h6";
  if (variant.startsWith("subtitle")) return "p";
  if (variant.startsWith("body")) return "p";
  if (variant.startsWith("caption")) return "span";
  if (variant.startsWith("label")) return "label";
  return "p";
}

// ==========================================
// 2. BUTTON COMPONENT
// ==========================================

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "warning"
  | "danger"
  | "ai-action";

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
}

export const SovereignButton: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  isFullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-[11px] md:text-xs",
    md: "px-4.5 py-2.5 text-xs md:text-xs font-bold shadow-sm",
    lg: "px-6 py-3.5 text-sm md:text-base font-extrabold shadow-md"
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-sudan-green hover:bg-sudan-green-light text-white focus:ring-sudan-green-light",
    secondary: "bg-sudan-gold hover:bg-sudan-gold-light text-white focus:ring-sudan-gold-light",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-sudan-dark focus:ring-gray-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-sudan-dark focus:ring-gray-100",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500",
    warning: "bg-amber-500 hover:bg-amber-400 text-white focus:ring-amber-400",
    danger: "bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500",
    "ai-action": "bg-gradient-to-r from-sudan-gold via-sudan-green to-sudan-gold-light text-white focus:ring-sudan-gold animate-shimmer bg-[length:200%_auto] hover:bg-right"
  };

  const widthStyle = isFullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0 ltr:mr-2 rtl:ml-2" />
      ) : leftIcon ? (
        <span className="shrink-0 ltr:mr-1.5 rtl:ml-1.5">{leftIcon}</span>
      ) : null}
      
      {variant === "ai-action" && !isLoading && (
        <Sparkles className="h-3.5 w-3.5 shrink-0 ltr:mr-1.5 rtl:ml-1.5 text-yellow-300" />
      )}

      <span>{children}</span>

      {!isLoading && rightIcon ? (
        <span className="shrink-0 ltr:ml-1.5 rtl:mr-1.5">{rightIcon}</span>
      ) : null}
    </button>
  );
};

// ==========================================
// 3. BADGE COMPONENT
// ==========================================

export type BadgeVariant =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "archived"
  | "active"
  | "inactive"
  | "ai-generated";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  currentLanguage?: "ar" | "en";
}

export const SovereignBadge: React.FC<BadgeProps> = ({
  variant = "pending",
  currentLanguage = "ar",
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-wide uppercase transition-all duration-200";

  const variantStyles: Record<BadgeVariant, string> = {
    draft: "bg-gray-100 text-gray-600 border border-gray-200/50",
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
    approved: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    rejected: "bg-rose-50 text-rose-600 border border-rose-200",
    completed: "bg-teal-50 text-teal-600 border border-teal-200",
    archived: "bg-indigo-50 text-indigo-600 border border-indigo-200",
    active: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    inactive: "bg-gray-200 text-gray-500 border border-gray-300",
    "ai-generated": "bg-gradient-to-r from-sudan-gold/10 to-sudan-green/10 text-sudan-green border border-sudan-gold/30"
  };

  const labelsAr: Record<BadgeVariant, string> = {
    draft: "مسودة",
    pending: "تحت المراجعة",
    approved: "معتمد رسمي",
    rejected: "مرفوض",
    completed: "مكتمل",
    archived: "مؤرشف",
    active: "نشط",
    inactive: "غير نشط",
    "ai-generated": "مستنتج بالذكاء الاصطناعي"
  };

  const labelsEn: Record<BadgeVariant, string> = {
    draft: "Draft",
    pending: "Pending Audit",
    approved: "Sovereign Approved",
    rejected: "Rejected",
    completed: "Completed",
    archived: "Archived",
    active: "Active",
    inactive: "Inactive",
    "ai-generated": "AI Augmented"
  };

  const text = currentLanguage === "ar" ? labelsAr[variant] : labelsEn[variant];

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {variant === "approved" || variant === "completed" || variant === "active" ? (
        <Check className="h-3 w-3 shrink-0" />
      ) : variant === "pending" ? (
        <AlertTriangle className="h-3 w-3 shrink-0" />
      ) : variant === "rejected" ? (
        <X className="h-3 w-3 shrink-0" />
      ) : variant === "ai-generated" ? (
        <Sparkles className="h-3 w-3 shrink-0 text-sudan-gold" />
      ) : null}
      <span>{text}</span>
    </span>
  );
};

// ==========================================
// 4. AVATAR COMPONENT
// ==========================================

export type AvatarRole = "user" | "employee" | "company" | "investor" | "ministry";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  roleType?: AvatarRole;
  name?: string;
  size?: "sm" | "md" | "lg";
}

export const SovereignAvatar: React.FC<AvatarProps> = ({
  roleType = "user",
  name = "S",
  size = "md",
  className = "",
  ...props
}) => {
  const sizeStyles = {
    sm: "h-8 w-8 text-[11px] rounded-lg",
    md: "h-11 w-11 text-xs rounded-xl",
    lg: "h-16 w-16 text-lg rounded-2xl"
  };

  const roleColors: Record<AvatarRole, string> = {
    user: "bg-gray-100 text-gray-700 border border-gray-200",
    employee: "bg-sudan-slate text-white border border-slate-700",
    company: "bg-[#007A33]/10 text-sudan-green border border-sudan-green/20",
    investor: "bg-sudan-gold/10 text-sudan-gold border border-sudan-gold/20",
    ministry: "bg-sudan-green text-white border border-sudan-green-light"
  };

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center font-sans font-bold shadow-sm shrink-0 transition-transform hover:scale-105 duration-200 ${sizeStyles[size]} ${roleColors[roleType]} ${className}`}
      {...props}
    >
      {initial}
    </div>
  );
};

// ==========================================
// 5. DIVIDER COMPONENT
// ==========================================

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export const SovereignDivider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  label,
  className = "",
  ...props
}) => {
  if (orientation === "vertical") {
    return (
      <div 
        className={`inline-block h-full w-[1px] bg-gray-200/80 mx-2 self-stretch ${className}`} 
        {...props} 
      />
    );
  }

  return (
    <div className={`relative flex py-2 items-center w-full ${className}`} {...props}>
      <div className="flex-grow border-t border-gray-200/80"></div>
      {label && (
        <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-sans">
          {label}
        </span>
      )}
      {label && <div className="flex-grow border-t border-gray-200/80"></div>}
    </div>
  );
};

// ==========================================
// 6. LOADER COMPONENTS
// ==========================================

export const SovereignLoaderSpinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin text-sudan-green ${sizeClasses[size]} ${className}`} />
    </div>
  );
};

export const SovereignSkeleton: React.FC<{ className?: string; height?: string; width?: string }> = ({
  className = "",
  height = "h-4",
  width = "w-full"
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded-lg ${height} ${width} ${className}`} 
    />
  );
};
