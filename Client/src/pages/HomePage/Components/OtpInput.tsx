import React, { Fragment, useEffect, useRef, useState } from 'react';
import { LoginFormData } from './Login';
import { SignupFormData } from './Signup';
import { SubmitOTPService } from '../../../services/homePageService';
import LoadingOverlay from '../../../Components/LoadingOverlay';
import ModalPopup from '../../../Components/ModalPopUp';
import { useNavigate } from 'react-router';

type OtpInputProps = {
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
  userData: LoginFormData | SignupFormData;
};

const OtpInput: React.FC<OtpInputProps> = ({ onChange, userData }) => {
  const navigate = useNavigate();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const [isBusy, setIsBusy] = useState(false);
  const [errormsg, setErrormsg] = useState('Internal Server Error');
  const [isopen, setisOpen] = useState(false);

  const SubmitOTP = (
    otp: string[],
    userData: LoginFormData | SignupFormData,
  ) => {
    SubmitOTPService(
      otp.join(''),
      userData,
      setIsBusy,
      setErrormsg,
      setisOpen,
      navigate,
    );
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit.length === 1);

  return (
    <Fragment>
      {isBusy && <LoadingOverlay />}
      <div className="w-full max-w-sm mx-auto flex justify-center gap-4 mt-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm mx-auto mt-6 px-4">
        <button
          className={`w-full py-3 text-white text-lg font-medium rounded-lg transition duration-200 shadow-md ${
            isOtpComplete
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          type="submit"
          disabled={!isOtpComplete}
          onClick={() => SubmitOTP(otp, userData)}
        >
          Submit OTP
        </button>
      </div>
      <div className="w-full max-w-sm mx-auto mt-2 px-4 flex justify-end">
        <button
          onClick={() => {
            onChange(false);
          }}
          className="text-sm text-blue-500 hover:underline focus:outline-none"
        >
          Back to Login
        </button>
      </div>
      {isopen && (
        <ModalPopup title="Error" message={errormsg} onClose={setisOpen} />
      )}
    </Fragment>
  );
};

export default OtpInput;
