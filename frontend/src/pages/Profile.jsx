import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE = 'https://typing-website-kr3a.onrender.com/api/v1';

function Profile() {
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    // FIX: was /scores/latest (wrong plural) — correct route is /score/latest
    axios.get(`${BASE}/score/latest`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setScore(res.data.data))
      .catch((err) => {
        // 404 just means no tests taken yet — not a real error
        if (err.response?.status === 404) {
          setScore(null);
        } else {
          setError(err.response?.data?.message || 'Could not load profile data');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-8 rounded-2xl shadow-md text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🔒</div>
          <p className="mb-4 text-gray-700 dark:text-gray-300">You need to log in to view your profile.</p>
          <Link to="/login" className="inline-block px-6 py-2 bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full font-semibold hover:scale-105 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-10">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            {score ? (
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Latest Test</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400">{score.wpm}</p>
                    <p className="text-xs text-gray-400 mt-1">WPM</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-green-500">{score.accuracy}%</p>
                    <p className="text-xs text-gray-400 mt-1">Accuracy</p>
                  </div>
                </div>
              </div>
            ) : !error && (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">⌨️</div>
                <p className="text-gray-500 dark:text-gray-400">No test results yet. Take your first test!</p>
              </div>
            )}

            <Link to="/practice" className="block mt-6 text-center px-6 py-2.5 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold hover:scale-105 transition-all shadow">
              Take a Test
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
