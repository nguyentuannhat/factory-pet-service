// Libs importing
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { OutboundDetailEntity } from './outboundDetail.entity';
import {
  MES_OB_PROD_NAME,
  DEFAULT_TYPE_DATA,
  TABLE_MES_OB_PROD,
} from './constants';

export enum OutboundStatus {
  NEW = 'NEW',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
}

const OUTBOUND_STATUS = [
  OutboundStatus.NEW,
  OutboundStatus.CANCELLED,
  OutboundStatus.DONE,
];

@Entity({ name: TABLE_MES_OB_PROD })
export class OutboundEntity extends AbstractEntity<OutboundEntity> {
  @PrimaryGeneratedColumn('identity', { name: MES_OB_PROD_NAME.obId })
  id: number;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_OB_PROD_NAME.rqstNo })
  requestNo: string;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_OB_PROD_NAME.coCd })
  coCd: string;

  @Column({ type: DEFAULT_TYPE_DATA.TIMESTAMP, name: MES_OB_PROD_NAME.rqstDt })
  requestDt: Date;

  @Column({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_OB_PROD_NAME.rqstObDt,
    nullable: true,
  })
  requestObDt: Date;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_OB_PROD_NAME.obNo })
  obNo: string;

  @Column({ type: DEFAULT_TYPE_DATA.TIMESTAMP, name: MES_OB_PROD_NAME.obDt })
  obDt: Date;

  @Column({ type: DEFAULT_TYPE_DATA.NUMBERIC, name: MES_OB_PROD_NAME.rqstQty })
  requestQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_OB_PROD_NAME.stkQty,
    nullable: true,
  })
  stockQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_OB_PROD_NAME.obQty,
    nullable: true,
  })
  obQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.ENUM,
    name: MES_OB_PROD_NAME.sts,
    enum: OUTBOUND_STATUS,
    default: OutboundStatus.NEW,
  })
  status: OutboundStatus;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_OB_PROD_NAME.rmk,
    nullable: true,
  })
  remark: string;

  @CreateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_OB_PROD_NAME.creDt,
  })
  creDt: Date;

  @UpdateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_OB_PROD_NAME.updDt,
  })
  updDt: Date;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_OB_PROD_NAME.creUsrId,
    nullable: true,
  })
  creUsrId: string;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_OB_PROD_NAME.updUsrId,
    nullable: true,
  })
  updUsrId: string;

  @OneToMany(() => OutboundDetailEntity, (item) => item.ob)
  obDtls: OutboundDetailEntity[];
}
