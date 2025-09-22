import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from "path";

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [path.join(__dirname, "/models/*.ts")],
    synchronize: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy()
  });