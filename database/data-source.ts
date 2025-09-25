import "dotenv/config";
import { DataSource } from "typeorm";
import { PluralSnakeNamingStrategy } from "./plural-naming-strategy";


//Tsx does not support all functionality atm
//https://github.com/privatenumber/tsx/issues/740
export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ["database/models/*.ts"],
  migrations: ["database/migrations/*.ts"],
  synchronize: true,
  logging: false,
  namingStrategy: new PluralSnakeNamingStrategy()
});
