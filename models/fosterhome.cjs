'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FosterHome extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FosterHome.belongsTo(models.User);
      FosterHome.hasOne(models.User, {
        foreignKey: "foster_home_id",
        onDelete: "CASCADE",
      });
      FosterHome.hasMany(models.AnimalToFosterHome, {
        sourceKey: "id",
        foreignKey: "foster_home_id",
        as: "foster_homes",
      });
    }
  }
  FosterHome.init({
    userId: DataTypes.INTEGER,
    location: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    catshelpMentorId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FosterHome',
    tableName: 'foster_homes',
  });
  return FosterHome;
};