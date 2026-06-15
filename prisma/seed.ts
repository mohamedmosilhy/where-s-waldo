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
  { name: "Wenda" },
  { name: "Odlaw" },
];

const images: SeedImage[] = [
  {
    name: "Scene 1",
    url: "/images/scene-1.webp",
    characters: [
      { characterName: "Waldo", centerX: 0.53, centerY: 0.51, radius: 0.05 },
      { characterName: "Wizard", centerX: 0.63, centerY: 0.51, radius: 0.05 },
      { characterName: "Odlaw", centerX: 0.24, centerY: 0.52, radius: 0.05 },
    ],
    scores: [],
  },
  {
    name: "Scene 2",
    url: "/images/scene-2.webp",
    characters: [
      { characterName: "Waldo", centerX: 0.85, centerY: 0.31, radius: 0.05 },
    ],
    scores: [],
  },
  {
    name: "Scene 3",
    url: "/images/scene-3.webp",
    characters: [
      {
        characterName: "Wizard",
        centerX: 0.2955,
        centerY: 0.4066,
        radius: 0.025,
      },
      {
        characterName: "Waldo",
        centerX: 0.9611,
        centerY: 0.0636,
        radius: 0.025,
      },
      {
        characterName: "Wenda",
        centerX: 0.2818,
        centerY: 0.6636,
        radius: 0.01,
      },
      {
        characterName: "Odlaw",
        centerX: 0.9187,
        centerY: 0.5776,
        radius: 0.025,
      },
    ],
    scores: [],
  },
  {
    name: "Scene 4",
    url: "/images/scene-4.webp",
    characters: [
      {
        characterName: "Odlaw",
        centerX: 0.0504,
        centerY: 0.763,
        radius: 0.02,
      },
      {
        characterName: "Wenda",
        centerX: 0.8832,
        centerY: 0.2902,
        radius: 0.02,
      },
      {
        characterName: "Waldo",
        centerX: 0.8018,
        centerY: 0.0983,
        radius: 0.02,
      },
    ],
    scores: [],
  },
  {
    name: "Scene 5",
    url: "/images/scene-5.webp",
    characters: [
      {
        characterName: "Waldo",
        centerX: 0.5899,
        centerY: 0.1132,
        radius: 0.02,
      },
      {
        characterName: "Odlaw",
        centerX: 0.3139,
        centerY: 0.6478,
        radius: 0.02,
      },
      {
        characterName: "Wenda",
        centerX: 0.2921,
        centerY: 0.9435,
        radius: 0.015,
      },
      {
        characterName: "Wizard",
        centerX: 0.7365,
        centerY: 0.8589,
        radius: 0.015,
      },
    ],
    scores: [],
  },
  {
    name: "Scene 6",
    url: "/images/scene-6.webp",
    characters: [
      {
        characterName: "Waldo",
        centerX: 0.1661,
        centerY: 0.8569,
        radius: 0.03,
      },
    ],
    scores: [],
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
