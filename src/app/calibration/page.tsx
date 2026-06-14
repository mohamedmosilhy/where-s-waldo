"use client";

import { useRef, useState } from "react";
import { CalibrationImage } from "@/src/features/calibration/components/CalibrationImage";
import { CharacterForm } from "@/src/features/calibration/components/CharacterForm";
import { ExportPanel } from "@/src/features/calibration/components/ExportPanel";
import type { CalibrationEntry, PendingPoint } from "@/src/features/calibration/types";

export default function CalibrationPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pendingPoint, setPendingPoint] = useState<PendingPoint | null>(null);
  const [pendingRadius, setPendingRadius] = useState(0.04);
  const [pendingName, setPendingName] = useState("");
  const [entries, setEntries] = useState<CalibrationEntry[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setPendingPoint(null);
    setEntries([]);
  };

  const handleClickImage = (x: number, y: number) => {
    setPendingPoint({ x, y });
  };

  const handleSave = () => {
    if (!pendingPoint || !pendingName.trim()) return;
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: pendingName.trim(),
        centerX: pendingPoint.x,
        centerY: pendingPoint.y,
        radius: pendingRadius,
      },
    ]);
    setPendingPoint(null);
    setPendingName("");
  };

  const handleRemove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(234,179,8,0.15)", color: "#ca8a04" }}
          >
            Dev Tool
          </span>
        </div>
        <h1 className="font-bangers text-4xl text-white tracking-wide">
          Scene Calibration
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6b7280" }}>
          Click on a scene image to generate{" "}
          <code
            className="px-1 py-0.5 rounded text-xs"
            style={{ backgroundColor: "#1f2937", color: "#fbbf24" }}
          >
            centerX / centerY / radius
          </code>{" "}
          values for your Prisma seed file.
        </p>
      </div>

      {/* Image upload */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload scene image"
        />
        {!imageUrl ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed py-16 flex flex-col items-center gap-3 transition-colors"
            style={{ borderColor: "#374151", color: "#6b7280" }}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div className="text-center">
              <p className="font-semibold text-sm text-white">Upload scene image</p>
              <p className="text-xs mt-0.5">PNG, WEBP, JPG — any size</p>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#1f2937", color: "#9ca3af", border: "1px solid #374151" }}
            >
              Change image
            </button>
            <button
              onClick={() => { setImageUrl(null); setPendingPoint(null); setEntries([]); }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              Clear
            </button>
            <span className="text-xs" style={{ color: "#4b5563" }}>
              {entries.length} character{entries.length !== 1 ? "s" : ""} calibrated
            </span>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: image */}
          <div className="space-y-4">
            <CalibrationImage
              imageUrl={imageUrl}
              pendingPoint={pendingPoint}
              pendingRadius={pendingRadius}
              savedEntries={entries}
              onClickImage={handleClickImage}
            />

            {/* Instructions */}
            <div
              className="rounded-lg px-4 py-3 text-xs leading-relaxed"
              style={{ backgroundColor: "#111827", color: "#6b7280" }}
            >
              <strong className="text-white">How to use: </strong>
              Click the center of the character on the image → adjust the radius
              slider until the dashed circle covers the character → enter a name
              → click <strong className="text-white">Save Character</strong>.
              Repeat for each character.
            </div>
          </div>

          {/* Right: controls + export */}
          <div className="space-y-4">
            <CharacterForm
              pendingPoint={pendingPoint}
              pendingRadius={pendingRadius}
              pendingName={pendingName}
              onRadiusChange={setPendingRadius}
              onNameChange={setPendingName}
              onSave={handleSave}
            />

            <ExportPanel
              entries={entries}
              onRemove={handleRemove}
              onClear={() => setEntries([])}
            />
          </div>
        </div>
      )}
    </div>
  );
}
