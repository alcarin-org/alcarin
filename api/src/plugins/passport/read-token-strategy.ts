import { callbackify } from 'util';

import passport from 'passport';
import {
  Strategy as JwtStrategy,
  StrategyOptions as JwtStrategyOptions,
  ExtractJwt,
} from 'passport-jwt';

import { envVars } from '../../shared/env-vars';
import { TokenPayloadType } from '../../modules/users/authorization/tokenizer.service';
import { UserRepository } from '../../modules/users/user.repository';

const jwtStratetyConfig: JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: envVars.AUTH_KEY,
  issuer: envVars.URL_BASE,
  audience: envVars.URL_BASE,
};

export function readTokenStrategy(userRepository: UserRepository) {
  passport.use(
    new JwtStrategy(
      jwtStratetyConfig,
      callbackify(async (jwtPayload: TokenPayloadType) => {
        await userRepository.getById(jwtPayload.userId);
        return jwtPayload.userId || false;
      })
    )
  );
}
