import { Module } from '@nestjs/common';
import {
  PDAHistService,
  PDA_HIST_TOKEN_SERVICE,
} from './domain.pdahist.service';
import { PDAHistController } from './domain.pdahist.controller';

@Module({
  imports: [],
  controllers: [PDAHistController],
  providers: [
    {
      provide: PDA_HIST_TOKEN_SERVICE,
      useClass: PDAHistService,
    },
  ],
  exports: [PDA_HIST_TOKEN_SERVICE],
})
export class PDAHistModule {}
