"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileCheck,
  FileText,
  LandPlot,
  MapPin,
  Search,
  Sprout,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FileUpload,
} from "@/components/ui";

interface ServiceRecord {
  id: string;
  customer: string;
  lastUpdate: string;
  land: string;
  service: "BOREWELL" | "FENCING" | "FARMHOUSE" | "ORGANIC MANAGE...";
  farmlandId: string;
  location: string;
}

const records: ServiceRecord[] = [
  {
    id: "1",
    customer: "Suresh Reddy",
    lastUpdate: "Oct 24, 2026",
    land: "5.0 Acres",
    service: "BOREWELL",
    farmlandId: "GLCSOS 01",
    location: "Hyderabad",
  },
  {
    id: "2",
    customer: "Suresh Reddy",
    lastUpdate: "6th Oct - 12.53 PM",
    land: "5.0 Acres",
    service: "FENCING",
    farmlandId: "GLCSOS 01",
    location: "Amalapuram",
  },
  {
    id: "3",
    customer: "Suresh Yadav",
    lastUpdate: "6th Oct - 12.53 PM",
    land: "5.0 Acres",
    service: "FARMHOUSE",
    farmlandId: "GLCSOS 02",
    location: "Kakinada",
  },
  {
    id: "4",
    customer: "Suresh Yadav",
    lastUpdate: "6th Oct - 12.53 PM",
    land: "5.0 Acres",
    service: "ORGANIC MANAGE...",
    farmlandId: "GLCSOS 02",
    location: "Karimnagar",
  },
  {
    id: "5",
    customer: "Suresh Yadav",
    lastUpdate: "6th Oct - 12.53 PM",
    land: "5.0 Acres",
    service: "BOREWELL",
    farmlandId: "GLCSOS 03",
    location: "Vizag",
  },
  {
    id: "6",
    customer: "Suresh Yadav",
    lastUpdate: "6th Oct - 12.53 PM",
    land: "5.0 Acres",
    service: "FENCING",
    farmlandId: "GLCSOS 03",
    location: "Rajamundry",
  },
  {
    id: "7",
    customer: "Suresh Yadav",
    lastUpdate: "6th Oct - 12.53 PM",
    land: "5.0 Acres",
    service: "BOREWELL",
    farmlandId: "GLCSOS 03",
    location: "Warangal",
  },
];

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

