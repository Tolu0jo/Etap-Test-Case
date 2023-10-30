import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RepositoryService } from 'src/Repository/repository.service';

@Module({
  providers: [AdminService,RepositoryService],
  controllers: [AdminController]
})
export class AdminModule {}
