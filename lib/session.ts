

export function setSession(token: string) {
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
}

export function removeSession() {
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
}

export function getSessionToken(): string | null {
  if (typeof window !== 'undefined') {
    // Get token from cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  return null;
}

export function getUserFromToken(): any {
  const token = getSessionToken();
  if (!token) return null;
  
  try {
    // Decode JWT token without verification (for client-side use)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function isLoggedIn(): boolean {
  const user = getUserFromToken();
  return user !== null;
} 