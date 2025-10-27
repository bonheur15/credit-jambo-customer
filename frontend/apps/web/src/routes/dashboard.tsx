import { createFileRoute } from "@tanstack/react-router";
import { CreditCardIcon, HomeIcon, ListIcon, UserIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

const accounts: TAccount[] = [
  { id: 1, lastFour: "••••", created: "Jan 5, 2024" },
  { id: 2, lastFour: "••••", created: "Feb 12, 2024" },
];

const transactions: TTransaction[] = [
  { id: 1, type: "Deposit", amount: 500, time: "10:30 AM", account: "Account" },
  {
    id: 2,
    type: "Withdrawal",
    amount: -200,
    time: "Yesterday",
    account: "Account",
  },
  {
    id: 3,
    type: "Transfer",
    amount: -150,
    time: "2 days ago",
    account: "Account",
  },
];

type TAccount = {
  id: number;
  lastFour: string;
  created: string;
};

type TTransaction = {
  id: number;
  type: string;
  amount: number;
  time: string;
  account: string;
};
function DashboardComponent() {
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
            className="mt-4 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Create New Account
          </button>

          <div className="mt-4 space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      Account
                    </span>
                    <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
                      {account.lastFour}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    USD · Created on {account.created}
                  </p>
                </div>
                <div
                  className={`flex h-16 w-24 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700`}
                >
                  <CreditCardIcon className="h-8 w-8 text-zinc-600 dark:text-zinc-300" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Transaction History
          </h2>
          <div className="mt-4 space-y-5">
            {transactions.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      {isPositive
                        ? `+$${tx.amount}`
                        : `-$${Math.abs(tx.amount)}`}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {tx.type}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {tx.time} · {tx.account}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      isPositive
                        ? "text-green-600"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {isPositive ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
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
