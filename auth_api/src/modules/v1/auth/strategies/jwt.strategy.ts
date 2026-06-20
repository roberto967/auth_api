import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { container } from 'tsyringe';
import { UserService } from '../../user/user.service';
import { AccessTokenPayload } from '../interfaces/token.types';
import { tokenConfig } from '../../../../config/env';
import { UserStatus } from '../../user/enums/userStatus.enum';

export const jwtStrategy: JwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: tokenConfig.ACCESS_TOKEN_SECRET,
  },
  (payload: AccessTokenPayload, done) => {
    void (async () => {
      try {
        const userService = container.resolve(UserService);
        const user = await userService.findOneById(payload.sub);
        if (!user) {
          return done(null, false);
        }
        if (payload.tokenVersion !== user.tokenVersion) {
          return done(null, false);
        }
        if (user.status !== UserStatus.ACTIVE) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })();
  },
);
