import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../db';

export const checkmobileNumberExistsinDb = async (mobileNumber: string, countryCode: string) => {
  return await prisma.user.findFirst({
    where: {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
    },
  });
};

export const deleteOtps = async (mobileNumber: string, countryCode: string) => {
  await prisma.otpRequest.deleteMany({
    where: {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      used: false,
    },
  });
};

export const storeOtp = async (
  otp: string,
  mobileNumber: string,
  countryCode: string,
  username: string | undefined,
  gender: string | undefined,
  height: number | undefined,
  weight: number | undefined,
  age: number | undefined
) => {
  await prisma.otpRequest.create({
    data: {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      otp: otp,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
      used: false,
      username: username,
      gender: gender,
      height: height,
      weight: weight,
      age: age,
    },
  });
};

export const findOtp = async (mobileNumber: string, countryCode: string) => {
  return await prisma.otpRequest.findFirst({
    where: {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      used: false,
    },
  });
};

export const createuser = async (
  username: string,
  mobileNumber: string,
  countryCode: string,
  gender: string,
  height: number,
  weight: Decimal,
  age: number
) => {
  return await prisma.user.create({
    data: {
      username: username,
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      gender: gender,
      height: height,
      weight: weight,
      age: age,
    },
  });
};

export const changeOTPStatusDB = async (mobileNumber: string, countryCode: string) => {
  await prisma.otpRequest.updateMany({
    where: {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
      used: false,
    },
    data: {
      used: true,
    },
  });
};

export const findUserDB = async (mobileNumber: string) => {
  return await prisma.user.findUnique({
    where: {
      mobileNumber: mobileNumber,
    },
  });
};
