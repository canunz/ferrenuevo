const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cupon = sequelize.define('Cupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('porcentaje', 'monto_fijo'),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
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
    type: DataTypes.ENUM('activo', 'inactivo', 'usado', 'vencido'),
    defaultValue: 'activo'
  },
  usos_totales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  usos_limite: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  usuario_asignado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'cupones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['codigo'] },
    { fields: ['estado'] },
    { fields: ['usuario_asignado_id'] }
  ]
});

Cupon.associate = (models) => {
  Cupon.belongsTo(models.Usuario, {
    foreignKey: 'usuario_asignado_id',
    as: 'usuario'
  });
};

module.exports = Cupon; 