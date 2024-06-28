import { Module } from '@nestjs/common';
import { InboundController } from './domain.inbound.controller';
import {
  INBOUND_TOKEN_SERVICE,
  InboundService,
} from './domain.inbound.service';

@Module({
  imports: [],
  controllers: [InboundController],
  providers: [
    {
      provide: INBOUND_TOKEN_SERVICE,
      useClass: InboundService,
    },
  ],
  exports: [INBOUND_TOKEN_SERVICE],
})
export class InboundModule {}
