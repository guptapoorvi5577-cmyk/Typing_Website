import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

const BASE = 'https://typing-website-kr3a.onrender.com/api/v1';

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog A good typist can type quickly and accurately without constantly looking at the keyboard Regular practice improves speed reduces errors and builds confidence Consistency is the key to becoming a skilled and efficient typist",
  "Programming is the art of solving problems with code Great developers write programs that are easy to understand and maintain Learning to code requires patience practice and curiosity Every project teaches valuable lessons that help improve problem solving and logical thinking skills",
  "Success is not final and failure is not the end What truly matters is the courage to keep moving forward despite challenges Every expert was once a beginner who made mistakes and learned from them Persistence and dedication are essential ingredients for long term achievement",
  "The only way to do great work is to enjoy what you do Passion creates motivation and motivation drives progress If you have not yet discovered what excites you continue exploring Opportunities often appear when you stay curious open minded and committed to learning",
  "Every difficulty carries an opportunity to learn and grow Progress begins with a single step no matter how small Consistent effort turns challenges into achievements over time Focus on improvement rather than perfection and you will gradually accomplish goals that once seemed impossible",
  "Discipline is the foundation of success It helps people stay focused on their goals even when motivation fades Small actions repeated daily create powerful results By developing positive habits and maintaining consistency anyone can make steady progress toward their dreams and aspirations",
  "Reading strengthens the mind just as exercise strengthens the body It improves concentration expands vocabulary and increases knowledge Books introduce new ideas perspectives and experiences that may never be encountered otherwise A regular reading habit contributes greatly to personal and intellectual growth",
  "The future is shaped by the choices we make today Every decision no matter how small influences the direction of our lives Setting clear goals and taking consistent action helps create meaningful progress Success often comes from intentional effort rather than luck alone",
  "Patience is the ability to remain positive while waiting for results Meaningful accomplishments rarely happen overnight Growth requires time persistence and trust in the process Those who stay committed during difficult periods often achieve outcomes that are far more rewarding and sustainable",
  "Confidence does not come from always being correct It comes from accepting mistakes and learning from them People who are willing to take risks often discover new opportunities and ideas Growth happens when we step outside our comfort zone and embrace challenges"
];

const TEST_DURATION = 60;

function randomPassage() {
  const first = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
  const second = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
  return `${first} ${second}`;
}

function fmtTime(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

function calcStats(typedStr, passageStr, elapsedSeconds) {
  const minutes = Math.max(elapsedSeconds / 60, 0.01);
  const wpm = Math.round((typedStr.length / 5) / minutes);
  let correctChars = 0;
  for (let i = 0; i < typedStr.length; i++) {
    if (typedStr[i] === passageStr[i]) correctChars++;
  }
  const accuracy = typedStr.length > 0 ? Math.round((correctChars / typedStr.length) * 100 * 10) / 10 : 100;
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

  const focusInput = () => inputRef.current?.focus();

  const endTest = useCallback((finalTyped, finalTimeLeft) => {
    clearInterval(timerRef.current);
    const elapsed = TEST_DURATION - finalTimeLeft;
    const finalStats = calcStats(finalTyped, passage, elapsed);
    
    setResult(finalStats);
    setFinished(true);
    setRunning(false);

    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`${BASE}/score/saveTest`, {
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
        duration: TEST_DURATION,
        paragraphId: '000000000000000000000000'
      }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  }, [passage]);

  const startTimer = () => {
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
  };

  useEffect(() => {
    if (timeLeft === 0 && running) {
      endTest(typed, 0);
    }
  }, [timeLeft, running, typed, endTest]);

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
    if (!running) startTimer();
    const val = e.target.value;
    setTyped(val);
    if (val.length >= passage.length) endTest(val, timeLeft - 1);
  }

  const { wpm: liveWpm, accuracy: liveAccuracy } = (running || finished) 
    ? calcStats(typed, passage, TEST_DURATION - timeLeft) 
    : { wpm: 0, accuracy: 0 };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8" onClick={focusInput}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Practice</h1>
          <button onClick={(e) => { e.stopPropagation(); resetTest(); }} className="px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800">New Test</button>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between text-sm font-bold mb-4 opacity-70">
            <span>{fmtTime(timeLeft)}</span>
            <span>WPM: {finished ? result?.wpm : liveWpm} | Accuracy: {finished ? result?.accuracy : liveAccuracy}%</span>
          </div>

          <div className="relative cursor-text" onClick={focusInput}>
            {!running && !finished && (
              <p className="absolute inset-0 flex items-center justify-center text-slate-500 animate-pulse z-10 bg-slate-900/90 backdrop-blur-sm cursor-pointer">
                Click here to start your test
              </p>
            )}
            <p className="leading-loose font-mono text-lg">
              {passage.split("").map((char, i) => (
                <span key={i} className={`${i < typed.length ? (typed[i] === char ? "text-slate-100" : "text-red-400 bg-red-900/40") : "text-slate-600"} ${i === typed.length && running ? "border-l-2 border-blue-500 animate-pulse" : ""}`}>
                  {char}
                </span>
              ))}
            </p>
            <input ref={inputRef} value={typed} onChange={handleInput} disabled={finished} className="absolute opacity-0" />
          </div>

          {finished && result && (
            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-sm opacity-60">Result</p>
                <p className="text-3xl font-bold">{result.wpm} WPM / {result.accuracy}% Acc</p>
              </div>
              <button onClick={resetTest} className="px-6 py-2 bg-blue-600 rounded-full font-bold">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
