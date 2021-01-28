import { Process, api, env } from "actionhero";
import { Post } from "../src/entity/Post";
import { User } from "../src/entity/User";
import { EntityTarget } from "typeorm";

const actionhero = new Process();

const destroyTable = async <Entity>(
  table: EntityTarget<Entity>
): Promise<void> => {
  await api.typeORM.connection.manager.delete(table, {});
};

describe("ah-typeorm-plugin", () => {
  beforeAll(async () => {
    await actionhero.start();
    await destroyTable(Post);
    await destroyTable(User);
  });

  afterAll(async () => {
    await actionhero.stop();
  });

  test("should have booted an ActionHero server", () => {
    expect(env).toBe("test");
  });

  test("can insert row", async () => {
    const repo = api.typeORM.connection.getRepository(User);
    const user = new User();
    user.name = "BenWang";
    await repo.save(user);

    const insertedUser = await repo.findOne({ name: "BenWang" });
    expect(insertedUser).not.toBeUndefined();
    expect(insertedUser?.name).toEqual("BenWang");
  });

  test("can update row", async () => {
    const repo = api.typeORM.connection.getRepository(User);
    const user = await repo.findOne({ name: "BenWang" });
    expect(user).not.toBeUndefined();

    const result = await repo.update({ name: "BenWang" }, { name: "Ben" });
    expect(result.affected).toEqual(1);

    const updatedUser = await repo.findOne({ name: "Ben" });
    expect(updatedUser).not.toBeUndefined();
    expect(updatedUser?.name).toEqual("Ben");
  });
});
