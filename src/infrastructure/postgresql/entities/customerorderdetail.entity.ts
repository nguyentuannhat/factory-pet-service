import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { PDAHistEntity } from './pdahis.entity';
import { InboundEntity } from './inbound.entity';
import {
  TABLE_MES_CUST_ORD_DTL,
  MES_CUST_ORD_DTL_NAME,
  DEFAULT_TYPE_DATA,
} from 'src/infrastructure/postgresql/entities/constants';

// Libs importing
@Entity(TABLE_MES_CUST_ORD_DTL)
@Unique(['coCd', 'ordNo', 'skuId'])
export class CustomerOrderDetailEntity extends AbstractEntity<CustomerOrderDetailEntity> {
  @PrimaryGeneratedColumn('increment', {
    name: MES_CUST_ORD_DTL_NAME.custOrdDtlId,
  })
  custOrdDtlId: number;

  @Column({
    length: 20,
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_CUST_ORD_DTL_NAME.coCd,
  })
  coCd: string;

  @Column({
    length: 20,
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_CUST_ORD_DTL_NAME.ordNo,
  })
  ordNo: string;

  @Column({
    length: 100,
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_CUST_ORD_DTL_NAME.skuId,
    nullable: true,
  })
  skuId: string;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_CUST_ORD_DTL_NAME.ordQty,
    default: 0,
    nullable: true,
  })
  ordQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_CUST_ORD_DTL_NAME.shpDt,
    nullable: true,
  })
  shipDt: Date;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_CUST_ORD_DTL_NAME.ibQty,
    default: 0,
    nullable: true,
  })
  ibQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_CUST_ORD_DTL_NAME.obQty,
    nullable: true,
  })
  obQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_CUST_ORD_DTL_NAME.utPrice,
    default: 0,
    nullable: true,
  })
  unitPrice: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_CUST_ORD_DTL_NAME.amt,
    default: 0,
    nullable: true,
  })
  amount: number;

  @Column({
    length: 30,
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_CUST_ORD_DTL_NAME.shpTo,
    nullable: true,
  })
  shipTo: string;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_CUST_ORD_DTL_NAME.fnQty,
    default: 0,
    nullable: true,
  })
  fnQty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_CUST_ORD_DTL_NAME.pckQty,
    default: 0,
    nullable: true,
  })
  packingQty: number;

  @Column({
    length: 20,
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_CUST_ORD_DTL_NAME.barCd,
    nullable: true,
  })
  barcode: string;

  @OneToMany(() => PDAHistEntity, (item) => item.custOrdDtl)
  pdaHist: PDAHistEntity[];

  @OneToMany(() => InboundEntity, (item) => item.custOrdDtl)
  inbounds: InboundEntity[];
}
