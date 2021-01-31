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

  test.skip("if config 'typeorm' autoCreateDB is enabled, plugin should create database when database not exist", async () => {});

  test.skip("plugin logger lever should follow config 'typeorm' loggingLevels", async () => {});

  test("api.typeORM.connection can be used normally", async () => {
    const userRepo = api.typeORM.connection.getRepository(User);
    const user = new User();
    user.name = "BenWang";
    await userRepo.save(user);

    const insertedUser = await userRepo.findOne({ where: { name: "BenWang" } });
    expect(insertedUser).not.toBeUndefined();
    expect(insertedUser?.name).toEqual("BenWang");

    const postRepo = api.typeORM.connection.getRepository(Post);
    const post = new Post();
    post.title = "Hello World!!";
    post.text = "First Post";
    post.user = user;
    await postRepo.save(post);

    const insertedPost = await postRepo.findOne({
      where: { title: "Hello World!!" },
    });
    expect(insertedPost).not.toBeUndefined();
    expect(insertedPost?.text).toEqual("First Post");
  });
});
