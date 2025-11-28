export const verifyCode = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ accessToken: 'asf13', refreshToken: 'fa3' });
    }, 3_000);
  });
};
