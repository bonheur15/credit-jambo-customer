import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { toast } from "sonner";
import { ListIcon, HomeIcon, UserIcon } from "lucide-react";
import { fetchWithAuth } from "../lib/api";

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/transactions")({
  component: TransactionsComponent,
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

function TransactionsComponent() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = React.useState<TTransaction[]>([]);
  const [accounts, setAccounts] = React.useState<TAccount[]>([]); // Needed to fetch transactions

  const fetchAccounts = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}accounts`);

      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
        fetchTransactions(data);
      } else {
        toast.error("Failed to fetch accounts.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching accounts.");
    }
  };

  const fetchTransactions = async (accounts: TAccount[]) => {
    const allTransactions: TTransaction[] = [];
    for (const account of accounts) {
      try {
        const response = await fetchWithAuth(
          `${API_URL}accounts/${account.id}/transactions?all=true`,
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

    allTransactions.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    setTransactions(allTransactions);
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="flex min-h-screen max-w-[700px] mx-auto w-full flex-col bg-white font-sans dark:bg-zinc-900 h-fit">
      <main className="grow px-6 pb-24 pt-8 b">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            All Transactions Logs
          </h1>
        </header>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Transaction History
          </h2>
          <div className="mt-4 space-y-5">
            {transactions.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400">
                No transactions found.
              </p>
            ) : (
              transactions.map((tx) => {
                const isPositive = tx.type === "DEPOSIT";
                const accountCurrency =
                  accounts.find((a) => a.id === tx.account_id)?.currency || "";
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                        {isPositive
                          ? `+${accountCurrency} ${tx.amount}`
                          : `-${accountCurrency} ${Math.abs(tx.amount)}`}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {tx.type} on account ••••{tx.account_id.slice(-4)}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(tx.created_at).toLocaleDateString()} ·{" "}
                        {new Date(tx.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-semibold ${isPositive ? "text-green-600" : "text-red-600 dark:text-red-500"}`}
                    >
                      {isPositive
                        ? `+${accountCurrency} ${tx.amount}`
                        : `-${accountCurrency} ${Math.abs(tx.amount)}`}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-sm justify-around">
          <button
            className="text-zinc-400 dark:text-zinc-500"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <HomeIcon className="h-7 w-7" />
          </button>
          <button
            className="text-zinc-900 dark:text-zinc-100"
            onClick={() => navigate({ to: "/transactions" })}
          >
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
