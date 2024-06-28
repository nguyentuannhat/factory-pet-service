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
  MES_PDA_HIS_NAME,
  DEFAULT_TYPE_DATA,
  TABLE_MES_PDA_HIS,
} from './constants';

@Entity({ name: TABLE_MES_PDA_HIS })
export class PDAHistEntity extends AbstractEntity<PDAHistEntity> {
  @PrimaryGeneratedColumn('identity', { name: MES_PDA_HIS_NAME.pdaHisId })
  pdaHisId: number;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_PDA_HIS_NAME.opTp })
  operationType: string;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_PDA_HIS_NAME.custOrdDtlId,
    nullable: true,
  })
  custOrdDtlId: number;

  @CreateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_PDA_HIS_NAME.creDt,
    nullable: true,
  })
  creDt: Date;

  @UpdateDateColumn({
    type: DEFAULT_TYPE_DATA.TIMESTAMP,
    name: MES_PDA_HIS_NAME.updDt,
    nullable: true,
  })
  updDt: Date;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_PDA_HIS_NAME.updUsrId,
    nullable: true,
  })
  updUsrId: string;

  @Column({ type: DEFAULT_TYPE_DATA.VARCHAR, name: MES_PDA_HIS_NAME.qlty })
  quality: string;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_PDA_HIS_NAME.coCd,
    length: 20,
    default: '',
  })
  coCd: string;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_PDA_HIS_NAME.qty,
    nullable: true,
    default: 0,
  })
  qty: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_PDA_HIS_NAME.creUsrId,
    nullable: true,
  })
  creUsrId: string;

  @Column({
    type: DEFAULT_TYPE_DATA.NUMBERIC,
    name: MES_PDA_HIS_NAME.lineId,
    default: 0,
  })
  lineId: number;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_PDA_HIS_NAME.lineNm,
    nullable: true,
  })
  lineNm: string;

  @Column({
    type: DEFAULT_TYPE_DATA.VARCHAR,
    name: MES_PDA_HIS_NAME.pckIdSeq,
    length: 20,
    default: '',
  })
  packingIdSeq: string;

  @ManyToOne(() => CustomerOrderDetailEntity, (item) => item.pdaHist)
  @JoinColumn({
    name: MES_PDA_HIS_NAME.custOrdDtlId,
    referencedColumnName: 'custOrdDtlId',
  })
  custOrdDtl: CustomerOrderDetailEntity;
}
