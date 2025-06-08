const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_pedido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'preparando', 'listo', 'enviado', 'entregado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodo_entrega: {
    type: DataTypes.ENUM('retiro_tienda', 'despacho_domicilio'),
    allowNull: false,
    defaultValue: 'retiro_tienda'
  },
  direccion_entrega: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Pedido;