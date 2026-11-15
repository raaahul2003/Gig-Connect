
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyApplications,
  getMyActiveWork,
} from "../../services/applicationService";
import { getFreelancerEarnings } from "../../services/paymentService";

function FreelancerDashboard() {
  const [applications, setApplications] = useState([]);
  const [activeWork, setActiveWork] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [applicationData, activeWorkData, earningsData] =
          await Promise.all([
            getMyApplications(),
            getMyActiveWork(),
            getFreelancerEarnings(),
          ]);

        if (isMounted) {
          setApplications(applicationData);
          setActiveWork(activeWorkData);
          setPayments(earningsData.payments || []);
          setTotalEarnings(Number(earningsData.totalEarnings) || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load dashboard data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const paidPayments = payments.filter(
    (payment) => payment.status === "paid"
  );

  const recentApplications = applications.slice(0, 3);
  const recentActiveWork = activeWork.slice(0, 3);

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "paid":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) =>
    status
      ? status.replace("_", " ").replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
      : "Unknown";

  const metrics = [
    { label: "Total Applications", value: applications.length },
    { label: "Active Work", value: activeWork.length },
    { label: "Paid Tasks", value: paidPayments.length },
    { label: "Total Earnings", value: formatINR(totalEarnings) },
  ];

  return (
    <main>
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            YOUR WORKSPACE
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Your next opportunity starts here
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Discover tasks, manage your work, and build your reputation.
          </p>
        </div>

        <Link
          to="/browse"
          className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Find tasks
        </Link>
      </div>

      {/* Dashboard Metrics */}
      <section
        aria-label="Freelancer statistics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {loading ? "..." : error ? "—" : metric.value}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Based on your account activity
            </p>
          </article>
        ))}
      </section>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Recent Applications */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Your recent applications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Track the status of your submitted applications.
            </p>
          </div>

          <Link
            to="/freelancer/applications"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all →
          </Link>
        </div>

        <div className="mt-5">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading applications...
            </p>
          ) : recentApplications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
              <h4 className="font-semibold text-gray-900">
                No applications yet
              </h4>
              <p className="mt-2 text-sm text-gray-500">
                Find tasks and submit your first application.
              </p>
              <Link
                to="/browse"
                className="mt-4 inline-flex font-semibold text-blue-600 hover:text-blue-700"
              >
                Browse tasks →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <article
                  key={application._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {application.task?.title || "Task"}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Applied on {formatDate(application.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">Your bid</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatINR(application.bidAmount)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Active Work */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Your active work
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Keep track of tasks you're currently completing.
            </p>
          </div>

          <Link
            to="/freelancer/active-work"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all →
          </Link>
        </div>

        <div className="mt-5">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading active work...
            </p>
          ) : recentActiveWork.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
              <h4 className="font-semibold text-gray-900">
                No active tasks
              </h4>
              <p className="mt-2 text-sm text-gray-500">
                Accepted tasks and their progress will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActiveWork.map((application) => (
                <article
                  key={application._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <h4 className="font-semibold text-gray-900">
                    {application.task?.title || "Task"}
                  </h4>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                      Bid: {formatINR(application.bidAmount)}
                    </p>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      In Progress
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Profile CTA */}
      <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            Build your freelancer profile
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Add your skills and portfolio to help clients understand your
            strengths.
          </p>
        </div>

        <Link
          to="/freelancer/profile"
          className="mt-4 inline-flex font-semibold text-blue-700 hover:text-blue-800 sm:mt-0"
        >
          Complete profile →
        </Link>
      </section>
    </main>
  );
}

export default FreelancerDashboard;
