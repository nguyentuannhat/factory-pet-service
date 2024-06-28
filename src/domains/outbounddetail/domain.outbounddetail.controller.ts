import { Controller, Get, Inject } from '@nestjs/common';
import {
  OUTBOUND_DETAIL_TOKEN_SERVICE,
  OutboundDetailService,
} from './domain.outbounddetail.service';
import {
  GetOutboundDetailRequest,
  GetOutboundDetailResponse,
  OutboundDetailServiceController,
  OutboundDetailServiceControllerMethods,
} from '@clv-factory/protobuf/dist/gRPC/generate/app/mes/outbounddetail/service/v1/outbounddetail';

@Controller('outboundDetail')
@OutboundDetailServiceControllerMethods()
export class OutboundDetailController
  implements OutboundDetailServiceController
{
  constructor(
    @Inject(OUTBOUND_DETAIL_TOKEN_SERVICE)
    private outboundDetailService: OutboundDetailService,
  ) {}

  @Get('/v1')
  async getOutboundDetail(
    request: GetOutboundDetailRequest,
  ): Promise<GetOutboundDetailResponse> {
    return await this.outboundDetailService.getOutboundDetail(request);
  }
}
