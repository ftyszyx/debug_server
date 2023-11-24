import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { OrderByKey, SearchAndOr, SearchField, SearchOpKey } from 'src/entity/sql.entity';
import { ListReq } from 'src/entity/api.entity';

const handleArgs = <T>(query: WhereExpressionBuilder, where: SearchField<T>, andOr: 'andWhere' | 'orWhere', colums: string[]) => {
  const fieldItems = Object.entries(where);
  fieldItems.map((fieldItem) => {
    const [fieldName, filters] = fieldItem;
    if (colums.some((x) => x == fieldName)) {
      const ops = Object.entries(filters);
      ops.map((parameters) => {
        const [operation, value] = parameters;
        switch (operation as SearchOpKey) {
          case 'is': {
            query[andOr](`${fieldName} = :isvalue`, { isvalue: value });
            break;
          }
          case 'not': {
            query[andOr](`${fieldName} != :notvalue`, { notvalue: value });
            break;
          }
          case 'in': {
            query[andOr](`${fieldName} IN :invalue`, { invalue: value });
            break;
          }
          case 'not_in': {
            query[andOr](`${fieldName} NOT IN :notinvalue`, {
              notinvalue: value,
            });
            break;
          }
          case 'lt': {
            query[andOr](`${fieldName} < :ltvalue`, { ltvalue: value });
            break;
          }
          case 'lte': {
            query[andOr](`${fieldName} <= :ltevalue`, { ltevalue: value });
            break;
          }
          case 'gt': {
            query[andOr](`${fieldName} > :gtvalue`, { gtvalue: value });
            break;
          }
          case 'gte': {
            query[andOr](`${fieldName} >= :gtevalue`, { gtevalue: value });
            break;
          }
          case 'contains': {
            query[andOr](`${fieldName} ILIKE :convalue`, {
              convalue: `%${value}%`,
            });
            break;
          }
          case 'not_contains': {
            query[andOr](`${fieldName} NOT ILIKE :notconvalue`, {
              notconvalue: `%${value}%`,
            });
            break;
          }
          case 'starts_with': {
            query[andOr](`${fieldName} ILIKE :swvalue`, {
              swvalue: `${value}%`,
            });
            break;
          }
          case 'not_starts_with': {
            query[andOr](`${fieldName} NOT ILIKE :nswvalue`, {
              nswvalue: `${value}%`,
            });
            break;
          }
          case 'not_starts_with': {
            query[andOr](`${fieldName} NOT ILIKE :nswvalue`, {
              nswvalue: `${value}%`,
            });
            break;
          }
          case 'ends_with': {
            query[andOr](`${fieldName} ILIKE :ewvalue`, {
              ewvalue: `%${value}`,
            });
            break;
          }
          case 'not_ends_with': {
            query[andOr](`${fieldName} ILIKE :newvalue`, {
              newvalue: `%${value}`,
            });
            break;
          }
          case 'between': {
            query[andOr](`${fieldName} between :time1 and :time2`, {
              time1: `${value[0]}`,
              time2: `${value[1]}`,
            });
            break;
          }
          case 'between_not_include': {
            query[andOr](`${fieldName} > :time1 and < :time2`, {
              time1: `${value[0]}`,
              time2: `${value[1]}`,
            });
            break;
          }
          default: {
            break;
          }
        }
      });
    }
  });

  return query;
};

export const filterQuery = <T>(query: SelectQueryBuilder<T>, where: ListReq<T>, colums: string[]) => {
  if (!where) {
    return query;
  }
  Object.keys(where).forEach((key: SearchAndOr | OrderByKey) => {
    switch (key) {
      case 'or':
        {
          query.orWhere(
            new Brackets((qb) =>
              where[key]!.map((queryArray) => {
                handleArgs(qb, queryArray, 'orWhere', colums);
              }),
            ),
          );
        }
        break;
      case 'and':
        {
          query.andWhere(
            new Brackets((qb) =>
              where[key]!.map((queryArray) => {
                handleArgs(qb, queryArray, 'andWhere', colums);
              }),
            ),
          );
        }
        break;
      case 'orderBy':
        {
          query.orderBy(where[key]!);
        }
        break;
      default: {
        break;
      }
    }
  });

  return query;
};
