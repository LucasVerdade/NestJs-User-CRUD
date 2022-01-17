import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/user/user-roles.enum';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { ReturnProfileDto } from './dtos/return-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
@UseGuards(AuthGuard(), RolesGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @Role(UserRole.ADMIN)
  async createProfile(
    @Body(ValidationPipe) createProfileDto: CreateProfileDto,
  ): Promise<ReturnProfileDto> {
    const profile = await this.profileService.createProfile(createProfileDto);
    return {
      profile: profile,
      message: 'Perfil cadastrado co sucesso',
    };
  }

  @Get()
  @Role(UserRole.ADMIN)
  async getAll() {
    return await this.profileService.getAll();
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findProfileById(@Param('id') id: string): Promise<ReturnProfileDto> {
    const profile = await this.profileService.findProfileById(id);
    return {
      profile,
      message: 'Perfil encontrado',
    };
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  async updateProfile(
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
    @Param('id') id: string,
  ): Promise<Profile> {
    return await this.profileService.updateProfile(updateProfileDto, id);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteProfile(@Param('id') id: string) {
    await this.profileService.deleteProfile(id);
    return {
      message: 'Perfil removido com sucesso',
    };
  }
}
