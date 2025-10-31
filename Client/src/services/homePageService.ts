import { useNavigate } from 'react-router-dom';
import { LoginFormData } from '../pages/HomePage/Components/Login';
import { SignupFormData } from '../pages/HomePage/Components/Signup';
import API from './axios';

export const getLoginOTPservice = async (
  mobileNumber: string,
  countryCode: string,
  setisBusy: React.Dispatch<React.SetStateAction<boolean>>,
  setErrormsg: React.Dispatch<React.SetStateAction<string>>,
  setisOtp: React.Dispatch<React.SetStateAction<boolean>>,
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setisBusy(true);

  try {
    await API.post('/user/getotp/login', {
      mobileNumber,
      countryCode,
    });
    setisBusy(false);
    setisOtp(true);
  } catch (error) {
    setisBusy(false);
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as any).status === 409
    ) {
      setErrormsg('Mobile number not registered');
    } else {
      setErrormsg(
        'An error occurred while sending OTP. Please try again later.',
      );
    }
    setisOpen(true);
  }
};

export const getotpSignupService = async (
  username: string,
  age: number,
  height: number,
  weight: number,
  mobileNumber: string,
  countryCode: string,
  gender: string,
  setisBusy: React.Dispatch<React.SetStateAction<boolean>>,
  setErrormsg: React.Dispatch<React.SetStateAction<string>>,
  setisOtp: React.Dispatch<React.SetStateAction<boolean>>,
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setisBusy(true);

  try {
    await API.post('/user/getOTP/signup', {
      username,
      age,
      height,
      weight,
      mobileNumber,
      countryCode,
      gender,
    });
    setisBusy(false);
    setisOtp(true);
  } catch (error) {
    setisBusy(false);
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as any).status === 409
    ) {
      setErrormsg('Mobile number already registered');
    } else {
      setErrormsg(
        'An error occurred while sending OTP. Please try again later.',
      );
    }
    setisOpen(true);
  }
};

const isLoginFormData = (data: any): data is LoginFormData => {
  return (
    'mobileNumber' in data && 'countryCode' in data && !('username' in data)
  );
};

export const SubmitOTPService = async (
  otp: string,
  userData: LoginFormData | SignupFormData,
  setisBusy: React.Dispatch<React.SetStateAction<boolean>>,
  setErrormsg: React.Dispatch<React.SetStateAction<string>>,
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: ReturnType<typeof useNavigate>,
) => {
  try {
    setisBusy(true);
    let result;
    if (isLoginFormData(userData)) {
      result = await API.post('/user/login', {
        otp,
        mobileNumber: (userData as LoginFormData).mobileNumber,
        countryCode: (userData as LoginFormData).countryCode,
      });
    } else {
      result = await API.post('/user/signup', {
        otp,
        username: (userData as SignupFormData).username,
        age: (userData as SignupFormData).age,
        height: (userData as SignupFormData).height,
        weight: (userData as SignupFormData).weight,
        mobileNumber: (userData as SignupFormData).mobileNumber,
        countryCode: (userData as SignupFormData).countryCode,
        gender: (userData as SignupFormData).gender,
      });
    }
    setisBusy(false);
    if (result.data.data.accessToken) {
      localStorage.setItem('accessToken', result.data.data.accessToken);
      navigate('/profile');
    } else
      setErrormsg(
        'An error occurred while submitting OTP. Please try again later.',
      );
    setisOpen(true);
  } catch (error) {
    setisBusy(false);
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 401
    ) {
      setErrormsg(
        error.response &&
          typeof (error.response as any).data.message === 'string'
          ? (error.response as any).data.message
          : 'Unauthorized access.',
      );
    } else {
      setErrormsg(
        'An error occurred while submitting OTP. Please try again later.',
      );
    }
    setisOpen(true);
  }
};

export const logoutUser = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    await API.put('/user/logout', null, {
      withCredentials: true, // ensure cookies (like refreshToken) are sent
    });

    localStorage.removeItem('accessToken');
    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};
