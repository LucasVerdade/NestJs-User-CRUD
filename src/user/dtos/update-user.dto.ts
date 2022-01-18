import { UserRole } from '../user-roles.enum';
import { Profile } from 'src/profile/profile.entity';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Informe um endereço de email válido' })
  email: string;

  @IsOptional()
  status: boolean;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  profiles: Profile[];
}
