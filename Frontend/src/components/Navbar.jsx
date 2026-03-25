import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* 🔥 LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
            C
          </div>

          <span className="text-lg font-semibold text-gray-900 tracking-tight">
            CoworkSpace
          </span>
        </div>

        {/* 🔥 LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <button className="hover:text-gray-900 transition">
            Features
          </button>
          <button className="hover:text-gray-900 transition">
            Pricing
          </button>
          <button className="hover:text-gray-900 transition">
            About
          </button>
        </div>

        {/* 🔥 ACTIONS */}
        <div className="flex items-center gap-3">

          {/* LOGIN */}
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
          >
            Login
          </button>

          {/* CTA */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:opacity-90 transition shadow-sm hover:shadow-md"
          >
            Get Started
          </button>

        </div>

      </div>
    </nav>
  );
}