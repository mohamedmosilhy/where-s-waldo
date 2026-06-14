"use server";

import { getLeaderBoard } from "../actions";

const RANK_COLORS = ["#fbbf24", "#e5e7eb", "#b45309"] as const;

export async function LeaderBoard({ sceneId }: { sceneId: string }) {
  const leaderboard = await getLeaderBoard(sceneId);

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "#111827",
        border: "1px solid #1f2937",
      }}
    >
      <h2 className="font-bangers text-xl text-white tracking-wide mb-4">
        Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p
          className="text-sm text-center py-4"
          style={{ color: "#6b7280" }}
        >
          No scores yet — be the first!
        </p>
      ) : (
        <ol className="space-y-1">
          {leaderboard.map((score, i) => {
            const rank = i + 1;
            const rankColor = RANK_COLORS[i] ?? "#6b7280";
            const isTop3 = rank <= 3;
            return (
              <li
                key={score.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: isTop3
                    ? "rgba(31,41,55,0.6)"
                    : "transparent",
                }}
              >
                <span
                  className="text-sm font-bold w-5 text-center flex-shrink-0"
                  style={{ color: rankColor }}
                >
                  {rank}
                </span>
                <span
                  className="flex-1 text-sm font-medium truncate"
                  style={{ color: "#e5e7eb" }}
                >
                  {score.playerName}
                </span>
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: "#fbbf24" }}
                >
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
