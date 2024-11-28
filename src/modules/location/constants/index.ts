import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { LocationEntity } from '../entities/location.entity';

export const LOCATION_PANIGATION_CONFIGS: PaginateConfig<LocationEntity> = {
  sortableColumns: ['id', 'name'],
  nullSort: 'last',
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['name', 'code'],
  filterableColumns: {
    name: [FilterOperator.ILIKE, FilterSuffix.NOT, FilterOperator.EQ],
    code: [FilterOperator.EQ],
    parentId: [FilterOperator.EQ, FilterOperator.NULL, FilterSuffix.NOT],
    area: [FilterOperator.EQ, FilterOperator.LTE, FilterOperator.GTE],
    'prefix.prefix': [FilterOperator.EQ],
  },
};
