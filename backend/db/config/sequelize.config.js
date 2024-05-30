const { Sequelize, Op } = require("sequelize");

const sequelize = new Sequelize({
  // host: "localhost",
  host: "180.232.110.228",
  database: "erp_sbf",
  dialect: "mysql",
  username: "root",
  // password: "",
  password: "LIOyqn49725",
  timezone: "+08:00", // Asia/Manila timezone
  alter: true,
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((e) => {
    console.error("Database synchronization failed: " + e);
  });

module.exports = sequelize;
