import * as argon2 from 'argon2';

export async function getPasswordHash(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash:string) {
    return await argon2.verify(hash, password);
}
