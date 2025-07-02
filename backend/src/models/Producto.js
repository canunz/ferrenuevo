const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    codigo_sku: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ficha_tecnica: {
      type: DataTypes.JSON,
      allowNull: true
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    marca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'marcas',
        key: 'id'
      }
    },
    activo: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descuento: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Producto.associate = function(models) {
    // Un producto pertenece a una categoría
    Producto.belongsTo(models.Categoria, {
      foreignKey: 'categoria_id',
      as: 'categoria'
    });

    // Un producto pertenece a una marca
    Producto.belongsTo(models.Marca, {
      foreignKey: 'marca_id',
      as: 'marca'
    });

    // Un producto puede tener inventario en múltiples sucursales
    Producto.hasMany(models.Inventario, {
      foreignKey: 'producto_id',
      as: 'inventario'
    });

    // Un producto puede estar en múltiples detalles de pedido
    Producto.hasMany(models.DetallePedido, {
      foreignKey: 'producto_id',
      as: 'detalles_pedido'
    });

    // Un producto puede tener varios descuentos
    Producto.hasMany(models.Descuento, {
      foreignKey: 'producto_id',
      as: 'descuentos'
    });
  };

  return Producto;
};