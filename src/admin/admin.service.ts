import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { Status } from 'src/interface/enum';
import { TransactionsQueryDto } from './dto/transaction-query.dto';

@Injectable()
export class AdminService {
  constructor(private repository: RepositoryService) {}

  async getAllTransactions(userInfo: IUser) {
    try {
      const { isAdmin } = userInfo;
      if (!isAdmin) throw new UnauthorizedException();
      return await this.repository.transaction.findMany();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllPendingTransactions(userInfo: IUser) {
    try {
      const { isAdmin } = userInfo;
      if (!isAdmin) throw new UnauthorizedException();
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
      if (!isAdmin) throw new UnauthorizedException();
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
      const { id,isAdmin } = userInfo;
      if (!isAdmin) throw new UnauthorizedException();

      const transaction = await this.repository.transaction.findUnique({
        where: {
          id: txnId,
          status:Status.PENDING
        },
      });

      if(!transaction) throw new NotFoundException("Transactions Already Approved or Not Found");

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
            approvedById:id
          },
        });
        return approvedtransaction;
      }else{
        throw new UnauthorizedException("Only admin can approve transactions")
      }
    } catch (error) {
        throw new Error(error.message)
    }
  }

  async getTransactionsByMonth(query: TransactionsQueryDto,userInfo:IUser) {
    const { year, month } = query;
    const {isAdmin } = userInfo;
    if(!isAdmin)throw new UnauthorizedException();
  
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
  
    const transactions = await this.repository.transaction.findMany({
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
