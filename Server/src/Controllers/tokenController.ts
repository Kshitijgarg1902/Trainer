import jwt from 'jsonwebtoken';
import { validateRefreshToken, generateAccessToken } from '../Services/tokenService';
import { AppError } from '../types/error';

export const reissueAccessToken = async (refreshToken: string) => {
  const isvalid = await validateRefreshToken(refreshToken);

  if (!isvalid) {
    throw new AppError('Invalid refresh token', 401);
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };

  return generateAccessToken(decoded.userId.toString());
};
