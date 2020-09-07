import sinon, { SinonFakeTimers } from 'sinon';
import { RepositoryFactory } from '../../../server/repository-factory';

import * as gameTime from '../../../alcarin/game/game-time/domain/game-time';
import { GameTimeRepository } from '../../../alcarin/game/game-time/domain/game-time.repository';

describe('Game time api', () => {
  let clock: SinonFakeTimers;

  let gameTimeRepo: GameTimeRepository;

  before(() => {
    gameTimeRepo = RepositoryFactory.Default.getGameTimeRepository();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should return 0 by default', async () => {
    const result = await gameTime.getCurrentGameTime(gameTimeRepo);
    result.should.equal(0);
  });

  it('should react on IRL time pass', async () => {
    await gameTime.storeCurrentGameTime(gameTimeRepo);

    clock.tick(357000);
    const result = await gameTime.getCurrentGameTime(gameTimeRepo);
    result.should.equal(357);
  });

  it('should react on IRL time pass even after intermediate saves', async () => {
    await gameTime.storeCurrentGameTime(gameTimeRepo);

    clock.tick(357000);

    await gameTime.storeCurrentGameTime(gameTimeRepo);

    const result1 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result1.should.equal(357);

    clock.tick(10000);

    const result2 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result2.should.equal(357 + 10);
  });

  it('should ignore IRL time pass when paused', async () => {
    await gameTime.storeCurrentGameTime(gameTimeRepo);

    clock.tick(10000);

    const result1 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result1.should.equal(10);

    await gameTime.pauseGameTime(gameTimeRepo);

    clock.tick(20000);

    const result2 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result2.should.equal(10);

    clock.tick(20000);
    clock.tick(30000);

    const result3 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result3.should.equal(10);
  });

  it('should include IRL time pass when paused and unpaused again', async () => {
    await gameTime.storeCurrentGameTime(gameTimeRepo);

    clock.tick(10000);

    const result1 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result1.should.equal(10);

    await gameTime.pauseGameTime(gameTimeRepo);

    clock.tick(20000);

    const result2 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result2.should.equal(10);

    await gameTime.unpauseGameTime(gameTimeRepo);
    clock.tick(20000);
    clock.tick(30000);

    const result3 = await gameTime.getCurrentGameTime(gameTimeRepo);
    result3.should.equal(10 + 50);
  });
});
