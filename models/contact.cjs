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
      Contact.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      Contact.hasMany(models.ContactNotification, {
        sourceKey: "id",
        foreignKey: "contact_id",
        as: "contact_notifications",
      });
    }
  }
  Contact.init({
    userId: DataTypes.INTEGER,
    contactType: DataTypes.INTEGER,
    value: DataTypes.STRING,
    preferredContactMethod: DataTypes.BOOLEAN
  }, {
    underscored: true,
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
  });
  return Contact;
};