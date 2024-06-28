import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { FloorEntity } from './floor.entity';
import { MES_LINE_NAME, DEFAULT_TYPE_DATA, TABLE_MES_LINE } from './constants';

// Libs importing
@Entity(TABLE_MES_LINE)
export class LineEntity extends AbstractEntity<LineEntity> {
  @PrimaryColumn({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_LINE_NAME.lineId,
    nullable: false,
  })
  lineId: number;

  @Column({
    length: 20,
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_LINE_NAME.lineNm,
  })
  lineName: string;

  @Column({ type: DEFAULT_TYPE_DATA.NUMBERIC, name: MES_LINE_NAME.lineCapa })
  lineCapacity: number;

  @Column({
    length: 20,
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_LINE_NAME.coCd,
  })
  coCd: string;

  @ManyToOne(() => FloorEntity, (floor) => floor.lines)
  // @JoinColumn({ name: 'floor_id', referencedColumnName: 'floorId' })
  floor: FloorEntity;
}
