require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "recipexchange",
    host: "localhost",
    dialect: "mysql",
  },
  test: {
    username: process.env.PRODDB_USER,
    password: process.env.PRODDB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.PRODDB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.PRODDB_USER,
    password: process.env.PRODDB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.PRODDB_HOST,
    dialect: "mysql",
  }
};