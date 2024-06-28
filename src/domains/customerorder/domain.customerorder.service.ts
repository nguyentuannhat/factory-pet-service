import { Inject, Injectable } from '@nestjs/common';
import {
  ICustomerOrderDetailRepository,
  I_CUSTOMERORDERDETAIL_REPOSITORY,
} from 'src/infrastructure/postgresql/repositories/customerOrderDetail.repository';
import { GetCustomerOrderRequest } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customerorder.service.v1';
import { CustomerOrderDTO } from './domain.customerorder.dto';

export const CUSTOMERORDER_TOKEN_SERVICE =
  'USER MODULE CUSTOMERORDER_TOKEN_SERVICE';

@Injectable()
export class CustomerOrderService {
  constructor(
    @Inject(I_CUSTOMERORDERDETAIL_REPOSITORY)
    private customerOrderDetailRepository: ICustomerOrderDetailRepository,
  ) {}

  async getCustomerOrder(
    payload: GetCustomerOrderRequest,
  ): Promise<CustomerOrderDTO[]> {
    return await this.customerOrderDetailRepository.getCustomerOrder(payload);
  }
}
