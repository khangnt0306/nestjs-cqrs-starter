import { Repository, DataSource, EntityTarget } from 'typeorm';

export class BaseRepository<T> extends Repository<T> {
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }
}
