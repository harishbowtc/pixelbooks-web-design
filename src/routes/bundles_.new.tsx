import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Upload,
  X,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { WizardStepper } from "@/components/wizard-stepper";

export const Route = createFileRoute("/bundles_/new")({
  head: () => ({
    meta: [
      { title: "Add New Bundle — PixelBooks" },
      { name: "description", content: "Create a curated eBook bundle in three quick steps." },
    ],
  }),
  component: NewBundleWizardPage,
});

type Step = 1 | 2 | 3;

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: "Add Details" },
  { id: 2, label: "Choose eBooks" },
  { id: 3, label: "Create Bundle" },
];

const gradients = [
  "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.32 0.09 240))",
  "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  "linear-gradient(160deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
  "linear-gradient(160deg, oklch(0.5 0.12 200), oklch(0.32 0.07 200))",
];

type Ebook = {
  id: string;
  title: string;
  author: string;
  price: number;
  cover: string;
  initials: string;
};

const availableBooks: Ebook[] = [
  { id: "b1", title: "NEP 2020 - Policy Formulation", author: "Dr. Ashok Alex", price: 3.15, cover: gradients[0], initials: "NEP" },
  { id: "b2", title: "Knowledge for the Time", author: "John Timbs", price: 2.5, cover: gradients[1], initials: "KFT" },
  { id: "b3", title: "The Curtiss Aviation Book", author: "Glenn Curtiss", price: 1.05, cover: gradients[2], initials: "AVI" },
  { id: "b4", title: "Essays on Art", author: "Clutton Brock", price: 5.25, cover: gradients[3], initials: "ART" },
  { id: "b5", title: "The Elements of Style", author: "William Strunk Jr.", price: 2.1, cover: gradients[4], initials: "STY" },
  { id: "b6", title: "Meditations", author: "Marcus Aurelius", price: 4.5, cover: gradients[5], initials: "MED" },
  { id: "b7", title: "The Art of War", author: "Sun Tzu", price: 2.99, cover: gradients[0], initials: "WAR" },
  { id: "b8", title: "The Republic", author: "Plato", price: 3.75, cover: gradients[1], initials: "REP" },
];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}
      {required && <span className="ml-1 text-[var(--danger)]">*</span>}
    </label>
  );
}

function NewBundleWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pricing, setPricing] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 2
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Step 3
  const [submitted, setSubmitted] = useState(false);

  const filteredBooks = useMemo(
    () =>
      availableBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const selectedBooks = availableBooks.filter((b) => selected.has(b.id));
  const originalTotal = selectedBooks.reduce((sum, b) => sum + b.price, 0);

  const canGoNext =
    (step === 1 && name.trim().length > 0 && summary.trim().length > 0 && tags.length > 0) ||
    (step === 2 && selected.size >= 1) ||
    step === 3;

  const addTag = () => {
    const v = tagInput.trim();
    if (!v || tags.length >= 3 || tags.includes(v)) return;
    setTags([...tags, v]);
    setTagInput("");
  };

  const toggleBook = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onCoverChange = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleCreate = () => {
    setSubmitted(true);
    setTimeout(() => navigate({ to: "/bundles" }), 1500);
  };

  return (
    <AppShell title="eBook Bundles" subtitle="Create a new curated bundle in three quick steps.">
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <Link
            to="/bundles"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to Bundles
          </Link>
        </div>

        <WizardStepper steps={STEPS} current={step} />

        {/* Panel */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Bundle Details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Give your bundle a distinctive name, summary, and cover image.
                </p>
              </div>

              <div>
                <FieldLabel required>Enter Bundle Name</FieldLabel>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monsoon Reads Collection"
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <FieldLabel required>Summary</FieldLabel>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={6}
                  placeholder="eBook summary…"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <FieldLabel>Bundle Cover</FieldLabel>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-10 text-center transition-colors hover:border-[var(--brand)] hover:bg-secondary/50"
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-32 w-24 rounded-md object-cover shadow-sm"
                    />
                  ) : (
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
                    >
                      <ImageIcon size={26} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Kindly upload a JPEG or PNG file
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      438×678 pixels (or 2x scale), less than 2 MB
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold"
                  >
                    <Upload size={14} />
                    Upload
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => onCoverChange(e.target.files?.[0])}
                  />
                </div>
              </div>

              <div>
                <FieldLabel required>Tags</FieldLabel>
                <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
                    >
                      {t}
                      <button
                        onClick={() => setTags(tags.filter((x) => x !== t))}
                        className="hover:opacity-70"
                        aria-label={`Remove ${t}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.endsWith(" ")) {
                        const v = val.trim();
                        if (v && tags.length < 3 && !tags.includes(v)) {
                          setTags([...tags, v]);
                        }
                        setTagInput("");
                      } else {
                        setTagInput(val);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      } else if (e.key === "Backspace" && !tagInput && tags.length) {
                        setTags(tags.slice(0, -1));
                      }
                    }}
                    placeholder={tags.length >= 3 ? "Maximum reached" : "Type and press space or Enter"}
                    disabled={tags.length >= 3}
                    className="flex-1 min-w-32 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Press space or Enter after each tag</span>
                  <span>Maximum 3 keywords</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-foreground">Choose eBooks</h2>
                <p className="text-sm text-muted-foreground">
                  Pick the titles that belong in this bundle. {selected.size} selected.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title or author"
                  className="h-11 w-full rounded-lg border border-border bg-card pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
                />
              </div>

              <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
                {filteredBooks.length === 0 && (
                  <li className="py-12 text-center text-sm text-muted-foreground">
                    No eBooks match your search.
                  </li>
                )}
                {filteredBooks.map((b) => {
                  const isSel = selected.has(b.id);
                  return (
                    <li
                      key={b.id}
                      onClick={() => toggleBook(b.id)}
                      className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-secondary/40"
                      style={isSel ? { backgroundColor: "color-mix(in oklch, var(--brand) 6%, transparent)" } : undefined}
                    >
                      <div
                        className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm"
                        style={{ background: b.cover }}
                      >
                        {b.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{b.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{b.author}</p>
                      </div>
                      <span className="text-sm font-medium text-foreground">₹{b.price.toFixed(2)}</span>
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded border transition-colors"
                        style={{
                          backgroundColor: isSel ? "var(--brand)" : "transparent",
                          borderColor: isSel ? "var(--brand)" : "var(--border)",
                        }}
                      >
                        {isSel && <Check size={13} color="var(--brand-contrast)" strokeWidth={3} />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {step === 3 && !submitted && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Review & Create Bundle</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set your bundle pricing and confirm the details below.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-5">
                  <div className="rounded-xl border border-border bg-secondary/30 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Bundle Name
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">{name || "—"}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                          style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel required>Bundle Pricing (₹)</FieldLabel>
                    <input
                      value={pricing}
                      onChange={(e) => setPricing(e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder={originalTotal > 0 ? `Suggested: ${(originalTotal * 0.7).toFixed(2)}` : "0.00"}
                      className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-[var(--brand)]"
                    />
                    {originalTotal > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Sum of individual titles: ₹{originalTotal.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen size={13} />
                    {selectedBooks.length} eBooks
                  </div>
                  <ul className="mt-4 max-h-72 space-y-3 overflow-auto pr-1">
                    {selectedBooks.map((b) => (
                      <li key={b.id} className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-8 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
                          style={{ background: b.cover }}
                        >
                          {b.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground">{b.title}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{b.author}</p>
                        </div>
                        <span className="text-xs font-medium">₹{b.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 3 && submitted && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in oklch, var(--success) 15%, transparent)" }}
              >
                <CheckCircle2 size={32} color="var(--success)" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Bundle Created</h3>
              <p className="mt-1 text-sm text-muted-foreground">Redirecting to your bundles…</p>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!submitted && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => (step === 1 ? navigate({ to: "/bundles" }) : setStep((step - 1) as Step))}
              className="h-11 rounded-lg border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            {step < 3 ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate({ to: "/bundles" })}
                  className="h-11 rounded-lg border px-5 text-sm font-semibold transition-colors hover:bg-secondary"
                  style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                >
                  Save as Draft
                </button>
                <button
                  disabled={!canGoNext}
                  onClick={() => setStep((step + 1) as Step)}
                  className="h-11 rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate({ to: "/bundles" })}
                  className="h-11 rounded-lg border px-5 text-sm font-semibold transition-colors hover:bg-secondary"
                  style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                >
                  Save as Draft
                </button>
                <button
                  disabled={!pricing || selectedBooks.length === 0}
                  onClick={handleCreate}
                  className="h-11 rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  Create Bundle
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}