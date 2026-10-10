
import { Link } from "react-router-dom";

export default function ClientPayments() {
  // Real payment records will come from the backend later.
  const transactions = [];

  const summaries = [
    { label: "Total Spent", value: "—" },
    { label: "Funds in Escrow", value: "—" },
    { label: "Pending Payments", value: "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payments
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your task payments and transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaries.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            Transaction History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Payments associated with your GigConnect tasks.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-blue-600"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18m-14 5h3"
                />
              </svg>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No transactions yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Your payment history will appear here when transactions
              are recorded for your tasks.
            </p>

            <Link
              to="/client/tasks"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              View My Tasks
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {transaction.taskTitle}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {transaction.amount}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {transaction.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
