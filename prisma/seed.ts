import { randomUUID } from "node:crypto";

import { prisma } from "../src/lib/prisma";

type SeedCharacter = {
  name: string;
};

type SeedImageCharacter = {
  characterName: string;
  centerX: number;
  centerY: number;
  radius: number;
};

type SeedImage = {
  name: string;
  url: string;
  characters: SeedImageCharacter[];
  scores: {
    playerName: string;
    completionTime: number;
  }[];
};

const characters: SeedCharacter[] = [
  { name: "Waldo" },
  { name: "Wizard" },
  { name: "Odlaw" },
];

const images: SeedImage[] = [
  {
    name: "Scene 1",
    url: "/images/scene-1.jpg",
    characters: [
      { characterName: "Waldo", centerX: 180, centerY: 260, radius: 24 },
      { characterName: "Wizard", centerX: 520, centerY: 340, radius: 28 },
      { characterName: "Odlaw", centerX: 860, centerY: 190, radius: 26 },
    ],
    scores: [
      { playerName: "Alice", completionTime: 182 },
      { playerName: "Bob", completionTime: 214 },
    ],
  },
  {
    name: "Scene 2",
    url: "/images/scene-2.jpg",
    characters: [
      { characterName: "Waldo", centerX: 240, centerY: 410, radius: 24 },
      { characterName: "Wizard", centerX: 610, centerY: 230, radius: 28 },
      { characterName: "Odlaw", centerX: 940, centerY: 510, radius: 26 },
    ],
    scores: [
      { playerName: "Alice", completionTime: 196 },
      { playerName: "Charlie", completionTime: 241 },
    ],
  },
];

async function main() {
  await prisma.$transaction([
    prisma.imageCharacter.deleteMany(),
    prisma.score.deleteMany(),
    prisma.image.deleteMany(),
    prisma.character.deleteMany(),
  ]);

  const characterIdsByName = new Map<string, string>();
  for (const character of characters) {
    const characterId = randomUUID();
    characterIdsByName.set(character.name, characterId);
    await prisma.character.create({
      data: {
        id: characterId,
        name: character.name,
      },
    });
  }

  for (const image of images) {
    const imageId = randomUUID();
    await prisma.image.create({
      data: {
        id: imageId,
        name: image.name,
        url: image.url,
      },
    });

    for (const character of image.characters) {
      const characterId = characterIdsByName.get(character.characterName);
      if (!characterId) {
        throw new Error(
          `Missing character seed for ${character.characterName}`,
        );
      }

      await prisma.imageCharacter.create({
        data: {
          imageId,
          characterId,
          centerX: character.centerX,
          centerY: character.centerY,
          radius: character.radius,
        },
      });
    }

    for (const score of image.scores) {
      await prisma.score.create({
        data: {
          id: randomUUID(),
          playerName: score.playerName,
          completionTime: score.completionTime,
          imageId,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
