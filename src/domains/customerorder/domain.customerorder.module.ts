import { Module } from '@nestjs/common';
import { CustomerOrderController } from './domain.customerorder.controller';
import {
  CUSTOMERORDER_TOKEN_SERVICE,
  CustomerOrderService,
} from './domain.customerorder.service';

@Module({
  imports: [],
  controllers: [CustomerOrderController],
  providers: [
    {
      provide: CUSTOMERORDER_TOKEN_SERVICE,
      useClass: CustomerOrderService,
    },
  ],
  exports: [CUSTOMERORDER_TOKEN_SERVICE],
})
export class CustomerOrderModule {}
