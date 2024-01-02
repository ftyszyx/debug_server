import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat_room')
export class ChatRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column({ length: 255, default: '' })
  //   @Index('room_key', { unique: true })
  //   room_key: string;

  @Column({ length: 255 })
  @Index('name', { unique: true })
  name: string;

  @Column('simple-array')
  users: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
}

export class GetChatRoomReq {
  @ApiProperty()
  room_id: number;
}

export class GetRoomByClient {
  @ApiProperty()
  guid: string;
}
