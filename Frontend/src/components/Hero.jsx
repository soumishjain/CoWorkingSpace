import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200 rounded-full blur-3xl opacity-30" />

      {/* LEFT */}
      <div className="relative">

        {/* BADGE */}
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gray-100 text-xs text-gray-600 font-medium">
          🚀 Built for modern teams
        </div>

        {/* HEADING */}
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight text-gray-900">
          Manage your{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            coworking spaces
          </span>{" "}
          effortlessly
        </h1>

        {/* SUBTEXT */}
        <p className="mt-6 text-gray-500 text-lg max-w-xl">
          Create workspaces, collaborate with your team, and manage everything
          from a single powerful dashboard.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          <button
          onClick={() => {
            navigate('/dashboard')
          }}
          className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transition">
            Create Workspace
          </button>

          <button
          onClick={() => {
            navigate('/dashboard')
          }}
          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition">
            Explore
          </button>

        </div>

        {/* TRUST LINE */}
        <p className="mt-6 text-xs text-gray-400">
          No credit card required • Free plan available
        </p>

      </div>

      {/* RIGHT */}
      <div className="relative">

        {/* CARD CONTAINER */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-4">

          {/* FAKE DASHBOARD */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">

            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-20 bg-gray-200 rounded-lg" />
              <div className="h-20 bg-gray-200  rounded-lg" />
              <div className="h-20 bg-gray-200  rounded-lg" />
              <div className="h-20 bg-gray-200 rounded-lg" />
            </div>

          </div>

        </div>

        {/* FLOATING SMALL CARD */}
        <div className="absolute -bottom-6 -left-6 bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 text-xs text-gray-600">
          +12 tasks completed today
        </div>

      </div>

    </section>
  );
}