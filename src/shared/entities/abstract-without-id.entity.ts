'use strict';
import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AbstractWithoutIdEntity {
  @Column({ default: null, nullable: true })
  @AutoMap()
  createdBy?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  @Column({ default: null, nullable: true })
  updatedBy?: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt?: Date;

  @AutoMap()
  @Column({ default: null, nullable: true })
  deletedBy?: string | null;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  @AutoMap()
  deletedAt?: Date | null;
}
