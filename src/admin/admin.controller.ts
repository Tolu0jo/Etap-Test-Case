import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

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
  async approveTransaction(@Param('txnId') txnId: string, userInfo: IUser) {
    return await this.adminService.approveTransaction(txnId, userInfo);
  }
}
