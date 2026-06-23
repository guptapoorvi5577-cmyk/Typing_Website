import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🎯",
    title: "Accurate Results",
    desc: "Get precise WPM and accuracy results with detailed insights.",
  },
  {
    icon: "📈",
    title: "Track Progress",
    desc: "Monitor your improvements with advanced statistics.",
  },
  {
    icon: "🏆",
    title: "Compete Globally",
    desc: "Climb the leaderboard and challenge typists worldwide.",
  },
  {
    icon: "⌨️",
    title: "Practice Anytime",
    desc: "Multiple test modes to practise your typing skills anytime.",
  },
];
const BADGES = [
  { icon: "✅", label: "100% Free" },
  { icon: "⚡", label: "Instant Results" },
  { icon: "📊", label: "Track Progress" },
  { icon: "🥇", label: "Compete & Win" },
];

const STATS = [
  { icon: "👥", value: "250K+", label: "Active Users" },
  { icon: "📋", value: "10M+",  label: "Tests Taken" },
  { icon: "⏱️", value: "250M+", label: "Minutes Typed" },
  { icon: "🏅", value: "1M+",   label: "High Scores" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">

      <section className="bg-blue-50 dark:bg-slate-950 py-24 px-6 text-center transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-cyan-300 leading-tight mb-4">
          Test your typing speed
          <br />
          Improve every day


        </h1>
        <p className="text-gray-600 dark:text-slate-300 text-lg mb-10 max-w-md mx-auto">
          Join thousands of typists improving their speed and accuracy with our
          free online typing test
        </p>



















        <Link
          to="/practice"
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold text-lg px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-lg"
        >
         Start Typing Test
        </Link>

        <div className="mt-14 flex flex-wrap justify-center gap-8">
          {BADGES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              <span className="text-xl">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Everything you need to become a better typist
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
            Powerful features to track, improve and challenge yourself
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                  {title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 dark:bg-slate-900 py-16 px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ icon, value, label }) => (
            <div key={label}>
              <div className="text-3xl mb-2">{icon}</div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="py-8 text-center text-sm text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800">
        © {new Date().getFullYear()} TypeTest — All rights reserved.
      </footer>

    </main>
  );
}
