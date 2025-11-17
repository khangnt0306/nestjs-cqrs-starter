import {
  Injectable,
  Scope,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getUserId(): string {
    const user = (this.request as any).user;
    if (!user?.id) {
      throw new UnauthorizedException('User is not authenticated');
    }
    return user.id;
  }

  getUser() {
    const user = (this.request as any).user;
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    return user;
  }
}
