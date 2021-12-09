const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const Product = sequelize.define('Product', {
  identifier: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  price: DataTypes.FLOAT,
  image: DataTypes.STRING,
});

module.exports = Product;
