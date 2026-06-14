import { SceneImage } from "@/src/features/game/index";
import { LeaderBoard } from "@/src/features/leaderboard/index";
import { getSceneById } from "@/src/features/scenes/index";

export default async function SceneDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scene = await getSceneById(id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scene Detail</h1>
      {scene ? (
        <div>
          <SceneImage scene={scene} />
          <LeaderBoard sceneId={scene.id} />
        </div>
      ) : (
        <p>Scene not found</p>
      )}
    </div>
  );
}
