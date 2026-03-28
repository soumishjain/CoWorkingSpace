import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate()
  return (
    <section className="relative py-24 px-6 overflow-hidden">

      {/* 🔥 SOFT BACKGROUND GLOW */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-3xl opacity-30" />

      {/* 🔥 CONTAINER */}
      <div className="relative max-w-4xl mx-auto text-center">

        {/* 🔥 BADGE */}
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gray-100 text-xs text-gray-600 font-medium">
          🚀 Trusted by modern teams
        </div>

        {/* 🔥 HEADING */}
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
          Build your workspace <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            faster than ever
          </span>
        </h2>

        {/* 🔥 SUBTEXT */}
        <p className="mt-5 text-gray-500 text-base md:text-lg max-w-xl mx-auto">
          Manage tasks, collaborate with your team, and stay productive —
          all in one powerful workspace.
        </p>

        {/* 🔥 CTA BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

          <button
          onClick={() => {
            navigate('/dashboard')
          }}
          className="px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transition">
            Get Started
          </button>

          <button
          onClick={() => {
            navigate('/dashboard')
          }}
          className="px-8 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition">
            Live Demo
          </button>

        </div>

        {/* 🔥 TRUST LINE */}
        <p className="mt-6 text-xs text-gray-400">
          No credit card required • Free forever plan
        </p>

      </div>
    </section>
  );
}