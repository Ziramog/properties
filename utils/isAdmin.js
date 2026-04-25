export const isAdmin = (sessionUser) => {
  return sessionUser?.role === 'admin';
};
