import prisma from '../db';

export const findRefreshToken = async (refreshtoken: string) => {
  return await prisma.refreshToken.findFirst({
    where: { token: refreshtoken },
  });
};

export const storeRefreshTokeninDB = async (
  userId: number,
  refreshToken: string,
  expiresAt: Date
) => {
  return await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt,
    },
  });
};

export const updateRefreshTokeninDB = async (refreshToken: string) => {
  return await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true },
  });
};

export const getUserDatainDB = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      height: true,
      weight: true,
      age: true,
      mobileNumber: true,
      gender: true,
      _count: {
        select: {
          workouts: true,
        },
      },
    },
  });
  return user;
};
