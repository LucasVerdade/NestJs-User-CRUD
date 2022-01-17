import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ReturnUserDto } from 'src/user/dtos/return-user-dto';
import { BasicUserDto } from '../user/dtos/basic-user.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dtos/credentials.dto';
import { GetUser } from './get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.authService.signUp(createUserDto);
    return {
      user: user,
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentialsDto: CredentialsDto,
  ): Promise<{ user: BasicUserDto; token: string }> {
    return await this.authService.signIn(credentialsDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
