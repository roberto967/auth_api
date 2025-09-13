import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { container } from 'tsyringe';
import { UserService } from '../../user/user.service';
import { AccessTokenPayload } from '../interfaces/token.types';

const userService = container.resolve(UserService);

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your_default_secret',
  },
  (payload: AccessTokenPayload, done) => {
    void (async () => {
      try {
        const user = await userService.findUserById(payload.sub);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })();
  },
);
