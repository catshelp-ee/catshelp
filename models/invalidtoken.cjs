'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvalidToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InvalidToken.init({
    token: DataTypes.STRING,
    expiresAt: {
      type: DataTypes.DATE,
      field: "expires_at",
    },
  }, {
    sequelize,
    modelName: 'InvalidToken',
    tableName: 'invalid_tokens',
  });
  return InvalidToken;
};