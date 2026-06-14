import Link from "next/link";

export default function Home() {
  return (
    <main
      className="flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ minHeight: "calc(100vh - 3.5rem)" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(220,38,38,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Top / bottom stripe accents */}
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
        {/* Eyebrow label */}
        <p
          className="text-xs font-semibold uppercase mb-6"
          style={{ color: "#f87171", letterSpacing: "0.25em" }}
        >
          The Classic Search Game
        </p>

        {/* Hero title */}
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

        {/* Description */}
        <p
          className="text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed"
          style={{ color: "#6b7280" }}
        >
          Scan intricate illustrated scenes, find every hidden character, and
          race your way to the top of the leaderboard.
        </p>

        {/* CTA */}
        <Link
          href="/scenes"
          className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-full text-white transition-all duration-150"
          style={{ backgroundColor: "#dc2626" }}
        >
          Play Now
          {/* Arrow icon */}
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

        {/* Feature pills */}
        <div className="mt-12 flex flex-wrap gap-2 justify-center">
          {[
            "Multiple Scenes",
            "Live Timer",
            "Global Leaderboard",
            "Hidden Characters",
          ].map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 rounded-full border text-xs"
              style={{ borderColor: "#1f2937", color: "#4b5563" }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
