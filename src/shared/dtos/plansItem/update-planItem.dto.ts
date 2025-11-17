import { PartialType } from '@nestjs/swagger';
import { CreatePlanItemDto } from './create-planItem.dto';

export class UpdatePlanItemDto extends PartialType(CreatePlanItemDto) {}
