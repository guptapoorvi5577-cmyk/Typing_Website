import { Link } from 'react-router-dom';

// Medal colors for top 3
const MEDAL = { 0: '🥇', 1: '🥈', 2: '🥉' };

// Props:
//   data          — array of leaderboard rows
//   currentUserId — logged-in user id (to highlight their row)
//   sort / onSort — current sort column and setter
const LeaderboardTable = ({ data = [], currentUserId, sort, onSort }) => {
  const SortTh = ({ col, label, align = 'right' }) => (
    <th
      className={`px-4 py-3 text-${align} cursor-pointer select-none group`}
      onClick={() => onSort?.(col)}
    >
      <span className={`${sort === col ? 'text-yellow-400' : 'text-gray-400 group-hover:text-gray-200'} transition-colors`}>
        {label}
        {sort === col && <span className="ml-1 text-yellow-400">↓</span>}
      </span>
    </th>
  );

  if (data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-5xl mb-3">🏁</div>
        <p>No results yet for this filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-700/60">
      <table className="w-full text-sm">
        <thead className="bg-gray-800/80 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left text-gray-400 w-12">#</th>
            <th className="px-4 py-3 text-left text-gray-400">Player</th>
            <SortTh col="wpm"      label="Best WPM" />
            <SortTh col="accuracy" label="Accuracy" />
            <SortTh col="tests"    label="Tests"    />
            <th className="px-4 py-3 text-right text-gray-400 hidden md:table-cell">Streak</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isMe    = row.id === currentUserId;
            const isTop3  = row.rank <= 3;

            return (
              <tr
                key={row.id}
                className={`border-t border-gray-700/50 transition-colors
                  ${isMe
                    ? 'bg-yellow-400/10 border-l-2 border-l-yellow-400'
                    : 'hover:bg-gray-800/40'}`}
              >
                {/* Rank */}
                <td className="px-4 py-3 font-bold text-center">
                  {isTop3
                    ? <span className="text-lg">{MEDAL[row.rank - 1]}</span>
                    : <span className="text-gray-500">#{row.rank}</span>}
                </td>

                {/* Player */}
                <td className="px-4 py-3">
                  <Link
                    to={`/profile/${row.username}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    {row.avatar_url ? (
                      <img src={row.avatar_url} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500
                                      flex items-center justify-center text-black font-bold text-xs shrink-0">
                        {row.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className={`font-semibold ${isMe ? 'text-yellow-400' : 'text-white'}`}>
                        {row.username}
                        {isMe && <span className="ml-2 text-xs bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded-full">You</span>}
                      </div>
                    </div>
                  </Link>
                </td>

                {/* Best WPM */}
                <td className="px-4 py-3 text-right">
                  <span className={`font-extrabold text-base ${isTop3 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {row.best_wpm}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">wpm</span>
                </td>

                {/* Accuracy */}
                <td className="px-4 py-3 text-right text-gray-300">
                  {row.avg_accuracy}%
                </td>

                {/* Tests */}
                <td className="px-4 py-3 text-right text-gray-400">
                  {row.tests_taken}
                </td>

                {/* Streak (hidden on mobile) */}
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  {row.current_streak > 0
                    ? <span className="text-orange-400">🔥 {row.current_streak}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
