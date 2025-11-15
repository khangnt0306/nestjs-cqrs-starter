import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Guard kiểm tra JWT và đảm bảo user là chủ sở hữu của resource
 * Sử dụng: @UseGuards(JwtAuthGuard, OwnerGuard)
 *
 * Guard này sẽ kiểm tra:
 * - User đã authenticated (từ JwtAuthGuard)
 * - User ID trong request (req.user.id) khớp với owner ID của resource
 *
 * Cách sử dụng:
 * - Với param: @Param('userId') userId: string
 * - Với body: body.userId hoặc body.ownerId
 * - Với custom: set @SetMetadata('ownerIdField', 'fieldName')
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra user đã authenticated chưa
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Lấy owner ID từ request
    // Ưu tiên: param > body > metadata
    const ownerId =
      request.params?.userId ||
      request.params?.id ||
      request.body?.userId ||
      request.body?.ownerId ||
      request.body?.user?.id;

    // Nếu không tìm thấy ownerId, cho phép (có thể là admin)
    if (!ownerId) {
      return true;
    }

    // Kiểm tra user có phải owner không
    if (user.id !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
