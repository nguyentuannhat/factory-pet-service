import { Injectable } from '@nestjs/common';
import { AbstractRepository, IRepository } from './abstract.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LineEntity } from '../entities/line.entity';
import { GetLineRequest } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.line.service.v1';
import {
  MES_LINE_NAME,
  TABLE_MES_LINE,
} from 'src/infrastructure/postgresql/entities/constants';

export const I_LINE_REPOSITORY = 'I_LINE_REPOSITORY';

export interface ILineRepository extends IRepository<LineEntity> {
  getLine: (payload: GetLineRequest) => Promise<LineEntity[]>;
}

@Injectable()
export class LineRepository
  extends AbstractRepository<LineEntity>
  implements ILineRepository
{
  constructor(
    @InjectRepository(LineEntity)
    lineRepository: Repository<LineEntity>,
  ) {
    super(lineRepository);
  }

  async getLine(payload: GetLineRequest): Promise<LineEntity[]> {
    const { coCd } = payload;
    const lineAndFloor = await this.repository
      .createQueryBuilder(TABLE_MES_LINE)
      .leftJoinAndSelect(`${TABLE_MES_LINE}.floor`, 'floor')
      .where(`${TABLE_MES_LINE}.${MES_LINE_NAME.coCd} = :coCd`, { coCd })
      .getMany();

    return lineAndFloor;
  }
}
