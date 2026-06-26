const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

const LeaderboardTable = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <div className="text-5xl mb-3">🏁</div>
        <p>No results yet. Be the first on the board!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-slate-800/80 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left text-gray-400 w-12">#</th>
            <th className="px-4 py-3 text-left text-gray-400">Player</th>
            <th className="px-4 py-3 text-right text-gray-400">Best WPM</th>
            <th className="px-4 py-3 text-right text-gray-400">Avg Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isTop3 = row.rank <= 3;
            const displayName = row.name || 'Anonymous';

            return (
              <tr
                key={row.userId}
                className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-4 py-3 font-bold text-center">
                  {isTop3
                    ? <span className="text-lg">{MEDAL[row.rank]}</span>
                    : <span className="text-gray-400 dark:text-gray-500">#{row.rank}</span>}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {displayName[0].toUpperCase()}
                    </div>
                    <span className={`font-semibold ${isTop3 ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {displayName}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-right">
                  <span className={`font-extrabold text-base ${isTop3 ? 'text-yellow-500 dark:text-yellow-400' : 'text-blue-600 dark:text-cyan-400'}`}>
                    {row.wpm}
                  </span>
                  <span className="text-gray-400 text-xs ml-1">wpm</span>
                </td>

                <td className="px-4 py-3 text-right">
                 <span className="font-extrabold text-base text-green-500">
  {row.accuracy != null ? `${row.accuracy}%` : 'N/A'}
</span>
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
