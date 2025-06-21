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
      User.hasOne(models.FosterHome, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        as: "foster_home",
      })
      User.hasOne(models.FosterHome, {
        foreignKey: "catshelp_mentor_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Contact, {
        sourceKey: "id",
        foreignKey: "user_id",
        as: "contacts",
      });
      User.hasMany(models.UserRole, {
        sourceKey: "id",
        foreignKey: "user_id",
        as: "user_roles",
      });
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    identityCode: DataTypes.STRING,
    citizenship: DataTypes.STRING,
    blacklisted: DataTypes.BOOLEAN,
    blacklistedReason: DataTypes.TEXT,
    createdAt: DataTypes.DATE
  }, {
    underscored: true,
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
};