import {
  CustomerOrderServiceController,
  CustomerOrderServiceControllerMethods,
  GetCustomerOrderRequest,
  GetCustomerOrderResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customerorder.service.v1';
import { Controller, Get, Inject } from '@nestjs/common';
import {
  CUSTOMERORDER_TOKEN_SERVICE,
  CustomerOrderService,
} from './domain.customerorder.service';

@Controller('customerorder')
@CustomerOrderServiceControllerMethods()
export class CustomerOrderController implements CustomerOrderServiceController {
  constructor(
    @Inject(CUSTOMERORDER_TOKEN_SERVICE)
    private customerOrderService: CustomerOrderService,
  ) {}

  @Get('/v1')
  async getCustomerOrder(
    payload: GetCustomerOrderRequest,
  ): Promise<GetCustomerOrderResponse> {
    return {
      customerorder: await this.customerOrderService.getCustomerOrder(payload),
    };
  }
}
