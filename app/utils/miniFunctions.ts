export const cleanPhone = (username: string) => {
  const cleaning = convertPersianAndArabicToEnglish(username);
  if (/^(\+98|98|0)?9\d{9}$/.test(cleaning)) {
    return cleaning.replace(/^(\+98|98|0)?/, '');
  }
  return convertPersianAndArabicToEnglish(cleaning);
};

export const isPhone = (username: string) => {
  if (/^(\+98|98|0)?9\d{9}$/.test(username)) {
    return true;
  }
  return false;
};
export const isEmail = (username: string) => {
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(username)) {
    return true;
  }
  return false;
};

export const convertPersianAndArabicToEnglish = (input: string): string => {
  const persianArabicDigits = [
    '۰',
    '۱',
    '۲',
    '۳',
    '۴',
    '۵',
    '۶',
    '۷',
    '۸',
    '۹',
    '٠',
    '١',
    '٢',
    '٣',
    '٤',
    '٥',
    '٦',
    '٧',
    '٨',
    '٩',
  ];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return input.replace(/[۰-۹٠-٩]/g, (char) => {
    const index = persianArabicDigits.indexOf(char);
    return englishDigits[index % 10];
  });
};

export const deleteKeysFromObject = (
  data: Record<string, any>, // eslint-disable-line no-use-before-define
  deleteKeys: string[]
) => {
  if (typeof data != 'object') return {};
  if (!data) return {};
  const res = data;
  for (const key in res) {
    if (deleteKeys.includes(key)) {
      delete res[key];
    } else {
      deleteKeysFromObject(res[key], deleteKeys);
    }
  }
  return res;
};

export function removeDuplicatesByKeys<T>(arr: T[], keys: (keyof T)[]): T[] {
  const seen = new Set<string>();
  return arr.filter((item) => {
    const compositeKey = keys.map((key) => String(item[key])).join('|');
    if (seen.has(compositeKey)) return false;
    seen.add(compositeKey);
    return true;
  });
}

export const logs = {
  error: async (log: string) => {
    console.trace();
    console.error(log);
  },
  log: async (log: string) => {
    console.trace();
    console.log(log);
  },
  warn: async (log: string) => {
    console.trace();
    console.warn(log);
  },
  info: async (log: string) => {
    console.trace();
    console.info(log);
  },
};
