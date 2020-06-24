import sinon, { SinonFakeTimers } from 'sinon';

import {
  getCurrentGameTime,
  storeCurrentGameTime,
  pauseGameTime,
  unpauseGameTime,
} from './game-time';

describe('Game time api', () => {
  let clock: SinonFakeTimers;

  beforeEach(() => (clock = sinon.useFakeTimers()));
  afterEach(() => clock.restore());

  it('should return 0 by default', async () => {
    const result = await getCurrentGameTime();
    result.should.equal(0);
  });

  it('should react on IRL time pass', async () => {
    await storeCurrentGameTime();

    clock.tick(357000);
    const result = await getCurrentGameTime();
    result.should.equal(357);
  });

  it('should react on IRL time pass even after intermediate saves', async () => {
    await storeCurrentGameTime();

    clock.tick(357000);

    await storeCurrentGameTime();

    const result1 = await getCurrentGameTime();
    result1.should.equal(357);

    clock.tick(10000);

    const result2 = await getCurrentGameTime();
    result2.should.equal(357 + 10);
  });

  it('should ignore IRL time pass when paused', async () => {
    await storeCurrentGameTime();

    clock.tick(10000);

    const result1 = await getCurrentGameTime();
    result1.should.equal(10);

    await pauseGameTime();

    clock.tick(20000);

    const result2 = await getCurrentGameTime();
    result2.should.equal(10);

    clock.tick(20000);
    clock.tick(30000);

    const result3 = await getCurrentGameTime();
    result3.should.equal(10);
  });

  it('should include IRL time pass when paused and unpaused again', async () => {
    await storeCurrentGameTime();

    clock.tick(10000);

    const result1 = await getCurrentGameTime();
    result1.should.equal(10);

    await pauseGameTime();

    clock.tick(20000);

    const result2 = await getCurrentGameTime();
    result2.should.equal(10);

    await unpauseGameTime();
    clock.tick(20000);
    clock.tick(30000);

    const result3 = await getCurrentGameTime();
    result3.should.equal(10 + 50);
  });
});
