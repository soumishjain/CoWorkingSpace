import { useBillingState } from "../state/useBillingState";
import { useBilling } from "../hooks/useBilling";

export default function BillingPage() {

  const billingState = useBillingState();
  const { data, loading, error } = billingState;

  useBilling(billingState);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading billing...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Billing & Subscriptions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your plans and payment history
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* 🔥 SUBSCRIPTIONS */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Your Workspaces
          </h2>

          {data.subscriptions.length === 0 ? (
            <div className="text-gray-500 text-sm bg-white p-6 rounded-xl border">
              No active subscriptions
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {data.subscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* PLAN BADGE */}
                  <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
                    {sub.plan}
                  </span>

                  {/* NAME */}
                  <h3 className="text-lg font-medium text-gray-900">
                    {sub.workspaceId?.name || "Workspace"}
                  </h3>

                  {/* STATUS */}
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Status:</span>

                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  {/* EXPIRY */}
                  <p className="text-sm text-gray-500 mt-2">
                    Expires on{" "}
                    <span className="text-gray-800 font-medium">
                      {sub.endDate
                        ? new Date(sub.endDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>

                  {/* CTA */}
                  <button className="mt-4 w-full py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                    Manage Plan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 PAYMENT HISTORY */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Payment History
          </h2>

          {data.payments.length === 0 ? (
            <div className="text-gray-500 text-sm bg-white p-6 rounded-xl border">
              No payments yet
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-6 py-4">Plan</th>
                    <th className="text-left px-6 py-4">Amount</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-left px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.payments.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {p.plan}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        ₹{p.amount}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === "success"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}