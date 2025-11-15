import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_METADATA = 'ownership_meta';

export const CheckOwnership = ({
  entity,
  ownerField = 'user_id',
  param = 'id',
}: {
  entity: any;
  ownerField?: string;
  param?: string;
}) =>
  SetMetadata(OWNERSHIP_METADATA, {
    entity,
    ownerField,
    param,
  });
