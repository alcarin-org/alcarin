import { Logger } from 'typeorm';
import { logger } from '../core/helpers/logger';

export class DbLogger implements Logger {
  logQuery(query: string, parameters?: string[]) {
    logger.db(`[query] ${this.formatQueryWithParameters(query, parameters)}`);
  }

  logQueryError(error: string, query: string, parameters?: string[]) {
    logger.db(
      `[queryError] Error: ${error}, query: ${this.formatQueryWithParameters(
        query,
        parameters
      )}`
    );
  }

  logQuerySlow(time: number, query: string, parameters?: string[]) {
    logger.db(
      `[querySlow] time:${time}: ${this.formatQueryWithParameters(
        query,
        parameters
      )}`
    );
  }

  logSchemaBuild(message: string) {
    logger.db(`[schemaBuild] ${message}`);
  }

  logMigration(message: string) {
    logger.db(`[migration] ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    logger.db(`[log:${level}] ${message}`);
  }

  private formatQueryWithParameters(query: string, parameters?: string[]) {
    let formattedQuery = query;

    if (parameters) {
      parameters.forEach((eachParameter, index) => {
        formattedQuery = formattedQuery.replace(
          `$${index + 1}`,
          `'${eachParameter}'`
        );
      });
    }

    return formattedQuery;
  }
}
