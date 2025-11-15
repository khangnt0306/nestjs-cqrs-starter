import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';

/**
 * Decorator để set thông tin resource cần kiểm tra
 * @param entityClass - Entity class (ví dụ: Post, User)
 * @param ownerField - Tên field chứa owner ID (ví dụ: 'user_id', 'userId', 'ownerId')
 * @param paramName - Tên param chứa resource ID (mặc định: 'id')
 *
 * Sử dụng: @ResourceOwner(Post, 'user_id', 'id')
 */
export const ResourceOwner = (
  entityClass: any,
  ownerField: string = 'user_id',
  paramName: string = 'id',
) =>
  SetMetadata('resourceOwner', {
    entityClass,
    ownerField,
    paramName,
  });

/**
 * Guard kiểm tra JWT và đảm bảo user là chủ sở hữu của resource
 * Sử dụng: @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
 *          @ResourceOwner(Post, 'user_id', 'id')
 *
 * Guard này sẽ:
 * - Kiểm tra user đã authenticated
 * - Lấy resource ID từ params
 * - Kiểm tra resource.ownerField === req.user.id
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra user đã authenticated chưa
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Lấy metadata từ decorator
    const resourceInfo = this.reflector.getAllAndOverride<{
      entityClass: any;
      ownerField: string;
      paramName: string;
    }>('resourceOwner', [context.getHandler(), context.getClass()]);

    // Nếu không có metadata, cho phép (có thể là admin)
    if (!resourceInfo) {
      return true;
    }

    const { entityClass, ownerField, paramName } = resourceInfo;
    const resourceId = request.params?.[paramName];

    if (!resourceId) {
      throw new NotFoundException(`${paramName} is required`);
    }

    // Lấy repository và tìm resource
    const repository = this.dataSource.getRepository(entityClass);
    const resource = await repository.findOne({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    // Kiểm tra owner
    const ownerId = resource[ownerField] || (resource as any)[ownerField];

    if (ownerId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
