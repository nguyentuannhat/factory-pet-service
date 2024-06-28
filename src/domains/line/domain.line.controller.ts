import { Controller, Get, Inject } from '@nestjs/common';
import { LINE_TOKEN_SERVICE, LineService } from './domain.line.service';
import {
  GetLineRequest,
  GetLineResponse,
  LineServiceController,
  LineServiceControllerMethods,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.line.service.v1';

@Controller('line')
@LineServiceControllerMethods()
export class LineController implements LineServiceController {
  constructor(@Inject(LINE_TOKEN_SERVICE) private lineservice: LineService) {}

  @Get('/v1')
  async getLine(payload: GetLineRequest): Promise<GetLineResponse> {
    const a = await this.lineservice.getLine(payload);
    return { line: a };
  }
}
