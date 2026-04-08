import { useBillingState } from "../state/useBillingState";
import { useBilling } from "../hooks/useBilling";

export default function BillingPage() {

  const billingState = useBillingState();
  const { data, loading, error } = billingState;

  useBilling(billingState);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen 
                      text-[var(--text-secondary)]">
        Loading billing...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* 🔥 HEADER */}
        <div>
          <h1 className="text-3xl font-semibold 
                         text-[var(--text-primary)] tracking-tight">
            Billing & Subscriptions
          </h1>

          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your plans and payment history
          </p>
        </div>

        {/* 🔥 ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 
                          text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* 🔥 SUBSCRIPTIONS */}
        <div>
          <h2 className="text-lg font-semibold mb-4 
                         text-[var(--text-primary)]">
            Your Workspaces
          </h2>

          {data.subscriptions.length === 0 ? (
            <div className="text-[var(--text-secondary)] text-sm 
                            bg-[var(--bg-secondary)] 
                            p-6 rounded-xl border border-[var(--border)]">
              No active subscriptions
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {data.subscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className="relative 
                             bg-[var(--bg-secondary)]/80 
                             backdrop-blur-xl 
                             border border-[var(--border)] 
                             rounded-2xl p-5 
                             shadow-sm 
                             transition-transform duration-300 
                             hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                >

                  {/* PLAN BADGE */}
                  <span className="absolute top-3 right-3 text-xs px-2 py-1 
                                   rounded-full 
                                   bg-[var(--accent)]/10 
                                   text-[var(--accent)] border border-[var(--accent)]/20">
                    {sub.plan}
                  </span>

                  {/* NAME */}
                  <h3 className="text-lg font-medium text-[var(--text-primary)]">
                    {sub.workspaceId?.name || "Workspace"}
                  </h3>

                  {/* STATUS */}
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-[var(--text-secondary)]">
                      Status:
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === "active"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  {/* EXPIRY */}
                  <p className="text-sm text-[var(--text-secondary)] mt-2">
                    Expires on{" "}
                    <span className="text-[var(--text-primary)] font-medium">
                      {sub.endDate
                        ? new Date(sub.endDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>

                  {/* CTA */}
                  <button className="mt-4 w-full py-2 text-sm font-medium rounded-xl 
                                     bg-[var(--accent)] text-white 
                                     hover:bg-[var(--accent-soft)] 
                                     hover:shadow-[0_0_15px_var(--accent-glow)] 
                                     transition-all duration-300">
                    Manage Plan
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 PAYMENT HISTORY */}
        <div>
          <h2 className="text-lg font-semibold mb-4 
                         text-[var(--text-primary)]">
            Payment History
          </h2>

          {data.payments.length === 0 ? (
            <div className="text-[var(--text-secondary)] text-sm 
                            bg-[var(--bg-secondary)] 
                            p-6 rounded-xl border border-[var(--border)]">
              No payments yet
            </div>
          ) : (
            <div className="bg-[var(--bg-secondary)]/80 
                            backdrop-blur-xl 
                            border border-[var(--border)] 
                            rounded-2xl shadow-sm overflow-hidden">

              <table className="w-full text-sm">

                <thead className="bg-[var(--bg-hover)] 
                                  text-[var(--text-secondary)] 
                                  text-xs uppercase tracking-wide">
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
                      className="border-t border-[var(--border)] 
                                 hover:bg-[var(--bg-hover)] transition"
                    >

                      <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                        {p.plan}
                      </td>

                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        ₹{p.amount}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === "success"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[var(--text-secondary)]">
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