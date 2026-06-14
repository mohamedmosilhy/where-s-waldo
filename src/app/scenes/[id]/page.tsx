import { SceneImage } from "@/src/features/game/index";
import { LeaderBoard } from "@/src/features/leaderboard/index";
import { getSceneById } from "@/src/features/scenes/index";
import Link from "next/link";

export default async function SceneDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scene = await getSceneById(id);

  if (!scene) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg" style={{ color: "#6b7280" }}>
          Scene not found.
        </p>
        <Link
          href="/scenes"
          className="mt-4 inline-block font-medium transition-colors"
          style={{ color: "#f87171" }}
        >
          Back to scenes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <SceneImage scene={scene} />
      <div className="max-w-lg">
        <LeaderBoard sceneId={scene.id} />
      </div>
    </div>
  );
}
