const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const MasterData = db.define('master_data', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  init: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_default: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
}, {
  freezeTableName: true,
  timestamps: true
});

module.exports = { MasterData };