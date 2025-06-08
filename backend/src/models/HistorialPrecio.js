const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialPrecio = sequelize.define('HistorialPrecio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  divisa_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: false
  },
  fuente: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Banco Central de Chile'
  }
}, {
  tableName: 'historial_precios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = HistorialPrecio;