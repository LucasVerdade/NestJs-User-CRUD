import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Profile } from 'src/profile/profile.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @CreateDateColumn({ update: false })
  created: Date;

  @UpdateDateColumn()
  modified: Date;

  @CreateDateColumn()
  lastTimeLogin: Date;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @ManyToMany(() => Profile)
  @JoinTable()
  profiles: Profile[];

  async checkPassword(password: string): Promise<boolean> {
    const inputHash = await hash(password, this.salt);
    return inputHash === this.password;
  }

  async updateLastLogin(): Promise<void> {
    this.lastTimeLogin = new Date();
  }
}
