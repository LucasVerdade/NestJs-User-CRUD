import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'A descrição do perfil deve ter no máximo 100 caracteres',
  })
  description: string;
}
