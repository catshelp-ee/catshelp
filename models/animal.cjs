"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Animal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Animal.hasMany(models.AnimalToAnimalRescue, {
        sourceKey: "id",
        foreignKey: "animal_id",
        as: "animals_to_animal_rescues",
      });
      Animal.hasMany(models.AnimalToFosterHome, {
        sourceKey: "id",
        foreignKey: "animal_id",
        as: "animal_to_foster_homes",
      });
    }
  }
  Animal.init(
    {
      name: DataTypes.STRING,
      birthday: DataTypes.DATE,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
      chipNumber: DataTypes.STRING,
      chipRegisteredWithUs: DataTypes.BOOLEAN
    },
    {
      underscored: true,
      sequelize,
      modelName: "Animal",
      tableName: "animals",
    }
  );
  return Animal;
};
