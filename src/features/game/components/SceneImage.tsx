"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CharacterMenu } from "./CharacterMenu";
import {
  validateCharacterSelection,
  setScore,
} from "@/src/features/game/actions";
import { SceneImageProps } from "../types";
import { useRouter } from "next/navigation";
import { useGameStore } from "../game-store";

export function SceneImage({ scene }: SceneImageProps) {
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const setStartTimeOfScene = useGameStore(
    (state) => state.setStartTimeOfScene,
  );

  const setPlayerName = useGameStore((state) => state.setPlayerName);

  const [showMenu, setShowMenu] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState<{ success?: boolean; message: string }>({
    success: undefined,
    message: "",
  });

  const [foundCharacters, setFoundCharacters] = useState<string[]>([]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (target && imageWrapperRef.current?.contains(target)) {
        return;
      }

      setShowMenu(false);
    };

    document.addEventListener("click", handleDocumentClick);

    setStartTimeOfScene(Date.now());

    const timerinterval = setInterval(() => {
      setTimer(Date.now() - useGameStore.getState().startTimeOfScene);
    }, 100);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      clearInterval(timerinterval);
    };
  }, [setStartTimeOfScene]);

  const handleCharacterSelect = async (character: {
    id: string;
    name: string;
  }) => {
    const result = await validateCharacterSelection(
      { x: coords.x, y: coords.y },
      character.id,
      scene.id,
    );

    setResult(result);

    if (result.success) {
      const updated = [...foundCharacters, character.id];
      setFoundCharacters(updated);
      if (updated.length === scene.characters.length) {
        
        const completionTime =
          (Date.now() - useGameStore.getState().startTimeOfScene) / 1000;
        alert(
          `Congratulations! You found all characters! in  ${completionTime.toFixed(2)} seconds!`,
        );

        let playerName: string = "";
        if (useGameStore.getState().playerName === "") {
          playerName = prompt("enter your name please?") ?? "";
          if (playerName) {
            setScore({
              playerName,
              completionTime: completionTime * 1000,
              imageId: scene.id,
            });

            setPlayerName(playerName);
          }
        } else {
          setScore({
            playerName,
            completionTime: completionTime * 1000,
            imageId: scene.id,
          });
        }

        router.push("/scenes");
      }
    }

    setSelectedCharacter(character);
    setShowMenu(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
    const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
    setCoords({ x, y });
    setShowMenu(true);
  };
  return (
    <>
      <p className="text-lg">{scene?.name}</p>
      <div
        ref={imageWrapperRef}
        className="relative inline-block cursor-crosshair select-none w-3/4"
        onClick={handleClick}
      >
        <Image
          className="border rounded border-gray-300 object-cover w-full h-auto cursor-crosshair"
          loading="eager"
          src={scene!.url}
          alt={scene!.name}
          height={400}
          width={400}
        />
        <span
          className="absolute inset-0 w-3 h-3 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold pointer-events-none"
          style={{
            left: `${coords.x * 100}%`,
            top: `${coords.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          +
        </span>
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
      <p className="mt-2 text-sm text-gray-500">
        Clicked at: {coords.x.toFixed(2)}%, {coords.y.toFixed(2)}% ,
        characterselected: {selectedCharacter?.name || "None"} {",   "}
        character found: {result.message}
        time: {(timer / 1000).toFixed(2)} seconds
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Found {foundCharacters.length} of {scene?.characters.length} characters
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Characters</h2>
      <ul className="flex flex-wrap gap-4 p-4">
        {scene?.characters.map((imageCharacter) => (
          <li
            key={imageCharacter.character.id}
            className="border rounded border-gray-300 p-4 w-1/4"
          >
            <p>{imageCharacter.character.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
