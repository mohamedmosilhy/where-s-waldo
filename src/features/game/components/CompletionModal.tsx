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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-slide-up"
        style={{
          backgroundColor: "#111827",
          border: "1px solid #374151",
        }}
      >
        {/* Trophy icon */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: "rgba(245,158,11,0.1)",
              border: "2px solid rgba(245,158,11,0.3)",
            }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              style={{ color: "#fbbf24" }}
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
          <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
            Completed in{" "}
            <span
              className="font-mono font-semibold"
              style={{ color: "#fbbf24" }}
            >
              {formatTime(completionTime)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="player-name"
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#9ca3af" }}
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
              className="w-full rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
              style={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                outline: "none",
              }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="w-full font-semibold py-2.5 rounded-lg text-white transition-colors"
            style={{
              backgroundColor: name.trim() && !submitting ? "#dc2626" : "#374151",
              color: name.trim() && !submitting ? "#ffffff" : "#6b7280",
              cursor: name.trim() && !submitting ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Saving…" : "Submit Score"}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full text-sm py-1 transition-colors"
            style={{ color: "#6b7280" }}
          >
            Skip — just go back
          </button>
        </form>
      </div>
    </div>
  );
}
