import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Star, Globe, Copy, Check, FileX2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { seedBooks, type Book } from "@/lib/catalogue-data";
import {
  getBundleById,
  updateBundleStatus,
  type BundleStatus,
  type Bundle,
} from "@/lib/bundles-data";

export const Route = createFileRoute("/publisher/bundles/$bundleId")({
  component: EBookBundleDetailPage,
});

type BundleExtra = {
  author: string;
  sizeMB: string;
  pages: number;
  viewers: string;
  mrp: number;
  summary: string;
  tags: string[];
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  bookIds: string[];
};

const extraDefaults: BundleExtra = {
  author: "Walter Isaacson",
  sizeMB: "8.5",
  pages: 240,
  viewers: "120K",
  mrp: 199,
  summary: "A curated collection of reference materials for checking the bulk setup.",
  tags: ["#Reference"],
  seoTitle: "eBook Bundle — PixelBooks",
  seoKeywords: "ebook bundle, reference guide, curated collection",
  seoDescription: "A curated collection of reference materials.",
  bookIds: ["nep-2020"],
};

const extras: Record<string, BundleExtra> = {
  "1": {
    author: "Walter Isaacson",
    sizeMB: "8.5",
    pages: 240,
    viewers: "120K",
    mrp: 199,
    summary:
      "This is a test bundle containing basic reference materials for checking the bulk setup.",
    tags: ["#Test", "#Reference"],
    seoTitle: "Test Bundle — PixelBooks",
    seoKeywords: "test bundle, reference, check setup",
    seoDescription: "This is a test bundle containing basic reference materials.",
    bookIds: ["nep-2020"],
  },
  "2": {
    author: "Walter Isaacson",
    sizeMB: "24.2",
    pages: 1120,
    viewers: "2.5M",
    mrp: 799,
    summary:
      "Monsoon Reads Collection features a handpicked selection of top fiction, philosophy, and reference works perfect for rainy day reading.",
    tags: ["#Fiction", "#Philosophy", "#MonsoonReads"],
    seoTitle: "Monsoon Reads Collection — PixelBooks",
    seoKeywords: "monsoon reads, fiction pack, philosophy pack, rain reading",
    seoDescription:
      "Monsoon Reads Collection features a handpicked selection of top fiction and philosophy.",
    bookIds: ["nep-2020", "meditations", "origin-species", "art-of-war", "republic"],
  },
  "3": {
    author: "Walter Isaacson",
    sizeMB: "15.0",
    pages: 450,
    viewers: "850K",
    mrp: 999,
    summary:
      "A delightful pack of children's classics, storybooks and educational readings to spark imagination and growth.",
    tags: ["#Kids", "#Stories", "#Education"],
    seoTitle: "Kids Storytime Pack — PixelBooks",
    seoKeywords: "kids books, storytime, children classics",
    seoDescription:
      "A delightful pack of children's classics, storybooks and educational readings.",
    bookIds: [
      "tangled-tale",
      "origin-species",
      "elements-style",
      "curtiss-aviation",
      "knowledge-time",
      "just-shaping-letters",
      "complete-history-music",
      "nep-2020",
    ],
  },
  "4": {
    author: "Walter Isaacson",
    sizeMB: "18.6",
    pages: 940,
    viewers: "4M+",
    mrp: 1499,
    summary:
      "Curated collection of top business management, strategy, style, and history books. Perfect for entrepreneurs and business leaders.",
    tags: ["#Business", "#Management", "#Strategy"],
    seoTitle: "Business Essentials — PixelBooks",
    seoKeywords: "business management, entrepreneur pack, leadership books",
    seoDescription:
      "Curated collection of top business management, strategy, style, and history books.",
    bookIds: ["art-of-war", "elements-style", "wealth-nations", "common-sense"],
  },
  "5": {
    author: "Walter Isaacson",
    sizeMB: "10.4",
    pages: 310,
    viewers: "45K",
    mrp: 399,
    summary:
      "An evocative collection of artistic and historic poems, essays, and meditations on design and literary form.",
    tags: ["#Poetry", "#Literature", "#Meditation"],
    seoTitle: "Poetry Corner — PixelBooks",
    seoKeywords: "poems, literature essays, meditations",
    seoDescription:
      "An evocative collection of artistic and historic poems, essays, and meditations.",
    bookIds: ["essays-art", "just-shaping-letters", "meditations"],
  },
};

