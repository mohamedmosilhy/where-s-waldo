"use client";

import { CharacterMenuProps } from "../types";

export function CharacterMenu({
  characters,
  position,
  onCharacterSelect,
}: CharacterMenuProps) {
  // Keep the menu inside the image by capping position
  const leftPct = Math.min(position.x * 100 + 1, 58);
  const topPct = Math.min(position.y * 100 + 3, 65);

  return (
    <div
      className="absolute z-20 animate-slide-up"
      onClick={(e) => e.stopPropagation()}
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
      }}
    >
      <div
        className="rounded-xl shadow-2xl overflow-hidden w-44"
        style={{
          backgroundColor: "rgba(17,24,39,0.97)",
          border: "1px solid #374151",
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="px-3 py-2"
          style={{ borderBottom: "1px solid #1f2937" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#6b7280", letterSpacing: "0.1em" }}
          >
            Who did you find?
          </p>
        </div>
        <ul className="p-1.5 space-y-0.5">
          {characters.length === 0 ? (
            <li className="px-3 py-2 text-xs" style={{ color: "#6b7280" }}>
              All found!
            </li>
          ) : (
            characters.map((character) => (
              <li key={character.id}>
                <button
                  onClick={() => onCharacterSelect(character)}
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-100"
                  style={{ color: "#e5e7eb" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#dc2626";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#e5e7eb";
                  }}
                >
                  {character.name}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
