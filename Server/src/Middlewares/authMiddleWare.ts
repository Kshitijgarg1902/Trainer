import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface MyJwtPayload extends JwtPayload {
  userId: number;
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ status: false, message: 'Authorization header missing' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ status: false, message: 'Token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as MyJwtPayload;

    if (decoded && typeof decoded === 'object' && typeof decoded.userId === 'string') {
      req.user = {
        userId: Number(decoded.userId),
      };
      next();
    } else {
      res.status(401).json({ status: false, message: 'Invalid token payload: userId missing' });
      return;
    }
  } catch (err) {
    res.status(401).json({ status: false, message: 'Invalid or expired access token' });
    return;
  }
};

export default authenticate;
