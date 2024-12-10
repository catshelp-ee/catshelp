import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../services/database-service.ts";

export default class AnimalToAnimalRescue extends Model {
  declare id: number;
  declare animal_id: number;
  declare animal_rescue_id: number;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    models.AnimalsToAnimalRescues.belongsTo(models.Animals, {
      foreignKey: "animal_id",
      onDelete: "CASCADE",
    });
    models.AnimalsToAnimalRescues.belongsTo(models.AnimalRescues, {
      foreignKey: "animal_rescue_id",
      onDelete: "CASCADE",
    });
    models.Animals.hasMany(models.AnimalsToAnimalRescues, {
      sourceKey: "id",
      foreignKey: "animal_id",
      as: "animals_to_animal_rescues",
    });
    models.AnimalRescues.hasMany(models.AnimalsToAnimalRescues, {
      sourceKey: "id",
      foreignKey: "animal_rescue_id",
      as: "animals_to_animal_rescues",
    });
  }
}

const sequelizeConnection = SequelizeConnection.getInstance();

AnimalToAnimalRescue.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  animal_id: { 
    type: DataTypes.INTEGER
  },
  animal_rescue_id: { 
    type: DataTypes.INTEGER
  },
}, {
  sequelize: sequelizeConnection,
  modelName: "animals_to_animal_rescues",
});
