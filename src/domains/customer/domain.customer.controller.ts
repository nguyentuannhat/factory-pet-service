import { Controller, Get, Inject } from '@nestjs/common';
import {
  CustomerServiceController,
  CustomerServiceControllerMethods,
  GetCustomersRequest,
  GetCustomersResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customer.service.v1';
import {
  CUSTOMER_TOKEN_SERVICE,
  CustomerService,
} from './domain.customer.service';

@Controller('customer')
@CustomerServiceControllerMethods()
export class CustomerController implements CustomerServiceController {
  constructor(
    @Inject(CUSTOMER_TOKEN_SERVICE)
    private customerService: CustomerService,
  ) {}

  @Get('/v1')
  async getCustomers(
    request: GetCustomersRequest,
  ): Promise<GetCustomersResponse> {
    return await this.customerService.getCustomers(request);
  }
}
