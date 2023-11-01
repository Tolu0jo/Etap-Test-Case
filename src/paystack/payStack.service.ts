import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        const baseUrl=this.configService.get<string>(`BASE_URL`)
        const{currency, amount, email}=fundWalletDto
        const response = await this.paystack.transaction.initialize({
            amount: amount * 100,
            email,
            currency,
            redirect_url:`${baseUrl}\wallet\callback`,
            metadata:{
               id,
               walletId,
               amount
            }
          }
          );

      return response.data;
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await this.paystack.transaction.verify(reference);
      return response.data;
    } catch (error) {
        return new HttpException(`${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
