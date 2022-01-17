import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { Role } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUsersQueryDto } from './dtos/find-user-query.dto';
import { ReturnUserDto } from './dtos/return-user-dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import { UserService } from './user.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/admin')
  @Role(UserRole.ADMIN)
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.createUser(
      createUserDto,
      UserRole.ADMIN,
    );
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Post()
  @Role(UserRole.ADMIN)
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.createUser(
      createUserDto,
      UserRole.USER,
    );
    return {
      user,
      message: 'Usuário cadastrado com sucesso',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id: string): Promise<ReturnUserDto> {
    const user = await this.userService.findUserById(id);
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (
      user.role != UserRole.ADMIN &&
      (user.id.toString() != id || updateUserDto.role == UserRole.ADMIN)
    ) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.userService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @Get()
  @Role(UserRole.ADMIN)
  async findUser(@Query() query: FindUsersQueryDto) {
    const { users, total } = await this.userService.findUsers(query);
    return {
      users,
      total,
      message: 'Usuários encontrados',
    };
  }
}
