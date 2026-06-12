"use server";
import { prisma } from "../../lib/prisma";

export async function getScenes() {
  return await prisma.image.findMany({
    select: {
      id: true,
      name: true,
      url: true,
    },
  });
}

export async function getSceneById(id: string) {
  return await prisma.image.findUnique({
    select: {
      id: true,
      name: true,
      url: true,
      characters: {
        select: {
          character: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
  });
}
