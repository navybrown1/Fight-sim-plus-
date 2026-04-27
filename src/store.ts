import { create } from 'zustand';

interface GameState {
  score: number;
  speed: number;
  boost: number;
  timeLeft: number;
  isGameOver: boolean;
  gameId: number;
  addScore: (points: number) => void;
  setGameData: (data: Partial<GameState>) => void;
  resetGame: () => void;
}

export const useStore = create<GameState>((set) => ({
  score: 0,
  speed: 0,
  boost: 100,
  timeLeft: 60,
  isGameOver: false,
  gameId: 0,
  addScore: (points) => set((state) => ({ 
    score: state.score + points,
    timeLeft: state.timeLeft + 2 // Bonus time!
  })),
  setGameData: (data) => set((state) => ({ ...state, ...data })),
  resetGame: () => set((state) => ({ score: 0, speed: 0, boost: 100, timeLeft: 60, isGameOver: false, gameId: state.gameId + 1 }))
}));
