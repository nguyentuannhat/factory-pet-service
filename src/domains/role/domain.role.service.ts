import { Inject, Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/infrastructure/postgresql/entities/role.entity';
import {
  IRoleRepository,
  I_ROLE_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/role.repository';
import { RoleDTO } from './domain.role.dto';

export const ROLE_TOKEN_SERVICE = 'USER MODULE ROLE_TOKEN_SERVICE';

@Injectable()
export class RoleService {
  constructor(
    @Inject(I_ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
  ) {}

  async get() {
    return await this.roleRepository.getRoles();
  }

  async create(roleDTO: RoleDTO): Promise<RoleEntity> {
    const newItem = this.roleRepository.create(roleDTO);
    return await newItem.save();
  }
}
