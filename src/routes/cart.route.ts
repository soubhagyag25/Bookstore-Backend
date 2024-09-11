// src/routes/cart.routes.ts
import express, { Router } from 'express';
import CartController from '../controllers/cart.controller';
import { userAuth } from '../middlewares/auth.middleware'; 

class CartRoutes {
    public router: Router;
    private cartController: CartController;

    constructor() {
        this.router = express.Router();
        this.cartController = new CartController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //! Endpoint to add a specific book to the cart with quantity
        this.router.post('/add', userAuth, this.cartController.addToCart.bind(this.cartController));
        //! Endpoint to remove a specific book from the cart
        this.router.post('/remove', userAuth, this.cartController.removeFromCart.bind(this.cartController));
        //! Endpoint to view all items in the cart
        this.router.get('/viewCart', userAuth, this.cartController.viewCart.bind(this.cartController));
    }
}

export default CartRoutes;
