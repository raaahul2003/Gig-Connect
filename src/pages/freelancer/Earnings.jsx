
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFreelancerEarnings } from "../../services/paymentService";

const formatINR = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

function Earnings() {
  const [transactions, setTransactions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {metric.value}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Based on recorded payment data
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Transaction history
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your earnings from completed and paid tasks.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {transactions.length} transactions
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-gray-500">
            Loading earnings...
          </div>
        ) : error ? (
          <div className="px-6 py-14 text-center text-red-600">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500">
              ₹
            </div>

            <h3 className="mt-5 font-semibold text-gray-900">
              No transactions yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Your completed and paid tasks will appear here.
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
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Task price</th>
                  <th className="px-5 py-3 font-medium">Platform fee</th>
                  <th className="px-5 py-3 font-medium">Your earnings</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const taskPrice = transaction.amount || 0;
                  const platformFee = transaction.platformFee ?? 0;
                  const freelancerAmount =
                    transaction.freelancerAmount ?? taskPrice;

                  return (
                    <tr
                      key={transaction._id}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {transaction.task?.title || "Untitled Task"}
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {new Date(
                          transaction.createdAt
                        ).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        {formatINR(taskPrice)}
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatINR(platformFee)}
                        <span className="block text-xs text-gray-400">
                          Paid by client
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatINR(freelancerAmount)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${transaction.status === "paid"
                              ? "bg-green-50 text-green-700"
                              : transaction.status === "pending"
                                ? "bg-yellow-50 text-yellow-700"
                                : transaction.status === "processing"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Earnings;
