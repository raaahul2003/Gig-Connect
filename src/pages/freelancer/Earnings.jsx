
import { Link } from "react-router-dom";

const metrics = [
  { label: "Total earnings", value: "—" },
  { label: "Pending payments", value: "—" },
  { label: "Available balance", value: "—" },
];

function Earnings() {
  const transactions = [];

  return (
    <main>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            FINANCIAL OVERVIEW
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Earnings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track your completed work and payment activity.
          </p>
        </div>

        <Link
          to="/freelancer/active-work"
          className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          View active work
        </Link>
      </header>

      <section
        aria-label="Earnings overview"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {metric.value}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Displayed when payment data is connected
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Transaction history
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Payments associated with your completed tasks.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {transactions.length} transactions
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500">
              ₹
            </div>

            <h3 className="mt-5 font-semibold text-gray-900">
              No transactions yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Payments will appear here when task completion and payment
              processing are connected.
            </p>

            <Link
              to="/browse"
              className="mt-5 inline-flex font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore tasks →
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
                  <tr key={transaction.id} className="border-t border-gray-100">
                    <td className="px-5 py-4">{transaction.taskTitle}</td>
                    <td className="px-5 py-4">{transaction.date}</td>
                    <td className="px-5 py-4">₹{transaction.amount}</td>
                    <td className="px-5 py-4">{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-5 text-xs leading-5 text-gray-500">
        GigConnect currently provides a payment UI preview only. No money is
        being held, transferred, or paid out.
      </p>
    </main>
  );
}

export default Earnings;
