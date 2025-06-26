const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

  ,
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  rut: {
    type: DataTypes.STRING(12),
    allowNull: true,
    unique: true
  },
  tipo_cliente: {
    type: DataTypes.ENUM('persona', 'empresa'),
    defaultValue: 'persona'
  },
  razon_social: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  giro: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otro', 'no_especifica'),
    defaultValue: 'no_especifica'
  },
  credito_disponible: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  credito_usado: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  descuento_personalizado: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  }







}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Usuario;