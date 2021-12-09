const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.STRING,
  country: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: DataTypes.STRING,
  ccName: DataTypes.STRING,
  ccNumber: DataTypes.STRING,
  ccExpiration: DataTypes.STRING,
  ccCvv: DataTypes.STRING,
});

module.exports = Order;
