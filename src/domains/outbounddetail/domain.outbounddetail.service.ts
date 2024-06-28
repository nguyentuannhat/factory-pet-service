import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  IOutboundDetailRepository,
  I_OUTBOUND_DETAIL_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/outboundDetail.repository';
import {
  GetOutboundDetailRequest,
  GetOutboundDetailResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.outbounddetail.service.v1';
import {
  IOutboundRepository,
  I_OUTBOUND_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/outbound.repository';
import { RpcException } from '@nestjs/microservices';

export const OUTBOUND_DETAIL_TOKEN_SERVICE =
  'USER MODULE OUTBOUND_DETAIL_TOKEN_SERVICE';

@Injectable()
export class OutboundDetailService {
  constructor(
    @Inject(I_OUTBOUND_REPOSITORY)
    private outboundRepository: IOutboundRepository,
    //
    @Inject(I_OUTBOUND_DETAIL_REPOSITORY)
    private outboundDetailRepository: IOutboundDetailRepository,
    private datasource: DataSource,
  ) {}
  //
  async getOutboundDetail(
    request: GetOutboundDetailRequest,
  ): Promise<GetOutboundDetailResponse> {
    const ob = await this.outboundRepository.getRepository().findOneBy({
      requestNo: request.requestNo,
    });
    if (!ob) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: 'Outbound not found by request no.',
      });
    }
    const { data, metaData } =
      await this.outboundDetailRepository.getOutboundDetail(request);
    const result = { ob, obDetailList: data, metaData };
    return result;
  }
}
