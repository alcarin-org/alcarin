export interface GameTimeInternal {
  lastGameTime: number;
  lastIRLTime: number;
  isPaused: boolean;
}

export interface GameTimeRepository {
  getTimeInternal(): Promise<GameTimeInternal>;
  setTimeInternal(time: Partial<GameTimeInternal>): Promise<void>;

  getCurrentIRLTime(): number;
}
