import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  Globe,
  CheckCircle2,
  XCircle,
  CircleOff,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { seedBooks, type Status } from "@/lib/catalogue-data";

export const Route = createFileRoute("/catalogue_/$bookId")({
  component: EBookDetailPage,
});

/* ------------------------------------------------------------------ */
/*  Mock per-book extra details (language, summary, tags, price, etc.) */
/* ------------------------------------------------------------------ */

type BookExtra = {
  language: string;
  regionalName: string;
  dateOfPublication: string;
  sizeMB: string;
  viewers: number;
  summary: string;
  tags: string[];
  subCategory: string;
  gstRate: number;
};

const extraDefaults: BookExtra = {
  language: "English",
  regionalName: "—",
  dateOfPublication: "—",
  sizeMB: "0.00",
  viewers: 0,
  summary: "No summary available for this eBook.",
  tags: [],
  subCategory: "—",
  gstRate: 5,
};

const extras: Record<string, BookExtra> = {
  "nep-2020": {
    language: "English",
    regionalName: "NEP 2020 - Policy Formulation In Education",
    dateOfPublication: "06 Jan 2026",
    sizeMB: "0.65",
    viewers: 12,
    summary:
      "NEP 2020 – Policy Formulation in Education provides an accessible overview of how India's National Education Policy 2020 was developed, what it aims to achieve, and its core components within the context of education reform.",
    tags: [
      "#National Education Policy 2020",
      "#Higher Education Reforms",
      "#Curriculum Transformation",
      "#Policy Formulation",
      "#Education Reforms in India",
    ],
    subCategory: "Competitive Exams",
    gstRate: 5,
  },
};

function getExtra(id: string): BookExtra {
  return extras[id] ?? extraDefaults;
}

/* ------------------------------------------------------------------ */
/*  Shared UI pieces                                                    */
/* ------------------------------------------------------------------ */

function StatusPill({ status }: { status: Status }) {
  const map = {
    Published: {
      Icon: CheckCircle2,
      text: "text-emerald-700 dark:text-emerald-300",
      bg: "bg-emerald-500/10",
      dot: "text-emerald-500",
    },
    Rejected: {
      Icon: XCircle,
      text: "text-rose-700 dark:text-rose-300",
      bg: "bg-rose-500/10",
      dot: "text-rose-500",
    },
    Unpublished: {
      Icon: CircleOff,
      text: "text-muted-foreground",
      bg: "bg-muted",
      dot: "text-muted-foreground",
    },
  } as const;
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <s.Icon size={13} className={s.dot} />
      {status}
    </span>
  );
}

function StatusStamp({ status }: { status: Status }) {
  const map = {
    Published: { label: "PUBLISHED", color: "#059669" },
    Rejected: { label: "REJECTED", color: "#e11d48" },
    Unpublished: { label: "DRAFT", color: "#6b7280" },
  };
  const s = map[status];
  return (
    <div
      className="flex h-16 w-16 shrink-0 rotate-12 items-center justify-center rounded-full border-[3px] text-[8px] font-black uppercase tracking-widest opacity-80"
      style={{ borderColor: s.color, color: s.color }}
    >
      {s.label}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-3.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function MetaRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex gap-3 py-1 text-sm">
      <span className="w-52 shrink-0 text-muted-foreground">{label}</span>
      <span className={`font-medium text-foreground ${valueClass}`}>{value}</span>
    </div>
  );
}