function getExtra(id: string): BundleExtra {
  return extras[id] ?? extraDefaults;
}

function StatusStamp({ status }: { status: BundleStatus }) {
  const map = {
    Approved: {
      label: "APPROVED",
      border: "border-emerald-500",
      text: "text-emerald-500",
    },
    Rejected: {
      label: "REJECTED",
      border: "border-rose-500",
      text: "text-rose-500",
    },
    Pending: {
      label: "PENDING FOR APPROVAL",
      border: "border-gray-500",
      text: "text-gray-500",
    },
  } as const;
  const s = map[status];
  return (
    <div
      className={`flex h-20 w-20 shrink-0 rotate-12 items-center justify-center rounded-full border-[3px] p-2 text-center text-[9px] font-black uppercase tracking-widest ${s.border} ${s.text} opacity-80`}
      style={{
        textShadow: "0 1px 1px rgba(0,0,0,0.05)",
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.02)",
      }}
    >
      {s.label}
    </div>
  );
}

function OverlappingCovers({ cover, initials }: { cover: string; initials: string }) {
  return (
    <div className="relative mt-5 h-64 w-48 shrink-0 select-none">
      {/* Back book */}
      <div
        className="absolute top-0 right-0 h-56 w-38 rounded-xl opacity-40 shadow-sm border border-white/10"
        style={{
          background: cover,
          transform: "rotate(6deg) translate(14px, -8px)",
        }}
      />
      {/* Middle book */}
      <div
        className="absolute top-0 right-0 h-56 w-38 rounded-xl opacity-70 shadow-md border border-white/10"
        style={{
          background: cover,
          transform: "rotate(-3deg) translate(7px, 0px)",
        }}
      />
      {/* Front book */}
      <div
        className="absolute top-2 left-0 flex h-56 w-38 items-center justify-center rounded-xl text-base font-black text-white shadow-xl border border-white/20"
        style={{ background: cover }}
      >
        {initials}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: BundleStatus }) {
  const map = {
    Rejected: { color: "var(--danger)", Icon: FileX2 },
    Approved: { color: "var(--success)", Icon: CheckCircle2 },
    Pending: { color: "#6b7280", Icon: Clock },
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

function CopyBundleUrlButton({ bundleId }: { bundleId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/bundles/${bundleId}`;
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
          Copy Bundle URL
        </>
      )}
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-3.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function EBookBundleDetailPage() {
  const { bundleId } = Route.useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<Bundle | undefined>(() => getBundleById(bundleId));

  if (!bundle) {
    return (
      <AppShell title="Bundle Details">
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <p className="text-sm text-muted-foreground">eBook Bundle not found.</p>
          <Link to="/publisher/bundles/" className="text-sm font-medium" style={{ color: "var(--brand)" }}>
            ← Back to eBook Bundles
          </Link>
        </div>
      </AppShell>
    );
  }

  const extra = getExtra(bundleId);
  const matchedBooks = extra.bookIds
    .map((id) => seedBooks.find((sb) => sb.id === id))
    .filter((b): b is Book => !!b);

  // Formulate book prices (INR conversion factor x100)
  const totalOriginalBookPrice = matchedBooks.reduce(
    (sum, b) => sum + (b.price ? b.price * 100 : 0),
    0,
  );
  // Simulating MRP based on total book prices
  const simulatedBookMRP = totalOriginalBookPrice * 1.15;

  const handleApprove = () => {
    updateBundleStatus(bundle.id, "Approved");
    setBundle((prev) => (prev ? { ...prev, status: "Approved" } : undefined));
    toast.success("eBook Bundle has been approved successfully!");
  };

  const handleReject = () => {
    updateBundleStatus(bundle.id, "Rejected");
    setBundle((prev) => (prev ? { ...prev, status: "Rejected" } : undefined));
    toast.error("eBook Bundle status set to Rejected");
  };

  return (
    <AppShell title="Bundle Details">
      <div className="space-y-6 p-4 md:p-8 pb-24">
        {/* Back + heading */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/publisher/bundles/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold leading-tight">eBook Bundle Details</h2>
            <p className="text-sm text-muted-foreground">View bundle details and collections</p>
          </div>
        </div>

        {/* ── Hero card ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
            {/* Overlapping Covers visual */}
            <OverlappingCovers cover={bundle.cover} initials={bundle.initials} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold leading-snug text-foreground">{bundle.title}</h1>

                  {/* Meta badges */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">1</span>&nbsp;review
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 font-medium">
                      <Globe size={11} />
                      English
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5">
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[6px] font-black text-white"
                        style={{ background: "var(--brand)" }}
                      >
                        DC
                      </span>
                      <span>
                        <span className="text-muted-foreground">Published by </span>
                        <span className="font-semibold text-foreground">Dc Publishers</span>
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
                      <p className="text-sm font-semibold text-foreground">{extra.pages}</p>
                      <p className="text-xs text-muted-foreground">Pages</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{extra.viewers}</p>
                      <p className="text-xs text-muted-foreground">Viewers</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{matchedBooks.length}</p>
                      <p className="text-xs text-muted-foreground">eBooks</p>
                    </div>
                  </div>

                  {/* Category + Status */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <StatusPill status={bundle.status} />
                  </div>

                  {/* Price Display */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">₹{bundle.pricing}</span>
                    {extra.mrp > bundle.pricing && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{extra.mrp}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: "var(--brand)",
                        color: "var(--brand-contrast)",
                      }}
                    >
                      Preview Bundle
                    </button>
                    <CopyBundleUrlButton bundleId={bundle.id} />
                  </div>
                </div>

                {/* Rotated status stamp */}
                <StatusStamp status={bundle.status} />
              </div>
            </div>
          </div>
        </div>

        {/* ── eBook Bundle Collections (USER request: on top) ─────── */}
        <SectionCard title="eBook Bundle Collections">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {matchedBooks.map((b) => (
                <div
                  key={b.id}
                  className="w-36 shrink-0 rounded-lg border border-border/60 bg-secondary/10 p-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className="mx-auto flex h-36 w-28 items-center justify-center rounded-md text-xs font-bold text-white shadow-sm"
                      style={{ background: b.cover }}
                    >
                      {b.initials}
                    </div>
                    <div className="space-y-0.5">
                      <p className="truncate text-xs font-semibold text-foreground">{b.title}</p>
                      <p className="text-[10px] text-muted-foreground">{b.author}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xs font-bold">
                      {b.price ? `₹${(b.price * 100).toFixed(0)}` : "Free"}
                    </span>
                    {b.price && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        ₹{(b.price * 120).toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-secondary/30 px-5 py-3.5 text-sm font-semibold">
              <span className="text-muted-foreground">Total eBook Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-base text-foreground">
                  ₹{totalOriginalBookPrice.toFixed(2)}
                </span>
                {simulatedBookMRP > totalOriginalBookPrice && (
                  <span className="text-xs text-muted-foreground line-through font-normal">
                    ₹{simulatedBookMRP.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── eBook Bundle Details ─────────────────────────────────── */}
        <SectionCard title="eBook Bundle Details">
          <div className="space-y-4">
            <div className="flex text-sm border-b border-border/50 pb-3">
              <span className="w-48 shrink-0 text-muted-foreground">eBook Bundle Name:</span>
              <span className="font-semibold text-foreground">{bundle.title}</span>
            </div>
            <div className="space-y-1.5 border-b border-border/50 pb-3">
              <p className="text-sm text-muted-foreground">Summary:</p>
              <p className="text-sm leading-relaxed text-foreground">{extra.summary}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Tags:</p>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {extra.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── For SEO Purpose ────────────────────────────────────────── */}
        <SectionCard title="For SEO Purpose">
          <div className="space-y-4 text-sm">
            <div className="flex border-b border-border/50 pb-3">
              <span className="w-48 shrink-0 text-muted-foreground">Meta Titles:</span>
              <span className="font-semibold text-foreground">{extra.seoTitle}</span>
            </div>
            <div className="flex border-b border-border/50 pb-3">
              <span className="w-48 shrink-0 text-muted-foreground">Meta Keyboards:</span>
              <span className="font-semibold text-foreground">{extra.seoKeywords}</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground">Meta Description:</p>
              <p className="leading-relaxed text-foreground">{extra.seoDescription}</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Sticky Footer Actions ──────────────────────────────────── */}
        <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-end gap-2 border-t border-border bg-background/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
          <button
            type="button"
            onClick={handleReject}
            className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-5 text-sm font-semibold transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Approve Bundle
          </button>
        </div>
      </div>
    </AppShell>
  );
}
