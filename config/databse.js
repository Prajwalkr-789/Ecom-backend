const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
   ssl: {
      require: true,
      rejectUnauthorized: false  // Important for self-signed certs like in Neon
    },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate()
  .then(() => console.log("Connected to Neon Postgres"))
  .catch(err => console.error("Connection failed", err));

module.exports = sequelize;