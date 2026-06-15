"use client";

import { useRef } from "react";
import type { CalibrationEntry, PendingPoint } from "../types";

interface CalibrationImageProps {
  imageUrl: string;
  pendingPoint: PendingPoint | null;
  pendingRadius: number;
  savedEntries: CalibrationEntry[];
  onClickImage: (x: number, y: number) => void;
}

// Colors for saved entry overlays
const ENTRY_COLORS = [
  "#ef4444", "#3b82f6", "#22c55e", "#f59e0b",
  "#a855f7", "#ec4899", "#14b8a6", "#f97316",
];

export function CalibrationImage({
  imageUrl,
  pendingPoint,
  pendingRadius,
  savedEntries,
  onClickImage,
}: CalibrationImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onClickImage(
      Math.max(0, Math.min(1, x)),
      Math.max(0, Math.min(1, y)),
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative cursor-crosshair select-none rounded-xl overflow-hidden border border-gray-700"
      onClick={handleClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Scene to calibrate"
        className="block w-full h-auto"
        draggable={false}
      />

      {/* Saved entry overlays — positions/sizes/colors are all runtime-computed */}
      {savedEntries.map((entry, i) => {
        const color = ENTRY_COLORS[i % ENTRY_COLORS.length];
        return (
          <div key={entry.id}>
            {/* Hitbox ellipse */}
            <div
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${entry.centerX * 100}%`,
                top: `${entry.centerY * 100}%`,
                width: `${entry.radius * 2 * 100}%`,
                height: `${entry.radius * 2 * 100}%`,
                transform: "translate(-50%, -50%)",
                border: `2px solid ${color}`,
                backgroundColor: `${color}22`,
              }}
            />
            {/* Center dot */}
            <div
              className="absolute pointer-events-none rounded-full w-2 h-2"
              style={{
                left: `${entry.centerX * 100}%`,
                top: `${entry.centerY * 100}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: color,
              }}
            />
            {/* Label */}
            <div
              className="absolute pointer-events-none px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap text-white"
              style={{
                left: `${entry.centerX * 100}%`,
                top: `calc(${entry.centerY * 100}% - ${entry.radius * 100}% - 20px)`,
                transform: "translateX(-50%)",
                backgroundColor: color,
              }}
            >
              {entry.name}
            </div>
          </div>
        );
      })}

      {/* Pending point overlay — position is runtime-computed */}
      {pendingPoint && (
        <>
          {/* Hitbox ellipse */}
          <div
            className="absolute pointer-events-none rounded-full border-2 border-dashed border-white bg-white/8"
            style={{
              left: `${pendingPoint.x * 100}%`,
              top: `${pendingPoint.y * 100}%`,
              width: `${pendingRadius * 2 * 100}%`,
              height: `${pendingRadius * 2 * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Crosshair */}
          <div
            className="absolute pointer-events-none w-5 h-5"
            style={{
              left: `${pendingPoint.x * 100}%`,
              top: `${pendingPoint.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="absolute inset-x-0 top-1/2 h-px bg-white -translate-y-1/2" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-white -translate-x-1/2" />
          </div>
        </>
      )}
    </div>
  );
}
