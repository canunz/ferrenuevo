// backend/src/models/HistorialCompras.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const HistorialCompras = sequelize.define('HistorialCompras', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_compra: {
      type: DataTypes.DATE,
      allowNull: false
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    descuento_aplicado: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    puntos_ganados: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    nivel_satisfaccion: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario_compra: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'historial_compras',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  HistorialCompras.associate = function(models) {
    HistorialCompras.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  };

  return HistorialCompras;
};