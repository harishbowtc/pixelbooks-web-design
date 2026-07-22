import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  AlertCircle,
  Check,
  X,
  Edit3,
  Building2,
  User,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/promo-codes")({
  head: () => ({
    meta: [
      { title: "Promo Code — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage publisher and author promo codes across the platform.",
      },
    ],
  }),
  component: PbAdminPromoCodesPage,
});

export type CreatorType = "Publisher" | "Author" | "eBook";
export type PromoStatus =
  | "Approved"
  | "Expired"
  | "Pending for Admin Approval"
  | "Rejected"
  | "Disabled";

export type PromoCodeItem = {
  id: string;
  code: string;
  creatorType: CreatorType;
  startDate: string;
  endDate: string;
  durationText: string;
  discountFormatted: string;
  target: string;
  status: PromoStatus;
  minAmount?: string;
  description?: string;
};

// Seed dataset matching the screenshot exactly for the first 10 items
const initialData: PromoCodeItem[] = [
  {
    id: "pc-1",
    code: "XIOQMXJ876",
    creatorType: "Publisher",
    startDate: "2026-07-21",
    endDate: "2026-07-31",
    durationText: "Jul 21 – Jul 31, 2026",
    discountFormatted: "100 %",
    target: "Cengage & Pearson",
    status: "Approved",
  },
  {
    id: "pc-2",
    code: "WTEDUFX363",
    creatorType: "Publisher",
    startDate: "2026-07-21",
    endDate: "2026-07-31",
    durationText: "Jul 21 – Jul 31, 2026",
    discountFormatted: "36%",
    target: "Create, Captivate, Celebrate: Unlock Your Creative Potential",
    status: "Approved",
  },
  {
    id: "pc-3",
    code: "FDFGSRY",
    creatorType: "Publisher",
    startDate: "2026-07-21",
    endDate: "2026-07-21",
    durationText: "Jul 21 – Jul 21, 2026",
    discountFormatted: "25%",
    target: "Cengage & Pearson",
    status: "Expired",
  },
  {
    id: "pc-4",
    code: "RLIFSLV503",
    creatorType: "Publisher",
    startDate: "2026-07-21",
    endDate: "2026-07-21",
    durationText: "Jul 21 – Jul 21, 2026",
    discountFormatted: "25%",
    target: "Love Poems. Dream",
    status: "Expired",
  },
  {
    id: "pc-5",
    code: "ATLZDED122",
    creatorType: "Author",
    startDate: "2026-07-20",
    endDate: "2026-07-24",
    durationText: "Jul 20 – Jul 24, 2026",
    discountFormatted: "20%",
    target: "DiggyPOD Inc 5 x 7 Book Template",
    status: "Approved",
  },
  {
    id: "pc-6",
    code: "DOYOLDE466",
    creatorType: "Publisher",
    startDate: "2026-07-17",
    endDate: "2026-07-24",
    durationText: "Jul 17 – Jul 24, 2026",
    discountFormatted: "50 %",
    target: "THE SNOW KING",
    status: "Approved",
  },
  {
    id: "pc-7",
    code: "KGWLKUO890",
    creatorType: "Publisher",
    startDate: "2026-07-16",
    endDate: "2026-07-23",
    durationText: "Jul 16 – Jul 23, 2026",
    discountFormatted: "3%",
    target: "Scythia: The Amazing Origins of Ancient Ireland",
    status: "Approved",
  },
  {
    id: "pc-8",
    code: "BDBWRYV297",
    creatorType: "Publisher",
    startDate: "2026-07-16",
    endDate: "2026-07-16",
    durationText: "Jul 16 – Jul 16, 2026",
    discountFormatted: "5%",
    target: "Oliver Twist",
    status: "Expired",
  },
  {
    id: "pc-9",
    code: "ZKOEHBT638",
    creatorType: "Author",
    startDate: "2025-07-10",
    endDate: "2025-07-17",
    durationText: "Jul 10 – Jul 17, 2025",
    discountFormatted: "35%",
    target: "Letters of Oodee",
    status: "Expired",
  },
  {
    id: "pc-10",
    code: "DFGJUY888",
    creatorType: "Publisher",
    startDate: "2026-07-10",
    endDate: "2026-07-10",
    durationText: "Jul 10 – Jul 10, 2026",
    discountFormatted: "32%",
    target: "AGW",
    status: "Expired",
  },
  // Additional mock items for multi-page demonstration
  {
    id: "pc-11",
    code: "MONSOON2026",
    creatorType: "Publisher",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    durationText: "Aug 01 – Aug 31, 2026",
    discountFormatted: "15%",
    target: "Penguin Random House",
    status: "Pending for Admin Approval",
  },
  {
    id: "pc-12",
    code: "SUMMERREAD",
    creatorType: "Author",
    startDate: "2026-06-01",
    endDate: "2026-08-15",
    durationText: "Jun 01 – Aug 15, 2026",
    discountFormatted: "40%",
    target: "The Lost Horizon",
    status: "Approved",
  },
  {
    id: "pc-13",
    code: "FESTIVE50",
    creatorType: "Publisher",
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    durationText: "Oct 01 – Oct 31, 2026",
    discountFormatted: "50%",
    target: "HarperCollins Books",
    status: "Disabled",
  },
  {
    id: "pc-14",
    code: "EBOOKDEAL25",
    creatorType: "eBook",
    startDate: "2026-07-20",
    endDate: "2026-08-10",
    durationText: "Jul 20 – Aug 10, 2026",
    discountFormatted: "25%",
    target: "Physics for Scientists and Engineers",
    status: "Approved",
  },
  {
    id: "pc-15",
    code: "DIGITAL50",
    creatorType: "eBook",
    startDate: "2026-07-15",
    endDate: "2026-07-30",
    durationText: "Jul 15 – Jul 30, 2026",
    discountFormatted: "50%",
    target: "Data Structures in C++ (Interactive Edition)",
    status: "Approved",
  },
  {
    id: "pc-16",
    code: "BIOLOGY10",
    creatorType: "eBook",
    startDate: "2026-07-01",
    endDate: "2026-07-15",
    durationText: "Jul 01 – Jul 15, 2026",
    discountFormatted: "10%",
    target: "Campbell Biology 12th Edition",
    status: "Expired",
  },
];

