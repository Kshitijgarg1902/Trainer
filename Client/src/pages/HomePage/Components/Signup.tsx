import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../../assets/Logo.png';
import MobileInput from './MobileInput';
import LoadingOverlay from '../../../Components/LoadingOverlay';
import ModalPopup from '../../../Components/ModalPopUp';
import { getotpSignupService } from '../../../services/homePageService';
import OtpInput from './OtpInput';

type SignupProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SignupFormData = {
  username: string;
  age: number;
  height: number;
  weight: number;
  countryCode: string;
  mobileNumber: string;
  gender: string;
};

const Signup: React.FC<SignupProps> = ({ setIsLogin }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ mode: 'onSubmit' });

  const [userData, setUserData] = useState<SignupFormData>();
  const [isBusy, setIsBusy] = useState(false);
  const [errormsg, setErrormsg] = useState('Internal Server Error');
  const [isopen, setisOpen] = useState(false);
  const [isOtp, setisOtp] = useState(false);

  const onSubmit = (data: SignupFormData) => {
    const finalData = {
      ...data,
      age: Number(data.age),
      height: Number(data.height),
      weight: Number(data.weight),
    };

    setUserData(finalData);

    getotpSignupService(
      finalData.username,
      finalData.age,
      finalData.height,
      finalData.weight,
      finalData.mobileNumber,
      finalData.countryCode,
      finalData.gender,
      setIsBusy,
      setErrormsg,
      setisOtp,
      setisOpen,
    );
  };

  return (
    <>
      {isBusy && <LoadingOverlay />}
      <section className="flex-1 flex flex-col bg-white z-10 px-6 pb-12 rounded-t-xl shadow-lg -mt-12 md:mt-0 md:rounded-none md:justify-center">
        <div className="flex justify-center mt-2">
          <img src={logo} className="h-20 w-20" alt="Logo" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Signup</h2>
          <span
            className="text-sm text-blue-500 cursor-pointer hover:underline"
            onClick={() => setIsLogin(true)}
          >
            or login
          </span>
        </div>

        {isOtp && userData ? (
          <OtpInput onChange={setisOtp} userData={userData} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div className="w-full max-w-sm mx-auto mt-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username
              </label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
                    message: 'No spaces or special characters allowed',
                  },
                })}
                id="username"
                type="text"
                placeholder="Username"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 no-spinner"
              />
              <div className="h-5">
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="w-full max-w-sm mx-auto mt-2">
              <MobileInput<SignupFormData>
                register={register}
                setValue={setValue}
                errors={errors}
              />
            </div>

            {/* Age and Gender */}
            <div className="flex w-full max-w-sm mx-auto mt-2 gap-2">
              <div className="flex-1">
                <label htmlFor="age" className="block text-sm font-medium mb-1">
                  Age
                </label>
                <input
                  {...register('age', {
                    required: 'Age is required',
                    min: { value: 1, message: 'Enter a valid age' },
                    valueAsNumber: true,
                  })}
                  id="age"
                  type="number"
                  placeholder="Age"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="h-5">
                  {errors.age && (
                    <p className="text-red-500 text-sm">{errors.age.message}</p>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium mb-1"
                >
                  Gender
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  id="gender"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
                <div className="h-5">
                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Height and Weight */}
            <div className="flex w-full max-w-sm mx-auto mt-2 gap-2">
              <div className="flex-1">
                <label
                  htmlFor="height"
                  className="block text-sm font-medium mb-1"
                >
                  Height (cm)
                </label>
                <input
                  {...register('height', {
                    required: 'Height is required',
                    valueAsNumber: true,
                  })}
                  id="height"
                  type="number"
                  placeholder="Height"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="h-5">
                  {errors.height && (
                    <p className="text-red-500 text-sm">
                      {errors.height.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium mb-1"
                >
                  Weight (kg)
                </label>
                <input
                  {...register('weight', {
                    required: 'Weight is required',
                    valueAsNumber: true,
                  })}
                  id="weight"
                  type="number"
                  placeholder="Weight"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="h-5">
                  {errors.weight && (
                    <p className="text-red-500 text-sm">
                      {errors.weight.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex w-full max-w-sm mx-auto mt-1">
              <button
                type="submit"
                className="mt-4 w-full py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600 transition"
              >
                Get OTP
              </button>
            </div>
          </form>
        )}
      </section>

      {isopen && (
        <ModalPopup title="Error" message={errormsg} onClose={setisOpen} />
      )}
    </>
  );
};

export default Signup;
