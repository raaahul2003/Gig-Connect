
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getClientPayments,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../services/paymentService";

export default function ClientPayments() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getClientPayments();
        setTransactions(data.payments || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load payment history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);


  const handlePayment = async (payment) => {
    try {
      setPayingId(payment._id);

      // 1. Create or reuse Razorpay order
      const data = await createRazorpayOrder(payment._id);

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout failed to load. Please refresh.");
      }

      // 2. Configure Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "GigConnect",
        description: payment.task?.title || "Task Payment",
        order_id: data.order.id,


        // 3. Handle successful checkout
        handler: async function (response) {
          try {
            const result = await verifyRazorpayPayment({
              paymentId: payment._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert(result.message || "Payment successful!");

            // Refresh payment history
            const updatedData = await getClientPayments();
            setTransactions(updatedData.payments || []);

          } catch (error) {
            alert(
              error.response?.data?.message ||
              "Payment verification failed. Please contact support."
            );
          } finally {
            setPayingId(null);
          }
        },

        modal: {
          ondismiss: function () {
            setPayingId(null);
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      // 4. Open Razorpay Checkout
      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", function (response) {
        alert(
          response.error?.description || "Payment failed. Please try again."
        );
        setPayingId(null);
      });

      checkout.open();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to start payment."
      );

      setPayingId(null);
    }
  };


  const totalSpent = transactions
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const processingPayments = transactions
    .filter((payment) => payment.status === "processing")
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingPayments = transactions
    .filter((payment) => payment.status === "pending")
    .reduce((total, payment) => total + payment.amount, 0);

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const summaries = [
    { label: "Total Spent", value: formatINR(totalSpent) },
    { label: "Processing Payments", value: formatINR(processingPayments) },
    { label: "Pending Payments", value: formatINR(pendingPayments) },
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

        {loading ? (
          <div className="px-6 py-14 text-center text-gray-500">
            Loading payment history...
          </div>
        ) : error ? (
          <div className="px-6 py-14 text-center text-red-600">
            {error}
          </div>
        ) : transactions.length === 0 ? (
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
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {transaction.task?.title || "Untitled Task"}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {formatINR(transaction.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-600 capitalize">
                      {transaction.status}
                    </td>

                    <td className="px-5 py-4">
                      {transaction.status !== "paid" &&
                        ["pending", "processing"].includes(transaction.status) && (
                          <button
                            onClick={() => handlePayment(transaction)}
                            disabled={payingId === transaction._id}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {payingId === transaction._id ? "Processing..." : "Pay Now"}
                          </button>
                        )}

                      {transaction.status === "paid" && (
                        <span className="text-sm font-medium text-green-600">
                          Paid
                        </span>
                      )}
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
