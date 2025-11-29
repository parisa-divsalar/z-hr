const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

export const convertPersianNumbersToEnglish = (str: string): string => {
  if (typeof str !== 'string') return str;
  let newStr = str;
  for (let i = 0; i < 10; i++) {
    newStr = newStr.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString());
  }
  return newStr;
};

export const emailValidation = (value: string) => {
  return value.match(
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
  );
};

export const isContainsLowercase = (value: string) => {
  const isContainsUppercase = /^(?=.*[A-Z]).*$/;
  return isContainsUppercase.test(value);
};

export const validateDigit = (value: string) => value.search(/[0-9]/) < 0;

export const validateSpecialChar = (value: string) => value.search(/[!@#\$%\^&\*_]/) < 0;

export const checkPasswordLength = (value: string) => value.length >= 8;
