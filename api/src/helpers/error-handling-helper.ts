import { DomainError } from './domain-error';

export function isDomainError<T extends DomainError>() {
  return (error: Error | T): error is T => {
    return (error as T).isSuccessfullyCasted !== undefined;
  };
}
