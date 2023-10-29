import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { RepositoryService } from 'src/Repository/repository.service';
import { TransactionController } from './transaction.controller';

@Module({
    controllers: [TransactionController],
    providers: [TransactionService, RepositoryService],
})
export class TransactionModule {}
