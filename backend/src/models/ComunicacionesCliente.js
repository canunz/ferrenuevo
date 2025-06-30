// backend/src/models/ComunicacionesCliente.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ComunicacionesCliente = sequelize.define('ComunicacionesCliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('email', 'sms', 'llamada', 'whatsapp', 'notificacion_app'),
      allowNull: false
    },
    asunto: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('enviado', 'leido', 'respondido', 'fallido'),
      defaultValue: 'enviado'
    },
    fecha_envio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fecha_lectura: {
      type: DataTypes.DATE,
      allowNull: true
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    campaign_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'comunicaciones_cliente',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  ComunicacionesCliente.associate = function(models) {
    ComunicacionesCliente.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  };

  return ComunicacionesCliente;
};