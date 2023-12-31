import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat_log')
export class ChatLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: '' })
  @Index('from_user')
  from_user: string;

  @Column('int')
  @Index('room_id')
  room_id: number;

  @Column('text')
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
}
export interface ChatLogMoreReq {
  target_id: number;
  new_or_old: boolean;
  limit_num: number;
  room_id: number;
}

export interface ChatLogMoreResp {
  logs: ChatLogEntity[];
  total: number;
}
