import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log')
export class MyLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  @Index('logtype')
  log_type: number;

  @Column('int')
  @Index('userid')
  user_id: number;

  @Column('text')
  info: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  log_time: Date;
}