function CopyBookUrlButton({ bookId }: { bookId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/catalogue/${bookId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
    >
      {copied ? (
        <>
          <Check size={15} className="text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={15} />
          Copy Book URL
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function EBookDetailPage() {
  const { bookId } = Route.useParams();
  const book = seedBooks.find((b) => b.id === bookId);

  if (!book) {
    return (
      <AppShell title="eBook Details">
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <p className="text-sm text-muted-foreground">eBook not found.</p>
          <Link
            to="/catalogue"
            className="text-sm font-medium"
            style={{ color: "var(--brand)" }}
          >
            ← Back to Catalogue
          </Link>
        </div>
      </AppShell>
    );
  }

  const extra = getExtra(bookId);
  const priceExGST =
    book.price !== null
      ? (book.price / (1 + extra.gstRate / 100)).toFixed(2)
      : null;

  return (
    <AppShell title="eBook Details">
      <div className="space-y-4 p-4 md:p-8">
        {/* Back link */}
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} />
          My Catalogue
        </Link>

        {/* ── Hero card ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Cover */}
            <div
              className="flex h-64 w-48 shrink-0 items-center justify-center self-start rounded-xl text-base font-bold text-white shadow-md"
              style={{ background: book.cover }}
            >
              {book.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold leading-snug text-foreground">
                    {book.title}
                  </h1>

                  {/* Meta badges */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">1</span>&nbsp;review
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 font-medium">
                      <Globe size={11} />
                      {extra.language}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5">
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[6px] font-black text-white"
                        style={{ background: "var(--brand)" }}
                      >
                        PB
                      </span>
                      <span>
                        <span className="text-muted-foreground">Published by </span>
                        <span className="font-semibold text-foreground">PixelBooks</span>
                      </span>
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{extra.sizeMB} MB</p>
                      <p className="text-xs text-muted-foreground">Size</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{extra.viewers}</p>
                      <p className="text-xs text-muted-foreground">Viewers</p>
                    </div>
                  </div>

                  {/* Category + Status */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {book.category}
                    </span>
                    <StatusPill status={book.status} />
                  </div>

                  {/* Price */}
                  <p className="mt-4 text-2xl font-bold text-foreground">
                    {book.price === null ? "Free" : `₹${book.price.toFixed(2)}`}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: "var(--brand)",
                        color: "var(--brand-contrast)",
                      }}
                    >
                      Preview eBook
                    </button>
                    <button className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                      Preview Sample eBook
                    </button>
                    <CopyBookUrlButton bookId={book.id} />
                  </div>
                </div>

                {/* Stamp */}
                <StatusStamp status={book.status} />
              </div>
            </div>
          </div>
        </div>

        {/* ── eBook Details ──────────────────────────────────────────── */}
        <SectionCard title="eBook Details">
          <div className="space-y-0.5">
            <MetaRow label="eBook Name:" value={book.title} />
            <MetaRow
              label="Language:"
              value={extra.language}
              valueClass="text-[var(--brand)]"
            />
            <MetaRow label="Regional Name:" value={extra.regionalName} />
            <MetaRow label="Date of Publications:" value={extra.dateOfPublication} />
            <MetaRow label="eBook Size:" value={`${extra.sizeMB} MB`} />
          </div>

          {/* Summary */}
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-sm text-muted-foreground">Summary:</p>
            <p className="text-sm leading-relaxed text-foreground">{extra.summary}</p>
          </div>

          {/* Tags */}
          {extra.tags.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2.5 text-sm text-muted-foreground">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {extra.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── SEO ───────────────────────────────────────────────────── */}
        <SectionCard title="For SEO Purpose">
          <div className="space-y-0.5">
            <MetaRow label="Meta Titles:" value="—" />
            <MetaRow label="Meta Keywords:" value="—" />
            <MetaRow label="Meta Description:" value="—" />
          </div>
        </SectionCard>

        {/* ── Author + Sub Category ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Author Details">
            <div className="inline-flex items-center gap-2.5 rounded-lg border border-border px-3 py-2">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--brand)" }}
              >
                {book.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">{book.author}</span>
            </div>
          </SectionCard>

          <SectionCard title="Sub Category">
            <p className="text-sm font-medium text-foreground">{extra.subCategory}</p>
          </SectionCard>
        </div>

        {/* ── Price Details ─────────────────────────────────────────── */}
        <SectionCard title="Price Details">
          <div className="space-y-0.5">
            <MetaRow label="Renewal Percentage (Excl. GST):" value="—" />
            <MetaRow label="GST Rate:" value={`${extra.gstRate}%`} />
            {priceExGST && (
              <>
                <MetaRow label="Unit Price (excl. GST):" value={`₹${priceExGST}`} />
                <MetaRow
                  label="Unit Price (incl. GST):"
                  value={`₹${book.price!.toFixed(2)}`}
                />
              </>
            )}
            <MetaRow label="Offer Price (excl. GST):" value="—" />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">Selling Price including GST:</p>
            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: "var(--brand)" }}
            >
              {book.price === null ? "Free" : `₹${book.price.toFixed(2)}`}
            </p>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2.5 border-t border-border pt-4 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 accent-[var(--brand)]"
            />
            I hereby confirm that the eBook includes a print version and therefore is subject to the GST
            rate of 5%.
          </label>
        </SectionCard>
      </div>
    </AppShell>
  );
}
