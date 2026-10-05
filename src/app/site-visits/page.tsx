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
  Card,
} from "@/components/ui";
import {
  SiteVisitDetailScreen,
  type SiteVisitRecord,
} from "@/components/dashboard/site-visit-detail-screen";

const siteVisitRecords: SiteVisitRecord[] = [
  {
    id: "1",
    customer: "Pooja",
    farmlandId: "GLCSOS 088",
    visitDate: "25th Sep - 10:00 AM",
    land: "5.0 Acres",
    status: "Completed",
    location: "Nunna, Krishna Dist.",
    phone: "+91 9849012345",
    propertyId: "GLC SOS 07",
    buyerFrom: "Vijayawada, Benz Circle",
    checkedIn: "2026-09-25T10:12",
    duration: "1 hr 25 min",
    visitors: "Pooja + spouse",
    accompaniedBy: "Ramesh Babu",
  },
  {
    id: "2",
    customer: "Suresh Reddy",
    farmlandId: "GLCSOS 01",
    visitDate: "24th Oct - 11:30 AM",
    land: "5.0 Acres",
    status: "Scheduled",
    location: "Hyderabad",
    phone: "+91 9876543210",
    propertyId: "GLC SOS 01",
    buyerFrom: "Gachibowli, Hyderabad",
    checkedIn: "2026-10-24T11:30",
    duration: "1 hr 00 min",
    visitors: "Suresh Reddy",
    accompaniedBy: "Ramesh Babu",
  },
  {
    id: "3",
    customer: "Suresh Yadav",
    farmlandId: "GLCSOS 02",
    visitDate: "18th Oct - 03:00 PM",
    land: "5.0 Acres",
    status: "Completed",
    location: "Kakinada",
    phone: "+91 9812345678",
    propertyId: "GLC SOS 02",
    buyerFrom: "Kakinada Main",
    checkedIn: "2026-10-18T14:50",
    duration: "1 hr 40 min",
    visitors: "Suresh Yadav + 2",
    accompaniedBy: "Ramesh Babu",
  },
  {
    id: "4",
    customer: "Rajesh Verma",
    farmlandId: "GLCSOS 03",
    visitDate: "15th Oct - 09:30 AM",
    land: "5.0 Acres",
    status: "In Progress",
    location: "Vizag",
    phone: "+91 9948011223",
    propertyId: "GLC SOS 03",
    buyerFrom: "Vizag Beach Rd",
    checkedIn: "2026-10-15T09:25",
    duration: "45 min",
    visitors: "Rajesh Verma",
    accompaniedBy: "Ramesh Babu",
  },
  {
    id: "5",
    customer: "Ananya Rao",
    farmlandId: "GLCSOS 04",
    visitDate: "12th Oct - 02:15 PM",
    land: "5.0 Acres",
    status: "Completed",
    location: "Amalapuram",
    phone: "+91 9440123456",
    propertyId: "GLC SOS 04",
    buyerFrom: "Rajahmundry",
    checkedIn: "2026-10-12T14:15",
    duration: "1 hr 15 min",
    visitors: "Ananya Rao + family",
    accompaniedBy: "Ramesh Babu",
  },
  {
    id: "6",
    customer: "Vikram Joshi",
    farmlandId: "GLCSOS 05",
    visitDate: "8th Oct - 11:00 AM",
    land: "5.0 Acres",
    status: "Scheduled",
    location: "Karimnagar",
    phone: "+91 9866123987",
    propertyId: "GLC SOS 05",
    buyerFrom: "Warangal",
    checkedIn: "2026-10-08T11:00",
    duration: "1 hr",
    visitors: "Vikram Joshi",
    accompaniedBy: "Ramesh Babu",
  },
  {
    id: "7",
    customer: "Priya Sharma",
    farmlandId: "GLCSOS 06",
    visitDate: "5th Oct - 04:30 PM",
    land: "5.0 Acres",
    status: "Completed",
    location: "Warangal",
    phone: "+91 9701234567",
    propertyId: "GLC SOS 06",
    buyerFrom: "Hanamkonda",
    checkedIn: "2026-10-05T16:30",
    duration: "2 hr",
    visitors: "Priya Sharma",
    accompaniedBy: "Ramesh Babu",
  },
];

function GLCLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
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
    </Link>
  );
}

