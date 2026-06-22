import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog. A good typist can type quickly and accurately without constantly looking at the keyboard. Regular practice improves speed, reduces errors, and builds confidence. Consistency is the key to becoming a skilled and efficient typist.",
  "Programming is the art of solving problems with code. Great developers write programs that are easy to understand and maintain. Learning to code requires patience, practice, and curiosity. Every project teaches valuable lessons that help improve problem-solving and logical thinking skills.",
  "Success is not final and failure is not the end. What truly matters is the courage to keep moving forward despite challenges. Every expert was once a beginner who made mistakes and learned from them. Persistence and dedication are essential ingredients for long-term achievement.",
  "The only way to do great work is to enjoy what you do. Passion creates motivation, and motivation drives progress. If you have not yet discovered what excites you, continue exploring. Opportunities often appear when you stay curious, open-minded, and committed to learning.",
  "Every difficulty carries an opportunity to learn and grow. Progress begins with a single step, no matter how small. Consistent effort turns challenges into achievements over time. Focus on improvement rather than perfection, and you will gradually accomplish goals that once seemed impossible.",
  "Discipline is the foundation of success. It helps people stay focused on their goals even when motivation fades. Small actions repeated daily create powerful results. By developing positive habits and maintaining consistency, anyone can make steady progress toward their dreams and aspirations.",
  "Reading strengthens the mind just as exercise strengthens the body. It improves concentration, expands vocabulary, and increases knowledge. Books introduce new ideas, perspectives, and experiences that may never be encountered otherwise. A regular reading habit contributes greatly to personal and intellectual growth.",
  "The future is shaped by the choices we make today. Every decision, no matter how small, influences the direction of our lives. Setting clear goals and taking consistent action helps create meaningful progress. Success often comes from intentional effort rather than luck alone.",
  "Patience is the ability to remain positive while waiting for results. Meaningful accomplishments rarely happen overnight. Growth requires time, persistence, and trust in the process. Those who stay committed during difficult periods often achieve outcomes that are far more rewarding and sustainable.",
  "Confidence does not come from always being correct. It comes from accepting mistakes and learning from them. People who are willing to take risks often discover new opportunities and ideas. Growth happens when we step outside our comfort zone and embrace challenges.",
];

const INITIAL_STATS = { avgWpm: 0, avgAccuracy: 0, testsTaken: 0 };
const TEST_DURATION = 60;

function randomPassage() {
  return PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
}

