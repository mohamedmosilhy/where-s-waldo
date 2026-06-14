"use server";

import { prisma } from "../../lib/prisma";

export async function getLeaderBoard(sceneId: string) {
  try {
    return await prisma.score.findMany({
      where: {
        imageId: sceneId,
      },
      take: 10,
      orderBy: {
        completionTime: "asc",
      },
    });
  } catch (error) {
    throw new Error(`error happened in fetching leaderboard : ${error}`);
  }
}
