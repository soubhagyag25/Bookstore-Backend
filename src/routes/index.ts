//src>routes>index.ts
import express, { IRouter } from 'express';
import userRoute from './user.route';

const router = express.Router();
router.use(express.json());

const routes = (): IRouter => {
  router.get('/home', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', new userRoute().getRoutes());

  return router;
};

export default routes;