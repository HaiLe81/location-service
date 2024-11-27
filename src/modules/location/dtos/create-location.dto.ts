import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  NotContains,
} from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @AutoMap()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @NotContains('-')
  @AutoMap()
  code: string;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsNumber()
  @AutoMap()
  area?: number;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsUUID()
  @AutoMap()
  parentId?: string;
}
