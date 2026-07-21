import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/library-admin/support")({
  component: LibraryAdminSupportPage,
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

export function LibraryAdminSupportPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !subject || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Support request sent successfully! We will get back to you shortly.");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const isFormValid = email.trim() !== "" && subject.trim() !== "" && message.trim() !== "";

  return (
    <AppShell title="Support" subtitle="Raise a support request with our team.">
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
              <h2 className="text-[15px] font-semibold text-foreground">Raise Support Request</h2>
              <p className="text-sm text-muted-foreground">
                Provide your details below to submit a support ticket.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Sender Email" required>
              <TextInput
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Subject" required>
              <TextInput
                placeholder="Enter Your Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </Field>

            <Field label="Message" required>
              <Textarea
                rows={6}
                placeholder="Enter Your Message.."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Field>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-6">
              <Link
                to="/library-admin"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors ${
                  isFormValid
                    ? "text-primary-foreground hover:opacity-90 cursor-pointer"
                    : "bg-slate-100 dark:bg-border text-slate-400 dark:text-muted-foreground cursor-not-allowed border border-border/40"
                }`}
                style={isFormValid ? { backgroundColor: "var(--brand)" } : undefined}
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </AppShell>
  );
}
