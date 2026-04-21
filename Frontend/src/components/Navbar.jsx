import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full sticky top-0 z-50 
                    backdrop-blur-md 
                    bg-[var(--bg-secondary)]/70 
                    border-b border-[var(--border)]">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* 🔥 LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg 
                          bg-gradient-to-tr 
                          from-[var(--accent)] 
                          to-[#FF8C42] 
                          flex items-center justify-center 
                          text-white font-bold text-sm 
                          shadow-[0_0_10px_var(--accent-glow)]">
            C
          </div>

          <span className="text-lg font-semibold 
                           text-[var(--text-primary)] tracking-tight">
            CoworkSpace
          </span>
        </div>

        {/* 🔥 LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
          <button 
          onClick={() => navigate('/')}
          className="hover:text-[var(--accent)] transition">
            Features
          </button>
          <button 
          onClick={() => navigate('/pricing')}
         className="hover:text-[var(--accent)] transition">
            Pricing
          </button>
          {/* <button className="hover:text-[var(--accent)] transition">
            About
          </button> */}
        </div>

        {/* 🔥 ACTIONS */}
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-3">
  <ThemeToggle />

  {/* existing buttons */}
</div>

          {/* LOGIN */}
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg text-sm font-medium 
                       text-[var(--text-primary)] 
                       border border-[var(--border)] 
                       bg-[var(--bg-secondary)]
                       hover:bg-[var(--bg-hover)] 
                       hover:border-[var(--accent)]/40
                       transition"
          >
            Login
          </button>

          {/* CTA */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white 
                       bg-[var(--accent)] 
                       hover:bg-[var(--accent-soft)] 
                       hover:shadow-[0_0_15px_var(--accent-glow)] 
                       transition-all duration-300"
          >
            Get Started
          </button>

        </div>

      </div>
    </nav>
  );
}