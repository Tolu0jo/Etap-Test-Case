import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { v4 as uuidv4 } from 'uuid';
import { FundWalletDto, CreateWalletDto } from './dto/wallet.dto';
import { NotFoundError } from 'rxjs';
@Injectable()
export class WalletService {
  constructor(private repositoryService: RepositoryService) {}

  async createWallet(user: IUser, walletDto: CreateWalletDto) {
    try {
      const { id, isAdmin } = user;
      const currency = walletDto.currency
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
  async fundMyWallet(user: IUser, walletId:string, fundWalletDto: FundWalletDto){
    try {
        const { id, isAdmin } = user;
        const{currency, amount}=fundWalletDto
        if(isAdmin) throw new UnauthorizedException("Admin cannot fund wallet")
        const wallet = await this.repositoryService.wallet.findFirst({
            where:{
                id:walletId,
                userId:id
            }
           })
        if(!wallet)throw new NotFoundException(`wallet does not exist`)
        const existingBalance= wallet.balance
        const balance = existingBalance + amount;
      
      
        if(wallet.currency !== currency) throw new ConflictException("wrong currency")

           const fundedWallet = await this.repositoryService.wallet.update({
            where:{
                id:walletId,
                userId:id
            },
            data:{
               balance
            }
        })

           return fundedWallet;
          
        

    } catch (error) {
        throw new Error(error.message);
    }

  }

  async getWallet(user: IUser, walletId:string){
    try {
        const { id, isAdmin } = user;
        if(isAdmin) throw new UnauthorizedException("Admin cannot get wallet")
        const wallet = await this.repositoryService.wallet.findFirst({
            where:{
                id:walletId,
                userId:id
            }
           })
          if(!wallet){
            throw new NotFoundException(`wallet does not exist`);
          }else{
         return wallet;
          }
      
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getWallets(user:IUser){
try {
    const { id, isAdmin } = user;
    if(isAdmin) throw new UnauthorizedException("Admin cannot get wallet")
    const wallets = await this.repositoryService.wallet.findMany({
        where:{
            userId:id
        }
       })
    return wallets
} catch (error) {
    
}
  }
}
