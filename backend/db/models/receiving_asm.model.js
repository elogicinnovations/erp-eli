const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Receiving_Asm = sequelize.define("receiving_asm", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  canvassed_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiving_po_id:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  received_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  remaining_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  set_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  picture: {
    type: DataTypes.BLOB("long"),
    allowNull: true,
    get() {
      const value = this.getDataValue("product_image");
      return value ? value.toString("base64") : null;
    },
    set(value) {
      this.setDataValue("product_image", Buffer.from(value, "base64"));
    },
  }
});

module.exports = Receiving_Asm;
