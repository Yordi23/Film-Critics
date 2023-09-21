import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTHORIZED_ROLES_KEY } from '../decorators/authorized-roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const authorizedRoles = this.reflector.get<string[]>(
      AUTHORIZED_ROLES_KEY,
      context.getHandler(),
    );

    if (!authorizedRoles) return true;

    const request = context.switchToHttp().getRequest();

    if (!request.user || !request.user.role) {
      throw new InternalServerErrorException();
    }

    if (!this.isAuthorizedRole(request.user.role, authorizedRoles)) {
      throw new ForbiddenException();
    }

    return true;
  }

  private isAuthorizedRole(role: string, authorizedRoles: string[]): boolean {
    const authorizedRolesSet = new Set(authorizedRoles);

    return authorizedRolesSet.has(role);
  }
}
