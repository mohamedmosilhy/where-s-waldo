"use client";
import { useState } from "react";
import Image from "next/image";
import { CharacterMenu } from "./CharacterMenu";

type SceneImageProps = {
  scene: {
    name: string;
    url: string;
    characters: {
      character: {
        id: string;
        name: string;
      };
    }[];
  };
};

export function SceneImage({ scene }: SceneImageProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleCharacterSelect = (character: { id: string; name: string }) => {
    console.log("Character selected:", character.name);
    setSelectedCharacter(character);
    setShowMenu(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
    const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight;
    if (showMenu) {
      setShowMenu(false);
      return;
    }
    setCoords({ x, y });
    setShowMenu(true);
  };
  return (
    <>
      <p className="text-lg">{scene?.name}</p>
      <div
        className="relative inline-block cursor-pointer select-none w-3/4"
        onClick={handleClick}
      >
        <Image
          className="mt-4border rounded border-gray-300 object-cover w-full h-auto"
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
          }}
        >
          +
        </span>
        {showMenu && (
          <CharacterMenu
            characters={scene.characters.map((c) => c.character)}
            position={coords}
            onCharacterSelect={handleCharacterSelect}
          />
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Clicked at: {coords.x.toFixed(2)}%, {coords.y.toFixed(2)}% ,
        characterselected: {selectedCharacter?.name || "None"}
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
