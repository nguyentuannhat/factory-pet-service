import { Inject, Injectable } from '@nestjs/common';
import {
  ILineRepository,
  I_LINE_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/line.repository';
import { LineModel } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.base.line.v1';
import { GetLineRequest } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.line.service.v1';

export const LINE_TOKEN_SERVICE = 'USER MODULE LINE_TOKEN_SERVICE';

@Injectable()
export class LineService {
  constructor(
    @Inject(I_LINE_REPOSITORY)
    private lineRepository: ILineRepository,
  ) {}
  async getLine(payload: GetLineRequest): Promise<LineModel[]> {
    const res = await this.lineRepository.getLine(payload);
    const mapped = res.reduce((prev, curr) => {
      const line = {
        lineId: curr.lineId,
        lineName: curr.lineName,
        lineCapacity: curr.lineCapacity,
        coCd: curr.coCd,
        floor: { ...curr.floor },
      };
      prev.push(line);
      return prev;
    }, []);
    return mapped;
  }
}
