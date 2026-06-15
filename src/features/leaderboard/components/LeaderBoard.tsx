"use server";

import { getLeaderBoard } from "../actions";

const RANK_CLASSES = ["text-amber-400", "text-gray-200", "text-amber-700"] as const;

export async function LeaderBoard({ sceneId }: { sceneId: string }) {
  const leaderboard = await getLeaderBoard(sceneId);

  return (
    <div className="rounded-xl p-5 bg-gray-900 border border-gray-800">
      <h2 className="font-bangers text-xl text-white tracking-wide mb-4">
        Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p className="text-sm text-center py-4 text-gray-500">
          No scores yet — be the first!
        </p>
      ) : (
        <ol className="space-y-1">
          {leaderboard.map((score, i) => {
            const rank = i + 1;
            const rankClass = RANK_CLASSES[i] ?? "text-gray-500";
            const isTop3 = rank <= 3;
            return (
              <li
                key={score.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isTop3 ? "bg-gray-800/60" : ""}`}
              >
                <span className={`text-sm font-bold w-5 text-center flex-shrink-0 ${rankClass}`}>
                  {rank}
                </span>
                <span className="flex-1 text-sm font-medium truncate text-gray-200">
                  {score.playerName}
                </span>
                <span className="font-mono text-xs font-semibold text-amber-400">
                  {(score.completionTime / 1000).toFixed(2)}s
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
