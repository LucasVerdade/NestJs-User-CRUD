import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { Profile } from './profile.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    try {
      const profile = this.create();
      profile.description = createProfileDto.description;

      profile.save();
      return profile;
    } catch (error) {
      if (error.code.toString() === process.env.DB_UNIQUE_ERROR) {
        throw new ConflictException('Já existe um perfil com essa descrição');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o perfil no banco de dados. Por favor, contate o suporte do sistema',
        );
      }
    }
  }
}
