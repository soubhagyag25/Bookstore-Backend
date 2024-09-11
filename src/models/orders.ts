import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Order extends Model {
    public id!: number;
    public bookId!: number;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'orders',
    }
);

export default Order;
