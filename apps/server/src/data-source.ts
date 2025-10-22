import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from "typeorm";
import { PluralSnakeNamingStrategy } from "./plural-naming-strategy";


//TODO FIX ME
// When running npm script __dirname is apps\server\src folder. When running app, it is set to build/server i think
let rootFolder = __dirname + "/../../..";
console.log(rootFolder + "/apps/.env");
dotenv.config({ path: rootFolder + "/apps/.env" });

//Tsx does not support all functionality atm
//https://github.com/privatenumber/tsx/issues/740
export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [rootFolder + '/apps/server/src/**/*.entity{.ts,.js}'],
    migrations: [rootFolder + "/apps/server/migrations/*.{ts,js}"],
    synchronize: false,
    logging: false,
    migrationsRun: false,
    namingStrategy: new PluralSnakeNamingStrategy()
});
