import {
  CreateCustomerOrderDetailRequest,
  CreateCustomerOrderDetailResponse,
  DeleteCustomerOrderDetailRequest,
  DeleteCustomerOrderDetailResponse,
  GetBarcodeFinishRequest,
  GetCustomerOrderDetailRequest,
  GetDataExportBarcodeRequest,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customerorderdetail.service.v1';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { keys, set } from 'lodash';
import {
  ICustomerOrderDetailRepository,
  I_CUSTOMERORDERDETAIL_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/customerOrderDetail.repository';
import { CustomerOrderDetailDTO } from './domain.customerorderdetail.dto';
import { FindOptionsWhere } from 'typeorm';
import { CustomerOrderDetailEntity } from 'src/infrastructure/postgresql/entities';
import { CustomExceptionDetails } from 'src/infrastructure/interface/customExceptionDetails.interface';

export const CUSTOMERORDERDETAIL_TOKEN_SERVICE =
  'USER MODULE CUSTOMERORDERDETAIL_TOKEN_SERVICE';

@Injectable()
export class CustomerOrderDetailService {
  constructor(
    @Inject(I_CUSTOMERORDERDETAIL_REPOSITORY)
    private customerOrderDetailRepository: ICustomerOrderDetailRepository,
  ) {}

  async getCustomerOrderDetail(
    payload: GetCustomerOrderDetailRequest,
  ): Promise<CustomerOrderDetailDTO[]> {
    return await this.customerOrderDetailRepository.getCustomerOrderDetail(
      payload,
    );
  }
  async getBarcodeFinish(
    payload: GetBarcodeFinishRequest,
  ): Promise<CustomerOrderDetailDTO[]> {
    return await this.customerOrderDetailRepository.getBarcodeFinish(payload);
  }

  async getDataExportBarcode(
    payload: GetDataExportBarcodeRequest,
  ): Promise<CustomerOrderDetailDTO[]> {
    return await this.customerOrderDetailRepository.getDataExportBarcode(
      payload,
    );
  }

  async createCustomerOrderDetail(
    payload: CreateCustomerOrderDetailRequest,
  ): Promise<CreateCustomerOrderDetailResponse> {
    const { item, items } = payload;
    const result = {
      id: null,
      ids: [],
    };
    try {
      if (item && Object.keys(item).length) {
        // check if customer order detail exists
        const found =
          await this.customerOrderDetailRepository.isCustomerOrderDetailExist(
            item,
          );
        if (!found) {
          // create new customer order detail
          const coDetailEntity =
            this.customerOrderDetailRepository.create(item);
          const coDetailEntityDB = await coDetailEntity.save();
          result.id = coDetailEntityDB.custOrdDtlId;
        } else {
          // update customer order detail
          keys(item).forEach((key: string) => {
            set(found, key, item[key]);
          });

          await found.save();
          result.id = found.custOrdDtlId;
        }
        return result;
      } else if (items && items.length) {
        // First check if any of the items already exist
        const where: FindOptionsWhere<CustomerOrderDetailEntity>[] = [];
        items.forEach((item) => {
          const { coCd, ordNo, skuId } = item;
          where.push({
            coCd: coCd,
            ordNo: ordNo,
            skuId: skuId,
          });
        });
        // get all existing items which match the condition
        const existItems = await this.customerOrderDetailRepository
          .getRepository()
          .find({
            where,
          });
        const updateEntities: CustomerOrderDetailEntity[] = [];
        const newEntities: CustomerOrderDetailEntity[] = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          // Update existing items
          const foundItem = existItems.find(
            (existItem) =>
              existItem.coCd === item.coCd &&
              existItem.ordNo === item.ordNo &&
              existItem.skuId === item.skuId,
          );
          if (foundItem) {
            // Collect to update list
            keys(item).forEach((key: string) => {
              set(foundItem, key, item[key]);
            });
            updateEntities.push(foundItem);
          } else {
            // Collect to new list
            newEntities.push(new CustomerOrderDetailEntity(item));
          }
        }
        if (updateEntities.length) {
          await this.customerOrderDetailRepository
            .getRepository()
            .save(updateEntities);
          result.ids.push(...updateEntities.map((item) => item.custOrdDtlId));
        }
        if (newEntities.length) {
          const newIds = await this.customerOrderDetailRepository
            .getRepository()
            .insert(newEntities);
          result.ids.push(
            ...newIds.identifiers.map((item) => item.custOrdDtlId),
          );
        }
      }
      return {
        ids: result.ids,
      };
    } catch (error) {
      throw new RpcException({
        code: error.code,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: 'error',
          details: error.message,
        }), // note here (payload is stringified)
      });
    }
  }

  async deleteCustomerOrderDetail(
    payload: DeleteCustomerOrderDetailRequest,
  ): Promise<DeleteCustomerOrderDetailResponse> {
    const { item, items } = payload;
    const result = {
      id: null,
      ids: [],
    };
    try {
      if (item && Object.keys(item).length) {
        // check if customer order detail exists
        const found =
          await this.customerOrderDetailRepository.isCustomerOrderDetailExist(
            item,
          );
        if (!found) {
          throw new RpcException({
            code: HttpStatus.NOT_FOUND,
            message: 'Customer Order Detail not found',
          });
        }

        // delete customer order detail
        result.id = found.custOrdDtlId;
        await found.remove();
        return result;
      } else if (items && items.length) {
        // First check if any of the items already exist
        const where: FindOptionsWhere<CustomerOrderDetailEntity>[] = [];
        items.forEach((item) => {
          const { coCd, ordNo, skuId } = item;
          where.push({
            coCd: coCd,
            ordNo: ordNo,
            skuId: skuId,
          });
        });
        // get all existing items which match the condition
        const existItems = await this.customerOrderDetailRepository
          .getRepository()
          .find({
            where,
          });
        if (!existItems.length) {
          throw new RpcException({
            code: HttpStatus.NOT_FOUND,
            message: 'Customer Order Detail not found',
          });
        }
        const ids = existItems.map((item) => item.custOrdDtlId);
        await this.customerOrderDetailRepository.getRepository().delete(ids);
        return {
          ids,
        };
      }
    } catch (error) {
      throw new RpcException({
        code: error.code,
        message: JSON.stringify(<CustomExceptionDetails>{
          type: 'error',
          details: error.message,
        }), // note here (payload is stringified)
      });
    }
  }
}
