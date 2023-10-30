// payment.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import axios from 'axios';
import { Paystack } from 'paystack';

@Injectable()
export class PayStackService {
  private readonly paystack: Paystack;

  constructor(private readonly configService: ConfigService) {
    this.paystack = new Paystack({
      apiKey: this.configService.get<string>('PAYSTACK_SECRET_KEY'),
    });
  }

  async initiatePayment(amount: number, phoneNumber: string){
    const response = await this.paystack.transaction.initialize({
      amount: amount * 100, 
      phoneNumber,
    });

    return response.data;
  }

  async verifyPayment(reference: string): Promise<any> {
    const response = await this.paystack.transaction.verify(reference);
    return response.data;
  }
}
