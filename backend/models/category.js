'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Subcategory, {foreignKey: 'categoryId', as: 'subcategories'});
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, 
  {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};