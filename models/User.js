const { Model, DataTypes } = require('sequelize');
const sequelize = require('../controllers/api');
const bcrypt = require('bcrypt');

// Create the User model
class User extends Model {
  // setup the method to check the password
  checkPassword(loginPassword) {
    return bcrypt.compareSync(loginPassword, this.password);
  }
}

// Define the user table
User.init(
  {
    // define id column
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // username column
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // email address column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // minimum characters
        len: [8]
      }
    }
  },
  {
    hooks: {
      // Using the hook to hash the password
      async beforeCreate(userData) {
        userData.password = await bcrypt.hash(userData.password, 10);
        return userData;
      },
      sequelize,
      timestamps: false,
      freezeTableName: true,
      undersored: true,
      modelName: 'user'
    }
  }
);

module.exports = User;