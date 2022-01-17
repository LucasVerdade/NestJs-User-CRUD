import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

const mockProfileRepository = () => ({
  createProfile: jest.fn(),
  getAll: jest.fn(),
  updateProfile: jest.fn(),
  findProfileById: jest.fn(),
  deleteProfile: jest.fn(),
});

describe('ProfileService', () => {
  let profileRepository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: ProfileRepository,
          useFactory: mockProfileRepository,
        },
      ],
    }).compile();

    profileRepository = await module.get<ProfileRepository>(ProfileRepository);
    service = await module.get<ProfileService>(ProfileService);
  });
});
