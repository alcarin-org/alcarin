import { Tokenizer } from '@/domain/access/tools/tokenizer.tool';

export type verifyTokenDI = {
  tokenizer: Tokenizer;
};

export async function verifyToken(di: verifyTokenDI, token: string) {
  const { tokenizer } = di;
  const tokenPayload = await tokenizer.readToken(token);
  return tokenPayload;
}
