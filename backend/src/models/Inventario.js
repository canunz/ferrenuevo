const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inventario = sequelize.define('Inventario', {
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
    sucursal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sucursales',
        key: 'id'
      }
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    stock_maximo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'inventario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['producto_id', 'sucursal_id']
      },
      {
        fields: ['stock_actual', 'stock_minimo']
      }
    ]
  });

  // Asociaciones
  Inventario.associate = (models) => {
    // Un inventario pertenece a un producto
    Inventario.belongsTo(models.Producto, {
      foreignKey: 'producto_id',
      as: 'producto'
    });

    // Un inventario pertenece a una sucursal
    Inventario.belongsTo(models.Sucursal, {
      foreignKey: 'sucursal_id',
      as: 'sucursal'
    });

    // Un inventario tiene muchos movimientos
    Inventario.hasMany(models.MovimientoInventario, {
      foreignKey: 'inventario_id',
      as: 'movimientos'
    });

    // Un inventario puede tener alertas
    Inventario.hasMany(models.AlertaStock, {
      foreignKey: 'inventario_id',
      as: 'alertas'
    });
  };

  // Métodos de instancia
  Inventario.prototype.estaEnStockBajo = function() {
    return this.stock_actual <= this.stock_minimo;
  };

  Inventario.prototype.estaAgotado = function() {
    return this.stock_actual === 0;
  };

  Inventario.prototype.getEstadoStock = function() {
    if (this.stock_actual === 0) return 'agotado';
    if (this.stock_actual <= this.stock_minimo) return 'bajo';
    if (this.stock_actual >= this.stock_maximo) return 'alto';
    return 'normal';
  };

  // Métodos estáticos
  Inventario.getProductosStockBajo = async function(sucursalId = null) {
    const where = sequelize.literal('stock_actual <= stock_minimo');
    const options = {
      where: where,
      include: [
        { model: sequelize.models.Producto, as: 'producto' },
        { model: sequelize.models.Sucursal, as: 'sucursal' }
      ]
    };

    if (sucursalId) {
      options.where = {
        [sequelize.Op.and]: [
          where,
          { sucursal_id: sucursalId }
        ]
      };
    }

    return await this.findAll(options);
  };

  return Inventario;
};