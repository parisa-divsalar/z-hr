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

/** Shamsi (Jalali) year range we accept for date-of-birth */
const SHAMSI_YEAR_MIN = 1300;
const SHAMSI_YEAR_MAX = 1450;

/** Jalali leap year: (year % 33) in [1, 5, 9, 13, 17, 22, 26, 30] */
function isJalaliLeapYear(year: number): boolean {
    const r = year % 33;
    return r === 1 || r === 5 || r === 9 || r === 13 || r === 17 || r === 22 || r === 26 || r === 30;
}

function getJalaliDaysInMonth(year: number, month: number): number {
    if (month <= 0 || month > 12) return 0;
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isJalaliLeapYear(year) ? 30 : 29;
}

export function isValidShamsiDate(day: number, month: number, year: number): boolean {
    if (year < SHAMSI_YEAR_MIN || year > SHAMSI_YEAR_MAX) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;
    return day <= getJalaliDaysInMonth(year, month);
}

/** Check if a Shamsi date is in the past (before today in Jalali). */
function isShamsiDateInPast(day: number, month: number, year: number): boolean {
    const now = new Date();
    const gregorianYear = now.getFullYear();
    const gregorianMonth = now.getMonth() + 1;
    const gregorianDay = now.getDate();
    const j = gregorianToJalali(gregorianYear, gregorianMonth, gregorianDay);
    if (year > j.y) return false;
    if (year < j.y) return true;
    if (month > j.m) return false;
    if (month < j.m) return true;
    return day <= j.d;
}

/** Gregorian to Jalali (algorithm for validation). */
function gregorianToJalali(gy: number, gm: number, gd: number): { y: number; m: number; d: number } {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const gLeap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
    const jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    let gy2 = gm > 2 ? gy + 1 : gy;
    let days =
        365 * gy +
        Math.floor((gy2 + 3) / 4) -
        Math.floor((gy2 + 99) / 100) +
        Math.floor((gy2 + 399) / 400) -
        80 +
        gd +
        g_d_m[gm - 1] +
        (gm > 2 && gLeap ? 1 : 0) -
        1;
    const jy2 = Math.floor(days / 12053);
    days %= 12053;
    let jy3 = Math.floor(days / 1461);
    days %= 1461;
    let jy4 = Math.floor(days / 365);
    if (days === 365) {
        jy4 = 0;
        jy3 += 1;
    }
    const jy5 = jy + 33 * jy2 + 4 * jy3 + jy4;
    const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return { y: jy5, m: jm, d: jd };
}

export const normalizeDateOfBirthInput = (value: string): string => {
    const raw = convertPersianNumbersToEnglish(String(value ?? ''));
    const digits = raw.replace(/\D/g, '').slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;

    const first4 = Number(digits.slice(0, 4));
    const mid2 = Number(digits.slice(4, 6));
    const last2 = Number(digits.slice(6, 8));
    const isShamsiYearFirst =
        first4 >= SHAMSI_YEAR_MIN &&
        first4 <= SHAMSI_YEAR_MAX &&
        mid2 >= 1 &&
        mid2 <= 12 &&
        last2 >= 1 &&
        last2 <= 31;

    let dd: string, mm: string, yyyy: string;
    if (isShamsiYearFirst) {
        // User typed YYYY/MM/DD (e.g. 1370/08/13) → store as DD/MM/YYYY
        yyyy = digits.slice(0, 4);
        mm = digits.slice(4, 6);
        dd = digits.slice(6, 8);
    } else {
        // DD/MM/YYYY (Gregorian or already day-first)
        dd = digits.slice(0, 2);
        mm = digits.slice(2, 4);
        yyyy = digits.slice(4, 8);
    }

    return `${dd}/${mm}/${yyyy}`;
};

/** For display in UI: stored value is DD/MM/YYYY; in Persian locale show as YYYY/MM/DD (سال/ماه/روز). */
export const formatDateOfBirthForDisplay = (storedValue: string, locale: 'en' | 'fa'): string => {
    if (!storedValue || locale !== 'fa') return storedValue ?? '';
    const v = String(storedValue).trim();
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return v;
    const [, dd, mm, yyyy] = m;
    return `${yyyy}/${mm}/${dd}`;
};

export const isValidDateOfBirthDDMMYYYY = (value: string): boolean => {
    const v = convertPersianNumbersToEnglish(String(value ?? '')).trim();
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return false;

    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;

    if (year >= SHAMSI_YEAR_MIN && year <= SHAMSI_YEAR_MAX) {
        return isValidShamsiDate(day, month, year) && isShamsiDateInPast(day, month, year);
    }

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
