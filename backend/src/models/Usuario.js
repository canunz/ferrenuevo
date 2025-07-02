const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rut: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Usuario.associate = function(models) {
    Usuario.belongsTo(models.Rol, { foreignKey: 'rol_id', as: 'rol' });
    Usuario.hasOne(models.DireccionEnvio, { foreignKey: 'usuario_id', as: 'direccionEnvio' });
    Usuario.hasMany(models.Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });
  };

  return Usuario;
};