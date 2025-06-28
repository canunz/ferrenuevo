module.exports = (sequelize, DataTypes) => {
  const Pago = sequelize.define('Pago', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    metodo_pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    referencia_externa: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'pagos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Pago;
};