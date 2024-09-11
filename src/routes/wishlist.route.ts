import express, { Router } from 'express';
import WishlistController from '../controllers/wishlist.controller';
import { userAuth, adminAuth } from '../middlewares/auth.middleware';

class WishlistRoutes {
    public router: Router;
    private wishlistController: WishlistController;

    constructor() {
        this.router = express.Router();
        this.wishlistController = new WishlistController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //! Route for user to add books to their wishlist
        this.router.post('/add', userAuth, this.wishlistController.addToWishlist.bind(this.wishlistController));

        //! Route for users to remove a book from the wishlist
        this.router.post('/remove', userAuth, this.wishlistController.removeFromWishlist.bind(this.wishlistController));

        //! Route for admin to view all wishlist items
        this.router.get('/admin/all', adminAuth, this.wishlistController.getAllWishlists.bind(this.wishlistController));

        //! Route for user to view his wishlist
        this.router.get('/view', userAuth, this.wishlistController.viewWishlist.bind(this.wishlistController));
    }
}

export default WishlistRoutes;
