import { create } from "zustand";

type GameState = {
  playerName: string;
  unlockedScenes: string[];
  startTimeOfScene: number;
  setPlayerName: (playerName: string) => void;
  setStartTimeOfScene: (time: number) => void;
};

export const useGameStore = create<GameState>((set) => ({
  playerName: "",
  unlockedScenes: [],
  startTimeOfScene: 0,
  setPlayerName: (playerName: string) => set({ playerName }),
  setStartTimeOfScene: (startTimeOfScene: number) => set({ startTimeOfScene }),
}));
