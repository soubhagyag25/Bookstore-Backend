import Wishlist from '../models/wishlist';
import { Book } from '../models/books';

class WishlistService {
    //! Add a book to the user's wishlist
    public async addToWishlist(userId: number, bookId: number) {
        const book = await Book.findByPk(bookId);
        if (!book) throw new Error('Book not found');

        // Check if it is already in wishlist
        const wishlistItem = await Wishlist.findOne({ where: { bookId, userId } });
        if (wishlistItem) throw new Error('Book already in wishlist');

        await Wishlist.create({ bookId, userId });
    }

    //! User can remove the books from wishlist
    public async removeFromWishlist(bookId: number, userId: number): Promise<void> {
        const wishlistItem = await Wishlist.findOne({ where: { bookId, userId } });
        if (!wishlistItem) throw new Error('Book not found in wishlist');

        await wishlistItem.destroy(); // Remove the book from the wishlist
    }

    //! Admin: Get all wishlist items across all users
    public async getAllWishlists() {
        return await Wishlist.findAll({
            include: [{ model: Book, attributes: ['name', 'author', 'price'] }],
        });
    }
    //! View user's wishlist
    public async viewWishlist(userId: number) {
        const wishlistItems = await Wishlist.findAll({
        where: { userId },
        include: [{model: Book,attributes: ['id', 'bookName', 'author', 'price'],}]
            }) as (Wishlist & { Book: Book })[]; // Type assertion to include Book
    
            // Format the response to include only necessary book details
            const formattedWishlist = wishlistItems.map(item => ({
                id: item.id,
                book: {
                    id: item.Book.id,
                    bookName: item.Book.bookName,
                    author: item.Book.author,
                    price: item.Book.price
                }
            }));
    
            return formattedWishlist;
        }
    
}

export default WishlistService;
