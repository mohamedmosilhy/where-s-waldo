"use server";

import { prisma } from "../../lib/prisma";

export async function validateCharacterSelection(
  pos: {
    x: number;
    y: number;
  },
  characterId: string,
  imageId: string,
) {
  const { x, y } = pos;
  const image = await prisma.image.findUnique({
    include: {
      characters: {
        include: {
          character: true,
        },
      },
    },
    where: {
      id: imageId,
    },
  });

  const character = image?.characters.find(
    (c) => c.character.id === characterId,
  );
  if (!character) {
    throw new Error("Character not found in this image");
  }

  const { centerX, centerY, radius } = character;

  if (
    x >= centerX - radius &&
    x <= centerX + radius &&
    y >= centerY - radius &&
    y <= centerY + radius
  ) {
    return {
      success: true,
      message: `Character ${character.character.name} found!`,
    };
  }

  return {
    success: false,
    message: `Character ${character.character.name} not found at this location.`,
  };
}
