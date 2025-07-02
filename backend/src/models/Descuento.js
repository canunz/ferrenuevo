const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Descuento = sequelize.define('Descuento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.ENUM('porcentaje', 'monto_fijo'),
      allowNull: false
    },
    valor: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('activa', 'inactiva'),
      allowNull: false,
      defaultValue: 'activa'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'descuentos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Descuento.associate = function(models) {
    Descuento.belongsTo(models.Producto, {
      foreignKey: 'producto_id',
      as: 'producto'
    });
  };

  return Descuento;
}; 