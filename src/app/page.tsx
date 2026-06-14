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
      <main
        className="flex flex-col items-center justify-center relative overflow-hidden px-4"
        style={{ minHeight: "calc(100vh - 3.5rem)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(220,38,38,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, #dc2626, transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, #dc2626, transparent)",
          }}
        />

        <div className="relative z-10 text-center max-w-3xl">
          <p
            className="text-xs font-semibold uppercase mb-6"
            style={{ color: "#f87171", letterSpacing: "0.25em" }}
          >
            The Classic Search Game
          </p>

          <h1
            className="font-bangers leading-none"
            style={{
              fontSize: "clamp(4rem, 14vw, 9rem)",
              color: "#ffffff",
              textShadow: "3px 3px 0 #dc2626, 6px 6px 0 #7f1d1d",
            }}
          >
            WHERE&apos;S
          </h1>
          <h1
            className="font-bangers leading-none mb-8"
            style={{
              fontSize: "clamp(4rem, 14vw, 9rem)",
              color: "#ef4444",
              textShadow: "3px 3px 0 #991b1b",
            }}
          >
            WALDO?
          </h1>

          <p
            className="text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed"
            style={{ color: "#6b7280" }}
          >
            Scan intricate illustrated scenes, find every hidden character, and
            race your way to the top of the leaderboard.
          </p>

          <Link
            href="/scenes"
            className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-full text-white transition-all duration-150"
            style={{ backgroundColor: "#dc2626" }}
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
                className="px-3 py-1 rounded-full border text-xs"
                style={{ borderColor: "#1f2937", color: "#4b5563" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* ── Characters ── */}
      <section
        className="py-20 px-4"
        style={{ borderTop: "1px solid #111827" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold uppercase mb-2"
              style={{ color: "#6b7280", letterSpacing: "0.2em" }}
            >
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
                className="rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid #1f2937",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 font-bangers text-2xl"
                  style={{
                    backgroundColor: char.bgColor,
                    color: char.textColor,
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
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#6b7280" }}
                >
                  {char.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to play ── */}
      <section
        className="py-20 px-4"
        style={{ borderTop: "1px solid #111827" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold uppercase mb-2"
              style={{ color: "#6b7280", letterSpacing: "0.2em" }}
            >
              Getting started
            </p>
            <h2 className="font-bangers text-4xl text-white tracking-wide">
              How to Play
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_TO_PLAY.map((item) => (
              <div key={item.step} className="relative">
                {/* Step number */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bangers text-xl mb-4"
                  style={{ backgroundColor: "#dc2626", color: "#fff" }}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#6b7280" }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/scenes"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full border transition-colors"
              style={{ borderColor: "#dc2626", color: "#ef4444" }}
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
