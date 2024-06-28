import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CustomerOrderDetailDTO {
  @IsString()
  ordNo: string;

  @IsString()
  custEngNm: string;

  @IsDate()
  ordDt: Date;

  @IsString()
  shipTo: string;

  @Transform((value) => (value === null ? 0 : value))
  @IsNumber()
  ordQty: number;

  @Transform((value) => (value === null ? 0 : value))
  @IsNumber()
  fnQty: number;

  @Transform((value) => (value === null ? 0 : value))
  @IsNumber()
  packingQty: number;

  @Transform((value) => (value === null ? 0 : value))
  @IsNumber()
  ibQty: number;

  @Transform((value) => (value === null ? 0 : value))
  @IsNumber()
  obQty: number;

  @IsString()
  skuId: string;

  @IsString()
  prodNm: string;

  @IsDate()
  shipDt: Date;

  @Transform((value) => (value === null ? 0 : value))
  @IsDate()
  unitPrice: number;

  @Transform((value) => (value === null ? 0 : value))
  @IsNumber()
  amount: number;

  @IsString()
  barcode: string;

  @IsNumber()
  custOrdDtlId: number;
}

export class CreateCustomerOrderDetailDTO {
  @IsString()
  coCd: string;

  @IsString()
  ordNo: string;

  @IsString()
  skuId: string;

  @IsNumber()
  ordQty: number | null;

  @IsDate()
  shipDt: Date | null;

  @IsNumber()
  unitPrice: number | null;

  @IsNumber()
  amount: number | null;
}
