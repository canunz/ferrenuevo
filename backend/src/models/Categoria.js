module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'categorias',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Categoria.associate = function(models) {
    Categoria.hasMany(models.PreferenciasCliente, { foreignKey: 'categoria_preferida_id', as: 'preferenciasClientes' });
  };

  return Categoria;
};