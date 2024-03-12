const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const MasterList = sequelize.define("masterlist", {
  col_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  col_roleID: {
    // Change the column name to col_roleID
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
  },
  col_Fname: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_address: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_phone: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: false,
  },
  col_email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    validate: {
      isEmail: true,
    },
  },
  col_Pass: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  col_status: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  user_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image: {
    type: DataTypes.BLOB("long"),
    allowNull: true,
    get() {
      const value = this.getDataValue("image");
      return value ? value.toString("base64") : null;
    },
    set(value) {
      this.setDataValue("image", Buffer.from(value, "base64"));
    },
  },
});

module.exports = MasterList;