const creatorFilterOptions = ["eBook, Publisher & Author", "eBook", "Publisher", "Author"] as const;
const statusFilterOptions = [
  "All Status",
  "Approved",
  "Expired",
  "Pending for Admin Approval",
  "Rejected",
  "Disabled",
] as const;

function CreatorTag({ type }: { type: CreatorType }) {
  if (type === "eBook") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80">
        <BookOpen size={12} className="text-emerald-600 dark:text-emerald-400" />
        eBook
      </span>
    );
  }
  if (type === "Publisher") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-700 bg-sky-50/90 border border-sky-200/80 px-2.5 py-0.5 rounded-full dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80">
        <Building2 size={12} className="text-sky-600 dark:text-sky-400" />
        Publisher
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-700 bg-purple-50/90 border border-purple-200/80 px-2.5 py-0.5 rounded-full dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80">
      <User size={12} className="text-purple-600 dark:text-purple-400" />
      Author
    </span>
  );
}

function StatusBadge({
  status,
  onStatusChange,
}: {
  status: PromoStatus;
  onStatusChange?: (newStatus: PromoStatus) => void;
}) {
  if (status === "Approved") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-1 rounded-full border border-emerald-300/70 bg-emerald-50/90 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100/80 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors cursor-pointer outline-none">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Approved</span>
            <ChevronDown size={12} className="ml-0.5 text-emerald-600/80 dark:text-emerald-400/80" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onStatusChange?.("Approved")}>
            <CheckCircle2 size={14} className="mr-2 text-emerald-600" /> Approved
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange?.("Disabled")}>
            <Ban size={14} className="mr-2 text-slate-500" /> Disabled
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange?.("Expired")}>
            <Clock size={14} className="mr-2 text-slate-500" /> Expired
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (status === "Expired") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100/90 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <Clock size={13} />
        <span>Expired</span>
      </span>
    );
  }

  if (status === "Pending for Admin Approval") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-amber-50/90 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100/80 dark:border-amber-800/80 dark:bg-amber-950/60 dark:text-amber-300 transition-colors cursor-pointer outline-none">
            <Clock size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Pending</span>
            <ChevronDown size={12} className="ml-0.5 text-amber-600/80 dark:text-amber-400/80" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onStatusChange?.("Approved")}>
            <CheckCircle2 size={14} className="mr-2 text-emerald-600" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange?.("Rejected")}>
            <XCircle size={14} className="mr-2 text-rose-600" /> Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
        <XCircle size={13} />
        <span>Rejected</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <Ban size={13} />
      <span>Disabled</span>
    </span>
  );
}

