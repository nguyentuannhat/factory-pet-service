// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AbstractRepository, IRepository } from './abstract.repository';
import {
  CustomerOrderDetailEntity,
  InboundEntity,
  PDAHistEntity,
} from '../entities';
import {
  CreatePDAHistoryRequest,
  CreatePDAHistoryResponse,
  CreatePackingConfirmRequest,
  CreatePackingConfirmResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.pdahis.service.v1';
import { RpcException } from '@nestjs/microservices';
import { format } from 'date-fns';
import { CustomExceptionDetails } from 'src/infrastructure/interface/customExceptionDetails.interface';
import { StatusCode } from './../../interface/gRPCStatus';
import { StatusMessage } from 'src/infrastructure/interface/gRPCMessage';
import { MES_PDA_HIS_NAME } from 'src/infrastructure/postgresql/entities/constants';

export const I_PDA_HIST_REPOSITORY = 'I_PDA_HIST_REPOSITORY';

export interface IPDAHistRepository extends IRepository<PDAHistEntity> {
  createPADHist: (
    payload: CreatePDAHistoryRequest,
  ) => Promise<CreatePDAHistoryResponse>;
  createPackingConfirm(
    packingData: CreatePackingConfirmRequest,
  ): Promise<CreatePackingConfirmResponse>;
}

@Injectable()
export class PDAHistRepository
  extends AbstractRepository<PDAHistEntity>
  implements IPDAHistRepository
{
  constructor(
    @InjectRepository(PDAHistEntity)
    private readonly pdaRepository: Repository<PDAHistEntity>,
    @InjectRepository(CustomerOrderDetailEntity)
    private readonly custOrdDtlRepository: Repository<CustomerOrderDetailEntity>,
    @InjectRepository(InboundEntity)
    private readonly inboundRepository: Repository<InboundEntity>,
  ) {
    super(pdaRepository);
  }

  async createPADHist(
    payload: CreatePDAHistoryRequest,
  ): Promise<CreatePDAHistoryResponse> {
    const newItem = this.create(payload);
    const custOrdDtl = await this.custOrdDtlRepository.findOne({
      where: { barcode: payload.barcode },
    });

    if (custOrdDtl === null) {
      throw new RpcException({
        code: StatusCode.NOT_FOUND,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: StatusCode[StatusCode.NOT_FOUND],
          details: StatusMessage.BARCODE_NOT_FOUND,
        }),
      });
    } else {
      const waitingQty = custOrdDtl.ordQty - custOrdDtl.fnQty;
      this.checkWaitingQty(waitingQty, newItem.qty);

      newItem.custOrdDtlId = custOrdDtl.custOrdDtlId;
      newItem.coCd = custOrdDtl.coCd;

      const currentDate = new Date();
      const dateFormat = format(currentDate, 'ddMMyyyy');

      const seq = await this.pdaRepository.findOne({
        where: {
          packingIdSeq: Like('FS' + dateFormat + '%'),
          operationType: 'FNS',
        },
        order: { creDt: 'DESC' },
      });

      if (newItem.operationType === 'FNS') {
        let sequence = '000001';
        if (seq && seq.packingIdSeq.substring(2, 10) === dateFormat) {
          sequence = (parseInt(seq.packingIdSeq.substring(10)) + 1)
            .toString()
            .padStart(6, '0');
        }
        newItem.packingIdSeq = 'FS' + dateFormat + sequence;
      }

      const updatePDAHist = await newItem.save();
      if (!updatePDAHist) {
        throw new RpcException({
          code: StatusCode.SYSTEM_ERROR,
          message: JSON.stringify(<CustomExceptionDetails>{
            type: StatusCode[StatusCode.SYSTEM_ERROR],
            details: StatusMessage.SYSTEM_ERROR,
          }),
        });
      }
      let fnQtyTotal: number = 0;
      if (
        (newItem.operationType === 'FNS' || newItem.operationType === 'PKG') &&
        newItem.quality === 'Qualified'
      ) {
        // calculate finish quantity = sum(of finish qualified qty) - sum( of packing defect qty)
        const result = await this.getRepository()
          .createQueryBuilder()
          .select(
            `SUM(CASE WHEN ${MES_PDA_HIS_NAME.opTp} = :fnType AND ${MES_PDA_HIS_NAME.qlty} = :qualified THEN qty ELSE 0 END) - SUM(CASE WHEN ${MES_PDA_HIS_NAME.opTp} = :pkgType AND ${MES_PDA_HIS_NAME.qlty} = :defected THEN qty ELSE 0 END)`,
            'total',
          )
          .setParameters({
            fnType: 'FNS',
            pkgType: 'PKG',
            defected: 'Defect',
            qualified: 'Qualified',
          })
          .where(`${MES_PDA_HIS_NAME.custOrdDtlId} = :id`, {
            id: newItem.custOrdDtlId,
          })
          .getRawOne();

        if (result === null) {
          fnQtyTotal = newItem.qty;
        } else {
          fnQtyTotal = result['total'];
        }

        custOrdDtl.fnQty = fnQtyTotal;

        try {
          await this.custOrdDtlRepository.save(custOrdDtl);
        } catch (error) {
          throw new RpcException({
            code: StatusCode.SYSTEM_ERROR,
            message: JSON.stringify(<CustomExceptionDetails>{
              type: StatusCode[StatusCode.SYSTEM_ERROR],
              details: StatusMessage.SYSTEM_ERROR,
            }),
          });
        }
      }

      return updatePDAHist;
    }
  }

  async createPackingConfirm(
    packingData: CreatePackingConfirmRequest,
  ): Promise<CreatePackingConfirmResponse> {
    const currentDate = format(new Date(), 'ddMMyyyy');
    // Initialize the variable SeqPackingId
    let numberSeqPackingId = 0,
      lastSixDigits = 0,
      totalFinish = 0,
      totalPacking = 0;
    const newItem = this.pdaRepository.create(packingData);
    const newItemInbound = this.inboundRepository.create(packingData);
    // Initialize the variable totalFinish

    const custOrdDtlList = await this.custOrdDtlRepository.findOne({
      where: {
        barcode: packingData.barcode,
      },
    });

    if (custOrdDtlList === null) {
      throw new RpcException({
        code: StatusCode.NOT_FOUND,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: StatusCode[StatusCode.NOT_FOUND],
          details: StatusMessage.BARCODE_NOT_FOUND,
        }),
      });
    }

    const waitingQty = custOrdDtlList.fnQty - custOrdDtlList.packingQty;
    this.checkWaitingQty(waitingQty, newItem.qty);

    newItem.custOrdDtlId = custOrdDtlList.custOrdDtlId;
    newItem.coCd = custOrdDtlList.coCd;
    if (
      packingData.operationType === 'PKG' &&
      packingData.quality === 'Qualified'
    ) {
      newItemInbound.custOrdDtlId = custOrdDtlList.custOrdDtlId;
      newItemInbound.coCd = custOrdDtlList.coCd;
      newItemInbound.ibQty = packingData.qty;
      newItemInbound.updUsrId = packingData.creUsrId;
      await newItemInbound.save();
    }
    const seq = await this.pdaRepository.findOne({
      where: {
        packingIdSeq: Like('Pack' + currentDate + '%'),
        operationType: 'PKG',
      },
      order: { creDt: 'DESC' },
    });
    if (seq) lastSixDigits = parseInt(seq.packingIdSeq.slice(-6));
    if (lastSixDigits > numberSeqPackingId) {
      numberSeqPackingId = lastSixDigits;
    }
    numberSeqPackingId++;
    newItem.packingIdSeq =
      'Pack' + currentDate + String(numberSeqPackingId).padStart(6, '0');
    const createPDAHist = await newItem.save();

    if (!createPDAHist) {
      throw new RpcException({
        code: StatusCode.SYSTEM_ERROR,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: StatusCode[StatusCode.SYSTEM_ERROR],
          details: StatusMessage.SYSTEM_ERROR,
        }),
      });
    }

    const listFinishHis = await this.findAll({
      where: {
        custOrdDtlId: custOrdDtlList.custOrdDtlId,
      },
    });
    listFinishHis.forEach((item) => {
      if (item.operationType === 'FNS' && item.quality === 'Qualified') {
        totalFinish += Number(item.qty); // If it's Qualified of Finish, add to total
      } else if (item.operationType === 'PKG' && item.quality === 'Defect') {
        totalFinish -= Number(item.qty); // If it's Defect of Packing, subtract from total
      }
      if (item.operationType === 'PKG' && item.quality === 'Qualified')
        totalPacking += Number(item.qty);
    });

    try {
      await this.custOrdDtlRepository
        .createQueryBuilder()
        .update(CustomerOrderDetailEntity)
        .set({
          fnQty: totalFinish,
          packingQty: totalPacking,
        })
        .where(`${MES_PDA_HIS_NAME.custOrdDtlId} = :id`, {
          id: newItem.custOrdDtlId,
        })
        .execute();
    } catch (error) {
      throw new RpcException({
        code: StatusCode.SYSTEM_ERROR,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: StatusCode[StatusCode.SYSTEM_ERROR],
          details: StatusMessage.SYSTEM_ERROR,
        }),
      });
    }

    return {
      id: createPDAHist.packingIdSeq,
    };
  }

  private checkWaitingQty(waitingQty: number, qty: number) {
    if (waitingQty <= 0) {
      throw new RpcException({
        code: StatusCode.INVALID_ARGUMENT,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: StatusCode[StatusCode.INVALID_ARGUMENT],
          details: StatusMessage.WAITING_QTY_INVALID,
        }),
      });
    }

    if (qty > waitingQty) {
      throw new RpcException({
        code: StatusCode.INVALID_ARGUMENT,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: StatusCode[StatusCode.INVALID_ARGUMENT],
          details: StatusMessage.FINISH_QTY_INVALID,
        }),
      });
    }
  }
}
