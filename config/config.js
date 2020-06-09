require('dotenv').config();
​
module.exports = {
  development: {
    username: process.env.LOCAL_USER,
    password: process.env.LOCAL_PASSWORD,
    database: process.env.DB_NAME,
    host: "localhost",
    dialect: "mysql",
    dialectModule: "mysql2"
  },
  test: {
    username: process.env.PRODDB_USER,
    password: process.env.PRODDB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.PRODDB_HOST,
    dialect: "mysql",
    dialectModule: "mysql2"
  },
  production: {
    username: process.env.PRODDB_USER,
    password: process.env.PRODDB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.PRODDB_HOST,
    dialect: "mysql",
    dialectModule: "mysql2"
  }
};