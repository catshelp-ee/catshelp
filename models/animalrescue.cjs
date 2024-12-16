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
      rankNr: { 
        type: DataTypes.STRING,
        field: 'rank_nr'
      },
      rescueDate: {
        type: DataTypes.DATE,
        field: 'rescue_date'
      },
      location: DataTypes.STRING,
      locationNotes: {
        type: DataTypes.STRING,
        field: 'location_notes'
      },
    },
    {
      sequelize,
      modelName: "AnimalRescue",
      tableName: 'animal_rescues'
    }
  );
  return AnimalRescue;
};
