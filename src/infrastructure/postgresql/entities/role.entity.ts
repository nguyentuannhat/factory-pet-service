// Libs importing
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import {
  MES_ROLE_NAME,
  DEFAULT_TYPE_DATA,
  TABLE_MES_ROLE,
} from 'src/infrastructure/postgresql/entities/constants';

@Entity({ name: TABLE_MES_ROLE })
export class RoleEntity extends AbstractEntity<RoleEntity> {
  @PrimaryGeneratedColumn({
    name: MES_ROLE_NAME.roleId,
  })
  id: string;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_ROLE_NAME.roleNm })
  roleName: string;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_ROLE_NAME.colr,
    nullable: true,
    default: '#ffffff',
  })
  color: string;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_ROLE_NAME.sts,
    nullable: true,
  })
  activateStatus: string;
}
