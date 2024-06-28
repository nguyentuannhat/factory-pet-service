import {
  CreateCustomerOrderDetailRequest,
  CreateCustomerOrderDetailResponse,
  CustomerOrderDetailServiceController,
  CustomerOrderDetailServiceControllerMethods,
  DeleteCustomerOrderDetailRequest,
  DeleteCustomerOrderDetailResponse,
  GetBarcodeFinishRequest,
  GetBarcodeFinishResponse,
  GetCustomerOrderDetailRequest,
  GetCustomerOrderDetailResponse,
  GetDataExportBarcodeRequest,
  GetDataExportBarcodeResponse,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customerorderdetail.service.v1';
import { Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import {
  CUSTOMERORDERDETAIL_TOKEN_SERVICE,
  CustomerOrderDetailService,
} from './domain.customerOrderDetail.service';

@Controller('customerOrderDetail')
@CustomerOrderDetailServiceControllerMethods()
export class CustomerOrderDetailController
  implements CustomerOrderDetailServiceController
{
  constructor(
    @Inject(CUSTOMERORDERDETAIL_TOKEN_SERVICE)
    private customerOrderDetailService: CustomerOrderDetailService,
  ) {}

  @Get('/v1')
  async getCustomerOrderDetail(
    payload: GetCustomerOrderDetailRequest,
  ): Promise<GetCustomerOrderDetailResponse> {
    return {
      customerorderdetail:
        await this.customerOrderDetailService.getCustomerOrderDetail(payload),
    };
  }
  @Get('/v1')
  async getBarcodeFinish(
    payload: GetBarcodeFinishRequest,
  ): Promise<GetBarcodeFinishResponse> {
    return {
      customerOrderDetailBarcode:
        await this.customerOrderDetailService.getBarcodeFinish(payload),
    };
  }
  @Get('/v1')
  async getDataExportBarcode(
    payload: GetDataExportBarcodeRequest,
  ): Promise<GetDataExportBarcodeResponse> {
    return {
      customerorderdetail:
        await this.customerOrderDetailService.getDataExportBarcode(payload),
    };
  }

  @Post('/v1')
  async createCustomerOrderDetail(
    payload: CreateCustomerOrderDetailRequest,
  ): Promise<CreateCustomerOrderDetailResponse> {
    return await this.customerOrderDetailService.createCustomerOrderDetail(
      payload,
    );
  }

  @Delete('/v1')
  async deleteCustomerOrderDetail(
    payload: DeleteCustomerOrderDetailRequest,
  ): Promise<DeleteCustomerOrderDetailResponse> {
    return await this.customerOrderDetailService.deleteCustomerOrderDetail(
      payload,
    );
  }
}
