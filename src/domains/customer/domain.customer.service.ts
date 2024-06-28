import { GetCustomersRequest } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customer.service.v1';
import { Inject, Injectable } from '@nestjs/common';
import {
  I_CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from 'src/infrastructure/postgresql/repositories/customer.repository';

export const CUSTOMER_TOKEN_SERVICE = 'USER MODULE CUSTOMER_TOKEN_SERVICE';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(I_CUSTOMER_REPOSITORY) private custRepo: ICustomerRepository,
  ) {}

  async getCustomers(request: GetCustomersRequest) {
    return this.custRepo.getCustomers(request);
  }
}
