import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RepositoryService } from 'src/Repository/repository.service';

// to verify the token if the token is valid
@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private repositoryService: RepositoryService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { id: string}) {
    const user = await this.repositoryService.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (user) {
      delete user.password_hash;
      return user;
    } else {
      const admin = await this.repositoryService.admin.findUnique({
        where: {
          id: payload.id,
        },
      });
      delete admin.password_hash;
      return admin;
    }
  }
}
