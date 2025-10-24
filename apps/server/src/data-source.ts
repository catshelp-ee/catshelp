import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from "typeorm";
import { PluralSnakeNamingStrategy } from "./plural-naming-strategy";


//TODO FIX ME
// When running npm script __dirname is apps\server\src folder. When running app, it is set to build/server i think
const isBuild = process.env.BUILD === 'true';
const rootFolder = isBuild
    ? join(__dirname, '../..')
    : join(__dirname, '../../..');
dotenv.config({ path: join(rootFolder, '.env') });


//Tsx does not support all functionality atm
//https://github.com/privatenumber/tsx/issues/740
export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
        isBuild
            ? rootFolder + '/build/server/**/*.entity.js'
            : rootFolder + '/apps/server/src/**/*.entity.ts'
    ],
    migrations: [
        isBuild
            ? rootFolder + '/build/server/migrations/*.js'
            : rootFolder + '/apps/server/migrations/*.ts'
    ],
    synchronize: false,
    logging: false,
    migrationsRun: false,
    namingStrategy: new PluralSnakeNamingStrategy()
});
