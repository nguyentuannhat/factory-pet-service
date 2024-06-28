import { Module } from '@nestjs/common';
import { CustomerController } from './domain.customer.controller';
import {
  CUSTOMER_TOKEN_SERVICE,
  CustomerService,
} from './domain.customer.service';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [
    {
      provide: CUSTOMER_TOKEN_SERVICE,
      useClass: CustomerService,
    },
  ],
  exports: [CUSTOMER_TOKEN_SERVICE],
})
export class CustomerModule {}
