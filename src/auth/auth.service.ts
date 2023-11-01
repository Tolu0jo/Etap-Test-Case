import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(
    private repositoryService: RepositoryService,
    private configsService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async adminSignUp(dto: AuthDto) {
    try {
      const id = uuidv4();
      const { phoneNumber, password } = dto;
      const existingAdmin = await this.repositoryService.admin.findMany();
      if (existingAdmin && existingAdmin.length > 0) {
        return new HttpException('Admin already exists',HttpStatus.CONFLICT);
      } else {
        const salt = await bcrypt.genSalt();
        const password_hash = await this.passwordHash(password, salt);
        const admin = await this.repositoryService.admin.create({
          data: {
            id,
            password_hash,
            phoneNumber,
            salt,
          },
        });
        delete admin.password_hash;
        return admin;
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return new HttpException('Credetials taken',HttpStatus.CONFLICT);
        }
      }
      throw error;
    }
  }

  async userSignUp(dto: AuthDto) {
    try {
      const id = uuidv4();
      const { phoneNumber, password } = dto;
      const salt = await bcrypt.genSalt();
      const password_hash = await this.passwordHash(password, salt);
      const user = await this.repositoryService.user.create({
        data: {
          id,
          password_hash,
          phoneNumber,
          salt,
        },
      });
      delete user.password_hash;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        return new HttpException('User already exist',HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async passwordHash(password: string, salt: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async adminSignIn(dto: AuthDto) {
    try {
      const { phoneNumber, password } = dto;
      const admin = await this.repositoryService.admin.findUnique({
        where: { phoneNumber },
      });
      const { id, password_hash, salt } = admin;
      const comparePassword = await this.passwordHash(password, salt);
      const isMatch = comparePassword === password_hash;

      if (admin && isMatch) {
        return await this.signToken(id);
      } else {
       return new HttpException('Invalid Credentials',HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async userSignIn(dto: AuthDto) {
    try {
      const { phoneNumber, password } = dto;
      const user = await this.repositoryService.user.findUnique({
        where: { phoneNumber },
      });
      const { id, password_hash, salt } = user;
      const comparePassword = await this.passwordHash(password, salt);
      const isMatch = comparePassword === password_hash;

      if (user && isMatch) {
        return await this.signToken(id);
      } else {
       return new HttpException('Invalid Credentials',HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signToken(id: string): Promise<{ token: string }> {
    try {
       const payload = {
      id,
    };
    const secret = this.configsService.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
      secret,
    });

    return { token: token };
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
