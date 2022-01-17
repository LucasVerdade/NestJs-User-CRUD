import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role;
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    if (!requiredRole) return true;

    if (userRole !== requiredRole) {
      throw new ForbiddenException('Você não tem acesso a esse recurso');
    } else {
      return true;
    }
  }
}
