import express, { IRouter } from 'express';
import UserController from '../controllers/user.controller';
import { ResetAuth_Admin, ResetAuth_User } from '../middlewares/auth.middleware';
import UserValidator from '../validators/user.validator';

class UserRoutes {
  private userController = new UserController();
  private userValidator = new UserValidator();
  private router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //! Route to Sign Up for a new USER
    this.router.post('/signup', this.userValidator.validateSignUp, this.userController.SignUp);

    //! Route to sign up as admin
    this.router.post('/signupAdmin', this.userValidator.validateSignUp, this.userController.SignUpAdmin);

    //! Route for user login
    this.router.post('/login', this.userValidator.validateLogin, this.userController.loginUser);

    //! Route for admin login
    this.router.post('/loginAdmin', this.userValidator.validateLogin, this.userController.loginAdmin);

    //! Forget Password Route
    this.router.post('/forget-password', this.userValidator.validateForgetPassword, this.userController.forgetPassword);

    //! Forget Password Route
    this.router.post('/forget-passwordAdmin', this.userValidator.validateForgetPassword, this.userController.forgetPasswordAdmin);

    //! Reset Password with Login Token Route
    this.router.post('/reset-password', ResetAuth_User, this.userValidator.validateResetPassword, this.userController.resetPasswordWithToken);

    //! Reset Password with Login Token Route
    this.router.post('/reset-passwordAdmin', ResetAuth_Admin, this.userValidator.validateResetPassword, this.userController.resetPasswordWithTokenAdmin);
  }

  public getRoutes(): IRouter {
    return this.router;
  }
}

export default UserRoutes;
