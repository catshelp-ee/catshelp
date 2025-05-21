'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnimalCharacteristic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AnimalCharacteristic.belongsTo(models.Animal, {
        foreignKey: "animalId"
      })
    }
  }
  AnimalCharacteristic.init({
    animalId: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    type: DataTypes.TEXT
  }, {
    sequelize,
    underscored: true,
    modelName: 'AnimalCharacteristic',
    tableName: "animal_characteristics",
  });
  return AnimalCharacteristic;
};