import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Profile } from 'src/profile/profile.entity';
// TODO: multilangual messages
export class CreateUserDto {
  @IsNotEmpty({ message: 'Informe um endereço de email' })
  @IsEmail({}, { message: 'Informe um endereço de email válido' })
  @MaxLength(200, {
    message: 'O endereço de email deve ter no máximo 200 caractéres',
  })
  email: string;

  @IsNotEmpty({ message: 'Informe o nome do usuário' })
  @MaxLength(200, { message: 'O nome deve ter no máximo 200 caractéres' })
  name: string;

  @IsNotEmpty({ message: 'Informe uma senha' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caractéres' })
  password: string;

  @IsNotEmpty({ message: 'Informe a confirmação de senha' })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
  })
  passwordConfirmation: string;

  @IsOptional()
  profiles: Profile[];
}
