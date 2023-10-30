import { IsInt, IsPositive } from 'class-validator';

export class TransactionsQueryDto {
  @IsInt()
  @IsPositive()
  year: number;

  @IsInt()
  @IsPositive()
  month: number;
}