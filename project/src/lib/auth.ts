export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  console.log('Setting auth token:', token ? 'Token received' : 'No token');
  localStorage.setItem('auth_token', token);
  // Trigger a storage event to notify other parts of the app
  window.dispatchEvent(new Event('storage'));
};

export const removeAuthToken = (): void => {
  console.log('Removing auth token');
  localStorage.removeItem('auth_token');
  // Trigger a storage event to notify other parts of the app
  window.dispatchEvent(new Event('storage'));
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Split the token and decode the payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isValid = payload.exp > Date.now() / 1000;
    console.log('Token validation:', { isValid, exp: payload.exp, now: Date.now() / 1000 });
    return isValid;
  } catch {
    console.log('Token validation failed - invalid format');
    return false;
  }
};