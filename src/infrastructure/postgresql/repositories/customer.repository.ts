import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerOrderDetailEntity } from '../entities';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  GetCustomersRequest,
  GetCustomersResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customer.service.v1';

export const I_CUSTOMER_REPOSITORY = 'I_CUSTOMER_REPOSITORY';

export interface ICustomerRepository {
  getCustomers: (payload: GetCustomersRequest) => Promise<GetCustomersResponse>;
}

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrderDetailEntity)
    private coDetailRepo: Repository<CustomerOrderDetailEntity>,
  ) {}

  async getCustomers(payload: GetCustomersRequest) {
    const query = `
    select co_cd, cust_cd, cust_eng_nm, cust_locl_nm from mrp_cust mc WHERE mc.co_cd = '${payload.coCd}';
    `;
    const result = await this.coDetailRepo.query(query);
    const mapped = result.map((item: ObjectLiteral) => {
      return {
        coCd: item.co_cd,
        custCd: item.cust_cd,
        custLoclNm: item.cust_locl_nm,
        custEngNm: item.cust_eng_nm,
      };
    });
    return { customers: mapped };
  }
}
