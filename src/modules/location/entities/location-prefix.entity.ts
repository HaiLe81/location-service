import { AbstractWithoutIdEntity } from '../../../shared/entities/abstract-without-id.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { LocationEntity } from './location.entity';

@Entity({ name: 'location_prefix', synchronize: false })
@Index(['prefix'])
export class LocationPrefixEntity extends AbstractWithoutIdEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  prefix: string; //combination of hierarchy level and sequence number

  @OneToOne(() => LocationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  location?: LocationEntity;
}
