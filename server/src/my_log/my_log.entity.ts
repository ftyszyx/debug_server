import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log')
export class MyLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @Index('logtype')
  log_type: string;

  @Column('int')
  @Index('userid')
  user_id: number;

  @Column('text')
  info: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  log_time: Date;
}
