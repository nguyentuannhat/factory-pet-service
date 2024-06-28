import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { LineEntity } from './line.entity';
import { MES_FLR_NAME, DEFAULT_TYPE_DATA, TABLE_MES_FLR } from './constants';

// Libs importing
@Entity(TABLE_MES_FLR)
export class FloorEntity extends AbstractEntity<FloorEntity> {
  @PrimaryColumn({ type: DEFAULT_TYPE_DATA.NUMBERIC, name: MES_FLR_NAME.flrId })
  floorId: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_FLR_NAME.flrCd,
    length: 30,
  })
  floorCode: string;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_FLR_NAME.flrNm,
    length: 50,
  })
  floorName: string;

  // @OneToMany(() => LineEntity, (line) => line.floor)
  lines: LineEntity;
}
