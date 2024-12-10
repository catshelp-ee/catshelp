import { Dialect, Sequelize, DataTypes } from "sequelize";
import * as fs from "node:fs";
import * as path from 'node:path';

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class SequelizeConnection {
  // Connection instance
  private static instance: Sequelize;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    // Information needed to initialize database connection
    const dbName = process.env.DB_NAME as string;
    const dbUser = process.env.DB_USER as string;
    const dbHost = process.env.DB_HOST;
    const dbDriver = process.env.DB_DRIVER as Dialect;
    const dbPassword = process.env.DB_PASSWORD;

    // Initialize connection
    SequelizeConnection.instance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: dbDriver,
      define: {
        timestamps: false,
      },
    });

    // Test connection
    SequelizeConnection.instance.authenticate().then(() => {
      console.log("Sequelize connected");
    });

    /*
    Marko uuri seda
    models/index.js see koht just tekitab probleeme.

    const models = {};
    const modelDirName = new URL('../models', import.meta.url);

    (async () => {
        const files = fs
          .readdirSync(modelDirName)
          .filter((file) => (file.indexOf('.') !== 0) && (file.slice(-3) === '.ts'));
      
        await Promise.all(files.map(async (file) => {
          const module = await import(path.join(modelDirName.toString(), file));
          const model = module.default(SequelizeConnection.instance, DataTypes);
          models[model.name] = model;
        }));
      
        Object.keys(models).forEach((modelName) => {
          if (models[modelName].associate) {
            models[modelName].associate(models);
          }
        });
      })();

    */

    SequelizeConnection.instance.sync().then(() => {
      console.log("Sync done");
    });
  }

  /**
   * The static method that controls the access to the singleton instance.
   */
  public static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      new SequelizeConnection();
    }

    return SequelizeConnection.instance;
  }
}
