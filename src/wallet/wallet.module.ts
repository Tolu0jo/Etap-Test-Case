import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { UserJwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { RepositoryService } from 'src/Repository/repository.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, RepositoryService],
})
export class UserModule {}
