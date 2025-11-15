import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { OWNERSHIP_METADATA } from '../decorators/check-ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Thử lấy từ handler trước, nếu không có thì lấy từ class
    const meta =
      this.reflector.get(OWNERSHIP_METADATA, context.getHandler()) ||
      this.reflector.get(OWNERSHIP_METADATA, context.getClass());

    // Nếu route không gắn @CheckOwnership thì guard bỏ qua
    if (!meta) return true;

    const { entity, ownerField, param } = meta;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const id = req.params?.[param];

    if (!user?.id) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (!id) {
      throw new NotFoundException(`Param "${param}" is required`);
    }

    // Kiểm tra entity có hợp lệ không
    if (!entity) {
      throw new ForbiddenException(
        'Entity is not defined in CheckOwnership decorator',
      );
    }

    // Kiểm tra entity có phải là class/constructor không
    if (typeof entity !== 'function') {
      throw new ForbiddenException(
        'Entity must be a class/constructor function',
      );
    }

    let repo;
    try {
      repo = this.dataSource.getRepository(entity);
    } catch (error) {
      throw new ForbiddenException(
        `Entity ${entity.name || 'Unknown'} is not registered in TypeORM. Make sure it's included in entities array.`,
      );
    }

    // Query cực gọn – load relation nếu ownerField là relation
    // Nếu ownerField có dấu chấm (nested) hoặc không có dấu gạch dưới thì là relation
    const isRelation = !ownerField.includes('_') && !ownerField.includes('.');

    const findOptions: any = {
      where: { id },
    };

    if (isRelation) {
      // Nếu là relation, load relation và chỉ select id của relation
      findOptions.relations = [ownerField];
      findOptions.select = {
        id: true,
        [ownerField]: {
          id: true,
        },
      };
    } else {
      // Nếu là field trực tiếp, chỉ select field đó
      findOptions.select = ['id', ownerField];
    }

    const item = await repo.findOne(findOptions);

    if (!item) {
      throw new NotFoundException(`${entity.name} not found`);
    }

    // Nếu ownerField là relation: item.user.id
    // Nếu ownerField là field trực tiếp: item.userId
    const ownerId = item[ownerField]?.id ?? item[ownerField]; // Relation // Field trực tiếp

    if (ownerId !== user.id) {
      throw new ForbiddenException(`You do not own this ${entity.name}`);
    }

    return true;
  }
}
