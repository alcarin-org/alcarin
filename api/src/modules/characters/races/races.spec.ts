import assert from 'assert';

import { elf } from './elf';
import { human } from './human';

import {
  all as allRaces,
  CannotCreateRaceFromUnknownKey,
  createRaceFromKey,
} from './index';

describe('race test', () => {
  it('there should be possible to create all races from it keys', () => {
    const test = () => {
      allRaces.forEach(race => {
        const results = createRaceFromKey(race.key);
        results.should.equal(race);
      });
    };
    assert.doesNotThrow(test, CannotCreateRaceFromUnknownKey);
  });

  it('it should not be possible to create race from unexisting key', () => {
    const unExistingRaceKey = 'unExistingRaceKey';
    const error = new CannotCreateRaceFromUnknownKey(unExistingRaceKey);
    const test = () => createRaceFromKey(unExistingRaceKey);
    assert.throws(test, error);
  });

  it('it has elf race', () => {
    const test = () => {
      const results = createRaceFromKey(elf.key);
      results.should.equal(elf);
    };
    assert.doesNotThrow(test, CannotCreateRaceFromUnknownKey);
  });

  it('it has human race', () => {
    const test = () => {
      const results = createRaceFromKey(human.key);
      results.should.equal(human);
    };
    assert.doesNotThrow(test, CannotCreateRaceFromUnknownKey);
  });
});
