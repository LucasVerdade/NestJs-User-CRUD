import { Profile } from '../../profile/profile.entity';

export class BasicUserDto {
  id: string;
  email: string;
  role: string;
  status: boolean;
  created: Date;
  modified: Date;
  last_login: Date;
  profiles: Profile[];
}
