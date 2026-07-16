import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/publisher/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PixelBooks" },
      { name: "description", content: "Manage app preferences, password, and policies." },
      { property: "og:title", content: "Settings — PixelBooks" },
      { property: "og:description", content: "Manage app preferences, password, and policies." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors"
      style={{ backgroundColor: checked ? "var(--brand)" : "hsl(var(--muted))" }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(24px)" : "translateX(4px)" }}
      />
    </button>
  );
}

function BrandButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-lg px-5 text-sm font-semibold hover:opacity-90"
      style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
    >
      {children}
    </button>
  );
}

type RowProps = {
  label: string;
  action: React.ReactNode;
};

function Row({ label, action }: RowProps) {
  return (
    <div className="flex items-center justify-between py-5">
      <span className="text-sm text-foreground">{label}</span>
      {action}
    </div>
  );
}

function SettingsPage() {
  const [push, setPush] = useState(true);

  return (
    <AppShell title="Settings" subtitle="Manage app preferences and account security.">
      <div className="space-y-8 p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card px-6 divide-y divide-border">
          <Row label="Push Notifications" action={<Toggle checked={push} onChange={setPush} />} />
          <Row label="Password" action={<BrandButton>Change</BrandButton>} />
          <Row label="Privacy Policy" action={<BrandButton>View</BrandButton>} />
          <Row label="Terms and Conditions" action={<BrandButton>View</BrandButton>} />
        </div>
      </div>
    </AppShell>
  );
}
