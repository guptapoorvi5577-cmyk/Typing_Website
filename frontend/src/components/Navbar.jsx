import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home",        path: "/" },
  { label: "Practice",   path: "/practice" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Profile",    path: "/profile" },
];

export default function Navbar() {
  const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        <Link to="/" className="flex items-center gap-2 font-bold text-xl select-none">
          <span className="text-2xl">⌨️</span>
          <span>
            <span className="text-slate-900 dark:text-slate-100">Type</span>
            <span className="text-blue-600 dark:text-cyan-400">Test</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <li key={label}>
                <Link
                  to={path}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300"
                      : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-700 text-base hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <Link
            to="/login"
            className="px-4 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>

    </nav>
  );
}