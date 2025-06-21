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
      FosterHome.belongsTo(models.User, {
        as: "user",
      });
      FosterHome.hasMany(models.AnimalToFosterHome, {
        sourceKey: "id",
        foreignKey: "foster_home_id",
        as: "animal_links",
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
    underscored: true,
    sequelize,
    modelName: 'FosterHome',
    tableName: 'foster_homes',
  });
  return FosterHome;
};