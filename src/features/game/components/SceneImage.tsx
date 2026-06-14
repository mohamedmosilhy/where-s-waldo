"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CharacterMenu } from "./CharacterMenu";
import { CompletionModal } from "./CompletionModal";
import {
  validateCharacterSelection,
  setScore,
} from "@/src/features/game/actions";
import { SceneImageProps } from "../types";
import { useRouter } from "next/navigation";
import { useGameStore } from "../game-store";
import { getCharacterConfig } from "../character-config";

function formatTime(ms: number) {
  const secs = ms / 1000;
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(1);
  if (m > 0) return `${m}:${s.padStart(4, "0")}`;
  return `${s}s`;
}

export function SceneImage({ scene }: SceneImageProps) {
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const setStartTimeOfScene = useGameStore((s) => s.setStartTimeOfScene);
  const setPlayerName = useGameStore((s) => s.setPlayerName);

  const [showMenu, setShowMenu] = useState(false);
  const [timer, setTimer] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [foundCharacters, setFoundCharacters] = useState<string[]>([]);
  const [foundPositions, setFoundPositions] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [notification, setNotification] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionTimeSecs, setCompletionTimeSecs] = useState(0);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (target && imageWrapperRef.current?.contains(target)) return;
      setShowMenu(false);
    };

    document.addEventListener("click", handleDocumentClick);
    setStartTimeOfScene(Date.now());

    const interval = setInterval(() => {
      setTimer(Date.now() - useGameStore.getState().startTimeOfScene);
    }, 100);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      clearInterval(interval);
    };
  }, [setStartTimeOfScene]);

  // Auto-clear notification
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 2200);
    return () => clearTimeout(t);
  }, [notification]);

  const handleCharacterSelect = async (character: {
    id: string;
    name: string;
  }) => {
    setShowMenu(false);

    const result = await validateCharacterSelection(
      { x: coords.x, y: coords.y },
      character.id,
      scene.id,
    );

    if (result.success) {
      const updated = [...foundCharacters, character.id];
      setFoundCharacters(updated);
      setFoundPositions((prev) => [
        ...prev,
        { id: character.id, x: coords.x, y: coords.y },
      ]);
      setNotification({ text: `Found ${character.name}!`, success: true });

      if (updated.length === scene.characters.length) {
        const completionSecs =
          (Date.now() - useGameStore.getState().startTimeOfScene) / 1000;
        setCompletionTimeSecs(completionSecs);

        const storedName = useGameStore.getState().playerName;
        if (storedName) {
          await setScore({
            playerName: storedName,
            completionTime: completionSecs * 1000,
            imageId: scene.id,
          });
          router.push("/scenes");
        } else {
          setShowCompletion(true);
        }
      }
    } else {
      setNotification({ text: "Not quite — keep looking!", success: false });
    }
  };

  const handleCompletionSubmit = async (playerName: string) => {
    await setScore({
      playerName,
      completionTime: completionTimeSecs * 1000,
      imageId: scene.id,
    });
    setPlayerName(playerName);
    router.push("/scenes");
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
    const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
    setCoords({ x, y });
    setShowMenu(true);
  };

  const progress = foundCharacters.length;
  const total = scene.characters.length;

  return (
    <>
      <CompletionModal
        isOpen={showCompletion}
        completionTime={completionTimeSecs}
        onSubmit={handleCompletionSubmit}
        onSkip={() => router.push("/scenes")}
      />

      {/* HUD bar */}
      <div
        className="flex items-center justify-between rounded-xl px-3 sm:px-4 py-2.5 mb-4 gap-2"
        style={{ backgroundColor: "#111827", border: "1px solid #1f2937" }}
      >
        <h1 className="font-bangers text-lg sm:text-xl text-white tracking-wide truncate min-w-0">
          {scene.name}
        </h1>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Progress */}
          <div className="flex items-center gap-1.5">
            <div
              className="h-1.5 w-14 sm:w-20 rounded-full overflow-hidden"
              style={{ backgroundColor: "#1f2937" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(progress / total) * 100}%`,
                  backgroundColor: "#10b981",
                }}
              />
            </div>
            <span className="text-xs font-mono" style={{ color: "#9ca3af" }}>
              {progress}/{total}
            </span>
          </div>

          {/* Timer */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg"
            style={{ backgroundColor: "#1f2937" }}
          >
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              style={{ color: "#fbbf24" }}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 7v5l3 1.5" />
            </svg>
            <span
              className="font-mono text-xs sm:text-sm font-semibold"
              style={{ color: "#fbbf24", minWidth: "3rem" }}
            >
              {formatTime(timer)}
            </span>
          </div>
        </div>
      </div>

      {/* Main game layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Game image column */}
        <div className="flex-1 min-w-0 w-full">
          {/* Notification toast */}
          {notification && (
            <div
              key={notification.text}
              className="mb-2 px-4 py-2 rounded-lg text-sm font-medium text-center animate-slide-up"
              style={{
                backgroundColor: notification.success
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(239,68,68,0.15)",
                border: `1px solid ${
                  notification.success
                    ? "rgba(16,185,129,0.3)"
                    : "rgba(239,68,68,0.3)"
                }`,
                color: notification.success ? "#34d399" : "#f87171",
              }}
              role="status"
            >
              {notification.text}
            </div>
          )}

          {/* Image wrapper */}
          <div
            ref={imageWrapperRef}
            className="relative cursor-crosshair select-none rounded-xl overflow-hidden"
            style={{ border: "1px solid #1f2937" }}
            onClick={handleClick}
          >
            <Image
              className="object-cover w-full h-auto block"
              loading="eager"
              src={scene.url}
              alt={scene.name}
              height={800}
              width={1200}
            />

            {/* Click crosshair */}
            {showMenu && (
              <span
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  border: "2px solid #ef4444",
                  left: `${coords.x * 100}%`,
                  top: `${coords.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 2px rgba(239,68,68,0.3)",
                }}
              >
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    border: "2px solid #ef4444",
                    opacity: 0.6,
                  }}
                />
              </span>
            )}

            {/* Found character markers */}
            {foundPositions.map((pos) => (
              <span
                key={pos.id}
                className="absolute rounded-full pointer-events-none flex items-center justify-center animate-found-pop"
                style={{
                  width: "2rem",
                  height: "2rem",
                  border: "2px solid #10b981",
                  backgroundColor: "rgba(16,185,129,0.2)",
                  left: `${pos.x * 100}%`,
                  top: `${pos.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ color: "#34d399" }}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ))}

            {showMenu && (
              <CharacterMenu
                characters={scene.characters
                  .map((c) => c.character)
                  .filter((c) => !foundCharacters.includes(c.id))}
                position={coords}
                onCharacterSelect={handleCharacterSelect}
              />
            )}
          </div>
        </div>

        {/* Character sidebar — horizontal strip on mobile, vertical on desktop */}
        <div className="w-full lg:w-52 lg:shrink-0">
          {/* Mobile: horizontal scrollable avatar strip */}
          <div
            className="lg:hidden rounded-xl px-3 py-2"
            style={{ backgroundColor: "#111827", border: "1px solid #1f2937" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#6b7280" }}
            >
              Find These
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {scene.characters.map((ic) => {
                const found = foundCharacters.includes(ic.character.id);
                const cfg = getCharacterConfig(ic.character.name);
                return (
                  <div
                    key={ic.character.id}
                    className="flex flex-col items-center gap-1 shrink-0 transition-all duration-300"
                    style={{ opacity: found ? 0.55 : 1 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full relative overflow-hidden"
                      style={{
                        backgroundColor: cfg.bgColor,
                        filter: found ? "grayscale(0.5)" : "none",
                        border: found
                          ? "2px solid #10b981"
                          : "2px solid transparent",
                      }}
                    >
                      {cfg.imageUrl && (
                        <Image
                          src={cfg.imageUrl}
                          alt={ic.character.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {found && (
                        <div
                          className="absolute inset-0 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: "rgba(16,185,129,0.45)" }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{ color: "#fff" }}
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: found ? "#34d399" : "#9ca3af" }}
                    >
                      {ic.character.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop: vertical list */}
          <div
            className="hidden lg:block rounded-xl p-4"
            style={{ backgroundColor: "#111827", border: "1px solid #1f2937" }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#6b7280", letterSpacing: "0.1em" }}
            >
              Find These
            </h3>
            <ul className="space-y-2">
              {scene.characters.map((ic) => {
                const found = foundCharacters.includes(ic.character.id);
                const cfg = getCharacterConfig(ic.character.name);
                return (
                  <li
                    key={ic.character.id}
                    className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: found
                        ? "rgba(16,185,129,0.08)"
                        : "rgba(31,41,55,0.5)",
                      border: `1px solid ${found ? "rgba(16,185,129,0.25)" : "transparent"}`,
                      opacity: found ? 0.7 : 1,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full shrink-0 relative overflow-hidden"
                      style={{
                        backgroundColor: cfg.bgColor,
                        filter: found ? "grayscale(0.5)" : "none",
                      }}
                    >
                      {cfg.imageUrl && (
                        <Image
                          src={cfg.imageUrl}
                          alt={ic.character.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {found && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: "#10b981",
                            border: "2px solid #030712",
                          }}
                        >
                          <svg
                            className="w-2 h-2 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium leading-tight"
                        style={{
                          color: found ? "#34d399" : "#e5e7eb",
                          textDecoration: found ? "line-through" : "none",
                        }}
                      >
                        {ic.character.name}
                      </p>
                      <p className="text-xs" style={{ color: "#6b7280" }}>
                        {found ? "Found!" : "Still hiding…"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
