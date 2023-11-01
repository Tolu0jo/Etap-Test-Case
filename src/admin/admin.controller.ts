import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Get('transaction/:id')
  async getTransaction(@GetUser() userInfo: IUser, @Param('id') id: string) {
    return await this.adminService.getTransaction(userInfo,id);
  }
  @Get('approved-transaction')
  async getApprovedTransactions(@GetUser() userInfo: IUser) {
    return await this.adminService.getAllApprovedTransactions(userInfo);
  }
  @Get('pending-transaction')
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
  @Get('payment-summary')
  async getTransactionsByMonth(
    @GetUser() userInfo: IUser,
  ) {
    return await this.adminService.getMonthlyPaymentSummaries( userInfo);
  }
  @Get('payments')
  async getPayments(@GetUser() userInfo: IUser) {
    return await this.adminService.getPaymentSumarries(userInfo);
  }
  @Get('payment/:id')
  async getPayment(@GetUser() userInfo: IUser, @Param('id') id: string) {
  return await this.adminService.getPayment(userInfo, id);
  }
}
