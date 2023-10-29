import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferDto{
    @IsString()
    @IsNotEmpty()
    recieverWalletId:string;

    @IsNumber()
    @IsNotEmpty()
    amount:number;
}