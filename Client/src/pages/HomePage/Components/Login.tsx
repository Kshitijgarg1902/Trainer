import React, { useState } from 'react';
import logo from '../../../assets/Logo.png';
import MobileInput from './MobileInput';
import { useForm } from 'react-hook-form';
import OtpInput from './OtpInput';
import ModalPopup from '../../../Components/ModalPopUp';
import { getLoginOTPservice } from '../../../services/homePageService';
import LoadingOverlay from '../../../Components/LoadingOverlay';

type LoginProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export type LoginFormData = {
  countryCode: string;
  mobileNumber: string;
};

const Login: React.FC<LoginProps> = ({ setIsLogin }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ mode: 'onSubmit' });

  const onSubmit = (data: LoginFormData) => {
    setUserData(data);
    getLoginOTPservice(
      data.mobileNumber,
      data.countryCode,
      setIsBusy,
      setErrormsg,
      setisOtp,
      setisOpen,
    );
  };

  const [userData, setUserData] = useState<LoginFormData>();
  const [isBusy, setIsBusy] = useState(false);
  const [errormsg, setErrormsg] = useState('Internal Server Error');
  const [isopen, setisOpen] = useState(false);
  const [isOtp, setisOtp] = useState(false);

  return (
    <>
      {isBusy && <LoadingOverlay />}
      <section
        className="flex-1 bg-white z-10 px-6 py-10 
                     rounded-t-xl shadow-lg -mt-12 
                     md:mt-0 md:rounded-none flex flex-col"
      >
        <div className="flex justify-center mb-6">
          <img src={logo} className="h-20 w-20" alt="Logo" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Login</h2>
          <span
            className="text-sm text-blue-500 cursor-pointer hover:underline"
            onClick={() => setIsLogin(false)}
          >
            or signup
          </span>
        </div>
        {isOtp && userData ? (
          <OtpInput onChange={setisOtp} userData={userData} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-sm mx-auto">
              <MobileInput<LoginFormData>
                register={register}
                setValue={setValue}
                errors={errors}
              />
            </div>

            <div className="w-full max-w-sm mx-auto mt-4">
              <button
                className="w-full py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600 transition"
                type="submit"
              >
                Get OTP
              </button>
            </div>
          </form>
        )}

        <div className="z-10 relative h-20 w-20 "></div>
        {isopen && (
          <ModalPopup title="Error" message={errormsg} onClose={setisOpen} />
        )}
      </section>
    </>
  );
};

export default Login;
