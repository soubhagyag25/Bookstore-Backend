import bcrypt from 'bcrypt';
import { hash } from 'bcrypt';
import {User} from '../models/user'; 
import { IUser } from '../interfaces/user.interface'; 
import { UserDTO } from '../interfaces/user.dto';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/EmailSender';

class UserService {

  //! Sign Up or Creating a new User/Admin
  public SignUp = async (body: IUser, isAdmin: boolean = false) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    try {
      const user = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'user',  // Assign role based on sign-up type
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user.');
    }
  };

  //! Login User
  public loginUser = async (email: string, password: string): Promise<UserDTO> => {
    const user = await User.findOne({ where: { email, role: 'user' } }); // Ensure role is 'user'
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY_USER!,
      { expiresIn: '1h' }
    );

    return {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      token: token,
      role: user.role,
    };
  };

  //! Login Admin
  public loginAdmin = async (email: string, password: string): Promise<UserDTO> => {
    const user = await User.findOne({ where: { email, role: 'admin' } }); // Ensure role is 'admin'
    if (!user) {
      throw new Error('Admin not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY_ADMIN!,
      { expiresIn: '1h' }
    );

    return {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      token: token,
      role: user.role,
    };
  };

  //! Finding a User by Email -------- Forget Password
  public findUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email, role: 'user' } });  // Ensure role is 'user'
    if (!user) {
      return null; //--> Returning Null if user does not exist
    }
    const reset_token = jwt.sign( //--> Generating a token if user exists
      { id: user.id },
      process.env.RESET_SECRET_KEY_USER!,
      { expiresIn: '1h' }
    );
    await sendEmail(user.email, reset_token, user.firstName);

    return { reset_token }; // Returning it for testing purpose
  };

  
  //! Update User's Password
  public updateUserPassword = async (userId: string, newPassword: string) => {
    const hashedPassword = await hash(newPassword, 10);
    return User.update({ password: hashedPassword }, { where: { id: userId, role: 'user' } }); // Ensure role is 'user'
  };

  //! Forget Password for Admin
  public findAdminByEmail = async (email: string) => {
    const admin = await User.findOne({ where: { email, role: 'admin' } }); // Ensure role is 'admin'
    if (!admin) {
      return null;
    }
    const reset_token = jwt.sign(
      { id: admin.id },
      process.env.RESET_SECRET_KEY_ADMIN!,
      { expiresIn: '1h' }
    );
    await sendEmail(admin.email, reset_token, admin.firstName);

    return { reset_token };
  };

  //! Update Admin's Password
  public updateAdminPassword = async (adminId: string, newPassword: string) => {
    const hashedPassword = await hash(newPassword, 10);
    return User.update({ password: hashedPassword }, { where: { id: adminId, role: 'admin' } }); // Ensure role is 'admin'
  };
}
export default UserService;