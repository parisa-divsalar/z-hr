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

export const validateSpecialChar = (value: string) => value.search(/[!@#$%^&*_]/) < 0;

export const checkPasswordLength = (value: string) => value.length >= 8;

export const normalizeDateOfBirthInput = (value: string): string => {
    const raw = convertPersianNumbersToEnglish(String(value ?? ''));
    const digits = raw.replace(/\D/g, '').slice(0, 8); // DDMMYYYY

    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);

    if (digits.length <= 2) return dd;
    if (digits.length <= 4) return `${dd}/${mm}`;
    return `${dd}/${mm}/${yyyy}`;
};

export const isValidDateOfBirthDDMMYYYY = (value: string): boolean => {
    const v = convertPersianNumbersToEnglish(String(value ?? '')).trim();
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return false;

    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
    if (year < 1900) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date > today) return false;

    return true;
};
