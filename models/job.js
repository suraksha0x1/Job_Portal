// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Job extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Job.init({
//     title: DataTypes.STRING,
//     description: DataTypes.TEXT,
//     salary: DataTypes.DECIMAL,
//     company: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Job',
//   });
//   return Job;
// };


// module.exports = (sequelize, DataTypes) => {
//   const Job = sequelize.define('Job', {
//     title: DataTypes.STRING,
//     description: DataTypes.TEXT,
//     salary: DataTypes.DECIMAL,
//     company: DataTypes.STRING,
//   });

//   Job.associate = (models) => {
//     Job.hasMany(models.Application, { foreignKey: 'jobId' });
//   };

//   return Job;
// };
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   User.init({
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     role: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     role: DataTypes.STRING,
//   });

//   User.associate = (models) => {
//     User.hasMany(models.Application, { foreignKey: 'userId' });
//   };

//   return User;
// };
// const {DataTypes}= require('sequelize');
// const {sequelize} = require('../middleware/config/db');
// // const Todo = require('./Todo');
// const User = require('./user')
// const job = sequelize.define('jobs',{

//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },

//     title: {
//         type: DataTypes.STRING,
//         unique:true,
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         minilength: [50,],
//         maxlength: [350,],
//     },
//     salary: {
//         type: DataTypes.NUMBER,
//         allowNull: false,
//         minilength:[4,],
//         maxlength: [9,],
//     },
//     companyId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: User, // Model the foreign key refers to
//           key: 'id'    // Column in the User model
//         }
//       }
//     }, { sequelize, modelName: 'jobs' });
    
//     User.hasMany(job, { foreignKey: 'companyId' });
// job.belongsTo(User, { foreignKey: 'companyId' });

// module.exports = job;


const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user");

const Job = sequelize.define(
  "jobs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 350], // Minimum and maximum length for description
      },
    },
    salary: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 1000, // Minimum salary
        max: 99999999, // Maximum salary
      },
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Relationships
User.hasMany(Job, { foreignKey: "companyId" });
Job.belongsTo(User, { foreignKey: "companyId" });

module.exports = Job;
