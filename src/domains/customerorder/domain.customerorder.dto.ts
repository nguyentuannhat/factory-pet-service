import { IsDate, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CustomerOrderDTO {
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
}
