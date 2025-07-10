module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('Pedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_pedido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'preparando', 'listo', 'enviado', 'entregado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
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
    costo_envio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    metodo_entrega: {
      type: DataTypes.ENUM('retiro_tienda', 'despacho_domicilio'),
      allowNull: false,
      defaultValue: 'retiro_tienda'
    },
    direccion_entrega: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Método para calcular totales del pedido
  Pedido.prototype.calcularTotales = function() {
    const subtotal = parseFloat(this.subtotal) || 0;
    const descuento = parseFloat(this.descuento) || 0;
    const iva = subtotal * 0.19; // 19% IVA
    const costoEnvio = this.metodo_entrega === 'despacho_domicilio' ? 5990 : 0;
    const total = subtotal + iva + costoEnvio - descuento;
    
    this.iva = iva;
    this.costo_envio = costoEnvio;
    this.total = total;
    
    return { subtotal, iva, descuento, costo_envio: costoEnvio, total };
  };

  // Asociaciones
  Pedido.associate = function(models) {
    Pedido.hasMany(models.Pago, { foreignKey: 'pedido_id', as: 'pagos' });
    Pedido.belongsTo(models.Usuario, { foreignKey: 'cliente_id', as: 'cliente' });
  };

  return Pedido;
};