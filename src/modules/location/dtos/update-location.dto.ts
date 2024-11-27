import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  NotContains,
  ValidateIf,
} from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ type: 'string' })
  @IsOptional()
  @IsString()
  @AutoMap()
  name?: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  @IsString()
  @NotContains('-')
  @AutoMap()
  code?: string;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsNumber()
  @AutoMap()
  area?: number;

  @ApiPropertyOptional({ type: 'string' })
  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @AutoMap()
  parentId?: string;
}
