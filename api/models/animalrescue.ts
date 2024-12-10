import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../services/database-service.ts";

export default class AnimalRescue extends Model {
  declare id: number;
  declare rank_nr: string;
  declare rescue_date: string;
  declare location: string;
  declare location_notes: string;

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

AnimalRescue.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  rank_nr: { 
    type: DataTypes.STRING
  },
  rescue_date: { 
    type: DataTypes.DATE
  },
  location: { 
    type: DataTypes.STRING
  },
  location_notes: { 
    type: DataTypes.STRING
  },
}, {
  sequelize: sequelizeConnection,
  modelName: "animal_rescues",
});
