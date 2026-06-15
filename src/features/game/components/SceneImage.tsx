"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CharacterMenu } from "./CharacterMenu";
import { CompletionModal } from "./CompletionModal";
import { CelebrationScreen } from "./CelebrationScreen";
import {
  validateCharacterSelection,
  setScore,
} from "@/src/features/game/actions";
import { SceneImageProps } from "../types";
import { useRouter } from "next/navigation";
import { useGameStore } from "../game-store";
import { getCharacterConfig } from "../character-config";
import {
  playSuccessSound,
  playErrorSound,
  playCelebrationSound,
} from "../sounds";

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
    key: number;
    text: string;
    success: boolean;
  } | null>(null);
  const notifKeyRef = useRef(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationName, setCelebrationName] = useState("");
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

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 2400);
    return () => clearTimeout(t);
  }, [notification]);

  const showNotif = (text: string, success: boolean) => {
    notifKeyRef.current += 1;
    setNotification({ key: notifKeyRef.current, text, success });
  };

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
      playSuccessSound();
      const updated = [...foundCharacters, character.id];
      setFoundCharacters(updated);
      setFoundPositions((prev) => [
        ...prev,
        { id: character.id, x: coords.x, y: coords.y },
      ]);
      showNotif(`Found ${character.name}!`, true);

      if (updated.length === scene.characters.length) {
        const completionSecs =
          (Date.now() - useGameStore.getState().startTimeOfScene) / 1000;
        setCompletionTimeSecs(completionSecs);

        setTimeout(() => {
          playCelebrationSound();
          const storedName = useGameStore.getState().playerName;
          if (storedName) {
            setScore({
              playerName: storedName,
              completionTime: completionSecs * 1000,
              imageId: scene.id,
            });
            setCelebrationName(storedName);
            setShowCelebration(true);
          } else {
            setShowCompletion(true);
          }
        }, 600);
      }
    } else {
      playErrorSound();
      showNotif("Not quite — keep looking!", false);
    }
  };

  const handleCompletionSubmit = async (playerName: string) => {
    await setScore({
      playerName,
      completionTime: completionTimeSecs * 1000,
      imageId: scene.id,
    });
    setPlayerName(playerName);
    setShowCompletion(false);
    setCelebrationName(playerName);
    setShowCelebration(true);
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
      {showCelebration && (
        <CelebrationScreen
          playerName={celebrationName}
          completionTime={completionTimeSecs}
          onDone={() => router.push("/scenes")}
        />
      )}

      <CompletionModal
        isOpen={showCompletion && !showCelebration}
        completionTime={completionTimeSecs}
        onSubmit={handleCompletionSubmit}
        onSkip={() => router.push("/scenes")}
      />

      {/* HUD bar */}
      <div className="flex items-center justify-between rounded-xl px-3 sm:px-4 py-2.5 mb-4 gap-2 bg-gray-900 border border-gray-800">
        <h1 className="font-bangers text-lg sm:text-xl text-white tracking-wide truncate min-w-0">
          {scene.name}
        </h1>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Progress */}
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-14 sm:w-20 rounded-full overflow-hidden bg-gray-800">
              {/* width is runtime-computed — must stay inline */}
              <div
                className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                style={{ width: `${(progress / total) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-gray-400">
              {progress}/{total}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-gray-800">
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 7v5l3 1.5" />
            </svg>
            <span className="font-mono text-xs sm:text-sm font-semibold text-amber-400 min-w-12">
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
              key={notification.key}
              className={`mb-2 px-4 py-2 rounded-lg text-sm font-medium text-center ${
                notification.success
                  ? "animate-slide-up bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                  : "animate-slide-shake bg-red-500/15 border border-red-500/30 text-red-400"
              }`}
              role="status"
              aria-live="polite"
            >
              <span className="mr-1.5">{notification.success ? "✓" : "✗"}</span>
              {notification.text}
            </div>
          )}

          {/* Image wrapper */}
          <div
            ref={imageWrapperRef}
            className="relative cursor-crosshair select-none rounded-xl overflow-hidden border border-gray-800"
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

            {/* Click crosshair — left/top are runtime-computed */}
            {showMenu && (
              <span
                className="absolute w-5 h-5 rounded-full pointer-events-none border-2 border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.3)]"
                style={{
                  left: `${coords.x * 100}%`,
                  top: `${coords.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="absolute inset-0 rounded-full animate-ping border-2 border-red-500 opacity-60" />
              </span>
            )}

            {/* Found character markers — left/top are runtime-computed */}
            {foundPositions.map((pos) => (
              <span
                key={pos.id}
                className="absolute w-8 h-8 rounded-full pointer-events-none flex items-center justify-center animate-found-pop border-2 border-emerald-500 bg-emerald-500/20"
                style={{
                  left: `${pos.x * 100}%`,
                  top: `${pos.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <svg
                  className="w-3 h-3 text-emerald-400"
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

        {/* Character sidebar */}
        <div className="w-full lg:w-52 lg:shrink-0">
          {/* Mobile: horizontal strip */}
          <div className="lg:hidden rounded-xl px-3 py-2 bg-gray-900 border border-gray-800">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
              Find These
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {scene.characters.map((ic) => {
                const found = foundCharacters.includes(ic.character.id);
                const cfg = getCharacterConfig(ic.character.name);
                return (
                  <div
                    key={ic.character.id}
                    className={`flex flex-col items-center gap-1 shrink-0 transition-all duration-300 ${found ? "opacity-55" : ""}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full relative overflow-hidden ${found ? "grayscale-[0.5] border-2 border-emerald-500" : "border-2 border-transparent"}`}
                      style={{ backgroundColor: cfg.bgColor }}
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
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500/45">
                          <svg
                            className="w-5 h-5 text-white"
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
                    <span
                      className={`text-xs font-medium ${found ? "text-emerald-400" : "text-gray-400"}`}
                    >
                      {ic.character.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop: vertical list */}
          <div className="hidden lg:block rounded-xl p-4 bg-gray-900 border border-gray-800">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-500">
              Find These
            </h3>
            <ul className="space-y-2">
              {scene.characters.map((ic) => {
                const found = foundCharacters.includes(ic.character.id);
                const cfg = getCharacterConfig(ic.character.name);
                return (
                  <li
                    key={ic.character.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 border ${
                      found
                        ? "bg-emerald-500/8 border-emerald-500/25 opacity-70"
                        : "bg-gray-800/50 border-transparent"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full shrink-0 relative overflow-hidden ${found ? "grayscale-[0.5]" : ""}`}
                      style={{ backgroundColor: cfg.bgColor }}
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
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-emerald-500 border-2 border-gray-950">
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
                        className={`text-sm font-medium leading-tight ${found ? "text-emerald-400 line-through" : "text-gray-200"}`}
                      >
                        {ic.character.name}
                      </p>
                      <p className="text-xs text-gray-500">
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
