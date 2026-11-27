
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";

const statusLabels = {
  open: "Open",
  under_review: "Under Review",
  resolved: "Resolved",
  rejected: "Rejected",
};

const categoryLabels = {
  client_non_payment: "Client not paying",
  client_not_responding: "Client not responding",
  scope_change: "Scope change",
  freelancer_not_delivering: "Freelancer not delivering",
  poor_quality_work: "Poor quality work",
  other: "Other",
};

const statusStyles = {
  open: "bg-amber-50 text-amber-700",
  under_review: "bg-blue-50 text-blue-700",
  resolved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount, currency = "INR") => {
  if (amount === undefined || amount === null) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    underReview: 0,
    resolved: 0,
    rejected: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDispute, setSelectedDispute] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [adminNotes, setAdminNotes] = useState("");
  const [resolution, setResolution] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/disputes", {
        params: {
          search,
          status,
        },
      });

      setDisputes(response.data.disputes || []);
      setStats(
        response.data.stats || {
          total: 0,
          open: 0,
          underReview: 0,
          resolved: 0,
          rejected: 0,
        }
      );
    } catch (err) {
      console.error("Fetch disputes error:", err);
      setError(
        err.response?.data?.message || "Failed to load disputes."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const viewDetails = async (disputeId) => {
    try {
      setDetailsLoading(true);
      setSelectedDispute(null);
      setAdminNotes("");
      setResolution("");

      const response = await api.get(`/admin/disputes/${disputeId}`);

      const dispute = response.data.dispute;

      setSelectedDispute(dispute);
      setAdminNotes(dispute.adminNotes || "");
      setResolution(dispute.resolution || "");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to load dispute details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateDispute = async (nextStatus) => {
    if (!selectedDispute) return;

    if (
      ["resolved", "rejected"].includes(nextStatus) &&
      !resolution.trim()
    ) {
      alert("Please enter a resolution note before closing this dispute.");
      return;
    }

    const actionLabel =
      nextStatus === "under_review"
        ? "move this dispute to under review"
        : nextStatus === "resolved"
          ? "resolve this dispute"
          : "reject this dispute";

    if (!window.confirm(`Are you sure you want to ${actionLabel}?`)) {
      return;
    }

    try {
      setSaving(true);

      await api.patch(
        `/admin/disputes/${selectedDispute._id}`,
        {
          status: nextStatus,
          adminNotes,
          resolution,
        }
      );

      alert("Dispute updated successfully.");

      setSelectedDispute(null);
      await fetchDisputes();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update dispute."
      );
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    {
      label: "Total Disputes",
      value: stats.total,
      color: "text-gray-900",
    },
    {
      label: "Open",
      value: stats.open,
      color: "text-amber-600",
    },
    {
      label: "Under Review",
      value: stats.underReview,
      color: "text-blue-600",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Dispute Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review complaints, investigate issues and manage dispute
          resolutions.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search task or participant..."
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          type="button"
          onClick={fetchDisputes}
          className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Dispute table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">
            Reported Disputes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Review cases submitted by clients and freelancers.
          </p>
        </div>

        {loading ? (
          <div className="py-14 text-center text-sm text-gray-500">
            Loading disputes...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchDisputes}
              className="mt-3 text-sm font-medium text-blue-600"
            >
              Try again
            </button>
          </div>
        ) : disputes.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h3 className="font-semibold text-gray-900">
              No disputes found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {search || status !== "all"
                ? "Try changing your search or status filter."
                : "Disputes raised by users will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Freelancer</th>
                  <th className="px-5 py-3 font-medium">Reason</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {disputes.map((dispute) => (
                  <tr key={dispute._id}>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {dispute.task?.title || "Deleted task"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {dispute.client?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {dispute.freelancer?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {categoryLabels[dispute.category] ||
                        dispute.category}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[dispute.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabels[dispute.status] ||
                          dispute.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(dispute.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => viewDetails(dispute._id)}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Loading details */}
      {detailsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-xl bg-white px-8 py-6 text-sm text-gray-600">
            Loading dispute details...
          </div>
        </div>
      )}

      {/* Details modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dispute Details
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  ID: {selectedDispute._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5">
              {/* Basic information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Task</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedDispute.task?.title || "Deleted task"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {categoryLabels[selectedDispute.category] ||
                      selectedDispute.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedDispute.client?.name || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedDispute.client?.email || ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Freelancer</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedDispute.freelancer?.name || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedDispute.freelancer?.email || ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Raised By</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedDispute.raisedBy?.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Date Raised</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {formatDate(selectedDispute.createdAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Dispute Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {selectedDispute.description}
                </p>
              </div>

              {selectedDispute.evidence && (
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Evidence / Additional Information
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {selectedDispute.evidence}
                  </p>
                </div>
              )}

              {/* Submission details */}
              {selectedDispute.submission && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">
                    Work Submission
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Status: {selectedDispute.submission.status}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                    {selectedDispute.submission.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Files attached:{" "}
                    {selectedDispute.submission.files?.length || 0}
                  </p>
                </div>
              )}

              {/* Payment details */}
              {selectedDispute.payment && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">
                    Payment Information
                  </h4>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        Freelancer Amount
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(
                          selectedDispute.payment.freelancerAmount ??
                            selectedDispute.payment.amount,
                          selectedDispute.payment.currency
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Platform Fee
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(
                          selectedDispute.payment.platformFee,
                          selectedDispute.payment.currency
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Client Total
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(
                          selectedDispute.payment.clientTotal,
                          selectedDispute.payment.currency
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Payment Status
                      </p>
                      <p className="font-semibold text-gray-900">
                        {selectedDispute.payment.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin review */}
              <div className="space-y-3 border-t border-gray-100 pt-5">
                <h4 className="font-semibold text-gray-900">
                  Admin Review
                </h4>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Internal Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(event) =>
                      setAdminNotes(event.target.value)
                    }
                    maxLength={3000}
                    rows={3}
                    disabled={["resolved", "rejected"].includes(
                      selectedDispute.status
                    )}
                    placeholder="Add investigation notes..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Resolution Note
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(event) =>
                      setResolution(event.target.value)
                    }
                    maxLength={3000}
                    rows={3}
                    disabled={["resolved", "rejected"].includes(
                      selectedDispute.status
                    )}
                    placeholder="Explain the final decision..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>

                {selectedDispute.resolution && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-semibold text-gray-500">
                      Saved Resolution
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                      {selectedDispute.resolution}
                    </p>
                  </div>
                )}

                {selectedDispute.status === "open" && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => updateDispute("under_review")}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Updating..." : "Move to Under Review"}
                  </button>
                )}

                {!["resolved", "rejected"].includes(
                  selectedDispute.status
                ) && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => updateDispute("resolved")}
                      className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Resolve Dispute
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => updateDispute("rejected")}
                      className="rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject Dispute
                    </button>
                  </div>
                )}

                {["resolved", "rejected"].includes(
                  selectedDispute.status
                ) && (
                  <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                    This dispute is closed. No further status changes are
                    available.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 text-right">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
