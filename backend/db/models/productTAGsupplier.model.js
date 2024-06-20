const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const productTAGsupplier = sequelize.define("product_tag_supplier", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supplier_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = productTAGsupplier;
