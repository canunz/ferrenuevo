// Migración para agregar el campo 'descuento' a la tabla productos
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('productos', 'descuento', {
      type: Sequelize.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('productos', 'descuento');
  }
}; 