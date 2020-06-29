import assert from 'assert';

import { isDomainError } from './error-handling-helper';
import { DomainError } from './domain-error';

describe('Error handling helper spec', () => {
  it('should properly recognize DomainError', async () => {
    const error = new DomainError('any message');
    const isDomainErrorChecker = isDomainError<DomainError>();
    assert.strictEqual(isDomainErrorChecker(error), true);
  });

  it('should properly recognize extended DomainError', async () => {
    class ExtendedDomainClass extends DomainError {}
    const error = new ExtendedDomainClass('any message');
    const isExtendedDomain = isDomainError<DomainError>();
    assert.strictEqual(isExtendedDomain(error), true);
  });

  it('should properly not recognize not Domain Error', async () => {
    class ExtendedDomainClass extends DomainError {}
    const isExtendedDomain = isDomainError<ExtendedDomainClass>();
    assert.strictEqual(isExtendedDomain(new Error()), false);
  });
});