function PbAdminPromoCodesPage() {
  const [data, setData] = useState<PromoCodeItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorFilter, setCreatorFilter] = useState<(typeof creatorFilterOptions)[number]>("eBook, Publisher & Author");
  const [creatorFilterOpen, setCreatorFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilterOptions)[number]>("All Status");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // View/Edit Modal state
  const [selectedPromo, setSelectedPromo] = useState<PromoCodeItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Add Promo Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newCreatorType, setNewCreatorType] = useState<CreatorType>("Publisher");
  const [newTarget, setNewTarget] = useState("");
  const [newDiscount, setNewDiscount] = useState("20%");
  const [newMinAmount, setNewMinAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStartDate, setNewStartDate] = useState("2026-08-01");
  const [newEndDate, setNewEndDate] = useState("2026-08-31");

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(code);
    toast.info(`Generated promo code: ${code}`);
  };

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Creator filter
      if (
        creatorFilter !== "eBook, Publisher & Author" &&
        creatorFilter !== "Publisher & Author" &&
        item.creatorType !== creatorFilter
      ) {
        return false;
      }
      // Status filter
      if (statusFilter !== "All Status" && item.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const codeMatch = item.code.toLowerCase().includes(q);
        const targetMatch = item.target.toLowerCase().includes(q);
        if (!codeMatch && !targetMatch) return false;
      }
      return true;
    });
  }, [data, creatorFilter, statusFilter, searchQuery]);

  const totalResults = 413; // Display 413 to match screenshot exact requirement "Showing 10 from 413 results" when on page 1 with all filters
  const totalPages = 5;

  const currentDisplayItems = useMemo(() => {
    if (
      currentPage === 1 &&
      searchQuery === "" &&
      (creatorFilter === "eBook, Publisher & Author" || creatorFilter === "Publisher & Author") &&
      statusFilter === "All Status"
    ) {
      return filteredData.slice(0, 10);
    }
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, searchQuery, creatorFilter, statusFilter]);

  const handleStatusChange = (id: string, newStatus: PromoStatus) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    toast.success(`Promo status updated to ${newStatus}`);
  };

  const handleOpenEdit = (promo: PromoCodeItem) => {
    setSelectedPromo(promo);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromo) return;
    setData((prev) =>
      prev.map((item) => (item.id === selectedPromo.id ? selectedPromo : item))
    );
    setEditModalOpen(false);
    toast.success(`Promo code ${selectedPromo.code} updated!`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTarget) {
      toast.error("Please fill in code and target fields");
      return;
    }
    const newItem: PromoCodeItem = {
      id: `pc-${Date.now()}`,
      code: newCode.toUpperCase(),
      creatorType: newCreatorType,
      startDate: newStartDate,
      endDate: newEndDate,
      durationText: `${newStartDate} – ${newEndDate}`,
      discountFormatted: newDiscount.includes("%") ? newDiscount : `${newDiscount}%`,
      target: newTarget,
      status: "Approved",
      minAmount: newMinAmount ? (newMinAmount.startsWith("$") ? newMinAmount : `$${newMinAmount}`) : undefined,
      description: newDescription || undefined,
    };
    setData((prev) => [newItem, ...prev]);
    setAddModalOpen(false);
    setNewCode("");
    setNewTarget("");
    setNewMinAmount("");
    setNewDescription("");
    toast.success(`Promo code ${newItem.code} created successfully!`);
  };

  return (
    <AppShell title="Promo Code">
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Controls Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Search input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by promo code, title"
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-2xs transition-colors"
            />
          </div>

          {/* Right: Filters & Add Promo Code Button */}
          <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
            {/* Publisher & Author Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCreatorFilterOpen((v) => !v)}
                className="h-10 px-4 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-normal text-slate-700 dark:text-slate-200 flex items-center justify-between gap-3 min-w-[160px] shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{creatorFilter}</span>
                <ChevronDown size={15} className="text-slate-400" />
              </button>
              {creatorFilterOpen && (
                <div className="absolute right-0 z-30 mt-1.5 w-48 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 text-sm">
                  {creatorFilterOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setCreatorFilter(opt);
                        setCreatorFilterOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${opt === creatorFilter ? "font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40" : "text-slate-600 dark:text-slate-300"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* All Status Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusFilterOpen((v) => !v)}
                className="h-10 px-4 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-normal text-slate-700 dark:text-slate-200 flex items-center justify-between gap-3 min-w-[130px] shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{statusFilter}</span>
                <ChevronDown size={15} className="text-slate-400" />
              </button>
              {statusFilterOpen && (
                <div className="absolute right-0 z-30 mt-1.5 w-52 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 text-sm">
                  {statusFilterOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setStatusFilter(opt);
                        setStatusFilterOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${opt === statusFilter ? "font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40" : "text-slate-600 dark:text-slate-300"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Promo Code Button */}
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >

              <span>Add Promo Code</span>
            </button>
          </div>
        </div>

        {/* Promo Codes Table Card */}
        <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[12px] font-semibold text-slate-800 dark:text-slate-200">
                  <th className="py-4 px-5 font-semibold w-[220px]">Promo Code</th>
                  <th className="py-4 px-5 font-semibold w-[200px]">Promo Duration</th>
                  <th className="py-4 px-5 font-semibold w-[120px]">Discount</th>
                  <th className="py-4 px-5 font-semibold min-w-[240px]">eBook/Publisher/Author</th>
                  <th className="py-4 px-5 font-semibold w-[130px] text-center">Action</th>
                  <th className="py-4 px-5 font-semibold w-[160px] text-center">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {currentDisplayItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                      No promo codes found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentDisplayItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Promo Code */}
                      <td className="py-5 px-5 align-middle">
                        <span className="inline-block bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 rounded-md px-3.5 py-1.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-wider shadow-2xs text-center">
                          {item.code}
                        </span>
                      </td>

                      {/* Promo Duration */}
                      <td className="py-5 px-5 align-middle text-slate-600 dark:text-slate-300 text-xs md:text-sm whitespace-nowrap">
                        {item.durationText}
                      </td>

                      {/* Discount */}
                      <td className="py-5 px-5 align-middle text-slate-900 dark:text-slate-100 font-medium text-xs md:text-sm whitespace-nowrap">
                        {item.discountFormatted}
                      </td>

                      {/* eBook/Publisher/Author */}
                      <td className="py-5 px-5 align-middle text-slate-700 dark:text-slate-200 text-xs md:text-sm font-normal">
                        <div className="flex items-center gap-2.5">
                          <CreatorTag type={item.creatorType} />
                          <span>{item.target}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-5 px-5 align-middle text-center">
                        {item.status === "Approved" || item.status === "Pending for Admin Approval" ? (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-white dark:bg-card border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
                          >
                            View/Edit
                          </button>
                        ) : null}
                      </td>

                      {/* Current Status */}
                      <td className="py-5 px-5 align-middle text-center">
                        <StatusBadge
                          status={item.status}
                          onStatusChange={(newSt) => handleStatusChange(item.id, newSt)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination Bar matching screenshot */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 text-xs text-slate-500 gap-3">
            <div>
              Showing {currentDisplayItems.length} from {totalResults} results
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40 text-xs font-normal transition-colors"
              >
                « Previous
              </button>

              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${currentPage === pageNum
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 text-xs font-normal transition-colors"
              >
                Next »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Promo Code Dialog Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-card border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 size={18} style={{ color: "var(--brand)" }} />
              View / Edit Promo Code
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Review or adjust promo code details and status.
            </DialogDescription>
          </DialogHeader>

          {selectedPromo && (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={selectedPromo.code}
                  onChange={(e) =>
                    setSelectedPromo({ ...selectedPromo, code: e.target.value.toUpperCase() })
                  }
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-mono font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Creator Type
                  </label>
                  <select
                    value={selectedPromo.creatorType}
                    onChange={(e) =>
                      setSelectedPromo({
                        ...selectedPromo,
                        creatorType: e.target.value as CreatorType,
                      })
                    }
                    className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                  >
                    <option value="eBook">eBook</option>
                    <option value="Publisher">Publisher</option>
                    <option value="Author">Author</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="text"
                    value={selectedPromo.discountFormatted}
                    onChange={(e) =>
                      setSelectedPromo({ ...selectedPromo, discountFormatted: e.target.value })
                    }
                    className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Min. Amount ($)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $50"
                    value={selectedPromo.minAmount || ""}
                    onChange={(e) =>
                      setSelectedPromo({ ...selectedPromo, minAmount: e.target.value })
                    }
                    className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Promocode Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Promo description..."
                  value={selectedPromo.description || ""}
                  onChange={(e) =>
                    setSelectedPromo({ ...selectedPromo, description: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  eBook / Publisher / Author
                </label>
                <input
                  type="text"
                  value={selectedPromo.target}
                  onChange={(e) =>
                    setSelectedPromo({ ...selectedPromo, target: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={selectedPromo.status}
                  onChange={(e) =>
                    setSelectedPromo({
                      ...selectedPromo,
                      status: e.target.value as PromoStatus,
                    })
                  }
                  className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending for Admin Approval">Pending for Admin Approval</option>
                  <option value="Expired">Expired</option>
                  <option value="Disabled">Disabled</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-md transition-opacity hover:opacity-90 shadow-2xs"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Promo Code Dialog Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-card border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Add Promo Code
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Create a new promotional discount code for publisher or author books.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePromo} className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Promo Code Name
                </label>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="text-[11px] font-medium transition-opacity hover:opacity-80 flex items-center gap-1 cursor-pointer"
                  style={{ color: "var(--brand)" }}
                >
                  <Sparkles size={12} />
                  <span>Auto Generate</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. MONSOON2026"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-sm font-mono font-semibold uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Creator Type
                </label>
                <select
                  value={newCreatorType}
                  onChange={(e) => setNewCreatorType(e.target.value as CreatorType)}
                  className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                >
                  <option value="eBook">eBook</option>
                  <option value="Publisher">Publisher</option>
                  <option value="Author">Author</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Discount (%)
                </label>
                <input
                  type="text"
                  placeholder="25%"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Min. Amount ($)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50"
                  value={newMinAmount}
                  onChange={(e) => setNewMinAmount(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Promocode Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of the promo code offer..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs resize-none placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                eBook / Publisher / Author
              </label>
              <input
                type="text"
                placeholder=""
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full h-9 px-3 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-md text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium rounded-md transition-opacity hover:opacity-90 shadow-2xs"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                Create Promo Code
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
