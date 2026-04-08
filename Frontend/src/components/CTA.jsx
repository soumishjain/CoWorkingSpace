import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 overflow-hidden">

      {/* 🔥 SOFT ORANGE GLOW */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] 
                      bg-[var(--accent)] rounded-full blur-3xl opacity-10" />

      {/* 🔥 CONTAINER */}
      <div className="relative max-w-4xl mx-auto text-center">

        {/* 🔥 BADGE */}
        <div className="inline-block mb-4 px-4 py-1 rounded-full 
                        bg-[var(--bg-secondary)] border border-[var(--border)] 
                        text-xs text-[var(--text-secondary)] font-medium">
          🚀 Trusted by modern teams
        </div>

        {/* 🔥 HEADING */}
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight 
                       text-[var(--text-primary)] leading-tight">
          Build your workspace <br />
          <span className="bg-gradient-to-r 
                           from-[var(--accent)] 
                           via-[#FF8C42] 
                           to-[#FFA366] 
                           bg-clip-text text-transparent">
            faster than ever
          </span>
        </h2>

        {/* 🔥 SUBTEXT */}
        <p className="mt-5 text-[var(--text-secondary)] text-base md:text-lg max-w-xl mx-auto">
          Manage tasks, collaborate with your team, and stay productive —
          all in one powerful workspace.
        </p>

        {/* 🔥 CTA BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

          {/* PRIMARY BUTTON */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded-xl 
                       bg-[var(--accent)] text-white font-medium 
                       hover:bg-[var(--accent-soft)]
                       hover:shadow-[0_0_20px_var(--accent-glow)]
                       hover:scale-[1.02]
                       transition-all duration-300"
          >
            Get Started
          </button>

          {/* SECONDARY BUTTON */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded-xl 
                       border border-[var(--border)] 
                       text-[var(--text-primary)] font-medium 
                       bg-[var(--bg-secondary)]
                       hover:bg-[var(--bg-hover)]
                       transition-all duration-300"
          >
            Live Demo
          </button>
        </div>

        {/* 🔥 TRUST LINE */}
        <p className="mt-6 text-xs text-[var(--text-secondary)] opacity-70">
          No credit card required • Free forever plan
        </p>

      </div>
    </section>
  );
}