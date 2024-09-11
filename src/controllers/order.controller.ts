import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/order.service';

class OrderController {
    private orderService = new OrderService();

    //! Admin can get all the Orders data from the orders table in the Database
    public getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await this.orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    };
    //! User can Place the orders of the items in the cart
    public placeOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.orderService.placeOrder(req.user?.id!);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
    //! User can view his orders 
    public viewOrders = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id!;
            const orders = await this.orderService.viewOrders(userId);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

export default OrderController;
