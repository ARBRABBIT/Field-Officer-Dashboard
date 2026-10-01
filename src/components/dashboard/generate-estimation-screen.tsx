"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  DollarSign,
  FileCheck,
  FileText,
  LandPlot,
  MapPin,
  Receipt,
  Send,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { ServiceRecord } from "./assigned-services-screen";

export interface GenerateEstimationScreenProps {
  record: ServiceRecord;
  onBack: () => void;
  onSuccess?: () => void;
}

function GLCLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* 4-quadrant GLC geometric brand mark */}
      <div className="relative size-10 grid grid-cols-2 gap-0.5 p-1 rounded-lg bg-surface border border-border/40 shadow-low">
        <span className="rounded-xs bg-[#bdd327]" />
        <span className="rounded-xs bg-success" />
        <span className="rounded-xs bg-accent" />
        <span className="rounded-xs bg-accent-hover" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight text-text leading-tight">
          GREEN LAND CAPITAL
        </span>
        <span className="text-[10px] font-medium text-text-muted tracking-wide">
          Save for Next
        </span>
      </div>
    </div>
  );
}

export interface CostField {
  id: string;
  label: string;
  placeholder?: string;
  amount: number | string;
}

export interface ServiceEstimationState {
  landSize: string;
  estimatedFeet?: string;
  perFeetRate?: string;
  wireLength?: string;
  wireRate?: string;
  description: string;
  fields: CostField[];
}

const defaultBorewellFields: CostField[] = [
  { id: "labour", label: "Labour Charges", amount: 15000 },
  { id: "inspection", label: "Inspection Charges", amount: 5000 },
  { id: "estimatedFeets", label: "Estimated Feets", amount: 45000 },
  { id: "borewell", label: "Borewell Charges", amount: 20000 },
  { id: "pump", label: "Pump Charges", amount: 35000 },
  { id: "electric", label: "Electric Charges", amount: 12000 },
  { id: "tax", label: "Tax (GST)", amount: 8000 },
  { id: "glcFee", label: "GLC Fee", amount: 5000 },
];

const defaultFencingFields: CostField[] = [
  { id: "labour", label: "Labour Charges", amount: 25000 },
  { id: "inspection", label: "Inspection Charges", amount: 5000 },
  { id: "wireLength", label: "Wire Length", amount: 60000 },
  { id: "materials", label: "Material & Mesh Charges", amount: 50000 },
  { id: "poles", label: "Pole Erection Charges", amount: 45000 },
  { id: "gate", label: "Gate Installation Charges", amount: 15000 },
  { id: "tax", label: "Tax (GST)", amount: 7000 },
  { id: "glcFee", label: "GLC Fee", amount: 3000 },
];

const defaultFarmhouseFields: CostField[] = [
  { id: "labour", label: "Labour Charges", amount: 80000 },
  { id: "inspection", label: "Inspection & Architecture", amount: 20000 },
  { id: "civil", label: "Civil & Foundation Charges", amount: 190000 },
  { id: "plumbingElectrical", label: "Plumbing & Electrical", amount: 90000 },
  { id: "finishing", label: "Finishing & Painting", amount: 40000 },
  { id: "tax", label: "Tax (GST)", amount: 20000 },
  { id: "glcFee", label: "GLC Fee", amount: 10000 },
];

const defaultOrganicFarmingFields: CostField[] = [
  { id: "soilPrep", label: "Soil Testing & Land Preparation", amount: 15000 },
  { id: "manureCompost", label: "Organic Manure & Bio-Fertilizers", amount: 20000 },
  { id: "farmerFees", label: "Farmer Fees", amount: 18000 },
  { id: "dripIrrigation", label: "Drip Irrigation Setup", amount: 25000 },
  { id: "saplingsSeeds", label: "Saplings & High-Yield Seed Supply", amount: 12000 },
  { id: "bioPestControl", label: "Bio-Pest Control & Mulching", amount: 8000 },
  { id: "tax", label: "Tax (GST)", amount: 3000 },
  { id: "glcFee", label: "GLC Fee", amount: 2000 },
];

