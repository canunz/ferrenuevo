const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Factura = sequelize.define('Factura', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_factura: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    fecha_emision: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    iva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagada', 'vencida', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Datos del cliente para la factura
    cliente_nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    cliente_rut: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cliente_direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cliente_email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cliente_telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'facturas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Método para generar número de factura automático
  Factura.generarNumeroFactura = async function() {
    const ultimaFactura = await this.findOne({
      order: [['numero_factura', 'DESC']]
    });
    
    let siguienteNumero = 1;
    if (ultimaFactura) {
      const ultimoNumero = parseInt(ultimaFactura.numero_factura.replace('FAC-', ''));
      siguienteNumero = ultimoNumero + 1;
    }
    
    return `FAC-${String(siguienteNumero).padStart(6, '0')}`;
  };

  // Método para calcular totales
  Factura.prototype.calcularTotales = function() {
    const subtotal = parseFloat(this.subtotal) || 0;
    const descuento = parseFloat(this.descuento) || 0;
    const iva = (subtotal - descuento) * 0.19; // 19% IVA
    const total = subtotal - descuento + iva;
    
    this.iva = iva;
    this.total = total;
    
    return { subtotal, descuento, iva, total };
  };

  // Asociaciones
  Factura.associate = function(models) {
    // Una factura pertenece a un pedido
    Factura.belongsTo(models.Pedido, {
      foreignKey: 'pedido_id',
      as: 'pedido'
    });

    // Una factura pertenece a un cliente
    Factura.belongsTo(models.Usuario, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });

    // Una factura puede tener múltiples detalles
    Factura.hasMany(models.DetalleFactura, {
      foreignKey: 'factura_id',
      as: 'detalles'
    });
  };

  return Factura;
}; 