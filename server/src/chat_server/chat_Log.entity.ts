import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat_log')
export class ChatLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  from_user: string;

  @Column('simple-array')
  to_users: string[];

  @Column('text')
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
}
