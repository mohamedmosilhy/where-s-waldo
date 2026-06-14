import Image from "next/image";
import { getScenes } from "../../features/scenes/index";
import Link from "next/link";

export default async function ScenesList() {
  const scenes = await getScenes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold uppercase mb-1"
          style={{ color: "#6b7280", letterSpacing: "0.2em" }}
        >
          Choose a scene
        </p>
        <h1 className="font-bangers text-4xl text-white tracking-wide">
          All Scenes
        </h1>
      </div>

      {scenes.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg" style={{ color: "#6b7280" }}>
            No scenes available yet.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene) => (
            <li key={scene.id}>
              <Link
                href={`/scenes/${scene.id}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid #1f2937",
                }}
              >
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "16/9", backgroundColor: "#1f2937" }}
                >
                  <Image
                    loading="eager"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    src={scene.url}
                    alt={scene.name}
                    width={800}
                    height={450}
                  />
                  {/* Subtle gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
                    }}
                  />
                  {/* Play badge */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <div
                      className="rounded-full w-12 h-12 flex items-center justify-center"
                      style={{ backgroundColor: "rgba(220,38,38,0.9)", backdropFilter: "blur(4px)" }}
                    >
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
                    <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                      Find all hidden characters
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ color: "#4b5563" }}
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
