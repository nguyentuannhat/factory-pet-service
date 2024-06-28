import { Module } from '@nestjs/common';
import { OutboundDetailController } from './domain.outbounddetail.controller';
import {
  OUTBOUND_DETAIL_TOKEN_SERVICE,
  OutboundDetailService,
} from './domain.outbounddetail.service';

@Module({
  imports: [],
  controllers: [OutboundDetailController],
  providers: [
    {
      provide: OUTBOUND_DETAIL_TOKEN_SERVICE,
      useClass: OutboundDetailService,
    },
  ],
  exports: [OUTBOUND_DETAIL_TOKEN_SERVICE],
})
export class OutboundDetailModule {}
