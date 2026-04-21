import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg 
                 border border-[var(--border)] 
                 bg-[var(--bg-secondary)] 
                 text-[var(--text-primary)] 
                 hover:bg-[var(--bg-hover)] 
                 transition-all duration-300"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}