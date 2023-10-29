import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/admin/signup')
  async adminSignup(@Body() dto: AuthDto) {
    return await this.authService.adminSignUp(dto);
  }

  @Post("admin/signin")
  async adminSignIn(@Body() dto: AuthDto){
    return await this.authService.adminSignIn(dto);
  }

  @Post("user/signup")
  async userSignup(@Body() dto: AuthDto){
   return await this.authService.userSignUp(dto);
  }

  @Post("user/signin")
  async userSignIn(@Body() dto: AuthDto){
    return await this.authService.userSignIn(dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async getMe(@GetUser("isAdmin") isAdmin: boolean){
    return {isAdmin};
  }
}
