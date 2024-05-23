const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const PO_REJECT = sequelize.define("purchase_order_reject", {
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

  po_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = PO_REJECT;
