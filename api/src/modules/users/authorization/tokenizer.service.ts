export interface TokenizerService {
  createToken(payload: TokenPayloadType): string;
}

export interface TokenPayloadType {
  userId: string;
  strategy: AuthenticationStrategy;
}

export enum AuthenticationStrategy {
  PASSWORD = 'password',
}
