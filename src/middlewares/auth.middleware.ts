import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: { id: number; role?: string; firstName?: string }; 
        }
    }
}

function Authorization(secret_key: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const bearerToken = req.header('Authorization');
            if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    code: HttpStatus.UNAUTHORIZED,
                    message: 'Authorization token is required',
                });
                return;
            }

            const token = bearerToken.split(' ')[1];

            jwt.verify(token, secret_key, (err, decoded: any) => {
                if (err) {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        code: HttpStatus.UNAUTHORIZED,
                        message: 'Invalid or expired token',
                    });
                    return;
                }

                req.user = { id: decoded.id, role: decoded.role, firstName: decoded.firstName };
                next();
            });
        } catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                code: HttpStatus.UNAUTHORIZED,
                message: 'Unauthorized',
            });
        }
    };
}

export const userAuth = Authorization(process.env.JWT_SECRET_KEY_USER!);
export const ResetAuth_User = Authorization(process.env.RESET_SECRET_KEY_USER!);
export const adminAuth = Authorization(process.env.JWT_SECRET_KEY_ADMIN!);
export const ResetAuth_Admin = Authorization(process.env.RESET_SECRET_KEY_ADMIN!);
