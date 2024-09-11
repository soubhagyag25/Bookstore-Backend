import { Request, Response, NextFunction } from 'express';
import WishlistService from '../services/wishlist.service';

class WishlistController {
    private wishlistService: WishlistService;

    constructor() {
        this.wishlistService = new WishlistService();
    }

    //! Add a book to the wishlist for the authenticated user
    public async addToWishlist(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id!; // Extract userId from the JWT
            const { bookId } = req.body;
            if (!bookId) {
                return res.status(400).json({ message: 'Book ID is required' });
            }

            await this.wishlistService.addToWishlist(userId, bookId);
            res.status(200).json({ message: 'Book added to wishlist' });
        } catch (error) {
            next(error);
        }
    }

    // Remove a book from the wishlist
    public async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
        try {
            const { bookId } = req.body;
            const userId = req.user?.id!;
            await this.wishlistService.removeFromWishlist(bookId, userId);
            res.status(200).json({ message: 'Book removed from wishlist' });
        } catch (error) {
            next(error);
        }
    }

    //! Admin: View all books in the wishlist by all users
    public async getAllWishlists(req: Request, res: Response, next: NextFunction) {
        try {
            const wishlists = await this.wishlistService.getAllWishlists();
            res.status(200).json(wishlists);
        } catch (error) {
            next(error);
        }
    }

    //! View the user's wishlist
    public async viewWishlist(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id!;
            const wishlist = await this.wishlistService.viewWishlist(userId);
            res.status(200).json(wishlist);
        } catch (error) {
            next(error);
        }
    }
}

export default WishlistController;
