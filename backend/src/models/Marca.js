const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Marca = sequelize.define('Marca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activo: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'marcas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Marca;