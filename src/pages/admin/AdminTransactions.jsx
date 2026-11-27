
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default function AdminTransactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/payments");
        setPayments(response.data.payments || []);
      } catch (err) {
        console.error("Admin transactions error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load transaction records."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        payment._id,
        payment.razorpayPaymentId,
        payment.razorpayOrderId,
        payment.task?.title,
        payment.client?.name,
        payment.client?.email,
        payment.freelancer?.name,
        payment.freelancer?.email,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchText));

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Transactions
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor client payments, platform commission and freelancer
          payable amounts.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search task, client, freelancer or payment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Transaction count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <strong>{filteredPayments.length}</strong> of{" "}
          <strong>{payments.length}</strong> transactions
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Transactions table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading transactions...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-gray-800">
              No transactions found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4">Transaction</th>
                  <th className="px-5 py-4">Task</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Freelancer</th>
                  <th className="px-5 py-4">Bid Amount</th>
                  <th className="px-5 py-4">Platform Fee</th>
                  <th className="px-5 py-4">Client Total</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => {
                  const currency = payment.currency || "INR";

                  return (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {payment.razorpayPaymentId ||
                            payment.razorpayOrderId ||
                            payment._id}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          ID: {payment._id}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {payment.task?.title || "Task unavailable"}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {payment.client?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {payment.client?.email || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {payment.freelancer?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {payment.freelancer?.email || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {formatCurrency(payment.amount, currency)}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {formatCurrency(payment.platformFee, currency)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatCurrency(
                          payment.clientTotal ??
                            payment.amount + (payment.platformFee || 0),
                          currency
                        )}
                      </td>

                      <td className="px-5 py-4 capitalize text-gray-600">
                        {payment.paymentMethod || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusStyles[payment.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {payment.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                        {formatDate(
                          payment.paidAt || payment.createdAt
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm leading-6 text-blue-800">
          <strong>Note:</strong> A Paid status confirms successful client
          payment collection. It does not confirm that the freelancer has
          received a bank transfer. Freelancer payout tracking is not yet
          implemented.
        </p>
      </div>
    </div>
  );
}
