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
      ContactNotification.belongsTo(models.Contact, {
        foreignKey: "contact_id",
        onDelete: "CASCADE",
      });
    }
  }
  ContactNotification.init({
    contactId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    sent: DataTypes.BOOLEAN
  }, {
    underscored: true,
    sequelize,
    modelName: 'ContactNotification',
    tableName: 'contact_notifications',
  });
  return ContactNotification;
};