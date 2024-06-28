import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository, IRepository } from './abstract.repository';
import { OutboundEntity } from '../entities';
import {
  GetOutboundsRequest,
  GetOutboundsResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.outbound.service.v1';
import { camelCase } from 'typeorm/util/StringUtils';
import { PageMetaDto } from '../pagination/pagination.dto';
import { TABLE_MES_OB_PROD } from 'src/infrastructure/postgresql/entities/constants';

export const I_OUTBOUND_REPOSITORY = 'I_OUTBOUND_REPOSITORY';

export interface IOutboundRepository extends IRepository<OutboundEntity> {
  getOutbounds: (request: GetOutboundsRequest) => Promise<GetOutboundsResponse>;
  findByRequestNo: (requestNo: string) => Promise<OutboundEntity>;
}

@Injectable()
export class OutboundRepository
  extends AbstractRepository<OutboundEntity>
  implements IOutboundRepository
{
  constructor(
    @InjectRepository(OutboundEntity)
    outboundEntity: Repository<OutboundEntity>,
  ) {
    super(outboundEntity);
  }

  async getOutbounds(
    request: GetOutboundsRequest,
  ): Promise<GetOutboundsResponse> {
    const {
      obNo,
      requestNo,
      requestFmDate,
      requestToDate,
      shipFmDate,
      shipToDate,
      status,
      metaData,
      coCd,
    } = request;
    const { take, skip, order } = metaData;
    const orderCondition = order ? order.split('-') : ['creDt', 'DESC'];
    const orderField = camelCase(orderCondition[0]);
    const orderType =
      orderCondition[1].toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const queryBuilder = this.repository
      .createQueryBuilder(TABLE_MES_OB_PROD)
      .skip(skip)
      .take(take)
      .orderBy(`${TABLE_MES_OB_PROD}.${orderField}`, orderType);
    if (obNo) {
      queryBuilder.andWhere(`${TABLE_MES_OB_PROD}.obNo ILIKE :obNo`, {
        obNo: `%${obNo}%`,
      });
    }
    if (requestNo) {
      queryBuilder.andWhere(`${TABLE_MES_OB_PROD}.requestNo ILIKE :requestNo`, {
        requestNo: `%${requestNo}%`,
      });
    }
    if (requestFmDate) {
      queryBuilder.andWhere(
        `${TABLE_MES_OB_PROD}.requestDt >= :requestFmDate`,
        {
          requestFmDate,
        },
      );
    }
    if (requestToDate) {
      queryBuilder.andWhere(`${TABLE_MES_OB_PROD}.requestDt < :requestToDate`, {
        requestToDate,
      });
    }
    if (shipFmDate) {
      queryBuilder.andWhere(`${TABLE_MES_OB_PROD}.requestObDt >= :shipFmDate`, {
        shipFmDate,
      });
    }
    if (shipToDate) {
      queryBuilder.andWhere(`${TABLE_MES_OB_PROD}.requestObDt < :shipToDate`, {
        shipToDate,
      });
    }
    if (status) {
      queryBuilder.andWhere(`${TABLE_MES_OB_PROD}.status = :status`, {
        status: status.toUpperCase(),
      });
    }
    if (coCd) {
      queryBuilder.andWhere(`${TABLE_MES_OB_PROD}.coCd = :coCd`, {
        coCd,
      });
    }
    const outbounds = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: metaData,
    });
    return { ob: outbounds, metaData: pageMetaDto };
  }

  async findByRequestNo(requestNo: string) {
    return this.repository.findOneBy({
      requestNo,
    });
  }
}
