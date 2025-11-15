import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@domain/entities/user/user.enum';

/**
 * Decorator để set roles cho endpoint
 * Sử dụng: @Roles(UserRole.ADMIN, UserRole.MANAGER)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

/**
 * Guard kiểm tra role của user
 * Sử dụng: @UseGuards(JwtAuthGuard, RolesGuard)
 *          @Roles(UserRole.ADMIN, UserRole.MANAGER)
 *
 * Guard này sẽ kiểm tra:
 * - User đã authenticated (từ JwtAuthGuard)
 * - User có role phù hợp với roles được chỉ định
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy roles từ metadata (từ @Roles decorator)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // Nếu không có roles yêu cầu, cho phép
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra user đã authenticated chưa
    if (!user || !user.role) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Kiểm tra user có role phù hợp không
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
