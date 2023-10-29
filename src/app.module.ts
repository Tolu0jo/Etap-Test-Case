import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { TransactionModule } from './transaction/transaction.module';



@Module({
  imports: [AuthModule, UserModule, AdminModule, TransactionModule],
})
export class AppModule {}
