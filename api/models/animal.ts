import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../services/database-service.ts";

export default class Animal extends Model {
  declare id: number;
  declare name: string;
  declare birthday: string;
  declare description: string;
  declare status: string;
  declare chip_number: string;
  declare chip_registered_with_us: boolean

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

const sequelizeConnection = SequelizeConnection.getInstance();

Animal.init(
{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  birthday: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  chip_number: {
    type: DataTypes.STRING,
  },
  chip_registered_with_us: {
    type: DataTypes.BOOLEAN,
  },
}, {
  sequelize: sequelizeConnection,
  modelName: "animals",
});
