import { IsNotEmpty, IsString } from "class-validator";


export class WalletDto{

@IsString()
@IsNotEmpty()
currency : string



}