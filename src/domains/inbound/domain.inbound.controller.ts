import {
  CreateInboundRequest,
  CreateInboundResponse,
  GetInboundsRequest,
  GetInboundsResponse,
  InboundServiceController,
  InboundServiceControllerMethods,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.inbound.service.v1';
import { Controller, Get, Inject, Post } from '@nestjs/common';
import {
  INBOUND_TOKEN_SERVICE,
  InboundService,
} from './domain.inbound.service';

@Controller('inbound')
@InboundServiceControllerMethods()
export class InboundController implements InboundServiceController {
  constructor(
    @Inject(INBOUND_TOKEN_SERVICE) private inboundService: InboundService,
  ) {}

  @Get('/v1')
  async getInbounds(request: GetInboundsRequest): Promise<GetInboundsResponse> {
    return await this.inboundService.getInbounds(request);
  }
  @Post('/v1')
  async createInbound(
    request: CreateInboundRequest,
  ): Promise<CreateInboundResponse> {
    return await this.inboundService.createInbound(request);
  }
}
