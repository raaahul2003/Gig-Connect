
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFreelancerEarnings } from "../../services/paymentService";

const formatINR = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const paymentStatusStyles = {
  paid: "border-green-200 bg-green-50 text-green-900",
  pending: "border-amber-200 bg-amber-50 text-amber-900",
  processing: "border-blue-200 bg-blue-50 text-blue-900",
  failed: "border-red-200 bg-red-50 text-red-900",
  refunded: "border-gray-200 bg-gray-100 text-gray-800",
};

function Earnings() {
  const [transactions, setTransactions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const data = await getFreelancerEarnings();

        setTransactions(data.payments || []);
        setTotalEarnings(data.totalEarnings || 0);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load earnings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const filteredTransactions =
    statusFilter === "all"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.status === statusFilter
        );

  const paidTransactions = transactions.filter(
    (payment) => payment.status === "paid"
  );

  const pendingPayments = transactions
    .filter((payment) =>
      ["pending", "processing"].includes(payment.status)
    )
    .reduce(
      (total, payment) =>
        total + (payment.freelancerAmount ?? payment.amount ?? 0),
      0
    );

  return (
    <main className="mx-auto w-full max-w-5xl">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Earnings
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-6 text-gray-700">
            Track your completed work and payment activity.
          </p>
        </div>

        <Link
          to="/freelancer/active-work"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          View active work
        </Link>
      </header>

      <section
        aria-label="Earnings overview"
        className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4"
      >
        {[
          {
            label: "Total Earnings",
            value: formatINR(totalEarnings),
          },
          {
            label: "Pending Earnings",
            value: formatINR(pendingPayments),
          },
        ].map((metric) => (
          <article
            key={metric.label}
            className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <p className="text-xs font-medium leading-5 text-gray-700 sm:text-sm">
              {metric.label}
            </p>
            <p className="mt-1 break-words text-xl font-bold tracking-tight text-gray-950 sm:mt-2 sm:text-3xl">
              {metric.value}
            </p>
          </article>
        ))}
      </section>

      <section
        aria-labelledby="transaction-history-heading"
        className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2
              id="transaction-history-heading"
              className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl"
            >
              Transaction history
            </h2>

            <p className="mt-1 text-sm text-gray-700">
              Payment records for your tasks.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            {!loading && !error && transactions.length > 0 && (
              <label className="flex items-center justify-between gap-3 text-sm font-medium text-gray-800 sm:justify-start">
                Filter status
                <span className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="min-h-11 appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </label>
            )}
            {!loading && !error && (
              <span
                className="text-sm font-medium text-gray-700"
                aria-live="polite"
              >
                {statusFilter === "all"
                  ? `${transactions.length} ${
                      transactions.length === 1 ? "transaction" : "transactions"
                    }`
                  : `${filteredTransactions.length} of ${
                      transactions.length
                    } ${
                      transactions.length === 1 ? "transaction" : "transactions"
                    }`}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <p role="status" className="px-5 py-12 text-center text-sm text-gray-700">
            Loading earnings...
          </p>
        ) : error ? (
          <p role="alert" className="px-5 py-12 text-center text-sm text-red-800">
            {error}
          </p>
        ) : transactions.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-800">
              ₹
            </div>

            <h3 className="mt-4 font-semibold text-gray-950">
              No transactions yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-700">
              Your completed and paid tasks will appear here.
            </p>

            <Link
              to="/browse"
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Explore tasks →
            </Link>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-700">
            No transactions with this status.
          </p>
        ) : (
          <div className="space-y-3 bg-gray-50/70 p-4 sm:p-5">
            {filteredTransactions.map((transaction) => {
              const taskPrice = transaction.amount || 0;
              const freelancerAmount =
                transaction.freelancerAmount ?? taskPrice;
              const statusLabel =
                transaction.status?.replaceAll("_", " ") ||
                "Status unavailable";

              return (
                <article
                  key={transaction._id}
                  className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-gray-950">
                        {transaction.task?.title || "Untitled Task"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(
                          transaction.createdAt
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-h-8 w-fit shrink-0 items-center rounded-md border px-2.5 py-1 text-sm font-semibold capitalize ${
                        paymentStatusStyles[transaction.status] ||
                        "border-gray-200 bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col gap-4 border-t border-gray-100 pt-3 sm:flex-row sm:items-end sm:justify-between">
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <dt className="text-sm text-gray-600">Task price</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-gray-900">
                          {formatINR(taskPrice)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm text-gray-600">Client</dt>
                        <dd className="mt-0.5 break-words text-sm font-semibold text-gray-900">
                          {transaction.client?._id ? (
                            <Link
                              to={`/clients/${transaction.client._id}`}
                              className="text-blue-700 hover:text-blue-800 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                            >
                              {transaction.client.name || "Client profile"}
                            </Link>
                          ) : (
                            transaction.client?.name || "Client unavailable"
                          )}
                        </dd>
                      </div>
                    </dl>

                    <div className="sm:text-right">
                      <p className="text-sm font-medium text-gray-700">
                        Your earnings
                      </p>
                      <p className="mt-0.5 text-lg font-bold tracking-tight text-gray-950">
                        {formatINR(freelancerAmount)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Earnings;
