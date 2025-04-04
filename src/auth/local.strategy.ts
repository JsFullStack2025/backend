import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service'
import { JwtPayload } from './jwt.payload';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authservice: AuthService) {
    super(); // for username auth field
    //super({ usernameField: 'email' }); // for email auth field
  }

  async validate(username: string, password: string): Promise<JwtPayload> {
    let payload = await this.authservice.validateUserCredentials(username, password);
    if (payload == null) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
