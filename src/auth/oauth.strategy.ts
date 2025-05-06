// google.strategy.ts
import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';


//const GoogleStrategy = require('passport-google-oauth20').Strategy;

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.YOUR_CLIENT_ID,
      clientSecret: process.env.YOUR_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/auth/google/callback`,
      //scope:  'https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/profile.emails.read https://www.googleapis.com/auth/userinfo.profile',
      scope: ['openid', 'email', 'profile'],
    });
  }

  async validate(
    access_Token: string,
    refreshToken: string,
    profile: any,
    cb: any,
    idToken: any,
  ) {
    //console.log('Access Token:', access_Token);
    //console.log('Refresh Token:', refreshToken);
    //console.log('Raw Profile:', profile); // Логируем весь объект
    //console.log('Raw Profile:', profile._json); // Логируем весь объект
  
     //Если profile пуст, проверяем его структуру
    if (!profile || Object.keys(profile).length === 0) {
      throw new UnauthorizedException('Google profile not found');
    }
  
    // Возвращаем данные, если всё в порядке
    return {
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      photo: profile.photos?.[0]?.value,
    };
  }
}
    
  