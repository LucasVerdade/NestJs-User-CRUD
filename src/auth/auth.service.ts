import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicUserDto } from '../user/dtos/basic-user.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserRole } from '../user/user-roles.enum';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { CredentialsDto } from './dtos/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userRepository.createUser(createUserDto, UserRole.USER);
    }
  }

  async signIn(
    credentialsDto: CredentialsDto,
  ): Promise<{ user: BasicUserDto; token: string }> {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    const jwtPayload = {
      id: user.id,
    };

    const token = await this.jwtService.sign(jwtPayload);
    try {
      user.updateLastLogin();
      await user.save();
    } finally {
      const basicUserData: BasicUserDto = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        created: user.created,
        last_login: user.lastTimeLogin,
        profiles: user.profiles,
        modified: user.modified,
      };

      return { user: basicUserData, token };
    }
  }
}
