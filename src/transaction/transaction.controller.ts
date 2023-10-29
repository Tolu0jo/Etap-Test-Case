import { Controller } from "@nestjs/common";
import { TransactionService } from "./transaction.service";

@Controller("wallet")
export class WalletController{
constructor(private transactionService:TransactionService){}

}