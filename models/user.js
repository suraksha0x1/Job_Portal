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
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/db");
// // const Todo = require('./Todo');
// const User = sequelize.define(
//   "Users",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },

//     name: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: {
//           msg: "Email address is not valid.", // Custom error message
//         },
//       },
//     },
//     role: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       reuired: true,
//       enum: ["admin", "candidates", "Company"],
//     },
//     validDocument: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       reuired: true,
//     },
//     companyName: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       reuired: true,
//     },
//     address: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       reuired: true,
//     },
//     contactInfo: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       required: true,
//       validate: {
//         isNumeric: true, // Ensures only numeric digits are entered
//         len: [10, 10], // Ensures exactly 10 digits
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


// module.exports = User;


const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "Users",
  {
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email address is not valid.",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [["admin", "candidates", "Company"]],
          msg: "Role must be one of 'admin', 'candidates', or 'Company'.",
        },
      },
    },
    validDocument: {
      type: DataTypes.STRING,
      allowNull: true, // Only required for candidates
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true, // Only required for companies
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true, // Only required for companies
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: true, // Only required for companies
      validate: {
        isNumeric: true,
        len: [10, 10], // Ensure exactly 10 digits
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
