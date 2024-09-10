import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../interfaces/user.dto';

class UserController {
  public UserService = new userService();
  
  //! Sign Up User
  public SignUp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.UserService.SignUp(req.body);
      const userData = data.toJSON();
      delete userData.password;

      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: userData,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  //! Sign Up Admin
  public SignUpAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.UserService.SignUp(req.body, true);  // Pass 'true' for admin sign-up
      const adminData = data.toJSON();
      delete adminData.password;

      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: adminData,
        message: 'Admin created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  //! Login User
  public loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, password } = req.body;
      const user: UserDTO = await this.UserService.loginUser(email, password);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: user,
        message: 'Login successful',
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  };

  //! Login Admin 
  public loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, password } = req.body;
      const admin: UserDTO = await this.UserService.loginAdmin(email, password);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: admin,
        message: 'Admin login successful',
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  };

  //! Forget Password
  public forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      const user = await this.UserService.findUserByEmail(email);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Password reset token generated',
        data: user.reset_token,
      });
    } catch (error) {
      next(error);
    }
  };

  //! Reset Password Endpoint
  public resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Token missing' });
    }

    const { newPassword } = req.body;

    try {
      const decoded: any = jwt.verify(token, process.env.RESET_SECRET_KEY!);
      await this.UserService.updateUserPassword(decoded.id, newPassword);

      return res.status(HttpStatus.OK).json({ message: 'Password has been changed successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid or expired token' });
    }
  };
  //! Forget Password for Admin
  public forgetPasswordAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      const admin = await this.UserService.findAdminByEmail(email);

      if (!admin) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Admin not found' });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Password reset token generated',
        data: admin.reset_token,
      });
    } catch (error) {
      next(error);
    }
  };

  //! Reset Password for Admin
  public resetPasswordWithTokenAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Token missing' });
    }

    const { newPassword } = req.body;

    try {
      const decoded: any = jwt.verify(token, process.env.RESET_SECRET_KEY_ADMIN!);
      await this.UserService.updateAdminPassword(decoded.id, newPassword);

      return res.status(HttpStatus.OK).json({ message: 'Password has been changed successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid or expired token' });
    }
  };
}

export default UserController;
