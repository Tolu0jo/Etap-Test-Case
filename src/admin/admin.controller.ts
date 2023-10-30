import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { TransactionsQueryDto } from './dto/transaction-query.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('transaction')
  async getTransactions(@GetUser() userInfo: IUser) {
    return await this.adminService.getAllTransactions(userInfo);
  }
  @Get('approved')
  async getApprovedTransactions(@GetUser() userInfo: IUser) {
    return await this.adminService.getAllApprovedTransactions(userInfo);
  }
  @Get('pending')
  async getPendingTransactions(@GetUser() userInfo: IUser) {
    return await this.adminService.getAllPendingTransactions(userInfo);
  }
  @Patch('approve-transaction/:txnId')
  async approveTransaction(
    @Param('txnId') txnId: string,
    @GetUser() userInfo: IUser,
  ) {
    return await this.adminService.approveTransaction(txnId, userInfo);
  }
  @Get('payment-summary' )
 getTransactionsByMonth(@Query() query: TransactionsQueryDto,
@GetUser() userInfo: IUser,) {
  return this.adminService.getTransactionsByMonth(query,userInfo);
}
}
