import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Url } from './url.entity';

@Entity('clicks')
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'url_id', type: 'int' })
  urlId: number;

  @Column({ name: 'ip_address', type: 'varchar', length: 45 })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'referer', type: 'text', nullable: true })
  referer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Url, (url) => url.clicks)
  @JoinColumn({ name: 'url_id' })
  url: Url;
} 