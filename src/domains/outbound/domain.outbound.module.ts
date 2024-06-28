import { Module } from '@nestjs/common';
import { OutboundController } from './domain.outbound.controller';
import {
  OUTBOUND_TOKEN_SERVICE,
  OutboundService,
} from './domain.outbound.service';

@Module({
  imports: [],
  controllers: [OutboundController],
  providers: [
    {
      provide: OUTBOUND_TOKEN_SERVICE,
      useClass: OutboundService,
    },
  ],
  exports: [OUTBOUND_TOKEN_SERVICE],
})
export class OutboundModule {}
