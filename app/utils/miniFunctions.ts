export const cleanPhone = (username: string) => {
  if (/^(\+98|98|0)?9\d{9}$/.test(username)) {
    return username.replace(/^(\+98|98|0)?/, '');
  }
  return username;
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
