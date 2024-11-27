import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { LocationEntity } from '../entities/location.entity';

export const LOCATION_PANIGATION_CONFIGS: PaginateConfig<LocationEntity> = {
  sortableColumns: ['id', 'name'],
  nullSort: 'last',
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['name'],
  filterableColumns: {
    name: [FilterOperator.ILIKE, FilterSuffix.NOT],
  },
};
