import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/publisher/support")({
  head: () => ({
    meta: [
      { title: "Support — PixelBooks" },
      {
        name: "description",
        content: "Contact PixelBooks support for help with your publisher account.",
      },
    ],
  }),
  component: SupportPage,
});

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7">{children}</section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`h-14 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand)] ${className}`}
    />
  );
}

function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <AppShell title="Support" subtitle="Send a message to our support team.">
      <div className="space-y-6 p-4 md:p-8">
        <SectionCard>
          <div className="mb-6 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--sidebar-highlight)" }}
            >
              <Mail size={18} style={{ color: "var(--brand)" }} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold">Contact Support</h2>
              <p className="text-sm text-muted-foreground">
                Describe your issue and we’ll get back to you shortly.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Subject" required>
              <TextInput
                placeholder="e.g., Payment issue, Account question..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Field>

            <Field label="Message" required>
              <Textarea
                rows={6}
                placeholder="Please provide as much detail as possible..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-6">
            <Link
              to="/publisher"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </Link>
            <button
              className="inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
