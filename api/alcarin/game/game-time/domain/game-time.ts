import { GameTimeRepository } from './game-time.repository';

export function getCurrentGameTime(repo: GameTimeRepository) {
  return getCurrentGameTimeHelper(repo, repo.getCurrentIRLTime());
}

export function storeCurrentGameTime(repo: GameTimeRepository) {
  return storeCurrentGameTimeHelper(repo);
}

export function pauseGameTime(repo: GameTimeRepository) {
  return storeCurrentGameTimeHelper(repo, true);
}

export function unpauseGameTime(repo: GameTimeRepository) {
  return storeCurrentGameTimeHelper(repo, false);
}

async function getCurrentGameTimeHelper(
  repo: GameTimeRepository,
  irlTime: number
) {
  const { lastGameTime, lastIRLTime, isPaused } = await repo.getTimeInternal();
  return lastGameTime + (isPaused ? 0 : irlTime - lastIRLTime);
}

async function storeCurrentGameTimeHelper(
  repo: GameTimeRepository,
  pause?: boolean
) {
  const currentIRLTime = repo.getCurrentIRLTime();
  const currentGameTime = await getCurrentGameTimeHelper(repo, currentIRLTime);

  return repo.setTimeInternal({
    lastGameTime: currentGameTime,
    lastIRLTime: currentIRLTime,
    isPaused: pause,
  });
}