export default function SiteVisitsPage() {
  const [selectedVisit, setSelectedVisit] = React.useState<SiteVisitRecord | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = React.useState(false);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check URL on initial load and handle browser back/forward
  React.useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const visitId = params.get("id");
      if (visitId) {
        const found = siteVisitRecords.find((r) => r.id === visitId);
        if (found) {
          setSelectedVisit(found);
          return;
        }
      }
      if (params.get("view") === "detail") {
        setSelectedVisit(siteVisitRecords[0]);
        return;
      }
      setSelectedVisit(null);
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const handleOpenDetail = (record: SiteVisitRecord) => {
    setSelectedVisit(record);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("id", record.id);
      window.history.pushState(null, "", url.toString());
    }
  };

  const handleBackToTable = () => {
    setSelectedVisit(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("id");
      url.searchParams.delete("view");
      window.history.pushState(null, "", url.pathname);
    }
  };

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
    if (!searchQuery.trim()) return siteVisitRecords;
    const q = searchQuery.toLowerCase();
    return siteVisitRecords.filter(
      (r) =>
        r.customer.toLowerCase().includes(q) ||
        r.farmlandId.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);


  // If a visit detail is active, render the detail page
  if (selectedVisit) {
    return (
      <SiteVisitDetailScreen
        key={selectedVisit.id}
        initialRecord={selectedVisit}
        onBack={handleBackToTable}
      />
    );
  }

  // Otherwise, render the replicated table view for Site Visits
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-10 2xl:px-14 3xl:px-16 4xl:px-20 flex flex-col items-center">
      {/* Responsive desktop container */}
      <div className="w-full max-w-[1440px] 2xl:max-w-[1780px] 3xl:max-w-[2180px] 4xl:max-w-[2400px] flex flex-col gap-8">
        
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

            {/* Active Pill: Assigned Services (Site visits active) */}
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
                className="glc-focus inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold bg-[#1C5F9D] text-text-inverse shadow-medium cursor-pointer transition-all"
              >
                <span className="grid size-9 place-items-center rounded-full bg-surface text-[#1C5F9D]">
                  <MapPin className="size-4" />
                </span>
                <span className="font-semibold text-sm">Site visits</span>
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
                    <Link
                      href="/"
                      role="menuitem"
                      onClick={() => setIsNavDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium hover:bg-surface-hover text-text hover:text-accent transition-colors"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-surface-muted text-text-secondary">
                        <FileCheck className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Maintenance services</p>
                        <p className="text-[10px] text-text-muted">
                          Maintenance and field tasks
                        </p>
                      </div>
                    </Link>

                    {/* Option 2: Site visits (Active) */}
                    <div
                      role="menuitem"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium bg-accent text-text-inverse font-semibold shadow-low transition-colors mt-1"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-white/20 text-white">
                        <MapPin className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Site visits</p>
                        <p className="text-[10px] text-white/80">Field inspection logs</p>
                      </div>
                      <span className="size-2 rounded-full bg-white shrink-0" />
                    </div>
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
            Site Visits
          </h1>

          {/* Search bar */}
          <div className="relative w-full sm:w-[360px] lg:w-[412px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by farmland, customer, location..."
              className="glc-focus h-12 w-full rounded-full border border-transparent bg-surface pl-12 pr-5 text-sm text-text placeholder:text-text-muted/70 shadow-low transition-colors hover:border-border-strong focus:border-accent focus:bg-surface"
            />
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
                    Visit Date
                  </th>
                  <th scope="col" className="px-8 py-4">
                    Land
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

                    {/* Visit Date */}
                    <td className="px-8 py-4 text-base text-[#3D4949]">
                      {item.visitDate}
                    </td>

                    {/* Land */}
                    <td className="px-8 py-4 font-semibold text-base text-text">
                      {item.land}
                    </td>

                    {/* Location */}
                    <td className="px-8 py-4 text-base text-[#3D4949]">
                      {item.location}
                    </td>

                    {/* Actions: View Details Button */}
                    <td className="px-8 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(item)}
                        className="glc-focus inline-flex h-7 items-center justify-center rounded-full bg-[#96C9ED] px-3.5 text-[11px] font-medium text-black transition-all hover:bg-accent hover:text-text-inverse active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        View Details
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

        {/* Footer links */}
        <div className="flex justify-between items-center text-xs text-text-muted">
          <Link
            href="/"
            className="hover:text-accent underline transition-colors"
          >
            ← Switch to Maintenance Services
          </Link>
          <Link
            href="/design-system"
            className="hover:text-accent underline transition-colors"
          >
            View GLC Design System Showcase →
          </Link>
        </div>
      </div>
    </div>
  );
}
