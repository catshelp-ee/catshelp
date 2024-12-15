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
    }
  }
  AnimalToAnimalRescue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      animal_id: DataTypes.INTEGER,
      animal_rescue_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AnimalToAnimalRescue",
    }
  );
  return AnimalToAnimalRescue;
};
