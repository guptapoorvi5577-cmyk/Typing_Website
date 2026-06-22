import { useState, useEffect } from 'react';
import axios from 'axios';
import LeaderboardTable from '../components/LeaderboardTable';

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

    axios.get('https://typing-website-f8me.onrender.com/api/v1/leaderboard/leaderboard', {
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
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && <LeaderboardTable data={leaderboard} />}
      </div>
    </div>
  );
}

export default Leaderboard;
