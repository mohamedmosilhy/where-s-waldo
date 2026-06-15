import Image from "next/image";
import { getScenes } from "../../features/scenes/index";
import Link from "next/link";

export default async function ScenesList() {
  const scenes = await getScenes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase mb-1 text-gray-500 tracking-[0.2em]">
          Choose a scene
        </p>
        <h1 className="font-bangers text-4xl text-white tracking-wide">
          All Scenes
        </h1>
      </div>

      {scenes.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg text-gray-500">No scenes available yet.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene) => (
            <li key={scene.id}>
              <Link
                href={`/scenes/${scene.id}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-200 bg-gray-900 border border-gray-800"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden aspect-video bg-gray-800">
                  <Image
                    loading="eager"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    src={scene.url}
                    alt={scene.name}
                    width={800}
                    height={450}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,0.45)_0%,transparent_60%)]" />
                  {/* Play badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-red-600/90 backdrop-blur-sm">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6.5 5.5l8 4.5-8 4.5V5.5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-white">
                      {scene.name}
                    </p>
                    <p className="text-xs mt-0.5 text-gray-500">
                      Find all hidden characters
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
