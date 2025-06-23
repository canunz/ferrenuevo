const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Promocion = sequelize.define('Promocion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('porcentaje', 'monto_fijo', 'envio_gratis'),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'El valor del descuento (porcentaje o monto)'
  },
  monto_minimo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
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
    type: DataTypes.ENUM('activa', 'inactiva', 'programada', 'finalizada'),
    defaultValue: 'activa'
  },
  aplicable_a: {
    type: DataTypes.ENUM('todos', 'productos', 'categorias'),
    defaultValue: 'todos'
  },
  usos_totales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  usos_limite: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Null para usos ilimitados'
  }
}, {
  tableName: 'promociones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['codigo'] },
    { fields: ['estado'] },
    { fields: ['fecha_inicio', 'fecha_fin'] }
  ]
});

Promocion.associate = (models) => {
  Promocion.belongsToMany(models.Producto, {
    through: 'promocion_productos',
    foreignKey: 'promocion_id',
    otherKey: 'producto_id',
    as: 'productos'
  });
  Promocion.belongsToMany(models.Categoria, {
    through: 'promocion_categorias',
    foreignKey: 'promocion_id',
    otherKey: 'categoria_id',
    as: 'categorias'
  });
};

module.exports = Promocion;
