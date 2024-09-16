import Order from '../models/orders';
import { Cart } from '../models/cart';
import { Book } from '../models/books';

class OrderService {
    public getAllOrders = async () => {
        return Order.findAll(); 
    };
      //! To Place The Order with Total Amount
      async placeOrder(userId: number) {
        const cartItems = await Cart.findAll({ where: { userId } });
        if (cartItems.length === 0) throw new Error('Cart is empty');

        const orders: any[] = [];
        let total = 0;

        for (const item of cartItems) {
            const book = await Book.findByPk(item.bookId);
            if (!book || book.qty < item.quantity) throw new Error(`Not enough quantity for book ${item.bookId}`);

            await Order.create({ bookId: item.bookId, userId });
            total += item.price;

            book.qty -= item.quantity;
            await book.save();

            orders.push({
                bookId: item.bookId,
                bookName: book.bookName,
                quantity: item.quantity,
                total: item.price,
            });

            await item.destroy();
        }

        return {
            message: 'Order placed successfully',
            orders,
            total,
        };
    }
    //! To View All Orders for a User
    async viewOrders(userId: number) {
        const orders = await Order.findAll({ where: { userId } });

        if (orders.length === 0) {
            return { message: 'No orders found' };
        }

        return orders.map(order => ({
            orderId: order.id,
            bookId: order.bookId,
        }));
    }

}

export default OrderService;
