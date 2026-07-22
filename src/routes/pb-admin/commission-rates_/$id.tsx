import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/pb-admin/commission-rates_/$id")({
  component: CommissionRatesDetail,
});

function CommissionRatesDetail() {
  const navigate = useNavigate();
  // Using fixed mock data matching the screenshot since this is a UI prototype
  const authorData = {
    name: "Werley Nortreus",
    country: "India",
    pan: "ASDFG4567Y",
    gst: "Enter GST Number",
    address1: "Sharma Market, Shiv Mandir, Main Dadri Road, Sector 102, Noida, Uttar Pradesh",
    address2: "Enter Address Line 2",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201304",
    email: "nimisha+51@brandoptics.com",
    phone: "7778889990",
    accountDetails: "No data found",
    commissionRate: "15",
  };

  return (
    <AppShell title="Publisher Details" subtitle="View details and set commission pricing.">
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        {/* Main Content Form */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <Link
                to="/pb-admin/commission-rates"
                className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors pb-2"
              >
                <ArrowLeft size={16} className="mr-1.5" />
                Back to Commission Rates
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              {/* Avatar Section */}
              <div className="mb-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted border-4 border-background shadow-sm">
                  <BookOpen size={32} className="text-muted-foreground/50 opacity-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-foreground">Company Address</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Author Name
                        </label>
                        <input
                          readOnly
                          value={authorData.name}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          PAN Card
                        </label>
                        <input
                          readOnly
                          value={authorData.pan}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Address Line 2
                        </label>
                        <input
                          readOnly
                          value={authorData.address2}
                          placeholder="Enter Address Line 2"
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors text-muted-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          City
                        </label>
                        <input
                          readOnly
                          value={authorData.city}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 mt-8 text-sm font-bold text-foreground">Contact Details</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Email
                        </label>
                        <input
                          readOnly
                          value={authorData.email}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 mt-8 text-sm font-bold text-foreground">Account Details</h3>
                    <div className="space-y-5">
                      <div>
                        <input
                          readOnly
                          value={authorData.accountDetails}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-foreground">Choose Country</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Country
                        </label>
                        <input
                          readOnly
                          value={authorData.country}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          GST Number
                        </label>
                        <input
                          readOnly
                          value={authorData.gst}
                          placeholder="Enter GST Number"
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors text-muted-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Address Line 1
                        </label>
                        <input
                          readOnly
                          value={authorData.address1}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Pincode
                        </label>
                        <input
                          readOnly
                          value={authorData.pincode}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          State
                        </label>
                        <input
                          readOnly
                          value={authorData.state}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 mt-[3.2rem] text-sm font-bold opacity-0">Spacer</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                          Phone Number
                        </label>
                        <input
                          readOnly
                          value={authorData.phone}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 mt-8 text-sm font-bold text-foreground">
                      Add Commission Details
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                          Commission Rate % <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          defaultValue={authorData.commissionRate}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--brand)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={() => navigate({ to: "/pb-admin/commission-rates" })}
                className="rounded-lg bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-[var(--brand-contrast)] shadow-[0_4px_16px_-8px_var(--brand-glow)] transition-opacity hover:opacity-90 active:scale-95"
              >
                Update Commission
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
