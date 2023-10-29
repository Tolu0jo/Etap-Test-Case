import { Module } from '@nestjs/common';
import { AuthController } from './auth.contoller';
import { AuthService } from './auth.service';
import { RepositoryModule } from 'src/repository/repository.module';


@Module({
  imports:[RepositoryModule],
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule {}