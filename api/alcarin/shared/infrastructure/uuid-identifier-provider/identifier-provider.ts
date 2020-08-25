import { v4 as uuid } from 'uuid';
import { IdentifierProviderService } from '../identifier-provider.tool';

export class IdentifierProvider implements IdentifierProviderService {
  genIdentifier(): string {
    return uuid();
  }
}

export const identifierProvider = new IdentifierProvider();
