import { Decimal } from '@prisma/client/runtime/library';
import {
  storeOtp,
  checkmobileNumberExistsinDb,
  deleteOtps,
  findOtp,
  createuser,
  changeOTPStatusDB,
  findUserDB,
} from '../Repositories/userRepository';
import { sendOtpviaSMS } from '../Util/otpService';
import { OtpRequest, User } from '@prisma/client';
import { AppError } from '../types/error';

export const checkmobileNumberExists = async (
  mobileNumber: string,
  countryCode: string
): Promise<boolean> => {
  const existingUser = await checkmobileNumberExistsinDb(mobileNumber, countryCode);
  if (existingUser) return true;

  return false;
};

export const otpGenerator = async (
  mobileNumber: string,
  countryCode: string,
  username?: string,
  gender?: string,
  height?: number,
  weight?: number,
  age?: number
): Promise<void> => {
  await deleteOtps(mobileNumber, countryCode);
  let otp = Math.floor(1000 + Math.random() * 9000).toString();
  if ((mobileNumber = '9999999999')) otp = '1111';
  console.log(`Generated OTP: ${otp} for ${mobileNumber}`);
  await storeOtp(otp, mobileNumber, countryCode, username, gender, height, weight, age);

  await sendOtpviaSMS(mobileNumber, otp);
};

export const validateOTP = async (
  mobileNumber: string,
  countryCode: string,
  otp: string
): Promise<OtpRequest> => {
  const otprequest = await findOtp(mobileNumber, countryCode);

  if (!otprequest || otp != otprequest.otp) throw new AppError('Invalid OTP', 401);

  if (Date.now() > new Date(otprequest.expires_at).getTime())
    throw new AppError('OTP has expired', 401);

  return otprequest;
};

export const addNewUser = async (
  username: string | null,
  mobileNumber: string | null,
  countryCode: string | null,
  gender: string | null,
  height: number | null,
  weight: Decimal | null,
  age: number | null
): Promise<User> => {
  if (!username || !mobileNumber || !countryCode || !gender || !height || !weight || !age) {
    throw new AppError('Missing required user details', 400);
  }

  return await createuser(username, mobileNumber, countryCode, gender, height, weight, age);
};

export const findUser = async (mobileNumber: string): Promise<User> => {
  const user = await findUserDB(mobileNumber);

  if (!user) throw new AppError('User not found', 400);

  return user;
};

export const changeOTPStatus = async (mobileNumber: string, countryCode: string): Promise<void> => {
  await changeOTPStatusDB(mobileNumber, countryCode);
};
