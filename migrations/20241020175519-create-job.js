'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      salary: {
        type: Sequelize.DECIMAL
      },
  //     companyId: {
  //       type: Sequelize.INTEGER
  //     },
  //     createdAt: {
  //       allowNull: false,
  //       type: Sequelize.DATE
  //     },
  //     updatedAt: {
  //       allowNull: false,
  //       type: Sequelize.DATE
  //     }
  //   });
  companyId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jobs');
  }
};