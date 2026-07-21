import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/pb-admin/commission-rates")({
  component: CommissionRates,
});

const commissionData = [
  { name: "Werley Nortreus", type: "Author", rate: "15%", date: "14 Jul 2026", coverColor: "var(--muted-foreground)" },
  { name: "RJ Authors", type: "Author", rate: "15%", date: "10 Jul 2026", coverColor: "var(--brand)" },
  { name: "QA-TBH Publishers", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "var(--muted-foreground)" },
  { name: "Abu", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "var(--muted-foreground)" },
  { name: "qa test pub", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "var(--muted-foreground)" },
  { name: "Veena", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "oklch(0.55 0.13 260)" },
  { name: "QA", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "var(--muted-foreground)" },
  { name: "QA-TBH Publishers And Distributors", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "var(--muted-foreground)" },
  { name: "OBook Publication", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "var(--muted-foreground)" },
  { name: "SP Publications", type: "Publisher", rate: "15%", date: "10 Jul 2026", coverColor: "var(--muted-foreground)" },
];

function CommissionRates() {
  const navigate = useNavigate();

  return (
    <AppShell title="Commission" subtitle="View and manage commission rates across your network.">
      <div className="space-y-6 p-4 md:p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-6 pr-4 font-semibold">Name</th>
                  <th className="py-4 px-4 font-semibold whitespace-nowrap">Commission Rate</th>
                  <th className="py-4 pl-4 pr-6 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {commissionData.map((item, i) => (
                  <tr 
                    key={i} 
                    onClick={() => navigate({ to: "/pb-admin/commission-rates/$id", params: { id: "1" } })}
                    className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/50"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm overflow-hidden"
                          style={{ background: item.coverColor }}
                        >
                          {item.coverColor === "var(--muted-foreground)" && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-70">
                              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </svg>
                          )}
                          {item.name === "RJ Authors" && (
                            <div className="w-full h-full bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] opacity-80" />
                          )}
                          {item.name === "Veena" && (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white pt-2">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug text-foreground text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-foreground">{item.rate}</td>
                    <td className="py-4 pl-4 pr-6 text-right">
                      <div className="flex items-center justify-between gap-4 text-muted-foreground">
                        <span>{item.date}</span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                          <ChevronRight size={16} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="border-t border-border/40 bg-card px-4 py-3 flex items-center justify-between text-xs font-semibold text-muted-foreground md:px-6 md:py-4">
            <span>Showing 10 from 240 results</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                <span>«</span> Previous
              </button>
              <div className="flex items-center gap-1 mx-2">
                {["1", "2", "3", "4", "5"].map((page) => (
                  <button
                    key={page}
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${page === "1" ? "bg-sidebar-highlight text-brand" : "hover:bg-card hover:text-foreground transition-colors"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1 text-foreground hover:text-brand transition-colors">
                Next <span>»</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}