export function AssignedServicesScreen() {
  const [activeTab, setActiveTab] = React.useState<"assigned" | "updates">("updates");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRecord, setSelectedRecord] = React.useState<ServiceRecord | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
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

  const filteredRecords = React.useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        r.customer.toLowerCase().includes(q) ||
        r.farmlandId.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const renderServiceBadge = (service: ServiceRecord["service"]) => {
    switch (service) {
      case "BOREWELL":
        return (
          <span className="inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#444932]">
            BOREWELL
          </span>
        );
      case "FENCING":
        return (
          <span className="inline-flex items-center rounded-full bg-warning-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#444932]">
            FENCING
          </span>
        );
      case "FARMHOUSE":
        return (
          <span className="inline-flex items-center rounded-full bg-success-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-black">
            FARMHOUSE
          </span>
        );
      case "ORGANIC MANAGE...":
        return (
          <span className="inline-flex items-center rounded-full bg-text-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-inverse">
            ORGANIC MANAGE...
          </span>
        );
      default:
        return <Badge variant="neutral">{service}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-10 flex flex-col items-center">
      {/* 1440px desktop container */}
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

            {/* Merged "+2" Navigation Pill with Hover Dropdown */}
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
                    {/* Option 1: Maintenance services */}
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

                    {/* Option 2: Site visits */}
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

        {/* SUBHEADER: Page Title & Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Page Title */}
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {activeNav === "services" ? "Maintenance Services" : "Site Visits"}
          </h1>

          {/* Search bar & Filter tabs */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-[360px] lg:w-[412px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by farmland, agent..."
                className="glc-focus h-12 w-full rounded-full border border-transparent bg-surface pl-12 pr-5 text-sm text-text placeholder:text-text-muted/70 shadow-low transition-colors hover:border-border-strong focus:border-accent focus:bg-surface"
              />
            </div>

            {/* Segmented Control / Tabs */}
            <div
              role="tablist"
              className="inline-flex h-12 items-center rounded-xl bg-surface-muted/90 p-1 border border-border/40 shadow-xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "assigned"}
                onClick={() => setActiveTab("assigned")}
                className={`glc-focus rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "assigned"
                    ? "bg-surface text-accent shadow-low"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Assigned
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "updates"}
                onClick={() => setActiveTab("updates")}
                className={`glc-focus inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "updates"
                    ? "bg-surface text-[#1C5F9D] shadow-low border border-border/40"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <span>Updates</span>
                <span className="inline-flex items-center justify-center rounded px-1.5 py-0.2 bg-[#063669]/10 text-[10px] font-bold text-[#1C5F9D]">
                  14
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN DATA CARD & TABLE */}
        <Card
          variant="default"
          padding="none"
          className="rounded-[32px] overflow-hidden border border-border/50 bg-surface shadow-[0px_20px_40px_rgba(0,105,107,0.06)]"
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              {/* TABLE HEADER */}
              <thead>
                <tr className="h-[60px] bg-[rgba(243,243,245,0.5)] border-b border-border/40 text-[13px] font-semibold uppercase tracking-[0.05em] text-[#3D4949]">
                  <th scope="col" className="px-8 py-4">
                    Farmland ID
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Customer
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Last Update
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Land
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Service
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Location
                  </th>
                  <th scope="col" className="px-8 py-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-[rgba(226,226,228,0.4)]">
                {filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="h-[89px] transition-colors hover:bg-surface-subtle/70"
                  >
                    {/* Farmland ID */}
                    <td className="px-8 py-4 font-semibold text-base text-text">
                      {item.farmlandId}
                    </td>

                    {/* Customer */}
                    <td className="px-8 py-4 font-semibold text-base text-text">
                      {item.customer}
                    </td>

                    {/* Last Update */}
                    <td className="px-8 py-4 text-base text-[#3D4949]">
                      {item.lastUpdate}
                    </td>

                    {/* Land */}
                    <td className="px-8 py-4 font-semibold text-base text-text">
                      {item.land}
                    </td>

                    {/* Service Badge */}
                    <td className="px-8 py-4">
                      {renderServiceBadge(item.service)}
                    </td>

                    {/* Location */}
                    <td className="px-8 py-4 text-base text-[#3D4949]">
                      {item.location}
                    </td>

                    {/* Actions: Upload Button */}
                    <td className="px-8 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(item)}
                        className="glc-focus inline-flex h-7 items-center justify-center rounded-full bg-[#96C9ED] px-4 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-accent hover:text-text-inverse active:scale-95"
                      >
                        Upload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1F5F9] bg-surface px-8 py-6 rounded-b-[32px]">
            <p className="text-sm font-medium text-text-muted">
              Showing 1 - {filteredRecords.length} of 1,284
            </p>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                type="button"
                disabled={currentPage === 1}
                className="glc-focus inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#C3C6D5]/30 bg-surface px-3 text-xs font-semibold text-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
              >
                <ChevronLeft className="size-3.5 text-text-muted" />
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="glc-focus grid size-8 place-items-center rounded-lg bg-[#96C9ED] text-xs font-semibold text-black"
              >
                1
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className="glc-focus grid size-8 place-items-center rounded-lg text-xs font-semibold text-[#475569] hover:bg-surface-hover transition-colors"
              >
                2
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(3)}
                className="glc-focus grid size-8 place-items-center rounded-lg text-xs font-semibold text-[#475569] hover:bg-surface-hover transition-colors"
              >
                3
              </button>

              <span className="px-1 text-xs text-text-muted font-medium">...</span>

              <button
                type="button"
                onClick={() => setCurrentPage(1284)}
                className="glc-focus grid h-8 px-2 place-items-center rounded-lg text-xs font-semibold text-[#475569] hover:bg-surface-hover transition-colors"
              >
                1284
              </button>

              {/* Next Button */}
              <button
                type="button"
                className="glc-focus inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#C3C6D5]/30 bg-surface px-3 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5 text-text-muted" />
              </button>
            </div>
          </footer>
        </Card>

        {/* Quick Link to Design System Showcase */}
        <div className="flex justify-end">
          <Link
            href="/design-system"
            className="text-xs font-medium text-text-muted hover:text-accent underline transition-colors"
          >
            View GLC Design System Showcase →
          </Link>
        </div>
      </div>

      {/* UPLOAD DIALOG (Interactive modal triggered by clicking 'UPLOAD') */}
      <Dialog
        open={Boolean(selectedRecord)}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Service Documentation</DialogTitle>
            <DialogDescription>
              Attach inspection proofs, photos, or status documents for{" "}
              <span className="font-semibold text-text">
                {selectedRecord?.customer}
              </span>{" "}
              ({selectedRecord?.farmlandId}).
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4 py-2">
            <div className="rounded-xl bg-surface-subtle p-3 text-xs text-text-secondary flex justify-between">
              <span>Service: <strong>{selectedRecord?.service}</strong></span>
              <span>Location: <strong>{selectedRecord?.location}</strong></span>
            </div>

            <FileUpload
              title="Drag & drop field report or photos"
              description="Supports PDF, PNG, JPG up to 25MB"
            />
          </DialogBody>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRecord(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert(`Document successfully queued for ${selectedRecord?.farmlandId}`);
                setSelectedRecord(null);
              }}
            >
              Submit Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
