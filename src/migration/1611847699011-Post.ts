import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Post1611847699011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Post",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "title", type: "varchar", isNullable: false },
          { name: "text", type: "varchar", isNullable: false },
          { name: "userID", type: "int", isNullable: false },
          {
            name: "createdAt",
            type: "timestamp",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["userID"],
            referencedColumnNames: ["id"],
            referencedTableName: "User",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Post");
  }
}
