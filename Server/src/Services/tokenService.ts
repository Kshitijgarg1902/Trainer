import jwt, { Secret } from 'jsonwebtoken';
import {
  findRefreshToken,
  getUserDatainDB,
  storeRefreshTokeninDB,
  updateRefreshTokeninDB,
} from '../Repositories/tokenRepository';

const accessSecret = process.env.ACCESS_TOKEN_SECRET as Secret;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET as Secret;

export const generateAccessToken = (userId: string): string => {
  const accessToken = jwt.sign({ userId: userId }, accessSecret, {
    expiresIn: '10m',
  });
  return accessToken;
};

export const generateRefreshToken = (userId: string): string => {
  const refreshToken = jwt.sign({ userId: userId }, refreshSecret, {
    expiresIn: '7d',
  });
  return refreshToken;
};

export const validateRefreshToken = async (refreshToken: string): Promise<boolean> => {
  const refreshTokeninDB = await findRefreshToken(refreshToken);

  if (!refreshTokeninDB || refreshTokeninDB.revoked || refreshTokeninDB.expiresAt < new Date()) {
    return false;
  }

  return true;
};

export const storerefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await storeRefreshTokeninDB(userId, refreshToken, expiresAt);
};

export const updateRefreshToken = async (refreshToken: string): Promise<void> => {
  await updateRefreshTokeninDB(refreshToken);
};

export const getUserDataService = async (userId: number): Promise<any> => {
  return await getUserDatainDB(userId);
};
