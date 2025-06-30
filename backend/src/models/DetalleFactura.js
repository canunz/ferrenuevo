const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DetalleFactura = sequelize.define('DetalleFactura', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    factura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facturas',
        key: 'id'
      }
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    iva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    // Datos del producto al momento de la facturación
    producto_nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    producto_codigo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    producto_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'detalles_factura',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Método para calcular totales del detalle
  DetalleFactura.prototype.calcularTotales = function() {
    const cantidad = parseInt(this.cantidad) || 0;
    const precioUnitario = parseFloat(this.precio_unitario) || 0;
    const descuento = parseFloat(this.descuento) || 0;
    
    const subtotal = cantidad * precioUnitario;
    const subtotalConDescuento = subtotal - descuento;
    const iva = subtotalConDescuento * 0.19; // 19% IVA
    const total = subtotalConDescuento + iva;
    
    this.subtotal = subtotal;
    this.iva = iva;
    this.total = total;
    
    return { subtotal, descuento, iva, total };
  };

  // Asociaciones
  DetalleFactura.associate = function(models) {
    // Un detalle pertenece a una factura
    DetalleFactura.belongsTo(models.Factura, {
      foreignKey: 'factura_id',
      as: 'factura'
    });

    // Un detalle pertenece a un producto
    DetalleFactura.belongsTo(models.Producto, {
      foreignKey: 'producto_id',
      as: 'producto'
    });
  };

  return DetalleFactura;
}; 