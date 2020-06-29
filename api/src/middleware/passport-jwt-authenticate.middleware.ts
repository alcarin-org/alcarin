import passport from 'passport';
import status from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

/** force passport to send json on UNAUTHORIZED.... */
export const jwtAuthenticate = function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate('jwt', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(status.UNAUTHORIZED).send({});
    }
    req.user = user;
    next();
  })(req, res, next);
};
