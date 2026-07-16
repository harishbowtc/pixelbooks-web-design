import { Check, ChevronRight } from "lucide-react";

export type WizardStep = { id: number; label: string };

export function WizardStepper({ steps, current }: { steps: WizardStep[]; current: number }) {
  return (
    <nav
      aria-label="Progress"
      className="flex h-[52px] items-center overflow-x-auto rounded-xl border border-border bg-card px-4"
    >
      <ol className="flex w-full items-center justify-between gap-1">
        {steps.map((s, i) => {
          const done = current > s.id;
          const active = current === s.id;
          return (
            <li key={s.id} className="flex items-center gap-1">
              {active ? (
                <div
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--brand) 10%, transparent)",
                    borderColor: "color-mix(in oklch, var(--brand) 25%, transparent)",
                  }}
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
                  >
                    {s.id}
                  </span>
                  <span
                    className="whitespace-nowrap text-sm font-semibold"
                    style={{ color: "var(--brand)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ) : (
                <div className={`flex items-center gap-2 ${done ? "" : "opacity-60"}`}>
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={
                      done
                        ? { backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }
                        : { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }
                    }
                  >
                    {done ? <Check size={12} strokeWidth={3} /> : s.id}
                  </span>
                  <span
                    className="hidden whitespace-nowrap text-sm font-medium sm:inline"
                    style={{
                      color: done ? "var(--brand)" : "var(--muted-foreground)",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              )}
              {i < steps.length - 1 && (
                <ChevronRight size={16} className="mx-1 shrink-0 text-muted-foreground/60" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
