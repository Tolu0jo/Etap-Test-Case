import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { TransferDto } from "./dto/transfer.dto";

@Controller("transfer")
@UseGuards(AuthGuard("jwt"))
export class TransactionController{
constructor(private transactionService:TransactionService){}

@Post(":walletId")
async transfer(@GetUser()userInfo:IUser,
@Param("walletId") senderWalletId:string,
transferDto:TransferDto){
return await this.transactionService.transfer(userInfo, senderWalletId, transferDto);
}  
}