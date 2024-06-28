import { Module } from '@nestjs/common';
import { CustomerOrderDetailController } from './domain.customerorderdetail.controller';
import {
  CUSTOMERORDERDETAIL_TOKEN_SERVICE,
  CustomerOrderDetailService,
} from './domain.customerOrderDetail.service';

@Module({
  imports: [],
  controllers: [CustomerOrderDetailController],
  providers: [
    {
      provide: CUSTOMERORDERDETAIL_TOKEN_SERVICE,
      useClass: CustomerOrderDetailService,
    },
  ],
  exports: [CUSTOMERORDERDETAIL_TOKEN_SERVICE],
})
export class CustomerOrderDetailModule {}
