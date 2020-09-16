import passport from 'passport';
import passportJwt from 'passport-jwt';
import { Student } from '../school-api/api/user';
import * as Error from '../school-api/exceptions/constants';
import ExceptionHandler from '../school-api/exceptions/handler';
import config from './env';

export function JwtStrategy (passport) {
  const opts = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  };

  passport.use('jwt', new passportJwt.Strategy(opts, function (jwtPayload, done, info) {
    Student.findByPk(jwtPayload.id_usuario)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) =>
        done(err)
      );
  }));

}

export function JwtAuthentication (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      req.user = user;
      next();
    } else {
      next(ExceptionHandler
        .unauthorizedException(Error
          .UNAUTHORIZED_EXCEPTION));
    }
  })(req, res, next);
}

