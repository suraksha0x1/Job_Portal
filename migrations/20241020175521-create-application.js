// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Applications', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       name: {
//         type: Sequelize.STRING
//       },
//       email: {
//         type: Sequelize.STRING
//       },
//       phone:{
//         type:Sequelize.STRING(10),
//         allowNull:true,},
        
//       applicantID_user: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'users', // assuming the 'users' table exists
//           key: 'id',
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE',
//       },
      
//       companyID_user: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'users', // assuming the 'users' table exists
//           key: 'id',
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE',
//       },
     

//       status: {
//         type: Sequelize.STRING
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Applications');
//   }
// };


'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'jobs', // References the 'jobs' table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      applicantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // References the 'Users' table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      companyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: 'Users', // assuming the 'users' table exists
                  key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
              },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending', // Default status
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Applications');
  },
};
