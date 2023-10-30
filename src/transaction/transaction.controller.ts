import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { TransferDto } from './dto/transfer.dto';

@Controller('transfer')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post(':walletId')
  async transfer(
    @GetUser() userInfo: IUser,
    @Param('walletId') senderWalletId: string,
    @Body() transferDto: TransferDto,
  ) {
    return await this.transactionService.transfer(
      userInfo,
      senderWalletId,
      transferDto,
    );
  }

  @Get("transactions")
  async getAllTransactions(@GetUser() userInfo: IUser) {
    return await this.transactionService.getTransactions(userInfo);
  }
  @Get(':txnId')
  async getAllTransaction(
    @GetUser() userInfo: IUser,
    @Param('txnId') txnId: string,
  ) {
    return await this.transactionService.getTransaction(txnId, userInfo);
  }

  @Get('pending')
  async getPendingTransactions(@GetUser() userInfo: IUser) {
    return await this.transactionService.getPendingTransactions(userInfo);
  }
  @Get('approved')
  async getApprovedTransactions(@GetUser() userInfo: IUser) {
    return await this.transactionService.getApprovedTransactions(userInfo);
  }
}
