import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Search, ChevronDown } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/pb-admin/commission-rates")({
  component: CommissionRates,
});

const commissionData = [
  {
    name: "Werley Nortreus",
    type: "Author",
    rate: "15%",
    date: "14 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
  {
    name: "RJ Authors",
    type: "Author",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--brand)",
  },
  {
    name: "QA-TBH Publishers",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
  {
    name: "Abu",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
  {
    name: "qa test pub",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
  {
    name: "Veena",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "oklch(0.55 0.13 260)",
  },
  {
    name: "QA",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
  {
    name: "QA-TBH Publishers And Distributors",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
  {
    name: "OBook Publication",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
  {
    name: "SP Publications",
    type: "Publisher",
    rate: "15%",
    date: "10 Jul 2026",
    coverColor: "var(--muted-foreground)",
  },
];

function CommissionRates() {
  const navigate = useNavigate();
  const [publisherFilter, setPublisherFilter] = useState("Publisher & Author");
  const [publisherFilterOpen, setPublisherFilterOpen] = useState(false);

  const [rateFilter, setRateFilter] = useState("Rate Type");
  const [rateFilterOpen, setRateFilterOpen] = useState(false);

  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState("");

  const handleUpdateCommission = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate update logic
    setIsCommissionModalOpen(false);
    setNewCommissionRate("");
  };

  return (
    <AppShell
      title="Commission Rates"
      subtitle="View and manage commission rates across your network."
    >
      <div className="space-y-6 p-4 md:p-8">
        {/* Top Controls: Search & Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 w-full lg:max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-border bg-white dark:bg-card pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] text-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:gap-3 w-full lg:w-auto">
            {/* Publisher & Author Custom Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setPublisherFilterOpen(!publisherFilterOpen);
                  setRateFilterOpen(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium sm:w-48 text-foreground cursor-pointer"
              >
                <span>{publisherFilter}</span>
                <ChevronDown size={15} className="text-muted-foreground" />
              </button>
              {publisherFilterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-48">
                  {["Publisher & Author", "Publisher", "Author"].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPublisherFilter(p);
                        setPublisherFilterOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                        p === publisherFilter
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rate Type Custom Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setRateFilterOpen(!rateFilterOpen);
                  setPublisherFilterOpen(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-6 rounded-lg border border-border bg-card px-3 text-sm font-medium sm:w-36 text-foreground cursor-pointer"
              >
                <span>{rateFilter}</span>
                <ChevronDown size={15} className="text-muted-foreground" />
              </button>
              {rateFilterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-36">
                  {["Rate Type", "All", "Default Rate", "Other Rate"].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setRateFilter(p);
                        setRateFilterOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                        p === rateFilter ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Set Commission Rate Action */}
            <button
              onClick={() => setIsCommissionModalOpen(true)}
              disabled={publisherFilter === "Publisher & Author"}
              className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[oklch(0.96_0.02_200)] text-[oklch(0.4_0.1_200)] border border-[oklch(0.85_0.05_200)] px-4 py-2 text-sm font-semibold transition-all hover:bg-[oklch(0.92_0.04_200)] hover:border-[oklch(0.7_0.1_200)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[oklch(0.96_0.02_200)] disabled:hover:border-[oklch(0.85_0.05_200)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a1 1 0 0 1-1.276-1.276l.838-2.872a2 2 0 0 1 .506-.854z" />
                <path d="m15 5 3 3" />
              </svg>
              Bulk Update Rates
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-4 md:p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Name</th>
                  <th className="pb-3 px-4 font-semibold whitespace-nowrap">Commission Rate</th>
                  <th className="pb-3 px-4 font-semibold">Date</th>
                  <th className="pb-3 pl-4 font-semibold text-right pr-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {commissionData.map((item, i) => (
                  <tr
                    key={i}
                    onClick={() =>
                      navigate({ to: "/pb-admin/commission-rates/$id", params: { id: "1" } })
                    }
                    className="group border-b border-border/60 transition-colors last:border-0 cursor-pointer hover:bg-secondary/30"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground overflow-hidden">
                          {item.coverColor === "var(--muted-foreground)" ? (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4"
                            >
                              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </svg>
                          ) : item.name === "RJ Authors" ? (
                            <div className="w-full h-full bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] opacity-80" />
                          ) : item.name === "Veena" ? (
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-full h-full text-white pt-2 bg-[oklch(0.55_0.13_260)]"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4"
                            >
                              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </svg>
                          )}
                        </span>
                        <div className="min-w-0">
                          <span className="font-medium text-foreground block truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground block truncate">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-foreground text-xs sm:text-sm">
                      {item.rate}
                    </td>
                    <td className="py-4 px-4 font-medium text-muted-foreground text-xs sm:text-sm">
                      {item.date}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                        <ChevronRight size={16} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Pagination Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
          <span className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">10</span> from{" "}
            <span className="font-semibold text-foreground">240</span> results
          </span>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-white dark:bg-card px-2.5 text-xs font-semibold text-muted-foreground opacity-50 cursor-not-allowed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Previous</span>
            </button>
            <button className="h-8 w-8 rounded-lg text-xs font-semibold border transition-all bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800">
              1
            </button>
            <button className="h-8 w-8 rounded-lg text-xs font-semibold border transition-all bg-white dark:bg-card text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground">
              2
            </button>
            <button className="h-8 w-8 rounded-lg text-xs font-semibold border transition-all bg-white dark:bg-card text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground">
              3
            </button>
            <span className="text-muted-foreground mx-1">...</span>
            <button className="h-8 w-8 rounded-lg text-xs font-semibold border transition-all bg-white dark:bg-card text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground">
              24
            </button>
            <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-white dark:bg-card px-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors">
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Set Commission Modal Dialog */}
        <Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
          <DialogContent className="max-w-md bg-card border border-border rounded-xl shadow-xl p-6">
            <div className="border-b border-border pb-4 mb-4">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Set new commission rate
              </DialogTitle>
            </div>

            <form onSubmit={handleUpdateCommission} className="space-y-6 text-sm overflow-visible">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Select User Type</label>
                  <div className="relative">
                    <select
                      value={publisherFilter !== "Publisher & Author" ? publisherFilter : "Publisher"}
                      onChange={(e) => setPublisherFilter(e.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-border bg-white dark:bg-card px-3 text-sm focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                    >
                      <option value="Publisher">Publisher</option>
                      <option value="Author">Author</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Rate Filter Scope</label>
                  <div className="relative">
                    <select
                      value={rateFilter !== "Rate Type" ? rateFilter : ""}
                      onChange={(e) => setRateFilter(e.target.value || "Rate Type")}
                      className="h-10 w-full appearance-none rounded-lg border border-border bg-white dark:bg-card px-3 text-sm focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                    >
                      <option value="">All Rates</option>
                      <option value="Default Rate">Default Rate</option>
                      <option value="Other Rate">Other Rate</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <label className="font-semibold text-muted-foreground">
                    Commission Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newCommissionRate}
                    onChange={(e) => setNewCommissionRate(e.target.value)}
                    placeholder="e.g. 15"
                    className="h-10 w-full rounded-lg border border-border bg-white dark:bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="h-10 rounded-lg border border-border bg-white dark:bg-card px-4 text-sm font-semibold text-muted-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[var(--brand)] text-white px-6 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
