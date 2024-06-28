// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AbstractRepository, IRepository } from './abstract.repository';
import { RoleEntity } from '../entities';

export const I_ROLE_REPOSITORY = 'I_ROLE_REPOSITORY';

export interface IRoleRepository extends IRepository<RoleEntity> {
  getRoles: () => Promise<RoleEntity[]>;
}

@Injectable()
export class RoleRepository
  extends AbstractRepository<RoleEntity>
  implements IRoleRepository
{
  constructor(
    @InjectRepository(RoleEntity)
    repository: Repository<RoleEntity>,
  ) {
    super(repository);
  }

  async getRoles(): Promise<RoleEntity[]> {
    return await this.findAll();
  }
}
