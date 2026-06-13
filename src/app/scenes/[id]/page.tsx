import { SceneImage } from "@/src/features/game/index";
import { getSceneById } from "@/src/features/scenes/index";

export default async function SceneDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scene = await getSceneById(id);

  console.log("scene", scene);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scene Detail</h1>
      {scene ? <SceneImage scene={scene} /> : <p>Scene not found</p>}
    </div>
  );
}
