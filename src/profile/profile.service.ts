import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profileRepository.createProfile(createProfileDto);
  }

  async getAll(): Promise<{ profiles: Profile[]; total: number }> {
    const [profiles, total] = await this.profileRepository.findAndCount();
    return { profiles, total };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, id: string) {
    const result = await this.profileRepository.update(
      { id },
      updateProfileDto,
    );
    if (result.affected > 0) {
      const profile = await this.findProfileById(id);
      return profile;
    } else {
      throw new NotFoundException('Perfil não encontrado');
    }
  }

  async findProfileById(profileId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne(profileId);
    if (!profile) throw new NotFoundException('Perfil não encontrado');

    return profile;
  }

  async deleteProfile(profileId: string) {
    const result = await this.profileRepository.delete({ id: profileId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o id informado',
      );
    }
  }
}
