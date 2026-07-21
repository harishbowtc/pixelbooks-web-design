import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Trash2, X, ChevronDown, ImageIcon, Calendar, ArrowLeft, Upload, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/library-admin/banners")({
  component: LibraryAdminBannersPage,
});

interface BannerItem {
  id: string;
  title: string;
  imageColor: string;
  fromDate: string;
  toDate: string;
  enabled: boolean;
}

const INITIAL_BANNERS: BannerItem[] = [
  {
    id: "b1",
    title: "Student Reading Hub Banner",
    imageColor: "linear-gradient(90deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
    fromDate: "2026-01-05",
    toDate: "2026-12-31",
    enabled: true,
  },
  {
    id: "b2",
    title: "New eBook Additions Banner",
    imageColor: "linear-gradient(90deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
    fromDate: "2026-05-10",
    toDate: "2026-08-15",
    enabled: false,
  },
];

const PRESETS = ["All Time", "MTD", "QTD", "YTD", "Last 30 days", "Custom"] as const;
type Preset = (typeof PRESETS)[number];

export function LibraryAdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Date Filtering states
  const [preset, setPreset] = useState<Preset>("All Time");
  const [presetOpen, setPresetOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Edit / Add view toggle states
  const [isEditingFullPage, setIsEditingFullPage] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  // Upload image states
  const [webImageUploaded, setWebImageUploaded] = useState(false);
  const [mobileImageUploaded, setMobileImageUploaded] = useState(false);

  // Deletion state
  const [deletingBanner, setDeletingBanner] = useState<BannerItem | null>(null);

  // Form inputs
  const [titleInput, setTitleInput] = useState("");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");

  // Helper date formatter
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Preset Date range selection logic
  const handlePresetSelect = (p: Preset) => {
    setPreset(p);
    setPresetOpen(false);

    if (p === "All Time") {
      setFrom("");
      setTo("");
      return;
    }

    const today = new Date("2026-07-11"); // Lock baseline calendar system date
    let fromDate = new Date("2026-07-11");
    const toDate = new Date("2026-07-11");

    if (p === "MTD") {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (p === "QTD") {
      const currentMonth = today.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      fromDate = new Date(today.getFullYear(), quarterStartMonth, 1);
    } else if (p === "YTD") {
      fromDate = new Date(today.getFullYear(), 0, 1);
    } else if (p === "Last 30 days") {
      fromDate.setDate(today.getDate() - 30);
    }

    setFrom(fromDate.toISOString().split("T")[0]);
    setTo(toDate.toISOString().split("T")[0]);
  };

  // Filter banners list based on dropdown status, search query, and date selections
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      // 1. Status Filter
      if (statusFilter === "Active" && !b.enabled) return false;
      if (statusFilter === "Inactive" && b.enabled) return false;

      // 2. Search Query filter (matches title or ID)
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesTitle = b.title.toLowerCase().includes(query);
        const matchesId = b.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId) return false;
      }

      // 3. Date Preset / Range overlap filter
      if (preset !== "All Time") {
        if (from && b.toDate < from) return false;
        if (to && b.fromDate > to) return false;
      }

      return true;
    });
  }, [banners, statusFilter, searchQuery, preset, from, to]);

  // Handlers
  const handleOpenAddBanner = () => {
    setTitleInput("");
    setFromDateInput("");
    setToDateInput("");
    setWebImageUploaded(false);
    setMobileImageUploaded(false);
    setEditingBanner(null);
    setIsEditingFullPage(true);
  };

  const handleOpenEditBanner = (b: BannerItem) => {
    setEditingBanner(b);
    setTitleInput(b.title);
    setFromDateInput(b.fromDate);
    setToDateInput(b.toDate);
    setWebImageUploaded(true);
    setMobileImageUploaded(true);
    setIsEditingFullPage(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromDateInput || !toDateInput) {
      toast.error("Please configure active date ranges");
      return;
    }

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((item) =>
          item.id === editingBanner.id
            ? {
                ...item,
                title: titleInput.trim() || "Image Banner Record",
                fromDate: fromDateInput,
                toDate: toDateInput,
              }
            : item,
        ),
      );
      toast.success("Image banner updated successfully!");
    } else {
      const newBanner: BannerItem = {
        id: `banner_${Date.now()}`,
        title: titleInput.trim() || "Image Banner Record",
        imageColor: "linear-gradient(90deg, oklch(0.55 0.14 240), oklch(0.35 0.09 240))",
        fromDate: fromDateInput,
        toDate: toDateInput,
        enabled: true,
      };
      setBanners((prev) => [...prev, newBanner]);
      toast.success("New image banner added successfully!");
    }

    setIsEditingFullPage(false);
    setEditingBanner(null);
  };

  const toggleBannerStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextState = !b.enabled;
          toast.success(`Banner status updated to ${nextState ? "Enabled" : "Disabled"}`);
          return { ...b, enabled: nextState };
        }
        return b;
      }),
    );
  };

  const confirmDeleteBanner = () => {
    if (!deletingBanner) return;
    setBanners((prev) => prev.filter((b) => b.id !== deletingBanner.id));
    toast.success("Image banner removed successfully!");
    setDeletingBanner(null);
  };

  // If in Edit / Add Full Page View
  if (isEditingFullPage) {
    return (
      <AppShell title={editingBanner ? "Update Image Banner" : "Create Image Banner"}>
        <div className="p-4 md:p-8 space-y-6">
          {/* Back button */}
          <button
            onClick={() => setIsEditingFullPage(false)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-foreground mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to banner listing
          </button>

          <form onSubmit={handleSaveBanner} className="space-y-6">
            {/* Details Form Card */}
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-8">
              {/* Date selection row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">From Date *</label>
                  <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full">
                    <input
                      type="date"
                      required
                      value={fromDateInput}
                      onChange={(e) => setFromDateInput(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                    />
                  </label>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">To Date *</label>
                  <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full">
                    <input
                      type="date"
                      required
                      value={toDateInput}
                      onChange={(e) => setToDateInput(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Layout Split: Web and Mobile Preview Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-border">
                {/* Column 1: Web Banner Image */}
                <div className="space-y-5 pr-0 lg:pr-4 pt-4 lg:pt-0">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
                    Web Banner Image
                  </h4>

                  {/* Web Banner Preview Image container */}
                  <div className="relative w-full aspect-[1400/340] max-h-36 rounded-xl border border-border/80 bg-slate-50 dark:bg-slate-900/10 overflow-hidden flex items-center justify-center group">
                    {webImageUploaded ? (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1000&auto=format&fit=crop&q=80"
                          alt="Web Banner Preview"
                          className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
                        />
                        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-300 dark:text-muted-foreground/30">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWebImageUploaded(true);
                        toast.success("Web banner image uploaded successfully!");
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-white dark:bg-card px-4 text-xs font-semibold hover:bg-secondary/40 active:scale-[0.98] transition-all cursor-pointer shadow-sm text-foreground"
                    >
                      <Upload size={14} className="text-muted-foreground" />
                      <span>Choose Image Banner for Web</span>
                    </button>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      1400x340 pixels (or 2x scale), less than 2MB
                    </span>
                  </div>
                </div>

                {/* Column 2: Mobile Banner Image */}
                <div className="space-y-5 pt-6 lg:pt-0 pl-0 lg:pl-8">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
                    Mobile Banner Image
                  </h4>

                  {/* Mobile Banner Preview Image container */}
                  <div className="relative w-full aspect-[1518/864] max-h-56 rounded-xl border border-border/80 bg-slate-50 dark:bg-slate-900/10 overflow-hidden flex items-center justify-center group">
                    {mobileImageUploaded ? (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1000&auto=format&fit=crop&q=80"
                          alt="Mobile Banner Preview"
                          className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
                        />
                        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-muted-foreground/30">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileImageUploaded(true);
                        toast.success("Mobile banner image uploaded successfully!");
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-white dark:bg-card px-4 text-xs font-semibold hover:bg-secondary/40 active:scale-[0.98] transition-all cursor-pointer shadow-sm text-foreground"
                    >
                      <Upload size={14} className="text-muted-foreground" />
                      <span>Choose Image Banner for Mobile</span>
                    </button>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      1518x864 pixels (or 2x scale), less than 2MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Cancel and Save */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingFullPage(false)}
                  className="h-10 px-5 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !fromDateInput || !toDateInput || !webImageUploaded || !mobileImageUploaded
                  }
                  className={`h-10 px-5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                    !fromDateInput || !toDateInput || !webImageUploaded || !mobileImageUploaded
                      ? "bg-slate-100 dark:bg-border text-slate-400 dark:text-muted-foreground cursor-not-allowed border border-border/40"
                      : "bg-[var(--brand)] text-white hover:opacity-90 active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  {editingBanner ? "Save Changes" : "Create Image Banner"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Image Banner">
      <div className="p-4 md:p-8 space-y-6">
        {/* Header Title Row */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleOpenAddBanner}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] text-white px-4 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>Add Banner</span>
          </button>
        </div>

        {/* Redesigned Unified Toolbar */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          {/* Left Side: Status Dropdown + Search Input */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 w-full lg:max-w-xl">
            {/* Dropdown Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-11 min-w-[150px] items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-secondary transition-colors text-foreground shrink-0 cursor-pointer">
                  <span>{statusFilter === "All" ? "All Banners" : `${statusFilter} Banners`}</span>
                  <ChevronDown size={15} className="text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[150px] bg-card border border-border rounded-lg shadow-md z-50"
              >
                {(["All", "Active", "Inactive"] as const).map((tab) => (
                  <DropdownMenuItem
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`cursor-pointer text-sm font-medium px-4 py-2 hover:bg-secondary outline-none transition-colors ${
                      statusFilter === tab
                        ? "text-[var(--brand)] bg-secondary/40 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab === "All" ? "All Banners" : `${tab} Banners`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-white dark:bg-card pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] text-foreground"
              />
            </div>
          </div>

          {/* Right Side: Date Presets & Date Pickers */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:gap-3 w-full lg:w-auto">
            {/* Preset Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setPresetOpen((v) => !v)}
                className="flex h-11 w-full items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium sm:w-40 text-foreground cursor-pointer"
              >
                <span>{preset === "All Time" ? "All Time" : preset}</span>
                <ChevronDown size={15} className="text-muted-foreground" />
              </button>
              {presetOpen && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-40">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePresetSelect(p)}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                        p === preset ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date */}
            <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:w-36">
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPreset("Custom");
                }}
                className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
              />
            </label>

            <span className="text-muted-foreground text-xs font-semibold self-center">to</span>

            {/* End Date */}
            <label className="relative flex h-10 items-center rounded-lg border border-border bg-white dark:bg-card px-3 w-full sm:w-36">
              <input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPreset("Custom");
                }}
                className="w-full bg-transparent text-sm outline-none text-foreground cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Main Grid Table Card */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold w-64">Image</th>
                  <th className="pb-3 px-4 font-semibold">From Date</th>
                  <th className="pb-3 px-4 font-semibold">To Date</th>
                  <th className="pb-3 px-4 font-semibold w-32">Status</th>
                  <th className="pb-3 px-4 font-semibold text-center w-24">Edit</th>
                  <th className="pb-3 pl-4 font-semibold text-center w-20">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBanners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ImageIcon size={32} className="text-muted-foreground/60" />
                        <p className="font-semibold text-sm">No banners found</p>
                        <p className="text-xs">Adjust your status or date filter ranges.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBanners.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/10"
                    >
                      {/* Image Preview Block */}
                      <td className="py-4 pr-4">
                        <div
                          className="h-16 w-56 rounded-lg shadow-sm border border-border/60 flex items-center justify-center text-[10px] text-white font-bold select-none overflow-hidden"
                          style={{ background: b.imageColor }}
                        >
                          <span className="bg-black/25 px-2.5 py-1 rounded backdrop-blur-xs block truncate max-w-[200px]">
                            {b.title}
                          </span>
                        </div>
                      </td>

                      {/* From Date */}
                      <td className="py-4 px-4 font-medium text-foreground text-sm">
                        {formatDateString(b.fromDate)}
                      </td>

                      {/* To Date */}
                      <td className="py-4 px-4 font-medium text-foreground text-sm">
                        {formatDateString(b.toDate)}
                      </td>

                      {/* Toggle status slider */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <Switch
                            checked={b.enabled}
                            onCheckedChange={() => toggleBannerStatus(b.id)}
                            className="cursor-pointer data-[state=checked]:bg-[var(--brand)]"
                          />
                          <span className="text-xs font-semibold text-foreground select-none">
                            {b.enabled ? "Enable" : "Disable"}
                          </span>
                        </div>
                      </td>

                      {/* Edit Button */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleOpenEditBanner(b)}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-white dark:bg-card px-4 text-xs font-semibold hover:bg-secondary/40 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>

                      {/* Remove Button */}
                      <td className="py-4 pl-4 text-center">
                        <button
                          onClick={() => setDeletingBanner(b)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove Banner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination Control */}
        <div className="flex items-center justify-between text-xs text-muted-foreground select-none pt-2">
          <div>
            Showing {filteredBanners.length} from {filteredBanners.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-card/50 text-slate-400 cursor-not-allowed font-semibold"
            >
              &lt;&lt; Previous
            </button>
            <span className="h-8 w-8 rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)] flex items-center justify-center font-bold">
              1
            </span>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-border bg-slate-50 dark:bg-card/50 text-slate-400 cursor-not-allowed font-semibold"
            >
              Next &gt;&gt;
            </button>
          </div>
        </div>

        {/* ----------------- DELETE CONFIRMATION DIALOG ----------------- */}
        <Dialog open={deletingBanner !== null} onOpenChange={() => setDeletingBanner(null)}>
          <DialogContent className="max-w-sm bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="text-center space-y-2 mb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600">
                <Trash2 size={22} />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Remove Image Banner
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">"{deletingBanner?.title}"</span>?
                This promotional banner will be deleted from the carousel.
              </DialogDescription>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBanner(null)}
                className="h-9 px-5 rounded-lg border border-border bg-white dark:bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteBanner}
                className="h-9 px-5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-sm"
              >
                Remove
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
