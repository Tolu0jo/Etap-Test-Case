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
import { PayStackService } from 'src/paystack/payStack.service';
import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class WalletService {
  constructor(
    private repositoryService: RepositoryService,
    private payStackService: PayStackService,
  ) {}

  async createWallet(user: IUser, walletDto: CreateWalletDto) {
    try {
      const { id, isAdmin } = user;
      const currency = walletDto.currency;
      if (isAdmin ||!id) {
       return new HttpException("Unauthorised User, sign in as a user",HttpStatus.UNAUTHORIZED);  
      } else {
        const wallets = await this.repositoryService.wallet.findMany({
          where: { userId: id },
        });
        const isExist = wallets.find((wallet) => wallet.currency === currency);
        if (isExist) {
        return new HttpException(`Wallet with ${currency} already exists`, HttpStatus.BAD_REQUEST);;
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
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fundMyWallet(
    user: IUser,
    walletId: string,
    fundWalletDto: FundWalletDto,
  ) {
    try {
      const { id, isAdmin } = user;
      const { currency } = fundWalletDto;
      if (isAdmin||!id)return new HttpException("Unauthorised User, sign in as a user",HttpStatus.UNAUTHORIZED);   

      const wallet = await this.repositoryService.wallet.findFirst({
        where: {
          id: walletId,
          userId: id,
        },
      });

      if (wallet.currency !== currency) return new HttpException('Wrong wallet Currency', HttpStatus.BAD_REQUEST);


      const paymentData = await this.payStackService.initiatePayment(
        id,
        walletId,
        fundWalletDto,
      );
      if(!paymentData) return new HttpException("Currency not supported by paystack",HttpStatus.NOT_FOUND)

      return paymentData;
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fundWalletVerification(trxref: string) {
    try {
      const verify = await this.payStackService.verifyPayment(trxref);
      
      if(verify.status === 'success') {
      const { id, walletId, amount } = verify.metadata;
      const wallet = await this.repositoryService.wallet.findFirst({
        where: {
          id: walletId,
          userId: id,
        },
      });

      const existingBalance = wallet.balance;
      const balance = existingBalance + Number(amount);

      const fundedWallet = await this.repositoryService.wallet.update({
        where: {
          id: walletId,
          userId: id,
        },
        data: {
          balance,
        },
      });
     
     const existingPayment = await this.repositoryService.paymentDetails.findFirst({
        where:{
            pstackId:verify.id
        }
     })

     if(existingPayment) return new HttpException("Payment has already been verified",HttpStatus.CONFLICT)

      const paymentSummary = await this.repositoryService.paymentDetails.create(
        {
          data: {
            id: uuidv4(),
            WalletBallance: balance,
            amount:Number(amount),
            userId: id,
            currency: fundedWallet.currency,
            walletId,
            pstackId:verify.id
          },
        },
      );

      return { fundedWallet, paymentSummary };
    }else{
        return {status:verify.status}
    }
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWallet(user: IUser, walletId: string) {
    try {
      const { id, isAdmin } = user;
      if (isAdmin||!id)return new HttpException("Unauthorised User, sign in as a user",HttpStatus.UNAUTHORIZED);  
      const wallet = await this.repositoryService.wallet.findFirst({
        where: {
          id: walletId,
          userId: id,
        },
      });
      if (!wallet) {
        return new HttpException("Wallet does not exist",HttpStatus.NOT_FOUND)
      } else {
        return wallet;
      }
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWallets(user: IUser) {
    try {
      const { id, isAdmin } = user;
      if (isAdmin||!id)return new HttpException("Unauthorised User, sign in as a user",HttpStatus.UNAUTHORIZED);  
      const wallets = await this.repositoryService.wallet.findMany({
        where: {
          userId: id,
        },
      });
      return wallets;
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
