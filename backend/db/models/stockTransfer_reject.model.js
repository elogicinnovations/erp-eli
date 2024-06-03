const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const ST_REJECT = sequelize.define("stock_transfer_reject", {
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
  stocktransfer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ST_REJECT;
