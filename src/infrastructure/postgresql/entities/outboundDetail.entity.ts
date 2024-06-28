// Libs importing
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { OutboundEntity } from './outbound.entity';
import {
  MES_OB_PROD_DTL_NAME,
  DEFAULT_TYPE_DATA,
  TABLE_MES_OB_PROD_DTL,
} from './constants';
@Entity({ name: TABLE_MES_OB_PROD_DTL })
export class OutboundDetailEntity extends AbstractEntity<OutboundDetailEntity> {
  @PrimaryGeneratedColumn('identity', { name: MES_OB_PROD_DTL_NAME.obDtlId })
  id: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_OB_PROD_DTL_NAME.rqstNo,
  })
  requestNo: string;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_OB_PROD_DTL_NAME.skuId })
  skuId: string;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_OB_PROD_DTL_NAME.ordNo })
  ordNo: string;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_OB_PROD_DTL_NAME.rqstQty,
  })
  requestQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_OB_PROD_DTL_NAME.stkQty,
    nullable: true,
  })
  stockQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_OB_PROD_DTL_NAME.obQty,
    nullable: true,
  })
  obQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_OB_PROD_DTL_NAME.note,
    nullable: true,
  })
  note: string;

  @CreateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_OB_PROD_DTL_NAME.creDt,
  })
  creDt: Date;

  @UpdateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_OB_PROD_DTL_NAME.updDt,
  })
  updDt: Date;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_OB_PROD_DTL_NAME.creUsrId,
    nullable: true,
  })
  creUsrId: string;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_OB_PROD_DTL_NAME.updUsrId,
    nullable: true,
  })
  updUsrId: string;

  @ManyToOne(() => OutboundEntity, (item) => item.obDtls)
  @JoinColumn({ name: MES_OB_PROD_DTL_NAME.obId, referencedColumnName: 'id' })
  ob: OutboundEntity;
}
