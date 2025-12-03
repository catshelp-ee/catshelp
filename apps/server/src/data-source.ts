import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from "typeorm";
import { PluralSnakeNamingStrategy } from "./plural-naming-strategy";

const pathToRoot = '../../';
const envPath = join(__dirname, pathToRoot, '.env');
const migrationPath = join(__dirname, 'migrations/');
dotenv.config({path : envPath});

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity.js'],
    migrations: [migrationPath + '*{.ts,.js}'],
    synchronize: false,
    logging: false,
    migrationsRun: false,
    namingStrategy: new PluralSnakeNamingStrategy()
});
