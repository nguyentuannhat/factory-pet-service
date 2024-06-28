import { BaseEntity } from 'typeorm';

export abstract class AbstractEntity<Entity> extends BaseEntity {
  constructor(partial?: Partial<Entity>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
