import { OutboundDetailEntity } from './../entities/outboundDetail.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository, IRepository } from './abstract.repository';
import { GetOutboundDetailRequest } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.outbounddetail.service.v1';
import { camelCase } from 'typeorm/util/StringUtils';
import { PageMetaDto } from '../pagination/pagination.dto';
import { PageDto } from '../pagination/page.dto';
import { OffsetPaginationResponseModel } from '@clv-factory/protobuf/dist/gRPC/generate/app/base/pagination/base/response/v1/pagination';
import { OutboundDetailModel } from '@clv-factory/protobuf/dist/gRPC/generate/app/mes/base/outbounddetail/v1/outbounddetail';
import {
  MES_OB_PROD_DTL_NAME,
  MRP_PROD_NAME,
  TABLE_MES_OB_PROD_DTL,
} from 'src/infrastructure/postgresql/entities/constants';
export const I_OUTBOUND_DETAIL_REPOSITORY = 'I_OUTBOUND_DETAIL_REPOSITORY';

export interface IOutboundDetailRepository
  extends IRepository<OutboundDetailEntity> {
  getOutboundDetail: (request: GetOutboundDetailRequest) => Promise<{
    data: OutboundDetailModel[];
    metaData: OffsetPaginationResponseModel;
  }>;
  batchDeleteByRequestNo: (requestNo: string) => Promise<boolean>;
}

@Injectable()
export class OutboundDetailRepository
  extends AbstractRepository<OutboundDetailEntity>
  implements IOutboundDetailRepository {
  constructor(
    @InjectRepository(OutboundDetailEntity)
    outboundDetailEntity: Repository<OutboundDetailEntity>,
  ) {
    super(outboundDetailEntity);
  }

  async getOutboundDetail(request: GetOutboundDetailRequest): Promise<{
    data: OutboundDetailModel[];
    metaData: OffsetPaginationResponseModel;
  }> {
    const { requestNo, metaData } = request;
    const { take, skip, order } = metaData;
    const orderCondition = order ? order.split('-') : ['creDt', 'DESC'];
    const orderField = camelCase(orderCondition[0]);
    const orderType =
      orderCondition[1].toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const queryBuilder = this.repository
      .createQueryBuilder(TABLE_MES_OB_PROD_DTL)
      .select([
        `${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.skuId} AS "skuId"`,
        `${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.ordNo} as "ordNo"`,
        `${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.rqstQty} as "requestQty"`,
        `${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.stkQty} as "stockQty"`,
        `${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.obQty} as "obQty"`,
        `${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.note} as "note"`,
        `prod.${MRP_PROD_NAME.prodNm} AS "prodNm"`,
      ])
      .leftJoin(
        'mrp_prod',
        'prod',
        `prod.${MRP_PROD_NAME.skuId} = ${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.skuId}`,
      )
      .where(
        `${TABLE_MES_OB_PROD_DTL}.${MES_OB_PROD_DTL_NAME.rqstNo} = :requestNo`,
        {
          requestNo,
        },
      )
      .skip(skip)
      .take(take)
      .orderBy(`${TABLE_MES_OB_PROD_DTL}.${orderField}`, orderType);
    const obDtl = await queryBuilder.getRawMany();
    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: metaData,
    });
    return new PageDto(obDtl, pageMetaDto);
  }

  async batchDeleteByRequestNo(requestNo: string) {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(OutboundDetailEntity)
      .where(`${MES_OB_PROD_DTL_NAME.rqstNo} = :requestNo`, { requestNo })
      .execute();
    return true;
  }
}
