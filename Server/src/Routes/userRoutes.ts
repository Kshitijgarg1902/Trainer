import { Router } from 'express';
import validate from '../Middlewares/validationMiddleWare';
import { createUserSchema, loginSchema, otpSchema } from '../Schemas/userSchema';
import {
  userLogin,
  userSignUp,
  userLogout,
  validatenewUser,
  validateuser,
  getUserDataController,
} from '../Controllers/userController';
import { catchAsync } from '../Util/catchAsync';
import authenticate from '../Middlewares/authMiddleWare';

const userRouter = Router();

userRouter.post(
  '/getOTP/signup',
  validate({ body: createUserSchema }),
  catchAsync(async (req, res) => {
    const { mobileNumber, countryCode, username, gender, height, weight, age } = req.body;

    await userSignUp(mobileNumber, countryCode, username, gender, height, weight, age);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  })
);

userRouter.post(
  '/signup',
  validate({ body: otpSchema }),
  catchAsync(async (req, res) => {
    const { mobileNumber, countryCode, otp } = req.body;

    const { accessToken, refreshToken } = await validatenewUser(mobileNumber, countryCode, otp);

    res.status(200);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: 'User added successfully',
        data: { accessToken: accessToken },
      });
  })
);

userRouter.post(
  '/getOTP/login',
  validate({ body: loginSchema }),
  catchAsync(async (req, res) => {
    const { mobileNumber, countryCode } = req.body;

    await userLogin(mobileNumber, countryCode);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  })
);

userRouter.post(
  '/login',
  validate({ body: otpSchema }),
  catchAsync(async (req, res) => {
    const { mobileNumber, countryCode, otp } = req.body;

    const { accessToken, refreshToken } = await validateuser(mobileNumber, countryCode, otp);

    res.status(200);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: 'User logged in successfully',
        data: { accessToken: accessToken },
      });
  })
);

userRouter.put(
  '/logout',
  catchAsync(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await userLogout(refreshToken);

    res
      .status(200)
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      .json({
        success: true,
        message: 'User logged out successfully',
      });
  })
);

userRouter.get(
  '/getUserData',
  authenticate,
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;
    const user = await getUserDataController(userId);
    res.status(200).json({ status: true, data: user, message: 'User Data fetched successfully' });
  })
);

export default userRouter;
