import { getSceneById } from "@/src/features/scenes/actions";
import Image from "next/image";

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
      <p className="text-lg">{scene?.name}</p>
      <Image
        className="mt-4  p-4 border rounded border-gray-300 object-cover w-3/4"
        loading="eager"
        src={scene!.url}
        alt={scene!.name}
        height={400}
        width={400}
      />
      <h2 className="text-xl font-semibold mt-8 mb-4">Characters</h2>
      <ul className="flex flex-wrap gap-4 p-4">
        {scene?.characters.map((imageCharacter) => (
          <li
            key={imageCharacter.character.id}
            className="border rounded border-gray-300 p-4 w-1/4"
          >
            <p>{imageCharacter.character.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
