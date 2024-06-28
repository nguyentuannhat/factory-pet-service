import {
  CreateInboundRequest,
  CreateInboundResponse,
  GetInboundsRequest,
  GetInboundsResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.inbound.service.v1';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { format } from 'date-fns';
import {
  CustomerOrderDetailEntity,
  InboundEntity,
} from 'src/infrastructure/postgresql/entities';
import {
  IInboundRepository,
  I_INBOUND_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/inbound.repository';
import { DataSource, IsNull, Not, Raw } from 'typeorm';

export const INBOUND_TOKEN_SERVICE = 'USER MODULE INBOUND_TOKEN_SERVICE';

@Injectable()
export class InboundService {
  constructor(
    @Inject(I_INBOUND_REPOSITORY)
    private inboundRepository: IInboundRepository,
    private datasource: DataSource,
  ) {}

  async getInbounds(request: GetInboundsRequest): Promise<GetInboundsResponse> {
    return await this.inboundRepository.getInbounds(request);
  }
  async createInbound(
    payload: CreateInboundRequest,
  ): Promise<CreateInboundResponse> {
    // validate payload
    if (!payload.ibId || payload.ibId.length === 0) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: 'ibId is required.',
      });
    }

    const ibIdList = [...new Set(payload.ibId)];
    const notYetInbounds =
      await this.inboundRepository.findNotYetInboundByIdList(ibIdList);
    if (ibIdList.length !== notYetInbounds.length) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: 'Some inbounds is already processed or not found.',
      });
    }

    const coDetailIdList = [
      ...new Set(notYetInbounds.map((inbound) => inbound.custOrdDtlId)),
    ];

    // process create inbound
    return this.datasource.transaction(async (manager) => {
      // get current date with format ddMMyyyy
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'ddMMyyyy');

      // Use a transaction and pessimistic locking to ensure that the inbound is not processed by another process
      const lastEntry = await manager.findOne(InboundEntity, {
        where: {
          ibNo: Raw((alias) => `${alias} LIKE :ibNo`, {
            ibNo: `IB${formattedDate}%`,
          }),
        },
        order: { ibNo: 'DESC' },

        // lock the row for update
        // lock: { mode: 'pessimistic_write' },
      });

      // get next sequence number
      const lastNumber = lastEntry ? parseInt(lastEntry.ibNo.substring(10)) : 0;
      const newNumber = lastNumber + 1;
      const newIbNo = `IB${formattedDate}${newNumber
        .toString()
        .padStart(6, '0')}`;

      // update inbound
      await manager.update(
        InboundEntity,
        { ibId: Raw((alias) => `${alias} IN (:...ibId)`, { ibId: ibIdList }) },
        { ibNo: newIbNo, ibDt: currentDate },
      );

      coDetailIdList.forEach(async (coDetailId) => {
        // get total inbound qty by customer order detail
        const totalIbQty = await manager.sum(
          InboundEntity,
          'ib_qty' as 'ibQty',
          {
            custOrdDtlId: coDetailId,
            ibNo: Not(IsNull()),
          },
        );

        // update total inbound qty to customer order detail
        await manager.update(
          CustomerOrderDetailEntity,
          { custOrdDtlId: coDetailId },
          { ibQty: totalIbQty },
        );
      });

      return { ibNo: newIbNo };
    });
  }
}
