import { Connection, EntityManager } from 'typeorm';
import {
  GameTimeRepository as DomainGameTimeRepository,
  GameTimeInternal,
} from '@/domain/game/game-time/game-time.repository';

import { UniversePropertyRepository } from '../universe-property-repository';

const GameTimeKey = 'game-time.last-saved-game-time';
const IRLTimeKey = 'game-time.last-saved-irl-time';
const GameTimePauseKey = 'game-time.pause';

export class GameTimeRepository implements DomainGameTimeRepository {
  universePropertyRepository: UniversePropertyRepository;

  constructor(dbConnection: Connection | EntityManager) {
    this.universePropertyRepository = dbConnection.getCustomRepository(
      UniversePropertyRepository
    );
  }

  async getTimeInternal(): Promise<GameTimeInternal> {
    const [
      lastGameTimeRes,
      lastIRLTimeRes,
      pausedRes,
    ] = await this.universePropertyRepository.getMany([
      GameTimeKey,
      IRLTimeKey,
      GameTimePauseKey,
    ]);

    const lastGameTime = lastGameTimeRes ? parseInt(lastGameTimeRes) : 0;
    const lastIRLTime = lastIRLTimeRes
      ? parseInt(lastIRLTimeRes)
      : this.getCurrentIRLTime();
    const isPaused = pausedRes === '1';
    return {
      lastGameTime,
      lastIRLTime,
      isPaused,
    };
  }

  async setTimeInternal({
    lastGameTime,
    lastIRLTime,
    isPaused,
  }: GameTimeInternal) {
    const lastGameTimeProp =
      lastGameTime === undefined
        ? []
        : [{ key: GameTimeKey, value: String(lastGameTime) }];

    const lastIRLProp =
      lastIRLTime === undefined
        ? []
        : [{ key: IRLTimeKey, value: String(lastIRLTime) }];

    const pauseProp =
      isPaused === undefined
        ? []
        : [{ key: GameTimePauseKey, value: isPaused ? '1' : '0' }];

    const newProperties = [...lastGameTimeProp, ...lastIRLProp, ...pauseProp];

    await this.universePropertyRepository.setMany(newProperties);
  }

  getCurrentIRLTime() {
    return Math.floor(Date.now() / 1000);
  }
}
