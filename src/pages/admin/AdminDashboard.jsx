
import { useEffect, useState } from "react";
import api from "../../api/axios";

const initialDashboardStats = {
  registeredUsers: 0,
  publishedTasks: 0,
  activeProjects: 0,
  completedProjects: 0,
};

const initialPaymentStats = {
  totalTransactions: 0,
  totalCollected: 0,
  platformRevenue: 0,
  freelancerPayable: 0,
  pendingPayments: 0,
  failedPayments: 0,
  refundedPayments: 0,
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

function MetricCard({ label, value, description, loading }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-gray-900">
        {loading ? "..." : value}
      </p>
      <p className="mt-2 text-xs text-gray-400">{description}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState(
    initialDashboardStats
  );

  const [paymentStats, setPaymentStats] = useState(initialPaymentStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashboardResponse, paymentResponse] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/payments/summary"),
        ]);

        setDashboardStats(dashboardResponse.data.stats);
        setPaymentStats(paymentResponse.data.stats);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor marketplace activity and platform finances.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Marketplace Statistics */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-900">
          Marketplace Statistics
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Registered Users"
            value={dashboardStats.registeredUsers}
            description="Total registered accounts"
            loading={loading}
          />
          <MetricCard
            label="Published Tasks"
            value={dashboardStats.publishedTasks}
            description="Currently open tasks"
            loading={loading}
          />
          <MetricCard
            label="Active Projects"
            value={dashboardStats.activeProjects}
            description="Projects in progress"
            loading={loading}
          />
          <MetricCard
            label="Completed Projects"
            value={dashboardStats.completedProjects}
            description="Successfully completed projects"
            loading={loading}
          />
        </div>
      </section>

      {/* Financial Overview */}
      <section className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            Financial Overview
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Payment figures are based on successful client payments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Total Collected"
            value={formatCurrency(paymentStats.totalCollected)}
            description="Successful client payments"
            loading={loading}
          />
          <MetricCard
            label="Platform Revenue"
            value={formatCurrency(paymentStats.platformRevenue)}
            description="GigConnect commission (5%)"
            loading={loading}
          />
          <MetricCard
            label="Freelancer Payable"
            value={formatCurrency(paymentStats.freelancerPayable)}
            description="Amount owed to freelancers"
            loading={loading}
          />
          <MetricCard
            label="Total Transactions"
            value={paymentStats.totalTransactions}
            description="All recorded payment records"
            loading={loading}
          />
          <MetricCard
            label="Pending Payments"
            value={paymentStats.pendingPayments}
            description="Awaiting payment completion"
            loading={loading}
          />
          <MetricCard
            label="Failed Payments"
            value={paymentStats.failedPayments}
            description="Unsuccessful payment attempts"
            loading={loading}
          />
          <MetricCard
            label="Refunded Payments"
            value={paymentStats.refundedPayments}
            description="Payments marked as refunded"
            loading={loading}
          />
        </div>
      </section>

      {/* Payment Information */}
      <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-900">
          Payment & Commission Information
        </h3>
        <p className="mt-2 text-sm leading-6 text-blue-800">
          GigConnect charges a 5% commission on the accepted freelancer bid.
          The client pays the bid amount plus the commission. Freelancer
          payable figures show the amount owed, not confirmed bank transfers.
        </p>
      </section>
    </div>
  );
}
