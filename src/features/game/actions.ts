"use server";

import { prisma } from "../../lib/prisma";

export async function validateCharacterSelection(
  pos: { x: number; y: number },
  characterId: string,
  imageId: string,
) {
  try {
    const { x, y } = pos;

    // Targeted lookup — no full scene join needed
    const imageCharacter = await prisma.imageCharacter.findUnique({
      where: {
        imageId_characterId: { imageId, characterId },
      },
      include: { character: { select: { name: true } } },
    });

    if (!imageCharacter) {
      return { success: false, message: "Character not found in this scene." };
    }

    const { centerX, centerY, radius, character } = imageCharacter;

    // Circular distance check (radius is in normalized 0-1 space)
    const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (dist <= radius) {
      return { success: true, message: `Found ${character.name}!` };
    }

    return { success: false, message: `Not ${character.name} — keep looking!` };
  } catch (error) {
    console.error("Error validating character selection:", error);
    return { success: false, message: "Validation failed. Try again." };
  }
}

export async function setScore(scoreData: {
  playerName: string;
  completionTime: number;
  imageId: string;
}) {
  try {
    return await prisma.score.create({ data: scoreData });
  } catch (error) {
    throw new Error(`Failed to save score: ${error}`);
  }
}
