import assert from 'assert';

import {
  all as allRaces,
  CannotCreateRaceFromUnknownKey,
  createRaceFormKey,
} from './races';

describe('race test', () => {
  it('there should be possible to create all races from it keys', () => {
    const test = () => {
      allRaces.forEach(race => {
        const results = createRaceFormKey(race.key);
        results.should.equal(race);
      });
    };
    assert.doesNotThrow(test, CannotCreateRaceFromUnknownKey);
  });

  it('it should not be possible to create race from unexisting key', () => {
    const unExistingRaceKey = 'unExistingRaceKey';
    const error = new CannotCreateRaceFromUnknownKey(unExistingRaceKey);
    const test = () => createRaceFormKey(unExistingRaceKey);
    assert.throws(test, error);
  });
});
