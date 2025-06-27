module.exports = (sequelize, DataTypes) => {
  const Inventario = sequelize.define('Inventario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sucursal_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    stock_maximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'inventario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Inventario.associate = function(models) {
    Inventario.belongsTo(models.Producto, { foreignKey: 'producto_id', as: 'producto' });
  };

  return Inventario;
};