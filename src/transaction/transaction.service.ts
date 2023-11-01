import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { TransferDto } from './dto/transfer.dto';
import { v4 as uuidv4 } from 'uuid';
import { Status } from 'src/interface/enum';

@Injectable()
export class TransactionService {
  constructor(private repository: RepositoryService) {}

  async transfer(
    userInfo: IUser,
    senderWalletId: string,
    transferDto: TransferDto,
  ) {
    try {
      const { recieverWalletId, amount } = transferDto;
      const { id, isAdmin } = userInfo;

      if (isAdmin||!id)return new HttpException("Unauthorised User, sign in as a user",HttpStatus.UNAUTHORIZED);  
      const senderWallet = await this.repository.wallet.findFirst({
        where: {
          id: senderWalletId,
          userId: id,
        },
      });
      if (!senderWallet) return new HttpException(`wallet does not exist`,HttpStatus.NOT_FOUND);

      const recieverWallet = await this.repository.wallet.findUnique({
        where: {
          id: recieverWalletId,
        },
      });
      if (!recieverWallet) return new HttpException(`wallet does not exist`,HttpStatus.NOT_FOUND);
      if (senderWallet.currency !== recieverWallet.currency)
      return new HttpException('reciever wallet should accept same currency',HttpStatus.CONFLICT);
   
      if (amount > senderWallet.balance)
      return new HttpException('Insufficient balance to make the transaction',HttpStatus.CONFLICT);
      if (amount <= 1_000_000) {
        const senderBalance = senderWallet.balance - amount;
        await this.repository.wallet.update({
          where: {
            id: senderWalletId,
            userId: id,
          },
          data: {
            balance: senderBalance,
          },
        });

        const recieverBalance = senderWallet.balance + amount;

        await this.repository.wallet.update({
          where: {
            id: recieverWalletId,
          },
          data: {
            balance: recieverBalance,
          },
        });

        const approvedTransaction = await this.repository.transaction.create({
          data: {
            id: uuidv4(),
            senderWalletId,
            recieverWalletId,
            amount,
            userId: id,
          },
        });

        return { approvedTransaction, myWalletBallance: senderBalance };
      } else {
        const pendingTransaction = await this.repository.transaction.create({
          data: {
            id: uuidv4(),
            senderWalletId,
            recieverWalletId,
            amount,
            userId: id,
            status: Status.PENDING,
          },
        });
        return pendingTransaction;
      }
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getTransactions(userInfo: IUser) {
    try {
        const { id, isAdmin } = userInfo;
    if (isAdmin||!id)return new HttpException("Unauthorised User, sign in as a user",HttpStatus.UNAUTHORIZED);
    return await this.repository.transaction.findMany({
      where: {
        userId: id,
      },
    });
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }

  async getTransaction(txnId: string, userInfo: IUser) {
    try {
       const { id, isAdmin } = userInfo;
    if (isAdmin) throw new UnauthorizedException();
    return await this.repository.transaction.findUnique({
      where: {
        id: txnId,
        userId: id,
      },
    });  
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
   
  }

  async getPendingTransactions(userInfo: IUser) {
    try {
      const { id, isAdmin } = userInfo;
      if (isAdmin) throw new UnauthorizedException();
      return await this.repository.transaction.findMany({
        where: {
          userId: id,
          status: Status.PENDING,
        },
      });
      
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getApprovedTransactions(userInfo: IUser) {
    try {
      const { id, isAdmin } = userInfo;
      if (isAdmin||!id)return new HttpException("Unauthorised User, sign in as a user",HttpStatus.UNAUTHORIZED);
      const transactions = await this.repository.transaction.findMany({
        where: {
          userId: id,
          status: Status.APPROVED,
        },
      });
      return transactions;
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
