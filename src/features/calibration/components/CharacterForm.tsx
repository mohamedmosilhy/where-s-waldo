"use client";

import type { PendingPoint } from "../types";

interface CharacterFormProps {
  pendingPoint: PendingPoint | null;
  pendingRadius: number;
  pendingName: string;
  onRadiusChange: (r: number) => void;
  onNameChange: (name: string) => void;
  onSave: () => void;
}

export function CharacterForm({
  pendingPoint,
  pendingRadius,
  pendingName,
  onRadiusChange,
  onNameChange,
  onSave,
}: CharacterFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  if (!pendingPoint) {
    return (
      <div className="rounded-xl p-6 text-center bg-gray-900 border border-gray-800">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-800">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">
          Click anywhere on the image to place a calibration point
        </p>
      </div>
    );
  }

  const canSave = pendingName.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-5 space-y-4 bg-gray-900 border border-gray-800"
    >
      <h3 className="font-semibold text-white text-sm">Calibrate Point</h3>

      {/* Coordinates display */}
      <div className="grid grid-cols-2 gap-2 rounded-lg p-3 font-mono text-xs bg-gray-800">
        <div>
          <span className="text-gray-500">centerX</span>
          <p className="text-white font-semibold">{pendingPoint.x.toFixed(4)}</p>
        </div>
        <div>
          <span className="text-gray-500">centerY</span>
          <p className="text-white font-semibold">{pendingPoint.y.toFixed(4)}</p>
        </div>
      </div>

      {/* Radius slider */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="radius-slider" className="text-xs font-medium text-gray-400">
            Radius (hit area)
          </label>
          <span className="font-mono text-xs font-semibold text-amber-400">
            {pendingRadius.toFixed(3)}
          </span>
        </div>
        <input
          id="radius-slider"
          type="range"
          min="0.01"
          max="0.12"
          step="0.005"
          value={pendingRadius}
          onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
          className="w-full accent-red-500"
        />
        <div className="flex justify-between text-xs mt-1 text-gray-600">
          <span>0.01 (tight)</span>
          <span>0.12 (wide)</span>
        </div>
      </div>

      {/* Character name */}
      <div>
        <label htmlFor="char-name" className="block text-xs font-medium mb-1.5 text-gray-400">
          Character name
        </label>
        <input
          id="char-name"
          type="text"
          value={pendingName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Waldo"
          className="w-full rounded-lg px-3 py-2 text-sm text-white bg-gray-800 border border-gray-700 outline-none"
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={!canSave}
        className={`w-full font-semibold py-2 rounded-lg text-sm text-white transition-colors ${
          canSave
            ? "bg-red-600 cursor-pointer hover:bg-red-500"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        }`}
      >
        Save Character
      </button>
    </form>
  );
}
