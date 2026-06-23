import { Link } from "react-router-dom";

const HERO_WORDS = ["the", "quick", "brown", "fox", "jumps"];
const TYPED_UP_TO = 3; // first 3 words "typed"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-28 px-6 text-center">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
          typing speed test
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          How fast do <br /> you actually type?
        </h1>
        <p className="text-slate-400 text-lg mb-10 max-w-sm">
          60-second test. Instant results. No signup needed.
        </p>

        {/* Fake typing preview */}
        <div className="mb-10 flex gap-3 text-2xl font-mono">
          {HERO_WORDS.map((word, i) => (
            <span
              key={i}
              className={
                i < TYPED_UP_TO
                  ? "text-slate-100"
                  : i === TYPED_UP_TO
                  ? "text-accent border-b-2 border-accent"
                  : "text-slate-600"
              }
            >
              {word}
            </span>
          ))}
        </div>

        <Link
          to="/practice"
          className="bg-accent text-slate-900 font-bold text-lg px-10 py-3.5 rounded-full hover:scale-105 transition-all shadow-lg"
        >
          Start Test
        </Link>
      </section>

      {/* Three honest features */}
      <section className="max-w-3xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { title: "WPM & Accuracy", desc: "See your words per minute and accuracy the moment you finish." },
          { title: "Session Stats",  desc: "Track your average across multiple tests in one sitting." },
          { title: "Leaderboard",    desc: "Create an account and compete with other typists." },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-accent mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <footer className="py-6 text-center text-xs text-slate-700 border-t border-slate-800">
        © {new Date().getFullYear()} TypeTest
      </footer>
    </main>
  );
}
