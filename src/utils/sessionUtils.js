export const saveUserToSession = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUserFromSession = () => {
    const userString = sessionStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };
  
  export const removeUserFromSession = () => {
    sessionStorage.removeItem('user');
  };