import { Cart } from '../models/cart';
import { Book } from '../models/books';

class CartService {

    //! To add an item to cart
    async addToCart(cartData: { bookId: number; quantity: number; userId: number }) {
        const { bookId, quantity, userId } = cartData;
        const book = await Book.findByPk(bookId);
        if (!book) throw new Error('Book not found');

        const cartItem = await Cart.findOne({ where: { bookId, userId } });
        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.price = book.price * cartItem.quantity;
            await cartItem.save();
        } else {
            await Cart.create({ bookId, userId, quantity, price: book.price * quantity });
        }
    }

    //! To remove an item from the cart
    async removeFromCart(userId: number, bookId: number) {
        const cartItem = await Cart.findOne({ where: { bookId, userId } });
        if (!cartItem) {
            throw new Error('Item not found in cart');
        }
        await cartItem.destroy();
    }

    //! To View All Items in the Cart for a User
    async viewCart(userId: number) {
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [
                { model: Book, as: 'book', attributes: ['bookName', 'price'] }
            ]
        });

        if (cartItems.length === 0) {
            return { message: 'Cart is empty' };
        }

        return cartItems.map(item => ({
            bookId: item.bookId,
            bookName: item.book?.bookName ?? 'Unknown', // Handle cases where book might be null
            quantity: item.quantity,
            price: item.price,
        }));
    }
}

export default CartService;
