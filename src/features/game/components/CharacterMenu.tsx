"use client";

import Image from "next/image";
import { CharacterMenuProps } from "../types";
import { getCharacterConfig } from "../character-config";

export function CharacterMenu({
  characters,
  position,
  onCharacterSelect,
}: CharacterMenuProps) {
  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  // Desktop: keep popup inside image bounds
  const leftPct = Math.min(position.x * 100 + 1, 58);
  const topPct = Math.min(position.y * 100 + 3, 65);

  if (characters.length === 0) return null;

  return (
    <>
      {/* ── Mobile: fixed bottom sheet ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 animate-slide-up"
        onClick={stopProp}
      >
        {/* Backdrop strip (tap outside to close is handled by document listener) */}
        <div
          className="rounded-t-2xl overflow-hidden"
          style={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderBottom: "none",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.7)",
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div
              className="w-8 h-1 rounded-full"
              style={{ backgroundColor: "#374151" }}
            />
          </div>

          <div className="px-4 py-3">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#6b7280" }}
            >
              Who did you find?
            </p>

            <div className="grid grid-cols-2 gap-2 pb-6">
              {characters.map((character) => {
                const cfg = getCharacterConfig(character.name);
                return (
                  <button
                    key={character.id}
                    onClick={() => onCharacterSelect(character)}
                    className="flex items-center gap-3 rounded-xl text-left transition-colors active:scale-95"
                    style={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      padding: "10px 12px",
                      minHeight: "56px",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full shrink-0 overflow-hidden"
                      style={{ backgroundColor: cfg.bgColor }}
                    >
                      {cfg.imageUrl && (
                        <Image
                          src={cfg.imageUrl}
                          alt={character.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-sm text-white">
                      {character.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop: floating popup ── */}
      <div
        className="hidden lg:block absolute z-20 animate-slide-up"
        onClick={stopProp}
        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      >
        <div
          className="rounded-xl shadow-2xl overflow-hidden w-48"
          style={{
            backgroundColor: "rgba(17,24,39,0.97)",
            border: "1px solid #374151",
            backdropFilter: "blur(8px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="px-3 py-2"
            style={{ borderBottom: "1px solid #1f2937" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#6b7280" }}
            >
              Who did you find?
            </p>
          </div>

          <ul className="p-2 space-y-1">
            {characters.map((character) => {
              const cfg = getCharacterConfig(character.name);
              return (
                <li key={character.id}>
                  <button
                    onClick={() => onCharacterSelect(character)}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors duration-100 text-left"
                    style={{ color: "#e5e7eb" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "rgba(220,38,38,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full shrink-0 overflow-hidden"
                      style={{ backgroundColor: cfg.bgColor }}
                    >
                      {cfg.imageUrl && (
                        <Image
                          src={cfg.imageUrl}
                          alt={character.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium">{character.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
