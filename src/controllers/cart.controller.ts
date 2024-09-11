import { Request, Response, NextFunction } from 'express';
import CartService from '../services/cart.service';

class CartController {
    private cartService: CartService;

    constructor() {
        this.cartService = new CartService();
    }
    //! To Add a Book into the Cart
    public addToCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookId, quantity } = req.body;
            if (!bookId || !quantity) {
                return res.status(400).json({ message: 'Book ID and quantity are required' });
            }
            await this.cartService.addToCart({ bookId, quantity, userId: req.user?.id! });
            res.status(200).json({ message: 'Book added to cart' });
        } catch (error) {
            next(error);
        }
    };
    //! To Remove a Book from the Cart
    public removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookId } = req.body;
            if (!bookId) {
                return res.status(400).json({ message: 'Book ID is required' });
            }
            await this.cartService.removeFromCart(req.user?.id!, bookId);
            res.status(200).json({ message: 'Book removed from cart' });
        } catch (error) {
            next(error);
        }
    };
    //! To View All the Cart Items
    public viewCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id!;
            const cartItems = await this.cartService.viewCart(userId);
            res.status(200).json(cartItems);
        } catch (error) {
            next(error);
        }
    };
}

export default CartController;
