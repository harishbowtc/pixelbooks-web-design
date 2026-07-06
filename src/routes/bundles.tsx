import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevRight,
  FileX2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/bundles")({
  head: () => ({
    meta: [
      { title: "eBook Bundles — PixelBooks" },
      { name: "description", content: "Create and manage curated eBook bundles for your catalogue." },
      { property: "og:title", content: "eBook Bundles — PixelBooks" },
      { property: "og:description", content: "Create and manage curated eBook bundles for your catalogue." },
    ],
  }),
  component: BundlesPage,
});

type BundleStatus = "Rejected" | "Approved" | "Pending";
type Bundle = {
  id: string;
  title: string;
  bookCount: number;
  status: BundleStatus;
  pricing: number;
  active: boolean;
  cover: string;
  initials: string;
};

const gradients = [
  "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.32 0.09 240))",
  "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  "linear-gradient(160deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
];

const seed: Bundle[] = [
  { id: "1", title: "Test eBook bundle", bookCount: 1, status: "Rejected", pricing: 0, active: true, cover: gradients[0], initials: "TST" },
  { id: "2", title: "Monsoon Reads Collection", bookCount: 5, status: "Approved", pricing: 499, active: true, cover: gradients[1], initials: "MRC" },
  { id: "3", title: "Kids Storytime Pack", bookCount: 8, status: "Approved", pricing: 799, active: false, cover: gradients[2], initials: "KSP" },
  { id: "4", title: "Business Essentials", bookCount: 4, status: "Pending", pricing: 1299, active: true, cover: gradients[3], initials: "BUS" },
  { id: "5", title: "Poetry Corner", bookCount: 3, status: "Rejected", pricing: 249, active: false, cover: gradients[4], initials: "POE" },
];

const filters = ["All", "Approved", "Pending", "Rejected"] as const;
type Filter = (typeof filters)[number];
const PAGE_SIZE = 8;

function StatusPill({ status }: { status: BundleStatus }) {
  const map = {
    Rejected: { color: "var(--danger)", Icon: FileX2 },
    Approved: { color: "var(--success)", Icon: CheckCircle2 },
    Pending: { color: "var(--brand)", Icon: Clock },
  } as const;
  const { color, Icon } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
        color,
      }}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function BundlesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>(seed);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return bundles.filter((b) => {
      const matchesFilter = filter === "All" || b.status === filter;
      const matchesQuery = b.title.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [bundles, filter, query]);

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

  const toggleActive = (id: string) =>
    setBundles((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));

  return (
    <AppShell title="eBook Bundles" subtitle="Group multiple titles into curated bundles.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex h-12 w-full items-center justify-between gap-6 rounded-xl border border-border bg-card px-4 text-sm font-medium md:w-52"
            >
              <span>{filter}</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg md:w-52">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary ${
                      f === filter ? "font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/bundles/new"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            <Plus size={17} strokeWidth={2.4} />
            Add New Bundle
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 text-center font-semibold">Status</th>
                  <th className="py-4 pr-4 text-center font-semibold">Pricing</th>
                  <th className="py-4 pr-4 text-center font-semibold">Activation</th>
                  <th className="py-4 pr-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                      No bundles match your filters.
                    </td>
                  </tr>
                )}
                {pageItems.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    <td className="py-5 pl-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                          style={{ background: b.cover }}
                        >
                          {b.initials}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{b.title}</div>
                          <span
                            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                            style={{
                              backgroundColor: "var(--secondary)",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {b.bookCount} {b.bookCount === 1 ? "book" : "books"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-4 text-center">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="py-5 pr-4 text-center font-medium">{b.pricing}</td>
                    <td className="py-5 pr-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          role="switch"
                          aria-checked={b.active}
                          onClick={() => toggleActive(b.id)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                          style={{
                            backgroundColor: b.active ? "var(--brand)" : "var(--muted)",
                          }}
                        >
                          <span
                            className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                            style={{ transform: b.active ? "translateX(22px)" : "translateX(2px)" }}
                          />
                        </button>
                        <span className="text-sm font-medium">
                          {b.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-right">
                      <Link
                        to="/bundles"
                        aria-label="View bundle"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <ChevRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageItems.map((b) => (
              <li key={b.id} className="flex items-start gap-3 p-4">
                <div
                  className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                  style={{ background: b.cover }}
                >
                  {b.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{b.title}</p>
                  <p className="text-[11px] text-muted-foreground">{b.bookCount} books</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusPill status={b.status} />
                    <span className="text-xs font-medium">₹{b.pricing}</span>
                    <button
                      onClick={() => toggleActive(b.id)}
                      className="ml-auto text-xs font-medium"
                      style={{ color: b.active ? "var(--success)" : "var(--muted-foreground)" }}
                    >
                      {b.active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination footer */}
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-xs text-muted-foreground">
              {filtered.length === 0
                ? "0 results"
                : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </p>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                </PaginationItem>
                {pageNumbers.map((n, i) =>
                  n === "…" ? (
                    <PaginationItem key={`e-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={n}>
                      <PaginationLink
                        isActive={n === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(n);
                        }}
                        href="#"
                        style={
                          n === currentPage
                            ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)", borderColor: "transparent" }
                            : undefined
                        }
                      >
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-9 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium disabled:opacity-40"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </AppShell>
  );
}