import { AutoMap } from '@automapper/classes';
import { ApiResponseProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/shared/dtos/abstract.dto';

export class LocationResponseDto extends AbstractDto {
  @ApiResponseProperty({ type: 'string' })
  @AutoMap()
  name: string;

  @ApiResponseProperty({ type: 'string' })
  @AutoMap()
  code: string;

  @ApiResponseProperty({ type: 'number' })
  @AutoMap()
  area?: number;

  @ApiResponseProperty({ type: 'string' })
  @AutoMap()
  parentId?: string;

  @ApiResponseProperty({ type: 'string' })
  @AutoMap(() => LocationResponseDto)
  parent?: LocationResponseDto;

  @ApiResponseProperty({ type: 'string' })
  prefix?: string;
}
