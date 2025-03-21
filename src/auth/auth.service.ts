
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    // TODO: раскомментировать в проде для хэшированных паролей
    if (user) {
      //const passwordIsMatch  = await argon2.verify(user.hash, pass);
      const passwordIsMatch  = user.hash == pass;
      if(passwordIsMatch)
      {
        const { hash, ...result } = user;
        return result;
      }
      throw new UnauthorizedException('Имя пользователя или пароль не совпадают');
    }
    return null;
  }
}
