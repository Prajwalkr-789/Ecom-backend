const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  priceAtTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price of product when order was placed'
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Product name at time of order'
  }
});

module.exports = { Order, OrderItem };