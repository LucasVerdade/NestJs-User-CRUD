import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: number }) {
    const { id } = payload;
    const user = await this.userRepository.findOne(id, {
      select: ['name', 'email', 'status', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }
}
