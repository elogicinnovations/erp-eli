const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const IssuedProduct = sequelize.define("issued_product", {
  issued_product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
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

module.exports = IssuedProduct;
