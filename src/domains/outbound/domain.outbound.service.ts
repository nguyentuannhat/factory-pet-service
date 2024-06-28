import {
  CreateOutboundRequest,
  CreateOutboundResponse,
  GetOutboundsRequest,
  GetOutboundsResponse,
  UpdateOutboundRequest,
  UpdateOutboundResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.outbound.service.v1';
import { Inject, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { OutboundEntity } from 'src/infrastructure/postgresql/entities';
import { OutboundStatus } from 'src/infrastructure/postgresql/entities/outbound.entity';
import { I_OUTBOUND_REPOSITORY } from 'src/infrastructure/postgresql/repositories/outbound.repository';
import {
  IOutboundDetailRepository,
  I_OUTBOUND_DETAIL_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/outboundDetail.repository';
import { DataSource, Raw } from 'typeorm';
import { IOutboundRepository } from './../../infrastructure/postgresql/repositories/outbound.repository';
import { RpcException } from '@nestjs/microservices';
import { CustomExceptionDetails } from 'src/infrastructure/interface/customExceptionDetails.interface';
import { StatusCode } from 'src/infrastructure/interface/gRPCStatus';
import { StatusMessage } from 'src/infrastructure/interface/gRPCMessage';

export const OUTBOUND_TOKEN_SERVICE = 'USER MODULE OUTBOUND_TOKEN_SERVICE';

@Injectable()
export class OutboundService {
  constructor(
    @Inject(I_OUTBOUND_REPOSITORY)
    private outboundRepository: IOutboundRepository,
    @Inject(I_OUTBOUND_DETAIL_REPOSITORY)
    private outboundDetailRepository: IOutboundDetailRepository,
    private datasource: DataSource,
  ) {}

  async getOutbounds(
    request: GetOutboundsRequest,
  ): Promise<GetOutboundsResponse> {
    return await this.outboundRepository.getOutbounds(request);
  }

  async createOrUpdateOutbound(
    request: CreateOutboundRequest,
  ): Promise<CreateOutboundResponse> {
    const { requestNo } = request;
    let ob = await this.outboundRepository.findByRequestNo(requestNo);
    if (ob?.status === OutboundStatus.DONE) {
      return { obNo: ob.obNo };
    }
    //create ob
    await this.datasource.transaction(async (manager) => {
      // remove all old obdtl by requestNo
      await this.outboundDetailRepository.batchDeleteByRequestNo(ob?.requestNo);
      if (!ob) {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'ddMMyyyy');
        // Use a transaction and pessimistic locking to ensure that the inbound is not processed by another process
        const lastEntry = await manager.findOne(OutboundEntity, {
          where: {
            obNo: Raw((alias) => `${alias} LIKE :obNo`, {
              obNo: `OB${formattedDate}%`,
            }),
          },
          order: { obNo: 'DESC' },
        });
        const lastNumber = lastEntry
          ? parseInt(lastEntry.obNo.substring(10))
          : 0;
        const newNumber = lastNumber + 1;
        const newObNo = `OB${formattedDate}${newNumber
          .toString()
          .padStart(6, '0')}`;
        let requestQty = 0;
        let stockQty = 0;
        let obQty = 0;
        request.obDetails.forEach((obDetail) => {
          requestQty += obDetail.requestQty;
          stockQty += obDetail.stockQty;
          obQty += obDetail.obQty;
        });
        ob = await this.outboundRepository.create({
          ...request,
          obNo: newObNo,
          obDt: new Date(),
          requestQty,
          stockQty,
          obQty,
          obDtls: request.obDetails,
        });
        await this.outboundRepository.getRepository().save(ob);
      } else {
        //update ob
        let requestQty = 0;
        let stockQty = 0;
        let obQty = 0;
        request.obDetails.forEach((obDetail) => {
          requestQty += obDetail.requestQty;
          stockQty += obDetail.stockQty;
          obQty += obDetail.obQty;
        });
        await this.outboundRepository.updateById(ob.id, {
          ...request,
          requestQty,
          stockQty,
          obQty,
        });
      }

      // create ob detail
      const obDetails = await this.outboundDetailRepository.batchCreate(
        request.obDetails,
      );
      await this.outboundDetailRepository.getRepository().save(obDetails);
    });
    return { obNo: ob.obNo };
  }

  async updateStatusRemark(
    request: UpdateOutboundRequest,
  ): Promise<UpdateOutboundResponse> {
    const { requestNo, remark } = request; //input field
    const ob = await this.outboundRepository.findByRequestNo(requestNo); //db
    try {
      ob.remark = remark;
      ob.status = OutboundStatus.DONE;
      const result = await this.outboundRepository.getRepository().save(ob);
      const isUpdated = !!result;
      // TODO: Call API logitic confirm
      return { isUpdated };
    } catch (error) {
      throw new RpcException({
        code: StatusCode.INVALID_ARGUMENT,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: StatusCode[StatusCode.INVALID_ARGUMENT],
          details: StatusMessage.REQUEST_NO_NOT_FOUND,
        }),
      });
    }
  }
}
