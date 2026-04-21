import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
                      bg-[var(--accent)] rounded-full blur-3xl opacity-10" />

      {/* LEFT */}
      <div className="relative">

        {/* BADGE */}
        <div className="inline-block mb-4 px-4 py-1 rounded-full 
                        bg-[var(--bg-secondary)] border border-[var(--border)] 
                        text-xs text-[var(--text-secondary)] font-medium">
          🚀 Built for modern teams
        </div>

        {/* HEADING */}
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight 
                       text-[var(--text-primary)]">
          Manage your{" "}
          <span className="bg-gradient-to-r 
                           from-[var(--accent)] 
                           via-[#FF8C42] 
                           to-[#FFA366] 
                           bg-clip-text text-transparent">
            coworking spaces
          </span>{" "}
          effortlessly
        </h1>

        {/* SUBTEXT */}
        <p className="mt-6 text-[var(--text-secondary)] text-lg max-w-xl">
          Create workspaces, collaborate with your team, and manage everything
          from a single powerful dashboard.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          {/* PRIMARY */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-xl 
                       bg-[var(--accent)] text-white font-medium 
                       hover:bg-[var(--accent-soft)]
                       hover:shadow-[0_0_20px_var(--accent-glow)]
                       hover:scale-[1.02]
                       transition-all duration-300"
          >
            Create Workspace
          </button>

          {/* SECONDARY */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-xl 
                       border border-[var(--border)] 
                       text-[var(--text-primary)] font-medium 
                       bg-[var(--bg-secondary)]
                       hover:bg-[var(--bg-hover)]
                       transition-all duration-300"
          >
            Explore
          </button>

        </div>

        {/* TRUST LINE */}
        <p className="mt-6 text-xs text-[var(--text-secondary)] opacity-70">
          No credit card required • Free plan available
        </p>

      </div>

      {/* RIGHT */}
      <div className="relative">

        {/* CARD CONTAINER */}
        <div className="relative 
                        bg-[var(--bg-secondary)]/70 
                        backdrop-blur-xl 
                        border border-[var(--border)] 
                        rounded-2xl shadow-xl p-4">

          {/* FAKE DASHBOARD */}
          <div className="bg-[var(--bg-hover)] rounded-xl p-4 space-y-3">

            <div className="h-4 w-1/3 bg-[var(--border)] rounded" />
            <div className="h-3 w-1/2 bg-[var(--border)] rounded" />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-20 bg-[var(--border)] rounded-lg" />
              <div className="h-20 bg-[var(--border)] rounded-lg" />
              <div className="h-20 bg-[var(--border)] rounded-lg" />
              <div className="h-20 bg-[var(--border)] rounded-lg" />
            </div>

          </div>

        </div>

        {/* FLOATING SMALL CARD */}
        <div className="absolute -bottom-6 -left-6 
                        bg-[var(--bg-secondary)] 
                        border border-[var(--border)] 
                        rounded-xl shadow-md px-4 py-3 
                        text-xs text-[var(--text-secondary)]
                        hover:shadow-[0_0_15px_var(--accent-glow)]
                        transition">
          +12 tasks completed today
        </div>

      </div>

    </section>
  );
}