/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApplicationStatus } from "../../types";

export interface TraderRecord {
  id: string;
  nti: string; // Unique National Trade Identifier
  companyName: string;
  category: "importer" | "exporter" | "broker" | "forwarder" | "logistics" | "warehouse" | "shipping_agent" | "ecommerce";
  ownerName: string;
  registrationNumber: string;
  status: "approved" | "pending" | "suspended";
  registeredAt: string;
}

export interface ShipmentRecord {
  id: string;
  trackingId: string;
  traderName: string;
  cargoDescription: string;
  weightNet: number;
  weightGross: number;
  status: "origin" | "processing" | "storage" | "customs" | "shipping" | "delivered";
  currentNodeAr: string;
  currentNodeEn: string;
  originAr: string;
  originEn: string;
  destinationAr: string;
  destinationEn: string;
  eta: string;
  transitDays: number;
  efficiencyScore: number;
  routeAr: string;
  routeEn: string;
}

export interface InspectionRecord {
  id: string;
  targetId: string;
  targetName: string;
  inspectorName: string;
  agency: string; // SSMO, Quarantine
  scheduledDate: string;
  status: "pending" | "passed" | "failed";
  comments?: string;
}

export interface DigitalSovereignCertificate {
  id: string;
  certificateNumber: string;
  category: "origin" | "export_approval" | "import_permit" | "compliance" | "invoice_verification" | "license_verification";
  titleAr: string;
  titleEn: string;
  issuedTo: string;
  detailsAr: string;
  detailsEn: string;
  signatureHash: string;
  verificationUrl: string;
  timestamp: string;
  auditTrail: {
    actionAr: string;
    actionEn: string;
    timestamp: string;
    actor: string;
  }[];
}

export interface HsCodeRecord {
  code: string;
  nameAr: string;
  nameEn: string;
  dutyRate: string;
  exportIncentive: string;
  restricted: boolean;
  requirementsAr: string[];
  requirementsEn: string[];
}
