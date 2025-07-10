"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("direccion_envios", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      alias: {
        type: Sequelize.STRING(50),
        defaultValue: "Principal"
      },
      nombre_receptor: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      telefono_receptor: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      depto_oficina: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      comuna: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      region: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      codigo_postal: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      instrucciones_entrega: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      es_principal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("direccion_envios");
  }
}; 