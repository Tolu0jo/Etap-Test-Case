import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { v4 as uuidv4 } from 'uuid';
import { WalletDto } from './dto/wallet.dto';
@Injectable()
export class WalletService {
  constructor(private repositoryService: RepositoryService) {}

  async createWallet(user: IUser, walletDto: WalletDto) {
    try {
      const { id, isAdmin } = user;
      const { currency } = walletDto;
      if (isAdmin) {
        throw new ConflictException('Admin cannot create wallet');
      } else {
        const wallets = await this.repositoryService.wallet.findMany({
          where: { userId: id },
        });
        const isExist = wallets.find((wallet) => wallet.currency === currency);
        if (isExist) {
          throw new ConflictException(`Wallet with ${currency} already exists`);
        } else {
          const wallet = await this.repositoryService.wallet.create({
            data: {
              id: uuidv4(),
              currency,
              userId: id,
            },
          });
          return wallet;
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
