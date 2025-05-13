import { Session } from 'express-session';

declare module 'express-session' {
  interface Session {
    user?: {
      email: string;
      name: string;
      photo?: string;
    };
  }
}