import { Controller, Get, Inject, Post, Put } from '@nestjs/common';
import {
  OUTBOUND_TOKEN_SERVICE,
  OutboundService,
} from './domain.outbound.service';
import {
  CreateOutboundRequest,
  CreateOutboundResponse,
  GetOutboundsRequest,
  GetOutboundsResponse,
  OutboundServiceController,
  OutboundServiceControllerMethods,
  UpdateOutboundRequest,
  UpdateOutboundResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.outbound.service.v1';

@Controller('outbound')
@OutboundServiceControllerMethods()
export class OutboundController implements OutboundServiceController {
  constructor(
    @Inject(OUTBOUND_TOKEN_SERVICE) private outboundService: OutboundService,
  ) {}

  @Get('/v1')
  async getOutbounds(
    request: GetOutboundsRequest,
  ): Promise<GetOutboundsResponse> {
    return await this.outboundService.getOutbounds(request);
  }

  @Post('/v1')
  async createOutbound(
    request: CreateOutboundRequest,
  ): Promise<CreateOutboundResponse> {
    return await this.outboundService.createOrUpdateOutbound(request);
  }

  @Put('/v1')
  async updateOutbound(
    request: UpdateOutboundRequest,
  ): Promise<UpdateOutboundResponse> {
    return await this.outboundService.updateStatusRemark(request);
  }
}
