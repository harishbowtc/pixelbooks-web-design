import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  Download,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Plus,
  CheckCircle2,
  Check,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { WizardStepper } from "@/components/wizard-stepper";

export const Route = createFileRoute("/publisher/catalogue-import/new")({
  component: NewImportWizardPage,
});

type Step = 1 | 2 | 3;

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: "Export Metadata" },
  { id: 2, label: "Upload Files" },
  { id: 3, label: "Upload Excel" },
];

function InstructionSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ backgroundColor: "var(--sidebar-highlight)", color: "var(--brand)" }}
      >
        {number}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Heading + download */}
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">
          eBook Catalogue Import – Step-by-Step Instructions
        </h2>
        <button
          className="inline-flex h-11 items-center gap-2 self-start rounded-lg px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 sm:self-auto"
          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        >
          <Download size={16} strokeWidth={2.4} />
          Download Metadata
        </button>
      </div>

      <div className="space-y-6 px-6 py-6">
        <InstructionSection number="1" title="Download Metadata">
          <p>Click the download button to download metadata.</p>
          <p>Metadata will be in an Excel file.</p>
        </InstructionSection>

        <InstructionSection number="2" title="Upload Multiple Files">
          <p>
            Start by selecting multiple eBooks (PDF, ePub) and Cover images (JPG, PNG) to upload.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Click{" "}
              <span className="font-medium text-foreground">"Choose Multiple Files to Upload"</span>
            </li>
            <li>
              Supported formats:{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.pdf</code>,{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.epub</code>,{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.jpg</code>,{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.png</code>
            </li>
          </ul>
          <div
            className="mt-2 rounded-md border-l-4 p-3 text-xs"
            style={{
              borderColor: "var(--brand)",
              backgroundColor: "var(--sidebar-highlight)",
              color: "var(--foreground)",
            }}
          >
            <strong>Important:</strong> Each document (PDF/ePub) and its corresponding image
            (JPG/PNG) must have the same file name.
            <br />
            Example: <code>book1.pdf</code> → <code>book1.jpg</code>
          </div>
        </InstructionSection>

        <InstructionSection number="3" title="View Uploaded Files">
          <p>After selecting files, they appear in a list.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Preview file details like name, type, and cover image</li>
            <li>
              Remove individual files if needed by clicking the remove button next to each file
            </li>
            <li>
              Click <span className="font-medium text-foreground">"Add More Files"</span> to include
              additional items
            </li>
          </ul>
        </InstructionSection>

        <InstructionSection number="4" title="Upload Excel File">
          <p>For bulk metadata import, upload an Excel sheet.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Click{" "}
              <span className="font-medium text-foreground">"Choose Excel File to Upload"</span>
            </li>
            <li>Make sure the file follows the required format</li>
            <li>Click upload and submit</li>
          </ul>
        </InstructionSection>

        <InstructionSection number="5" title="Upload Complete">
          <p>Your files will begin uploading.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>A progress bar will indicate the upload percentage</li>
            <li>
              You'll see a{" "}
              <span className="font-medium text-foreground">"Successfully Uploaded"</span> message
            </li>
            <li>Files will be imported and sent for approval</li>
            <li>A notification will be sent once approved</li>
          </ul>
        </InstructionSection>

        <InstructionSection number="6" title="Handle Failed Uploads">
          <p>
            If any files fail to upload (due to a network interruption, server timeout, file
            corruption, or similar issue):
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              A <span className="font-medium text-foreground">"Failed Files"</span> dialog will
              appear
            </li>
            <li>
              The reason for the failure will be displayed (e.g., "File name exceeds maximum length
              allowed" or "Network connection lost")
            </li>
            <li>
              You must re-upload the entire file from the beginning — incomplete uploads cannot be
              processed or stored by the system
            </li>
            <li>
              Click <span className="font-medium text-foreground">"Cancel"</span> to resolve the
              issue and start the upload again
            </li>
          </ul>
        </InstructionSection>
      </div>

      <div className="flex justify-end border-t border-border px-6 py-4">
        <button
          onClick={onNext}
          className="inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        >
          Continue to Upload Files
        </button>
      </div>
    </div>
  );
}

type PickedFile = { name: string; size: number; kind: "doc" | "image" };

function humanSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function Step2({
  files,
  setFiles,
  onBack,
  onNext,
}: {
  files: PickedFile[];
  setFiles: React.Dispatch<React.SetStateAction<PickedFile[]>>;
  onBack: () => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    const added: PickedFile[] = [];
    for (const f of Array.from(list)) {
      const ext = f.name.split(".").pop()?.toLowerCase();
      const kind: PickedFile["kind"] =
        ext === "jpg" || ext === "jpeg" || ext === "png" ? "image" : "doc";
      added.push({ name: f.name, size: f.size, kind });
    }
    setFiles((prev) => [...prev, ...added]);
    e.target.value = "";
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">Upload Files</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select eBooks (PDF, ePub) and matching cover images (JPG, PNG).
        </p>
      </div>

      <div className="space-y-4 px-6 py-6">
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors hover:bg-secondary/40"
          style={{ borderColor: "var(--border)" }}
        >
          <Upload size={28} style={{ color: "var(--brand)" }} />
          <p className="text-sm font-semibold text-foreground">Choose Multiple Files to Upload</p>
          <p className="text-xs text-muted-foreground">Supported: .pdf, .epub, .jpg, .png</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.epub,.jpg,.jpeg,.png"
            className="hidden"
            onChange={pick}
          />
        </label>

        {files.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </p>
              <button
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                style={{ color: "var(--brand)" }}
              >
                <Plus size={14} /> Add More Files
              </button>
            </div>
            <ul className="divide-y divide-border">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: "var(--sidebar-highlight)" }}
                  >
                    {f.kind === "image" ? (
                      <ImageIcon size={17} style={{ color: "var(--brand)" }} />
                    ) : (
                      <FileText size={17} style={{ color: "var(--brand)" }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.kind === "image" ? "Cover image" : "Document"} · {humanSize(f.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label={`Remove ${f.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <button
          onClick={onBack}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={files.length === 0}
          className="inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        >
          Continue to Excel Upload
        </button>
      </div>
    </div>
  );
}

function Step3({
  excel,
  setExcel,
  onBack,
  onSubmit,
  status,
}: {
  excel: File | null;
  setExcel: (f: File | null) => void;
  onBack: () => void;
  onSubmit: () => void;
  status: "idle" | "uploading" | "success";
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">Upload Excel</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload the completed metadata Excel file.
        </p>
      </div>

      <div className="space-y-4 px-6 py-6">
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors hover:bg-secondary/40"
          style={{ borderColor: "var(--border)" }}
        >
          <FileSpreadsheet size={28} style={{ color: "var(--brand)" }} />
          <p className="text-sm font-semibold text-foreground">Choose Excel File to Upload</p>
          <p className="text-xs text-muted-foreground">.xlsx, .xls</p>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => setExcel(e.target.files?.[0] ?? null)}
          />
        </label>

        {excel && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: "var(--sidebar-highlight)" }}
            >
              <FileSpreadsheet size={18} style={{ color: "var(--brand)" }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{excel.name}</p>
              <p className="text-xs text-muted-foreground">{humanSize(excel.size)}</p>
            </div>
            <button
              onClick={() => setExcel(null)}
              aria-label="Remove excel file"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {status === "uploading" && (
          <div className="rounded-lg border border-border p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Uploading…</span>
              <span className="text-muted-foreground">Please wait</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full animate-pulse"
                style={{ width: "65%", backgroundColor: "var(--brand)" }}
              />
            </div>
          </div>
        )}

        {status === "success" && (
          <div
            className="flex items-start gap-3 rounded-lg border p-4"
            style={{
              borderColor: "color-mix(in oklch, var(--success) 40%, transparent)",
              backgroundColor: "color-mix(in oklch, var(--success) 10%, transparent)",
            }}
          >
            <CheckCircle2 size={20} style={{ color: "var(--success)" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>
                Successfully Uploaded
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Files have been sent for approval. You'll be notified once approved.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <button
          onClick={onBack}
          disabled={status === "uploading"}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!excel || status !== "idle"}
          className="inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        >
          <Upload size={16} /> Upload & Submit
        </button>
      </div>
    </div>
  );
}

function NewImportWizardPage() {
  const [step, setStep] = useState<Step>(1);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [excel, setExcel] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success">("idle");
  const navigate = useNavigate();

  function submit() {
    setStatus("uploading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => navigate({ to: "/publisher/catalogue-import/" }), 1400);
    }, 1600);
  }

  return (
    <AppShell title="Catalogue Import" subtitle="Bulk-upload your eBook metadata via spreadsheet.">
      <div className="space-y-6 p-4 md:p-8">
        <Link
          to="/publisher/catalogue-import/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to imports
        </Link>

        <WizardStepper steps={STEPS} current={step} />

        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && (
          <Step2
            files={files}
            setFiles={setFiles}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            excel={excel}
            setExcel={setExcel}
            onBack={() => setStep(2)}
            onSubmit={submit}
            status={status}
          />
        )}
      </div>
    </AppShell>
  );
}

// Silence unused import warning for AlertCircle (kept available for future error UI)
void AlertCircle;
