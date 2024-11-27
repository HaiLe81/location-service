import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { LocationEntity } from './entities/location.entity';
import { LocationResponseDto } from './dtos/location-response.dto';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';

export class LocationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UpdateLocationDto, LocationEntity);
      createMap(mapper, CreateLocationDto, LocationEntity);
      createMap(
        mapper,
        LocationEntity,
        LocationResponseDto,
        forMember(
          (dist) => dist.prefix,
          mapFrom((source) => source?.prefix?.prefix),
        ),
      );
    };
  }
}
