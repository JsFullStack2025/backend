import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest(); // Запрос
    const user = request.user;  // Пользователь из аутентификации
    const userId = request.params.id;  // Пользователь из URL

    // Простая проверка: пользователь может получить только свои данные
    console.log(user.id);
    console.log(userId);
    return user && user.id === +userId;
  }
}

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest(); // Запрос
    const user = request.user;  // Пользователь из аутентификации
    return user && user.isAdmin;
  }
}