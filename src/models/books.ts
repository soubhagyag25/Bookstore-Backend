import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BookAttributes {
  id: number;
  bookName: string;
  author: string;
  qty: number;
  price: number;
  description: string;
  adminId: number;
}

interface BookCreationAttributes extends Optional<BookAttributes, 'id'> {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public bookName!: string;
  public author!: string;
  public qty!: number;
  public price!: number;
  public description!: string;
  public adminId!: number;
}

Book.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bookName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Book_Users',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Books',
  tableName: 'Books',
});

export { Book };
