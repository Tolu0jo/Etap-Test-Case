import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './wallet/wallet.module';
import { AdminModule } from './admin/admin.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from './repository/repository.module';
import { PaystackModule } from './paystack/payStack.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    RepositoryModule,
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PaystackModule,
  ],
})
export class AppModule {}
