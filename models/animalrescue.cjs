"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnimalRescue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AnimalRescue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rank_nr: DataTypes.STRING,
      rescue_date: DataTypes.DATE,
      location: DataTypes.STRING,
      location_notes: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AnimalRescue",
    }
  );
  return AnimalRescue;
};
