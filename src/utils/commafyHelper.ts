export const commafy = (num: number) => {
  if (num) {
    const str = num.toString().split('.');
    if (str[0].length >= 4) str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    return str.join('.');
  }
  return num;
};
