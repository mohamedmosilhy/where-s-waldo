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

  // Keep inside image bounds on desktop
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
        <div className="rounded-t-2xl overflow-hidden bg-gray-900 border border-gray-700 border-b-0 shadow-[0_-8px_40px_rgba(0,0,0,0.7)]">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-1 rounded-full bg-gray-700" />
          </div>

          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">
              Who did you find?
            </p>

            <div className="grid grid-cols-2 gap-2 pb-6">
              {characters.map((character) => {
                const cfg = getCharacterConfig(character.name);
                return (
                  <button
                    key={character.id}
                    onClick={() => onCharacterSelect(character)}
                    className="flex items-center gap-3 rounded-xl text-left transition-colors active:scale-95 bg-gray-800 border border-gray-700 px-3 py-2.5 min-h-[56px]"
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

      {/* ── Desktop: floating popup — left/top are runtime-computed ── */}
      <div
        className="hidden lg:block absolute z-20 animate-slide-up"
        onClick={stopProp}
        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      >
        <div className="rounded-xl shadow-2xl overflow-hidden w-48 bg-gray-900/[0.97] border border-gray-700 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          <div className="px-3 py-2 border-b border-gray-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
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
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors duration-100 text-left text-gray-200 hover:bg-red-600/15"
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
