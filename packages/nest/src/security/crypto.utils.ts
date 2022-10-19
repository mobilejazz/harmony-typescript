import { randomBytes } from 'crypto';
import { compare, hash, hashSync } from 'bcryptjs';

export class CryptoUtils {
    private static readonly saltIteration = 12;

    static passwordHashAlgorithm(): string {
        return `bcryptjs::hash_it${this.saltIteration}`;
    }

    static async generateToken(size = 64): Promise<string> {
        return randomBytes(size / 2.0).toString('hex');
    }

    static generateTokenSync(size = 64): string {
        return randomBytes(size / 2.0).toString('hex');
    }

    static generatePasswordHashSync(password: string): string {
        return hashSync(password, CryptoUtils.saltIteration);
    }

    static async generatePasswordHash(password: string): Promise<string> {
        return hash(password, CryptoUtils.saltIteration);
    }

    static async comparePasswordHash(password: string, passwordHash: string): Promise<boolean> {
        return await compare(password, passwordHash);
    }
}
