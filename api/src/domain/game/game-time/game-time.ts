import { UniversePropertyRepo } from 'src/db';

const GameTimeKey = 'universal.last-saved-game-time';
const IRLTimeKey = 'universal.last-saved-irl-time';
const GameTimePauseKey = 'universal.game-time-pause';

export async function getCurrentGameTime() {
  return getCurrentGameTimeHelper(getCurrentIRLTime());
}

export async function storeCurrentGameTime() {
  return storeCurrentGameTimeHelper();
}

export async function pauseGameTime() {
  return storeCurrentGameTimeHelper(true);
}

export async function unpauseGameTime() {
  return storeCurrentGameTimeHelper(false);
}

function getCurrentIRLTime() {
  return Math.floor(Date.now() / 1000);
}

async function getCurrentGameTimeHelper(irlTime: number) {
  const [
    lastGameTimeRes,
    lastIRLTimeRes,
    pausedRes,
  ] = await UniversePropertyRepo.getMany([
    GameTimeKey,
    IRLTimeKey,
    GameTimePauseKey,
  ]);

  const lastGameTime = lastGameTimeRes ? parseInt(lastGameTimeRes) : 0;
  const lastIRLTime = lastIRLTimeRes
    ? parseInt(lastIRLTimeRes)
    : getCurrentIRLTime();
  const isPaused = pausedRes === '1';

  return lastGameTime + (isPaused ? 0 : irlTime - lastIRLTime);
}

async function storeCurrentGameTimeHelper(pause?: boolean) {
  const currentIRLTime = getCurrentIRLTime();
  const currentGameTime = await getCurrentGameTimeHelper(currentIRLTime);

  const pauseProperty =
    pause !== undefined
      ? [{ key: GameTimePauseKey, value: pause ? '1' : '0' }]
      : [];
  const newProperties = [
    {
      key: GameTimeKey,
      value: String(currentGameTime),
    },
    {
      key: IRLTimeKey,
      value: String(currentIRLTime),
    },
    ...pauseProperty,
  ];
  return UniversePropertyRepo.setMany(newProperties);
}
