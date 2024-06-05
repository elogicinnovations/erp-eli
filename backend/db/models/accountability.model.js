const sequelize = require('../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Accountability = sequelize.define('accountability', {
    accountability_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      issued_approve_prd_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
});

module.exports = Accountability;