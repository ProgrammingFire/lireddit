import path from "path";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import { User } from "./entities/User";

const typeOrmConfig: Parameters<typeof createConnection>[0] = {
  type: "postgres",
  username: "postgres",
  password: "postgres",
  database: "lireddit",
  logging: true,
  synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User, Updoot],
};

export default typeOrmConfig;
