"use client";

import { useEffect, useRef, useState } from "react";

interface CelebrationScreenProps {
  playerName: string;
  completionTime: number; // seconds
  onDone: () => void;
}

const CONFETTI_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#fbbf24",
  "#84cc16",
];

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  width: number;
  height: number;
  duration: number;
  delay: number;
  rotation: number;
  isCircle: boolean;
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: (i * 1.4286) % 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    width: 6 + ((i * 4.1) % 8),
    height: 8 + ((i * 3.7) % 10),
    duration: 2.2 + ((i * 0.37) % 2.0),
    delay: (i * 0.13) % 2.8,
    rotation: (i * 37) % 360,
    isCircle: i % 5 === 0,
  }));
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(2);
  if (m > 0) return `${m}:${s.padStart(5, "0")}`;
  return `${s}s`;
}

const COUNTDOWN_SECS = 4;

const STAR_DELAYS = [
  "[animation-delay:0.45s]",
  "[animation-delay:0.55s]",
  "[animation-delay:0.65s]",
];

export function CelebrationScreen({
  playerName,
  completionTime,
  onDone,
}: CelebrationScreenProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const [confetti] = useState<ConfettiPiece[]>(makeConfetti);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          onDoneRef.current();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-100 h-full flex items-center justify-center overflow-hidden bg-gray-950/95 animate-fade-in">
      {/* Confetti — dynamic values must stay inline */}
      {confetti.map((p) => (
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

      {/* Main card */}
      <div className="relative z-10 text-center px-6 py-8 max-w-sm w-full animate-celebration-pop">
        <div className="text-7xl sm:text-8xl mb-3 animate-bounce-in [animation-delay:0.05s] block">
          🎉
        </div>

        <h1 className="font-bangers text-5xl sm:text-6xl text-white tracking-wide mb-2 animate-slide-up [animation-delay:0.15s]">
          You Did It!
        </h1>

        {playerName ? (
          <p className="text-2xl sm:text-3xl font-bold mb-5 animate-slide-up [animation-delay:0.25s] text-amber-400">
            Amazing, {playerName}!
          </p>
        ) : (
          <div className="mb-5" />
        )}

        <p className="text-base animate-slide-up [animation-delay:0.3s] text-gray-400">
          All characters found in
        </p>
        <p className="font-mono text-4xl sm:text-5xl font-bold mt-1 mb-7 animate-slide-up [animation-delay:0.35s] text-emerald-400">
          {formatTime(completionTime)}
        </p>

        {/* Star row */}
        <div className="flex justify-center gap-2 mb-8" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`text-3xl sm:text-4xl animate-bounce-in ${STAR_DELAYS[i]}`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Countdown pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full animate-fade-in [animation-delay:0.7s] bg-white/7 border border-white/10">
          <span className="text-sm text-gray-500">Returning to scenes in</span>
          <span className="font-mono font-bold text-sm tabular-nums text-amber-400 min-w-[1ch]">
            {countdown}
          </span>
          <span className="text-sm text-gray-500">s…</span>
        </div>
      </div>
    </div>
  );
}
