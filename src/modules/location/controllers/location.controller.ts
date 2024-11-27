import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  Get,
  Delete,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { LocationService } from '../services/location.service';
import { ResponseDto } from 'src/shared/dtos/response.dto';
import { ResponseUtil } from 'src/shared/ultils/response';
import { LocationResponseDto } from '../dtos/location-response.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { LOCATION_PANIGATION_CONFIGS } from '../constants';

@Controller('/locations')
@ApiTags('Locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'Create a new location' })
  @ApiOkResponse({ type: ResponseDto<CreateLocationDto> })
  @Post()
  @HttpCode(HttpStatus.OK)
  async createLocation(
    @Body() body: CreateLocationDto,
  ): Promise<ResponseDto<CreateLocationDto>> {
    const response = await this.locationService.createLocation(body);
    return ResponseUtil.getResponse<LocationResponseDto>(
      response,
      'Location created successfully',
    );
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateLocationDto,
  ): Promise<ResponseDto<UpdateLocationDto>> {
    const response = await this.locationService.updateLocation(id, body);
    return ResponseUtil.getResponse<LocationResponseDto>(
      response,
      'Location updated successfully',
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @HttpCode(HttpStatus.OK)
  async getLocation(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDto<LocationResponseDto>> {
    const response = await this.locationService.getLocation(id);
    return ResponseUtil.getResponse<LocationResponseDto>(
      response,
      'Location retrieved successfully',
    );
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @HttpCode(HttpStatus.OK)
  async deleteLocation(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDto<LocationResponseDto>> {
    const response = await this.locationService.deleteLocation(id);
    return ResponseUtil.getResponse<LocationResponseDto>(
      response,
      'Location deleted successfully',
    );
  }

  @PaginatedSwaggerDocs(LocationResponseDto, LOCATION_PANIGATION_CONFIGS)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getLocations(
    @Paginate() query: PaginateQuery,
  ): Promise<ResponseDto<LocationResponseDto[]>> {
    const response = await this.locationService.getLocations(query);
    return ResponseUtil.getResponse<LocationResponseDto[]>(
      response,
      'Locations retrieved successfully',
    );
  }
}
