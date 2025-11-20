import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from "typeorm";
import { PluralSnakeNamingStrategy } from "./plural-naming-strategy";


// When running npm script __dirname is apps\server\src folder. When running app, it is set to build/server
const pathToRoot = process.env.COMMAND_LINE === 'true' ? '../../../.env' : '../../.env';
const envPath = join(__dirname, pathToRoot);
dotenv.config({path : envPath});

//Tsx does not support all functionality atm
//https://github.com/privatenumber/tsx/issues/740
export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity.js'],
    migrations: [__dirname + '/../migrations/*.ts'],
    synchronize: false,
    logging: false,
    migrationsRun: false,
    namingStrategy: new PluralSnakeNamingStrategy()
});
