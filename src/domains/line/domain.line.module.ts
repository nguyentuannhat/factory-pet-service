import { Module } from '@nestjs/common';
import { LineController } from './domain.line.controller';
import { LINE_TOKEN_SERVICE, LineService } from './domain.line.service';

@Module({
  imports: [],
  controllers: [LineController],
  providers: [
    {
      provide: LINE_TOKEN_SERVICE,
      useClass: LineService,
    },
  ],
  exports: [LINE_TOKEN_SERVICE],
})
export class LineModule {}
