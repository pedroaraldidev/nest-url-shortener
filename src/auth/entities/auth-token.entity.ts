import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AuthToken {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  token: string;

  @Column()
  expires_at: Date;

  @Column()
  user_id: number;

}