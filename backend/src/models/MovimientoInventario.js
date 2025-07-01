const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MovimientoInventario = sequelize.define('MovimientoInventario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    inventario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'inventario',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Positivo para entradas, negativo para salidas'
    },
    stock_anterior: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_nuevo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'movimientos_inventario',
    timestamps: false,
    indexes: [
      {
        fields: ['inventario_id']
      },
      {
        fields: ['tipo']
      },
      {
        fields: ['fecha']
      },
      {
        fields: ['usuario_id']
      }
    ]
  });

  // Asociaciones
  MovimientoInventario.associate = (models) => {
    // Un movimiento pertenece a un inventario
    MovimientoInventario.belongsTo(models.Inventario, {
      foreignKey: 'inventario_id',
      as: 'inventario'
    });

    // Un movimiento es realizado por un usuario
    MovimientoInventario.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });

    // Un movimiento puede estar relacionado con un pedido
    MovimientoInventario.belongsTo(models.Pedido, {
      foreignKey: 'pedido_id',
      as: 'pedido'
    });
  };

  // Hooks para actualizar el inventario automáticamente
  MovimientoInventario.beforeCreate(async (movimiento, options) => {
    const { Inventario } = sequelize.models;
    
    // Obtener el inventario actual
    const inventario = await Inventario.findByPk(movimiento.inventario_id);
    
    if (!inventario) {
      throw new Error('Inventario no encontrado');
    }

    // Guardar stock anterior
    movimiento.stock_anterior = inventario.stock_actual;
    
    // Calcular nuevo stock
    let nuevoStock;
    switch (movimiento.tipo) {
      case 'entrada':
        nuevoStock = inventario.stock_actual + Math.abs(movimiento.cantidad);
        movimiento.cantidad = Math.abs(movimiento.cantidad);
        break;
      case 'salida':
        nuevoStock = inventario.stock_actual - Math.abs(movimiento.cantidad);
        movimiento.cantidad = -Math.abs(movimiento.cantidad);
        break;
      case 'ajuste':
        // Para ajustes, la cantidad puede ser el nuevo stock o la diferencia
        if (movimiento.stock_nuevo !== undefined) {
          nuevoStock = movimiento.stock_nuevo;
          movimiento.cantidad = nuevoStock - inventario.stock_actual;
        } else {
          nuevoStock = inventario.stock_actual + movimiento.cantidad;
        }
        break;
      default:
        throw new Error('Tipo de movimiento no válido');
    }

    // Validar que el stock no sea negativo
    if (nuevoStock < 0) {
      throw new Error(`Stock insuficiente. Stock actual: ${inventario.stock_actual}, Cantidad solicitada: ${Math.abs(movimiento.cantidad)}`);
    }

    movimiento.stock_nuevo = nuevoStock;
  });

  MovimientoInventario.afterCreate(async (movimiento, options) => {
    const { Inventario } = sequelize.models;
    
    // Actualizar el stock en el inventario
    await Inventario.update(
      { stock_actual: movimiento.stock_nuevo },
      { where: { id: movimiento.inventario_id } }
    );
  });

  // Métodos estáticos
  MovimientoInventario.crearMovimiento = async function(data, transaction = null) {
    const options = transaction ? { transaction } : {};
    
    try {
      // Si no se proporcionan stock_anterior y stock_nuevo, calcularlos
      if (!data.stock_anterior || !data.stock_nuevo) {
        const { Inventario } = sequelize.models;
        const inventario = await Inventario.findByPk(data.inventario_id);
        
        if (!inventario) {
          throw new Error('Inventario no encontrado');
        }

        data.stock_anterior = inventario.stock_actual;
        
        switch (data.tipo) {
          case 'entrada':
            data.stock_nuevo = data.stock_anterior + Math.abs(data.cantidad);
            break;
          case 'salida':
            data.stock_nuevo = data.stock_anterior - Math.abs(data.cantidad);
            break;
          case 'ajuste':
            data.stock_nuevo = data.cantidad;
            break;
        }
      }

      const movimiento = await this.create(data, options);
      
      // Actualizar el stock en el inventario
      await sequelize.models.Inventario.update(
        { stock_actual: data.stock_nuevo },
        { where: { id: data.inventario_id }, ...options }
      );
      
      // Cargar el movimiento con sus relaciones
      return await this.findByPk(movimiento.id, {
        include: [
          { 
            model: sequelize.models.Inventario, 
            as: 'inventario',
            include: [
              { model: sequelize.models.Producto, as: 'producto' },
              { model: sequelize.models.Sucursal, as: 'sucursal' }
            ]
          },
          { model: sequelize.models.Usuario, as: 'usuario' }
        ],
        ...options
      });
    } catch (error) {
      throw new Error(`Error al crear movimiento: ${error.message}`);
    }
  };

  MovimientoInventario.getMovimientosPorFecha = async function(fechaInicio, fechaFin, filtros = {}) {
    const where = {
      fecha: {
        [sequelize.Op.between]: [fechaInicio, fechaFin]
      }
    };

    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.inventario_id) where.inventario_id = filtros.inventario_id;
    if (filtros.usuario_id) where.usuario_id = filtros.usuario_id;

    return await this.findAll({
      where,
      include: [
        { 
          model: sequelize.models.Inventario, 
          as: 'inventario',
          include: [
            { model: sequelize.models.Producto, as: 'producto' },
            { model: sequelize.models.Sucursal, as: 'sucursal' }
          ]
        },
        { model: sequelize.models.Usuario, as: 'usuario' }
      ],
      order: [['fecha', 'DESC']]
    });
  };

  MovimientoInventario.getResumenMovimientos = async function(fechaInicio, fechaFin) {
    const movimientos = await this.findAll({
      where: {
        fecha: {
          [sequelize.Op.between]: [fechaInicio, fechaFin]
        }
      },
      attributes: [
        'tipo',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_cantidad'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_movimientos']
      ],
      group: ['tipo']
    });

    return movimientos;
  };

  return MovimientoInventario;
};
