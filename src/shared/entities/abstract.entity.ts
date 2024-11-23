'use strict';
import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column({ default: null, nullable: true, type: 'uuid' })
  @AutoMap()
  createdBy?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  @Column({ default: null, nullable: true, type: 'uuid' })
  updatedBy?: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt?: Date;

  @AutoMap()
  @Column({ default: null, nullable: true, type: 'uuid' })
  deletedBy?: string | null;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  @AutoMap()
  deletedAt?: Date | null;
}
