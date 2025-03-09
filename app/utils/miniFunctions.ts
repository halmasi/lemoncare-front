export const cleanPhone = (username: string) => {
  if (/^(\+98|98|0)?9\d{9}$/.test(username)) {
    return username.replace(/^(\+98|98|0)?/, '');
  }
  return username;
};
