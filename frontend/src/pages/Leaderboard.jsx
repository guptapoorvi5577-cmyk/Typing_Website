import { useState, useEffect } from 'react';
import axios from 'axios';
import LeaderboardTable from '../components/LeaderboardTable';

const BASE = 'https://typing-website-kr3a.onrender.com/api/v1';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState('Unranked');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please log in to view the leaderboard.');
      setLoading(false);
      return;
    }

    // FIX: was /leaderboard/leaderboard — correct route is /score/leaderboard
    axios.get(`${BASE}/score/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setLeaderboard(res.data.data.leaderboard);
        setMyRank(res.data.data.myRank);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Could not load leaderboard');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">🏆 Leaderboard</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Top typists ranked by best WPM</p>

        {typeof myRank === 'number' && (
          <div className="mb-6 text-center bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl py-3">
            <span className="text-gray-500 dark:text-gray-400">Your rank: </span>
            <span className="font-bold text-blue-600 dark:text-cyan-400">#{myRank}</span>
          </div>
        )}

        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔒</div>
            <p className="text-red-500">{error}</p>
            {error.includes('log in') && (
              <a href="/login" className="mt-4 inline-block text-blue-600 dark:text-cyan-400 underline">Go to Login</a>
            )}
          </div>
        )}

        {!loading && !error && <LeaderboardTable data={leaderboard} />}
      </div>
    </div>
  );
}

export default Leaderboard;
