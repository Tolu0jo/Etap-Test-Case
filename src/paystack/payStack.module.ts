import { Module } from '@nestjs/common';
import { PayStackService } from './payStack.service';


@Module({
  providers: [PayStackService],
  exports: [PayStackService],

})
export class PaystackModule {}
