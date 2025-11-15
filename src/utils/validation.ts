export const toEnglishNumber = (str: string) => {
  const persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
  const englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return str
    .split('')
    .map((c) => englishNumbers[persianNumbers.indexOf(c)] || c)
    .join('');
};
