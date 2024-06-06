const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Board = sequelize.define("board_to", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_to: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
});

module.exports = Board;
