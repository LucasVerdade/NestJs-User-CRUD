import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUsersQueryDto } from './dtos/find-user-query.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return this.userRepository.createUser(createUserDto, role);
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: [
        'email',
        'name',
        'role',
        'id',
        'created',
        'modified',
        'lastTimeLogin',
      ],
      relations: ['profiles'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const result = await this.userRepository.update({ id }, updateUserDto);
    if (result.affected > 0) {
      const user = await this.findUserById(id);
      return user;
    } else {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o id informado',
      );
    }
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto);
    return users;
  }
}
