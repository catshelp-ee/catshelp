'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RevokedToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RevokedToken.init({
    token: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
  }, {
    underscored: true,
    sequelize,
    modelName: 'RevokedToken',
    tableName: 'revoked_tokens',
  });
  return RevokedToken;
};