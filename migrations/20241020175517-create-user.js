'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM("admin","candidates", "Company"),
        type: Sequelize.STRING,
        required: true,
      },
      validDocument:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactInfo:{
        type:Sequelize.STRING(10),
        allowNull:true,
      
      },
      companyName:{
        type:Sequelize.STRING,
        allowNull:true,
      },
      address:{
        type:Sequelize.STRING,
        allowNull:true,
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};