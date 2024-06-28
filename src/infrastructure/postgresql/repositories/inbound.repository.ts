import {
  CreateInboundRequest,
  CreateInboundResponse,
  GetInboundsRequest,
  GetInboundsResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.inbound.service.v1';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { In, IsNull, ObjectLiteral, Repository } from 'typeorm';
import { InboundEntity } from '../entities/inbound.entity';
import { AbstractRepository, IRepository } from './abstract.repository';
import {
  MES_CUST_ORD_DTL_NAME,
  MES_IB_PROD_NAME,
  MRP_PROD_NAME,
  TABLE_MES_CUST_ORD_DTL,
  TABLE_MES_IB_PROD,
} from 'src/infrastructure/postgresql/entities/constants';

export const I_INBOUND_REPOSITORY = 'I_INBOUND_REPOSITORY';

export interface IInboundRepository extends IRepository<InboundEntity> {
  getInbounds: (request: GetInboundsRequest) => Promise<GetInboundsResponse>;
  createInbound: (
    inboundData: CreateInboundRequest,
  ) => Promise<CreateInboundResponse>;

  findNotYetInboundByIdList(ibIdList: number[]): Promise<InboundEntity[]>;
}

@Injectable()
export class InboundRepository
  extends AbstractRepository<InboundEntity>
  implements IInboundRepository
{
  constructor(
    @InjectRepository(InboundEntity)
    inboundEntity: Repository<InboundEntity>,
  ) {
    super(inboundEntity);
  }

  // replace status = cocd
  async getInbounds(request: GetInboundsRequest): Promise<GetInboundsResponse> {
    const { ordNo, coCd, skuId, status, fmDt, toDt } = request;
    const query = this.repository
      .createQueryBuilder(TABLE_MES_IB_PROD)
      .select([
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibId} AS ibId`,
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.lineNm} AS lineNm`,
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.lineId} AS lineId`,
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibNo} AS ibNo`,
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.pkgDt} AS pkgDt`,
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibDt} AS ibDt`,
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibQty} AS ibQty`,
        `${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordNo} AS ordNo`,
        `${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.skuId} AS skuId`,
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibQty} AS packingQty`,
        `prod.${MRP_PROD_NAME.prodNm} AS prodNm`,
      ])
      .leftJoin(`${TABLE_MES_IB_PROD}.custOrdDtl`, TABLE_MES_CUST_ORD_DTL)
      .leftJoin(
        'mrp_prod',
        'prod',
        `prod.${MRP_PROD_NAME.skuId} = ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.skuId}`,
      )
      .andWhere(
        `${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.coCd} = :coCd`,
        { coCd },
      );
    if (ordNo && ordNo.length > 0) {
      const ordNoConditions = ordNo
        .map(
          (no: string) =>
            `${TABLE_MES_CUST_ORD_DTL}.${
              MES_CUST_ORD_DTL_NAME.ordNo
            } = '${no.trim()}'`,
        )
        .join(' OR ');
      query.andWhere(`(${ordNoConditions})`);
    }
    if (skuId && skuId.length > 0) {
      const skuIdConditions = skuId
        .map(
          (no: string) =>
            `${TABLE_MES_CUST_ORD_DTL}.${
              MES_CUST_ORD_DTL_NAME.skuId
            } = '${no.trim()}'`,
        )
        .join(' OR ');
      query.andWhere(`(${skuIdConditions})`);
    }
    if (fmDt || toDt) {
      let whereClause = '';
      let fmDtFormatted: string = '';
      let toDtFormatted: string = '';
      if (fmDt && toDt) {
        fmDtFormatted = format(fmDt, 'yyyyMMdd');
        toDtFormatted = format(toDt, 'yyyyMMdd');
        whereClause = `TO_CHAR(${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibDt},'yyyyMMdd') BETWEEN :fmDt AND :toDt`;
      } else if (fmDt) {
        fmDtFormatted = format(fmDt, 'yyyyMMdd');
        whereClause = `TO_CHAR(${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibDt},'yyyyMMdd') >= :fmDt`;
      } else {
        toDtFormatted = format(toDt, 'yyyyMMdd');
        whereClause = `TO_CHAR(${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibDt},'yyyyMMdd') <= :toDt`;
      }
      query.andWhere(whereClause, { fmDt: fmDtFormatted, toDt: toDtFormatted });
    }

    if (status.toUpperCase() === 'NOT YET') {
      query.andWhere(`${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibNo} IS NULL`);
    } else if (status.toUpperCase() === 'COMPLETED') {
      query.andWhere(
        `${TABLE_MES_IB_PROD}.${MES_IB_PROD_NAME.ibNo} IS NOT NULL`,
      );
    }
    const customerorderdetail = await query.getRawMany();
    const inbounds = customerorderdetail.map((item: ObjectLiteral) => ({
      ibId: item.ibid,
      ordNo: item.ordno,
      skuId: item.skuid,
      prodNm: item.prodnm,
      packingQty: item.packingqty,
      pkgDt: item.pkgdt,
      ibDt: item.ibdt,
      ibNo: item.ibno,
      ibQty: item.ibno ? item.ibqty : 0,
      status: item.ibno ? 'Completed' : 'Not yet',
      lineNm: item.linenm,
      lineId: item.lineid,
    }));
    return { inbounds };
  }

  async createInbound(
    inboundData: CreateInboundRequest,
  ): Promise<CreateInboundResponse> {
    console.log('inbound.repository.ts line 113 : ', inboundData);
    let a: CreateInboundResponse;
    return a;
  }

  async findNotYetInboundByIdList(
    ibIdList: number[],
  ): Promise<InboundEntity[]> {
    return this.repository.find({
      where: {
        ibId: In(ibIdList),
        ibNo: IsNull(),
        ibDt: IsNull(),
      },
    });
  }
}
