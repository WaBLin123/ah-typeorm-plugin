import { ConnectionOptions } from "typeorm";

interface PluginOption {
  autoCreateDB: boolean;
}
const databaseName = "ah_typeorm";
export const DEFAULT = {
  typeorm: (config: any): ConnectionOptions & PluginOption => {
    return {
      // TypeORM Connection Options ref: https://typeorm.io/#/connection-options/
      type: "mysql", // Database type. This option is required
      host: process.env.DB_HOST || "127.0.0.1", // Database host
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Database host port
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
      // TODO: plugin logger

      // Plugin Custom Options
      // should create database when database does not exist
      // only support specific databases ex: MySQL SQLServer Oracle MariaDB
      autoCreateDB: false,
    };
  },
};
