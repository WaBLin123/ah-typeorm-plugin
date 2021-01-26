import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { api, config, Initializer } from "actionhero";
import { PluginLogger } from "../utils/pluginLogger";

declare module "actionhero" {
  export interface Api {
    typeORM: Connection;
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
    api.typeORM = await createConnection({
      ...config.typeorm,
      logger: new PluginLogger(config.typeorm.loggingLevels),
    });
  }

  async stop(): Promise<void> {
    await api.typeORM.close();
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
}
