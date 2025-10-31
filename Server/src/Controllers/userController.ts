import {
  checkmobileNumberExists,
  validateOTP,
  otpGenerator,
  addNewUser,
  changeOTPStatus,
  findUser,
} from '../Services/userService';
import {
  generateAccessToken,
  generateRefreshToken,
  getUserDataService,
  storerefreshToken,
  updateRefreshToken,
} from '../Services/tokenService';
import { AppError } from '../types/error';

export const userSignUp = async (
  mobileNumber: string,
  countryCode: string,
  username: string,
  gender: string,
  height: number,
  weight: number,
  age: number
): Promise<void> => {
  const existingUser = await checkmobileNumberExists(mobileNumber, countryCode);

  if (existingUser) throw new AppError('Mobile Number already registered', 409);

  await otpGenerator(mobileNumber, countryCode, username, gender, height, weight, age);
};

export const userLogin = async (mobileNumber: string, countryCode: string): Promise<void> => {
  const existingUser = await checkmobileNumberExists(mobileNumber, countryCode);

  if (!existingUser) throw new AppError('Mobile Number not registered', 409);

  await otpGenerator(mobileNumber, countryCode);
};

export const validatenewUser = async (
  mobileNumber: string,
  countryCode: string,
  otp: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const userDetails = await validateOTP(mobileNumber, countryCode, otp);
  const { username, gender, height, weight, age } = userDetails;

  const newuser = await addNewUser(
    username,
    mobileNumber,
    countryCode,
    gender,
    height,
    weight,
    age
  );

  await changeOTPStatus(mobileNumber, countryCode);

  const accessToken = generateAccessToken(newuser.id.toString());
  const refreshToken = generateRefreshToken(newuser.id.toString());

  await storerefreshToken(newuser.id, refreshToken);

  return { accessToken, refreshToken };
};

export const validateuser = async (
  mobileNumber: string,
  countryCode: string,
  otp: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  await validateOTP(mobileNumber, countryCode, otp);

  const user = await findUser(mobileNumber);

  await changeOTPStatus(mobileNumber, countryCode);

  const accessToken = generateAccessToken(user.id.toString());
  const refreshToken = generateRefreshToken(user.id.toString());

  await storerefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
};

export const userLogout = async (refreshToken: string): Promise<void> => {
  await updateRefreshToken(refreshToken);
};

export const getUserDataController = async (userId: number): Promise<any> => {
  return await getUserDataService(userId);
};
