'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ContactNotification.belongsTo(models.Contact, {
        foreignKey: "contact_id",
        onDelete: "CASCADE",
      });
      models.Contact.hasMany(ContactNotification, {
        sourceKey: "id",
        foreignKey: "contact_id",
        as: "contact_notifications",
      });
    }
  }
  ContactNotification.init({
    contactId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    sent: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ContactNotification',
    tableName: 'contact_notifications',
  });
  return ContactNotification;
};