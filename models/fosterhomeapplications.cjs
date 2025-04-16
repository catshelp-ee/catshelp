'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FosterHomeApplications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FosterHomeApplications.init({
    fosterHomeId: DataTypes.INTEGER,
    catshelpRepresentativeId: DataTypes.INTEGER,
    googleFormsSubmitDate: DataTypes.DATE,
    nonCatshelpAnimals: DataTypes.STRING
  }, {
    underscored: true,
    sequelize,
    modelName: 'FosterHomeApplications',
    tableName: 'foster_home_applications',
  });
  return FosterHomeApplications;
};