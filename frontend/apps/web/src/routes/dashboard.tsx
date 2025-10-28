import { createFileRoute } from "@tanstack/react-router";
import { CreditCardIcon, HomeIcon, ListIcon, UserIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { TransactionModal } from "../components/transaction-modal";

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

type TAccount = {
  id: string;
  user_id: string;
  currency: string;
  created_at: string;
};

type TTransaction = {
  id: string;
  account_id: string;
  type: string;
  amount: number;
  reference: string;
  meta: Record<string, any>;
  created_at: string;
  created_by: string;
  status: string;
};

type TBalance = {
  account_id: string;
  balance: number;
  currency: string;
  last_snapshot_at: string;
};

function DashboardComponent() {
  const [accounts, setAccounts] = React.useState<TAccount[]>([]);
  const [transactions, setTransactions] = React.useState<TTransaction[]>([]);
  const [balances, setBalances] = React.useState<Record<string, TBalance>>({});
  const [isDepositModalOpen, setIsDepositModalOpen] = React.useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);

  const refreshAllData = () => {
    fetchAccounts();
  };

  const fetchAccounts = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      // Handle missing token, maybe redirect to login
      return;
    }

    try {
      const response = await fetch(`${API_URL}accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
        fetchTransactions(data);
        data.forEach((account: TAccount) => fetchBalance(account.id));
      } else {
        toast.error("Failed to fetch accounts.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching accounts.");
    }
  };

  const fetchTransactions = async (accounts: TAccount[]) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return;
    }

    const allTransactions: TTransaction[] = [];
    for (const account of accounts) {
      try {
        const response = await fetch(
          `${API_URL}accounts/${account.id}/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          allTransactions.push(...data);
        } else {
          toast.error(
            `Failed to fetch transactions for account ${account.id}.`,
          );
        }
      } catch (error) {
        toast.error(
          `An error occurred while fetching transactions for account ${account.id}.`,
        );
      }
    }
    setTransactions(allTransactions);
  };

  const createAccount = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currency: "RWF" }),
      });

      if (response.ok) {
        toast.success("Account created successfully!");
        fetchAccounts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create account.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the account.");
    }
  };

  const fetchBalance = async (accountId: string) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}accounts/${accountId}/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBalances((prev) => ({ ...prev, [accountId]: data }));
        setTimeout(() => {
          setBalances((prev) => {
            const newState = { ...prev };
            delete newState[accountId];
            return newState;
          });
        }, 5000);
      } else {
        toast.error("Failed to fetch balance.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the balance.");
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="flex min-h-screen max-w-[700px] mx-auto w-full flex-col bg-white font-sans dark:bg-zinc-900">
      <main className="grow px-6 pb-24 pt-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Hello, Ethan!
          </h1>
          <button className="text-zinc-500 dark:text-zinc-400">
            <UserIcon className="h-7 w-7" />
          </button>
        </header>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Accounts
          </h2>
          <button
            type="button"
            onClick={createAccount}
            className="mt-4 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Create New Account
          </button>

          <TransactionModal
            open={isDepositModalOpen}
            onOpenChange={setIsDepositModalOpen}
            onTransactionSuccess={refreshAllData}
            type="DEPOSIT"
            accounts={accounts}
          />

          <TransactionModal
            open={isWithdrawModalOpen}
            onOpenChange={setIsWithdrawModalOpen}
            onTransactionSuccess={refreshAllData}
            type="WITHDRAWAL"
            accounts={accounts}
          />

          <div className="mt-4 space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => fetchBalance(account.id)}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800 cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      Account
                    </span>
                    <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
                      •••• {account.id.slice(-4)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {account.currency} · Created on{" "}
                    {new Date(account.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`flex h-16 w-24 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700`}
                >
                  {balances[account.id] ? (
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {balances[account.id].balance}{" "}
                      {balances[account.id].currency}
                    </span>
                  ) : (
                    <CreditCardIcon className="h-8 w-8 text-zinc-600 dark:text-zinc-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-5 grid-cols-2 w-full ">
            <button
              type="button"
              onClick={() => setIsDepositModalOpen(true)}
              className="mt-4 w-full rounded-lg bg-green-500 px-5 py-3.5 text-sm font-medium text-black shadow-sm transition hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="mt-4 w-full rounded-lg bg-zinc-100 px-5 py-3.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Withdraw
            </button>{" "}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Transaction History
          </h2>
          <div className="mt-4 space-y-5">
            {transactions.map((tx) => {
              const isPositive = tx.type === "DEPOSIT";
              return (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      {isPositive
                        ? `+${tx.amount} RWF`
                        : `-${Math.abs(tx.amount)} RWF`}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {tx.type}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(tx.created_at).toLocaleTimeString()} ·{" "}
                      {accounts.find((a) => a.id === tx.account_id)?.currency}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      isPositive
                        ? "text-green-600"
                        : "text-red-900 dark:text-red-100"
                    }`}
                  >
                    {isPositive
                      ? `+${tx.amount} RWF`
                      : `-${Math.abs(tx.amount)} RWF`}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-sm justify-around">
          <button className="text-zinc-900 dark:text-zinc-100">
            <HomeIcon className="h-7 w-7" />
          </button>
          <button className="text-zinc-400 dark:text-zinc-500">
            <ListIcon className="h-7 w-7" />
          </button>
          <button className="text-zinc-400 dark:text-zinc-500">
            <UserIcon className="h-7 w-7" />
          </button>
        </div>
      </nav>
    </div>
  );
}
