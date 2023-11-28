import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('debug_client')
export class DebugClientEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