function formatINR(val: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(val);
}

export function GenerateEstimationScreen({
  record,
  onBack,
  onSuccess,
}: GenerateEstimationScreenProps) {
  const [activeNav, setActiveNav] = React.useState<"services" | "site-visits">("services");
  const [isNavDropdownOpen, setIsNavDropdownOpen] = React.useState(false);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsNavDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsNavDropdownOpen(false);
    }, 180);
  };

  // Available service categories
  const availableServices = React.useMemo(() => {
    if (record.services && record.services.length > 0) {
      const names = record.services.map((s) => s.serviceName);
      if (!names.some((n) => n.toLowerCase().includes("organic"))) {
        names.push("Organic Farming");
      }
      return names;
    }
    return ["Borewell", "Fencing", "Farmhouse Construction", "Organic Farming"];
  }, [record]);

  const [activeServiceIdx, setActiveServiceIdx] = React.useState(0);
  const activeServiceName = availableServices[activeServiceIdx] || availableServices[0] || "Borewell";
  const [confirmedServices, setConfirmedServices] = React.useState<Set<string>>(new Set());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // State map by service name
  const [estimations, setEstimations] = React.useState<Record<string, ServiceEstimationState>>({
    Borewell: {
      landSize: record.land || "5.0 Acres",
      estimatedFeet: "450 Feet",
      perFeetRate: "₹100 / Foot",
      description: "Includes complete drilling up to 450ft, casing pipe installation, submersible pump fitting, electrical line setup, and water yield testing.",
      fields: defaultBorewellFields,
    },
    Fencing: {
      landSize: record.land || "5.0 Acres",
      wireLength: "1,200 Meters",
      wireRate: "₹50 / Meter",
      description: "Includes perimeter boundary marking, heavy-duty stone pole erection at 8ft intervals, 12-gauge barbed wire fixing, and main gate installation.",
      fields: defaultFencingFields,
    },
    "Farmhouse Construction": {
      landSize: record.land || "5.0 Acres",
      description: "Includes site clearing, 2-BHK structure foundation, brickwork, roofing, electrical and sanitary plumbing, tile flooring, and exterior finishing.",
      fields: defaultFarmhouseFields,
    },
    "Organic Farming": {
      landSize: record.land || "5.0 Acres",
      description: "Includes soil pH & nutrient testing, organic composting, micro-drip irrigation installation, certified non-GMO seed/sapling plantation, and biological pest control setup.",
      fields: defaultOrganicFarmingFields,
    },
  });

  // Get active service estimation
  const currentEst = estimations[activeServiceName] || {
    landSize: record.land || "5.0 Acres",
    estimatedFeet: "450 Feet",
    perFeetRate: "₹100 / Foot",
    wireLength: "1,200 Meters",
    wireRate: "₹50 / Meter",
    description: "",
    fields: defaultBorewellFields,
  };

  // Update a single cost field value
  const handleCostFieldChange = (fieldId: string, rawVal: string) => {
    // Strip non-digits except dot
    const cleanVal = rawVal.replace(/[^0-9]/g, "");
    const numericVal = cleanVal ? parseInt(cleanVal, 10) : "";

    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: record.land || "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === fieldId) {
          return { ...f, amount: numericVal };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          fields: updatedFields,
        },
      };
    });
  };

  // Helper to calculate feet * rate
  const calcBorewellFeetCharge = (feetStr: string, rateStr: string) => {
    const feetNum = parseInt(feetStr.replace(/[^0-9]/g, "") || "0", 10);
    const rateNum = parseInt(rateStr.replace(/[^0-9]/g, "") || "0", 10);
    return feetNum * rateNum;
  };

  // Helper to calculate wire length * rate
  const calcFencingWireCharge = (lengthStr: string, rateStr: string) => {
    const lengthNum = parseInt(lengthStr.replace(/[^0-9]/g, "") || "0", 10);
    const rateNum = parseInt(rateStr.replace(/[^0-9]/g, "") || "0", 10);
    return lengthNum * rateNum;
  };

  // Update land size
  const handleLandSizeChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };
      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          landSize: val,
        },
      };
    });
  };

  // Update estimated feet for borewell and auto-calculate charge
  const handleEstimatedFeetChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };

      const newFeeCharge = calcBorewellFeetCharge(
        val,
        currentServiceEst.perFeetRate || "100"
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "estimatedFeets") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          estimatedFeet: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update per feet rate for borewell and auto-calculate charge
  const handlePerFeetRateChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };

      const newFeeCharge = calcBorewellFeetCharge(
        currentServiceEst.estimatedFeet || "450",
        val
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "estimatedFeets") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          perFeetRate: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update wire length for fencing and auto-calculate charge
  const handleWireLengthChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultFencingFields,
      };

      const newFeeCharge = calcFencingWireCharge(
        val,
        currentServiceEst.wireRate || "50"
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "wireLength") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          wireLength: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update wire rate for fencing and auto-calculate charge
  const handleWireRateChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultFencingFields,
      };

      const newFeeCharge = calcFencingWireCharge(
        currentServiceEst.wireLength || "1200",
        val
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "wireLength") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          wireRate: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update description
  const handleDescriptionChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        description: "",
        fields: defaultBorewellFields,
      };
      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          description: val,
        },
      };
    });
  };

  // Automatically calculate total cost by summing all fields
  const calculatedTotal = React.useMemo(() => {
    return currentEst.fields.reduce((sum, item) => {
      const num = typeof item.amount === "number" ? item.amount : parseInt(String(item.amount).replace(/,/g, "") || "0", 10) || 0;
      return sum + num;
    }, 0);
  }, [currentEst.fields]);

  const rawId = record.farmlandId ? record.farmlandId.replace(/\D/g, "") || "01" : "01";
  const displayId = `ID ${rawId}`;

  const handleDispatch = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDispatch = () => {
    setConfirmedServices((prev) => {
      const next = new Set(prev);
      next.add(activeServiceName);
      return next;
    });
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-10 flex flex-col items-center animate-in fade-in duration-200">
      <div className="w-full max-w-[1360px] flex flex-col gap-8">
        
        {/* TOP NAVIGATION BAR */}
        <header className="w-full flex items-center justify-between gap-4">
          {/* Logo */}
          <GLCLogo />

          {/* Navigation Items (Pill Bar) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <Sprout className="size-4" />
              </span>
              <span>Farmlands</span>
            </button>

            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <FileText className="size-4" />
              </span>
              <span>Drafts</span>
            </button>

            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <ClipboardList className="size-4" />
              </span>
              <span>Request info</span>
            </button>

            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <LandPlot className="size-4" />
              </span>
              <span>Assigned Farmlands</span>
            </button>

            {/* Merged Navigation Pill with Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                aria-expanded={isNavDropdownOpen}
                aria-haspopup="menu"
                onClick={() => setIsNavDropdownOpen((prev) => !prev)}
                className={`glc-focus inline-flex h-14 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === "services" || activeNav === "site-visits"
                    ? "bg-[#1C5F9D] text-text-inverse shadow-medium"
                    : "bg-surface text-text hover:bg-surface-hover shadow-low"
                }`}
              >
                <span className="grid size-9 place-items-center rounded-full bg-surface text-[#1C5F9D]">
                  {activeNav === "site-visits" ? (
                    <MapPin className="size-4" />
                  ) : (
                    <FileCheck className="size-4" />
                  )}
                </span>
                <span className="font-semibold text-sm">Assigned services</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    isNavDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Hover Dropdown Menu */}
              {isNavDropdownOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="w-64 rounded-2xl border border-border bg-surface p-2 shadow-high">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setActiveNav("services");
                        setIsNavDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer ${
                        activeNav === "services"
                          ? "bg-accent text-text-inverse font-semibold shadow-low"
                          : "hover:bg-surface-hover text-text hover:text-accent"
                      }`}
                    >
                      <div
                        className={`grid size-7 place-items-center rounded-lg ${
                          activeNav === "services"
                            ? "bg-white/20 text-white"
                            : "bg-surface-muted text-text-secondary"
                        }`}
                      >
                        <FileCheck className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Maintenance services</p>
                        <p
                          className={`text-[10px] ${
                            activeNav === "services" ? "text-white/80" : "text-text-muted"
                          }`}
                        >
                          Maintenance and field tasks
                        </p>
                      </div>
                      {activeNav === "services" && (
                        <span className="size-2 rounded-full bg-white shrink-0" />
                      )}
                    </button>

                    <Link
                      href="/site-visits"
                      role="menuitem"
                      onClick={() => setIsNavDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer mt-1 hover:bg-surface-hover text-text hover:text-accent"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-surface-muted text-text-secondary">
                        <MapPin className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Site visits</p>
                        <p className="text-[10px] text-text-muted">
                          Field inspection logs
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right utility buttons: Notifications & Avatar */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              aria-label="Notifications"
              className="glc-focus relative grid size-13 place-items-center rounded-full bg-surface border border-border/60 shadow-low hover:bg-surface-hover transition-colors"
            >
              <Bell className="size-6 text-text" />
              <span
                className="absolute top-3.5 right-3.5 size-2 rounded-full bg-danger"
                aria-hidden="true"
              />
            </button>

            <Avatar
              size="lg"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Officer profile"
              fallback="FO"
              className="border-2 border-surface shadow-low"
            />
          </div>
        </header>

        {/* MAIN CONTENT SECTION */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* BREADCRUMB NAVIGATION */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-text-muted">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              Field officer Dashboard
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              Assigned Services
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              Assigned
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              {record.customer}
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <span className="font-semibold text-text" aria-current="page">
              Generate Estimation
            </span>
          </nav>

          {/* PAGE HEADER: Back Button & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to active service request"
              className="glc-focus grid size-10 place-items-center rounded-full bg-surface text-text border border-border/50 shadow-xs hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-5 text-text" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Generate Official Estimation – {displayId}
            </h1>
          </div>

          {/* 3-Column Summary Strip */}
          <div className="w-full rounded-2xl bg-surface border border-border/60 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2 shadow-xs">
            {/* 1. Owner Name */}
            <div className="sm:pr-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                OWNER NAME
              </p>
              <p className="text-base font-bold text-text mt-0.5">
                {record.customer}
              </p>
            </div>

            {/* 2. Service Category */}
            <div className="sm:border-l sm:border-[#E2E8F0] sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                SERVICE CATEGORY
              </p>
              <p className="text-base font-bold text-text mt-0.5">
                {activeServiceName} {availableServices.length > 1 ? `+${availableServices.length - 1} Others` : ""}
              </p>
            </div>

            {/* 3. Site Location */}
            <div className="sm:border-l sm:border-[#E2E8F0] sm:pl-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                SITE LOCATION
              </p>
              <p className="text-base font-bold text-[#16A34A] mt-0.5 flex items-center gap-1.5">
                <MapPin className="size-4 text-[#16A34A] shrink-0" />
                <span>{record.location || "Hyderabad"}</span>
              </p>
            </div>
          </div>

          {/* Service Selection Switcher Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {availableServices.map((srvName, idx) => {
              const isActive = activeServiceIdx === idx;
              const isConfirmed = confirmedServices.has(srvName);
              return (
                <button
                  key={srvName}
                  type="button"
                  onClick={() => setActiveServiceIdx(idx)}
                  className={`glc-focus rounded-full px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? "bg-[#1C5F9D] text-white shadow-xs"
                      : "bg-[#F1F3F5] text-text hover:bg-[#E2E6EA]"
                  }`}
                >
                  {isConfirmed ? (
                    <span className="size-5 rounded-full bg-[#86EFAC] text-[#15803D] flex items-center justify-center text-xs font-bold shrink-0 animate-in zoom-in-75 duration-200 shadow-2xs">
                      ✓
                    </span>
                  ) : (
                    <span className="size-5 rounded-full bg-[#FFA8A8] text-[#B91C1C] flex items-center justify-center text-xs font-extrabold shrink-0 shadow-2xs">
                      !
                    </span>
                  )}
                  <span>{srvName}</span>
                </button>
              );
            })}
          </div>

          {/* ESTIMATION FORM WITH DETAILED ITEMIZED COST BREAKDOWN */}
          <div className="flex flex-col gap-6 pt-1">
            
            {/* Header with Title & Live Calculated Total Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#F0F7FD] to-[#E9F4FE] border border-[#B8D8F4] p-5 rounded-2xl">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-text">
                  Itemized Cost Breakdown for {activeServiceName}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Enter component charges below. Total cost calculates automatically in real-time.
                </p>
              </div>

              {/* Live Calculated Total Display */}
              <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-[#B8D8F4] shadow-xs shrink-0">
                <div className="grid size-8 place-items-center rounded-lg bg-[#1C5F9D]/10 text-[#1C5F9D]">
                  <Calculator className="size-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Total Estimated Cost
                  </p>
                  <p className="text-lg sm:text-xl font-extrabold text-[#1C5F9D] leading-tight">
                    ₹{formatINR(calculatedTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Row: Land Size & Service Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="w-full">
                <label className="block text-xs font-semibold text-text-muted mb-2">
                  Enter Land Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5.0 Acres"
                  value={currentEst.landSize}
                  onChange={(e) => handleLandSizeChange(e.target.value)}
                  className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                />
              </div>

              {activeServiceName === "Borewell" && (
                <>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Estimated Feets
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 450 Feet"
                      value={currentEst.estimatedFeet || "450 Feet"}
                      onChange={(e) => handleEstimatedFeetChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Per Feet Rate
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹100 / Foot"
                      value={currentEst.perFeetRate || "₹100 / Foot"}
                      onChange={(e) => handlePerFeetRateChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>
                </>
              )}

              {activeServiceName === "Fencing" && (
                <>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Wire Length
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,200 Meters"
                      value={currentEst.wireLength || "1,200 Meters"}
                      onChange={(e) => handleWireLengthChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Wire Rate
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹50 / Meter"
                      value={currentEst.wireRate || "₹50 / Meter"}
                      onChange={(e) => handleWireRateChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>
                </>
              )}
            </div>

            {/* DETAILED ITEMIZED CHARGES GRID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                Cost Breakdown Items ({currentEst.fields.length} components)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {currentEst.fields.map((field) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-2xl bg-surface border border-border/70 shadow-xs flex flex-col justify-between gap-2.5 hover:border-border-strong transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-text">
                          {field.label}
                        </span>
                        {field.id === "estimatedFeets" && activeServiceName === "Borewell" && (
                          <span className="text-[11px] text-text-muted font-medium">
                            ({currentEst.estimatedFeet?.replace(/[^0-9]/g, "") || "450"} ft × ₹{currentEst.perFeetRate?.replace(/[^0-9]/g, "") || "100"})
                          </span>
                        )}
                        {field.id === "wireLength" && activeServiceName === "Fencing" && (
                          <span className="text-[11px] text-text-muted font-medium">
                            ({currentEst.wireLength?.replace(/[^0-9]/g, "") || "1200"} m × ₹{currentEst.wireRate?.replace(/[^0-9]/g, "") || "50"})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted shrink-0">
                        INR
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-sm font-bold text-text-muted pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={field.amount !== "" ? formatINR(typeof field.amount === "number" ? field.amount : parseInt(String(field.amount), 10) || 0) : ""}
                        placeholder="0"
                        onChange={(e) => handleCostFieldChange(field.id, e.target.value)}
                        className="glc-focus w-full h-11 pl-7 pr-3.5 rounded-xl bg-[#F8FAFC] border border-border/50 text-sm font-bold text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Width Field: Service Description */}
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2">
                Enter Service Scope & Notes
              </label>
              <textarea
                rows={4}
                placeholder="Describe the scope of work, parts required, and labor details..."
                value={currentEst.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full rounded-2xl bg-surface border border-border/70 p-4 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none leading-relaxed shadow-xs"
              />
            </div>

            {/* Summary & Final Auto-Calculated Total Card */}
            <div className="w-full rounded-2xl bg-[#F8FAFC] border border-border/70 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                  <Receipt className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">
                    Calculated Summary for {activeServiceName}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {activeServiceName === "Borewell"
                      ? "Sum of Labour, Inspection, Estimated Feets, Borewell, Pump, Electric, Tax & GLC Fees"
                      : activeServiceName === "Fencing"
                      ? "Sum of Labour, Inspection, Wire Length, Materials, Poles, Gate, Tax & GLC Fees"
                      : activeServiceName === "Organic Farming"
                      ? "Sum of Soil Testing, Manure, Farmer Fees, Drip Irrigation, Seeds, Pest Control, Tax & GLC Fees"
                      : "Sum of all itemized charges, taxes and official GLC fees"}
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Final Estimation Amount
                </p>
                <p className="text-2xl font-extrabold text-[#1C5F9D]">
                  ₹{formatINR(calculatedTotal)}
                </p>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#EAEFF4] mt-2">
              <button
                type="button"
                onClick={handleDispatch}
                style={{ fontWeight: 600 }}
                className="glc-focus h-12 px-8 rounded-full bg-[#96C9ED] hover:bg-[#7FBDE9] active:scale-[0.99] text-black font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="font-semibold" style={{ fontWeight: 600 }}>Dispatch Estimations</span>
                <span className="font-semibold" style={{ fontWeight: 600 }}>(₹{formatINR(calculatedTotal)})</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-surface rounded-[28px] border border-border shadow-high p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-[#96C9ED]/20 text-[#1C5F9D] grid place-items-center shrink-0">
                  <Send className="size-6 text-[#1C5F9D]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-text">
                    Confirm Dispatch Estimation
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Official quote notification will be sent to the customer.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                aria-label="Close modal"
                className="size-8 rounded-full grid place-items-center text-text-muted hover:text-text hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Estimation Summary Box */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-border/70 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Customer</span>
                <span className="font-bold text-text">{record.customer}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Farmland ID</span>
                <span className="font-bold text-text">{displayId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Service</span>
                <span className="font-bold text-text">{activeServiceName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Land Size</span>
                <span className="font-bold text-text">{currentEst.landSize || record.land || "5.0 Acres"}</span>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Total Quote Amount
                </span>
                <span className="text-xl font-extrabold text-[#1C5F9D]">
                  ₹{formatINR(calculatedTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="glc-focus h-12 px-6 rounded-full border border-border/80 bg-surface hover:bg-surface-hover text-text font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                style={{ fontWeight: 600 }}
                className="glc-focus h-12 px-7 rounded-full bg-[#96C9ED] hover:bg-[#7FBDE9] active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>Confirm & Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-surface rounded-[28px] border border-border shadow-high p-6 sm:p-8 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="size-16 rounded-full bg-[#E5F6E6] text-[#00801F] grid place-items-center shrink-0">
              <CheckCircle2 className="size-8 text-[#00801F]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-text">
                Estimation Dispatched!
              </h3>
              <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                Official quotation of <span className="font-bold text-text">₹{formatINR(calculatedTotal)}</span> for <span className="font-bold text-text">{activeServiceName}</span> has been confirmed and dispatched to <span className="font-bold text-text">{record.customer}</span>.
              </p>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#EAEFF4] hover:bg-[#DEE5EC] text-text font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Continue Estimating
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  if (onSuccess) onSuccess();
                  else onBack();
                }}
                className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#1C5F9D] hover:bg-[#164E83] text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
