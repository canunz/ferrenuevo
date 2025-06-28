// backend/src/models/DireccionEnvio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DireccionEnvio = sequelize.define('DireccionEnvio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  alias: {
    type: DataTypes.STRING(50),
    defaultValue: 'Principal'
  },
  nombre_receptor: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono_receptor: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  depto_oficina: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  comuna: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo_postal: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  instrucciones_entrega: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  es_principal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'direcciones_envio',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = DireccionEnvio;