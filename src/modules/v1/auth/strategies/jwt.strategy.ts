import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { container } from 'tsyringe';
import { UserService } from '../../user/user.service';
import { AccessTokenPayload } from '../interfaces/token.types';

let userService: UserService;
try {
  userService = container.resolve(UserService);
} catch {
  container.registerSingleton(UserService, UserService);
  userService = container.resolve(UserService);
}

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  },
  (payload: AccessTokenPayload, done) => {
    void (async () => {
      try {
        const user = await userService.findOneById(payload.sub);
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
