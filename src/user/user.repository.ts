import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CredentialsDto } from '../auth/dtos/credentials.dto';
import { FindUsersQueryDto } from './dtos/find-user-query.dto';
import { ProfileRepository } from '../profile/profile.repository';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {
    super();
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    //#region Query Validation
    queryDto.status = queryDto.status === undefined ? true : queryDto.status;

    queryDto.page =
      queryDto?.page === undefined || queryDto?.page < 1 ? 1 : queryDto.page;

    queryDto.limit =
      queryDto?.limit === undefined || queryDto.limit > 100
        ? 100
        : queryDto.limit;
    //#endregion Query Validation

    const { email, name, status, role } = queryDto;
    const query = this.createQueryBuilder('user');
    query.where('user.status = :status', { status });

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (name) {
      query.andWhere('user.name ILIKE :email', { name: `%${name}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'user.name',
      'user.email',
      'user.role',
      'user.status',
      'user.id',
      'user.created',
      'user.modified',
      'user.lastTimeLogin',
    ]);
    query.leftJoinAndSelect('user.profiles', 'profile');

    const [users, total] = await query.getManyAndCount();
    return { users, total };
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, password, profiles } = createUserDto;
    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.status = true;
    user.profiles = profiles;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === process.env.DB_UNIQUE_ERROR) {
        throw new ConflictException('Endereço de email já está em uso'); // TODO: multilangual messages
      } else {
        console.error(error);
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados. Por favor, contate o suporte do sistema',
        );
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.findOne({ email, status: true });

    if (user && (await user.checkPassword(password))) {
      return user;
    }
    return null;
  }
}
