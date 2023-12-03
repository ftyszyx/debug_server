import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('debug_client')
export class DebugClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  @Index('guid', { unique: true })
  guid: string;

  @Column({ length: 50 })
  @Index('system')
  system_type: string;

  @Column({ length: 255 })
  desc: string;

  connected: boolean;
  address: string;
}
