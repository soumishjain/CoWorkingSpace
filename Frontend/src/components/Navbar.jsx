import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate()
  return (
    <nav className="w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <h1 className="text-xl font-bold text-[var(--color-primary)]">
          CoworkSpace
        </h1>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-[var(--color-primary)]">Features</a>
          <a href="#" className="hover:text-[var(--color-primary)]">Pricing</a>
          <a href="#" className="hover:text-[var(--color-primary)]">About</a>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
          onClick={() => {
            navigate('/login')
          }} 
          className="px-4 transition-all duration-200 cursor pointer hover:bg-[var(--color-primary)] hover:border-0 hover:text-white cursor-pointer py-2 rounded-lg border">
            Login
          </button>

          <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  );
}