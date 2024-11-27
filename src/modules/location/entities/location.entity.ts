import { AutoMap } from '@automapper/classes';
import { AbstractEntity } from '../../../shared/entities/abstract.entity';

import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { LocationPrefixEntity } from './location-prefix.entity';

@Entity({ name: 'location', synchronize: true })
@Unique(['parentId', 'code'])
@Check(`"code" NOT LIKE '%-%'`)
export class LocationEntity extends AbstractEntity {
  @Column({ length: 255 })
  @AutoMap()
  name: string;

  @Column({ length: 10 })
  @AutoMap()
  code: string;

  @Column({ type: 'float', nullable: true })
  @AutoMap()
  area: number;

  @Column({ type: 'uuid', nullable: true })
  @AutoMap()
  parentId: string;

  @ManyToOne(() => LocationEntity, (location) => location.children)
  @JoinColumn({ name: 'parent_id' })
  @AutoMap(() => LocationEntity)
  parent?: LocationEntity;

  @OneToMany(() => LocationEntity, (location) => location.parent)
  @AutoMap(() => [LocationEntity])
  children?: LocationEntity[];

  @OneToOne(
    () => LocationPrefixEntity,
    (locationRelationship) => locationRelationship.location,
  )
  @AutoMap(() => LocationPrefixEntity)
  prefix: LocationPrefixEntity;
}
