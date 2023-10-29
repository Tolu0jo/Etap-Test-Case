import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsCurrencyCodeValid } from "./custom-vallidator";



export class CreateWalletDto{

@IsString()
@IsNotEmpty()
@IsCurrencyCodeValid()
currency : string

}

export class FundWalletDto{
    @IsString()
    @IsNotEmpty()
    @IsCurrencyCodeValid()
    currency : string

    @IsNumber()
    @IsNotEmpty()
    amount: number
}