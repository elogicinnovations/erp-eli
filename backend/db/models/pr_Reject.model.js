const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const PR_REJECT = sequelize.define("purchase_req_reject", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  masterlist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = PR_REJECT;
