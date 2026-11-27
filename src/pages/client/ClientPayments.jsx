
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getClientPayments,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../services/paymentService";
import { toast } from "react-toastify";

const formatINR = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

// Supports older payment records as well.
const getClientTotal = (payment) =>
  payment.clientTotal ??
  (payment.amount || 0) + (payment.platformFee || 0);

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
          err.response?.data?.message ||
          "Failed to load payment history."
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

      const data = await createRazorpayOrder(payment._id);

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout failed to load. Please refresh."
        );
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "GigConnect",
        description: payment.task?.title || "Task Payment",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const result = await verifyRazorpayPayment({
              paymentId: payment._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success(result.message || "Payment successful!", {
              position: "top-right",
              autoClose: 3000,
            });

            const updatedData = await getClientPayments();
            setTransactions(updatedData.payments || []);
          } catch (error) {
            toast.error(
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

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", function (response) {
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );
        setPayingId(null);
      });

      checkout.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Unable to start payment."
      );

      setPayingId(null);
    }
  };

  const totalSpent = transactions
    .filter((payment) => payment.status === "paid")
    .reduce(
      (total, payment) => total + getClientTotal(payment),
      0
    );

  const processingPayments = transactions
    .filter((payment) => payment.status === "processing")
    .reduce(
      (total, payment) => total + getClientTotal(payment),
      0
    );

  const pendingPayments = transactions
    .filter((payment) => payment.status === "pending")
    .reduce(
      (total, payment) => total + getClientTotal(payment),
      0
    );

  const paidPlatformFees = transactions
    .filter((payment) => payment.status === "paid")
    .reduce(
      (total, payment) => total + (payment.platformFee ?? 0),
      0
    );

  const summaries = [
    { label: "Total Spent", value: formatINR(totalSpent) },
    {
      label: "Processing Payments",
      value: formatINR(processingPayments),
    },
    {
      label: "Pending Payments",
      value: formatINR(pendingPayments),
    },
    {
      label: "Platform Fees Paid",
      value: formatINR(paidPlatformFees),
    },
  ];

  return (
    <main className="space-y-7 sm:space-y-8">
      <header className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Payments
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-6 text-gray-700">
          Track task costs, platform fees, and payment status.
        </p>
      </header>

      <section aria-label="Payment summary">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaries.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-xl border p-4 sm:p-5 ${
                index === 0
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <dt className="text-sm font-medium text-gray-700">
                {item.label}
              </dt>
              <dd className="mt-2 break-words text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="transaction-history-heading"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <header className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h2
            id="transaction-history-heading"
            className="text-lg font-semibold tracking-tight text-gray-950"
          >
            Transaction history
          </h2>
          <p className="mt-1 text-sm leading-5 text-gray-600">
            Task prices, platform fees, and payment actions.
          </p>
        </header>

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="px-5 py-12 text-center text-sm text-gray-700"
          >
            Loading payment history...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="px-5 py-10 text-center text-sm leading-6 text-red-800"
          >
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-5 py-10 text-center sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
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

            <h3 className="mt-4 text-base font-semibold text-gray-950">
              No transactions yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-700">
              Your payment history will appear here when transactions are
              recorded for your tasks.
            </p>

            <Link
              to="/client/tasks"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              View My Tasks
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {transactions.map((transaction) => {
              const taskPrice = transaction.amount || 0;
              const platformFee = transaction.platformFee ?? 0;
              const clientTotal = getClientTotal(transaction);
              const statusClass =
                transaction.status === "paid"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : transaction.status === "pending"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : transaction.status === "processing"
                      ? "border-indigo-200 bg-indigo-50 text-indigo-900"
                      : "border-gray-200 bg-gray-100 text-gray-800";

              return (
                <li key={transaction._id} className="px-4 py-5 sm:px-6">
                  <article>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-base font-semibold text-gray-950 sm:text-lg">
                          {transaction.task?.title || "Untitled Task"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          <span className="sr-only">Created on </span>
                          <time dateTime={transaction.createdAt}>
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString("en-IN")}
                          </time>
                        </p>
                      </div>

                      <span
                        className={`inline-flex min-h-8 w-fit shrink-0 items-center rounded-full border px-3 py-1 text-sm font-semibold capitalize ${statusClass}`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-gray-50 px-3 py-3">
                        <dt className="text-xs font-medium text-gray-600 sm:text-sm">
                          Task price
                        </dt>
                        <dd className="mt-1 break-words text-sm font-semibold text-gray-900 sm:text-base">
                          {formatINR(taskPrice)}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-3 py-3">
                        <dt className="text-xs font-medium text-gray-600 sm:text-sm">
                          Platform fee (5%)
                        </dt>
                        <dd className="mt-1 break-words text-sm font-semibold text-gray-900 sm:text-base">
                          {formatINR(platformFee)}
                        </dd>
                      </div>
                      <div className="col-span-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 sm:col-span-1">
                        <dt className="text-xs font-semibold text-blue-900 sm:text-sm">
                          Total payable
                        </dt>
                        <dd className="mt-1 break-words text-base font-bold text-gray-950 sm:text-lg">
                          {formatINR(clientTotal)}
                        </dd>
                      </div>
                    </dl>

                    {transaction.status !== "paid" &&
                      ["pending", "processing"].includes(
                        transaction.status
                      ) && (
                        <div className="mt-4 flex justify-start sm:justify-end">
                          <button
                            type="button"
                            onClick={() => handlePayment(transaction)}
                            disabled={payingId === transaction._id}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                          >
                            {payingId === transaction._id
                              ? "Processing..."
                              : "Pay Now"}
                          </button>
                        </div>
                      )}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="max-w-3xl text-sm leading-6 text-gray-700">
        GigConnect charges a transparent 5% platform fee on the task price. The
        fee is added to your payment and is not deducted from the freelancer's
        agreed earnings.
      </p>
    </main>
  );
}
