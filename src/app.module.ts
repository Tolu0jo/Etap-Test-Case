import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { WalletModule } from './wallet/wallet.module';


@Module({
  imports: [AuthModule, UserModule, AdminModule, WalletModule],
})
export class AppModule {}
