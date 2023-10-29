import { Controller } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('user')
export class WalletController {
  constructor(private userService: WalletService) {}
}
