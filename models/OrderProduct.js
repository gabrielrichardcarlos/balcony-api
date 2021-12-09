const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const OrderProduct = sequelize.define('OrderProduct', {
  orderId: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
});

module.exports = OrderProduct;
