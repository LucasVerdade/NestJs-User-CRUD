import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUsersQueryDto } from './dtos/find-user-query.dto';
import { UserRole } from './user-roles.enum';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { Profile } from '../profile/profile.entity';

const mockUserRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findUsers: jest.fn(),
  update: jest.fn(),
});

describe('UserService', () => {
  //#region Initializing
  let userRepository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    service = await module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });
  //#endregion Initializing

  describe('createUser', () => {
    let mockCreateUserDto: CreateUserDto;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'mock@mock.com',
        name: 'Mock User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
        profiles: undefined,
      };
    });

    it('should create an user if passwords match', async () => {
      userRepository.createUser.mockResolvedValue('mockUser');
      const result = await service.createUser(
        mockCreateUserDto,
        UserRole.ADMIN,
      );

      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.ADMIN,
      );
      expect(result).toEqual('mockUser');
    });

    it('should throw an error if passwords doesnt match', async () => {
      mockCreateUserDto.passwordConfirmation = 'wrongPassword';
      expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return the found user', async () => {
      userRepository.findOne.mockResolvedValue('mockUser');
      expect(userRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findUserById('mockId');
      expect(userRepository.findOne).toHaveBeenCalledWith('mockId', {
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
      expect(result).toEqual('mockUser');
    });

    it('should throw an error as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(service.findUserById('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should return affected > 0 if user is deleted', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteUser('mockId');
      expect(userRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('should throw an error if no user is deleted', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0 });

      expect(service.deleteUser('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUsers', () => {
    it('should call the findUsers method of the userRepository', async () => {
      userRepository.findUsers.mockResolvedValue('resultOfSearch');
      const mockFindUsersQueryDto: FindUsersQueryDto = {
        name: '',
        email: '',
        limit: 1,
        page: 1,
        role: '',
        sort: '',
        status: true,
      };

      const result = await service.findUsers(mockFindUsersQueryDto);
      expect(userRepository.findUsers).toHaveBeenCalledWith(
        mockFindUsersQueryDto,
      );
      expect(result).toEqual('resultOfSearch');
    });
  });

  describe('updateUser', () => {
    it('should return user aftected', async () => {
      userRepository.update.mockResolvedValue({ affected: 1 });
      userRepository.findOne.mockResolvedValue('mockUser');

      const result = await service.updateUser('mockUpdateUserDto', 'mockId');
      expect(userRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        'mockUpdateUserDto',
      );
      expect(result).toEqual('mockUser');
    });

    it('should throw and error if no user were affetcted', async () => {
      userRepository.update.mockResolvedValue({ affected: 0 });

      expect(service.updateUser('mockUpdateUserDto', 'mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
