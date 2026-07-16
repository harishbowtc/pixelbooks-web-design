import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, Landmark } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AddBankAccountDialog } from "@/components/add-bank-account-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/publisher/bank-accounts")({
  head: () => ({
    meta: [
      { title: "Bank Accounts — PixelBooks" },
      { name: "description", content: "Manage your bank accounts for royalty payouts." },
      { property: "og:title", content: "Bank Accounts — PixelBooks" },
      { property: "og:description", content: "Manage your bank accounts for royalty payouts." },
    ],
  }),
  component: BankAccountsPage,
});

type BankAccount = {
  id: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  branch: string;
  isActive: boolean;
};

const seed: BankAccount[] = [
  {
    id: "ba1",
    accountHolder: "PixelBooks",
    accountNumber: "626705500430",
    ifsc: "ICIC0006267",
    bankName: "ICICI BANK LIMITED",
    branch: "KOTTAYAM",
    isActive: true,
  },
];

function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(seed);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [lastRemoved, setLastRemoved] = useState<{
    account: BankAccount;
    index: number;
  } | null>(null);

  const accountToRemove = removeId ? (accounts.find((acc) => acc.id === removeId) ?? null) : null;

  const handleAdd = (data: {
    ifsc: string;
    bankName: string;
    branch: string;
    accountHolder: string;
    accountNumber: string;
    isDefault: boolean;
  }) => {
    const newAccount: BankAccount = {
      id: `ba${accounts.length + 1}`,
      accountHolder: data.accountHolder,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
      bankName: data.bankName,
      branch: data.branch,
      isActive: data.isDefault,
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleConfirmRemove = () => {
    if (!accountToRemove) return;
    setAccounts((prev) => {
      const idx = prev.findIndex((acc) => acc.id === accountToRemove.id);
      if (idx < 0) return prev;
      setLastRemoved({ account: accountToRemove, index: idx });
      return prev.filter((acc) => acc.id !== accountToRemove.id);
    });
    setRemoveId(null);
  };

  const handleUndoRemove = () => {
    if (!lastRemoved) return;
    setAccounts((prev) => {
      const next = [...prev];
      const safeIndex = Math.min(Math.max(lastRemoved.index, 0), next.length);
      next.splice(safeIndex, 0, lastRemoved.account);
      return next;
    });
    setLastRemoved(null);
  };

  return (
    <AppShell title="Bank Accounts" subtitle="Manage your bank accounts for royalty payouts.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Toolbar */}

        <AddBankAccountDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={handleAdd} />

        <AlertDialog
          open={Boolean(accountToRemove)}
          onOpenChange={(open) => !open && setRemoveId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove bank account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action removes the selected bank account from this list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmRemove}
                style={{ backgroundColor: "var(--danger)", color: "white" }}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <h3 className="text-base font-semibold text-foreground">No bank accounts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first bank account to receive royalty payouts.
              </p>
              <button
                onClick={() => setDialogOpen(true)}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <Plus size={16} />
                Add New Bank Account
              </button>
            </div>
          )}

          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
            >
              {/* Card header */}
              <div className="mb-4 flex items-start justify-between">
                <span className="text-sm font-semibold text-foreground">Account Details</span>
                {acc.isActive && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "color-mix(in oklch, var(--success) 12%, transparent)",
                      color: "var(--success)",
                    }}
                  >
                    <CheckCircle2 size={13} />
                    Active Bank Account
                  </span>
                )}
              </div>

              {/* Account info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Landmark size={16} className="text-muted-foreground" />
                  <span className="text-base font-semibold text-foreground">
                    {acc.accountHolder}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{acc.accountNumber}</p>
                  <p>{acc.ifsc}</p>
                  <p>
                    {acc.bankName}, {acc.branch}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-2">
                <button className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  <Pencil size={14} />
                  Edit Details
                </button>
                <button
                  onClick={() => setRemoveId(acc.id)}
                  className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--danger)" }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {accounts.length > 0 && (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-5 text-center transition-colors hover:border-[var(--brand)] hover:bg-secondary/40"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--brand) 12%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <Plus size={22} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Add New Bank Account</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add another account to receive royalty payouts.
                </p>
              </div>
            </button>
          )}
        </div>

        {lastRemoved && (
          <div className="fixed bottom-5 right-5 z-50 rounded-lg border border-border bg-card p-3 shadow-lg">
            <p className="text-sm text-foreground">Bank account removed.</p>
            <button
              onClick={handleUndoRemove}
              className="mt-1 text-sm font-semibold"
              style={{ color: "var(--brand)" }}
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
