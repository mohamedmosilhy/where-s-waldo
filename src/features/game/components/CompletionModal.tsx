"use client";

import { useState } from "react";

interface CompletionModalProps {
  isOpen: boolean;
  completionTime: number; // seconds
  onSubmit: (playerName: string) => void;
  onSkip: () => void;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(2);
  if (m > 0) return `${m}:${s.padStart(5, "0")}`;
  return `${s}s`;
}

const CONFETTI_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#fbbf24",
];

const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: (i * 3.45) % 100,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  width: 5 + ((i * 3.1) % 7),
  height: 7 + ((i * 2.9) % 9),
  duration: 2.0 + ((i * 0.29) % 1.8),
  delay: (i * 0.17) % 2.2,
  rotation: (i * 43) % 360,
  isCircle: i % 4 === 0,
}));

const STAR_DELAYS = [
  "[animation-delay:0.1s]",
  "[animation-delay:0.2s]",
  "[animation-delay:0.3s]",
];

export function CompletionModal({
  isOpen,
  completionTime,
  onSubmit,
  onSkip,
}: CompletionModalProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitting(true);
    onSubmit(trimmed);
  };

  const canSubmit = name.trim() && !submitting;

  return (
    <div
      className="fixed inset-0 z-100 h-full flex items-center justify-center p-4 animate-fade-in overflow-hidden bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      {/* Confetti — dynamic values must stay inline */}
      {CONFETTI_PIECES.map((p) => (
        <span
          key={p.id}
          aria-hidden="true"
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.isCircle ? p.width : p.height,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in infinite`,
            transform: `rotateZ(${p.rotation}deg)`,
          }}
        />
      ))}

      {/* Card */}
      <div className="relative z-10 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_rgba(251,191,36,0.08),0_25px_50px_rgba(0,0,0,0.5)] animate-celebration-pop bg-slate-900 border border-amber-500/35">
        {/* Trophy icon */}
        <div className="text-center mb-6">
          <div className="w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center mx-auto mb-4 animate-trophy-pulse bg-amber-500/15 border-2 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <svg
              className="w-9 h-9 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
              />
            </svg>
          </div>

          <h2
            id="completion-title"
            className="font-bangers text-3xl text-white tracking-wide"
          >
            You Found Them All!
          </h2>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-sm text-gray-400">Completed in</span>
            <span className="font-mono font-bold text-base text-amber-400">
              {formatTime(completionTime)}
            </span>
          </div>

          {/* Star row */}
          <div className="flex justify-center gap-1.5 mt-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`text-xl animate-bounce-in ${STAR_DELAYS[i]}`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="player-name"
              className="block text-xs font-medium mb-1.5 text-gray-400"
            >
              Enter your name for the leaderboard
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name…"
              maxLength={30}
              className="w-full rounded-lg px-4 py-2.5 text-sm text-white bg-slate-800 border border-slate-700 outline-none transition-colors"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full font-semibold py-2.5 rounded-lg text-white transition-all ${
              canSubmit
                ? "bg-red-600 cursor-pointer shadow-[0_0_14px_rgba(220,38,38,0.3)]"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {submitting ? "Saving…" : "Submit Score"}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full text-sm py-1 transition-colors text-gray-500 hover:text-gray-400"
          >
            Skip — just go back
          </button>
        </form>
      </div>
    </div>
  );
}
