// backend/src/models/SegmentacionClientes.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const SegmentacionClientes = sequelize.define('SegmentacionClientes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    criterios: {
      type: DataTypes.JSON,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'segmentacion_clientes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return SegmentacionClientes;
};