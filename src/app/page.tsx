import Link from "next/link";
import Image from "next/image";
import { ALL_CHARACTERS } from "@/src/features/game/character-config";

const HOW_TO_PLAY = [
  {
    step: "1",
    title: "Pick a Scene",
    description:
      "Choose from detailed illustrated scenes — each one is packed with characters and chaos.",
  },
  {
    step: "2",
    title: "Click to Search",
    description:
      "Click anywhere on the image where you think a character is hiding to open the selection menu.",
  },
  {
    step: "3",
    title: "Name the Character",
    description:
      "Select the character you found from the menu. Wrong guess? Keep searching!",
  },
  {
    step: "4",
    title: "Beat the Clock",
    description:
      "Find every character as fast as you can, then submit your name to claim a spot on the leaderboard.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <main className="flex flex-col items-center justify-center relative overflow-hidden px-4 min-h-[calc(100vh-3.5rem)]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(220,38,38,0.07)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-[linear-gradient(to_right,transparent,#dc2626,transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none bg-[linear-gradient(to_right,transparent,#dc2626,transparent)]" />

        <div className="relative z-10 text-center max-w-3xl">
          <p className="text-xs font-semibold uppercase mb-6 text-red-400 tracking-[0.25em]">
            The Classic Search Game
          </p>

          <h1 className="font-bangers leading-none text-[clamp(4rem,14vw,9rem)] text-white [text-shadow:3px_3px_0_#dc2626,6px_6px_0_#7f1d1d]">
            WHERE&apos;S
          </h1>
          <h1 className="font-bangers leading-none mb-8 text-[clamp(4rem,14vw,9rem)] text-red-500 [text-shadow:3px_3px_0_#991b1b]">
            WALDO?
          </h1>

          <p className="text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed text-gray-500">
            Scan intricate illustrated scenes, find every hidden character, and
            race your way to the top of the leaderboard.
          </p>

          <Link
            href="/scenes"
            className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-full text-white transition-all duration-150 bg-red-600 hover:bg-red-500"
          >
            Play Now
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.25 3.25l5.5 4.75-5.5 4.75V3.25z" />
            </svg>
          </Link>

          <div className="mt-12 flex flex-wrap gap-2 justify-center">
            {[
              "Multiple Scenes",
              "Live Timer",
              "Global Leaderboard",
              "Hidden Characters",
            ].map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full border text-xs border-gray-800 text-gray-600"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* ── Characters ── */}
      <section className="py-20 px-4 border-t border-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase mb-2 text-gray-500 tracking-[0.2em]">
              Who to find
            </p>
            <h2 className="font-bangers text-4xl text-white tracking-wide">
              The Characters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ALL_CHARACTERS.map((char) => (
              <div
                key={char.name}
                className="rounded-2xl p-6 text-center bg-gray-900 border border-gray-800"
              >
                {/* Avatar — bgColor and ring color are dynamic from char data */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 font-bangers text-2xl"
                  style={{
                    backgroundColor: char.bgColor,
                    boxShadow: `0 0 0 4px ${char.bgColor}33`,
                  }}
                >
                  <Image
                    src={char.imageUrl}
                    alt={char.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {char.name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {char.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to play ── */}
      <section className="py-20 px-4 border-t border-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase mb-2 text-gray-500 tracking-[0.2em]">
              Getting started
            </p>
            <h2 className="font-bangers text-4xl text-white tracking-wide">
              How to Play
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_TO_PLAY.map((item) => (
              <div key={item.step} className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bangers text-xl mb-4 bg-red-600 text-white">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/scenes"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full border transition-colors border-red-600 text-red-500 hover:bg-red-600/10"
            >
              Browse Scenes
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.25 3.25l5.5 4.75-5.5 4.75V3.25z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
