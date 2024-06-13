const { Sequelize, Op } = require("sequelize");

const sequelize = new Sequelize({
  host: "172.16.3.131",
  database: "erp_sbf",
  dialect: "mysql",
  username: "root",
  password: "LIOyqn49725",
  timezone: "+08:00",
  alter: false,
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
