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

// Colors for saved entry overlays (cycles through list)
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
      className="relative cursor-crosshair select-none rounded-xl overflow-hidden"
      style={{ border: "1px solid #374151" }}
      onClick={handleClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Scene to calibrate"
        className="block w-full h-auto"
        draggable={false}
      />

      {/* Saved entry overlays */}
      {savedEntries.map((entry, i) => {
        const color = ENTRY_COLORS[i % ENTRY_COLORS.length];
        return (
          <div key={entry.id}>
            {/* Ellipse representing hitbox */}
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
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${entry.centerX * 100}%`,
                top: `${entry.centerY * 100}%`,
                width: "8px",
                height: "8px",
                transform: "translate(-50%, -50%)",
                backgroundColor: color,
              }}
            />
            {/* Label */}
            <div
              className="absolute pointer-events-none px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap"
              style={{
                left: `${entry.centerX * 100}%`,
                top: `calc(${entry.centerY * 100}% - ${entry.radius * 100}% - 20px)`,
                transform: "translateX(-50%)",
                backgroundColor: color,
                color: "#fff",
              }}
            >
              {entry.name}
            </div>
          </div>
        );
      })}

      {/* Pending point overlay */}
      {pendingPoint && (
        <>
          {/* Hitbox ellipse */}
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${pendingPoint.x * 100}%`,
              top: `${pendingPoint.y * 100}%`,
              width: `${pendingRadius * 2 * 100}%`,
              height: `${pendingRadius * 2 * 100}%`,
              transform: "translate(-50%, -50%)",
              border: "2px dashed #ffffff",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          {/* Crosshair */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${pendingPoint.x * 100}%`,
              top: `${pendingPoint.y * 100}%`,
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "20px",
            }}
          >
            <div
              className="absolute"
              style={{
                top: "50%",
                left: 0,
                right: 0,
                height: "2px",
                background: "#fff",
                marginTop: "-1px",
              }}
            />
            <div
              className="absolute"
              style={{
                left: "50%",
                top: 0,
                bottom: 0,
                width: "2px",
                background: "#fff",
                marginLeft: "-1px",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
