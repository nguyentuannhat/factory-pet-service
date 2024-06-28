import { Inject, Injectable } from '@nestjs/common';
import {
  IPDAHistRepository,
  I_PDA_HIST_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/pdahis.repository';
import { PDAHistInput } from './domain.pdahist.dto';
import {
  CreatePDAHistoryResponse,
  CreatePackingConfirmRequest,
  CreatePackingConfirmResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.pdahis.service.v1';

export const PDA_HIST_TOKEN_SERVICE = 'PDA HIST MODULE PDA_HIST_TOKEN_SERVICE';

@Injectable()
export class PDAHistService {
  constructor(
    @Inject(I_PDA_HIST_REPOSITORY)
    private pdaHistRepository: IPDAHistRepository,
  ) {}

  async create(pdaHistInput: PDAHistInput): Promise<CreatePDAHistoryResponse> {
    return await this.pdaHistRepository.createPADHist(pdaHistInput);
  }
  async createPackingConfirm(
    request: CreatePackingConfirmRequest,
  ): Promise<CreatePackingConfirmResponse> {
    return this.pdaHistRepository.createPackingConfirm(request);
  }
}
