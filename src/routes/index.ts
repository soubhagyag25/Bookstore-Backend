import express, { IRouter } from 'express';
import userRoute from './user.route';
import BookRoutes from './book.routes';
import CartRoutes from './cart.route';
import OrderRoutes from './order.route';

const router = express.Router();
router.use(express.json());

const routes = (): IRouter => {
  router.get('/home', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', new userRoute().getRoutes());
  router.use('/books', new BookRoutes().router);
  router.use('/cart', new CartRoutes().router);
  router.use('/orders', new OrderRoutes().router); 

  return router;
};

export default routes;