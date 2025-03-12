'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Contact.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      models.User.hasMany(Contact, {
        sourceKey: "id",
        foreignKey: "user_id",
        as: "contacts",
      });
    }
  }
  Contact.init({
    userId: DataTypes.INTEGER,
    contactType: DataTypes.INTEGER,
    value: DataTypes.STRING,
    preferredContactMethod: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
  });
  return Contact;
};