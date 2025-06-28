// backend/src/models/PreferenciasCliente.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const PreferenciasCliente = sequelize.define('PreferenciasCliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    categoria_preferida_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    marca_preferida_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    metodo_pago_preferido: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dia_preferido_entrega: {
      type: DataTypes.ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo'),
      allowNull: true
    },
    horario_preferido_entrega: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    acepta_promociones: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    acepta_email_marketing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    acepta_sms_marketing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'preferencias_cliente',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PreferenciasCliente.associate = function(models) {
    PreferenciasCliente.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    PreferenciasCliente.belongsTo(models.Categoria, { foreignKey: 'categoria_preferida_id', as: 'categoria_preferida' });
    PreferenciasCliente.belongsTo(models.Marca, { foreignKey: 'marca_preferida_id', as: 'marca_preferida' });
  };

  return PreferenciasCliente;
};