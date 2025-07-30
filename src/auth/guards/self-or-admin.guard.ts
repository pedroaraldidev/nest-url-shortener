import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SELF_OR_ADMIN_KEY } from '../decorators/self-or-admin.decorator';
import { InsufficientPermissionsException } from '../../common/exceptions/user.exceptions';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isSelfOrAdmin = this.reflector.getAllAndOverride<boolean>(SELF_OR_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isSelfOrAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = parseInt(request.params.id);

    if (!user) {
      throw new InsufficientPermissionsException('User not authenticated');
    }

    if (user.user_type === 'admin' || (user.sub || user.id) === userId) {
      return true;
    }

    throw new InsufficientPermissionsException('You can only delete your own account or must be an admin');
  }
} 