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
  "Confidence does not come from always being correct. It comes from accepting mistakes and learning from them. People who are willing to take risks often discover new opportunities and ideas. Growth happens when we step outside our comfort zone and embrace challenges."
];

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

  const inputRef = useRef(null);
  const timerRef = useRef(null);

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

  const { liveAccuracy, liveWpm } = useMemo(() => {
    const elapsed = TEST_DURATION - timeLeft;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passage[i]) correct++;
    }
    const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
    const wpm = elapsed > 0 ? Math.round((typed.length / 5) / (elapsed / 60)) : 0;
    return { liveAccuracy: acc, liveWpm: wpm };
  }, [typed, passage, timeLeft]);

  function endTest(currentTyped) {
    clearInterval(timerRef.current);
    setRunning(false);
    setFinished(true);
    setResult({ wpm: liveWpm, accuracy: liveAccuracy });
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

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-10" onClick={() => inputRef.current?.focus()}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Practice</h1>
          <button onClick={resetTest} className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">New Test</button>
        </div>

        <div className="p-6 border rounded-2xl bg-gray-50 dark:bg-slate-900 shadow-sm">
          <div className="flex justify-between mb-4 font-bold">
            <span>Time: {fmtTime(timeLeft)}</span>
            <span>WPM: {liveWpm}</span>
            <span>Accuracy: {liveAccuracy}%</span>
          </div>

          <div className="relative text-lg font-mono leading-loose tracking-wide break-words cursor-text">
            {passage.split("").map((char, i) => {
              let cls = "text-gray-400";
              if (i < typed.length) cls = typed[i] === char ? "text-slate-800 dark:text-slate-100" : "text-red-500 bg-red-100";
              return <span key={i} className={cls}>{char}</span>;
            })}
            <input ref={inputRef} value={typed} onChange={handleInput} disabled={finished} className="absolute opacity-0" />
          </div>

          {finished && result && (
            <div className="mt-6 pt-6 border-t flex gap-8">
              <div><p className="text-xs text-gray-400 uppercase">Final WPM</p><p className="text-3xl font-bold">{result.wpm}</p></div>
              <div><p className="text-xs text-gray-400 uppercase">Accuracy</p><p className="text-3xl font-bold">{result.accuracy}%</p></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
