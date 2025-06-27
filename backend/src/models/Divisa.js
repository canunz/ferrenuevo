module.exports = (sequelize, DataTypes) => {
  const Divisa = sequelize.define('Divisa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    simbolo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'divisas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Divisa;
};