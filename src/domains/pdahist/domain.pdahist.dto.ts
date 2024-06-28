import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PDAHistDTO {
  @IsString()
  operationType: string;

  @IsDate()
  creDt: Date;

  @IsNumber()
  qty: number;

  @IsString()
  creUsrId: string;

  @IsNumber()
  lineId: number;
}

export class PDAHistInput {
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsString()
  @IsNotEmpty()
  operationType: string;

  @IsString()
  @IsNotEmpty()
  quality: string;

  @IsString()
  @IsNotEmpty()
  creUsrId: string;

  @IsNumber()
  @IsNotEmpty()
  lineId: number;

  @IsString()
  @IsNotEmpty()
  lineNm: string;
}
