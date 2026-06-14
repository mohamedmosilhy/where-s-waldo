import Image from "next/image";
import { getScenes } from "../../features/scenes/index";
import Link from "next/link";

export default async function ScenesList() {
  const scenes = await getScenes();

  return (
    <div>
      <h1>All Scenes</h1>
      <ul className="mt-8 flex flex-wrap gap-8 justify-center">
        {scenes.map((scene) => (
          <li
            key={scene.id}
            className="mb-8 flex flex-col items-center gap-4 border rounded border-gray-300 p-4 w-1/4"
          >
            <Link
              href={`/scenes/${scene.id}`}
              className="flex flex-col items-center gap-4"
            >
              <p>{scene.name}</p>
              <Image
                loading="eager"
                className="w-full h-auto rounded border border-gray-300 object-cover"
                src={scene.url}
                alt={scene.name}
                width={400}
                height={400}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
