# ah-typeorm-plugin

<div align="center">
  <img width="400" src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" alt="typeORM icon">
  <img width="180" height="180" src="https://i.ibb.co/z4LWF9m/image.png" alt="x cross">
  <img width="190" src="https://www.actionherojs.com/static/press-assets/logo.png" alt="actionhero icon">
</div>

The plugin connects [TypeORM](https://typeorm.io/#/) and [Actionhero](https://www.actionherojs.com).

## Features

---

- Create "default" connection by config and append to `api.typeorm.connection` in actionhero
- Integrate [Actionhero logger](https://www.actionherojs.com/tutorials/logging) and [TypeORM logger](https://typeorm.io/#/logging).
- Create database when database does not exist. (only support specific databases ex: MySQL SQLServer Oracle MariaDB.....)

## Compatible

---

| module     | version    |
| ---------- | ---------- |
| actionhero | `v23.0.0+` |
| typeORM    | `v0.2.30+` |

## Setup

---

1. Install this plugin:

   npm: `npm install ah-typeorm-plugin --save`

   yarn: `yarn add ah-typeorm-plugin`

2. Add TypeORM:

   npm: `npm install typeorm --save`

   yarn: `yarn add typeorm`

3. Add reflect-metadata:

   npm: `npm install reflect-metadata --save`

   yarn: `yarn add reflect-metadata`

4. Install database driver(**Install only one of them, depending on which database you use**):

   - MySQL or MariaDB(you can install `mysql2` instead as well):

     npm: `npm install mysql --save`

     yarn: `yarn add mysql`

   - PostgreSQL or CockroachDB:

     npm: `npm install pg --save`

     yarn: `yarn add pg`

   - SQLite:

     npm: `npm install sqlite3 --save`

     yarn: `yarn add sqlite3`

   - Microsoft SQL Server:

     npm: `npm install mssql --save`

     yarn: `yarn add mssql`

   - sql.js:

     npm: `npm install sql.js --save`

     yarn: `yarn add sql.js`

   - Oracle:

     npm: `npm install oracledb --save`

     yarn: `yarn add oracledb`

   - SAP Hana:

     npm: `npm install @sap/hana-client hdb-pool --save`

     yarn: `yarn add @sap/hana-client hdb-pool`

   - MongoDB:

     npm: `npm install mongodb --save`

     yarn: `yarn add mongodb`

5. enabled the following settings in `tsconfig.json`:

   ```json
   "emitDecoratorMetadata": true,
   "experimentalDecorators": true,
   ```

6. Add plugin config to your actionhero project's `./src/config/plugin.ts`:

   ```typescript
   import * as path from "path";

   export const DEFAULT = {
     plugins: () => {
       return {
         "ah-typeorm-plugin": {
           path: path.join(process.cwd(), "node_modules", "ah-typeorm-plugin"),
         },
       };
     },
   };
   ```

7. Add typeORM CLI config `./ormconfig.json`:

   ```json
   {
     "cli": {
       "entitiesDir": "src/entity",
       "migrationsDir": "src/migration",
       "subscribersDir": "src/subscriber"
     }
   }
   ```

## Configuration

---

A `./src/config/typeorm.ts` will need to be created for your project. The config contain [TypeORM connection option](https://typeorm.io/#/connection-options) and ah-typeorm-plugin custom config, also you can freely modify **typeORM connection option** in the config.

Actionhero will refer the config to connection database and do plugin custom method at [initializer](https://www.actionherojs.com/tutorials/initializers)

```typescript
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
```

## Entity

---

In TypeORM, Entity is a class that maps to a database table, Basic entities consist of columns and relations.

For more information on Entity, Please visit [TypeORM Entity](https://typeorm.io/#/entities)

recommended to use TypeORM CLI to create entity:

`npx typeorm entity:create --name=User`

but you can create file in entity folder path `./src/entity`

An example entity:

```typescript
//  `./src/entity/User.ts`
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true, nullable: false })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
```

## Migration

---

A migration is just a single file with sql queries to update a database schema and apply new changes to an existing database.

For more information on Migration, Please visit [TypeORM Migration](https://typeorm.io/#/migrations).

recommended to use TypeORM CLI to create migration:

`npx typeorm migration:create --name=User`

An example migration to create `User` table would look like:

```typescript
// `./src/migration/[timestamp]-User.ts`
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1611847407518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "User",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "name", type: "varchar", isUnique: true },
          { name: "createdAt", type: "timestamp" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("User");
  }
}
```

## Use in Actionhero

You can use `api.typeorm.connection` or create connection by yourself in [Action](https://www.actionherojs.com/tutorials/actions), [Task](https://www.actionherojs.com/tutorials/initializers), [Initializer](https://www.actionherojs.com/tutorials/initializers), etc...

An example use connection in action:

```typescript
// `./src/action/createUser.ts`
// actionhero v23 action version, v24 or v25 action version please visit: https://www.actionherojs.com/tutorials/actions
import { Action, log, ActionProcessor } from "actionhero";
import { User } from "./../entity/User.ts";

export class createUser extends Action {
  constructor() {
    super();
    this.name = "createUser";
    this.description = "create a new user";
    this.outputExample = {
      result: true,
    };
    this.inputs = {
      name: { required: true },
    };
  }

  async run(data: ActionProcessor): Promise<void> {
    const { params, response } = data;
    const { name } = params;

    const repo = api.typeORM.connection.getRepository(User);
    const user = new User();
    user.name = name;
    const instance = await repo.save(user);
    response.result = !!instance;
  }
}
```
