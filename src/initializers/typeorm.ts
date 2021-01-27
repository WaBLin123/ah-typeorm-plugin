import "reflect-metadata";
import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { api, config, Initializer } from "actionhero";
import { PluginLogger } from "../utils/pluginLogger";

declare module "actionhero" {
  export interface Api {
    typeORM: { connection: Connection };
  }
}

export class TypeORMInitializer extends Initializer {
  constructor() {
    super();
    this.name = "typeorm";
    this.loadPriority = 201;
    this.stopPriority = 9000;
  }

  async initialize(): Promise<void> {
    await this.createDatabaseIfNoExist(config.typeorm.autoCreateDB);
    const connection = await createConnection({
      logger: new PluginLogger(config.typeorm.loggingLevels), // plugin default logger
      ...config.typeorm,
    });
    api.typeORM.connection = connection;
    await this.validationQuery();
  }

  async stop(): Promise<void> {
    await api.typeORM.connection.close();
  }

  private async createDatabaseIfNoExist(toCreate?: boolean): Promise<void> {
    if (!toCreate) return;

    const dbName = config.typeorm.database;
    const connection = await createConnection({
      name: "createDBWorker",
      type: config.typeorm.type,
      host: config.typeorm.host,
      port: config.typeorm.port,
      username: config.typeorm.username,
      password: config.typeorm.password,
    });
    const queryRunner = connection.createQueryRunner();
    await queryRunner.createDatabase(dbName, true);
    await connection.close();
  }

  // validation query when connected specific database type
  // ref: https://stackoverflow.com/questions/3668506/efficient-sql-test-query-or-validation-query-that-will-work-across-all-or-most
  private async validationQuery(): Promise<void> {
    const dialect = config.typeorm.type as ConnectionOptions["type"];
    let sql = "";
    if (["mysql", "mariadb", "postgres", "sqlite", "mssql"].includes(dialect)) {
      sql = "SELECT 1";
    }
    if (dialect === "oracle") {
      sql = "SELECT 1 FROM DUAL";
    }
    const queryRunner = api.typeORM.connection.createQueryRunner();
    await queryRunner.query(sql);
  }
}
