import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  CircleOff,
  FileX2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { seedBooks, type Book, type Status } from "@/lib/catalogue-data";

export const Route = createFileRoute("/publisher/catalogue")({
  component: CataloguePage,
});



const STATUS_FILTERS: Array<"All" | Status> = ["All", "Published", "Unpublished", "Rejected"];
const PAGE_SIZE = 8;

function StatusPill({ status }: { status: Status }) {
  const map = {
    Published: { color: "var(--success)", Icon: CheckCircle2 },
    Rejected: { color: "var(--danger)", Icon: FileX2 },
    Unpublished: { color: "#6b7280", Icon: CircleOff },
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
      <Icon size={14} />
      {status}
    </span>
  );
}

function StatusFilter({ value, onChange }: { value: string; onChange: (v: typeof STATUS_FILTERS[number]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 min-w-[130px] items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium"
      >
        {value}
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>
      {open && (
        <div
          className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary ${s === value ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CataloguePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seedBooks.filter((b) => {
      if (filter !== "All" && b.status !== filter) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.isbn ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

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
    <AppShell title="My Catalogue" subtitle="Manage every eBook in your storefront.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ebook name, ISBN, author"
              className="h-11 w-full rounded-lg border border-border bg-card pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
          </div>
          <StatusFilter
            value={filter}
            onChange={(v) => {
              setFilter(v);
              setPage(1);
            }}
          />
          <Link
            to="/publisher/catalogue/new"
            className="flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            <Plus size={17} strokeWidth={2.5} />
            Add New eBook
          </Link>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Title</th>
                  <th className="py-4 pr-4 font-semibold">ISBN</th>
                  <th className="py-4 pr-4 font-semibold">Status</th>
                  <th className="py-4 pr-4 font-semibold">Pricing</th>
                  <th className="py-4 pr-6 font-semibold">Author</th>                  <th className="py-4 pr-6" />                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                      No eBooks match your filters.
                    </td>
                  </tr>
                )}
                {pageItems.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => navigate({ to: "/catalogue/$bookId", params: { bookId: b.id } })}
                    className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                          style={{ background: b.cover }}
                        >
                          {b.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium leading-snug text-foreground">{b.title}</p>
                          <div className="mt-1.5 flex items-center gap-2 text-xs">
                            <span className="rounded-md border border-border px-1.5 py-0.5 font-semibold text-muted-foreground">
                              {b.format}
                            </span>
                            <span className="text-muted-foreground">{b.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {b.isbn ? (
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
                          {b.isbn}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="py-4 pr-4">
                      {b.price === null ? (
                        <span className="font-medium text-foreground">Free</span>
                      ) : (
                        <span className="font-medium">₹{b.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">{b.author}</td>
                    <td className="py-4 pr-6 text-right">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                        <ChevronRight size={16} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <ul className="divide-y divide-border/60 md:hidden">
            {pageItems.length === 0 && (
              <li className="py-16 text-center text-sm text-muted-foreground">
                No eBooks match your filters.
              </li>
            )}
            {pageItems.map((b) => (
              <li
                key={b.id}
                className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => navigate({ to: "/catalogue/$bookId", params: { bookId: b.id } })}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                    style={{ background: b.cover }}
                  >
                    {b.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-md border border-border px-1.5 py-0.5 font-semibold text-muted-foreground">
                        {b.format}
                      </span>
                      <span className="text-muted-foreground">{b.category}</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                      <StatusPill status={b.status} />
                      <span className="font-semibold">
                        {b.price === null ? "Free" : `₹${b.price.toFixed(2)}`}
                      </span>
                      <span className="text-muted-foreground">{b.author}</span>
                    </div>
                    {b.isbn && (
                      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                        ISBN {b.isbn}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="mt-1 shrink-0 text-muted-foreground" />
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