function fmtTime(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

// ✅ Pure function — no stale closure issues
function calcStats(typedStr, passageStr, elapsedSeconds) {
  const wordsTyped = typedStr.trim().split(/\s+/).filter(Boolean);
  const referenceWords = passageStr.trim().split(/\s+/);
  const minutes = Math.max(elapsedSeconds / 60, 0.01);

  // Only count fully completed words (not the word currently being typed)
  const completedWords = typedStr.endsWith(" ")
    ? wordsTyped
    : wordsTyped.slice(0, -1);

  let correct = 0;
  completedWords.forEach((w, i) => {
    if (w === referenceWords[i]) correct++;
  });

  const wpm = Math.round(completedWords.length / minutes);
  const accuracy =
    completedWords.length > 0
      ? Math.round((correct / completedWords.length) * 100 * 10) / 10
      : 0;

  return { wpm, accuracy };
}

export default function Practice() {
  const [passage, setPassage] = useState(() => randomPassage());
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // ✅ Use refs to always have fresh values inside setInterval/endTest
  const typedRef = useRef("");
  const timeLeftRef = useRef(TEST_DURATION);
  const passageRef = useRef(passage);

  const focusInput = () => inputRef.current?.focus();

  function endTest(finalTyped, finalTimeLeft) {
    clearInterval(timerRef.current);
    setRunning(false);
    setFinished(true);

    const elapsed = TEST_DURATION - finalTimeLeft;
    const { wpm, accuracy } = calcStats(finalTyped, passageRef.current, elapsed);

    setResult({ wpm, accuracy });
    setStats((prev) => {
      const n = prev.testsTaken + 1;
      const newAvgWpm = Math.round((prev.avgWpm * prev.testsTaken + wpm) / n);
      const newAvgAcc =
        Math.round(((prev.avgAccuracy * prev.testsTaken + accuracy) / n) * 10) / 10;
      return { avgWpm: newAvgWpm, avgAccuracy: newAvgAcc, testsTaken: n };
    });
  }

  const startTimer = useCallback(() => {
    if (running || finished) return;
    setRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        timeLeftRef.current = next;
        if (next <= 0) {
          clearInterval(timerRef.current);
          // ✅ Read fresh values from refs — no stale closure
          endTest(typedRef.current, 0);
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [running, finished]);

  function resetTest() {
    clearInterval(timerRef.current);
    const newPassage = randomPassage();
    passageRef.current = newPassage;
    typedRef.current = "";
    timeLeftRef.current = TEST_DURATION;
    setPassage(newPassage);
    setTyped("");
    setTimeLeft(TEST_DURATION);
    setRunning(false);
    setFinished(false);
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleInput(e) {
    if (finished) return;
    const val = e.target.value;
    typedRef.current = val; // ✅ Keep ref in sync
    if (!running) startTimer();
    setTyped(val);
    if (val.length >= passage.length) {
      endTest(val, timeLeftRef.current);
    }
  }

  function renderPassage() {
    return passage.split("").map((char, i) => {
      let cls = "text-gray-400 dark:text-slate-500";
      if (i < typed.length) {
        cls =
          typed[i] === char
            ? "text-slate-800 dark:text-slate-100"
            : "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/40";
      }
      const isCursor = i === typed.length && running;
      return (
        <span
          key={i}
          className={`${cls} ${isCursor ? "border-l-2 border-blue-500 dark:border-cyan-400 animate-pulse" : ""} font-mono text-lg leading-relaxed`}
        >
          {char}
        </span>
      );
    });
  }

  // ✅ Live stats also use the pure calcStats function
  const elapsed = TEST_DURATION - timeLeft;
  const { wpm: liveWpm, accuracy: liveAccuracy } = running || finished
    ? calcStats(typed, passage, elapsed)
    : { wpm: 0, accuracy: 0 };

  return (
    <main
      className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
      onClick={focusInput}
    >
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Practice</h1>
          <button
            onClick={(e) => { e.stopPropagation(); resetTest(); }}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Test
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-semibold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Left</span>
              <span className="text-xl font-bold tabular-nums">{fmtTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium">
              <span>
                <span className="text-gray-400 dark:text-gray-500 mr-1">WPM</span>
                <span className="text-slate-800 dark:text-slate-100 font-bold text-base">{liveWpm}</span>
              </span>
              <span>
                <span className={`font-bold text-base ${liveAccuracy < 80 && (running || finished) ? "text-red-500" : "text-green-500"}`}>
                  {liveAccuracy}%
                </span>
                <span className="text-gray-400 dark:text-gray-500 ml-1">Accuracy</span>
              </span>
            </div>
          </div>

          <div className="relative px-6 pt-6 pb-3 cursor-text select-none" onClick={focusInput}>
            <p className="leading-loose tracking-wide break-words">{renderPassage()}</p>
            {!running && !finished && (
              <p className="mt-3 text-center text-gray-400 dark:text-slate-500 text-sm font-medium animate-pulse">
                Click here or start typing to begin…
              </p>
            )}
            <input
              ref={inputRef}
              value={typed}
              onChange={handleInput}
              disabled={finished}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          {finished && result && (
            <div className="border-t border-gray-200 dark:border-slate-700 px-6 py-5 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Final WPM</p>
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400 tabular-nums">{result.wpm}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Accuracy</p>
                  <p className="text-3xl font-extrabold text-green-500 tabular-nums">{result.accuracy}%</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); resetTest(); }}
                className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold text-sm hover:scale-105 transition-all shadow"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {stats.testsTaken > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Session Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Avg WPM" value={stats.avgWpm} color="text-blue-600 dark:text-cyan-400" />
              <StatCard label="Avg Accuracy" value={`${stats.avgAccuracy}%`} color="text-green-500" />
              <StatCard label="Tests Taken" value={stats.testsTaken} color="text-slate-700 dark:text-slate-200" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl px-5 py-4 text-center">
      <p className={`text-2xl font-extrabold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{label}</p>
    </div>
  );
}
