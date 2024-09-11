import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import {Book} from './books'; 
import {User} from './user'; 

interface WishlistAttributes {
    id: number;
    bookId: number;
    userId: number;
}

interface WishlistCreationAttributes extends Optional<WishlistAttributes, 'id'> {}

class Wishlist extends Model<WishlistAttributes, WishlistCreationAttributes> implements WishlistAttributes {
    public id!: number;
    public bookId!: number;
    public userId!: number;
}

Wishlist.init({
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
        onDelete: 'CASCADE', // Ensure wishlist item is deleted if the book is deleted
        onUpdate: 'CASCADE', // Ensure changes to the book's ID propagate
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE', // Ensure wishlist item is deleted if the user is deleted
        onUpdate: 'CASCADE', // Ensure changes to the user's ID propagate
    },
}, {
    sequelize,
    tableName: 'wishlist',
});
//associations
Wishlist.belongsTo(Book, { foreignKey: 'bookId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });


export default Wishlist;
