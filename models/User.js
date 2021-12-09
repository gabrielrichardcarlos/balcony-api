const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
});

module.exports = User;
