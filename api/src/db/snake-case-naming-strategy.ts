import { NamingStrategyInterface, DefaultNamingStrategy, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    return customName ? customName : snakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[]
  ): string {
    return `${snakeCase(
      embeddedPrefixes.map(pre => `${pre}_`).join('')
    )}${customName || snakeCase(propertyName)}`;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string
  ): string {
    return snakeCase(
      `${firstTableName}_${firstPropertyName.replace(
        /\./gi,
        '_'
      )}_${secondTableName}`
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return snakeCase(`${tableName}_${columnName || propertyName}`);
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string
  ): string {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }

  foreignKeyName(
    tableOrName: Table | string,
    _columnNames: string[],
    referencedTablePath?: string,
    _referencedColumnNames?: string[]
  ) {
    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    return `FK_${tableName}__${referencedTablePath}`;
  }
}
