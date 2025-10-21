import "dotenv/config";
import { DataSource } from "typeorm";
import { PluralSnakeNamingStrategy } from "./plural-naming-strategy";


//Tsx does not support all functionality atm
//https://github.com/privatenumber/tsx/issues/740
export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: ["./migrations/*.{ts,js}"],
    synchronize: false,
    logging: false,
    migrationsRun: false,
    namingStrategy: new PluralSnakeNamingStrategy()
});
