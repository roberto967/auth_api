import { Strategy as LocalStrategy } from 'passport-local';
import { container } from 'tsyringe';
import { UserService } from '../../user/user.service';
import { HttpError } from '../../../../error/http.error';
import { CryptoService } from '../crypto.service';

const userService = container.resolve(UserService);
const cryptoService = container.resolve(CryptoService);

export const localStrategy: LocalStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    void (async () => {
      try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
          return done(
            new HttpError('Unauthorized', 401, 'Invalid email or password', []),
            false,
          );
        }

        const isPasswordValid = await cryptoService.validatePassword(
          password,
          user.passwordHash,
        );
        if (!isPasswordValid) {
          return done(
            new HttpError('Unauthorized', 401, 'Invalid email or password', []),
            false,
          );
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })();
  },
);
