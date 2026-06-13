import { create } from "zustand";

type GameState = {
  foundCharacters: string[];
  playerName: string;
  unlockedScenes: string[];
  startTimeOfScene: number | null;
  setPlayerName: (playerName: string) => void;
  setUnlockedScenes: (scenes: string[]) => void;
  setStartTimeOfScene: (time: number | null) => void;
  setFoundCharacters: (characters: string[]) => void;
};

export const useGameStore = create<GameState>((set) => ({
  foundCharacters: [],
  playerName: "",
  unlockedScenes: [],
  startTimeOfScene: null,
  setPlayerName: (playerName: string) => set({ playerName }),
  setUnlockedScenes: (unlockedScenes: string[]) => set({ unlockedScenes }),
  setStartTimeOfScene: (startTimeOfScene: number | null) =>
    set({ startTimeOfScene }),
  setFoundCharacters: (foundCharacters: string[]) => set({ foundCharacters }),
}));
