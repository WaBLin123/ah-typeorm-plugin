import { ConnectionOptions } from "typeorm";

interface ActionheroConfigOption {
  _toExpand?: boolean;
}

type AhLoggingLevel =
  | "emerg"
  | "alert"
  | "crit"
  | "error"
  | "warning"
  | "notice"
  | "info"
  | "debug";
interface PluginOption {
  autoCreateDB: boolean;
  autoCreateDBOptions: {
    charset: string;
    collate: string;
  },
  loggingLevels: {
    logQuery: AhLoggingLevel;
    logQueryError: AhLoggingLevel;
    logQuerySlow: AhLoggingLevel;
    logSchemaBuild: AhLoggingLevel;
    logMigration: AhLoggingLevel;
    log: {
      logLevel: AhLoggingLevel;
      infoLevel: AhLoggingLevel;
      warnLevel: AhLoggingLevel;
    };
  };
}
const databaseName = "ah_typeorm";
export const DEFAULT = {
  typeorm: (
    config: any
  ): ConnectionOptions & PluginOption & ActionheroConfigOption => {
    return {
      // to prevent actionhero resolve function when merge config
      _toExpand: false,

      // TypeORM Connection Options ref: https://typeorm.io/#/connection-options/
      type: "mysql", // Database type. This option is required
      host: process.env.DB_HOST || "127.0.0.1", // Database host
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Database port
      username: process.env.DB_USER || "root", // Database username
      password: process.env.DB_PASS || "123456", //  Database password
      // Database name
      database:
        process.env.DB_DATABASE ||
        `${databaseName}_${config.process.env}${
          process.env.JEST_WORKER_ID ? "_" + process.env.JEST_WORKER_ID : ""
        }`,
      synchronize: false, // Indicates if database schema should be auto created on every application launch
      migrationsRun: true, // Indicates if migrations should be auto run on every application launch
      entities: ["src/entity/**/*.ts"], // Entities, or Entity Schemas, to be loaded and used for this connection.
      migrations: ["src/migration/**/*.ts"], // Migrations to be loaded and used for this connection.
      subscribers: ["src/subscriber/**/*.ts"], // Subscribers to be loaded and used for this connection.

      // Plugin Custom Options
      // should create database when database does not exist
      // only support specific databases ex: MySQL SQLServer Oracle MariaDB
      autoCreateDB: true,
      // only support mysql
      autoCreateDBOptions: {
        charset: "utf8mb4",
        collate: "utf8mb4_bin",
      },
      // plugin default logger's logging level
      loggingLevels: {
        logQuery: "debug",
        logQueryError: "error",
        logQuerySlow: "warning",
        logSchemaBuild: "info",
        logMigration: "info",
        log: {
          logLevel: "info",
          infoLevel: "debug",
          warnLevel: "warning",
        },
      },
    };
  },
};
