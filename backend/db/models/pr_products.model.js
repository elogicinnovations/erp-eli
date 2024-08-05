const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const PR_product = sequelize.define("purchase_req_product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPO: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
});

module.exports = PR_product;
