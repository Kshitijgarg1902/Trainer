import axios from 'axios';

export const sendOtpviaSMS = async (mobileNumber: string, otp: string) => {
  // await axios.get('https://www.fast2sms.com/dev/bulkV2', {
  //   params: {
  //     authorization: process.env.FAST2SMS_API_KEY,
  //     variables_values: otp,
  //     route: 'otp',
  //     numbers: mobileNumber,
  //   },
  // });

  return;
};
