import { callbackify } from 'util';

import passport from 'passport';
import {
  Strategy as JwtStrategy,
  StrategyOptions as JwtStrategyOptions,
  ExtractJwt,
} from 'passport-jwt';

import { UserRepo } from '../../db';
import { envVars } from '../../shared/envVars';

interface JsonWebTokenPayload {
  client_id: string;
}

const jwtStratetyConfig: JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: envVars.AUTH_KEY,
  issuer: envVars.URL_BASE,
  audience: envVars.URL_BASE,
};

export function loadPassportStrategies() {
  passport.use(
    new JwtStrategy(
      jwtStratetyConfig,
      callbackify(async (jwtPayload: JsonWebTokenPayload) => {
        const user = await UserRepo.get(jwtPayload.client_id);
        return user || false;
      })
    )
  );
}
