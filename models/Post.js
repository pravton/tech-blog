const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create Post Model
class Post extends Model {}

Post.init(
  {
    // id column
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // title column
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // description column
    content: {
      type: DataTypes.TEXT,
      validate: {
        len: [1]
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;