module.exports = (sequelize, DataTypes) => {
  const MovimientoInventario = sequelize.define('MovimientoInventario', {
    inventarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'egreso', 'ajuste'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});
  MovimientoInventario.associate = function(models) {
    MovimientoInventario.belongsTo(models.Inventario, { foreignKey: 'inventarioId' });
    // Si tienes modelo Usuario, puedes asociar aquí
    // MovimientoInventario.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  };
  return MovimientoInventario;
}; 