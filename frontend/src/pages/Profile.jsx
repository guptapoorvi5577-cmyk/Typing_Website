import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE = 'https://typing-website-kr3a.onrender.com/api/v1';

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl px-5 py-4 text-center">
      <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-blue-500 dark:text-cyan-400 font-semibold mt-0.5">{sub}</p>}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function Profile() {
  const [stats, setStats]     = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    axios.get(`${BASE}/score/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data.data))
      .catch(err => {
        if (err.response?.status === 404) setStats(null);
        else setError(err.response?.data?.message || 'Could not load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 transition-colors">
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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-10 transition-colors">
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">My Profile</h2>

        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error   && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && stats ? (
          <>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Tests Taken"  value={stats.testsTaken} />
                <StatCard label="Best WPM"     value={stats.bestWpm} sub="🏆 Personal Best" />
                <StatCard label="Average WPM"  value={stats.avgWpm} />
                <StatCard label="Avg Accuracy" value={`${stats.avgAccuracy}%`} />
              </div>
            </div>

            {stats.last5?.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Last 5 Tests</h3>
                <div className="space-y-2">
                  {stats.last5.map((t, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                      <span className="text-xs text-gray-400 dark:text-gray-500">#{stats.testsTaken - i}</span>
                      <div className="flex gap-6">
                        <span className="text-sm font-bold text-blue-600 dark:text-cyan-400">
                          {t.wpm} <span className="font-normal text-gray-400 text-xs">wpm</span>
                        </span>
                        <span className="text-sm font-bold text-green-500">
                          {t.accuracy}% <span className="font-normal text-gray-400 text-xs">acc</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : !loading && !error && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">⌨️</div>
            <p className="text-gray-500 dark:text-gray-400">No tests yet. Take your first test!</p>
          </div>
        )}

        <Link to="/practice" className="block text-center px-6 py-2.5 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold hover:scale-105 transition-all shadow">
          Take a Test
        </Link>
      </div>
    </div>
  );
}

export default Profile;
