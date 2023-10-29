
import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/adminSignUpDto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post("/signup/admin")
    async admiSignup(@Body() dto : AuthDto){

    }
}