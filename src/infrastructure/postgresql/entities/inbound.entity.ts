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
import { CustomerOrderDetailEntity } from './customerorderdetail.entity';
import {
  MES_IB_PROD_NAME,
  DEFAULT_TYPE_DATA,
  TABLE_MES_IB_PROD,
} from './constants';

@Entity({ name: TABLE_MES_IB_PROD })
export class InboundEntity extends AbstractEntity<InboundEntity> {
  @PrimaryGeneratedColumn('identity', { name: MES_IB_PROD_NAME.ibId })
  ibId: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_IB_PROD_NAME.ibNo,
    length: 30,
    nullable: true,
  })
  ibNo: string;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_IB_PROD_NAME.custOrdDtlId,
    nullable: true,
  })
  custOrdDtlId: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_IB_PROD_NAME.ibQty,
    nullable: true,
    default: 0,
  })
  ibQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_IB_PROD_NAME.coCd,
    length: 20,
  })
  coCd: string;

  @Column({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_IB_PROD_NAME.pkgDt,
    default: () => 'CURRENT_TIMESTAMP',
  })
  pkgDt: Date;

  @Column({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_IB_PROD_NAME.ibDt,
    nullable: true,
  })
  ibDt: Date;

  @Column({ type: DEFAULT_TYPE_DATA.NUMBERIC, name: MES_IB_PROD_NAME.lineId })
  lineId: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_IB_PROD_NAME.lineNm,
    nullable: true,
  })
  lineNm: string;

  @CreateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_IB_PROD_NAME.creDt,
    nullable: true,
  })
  creDt: Date;

  @UpdateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_IB_PROD_NAME.updDt,
    nullable: true,
  })
  updDt: Date;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_IB_PROD_NAME.creUsrId })
  creUsrId: string;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_IB_PROD_NAME.updUsrId })
  updUsrId: string;

  @ManyToOne(() => CustomerOrderDetailEntity, (item) => item.inbounds)
  @JoinColumn({
    name: MES_IB_PROD_NAME.custOrdDtlId,
    referencedColumnName: 'custOrdDtlId',
  })
  custOrdDtl: CustomerOrderDetailEntity;
}
