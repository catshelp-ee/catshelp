"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnimalToAnimalRescue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AnimalToAnimalRescue.belongsTo(models.Animal, {
        foreignKey: "animal_id",
        onDelete: "CASCADE",
      });
      AnimalToAnimalRescue.belongsTo(models.AnimalRescue, {
        foreignKey: "animal_rescue_id",
        onDelete: "CASCADE",
      });
    }
  }
  AnimalToAnimalRescue.init(
    {
      animalId: DataTypes.INTEGER,
      animalRescueId: DataTypes.INTEGER
    },
    {
      underscored: true,
      sequelize,
      modelName: "AnimalToAnimalRescue",
      tableName: "animal_to_animal_rescues",
    }
  );
  return AnimalToAnimalRescue;
};
