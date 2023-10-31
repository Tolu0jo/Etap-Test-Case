import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { RepositoryService } from 'src/Repository/repository.service';
import { PayStackService } from 'src/paystack/payStack.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, RepositoryService,PayStackService],
})
export class UserModule {}
