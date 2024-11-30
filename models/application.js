// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Application extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Application.init({
//     userId: DataTypes.INTEGER,
//     jobId: DataTypes.INTEGER,
//     status: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Application',
//   });
//   return Application;
// };



const {DataTypes}= require('sequelize');
const {sequelize} = require('../middleware/config/db');
// const Todo = require('./Todo');
const User = require('./user')
const job = require('./job')
const Application = sequelize.define('applications',{

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email address is not valid.", // Custom error message
        },
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      required: true,
      validate: {
        isNumeric: true, // Ensures only numeric digits are entered
        len: [10, 10], // Ensures exactly 10 digits
      },
    },
    applicantID_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming 'Users' is the name of the users table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    
    companyID_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming 'Users' is the name of the users table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    
  }, {
    timestamps: true,
    
    }, { sequelize, modelName: 'applications' });
    
    User.hasMany(Application, { foreignKey: 'applicantID_user' });
    User.hasMany(Application, { foreignKey: 'companyID_user' });
Application.belongsTo(User, { foreignKey: 'applicantID_user' });
Application.belongsTo(job, { foreignKey: 'companyID_user' });


module.exports = Application;
