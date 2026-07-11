import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ShieldAlert, 
  Users, 
  BookMarked, 
  Building, 
  Check, 
  X, 
  ArrowLeft, 
  TrendingUp, 
  FileCheck, 
  Activity, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin")({
  component: PBAdminDashboard,
});

interface ApprovalRequest {
  id: string;
  type: "publisher" | "library" | "promocode";
  name: string;
  submittedBy: string;
  date: string;
  details: string;
}

function PBAdminDashboard() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: "req-1",
      type: "publisher",
      name: "Oxford Academic Press India",
      submittedBy: "Dr. K. Raghavan",
      date: "Today, 10:45 AM",
      details: "Requesting access to publish Higher Education catalogue (approx. 450 titles). Verified ISBN prefix."
    },
    {
      id: "req-2",
      type: "promocode",
      name: "FESTIVE50 - 50% Off Catalogue",
      submittedBy: "Jaico Publishing House",
      date: "Today, 09:15 AM",
      details: "Promo code submission: Oxford Classics, 500 max redemptions, active till Dec 2026. Needs margin review."
    },
    {
      id: "req-3",
      type: "library",
      name: "BITS Pilani Library Portal",
      submittedBy: "Prof. S. Chakrabarti",
      date: "Yesterday, 04:30 PM",
      details: "Onboarding campus library subscription tier (Academic Pro, 4500 active users, budget allocation ₹12,50,000)."
    },
    {
      id: "req-4",
      type: "publisher",
      name: "Rupa Publications Co.",
      submittedBy: "Meenakshi Sen",
      date: "Yesterday, 02:10 PM",
      details: "New publisher account onboarding. Corporate registration and GST verification completed."
    }
  ]);

  const handleAction = (id: string, action: "approve" | "reject", name: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    if (action === "approve") {
      toast.success(`Approved: ${name}`);
    } else {
      toast.error(`Rejected: ${name}`);
    }
  };

  const stats = [
    { label: "Total Active Publishers", value: "48", icon: Building, delta: "+3 this month" },
    { label: "Registered Institutions", value: "112", icon: Users, delta: "+8 this month" },
    { label: "Global Platform Volume", value: "₹48,92,400", icon: TrendingUp, delta: "+14.2% YoY" },
    { label: "System Uptime", value: "99.98%", icon: Activity, delta: "Healthy · 0 incidents" }
  ];

  const recentLogs = [
    { time: "10:52 AM", action: " oxford_press catalog import verified (412 titles)", user: "System Auto-Sync" },
    { time: "09:30 AM", action: "Updated licensing pricing model for Oxford Classics", user: "PB Admin (Self)" },
    { time: "08:15 AM", action: "Blocked IP 103.24.12.19 due to failed login threshold", user: "Security Watchdog" },
    { time: "Yesterday", action: "Approved payout of ₹4,82,900 to HarperCollins India", user: "PB Admin (Self)" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              id="pb-admin-btn-back"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert size={18} className="text-[oklch(0.60_0.18_30)]" />
                PixelBooks Admin
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Global Administration Control Panel
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[oklch(0.60_0.18_30)]/10 text-[oklch(0.60_0.18_30)] px-2.5 py-1 text-xs font-semibold">
              Super Admin Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                  <span className="text-[11px] text-emerald-500 font-semibold">{s.delta}</span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Approval Panel */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Approval & Onboarding Queue</h2>
                <p className="text-xs text-muted-foreground">Review and approve publisher profiles, institution requests, and special promocodes.</p>
              </div>
              <span className="rounded-full bg-amber-500/10 text-amber-500 px-2.5 py-0.5 text-xs font-semibold">
                {requests.length} Pending
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
                <FileCheck size={40} className="mx-auto text-muted-foreground/60 mb-3" />
                <h3 className="font-semibold text-sm">Approval Queue Empty</h3>
                <p className="text-xs text-muted-foreground mt-1">All onboarding and code requests have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          req.type === "publisher" ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" :
                          req.type === "library" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" :
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {req.type} onboarding
                        </span>
                        <h3 className="font-bold text-base text-foreground mt-1.5">{req.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Submitted by {req.submittedBy} · {req.date}</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleAction(req.id, "reject", req.name)}
                          id={`btn-admin-reject-${req.id}`}
                          aria-label="Reject request"
                          className="h-8 w-8 rounded-lg border border-border bg-card flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "approve", req.name)}
                          id={`btn-admin-approve-${req.id}`}
                          aria-label="Approve request"
                          className="h-8 w-8 rounded-lg bg-[oklch(0.62_0.15_155)] flex items-center justify-center text-white hover:opacity-90 shadow-sm transition-opacity"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/90 bg-secondary/40 p-3 rounded-lg leading-relaxed font-medium">
                      {req.details}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar Info Panels */}
          <div className="space-y-6">
            {/* System Logs */}
            <section className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="font-bold text-sm tracking-tight">Recent Security & Audit Logs</h3>
                <p className="text-[11px] text-muted-foreground">Live records of system action histories.</p>
              </div>
              <ul className="space-y-3">
                {recentLogs.map((log, index) => (
                  <li key={index} className="text-xs border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1 font-semibold">
                      <span>{log.time}</span>
                      <span>{log.user}</span>
                    </div>
                    <p className="text-foreground/95 font-medium leading-normal">{log.action}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Quick Actions */}
            <section className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm">
              <h3 className="font-bold text-sm tracking-tight">Super Admin Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => toast.success("Created new global promo code template")}
                  id="btn-admin-action-promo"
                  className="w-full text-left rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Create Platform Promo Template
                </button>
                <button 
                  onClick={() => toast.success("System status logs exported")}
                  id="btn-admin-action-export"
                  className="w-full text-left rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Export Diagnostics & Logs
                </button>
                <button 
                  onClick={() => toast.success("Force triggered database replication check")}
                  id="btn-admin-action-db"
                  className="w-full text-left rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Trigger Database Integrity Check
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
