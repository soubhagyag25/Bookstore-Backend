import express, { IRouter } from 'express';
import userRoute from './user.route';
import BookRoutes from './book.routes';

const router = express.Router();
router.use(express.json());

const routes = (): IRouter => {
  router.get('/home', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', new userRoute().getRoutes());
  router.use('/books', new BookRoutes().router);

  return router;
};

export default routes;