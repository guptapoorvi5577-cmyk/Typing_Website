import { useState, useEffect, useCallback } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const FILTERS = [
  { key: 'alltime', label: 'All Time' },
  { key: 'month',   label: 'This Month' },
  { key: 'week',    label: 'This Week' },
  { key: 'today',   label: 'Today' },
];

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard', 'expert'];

const Leaderboard = () => {
  const { user, isLoggedIn, accessToken } = useAuth();

  // Filters & pagination state
  const [filter,     setFilter]     = useState('alltime');
  const [difficulty, setDifficulty] = useState('all');
  const [sort,       setSort]       = useState('wpm');
  const [page,       setPage]       = useState(1);

  // Data state
  const [data,    setData]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [stats,   setStats]   = useState(null);  // global summary numbers
  const [myRank,  setMyRank]  = useState(null);  // logged-in user's position
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard rows
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/leaderboard?filter=${filter}&difficulty=${difficulty}&sort=${sort}&page=${page}`
      );
      setData(res.data.data);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filter, difficulty, sort, page]);

  // Fetch global stats banner
  const fetchStats = async () => {
    try {
      const res = await api.get('/leaderboard/stats');
      setStats(res.data);
    } catch {}
  };

  // Fetch current user's rank
  const fetchMyRank = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await api.get('/leaderboard/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMyRank(res.data);
    } catch {}
  }, [isLoggedIn, accessToken]);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);
  useEffect(() => { fetchStats(); fetchMyRank(); }, [fetchMyRank]);

  // Reset to page 1 when filters change
  const handleFilterChange = (key, val) => {
    setPage(1);
    if (key === 'filter')     setFilter(val);
    if (key === 'difficulty') setDifficulty(val);
    if (key === 'sort')       setSort(val);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Page header ───────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tight">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400 mt-1">Top typists ranked by best WPM</p>
        </div>

        {/* ── Global stats banner ───────────────────────────── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatBadge label="Players"       value={stats.total_players?.toLocaleString()} />
            <StatBadge label="Tests Taken"   value={stats.total_tests?.toLocaleString()}   />
            <StatBadge label="World Record"  value={`${stats.world_record_wpm} WPM`} highlight />
            <StatBadge label="Global Avg WPM" value={stats.global_avg_wpm} />
          </div>
        )}

        {/* ── My rank card (logged-in users only) ──────────── */}
        {isLoggedIn && myRank?.rank && (
          <div className="mb-6 flex items-center gap-4 bg-yellow-400/10 border border-yellow-400/30
                          rounded-2xl px-5 py-4">
            <div className="text-3xl font-extrabold text-yellow-400">#{myRank.rank}</div>
            <div>
              <div className="text-white font-semibold">Your global rank</div>
              <div className="text-gray-400 text-sm">Best WPM: {myRank.best_wpm}</div>
            </div>
            <button
              onClick={() => {
                // Jump to the page containing the user's rank
                const targetPage = Math.ceil(myRank.rank / 25);
                setPage(targetPage);
                setFilter('alltime');
              }}
              className="ml-auto text-sm text-yellow-400 hover:underline"
            >
              Find me on the board →
            </button>
          </div>
        )}

        {/* ── Filter bar ────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-3">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => handleFilterChange('filter', f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${filter === f.key
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Difficulty chips ──────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => handleFilterChange('difficulty', d)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors
                ${difficulty === d
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* ── Table ─────────────────────────────────────────── */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <LeaderboardTable
              data={data}
              currentUserId={user?.id}
              sort={sort}
              onSort={(col) => handleFilterChange('sort', col)}
            />

            {/* ── Pagination ──────────────────────────────────── */}
            {pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-gray-500 text-sm">
                  Showing {((page - 1) * 25) + 1}–{Math.min(page * 25, total)} of {total} players
                </p>
                <div className="flex gap-2">
                  <PaginationBtn label="← Prev" onClick={() => setPage(p => p - 1)} disabled={page === 1} />
                  {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                    const p = Math.max(1, page - 2) + i;
                    if (p > pages) return null;
                    return (
                      <PaginationBtn
                        key={p}
                        label={p}
                        onClick={() => setPage(p)}
                        active={p === page}
                      />
                    );
                  })}
                  <PaginationBtn label="Next →" onClick={() => setPage(p => p + 1)} disabled={page === pages} />
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────

const StatBadge = ({ label, value, highlight }) => (
  <div className="bg-gray-800 rounded-xl px-4 py-3 text-center">
    <div className={`text-xl font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value}</div>
    <div className="text-gray-500 text-xs mt-0.5">{label}</div>
  </div>
);

const PaginationBtn = ({ label, onClick, disabled, active }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
      ${active   ? 'bg-yellow-400 text-black'       : ''}
      ${!active && !disabled ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : ''}
      ${disabled ? 'bg-gray-800/40 text-gray-600 cursor-not-allowed' : ''}`}
  >
    {label}
  </button>
);

// Skeleton rows shown while data loads
const LoadingSkeleton = () => (
  <div className="rounded-2xl border border-gray-700/60 overflow-hidden">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-700/50 animate-pulse">
        <div className="w-8 h-4 bg-gray-700 rounded" />
        <div className="w-8 h-8 bg-gray-700 rounded-full" />
        <div className="w-32 h-4 bg-gray-700 rounded" />
        <div className="ml-auto flex gap-8">
          <div className="w-12 h-4 bg-gray-700 rounded" />
          <div className="w-12 h-4 bg-gray-700 rounded" />
          <div className="w-10 h-4 bg-gray-700 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default Leaderboard;
