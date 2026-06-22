import { useState, useEffect, useRef, useCallback } from "react";

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
  "Confidence does not come from always being correct. It comes from accepting mistakes and learning from them. People who are willing to take risks often discover new opportunities and ideas. Growth happens when we step outside our comfort zone and embrace challenges."
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

export default function Practice() {
  const [passage, setPassage] = useState(() => randomPassage());
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(INITIAL_STATS);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const focusInput = () => inputRef.current?.focus();

  const startTimer = useCallback(() => {
    if (running || finished) return;
    setRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [running, finished]);

  useEffect(() => {
    if (timeLeft === 0 && running) endTest(typed);
  }, [timeLeft, running, typed]); 

  function endTest(currentTyped) {
    clearInterval(timerRef.current);
    setRunning(false);
    setFinished(true);

    let correctChars = 0;
    for (let i = 0; i < currentTyped.length; i++) {
      if (currentTyped[i] === passage[i]) correctChars++;
    }

    const elapsed = TEST_DURATION - timeLeft;
    const minutes = Math.max(elapsed / 60, 0.01);
    const wpm = Math.round((currentTyped.length / 5) / minutes);
    const accuracy = currentTyped.length > 0 
      ? Math.round((correctChars / currentTyped.length) * 100 * 10) / 10 
      : 0;

    setResult({ wpm, accuracy });
    setStats((prev) => {
      const n = prev.testsTaken + 1;
      return { 
        avgWpm: Math.round((prev.avgWpm * prev.testsTaken + wpm) / n), 
        avgAccuracy: Math.round(((prev.avgAccuracy * prev.testsTaken + accuracy) / n) * 10) / 10, 
        testsTaken: n 
      };
    });
  }

  function resetTest() {
    clearInterval(timerRef.current);
    setPassage(randomPassage());
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
    if (!running) startTimer();
    setTyped(val);
    if (val.length >= passage.length) endTest(val);
  }

  // Live Stats Logic
  const elapsed = TEST_DURATION - timeLeft;
  const liveWpm = elapsed > 0 ? Math.round((typed.length / 5) / (elapsed / 60)) : 0;
  let liveCorrectChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === passage[i]) liveCorrectChars++;
  }
  const liveAccuracy = typed.length > 0 ? Math.round((liveCorrectChars / typed.length) * 100 * 10) / 10 : 0;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300" onClick={focusInput}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Practice</h1>
          <button onClick={(e) => { e.stopPropagation(); resetTest(); }} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50">New Test</button>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-sm text-gray-500">Time Left</span>
              <span className="text-xl font-bold tabular-nums">{fmtTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium">
              <span>WPM <span className="font-bold text-base">{running || finished ? liveWpm : 0}</span></span>
              <span>
                <span className={`font-bold text-base ${(running || finished) && liveAccuracy < 80 ? "text-red-500" : "text-green-500"}`}>
                  {running || finished ? liveAccuracy : 0}%
                </span>
                <span className="text-gray-400 ml-1">Accuracy</span>
              </span>
            </div>
          </div>

          <div className="relative px-6 pt-6 pb-3 cursor-text select-none" onClick={focusInput}>
            <p className="leading-loose tracking-wide break-words">
              {passage.split("").map((char, i) => {
                let cls = "text-gray-400 dark:text-slate-500";
                if (i < typed.length) cls = typed[i] === char ? "text-slate-800 dark:text-slate-100" : "text-red-500 bg-red-100";
                return <span key={i} className={`${cls} font-mono text-lg`}>{char}</span>;
              })}
            </p>
            <input ref={inputRef} value={typed} onChange={handleInput} disabled={finished} className="absolute opacity-0" />
          </div>

          {finished && result && (
            <div className="border-t px-6 py-5 flex items-center justify-between">
              <div className="flex gap-8">
                <div><p className="text-xs text-gray-400 uppercase">Final WPM</p><p className="text-3xl font-extrabold">{result.wpm}</p></div>
                <div><p className="text-xs text-gray-400 uppercase">Accuracy</p><p className="text-3xl font-extrabold">{result.accuracy}%</p></div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); resetTest(); }} className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
