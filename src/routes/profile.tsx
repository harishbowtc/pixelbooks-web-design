import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, CheckCircle2, ChevronDown, X, Copy, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PixelBooks" },
      { name: "description", content: "Manage your publisher profile, billing address, contact and account details." },
      { property: "og:title", content: "Profile — PixelBooks" },
      { property: "og:description", content: "Manage your publisher profile, billing address, contact and account details." },
    ],
  }),
  component: ProfilePage,
});

type FieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChange?: (v: string) => void;
  rightSlot?: React.ReactNode;
  placeholder?: string;
};

function Field({ label, required, value, onChange, rightSlot, placeholder }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex h-12 w-full rounded-lg border border-input bg-white px-4 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  required,
  value,
  onClear,
}: {
  label: string;
  required?: boolean;
  value: string;
  onClear?: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative flex h-12 w-full items-center rounded-lg border border-input bg-white px-4 text-sm text-foreground">
        <span className="flex-1">{value}</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          {onClear && (
            <button type="button" onClick={onClear} className="hover:text-foreground">
              <X size={16} />
            </button>
          )}
          <ChevronDown size={16} />
        </div>
      </div>
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
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7">
      <h2 className="mb-5 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function ProfilePage() {
  const profileBaseUrl = "azdevlibcustomer.pixelbooksapp.com/";
  const [publisherName, setPublisherName] = useState("PixelBooks");
  const [gst, setGst] = useState("32AAGCE9532N1ZB");
  const [pan, setPan] = useState("AAGCE9532N");
  const [address1, setAddress1] = useState("BrandOptics India Private LimitedUnit 403, 4th Floor, Tower B");
  const [address2, setAddress2] = useState("World Trade Center, Infopark Phase I");
  const [city, setCity] = useState("Kochi");
  const [state, setState] = useState("Kerala");
  const [pincode, setPincode] = useState("682042");
  const [country, setCountry] = useState("India");
  const [email, setEmail] = useState("Sudheer@brandoptics.com");
  const [phone, setPhone] = useState("7994833122");
  const [commission, setCommission] = useState("65");
  const [profileSlug, setProfileSlug] = useState("sj-publications");
  const [copied, setCopied] = useState(false);

  const handleCopyProfileUrl = async () => {
    const fullUrl = `${profileBaseUrl}${profileSlug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AppShell title="Profile" subtitle="Manage your publisher profile and account details.">
      <div className="space-y-8 p-4 md:p-8">
        {/* Publisher Profile */}
        <SectionCard title="Publisher Profile">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 shrink-0">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full border border-border"
                  style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                >
                  <span className="text-3xl font-bold">P</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Logo</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a logo to display on your books and publisher profile. Recommended size: 512x512px.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                    Upload Logo...
                  </button>
                  <button className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Profile URL
                <span className="text-destructive ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex h-12 flex-1 items-center overflow-hidden rounded-lg border border-input bg-white">
                  <div className="h-full min-w-[300px] border-r border-input bg-secondary/40 px-4 text-sm text-muted-foreground flex items-center">
                    {profileBaseUrl}
                  </div>
                  <input
                    value={profileSlug}
                    onChange={(e) => setProfileSlug(e.target.value)}
                    className="h-full min-w-0 flex-1 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
                    placeholder="your-publisher-name"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopyProfileUrl}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Copy profile URL"
                  title={copied ? "Copied" : "Copy URL"}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Contact Details */}
        <SectionCard title="Contact Details">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field
              label="Email"
              required
              value={email}
              onChange={setEmail}
              rightSlot={<span className="text-sm font-medium" style={{ color: "var(--success)" }}>Verified</span>}
            />
            <Field
              label="Phone Number"
              required
              value={phone}
              onChange={setPhone}
              rightSlot={<span className="text-sm font-medium" style={{ color: "var(--success)" }}>Verified</span>}
            />
          </div>
        </SectionCard>

        {/* Billing Address */}
        <SectionCard title="Billing Address">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field label="Publisher Name" required value={publisherName} onChange={setPublisherName} />
            <Field label="GST Number" required value={gst} onChange={setGst} />
            <Field label="PAN" required value={pan} onChange={setPan} />
            <Field label="Address Line 1" required value={address1} onChange={setAddress1} />
            <Field label="Address Line 2" value={address2} onChange={setAddress2} />
            <Field label="City" required value={city} onChange={setCity} />
            <SelectField label="State" required value={state} onClear={() => setState("")} />
            <Field label="Pincode" required value={pincode} onChange={setPincode} />
            <Field label="Country" required value={country} onChange={setCountry} />
          </div>
        </SectionCard>

        {/* Account & Commission */}
        <SectionCard title="Account & Commission Details">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            <section className="space-y-5">
              <h2 className="text-base font-semibold text-foreground">Account Details</h2>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                  <span className="text-sm font-semibold text-foreground">Active Bank Account</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Account Holder Name : </span>
                    PixelBooks
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Bank Account Number : </span>
                    626705500430
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">IFSC Code: </span>
                    ICIC0006267
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Bank Name : </span>
                    ICICI BANK LIMITED,KOTTAYAM
                  </p>
                </div>
                <button className="mt-5 inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary">
                  Manage Bank Account
                </button>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-base font-semibold text-foreground">Commission Details</h2>
              <div className="max-w-md">
                <Field label="Commission Rate %" value={commission} onChange={setCommission} />
              </div>
            </section>
          </div>
        </SectionCard>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <button className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
          <button
            className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            Update Details
          </button>
        </div>
      </div>
    </AppShell>
  );
}