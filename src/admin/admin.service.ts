import {
    HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { Status } from 'src/interface/enum';
import { TransactionsQueryDto } from './dto/transaction-query.dto';

@Injectable()
export class AdminService {
  constructor(private repository: RepositoryService) {}

  async getAllTransactions(userInfo: IUser) {
    try {
      const { isAdmin } = userInfo;
      if (!isAdmin)  return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);  
      return await this.repository.transaction.findMany();
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getTransaction(userInfo: IUser, id: string) {
    try {
      const { isAdmin } = userInfo;
      if (!isAdmin) return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);
      return await this.repository.transaction.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async getPayment(userInfo: IUser, id: string) {
    try {
      const { isAdmin } = userInfo;
      if (!isAdmin) return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);
      return await this.repository.paymentSummary.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPaymentSumarries(userInfo: IUser) {
    const { isAdmin } = userInfo;
    if (!isAdmin)return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);
    return await this.repository.paymentSummary.findMany();
  }

  async getAllPendingTransactions(userInfo: IUser) {
    try {
      const { isAdmin } = userInfo;
      if (!isAdmin) return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);
      return await this.repository.transaction.findMany({
        where: {
          status: Status.PENDING,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllApprovedTransactions(userInfo: IUser) {
    try {
      const { isAdmin } = userInfo;
      if (!isAdmin) return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);
      return await this.repository.transaction.findMany({
        where: {
          status: Status.APPROVED,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async approveTransaction(txnId: string, userInfo: IUser) {
    try {
      const { id, isAdmin } = userInfo;
      if (!isAdmin) return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);

      const transaction = await this.repository.transaction.findUnique({
        where: {
          id: txnId,
          status: Status.PENDING,
        },
      });

      if (!transaction)
         return new HttpException(
          'Transactions Already Approved or Not Found',HttpStatus.BAD_REQUEST
        );

      const { senderWalletId, recieverWalletId, amount } = transaction;

      const senderWallet = await this.repository.wallet.findUnique({
        where: {
          id: senderWalletId,
        },
      });

      const recieverWallet = await this.repository.wallet.findUnique({
        where: {
          id: recieverWalletId,
        },
      });

      if (senderWallet && recieverWallet) {
        const senderBalance = senderWallet.balance - amount;
        const recieverBalance = recieverWallet.balance + amount;
        await this.repository.wallet.update({
          where: {
            id: senderWalletId,
          },
          data: {
            balance: senderBalance,
          },
        });

        await this.repository.wallet.update({
          where: {
            id: recieverWalletId,
          },
          data: {
            balance: recieverBalance,
          },
        });

        const approvedtransaction = await this.repository.transaction.update({
          where: {
            id: txnId,
          },
          data: {
            status: Status.APPROVED,
            approvedById: id,
          },
        });
        return approvedtransaction;
      } else {
        return new HttpException('Only admin can approve transactions',HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPaymentByMonth(query: TransactionsQueryDto, userInfo: IUser) {
    const { year, month } = query;
    const { isAdmin } = userInfo;
    
    if (!isAdmin) return new HttpException("Authorised User",HttpStatus.UNAUTHORIZED);
    const startDate = new Date(+year, +month - 1, 1);
    const endDate = new Date(+year, +month + 1, 0);
    console.log(startDate,endDate)
    const transactions = await this.repository.paymentSummary.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return transactions;
  }
}
