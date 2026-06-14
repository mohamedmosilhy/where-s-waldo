"use server";

import { getLeaderBoard } from "../actions";

export async function LeaderBoard({ sceneId }: { sceneId: string }) {
  const leaderboard = await getLeaderBoard(sceneId);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <ul className="space-y-2">
        {leaderboard.map((score) => (
          <li key={score.id} className="flex justify-between">
            <span>{score.playerName}</span>
            <span>{(score.completionTime / 1000).toFixed(2)} seconds</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
