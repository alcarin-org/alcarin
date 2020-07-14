import { Tokenizer } from '../access/tools/tokenizer.tool';

export type VerifyTokenDI = {
  tokenizer: Tokenizer;
};

export async function verifyToken(di: VerifyTokenDI, token: string) {
  const { tokenizer } = di;
  const tokenPayload = await tokenizer.readToken(token);
  return tokenPayload;
}
