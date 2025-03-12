'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnimalToFosterHome extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      AnimalToFosterHome.belongsTo(models.Animal, {
        foreignKey: "animal_id",
        onDelete: "CASCADE",
      });
      AnimalToFosterHome.belongsTo(models.FosterHome, {
        foreignKey: "foster_home_id",
        onDelete: "CASCADE",
      });
      models.Animal.hasMany(AnimalToFosterHome, {
        sourceKey: "id",
        foreignKey: "animal_id",
        as: "animal_to_foster_homes",
      });
      models.FosterHome.hasMany(AnimalToFosterHome, {
        sourceKey: "id",
        foreignKey: "foster_home_id",
        as: "foster_homes",
      });
    }
  }
  AnimalToFosterHome.init({
    animalId: DataTypes.INTEGER,
    fosterHomeId: DataTypes.INTEGER,
    fosterEndDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AnimalToFosterHome',
    tableName: 'animal_to_foster_homes',
  });
  return AnimalToFosterHome;
};