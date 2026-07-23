import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  CircleOff,
  FileX2,
  Clock,
  Check,
  Building2,
  User,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getBundles, type Bundle, type BundleStatus } from "@/lib/bundles-data";

export const Route = createFileRoute("/pb-admin/bundles/")({
  head: () => ({
    meta: [
      { title: "Manage Bundle — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage every eBook bundle across the PixelBooks platform.",
      },
    ],
  }),
  component: ManageBundlePage,
});

const STATUS_OPTIONS = ["All Status", "Published", "Unpublished", "Pending", "Rejected"] as const;
const PUBLISHER_AUTHOR_OPTIONS = [
  "Publisher & Author",
  "Publisher",
  "Author",
] as const;

const PAGE_SIZE = 8;

function StatusPill({ status }: { status: BundleStatus }) {
  const map = {
    Published: { color: "var(--success)", Icon: CheckCircle2, label: "Published" },
    Approved: { color: "var(--success)", Icon: CheckCircle2, label: "Published" },
    Rejected: { color: "var(--danger)", Icon: FileX2, label: "Rejected" },
    Unpublished: { color: "#6b7280", Icon: CircleOff, label: "Unpublished" },
    Pending: { color: "#d97706", Icon: Clock, label: "Pending" },
  } as const;

  const s = map[status] ?? map.Unpublished;
  const Icon = s.Icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${s.color} 12%, transparent)`,
        color: s.color,
      }}
    >
      <Icon size={13} />
      {s.label}
    </span>
  );
}

function DropdownSelect<T extends string>({
  value,
  options,
  onChange,
  className = "min-w-[170px]",
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 items-center justify-between gap-2.5 rounded-lg border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors hover:bg-secondary/40 outline-none focus:border-[var(--brand)] ${className}`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-1.5 max-h-56 min-w-[190px] overflow-y-auto rounded-lg border border-border bg-card shadow-lg py-1"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-secondary ${opt === value
                  ? "font-semibold text-foreground bg-[var(--sidebar-highlight)]"
                  : "text-muted-foreground"
                }`}
            >
              <span className="truncate">{opt}</span>
              {opt === value && <Check size={14} className="ml-2 shrink-0 text-[var(--brand)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ManageBundlePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All Status");
  const [entityFilter, setEntityFilter] = useState<(typeof PUBLISHER_AUTHOR_OPTIONS)[number]>("Publisher & Author");
  const [page, setPage] = useState(1);

  const [bundles] = useState<Bundle[]>(() => getBundles());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bundles.filter((b) => {
      // Status Filter
      if (statusFilter !== "All Status") {
        if (statusFilter === "Published" && b.status !== "Published" && b.status !== "Approved") return false;
        if (statusFilter !== "Published" && b.status !== statusFilter) return false;
      }
      // Entity Filter
      if (entityFilter !== "Publisher & Author") {
        if (entityFilter === "Publisher" && b.entityRole !== "Publisher") return false;
        if (entityFilter === "Author" && b.entityRole !== "Author") return false;
      }
      // Search Query Filter
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        (b.entityName || "").toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    });
  }, [bundles, query, statusFilter, entityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== "…") {
        nums.push("…");
      }
    }
    return nums;
  }, [totalPages, currentPage]);

  return (
    <AppShell title="Manage Bundle" subtitle="Manage every eBook bundle across the PixelBooks platform.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>

          {/* Controls Dropdowns & CTA */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Publisher & Author Filter */}
            <DropdownSelect
              value={entityFilter}
              options={PUBLISHER_AUTHOR_OPTIONS}
              onChange={(v) => {
                setEntityFilter(v);
                setPage(1);
              }}
              className="w-full sm:w-auto min-w-[170px]"
            />

            {/* Status Filter */}
            <DropdownSelect
              value={statusFilter}
              options={STATUS_OPTIONS}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              className="w-full sm:w-auto min-w-[130px]"
            />

            {/* Add New Bundle CTA */}
            <Link
              to="/pb-admin/bundles/new"
              className="inline-flex h-11 items-center gap-2 rounded-lg px-5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add New Bundle
            </Link>
          </div>
        </div>

        {/* Bundles Table Card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">
                  <th className="py-4 pl-6 pr-4 font-semibold">Bundle Name</th>
                  <th className="py-4 pr-4 font-semibold">Published By</th>
                  <th className="py-4 pr-4 font-semibold">Status</th>
                  <th className="py-4 pr-4 font-semibold">Price</th>
                  <th className="py-4 pr-6 text-right font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                      No bundles found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => navigate({ to: "/pb-admin/bundles/$bundleId", params: { bundleId: b.id } })}
                      className="group cursor-pointer transition-colors hover:bg-secondary/40"
                    >
                      {/* Bundle Name Column */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-start gap-4">
                          {/* 3D Bundle Book Stack Thumbnail */}
                          <div className="relative h-16 w-12 shrink-0">
                            {/* Layer 2 back card */}
                            <div
                              className="absolute -right-1 -top-1 h-14 w-10 rounded-md opacity-40 shadow-xs border border-white/20"
                              style={{ background: b.cover }}
                            />
                            {/* Main front cover */}
                            <div
                              className="relative flex h-16 w-12 flex-col items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm ring-1 ring-black/10 overflow-hidden"
                              style={{ background: b.cover }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                              <span className="relative z-10 text-[10px] font-extrabold tracking-wider">{b.initials}</span>
                            </div>
                          </div>

                          {/* Details Stack */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="font-semibold text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
                              {b.title}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="inline-flex items-center rounded-full border border-border/80 bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                                {b.bookCount} {b.bookCount === 1 ? "eBook" : "eBooks"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Published By Column */}
                      <td className="py-4 pr-4 align-middle">
                        {b.entityRole === "Author" ? (
                          /* Author Chip */
                          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-2.5 py-1 shadow-2xs">
                            <span
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8.5px] font-extrabold border border-[var(--brand)]/30"
                              style={{
                                backgroundColor: "color-mix(in oklch, var(--brand) 15%, transparent)",
                                color: "var(--brand)",
                              }}
                            >
                              {(b.entityName || b.title || "PB")
                                .split(" ")
                                .filter(Boolean)
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                            <span className="text-[11.5px] font-semibold text-foreground">
                              {b.entityName || "Author"}
                            </span>
                          </div>
                        ) : (
                          /* Publisher Chip */
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            <Building2 size={11} className="shrink-0 text-muted-foreground/80" />
                            <span>{b.entityName || "PixelBooks Press"}</span>
                          </div>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 pr-4 align-middle">
                        <StatusPill status={b.status} />
                      </td>

                      {/* Price Column */}
                      <td className="py-4 pr-4 align-middle font-semibold text-sm text-foreground">
                        ₹{b.pricing.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Action Arrow Column */}
                      <td className="py-4 pr-6 align-middle text-right text-muted-foreground transition-colors group-hover:text-foreground">
                        <ChevronRight size={18} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{start + 1}</span> to{" "}
                <span className="font-medium text-foreground">{Math.min(start + PAGE_SIZE, filtered.length)}</span> of{" "}
                <span className="font-medium text-foreground">{filtered.length}</span> bundles
              </p>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                    >
                      Previous
                    </PaginationLink>
                  </PaginationItem>

                  {pageNumbers.map((n, idx) =>
                    n === "…" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={n}>
                        <PaginationLink
                          isActive={n === currentPage}
                          onClick={() => setPage(n)}
                          className="cursor-pointer"
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      aria-label="Next page"
                      className={`cursor-pointer ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                    >
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
