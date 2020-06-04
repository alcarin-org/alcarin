import { callbackify } from 'util';

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { UserRepo } from '../../db';
import { envVars } from '../../shared/envVars';

interface JsonWebTokenPayload {
  client_id: string;
}

const jwtStratetyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: envVars.AUTH_KEY,
  issuer: envVars.URL_BASE,
  audience: envVars.URL_BASE,
};

passport.use(
  new JwtStrategy(
    jwtStratetyConfig,
    callbackify(async (jwtPayload: JsonWebTokenPayload) => {
      const user = await UserRepo.get(jwtPayload.client_id);
      return user || false;
    })
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    callbackify(async (email: string, password: string) => {
      const user = await UserRepo.get(email);
      const passwordsMatch =
        user && (await bcrypt.compare(password, user.passwordHash));

      if (passwordsMatch) {
        return user;
      } else {
        return false;
        //throw new Error('Incorrect Username / Password');
      }
    })
  )
);
