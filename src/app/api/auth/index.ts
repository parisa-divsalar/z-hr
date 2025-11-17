export const sendOtp = (msisdn: string) => {
  // axios.post('auth/otp/send', {
  //   phoneNumber: FormatMsisdn(msisdn),
  // });
  console.log({ msisdn });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, 3_000);
  });
};

export const verifyCode = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ accessToken: 'asf13', refreshToken: 'fa3' });
    }, 3_000);
  });
};
