import { Controller, Inject, Post } from '@nestjs/common';
import {
  PDAHistService,
  PDA_HIST_TOKEN_SERVICE,
} from './domain.pdahist.service';
import {
  CreatePDAHistoryRequest,
  CreatePackingConfirmRequest,
  CreatePackingConfirmResponse,
  PDAHistoryServiceController,
  PDAHistoryServiceControllerMethods,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.pdahis.service.v1';

@Controller('pdahist')
@PDAHistoryServiceControllerMethods()
export class PDAHistController implements PDAHistoryServiceController {
  constructor(
    @Inject(PDA_HIST_TOKEN_SERVICE) private pdaHistService: PDAHistService,
  ) {}

  @Post('/v1')
  async createPdaHistory(request: CreatePDAHistoryRequest) {
    const result = await this.pdaHistService.create(request);

    return {
      creDt: result.creDt,
      quality: result.quality,
      finishId: result.pdaHisId,
      qty: result.qty,
      lineId: result.lineId,
      operationType: result.operationType,
      pdaHisId: result.pdaHisId,
      lineNm: result.lineNm,
      packingIdSeq: result.packingIdSeq,
      custOrdDtlId: result.custOrdDtlId,
    };
  }
  @Post('/v1')
  async createPackingConfirm(
    request: CreatePackingConfirmRequest,
  ): Promise<CreatePackingConfirmResponse> {
    return await this.pdaHistService.createPackingConfirm(request);
  }
}
