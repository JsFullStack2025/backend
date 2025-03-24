import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CurrentUser } from './CurrentUser';
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authservice: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    let user = await this.authservice.validateUserCredentials(username, password);
    if (user == null) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
