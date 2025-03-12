'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.FosterHome)
      models.FosterHome.hasOne(User, {
        foreignKey: "foster_home_id",
        onDelete: "CASCADE",
      })
      // define association here
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    identityCode: DataTypes.STRING,
    citizenship: DataTypes.STRING,
    blacklisted: DataTypes.BOOLEAN,
    blacklistedReason: DataTypes.TEXT,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};