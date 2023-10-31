import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FundWalletDto } from 'src/wallet/dto/wallet.dto';

const Paystack = require('paystack');

@Injectable()
export class PayStackService {
  private readonly paystack = Paystack;

  constructor(private configService: ConfigService) {
    this.paystack = Paystack(this.configService.get<string>('PAYSTACK_SECRET_KEY'),
    );
  }

  async initiatePayment(id:String, walletId: string, fundWalletDto:FundWalletDto) {
    try {
        const{currency, amount, email}=fundWalletDto
        const response = await this.paystack.transaction.initialize({
            amount: amount * 100,
            email,
            currency,
            callback_url: "http://localhost:300/wallet/callback",
            metadata:{
               id,
               walletId
            }
          }
          );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await this.paystack.transaction.verify(reference);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
