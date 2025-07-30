const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  priceAtTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price of product when added to cart'
  }
});

module.exports = Cart;