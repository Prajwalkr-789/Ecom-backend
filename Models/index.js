const sequelize = require('../config/databse');
const User = require('../Models/user');
const Category = require('../Models/category');
const Product = require('../Models/product');
const Cart = require('../Models/cart');
const { Order, OrderItem } = require('../Models/order');

// Associations
User.hasMany(Cart);
Cart.belongsTo(User);

Product.hasMany(Cart);
Cart.belongsTo(Product);

Category.hasMany(Product);
Product.belongsTo(Category);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  Order,
  OrderItem
};