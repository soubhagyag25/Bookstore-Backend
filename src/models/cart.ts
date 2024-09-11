// models/cart.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Book } from './books';
import { User } from './user';

interface CartAttributes {
  id: number;
  bookId: number;
  userId: number;
  quantity: number;
  price: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: number;
  public bookId!: number;
  public userId!: number;
  public quantity!: number;
  public price!: number;

  // Include association types
  public readonly book?: Book;
  public readonly user?: User;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'cart',
  timestamps: true,
});

// Setting up associations
Cart.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { Cart };
