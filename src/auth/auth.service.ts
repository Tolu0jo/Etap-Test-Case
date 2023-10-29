import { ForbiddenException, Injectable } from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { AuthDto } from './dto/adminSignUpDto';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(private repositoryService: RepositoryService) {}

  async adminSignUp(dto: AuthDto) {
    try {
      const id = uuidv4();
      const { phoneNumber, password } = dto;

      const salt = await bcrypt.genSalt();

      const password_hash = await this.passwordHash(password, salt);
      const admin = await this.repositoryService.admin.create({
        data: {
          id,
          password_hash,
          phoneNumber,
          salt
        },
      });

      return admin;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credetials taken');
        }
      }
      throw error;
    }
  }

  async passwordHash(password: string, salt: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async signin(dto: AuthDto) {
    try {
         const { phoneNumber, password } = dto;
    const admin = await this.repositoryService.admin.findFirst({
      where: { phoneNumber },
    });
    const{ password_hash,salt } = admin
    const comparePassword = await this.passwordHash(password, salt)
    const isMatch = comparePassword === password_hash

    if(admin && isMatch){
      
    }else{
      throw new ForbiddenException("Invalid Credentials")
    }
    } catch (error) {
      throw new Error(error.message)
    }
 
  }
}
