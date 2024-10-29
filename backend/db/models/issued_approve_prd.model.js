const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const IssuedApproveProd = sequelize.define("issued_approve_prd", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  inventory_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  issuance_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  quantity: {
    type: DataTypes.DOUBLE,
  },
});

module.exports = IssuedApproveProd;
