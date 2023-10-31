import {IsNotEmpty,IsString } from 'class-validator';

export class TransactionsQueryDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  month: string;
}