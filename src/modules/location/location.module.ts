import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './controllers/location.controller';
import { LocationService } from './services/location.service';
import { LocationEntity } from './entities/location.entity';
import { LocationProfile } from './location.profile';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  controllers: [LocationController],
  providers: [LocationService, LocationProfile],
  exports: [],
})
export class LocationModule {}
