import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";

function MyApplications() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {

    const fetchApplications = async () => {
      try {
        setApplications(await getMyApplications());
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load your applications."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            FREELANCER WORKSPACE
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            My Applications
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track the status of tasks you've applied for.
          </p>
        </div>
        <Link
          to="/browse"
          className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Find tasks
        </Link>
      </div>
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-gray-900">Application history</h2>
          <span className="text-sm text-gray-500">
            {applications.length} applications
          </span>
        </div>
        {loading ? (
          <p className="p-6 text-center text-sm text-gray-500">
            Loading applications...
          </p>
        ) : error ? (
          <p className="p-6 text-center text-sm text-red-600">{error}</p>
        ) : applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-gray-900">No applications yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              When you apply for a task, its status and details will appear here.
            </p>
            <Link
              to="/browse"
              className="mt-5 inline-flex font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore available tasks →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((application) => (
              <article key={application._id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {application.task?.title || "Task"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Bid: {application.bidAmount}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Delivery: {application.deliveryHours} hours
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-medium capitalize text-amber-800">
                    {application.status || "pending"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
export default MyApplications;