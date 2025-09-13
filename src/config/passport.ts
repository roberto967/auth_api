import passport from 'passport';
import { localStrategy } from '../modules/v1/auth/strategies/local.strategy';
import { jwtStrategy } from '../modules/v1/auth/strategies/jwt.strategy';

export function configurePassport(): void {
  passport.use(localStrategy);
  passport.use(jwtStrategy);

  // passport.use(googleStrategy);
}
