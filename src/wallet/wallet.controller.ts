import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreateWalletDto, FundWalletDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getWallets(@GetUser() user: IUser) {
    return await this.walletService.getWallets(user);
  }

  
  @Get('/callback')
  async fundVerification(@Query('trxref') trxref: string) {
    return await this.walletService.fundWalletVerification(trxref);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createWallet(
    @GetUser() user: IUser,
    @Body() walletDto: CreateWalletDto,
  ) {
    return await this.walletService.createWallet(user, walletDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':walletId')
  async fundWallet(
    @GetUser() user: IUser,
    @Param('walletId') walletId: string,
    @Body() fundWalletDto: FundWalletDto,
  ) {
    return await this.walletService.fundMyWallet(user, walletId, fundWalletDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':walletId')
  async getWallet(@GetUser() user: IUser, @Param('walletId') walletId: string) {
    return await this.walletService.getWallet(user, walletId);
  }
}
