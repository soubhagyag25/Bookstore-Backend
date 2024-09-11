import express, { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { adminAuth, userAuth } from '../middlewares/auth.middleware';

class OrderRoutes {
    public router: Router;
    private orderController: OrderController;

    constructor() {
        this.router = express.Router();
        this.orderController = new OrderController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //! Admin can view all orders
        this.router.get('/allOrders', adminAuth, this.orderController.getAllOrders.bind(this.orderController)); 
         //! User can place the order for the items in the cart
         this.router.post('/order', userAuth, this.orderController.placeOrder.bind(this.orderController));
         //! User can View His Orders
        this.router.get('/orders', userAuth, this.orderController.viewOrders.bind(this.orderController));
    }
}

export default OrderRoutes;
