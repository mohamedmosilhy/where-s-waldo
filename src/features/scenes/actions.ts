"use server";
import { prisma } from "../../lib/prisma";
import { ScenesList, SceneDetail } from "./types";

export async function getScenes(): ScenesList {
  try {
    const scenes = await prisma.image.findMany({
      select: {
        id: true,
        name: true,
        url: true,
      },
    });
    return scenes;
  } catch (error) {
    console.error("Error fetching scenes:", error);
    throw new Error("Failed to fetch scenes");
  }
}

export async function getSceneById(id: string): SceneDetail {
  try {
    const scene = await prisma.image.findUnique({
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
    if (!scene) {
      throw new Error("Scene not found");
    }
    return scene;
  } catch (error) {
    console.error("Error fetching scene by ID:", error);
    throw new Error("Failed to fetch scene by ID");
  }
}
