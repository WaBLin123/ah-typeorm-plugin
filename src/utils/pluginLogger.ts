import { log } from "actionhero";
import { Logger, QueryRunner } from "typeorm";
import { LoggingLevels } from "./type";

/**
 *  ref TypeORM Logger
 *  ref: https://github.com/typeorm/typeorm/tree/master/src/logger
 */
export class PluginLogger implements Logger {
  constructor(private loggingLevels: LoggingLevels) {}

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const sql =
      query +
      (parameters && parameters.length
        ? " -- PARAMETERS: " + this.stringifyParams(parameters)
        : "");
    log(`Query: ${sql}`, this.loggingLevels.logQuery);
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): void {
    const sql =
      query +
      (parameters && parameters.length
        ? " -- PARAMETERS: " + this.stringifyParams(parameters)
        : "");
    log(`Query failed: ${sql}`, this.loggingLevels.logQueryError);
    log("Error: ", this.loggingLevels.logQueryError, error);
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): void {
    const sql =
      query +
      (parameters && parameters.length
        ? " -- PARAMETERS: " + this.stringifyParams(parameters)
        : "");
    log(`Query is slow: ${sql}`, this.loggingLevels.logQuerySlow);
    log(`Execution time: ${time}`, this.loggingLevels.logQuerySlow);
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    log(message, this.loggingLevels.logSchemaBuild);
  }

  /**
   * Logs events from the migration run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner): void {
    log(message, this.loggingLevels.logMigration);
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(
    level: "log" | "info" | "warn",
    message: any,
    queryRunner?: QueryRunner
  ): void {
    switch (level) {
      case "log": {
        log(message, this.loggingLevels.log.logLevel);
        break;
      }
      case "info": {
        log(`INFO: ${message}`, this.loggingLevels.log.infoLevel);
        break;
      }
      case "warn": {
        log(message, "warning", this.loggingLevels.log.warnLevel);
      }
    }
  }

  // ref TypeORM Logger method
  private stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      return parameters;
    }
  }
}
