import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { LocationResponseDto } from '../dtos/location-response.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { LocationPrefixEntity } from '../entities/location-prefix.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { LOCATION_PANIGATION_CONFIGS } from '../constants';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private repository: Repository<LocationEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly logger: PinoLogger,
    private dataSource: DataSource,
  ) {}

  async getLocation(id: string): Promise<LocationResponseDto> {
    try {
      const location = await this.repository.findOne({
        where: { id },
        relations: ['prefix'],
      });
      return this.mapper.map(location, LocationEntity, LocationResponseDto);
    } catch (error) {
      throw error;
    }
  }

  async getLocations(
    query: PaginateQuery,
  ): Promise<Paginated<LocationResponseDto>> {
    const dto = new Paginated<LocationResponseDto>();
    try {
      const result = await paginate<LocationEntity>(
        query,
        this.repository,
        LOCATION_PANIGATION_CONFIGS,
      );
      const data = this.mapper.mapArray(
        result.data,
        LocationEntity,
        LocationResponseDto,
      );
      Object.assign(dto, { ...result, data });
      this.logger.info(`Get locations successfully`);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  async createLocation(dto: CreateLocationDto): Promise<LocationResponseDto> {
    try {
      await this.validateParentLocation(dto.parentId);
      await this.validateLocationCode(dto.code);

      const payload = this.mapper.map(dto, CreateLocationDto, LocationEntity);

      const result = await this.dataSource.transaction(async (manager) => {
        const locationRepository = manager.getRepository(LocationEntity);
        const location = await locationRepository.save(payload);

        if (dto.parentId) {
          const parentLocation = await locationRepository.findOne({
            where: { id: dto.parentId },
            relations: { prefix: true },
          });

          const locationPrefix = parentLocation.parentId
            ? `${parentLocation.prefix.prefix}-${parentLocation.code}`
            : parentLocation.code;

          await manager.save(LocationPrefixEntity, {
            id: location.id,
            prefix: locationPrefix,
          });
        }
        return location;
      });

      this.logger.info(`Location created successfully with id: ${result.id}`);
      return this.mapper.map(result, LocationEntity, LocationResponseDto);
    } catch (error) {
      throw error;
    }
  }

  async updateLocation(id: string, dto: UpdateLocationDto) {
    try {
      const existLocation = await this.validateLocationExist(id);

      if (dto.code) {
        await this.validateLocationCode(dto.code);
      }

      if (dto.parentId) {
        await this.validateParentLocation(
          dto.parentId,
          dto.area ?? existLocation.area,
        );
      }

      const result = await this.dataSource.transaction(async (manager) => {
        // Check if the code or parentId is updated
        const isUpdatedCode: boolean =
          (dto.code === null || !!dto.code) && dto.code !== existLocation.code;
        const isUpdatedParentId: boolean =
          (dto.parentId === null || !!dto.parentId) &&
          dto.parentId !== existLocation.parentId;

        const locationRepository = manager.getRepository(LocationEntity);
        const locationPrefixRepository =
          manager.getRepository(LocationPrefixEntity);

        // Fetch the existing location prefix
        let locationPrefix = await locationPrefixRepository.findOne({
          where: { id },
        });
        const oldLocationPrefix = locationPrefix
          ? `${locationPrefix.prefix}-${existLocation.code}`
          : existLocation.code;

        // Update the existing location with new data
        Object.assign(existLocation, dto);
        const location = await locationRepository.save(existLocation);

        // Handle the case when parentId is updated to null
        let newChildLocationPrefix: string = '';
        if (isUpdatedParentId) {
          if (!location.parentId) {
            await locationPrefixRepository.delete(id);
            newChildLocationPrefix = location.code;
          } else {
            const parentLocation = await locationRepository.findOne({
              where: { id: location.parentId },
              relations: ['prefix'],
            });
            if (!locationPrefix) {
              locationPrefix = locationPrefixRepository.create({ id });
            }
            locationPrefix.prefix = parentLocation.prefix
              ? `${parentLocation.prefix.prefix}-${parentLocation.code}`
              : parentLocation.code;
            locationPrefix =
              await locationPrefixRepository.save(locationPrefix);
            newChildLocationPrefix = `${locationPrefix.prefix}-${location.code}`;
          }
        }

        // Update location prefixes if code or parentId is updated
        if (isUpdatedCode || isUpdatedParentId) {
          await this.updateLocationPrefixes(
            locationPrefixRepository,
            oldLocationPrefix,
            newChildLocationPrefix,
          );
        }
        return location;
      });

      this.logger.info(`Location updated successfully with id: ${result.id}`);
      return this.mapper.map(result, LocationEntity, LocationResponseDto);
    } catch (error) {
      throw error;
    }
  }

  private async updateLocationPrefixes(
    locationPrefixRepository: Repository<LocationPrefixEntity>,
    oldPrefix: string,
    newPrefix: string,
  ) {
    let count = 0;
    const batchNumber = 100;
    do {
      const locationPrefixes = await locationPrefixRepository.find({
        where: [{ prefix: oldPrefix }, { prefix: ILike(`${oldPrefix}-%`) }],
        take: batchNumber,
        order: { createdAt: 'ASC' },
      });
      locationPrefixes.map((prefix) => {
        prefix.prefix = prefix.prefix.replace(oldPrefix, newPrefix);
      });
      await locationPrefixRepository.save(locationPrefixes);
      count = locationPrefixes.length;
    } while (count);
  }

  async deleteLocation(id: string) {
    try {
      const location = await this.repository.findOne({
        where: { id },
        relations: { children: true },
      });

      if (!location) {
        throw new BadRequestException('Location not found');
      }

      if (location.children?.length) {
        throw new BadRequestException(
          `Can't not delete location with children`,
        );
      } else {
        await this.repository.remove(location);
      }
      this.logger.info(`Location deleted successfully with id: ${id}`);
      return this.mapper.map(null, LocationEntity, LocationResponseDto);
    } catch (error) {
      throw error;
    }
  }

  private async validateParentLocation(parentId: string, childArea?: number) {
    if (!parentId) return;
    const parentLocation = await this.repository.findOne({
      where: { id: parentId },
    });

    if (!parentLocation) {
      throw new BadRequestException('Parent location not found');
    } else if (parentLocation.area < (childArea || 0)) {
      throw new BadRequestException(
        'Parent location area should be greater than the child location',
      );
    }
  }

  private async validateLocationCode(
    code: string,
    options: { id?: string; parentId?: string } = {},
  ) {
    const { id, parentId = null } = options;
    const queryOptions: FindOptionsWhere<LocationEntity> = { code, parentId };
    if (id) {
      queryOptions.id = Not(id);
    }
    const existingLocation = await this.repository.findOne({
      where: queryOptions,
    });

    if (existingLocation) {
      throw new BadRequestException(
        'Location with the same code already exists',
      );
    }
  }

  private async validateLocationExist(id: string) {
    const location = await this.repository.findOne({ where: { id } });
    if (!location) throw new BadRequestException('Location not found');
    return location;
  }
}
