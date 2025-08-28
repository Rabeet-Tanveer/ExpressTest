'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    static associate(models) {
      Subcategory.belongsTo(models.Category, {foreignKey: 'categoryId', as: 'category'});
      Subcategory.hasMany(models.Product, { foreignKey: 'subcategoryId', as: 'products'});
    }
  }
  Subcategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    categoryId: {
      type:DataTypes.INTEGER,
      allowNull: false
  }
  },
  {
    sequelize,
    modelName: 'Subcategory',
  }
);
  return Subcategory;
};