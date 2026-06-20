import { randomBytes, scrypt as _scrypt, createHash } from 'crypto';
import { injectable } from 'tsyringe';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@injectable()
export class CryptoService {
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return `${salt}.${hash.toString('hex')}`;
  }

  async validatePassword(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    const [salt, storedHash] = storedPassword.split('.');
    if (!salt || !storedHash) return false;
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  generateAndHashToken(): [string, string] {
    const token = randomBytes(40).toString('hex');
    return [token, this.hashToken(token)];
  }

}
