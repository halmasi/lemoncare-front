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
