
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
        return "bg-amber-50 text-amber-800";
      case "accepted":
        return "bg-blue-50 text-blue-800";
      case "rejected":
        return "bg-red-50 text-red-800";
      case "paid":
        return "bg-green-50 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Your next opportunity starts here
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-700">
            Discover tasks, manage your work, and build your reputation.
          </p>
        </div>

        <Link
          to="/browse"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Find tasks
        </Link>
      </div>

      {/* Dashboard Metrics */}
      <section
        aria-label="Freelancer statistics"
        className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
          >
            <p className="text-xs font-medium leading-5 text-gray-700 sm:text-sm">
              {metric.label}
            </p>

            <p className="mt-1 break-words text-xl font-bold tracking-tight text-gray-950 sm:mt-2 sm:text-3xl">
              {loading ? "..." : error ? "—" : metric.value}
            </p>

            <p className="mt-2 hidden text-sm text-gray-600 sm:block">
              Based on your account activity
            </p>
          </article>
        ))}
      </section>

      {error && (
        <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
          {error}
        </div>
      )}

      {/* Recent Applications */}
      <section className="mt-7 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-950">
              Your recent applications
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              Track the status of your submitted applications.
            </p>
          </div>

          <Link
            to="/freelancer/applications"
            className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            View all →
          </Link>
        </div>

        <div className="mt-5">
          {loading ? (
            <p role="status" className="py-8 text-center text-sm text-gray-700">
              Loading applications...
            </p>
          ) : recentApplications.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">
              <h4 className="font-semibold text-gray-950">
                No applications yet
              </h4>
              <p className="mt-2 text-sm text-gray-700">
                Find tasks and submit your first application.
              </p>
              <Link
                to="/browse"
                className="mt-3 inline-flex min-h-11 items-center rounded-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Browse tasks →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {recentApplications.map((application) => (
                <article
                  key={application._id}
                  className="py-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <h4 className="break-words font-semibold text-gray-950">
                        {application.task?.title || "Task"}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Applied on {formatDate(application.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-h-8 w-fit shrink-0 items-center rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <p className="text-sm text-gray-600">Your bid</p>
                    <p className="text-sm font-semibold text-gray-950">
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
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-950">
              Your active work
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              Keep track of tasks you're currently completing.
            </p>
          </div>

          <Link
            to="/freelancer/active-work"
            className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            View all →
          </Link>
        </div>

        <div className="mt-5">
          {loading ? (
            <p role="status" className="py-8 text-center text-sm text-gray-700">
              Loading active work...
            </p>
          ) : recentActiveWork.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">
              <h4 className="font-semibold text-gray-950">
                No active tasks
              </h4>
              <p className="mt-2 text-sm text-gray-700">
                Accepted tasks and their progress will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {recentActiveWork.map((application) => (
                <article
                  key={application._id}
                  className="py-4"
                >
                  <h4 className="break-words font-semibold text-gray-950">
                    {application.task?.title || "Task"}
                  </h4>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-gray-700">
                      Bid: {formatINR(application.bidAmount)}
                    </p>

                    <span className="inline-flex min-h-8 items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
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
      <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 sm:flex sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-gray-950">
            Build your freelancer profile
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            Add your skills and portfolio to help clients understand your
            strengths.
          </p>
        </div>

        <Link
          to="/freelancer/profile"
          className="mt-3 inline-flex min-h-11 items-center rounded-sm font-semibold text-blue-800 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:mt-0"
        >
          Complete profile →
        </Link>
      </section>
    </main>
  );
}

export default FreelancerDashboard;
