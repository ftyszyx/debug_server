import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat_log')
export class ChatLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: '' })
  @Index('from_user')
  from_user: string;

  @Column('simple-array')
  to_users: string[];

  @Column({ length: 255, default: '' })
  @Index('to_user')
  to_user: string;

  @Column('text')
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
}
